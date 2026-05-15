import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { PostgresWebSessionStore } from '@dexter/core/adapters/storage/postgres/web-session-store';

/**
 * POST /api/sessions/switch — set the session cookie to an existing session id
 * and return that session's full record (including turns) so the client can
 * hydrate the conversation thread immediately without a follow-up round trip.
 *
 * Body: { sessionId: string }
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<Response> {
  const requestId = crypto.randomUUID();
  let sessionId: string | undefined;
  try {
    const body = (await request.json().catch(() => ({}))) as { sessionId?: string };
    sessionId = body.sessionId?.trim();
    if (!sessionId) {
      return NextResponse.json({ error: 'missing sessionId' }, { status: 400 });
    }

    let session = null;
    if (process.env.DATABASE_URL) {
      const store = new PostgresWebSessionStore();
      session = await store.get(sessionId);
      if (!session) {
        return NextResponse.json({ error: 'not found' }, { status: 404 });
      }
    }

    const jar = await cookies();
    jar.set({
      name: 'dexter_session',
      value: sessionId,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    console.log(
      JSON.stringify({
        level: 'info',
        route: '/api/sessions/switch',
        requestId,
        sessionId,
        turnCount: session?.turns.length ?? 0,
        msg: 'session_switched',
      }),
    );
    return NextResponse.json({ sessionId, session });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/sessions/switch',
        requestId,
        sessionId,
        msg: 'switch_failed',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ error: 'switch_failed' }, { status: 500 });
  }
}
