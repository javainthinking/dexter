import 'server-only';

import {
  isMemoryLakeConfigured,
  listMemories,
  searchMemories,
  forgetMemory,
  type MemoryRecord,
} from './memorylake-client';

/**
 * Holdings live in MemoryLake under a dedicated metadata `kind: 'holdings'`
 * with `file: 'HOLDINGS.md'`. Storing the tickers as their own record (not
 * stuffed into a free-form long-term memory) means:
 *
 *   - The /indicators page can read holdings in O(1) without scanning a
 *     prose long-term memory.
 *   - A user editing tickers replaces the holdings record without polluting
 *     the rest of their memory graph.
 *   - The agent still picks up the same holdings via memory_search (the
 *     `holdings`/`portfolio` keywords hit the file's metadata + content).
 *
 * Content shape:
 *
 *   {
 *     "version": 1,
 *     "tickers": ["NVDA", "TSLA", "0700.HK"],
 *     "updatedAt": "2026-05-17T10:23:00.000Z"
 *   }
 */

const HOLDINGS_FILE = 'HOLDINGS.md';
const HOLDINGS_KIND = 'holdings';

export interface HoldingsRecord {
  tickers: string[];
  updatedAt: string | null;
  /** MemoryLake memory id, when the record exists. Used so save-then-replace can forget the prior copy. */
  memoryId: string | null;
}

interface HoldingsPayload {
  version: 1;
  tickers: string[];
  updatedAt: string;
}

const MEMORYLAKE_BASE = process.env.MEMORYLAKE_BASE_URL ?? '';
const MEMORYLAKE_PROJECT = process.env.MEMORYLAKE_PROJECT_ID ?? '';
const MEMORYLAKE_KEY = process.env.MEMORYLAKE_API_KEY ?? '';

function parseHoldingsContent(text: string): HoldingsPayload | null {
  if (!text) return null;
  // Defensive: the record's content is the message text from MemoryLake's
  // /memories POST, which embeds our JSON. Strip any wrapping prose.
  const match = text.match(/\{[\s\S]*\}/);
  const json = match ? match[0] : text;
  try {
    const parsed = JSON.parse(json) as HoldingsPayload;
    if (!parsed || !Array.isArray(parsed.tickers)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function pickHoldingsRecord(items: MemoryRecord[]): MemoryRecord | null {
  for (const item of items) {
    const meta = (item.metadata ?? {}) as Record<string, unknown>;
    if (meta.kind === HOLDINGS_KIND || meta.file === HOLDINGS_FILE) {
      return item;
    }
  }
  return null;
}

/**
 * Read the user's current holdings record from MemoryLake.
 *
 * Returns an empty list (not null) when MemoryLake is not configured or no
 * holdings record exists yet — that's a normal "first-time visitor" state
 * the UI handles with a ticker-entry prompt.
 */
export async function getHoldings(userId: string): Promise<HoldingsRecord> {
  if (!isMemoryLakeConfigured()) {
    return { tickers: [], updatedAt: null, memoryId: null };
  }
  // Two-pass lookup: metadata.kind filter would be the right tool but the
  // MemoryLake v2 list endpoint doesn't support metadata-keyed filters, so
  // we semantic-search by the keyword the agent's prompts also use.
  const candidates = await searchMemories({
    userId,
    query: 'holdings portfolio 持仓',
    topK: 10,
  }).catch(() => [] as MemoryRecord[]);
  let pick = pickHoldingsRecord(candidates);
  if (!pick) {
    // Fallback to listing in case search hasn't indexed a fresh write yet.
    const list = await listMemories({ userId, size: 50 }).catch(() => null);
    if (list) pick = pickHoldingsRecord(list.items);
  }
  if (!pick) return { tickers: [], updatedAt: null, memoryId: null };
  const parsed = parseHoldingsContent(pick.content ?? '');
  if (!parsed) return { tickers: [], updatedAt: pick.updated_at ?? pick.created_at ?? null, memoryId: pick.id ?? null };
  return {
    tickers: parsed.tickers,
    updatedAt: parsed.updatedAt ?? pick.updated_at ?? pick.created_at ?? null,
    memoryId: pick.id ?? null,
  };
}

/**
 * Persist the user's holdings to MemoryLake.
 *
 * Strategy: write the new record first, then forget the prior one. This
 * ordering means a partial failure leaves the user with a duplicate (which
 * the next read silently consolidates by metadata pick) rather than no
 * holdings at all.
 */
export async function saveHoldings(userId: string, tickers: string[]): Promise<HoldingsRecord> {
  if (!isMemoryLakeConfigured()) {
    throw new Error('MemoryLake is not configured');
  }
  const normalised = normaliseTickers(tickers);
  const updatedAt = new Date().toISOString();
  const payload: HoldingsPayload = { version: 1, tickers: normalised, updatedAt };
  const body = JSON.stringify(payload);

  const existing = await getHoldings(userId).catch(() => null);

  // Direct write — addMemory in the CLI adapter does the same POST shape.
  const res = await fetch(
    `${MEMORYLAKE_BASE}/api/v2/projects/${encodeURIComponent(MEMORYLAKE_PROJECT)}/memories`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MEMORYLAKE_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'assistant', content: `User's current holdings: ${body}` }],
        user_id: userId,
        infer: false,
        metadata: { kind: HOLDINGS_KIND, file: HOLDINGS_FILE },
      }),
      cache: 'no-store',
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`MemoryLake save-holdings failed: ${res.status} ${text.slice(0, 200)}`);
  }

  // Best-effort cleanup of the old record. Don't fail the save on a 404.
  if (existing?.memoryId) {
    await forgetMemory(existing.memoryId).catch(() => {});
  }

  return { tickers: normalised, updatedAt, memoryId: null };
}

/**
 * Canonicalise user-typed tickers: uppercase, strip blank slots and
 * duplicates, preserve order. Supports comma/space/newline separation and
 * keeps exchange suffixes intact (0700.HK, 600519.SS, etc.).
 */
export function normaliseTickers(input: string[] | string): string[] {
  const list = Array.isArray(input) ? input : input.split(/[\s,]+/);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of list) {
    const t = String(raw).trim().toUpperCase();
    if (!t) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}
