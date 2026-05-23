'use client';

import * as React from 'react';
import { ChevronRight, Info, X } from 'lucide-react';
import { BucketBadge, type Bucket, type BucketSample } from './card-shell';
import { TickerDetailSheet } from './ticker-detail-sheet';
import { useDictionary } from '../i18n/dictionary-provider';
import { cn } from '../../lib/utils';
import {
  DIMENSION_FALLBACK_LABEL,
  DIMENSION_KEYS,
  type DimensionKey,
} from '../../lib/indicators/labels';

/**
 * localStorage key used to remember that the user dismissed the
 * Summary explainer. Bumping this key (e.g. when the hint copy is
 * rewritten and you want everyone to see it again) is the upgrade
 * path — don't try to be clever with versioned values inside the
 * stored string.
 */
const HINT_DISMISSED_KEY = 'pickskill-summary-hint-dismissed';

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

/**
 * One trading-day's price reading rendered next to the bucket trails
 * so users can correlate "what the signal called" with "what the
 * price actually did." Same length (5) and same date alignment as
 * each `bucketTrend` so the columns scan as a single timeline.
 */
export interface DailyChange {
  time: string;
  changePct: number | null;
}

export interface SummaryEntry {
  ticker: string;
  displayName: string | null;
  /**
   * Last N daily percent changes (oldest → newest, length matches the
   * bucket-trend window). Pulled from the OHLCV the indicator
   * endpoints already return — no extra fetch.
   */
  dailyChanges: DailyChange[];
  /**
   * Latest close price (the last bar's close), surfaced from any
   * non-errored dimension's `latest.close`. Same value across all
   * dimensions because they all read the same OHLCV — picking the
   * first non-null one is sufficient. Optional so a row whose every
   * dimension errored doesn't break the type contract.
   */
  latestClose?: number | null;
  /**
   * ISO date (yyyy-mm-dd) of the latest bar — surfaced alongside
   * latestClose so the modal header can show "as of {date}".
   */
  latestAsOf?: string | null;
  /**
   * Daily-close series (oldest → newest, ~90 trading days). Picked
   * from the first non-errored dimension's prices in the same
   * fallthrough pattern as latestClose / dailyChanges. Used by the
   * detail modal to render a sparkline above the timeline; not used
   * by the summary table itself.
   *
   * Trimmed to `{time, close}` pairs only — full OHLCV would balloon
   * the payload (~6× more keys) for no current consumer.
   */
  prices?: Array<{ time: string; close: number | null }>;
  macd: SummaryDimension;
  ma: SummaryDimension;
  rsi: SummaryDimension;
  kdj: SummaryDimension;
  boll: SummaryDimension;
  adx: SummaryDimension;
  volume: SummaryDimension;
  flow: SummaryDimension;
}

