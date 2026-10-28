'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { useDictionary } from '../i18n/dictionary-provider';
import {
  buildPath,
  rangeOf,
  type Bucket,
} from './card-shell';
import {
  HoverGuide,
  HoverTooltip,
  useChartHover,
} from './chart-hover';
import {
  DIMENSION_FALLBACK_LABEL,
  DIMENSION_KEYS,
  type DimensionKey,
} from '../../lib/indicators/labels';
import { type SummaryEntry, type SummaryDimension } from './summary-view';

/** Per-dimension bucket cell shown inside a single day's row. */
interface SignalCell {
  bucket: Bucket;
  /** Pre-localized reason ("Bullish · golden cross"); falls back to bucket name. */
  label: string;
}

/**
 * Day-major view of the cross-indicator data — five entries, one per
 * trading bar, with every dimension's bucket for that bar.
 *
 * The summary entry stores trail data as indicator-major
 * (entry.macd.bucketTrend = [{time, bucket}, ...]). We pivot to
 * day-major so a single render block per timeline node shows all
 * eight dimensions for that day side-by-side.
 *
 * Dates across all dimensions are calendar-aligned (the API computes
 * them from the same OHLCV series with the same lookback), so we can
 * use any non-errored dimension's trail as the index of trading days.
 */
interface DayDetail {
  /** ISO yyyy-mm-dd of the trading bar. */
  time: string;
  /** Daily percent change (from the entry's dailyChanges array, aligned by time). */
  changePct: number | null;
  /** Per-dimension signal for this day. `null` = the indicator errored. */
  signals: Partial<Record<DimensionKey, SignalCell | null>>;
}

const BUCKET_DOT_COLOR: Record<Bucket, string> = {
  bullish: 'bg-up',
  bearish: 'bg-down',
  neutral: 'bg-muted-foreground',
};

const BUCKET_TEXT_COLOR: Record<Bucket, string> = {
  bullish: 'text-up',
  bearish: 'text-down',
  neutral: 'text-muted-foreground',
};

/**
 * Build the 5-day pivot from a SummaryEntry. Strategy:
 *   1. Pick the canonical date series from the first non-errored
 *      dimension's bucketTrend. All other dimensions share the same
 *      dates (same upstream data), so this is sufficient as a join key.
 *   2. For each date, look up each dimension's sample at that index.
 *      The bucketTrend arrays are oldest→newest with identical length,
 *      so positional indexing is correct.
 *   3. Drop in the price-change for that day from entry.dailyChanges.
 *
 * The function returns oldest→newest; the timeline component reverses
 * it so the most recent day renders at the top.
 */
