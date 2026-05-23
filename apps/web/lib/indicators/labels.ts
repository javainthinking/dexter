/**
 * Single source of truth for indicator-dimension labels.
 *
 * Before this module, the same data lived in two shapes:
 *   - Each card file declared a `BUCKET_LABELS` map for its own dim
 *     (8 near-identical declarations).
 *   - indicators-client.tsx re-declared the same data as a flattened
 *     `DIMENSION_BUCKET_LABELS` map so the Summary view could read
 *     all dimensions at once.
 *   - summary-view.tsx + ticker-detail-sheet.tsx independently
 *     declared `DIMENSION_KEYS` + `DIMENSION_FALLBACK_LABEL`.
 *
 * Now everything reads from here. Touching a label or adding a new
 * dimension means editing one file.
 *
 * Pure data + types — no JSX, no React. Lives under `lib/` so it can
 * be imported by route handlers later if needed (e.g., for server-side
 * tooltip rendering on a future PDF export).
 */

import type { Bucket } from './math';

/**
 * Every indicator dimension the dashboard ships. Order matters — it
 * defines column / tab order across the Summary table, summary tabs,
 * the modal's per-day grid, and the indicators-client fetch loop.
 *
 * To add a new dimension: append the key here, then TypeScript will
 * point at every Record<DimensionKey, …> that still needs a value.
 */
export const DIMENSION_KEYS = [
  'macd',
  'ma',
  'rsi',
  'kdj',
  'boll',
  'adx',
  'volume',
  'flow',
] as const;

export type DimensionKey = (typeof DIMENSION_KEYS)[number];

/**
 * Short column header / fallback label per dimension. Used when the
 * locale dictionary lookup misses (rare — older deployed dictionary).
 * Industry-standard acronyms across markets, so safe as English-only.
 */
export const DIMENSION_FALLBACK_LABEL: Record<DimensionKey, string> = {
  macd: 'MACD',
  ma: 'MA',
  rsi: 'RSI',
  kdj: 'KDJ',
  boll: 'BOLL',
  adx: 'ADX',
  volume: 'Vol',
  flow: 'Flow',
};

/**
 * Pre-localised reason copy keyed by (dimension, bucket, language).
 * Card pills and bucket-trail tooltips both read from this so a past
 * bullish day on a MACD card shows "Bullish · golden cross" — the
 * MACD-specific phrasing — instead of just "bullish".
 *
 * `en` is the canonical English; `zh` covers both zh-CN and zh-TW
 * surfaces (we use `_localeHint` to switch — see card files).
 */
export const DIMENSION_BUCKET_LABELS: Record<
  DimensionKey,
  Record<Bucket, { en: string; zh: string }>
> = {
  macd: {
    bullish: { en: 'Bullish · golden cross', zh: '看多 · 金叉/红柱放大' },
    bearish: { en: 'Bearish · death cross', zh: '看空 · 死叉/绿柱放大' },
    neutral: { en: 'Neutral', zh: '待观察' },
  },
  ma: {
    bullish: { en: 'Bullish · MA aligned up', zh: '看多 · 多头排列' },
    bearish: { en: 'Bearish · MA aligned down', zh: '看空 · 空头排列' },
    neutral: { en: 'Neutral · MA tangled', zh: '待观察 · 均线缠绕' },
  },
  rsi: {
    bullish: { en: 'Bullish · oversold', zh: '看多 · 超卖反弹' },
    bearish: { en: 'Bearish · overbought', zh: '看空 · 超买回落' },
    neutral: { en: 'Neutral · in range', zh: '中性 · 区间内' },
  },
  kdj: {
    bullish: { en: 'Bullish · golden cross/oversold', zh: '看多 · 金叉/超卖' },
    bearish: { en: 'Bearish · death cross/overbought', zh: '看空 · 死叉/超买' },
    neutral: { en: 'Neutral · mid-range', zh: '中性 · 中位区' },
  },
  boll: {
    bullish: { en: 'Bullish · riding upper band', zh: '看多 · 突破上轨' },
    bearish: { en: 'Bearish · piercing lower band', zh: '看空 · 跌破下轨' },
    neutral: { en: 'Neutral · within bands', zh: '中性 · 通道内运行' },
  },
  adx: {
    bullish: { en: 'Bullish · trending up', zh: '看多 · 上升趋势' },
    bearish: { en: 'Bearish · trending down', zh: '看空 · 下降趋势' },
    neutral: { en: 'Neutral · no trend', zh: '中性 · 无趋势' },
  },
  volume: {
    bullish: { en: 'Bullish · heavy buying', zh: '看多 · 放量上涨' },
    bearish: { en: 'Bearish · heavy selling', zh: '看空 · 放量下跌' },
    neutral: { en: 'Neutral · light volume', zh: '待观察 · 缩量整理' },
  },
  flow: {
    // Synthetic direction proxy — not real institutional / Level-2
    // order flow. The "(估算)" suffix and "est." prefix exist to flag
    // that distinction in user-visible copy. See flow-card.tsx comment.
    bullish: { en: 'Bullish · est. inflow', zh: '看多 · 资金流入(估算)' },
    bearish: { en: 'Bearish · est. outflow', zh: '看空 · 资金流出(估算)' },
    neutral: { en: 'Neutral · choppy', zh: '震荡 · 方向不明' },
  },
};

/**
 * Resolve the full bucket-label triple for a dimension at a given
 * language — the cards need this shape to pass `bucketLabels` through
 * to CardShell for the trail-dot tooltips.
 *
 * Returns `{ bullish, bearish, neutral }` as flat strings — no more
 * `[lang]` indirection at the call site.
 */
export function localizedBucketLabels(
  dim: DimensionKey,
  lang: 'en' | 'zh',
): Record<Bucket, string> {
  const labels = DIMENSION_BUCKET_LABELS[dim];
  return {
    bullish: labels.bullish[lang],
    bearish: labels.bearish[lang],
    neutral: labels.neutral[lang],
  };
}
