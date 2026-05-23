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
import {
  HoverGuide,
  HoverTooltip,
  TooltipRow,
  useTwoPaneChart,
} from './chart-hover';
import { localizedBucketLabels } from '../../lib/indicators/labels';

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
  // Bucket label localisation goes through one helper in
  // lib/indicators/labels — card pill + summary trail stay in lockstep.
  const bucketLabels = localizedBucketLabels('volume', bucketLang);
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
  const volRange = rangeOf(volumes);
  const hovered =
    hoverIdx != null && closes[hoverIdx] != null
      ? {
          time: entry.prices[hoverIdx].time,
          close: closes[hoverIdx] as number,
          volume: volumes[hoverIdx],
          avgVol20: entry.indicator[hoverIdx]?.avgVol20 ?? null,
          volRatio: entry.indicator[hoverIdx]?.volRatio ?? null,
          direction: directions[hoverIdx] ?? 0,
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
          <MetricCell label="Avg Vol 20" value={formatNum(avgVol, 0)} />
          <MetricCell label="Vol Ratio" value={formatNum(ratio, 2)} tone={ratio != null && ratio >= 1.5 ? 'up' : undefined} />
          <MetricCell label="5D %" value={formatPct(cum5)} tone={cum5 != null ? (cum5 > 0 ? 'up' : 'down') : undefined} />
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
          {volumes.map((v, i) => {
            if (v == null) return null;
            const x = PAD_X + i * stepX;
            const h = ((v - volRange.min) / Math.max(1, volRange.max - volRange.min)) * (BOTTOM_H - 4);
            const y = BOTTOM_H - h;
            const color = directions[i] > 0 ? '#ef4444' : directions[i] < 0 ? '#22c55e' : '#94a3b8';
            return <rect key={i} x={x - stepX / 2.5} y={y} width={Math.max(1, stepX * 0.6)} height={h} fill={color} />;
          })}
        </g>
        <HoverGuide
          hoverIdx={hoverIdx}
          x={hovered?.x ?? 0}
          y={hovered?.y ?? 0}
          topY={0}
          bottomY={TOTAL_H}
        />
      </svg>
      {hovered && (
        <HoverTooltip
          hoverIdx={hoverIdx}
          xPct={(hovered.x / W) * 100}
          yPct={(hovered.y / TOTAL_H) * 100}
        >
          <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {hovered.time}
          </div>
          <TooltipRow label="price" value={formatNum(hovered.close, 2)} />
          <TooltipRow label="vol" value={formatNum(hovered.volume, 0)} />
          <TooltipRow label="avg20" value={formatNum(hovered.avgVol20, 0)} />
          <TooltipRow
            label="ratio"
            value={formatNum(hovered.volRatio, 2)}
            tone={hovered.volRatio != null && hovered.volRatio >= 1.5 ? 'up' : 'muted'}
          />
        </HoverTooltip>
      )}
      </div>
    </CardShell>
  );
}
