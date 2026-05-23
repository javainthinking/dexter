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
  const bucketLang = isZh ? 'zh' : 'en';
  // Bucket label localisation goes through one helper in
  // lib/indicators/labels — card pill + summary trail stay in lockstep.
  const bucketLabels = localizedBucketLabels('macd', bucketLang);
  const bucketLabel = bucketLabels[bucket];

  // Two-pane chart: price line on top, MACD DIF/DEA + HIST below.
  // Geometry + hover wiring come from the shared hook so every
  // two-pane card has identical layout.
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
  const macdRange = rangeOf(dif, dea, hist);
  // Histogram baseline (zero) in the bottom pane:
  const zeroY = TOP_H + 12 + (BOTTOM_H - 4 * 2) * (macdRange.max / (macdRange.max - macdRange.min)) + 4;

  const hovered =
    hoverIdx != null && closes[hoverIdx] != null
      ? {
          time: entry.prices[hoverIdx].time,
          close: closes[hoverIdx] as number,
          dif: dif[hoverIdx],
          dea: dea[hoverIdx],
          hist: hist[hoverIdx],
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
        {/* Top pane: price line */}
        <g>
          <path
            d={buildPath(closes, W, TOP_H, priceRange.min, priceRange.max, PAD_X, 6)}
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
          <TooltipRow label="DIF" value={formatNum(hovered.dif, 3)} />
          <TooltipRow label="DEA" value={formatNum(hovered.dea, 3)} />
          <TooltipRow
            label="HIST"
            value={formatNum(hovered.hist, 3)}
            tone={
              hovered.hist != null
                ? hovered.hist > 0
                  ? 'up'
                  : hovered.hist < 0
                    ? 'down'
                    : 'muted'
                : undefined
            }
          />
        </HoverTooltip>
      )}
      </div>
    </CardShell>
  );
}