export function pivotByDay(entry: SummaryEntry): DayDetail[] {
  // Find a dimension with a usable trail to seed the date index.
  let dates: string[] | null = null;
  for (const k of DIMENSION_KEYS) {
    const dim = entry[k];
    if (dim?.bucketTrend && dim.bucketTrend.length > 0) {
      dates = dim.bucketTrend.map((s) => s.time);
      break;
    }
  }
  if (!dates) return [];

  // Pct-change lookup by ISO date — O(1) per access. The
  // dailyChanges length may differ from bucketTrend length on edge
  // cases (very young listings, holiday windows) so we tolerate gaps.
  const pctByDate = new Map<string, number | null>();
  for (const c of entry.dailyChanges) pctByDate.set(c.time, c.changePct);

  return dates.map((time, i) => {
    const signals: Partial<Record<DimensionKey, SignalCell | null>> = {};
    for (const k of DIMENSION_KEYS) {
      const dim = entry[k] as SummaryDimension | undefined;
      if (!dim || dim.error) {
        signals[k] = null;
        continue;
      }
      const sample = dim.bucketTrend?.[i];
      if (!sample) {
        signals[k] = null;
        continue;
      }
      const label =
        dim.bucketLabels?.[sample.bucket] ?? capitalize(sample.bucket);
      signals[k] = { bucket: sample.bucket, label };
    }
    return { time, changePct: pctByDate.get(time) ?? null, signals };
  });
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Format an ISO date as "Mon · 2026-05-23" — weekday-first per the
 * trail-tooltip convention; this matches what users see when they
 * hover a dot in the main summary table, so the modal feels like a
 * continuation of the same view.
 */
function formatDate(iso: string, locale: string): string {
  if (!iso) return '';
  try {
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    const wd = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
    return `${wd} · ${iso}`;
  } catch {
    return iso;
  }
}

export function formatPct(v: number | null): string {
  if (v == null || !Number.isFinite(v)) return '—';
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

/**
 * Price sparkline + 5-day signal timeline for one ticker. Shared by the
 * signed-in /indicators detail sheet and the public /stocks/[slug]
 * pages, so both surfaces render the exact same view.
 *
 * `autoScroll` scrolls the matching timeline node into view when a chart
 * dot is highlighted. Inside the sheet that scrolls the panel; on a full
 * page it would yank the window around on every hover, so pages pass false.
 */
export function SignalTimeline({
  entry,
  autoScroll = true,
}: {
  entry: SummaryEntry;
  autoScroll?: boolean;
}) {
  const dict = useDictionary();
  const locale = (dict.indicators?._localeHint as string) ?? 'en';

  // ISO date the user is inspecting via the sparkline dots; shared by the
  // chart and the timeline so the two views stay in sync.
  const [highlightDate, setHighlightDate] = React.useState<string | null>(null);

  // Opening a different ticker shouldn't carry over a stale glow.
  React.useEffect(() => {
    setHighlightDate(null);
  }, [entry.ticker]);

  const days = React.useMemo(() => pivotByDay(entry), [entry]);

  const emptyMsg =
    dict.indicators?.summary?.detailEmpty ?? 'No timeline data available.';

  const labelFor = (k: DimensionKey) => {
    const col = (dict.indicators?.summaryColumns ?? {}) as Partial<
      Record<DimensionKey, string>
    >;
    return col[k] ?? DIMENSION_FALLBACK_LABEL[k];
  };

  // Newest day on top — the rail reads like a stack of trading sessions.
  const orderedDays = [...days].reverse();

  return (
    <>
      {entry.prices && entry.prices.length >= 2 && (
        <PriceChart
          prices={entry.prices}
          recentDays={orderedDays.map((d) => ({
            time: d.time,
            changePct: d.changePct,
          }))}
          highlightDate={highlightDate}
          onHighlight={setHighlightDate}
          locale={locale}
        />
      )}

      {orderedDays.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {emptyMsg}
        </p>
      ) : (
        <ol className="relative">
          {/* The vertical timeline rail, anchored at x=7px — the centre
              of the 14px dot lane every TimelineNode uses, so the rail
              passes through every dot regardless of its size. */}
          <span
            aria-hidden="true"
            className="absolute bottom-1.5 left-[7px] top-1.5 border-l border-dashed border-border"
          />
          {orderedDays.map((d, i) => (
            <TimelineNode
              key={d.time || i}
              day={d}
              locale={locale}
              labelFor={labelFor}
              isLatest={i === 0}
              highlighted={highlightDate === d.time}
              autoScroll={autoScroll}
              onHover={(hovered) => setHighlightDate(hovered ? d.time : null)}
            />
          ))}
        </ol>
      )}
    </>
  );
}

function TimelineNode({
  day,
  locale,
  labelFor,
  isLatest,
  highlighted,
  autoScroll,
  onHover,
}: {
  day: DayDetail;
  locale: string;
  labelFor: (k: DimensionKey) => string;
  isLatest: boolean;
  /** When true the node is the currently-selected day from the sparkline. */
  highlighted: boolean;
  /** Scroll this node into view when it becomes highlighted. */
  autoScroll: boolean;
  /** Notified on mouse-enter/leave so hovering the row highlights the matching chart dot. */
  onHover: (hovered: boolean) => void;
}) {
  // When the parent sets this node as highlighted, scroll it into
  // view smoothly. This handles the case where the user clicks a
  // sparkline dot for an off-screen day — the timeline reveals the
  // matching row instead of leaving the user to scroll manually.
  // `block: 'nearest'` avoids the jarring "snap to centre" effect
  // when the node is already partially visible.
  const ref = React.useRef<HTMLLIElement | null>(null);
  React.useEffect(() => {
    if (autoScroll && highlighted && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [autoScroll, highlighted]);

  // Determine the dominant bucket of the day — used to colour the
  // timeline dot so the rail itself reads as a directional signal
  // before the user reads the per-indicator detail.
  const buckets = Object.values(day.signals)
    .filter((s): s is SignalCell => s != null)
    .map((s) => s.bucket);
  const bullishCount = buckets.filter((b) => b === 'bullish').length;
  const bearishCount = buckets.filter((b) => b === 'bearish').length;
  let dominant: Bucket = 'neutral';
  if (bullishCount > bearishCount) dominant = 'bullish';
  else if (bearishCount > bullishCount) dominant = 'bearish';

  return (
    // pb-10 (40px) opens the gap between days so each timeline node
    // gets visual breathing room — the 4-col indicator grid above
    // compresses each day to ~75px tall, which was leaving the rail
    // looking cramped at the previous pb-6 (24px).
    //
    // Highlight treatment: a soft accent-tinted background + ring
    // when this node matches the sparkline's selected day. The
    // negative inset extends the highlight slightly past the row's
    // content area so it visually connects to the adjacent days
    // instead of sitting as an isolated chip.
    <li
      ref={ref}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="relative pb-10 pl-6 last:pb-0"
    >
      {/* The dot — wrapped in a 14px-wide lane so the inner dot is
          horizontally centred regardless of its size. Without the
          lane, smaller dots (size-2.5 = 10px) at left:0 have their
          centre at x=5px while the larger dot (size-3.5 = 14px) at
          left:0 has its centre at x=7px — and the rail can only
          align with one of them. The wrapper fixes the lane width
          and `justify-center` aligns every dot to x=7, matching the
          rail at left-[7px]. The latest dot stays visually larger
          via the size class on the inner span.
          The dot sits OUTSIDE the highlight wrapper below so the
          timeline rail keeps its visual identity — the dot is part
          of the rail, the highlight belongs to the info block. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1 flex w-3.5 justify-center"
      >
        <span
          className={cn(
            'rounded-full ring-2 ring-card',
            isLatest ? 'size-3.5' : 'size-2.5',
            BUCKET_DOT_COLOR[dominant],
          )}
        />
      </span>

      {/* Info block — the single container that takes the highlight.
          Wrapping the date row + indicator grid in one div means the
          highlight is a tight rectangle around the visible content,
          not a loose box that also stretches across the 40px gap
          below (which is what made the previous ring-based highlight
          feel unevenly sized).
          The negative horizontal margin pulls the highlight edge a
          few pixels outside the content so the bg has breathing
          room and the visual cue reads as "this whole block is
          selected" rather than "this text has highlighter on it".
          The highlight bg follows that day's price-change direction
          (--up / --down tokens, market-colour aware) so the panel
          stays visually coherent with the day's tone — the chart
          dot, the price-change pill, and the block bg all speak the
          same colour language. */}
      <div
        className={cn(
          '-mx-2 rounded-md px-2 py-1.5 transition-colors',
          highlighted && day.changePct != null && day.changePct > 0 && 'bg-up/10',
          highlighted && day.changePct != null && day.changePct < 0 && 'bg-down/10',
          highlighted && (day.changePct == null || day.changePct === 0) && 'bg-muted',
        )}
      >
        <div className="flex items-baseline justify-between gap-3">
          <div className="font-mono text-xs font-semibold text-foreground">
            {formatDate(day.time, locale)}
          </div>
          <div
            className={cn(
              'font-mono text-xs tabular-nums',
              day.changePct == null && 'text-muted-foreground',
              day.changePct != null && day.changePct > 0 && 'text-up',
              day.changePct != null && day.changePct < 0 && 'text-down',
              day.changePct === 0 && 'text-muted-foreground',
            )}
          >
            {formatPct(day.changePct)}
          </div>
        </div>

        {/* Per-indicator detail grid. Pivoted horizontally to take
            advantage of the 50vw panel — at ~640-960px content width
            we can fit 4 indicators per row, collapsing 8 vertical
            rows into 2. This compresses each day's footprint from
            ~200px → ~75px, so the full 5-day timeline fits on a
            laptop screen without scrolling.
            - <md (mobile / narrow): 2 cols × 4 rows
            - >=lg (desktop): 4 cols × 2 rows
            Each cell is min-w-0 so the truncate on the label
            actually fires; without it, the grid would auto-expand
            to fit the longest label and break the column count. */}
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 lg:grid-cols-4">
          {DIMENSION_KEYS.map((k) => {
            const s = day.signals[k];
            return (
              <li
                key={k}
                className="flex min-w-0 items-center gap-1.5 text-xs"
              >
                <span className="w-9 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {labelFor(k)}
                </span>
                {s ? (
                  <>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'size-1.5 shrink-0 rounded-full',
                        BUCKET_DOT_COLOR[s.bucket],
                      )}
                    />
                    {/* `title` carries the full label so users on
                        narrow viewports (truncated cells) can hover
                        for the full reason text. */}
                    <span
                      className={cn('truncate', BUCKET_TEXT_COLOR[s.bucket])}
                      title={s.label}
                    >
                      {s.label}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

// ─── Price sparkline ────────────────────────────────────────────────

/**
 * Compact daily-close sparkline that sits above the signal timeline.
 *
 * Shows every available trading bar (the API hands us ~90 days back
 * for a 140-day calendar lookback). The five most-recent dates that
 * also appear in the timeline below are overlaid as clickable dots —
 * hover or click and the matching timeline node lights up + scrolls
 * into view, giving the user a fast "what did the price do on this
 * day, and what did each indicator say?" cross-reference.
 *
 * The chart line itself uses `currentColor` so it picks up the
 * panel's foreground tone; the recent-day dots use the accent token
 * to read as the interactive layer.
 */
function PriceChart({
  prices,
  recentDays,
  highlightDate,
  onHighlight,
  locale,
}: {
  prices: Array<{ time: string; close: number | null }>;
  /** Five most-recent days with their own daily pct so each dot can colour by direction. */
  recentDays: Array<{ time: string; changePct: number | null }>;
  highlightDate: string | null;
  onHighlight: (date: string | null) => void;
  locale: string;
}) {
  const closes = prices.map((p) => p.close);
  const range = rangeOf(closes);

  // ViewBox sized for a comfortable laptop view; SVG scales to the
  // panel width via width="100%". Right padding leaves the last dot
  // a little off the edge so it isn't clipped by the modal border.
  const W = 600;
  const H = 110;
  const padX = 6;
  const padTopY = 10;
  const padBottomY = 18;
  const innerH = H - padTopY - padBottomY;
  const stepX = (W - padX * 2) / Math.max(1, prices.length - 1);

  // Position lookup for the recent-date dots. Map by ISO date so we
  // don't depend on positional alignment between the prices array
  // and the timeline's dates array — defensive against any future
  // change in how either is built.
  const indexByTime = new Map<string, number>();
  for (let i = 0; i < prices.length; i++) indexByTime.set(prices[i].time, i);

  const projectY = (close: number) =>
    padTopY + innerH - ((close - range.min) / (range.max - range.min || 1)) * innerH;

  // Tone derived from each day's changePct. The chart layer doesn't
  // know about market-colour conventions — that's the job of the
  // --up / --down CSS tokens, which the user's settings flip
  // between red-up (CN default) and green-up (US default). All we
  // do here is pick the right token by sign.
  type DayTone = 'up' | 'down' | 'flat';
  const toneOf = (pct: number | null | undefined): DayTone => {
    if (pct == null || !Number.isFinite(pct) || pct === 0) return 'flat';
    return pct > 0 ? 'up' : 'down';
  };

  const days = recentDays
    .map((r) => {
      const i = indexByTime.get(r.time);
      if (i == null) return null;
      const close = prices[i].close;
      if (close == null || !Number.isFinite(close)) return null;
      return {
        time: r.time,
        close,
        x: padX + i * stepX,
        y: projectY(close),
        tone: toneOf(r.changePct),
      };
    })
    .filter(
      (
        d,
      ): d is {
        time: string;
        close: number;
        x: number;
        y: number;
        tone: DayTone;
      } => d != null,
    );

  // First and last visible dates — surfaced as small axis labels so
  // the user can place the chart in time without having to hover.
  const firstDate = prices[0]?.time ?? '';
  const lastDate = prices[prices.length - 1]?.time ?? '';

  // Hover-tracking state via the shared hook — same pointer-to-index
  // logic every indicator card uses, so the modal chart and the
  // individual indicator charts feel identical to interact with.
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const { hoverIdx, onPointerMove, onPointerLeave } = useChartHover({
    svgRef,
    dataLength: prices.length,
    viewBoxWidth: W,
    padX,
  });

  // The hovered bar (or null when not hovering / when close is null).
  const hovered =
    hoverIdx != null && prices[hoverIdx]?.close != null
      ? {
          time: prices[hoverIdx].time,
          close: prices[hoverIdx].close as number,
          x: padX + hoverIdx * stepX,
          y: projectY(prices[hoverIdx].close as number),
        }
      : null;

  return (
    <div className="relative mb-5">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="none"
        className="block"
        // Pointer events come from the shared useChartHover hook —
        // same logic the indicator cards use.
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {/* Price line — uses currentColor + a text-foreground class
            so the line follows the same tone as body text. No
            baseline below it; the price line is anchored by the
            axis-date labels under the chart, and an extra rule
            below the line just adds visual noise on a sparkline
            this compact. */}
        <path
          d={buildPath(closes, W, H, range.min, range.max, padX, padTopY)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="text-foreground"
        />
        {/* Recent-day dots. Each dot is wrapped in a transparent hit
            target that's 2-3× the visible radius, so clicks don't
            need pixel-perfect aim — important on touchscreens and
            for users with motor-control variation. */}
        {days.map((d) => {
          const isActive = highlightDate === d.time;
          return (
            <g
              key={d.time}
              onClick={() => onHighlight(isActive ? null : d.time)}
              onMouseEnter={() => onHighlight(d.time)}
              onMouseLeave={() => onHighlight(null)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={`${d.time}: ${d.close.toFixed(2)}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onHighlight(isActive ? null : d.time);
                }
              }}
            >
              {/* Hit target — larger than the visible dot for
                  comfortable clicking */}
              <circle cx={d.x} cy={d.y} r="10" fill="transparent" />
              {/* Visible dot — coloured by the day's direction (up
                  / down / flat) via the existing market-colour
                  tokens, slightly larger when active so the linkage
                  to the timeline is obvious. Using currentColor +
                  a text-* class lets the CSS variable flip when the
                  user toggles red-up vs green-up in settings, with
                  no chart-level branching. */}
              <circle
                cx={d.x}
                cy={d.y}
                r={isActive ? 5 : 3.5}
                fill="currentColor"
                stroke="var(--card)"
                strokeWidth="1.5"
                className={cn(
                  'transition-all',
                  d.tone === 'up' && 'text-up',
                  d.tone === 'down' && 'text-down',
                  d.tone === 'flat' && 'text-muted-foreground',
                  // When inactive, soften the dot so the active one
                  // visually leads — the linkage to the timeline
                  // glow is then unmistakable.
                  !isActive && 'opacity-70',
                )}
              />
              {/* Native SVG tooltip — date + close on hover.
                  Localised weekday + price format. */}
              <title>{`${formatDate(d.time, locale)} · ${d.close.toFixed(2)}`}</title>
            </g>
          );
        })}

        {/* Hover guide — uses the shared SVG fragment so the dashed
            line + foreground crosshair dot look identical to every
            indicator card. Drawn AFTER the recent-day dots so it
            sits on top of them when they share an x. */}
        <HoverGuide
          hoverIdx={hoverIdx}
          x={hovered?.x ?? 0}
          y={hovered?.y ?? 0}
          topY={padTopY}
          bottomY={H - padBottomY}
        />
      </svg>

      {/* HTML tooltip via the shared component. Same pinning logic
          (centred above the dot, 10px gap, pointer-events-none) as
          every card. Content here is price-only since this is the
          modal price sparkline — cards supply richer rows. */}
      {hovered && (
        <HoverTooltip
          hoverIdx={hoverIdx}
          xPct={(hovered.x / W) * 100}
          yPct={(hovered.y / H) * 100}
        >
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {formatDate(hovered.time, locale)}
          </div>
          <div className="font-mono text-sm font-semibold tabular-nums text-foreground">
            {hovered.close.toFixed(2)}
          </div>
        </HoverTooltip>
      )}

      {/* Tiny axis labels under the chart so a user can place the
          line in absolute time without depending on dot tooltips. */}
      <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{firstDate}</span>
        <span>{lastDate}</span>
      </div>
    </div>
  );
}

