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

interface BollRow {
  mid: number | null;
  upper: number | null;
  lower: number | null;
  bandwidth: number | null;
}

interface BollEntry {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null }>;
  indicator?: BollRow[];
  bucket?: Bucket;
  bucketTrend?: BucketSample[];
  latest?: Record<string, number | null | string>;
  error?: string;
}



export function BollCard({ entry, dict }: { entry: BollEntry; dict: any }) {
  if (entry.error || !entry.prices || !entry.indicator) {
    return <ErrorCard ticker={entry.ticker} displayName={entry.displayName} message={entry.error ?? 'no data'} />;
  }
  const isZh = dict.indicators?._localeHint === 'zh';
  const closes = entry.prices.map((p) => p.close);
  const mid = entry.indicator.map((r) => r.mid);
  const upper = entry.indicator.map((r) => r.upper);
  const lower = entry.indicator.map((r) => r.lower);

  const asOf = entry.prices[entry.prices.length - 1]?.time ?? null;
  const latest = entry.latest ?? {};
  const close = latest.close as number | null;
  const midNow = latest.mid as number | null;
  const upperNow = latest.upper as number | null;
  const lowerNow = latest.lower as number | null;
  const bandwidth = latest.bandwidth as number | null;
  // Position-in-band: 0% = at lower band, 100% = at upper band.
  // Gives users a single number "where am I inside the channel" that's
  // comparable across tickers regardless of absolute price scale.
  const posInBand =
    close != null && upperNow != null && lowerNow != null && upperNow !== lowerNow
      ? ((close - lowerNow) / (upperNow - lowerNow)) * 100
      : null;

  const bucket = entry.bucket ?? 'neutral';
  const bucketLang = isZh ? 'zh' : 'en';
  // Bucket label localisation goes through one helper in
  // lib/indicators/labels — card pill + summary trail stay in lockstep.
  const bucketLabels = localizedBucketLabels('boll', bucketLang);
  const bucketLabel = bucketLabels[bucket];

  // Single-pane like the MA card — the bands and the price line share
  // the same y-scale so we want them overlaid.
  const W = 420;
  const H = 230;
  const PAD_X = 4;
  const PAD_Y = 6;
  const range = rangeOf(closes, upper, lower);
  const stepX = (W - PAD_X * 2) / Math.max(1, closes.length - 1);

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const { hoverIdx, onPointerMove, onPointerLeave } = useChartHover({
    svgRef,
    dataLength: closes.length,
    viewBoxWidth: W,
    padX: PAD_X,
  });
  const innerH = H - PAD_Y * 2;
  const projectY = (v: number) =>
    PAD_Y + innerH - ((v - range.min) / (range.max - range.min || 1)) * innerH;
  const hovered =
    hoverIdx != null && closes[hoverIdx] != null
      ? {
          time: entry.prices[hoverIdx].time,
          close: closes[hoverIdx] as number,
          upper: upper[hoverIdx],
          mid: mid[hoverIdx],
          lower: lower[hoverIdx],
          x: PAD_X + hoverIdx * stepX,
          y: projectY(closes[hoverIdx] as number),
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
            label="%B"
            value={formatPct(posInBand)}
            tone={posInBand != null ? (posInBand > 100 ? 'up' : posInBand < 0 ? 'down' : undefined) : undefined}
          />
          <MetricCell label="MID" value={formatNum(midNow, 2)} />
          <MetricCell label="BW %" value={formatPct(bandwidth)} />
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
        <path d={buildPath(upper, W, H, range.min, range.max, PAD_X, PAD_Y)} fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
        <path d={buildPath(mid, W, H, range.min, range.max, PAD_X, PAD_Y)} fill="none" stroke="#a78bfa" strokeWidth="1" />
        <path d={buildPath(lower, W, H, range.min, range.max, PAD_X, PAD_Y)} fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
        <path d={buildPath(closes, W, H, range.min, range.max, PAD_X, PAD_Y)} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
        <g transform={`translate(${W - 145}, 8)`}>
          <text x="0" y="0" fontSize="9" fill="currentColor" className="text-muted-foreground">price</text>
          <line x1="36" y1="-3" x2="50" y2="-3" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
          <text x="58" y="0" fontSize="9" fill="#f59e0b">UP</text>
          <text x="78" y="0" fontSize="9" fill="#a78bfa">MID</text>
          <text x="105" y="0" fontSize="9" fill="#f59e0b">LO</text>
        </g>
        <HoverGuide hoverIdx={hoverIdx} x={hovered?.x ?? 0} y={hovered?.y ?? 0} topY={PAD_Y} bottomY={H - PAD_Y} />
      </svg>
      {hovered && (
        <HoverTooltip hoverIdx={hoverIdx} xPct={(hovered.x / W) * 100} yPct={(hovered.y / H) * 100}>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{hovered.time}</div>
          <TooltipRow label="price" value={formatNum(hovered.close, 2)} />
          <TooltipRow label="upper" value={formatNum(hovered.upper, 2)} />
          <TooltipRow label="mid" value={formatNum(hovered.mid, 2)} />
          <TooltipRow label="lower" value={formatNum(hovered.lower, 2)} />
        </HoverTooltip>
      )}
      </div>
    </CardShell>
  );
}
