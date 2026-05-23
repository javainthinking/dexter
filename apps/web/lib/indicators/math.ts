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
// RSI (Relative Strength Index, Wilder)
// ---------------------------------------------------------------------------

export interface RsiRow {
  /** Classic 14-bar RSI. */
  rsi: number | null;
}

export function computeRsi(
  closes: Array<number | null>,
  period = 14,
): RsiRow[] {
  const out: RsiRow[] = new Array(closes.length).fill(null).map(() => ({ rsi: null }));
  if (closes.length < period + 1) return out;
  let avgGain = 0;
  let avgLoss = 0;
  let seeded = false;
  let runGain = 0;
  let runLoss = 0;
  let runCount = 0;
  for (let i = 1; i < closes.length; i++) {
    const cur = closes[i];
    const prev = closes[i - 1];
    if (cur == null || prev == null) continue;
    const diff = cur - prev;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    if (!seeded) {
      runGain += gain;
      runLoss += loss;
      runCount += 1;
      if (runCount === period) {
        avgGain = runGain / period;
        avgLoss = runLoss / period;
        seeded = true;
        out[i] = { rsi: rsiFrom(avgGain, avgLoss) };
      }
      continue;
    }
    // Wilder smoothing: prior_avg × (n-1)/n + new_value × 1/n
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    out[i] = { rsi: rsiFrom(avgGain, avgLoss) };
  }
  return out;
}

function rsiFrom(avgGain: number, avgLoss: number): number {
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export function bucketRsi(rows: RsiRow[]): Bucket {
  const n = rows.length;
  if (n === 0) return 'neutral';
  const cur = rows[n - 1].rsi;
  if (cur == null) return 'neutral';
  // Classic 70/30 cutoffs. Above 70 = overbought = mean-reversion
  // pressure down = bearish; below 30 = oversold = mean-reversion up
  // = bullish. The bucket reflects "what the indicator suggests will
  // happen next," not "what the indicator says about momentum now."
  if (cur >= 70) return 'bearish';
  if (cur <= 30) return 'bullish';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// KDJ (Stochastic Oscillator with J line — Chinese-market default)
// ---------------------------------------------------------------------------

export interface KdjRow {
  k: number | null;
  d: number | null;
  j: number | null;
}

/**
 * KDJ uses the 9-period high/low range. Default smoothing for K and D
 * is 3 — the standard "KDJ(9, 3, 3)" presets every A-share charting
 * app ships with. We compute via the canonical recursive smoothing
 * (a.k.a. Chinese-domain SMA):
 *   RSV = (close - low_n) / (high_n - low_n) × 100
 *   K   = (2 × prevK + RSV) / 3
 *   D   = (2 × prevD + K)   / 3
 *   J   = 3K - 2D
 */
export function computeKdj(prices: PriceBar[], period = 9): KdjRow[] {
  const out: KdjRow[] = new Array(prices.length).fill(null).map(() => ({ k: null, d: null, j: null }));
  let prevK = 50;
  let prevD = 50;
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) continue;
    let hi = -Infinity;
    let lo = Infinity;
    let valid = true;
    for (let j = i - period + 1; j <= i; j++) {
      const h = prices[j].high;
      const l = prices[j].low;
      if (h == null || l == null) {
        valid = false;
        break;
      }
      if (h > hi) hi = h;
      if (l < lo) lo = l;
    }
    const close = prices[i].close;
    if (!valid || close == null || hi === lo) {
      // hi === lo means the window was flat (e.g. limit-up day with
      // no range); we hold prevK/prevD instead of dividing by zero.
      out[i] = { k: prevK, d: prevD, j: 3 * prevK - 2 * prevD };
      continue;
    }
    const rsv = ((close - lo) / (hi - lo)) * 100;
    const k = (2 * prevK + rsv) / 3;
    const d = (2 * prevD + k) / 3;
    const j = 3 * k - 2 * d;
    out[i] = { k, d, j };
    prevK = k;
    prevD = d;
  }
  return out;
}

