/**
 * dexter_agent_jobs persistence layer for the chunked agent loop.
 *
 * Lifecycle of one job row:
 *   createJob()      → status='running', chunkIndex=0
 *   --- chunk 0 runs ---
 *   persistChunk()   → status='awaiting_continuation', state snapshot saved
 *   claimForResume() → status='running' again, chunkIndex incremented
 *   --- chunk 1 runs ---
 *   (repeat or)
 *   markDone()       → status='done', messages cleared (small footprint)
 *
 * `claimForResume` uses `SELECT … FOR UPDATE SKIP LOCKED` so a
 * double-clicking client can't run two resume calls against the same
 * job. The second call returns `null` (job is locked or no longer in
 * `awaiting_continuation`) and the route returns a 409.
 *
 * Web-only — depends on Drizzle + Postgres. CLI invocations don't need
 * job persistence (they run to completion in one process).
 */

import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { agentJobs } from '@dexter/core/db/schema/agent-jobs';
import {
  serializeMessages,
  deserializeMessages,
} from '@dexter/core/agent/serialization';
import type { BaseMessage } from '@langchain/core/messages';

export interface CreateJobInput {
  userId: string;
  sessionId: string | null;
  query: string;
  model?: string | null;
}

export interface CreateJobResult {
  jobId: string;
  originalStartTime: number;
}

export interface ChunkSnapshot {
  messages: BaseMessage[];
  iteration: number;
  requiredNudges: number;
  lastApiInputTokens: number;
  touchedFiles: string[];
}

export interface ResumeJobState {
  jobId: string;
  userId: string;
  query: string;
  model: string | null;
  chunkIndex: number;
  totalIterations: number;
  requiredNudges: number;
  lastApiInputTokens: number;
  messages: BaseMessage[];
  touchedFiles: string[];
  originalStartTime: number;
}

/**
 * Create a fresh job row before chunk 0 starts. Returns the jobId and
 * the row's createdAt as `originalStartTime` — the agent loop uses
 * this to anchor totalTime across subsequent chunks.
 */
export async function createJob(input: CreateJobInput): Promise<CreateJobResult> {
  const db = getDb();
  const [row] = await db
    .insert(agentJobs)
    .values({
      userId: input.userId,
      sessionId: input.sessionId,
      query: input.query,
      model: input.model ?? null,
      status: 'running',
    })
    .returning({ id: agentJobs.id, createdAt: agentJobs.createdAt });
  return {
    jobId: row.id,
    originalStartTime: row.createdAt.getTime(),
  };
}

/**
 * Persist the snapshot from `Agent.consumeContinuationSnapshot()` plus
 * the current office-run touched files. Flips status to
 * `awaiting_continuation` so the client's auto-resume call can pick it
 * up. Does NOT advance chunkIndex — that's bumped by claimForResume()
 * when the next chunk actually starts.
 */
export async function persistChunk(
  jobId: string,
  snapshot: ChunkSnapshot,
): Promise<void> {
  const db = getDb();
  await db
    .update(agentJobs)
    .set({
      status: 'awaiting_continuation',
      messages: serializeMessages(snapshot.messages) as object,
      touchedFiles: snapshot.touchedFiles,
      totalIterations: snapshot.iteration,
      requiredNudges: snapshot.requiredNudges,
      lastApiInputTokens: snapshot.lastApiInputTokens,
      updatedAt: new Date(),
      // Refresh TTL so an actively-progressing job doesn't get reaped
      // by the cleanup cron mid-flight.
      expiresAt: sql`now() + interval '24 hours'`,
    })
    .where(eq(agentJobs.id, jobId));
}

/**
 * Atomically claim a job for resume:
 *   SELECT … WHERE id=? AND status='awaiting_continuation' FOR UPDATE SKIP LOCKED
 *   UPDATE … SET status='running', chunkIndex = chunkIndex + 1
 *
 * Returns the rehydrated state on success, or `null` if the job is
 * locked (another resume is in flight), no longer awaiting, or doesn't
 * exist. Callers should map `null` to a 409 Conflict.
 */
export async function claimForResume(
  jobId: string,
  userId: string,
): Promise<ResumeJobState | null> {
  const db = getDb();
  // The two-step (SELECT then UPDATE) is wrapped in a transaction so
  // the row stays locked between the read and the status flip.
  return db.transaction(async (tx) => {
    // Drizzle's `.for('update', { skipLocked: true })` produces the
    // `SELECT … FOR UPDATE SKIP LOCKED` clause we need — gives us
    // typed camelCase rows without raw SQL, and the lock skip means a
    // concurrent resume call returns an empty array instead of waiting.
    const rows = await tx
      .select()
      .from(agentJobs)
      .where(
        and(
          eq(agentJobs.id, jobId),
          eq(agentJobs.userId, userId),
          eq(agentJobs.status, 'awaiting_continuation'),
        ),
      )
      .for('update', { skipLocked: true })
      .limit(1);
    const row = rows[0];
    if (!row) return null;

    const newChunkIndex = row.chunkIndex + 1;
    await tx
      .update(agentJobs)
      .set({
        status: 'running',
        chunkIndex: newChunkIndex,
        updatedAt: new Date(),
      })
      .where(eq(agentJobs.id, jobId));

    return {
      jobId: row.id,
      userId: row.userId,
      query: row.query,
      model: row.model,
      chunkIndex: newChunkIndex,
      totalIterations: row.totalIterations,
      requiredNudges: row.requiredNudges,
      lastApiInputTokens: row.lastApiInputTokens,
      messages: row.messages ? deserializeMessages(row.messages) : [],
      touchedFiles: row.touchedFiles ?? [],
      originalStartTime: row.createdAt.getTime(),
    };
  });
}

/**
 * Final successful exit: store the answer, clear messages (no longer
 * needed and they're the biggest column), mark status=done.
 */
export async function markDone(jobId: string, finalAnswer: string): Promise<void> {
  const db = getDb();
  await db
    .update(agentJobs)
    .set({
      status: 'done',
      finalAnswer,
      messages: null,
      updatedAt: new Date(),
    })
    .where(eq(agentJobs.id, jobId));
}

/**
 * Terminal failure that the agent couldn't recover from. Keeps the
 * messages around for debugging; cleanup cron eventually reaps the
 * row.
 */
export async function markError(jobId: string, errorMessage: string): Promise<void> {
  const db = getDb();
  await db
    .update(agentJobs)
    .set({
      status: 'error',
      finalAnswer: errorMessage,
      updatedAt: new Date(),
    })
    .where(eq(agentJobs.id, jobId));
}
