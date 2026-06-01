/**
 * dexter_agent_jobs — per-chunk durable state for the chunked agent loop.
 *
 * One row per agent invocation. Each row's lifecycle:
 *   created (status='running') → POST /api/agent serves chunk 1
 *   chunk hits time budget → status='awaiting_continuation', state persisted
 *   client POSTs /api/agent/resume → SELECT … FOR UPDATE SKIP LOCKED locks the
 *   row, status flips back to 'running', chunk 2 serves
 *   ... repeats ...
 *   agent emits final 'done' → status='done', messages cleared (small footprint)
 *   abandoned jobs hit expiresAt and get deleted by the daily cleanup cron
 *
 * `messages` carries the full LangChain BaseMessage[] serialized to jsonb.
 * Tool results are already capped per-message by enforceResultBudget so the
 * blob has a known upper bound (~500 KB worst case). On resume we rehydrate
 * via Serializable.fromJSON; round-tripping Anthropic reasoning blocks
 * exactly is essential, otherwise the next LLM call rejects them.
 *
 * `touched_files` mirrors the OfficeRunState.touchedFiles set across chunks.
 * On the final chunk, drainOfficeRun() uploads them all in one batch.
 */

import { pgTable, uuid, text, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './auth.js';
import { webSessions } from './web-sessions.js';

export const agentJobs = pgTable(
  'dexter_agent_jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id').references(() => webSessions.id, {
      onDelete: 'cascade',
    }),
    /** Original user query — pinned at job creation so resume calls don't depend on the URL. */
    query: text('query').notNull(),
    /** Model identifier the run was started with. Pinned so chunk N+1 uses the same model as chunk N. */
    model: text('model'),
    /**
     * Job lifecycle.
     *   'running'                 → a function is actively serving this job's current chunk
     *   'awaiting_continuation'   → chunk yielded on the time-budget gate, client must resume
     *   'done'                    → final answer emitted; messages cleared
     *   'error'                   → unrecoverable failure; client should not retry
     */
    status: text('status').notNull().default('running'),
    /** 0-indexed chunk number. Incremented before each resume. */
    chunkIndex: integer('chunk_index').notNull().default(0),
    /** Cumulative iterations across all chunks. Hard cap (e.g., 60) prevents runaway. */
    totalIterations: integer('total_iterations').notNull().default(0),
    /** Last RunContext.requiredNudges value. Persisted so F6 enforcement survives chunk boundaries. */
    requiredNudges: integer('required_nudges').notNull().default(0),
    /** Last API input-token count, used by manageContextThreshold to anchor estimates. */
    lastApiInputTokens: integer('last_api_input_tokens').notNull().default(0),
    /** Serialized BaseMessage[] — the agent's working conversation. Null after status='done'. */
    messages: jsonb('messages'),
    /** Absolute file paths the office tool touched across chunks. Drained on final completion. */
    touchedFiles: text('touched_files').array().notNull().default(sql`'{}'::text[]`),
    /**
     * Office files carried across chunk boundaries as [{path, key}] — the R2
     * key holds the bytes. On resume (a fresh container with an empty /tmp on
     * Vercel) these are downloaded back to their paths so editing + the final
     * drain still work. Null/[] when nothing was carried.
     */
    carriedFiles: jsonb('carried_files'),
    /** Final answer when status='done'. Useful for telemetry without re-fetching from web_messages. */
    finalAnswer: text('final_answer'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    /**
     * Hard TTL. Jobs older than this are reaped by the cleanup cron
     * regardless of status. Default 24h after creation, refreshed on
     * status transitions while alive.
     */
    expiresAt: timestamp('expires_at', { withTimezone: true })
      .notNull()
      .default(sql`now() + interval '24 hours'`),
  },
  (t) => ({
    statusExpiryIdx: index('dexter_agent_jobs_status_expiry').on(t.status, t.expiresAt),
    userStatusIdx: index('dexter_agent_jobs_user_status').on(t.userId, t.status),
  }),
);

export type AgentJobRow = typeof agentJobs.$inferSelect;
export type AgentJobInsert = typeof agentJobs.$inferInsert;
