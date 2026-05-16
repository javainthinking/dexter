import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { desc, eq, inArray, sql } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { webSessions, webMessages } from '@dexter/core/db/schema/web-sessions';
import { getCurrentUser } from '../../../lib/auth/session';

/**
 * GET /api/sessions — list recent chat sessions for the current user.
 *
 * Sessions are scoped to the authenticated user via dexter_web_sessions.user_id.
 * Anonymous (user_id IS NULL) sessions from before auth landed are not
 * surfaced — they exist only as orphan history.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SessionSummary {
  sessionId: string;
  title: string;
  preview: string;
  turnCount: number;
  updatedAt: number;
  isCurrent: boolean;
}

export async function GET(_request: NextRequest): Promise<Response> {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ sessions: [] });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  let summaries: SessionSummary[] = [];
  try {
    const db = getDb();
    const jar = await cookies();
    const currentId = jar.get('dexter_session')?.value;

    // 1) Pull last 50 sessions belonging to this user.
    const sessionRows = await db
      .select({ id: webSessions.id, updatedAt: webSessions.updatedAt })
      .from(webSessions)
      .where(eq(webSessions.userId, user.id))
      .orderBy(desc(webSessions.updatedAt))
      .limit(50);

    const sessionIds = sessionRows.map((r) => r.id);

    // 2) For those sessions, pull turn counts and the first-turn query in
    //    one query each. (Two queries is simpler and faster than a
    //    correlated subquery; drizzle's `sql` template does not always
    //    qualify outer columns inside subqueries.)
    const statsRows = sessionIds.length
      ? await db
          .select({
            sessionId: webMessages.sessionId,
            turnCount: sql<number>`COUNT(*)::int`.as('turn_count'),
          })
          .from(webMessages)
          .where(inArray(webMessages.sessionId, sessionIds))
          .groupBy(webMessages.sessionId)
      : [];

    const firstTurnRows = sessionIds.length
      ? await db
          .select({
            sessionId: webMessages.sessionId,
            query: webMessages.query,
          })
          .from(webMessages)
          .where(
            sql`${webMessages.sessionId} IN (${sql.join(
              sessionIds.map((id) => sql`${id}`),
              sql`, `,
            )}) AND ${webMessages.turnIndex} = 0`,
          )
      : [];

    const statsBySession = new Map(statsRows.map((s) => [s.sessionId, s.turnCount]));
    const firstQueryBySession = new Map(firstTurnRows.map((f) => [f.sessionId, f.query]));

    summaries = sessionRows.map((row) => {
      const raw = (firstQueryBySession.get(row.id) ?? '').trim();
      const title = raw.length > 0 ? clip(raw, 60) : 'New conversation';
      return {
        sessionId: row.id,
        title,
        preview: clip(raw, 120),
        turnCount: statsBySession.get(row.id) ?? 0,
        updatedAt: row.updatedAt.getTime(),
        isCurrent: row.id === currentId,
      };
    });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/sessions',
        msg: 'list_failed',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ sessions: [], error: 'list_failed' }, { status: 500 });
  }

  return NextResponse.json({ sessions: summaries });
}

/**
 * POST /api/sessions — create a fresh empty session and switch the cookie.
 * Used by the "New conversation" button.
 */
export async function POST(_request: NextRequest): Promise<Response> {
  if (!process.env.DATABASE_URL) {
    const jar = await cookies();
    jar.delete('dexter_session');
    return NextResponse.json({ sessionId: null, mode: 'local' });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const db = getDb();
  const [row] = await db
    .insert(webSessions)
    .values({ userId: user.id })
    .returning();
  const jar = await cookies();
  jar.set({
    name: 'dexter_session',
    value: row.id,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return NextResponse.json({
    sessionId: row.id,
    mode: 'cloud',
  });
}

/**
 * DELETE /api/sessions?id=... — drop a session.
 */
export async function DELETE(request: NextRequest): Promise<Response> {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ deleted: false, mode: 'local' });
  }
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  const db = getDb();
  // Scope the delete to the current user so one user can't drop another's history.
  const result = await db
    .delete(webSessions)
    .where(sql`${webSessions.id} = ${id} AND ${webSessions.userId} = ${user.id}`)
    .returning({ id: webSessions.id });
  return NextResponse.json({ deleted: result.length > 0 });
}

function clip(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + '…';
}
