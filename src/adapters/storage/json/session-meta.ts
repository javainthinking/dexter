/**
 * JSON-file SessionMetaStore adapter.
 *
 * Delegates to the legacy src/gateway/sessions/store.ts helpers. The Web
 * adapter will replace this with a Postgres-backed implementation per-org.
 */

import type { SessionMetaStore, SessionEntry } from '../../../ports/session-meta.js';
import {
  loadSessionStore,
  saveSessionStore,
  resolveSessionStorePath,
  upsertSessionMeta as upsertSessionMetaImpl,
} from '../../../gateway/sessions/store.js';

export interface JsonSessionMetaStoreOptions {
  /** Path to the agent-scoped sessions.json. Defaults to legacy resolver. */
  storePath?: string;
  agentId?: string;
}

export class JsonSessionMetaStore implements SessionMetaStore {
  private readonly storePath: string;

  constructor(options: JsonSessionMetaStoreOptions) {
    if (options.storePath) {
      this.storePath = options.storePath;
    } else if (options.agentId) {
      this.storePath = resolveSessionStorePath(options.agentId);
    } else {
      throw new Error('JsonSessionMetaStore requires either storePath or agentId.');
    }
  }

  async get(sessionKey: string): Promise<SessionEntry | null> {
    const store = loadSessionStore(this.storePath);
    return store[sessionKey] ?? null;
  }

  async list(): Promise<SessionEntry[]> {
    const store = loadSessionStore(this.storePath);
    return Object.values(store);
  }

  async upsert(
    entry: Omit<SessionEntry, 'createdAt' | 'updatedAt'> & {
      channel: string;
      to: string;
      accountId: string;
      agentId: string;
    },
  ): Promise<SessionEntry> {
    return upsertSessionMetaImpl({
      storePath: this.storePath,
      sessionKey: entry.sessionKey,
      channel: entry.channel,
      to: entry.to,
      accountId: entry.accountId,
      agentId: entry.agentId,
    });
  }

  async delete(sessionKey: string): Promise<boolean> {
    const store = loadSessionStore(this.storePath);
    if (!(sessionKey in store)) return false;
    delete store[sessionKey];
    saveSessionStore(this.storePath, store);
    return true;
  }
}
