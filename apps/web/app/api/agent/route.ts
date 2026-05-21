import { NextResponse, type NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';

import { AgentRunnerController } from '@dexter/core/controllers/agent-runner';
import { composeWebPorts } from '@dexter/core/entrypoints/web/compose';
import { SseEventSink } from '@dexter/core/adapters/eventsink/sse';
import { withUser } from '@dexter/core/runtime/user-context';

import { resolveSession } from '../../../lib/session';
import { getCurrentUser } from '../../../lib/auth/session';
import {
  createJob,
  persistChunk,
  markDone,
  markError,
} from '../../../lib/agent-job-store';

/**
 * /api/agent — POST { query: string } → SSE stream of AgentEvent.
 *
 * Runs the real Dexter agent core. In local dev it composes against local
 * adapters (SQLite vector index + filesystem). Phase 3 will introduce a
 * cloud composition (Postgres + Vercel Blob) selected by env vars inside
 * composeWebPorts(); the route handler stays unchanged.
 *
 * Node.js runtime is required — the agent uses native modules (sqlite,
 * playwright via local adapters) that don't run on Edge.
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

interface AgentRequest {
  query?: string;
  model?: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  const requestId = randomUUID();
  const startedAt = Date.now();

  let body: AgentRequest;
  try {
    body = (await request.json()) as AgentRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return NextResponse.json({ error: 'Missing query.' }, { status: 400 });
  }

  // Auth gate — the proxy already rejects unauthenticated requests for
  // this route, but we re-validate the real session here before any
  // user-scoped read or write.
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const session = await resolveSession({ model: body.model, userId: user.id });

  console.log(
    JSON.stringify({
      level: 'info',
      surface: 'web',
      route: '/api/agent',
      requestId,
      userId: user.id,
      sessionId: session.sessionId,
      isNew: session.isNew,
      queryLength: query.length,
      msg: 'agent_run_start',
    }),
  );

  const sink = new SseEventSink();

  // Per-request CorePorts bundle. userId flows to the MemoryLake adapter so
  // memories accumulate against the real authenticated user (not a session
  // cookie). orgId is reserved for Phase 5 multi-tenant B2B.
  const ports = await composeWebPorts({
    requestId,
    userId: user.id,
    events: sink,
  });

  // Construct the controller. AgentConfig stays small here; Phase 3 lets
  // tenants pick their own model via UI.
  const controller = new AgentRunnerController(
    { model: body.model, memoryEnabled: true },
    session.history,
    undefined,
    ports,
  );

  // Create a chunked-agent job row before the first chunk runs. The
  // job tracks per-chunk state across the 300 s function boundary —
  // when the agent hits the time budget, it yields
  // `continuation_required` and the route persists state here so a
  // follow-up POST to /api/agent/resume can pick up where we left off.
  // We always create a job (even for short runs that complete in one
  // chunk) so the resume route's job-id lookup never has to
  // distinguish "no job" from "job not found".
  const job = await createJob({
    userId: user.id,
    sessionId: session.sessionId,
    query,
    model: body.model ?? null,
  });

  // Emit the jobId as the very first SSE event so the client can stash
  // it before any other state. If the run never hits the time budget,
  // the client just never uses it.
  sink.emit({
    type: 'job_registered',
    jobId: job.jobId,
  } as never);

  // Kick off the agent run asynchronously. The sink is what streams events
  // out to the client; runQuery() flushes the sink in its own `finally`.
  // The withUser scope makes user.id readable from tools (e.g. the office
  // R2 uploader) without threading it through every tool call site.
  void withUser(
    { userId: user.id, email: user.email ?? undefined },
    () =>
      controller.runQuery(query, {
        jobId: job.jobId,
        chunkIndex: 0,
        onContinuation: async (snapshot) => {
          try {
            await persistChunk(job.jobId, snapshot);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(
              JSON.stringify({
                level: 'error',
                surface: 'web',
                route: '/api/agent',
                requestId,
                jobId: job.jobId,
                msg: 'persist_chunk_failed',
                error: message,
              }),
            );
          }
        },
        onDone: async (answer) => {
          try {
            await markDone(job.jobId, answer);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(
              JSON.stringify({
                level: 'error',
                surface: 'web',
                route: '/api/agent',
                requestId,
                jobId: job.jobId,
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
          route: '/api/agent',
          requestId,
          sessionId: session.sessionId,
          jobId: job.jobId,
          msg: 'agent_run_error',
          error: message,
        }),
      );
      await markError(job.jobId, message).catch(() => {});
    })
    .finally(async () => {
      // Persist the new turn(s) into durable storage. No-op in local mode.
      try {
        await session.flush();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(
          JSON.stringify({
            level: 'error',
            surface: 'web',
            route: '/api/agent',
            requestId,
            sessionId: session.sessionId,
            msg: 'session_flush_error',
            error: message,
          }),
        );
      }
      const durationMs = Date.now() - startedAt;
      console.log(
        JSON.stringify({
          level: 'info',
          surface: 'web',
          route: '/api/agent',
          requestId,
          sessionId: session.sessionId,
          durationMs,
          msg: 'agent_run_end',
        }),
      );
      // Ensure the SSE stream is closed even if the controller's finally
      // already flushed. close() is idempotent.
      void sink.close();
    });

  // If the client disconnects mid-stream, cancel the agent run.
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
