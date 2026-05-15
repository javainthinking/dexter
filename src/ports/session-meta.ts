/**
 * SessionMetaStore — metadata for inbound conversational sessions
 * (which channel / account / agent owns a given sessionKey, last activity).
 *
 * Backs the gateway routing layer. CLI uses an in-memory implementation;
 * WhatsApp Worker uses json-file; Web SaaS uses Postgres.
 */

export interface SessionEntry {
  sessionKey: string;
  createdAt: number;
  updatedAt: number;
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastAgentId?: string;
}

export interface SessionMetaStore {
  get(sessionKey: string): Promise<SessionEntry | null>;
  list(): Promise<SessionEntry[]>;
  upsert(entry: Omit<SessionEntry, 'createdAt' | 'updatedAt'> & {
    channel: string;
    to: string;
    accountId: string;
    agentId: string;
  }): Promise<SessionEntry>;
  delete(sessionKey: string): Promise<boolean>;
}
