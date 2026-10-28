import Link from 'next/link';
import { cn } from '../../lib/utils';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Locale } from '../../lib/i18n/locales';
import { latestTally, toneOf, type StockSnapshot, type Tone } from '../../lib/stocks/snapshot';
import { displaySymbol, stockName, type StockEntry } from '../../lib/stocks/universe';
import type { NarrativeLang } from '../../lib/stocks/narrative';
import type { StockCopy } from '../../lib/stocks/copy';
import { MiniSparkline } from './mini-sparkline';

export function formatSignedPct(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return '—';
  return `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
}

export function signClass(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v) || v === 0) return 'text-muted-foreground';
  return v > 0 ? 'text-up' : 'text-down';
}

export const TONE_CLASS: Record<Tone, string> = {
  bullish: 'border-up/40 bg-up/10 text-up',
  bearish: 'border-down/40 bg-down/10 text-down',
  mixed: 'border-border bg-muted text-foreground',
  neutral: 'border-border bg-muted text-muted-foreground',
};

/** Linked summary card for one ticker — used by the /stocks index and the related grid. */
export function StockCard({
  stock,
  snapshot,
  lang,
  locale,
  copy,
}: {
  stock: StockEntry;
  snapshot: StockSnapshot | null;
  lang: NarrativeLang;
  locale: Locale;
  copy: StockCopy;
}) {
  const tone = snapshot ? toneOf(latestTally(snapshot)) : null;
  return (
    <Link
      href={getLocalizedPath(`/stocks/${stock.slug}`, locale)}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-sm font-semibold text-foreground">{displaySymbol(stock)}</div>
          <div className="truncate text-xs text-muted-foreground">{stockName(stock, lang)}</div>
        </div>
        {tone && (
          <span
            className={cn(
              'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium',
              TONE_CLASS[tone],
            )}
          >
            {copy.tone[tone]}
          </span>
        )}
      </div>
      {snapshot && <MiniSparkline closes={snapshot.prices.slice(-30).map((p) => p.close)} />}
      <div className="flex items-baseline justify-between font-mono text-xs tabular-nums">
        <span className="text-foreground">{snapshot?.close != null ? snapshot.close.toFixed(2) : '—'}</span>
        <span className={signClass(snapshot?.fiveDayChangePct)}>
          5D {formatSignedPct(snapshot?.fiveDayChangePct)}
        </span>
      </div>
    </Link>
  );
}
