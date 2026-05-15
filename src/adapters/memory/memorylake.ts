/**
 * MemoryLake Memory adapter — fronts the MemoryLake REST API behind the
 * Memory port. MemoryLake's model is fundamentally different from the
 * markdown-file model the Memory port was designed around: it stores
 * memories as messages keyed by user_id, has its own conflict resolution
 * and keyword clustering, and exposes semantic search out of the box.
 *
 * Mapping decisions:
 *   - search(query)              → POST /memories/search { query, user_id, top_k, threshold }
 *   - appendLongTermMemory(text) → POST /memories with metadata.kind='long_term'
 *   - appendDailyMemory(text)    → POST /memories with metadata.kind='daily'
 *   - appendMemory(file, text)   → POST /memories with metadata.file=<file>
 *   - editMemory                 → best-effort: store the new text as a fresh
 *                                  memory and forget the old. MemoryLake's
 *                                  conflict-detection will surface the diff.
 *   - deleteMemory(file, txt)    → search → forget matches
 *   - listFiles                  → returns the distinct `metadata.file` values
 *                                  observed in recent memories (best effort).
 *   - loadSessionContext         → pulls the N most recent non-expired
 *                                  memories and renders them as a markdown block.
 *   - sync                       → no-op (MemoryLake indexes server-side).
 *
 * user_id requirement: MemoryLake search REQUIRES user_id. For Phase 3
 * single-tenant we pass a constant derived from the request (sessionId,
 * or a stable fallback). Phase 4 multi-tenant will pass the authenticated
 * user id instead.
 */

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
const DEFAULT_SEARCH_TOP_K = 6;
const DEFAULT_SEARCH_THRESHOLD = 0.3;
const DEFAULT_CONTEXT_LIMIT = 12;
const DEFAULT_MAX_SESSION_TOKENS = 2000;

export interface MemoryLakeAdapterOptions {
  apiKey: string;
  projectId: string;
  /** Base URL, e.g. https://app.memorylake.ai/openapi/memorylake */
  baseUrl: string;
  /** End-user identifier required by /memories/search and tagged onto adds. */
  userId: string;
  /** Tokens budget for loadSessionContext (matches the local adapter default). */
  maxSessionContextTokens?: number;
  /** Override fetch (used in tests). */
  fetchImpl?: typeof fetch;
}

interface MemoryRecord {
  id: string;
  content: string;
  expired?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown> | null;
  score?: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  error_code?: string;
}

export class MemoryLakeAdapter implements Memory {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly projectId: string;
  private readonly userId: string;
  private readonly maxSessionContextTokens: number;
  private readonly fetchImpl: typeof fetch;
  private initError: string | null = null;