export function bucketKdj(rows: KdjRow[]): Bucket {
  const n = rows.length;
  if (n < 2) return 'neutral';
  const cur = rows[n - 1];
  const prev = rows[n - 2];
  if (cur.k == null || cur.d == null || prev.k == null || prev.d == null) return 'neutral';
  // Golden cross in oversold zone (both K and D below 30) is a strong
  // buy signal; death cross in overbought (above 70) is a strong sell.
  // Plain crosses outside these zones still produce a bucket but with
  // less conviction — kept as a fallthrough so daily-grade signals
  // still show up.
  const goldenCross = prev.k <= prev.d && cur.k > cur.d;
  const deathCross = prev.k >= prev.d && cur.k < cur.d;
  if (goldenCross && cur.k < 50) return 'bullish';
  if (deathCross && cur.k > 50) return 'bearish';
  // No cross — read position. Below 20 = oversold, above 80 = overbought
  // (KDJ's stricter thresholds, vs RSI's 30/70).
  if (cur.k < 20 && cur.d < 20) return 'bullish';
  if (cur.k > 80 && cur.d > 80) return 'bearish';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// BOLL (Bollinger Bands)
// ---------------------------------------------------------------------------

export interface BollRow {
  /** Middle band — simple moving average of close. */
  mid: number | null;
  upper: number | null;
  lower: number | null;
  /** (upper - lower) / mid × 100 — band-width %, useful for squeeze detection. */
  bandwidth: number | null;
}

export function computeBoll(
  closes: Array<number | null>,
  period = 20,
  stdevMult = 2,
): BollRow[] {
  const mid = sma(closes, period);
  const out: BollRow[] = new Array(closes.length).fill(null).map(() => ({
    mid: null,
    upper: null,
    lower: null,
    bandwidth: null,
  }));
  for (let i = period - 1; i < closes.length; i++) {
    const m = mid[i];
    if (m == null) continue;
    let sumSq = 0;
    let count = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const v = closes[j];
      if (v == null) continue;
      const diff = v - m;
      sumSq += diff * diff;
      count += 1;
    }
    if (count === 0) continue;
    const stdev = Math.sqrt(sumSq / count);
    const upper = m + stdevMult * stdev;
    const lower = m - stdevMult * stdev;
    out[i] = {
      mid: m,
      upper,
      lower,
      bandwidth: m !== 0 ? ((upper - lower) / m) * 100 : null,
    };
  }
  return out;
}

export function bucketBoll(closes: Array<number | null>, rows: BollRow[]): Bucket {
  const n = closes.length;
  if (n === 0) return 'neutral';
  const c = closes[n - 1];
  const r = rows[n - 1];
  if (c == null || r.upper == null || r.lower == null || r.mid == null) return 'neutral';
  // Walk the upper band = strong trend up; bounce off lower = strong
  // trend down. Mid-band crossings are noisy so they stay neutral.
  if (c >= r.upper) return 'bullish';
  if (c <= r.lower) return 'bearish';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// ADX / DMI (Average Directional Index, Wilder)
// ---------------------------------------------------------------------------

export interface AdxRow {
  /** Positive directional indicator (DI+). */
  plusDi: number | null;
  /** Negative directional indicator (DI−). */
  minusDi: number | null;
  /** ADX — trend strength, 0–100, ≥25 typically means "trending." */
  adx: number | null;
}

export function computeAdx(prices: PriceBar[], period = 14): AdxRow[] {
  const n = prices.length;
  const out: AdxRow[] = new Array(n).fill(null).map(() => ({ plusDi: null, minusDi: null, adx: null }));
  if (n < period + 1) return out;

  // Per-bar TR (true range), +DM, -DM
  const tr: Array<number | null> = new Array(n).fill(null);
  const plusDm: Array<number | null> = new Array(n).fill(null);
  const minusDm: Array<number | null> = new Array(n).fill(null);
  for (let i = 1; i < n; i++) {
    const h = prices[i].high;
    const l = prices[i].low;
    const ph = prices[i - 1].high;
    const pl = prices[i - 1].low;
    const pc = prices[i - 1].close;
    if (h == null || l == null || ph == null || pl == null || pc == null) continue;
    tr[i] = Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc));
    const upMove = h - ph;
    const downMove = pl - l;
    plusDm[i] = upMove > downMove && upMove > 0 ? upMove : 0;
    minusDm[i] = downMove > upMove && downMove > 0 ? downMove : 0;
  }

  // Wilder-smoothed sums (length-`period` accumulator that decays each bar)
  const smoothTr: Array<number | null> = new Array(n).fill(null);
  const smoothPlusDm: Array<number | null> = new Array(n).fill(null);
  const smoothMinusDm: Array<number | null> = new Array(n).fill(null);

  // Seed by summing bars 1..period.
  let sumTr = 0;
  let sumPlus = 0;
  let sumMinus = 0;
  for (let i = 1; i <= period; i++) {
    if (tr[i] == null) return out;
    sumTr += tr[i] as number;
    sumPlus += plusDm[i] as number;
    sumMinus += minusDm[i] as number;
  }
  smoothTr[period] = sumTr;
  smoothPlusDm[period] = sumPlus;
  smoothMinusDm[period] = sumMinus;

  for (let i = period + 1; i < n; i++) {
    const prevTr = smoothTr[i - 1];
    const prevPlus = smoothPlusDm[i - 1];
    const prevMinus = smoothMinusDm[i - 1];
    const curTr = tr[i];
    const curPlus = plusDm[i];
    const curMinus = minusDm[i];
    if (prevTr == null || prevPlus == null || prevMinus == null || curTr == null || curPlus == null || curMinus == null) {
      continue;
    }
    smoothTr[i] = prevTr - prevTr / period + curTr;
    smoothPlusDm[i] = prevPlus - prevPlus / period + curPlus;
    smoothMinusDm[i] = prevMinus - prevMinus / period + curMinus;
  }

  // DI+, DI-, DX per bar (from index `period`).
  const dx: Array<number | null> = new Array(n).fill(null);
  for (let i = period; i < n; i++) {
    const st = smoothTr[i];
    const sp = smoothPlusDm[i];
    const sm = smoothMinusDm[i];
    if (st == null || sp == null || sm == null || st === 0) continue;
    const plusDi = (sp / st) * 100;
    const minusDi = (sm / st) * 100;
    const sumDi = plusDi + minusDi;
    const d = sumDi !== 0 ? (Math.abs(plusDi - minusDi) / sumDi) * 100 : 0;
    dx[i] = d;
    out[i].plusDi = plusDi;
    out[i].minusDi = minusDi;
  }

  // ADX = Wilder-smoothed DX, seeded with simple avg of first `period` DX values.
  const firstDxIndex = period;
  const adxSeedEnd = firstDxIndex + period - 1;
  if (adxSeedEnd >= n) return out;
  let dxSum = 0;
  for (let i = firstDxIndex; i <= adxSeedEnd; i++) {
    const v = dx[i];
    if (v == null) return out;
    dxSum += v;
  }
  let adxVal = dxSum / period;
  out[adxSeedEnd].adx = adxVal;
  for (let i = adxSeedEnd + 1; i < n; i++) {
    const v = dx[i];
    if (v == null) continue;
    adxVal = (adxVal * (period - 1) + v) / period;
    out[i].adx = adxVal;
  }
  return out;
}

