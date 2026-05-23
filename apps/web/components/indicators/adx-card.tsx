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
import {
  HoverGuide,
  HoverTooltip,
  TooltipRow,
  useTwoPaneChart,
} from './chart-hover';
import { localizedBucketLabels } from '../../lib/indicators/labels';

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
  // Bucket label localisation goes through one helper in
  // lib/indicators/labels — card pill + summary trail stay in lockstep.
  const bucketLabels = localizedBucketLabels('adx', bucketLang);
  const bucketLabel = bucketLabels[bucket];

  const {
    W,
    TOP_H,
    BOTTOM_H,
    TOTAL_H,
    PAD_X,
    svgRef,
    hoverIdx,
    onPointerMove,
    onPointerLeave,
    priceRange,
    stepX,
    projectPriceY,
  } = useTwoPaneChart(closes);
  // ADX/DI all sit in 0..~60 in practice; we cap at 0..60 so the 25
  // threshold line lands in a consistent spot across cards. Anything
  // above 60 (rare) just clips at the top — still clearly "very strong
  // trend" without us needing dynamic ticks.
  const adxMin = 0;
  const adxMax = 60;
  const adxY = (v: number) => BOTTOM_H - ((v - adxMin) / (adxMax - adxMin)) * (BOTTOM_H - 4 * 2) - 4;

  const hovered =
    hoverIdx != null && closes[hoverIdx] != null
      ? {
          time: entry.prices[hoverIdx].time,
          close: closes[hoverIdx] as number,
          adx: adx[hoverIdx],
          plusDi: plusDi[hoverIdx],
          minusDi: minusDi[hoverIdx],
          x: PAD_X + hoverIdx * stepX,
          y: projectPriceY(closes[hoverIdx] as number),
        }
      : null;

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
      <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${TOTAL_H}`}
        width="100%"
        preserveAspectRatio="none"
        className="block"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <path
          d={buildPath(closes, W, TOP_H, priceRange.min, priceRange.max, PAD_X, 6)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground"
        />
        <g transform={`translate(0, ${TOP_H + 12})`}>
          <line x1={PAD_X} x2={W - PAD_X} y1={adxY(25)} y2={adxY(25)} stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-muted-foreground opacity-50" />
          <path d={buildPath(plusDi, W, BOTTOM_H, adxMin, adxMax, PAD_X, 4)} fill="none" stroke="#ef4444" strokeWidth="1.25" />
          <path d={buildPath(minusDi, W, BOTTOM_H, adxMin, adxMax, PAD_X, 4)} fill="none" stroke="#22c55e" strokeWidth="1.25" />
          <path d={buildPath(adx, W, BOTTOM_H, adxMin, adxMax, PAD_X, 4)} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <g transform={`translate(${W - 130}, 12)`}>
            <text x="0" y="0" fontSize="9" fill="#ef4444">DI+</text>
            <text x="28" y="0" fontSize="9" fill="#22c55e">DI−</text>
            <text x="56" y="0" fontSize="9" fill="#f59e0b">ADX</text>
            <text x="92" y="0" fontSize="9" fill="currentColor" className="text-muted-foreground">·25</text>
          </g>
        </g>
        <HoverGuide hoverIdx={hoverIdx} x={hovered?.x ?? 0} y={hovered?.y ?? 0} topY={0} bottomY={TOTAL_H} />
      </svg>
      {hovered && (
        <HoverTooltip hoverIdx={hoverIdx} xPct={(hovered.x / W) * 100} yPct={(hovered.y / TOTAL_H) * 100}>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{hovered.time}</div>
          <TooltipRow label="price" value={formatNum(hovered.close, 2)} />
          <TooltipRow
            label="ADX"
            value={formatNum(hovered.adx, 1)}
            tone={hovered.adx != null ? (hovered.adx >= 25 ? 'up' : 'muted') : undefined}
          />
          <TooltipRow
            label="DI+"
            value={formatNum(hovered.plusDi, 1)}
            tone={hovered.plusDi != null && hovered.minusDi != null ? (hovered.plusDi > hovered.minusDi ? 'up' : 'muted') : undefined}
          />
          <TooltipRow
            label="DI−"
            value={formatNum(hovered.minusDi, 1)}
            tone={hovered.plusDi != null && hovered.minusDi != null ? (hovered.minusDi > hovered.plusDi ? 'down' : 'muted') : undefined}
          />
        </HoverTooltip>
      )}
      </div>
    </CardShell>
  );
}
