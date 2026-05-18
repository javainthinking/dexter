import 'server-only';

import { and, asc, eq, sql } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import {
  portfolios,
  portfolioHoldings,
  type Portfolio,
  type PortfolioHolding,
} from '@dexter/core/db/schema/portfolios';
import { isMemoryLakeConfigured } from './memorylake-client';

/**
 * Server-side portfolio CRUD + MemoryLake summary sync.
 *
 * Truth lives in the DB (dexter_portfolios + dexter_portfolio_holdings);
 * after every write that mutates user-visible state we push a compact
 * markdown snapshot to MemoryLake so the agent's memory_search keeps
 * finding holdings even though the storage layer moved.
 *
 * Why two stores instead of one:
 *   - DB gives us: transactional consistency, fast list/get, FK cascades,
 *     ordered position, and per-user `(user_id, name)` uniqueness.
 *   - MemoryLake gives us: semantic recall for the agent. The agent never
 *     reads from the DB directly — that would couple the agent tools to
 *     the web schema. A compact markdown summary in MemoryLake is enough
 *     for the agent to answer "what do I own?" / "what's in portfolio X?"
 *     without us writing a new tool.
 */

export const MAX_PORTFOLIOS_PER_USER = 5;

/**
 * Drizzle (+ postgres-js) wraps the underlying Postgres error in its own
 * "Failed query" Error; the original error — carrying the SQLSTATE in
 * `.code` — sits on `.cause`. Walk the cause chain (up to 5 levels deep,
 * defensive against future re-wrapping) so our 23505 / 23503 / etc.
 * checks fire whether the error arrives raw or nested.
 *
 * Message-fallback: when minification or future SDK shenanigans strip the
 * `.code` field but leave the human-readable message intact, sniff the
 * SQLSTATE-style code out of `err.message`. The 5-digit `\d\d\d\d\d`
 * pattern is narrow enough that a coincidental match in user content is
 * essentially impossible.
 */
