/**
 * Web session resolver.
 *
 * Two modes:
 *   - cloud (DATABASE_URL set) → PostgresWebSessionStore is the source of
 *     truth. Each request hydrates a fresh InMemoryChatHistory from the
 *     stored turns; flush() persists the latest turn back.
 *   - local (no DATABASE_URL)  → keeps one InMemoryChatHistory per session
 *     in a module-scope Map (Phase 2 behaviour, no cross-process sharing).
 *
 * The route handler doesn't know which mode is active — both branches
 * return the same `ResolvedSession` shape.
 */

import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { InMemoryChatHistory } from '@dexter/core/utils/in-memory-chat-history';
import { PostgresWebSessionStore } from '@dexter/core/adapters/storage/postgres/web-session-store';
import type { WebSessionStore } from '@dexter/core/ports/web-session';

const SESSION_COOKIE = 'dexter_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const localCache = new Map<string, InMemoryChatHistory>();

let cloudStore: WebSessionStore | null = null;
function getCloudStore(): WebSessionStore | null {
  if (!process.env.DATABASE_URL) return null;
  if (!cloudStore) cloudStore = new PostgresWebSessionStore();
  return cloudStore;
}

export interface ResolvedSession {
  sessionId: string;
  history: InMemoryChatHistory;
  isNew: boolean;
  /** Persist the latest turn that the agent just completed. No-op in local mode. */
  flush(): Promise<void>;
}

export interface ResolveSessionOptions {
  model?: string;
  /** Authenticated user id. Cloud mode binds the session row to this user. */
  userId?: string;
}

export async function resolveSession(
  options: ResolveSessionOptions = {},
): Promise<ResolvedSession> {
  const jar = await cookies();
  const cookieValue = jar.get(SESSION_COOKIE)?.value;
  const store = getCloudStore();

  if (store) return resolveCloud({ jar, cookieValue, store, ...options });
  return resolveLocal({ jar, cookieValue, model: options.model });
}

// --- cloud ---

async function resolveCloud({
  jar,
  cookieValue,
  store,
  model,
  userId,
}: {
  jar: Awaited<ReturnType<typeof cookies>>;
  cookieValue: string | undefined;
  store: WebSessionStore;
  model?: string;
  userId?: string;
}): Promise<ResolvedSession> {
  let sessionId = cookieValue;
  let isNew = false;
  let record = sessionId ? await store.get(sessionId) : null;

  // Cross-user cookie hardening: if the cookie points at a session that
  // doesn't belong to the current user (e.g. they logged out and a different
  // user signed in on the same browser), mint a fresh session instead of
  // hijacking the previous user's history.
  if (record && userId && record.userId && record.userId !== userId) {
    record = null;
    sessionId = undefined;
  }

  if (!record) {
    record = await store.create({ sessionId, model, userId });
    sessionId = record.sessionId;
    isNew = true;
  } else if (model && record.model !== model) {
    await store.updateMeta(sessionId!, { model });
  }

  if (!cookieValue || cookieValue !== sessionId) {
    jar.set({
      name: SESSION_COOKIE,
      value: sessionId!,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    });
  }

  const history = new InMemoryChatHistory(model);
  history.restoreTurns(
    record.turns.map((t) => ({
      query: t.query,
      answer: t.answer,
      summary: t.summary,
    })),
  );

  // Snapshot how many turns were already persisted so flush() knows which
  // ones are new this request.
  const persistedCount = record.turns.length;

  return {
    sessionId: sessionId!,
    history,
    isNew,
    async flush(): Promise<void> {
      const messages = history.getMessages();
      for (let i = persistedCount; i < messages.length; i++) {
        const msg = messages[i];
        await store.appendTurn(sessionId!, {
          query: msg.query,
          answer: msg.answer,
          summary: msg.summary,
        });
      }
    },
  };
}

// --- local ---

function resolveLocal({
  jar,
  cookieValue,
  model,
}: {
  jar: Awaited<ReturnType<typeof cookies>>;
  cookieValue: string | undefined;
  model?: string;
}): ResolvedSession {
  if (cookieValue && localCache.has(cookieValue)) {
    const history = localCache.get(cookieValue)!;
    if (model) history.setModel(model);
    return { sessionId: cookieValue, history, isNew: false, flush: async () => {} };
  }

  const sessionId = cookieValue ?? randomUUID();
  const history = new InMemoryChatHistory(model);
  localCache.set(sessionId, history);

  if (!cookieValue) {
    jar.set({
      name: SESSION_COOKIE,
      value: sessionId,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    });
  }

  return { sessionId, history, isNew: !cookieValue, flush: async () => {} };
}

/** Drop a session (used by a /chat reset button later). */
export async function dropSession(sessionId: string): Promise<boolean> {
  const store = getCloudStore();
  if (store) return store.delete(sessionId);
  return localCache.delete(sessionId);
}
