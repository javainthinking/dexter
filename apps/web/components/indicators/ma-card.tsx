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

interface MaRow {
  ma5: number | null;
  ma20: number | null;
  ma60: number | null;
}

interface MaEntry {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null }>;
  indicator?: MaRow[];
  bucket?: Bucket;
  bucketTrend?: BucketSample[];
  latest?: Record<string, number | null | string>;
  error?: string;
}

const BUCKET_LABELS = {
  bullish: { en: 'Bullish · MA aligned up', zh: '看多 · 多头排列' },
  bearish: { en: 'Bearish · MA aligned down', zh: '看空 · 空头排列' },
  neutral: { en: 'Neutral · MA tangled', zh: '待观察 · 均线缠绕' },
} as const;

export function MaCard({ entry, dict }: { entry: MaEntry; dict: any }) {
  if (entry.error || !entry.prices || !entry.indicator) {
    return <ErrorCard ticker={entry.ticker} displayName={entry.displayName} message={entry.error ?? 'no data'} />;
  }
  const isZh = dict.indicators?._localeHint === 'zh';
  const closes = entry.prices.map((p) => p.close);
  const ma5 = entry.indicator.map((r) => r.ma5);
  const ma20 = entry.indicator.map((r) => r.ma20);
  const ma60 = entry.indicator.map((r) => r.ma60);

  const asOf = entry.prices[entry.prices.length - 1]?.time ?? null;
  const latest = entry.latest ?? {};
  const close = latest.close as number | null;
  const lat5 = latest.ma5 as number | null;
  const lat20 = latest.ma20 as number | null;
  const lat60 = latest.ma60 as number | null;
  const dev = (target: number | null) => (close != null && target != null && target !== 0 ? ((close - target) / target) * 100 : null);

  const bucket = entry.bucket ?? 'neutral';
  const bucketLang = isZh ? 'zh' : 'en';
  const bucketLabel = BUCKET_LABELS[bucket][bucketLang];
  // Pre-localized labels for every bucket — the trail tooltip needs
  // them so a past bearish day shows "Bearish · MA aligned down"
  // (MA's dimension-specific phrasing) rather than just "bearish".
  const bucketLabels = {
    bullish: BUCKET_LABELS.bullish[bucketLang],
    bearish: BUCKET_LABELS.bearish[bucketLang],
    neutral: BUCKET_LABELS.neutral[bucketLang],
  };

  const W = 420;
  const H = 230;
  const range = rangeOf(closes, ma5, ma20, ma60);

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
          <MetricCell label="vs MA5" value={formatPct(dev(lat5))} tone={dev(lat5) != null ? (dev(lat5)! > 0 ? 'up' : 'down') : undefined} />
          <MetricCell label="vs MA20" value={formatPct(dev(lat20))} tone={dev(lat20) != null ? (dev(lat20)! > 0 ? 'up' : 'down') : undefined} />
          <MetricCell label="vs MA60" value={formatPct(dev(lat60))} tone={dev(lat60) != null ? (dev(lat60)! > 0 ? 'up' : 'down') : undefined} />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="none" className="block">
        <path d={buildPath(closes, W, H, range.min, range.max, 4, 6)} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
        <path d={buildPath(ma5, W, H, range.min, range.max, 4, 6)} fill="none" stroke="#60a5fa" strokeWidth="1" />
        <path d={buildPath(ma20, W, H, range.min, range.max, 4, 6)} fill="none" stroke="#f59e0b" strokeWidth="1" />
        <path d={buildPath(ma60, W, H, range.min, range.max, 4, 6)} fill="none" stroke="#a78bfa" strokeWidth="1" />
        {/* Legend */}
        <g transform={`translate(${W - 140}, 8)`}>
          <text x="0" y="0" fontSize="9" fill="currentColor" className="text-muted-foreground">price</text>
          <line x1="36" y1="-3" x2="50" y2="-3" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
          <text x="58" y="0" fontSize="9" fill="#60a5fa">MA5</text>
          <text x="82" y="0" fontSize="9" fill="#f59e0b">MA20</text>
          <text x="110" y="0" fontSize="9" fill="#a78bfa">MA60</text>
        </g>
      </svg>
    </CardShell>
  );
}
