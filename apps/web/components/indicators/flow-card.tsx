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
} from './card-shell';

interface FlowRow {
  daily: number | null;
  cum20: number | null;
  cum5: number | null;
}

interface FlowEntry {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null }>;
  indicator?: FlowRow[];
  bucket?: Bucket;
  latest?: Record<string, number | null | string>;
  error?: string;
}

const BUCKET_LABELS = {
  bullish: { en: 'Bullish · inflow', zh: '看多 · 主力净流入' },
  bearish: { en: 'Bearish · outflow', zh: '看空 · 主力净流出' },
  neutral: { en: 'Neutral · choppy', zh: '震荡 · 方向不明' },
} as const;

export function FlowCard({ entry, dict }: { entry: FlowEntry; dict: any }) {
  if (entry.error || !entry.prices || !entry.indicator) {
    return <ErrorCard ticker={entry.ticker} displayName={entry.displayName} message={entry.error ?? 'no data'} />;
  }
  const isZh = dict.indicators?._localeHint === 'zh';
  const closes = entry.prices.map((p) => p.close);
  const daily = entry.indicator.map((r) => r.daily);
  const cum20 = entry.indicator.map((r) => r.cum20);

  const asOf = entry.prices[entry.prices.length - 1]?.time ?? null;
  const latest = entry.latest ?? {};
  const close = latest.close as number | null;
  const c20 = latest.cum20 as number | null;
  const c5 = latest.cum5 as number | null;

  // 5-day price change for context
  const n = closes.length;
  let p5: number | null = null;
  if (n >= 6 && closes[n - 1] != null && closes[n - 6] != null) {
    p5 = ((closes[n - 1]! - closes[n - 6]!) / closes[n - 6]!) * 100;
  }

  const bucket = entry.bucket ?? 'neutral';
  const bucketLabel = BUCKET_LABELS[bucket][isZh ? 'zh' : 'en'];

  const W = 420;
  const TOP_H = 110;
  const BOTTOM_H = 100;
  const TOTAL_H = TOP_H + BOTTOM_H + 12;
  const priceRange = rangeOf(closes);
  const flowRange = rangeOf(daily, cum20);
  const stepX = (W - 8) / Math.max(1, closes.length - 1);
  const zeroFrac = flowRange.max / Math.max(1e-9, flowRange.max - flowRange.min);
  const zeroY = BOTTOM_H * zeroFrac;

  return (
    <CardShell
      ticker={entry.ticker}
      displayName={entry.displayName}
      asOf={asOf}
      bucket={bucket}
      bucketLabel={bucketLabel}
      metrics={
        <>
          <MetricCell label={dict.indicators?.metrics?.latest ?? 'Last'} value={formatNum(close, 2)} />
          <MetricCell label="CumFlow 20D" value={formatNum(c20, 0)} tone={c20 != null ? (c20 > 0 ? 'up' : 'down') : undefined} />
          <MetricCell label="Flow 5D" value={formatNum(c5, 0)} tone={c5 != null ? (c5 > 0 ? 'up' : 'down') : undefined} />
          <MetricCell label="Price 5D" value={formatPct(p5)} tone={p5 != null ? (p5 > 0 ? 'up' : 'down') : undefined} />
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
          <line x1={4} x2={W - 4} y1={zeroY} y2={zeroY} stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground opacity-40" />
          {daily.map((d, i) => {
            if (d == null) return null;
            const x = 4 + i * stepX;
            const top = BOTTOM_H - ((d - flowRange.min) / Math.max(1e-9, flowRange.max - flowRange.min)) * BOTTOM_H;
            const y = Math.min(top, zeroY);
            const h = Math.max(0.5, Math.abs(zeroY - top));
            const color = d >= 0 ? '#ef4444' : '#22c55e';
            return <rect key={i} x={x - stepX / 2.5} y={y} width={Math.max(1, stepX * 0.6)} height={h} fill={color} />;
          })}
          <path
            d={buildPath(cum20, W, BOTTOM_H, flowRange.min, flowRange.max, 4, 2)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
          />
        </g>
      </svg>
      <p className="px-3 pb-1 pt-2 text-[10px] text-muted-foreground">
        {isZh
          ? '本视图基于量价代理估算主力资金,非真实盘口数据。'
          : 'Proxy estimate based on sign(Δclose)·volume·close — not real order-book flow.'}
      </p>
    </CardShell>
  );
}
