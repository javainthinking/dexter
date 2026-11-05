/**
 * The /stocks snapshot shape and the pure helpers over it. Client-safe:
 * the cached fetch lives in ./snapshot (server-only), which re-exports
 * everything here.
 */
import type { DimensionReading } from '../indicators/compute';
import { localizedBucketLabels, DIMENSION_KEYS, type DimensionKey } from '../indicators/labels';
import type { SummaryEntry } from '../../components/indicators/summary-view';
import type { StockEntry } from './universe';

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
