'use client';

/**
 * Shared hover primitives for the indicator charts and the detail-modal
 * price sparkline. Every chart wants the same thing: snap the pointer to
 * the nearest data bar, draw a vertical guide + dot, and float a tooltip
 * with the values for that day. The maths is identical across cards;
 * only the tooltip *content* differs. This module owns the maths and the
 * visual primitives; each card supplies its own tooltip body.
 */

import * as React from 'react';
import { cn } from '../../lib/utils';
import { rangeOf } from './card-shell';

export interface ChartHover {
  /** Currently-hovered data index, or `null` when the pointer isn't over the chart. */
  hoverIdx: number | null;
  /** Wire to the SVG element via `onPointerMove`. */
  onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  /** Wire to the SVG element via `onPointerLeave`. */
  onPointerLeave: () => void;
}

/**
 * Track pointer position on a chart SVG and resolve it to the nearest
 * data index. Snapping to actual bars (rather than letting the guide
 * float free between them) is the standard chart-tooltip pattern —
 * gives a steady read instead of a jittery line, and matches user
 * intuition that hovering "approximately near a bar" means "show me
 * that bar's value."
 *
 * Coordinate model: the SVG uses `width="100%"` with a fixed viewBox,
 * so the pointer's clientX must be normalised against the rendered
 * width before being mapped back into viewBox units. We do that read
 * via getBoundingClientRect() once per move event — cheap, no need to
 * subscribe to resize observers.
 */
export function useChartHover({
  svgRef,
  dataLength,
  viewBoxWidth,
  padX,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  dataLength: number;
  viewBoxWidth: number;
  padX: number;
}): ChartHover {
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const stepX = (viewBoxWidth - padX * 2) / Math.max(1, dataLength - 1);

  const pointerToIndex = React.useCallback(
    (clientX: number): number | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return null;
      const ratio = (clientX - rect.left) / rect.width;
      const viewBoxX = Math.max(0, Math.min(1, ratio)) * viewBoxWidth;
      const dataX = viewBoxX - padX;
      const idx = Math.round(dataX / stepX);
      return Math.max(0, Math.min(dataLength - 1, idx));
    },
    [dataLength, padX, stepX, viewBoxWidth, svgRef],
  );

  return {
    hoverIdx,
    onPointerMove: (e) => setHoverIdx(pointerToIndex(e.clientX)),
    onPointerLeave: () => setHoverIdx(null),
  };
}

/**
 * Vertical dashed guide line + a single circle on the hovered series.
 * Drawn as the last child of the chart's <svg> so it sits on top of
 * the price line / bars. For two-pane charts (price on top, indicator
 * below), the line spans both panes for visual continuity — same x
 * coordinate, full chart height.
 *
 * The circle defaults to the price line's y; callers can pass any y
 * to anchor it on a different series.
 */
export function HoverGuide({
  hoverIdx,
  x,
  y,
  topY,
  bottomY,
}: {
  hoverIdx: number | null;
  /** ViewBox X of the hovered bar. */
  x: number;
  /** ViewBox Y where the dot should sit (usually projected close-price). */
  y: number;
  /** Top extent of the guide line in viewBox coords. */
  topY: number;
  /** Bottom extent of the guide line in viewBox coords. */
  bottomY: number;
}) {
  if (hoverIdx == null) return null;
  return (
    <g aria-hidden="true" pointerEvents="none">
      <line
        x1={x}
        x2={x}
        y1={topY}
        y2={bottomY}
        stroke="currentColor"
        strokeWidth="0.75"
        strokeDasharray="2 3"
        className="text-muted-foreground opacity-60"
      />
      <circle
        cx={x}
        cy={y}
        r={3}
        fill="currentColor"
        stroke="var(--card)"
        strokeWidth="1.5"
        className="text-foreground"
      />
    </g>
  );
}

/**
 * Floating HTML tooltip positioned over the chart wrapper. Uses CSS
 * percentages of viewBox coords so the tooltip stays in sync as the
 * chart scales — no need to read the SVG's actual pixel dimensions.
 *
 * `pointer-events-none` is the load-bearing detail: without it the
 * tooltip would intercept the pointer when it overlapped, breaking
 * the hover state into a flicker as the cursor moved from chart to
 * tooltip and back.
 *
 * Callers must wrap the chart + tooltip in a `position: relative`
 * container so the absolute positioning has the right reference frame.
 *
 * Adaptive placement: the tooltip auto-flips horizontally near the
 * chart edges and auto-flips vertically when the dot sits near the
 * top of the chart, so it never bleeds off-screen or under the modal
 * border. Thresholds are percentage-based so we don't need to read
 * the actual tooltip size — see comments below for the geometry.
 */
