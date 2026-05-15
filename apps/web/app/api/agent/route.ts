import { NextResponse, type NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';

import { AgentRunnerController } from '@dexter/core/controllers/agent-runner';
import { composeWebPorts } from '@dexter/core/entrypoints/web/compose';
import { SseEventSink } from '@dexter/core/adapters/eventsink/sse';

import { resolveSession } from '../../../lib/session';

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

  const session = await resolveSession(body.model);

  console.log(
    JSON.stringify({
      level: 'info',
      surface: 'web',
      route: '/api/agent',
      requestId,
      sessionId: session.sessionId,
      isNew: session.isNew,
      queryLength: query.length,
      msg: 'agent_run_start',
    }),
  );

  const sink = new SseEventSink();

  // Build the CorePorts bundle for this request, with the SSE sink wired in.
  //
  // userId is intentionally NOT the browser session id — that would shard
  // the MemoryLake user_id namespace per-cookie and prevent the agent's
  // memory from accumulating across a real user's sessions/devices.
  //
  // Phase 4 wiring (Clerk Core 3, async API):
  //     import { auth } from '@clerk/nextjs/server';
  //     const { userId, orgId } = await auth();
  //     const ports = await composeWebPorts({ requestId, events: sink, userId, orgId });
  //
  // Until auth lands, composeWebPorts falls back to the anonymous default
  // user so a single developer testing the app sees one consistent memory pool.
  const ports = await composeWebPorts({
    requestId,
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
