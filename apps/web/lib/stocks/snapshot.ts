import 'server-only';

import { unstable_cache } from 'next/cache';
import {
  BUCKET_TREND_LOOKBACK,
  computeAllDimensions,
  dailyChangesFromPrices,
} from '../indicators/compute';
import { daysAgoIso, getHistoricalPrices, todayIso } from '../indicators/prices';
import type { StockSnapshot } from './snapshot-core';

// The shape and the pure helpers live in snapshot-core so client
// components (and the desktop app) can use them without this module's
// server-only data access.
export * from './snapshot-core';

/**
 * Everything a public /stocks page needs for one ticker, computed once
 * and shared by every visitor and every locale.
 *
 * Daily bars only change once per session, so the snapshot sits in the
 * Next data cache (shared across regions and function instances on
 * Vercel) for SNAPSHOT_TTL_SECONDS. However many people open NVDA in
 * whatever language, the providers see at most one price request per
 * ticker per window. Failures throw and are therefore never cached; the
 * next request simply retries.
 */
export const SNAPSHOT_TTL_SECONDS = 3 * 60 * 60;

/** Calendar lookback — ~90 trading bars, same as the /indicators dashboard. */
const LOOKBACK_DAYS = 140;


async function buildSnapshot(ticker: string): Promise<StockSnapshot> {
  const { prices, sourceUrl } = await getHistoricalPrices(ticker, daysAgoIso(LOOKBACK_DAYS), todayIso(), {
    prefer: 'yahoo',
  });
  const usable = prices.filter((p) => p.close != null);
  if (usable.length < 30) {
    throw new Error(`not enough price history for ${ticker} (${usable.length} bars)`);
  }
  const closes = usable.map((p) => ({ time: p.time, close: p.close }));
  const dailyChanges = dailyChangesFromPrices(closes, BUCKET_TREND_LOOKBACK);
  const last = usable[usable.length - 1];
  return {
    ticker,
    asOf: last.time,
    close: last.close,
    changePct: dailyChanges[dailyChanges.length - 1]?.changePct ?? null,
    fiveDayChangePct: compound(dailyChanges),
    prices: closes,
    dailyChanges,
    dims: computeAllDimensions(usable),
    source: {
      name: sourceUrl.includes('yahoo.com') ? 'Yahoo Finance' : 'Valyu',
      url: sourceUrl.includes('yahoo.com')
        ? `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}`
        : 'https://www.valyu.ai',
    },
    fetchedAt: new Date().toISOString(),
  };
}

function compound(changes: Array<{ changePct: number | null }>): number | null {
  if (changes.length < BUCKET_TREND_LOOKBACK) return null;
  let factor = 1;
  let any = false;
  for (const c of changes) {
    if (c.changePct == null || !Number.isFinite(c.changePct)) continue;
    factor *= 1 + c.changePct / 100;
    any = true;
  }
  return any ? (factor - 1) * 100 : null;
}

const cachedSnapshot = unstable_cache(buildSnapshot, ['stock-snapshot-v2'], {
  revalidate: SNAPSHOT_TTL_SECONDS,
  tags: ['stock-snapshot'],
});

/** Cached snapshot, or null when every provider failed (rendered as "data unavailable"). */
export async function getStockSnapshot(ticker: string): Promise<StockSnapshot | null> {
  try {
    return await cachedSnapshot(ticker);
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/stocks',
        ticker,
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return null;
  }
}

/** Snapshots for several tickers in parallel; missing ones map to null. */
export async function getStockSnapshots(tickers: string[]): Promise<Map<string, StockSnapshot | null>> {
  const results = await Promise.all(tickers.map((t) => getStockSnapshot(t)));
  return new Map(tickers.map((t, i) => [t, results[i]]));
}
