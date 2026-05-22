'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export type Bucket = 'bullish' | 'bearish' | 'neutral';

/**
 * One sample point of the bucket trend the card draws as a leading
 * sparkline inside the status pill. Wire-format matches the API's
 * `bucketTrend` field (see lib/indicators/math.ts → BucketSample).
 */
export interface BucketSample {
  time: string;
  bucket: Bucket;
}

// Every "bucket has a colour" map below references `up` / `down`
// instead of `rose` / `emerald` so the user-selected market-colour
// convention (red-up CN vs red-down US/EU — toggled in the user
// menu) flows through automatically. Bullish always means "price
// went up"; whether that's painted red or green is decided once
// in globals.css via the `--up` / `--down` CSS vars.
const BUCKET_COLOR: Record<Bucket, string> = {
  bullish: 'bg-up/15 text-up border-up/30',
  bearish: 'bg-down/15 text-down border-down/30',
  neutral: 'bg-muted text-muted-foreground border-border',
};

const BUCKET_DOT_COLOR: Record<Bucket, string> = {
  bullish: 'bg-up',
  bearish: 'bg-down',
  neutral: 'bg-muted-foreground',
};

/**
 * Tinted tooltip body that echoes the dot it's annotating. Uses the
 * `up` / `down` tokens with two alpha tiers — a soft `/10` background
 * in light mode and a denser `/20` in dark mode so the chip stays
 * visible against either page background without losing its
 * floating-card feel. Border and text both lock to the same hue at
 * higher strength so the chip reads as one continuous swatch.
 *
 * Date sub-row inside inherits the parent text colour and is dimmed
 * with `opacity-70` — keeps the headline reason line as the visual
 * focal point without paying for a second per-bucket colour map.
 */
const BUCKET_TOOLTIP_CLASS: Record<Bucket, string> = {
  bullish: 'bg-up/10 dark:bg-up/20 border-up/40 text-up',
  bearish: 'bg-down/10 dark:bg-down/20 border-down/40 text-down',
  // Neutral falls back to the default popover styling — no override
  // class needed. Keeping the entry here so the lookup never returns
  // undefined and surrounding code stays branch-free.
  neutral: '',
};

export function CardShell({
  ticker,
  displayName,
  bucket,
  bucketLabel,
  bucketTrend,
  bucketLabels,
  asOf,
  children,
  metrics,
}: {
  ticker: string;
  /**
   * Human-readable company name shown beside the ticker so users don't have
   * to mentally translate "0700.HK" or "002594.SZ". Optional — falls back to
   * showing the ticker alone when the holdings store didn't capture a name.
   */
  displayName?: string | null;
  bucket?: Bucket;
  bucketLabel?: string;
  /**
   * Last N bucket samples (oldest → newest, last entry = today). When
   * present the pill renders a leading dot trail so users can see how
   * the signal evolved across the trading week, not just today's call.
   * Omit to fall back to the single-dot legacy badge.
   */
  bucketTrend?: BucketSample[];
  /**
   * Full localised label map for the current dimension — used by the
   * per-dot hover tooltip so a past *bearish* day shows the SAME
   * phrasing the headline pill uses on a current-bearish card
   * ("Bearish · death cross" for MACD, "Bearish · MA aligned down"
   * for MA, etc.) instead of the bare bucket name.
   *
   * Optional. When omitted the tooltip falls back to the raw bucket.
   */
  bucketLabels?: Record<Bucket, string>;
  asOf?: string | null;
  children: React.ReactNode;
  metrics?: React.ReactNode;
}) {
  return (
    <article className="rounded-lg border border-border bg-card overflow-hidden">
      <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-mono text-sm font-semibold truncate">{ticker}</span>
            {asOf && <span className="text-xs text-muted-foreground">{asOf}</span>}
          </div>
          {displayName && (
            <span className="truncate text-xs text-muted-foreground">{displayName}</span>
          )}
        </div>
        {bucket && bucketLabel && (
          // Status pill — leading dot trail (last N days, oldest →
          // newest) followed by the bucket label. The trail's
          // rightmost dot is always "today" and matches the
          // pill's overall colour, while preceding dots show how
          // the signal evolved — turning the badge into a
          // mini-timeline without adding a second row.
          //
          // Each trail dot is hover-titled with `<date> · <bucket>`
          // so users can pin down which day flipped. We don't
          // animate or vary spacing on size — keeps the scan-line
          // calm when 12 cards sit on screen.
          <BucketBadge
            bucket={bucket}
            bucketLabel={bucketLabel}
            bucketTrend={bucketTrend}
            bucketLabels={bucketLabels}
            variant="full"
          />
        )}
      </header>
      <div className="px-3 pt-3">{children}</div>
      {metrics && <div className="grid grid-cols-4 gap-2 px-3 py-3 text-xs">{metrics}</div>}
    </article>
  );
}

