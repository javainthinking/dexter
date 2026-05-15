import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { PostgresWebSessionStore } from '@dexter/core/adapters/storage/postgres/web-session-store';

/**
 * GET /api/sessions/current — return the full session record (including
 * turns) for the session id in the `dexter_session` cookie.
 *
 * Used by the chat page to hydrate the conversation thread on mount and
 * after refresh. In local mode (no DATABASE_URL) returns null since the
 * in-memory ChatHistory is not exposed across requests anyway.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_request: NextRequest): Promise<Response> {
  const requestId = crypto.randomUUID();
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ session: null, mode: 'local' });
    }
    const jar = await cookies();
    const sessionId = jar.get('dexter_session')?.value;
    if (!sessionId) {
      return NextResponse.json({ session: null });
    }
    const store = new PostgresWebSessionStore();
    const session = await store.get(sessionId);
    return NextResponse.json({ session });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/sessions/current',
        requestId,
        msg: 'fetch_current_failed',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ session: null, error: 'fetch_failed' }, { status: 500 });
  }
}
