'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDictionary } from '../i18n/dictionary-provider';
import {
  buildPath,
  formatNum,
  rangeOf,
  type Bucket,
} from './card-shell';
import { type SummaryEntry, type SummaryDimension } from './summary-view';

/**
 * Dimension columns shown inside the detail timeline. Same order as
 * the summary table so the user's mental layout transfers directly
 * (MACD reads in the same row position on both surfaces).
 */
const DIMENSION_KEYS = ['macd', 'ma', 'rsi', 'kdj', 'boll', 'adx', 'volume', 'flow'] as const;
type DimensionKey = (typeof DIMENSION_KEYS)[number];

const DIMENSION_FALLBACK_LABEL: Record<DimensionKey, string> = {
  macd: 'MACD',
  ma: 'MA',
  rsi: 'RSI',
  kdj: 'KDJ',
  boll: 'BOLL',
  adx: 'ADX',
  volume: 'Vol',
  flow: 'Flow',
};

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
function pivotByDay(entry: SummaryEntry): DayDetail[] {
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

function formatPct(v: number | null): string {
  if (v == null || !Number.isFinite(v)) return '—';
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

/**
 * Right-side slide-in panel showing the cross-indicator detail for one
 * ticker. Wraps Radix Dialog primitives directly — the project's
 * existing Dialog component centres content; we override positioning
 * here rather than introducing a new "Sheet" abstraction the codebase
 * doesn't yet need.
 */
export function TickerDetailSheet({
  entry,
  onOpenChange,
}: {
  /** Selected summary row — `null` keeps the dialog closed. */
  entry: SummaryEntry | null;
  onOpenChange: (open: boolean) => void;
}) {
  const dict = useDictionary();
  const locale = (dict.indicators?._localeHint as string) ?? 'en';

  // The Radix Dialog needs to mount with a controlled `open` prop. We
  // derive it from `entry != null` — a single source of truth keeps
  // close-on-x and close-on-overlay-click both routing through
  // onOpenChange in the parent.
  const open = entry != null;

  // ISO date string of the day the user is currently inspecting via
  // the sparkline dots. `null` = no highlight (the default state when
  // the sheet opens). Both the chart and the timeline read this so
  // the two views stay in sync — click a dot, the timeline node
  // glows; hover the chart, the row gets a soft ring.
  const [highlightDate, setHighlightDate] = React.useState<string | null>(null);

  // Reset highlight whenever the open ticker changes, so opening
  // a different row doesn't carry over a stale glow from the
  // previous one.
  React.useEffect(() => {
    if (!open) setHighlightDate(null);
  }, [open, entry?.ticker]);

  // Build the timeline data only when an entry exists. Cheap (a single
  // pass over 5 × 8 = 40 cells) but skipping the work when closed
  // avoids a stale-data flash during the close-animation tail.
  const days = React.useMemo(() => (entry ? pivotByDay(entry) : []), [entry]);

  const sheetTitle =
    dict.indicators?.summary?.detailTitle ?? 'Signal timeline';
  const sheetSubtitle =
    dict.indicators?.summary?.detailSubtitle ??
    'The last 5 trading days · every indicator, every day';
  const emptyMsg =
    dict.indicators?.summary?.detailEmpty ?? 'No timeline data available.';
  const closeLabel = dict.indicators?.summary?.detailClose ?? 'Close';

  const labelFor = (k: DimensionKey) => {
    const col = (dict.indicators?.summaryColumns ?? {}) as Partial<
      Record<DimensionKey, string>
    >;
    return col[k] ?? DIMENSION_FALLBACK_LABEL[k];
  };

  // Reverse the day order so the most recent day sits at the top of
  // the timeline. Per the spec — "时间线从下到上列5个点" — the user
  // expects newest-on-top with the vertical axis reading like a stack
  // of trading sessions.
  const orderedDays = [...days].reverse();

  // Today's price change is the last entry in dailyChanges (entries
  // are ordered oldest → newest in SummaryEntry, mirroring the trail
  // dates). We surface it next to latestClose in the header so users
  // see "what the price is now" + "how it moved today" in one glance.
  const todayChange =
    entry && entry.dailyChanges.length > 0
      ? entry.dailyChanges[entry.dailyChanges.length - 1]
      : null;

  // 5-day cumulative return: compound the daily percent changes so
  // `(1 + 0.012)(1 + 0.008)...(1 + 0.015) − 1` gives the actual
  // 5-bar price return (not just the arithmetic sum, which slightly
  // overstates on positive runs and understates on negative ones).
  // Skip null pct entries — they're rare data gaps and treating
  // them as 0% change is the right neutral assumption.
  //
  // Only meaningful when we have the full 5-day window. With fewer
  // bars the label "5D" would be misleading, so we suppress the
  // stat instead of showing a partial number.
  let fiveDayChange: number | null = null;
  if (entry && entry.dailyChanges.length >= 5) {
    let factor = 1;
    let hadAny = false;
    for (const c of entry.dailyChanges) {
      if (c.changePct == null || !Number.isFinite(c.changePct)) continue;
      factor *= 1 + c.changePct / 100;
      hadAny = true;
    }
    if (hadAny) fiveDayChange = (factor - 1) * 100;
  }

  const lastLabel = dict.indicators?.metrics?.latest ?? 'Last';
  const changeLabel = dict.indicators?.metrics?.change ?? 'Chg %';
  const fiveDayLabel = dict.indicators?.metrics?.fiveDayChange ?? '5D %';

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-background/70 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <DialogPrimitive.Content
          // Right-side slide-in panel. The fixed positioning + width
          // overrides Radix's default centred dialog. On mobile the
          // panel takes the full viewport (the summary table is
          // already vertical-scroll context, no value in showing
          // both); on >=md viewports we open to 50vw, with a 640px
          // floor so the horizontal indicator grid below stays
          // readable on tablets. The underlying summary table is
          // still visible on the left half so the user keeps
          // visual context for which row they clicked.
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-full flex-col',
            'md:w-[50vw] md:min-w-[640px]',
            'border-l border-border bg-card text-card-foreground shadow-[var(--shadow-elev2)]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
            'duration-200',
          )}
        >
          {/* Header — sticky so the ticker stays visible while the
              timeline scrolls inside the body. Layout splits into:
                - left column: ticker identity + price block + eyebrow
                - right column: close button + as-of date stamp
              The price block sits between the identity and the
              eyebrow so the user reads identity → "what is it worth
              right now" → "what is this view" top-to-bottom. */}
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div className="min-w-0 flex-1">
              <DialogPrimitive.Title className="truncate font-mono text-base font-semibold">
                {entry?.ticker ?? ''}
              </DialogPrimitive.Title>
              {entry?.displayName && (
                <div className="truncate text-xs text-muted-foreground">
                  {entry.displayName}
                </div>
              )}

              {/* Price block — only renders when at least one
                  dimension's fetch succeeded (otherwise latestClose
                  is null and we hide the row entirely rather than
                  showing a dash). The price uses the same formatNum
                  helper the per-dimension cards use, so the number
                  formatting matches across surfaces.
                  flex-wrap on the row so on narrow viewports the
                  stats stack to a second line instead of overflowing
                  the panel header. */}
              {(entry?.latestClose != null ||
                todayChange?.changePct != null ||
                fiveDayChange != null) && (
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {entry?.latestClose != null && (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {lastLabel}
                      </span>
                      <span className="font-mono text-base font-semibold tabular-nums text-foreground">
                        {formatNum(entry.latestClose, 2)}
                      </span>
                    </div>
                  )}
                  {todayChange?.changePct != null && Number.isFinite(todayChange.changePct) && (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {changeLabel}
                      </span>
                      <span
                        className={cn(
                          'font-mono text-sm font-semibold tabular-nums',
                          todayChange.changePct > 0 && 'text-up',
                          todayChange.changePct < 0 && 'text-down',
                          todayChange.changePct === 0 && 'text-muted-foreground',
                        )}
                      >
                        {todayChange.changePct > 0 ? '+' : ''}
                        {todayChange.changePct.toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {fiveDayChange != null && Number.isFinite(fiveDayChange) && (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {fiveDayLabel}
                      </span>
                      <span
                        className={cn(
                          'font-mono text-sm font-semibold tabular-nums',
                          fiveDayChange > 0 && 'text-up',
                          fiveDayChange < 0 && 'text-down',
                          fiveDayChange === 0 && 'text-muted-foreground',
                        )}
                      >
                        {fiveDayChange > 0 ? '+' : ''}
                        {fiveDayChange.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              <DialogPrimitive.Description className="mt-2.5 text-[11px] uppercase tracking-[0.18em] text-subtle font-mono">
                {sheetTitle}
              </DialogPrimitive.Description>
              <div className="mt-0.5 text-xs text-muted-foreground">{sheetSubtitle}</div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <DialogPrimitive.Close
                className={cn(
                  'rounded-md p-1 text-muted-foreground transition-colors',
                  'hover:bg-muted hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
                aria-label={closeLabel}
              >
                <X className="size-4" />
              </DialogPrimitive.Close>
              {entry?.latestAsOf && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  {entry.latestAsOf}
                </span>
              )}
            </div>
          </div>

          {/* Body — sparkline up top, timeline below. The whole
              region scrolls together so on a short viewport the
              chart slides out of view as the user scrolls down the
              timeline, instead of hogging permanent header space. */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {entry?.prices && entry.prices.length >= 2 && (
              <PriceChart
                prices={entry.prices}
                /* The five most-recent days that get clickable
                   dots. Each carries its changePct so the dot can
                   colour itself by direction — up = `--up`, down =
                   `--down`, neutral = muted — matching what the
                   timeline node's price-change cell shows for the
                   same day. */
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
                {/* The vertical timeline rail. Absolute-positioned so
                    its height tracks the parent list and the dots can
                    sit on top of it. The rail is anchored at x=7px —
                    the centre of the 14px (size-3.5) dot lane below.
                    Every dot is centred inside a 14px-wide lane (see
                    TimelineNode) so smaller dots share the same
                    x-centre as the larger "latest" dot — the rail
                    therefore passes through every dot's centre, not
                    just the largest one. */}
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
                    // First (top) node is "today" — visually emphasize
                    // it. Last node is "5 days ago" — fades into the
                    // historical context.
                    isLatest={i === 0}
                    highlighted={highlightDate === d.time}
                    onHover={(hovered) =>
                      setHighlightDate(hovered ? d.time : null)
                    }
                  />
                ))}
              </ol>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function TimelineNode({
  day,
  locale,
  labelFor,
  isLatest,
  highlighted,
  onHover,
}: {
  day: DayDetail;
  locale: string;
  labelFor: (k: DimensionKey) => string;
  isLatest: boolean;
  /** When true the node is the currently-selected day from the sparkline. */
  highlighted: boolean;
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
    if (highlighted && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [highlighted]);

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

  // Hover-tracking state: nearest-index of the bar the user is
  // currently hovering. `null` = no hover. The chart projects the
  // pointer's clientX into viewBox space, then rounds to the closest
  // data bar — snapping to actual data is the standard chart-tooltip
  // pattern and gives a much steadier read than a free-floating line.
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const pointerToIndex = React.useCallback(
    (clientX: number): number | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return null;
      // Map clientX → viewBox X. The SVG has width="100%" and a fixed
      // viewBox, so the ratio of (clientX − left)/width gives the
      // viewBox-normalised X directly.
      const ratio = (clientX - rect.left) / rect.width;
      const viewBoxX = Math.max(0, Math.min(1, ratio)) * W;
      const dataX = viewBoxX - padX;
      const idx = Math.round(dataX / stepX);
      return Math.max(0, Math.min(prices.length - 1, idx));
    },
    [prices.length, stepX],
  );

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
        // Pointer events drive the hover-to-read-price flow. Using
        // onPointerMove (not onMouseMove) means touch + stylus
        // tracking work too without extra wiring.
        onPointerMove={(e) => setHoverIdx(pointerToIndex(e.clientX))}
        onPointerLeave={() => setHoverIdx(null)}
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

        {/* Hover guide — vertical dashed rule that follows the
            user's pointer across the chart. Drawn AFTER the recent
            dots so it sits on top when the two overlap. Falls back
            to no-op when hoverIdx is null. */}
        {hovered && (
          <g aria-hidden="true">
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={padTopY}
              y2={H - padBottomY}
              stroke="currentColor"
              strokeWidth="0.75"
              strokeDasharray="2 3"
              className="text-muted-foreground opacity-60"
            />
            {/* Crosshair dot — neutral foreground tone so it reads as
                "here is the pointer" rather than as a directional
                signal that competes with the up/down recent dots. */}
            <circle
              cx={hovered.x}
              cy={hovered.y}
              r={3}
              fill="currentColor"
              stroke="var(--card)"
              strokeWidth="1.5"
              className="text-foreground"
            />
          </g>
        )}
      </svg>

      {/* HTML tooltip overlay — positioned absolutely on top of the
          chart wrapper. Using CSS percentages keeps the tooltip's
          horizontal position synced to the viewBox X coordinate as
          the chart scales (the SVG itself uses width="100%"), so we
          don't have to read the SVG's actual pixel width on every
          mousemove. The tooltip pins above the hover dot with an
          8px gap and `pointer-events-none` so it can't intercept
          the cursor itself. */}
      {hovered && (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute z-10 whitespace-nowrap',
            'rounded-md border border-border bg-popover px-2 py-1 shadow-[var(--shadow-elev1)]',
          )}
          style={{
            left: `${(hovered.x / W) * 100}%`,
            top: `${(hovered.y / H) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 10px))',
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {formatDate(hovered.time, locale)}
          </div>
          <div className="font-mono text-sm font-semibold tabular-nums text-foreground">
            {hovered.close.toFixed(2)}
          </div>
        </div>
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

