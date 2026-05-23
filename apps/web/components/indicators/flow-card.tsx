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
  bucketTrend?: BucketSample[];
  latest?: Record<string, number | null | string>;
  error?: string;
}

// Flow is a *synthetic* direction proxy — sign(close − prev_close) ×
// volume × close. It does NOT read institutional / Level-2 order
// flow. Earlier copy used 主力净流入 / 主力净流出 which implied real
// "main force capital" data; relabeled to make clear we're showing

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
  const bucketLang = isZh ? 'zh' : 'en';
  // Bucket label localisation goes through one helper in
  // lib/indicators/labels — card pill + summary trail stay in lockstep.
  const bucketLabels = localizedBucketLabels('flow', bucketLang);
  const bucketLabel = bucketLabels[bucket];

  // Flow uses a taller indicator pane (100) and shorter price pane
  // (110) than the other two-pane cards (130/90) — the histogram
  // needs the extra room. The hook accepts overrides for these.
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
  } = useTwoPaneChart(closes, { topH: 110, bottomH: 100 });
  const flowRange = rangeOf(daily, cum20);
  const zeroFrac = flowRange.max / Math.max(1e-9, flowRange.max - flowRange.min);
  const zeroY = BOTTOM_H * zeroFrac;

  const hovered =
    hoverIdx != null && closes[hoverIdx] != null
      ? {
          time: entry.prices[hoverIdx].time,
          close: closes[hoverIdx] as number,
          daily: daily[hoverIdx],
          cum20: cum20[hoverIdx],
          cum5: entry.indicator[hoverIdx]?.cum5 ?? null,
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
          <MetricCell label="CumFlow 20D" value={formatNum(c20, 0)} tone={c20 != null ? (c20 > 0 ? 'up' : 'down') : undefined} />
          <MetricCell label="Flow 5D" value={formatNum(c5, 0)} tone={c5 != null ? (c5 > 0 ? 'up' : 'down') : undefined} />
          <MetricCell label="Price 5D" value={formatPct(p5)} tone={p5 != null ? (p5 > 0 ? 'up' : 'down') : undefined} />
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
          <line x1={PAD_X} x2={W - PAD_X} y1={zeroY} y2={zeroY} stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground opacity-40" />
          {daily.map((d, i) => {
            if (d == null) return null;
            const x = PAD_X + i * stepX;
            const top = BOTTOM_H - ((d - flowRange.min) / Math.max(1e-9, flowRange.max - flowRange.min)) * BOTTOM_H;
            const y = Math.min(top, zeroY);
            const h = Math.max(0.5, Math.abs(zeroY - top));
            const color = d >= 0 ? '#ef4444' : '#22c55e';
            return <rect key={i} x={x - stepX / 2.5} y={y} width={Math.max(1, stepX * 0.6)} height={h} fill={color} />;
          })}
          <path
            d={buildPath(cum20, W, BOTTOM_H, flowRange.min, flowRange.max, PAD_X, 2)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
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
          <TooltipRow
            label="daily"
            value={formatNum(hovered.daily, 0)}
            tone={
              hovered.daily != null
                ? hovered.daily > 0
                  ? 'up'
                  : hovered.daily < 0
                    ? 'down'
                    : 'muted'
                : undefined
            }
          />
          <TooltipRow
            label="cum 5D"
            value={formatNum(hovered.cum5, 0)}
            tone={
              hovered.cum5 != null
                ? hovered.cum5 > 0
                  ? 'up'
                  : hovered.cum5 < 0
                    ? 'down'
                    : 'muted'
                : undefined
            }
          />
          <TooltipRow
            label="cum 20D"
            value={formatNum(hovered.cum20, 0)}
            tone={
              hovered.cum20 != null
                ? hovered.cum20 > 0
                  ? 'up'
                  : hovered.cum20 < 0
                    ? 'down'
                    : 'muted'
                : undefined
            }
          />
        </HoverTooltip>
      )}
      </div>
      <p className="px-3 pb-1 pt-2 text-[10px] text-muted-foreground">
        {isZh
          ? '本视图基于量价代理估算主力资金,非真实盘口数据。'
          : 'Proxy estimate based on sign(Δclose)·volume·close — not real order-book flow.'}
      </p>
    </CardShell>
  );
}
