'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Locale } from '../../lib/i18n/locales';
import { matchCurated, stockName, type StockMarket } from '../../lib/stocks/universe';

/**
 * Ticker search for the public stock pages — the /stocks hero and the
 * 404 page. Curated tickers match instantly on the client; everything
 * else comes from /api/stocks/search (Yahoo + Tencent, cached), so any
 * US / HK / A-share code, name or pinyin finds its page. Picking a
 * ticker without a page yet just navigates there: the first visit
 * generates and caches it.
 */

interface Result {
  slug: string;
  symbol: string;
  name: string;
  market: StockMarket;
  featured: boolean;
}

export interface StockSearchLabels {
  label: string;
  placeholder: string;
  button: string;
  /** Resting text under the field, replaced by status messages. */
  hint?: string;
  /** Shown while a not-yet-generated page is being built. */
  generating: string;
  /** Badge on results that already have a featured page. */
  featured: string;
  empty: string;
  markets: Record<StockMarket, string>;
}

export function StockSearch({
  locale,
  lang,
  labels,
  className,
}: {
  locale: Locale;
  /** Language for curated names. */
  lang: 'en' | 'zh-CN' | 'zh-TW';
  labels: StockSearchLabels;
  className?: string;
}) {
  const router = useRouter();
  const id = React.useId();
  const [query, setQuery] = React.useState('');
  const [remote, setRemote] = React.useState<{ q: string; results: Result[] } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState(0);
  const [going, setGoing] = React.useState<Result | null>(null);
  const [empty, setEmpty] = React.useState(false);
  const seq = React.useRef(0);

  const q = query.trim();
  const local: Result[] = React.useMemo(
    () =>
      matchCurated(q).map((s) => ({
        slug: s.slug,
        symbol: s.market === 'cn' ? s.ticker.split('.')[0] : s.ticker,
        name: stockName(s, lang),
        market: s.market,
        featured: true,
      })),
    [q, lang],
  );
  // Remote results already list curated hits first; until they arrive
  // (or if they're for an older query) show the instant local matches.
  const results = remote && remote.q === q && remote.results.length ? remote.results : local;

  const fetchResults = React.useCallback(
    async (text: string): Promise<Result[]> => {
      const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(text)}&lang=${locale}`);
      if (!res.ok) return [];
      return ((await res.json()) as { results?: Result[] }).results ?? [];
    },
    [locale],
  );

  React.useEffect(() => {
    setEmpty(false);
    setHighlight(0);
    if (!q) {
      setRemote(null);
      setLoading(false);
      return;
    }
    const mine = ++seq.current;
    setLoading(true);
    const handle = window.setTimeout(async () => {
      const found = await fetchResults(q).catch(() => [] as Result[]);
      if (mine !== seq.current) return;
      setRemote({ q, results: found });
      setLoading(false);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [q, fetchResults]);

  const go = (r: Result) => {
    setGoing(r);
    setOpen(false);
    router.push(getLocalizedPath(`/stocks/${r.slug}`, locale));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q || going) return;
    let pick = results[highlight] ?? results[0];
    if (!pick && remote?.q !== q) {
      // Submitted before the debounced search landed — ask directly.
      setLoading(true);
      const found = await fetchResults(q).catch(() => [] as Result[]);
      setLoading(false);
      setRemote({ q, results: found });
      pick = found[0];
    }
    if (pick) go(pick);
    else setEmpty(true);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(results.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showList = open && q.length > 0 && results.length > 0 && !going;

  return (
    <form onSubmit={onSubmit} className={cn('max-w-lg', className)} role="search">
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
        {labels.label}
      </label>
      <div className="relative mt-2 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden="true" />
          <input
            id={id}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 150)}
            onKeyDown={onKeyDown}
            placeholder={labels.placeholder}
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={showList}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            className="h-11 w-full rounded-md border border-border bg-card pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-subtle focus:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-subtle" aria-hidden="true" />
          )}
        </div>
        <button
          type="submit"
          disabled={!!going}
          className="inline-flex h-11 items-center gap-1.5 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {labels.button}
          {going ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
        </button>

        {showList && (
          <ul
            id={`${id}-list`}
            role="listbox"
            className="absolute inset-x-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-card py-1 shadow-lg"
          >
            {results.map((r, i) => (
              <li key={r.slug} role="option" aria-selected={i === highlight}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(r)}
                  onMouseEnter={() => setHighlight(i)}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors',
                    i === highlight && 'bg-muted',
                  )}
                >
                  <span className="w-20 shrink-0 font-mono text-xs font-semibold text-foreground">{r.symbol}</span>
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">{r.name}</span>
                  {r.featured && (
                    <span className="shrink-0 rounded-full border border-border px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-subtle">
                      {labels.featured}
                    </span>
                  )}
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-subtle">
                    {labels.markets[r.market]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p aria-live="polite" className="mt-2 min-h-4 text-xs leading-relaxed text-muted-foreground">
        {going && !going.featured
          ? labels.generating.replace('{symbol}', going.symbol)
          : empty
            ? labels.empty
            : labels.hint}
      </p>
    </form>
  );
}
