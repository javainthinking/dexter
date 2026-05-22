/**
 * Pure deterministic math for the technical-indicator dashboards.
 *
 * Every function takes a `closes[]` (or `prices[]`) array assumed to be in
 * ASCENDING chronological order — index 0 is the oldest bar, the last index
 * is the latest. The rest of the codebase enforces this invariant in the
 * Yahoo/Valyu/FinDatasets adapters.
 *
 * Output arrays match the input length one-to-one (no truncation). Leading
 * values that can't be computed yet (e.g. the first 12 bars of EMA(12)) come
 * back as `null` so chart code can render gaps rather than fake zeros.
 */

export type Bucket = 'bullish' | 'bearish' | 'neutral';

export interface PriceBar {
  time: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

function ema(values: Array<number | null>, period: number): Array<number | null> {
  const out: Array<number | null> = new Array(values.length).fill(null);
  const k = 2 / (period + 1);
  let prev: number | null = null;
  let seeded = false;
  let runSum = 0;
  let runCount = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null) {
      out[i] = prev;
      continue;
    }
    if (!seeded) {
      runSum += v;
      runCount += 1;
      if (runCount === period) {
        prev = runSum / period;
        out[i] = prev;
        seeded = true;
      }
      continue;
    }
    prev = (v - (prev as number)) * k + (prev as number);
    out[i] = prev;
  }
  return out;
}

