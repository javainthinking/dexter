/**
 * Local Memory adapter — implements the Memory port via the existing
 * MemoryManager singleton (markdown files + SQLite vector index).
 *
 * The legacy MemoryManager stays intact so existing tools / agent code that
 * still imports it keeps working. New code should depend on the Memory port
 * and receive an instance of this adapter through composition.
 *
 * The Web SaaS adapter will live next to this one (adapters/memory/postgres.ts)
 * and back the same port using Neon Postgres + pgvector + Vercel Blob.
 */

import type { Memory } from '../../ports/memory.js';
import type {
  MemoryReadOptions,
  MemoryReadResult,
  MemorySearchOptions,
  MemorySearchResult,
  MemorySessionContext,
} from '../../memory/types.js';
import { MemoryManager } from '../../memory/index.js';

export class LocalMemoryAdapter implements Memory {
  private constructor(private readonly manager: MemoryManager) {}

  static async create(): Promise<LocalMemoryAdapter> {
    const manager = await MemoryManager.get();
    return new LocalMemoryAdapter(manager);
  }

  isAvailable(): boolean {
    return this.manager.isAvailable();
  }

  getUnavailableReason(): string | null {
    return this.manager.getUnavailableReason();
  }

  search(query: string, options?: MemorySearchOptions): Promise<MemorySearchResult[]> {
    return this.manager.search(query, options);
  }

  get(options: MemoryReadOptions): Promise<MemoryReadResult> {
    return this.manager.get(options);
  }

  appendLongTermMemory(text: string): Promise<void> {
    return this.manager.appendLongTermMemory(text);
  }

  appendDailyMemory(text: string): Promise<void> {
    return this.manager.appendDailyMemory(text);
  }

  appendMemory(file: string, content: string): Promise<void> {
    return this.manager.appendMemory(file, content);
  }

  editMemory(file: string, oldText: string, newText: string): Promise<boolean> {
    return this.manager.editMemory(file, oldText, newText);
  }

  deleteMemory(file: string, textToDelete: string): Promise<boolean> {
    return this.manager.deleteMemory(file, textToDelete);
  }

  listFiles(): Promise<string[]> {
    return this.manager.listFiles();
  }

  loadSessionContext(): Promise<MemorySessionContext> {
    return this.manager.loadSessionContext();
  }

  sync(options?: { force?: boolean }): Promise<void> {
    return this.manager.sync(options);
  }
}