export function bucketAdx(rows: AdxRow[]): Bucket {
  const n = rows.length;
  if (n === 0) return 'neutral';
  const cur = rows[n - 1];
  if (cur.adx == null || cur.plusDi == null || cur.minusDi == null) return 'neutral';
  // ADX < 20 = no real trend, sit it out.
  if (cur.adx < 20) return 'neutral';
  // Trending: direction comes from which DI line is on top.
  if (cur.plusDi > cur.minusDi) return 'bullish';
  if (cur.minusDi > cur.plusDi) return 'bearish';
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

/**
 * BOLL also reads from `closes` to compare today's price to the bands,
 * so it needs the same closes-aware adapter that MA uses.
 */
export function bucketBollTrend(
  closes: Array<number | null>,
  rows: BollRow[],
  times: string[],
  lookback: number,
): BucketSample[] {
  return bucketTrend(
    rows,
    (rs) => bucketBoll(closes.slice(0, rs.length), rs),
    times,
    lookback,
  );
}

// ---------------------------------------------------------------------------
// Limit-up / limit-down / halt masking
// ---------------------------------------------------------------------------

/**
 * A trading bar where `high === low` is a structural no-information day:
 *   - A-share / ChiNext / STAR limit-up or limit-down (price pinned at
 *     ±10% / ±20% / ±5% from previous close, no intraday range)
 *   - A trading halt (停牌) that the data vendor fills forward as a
 *     flat OHLC bar
 *   - Extremely illiquid bars with a single print (rare on US daily bars
 *     but possible on micro-caps)
 *
 * On these days every range-aware indicator (KDJ's RSV, ADX's TR, BOLL's
 * standard deviation, Volume's direction signal) is mathematically
 * degenerate or trivially zero — feeding them into the bucket function
 * produces a confident-looking signal from no real input.
 *
 * We can't detect this from `closes[]` alone (a flat close just means
 * "didn't move"), so callers must pass `PriceBar[]` for the check to
 * actually fire.
 */
export function isLimitOrHaltBar(p: PriceBar | undefined | null): boolean {
  if (!p) return false;
  if (p.high == null || p.low == null) return false;
  return p.high === p.low;
}

/**
 * Mask every bucket-trend sample whose date corresponds to a limit-up /
 * limit-down / halt bar, forcing it to `neutral`. Applied once in the
 * route layer so the same defence covers all 8 indicator dimensions
 * without each `bucketXxx` function having to know about market
 * microstructure.
 *
 * Returns a new array; the input is not mutated.
 */
export function maskLimitDaysInTrend(
  prices: PriceBar[],
  samples: BucketSample[],
): BucketSample[] {
  if (samples.length === 0) return samples;
  const limitTimes = new Set<string>();
  for (const p of prices) {
    if (isLimitOrHaltBar(p)) limitTimes.add(p.time);
  }
  if (limitTimes.size === 0) return samples;
  return samples.map((s) =>
    limitTimes.has(s.time) ? { ...s, bucket: 'neutral' as const } : s,
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
