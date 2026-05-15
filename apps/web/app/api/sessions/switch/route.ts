import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { webSessions } from '@dexter/core/db/schema/web-sessions';

/**
 * POST /api/sessions/switch — set the session cookie to an existing session id.
 * Used by the sidebar when the user clicks a past conversation.
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

    if (process.env.DATABASE_URL) {
      const db = getDb();
      const [row] = await db
        .select({ id: webSessions.id })
        .from(webSessions)
        .where(eq(webSessions.id, sessionId))
        .limit(1);
      if (!row) {
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
        msg: 'session_switched',
      }),
    );
    return NextResponse.json({ sessionId });
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
