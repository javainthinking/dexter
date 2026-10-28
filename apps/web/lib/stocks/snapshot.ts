import 'server-only';

import { unstable_cache } from 'next/cache';
import {
  BUCKET_TREND_LOOKBACK,
  computeAllDimensions,
  dailyChangesFromPrices,
  type DimensionReading,
} from '../indicators/compute';
import { localizedBucketLabels, DIMENSION_KEYS, type DimensionKey } from '../indicators/labels';
import { daysAgoIso, getHistoricalPrices, todayIso } from '../indicators/prices';
import type { SummaryEntry } from '../../components/indicators/summary-view';
import type { StockEntry } from './universe';

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

export interface StockSnapshot {
  ticker: string;
  asOf: string;
  close: number | null;
  changePct: number | null;
  /** Compounded return over the 5-bar window; null with fewer bars. */
  fiveDayChangePct: number | null;
  /** Daily closes, oldest → newest. */
  prices: Array<{ time: string; close: number | null }>;
  /** Last 5 daily changes, aligned with every bucketTrend. */
  dailyChanges: Array<{ time: string; changePct: number | null }>;
  dims: Record<DimensionKey, DimensionReading>;
  /** Provider that actually served the bars — cited on the page. */
  source: { name: string; url: string };
  fetchedAt: string;
}

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

/** Adapt a snapshot to the SummaryEntry shape the shared SignalTimeline renders. */
export function toSummaryEntry(
  snapshot: StockSnapshot,
  stock: StockEntry,
  lang: 'en' | 'zh',
): SummaryEntry {
  const dim = (k: DimensionKey) => ({
    bucket: snapshot.dims[k].bucket,
    bucketTrend: snapshot.dims[k].bucketTrend,
    bucketLabels: localizedBucketLabels(k, lang),
  });
  const entry = {
    ticker: stock.ticker,
    displayName: stock.name[lang],
    dailyChanges: snapshot.dailyChanges,
    latestClose: snapshot.close,
    latestAsOf: snapshot.asOf,
    prices: snapshot.prices,
  } as SummaryEntry;
  for (const k of DIMENSION_KEYS) entry[k] = dim(k);
  return entry;
}

/** Bullish / bearish / neutral counts across the 8 dimensions for the latest bar. */
export function latestTally(snapshot: StockSnapshot): { bullish: number; bearish: number; neutral: number } {
  const tally = { bullish: 0, bearish: 0, neutral: 0 };
  for (const k of DIMENSION_KEYS) tally[snapshot.dims[k].bucket] += 1;
  return tally;
}

export type Tone = 'bullish' | 'bearish' | 'mixed' | 'neutral';

/**
 * Overall tone: a side needs a 2-signal lead to win; without one it's
 * mixed only when both sides have signals, otherwise neutral.
 */
export function toneOf(tally: { bullish: number; bearish: number }): Tone {
  if (tally.bullish - tally.bearish >= 2) return 'bullish';
  if (tally.bearish - tally.bullish >= 2) return 'bearish';
  return tally.bullish > 0 && tally.bearish > 0 ? 'mixed' : 'neutral';
}
