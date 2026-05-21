import { NextResponse, type NextRequest } from 'next/server';
import { lt, or, and, eq, sql } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { agentJobs } from '@dexter/core/db/schema/agent-jobs';

/**
 * Daily cleanup of dexter_agent_jobs.
 *
 * Deletes:
 *   1. ANY row past its `expires_at` (default 24 h after creation;
 *      refreshed on every successful chunk persistence). Catches
 *      abandoned jobs whose client closed the tab mid-flight.
 *   2. Rows with status='done' or status='error' older than 24 h.
 *      The final answer is already mirrored into dexter_web_messages,
 *      so the row's only remaining value is post-mortem diagnostics.
 *
 * Scheduled by vercel.json's `crons` field at 05:00 UTC daily.
 * Vercel attaches `Authorization: Bearer ${CRON_SECRET}` to scheduled
 * invocations when the env var is set. We require it in production
 * environments and skip the gate on local dev so curl works
 * unauthenticated for testing.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const startedAt = Date.now();
  const db = getDb();
  try {
    // One DELETE that catches both reap conditions in a single query.
    // The (status, expires_at) composite index from migration 0004
    // serves the second predicate cheaply.
    const deleted = await db
      .delete(agentJobs)
      .where(
        or(
          lt(agentJobs.expiresAt, sql`now()`),
          and(
            or(eq(agentJobs.status, 'done'), eq(agentJobs.status, 'error')),
            lt(agentJobs.updatedAt, sql`now() - interval '24 hours'`),
          ),
        ),
      )
      .returning({ id: agentJobs.id });

    const durationMs = Date.now() - startedAt;
    console.log(
      JSON.stringify({
        level: 'info',
        surface: 'web',
        route: '/api/cron/cleanup-agent-jobs',
        deletedCount: deleted.length,
        durationMs,
        msg: 'cleanup_done',
      }),
    );
    return NextResponse.json({ deletedCount: deleted.length, durationMs });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      JSON.stringify({
        level: 'error',
        surface: 'web',
        route: '/api/cron/cleanup-agent-jobs',
        msg: 'cleanup_failed',
        error: message,
      }),
    );
    return NextResponse.json({ error: 'cleanup_failed', detail: message }, { status: 500 });
  }
}