function sma(values: Array<number | null>, period: number): Array<number | null> {
  const out: Array<number | null> = new Array(values.length).fill(null);
  let sum = 0;
  let count = 0;
  const window: Array<number> = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null) {
      out[i] = null;
      continue;
    }
    window.push(v);
    sum += v;
    count += 1;
    if (window.length > period) {
      sum -= window.shift() as number;
      count -= 1;
    }
    if (window.length === period) {
      out[i] = sum / period;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// MACD
// ---------------------------------------------------------------------------

export interface MacdRow {
  dif: number | null;
  dea: number | null;
  hist: number | null;
}

export function computeMacd(
  closes: Array<number | null>,
  fast = 12,
  slow = 26,
  signal = 9,
): MacdRow[] {
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const dif = closes.map((_, i) => {
    const f = emaFast[i];
    const s = emaSlow[i];
    return f != null && s != null ? f - s : null;
  });
  const dea = ema(dif, signal);
  return closes.map((_, i) => {
    const d = dif[i];
    const e = dea[i];
    return {
      dif: d,
      dea: e,
      hist: d != null && e != null ? (d - e) * 2 : null,
    };
  });
}

export function bucketMacd(rows: MacdRow[]): Bucket {
  const n = rows.length;
  if (n < 2) return 'neutral';
  const cur = rows[n - 1];
  const prev = rows[n - 2];
  if (cur.hist == null || prev.hist == null || cur.dif == null || cur.dea == null) return 'neutral';
  const goldenCross = prev.dif != null && prev.dea != null && prev.dif <= prev.dea && cur.dif > cur.dea;
  const deathCross = prev.dif != null && prev.dea != null && prev.dif >= prev.dea && cur.dif < cur.dea;
  if (goldenCross) return 'bullish';
  if (deathCross) return 'bearish';
  if (cur.hist > 0 && cur.hist > prev.hist) return 'bullish';
  if (cur.hist < 0 && cur.hist < prev.hist) return 'bearish';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// Moving averages
// ---------------------------------------------------------------------------

export interface MaRow {
  ma5: number | null;
  ma20: number | null;
  ma60: number | null;
}

export function computeMa(closes: Array<number | null>): MaRow[] {
  const ma5 = sma(closes, 5);
  const ma20 = sma(closes, 20);
  const ma60 = sma(closes, 60);
  return closes.map((_, i) => ({ ma5: ma5[i], ma20: ma20[i], ma60: ma60[i] }));
}

export function bucketMa(closes: Array<number | null>, rows: MaRow[]): Bucket {
  const n = closes.length;
  if (n === 0) return 'neutral';
  const c = closes[n - 1];
  const r = rows[n - 1];
  if (c == null || r.ma5 == null || r.ma20 == null || r.ma60 == null) return 'neutral';
  if (c > r.ma5 && r.ma5 > r.ma20 && r.ma20 > r.ma60) return 'bullish';
  if (c < r.ma5 && r.ma5 < r.ma20 && r.ma20 < r.ma60) return 'bearish';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// Volume / price relationship
// ---------------------------------------------------------------------------

export interface VolumeRow {
  /** 20-day rolling average volume (null until 20 bars are seen). */
  avgVol20: number | null;
  /** Today's volume / avgVol20. > 1 = expansion, < 1 = contraction. */
  volRatio: number | null;
  /** Sign of close − prev_close: +1 up, −1 down, 0 flat. */
  direction: -1 | 0 | 1;
}

export function computeVolume(prices: PriceBar[]): VolumeRow[] {
  const volumes = prices.map((p) => (p.volume == null ? null : p.volume));
  const avg = sma(volumes, 20);
  const out: VolumeRow[] = [];
  for (let i = 0; i < prices.length; i++) {
    const v = volumes[i];
    const a = avg[i];
    const ratio = v != null && a != null && a > 0 ? v / a : null;
    const prev = i > 0 ? prices[i - 1].close : null;
    const cur = prices[i].close;
    const dir: -1 | 0 | 1 = cur != null && prev != null ? (cur > prev ? 1 : cur < prev ? -1 : 0) : 0;
    out.push({ avgVol20: a, volRatio: ratio, direction: dir });
  }
  return out;
}

export function bucketVolume(rows: VolumeRow[]): Bucket {
  const n = rows.length;
  if (n === 0) return 'neutral';
  // Look at the last 5 bars: count "heavy & up" vs "heavy & down".
  const tail = rows.slice(Math.max(0, n - 5));
  let bullish = 0;
  let bearish = 0;
  for (const r of tail) {
    if (r.volRatio != null && r.volRatio >= 1.5) {
      if (r.direction > 0) bullish += 1;
      if (r.direction < 0) bearish += 1;
    }
  }
  if (bullish >= 2 && bullish > bearish) return 'bullish';
  if (bearish >= 2 && bearish > bullish) return 'bearish';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// Capital flow proxy
// ---------------------------------------------------------------------------

export interface FlowRow {
  /** sign(close − prev_close) × volume × close. Positive = inferred inflow. */
  daily: number | null;
  /** Trailing 20-day cumulative inflow. */
  cum20: number | null;
  /** Trailing 5-day cumulative inflow. */
  cum5: number | null;
}

export function computeFlow(prices: PriceBar[]): FlowRow[] {
  const daily: Array<number | null> = prices.map((p, i) => {
    const prev = i > 0 ? prices[i - 1].close : null;
    if (p.close == null || prev == null || p.volume == null) return null;
    const sign = p.close > prev ? 1 : p.close < prev ? -1 : 0;
    return sign * p.volume * p.close;
  });
  const cum = (window: number): Array<number | null> => {
    const out: Array<number | null> = new Array(daily.length).fill(null);
    let sum = 0;
    const q: Array<number> = [];
    for (let i = 0; i < daily.length; i++) {
      const v = daily[i];
      if (v == null) {
        out[i] = null;
        continue;
      }
      q.push(v);
      sum += v;
      if (q.length > window) sum -= q.shift() as number;
      if (q.length === window) out[i] = sum;
    }
    return out;
  };
  const cum20 = cum(20);
  const cum5 = cum(5);
  return daily.map((d, i) => ({ daily: d, cum20: cum20[i], cum5: cum5[i] }));
}

export function bucketFlow(rows: FlowRow[]): Bucket {
  const n = rows.length;
  if (n === 0) return 'neutral';
  const cur = rows[n - 1];
  if (cur.cum20 == null || cur.cum5 == null) return 'neutral';
  // "Significantly" positive or negative — require both windows agree in sign.
  if (cur.cum20 > 0 && cur.cum5 > 0) return 'bullish';
  if (cur.cum20 < 0 && cur.cum5 < 0) return 'bearish';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// Bucket trend — historical signal for the last N trading bars
// ---------------------------------------------------------------------------

/**
 * Sample of the bucket signal at a single past trading bar. Returned
 * by `bucketTrend` so a card can render a multi-day sparkline of
 * bullish/bearish/neutral states instead of only "today's call".
 */
export interface BucketSample {
  /** Bar date (ISO YYYY-MM-DD) — matches the corresponding price bar. */
  time: string;
  bucket: Bucket;
}

/**
 * Compute the bucket at each of the last `lookback` bars by
 * "rewinding" the indicator rows to that bar's index and running the
 * existing per-dimension bucket function.
 *
 * Why this is correct (and why it doesn't need re-fetching backdated
 * prices): every per-bar row produced by computeMacd / computeMa /
 * computeVolume / computeFlow uses only data from `prices[0..i]` — so
 * slicing the rows array at index `i` and feeding the head into the
 * bucket fn yields the *same* bucket value you'd get if you had
 * requested OHLCV with end_date = bars[i].time and computed fresh.
 *
 * Returned samples are ordered oldest → newest (i.e. last element is
 * "today"). Length is `min(lookback, validBars)`; if there aren't
 * enough bars to satisfy the bucket fn's tail requirement at a given
 * position the bucket fn already returns 'neutral' for that slice, so
 * the trend degrades gracefully near the start of the series.
 */
export function bucketTrend<Row>(
  rows: Row[],
  bucketFn: (rs: Row[]) => Bucket,
  times: string[],
  lookback: number,
): BucketSample[] {
  const n = rows.length;
  if (n === 0 || lookback <= 0) return [];
  const start = Math.max(0, n - lookback);
  const out: BucketSample[] = [];
  for (let i = start; i < n; i++) {
    out.push({
      time: times[i] ?? '',
      // Slice end-exclusive: bucket as of bar `i` sees rows[0..i].
      bucket: bucketFn(rows.slice(0, i + 1)),
    });
  }
  return out;
}

/**
 * MA needs the closes array alongside the rows. This thin adapter
 * wraps `bucketMa` so `bucketTrend` can use the generic signature.
 * (MACD / Volume / Flow's bucket fns already match `(rows) => Bucket`.)
 */
export function bucketMaTrend(
  closes: Array<number | null>,
  rows: MaRow[],
  times: string[],
  lookback: number,
): BucketSample[] {
  return bucketTrend(
    rows,
    (rs) => bucketMa(closes.slice(0, rs.length), rs),
    times,
    lookback,
  );
}

// ---------------------------------------------------------------------------
// Latest-bar helpers
// ---------------------------------------------------------------------------

/**
 * Compute the standard "metrics row" shown on every indicator card:
 * latest close, day change %, and the source bar's date.
 */
export function latestSummary(prices: PriceBar[]): {
  asOf: string | null;
  close: number | null;
  change: number | null;
  changePct: number | null;
} {
  const n = prices.length;
  if (n === 0) return { asOf: null, close: null, change: null, changePct: null };
  const cur = prices[n - 1];
  const prev = n >= 2 ? prices[n - 2] : null;
  const change = cur.close != null && prev?.close != null ? cur.close - prev.close : null;
  const changePct = change != null && prev?.close ? (change / prev.close) * 100 : null;
  return { asOf: cur.time, close: cur.close, change, changePct };
}