export function HoverTooltip({
  hoverIdx,
  xPct,
  yPct,
  children,
}: {
  hoverIdx: number | null;
  /** Tooltip X as a percentage of the chart wrapper's width (0-100). */
  xPct: number;
  /** Tooltip Y as a percentage of the chart wrapper's height (0-100). */
  yPct: number;
  children: React.ReactNode;
}) {
  if (hoverIdx == null) return null;

  // ── Horizontal placement ─────────────────────────────────────────
  // The default centred placement (translate-x: -50%) puts the
  // tooltip's centre on the hover x. When the hover x is near the
  // chart's edge the tooltip overflows the wrapper (and on cards is
  // hard-clipped by the article's overflow-hidden). Thresholds at
  // 18% / 82% give a comfortable margin for the typical ~140px-wide
  // tooltip on a ~420-700px-wide chart.
  //   xPct < 18 → anchor the tooltip's LEFT edge to the hover x.
  //   xPct > 82 → anchor the tooltip's RIGHT edge.
  //   else      → centre (the default).
  const horizAnchor: 'left' | 'center' | 'right' =
    xPct < 18 ? 'left' : xPct > 82 ? 'right' : 'center';
  const translateX =
    horizAnchor === 'left' ? '0%' : horizAnchor === 'right' ? '-100%' : '-50%';
  // A small breathing-room nudge so left/right-anchored tooltips
  // don't sit flush against the chart edge.
  const offsetX =
    horizAnchor === 'left' ? '4px' : horizAnchor === 'right' ? '-4px' : '0px';

  // ── Vertical placement ───────────────────────────────────────────
  // Default: above the dot (translate-y: calc(-100% - 10px)). When
  // the hover y is in the top quarter of the chart, that would put
  // the tooltip outside the chart's top edge — so we flip below
  // instead (translate-y: 10px, leaving a small gap below the dot).
  const placeBelow = yPct < 28;
  const translateY = placeBelow ? '10px' : 'calc(-100% - 10px)';

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute z-10 whitespace-nowrap',
        'rounded-md border border-border bg-popover px-2 py-1 shadow-[var(--shadow-elev1)]',
      )}
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: `translate(calc(${translateX} + ${offsetX}), ${translateY})`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Small two-column tooltip-row helper — keeps the value tooltips on
 * every card visually consistent. Renders `label` in muted monospace
 * and `value` in tabular-nums foreground tone, with optional tone
 * tint for directional values (gains in green/red, losses in the
 * opposite).
 */
export function TooltipRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone?: 'up' | 'down' | 'muted';
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          'font-mono tabular-nums',
          tone === 'up' && 'text-up',
          tone === 'down' && 'text-down',
          tone === 'muted' && 'text-muted-foreground',
          !tone && 'text-foreground',
        )}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Standard two-pane chart layout used by every indicator card that
 * stacks a price line on top of a per-indicator bottom pane (MACD,
 * Volume, Flow, RSI, KDJ, ADX).
 *
 * Before this hook each card duplicated the same ~12 lines of
 * dimensions + ref + hover-setup + price-projection arithmetic, and
 * occasional drift (different padX values, missed PAD_X = stepX
 * coupling) sneaked in. The hook locks every consumer to a single
 * source of truth for the two-pane geometry so future tweaks (taller
 * top pane, wider chart on mobile, etc.) happen in one place.
 *
 * Returns:
 *   - W, TOP_H, BOTTOM_H, TOTAL_H, PAD_X — viewBox geometry constants
 *   - svgRef                              — wire this to the <svg ref>
 *   - hoverIdx, onPointerMove, onPointerLeave — from useChartHover
 *   - priceRange                          — `{ min, max }` of closes
 *   - stepX                               — x-stride between data points
 *   - projectPriceY(close)                — viewBox Y for the top-pane price line
 *
 * The hook deliberately does NOT compute the `hovered` object — that
 * carries indicator-specific fields (DIF/DEA/HIST vs K/D/J vs daily
 * flow…) so each card builds it from `hoverIdx` directly.
 */
export function useTwoPaneChart(
  closes: Array<number | null>,
  options?: {
    /** Top (price) pane height in viewBox units. Default 130. */
    topH?: number;
    /** Bottom (indicator) pane height in viewBox units. Default 90. */
    bottomH?: number;
  },
) {
  const W = 420;
  const TOP_H = options?.topH ?? 130;
  const BOTTOM_H = options?.bottomH ?? 90;
  const TOTAL_H = TOP_H + BOTTOM_H + 12;
  const PAD_X = 4;
  // Price pane vertical padding — kept as a constant so projectPriceY
  // and the SVG path `padY` argument can't drift apart.
  const PRICE_PAD_Y = 6;

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const hover = useChartHover({
    svgRef,
    dataLength: closes.length,
    viewBoxWidth: W,
    padX: PAD_X,
  });

  const priceRange = rangeOf(closes);
  const stepX = (W - PAD_X * 2) / Math.max(1, closes.length - 1);
  const priceInnerH = TOP_H - PRICE_PAD_Y * 2;
  const projectPriceY = (v: number) =>
    PRICE_PAD_Y +
    priceInnerH -
    ((v - priceRange.min) / (priceRange.max - priceRange.min || 1)) * priceInnerH;

  return {
    W,
    TOP_H,
    BOTTOM_H,
    TOTAL_H,
    PAD_X,
    PRICE_PAD_Y,
    svgRef,
    ...hover,
    priceRange,
    stepX,
    projectPriceY,
  };
}
