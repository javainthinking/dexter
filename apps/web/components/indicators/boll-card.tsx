'use client';

import * as React from 'react';
import {
  CardShell,
  ErrorCard,
  MetricCell,
  buildPath,
  formatNum,
  formatPct,
  rangeOf,
  type Bucket,
  type BucketSample,
} from './card-shell';

interface BollRow {
  mid: number | null;
  upper: number | null;
  lower: number | null;
  bandwidth: number | null;
}

interface BollEntry {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null }>;
  indicator?: BollRow[];
  bucket?: Bucket;
  bucketTrend?: BucketSample[];
  latest?: Record<string, number | null | string>;
  error?: string;
}

const BUCKET_LABELS = {
  bullish: { en: 'Bullish · riding upper band', zh: '看多 · 突破上轨' },
  bearish: { en: 'Bearish · piercing lower band', zh: '看空 · 跌破下轨' },
  neutral: { en: 'Neutral · within bands', zh: '中性 · 通道内运行' },
} as const;

export function BollCard({ entry, dict }: { entry: BollEntry; dict: any }) {
  if (entry.error || !entry.prices || !entry.indicator) {
    return <ErrorCard ticker={entry.ticker} displayName={entry.displayName} message={entry.error ?? 'no data'} />;
  }
  const isZh = dict.indicators?._localeHint === 'zh';
  const closes = entry.prices.map((p) => p.close);
  const mid = entry.indicator.map((r) => r.mid);
  const upper = entry.indicator.map((r) => r.upper);
  const lower = entry.indicator.map((r) => r.lower);

  const asOf = entry.prices[entry.prices.length - 1]?.time ?? null;
  const latest = entry.latest ?? {};
  const close = latest.close as number | null;
  const midNow = latest.mid as number | null;
  const upperNow = latest.upper as number | null;
  const lowerNow = latest.lower as number | null;
  const bandwidth = latest.bandwidth as number | null;
  // Position-in-band: 0% = at lower band, 100% = at upper band.
  // Gives users a single number "where am I inside the channel" that's
  // comparable across tickers regardless of absolute price scale.
  const posInBand =
    close != null && upperNow != null && lowerNow != null && upperNow !== lowerNow
      ? ((close - lowerNow) / (upperNow - lowerNow)) * 100
      : null;

  const bucket = entry.bucket ?? 'neutral';
  const bucketLang = isZh ? 'zh' : 'en';
  const bucketLabel = BUCKET_LABELS[bucket][bucketLang];
  const bucketLabels = {
    bullish: BUCKET_LABELS.bullish[bucketLang],
    bearish: BUCKET_LABELS.bearish[bucketLang],
    neutral: BUCKET_LABELS.neutral[bucketLang],
  };

  // Single-pane like the MA card — the bands and the price line share
  // the same y-scale so we want them overlaid.
  const W = 420;
  const H = 230;
  const range = rangeOf(closes, upper, lower);

  return (
    <CardShell
      ticker={entry.ticker}
      displayName={entry.displayName}
      asOf={asOf}
      bucket={bucket}
      bucketLabel={bucketLabel}
      bucketTrend={entry.bucketTrend}
      bucketLabels={bucketLabels}
      metrics={
        <>
          <MetricCell label={dict.indicators?.metrics?.latest ?? 'Last'} value={formatNum(close, 2)} />
          <MetricCell
            label="%B"
            value={formatPct(posInBand)}
            tone={posInBand != null ? (posInBand > 100 ? 'up' : posInBand < 0 ? 'down' : undefined) : undefined}
          />
          <MetricCell label="MID" value={formatNum(midNow, 2)} />
          <MetricCell label="BW %" value={formatPct(bandwidth)} />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="none" className="block">
        {/* Bands first so the price line draws on top of them. */}
        <path d={buildPath(upper, W, H, range.min, range.max, 4, 6)} fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
        <path d={buildPath(mid, W, H, range.min, range.max, 4, 6)} fill="none" stroke="#a78bfa" strokeWidth="1" />
        <path d={buildPath(lower, W, H, range.min, range.max, 4, 6)} fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
        <path d={buildPath(closes, W, H, range.min, range.max, 4, 6)} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
        {/* Legend */}
        <g transform={`translate(${W - 145}, 8)`}>
          <text x="0" y="0" fontSize="9" fill="currentColor" className="text-muted-foreground">price</text>
          <line x1="36" y1="-3" x2="50" y2="-3" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
          <text x="58" y="0" fontSize="9" fill="#f59e0b">UP</text>
          <text x="78" y="0" fontSize="9" fill="#a78bfa">MID</text>
          <text x="105" y="0" fontSize="9" fill="#f59e0b">LO</text>
        </g>
      </svg>
    </CardShell>
  );
}
