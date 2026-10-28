'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDictionary } from '../i18n/dictionary-provider';
import { formatNum } from './card-shell';
import { SignalTimeline } from './signal-timeline';
import { type SummaryEntry } from './summary-view';

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

  // The Radix Dialog needs to mount with a controlled `open` prop. We
  // derive it from `entry != null` — a single source of truth keeps
  // close-on-x and close-on-overlay-click both routing through
  // onOpenChange in the parent.
  const open = entry != null;

  const sheetTitle =
    dict.indicators?.summary?.detailTitle ?? 'Signal timeline';
  const sheetSubtitle =
    dict.indicators?.summary?.detailSubtitle ??
    'The last 5 trading days · every indicator, every day';
  const closeLabel = dict.indicators?.summary?.detailClose ?? 'Close';

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

          {/* Body — sparkline up top, timeline below; scrolls as one
              region so the chart slides away on short viewports. */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {entry && <SignalTimeline entry={entry} />}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
