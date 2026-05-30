/**
 * Postgres WebSessionStore — Drizzle-backed implementation. All rows live
 * under the `dexter_` prefix (dexter_web_sessions, dexter_web_messages).
 */

import { and, asc, eq, sql } from 'drizzle-orm';
import type { DexterDb } from '../../../db/client.js';
import { getDb } from '../../../db/client.js';
import { webMessages, webSessions } from '../../../db/schema/web-sessions.js';
import type {
  WebSessionStore,
  WebSessionRecord,
  WebChatTurn,
  WebSessionCreateOptions,
} from '../../../ports/web-session.js';

export interface PostgresWebSessionStoreOptions {
  /** Override the Drizzle handle (used by tests). */
  db?: DexterDb;
}

export class PostgresWebSessionStore implements WebSessionStore {
  private readonly db: DexterDb;

  constructor(options: PostgresWebSessionStoreOptions = {}) {
    this.db = options.db ?? getDb();
  }

  async get(sessionId: string): Promise<WebSessionRecord | null> {
    const [session] = await this.db
      .select()
      .from(webSessions)
      .where(eq(webSessions.id, sessionId))
      .limit(1);
    if (!session) return null;

    const rows = await this.db
      .select()
      .from(webMessages)
      .where(eq(webMessages.sessionId, sessionId))
      .orderBy(asc(webMessages.turnIndex));

    const turns: WebChatTurn[] = rows.map((r) => ({
      turnIndex: r.turnIndex,
      query: r.query,
      answer: r.answer ?? null,
      summary: r.summary ?? null,
      tokenCount: r.tokenCount ?? null,
      deliverables: r.deliverables ?? null,
      createdAt: r.createdAt.getTime(),
      updatedAt: r.updatedAt.getTime(),
    }));

    return toRecord(session, turns);
  }

  async create(options: WebSessionCreateOptions = {}): Promise<WebSessionRecord> {
    if (!options.userId) {
      throw new Error('WebSessionStore.create requires userId — every web session belongs to a user.');
    }
    const [row] = await this.db
      .insert(webSessions)
      .values({
        ...(options.sessionId ? { id: options.sessionId } : {}),
        userId: options.userId,
        model: options.model ?? null,
      })
      .returning();
    return toRecord(row, []);
  }

  async appendTurn(
    sessionId: string,
    turn: Omit<WebChatTurn, 'turnIndex' | 'createdAt' | 'updatedAt'>,
  ): Promise<number> {
    // Compute the next turnIndex atomically inside the insert to avoid races
    // when two requests for the same session arrive concurrently (unlikely
    // with our cookie-driven flow but defended for correctness).
    const nextIndexSubquery = sql<number>`(
      SELECT COALESCE(MAX(${webMessages.turnIndex}), -1) + 1
      FROM ${webMessages}
      WHERE ${webMessages.sessionId} = ${sessionId}
    )`;

    const [row] = await this.db
      .insert(webMessages)
      .values({
        sessionId,
        turnIndex: nextIndexSubquery,
        query: turn.query,
        answer: turn.answer ?? null,
        summary: turn.summary ?? null,
        tokenCount: turn.tokenCount ?? null,
        deliverables: turn.deliverables ?? null,
      })
      .returning({ turnIndex: webMessages.turnIndex });

    await this.touch(sessionId);
    return row.turnIndex;
  }

  async completeTurn(
    sessionId: string,
    turnIndex: number,
    patch: { answer?: string | null; summary?: string | null; tokenCount?: number | null },
  ): Promise<void> {
    await this.db
      .update(webMessages)
      .set({
        ...(patch.answer !== undefined ? { answer: patch.answer } : {}),
        ...(patch.summary !== undefined ? { summary: patch.summary } : {}),
        ...(patch.tokenCount !== undefined ? { tokenCount: patch.tokenCount } : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(webMessages.sessionId, sessionId), eq(webMessages.turnIndex, turnIndex)));
    await this.touch(sessionId);
  }

  async updateMeta(sessionId: string, patch: { model?: string | null }): Promise<void> {
    await this.db
      .update(webSessions)
      .set({
        ...(patch.model !== undefined ? { model: patch.model } : {}),
        updatedAt: new Date(),
      })
      .where(eq(webSessions.id, sessionId));
  }

  async delete(sessionId: string): Promise<boolean> {
    const result = await this.db
      .delete(webSessions)
      .where(eq(webSessions.id, sessionId))
      .returning({ id: webSessions.id });
    return result.length > 0;
  }

  private async touch(sessionId: string): Promise<void> {
    await this.db
      .update(webSessions)
      .set({ updatedAt: new Date() })
      .where(eq(webSessions.id, sessionId));
  }
}

function toRecord(row: typeof webSessions.$inferSelect, turns: WebChatTurn[]): WebSessionRecord {
  return {
    sessionId: row.id,
    orgId: null,
    userId: row.userId,
    model: row.model ?? null,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
    turns,
  };
}
