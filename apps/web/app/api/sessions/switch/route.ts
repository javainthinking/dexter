import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { PostgresWebSessionStore } from '@dexter/core/adapters/storage/postgres/web-session-store';
import { getCurrentUser } from '../../../../lib/auth/session';
import { hydrateSessionDeliverables } from '../../../../lib/session-deliverables';

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
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
      }
      const store = new PostgresWebSessionStore();
      session = await store.get(sessionId);
      if (!session) {
        return NextResponse.json({ error: 'not found' }, { status: 404 });
      }
      // Cross-user guard: never let user A switch to user B's conversation.
      if (session.userId && session.userId !== user.id) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
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

    // Re-sign each turn's persisted deliverable keys into fresh download
    // URLs so reopened conversations show working download chips.
    const hydrated = await hydrateSessionDeliverables(session);

    console.log(
      JSON.stringify({
        level: 'info',
        route: '/api/sessions/switch',
        requestId,
        sessionId,
        turnCount: hydrated?.turns.length ?? 0,
        msg: 'session_switched',
      }),
    );
    return NextResponse.json({ sessionId, session: hydrated });
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
