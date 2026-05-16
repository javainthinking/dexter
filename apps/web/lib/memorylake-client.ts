import 'server-only';

/**
 * Server-side MemoryLake client used by the /memory page and /api/memory
 * route. Intentionally separate from the agent-facing `MemoryLakeAdapter`
 * (which implements the Memory port) because the memory-management UI has
 * different needs:
 *
 *   - List all memories with pagination (not just a search/recall)
 *   - Surface created_at / updated_at / metadata for display
 *   - Forget individual memories on demand
 *
 * The adapter optimises for agent-time recall; this client optimises for
 * human management.
 */

const BASE = process.env.MEMORYLAKE_BASE_URL ?? '';
const PROJECT_ID = process.env.MEMORYLAKE_PROJECT_ID ?? '';
const API_KEY = process.env.MEMORYLAKE_API_KEY ?? '';

export interface MemoryRecord {
  id: string;
  content: string;
  user_id?: string;
  expired?: boolean;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  score?: number;
}

export interface ListMemoriesParams {
  userId: string;
  page?: number;
  size?: number;
  keyword?: string;
  expired?: boolean;
}

export interface ListMemoriesResult {
  items: MemoryRecord[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface SearchMemoriesParams {
  userId: string;
  query: string;
  topK?: number;
  threshold?: number;
}

export function isMemoryLakeConfigured(): boolean {
  return !!(BASE && PROJECT_ID && API_KEY);
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function call<T = unknown>(
  method: 'GET' | 'POST',
  pathAndQuery: string,
  body?: unknown,
): Promise<T> {
  if (!isMemoryLakeConfigured()) {
    throw new Error('MemoryLake is not configured (missing API key, project id, or base URL).');
  }
  const res = await fetch(`${BASE}${pathAndQuery}`, {
    method,
    headers: authHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`MemoryLake ${method} ${pathAndQuery} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

interface Envelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  error_code?: string;
}

interface ListResponseShape {
  items?: MemoryRecord[];
  total?: number;
  page?: number;
  size?: number;
  total_pages?: number;
}

export async function listMemories(params: ListMemoriesParams): Promise<ListMemoriesResult> {
  const page = Math.max(1, params.page ?? 1);
  const size = Math.min(100, Math.max(1, params.size ?? 20));
  const search = new URLSearchParams();
  search.set('user_id', params.userId);
  search.set('page', String(page));
  search.set('size', String(size));
  if (params.keyword) search.set('keyword', params.keyword);
  if (typeof params.expired === 'boolean') search.set('expired', String(params.expired));

  const env = await call<Envelope<ListResponseShape>>(
    'GET',
    `/api/v2/projects/${encodeURIComponent(PROJECT_ID)}/memories?${search.toString()}`,
  );
  const data = env?.data ?? {};
  return {
    items: data.items ?? [],
    total: data.total ?? 0,
    page: data.page ?? page,
    size: data.size ?? size,
    totalPages: data.total_pages ?? 1,
  };
}

export async function searchMemories(params: SearchMemoriesParams): Promise<MemoryRecord[]> {
  const env = await call<Envelope<{ items?: MemoryRecord[]; results?: MemoryRecord[]; memories?: MemoryRecord[] }>>(
    'POST',
    `/api/v2/projects/${encodeURIComponent(PROJECT_ID)}/memories/search`,
    {
      query: params.query,
      user_id: params.userId,
      top_k: params.topK ?? 20,
      threshold: params.threshold ?? 0,
    },
  );
  return env?.data?.items ?? env?.data?.results ?? env?.data?.memories ?? [];
}

export async function forgetMemory(memoryId: string): Promise<void> {
  await call(
    'POST',
    `/api/v2/projects/${encodeURIComponent(PROJECT_ID)}/memories/${encodeURIComponent(memoryId)}/forget`,
  );
}
