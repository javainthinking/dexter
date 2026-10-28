import 'server-only';

import { unstable_cache } from 'next/cache';
import { desc, eq, sql } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { stockPages } from '@dexter/core/db/schema/stock-pages';
import { lookupSymbol, searchSymbols } from '../symbol-search';
import {
  getStockBySlug,
  matchCurated,
  slugToTicker,
  tickerToSlug,
  type StockEntry,
  type StockMarket,
} from './universe';

/**
 * On-demand stock pages. A slug outside the curated list resolves only
 * after the symbol search confirms the ticker exists; the answer — hit
 * or miss — is cached for a week, so a ticker costs one lookup no matter
 * how many people open it, and junk slugs can't fan out to the feeds.
 * The page and snapshot caches then take over exactly as for curated
 * tickers: the first visitor generates the page, everyone after reads it.
 *
 * Every confirmed ticker is also recorded in dexter_stock_pages: a page
 * that exists once keeps its URL for good, so the sitemap lists it.
 */

const RESOLVE_TTL_SECONDS = 7 * 24 * 60 * 60;
const SEARCH_TTL_SECONDS = 24 * 60 * 60;

/** Yahoo exchange codes → the names people recognise. */
const US_EXCHANGES: Record<string, string> = {
  NMS: 'NASDAQ',
  NGM: 'NASDAQ',
  NCM: 'NASDAQ',
  NAS: 'NASDAQ',
  NYQ: 'NYSE',
  NYS: 'NYSE',
  ASE: 'NYSE American',
  PCX: 'NYSE Arca',
  BTS: 'Cboe',
};

function exchangeFor(market: StockMarket, ticker: string, raw: string | null): string {
  if (market === 'cn') return ticker.endsWith('.SS') ? 'SSE' : 'SZSE';
  if (market === 'hk') return 'HKEX';
  return (raw && US_EXCHANGES[raw]) ?? 'US';
}

async function lookupEntry(ticker: string, market: StockMarket): Promise<StockEntry | null> {
  const slug = tickerToSlug(ticker);
  if (!slug) return null;
  let profile;
  try {
    profile = await lookupSymbol(ticker);
  } catch (err) {
    // Feeds down: a ticker we've already confirmed keeps resolving.
    const known = await readPage(slug);
    if (known) return known;
    throw err;
  }
  if (!profile) return null;
  const en = profile.nameEn ?? profile.nameZh ?? ticker;
  const entry: StockEntry = {
    slug,
    ticker: profile.ticker,
    market,
    exchange: exchangeFor(market, profile.ticker, profile.exchange),
    name: { en, zh: profile.nameZh ?? en },
  };
  await recordPage(entry);
  return entry;
}

/** Upsert the page row. Best-effort: a DB hiccup must never 500 the page. */
async function recordPage(entry: StockEntry): Promise<void> {
  try {
    const values = {
      ticker: entry.ticker,
      market: entry.market,
      exchange: entry.exchange,
      nameEn: entry.name.en,
      nameZh: entry.name.zh,
    };
    await getDb()
      .insert(stockPages)
      .values({ slug: entry.slug, ...values })
      .onConflictDoUpdate({ target: stockPages.slug, set: { ...values, updatedAt: sql`now()` } });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/stocks record',
        slug: entry.slug,
        error: err instanceof Error ? err.message : String(err),
      }),
    );
  }
}

async function readPage(slug: string): Promise<StockEntry | null> {
  try {
    const [row] = await getDb().select().from(stockPages).where(eq(stockPages.slug, slug)).limit(1);
    if (!row) return null;
    return {
      slug: row.slug,
      ticker: row.ticker,
      market: row.market as StockMarket,
      exchange: row.exchange,
      name: { en: row.nameEn, zh: row.nameZh },
    };
  } catch {
    return null;
  }
}

/**
 * Slugs of every on-demand page, newest first, for the sitemap.
 * Empty (not an error) when the DB is unreachable — the sitemap then
 * still lists the curated pages.
 */
