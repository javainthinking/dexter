/**
 * Postgres Memory adapter — markdown CRUD persisted in dexter_memory_files.
 *
 * Phase 3 scope:
 *   - Read/append/edit/delete of memory files (the bulk of agent activity)
 *   - listFiles / loadSessionContext for system-prompt construction
 *   - search() returns empty until pgvector lands in Phase 3.5
 *
 * orgId default 'global' for single-tenant Phase 3. Phase 4 multi-tenant
 * passes the orgId from the request context.
 */

import { and, eq, like, sql } from 'drizzle-orm';
import type { DexterDb } from '../../db/client.js';
import { getDb } from '../../db/client.js';
import { memoryFiles } from '../../db/schema/memory.js';
import type { Memory } from '../../ports/memory.js';
import type {
  MemoryReadOptions,
  MemoryReadResult,
  MemorySearchOptions,
  MemorySearchResult,
  MemorySessionContext,
} from '../../memory/types.js';
import { estimateTokens } from '../../utils/tokens.js';

const LONG_TERM_FILE = 'MEMORY.md';
const DAILY_FILE_RE = /^\d{4}-\d{2}-\d{2}\.md$/;
const DEFAULT_MAX_SESSION_TOKENS = 2000;

export interface PostgresMemoryAdapterOptions {
  orgId?: string;
  db?: DexterDb;
  maxSessionContextTokens?: number;
}

export class PostgresMemoryAdapter implements Memory {
  private readonly db: DexterDb;
  private readonly orgId: string;
  private readonly maxSessionContextTokens: number;
  private initError: string | null = null;

  constructor(options: PostgresMemoryAdapterOptions = {}) {
    this.db = options.db ?? getDb();
    this.orgId = options.orgId ?? 'global';
    this.maxSessionContextTokens = options.maxSessionContextTokens ?? DEFAULT_MAX_SESSION_TOKENS;
  }

  isAvailable(): boolean {
    return this.initError === null;
  }

  getUnavailableReason(): string | null {
    return this.initError;
  }

  async search(_query: string, _options?: MemorySearchOptions): Promise<MemorySearchResult[]> {
    // TODO(P3.5): enable pgvector + ts_rank hybrid search against
    // dexter_memory_chunks. For now return empty so the agent's memory
    // search tool reports "no matches" instead of crashing.
    return [];
  }

  async get(options: MemoryReadOptions): Promise<MemoryReadResult> {
    const path = options.path.trim();
    const text = await this.readFile(path);
    if (!text) return { path, text: '' };

    const lines = text.split('\n');
    const start = options.from ? Math.max(1, options.from) : 1;
    const startIndex = start - 1;
    const endIndex =
      options.lines && options.lines > 0
        ? Math.min(startIndex + options.lines, lines.length)
        : lines.length;
    return { path, text: lines.slice(startIndex, endIndex).join('\n') };
  }

  async appendLongTermMemory(text: string): Promise<void> {
    await this.appendMemory(LONG_TERM_FILE, text);
  }

  async appendDailyMemory(text: string): Promise<void> {
    await this.appendMemory(todayFileName(), text);
  }

  async appendMemory(file: string, content: string): Promise<void> {
    const path = this.resolveFileAlias(file);
    const existing = await this.readFile(path);
    const separator = existing.length === 0 || existing.endsWith('\n') ? '' : '\n';
    const next = `${existing}${separator}${content}`;
    await this.writeFile(path, next);
  }

  async editMemory(file: string, oldText: string, newText: string): Promise<boolean> {
    const path = this.resolveFileAlias(file);
    const existing = await this.readFile(path);
    if (!existing.includes(oldText)) return false;
    await this.writeFile(path, existing.replace(oldText, newText));
    return true;
  }

  async deleteMemory(file: string, textToDelete: string): Promise<boolean> {
    const path = this.resolveFileAlias(file);
    const existing = await this.readFile(path);
    if (!existing.includes(textToDelete)) return false;
    const next = existing.replace(textToDelete, '').replace(/\n{3,}/g, '\n\n');
    await this.writeFile(path, next);
    return true;
  }

  async listFiles(): Promise<string[]> {
    const rows = await this.db
      .select({ path: memoryFiles.path })
      .from(memoryFiles)
      .where(eq(memoryFiles.orgId, this.orgId));
    return rows
      .map((r) => r.path)
      .filter((p) => p === LONG_TERM_FILE || DAILY_FILE_RE.test(p))
      .sort();
  }

  async loadSessionContext(): Promise<MemorySessionContext> {
    const candidates = [
      LONG_TERM_FILE,
      todayFileName(),
      todayFileName(new Date(Date.now() - 86_400_000)),
    ];
    const filesLoaded: string[] = [];
    const sections: string[] = [];
    let tokenEstimate = 0;

    for (const file of candidates) {
      const content = (await this.readFile(file)).trim();
      if (!content) continue;
      const section = `### ${file}\n${content}`;
      const sectionTokens = estimateTokens(section);
      if (tokenEstimate + sectionTokens > this.maxSessionContextTokens) continue;
      tokenEstimate += sectionTokens;
      filesLoaded.push(file);
      sections.push(section);
    }

    return { filesLoaded, tokenEstimate, text: sections.join('\n\n') };
  }

  async sync(_options?: { force?: boolean }): Promise<void> {
    // Postgres has no separate index to sync (no file watcher). pgvector
    // chunk maintenance will live here once the search path is enabled.
  }

  // --- private helpers ---

  private resolveFileAlias(file: string): string {
    if (file === 'long_term') return LONG_TERM_FILE;
    if (file === 'daily') return todayFileName();
    return file;
  }

  private async readFile(path: string): Promise<string> {
    const [row] = await this.db
      .select({ content: memoryFiles.content })
      .from(memoryFiles)
      .where(and(eq(memoryFiles.orgId, this.orgId), eq(memoryFiles.path, path)))
      .limit(1);
    return row?.content ?? '';
  }

  private async writeFile(path: string, content: string): Promise<void> {
    await this.db
      .insert(memoryFiles)
      .values({ orgId: this.orgId, path, content })
      .onConflictDoUpdate({
        target: [memoryFiles.orgId, memoryFiles.path],
        set: { content, updatedAt: new Date() },
      });
  }
}

function todayFileName(now: Date = new Date()): string {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}.md`;
}
