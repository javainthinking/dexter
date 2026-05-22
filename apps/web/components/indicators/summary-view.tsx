'use client';

import * as React from 'react';
import { BucketBadge, type Bucket, type BucketSample } from './card-shell';

/**
 * Per-dimension reading for one ticker. Shape mirrors what the
 * individual indicator endpoints return — the indicators-client
 * merges the four parallel fetches into this denormalised form so
 * the summary view doesn't have to know about HTTP plumbing.
 */
export interface SummaryDimension {
  bucket?: Bucket;
  bucketTrend?: BucketSample[];
  /**
   * Full dimension-specific reason labels (Bullish · golden cross,
   * etc.) for all three buckets — used by the per-dot hover tooltip
   * so a past bearish day on the MACD trail shows MACD's phrasing,
   * not bare "bearish". Same map shape every card already builds.
   */
  bucketLabels?: Record<Bucket, string>;
  /** Per-ticker error (Yahoo blew up, ticker not found, etc.). */
  error?: string;
}

export interface SummaryEntry {
  ticker: string;
  displayName: string | null;
  macd: SummaryDimension;
  ma: SummaryDimension;
  volume: SummaryDimension;
  flow: SummaryDimension;
}

/**
 * Compact dimension keys + short labels used in the column header
 * row and on each cell. MACD / MA / Vol / Flow are universal in
 * financial UIs — no i18n needed; localising them would actually
 * hurt scannability for cross-locale traders.
 */
const DIMENSIONS = [
  { key: 'macd' as const, label: 'MACD' },
  { key: 'ma' as const, label: 'MA' },
  { key: 'volume' as const, label: 'Vol' },
  { key: 'flow' as const, label: 'Flow' },
];

/**
 * Cross-dimension summary table. One row per ticker, four compact
 * bucket-trail badges side-by-side — lets users scan "is anything
 * lining up across all four indicators?" at a glance instead of
 * tab-hopping. Trail tooltips still surface per-day reasons so
 * detail is one hover away.
 *
 * Layout: a sticky header row showing the dimension column names,
 * then one row per ticker. The whole table is wrapped in a
 * horizontally-scrollable container so narrow screens get a
 * complete read instead of a cramped wrap; ticker + name are
 * sticky on the left so they stay visible while users scroll the
 * trails horizontally on mobile.
 */
export function SummaryView({ entries }: { entries: SummaryEntry[] }) {
  if (entries.length === 0) {
    return null;
  }
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 bg-muted/40 px-3 py-2 text-left text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground"
              >
                Ticker
              </th>
              {DIMENSIONS.map((d) => (
                <th
                  key={d.key}
                  scope="col"
                  className="px-3 py-2 text-left text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <SummaryRow key={e.ticker} entry={e} striped={i % 2 === 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryRow({ entry, striped }: { entry: SummaryEntry; striped: boolean }) {
  return (
    <tr className={striped ? 'bg-muted/20' : undefined}>
      <th
        scope="row"
        className={
          // Sticky left column so the ticker stays anchored when the
          // user scrolls the trails horizontally on narrow screens.
          'sticky left-0 z-10 px-3 py-2 text-left align-top ' +
          (striped ? 'bg-muted/20' : 'bg-card')
        }
      >
        <div className="font-mono text-sm font-semibold">{entry.ticker}</div>
        {entry.displayName && (
          <div className="max-w-[12rem] truncate text-xs text-muted-foreground">
            {entry.displayName}
          </div>
        )}
      </th>
      {DIMENSIONS.map((d) => {
        const dim = entry[d.key];
        return (
          <td key={d.key} className="px-3 py-2 align-middle">
            <DimensionCell dim={dim} />
          </td>
        );
      })}
    </tr>
  );
}

function DimensionCell({ dim }: { dim: SummaryDimension }) {
  if (dim.error || !dim.bucket) {
    // Failed fetch (Yahoo blew up, ticker not found on one provider)
    // is per-dimension — other dimensions for the same ticker may
    // still be valid, so we render an inline em-dash rather than
    // collapsing the whole row.
    return (
      <span className="font-mono text-xs text-muted-foreground" title={dim.error}>
        —
      </span>
    );
  }
  return (
    <BucketBadge
      bucket={dim.bucket}
      bucketTrend={dim.bucketTrend}
      bucketLabels={dim.bucketLabels}
      variant="compact"
    />
  );
}

/**
 * Skeleton placeholder shown while the four dimension fetches are
 * still in flight. Mirrors the real table's column layout so the
 * page doesn't jump on first paint.
 */
export function SummarySkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden animate-pulse-soft">
      <div className="border-b border-border bg-muted/40 px-3 py-2">
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3">
            <div className="w-24 space-y-1.5">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-2 w-20 rounded bg-muted" />
            </div>
            {DIMENSIONS.map((d) => (
              <div key={d.key} className="h-5 w-20 rounded-full bg-muted" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