  constructor(options: MemoryLakeAdapterOptions) {
    if (!options.apiKey) {
      this.initError = 'MemoryLake api key missing';
    }
    if (!options.projectId) {
      this.initError = (this.initError ?? '') + ' projectId missing';
    }
    if (!options.baseUrl) {
      this.initError = (this.initError ?? '') + ' baseUrl missing';
    }
    this.baseUrl = (options.baseUrl ?? '').replace(/\/+$/, '');
    this.apiKey = options.apiKey;
    this.projectId = options.projectId;
    this.userId = options.userId;
    this.maxSessionContextTokens = options.maxSessionContextTokens ?? DEFAULT_MAX_SESSION_TOKENS;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  isAvailable(): boolean {
    return this.initError === null;
  }

  getUnavailableReason(): string | null {
    return this.initError;
  }

  async search(query: string, options?: MemorySearchOptions): Promise<MemorySearchResult[]> {
    if (!this.isAvailable() || !query.trim()) return [];
    const top_k = Math.max(1, Math.min(options?.maxResults ?? DEFAULT_SEARCH_TOP_K, 50));
    const threshold = options?.minScore ?? DEFAULT_SEARCH_THRESHOLD;

    type SearchResponse = {
      items?: MemoryRecord[];
      results?: MemoryRecord[];
      memories?: MemoryRecord[];
    };

    const envelope = await this.callApi<SearchResponse>(
      `POST`,
      `/api/v2/projects/${encodeURIComponent(this.projectId)}/memories/search`,
      { query, user_id: this.userId, top_k, threshold },
    );
    const records =
      envelope?.data?.items ?? envelope?.data?.results ?? envelope?.data?.memories ?? [];
    return records.map((rec) => toSearchResult(rec));
  }

  async get(options: MemoryReadOptions): Promise<MemoryReadResult> {
    // Treat the `path` as a memory id when it looks like one; otherwise
    // fall back to a metadata.file lookup via list (best effort).
    const ident = options.path.trim();
    if (!ident) return { path: ident, text: '' };
    try {
      const envelope = await this.callApi<MemoryRecord>(
        'GET',
        `/api/v2/projects/${encodeURIComponent(this.projectId)}/memories/${encodeURIComponent(ident)}`,
      );
      const content = envelope?.data?.content ?? '';
      return { path: ident, text: applyLineWindow(content, options.from, options.lines) };
    } catch {
      // Not a valid memory id — try fetching by metadata.file
      const list = await this.listByFile(ident);
      const text = list.map((m) => m.content).join('\n\n');
      return { path: ident, text: applyLineWindow(text, options.from, options.lines) };
    }
  }

  appendLongTermMemory(text: string): Promise<void> {
    return this.addMemory(text, { kind: 'long_term', file: LONG_TERM_FILE });
  }

  appendDailyMemory(text: string): Promise<void> {
    const file = todayFileName();
    return this.addMemory(text, { kind: 'daily', file });
  }

  appendMemory(file: string, content: string): Promise<void> {
    return this.addMemory(content, { file });
  }

  async editMemory(file: string, oldText: string, newText: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    // MemoryLake has no in-place edit. We add the new text tagged with the
    // same `file` metadata; the server's conflict detection will reconcile.
    // We also try to forget any memory whose content contains `oldText`.
    const matches = await this.findMemoriesByText(oldText);
    await Promise.allSettled(matches.map((m) => this.forget(m.id)));
    await this.addMemory(newText, { file, edited_from: oldText.slice(0, 200) });
    return matches.length > 0;
  }

  async deleteMemory(_file: string, textToDelete: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    const matches = await this.findMemoriesByText(textToDelete);
    if (matches.length === 0) return false;
    await Promise.allSettled(matches.map((m) => this.forget(m.id)));
    return true;
  }

  async listFiles(): Promise<string[]> {
    if (!this.isAvailable()) return [];
    const memories = await this.listRecent(100);
    const seen = new Set<string>();
    for (const m of memories) {
      const file = (m.metadata as Record<string, unknown> | undefined)?.file;
      if (typeof file === 'string') seen.add(file);
    }
    return Array.from(seen).sort();
  }

  async loadSessionContext(): Promise<MemorySessionContext> {
    if (!this.isAvailable()) {
      return { filesLoaded: [], tokenEstimate: 0, text: '' };
    }
    const memories = await this.listRecent(DEFAULT_CONTEXT_LIMIT);
    const filesLoaded: string[] = [];
    const sections: string[] = [];
    let tokenEstimate = 0;
    for (const m of memories) {
      if (m.expired) continue;
      const file = (m.metadata as Record<string, unknown> | undefined)?.file;
      const heading = typeof file === 'string' ? file : `memory:${m.id}`;
      const section = `### ${heading}\n${m.content.trim()}`;
      const sectionTokens = estimateTokens(section);
      if (tokenEstimate + sectionTokens > this.maxSessionContextTokens) continue;
      tokenEstimate += sectionTokens;
      filesLoaded.push(heading);
      sections.push(section);
    }
    return { filesLoaded, tokenEstimate, text: sections.join('\n\n') };
  }

  async sync(): Promise<void> {
    // MemoryLake manages indexing server-side. No client-side sync needed.
  }

  // --- internals ---

  private async addMemory(content: string, metadata: Record<string, unknown>): Promise<void> {
    if (!this.isAvailable() || !content.trim()) return;
    await this.callApi(
      'POST',
      `/api/v2/projects/${encodeURIComponent(this.projectId)}/memories`,
      {
        messages: [{ role: 'assistant', content }],
        user_id: this.userId,
        infer: false,
        metadata,
      },
    );
  }

  private async forget(memoryId: string): Promise<void> {
    await this.callApi(
      'POST',
      `/api/v2/projects/${encodeURIComponent(this.projectId)}/memories/${encodeURIComponent(memoryId)}/forget`,
    );
  }

  private async listRecent(limit: number): Promise<MemoryRecord[]> {
    if (!this.isAvailable()) return [];
    type ListResponse = { items?: MemoryRecord[]; total?: number };
    const envelope = await this.callApi<ListResponse>(
      'GET',
      `/api/v2/projects/${encodeURIComponent(this.projectId)}/memories?user_id=${encodeURIComponent(this.userId)}&size=${limit}&expired=false`,
    );
    return envelope?.data?.items ?? [];
  }

  private async listByFile(file: string): Promise<MemoryRecord[]> {
    // MemoryLake's GET /memories supports a `keyword` query param. We use it
    // as a heuristic to find memories tagged with this file name.
    type ListResponse = { items?: MemoryRecord[] };
    const envelope = await this.callApi<ListResponse>(
      'GET',
      `/api/v2/projects/${encodeURIComponent(this.projectId)}/memories?user_id=${encodeURIComponent(this.userId)}&keyword=${encodeURIComponent(file)}&size=20`,
    );
    return (envelope?.data?.items ?? []).filter((m) => {
      const meta = m.metadata as Record<string, unknown> | undefined;
      return typeof meta?.file === 'string' && meta.file === file;
    });
  }

  private async findMemoriesByText(snippet: string): Promise<MemoryRecord[]> {
    const trimmed = snippet.trim().slice(0, 200);
    if (!trimmed) return [];
    const hits = await this.search(trimmed, { maxResults: 5, minScore: 0.4 });
    return hits.map((h) => ({ id: String(h.path).replace(/^memorylake:\/\//, ''), content: h.snippet }));
  }

  private async callApi<T = unknown>(
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
    pathAndQuery: string,
    body?: unknown,
  ): Promise<ApiEnvelope<T> | null> {
    const url = `${this.baseUrl}${pathAndQuery}`;
    const init: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    };
    const res = await this.fetchImpl(url, init);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`MemoryLake ${method} ${pathAndQuery} failed: ${res.status} ${text.slice(0, 200)}`);
    }
    return (await res.json()) as ApiEnvelope<T>;
  }
}

function toSearchResult(rec: MemoryRecord): MemorySearchResult {
  const meta = rec.metadata as Record<string, unknown> | undefined;
  const file = typeof meta?.file === 'string' ? meta.file : `memorylake://${rec.id}`;
  const updatedAt = rec.updated_at ? Date.parse(rec.updated_at) : undefined;
  return {
    snippet: rec.content,
    path: file,
    startLine: 1,
    endLine: Math.max(1, rec.content.split('\n').length),
    score: typeof rec.score === 'number' ? rec.score : 1,
    source: 'vector',
    updatedAt: Number.isFinite(updatedAt) ? updatedAt : undefined,
  };
}

function applyLineWindow(text: string, from?: number, lines?: number): string {
  if (!text) return '';
  if (!from && !lines) return text;
  const split = text.split('\n');
  const start = from ? Math.max(1, from) - 1 : 0;
  const end = lines && lines > 0 ? Math.min(start + lines, split.length) : split.length;
  return split.slice(start, end).join('\n');
}

function todayFileName(now: Date = new Date()): string {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}.md`;
}