export async function listGeneratedPages(): Promise<Array<{ slug: string }>> {
  try {
    return await getDb()
      .select({ slug: stockPages.slug })
      .from(stockPages)
      .orderBy(desc(stockPages.createdAt))
      .limit(45_000);
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/sitemap stocks',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return [];
  }
}

const cachedLookup = unstable_cache(lookupEntry, ['stock-resolve-v3'], {
  revalidate: RESOLVE_TTL_SECONDS,
  tags: ['stock-resolve'],
});

/**
 * Curated entry, on-demand entry, or null (404). Throws only when the
 * symbol feeds are down, so an outage isn't remembered as a miss.
 * The returned slug is canonical — callers redirect when it differs
 * from the one requested (`NVDA` → `nvda`, `700-hk` → `0700-hk`).
 */
export async function resolveStock(slug: string): Promise<StockEntry | null> {
  const curated = getStockBySlug(slug);
  if (curated) return curated;
  const parsed = slugToTicker(slug);
  if (!parsed) return null;
  return getStockBySlug(tickerToSlug(parsed.ticker) ?? '') ?? cachedLookup(parsed.ticker, parsed.market);
}

export interface StockSearchResult {
  slug: string;
  /** Display code: bare for A-shares, as-is otherwise. */
  symbol: string;
  name: string;
  market: StockMarket;
  /** True for the hand-picked list; others are generated on first visit. */
  featured: boolean;
}

function marketOf(slug: string): StockMarket {
  return slug.endsWith('-hk') ? 'hk' : slug.endsWith('-sh') || slug.endsWith('-sz') ? 'cn' : 'us';
}

async function remoteSearch(query: string): Promise<StockSearchResult[]> {
  const hits = await searchSymbols(query, 12);
  const out: StockSearchResult[] = [];
  for (const hit of hits) {
    // 8xxxx.HK are RMB-counter duplicates of the HKD line.
    if (/^8\d{4}\.HK$/i.test(hit.ticker)) continue;
    const slug = tickerToSlug(hit.ticker);
    if (!slug) continue;
    const market = marketOf(slug);
    out.push({
      slug,
      symbol: market === 'cn' ? hit.ticker.split('.')[0] : hit.ticker,
      // Keep a Chinese name when Tencent supplied one; otherwise Yahoo's untruncated name.
      name: /[㐀-鿿]/.test(hit.name) ? hit.name : (hit.longName ?? hit.name),
      market,
      featured: getStockBySlug(slug) != null,
    });
  }
  // searchSymbols swallows feed errors, so an empty list may be an
  // outage — throw to keep it out of the cache.
  if (!out.length) throw new Error(`no results for ${query}`);
  return out;
}

const cachedSearch = unstable_cache(remoteSearch, ['stock-search-v2'], {
  revalidate: SEARCH_TTL_SECONDS,
  tags: ['stock-search'],
});

/**
 * Search across US / HK / A-shares: curated matches first (named in the
 * page language), then the Yahoo + Tencent feeds, deduped by slug.
 */
export async function searchStockPages(
  query: string,
  nameOf: (stock: StockEntry) => string,
  limit = 8,
): Promise<StockSearchResult[]> {
  const q = query.trim().toLowerCase().slice(0, 40);
  if (!q) return [];
  const local: StockSearchResult[] = matchCurated(q).map((s) => ({
    slug: s.slug,
    symbol: s.market === 'cn' ? s.ticker.split('.')[0] : s.ticker,
    name: nameOf(s),
    market: s.market,
    featured: true,
  }));
  const remote = await cachedSearch(q).catch(() => [] as StockSearchResult[]);
  const seen = new Set(local.map((r) => r.slug));
  const merged = [...local];
  for (const r of remote) {
    if (seen.has(r.slug)) continue;
    seen.add(r.slug);
    const curated = getStockBySlug(r.slug);
    merged.push(curated ? { ...r, name: nameOf(curated) } : r);
  }
  return merged.slice(0, limit);
}
