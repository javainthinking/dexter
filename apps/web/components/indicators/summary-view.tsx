'use client';

import * as React from 'react';
import { Info, X } from 'lucide-react';
import { BucketBadge, type Bucket, type BucketSample } from './card-shell';
import { useDictionary } from '../i18n/dictionary-provider';
import { cn } from '../../lib/utils';

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

export interface SummaryEntry {
  ticker: string;
  displayName: string | null;
  macd: SummaryDimension;
  ma: SummaryDimension;
  volume: SummaryDimension;
  flow: SummaryDimension;
}

/**
 * Dimension column keys for the summary table. The user-facing
 * labels are localised at render time via the `indicators.summaryColumns`
 * dict namespace — MACD stays as "MACD" everywhere (universal acronym),
 * but MA / Vol / Flow have local equivalents that matter for native
 * readers ("均线 / 量能 / 资金流" in zh-CN, "出来高" in ja, etc.).
 */
const DIMENSION_KEYS = ['macd', 'ma', 'volume', 'flow'] as const;
type DimensionKey = (typeof DIMENSION_KEYS)[number];

/**
 * Fallback labels — used when the dict lookup misses (e.g. older
 * dictionary version deployed). English short forms because the
 * scenarios where the fallback fires are usually English-locale
 * dev/staging contexts.
 */
const DIMENSION_FALLBACK_LABEL: Record<DimensionKey, string> = {
  macd: 'MACD',
  ma: 'MA',
  volume: 'Vol',
  flow: 'Flow',
};

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
    Record<DimensionKey | 'ticker', string>
  >;
  const labelFor = (k: DimensionKey) => columnLabels[k] ?? DIMENSION_FALLBACK_LABEL[k];

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
              <SummaryRow key={e.ticker} entry={e} striped={i % 2 === 1} />
            ))}
          </tbody>
        </table>
        </div>
      </div>
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
            {DIMENSION_KEYS.map((k) => (
              <div key={k} className="h-5 w-20 rounded-full bg-muted" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