/**
 * The status pill rendered in card headers + summary rows. Two
 * variants:
 *   - 'full' (default for cards): dot trail + bucket label (e.g.
 *     "Bullish · golden cross"). Reads as a complete sentence.
 *   - 'compact': dot trail only, no label, narrower pill — used by
 *     the summary table where four badges sit on one row and the
 *     reason text would crowd everything out. Hover tooltips on
 *     each dot still surface the reason per-day, so meaning is
 *     never lost; we just don't pre-render it on the badge face.
 *
 * Exported so the summary view can reuse the exact same trail +
 * tooltip behaviour the card headers ship with — one source of
 * truth for "what a bucket trail looks like" across the app.
 */
export function BucketBadge({
  bucket,
  bucketLabel,
  bucketTrend,
  bucketLabels,
  variant = 'full',
}: {
  bucket: Bucket;
  bucketLabel?: string;
  bucketTrend?: BucketSample[];
  bucketLabels?: Record<Bucket, string>;
  variant?: 'full' | 'compact';
}) {
  // Trail rendering details:
  // - Past dots use a lighter tone (opacity-50) so the "today" dot,
  //   which is also the colour the surrounding pill picks up, reads
  //   as the focal point.
  // - The last sample in the trend IS today; we drop it from the
  //   leading dots and let the existing "today" dot (always rendered)
  //   close the row — avoids drawing the same date twice.
  const past = bucketTrend && bucketTrend.length > 1 ? bucketTrend.slice(0, -1) : [];
  const today = bucketTrend?.[bucketTrend.length - 1];
  const showLabel = variant === 'full' && Boolean(bucketLabel);

  // One TooltipProvider scoped to this badge keeps the rich tooltips
  // local — we don't want every chip on the page sharing a global
  // delay configuration. 150ms is fast enough to feel responsive on a
  // 6-pixel hover target without firing accidentally during scroll.
  return (
    <TooltipProvider delayDuration={150}>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border text-xs font-semibold shrink-0',
          // Compact variant tightens the padding because there's no
          // label text — keeps the pill from looking like an empty
          // shell around the trail.
          variant === 'full' ? 'px-2.5 py-1' : 'px-1.5 py-0.5',
          BUCKET_COLOR[bucket],
        )}
      >
        {past.length > 0 && (
          <span
            className="flex items-center gap-1"
            // Group label for SR users — individual dot triggers carry
            // the precise date + reason in aria-label as well.
            aria-label="Signal history, oldest first"
          >
            {past.map((s, i) => (
              <BucketDot
                key={`${s.time}-${i}`}
                sample={s}
                bucketLabels={bucketLabels}
                size="sm"
              />
            ))}
          </span>
        )}
        {today ? (
          <BucketDot sample={today} bucketLabels={bucketLabels} size="md" />
        ) : (
          // No trend data — render the legacy solo dot so existing
          // surfaces that don't pass `bucketTrend` still get a badge.
          <span
            className={cn('size-2 rounded-full shrink-0', BUCKET_DOT_COLOR[bucket])}
            aria-hidden="true"
          />
        )}
        {showLabel && bucketLabel}
      </span>
    </TooltipProvider>
  );
}

/**
 * One hover-tooltip-ready dot in the bucket trail. The wrapping
 * `<span>` is the tooltip trigger — Radix' Slot machinery forwards
 * refs through it. We render the dot itself, not a button, because
 * the trail is a passive read-out (no click action) and a real
 * button would draw focus rings on hover.
 *
 * Tooltip content: small date+weekday header on top, then the
 * dimension-specific reason label ("Bullish · golden cross" etc.)
 * picked from `bucketLabels`. Two lines lets users instantly see
 * "which day was this, and what call did the system make then" —
 * which is the whole point of the trail.
 */
