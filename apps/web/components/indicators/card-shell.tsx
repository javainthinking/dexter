'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

export type Bucket = 'bullish' | 'bearish' | 'neutral';

const BUCKET_COLOR: Record<Bucket, string> = {
  bullish: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
  bearish: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export function CardShell({
  ticker,
  bucket,
  bucketLabel,
  asOf,
  children,
  metrics,
}: {
  ticker: string;
  bucket?: Bucket;
  bucketLabel?: string;
  asOf?: string | null;
  children: React.ReactNode;
  metrics?: React.ReactNode;
}) {
  return (
    <article className="rounded-lg border border-border bg-card overflow-hidden">
      <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-mono text-sm font-semibold truncate">{ticker}</span>
          {asOf && <span className="text-xs text-muted-foreground">{asOf}</span>}
        </div>
        {bucket && bucketLabel && (
          <span
            className={cn(
              'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide',
              BUCKET_COLOR[bucket],
            )}
          >
            {bucketLabel}
          </span>
        )}
      </header>
      <div className="px-3 pt-3">{children}</div>
      {metrics && <div className="grid grid-cols-4 gap-2 px-3 py-3 text-xs">{metrics}</div>}
    </article>
  );
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

export function ErrorCard({ ticker, message }: { ticker: string; message: string }) {
  return (
    <article className="rounded-lg border border-destructive/40 bg-destructive/5 p-3">
      <div className="font-mono text-sm font-semibold">{ticker}</div>
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
