'use client';

import * as React from 'react';
import {
  CardShell,
  ErrorCard,
  MetricCell,
  buildPath,
  formatNum,
  rangeOf,
  type Bucket,
  type BucketSample,
} from './card-shell';

interface KdjRow {
  k: number | null;
  d: number | null;
  j: number | null;
}

interface KdjEntry {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null }>;
  indicator?: KdjRow[];
  bucket?: Bucket;
  bucketTrend?: BucketSample[];
  latest?: Record<string, number | null | string>;
  error?: string;
}

const BUCKET_LABELS = {
  bullish: { en: 'Bullish · golden cross/oversold', zh: '看多 · 金叉/超卖' },
  bearish: { en: 'Bearish · death cross/overbought', zh: '看空 · 死叉/超买' },
  neutral: { en: 'Neutral · mid-range', zh: '中性 · 中位区' },
} as const;

export function KdjCard({ entry, dict }: { entry: KdjEntry; dict: any }) {
  if (entry.error || !entry.prices || !entry.indicator) {
    return <ErrorCard ticker={entry.ticker} displayName={entry.displayName} message={entry.error ?? 'no data'} />;
  }
  const isZh = dict.indicators?._localeHint === 'zh';
  const closes = entry.prices.map((p) => p.close);
  const k = entry.indicator.map((r) => r.k);
  const d = entry.indicator.map((r) => r.d);
  const j = entry.indicator.map((r) => r.j);

  const asOf = entry.prices[entry.prices.length - 1]?.time ?? null;
  const latest = entry.latest ?? {};
  const close = latest.close as number | null;
  const kNow = latest.k as number | null;
  const dNow = latest.d as number | null;
  const jNow = latest.j as number | null;

  const bucket = entry.bucket ?? 'neutral';
  const bucketLang = isZh ? 'zh' : 'en';
  const bucketLabel = BUCKET_LABELS[bucket][bucketLang];
  const bucketLabels = {
    bullish: BUCKET_LABELS.bullish[bucketLang],
    bearish: BUCKET_LABELS.bearish[bucketLang],
    neutral: BUCKET_LABELS.neutral[bucketLang],
  };

  const W = 420;
  const TOP_H = 130;
  const BOTTOM_H = 90;
  const TOTAL_H = TOP_H + BOTTOM_H + 12;
  const priceRange = rangeOf(closes);
  // KDJ K/D live in 0..100; J can shoot outside (negatives / >100) so
  // we let its range float — but pin the visible Y window to a sensible
  // -20..120 so K/D's 20 and 80 reference lines stay at consistent
  // positions across cards.
  const kdjMin = -20;
  const kdjMax = 120;
  const kdjY = (v: number) => BOTTOM_H - ((v - kdjMin) / (kdjMax - kdjMin)) * (BOTTOM_H - 4 * 2) - 4;

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
          <MetricCell label="K" value={formatNum(kNow, 1)} tone={kNow != null ? (kNow > 80 ? 'down' : kNow < 20 ? 'up' : undefined) : undefined} />
          <MetricCell label="D" value={formatNum(dNow, 1)} tone={dNow != null ? (dNow > 80 ? 'down' : dNow < 20 ? 'up' : undefined) : undefined} />
          <MetricCell label="J" value={formatNum(jNow, 1)} />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${TOTAL_H}`} width="100%" preserveAspectRatio="none" className="block">
        <path
          d={buildPath(closes, W, TOP_H, priceRange.min, priceRange.max, 4, 6)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground"
        />
        <g transform={`translate(0, ${TOP_H + 12})`}>
          {/* 80 overbought / 20 oversold reference */}
          <line x1={4} x2={W - 4} y1={kdjY(80)} y2={kdjY(80)} stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
          <line x1={4} x2={W - 4} y1={kdjY(20)} y2={kdjY(20)} stroke="#22c55e" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
          <line x1={4} x2={W - 4} y1={kdjY(50)} y2={kdjY(50)} stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground opacity-30" />
          <path d={buildPath(k, W, BOTTOM_H, kdjMin, kdjMax, 4, 4)} fill="none" stroke="#60a5fa" strokeWidth="1.25" />
          <path d={buildPath(d, W, BOTTOM_H, kdjMin, kdjMax, 4, 4)} fill="none" stroke="#f59e0b" strokeWidth="1.25" />
          <path d={buildPath(j, W, BOTTOM_H, kdjMin, kdjMax, 4, 4)} fill="none" stroke="#a78bfa" strokeWidth="1" />
          {/* Legend */}
          <g transform={`translate(${W - 100}, 12)`}>
            <text x="0" y="0" fontSize="9" fill="#60a5fa">K</text>
            <text x="20" y="0" fontSize="9" fill="#f59e0b">D</text>
            <text x="40" y="0" fontSize="9" fill="#a78bfa">J</text>
          </g>
        </g>
      </svg>
    </CardShell>
  );
}
