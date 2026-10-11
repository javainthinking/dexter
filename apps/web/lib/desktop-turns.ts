import 'server-only';
import { and, desc, eq, gt, isNull, sql } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { desktopTurns } from '@dexter/core/db/schema/desktop-turns';
import { incrementUsage } from './billing';

/**
 * Desktop turn lifecycle (see src/db/schema/desktop-turns.ts). The desktop
 * runs its agent locally, but every LLM call goes through our gateway, so a
 * turn is admitted, bound and metered here — the client can't skip it.
 */

/** How long an admitted turn may keep making LLM calls. */
export const DESKTOP_TURN_TTL_MS = 30 * 60 * 1000;

const openSince = () => new Date(Date.now() - DESKTOP_TURN_TTL_MS);

/**
 * Admit a turn (the caller has already passed the quota gate). A follow-up
 * turn in a known OpenCode session closes that session's earlier turns and
 * is bound up front; a new conversation's turn binds on its first LLM call.
 */
export async function startDesktopTurn(userId: string, agentSessionId?: string): Promise<string> {
  const db = getDb();
  if (agentSessionId) {
    await db
      .update(desktopTurns)
      .set({ completedAt: new Date() })
      .where(
        and(
          eq(desktopTurns.userId, userId),
          eq(desktopTurns.agentSessionId, agentSessionId),
          isNull(desktopTurns.completedAt),
        ),
      );
  }
  const [row] = await db
    .insert(desktopTurns)
    .values({ userId, agentSessionId: agentSessionId ?? null })
    .returning({ id: desktopTurns.id });
  return row.id;
}

export async function completeDesktopTurn(userId: string, turnId: string): Promise<void> {
  await getDb()
    .update(desktopTurns)
    .set({ completedAt: new Date() })
    .where(and(eq(desktopTurns.id, turnId), eq(desktopTurns.userId, userId), isNull(desktopTurns.completedAt)));
}

/**
 * The open turn an LLM call from this OpenCode session belongs to: the
 * session's own open turn, else the user's oldest open unbound turn (claimed
 * for this session). Null when the user has no admitted turn to run in.
 */
export async function claimDesktopTurn(userId: string, agentSessionId: string): Promise<string | null> {
  const db = getDb();
  const since = openSince();
  const [bound] = await db
    .select({ id: desktopTurns.id })
    .from(desktopTurns)
    .where(
      and(
        eq(desktopTurns.userId, userId),
        eq(desktopTurns.agentSessionId, agentSessionId),
        isNull(desktopTurns.completedAt),
        gt(desktopTurns.createdAt, since),
      ),
    )
    .orderBy(desc(desktopTurns.createdAt))
    .limit(1);
  if (bound) return bound.id;

  const [claimed] = await db.execute<{ id: string }>(sql`
    UPDATE ${desktopTurns} SET agent_session_id = ${agentSessionId}
    WHERE id = (
      SELECT id FROM ${desktopTurns}
      WHERE user_id = ${userId} AND agent_session_id IS NULL
        AND completed_at IS NULL AND created_at > ${since.toISOString()}::timestamptz
      ORDER BY created_at
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING id
  `);
  return claimed?.id ?? null;
}

/**
 * Count the turn as one conversation, once: called after an LLM call in it
 * succeeds, so a turn that never reached the model isn't charged.
 */
export async function meterDesktopTurn(userId: string, turnId: string): Promise<void> {
  const first = await getDb()
    .update(desktopTurns)
    .set({ meteredAt: new Date() })
    .where(and(eq(desktopTurns.id, turnId), isNull(desktopTurns.meteredAt)))
    .returning({ id: desktopTurns.id });
  if (first.length) await incrementUsage(userId, 'conversations', 1);
}