function pgErrorCode(err: unknown): string | undefined {
  let cur: unknown = err;
  for (let i = 0; i < 5; i++) {
    if (!cur || typeof cur !== 'object') break;
    const e = cur as { code?: unknown; cause?: unknown };
    if (typeof e.code === 'string' && /^\d{5}$/.test(e.code)) return e.code;
    cur = e.cause;
  }
  // Final fallback: scan the rendered string. Catches cases where the
  // SQLSTATE got stringified into the message via util.inspect or
  // similar (Drizzle's "Failed query" wrapper does this in some paths).
  const text =
    err instanceof Error ? `${err.message} ${String((err as { cause?: unknown }).cause ?? '')}` : String(err);
  const codeMatch = text.match(/code:\s*['"]?(\d{5})['"]?/);
  if (codeMatch) return codeMatch[1];
  // Last resort: recognise common readable error phrases.
  if (/duplicate key.*unique constraint/i.test(text)) return '23505';
  if (/violates foreign key constraint/i.test(text)) return '23503';
  return undefined;
}
const MEMORY_FILE = 'PORTFOLIOS.md';
const MEMORY_KIND = 'portfolios';
const ML_BASE = process.env.MEMORYLAKE_BASE_URL ?? '';
const ML_PROJECT = process.env.MEMORYLAKE_PROJECT_ID ?? '';
const ML_KEY = process.env.MEMORYLAKE_API_KEY ?? '';

export interface AddHoldingInput {
  ticker: string;
  displayName?: string | null;
  exchange?: string | null;
  weight?: number | null;
}

export interface PortfolioListItem {
  id: string;
  name: string;
  description: string | null;
  holdingsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioWithHoldings extends PortfolioListItem {
  holdings: Array<{
    id: string;
    ticker: string;
    displayName: string | null;
    exchange: string | null;
    weight: number | null;
    position: number;
    addedAt: string;
  }>;
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function listPortfolios(userId: string): Promise<PortfolioListItem[]> {
  const db = getDb();
  // One round-trip with a correlated COUNT so the "5 cards" view doesn't
  // fan out N+1 queries.
  const rows = await db.execute<{
    id: string;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    holdings_count: number;
  }>(sql`
    SELECT p.id, p.name, p.description, p.created_at, p.updated_at,
           COALESCE((
             SELECT COUNT(*) FROM dexter_portfolio_holdings h
             WHERE h.portfolio_id = p.id
           ), 0)::int AS holdings_count
    FROM dexter_portfolios p
    WHERE p.user_id = ${userId}
    ORDER BY p.created_at ASC
  `);
  return rows.map(toListItem);
}

export async function getPortfolio(
  userId: string,
  portfolioId: string,
): Promise<PortfolioWithHoldings | null> {
  const db = getDb();
  const [pf] = await db
    .select()
    .from(portfolios)
    .where(and(eq(portfolios.id, portfolioId), eq(portfolios.userId, userId)))
    .limit(1);
  if (!pf) return null;
  const holdings = await db
    .select()
    .from(portfolioHoldings)
    .where(eq(portfolioHoldings.portfolioId, portfolioId))
    .orderBy(asc(portfolioHoldings.position), asc(portfolioHoldings.addedAt));
  return {
    ...toListItem({
      id: pf.id,
      name: pf.name,
      description: pf.description,
      created_at: pf.createdAt,
      updated_at: pf.updatedAt,
      holdings_count: holdings.length,
    }),
    holdings: holdings.map(toHoldingDto),
  };
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

export async function createPortfolio(
  userId: string,
  name: string,
  initialHolding: AddHoldingInput,
  description?: string | null,
): Promise<{ portfolio: Portfolio; holding: PortfolioHolding }> {
  const cleanName = name.trim();
  if (!cleanName) throw httpError(400, 'name_required');
  if (cleanName.length > 80) throw httpError(400, 'name_too_long');

  const ticker = initialHolding.ticker.trim().toUpperCase();
  if (!ticker) throw httpError(400, 'holding_required');

  const db = getDb();
  // Cap enforcement here, not in the DB, so future per-user overrides
  // (e.g. higher cap for paid users) only touch this file.
  const existing = await db
    .select({ id: portfolios.id })
    .from(portfolios)
    .where(eq(portfolios.userId, userId));
  if (existing.length >= MAX_PORTFOLIOS_PER_USER) {
    throw httpError(409, 'max_portfolios_reached', { max: MAX_PORTFOLIOS_PER_USER });
  }

  try {
    // Atomic: portfolio + first holding go in together. If the holding
    // insert fails (e.g. weird ticker), the portfolio insert rolls back
    // so the invariant "no empty portfolios" holds even under crash.
    const { portfolio, holding } = await db.transaction(async (tx) => {
      const [pf] = await tx
        .insert(portfolios)
        .values({ userId, name: cleanName, description: description?.trim() || null })
        .returning();
      const [h] = await tx
        .insert(portfolioHoldings)
        .values({
          portfolioId: pf.id,
          ticker,
          displayName: initialHolding.displayName?.trim() || null,
          exchange: initialHolding.exchange?.trim() || null,
          weight: initialHolding.weight == null ? null : initialHolding.weight.toFixed(4),
          position: 0,
        })
        .returning();
      return { portfolio: pf, holding: h };
    });

    await syncMemorySnapshot(userId).catch(() => {});
    return { portfolio, holding };
  } catch (err) {
    // Unique-name collision surfaces as a Postgres 23505. We translate to
    // a 409 so the UI can render a "name already taken" hint inline
    // instead of a generic 500.
    if (pgErrorCode(err) === '23505') {
      throw httpError(409, 'name_taken');
    }
    throw err;
  }
}

export async function updatePortfolio(
  userId: string,
  portfolioId: string,
  patch: { name?: string; description?: string | null },
): Promise<Portfolio> {
  const db = getDb();
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof patch.name === 'string') {
    const cleanName = patch.name.trim();
    if (!cleanName) throw httpError(400, 'name_required');
    if (cleanName.length > 80) throw httpError(400, 'name_too_long');
    updates.name = cleanName;
  }
  if (patch.description !== undefined) {
    updates.description = patch.description?.trim() || null;
  }
  try {
    const [row] = await db
      .update(portfolios)
      .set(updates)
      .where(and(eq(portfolios.id, portfolioId), eq(portfolios.userId, userId)))
      .returning();
    if (!row) throw httpError(404, 'not_found');
    await syncMemorySnapshot(userId).catch(() => {});
    return row;
  } catch (err) {
    if (pgErrorCode(err) === '23505') {
      throw httpError(409, 'name_taken');
    }
    throw err;
  }
}

export async function deletePortfolio(userId: string, portfolioId: string): Promise<void> {
  const db = getDb();
  const result = await db
    .delete(portfolios)
    .where(and(eq(portfolios.id, portfolioId), eq(portfolios.userId, userId)))
    .returning({ id: portfolios.id });
  if (result.length === 0) throw httpError(404, 'not_found');
  await syncMemorySnapshot(userId).catch(() => {});
}

// ---------------------------------------------------------------------------
// Holdings
// ---------------------------------------------------------------------------

export async function addHolding(
  userId: string,
  portfolioId: string,
  input: AddHoldingInput,
): Promise<PortfolioHolding> {
  const ticker = input.ticker.trim().toUpperCase();
  if (!ticker) throw httpError(400, 'ticker_required');
  await assertPortfolioOwned(userId, portfolioId);

  const db = getDb();
  const [nextPos] = await db.execute<{ next: number }>(sql`
    SELECT COALESCE(MAX(position) + 1, 0) AS next
    FROM dexter_portfolio_holdings
    WHERE portfolio_id = ${portfolioId}
  `);
  try {
    const [row] = await db
      .insert(portfolioHoldings)
      .values({
        portfolioId,
        ticker,
        displayName: input.displayName?.trim() || null,
        exchange: input.exchange?.trim() || null,
        // drizzle maps PG numeric to a string at insert time; pass the
        // string form so TS doesn't widen to `unknown` and so we don't
        // lose precision through implicit number → numeric casts.
        weight: input.weight == null ? null : input.weight.toFixed(4),
        position: nextPos?.next ?? 0,
      })
      .returning();
    await touchPortfolio(portfolioId);
    await syncMemorySnapshot(userId).catch(() => {});
    return row;
  } catch (err) {
    if (pgErrorCode(err) === '23505') {
      throw httpError(409, 'ticker_already_in_portfolio');
    }
    throw err;
  }
}

export async function updateHolding(
  userId: string,
  portfolioId: string,
  holdingId: string,
  patch: { weight?: number | null; position?: number },
): Promise<PortfolioHolding> {
  await assertPortfolioOwned(userId, portfolioId);
  const db = getDb();
  const updates: Record<string, unknown> = {};
  if (patch.weight !== undefined) {
    updates.weight = patch.weight == null ? null : patch.weight.toFixed(4);
  }
  if (patch.position !== undefined) {
    updates.position = patch.position;
  }
  if (Object.keys(updates).length === 0) {
    // Caller passed no-op patch — return current row rather than 304.
    const [row] = await db
      .select()
      .from(portfolioHoldings)
      .where(and(eq(portfolioHoldings.id, holdingId), eq(portfolioHoldings.portfolioId, portfolioId)));
    if (!row) throw httpError(404, 'not_found');
    return row;
  }
  const [row] = await db
    .update(portfolioHoldings)
    .set(updates)
    .where(and(eq(portfolioHoldings.id, holdingId), eq(portfolioHoldings.portfolioId, portfolioId)))
    .returning();
  if (!row) throw httpError(404, 'not_found');
  await touchPortfolio(portfolioId);
  await syncMemorySnapshot(userId).catch(() => {});
  return row;
}

export async function removeHolding(
  userId: string,
  portfolioId: string,
  holdingId: string,
): Promise<void> {
  await assertPortfolioOwned(userId, portfolioId);
  const db = getDb();

  // Invariant: portfolios must always have ≥ 1 holding. Block removal of
  // the last one and steer the user toward deleting the portfolio
  // instead — same delete still cascades the row, so this isn't a real
  // technical limitation, just a UX guardrail that prevents the
  // "empty portfolio" state from ever appearing in the list.
  const [countRow] = await db.execute<{ n: number }>(sql`
    SELECT COUNT(*)::int AS n FROM dexter_portfolio_holdings
    WHERE portfolio_id = ${portfolioId}
  `);
  const remaining = Number(countRow?.n ?? 0);
  if (remaining <= 1) {
    throw httpError(409, 'last_holding_cannot_remove');
  }

  const result = await db
    .delete(portfolioHoldings)
    .where(and(eq(portfolioHoldings.id, holdingId), eq(portfolioHoldings.portfolioId, portfolioId)))
    .returning({ id: portfolioHoldings.id });
  if (result.length === 0) throw httpError(404, 'not_found');
  await touchPortfolio(portfolioId);
  await syncMemorySnapshot(userId).catch(() => {});
}

// ---------------------------------------------------------------------------
// MemoryLake snapshot
// ---------------------------------------------------------------------------

/**
 * Push a compact "current portfolios" snapshot to MemoryLake so the agent
 * can still answer "what do I own?" via memory_search even though the
 * truth-store moved to Postgres. One memory per user; replaces the prior
 * snapshot (write-then-forget) so we don't drift to N snapshots over time.
 *
 * Best-effort: if MemoryLake is unreachable, the DB write still wins.
 * Callers wrap this in `.catch(() => {})`.
 */
async function syncMemorySnapshot(userId: string): Promise<void> {
  if (!isMemoryLakeConfigured()) return;
  const items = await listPortfoliosForSnapshot(userId);
  const body = renderSnapshot(items);

  // Find + forget the prior snapshot first so we don't accumulate.
  const prior = await findExistingSnapshot(userId).catch(() => null);
  await postSnapshot(userId, body);
  if (prior?.id) await forgetSnapshot(prior.id).catch(() => {});
}

interface PortfolioSnapshot {
  name: string;
  description: string | null;
  holdings: Array<{ ticker: string; displayName: string | null; exchange: string | null; weight: number | null }>;
}

async function listPortfoliosForSnapshot(userId: string): Promise<PortfolioSnapshot[]> {
  const db = getDb();
  const pfs = await db.select().from(portfolios).where(eq(portfolios.userId, userId)).orderBy(asc(portfolios.createdAt));
  if (pfs.length === 0) return [];
  const ids = pfs.map((p) => p.id);
  const allHoldings = await db
    .select()
    .from(portfolioHoldings)
    .where(sql`portfolio_id = ANY(${ids})`)
    .orderBy(asc(portfolioHoldings.position));
  const byPf = new Map<string, PortfolioSnapshot['holdings']>();
  for (const h of allHoldings) {
    const list = byPf.get(h.portfolioId) ?? [];
    list.push({
      ticker: h.ticker,
      displayName: h.displayName,
      exchange: h.exchange,
      weight: h.weight == null ? null : Number(h.weight),
    });
    byPf.set(h.portfolioId, list);
  }
  return pfs.map((p) => ({
    name: p.name,
    description: p.description,
    holdings: byPf.get(p.id) ?? [],
  }));
}

function renderSnapshot(items: PortfolioSnapshot[]): string {
  if (items.length === 0) {
    return "User's portfolios: (none — they haven't created any portfolios yet)";
  }
  const lines: string[] = [`User's portfolios (${items.length} total):`];
  for (const p of items) {
    const desc = p.description ? ` — ${p.description}` : '';
    lines.push(`\n## ${p.name}${desc}`);
    if (p.holdings.length === 0) {
      lines.push('  (empty)');
      continue;
    }
    for (const h of p.holdings) {
      const name = h.displayName ? ` · ${h.displayName}` : '';
      const ex = h.exchange ? ` (${h.exchange})` : '';
      const w = h.weight == null ? '' : ` · ${h.weight}%`;
      lines.push(`  - ${h.ticker}${name}${ex}${w}`);
    }
  }
  return lines.join('\n');
}

// MemoryLake REST — calls go direct rather than reusing the
// memorylake-client.ts module so the dependency stays unidirectional
// (portfolio lib → memory; not the other way).

async function postSnapshot(userId: string, content: string): Promise<void> {
  const res = await fetch(
    `${ML_BASE}/api/v2/projects/${encodeURIComponent(ML_PROJECT)}/memories`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ML_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'assistant', content }],
        user_id: userId,
        infer: false,
        metadata: { kind: MEMORY_KIND, file: MEMORY_FILE },
      }),
      cache: 'no-store',
    },
  );
  if (!res.ok) throw new Error(`MemoryLake sync ${res.status}`);
}