function BucketDot({
  sample,
  bucketLabels,
  size,
}: {
  sample: BucketSample;
  bucketLabels?: Record<Bucket, string>;
  size: 'sm' | 'md';
}) {
  const reason = bucketLabels?.[sample.bucket] ?? capitalize(sample.bucket);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="img"
          aria-label={`${sample.time} · ${reason}`}
          className={cn(
            'rounded-full shrink-0 cursor-help',
            size === 'sm' && 'size-1.5 opacity-50 transition-opacity hover:opacity-100',
            size === 'md' && 'size-2',
            BUCKET_DOT_COLOR[sample.bucket],
          )}
        />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className={cn('text-center', BUCKET_TOOLTIP_CLASS[sample.bucket])}
      >
        <div className="text-[10px] uppercase tracking-wide opacity-70">
          {formatTooltipDate(sample.time)}
        </div>
        <div className="text-xs font-medium">{reason}</div>
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Format an ISO date as "Mon · 2026-05-18" — weekday first because
 * users orient on the trading week (Mon/Tue/Wed), and the absolute
 * date stays available for precision. Weekday uses the browser's
 * resolved locale so EU/Asia users see localised abbreviations.
 *
 * Falls back to the raw ISO if the string can't be parsed — never
 * throws inside a render path.
 */
function formatTooltipDate(iso: string): string {
  if (!iso) return '';
  try {
    // `T00:00:00` pins parsing to the local timezone so we don't drift
    // a day when running in a UTC-offset locale.
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    const wd = new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(d);
    return `${wd} · ${iso}`;
  } catch {
    return iso;
  }
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
}

export function MetricCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="space-y-0.5">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={cn(
          'font-mono font-semibold',
          // tone='up' / 'down' resolve through globals.css so the same
          // metric cell paints red on a CN profile and green on a US
          // profile when price went up. See [data-market-color] swap.
          tone === 'up' && 'text-up',
          tone === 'down' && 'text-down',
        )}
      >
        {value ?? '—'}
      </div>
    </div>
  );
}

export function ErrorCard({
  ticker,
  displayName,
  message,
}: {
  ticker: string;
  displayName?: string | null;
  message: string;
}) {
  return (
    <article className="rounded-lg border border-destructive/40 bg-destructive/5 p-3">
      <div className="font-mono text-sm font-semibold">{ticker}</div>
      {displayName && (
        <div className="text-xs text-muted-foreground">{displayName}</div>
      )}
      <div className="mt-1 text-xs text-muted-foreground">{message}</div>
    </article>
  );
}

// ─── Chart primitives — inline SVG, no chart lib dep ─────────────────

export interface Point {
  x: number;
  y: number;
}

/**
 * Map an array of values onto an SVG-coordinate path, padding null gaps by
 * starting a fresh sub-path so the line renders with breaks rather than
 * lying through interpolation.
 */
export function buildPath(
  values: Array<number | null>,
  width: number,
  height: number,
  min: number,
  max: number,
  paddingX = 0,
  paddingY = 4,
): string {
  if (values.length === 0 || max === min) return '';
  const stepX = (width - paddingX * 2) / Math.max(1, values.length - 1);
  const innerH = height - paddingY * 2;
  let d = '';
  let started = false;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null || !Number.isFinite(v)) {
      started = false;
      continue;
    }
    const x = paddingX + i * stepX;
    const y = paddingY + innerH - ((v - min) / (max - min)) * innerH;
    d += started ? `L ${x.toFixed(2)} ${y.toFixed(2)} ` : `M ${x.toFixed(2)} ${y.toFixed(2)} `;
    started = true;
  }
  return d.trim();
}

/** Min/max across one or more nullable series. */
export function rangeOf(...series: Array<Array<number | null>>): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const s of series) {
    for (const v of s) {
      if (v == null || !Number.isFinite(v)) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    return { min: 0, max: 1 };
  }
  return { min, max };
}

export function formatNum(n: unknown, digits = 2): string {
  if (n == null || n === undefined) return '—';
  const v = Number(n);
  if (!Number.isFinite(v)) return '—';
  const abs = Math.abs(v);
  if (abs >= 1e12) return `${(v / 1e12).toFixed(1)}T`;
  if (abs >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toFixed(digits);
}

export function formatPct(n: unknown, digits = 2): string {
  if (n == null) return '—';
  const v = Number(n);
  if (!Number.isFinite(v)) return '—';
  return `${v.toFixed(digits)}%`;
}
