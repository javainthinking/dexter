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

const BUCKET_COLOR: Record<Bucket, string> = {
  bullish: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
  bearish: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  neutral: 'bg-muted text-muted-foreground border-border',
};

/**
 * Solid status dot rendered inside the bucket badge. Sits at the
 * stronger end of the color scale so the call is readable at a glance
 * even when the muted card chrome surrounds it. Red-up / green-down
 * per the China-market convention used elsewhere in the app.
 */
const BUCKET_DOT_COLOR: Record<Bucket, string> = {
  bullish: 'bg-rose-500',
  bearish: 'bg-emerald-500',
  neutral: 'bg-muted-foreground',
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
          />
        )}
      </header>
      <div className="px-3 pt-3">{children}</div>
      {metrics && <div className="grid grid-cols-4 gap-2 px-3 py-3 text-xs">{metrics}</div>}
    </article>
  );
}

function BucketBadge({
  bucket,
  bucketLabel,
  bucketTrend,
  bucketLabels,
}: {
  bucket: Bucket;
  bucketLabel: string;
  bucketTrend?: BucketSample[];
  bucketLabels?: Record<Bucket, string>;
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

  // One TooltipProvider scoped to this badge keeps the rich tooltips
  // local — we don't want every chip on the page sharing a global
  // delay configuration. 150ms is fast enough to feel responsive on a
  // 6-pixel hover target without firing accidentally during scroll.
  return (
    <TooltipProvider delayDuration={150}>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shrink-0',
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
        {bucketLabel}
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
      <TooltipContent side="top" className="text-center">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
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
          tone === 'up' && 'text-rose-500',
          tone === 'down' && 'text-emerald-500',
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
