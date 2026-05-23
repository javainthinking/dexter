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

interface AdxRow {
  plusDi: number | null;
  minusDi: number | null;
  adx: number | null;
}

interface AdxEntry {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null }>;
  indicator?: AdxRow[];
  bucket?: Bucket;
  bucketTrend?: BucketSample[];
  latest?: Record<string, number | null | string>;
  error?: string;
}

const BUCKET_LABELS = {
  bullish: { en: 'Bullish · trending up', zh: '看多 · 上升趋势' },
  bearish: { en: 'Bearish · trending down', zh: '看空 · 下降趋势' },
  neutral: { en: 'Neutral · no trend', zh: '中性 · 无趋势' },
} as const;

export function AdxCard({ entry, dict }: { entry: AdxEntry; dict: any }) {
  if (entry.error || !entry.prices || !entry.indicator) {
    return <ErrorCard ticker={entry.ticker} displayName={entry.displayName} message={entry.error ?? 'no data'} />;
  }
  const isZh = dict.indicators?._localeHint === 'zh';
  const closes = entry.prices.map((p) => p.close);
  const plusDi = entry.indicator.map((r) => r.plusDi);
  const minusDi = entry.indicator.map((r) => r.minusDi);
  const adx = entry.indicator.map((r) => r.adx);

  const asOf = entry.prices[entry.prices.length - 1]?.time ?? null;
  const latest = entry.latest ?? {};
  const close = latest.close as number | null;
  const adxNow = latest.adx as number | null;
  const plusNow = latest.plusDi as number | null;
  const minusNow = latest.minusDi as number | null;

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
  // ADX/DI all sit in 0..~60 in practice; we cap at 0..60 so the 25
  // threshold line lands in a consistent spot across cards. Anything
  // above 60 (rare) just clips at the top — still clearly "very strong
  // trend" without us needing dynamic ticks.
  const adxMin = 0;
  const adxMax = 60;
  const adxY = (v: number) => BOTTOM_H - ((v - adxMin) / (adxMax - adxMin)) * (BOTTOM_H - 4 * 2) - 4;

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
            label="ADX"
            value={formatNum(adxNow, 1)}
            tone={adxNow != null ? (adxNow >= 25 ? 'up' : undefined) : undefined}
          />
          <MetricCell
            label="DI+"
            value={formatNum(plusNow, 1)}
            tone={plusNow != null && minusNow != null ? (plusNow > minusNow ? 'up' : undefined) : undefined}
          />
          <MetricCell
            label="DI−"
            value={formatNum(minusNow, 1)}
            tone={plusNow != null && minusNow != null ? (minusNow > plusNow ? 'down' : undefined) : undefined}
          />
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
          {/* 25 = "trend threshold" reference */}
          <line x1={4} x2={W - 4} y1={adxY(25)} y2={adxY(25)} stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-muted-foreground opacity-50" />
          <path d={buildPath(plusDi, W, BOTTOM_H, adxMin, adxMax, 4, 4)} fill="none" stroke="#ef4444" strokeWidth="1.25" />
          <path d={buildPath(minusDi, W, BOTTOM_H, adxMin, adxMax, 4, 4)} fill="none" stroke="#22c55e" strokeWidth="1.25" />
          <path d={buildPath(adx, W, BOTTOM_H, adxMin, adxMax, 4, 4)} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <g transform={`translate(${W - 130}, 12)`}>
            <text x="0" y="0" fontSize="9" fill="#ef4444">DI+</text>
            <text x="28" y="0" fontSize="9" fill="#22c55e">DI−</text>
            <text x="56" y="0" fontSize="9" fill="#f59e0b">ADX</text>
            <text x="92" y="0" fontSize="9" fill="currentColor" className="text-muted-foreground">·25</text>
          </g>
        </g>
      </svg>
    </CardShell>
  );
}
