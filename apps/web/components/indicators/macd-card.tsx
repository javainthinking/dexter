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

interface MacdSeriesRow {
  dif: number | null;
  dea: number | null;
  hist: number | null;
}

interface MacdEntry {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null }>;
  indicator?: MacdSeriesRow[];
  bucket?: Bucket;
  bucketTrend?: BucketSample[];
  latest?: Record<string, number | null | string>;
  error?: string;
}

const BUCKET_LABELS = {
  bullish: { en: 'Bullish · golden cross', zh: '看多 · 金叉/红柱放大' },
  bearish: { en: 'Bearish · death cross', zh: '看空 · 死叉/绿柱放大' },
  neutral: { en: 'Neutral', zh: '待观察' },
} as const;

export function MacdCard({ entry, dict }: { entry: MacdEntry; dict: any }) {
  if (entry.error || !entry.prices || !entry.indicator) {
    return <ErrorCard ticker={entry.ticker} displayName={entry.displayName} message={entry.error ?? 'no data'} />;
  }
  const isZh = dict.indicators?._localeHint === 'zh';
  const closes = entry.prices.map((p) => p.close);
  const dif = entry.indicator.map((r) => r.dif);
  const dea = entry.indicator.map((r) => r.dea);
  const hist = entry.indicator.map((r) => r.hist);

  const asOf = entry.prices[entry.prices.length - 1]?.time ?? null;
  const latest = entry.latest ?? {};
  const close = latest.close as number | null;
  const change = latest.change as number | null;
  const changePct = latest.changePct as number | null;
  const histLatest = latest.hist as number | null;

  const bucket = entry.bucket ?? 'neutral';
  const bucketLabel = BUCKET_LABELS[bucket][isZh ? 'zh' : 'en'];

  // Two-pane chart: price line on top, MACD DIF/DEA + HIST below
  const W = 420;
  const TOP_H = 130;
  const BOTTOM_H = 90;
  const TOTAL_H = TOP_H + BOTTOM_H + 12;
  const priceRange = rangeOf(closes);
  const macdRange = rangeOf(dif, dea, hist);
  const stepX = (W - 8) / Math.max(1, closes.length - 1);
  // Histogram baseline (zero) in the bottom pane:
  const zeroY = TOP_H + 12 + (BOTTOM_H - 4 * 2) * (macdRange.max / (macdRange.max - macdRange.min)) + 4;

  return (
    <CardShell
      ticker={entry.ticker}
      displayName={entry.displayName}
      asOf={asOf}
      bucket={bucket}
      bucketLabel={bucketLabel}
      bucketTrend={entry.bucketTrend}
      metrics={
        <>
          <MetricCell
            label={dict.indicators?.metrics?.latest ?? 'Last'}
            value={formatNum(close, 2)}
          />
          <MetricCell
            label={dict.indicators?.metrics?.change ?? 'Chg %'}
            value={formatPct(changePct)}
            tone={changePct != null ? (changePct > 0 ? 'up' : changePct < 0 ? 'down' : undefined) : undefined}
          />
          <MetricCell label="DIF" value={formatNum(latest.dif, 2)} />
          <MetricCell
            label="HIST"
            value={formatNum(histLatest, 2)}
            tone={histLatest != null ? (histLatest > 0 ? 'up' : histLatest < 0 ? 'down' : undefined) : undefined}
          />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${TOTAL_H}`} width="100%" preserveAspectRatio="none" className="block">
        {/* Top pane: price line */}
        <g>
          <path
            d={buildPath(closes, W, TOP_H, priceRange.min, priceRange.max, 4, 6)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground"
          />
        </g>
        {/* Bottom pane: HIST bars + DIF/DEA lines */}
        <g transform={`translate(0, ${TOP_H + 12})`}>
          {/* zero line */}
          <line
            x1={4}
            x2={W - 4}
            y1={BOTTOM_H * (macdRange.max / (macdRange.max - macdRange.min))}
            y2={BOTTOM_H * (macdRange.max / (macdRange.max - macdRange.min))}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-muted-foreground opacity-40"
          />
          {hist.map((h, i) => {
            if (h == null) return null;
            const x = 4 + i * stepX;
            const baseY = BOTTOM_H * (macdRange.max / (macdRange.max - macdRange.min));
            const top = BOTTOM_H - ((h - macdRange.min) / (macdRange.max - macdRange.min)) * BOTTOM_H;
            const y = Math.min(top, baseY);
            const height = Math.max(0.5, Math.abs(baseY - top));
            const color = h >= 0 ? '#ef4444' : '#22c55e';
            return <rect key={i} x={x - stepX / 2.5} y={y} width={Math.max(1, stepX * 0.6)} height={height} fill={color} />;
          })}
          <path
            d={buildPath(dif, W, BOTTOM_H, macdRange.min, macdRange.max, 4, 2)}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.25"
          />
          <path
            d={buildPath(dea, W, BOTTOM_H, macdRange.min, macdRange.max, 4, 2)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.25"
          />
        </g>
      </svg>
    </CardShell>
  );
}
