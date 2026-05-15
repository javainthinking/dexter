/**
 * Memory — the agent-facing memory port.
 *
 * Wraps both the markdown file CRUD (long-term + daily memory) and the
 * hybrid vector / keyword search index. The agent runner and memory tools
 * only see this port — they don't know whether storage is local SQLite +
 * filesystem (CLI / Worker) or Postgres + pgvector + Blob (Web SaaS).
 *
 * Adapters:
 *   - adapters/memory/local    (composes adapters/blob/local-fs + SQLite vector db)
 *   - adapters/memory/postgres (Neon Postgres + pgvector; markdown stored in a table)
 */

import type {
  MemoryReadOptions,
  MemoryReadResult,
  MemorySearchOptions,
  MemorySearchResult,
  MemorySessionContext,
} from '../memory/types.js';

export interface Memory {
  isAvailable(): boolean;
  getUnavailableReason(): string | null;

  /** Hybrid (vector + keyword) recall. */
  search(query: string, options?: MemorySearchOptions): Promise<MemorySearchResult[]>;

  /** Read raw text from a specific memory file (line range optional). */
  get(options: MemoryReadOptions): Promise<MemoryReadResult>;

  appendLongTermMemory(text: string): Promise<void>;
  appendDailyMemory(text: string): Promise<void>;
  appendMemory(file: string, content: string): Promise<void>;
  editMemory(file: string, oldText: string, newText: string): Promise<boolean>;
  deleteMemory(file: string, textToDelete: string): Promise<boolean>;

  listFiles(): Promise<string[]>;

  /** Context block injected into the system prompt at turn start. */
  loadSessionContext(): Promise<MemorySessionContext>;

  /** Force a sync of the underlying index (used by /memory commands). */
  sync(options?: { force?: boolean }): Promise<void>;
}
