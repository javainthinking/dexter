import { NextResponse, type NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';

import { AgentRunnerController } from '@dexter/core/controllers/agent-runner';
import { composeWebPorts } from '@dexter/core/entrypoints/web/compose';
import { SseEventSink } from '@dexter/core/adapters/eventsink/sse';
import { withUser } from '@dexter/core/runtime/user-context';

import { resolveSession } from '../../../../lib/session';
import { getCurrentUser } from '../../../../lib/auth/session';
import {
  claimForResume,
  persistChunk,
  markDone,
  markError,
} from '../../../../lib/agent-job-store';

/**
 * /api/agent/resume — POST { jobId } → SSE stream of AgentEvent.
 *
 * Continues a previously-interrupted agent run. The browser calls this
 * automatically on receiving a `continuation_required` event from
 * /api/agent (or this endpoint itself — a long run can chunk multiple
 * times).
 *
 * Atomicity: `claimForResume` uses `SELECT … FOR UPDATE SKIP LOCKED`
 * to prevent a double-click from spawning two parallel resumes
 * against the same job. The second call returns 409.
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

interface ResumeRequest {
  jobId?: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  const requestId = randomUUID();
  const startedAt = Date.now();

  let body: ResumeRequest;
  try {
    body = (await request.json()) as ResumeRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const jobId = body.jobId?.trim();
  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId.' }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  // Atomically claim the job — flips status to 'running', advances
  // chunkIndex, returns the rehydrated state. Null = the row doesn't
  // exist, doesn't belong to this user, or another request already
  // claimed it.
  let resumeState;
  try {
    resumeState = await claimForResume(jobId, user.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      JSON.stringify({
        level: 'error',
        surface: 'web',
        route: '/api/agent/resume',
        requestId,
        jobId,
        msg: 'claim_failed',
        error: message,
      }),
    );
    return NextResponse.json({ error: 'claim_failed' }, { status: 500 });
  }

  if (!resumeState) {
    return NextResponse.json(
      { error: 'job_unavailable', detail: 'Job is locked, completed, or not yours.' },
      { status: 409 },
    );
  }

  const session = await resolveSession({ model: resumeState.model ?? undefined, userId: user.id });

  console.log(
    JSON.stringify({
      level: 'info',
      surface: 'web',
      route: '/api/agent/resume',
      requestId,
      userId: user.id,
      jobId,
      chunkIndex: resumeState.chunkIndex,
      totalIterations: resumeState.totalIterations,
      msg: 'agent_resume_start',
    }),
  );

  const sink = new SseEventSink();

  const ports = await composeWebPorts({
    requestId,
    userId: user.id,
    events: sink,
  });

  const controller = new AgentRunnerController(
    { model: resumeState.model ?? undefined, memoryEnabled: true },
    session.history,
    undefined,
    ports,
  );

  // Surface the jobId again on resume so the client can confirm it's
  // streaming the right job (defensive — the client already sent it).
  sink.emit({ type: 'job_registered', jobId } as never);

  // Whether the agent reached a terminal `done` this hop. A chunked run
  // can span several resume invocations; only the one that completes the
  // task persists the turn (query + final answer + deliverables). Earlier
  // hops yield another `continuation_required` and persist nothing.
  let turnCompleted = false;

  void withUser(
    { userId: user.id, email: user.email ?? undefined },
    () =>
      controller.runQuery(resumeState!.query, {
        jobId,
        chunkIndex: resumeState!.chunkIndex,
        resume: {
          messages: resumeState!.messages,
          totalIterations: resumeState!.totalIterations,
          requiredNudges: resumeState!.requiredNudges,
          lastApiInputTokens: resumeState!.lastApiInputTokens,
          originalStartTime: resumeState!.originalStartTime,
          touchedFiles: resumeState!.touchedFiles,
        },
        onContinuation: async (snapshot) => {
          try {
            await persistChunk(jobId, snapshot);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(
              JSON.stringify({
                level: 'error',
                surface: 'web',
                route: '/api/agent/resume',
                requestId,
                jobId,
                msg: 'persist_chunk_failed',
                error: message,
              }),
            );
          }
        },
        onDone: async (answer) => {
          turnCompleted = true;
          try {
            await markDone(jobId, answer);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(
              JSON.stringify({
                level: 'error',
                surface: 'web',
                route: '/api/agent/resume',
                requestId,
                jobId,
                msg: 'mark_done_failed',
                error: message,
              }),
            );
          }
        },
      }),
  )
    .catch(async (err) => {
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        JSON.stringify({
          level: 'error',
          surface: 'web',
          route: '/api/agent/resume',
          requestId,
          jobId,
          msg: 'agent_resume_error',
          error: message,
        }),
      );
      await markError(jobId, message).catch(() => {});
    })
    .finally(async () => {
      // Persist the turn IFF this hop completed it. The original
      // /api/agent invocation returned at `continuation_required` without
      // flushing, so for a chunked run the turn (query + final answer +
      // deliverables) is only ever durably written here. No partial row
      // exists upstream, so this appends exactly one complete turn.
      if (turnCompleted) {
        try {
          await session.flush();
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error(
            JSON.stringify({
              level: 'error',
              surface: 'web',
              route: '/api/agent/resume',
              requestId,
              jobId,
              sessionId: session.sessionId,
              msg: 'session_flush_error',
              error: message,
            }),
          );
        }
      }
      const durationMs = Date.now() - startedAt;
      console.log(
        JSON.stringify({
          level: 'info',
          surface: 'web',
          route: '/api/agent/resume',
          requestId,
          jobId,
          durationMs,
          msg: 'agent_resume_end',
        }),
      );
      void sink.close();
    });

  request.signal.addEventListener('abort', () => {
    controller.cancelExecution();
  });

  return new Response(sink.readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
