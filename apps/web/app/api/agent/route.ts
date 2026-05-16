import { NextResponse, type NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';

import { AgentRunnerController } from '@dexter/core/controllers/agent-runner';
import { composeWebPorts } from '@dexter/core/entrypoints/web/compose';
import { SseEventSink } from '@dexter/core/adapters/eventsink/sse';

import { resolveSession } from '../../../lib/session';
import { getCurrentUser } from '../../../lib/auth/session';

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

  // Kick off the agent run asynchronously. The sink is what streams events
  // out to the client; runQuery() flushes the sink in its own `finally`.
  void controller
    .runQuery(query)
    .catch((err) => {
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        JSON.stringify({
          level: 'error',
          surface: 'web',
          route: '/api/agent',
          requestId,
          sessionId: session.sessionId,
          msg: 'agent_run_error',
          error: message,
        }),
      );
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
