import 'server-only';

import YahooFinance from 'yahoo-finance2';

/**
 * Server-side symbol search powering the /portfolios "add ticker"
 * autocomplete.
 *
 * Two sources are queried in parallel and merged:
 *
 *   1. Yahoo .search() — strong for English names, pinyin ("tencent",
 *      "BYD"), and ticker codes themselves ("NVDA", "0700.HK",
 *      "600519.SS"). Yahoo's `v1/finance/search` does NOT index Chinese
 *      company names — verified empirically — so we can't rely on it
 *      alone for A-share / HK users.
 *
 *   2. Tencent smartbox — covers Chinese names natively ("腾讯", "比亚迪",
 *      "茅台"). Response is a quirky `v_hint="..."` payload using `^`
 *      to separate rows and `~` for fields; we decode + normalise into
 *      Yahoo-compatible tickers so downstream price/indicator code
 *      doesn't have to care which source matched.
 *
 * Merging dedupes by ticker. Tencent wins on display_name when the same
 * symbol comes back from both (Chinese name preferred over English for
 * A-share / HK).
 */

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey', 'ripHistorical'],
});

export interface SymbolHit {
  ticker: string;
  name: string;
  exchange: string | null;
  /** Coarse asset class. Filters out indices, warrants, futures, FX. */
  type: 'equity' | 'etf';
  /** Which feed produced this row — debug-only, never shown in UI. */
  source: 'yahoo' | 'tencent';
}

const CHINESE_CHAR = /[㐀-鿿]/;

export async function searchSymbols(query: string, limit = 8): Promise<SymbolHit[]> {
  const q = query.trim();
  if (!q) return [];

  const hasChinese = CHINESE_CHAR.test(q);
  // Run both in parallel — neither blocks long enough for sequencing to
  // matter, and a slow Yahoo response shouldn't penalise a fast Tencent
  // hit (or vice versa).
  const [yahoo, tencent] = await Promise.all([
    hasChinese ? Promise.resolve([] as SymbolHit[]) : searchYahoo(q).catch(() => [] as SymbolHit[]),
    searchTencent(q).catch(() => [] as SymbolHit[]),
  ]);

  // Tencent first when the query is Chinese (most-relevant match comes
  // from there); Yahoo first otherwise (broader catalogue + ETF support).
  const ordered = hasChinese ? [...tencent, ...yahoo] : [...yahoo, ...tencent];
  const dedup = new Map<string, SymbolHit>();
  for (const hit of ordered) {
    if (!dedup.has(hit.ticker)) {
      dedup.set(hit.ticker, hit);
    } else if (hit.source === 'tencent' && CHINESE_CHAR.test(hit.name)) {
      // Prefer the Chinese display name when both sources agree on the
      // ticker — the user looking up "0700.HK" still wants "腾讯控股"
      // surfaced if their UI is in Chinese.
      const existing = dedup.get(hit.ticker)!;
      dedup.set(hit.ticker, { ...existing, name: hit.name });
    }
  }
  return Array.from(dedup.values()).slice(0, limit);
}

// ---------------------------------------------------------------------------
// Yahoo
// ---------------------------------------------------------------------------

interface YahooQuoteRow {
  symbol?: string;
  shortname?: string;
  longname?: string;
  exchange?: string;
  quoteType?: string;
}

async function searchYahoo(query: string): Promise<SymbolHit[]> {
  const result = (await yahooFinance.search(query, { quotesCount: 12 })) as {
    quotes?: YahooQuoteRow[];
  };
  const out: SymbolHit[] = [];
  for (const q of result.quotes ?? []) {
    if (!q.symbol) continue;
    const type = mapYahooType(q.quoteType);
    if (!type) continue;
    out.push({
      ticker: q.symbol,
      name: q.shortname ?? q.longname ?? q.symbol,
      exchange: q.exchange ?? null,
      type,
      source: 'yahoo',
    });
  }
  return out;
}

function mapYahooType(t: string | undefined): 'equity' | 'etf' | null {
  if (t === 'EQUITY') return 'equity';
  if (t === 'ETF') return 'etf';
  return null;
}

// ---------------------------------------------------------------------------
// Tencent smartbox
// ---------------------------------------------------------------------------

/**
 * Tencent's smartbox is the de-facto Chinese stock autocomplete used
 * across qq.com finance properties. Response format:
 *
 *   v_hint="sh~000847~腾讯济安~txja~ZS^hk~00700~腾讯控股~txkg~GP^..."
 *
 * Fields (tilde-separated): market, code, name, pinyin, type
 *   market ∈ { sh, sz, hk, us }
 *   type   ∈ { GP, GP-A, ETF, ZS (index), QZ (warrant), JJ (fund), ... }
 *
 * We only surface GP / GP-A / ETF and convert codes to Yahoo-compatible
 * tickers so the rest of the codebase (get_stock_prices, indicators)
 * keeps working unchanged.
 */
async function searchTencent(query: string): Promise<SymbolHit[]> {
  const url = `https://smartbox.gtimg.cn/s3/?v=2&q=${encodeURIComponent(query)}&t=all`;
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0',
      referer: 'https://stockapp.finance.qq.com/',
    },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const text = await res.text();
  const match = text.match(/v_hint="([^"]*)"/);
  if (!match || !match[1]) return [];
  // Decode the \uXXXX escapes that Tencent emits. JSON.parse handles
  // them cleanly with double quotes around the payload.
  let decoded: string;
  try {
    decoded = JSON.parse('"' + match[1].replace(/"/g, '\\"') + '"');
  } catch {
    return [];
  }
  if (!decoded) return [];

  const rows = decoded.split('^');
  const out: SymbolHit[] = [];
  for (const row of rows) {
    const parts = row.split('~');
    if (parts.length < 5) continue;
    const [market, code, name, , type] = parts;
    const ticker = toYahooTicker(market, code);
    if (!ticker) continue;
    const assetType = mapTencentType(type);
    if (!assetType) continue;
    out.push({
      ticker,
      name,
      exchange: mapMarketToExchange(market),
      type: assetType,
      source: 'tencent',
    });
  }
  return out;
}

function toYahooTicker(market: string, code: string): string | null {
  if (!code) return null;
  switch (market) {
    case 'sh':
      return `${code}.SS`;
    case 'sz':
      return `${code}.SZ`;
    case 'hk': {
      // Tencent emits 5-digit HK codes ("00700"); Yahoo wants 4 digits
      // ("0700.HK"). Strip the leading zero(s) but keep a minimum width
      // of 4 — there are real HK codes like "0011" (HSBC China).
      const trimmed = code.replace(/^0+/, '').padStart(4, '0');
      return `${trimmed}.HK`;
    }
    case 'us': {
      // Tencent suffixes US tickers with ".n"/".ps" for the exchange.
      // Yahoo uses bare uppercase symbols.
      return code.split('.')[0].toUpperCase();
    }
    default:
      return null;
  }
}

function mapTencentType(t: string): 'equity' | 'etf' | null {
  if (t === 'GP' || t === 'GP-A') return 'equity';
  if (t === 'ETF') return 'etf';
  return null;
}

function mapMarketToExchange(market: string): string | null {
  switch (market) {
    case 'sh': return 'SSE';
    case 'sz': return 'SZSE';
    case 'hk': return 'HKEX';
    case 'us': return 'US';
    default: return null;
  }
}
