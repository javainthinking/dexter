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
  useChartHover,
} from './chart-hover';
import { localizedBucketLabels } from '../../lib/indicators/labels';

interface MaRow {
  ma5: number | null;
  ma20: number | null;
  ma60: number | null;
}

interface MaEntry {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null }>;
  indicator?: MaRow[];
  bucket?: Bucket;
  bucketTrend?: BucketSample[];
  latest?: Record<string, number | null | string>;
  error?: string;
}



export function MaCard({ entry, dict }: { entry: MaEntry; dict: any }) {
  if (entry.error || !entry.prices || !entry.indicator) {
    return <ErrorCard ticker={entry.ticker} displayName={entry.displayName} message={entry.error ?? 'no data'} />;
  }
  const isZh = dict.indicators?._localeHint === 'zh';
  const closes = entry.prices.map((p) => p.close);
  const ma5 = entry.indicator.map((r) => r.ma5);
  const ma20 = entry.indicator.map((r) => r.ma20);
  const ma60 = entry.indicator.map((r) => r.ma60);

  const asOf = entry.prices[entry.prices.length - 1]?.time ?? null;
  const latest = entry.latest ?? {};
  const close = latest.close as number | null;
  const lat5 = latest.ma5 as number | null;
  const lat20 = latest.ma20 as number | null;
  const lat60 = latest.ma60 as number | null;
  const dev = (target: number | null) => (close != null && target != null && target !== 0 ? ((close - target) / target) * 100 : null);

  const bucket = entry.bucket ?? 'neutral';
  const bucketLang = isZh ? 'zh' : 'en';
  // Bucket label localisation goes through one helper in
  // lib/indicators/labels — card pill + summary trail stay in lockstep.
  const bucketLabels = localizedBucketLabels('ma', bucketLang);
  const bucketLabel = bucketLabels[bucket];

  const W = 420;
  const H = 230;
  const PAD_X = 4;
  const PAD_Y = 6;
  const range = rangeOf(closes, ma5, ma20, ma60);

  // Hover: pointer-to-index lookup + per-day value readout. Shared
  // primitives so every indicator card behaves identically — the
  // user learns one interaction model and it works everywhere.
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const { hoverIdx, onPointerMove, onPointerLeave } = useChartHover({
    svgRef,
    dataLength: closes.length,
    viewBoxWidth: W,
    padX: PAD_X,
  });
  const stepX = (W - PAD_X * 2) / Math.max(1, closes.length - 1);
  const innerH = H - PAD_Y * 2;
  const projectY = (v: number) =>
    PAD_Y + innerH - ((v - range.min) / (range.max - range.min || 1)) * innerH;
  const hovered =
    hoverIdx != null && entry.prices[hoverIdx]?.close != null
      ? {
          time: entry.prices[hoverIdx].time,
          close: entry.prices[hoverIdx].close as number,
          ma5: entry.indicator[hoverIdx]?.ma5 ?? null,
          ma20: entry.indicator[hoverIdx]?.ma20 ?? null,
          ma60: entry.indicator[hoverIdx]?.ma60 ?? null,
          x: PAD_X + hoverIdx * stepX,
          y: projectY(entry.prices[hoverIdx].close as number),
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
          <MetricCell label="vs MA5" value={formatPct(dev(lat5))} tone={dev(lat5) != null ? (dev(lat5)! > 0 ? 'up' : 'down') : undefined} />
          <MetricCell label="vs MA20" value={formatPct(dev(lat20))} tone={dev(lat20) != null ? (dev(lat20)! > 0 ? 'up' : 'down') : undefined} />
          <MetricCell label="vs MA60" value={formatPct(dev(lat60))} tone={dev(lat60) != null ? (dev(lat60)! > 0 ? 'up' : 'down') : undefined} />
        </>
      }
    >
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          preserveAspectRatio="none"
          className="block"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <path d={buildPath(closes, W, H, range.min, range.max, PAD_X, PAD_Y)} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
          <path d={buildPath(ma5, W, H, range.min, range.max, PAD_X, PAD_Y)} fill="none" stroke="#60a5fa" strokeWidth="1" />
          <path d={buildPath(ma20, W, H, range.min, range.max, PAD_X, PAD_Y)} fill="none" stroke="#f59e0b" strokeWidth="1" />
          <path d={buildPath(ma60, W, H, range.min, range.max, PAD_X, PAD_Y)} fill="none" stroke="#a78bfa" strokeWidth="1" />
          {/* Legend */}
          <g transform={`translate(${W - 140}, 8)`}>
            <text x="0" y="0" fontSize="9" fill="currentColor" className="text-muted-foreground">price</text>
            <line x1="36" y1="-3" x2="50" y2="-3" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
            <text x="58" y="0" fontSize="9" fill="#60a5fa">MA5</text>
            <text x="82" y="0" fontSize="9" fill="#f59e0b">MA20</text>
            <text x="110" y="0" fontSize="9" fill="#a78bfa">MA60</text>
          </g>
          <HoverGuide
            hoverIdx={hoverIdx}
            x={hovered?.x ?? 0}
            y={hovered?.y ?? 0}
            topY={PAD_Y}
            bottomY={H - PAD_Y}
          />
        </svg>
        {hovered && (
          <HoverTooltip
            hoverIdx={hoverIdx}
            xPct={(hovered.x / W) * 100}
            yPct={(hovered.y / H) * 100}
          >
            <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {hovered.time}
            </div>
            <TooltipRow label="price" value={formatNum(hovered.close, 2)} />
            <TooltipRow label="MA5" value={formatNum(hovered.ma5, 2)} />
            <TooltipRow label="MA20" value={formatNum(hovered.ma20, 2)} />
            <TooltipRow label="MA60" value={formatNum(hovered.ma60, 2)} />
          </HoverTooltip>
        )}
      </div>
    </CardShell>
  );
}
