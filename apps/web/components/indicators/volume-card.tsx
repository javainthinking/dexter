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

interface VolumeRow {
  avgVol20: number | null;
  volRatio: number | null;
  direction: -1 | 0 | 1;
}

interface VolumeEntry {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null; volume: number | null }>;
  indicator?: VolumeRow[];
  bucket?: Bucket;
  bucketTrend?: BucketSample[];
  latest?: Record<string, number | null | string>;
  error?: string;
}

const BUCKET_LABELS = {
  bullish: { en: 'Bullish · heavy buying', zh: '看多 · 放量上涨' },
  bearish: { en: 'Bearish · heavy selling', zh: '看空 · 放量下跌' },
  neutral: { en: 'Neutral · light volume', zh: '待观察 · 缩量整理' },
} as const;

export function VolumeCard({ entry, dict }: { entry: VolumeEntry; dict: any }) {
  if (entry.error || !entry.prices || !entry.indicator) {
    return <ErrorCard ticker={entry.ticker} displayName={entry.displayName} message={entry.error ?? 'no data'} />;
  }
  const isZh = dict.indicators?._localeHint === 'zh';
  const closes = entry.prices.map((p) => p.close);
  const volumes = entry.prices.map((p) => p.volume);
  const directions = entry.indicator.map((r) => r.direction);

  const asOf = entry.prices[entry.prices.length - 1]?.time ?? null;
  const latest = entry.latest ?? {};
  const close = latest.close as number | null;
  const changePct = latest.changePct as number | null;
  const avgVol = latest.avgVol20 as number | null;
  const ratio = latest.volRatio as number | null;

  // 5-day cumulative pct change
  const n = closes.length;
  let cum5: number | null = null;
  if (n >= 6 && closes[n - 1] != null && closes[n - 6] != null) {
    cum5 = ((closes[n - 1]! - closes[n - 6]!) / closes[n - 6]!) * 100;
  }

  const bucket = entry.bucket ?? 'neutral';
  const bucketLang = isZh ? 'zh' : 'en';
  const bucketLabel = BUCKET_LABELS[bucket][bucketLang];
  // Pre-localized labels for every bucket — the trail tooltip needs
  // them so a past bearish day shows "Bearish · heavy selling"
  // (Volume's dimension-specific phrasing) rather than just "bearish".
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
  const volRange = rangeOf(volumes);
  const stepX = (W - 8) / Math.max(1, closes.length - 1);

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
          <MetricCell label="Avg Vol 20" value={formatNum(avgVol, 0)} />
          <MetricCell label="Vol Ratio" value={formatNum(ratio, 2)} tone={ratio != null && ratio >= 1.5 ? 'up' : undefined} />
          <MetricCell label="5D %" value={formatPct(cum5)} tone={cum5 != null ? (cum5 > 0 ? 'up' : 'down') : undefined} />
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
          {volumes.map((v, i) => {
            if (v == null) return null;
            const x = 4 + i * stepX;
            const h = ((v - volRange.min) / Math.max(1, volRange.max - volRange.min)) * (BOTTOM_H - 4);
            const y = BOTTOM_H - h;
            const color = directions[i] > 0 ? '#ef4444' : directions[i] < 0 ? '#22c55e' : '#94a3b8';
            return <rect key={i} x={x - stepX / 2.5} y={y} width={Math.max(1, stepX * 0.6)} height={h} fill={color} />;
          })}
        </g>
      </svg>
    </CardShell>
  );
}
