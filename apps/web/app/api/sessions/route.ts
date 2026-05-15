import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { desc, eq, sql, isNull } from 'drizzle-orm';
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

    // Pull last 50 sessions plus the first user query as a preview title.
    const rows = await db
      .select({
        id: webSessions.id,
        updatedAt: webSessions.updatedAt,
        firstQuery: sql<string | null>`(
          SELECT ${webMessages.query}
          FROM ${webMessages}
          WHERE ${webMessages.sessionId} = ${webSessions.id}
          ORDER BY ${webMessages.turnIndex} ASC
          LIMIT 1
        )`,
        turnCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM ${webMessages}
          WHERE ${webMessages.sessionId} = ${webSessions.id}
        )`,
      })
      .from(webSessions)
      .where(isNull(webSessions.userId))
      .orderBy(desc(webSessions.updatedAt))
      .limit(50);

    summaries = rows.map((row) => {
      const raw = (row.firstQuery ?? '').trim();
      const title = raw.length > 0 ? clip(raw, 60) : 'New conversation';
      return {
        sessionId: row.id,
        title,
        preview: clip(raw, 120),
        turnCount: row.turnCount,
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
