'use client';

import * as React from 'react';
import { Search, Loader2, Plus, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SymbolHit {
  ticker: string;
  name: string;
  exchange: string | null;
  type: 'equity' | 'etf';
}

/**
 * Autocomplete symbol picker for the Add-Holding flow.
 *
 * Behaviour:
 *   - Debounces input by 220ms so a fast typist doesn't hammer the
 *     search endpoint per keystroke.
 *   - Keyboard nav: ArrowUp/Down to move the highlight, Enter to
 *     "select" the highlighted row, Esc to close.
 *   - Selecting a row reveals a small confirm strip with an optional
 *     weight input. The user must explicitly hit "Add" before the
 *     holding is created — accidental Enter doesn't add silently.
 *
 * The component is presentational re: persistence: parent passes
 * `onAdd(hit, weight)` and the parent route handles the network call.
 */
export function SymbolSearch({
  onAdd,
  existingTickers,
  placeholder,
  labels,
}: {
  onAdd: (hit: SymbolHit, weight: number | null) => Promise<void> | void;
  existingTickers: string[];
  placeholder: string;
  labels: {
    search: string;
    add: string;
    cancel: string;
    weight: string;
    weightHint: string;
    already: string;
    empty: string;
    error: string;
    adding: string;
  };
}) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SymbolHit[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [highlight, setHighlight] = React.useState(0);
  const [confirming, setConfirming] = React.useState<SymbolHit | null>(null);
  const [weight, setWeight] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const requestSeq = React.useRef(0);

  const existing = React.useMemo(() => new Set(existingTickers), [existingTickers]);

  // Debounced search effect.
  React.useEffect(() => {
    if (confirming) return; // Pause search while user is confirming a pick.
    const q = query.trim();
    if (!q) {
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const seq = ++requestSeq.current;
    const handle = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/portfolios/symbols/search?q=${encodeURIComponent(q)}&limit=10`,
        );
        if (seq !== requestSeq.current) return; // newer query in flight
        if (!res.ok) {
          setError(labels.error);
          setResults([]);
          return;
        }
        const json = (await res.json()) as { results?: SymbolHit[] };
        setResults(json.results ?? []);
        setHighlight(0);
      } catch {
        if (seq === requestSeq.current) setError(labels.error);
      } finally {
        if (seq === requestSeq.current) setLoading(false);
      }
    }, 220);
    return () => window.clearTimeout(handle);
  }, [query, confirming, labels.error]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (confirming) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(results.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = results[highlight];
      if (pick) startConfirm(pick);
    } else if (e.key === 'Escape') {
      setQuery('');
      setResults([]);
    }
  }

  function startConfirm(hit: SymbolHit) {
    if (existing.has(hit.ticker)) return;
    setConfirming(hit);
    setWeight('');
    // Focus the weight field after the row replaces with confirm strip.
    setTimeout(() => {
      document.getElementById('symbol-search-weight')?.focus();
    }, 0);
  }

  function cancelConfirm() {
    setConfirming(null);
    setWeight('');
    inputRef.current?.focus();
  }

  async function commitConfirm() {
    if (!confirming) return;
    const w = weight.trim() === '' ? null : Number(weight);
    if (w !== null && (!Number.isFinite(w) || w < 0 || w > 999)) {
      setError(labels.weightHint);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onAdd(confirming, w);
      setConfirming(null);
      setQuery('');
      setResults([]);
      setWeight('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={!!confirming}
          className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-2 text-sm focus:border-foreground focus:outline-none disabled:opacity-60"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {error && !confirming && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {confirming ? (
        <div className="rounded-md border border-border bg-muted/30 p-3 space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-sm font-semibold">{confirming.ticker}</div>
              <div className="text-xs text-muted-foreground truncate">
                {confirming.name}
                {confirming.exchange ? ` · ${confirming.exchange}` : ''}
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {confirming.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="symbol-search-weight" className="text-xs text-muted-foreground whitespace-nowrap">
              {labels.weight}
            </label>
            <input
              id="symbol-search-weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitConfirm();
                if (e.key === 'Escape') cancelConfirm();
              }}
              placeholder="—"
              inputMode="decimal"
              className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm font-mono text-right focus:border-foreground focus:outline-none"
            />
            <span className="text-xs text-muted-foreground">%</span>
            <div className="ml-auto flex gap-1">
              <button
                type="button"
                onClick={cancelConfirm}
                disabled={submitting}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
              >
                <X className="size-3" />
                {labels.cancel}
              </button>
              <button
                type="button"
                onClick={commitConfirm}
                disabled={submitting}
                className="inline-flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-xs text-background hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Check className="size-3" />
                )}
                {submitting ? labels.adding : labels.add}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      ) : results.length > 0 ? (
        <ul className="max-h-72 overflow-y-auto rounded-md border border-border bg-background">
          {results.map((hit, i) => {
            const isExisting = existing.has(hit.ticker);
            return (
              <li key={hit.ticker}>
                <button
                  type="button"
                  onClick={() => !isExisting && startConfirm(hit)}
                  onMouseEnter={() => setHighlight(i)}
                  disabled={isExisting}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                    i === highlight && !isExisting && 'bg-muted',
                    isExisting && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs font-semibold">{hit.ticker}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {hit.name}
                      {hit.exchange ? ` · ${hit.exchange}` : ''}
                    </div>
                  </div>
                  {isExisting ? (
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {labels.already}
                    </span>
                  ) : (
                    <Plus className="size-3.5 text-muted-foreground" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : query.trim() && !loading ? (
        <p className="text-xs text-muted-foreground px-1">{labels.empty}</p>
      ) : null}
    </div>
  );
}