// DIMENSION_KEYS + DIMENSION_FALLBACK_LABEL now live in
// lib/indicators/labels.ts — see top-of-file imports. Localisation
// still comes from the per-locale `indicators.summaryColumns` dict
// at render time (see `labelFor` below).

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
  const dict = useDictionary();
  const columnLabels = (dict.indicators?.summaryColumns ?? {}) as Partial<
    Record<DimensionKey | 'ticker' | 'dailyChange', string>
  >;
  const labelFor = (k: DimensionKey) => columnLabels[k] ?? DIMENSION_FALLBACK_LABEL[k];

  // Track which ticker has its detail sheet open. We store the
  // ticker string (not the entry object) so the sheet's content
  // automatically refreshes when `entries` itself reloads — staying
  // tied to the current data instead of a stale snapshot. The
  // selected entry is looked up from `entries` on render.
  const [openTicker, setOpenTicker] = React.useState<string | null>(null);
  const selectedEntry = React.useMemo(
    () => (openTicker ? entries.find((e) => e.ticker === openTicker) ?? null : null),
    [openTicker, entries],
  );

  if (entries.length === 0) {
    return null;
  }
  return (
    <div className="space-y-3">
      <SummaryHint />
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 bg-muted/40 px-3 py-2 text-left text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground"
              >
                {columnLabels.ticker ?? 'Ticker'}
              </th>
              {/* "5D %" column comes right after Ticker so users
                  scan: identity → what the price actually did → what
                  each indicator called. Reading order matches the
                  causal/temporal mental model. */}
              <th
                scope="col"
                className="px-3 py-2 text-left text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground"
              >
                {columnLabels.dailyChange ?? '5D %'}
              </th>
              {DIMENSION_KEYS.map((k) => (
                <th
                  key={k}
                  scope="col"
                  className="px-3 py-2 text-left text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {labelFor(k)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <SummaryRow
                key={e.ticker}
                entry={e}
                striped={i % 2 === 1}
                onOpenDetail={() => setOpenTicker(e.ticker)}
              />
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <TickerDetailSheet
        entry={selectedEntry}
        onOpenChange={(open) => {
          if (!open) setOpenTicker(null);
        }}
      />
    </div>
  );
}

/**
 * One-line explainer banner shown above the Summary table for users
 * who haven't dismissed it. Covers two questions a first-time viewer
 * always asks: "what am I looking at?" (5 trading days × 4 indicators)
 * and "where do I get more detail?" (hover the dots).
 *
 * Dismissal persists in localStorage so a returning user never sees
 * it twice. The default state during SSR is *dismissed* — that way
 * returning users get a clean first paint with no flash of an
 * already-dismissed banner. First-time visitors briefly see the
 * banner appear on hydration; that's the right trade-off because
 * the table content is what they're focused on anyway.
 */
function SummaryHint() {
  const dict = useDictionary();
  // Start dismissed so SSR + returning-user paints don't show the
  // banner. The effect below flips it open if storage says
  // "never dismissed."
  const [dismissed, setDismissed] = React.useState(true);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(HINT_DISMISSED_KEY);
      if (stored !== '1') setDismissed(false);
    } catch {
      // localStorage blocked → fall back to showing the banner.
      // No persistence means it'll show again on next mount, which
      // is the failure mode users would expect for "could not save
      // your preference."
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  const hint =
    dict.indicators?.summary?.hint ??
    'Each row shows the last 5 trading days of signal evolution across all four indicators. Hover any dot for the date and reason.';
  const dismissLabel = dict.indicators?.summary?.dismiss ?? 'Dismiss';

  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-2.5 rounded-md border border-border bg-muted/30 px-3 py-2',
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <p className="flex-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>
      <button
        type="button"
        onClick={() => {
          try {
            window.localStorage.setItem(HINT_DISMISSED_KEY, '1');
          } catch {
            /* persistence is best-effort */
          }
          setDismissed(true);
        }}
        className={cn(
          'shrink-0 rounded p-0.5 text-muted-foreground transition-colors',
          'hover:bg-muted hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
        aria-label={dismissLabel}
        title={dismissLabel}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function SummaryRow({
  entry,
  striped,
  onOpenDetail,
}: {
  entry: SummaryEntry;
  striped: boolean;
  onOpenDetail: () => void;
}) {
  const dict = useDictionary();
  const openDetailLabel =
    dict.indicators?.summary?.openDetail ?? 'View signal timeline';
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
        {/* Button-wrapped ticker so the entire identity block is one
            keyboard- and screen-reader-friendly affordance. We avoid
            a separate "open" icon button — making the natural
            scan-target (the ticker text) the click target keeps
            Fitts' Law on our side and matches user expectation that
            "the row identity opens the row detail." */}
        <button
          type="button"
          onClick={onOpenDetail}
          aria-label={`${openDetailLabel} — ${entry.ticker}`}
          className={cn(
            'group flex w-full max-w-full items-center gap-1.5 rounded-md text-left',
            'cursor-pointer transition-colors',
            'hover:text-[color:var(--accent)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          )}
        >
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-sm font-semibold underline decoration-dotted decoration-muted-foreground/40 underline-offset-4 group-hover:decoration-current">
              {entry.ticker}
            </span>
            {entry.displayName && (
              <span className="block max-w-[12rem] truncate text-xs text-muted-foreground">
                {entry.displayName}
              </span>
            )}
          </span>
          {/* Chevron — the secondary affordance. Slides slightly on
              hover so the cell visibly "leans into" the user. */}
          <ChevronRight
            aria-hidden="true"
            className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[color:var(--accent)]"
          />
        </button>
      </th>
      <td className="px-3 py-2 align-middle">
        <DailyChangeRow changes={entry.dailyChanges} />
      </td>
      {DIMENSION_KEYS.map((k) => {
        const dim = entry[k];
        return (
          <td key={k} className="px-3 py-2 align-middle">
            <DimensionCell dim={dim} />
          </td>
        );
      })}
    </tr>
  );
}

/**
 * Five tiny signed-percent values sat in a row, aligned positionally
 * with the bucket trails in the four dimension columns to the right.
 * Reading down a row, users can correlate "did the price actually
 * move the way the signal called?" without flipping between tabs.
 *
 * Colouring uses the `text-up` / `text-down` tokens so the current
 * market-colour convention (CN red-up vs US green-up) flows through.
 * Each number's hover title carries the ISO date for the
 * corresponding bar.
 */
function DailyChangeRow({ changes }: { changes: DailyChange[] }) {
  if (changes.length === 0) {
    return <span className="font-mono text-xs text-muted-foreground">—</span>;
  }
  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs font-medium tabular-nums">
      {changes.map((c) => {
        // The column header is the canonical "this is a percentage"
        // signal; the bare numbers stay compact for scannability.
        // Hover title carries the precise value with the % glyph so
        // anyone uncertain about the unit (or the rounding) can
        // confirm in one motion.
        const titleParts = [c.time];
        if (c.changePct != null && Number.isFinite(c.changePct)) {
          const signed = c.changePct >= 0 ? `+${c.changePct.toFixed(2)}` : `${c.changePct.toFixed(2)}`;
          titleParts.push(`${signed}%`);
        }
        return (
          <span
            key={c.time}
            title={titleParts.join(' · ')}
            className={cn(
              // Wider min-width at the bumped 12px size so all five
              // values stay column-aligned even when one is "+12"
              // (3 chars) and its neighbour is "+0.4" (4 chars).
              'min-w-[2.75rem] text-right',
              c.changePct == null && 'text-muted-foreground',
              c.changePct != null && c.changePct > 0 && 'text-up',
              c.changePct != null && c.changePct < 0 && 'text-down',
              c.changePct === 0 && 'text-muted-foreground',
            )}
          >
            {formatDailyChange(c.changePct)}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Compact signed-percent formatter for the 5-up row:
 *   - null → "—"
 *   - 0 → "0"
 *   - |v| ≥ 10 → integer with sign ("+12", "-15")
 *   - else → one decimal with sign ("+1.2", "-0.8")
 *
 * One decimal at the small magnitudes carries enough resolution to
 * distinguish "flat" days from real ones; the integer truncation
 * past 10% saves a char without losing meaning (no one ranks
 * "+12.3%" vs "+12%" differently at a glance).
 */
function formatDailyChange(v: number | null): string {
  if (v == null || !Number.isFinite(v)) return '—';
  if (v === 0) return '0';
  const sign = v > 0 ? '+' : '−';
  const abs = Math.abs(v);
  return abs >= 10 ? `${sign}${Math.round(abs)}` : `${sign}${abs.toFixed(1)}`;
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
            <div className="h-4 w-36 rounded bg-muted" />
            {DIMENSION_KEYS.map((k) => (
              <div key={k} className="h-5 w-20 rounded-full bg-muted" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
