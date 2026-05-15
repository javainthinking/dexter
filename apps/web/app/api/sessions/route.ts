import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { webSessions, webMessages } from '@dexter/core/db/schema/web-sessions';

/**
 * GET /api/sessions — list recent chat sessions for the current user.
 *
 * Phase 3 single-user: all sessions with user_id IS NULL are pooled
 * together. Phase 4 will filter by the authenticated Clerk user_id.
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

  let summaries: SessionSummary[] = [];
  try {
    const db = getDb();
    const jar = await cookies();
    const currentId = jar.get('dexter_session')?.value;

    // 1) Pull last 50 sessions.
    const sessionRows = await db
      .select({ id: webSessions.id, updatedAt: webSessions.updatedAt })
      .from(webSessions)
      .where(isNull(webSessions.userId))
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
    // Local mode: just clear the cookie; the next /api/agent call will
    // mint a fresh in-memory ChatHistory.
    const jar = await cookies();
    jar.delete('dexter_session');
    return NextResponse.json({ sessionId: null, mode: 'local' });
  }

  const db = getDb();
  const [row] = await db.insert(webSessions).values({}).returning();
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
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  const db = getDb();
  const result = await db
    .delete(webSessions)
    .where(eq(webSessions.id, id))
    .returning({ id: webSessions.id });
  return NextResponse.json({ deleted: result.length > 0 });
}

function clip(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + '…';
}
