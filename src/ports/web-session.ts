/**
 * WebSessionStore — durable storage for Web chat sessions and their
 * turn-by-turn history. Replaces the module-scope `Map` that apps/web
 * used in Phase 2 so multi-turn context survives function-instance
 * rotation on Vercel.
 *
 * Adapters:
 *   - adapters/storage/postgres/web-session-store  (Phase 3 cloud)
 *   - adapters/storage/memory/web-session-store    (Phase 2 / tests)
 */

import type { StoredDeliverable } from '../agent/types.js';

export interface WebChatTurn {
  /** Stable per-session turn index, monotonically increasing from 0. */
  turnIndex: number;
  query: string;
  /** Null until the assistant has produced a final answer. */
  answer: string | null;
  /** LLM-generated brief summary used for context compression. */
  summary: string | null;
  tokenCount?: number | null;
  /**
   * Files the agent produced this turn (R2 keys + metadata). Null/absent
   * for turns that produced no files and for turns persisted before this
   * column existed. Read surfaces re-sign each key into a fresh download
   * URL via runtime/r2.ts#presignDownloadForKey.
   */
  deliverables?: StoredDeliverable[] | null;
  createdAt: number;
  updatedAt?: number;
}

export interface WebSessionRecord {
  sessionId: string;
  orgId: string | null;
  userId: string | null;
  model: string | null;
  createdAt: number;
  updatedAt: number;
  turns: WebChatTurn[];
}

export interface WebSessionCreateOptions {
  orgId?: string;
  userId?: string;
  model?: string;
  /** If provided, reuses this id (otherwise a fresh uuid is generated). */
  sessionId?: string;
}

export interface WebSessionStore {
  /** Read a session and its turns. Returns null if not found. */
  get(sessionId: string): Promise<WebSessionRecord | null>;

  /** Create a brand new session. */
  create(options?: WebSessionCreateOptions): Promise<WebSessionRecord>;

  /** Append a brand-new turn (answer/summary may be null). Returns the row's turnIndex. */
  appendTurn(
    sessionId: string,
    turn: Omit<WebChatTurn, 'turnIndex' | 'createdAt' | 'updatedAt'>,
  ): Promise<number>;

  /** Patch the assistant answer + summary for an existing turn. */
  completeTurn(
    sessionId: string,
    turnIndex: number,
    patch: { answer?: string | null; summary?: string | null; tokenCount?: number | null },
  ): Promise<void>;

  /** Update session metadata (e.g. model swap). */
  updateMeta(
    sessionId: string,
    patch: { model?: string | null },
  ): Promise<void>;

  /** Remove a session and all its turns. */
  delete(sessionId: string): Promise<boolean>;
}
