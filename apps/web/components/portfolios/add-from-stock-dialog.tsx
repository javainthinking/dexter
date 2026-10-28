'use client';

import * as React from 'react';
import { Check, Loader2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

/**
 * "Add <ticker> to a portfolio" — opened on /portfolios when a visitor
 * arrives from a public stock page's "Add to portfolio" button (directly,
 * or after signing in / up). The ticker is already chosen; the user only
 * picks the destination: an existing portfolio or a new one.
 *
 * Presentational re: persistence — the parent owns the API calls and
 * throws localized errors, which render inline.
 */

export interface PendingAdd {
  ticker: string;
  name: string | null;
  exchange: string | null;
}

interface PortfolioOption {
  id: string;
  name: string;
  holdingsCount: number;
}

const NEW = '__new__';

export function AddFromStockDialog({
  pending,
  portfolios,
  defaultPortfolioId,
  atCap,
  labels,
  onAddToExisting,
  onCreate,
  onUpgrade,
  onView,
  onClose,
}: {
  pending: PendingAdd;
  portfolios: PortfolioOption[];
  defaultPortfolioId: string | null;
  /** At the plan's portfolio cap: "New portfolio" opens the upgrade dialog instead. */
  atCap: boolean;
  labels: {
    title: string;
    pick: string;
    newPortfolio: string;
    defaultName: string;
    namePlaceholder: string;
    holdingsLabel: string;
    already: string;
    weight: string;
    optional: string;
    weightHint: string;
    add: string;
    adding: string;
    skip: string;
    /** "{symbol} is already in {portfolio}". */
    held: string;
    view: string;
  };
  onAddToExisting: (portfolioId: string, weight: number | null) => Promise<void>;
  onCreate: (name: string, weight: number | null) => Promise<void>;
  onUpgrade: () => void;
  /** Close and open a portfolio that already holds the ticker. */
  onView: (portfolioId: string) => void;
  onClose: () => void;
}) {
  const [target, setTarget] = React.useState<string>(
    defaultPortfolioId ?? portfolios[0]?.id ?? NEW,
  );
  const [newName, setNewName] = React.useState(() => uniqueName(labels.defaultName, portfolios));
  const [weight, setWeight] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // Portfolios that already hold the ticker, so they can't be picked.
  const [containing, setContaining] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const hits = await Promise.all(
        portfolios.map(async (p) => {
          try {
            const res = await fetch(`/api/portfolios/${p.id}`);
            if (!res.ok) return null;
            const json = (await res.json()) as { portfolio: { holdings: Array<{ ticker: string }> } };
            return json.portfolio.holdings.some((h) => h.ticker.toUpperCase() === pending.ticker) ? p.id : null;
          } catch {
            return null;
          }
        }),
      );
      if (cancelled) return;
      const set = new Set(hits.filter((id): id is string => id != null));
      setContaining(set);
      // Move the default off a portfolio that already has it.
      setTarget((cur) => (set.has(cur) ? portfolios.find((p) => !set.has(p.id))?.id ?? NEW : cur));
    })();
    return () => {
      cancelled = true;
    };
  }, [portfolios, pending.ticker]);

  async function submit() {
    const w = weight.trim() === '' ? null : Number(weight);
    if (w !== null && (!Number.isFinite(w) || w < 0 || w > 100)) {
      setError(labels.weightHint);
      return;
    }
    if (target === NEW && atCap) {
      onUpgrade();
      return;
    }
    if (target === NEW && !newName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (target === NEW) await onCreate(newName.trim(), w);
      else await onAddToExisting(target, w);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  const title = labels.title.replace('{symbol}', pending.ticker);
  const heldIn = portfolios.find((p) => containing.has(p.id));
  const subtitle = [pending.name, pending.exchange].filter(Boolean).join(' · ');

  return (
    <Dialog open onOpenChange={(open) => !open && !submitting && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{labels.pick}</p>
          <div role="radiogroup" className="max-h-64 space-y-1 overflow-y-auto">
            {portfolios.map((p) => {
              const has = containing.has(p.id);
              const selected = target === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={has || submitting}
                  onClick={() => setTarget(p.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                    selected ? 'border-foreground bg-muted/50' : 'border-border hover:bg-muted/30',
                    has && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-4 shrink-0 items-center justify-center rounded-full border',
                      selected ? 'border-foreground bg-foreground text-background' : 'border-border',
                    )}
                  >
                    {selected && <Check className="size-3" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {has ? labels.already : `${p.holdingsCount} ${labels.holdingsLabel}`}
                  </span>
                </button>
              );
            })}

            <div
              className={cn(
                'rounded-md border px-3 py-2 transition-colors',
                target === NEW ? 'border-foreground bg-muted/50' : 'border-dashed border-border hover:bg-muted/30',
              )}
            >
              <button
                type="button"
                role="radio"
                aria-checked={target === NEW}
                disabled={submitting}
                onClick={() => (atCap ? onUpgrade() : setTarget(NEW))}
                className="flex w-full items-center gap-3 text-left text-sm"
              >
                <Plus className="size-4 shrink-0" />
                <span className="font-medium">{labels.newPortfolio}</span>
              </button>
              {target === NEW && (
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  placeholder={labels.namePlaceholder}
                  maxLength={80}
                  className="mt-2 w-full rounded border border-border bg-background px-2 py-1.5 text-sm focus:border-foreground focus:outline-none"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="add-from-stock-weight" className="whitespace-nowrap text-xs text-muted-foreground">
              {labels.weight}
              <span className="ml-1 text-[10px] opacity-70">({labels.optional})</span>
            </label>
            <input
              id="add-from-stock-weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="—"
              inputMode="decimal"
              className="w-20 rounded-md border border-border bg-background px-2 py-1 text-right font-mono text-sm focus:border-foreground focus:outline-none"
            />
            <span className="text-xs text-muted-foreground">%</span>
          </div>

          {heldIn && (
            <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              {labels.held.replace('{symbol}', pending.ticker).replace('{portfolio}', heldIn.name)}
              <button
                type="button"
                onClick={() => onView(heldIn.id)}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {labels.view} →
              </button>
            </p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            {labels.skip}
          </Button>
          <Button onClick={submit} disabled={submitting || (target === NEW && !newName.trim())}>
            {submitting ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : <Plus className="mr-1 size-3.5" />}
            {submitting ? labels.adding : labels.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** "Watchlist", or "Watchlist 2", "Watchlist 3"… when the name is taken. */
function uniqueName(base: string, portfolios: PortfolioOption[]): string {
  const taken = new Set(portfolios.map((p) => p.name.trim().toLowerCase()));
  if (!taken.has(base.toLowerCase())) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base} ${i}`.toLowerCase())) return `${base} ${i}`;
}