async function findExistingSnapshot(userId: string): Promise<{ id: string } | null> {
  // Use search rather than list-and-filter so we don't scan the user's
  // entire memory page just to find one record.
  const res = await fetch(
    `${ML_BASE}/api/v2/projects/${encodeURIComponent(ML_PROJECT)}/memories/search`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ML_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: 'portfolios holdings PORTFOLIOS.md',
        user_id: userId,
        top_k: 10,
      }),
      cache: 'no-store',
    },
  );
  if (!res.ok) return null;
  const env = (await res.json().catch(() => ({}))) as {
    data?: { items?: Array<{ id: string; metadata?: Record<string, unknown> }> };
  };
  const items = env?.data?.items ?? [];
  for (const item of items) {
    const meta = (item.metadata ?? {}) as Record<string, unknown>;
    if (meta.kind === MEMORY_KIND || meta.file === MEMORY_FILE) {
      return { id: item.id };
    }
  }
  return null;
}

async function forgetSnapshot(memoryId: string): Promise<void> {
  await fetch(
    `${ML_BASE}/api/v2/projects/${encodeURIComponent(ML_PROJECT)}/memories/${encodeURIComponent(memoryId)}/forget`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${ML_KEY}`, Accept: 'application/json' },
      cache: 'no-store',
    },
  );
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

async function assertPortfolioOwned(userId: string, portfolioId: string): Promise<void> {
  const db = getDb();
  const [row] = await db
    .select({ id: portfolios.id })
    .from(portfolios)
    .where(and(eq(portfolios.id, portfolioId), eq(portfolios.userId, userId)))
    .limit(1);
  if (!row) throw httpError(404, 'not_found');
}

async function touchPortfolio(portfolioId: string): Promise<void> {
  const db = getDb();
  await db.update(portfolios).set({ updatedAt: new Date() }).where(eq(portfolios.id, portfolioId));
}

function toListItem(row: {
  id: string;
  name: string;
  description: string | null;
  // Drizzle's typed query path (used by getPortfolio) hands us a Date.
  // The raw-SQL path via db.execute(sql`…`) (used by listPortfolios) gives
  // a postgres-js timestamp string. Accept either.
  created_at: Date | string;
  updated_at: Date | string;
  holdings_count: number | string;
}): PortfolioListItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    holdingsCount: Number(row.holdings_count) || 0,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function toIso(v: Date | string | null | undefined): string {
  if (!v) return '';
  if (v instanceof Date) return v.toISOString();
  // postgres-js sends timestamptz as a string like "2026-05-18 02:34:11.123+00".
  // Parsing through Date round-trips it into the canonical ISO form the
  // client JSON expects.
  const d = new Date(String(v));
  return Number.isFinite(d.getTime()) ? d.toISOString() : String(v);
}

function toHoldingDto(row: PortfolioHolding) {
  return {
    id: row.id,
    ticker: row.ticker,
    displayName: row.displayName,
    exchange: row.exchange,
    weight: row.weight == null ? null : Number(row.weight),
    position: row.position,
    addedAt: toIso(row.addedAt as Date | string),
  };
}

/**
 * Tagged Error so the API route can translate to a stable status code +
 * machine-readable error key without losing the throw-site stack.
 */
export class PortfolioHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly detail?: Record<string, unknown>,
  ) {
    super(`${status} ${code}`);
  }
}

function httpError(status: number, code: string, detail?: Record<string, unknown>) {
  return new PortfolioHttpError(status, code, detail);
}
