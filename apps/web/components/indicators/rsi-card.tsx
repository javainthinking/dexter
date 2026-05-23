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

interface RsiRow {
  rsi: number | null;
}

interface RsiEntry {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null }>;
  indicator?: RsiRow[];
  bucket?: Bucket;
  bucketTrend?: BucketSample[];
  latest?: Record<string, number | null | string>;
  error?: string;
}

// RSI's bucket semantics are mean-reversion: overbought ⇒ likely down
// next ⇒ bearish; oversold ⇒ likely up next ⇒ bullish. The labels make
// the "what does the call mean" explicit so users don't read it as a
// momentum signal (RSI > 70 is "strong" momentum but a bearish setup).
const BUCKET_LABELS = {
  bullish: { en: 'Bullish · oversold', zh: '看多 · 超卖反弹' },
  bearish: { en: 'Bearish · overbought', zh: '看空 · 超买回落' },
  neutral: { en: 'Neutral · in range', zh: '中性 · 区间内' },
} as const;

export function RsiCard({ entry, dict }: { entry: RsiEntry; dict: any }) {
  if (entry.error || !entry.prices || !entry.indicator) {
    return <ErrorCard ticker={entry.ticker} displayName={entry.displayName} message={entry.error ?? 'no data'} />;
  }
  const isZh = dict.indicators?._localeHint === 'zh';
  const closes = entry.prices.map((p) => p.close);
  const rsi = entry.indicator.map((r) => r.rsi);

  const asOf = entry.prices[entry.prices.length - 1]?.time ?? null;
  const latest = entry.latest ?? {};
  const close = latest.close as number | null;
  const changePct = latest.changePct as number | null;
  const rsiNow = latest.rsi as number | null;

  const bucket = entry.bucket ?? 'neutral';
  const bucketLang = isZh ? 'zh' : 'en';
  const bucketLabel = BUCKET_LABELS[bucket][bucketLang];
  const bucketLabels = {
    bullish: BUCKET_LABELS.bullish[bucketLang],
    bearish: BUCKET_LABELS.bearish[bucketLang],
    neutral: BUCKET_LABELS.neutral[bucketLang],
  };

  // Two-pane layout: price on top, RSI oscillator below with the 30/70
  // reference lines drawn at fixed scale (0..100) so the eye can pick
  // out the overbought/oversold crossings without needing the y-axis
  // labels.
  const W = 420;
  const TOP_H = 130;
  const BOTTOM_H = 90;
  const TOTAL_H = TOP_H + BOTTOM_H + 12;
  const priceRange = rangeOf(closes);
  // Fixed 0..100 scale so 30 and 70 lines land at consistent y-coords
  // across cards — makes cross-ticker comparison instant.
  const rsiMin = 0;
  const rsiMax = 100;
  const rsiY = (v: number) => BOTTOM_H - ((v - rsiMin) / (rsiMax - rsiMin)) * (BOTTOM_H - 4 * 2) - 4;
  const zone = rsiNow == null ? null : rsiNow >= 70 ? 'OB' : rsiNow <= 30 ? 'OS' : '—';

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
            label={dict.indicators?.metrics?.change ?? 'Chg %'}
            value={formatPct(changePct)}
            tone={changePct != null ? (changePct > 0 ? 'up' : changePct < 0 ? 'down' : undefined) : undefined}
          />
          <MetricCell label="RSI(14)" value={formatNum(rsiNow, 1)} tone={rsiNow != null ? (rsiNow >= 70 ? 'down' : rsiNow <= 30 ? 'up' : undefined) : undefined} />
          <MetricCell label="Zone" value={zone ?? '—'} />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${TOTAL_H}`} width="100%" preserveAspectRatio="none" className="block">
        {/* Top: price */}
        <path
          d={buildPath(closes, W, TOP_H, priceRange.min, priceRange.max, 4, 6)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground"
        />
        {/* Bottom: RSI oscillator */}
        <g transform={`translate(0, ${TOP_H + 12})`}>
          {/* Overbought 70 reference */}
          <line
            x1={4}
            x2={W - 4}
            y1={rsiY(70)}
            y2={rsiY(70)}
            stroke="#ef4444"
            strokeWidth="0.5"
            strokeDasharray="3 3"
            opacity="0.5"
          />
          {/* Oversold 30 reference */}
          <line
            x1={4}
            x2={W - 4}
            y1={rsiY(30)}
            y2={rsiY(30)}
            stroke="#22c55e"
            strokeWidth="0.5"
            strokeDasharray="3 3"
            opacity="0.5"
          />
          {/* 50 midline */}
          <line
            x1={4}
            x2={W - 4}
            y1={rsiY(50)}
            y2={rsiY(50)}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-muted-foreground opacity-30"
          />
          <path
            d={buildPath(rsi, W, BOTTOM_H, rsiMin, rsiMax, 4, 4)}
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.25"
          />
          {/* Legend */}
          <g transform={`translate(${W - 60}, 12)`}>
            <text x="0" y="0" fontSize="9" fill="#ef4444">70</text>
            <text x="22" y="0" fontSize="9" fill="#22c55e">30</text>
          </g>
        </g>
      </svg>
    </CardShell>
  );
}
