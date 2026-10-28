/**
 * Per-dimension indicator computation shared by the authenticated
 * /api/indicators route and the public /stocks pages. Pure — no I/O —
 * so it can run in route handlers, server components and tests alike.
 */

import {
  bucketAdx,
  bucketBoll,
  bucketBollTrend,
  bucketFlow,
  bucketKdj,
  bucketMa,
  bucketMaTrend,
  bucketMacd,
  bucketRsi,
  bucketTrend,
  bucketVolume,
  computeAdx,
  computeBoll,
  computeFlow,
  computeKdj,
  computeMa,
  computeMacd,
  computeRsi,
  computeVolume,
  isLimitOrHaltBar,
  maskLimitDaysInTrend,
  type Bucket,
  type BucketSample,
  type PriceBar,
} from './math';
import { DIMENSION_KEYS, type DimensionKey } from './labels';

/**
 * Trailing window for the per-card bucket sparkline. 5 days matches
 * "trading week" mental model and is the maximum the badge can show
 * without crowding the bucket-label text. Tuneable here — every
 * dimension uses the same lookback so the trail is comparable across
 * tabs at a glance.
 */
export const BUCKET_TREND_LOOKBACK = 5;

export interface ComputeResult {
  series: unknown[];
  bucket: Bucket;
  bucketTrend: BucketSample[];
  latestExtras: Record<string, number | null>;
}

export function computeForDimension(dimension: string, prices: PriceBar[]): ComputeResult {
  const closes = prices.map((p) => p.close);
  const times = prices.map((p) => p.time);
  if (dimension === 'macd') {
    const rows = computeMacd(closes);
    const last = rows[rows.length - 1] ?? { dif: null, dea: null, hist: null };
    return {
      series: rows,
      bucket: bucketMacd(rows),
      bucketTrend: bucketTrend(rows, bucketMacd, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { dif: last.dif, dea: last.dea, hist: last.hist },
    };
  }
  if (dimension === 'ma') {
    const rows = computeMa(closes);
    const last = rows[rows.length - 1] ?? { ma5: null, ma20: null, ma60: null };
    return {
      series: rows,
      bucket: bucketMa(closes, rows),
      bucketTrend: bucketMaTrend(closes, rows, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { ma5: last.ma5, ma20: last.ma20, ma60: last.ma60 },
    };
  }
  if (dimension === 'volume') {
    const rows = computeVolume(prices);
    const last = rows[rows.length - 1] ?? { avgVol20: null, volRatio: null, direction: 0 };
    return {
      series: rows,
      bucket: bucketVolume(rows),
      bucketTrend: bucketTrend(rows, bucketVolume, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { avgVol20: last.avgVol20, volRatio: last.volRatio },
    };
  }
  if (dimension === 'rsi') {
    const rows = computeRsi(closes);
    const last = rows[rows.length - 1] ?? { rsi: null };
    return {
      series: rows,
      bucket: bucketRsi(rows),
      bucketTrend: bucketTrend(rows, bucketRsi, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { rsi: last.rsi },
    };
  }
  if (dimension === 'kdj') {
    const rows = computeKdj(prices);
    const last = rows[rows.length - 1] ?? { k: null, d: null, j: null };
    return {
      series: rows,
      bucket: bucketKdj(rows),
      bucketTrend: bucketTrend(rows, bucketKdj, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { k: last.k, d: last.d, j: last.j },
    };
  }
  if (dimension === 'boll') {
    const rows = computeBoll(closes);
    const last = rows[rows.length - 1] ?? { mid: null, upper: null, lower: null, bandwidth: null };
    return {
      series: rows,
      bucket: bucketBoll(closes, rows),
      bucketTrend: bucketBollTrend(closes, rows, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { mid: last.mid, upper: last.upper, lower: last.lower, bandwidth: last.bandwidth },
    };
  }
  if (dimension === 'adx') {
    const rows = computeAdx(prices);
    const last = rows[rows.length - 1] ?? { plusDi: null, minusDi: null, adx: null };
    return {
      series: rows,
      bucket: bucketAdx(rows),
      bucketTrend: bucketTrend(rows, bucketAdx, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { plusDi: last.plusDi, minusDi: last.minusDi, adx: last.adx },
    };
  }
  // flow
  const rows = computeFlow(prices);
  const last = rows[rows.length - 1] ?? { daily: null, cum20: null, cum5: null };
  return {
    series: rows,
    bucket: bucketFlow(rows),
    bucketTrend: bucketTrend(rows, bucketFlow, times, BUCKET_TREND_LOOKBACK),
    latestExtras: { dailyFlow: last.daily, cum20: last.cum20, cum5: last.cum5 },
  };
}

export interface DimensionReading {
  bucket: Bucket;
  bucketTrend: BucketSample[];
  latestExtras: Record<string, number | null>;
}

/**
 * Every dimension for one ticker in a single pass, with the same
 * limit-up / limit-down / halt masking the API route applies: a bar
 * whose high equals its low forces that day's bucket to neutral.
 */
export function computeAllDimensions(prices: PriceBar[]): Record<DimensionKey, DimensionReading> {
  const todayIsLimit = isLimitOrHaltBar(prices[prices.length - 1]);
  const out = {} as Record<DimensionKey, DimensionReading>;
  for (const key of DIMENSION_KEYS) {
    const result = computeForDimension(key, prices);
    out[key] = {
      bucket: todayIsLimit ? 'neutral' : result.bucket,
      bucketTrend: maskLimitDaysInTrend(prices, result.bucketTrend),
      latestExtras: result.latestExtras,
    };
  }
  return out;
}

/**
 * Last N daily percent changes, aligned with the bucket trail: entry i
 * is bar (n-N+i) paired with its change versus the previous close.
 */
export function dailyChangesFromPrices(
  prices: Array<{ time: string; close: number | null }>,
  lookback: number,
): Array<{ time: string; changePct: number | null }> {
  if (prices.length === 0) return [];
  const start = Math.max(1, prices.length - lookback);
  const out: Array<{ time: string; changePct: number | null }> = [];
  for (let i = start; i < prices.length; i++) {
    const cur = prices[i].close;
    const prev = prices[i - 1].close;
    const pct = cur != null && prev != null && prev !== 0 ? ((cur - prev) / prev) * 100 : null;
    out.push({ time: prices[i].time, changePct: pct });
  }
  return out;
}
