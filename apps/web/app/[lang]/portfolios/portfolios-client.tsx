'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Check,
  X,
  Loader2,
  Edit2,
  AlertTriangle,
  Wallet,
  RefreshCw,
} from 'lucide-react';
import { Sidebar, type SessionSummary } from '../../../components/chat/sidebar';
import { Button } from '../../../components/ui/button';
import { TopBar } from '../../../components/nav/top-bar';
import { Skeleton } from '../../../components/ui/skeleton';
import { useDictionary, useLocale } from '../../../components/i18n/dictionary-provider';
import { useUpgradeDialog } from '../../../components/upgrade/upgrade-dialog-provider';
import type { PlanId } from '../../../lib/pricing';
import { PLAN_LIMITS } from '../../../lib/plans';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { cn } from '../../../lib/utils';
import { SymbolSearch, type SymbolHit } from '../../../components/portfolios/symbol-search';
import {
  resolveInitialActivePortfolioId,
  writeLastActivePortfolioId,
} from '../../../lib/active-portfolio';

interface PortfolioListItem {
  id: string;
  name: string;
  description: string | null;
  holdingsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Holding {
  id: string;
  ticker: string;
  displayName: string | null;
  exchange: string | null;
  weight: number | null;
  position: number;
  addedAt: string;
}

interface HoldingQuote {
  ticker: string;
  asOf?: string;
  close?: number | null;
  prevClose?: number | null;
  change?: number | null;
  changePct?: number | null;
  error?: string;
}

interface PortfolioDetail extends PortfolioListItem {
  holdings: Holding[];
}

export function PortfoliosClient({
  initialPortfolios,
  plan,
}: {
  initialPortfolios: PortfolioListItem[];
  plan: PlanId;
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const { openUpgrade } = useUpgradeDialog();

  // When a create/add hits the plan cap the API returns 402; pop the upgrade
  // dialog and report it as handled so callers stop without a generic error.
  async function handledQuota(res: Response): Promise<boolean> {
    if (res.status !== 402) return false;
    const info = (await res.json().catch(() => ({}))) as {
      plan?: string;
      metric?: 'portfolios' | 'holdings';
      limit?: number;
    };
    openUpgrade({ plan: info.plan as PlanId | undefined, metric: info.metric, limit: info.limit });
    return true;
  }

  const [sessions, setSessions] = React.useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);

  const [portfolios, setPortfolios] = React.useState<PortfolioListItem[]>(initialPortfolios);
  // Prefer the last-active portfolio (from /indicators or a previous
  // visit) so navigating between this page and /indicators preserves
  // the user's mental "current portfolio." Falls back to the first
  // portfolio when no stored selection is present or it's been
  // deleted. See lib/active-portfolio.ts for the storage details.
  const [activeId, setActiveId] = React.useState<string | null>(() =>
    resolveInitialActivePortfolioId(initialPortfolios),
  );

  // Mirror activeId to localStorage so /indicators (and a future
  // tab refresh of this page) pick up the latest selection.
  React.useEffect(() => {
    writeLastActivePortfolioId(activeId);
  }, [activeId]);
  const [detail, setDetail] = React.useState<PortfolioDetail | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // Latest-close + day-change for each ticker in the active portfolio,
  // keyed by ticker. Loaded lazily so opening the portfolios page stays
  // snappy; the row renders "—" until the quote lands.
  const [quotes, setQuotes] = React.useState<Record<string, HoldingQuote>>({});
  const [quotesLoading, setQuotesLoading] = React.useState(false);

  // Two-stage create state:
  //   stage 'name'    → sidebar shows name input; main pane is hidden.
  //   stage 'holding' → name is locked in; main pane shows SymbolSearch
  //                     for the first holding. POST fires on confirm so
  //                     portfolio + first holding land atomically and
  //                     the "no empty portfolios" invariant holds.
  const [createStage, setCreateStage] = React.useState<'idle' | 'name' | 'holding'>('idle');
  const [newName, setNewName] = React.useState('');

  // Inline-rename state
  const [renamingId, setRenamingId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState('');

  // Delete-confirm state (inline two-step rather than modal)
  const [confirmingDeleteId, setConfirmingDeleteId] = React.useState<string | null>(null);

  // ─── sidebar plumbing (mirror /memory + /indicators) ──────────────
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/sessions?size=50`);
        if (res.ok) {
          const json = (await res.json()) as { sessions?: SessionSummary[] };
          setSessions(json.sessions ?? []);
        }
      } catch {
        /* non-critical */
      }
      setSessionsLoading(false);
    })();
  }, []);

  // Load active portfolio detail whenever activeId changes.
  React.useEffect(() => {
    if (!activeId) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    fetch(`/api/portfolios/${activeId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: { portfolio: PortfolioDetail }) => setDetail(json.portfolio))
      .catch(() => setError(dict.portfolios?.errorLoad ?? 'Failed to load portfolio.'))
      .finally(() => setDetailLoading(false));
  }, [activeId, dict.portfolios?.errorLoad]);

  // Pull latest close + day change for the active portfolio. Runs in
  // parallel with the detail fetch; rows render skeleton bars until the
  // quote lands. Refresh button uses the same fetcher, so manual reload
  // and auto-fetch share the in-flight / cancellation logic.
  const refreshQuotes = React.useCallback(
    async (portfolioId: string, signal?: AbortSignal) => {
      setQuotesLoading(true);
      try {
        const res = await fetch(`/api/portfolios/${portfolioId}/quotes`, {
          cache: 'no-store',
          signal,
        });
        if (!res.ok || signal?.aborted) return;
        const json = (await res.json()) as { quotes?: HoldingQuote[] };
        if (signal?.aborted) return;
        const map: Record<string, HoldingQuote> = {};
        for (const q of json.quotes ?? []) map[q.ticker] = q;
        setQuotes(map);
      } catch {
        /* leave existing quotes; row simply shows "—" */
      } finally {
        if (!signal?.aborted) setQuotesLoading(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    if (!activeId) {
      setQuotes({});
      return;
    }
    const controller = new AbortController();
    void refreshQuotes(activeId, controller.signal);
    return () => controller.abort();
  }, [activeId, refreshQuotes]);

  const handleRefreshQuotes = React.useCallback(() => {
    if (!activeId) return;
    void refreshQuotes(activeId);
  }, [activeId, refreshQuotes]);

  // Reconcile with the API on mount + on tab-focus. The SSR pass renders
  // a snapshot of the list at request time; without this, a user who
  // creates / deletes a portfolio in another tab or device sees stale
  // state until they hard-reload.
  React.useEffect(() => {
    void refetchOnce();
    const onFocus = () => void refetchOnce();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
    async function refetchOnce() {
      try {
        const res = await fetch('/api/portfolios', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as { portfolios: PortfolioListItem[] };
        setPortfolios(json.portfolios);
        // First-visit affordance: if SSR returned empty but the API has
        // rows now, auto-select the first one so the empty-state stops
        // showing.
        setActiveId((cur) => cur ?? json.portfolios[0]?.id ?? null);
      } catch {
        /* swallow — server-state will reconcile on next user action */
      }
    }
  }, []);

  // ─── actions ──────────────────────────────────────────────────────

  const refreshList = React.useCallback(async () => {
    const res = await fetch('/api/portfolios');
    if (!res.ok) return;
    const json = (await res.json()) as { portfolios: PortfolioListItem[] };
    setPortfolios(json.portfolios);
    return json.portfolios;
  }, []);

  function startCreateNaming() {
    setCreateStage('name');
    setNewName('');
    setError(null);
  }
  function cancelCreate() {
    setCreateStage('idle');
    setNewName('');
    setError(null);
  }
  function advanceToHoldingPick() {
    const name = newName.trim();
    if (!name) return;
    if (portfolios.some((p) => p.name.trim().toLowerCase() === name.toLowerCase())) {
      setError(translateError('name_taken', dict));
      return;
    }
    setError(null);
    setCreateStage('holding');
  }

  async function handleCreateWithHolding(hit: SymbolHit, weight: number | null) {
    const name = newName.trim();
    if (!name) {
      throw new Error(translateError('name_required', dict));
    }
    const res = await fetch('/api/portfolios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        holding: {
          ticker: hit.ticker,
          displayName: hit.name,
          exchange: hit.exchange,
          weight,
        },
      }),
    });
    if (await handledQuota(res)) {
      setCreateStage('idle');
      setNewName('');
      return;
    }
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(translateError(body?.error ?? 'server_error', dict));
    }
    const created = (await res.json()) as { portfolio: { id: string } };
    setCreateStage('idle');
    setNewName('');
    await refreshList();
    setActiveId(created.portfolio.id);
  }

  async function handleRename(id: string) {
    const name = renameValue.trim();
    if (!name) return;
    setError(null);
    const res = await fetch(`/api/portfolios/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(translateError(body?.error ?? 'server_error', dict));
      return;
    }
    setRenamingId(null);
    await refreshList();
    if (id === activeId) {
      const r = await fetch(`/api/portfolios/${id}`);
      if (r.ok) {
        const json = (await r.json()) as { portfolio: PortfolioDetail };
        setDetail(json.portfolio);
      }
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/portfolios/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError(dict.portfolios?.errorDelete ?? 'Could not delete.');
      return;
    }
    setConfirmingDeleteId(null);
    const remaining = portfolios.filter((p) => p.id !== id);
    setPortfolios(remaining);
    if (activeId === id) setActiveId(remaining[0]?.id ?? null);
  }

  async function handleAddHolding(hit: SymbolHit, weight: number | null) {
    if (!activeId) return;
    const res = await fetch(`/api/portfolios/${activeId}/holdings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker: hit.ticker,
        displayName: hit.name,
        exchange: hit.exchange,
        weight,
      }),
    });
    if (await handledQuota(res)) return;
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(translateError(body?.error ?? 'server_error', dict));
    }
    const r = await fetch(`/api/portfolios/${activeId}`);
    if (r.ok) {
      const json = (await r.json()) as { portfolio: PortfolioDetail };
      setDetail(json.portfolio);
    }
    // Refresh quotes so the new row paints with a real price + change
    // instead of sitting on the skeleton until the user hits refresh.
    // Fired in parallel with refreshList — they touch different state
    // (sidebar list vs holding-row prices) and shouldn't block each
    // other.
    void refreshQuotes(activeId);
    await refreshList();
  }

  async function handleRemoveHolding(holdingId: string) {
    if (!activeId) return;
    const res = await fetch(`/api/portfolios/${activeId}/holdings/${holdingId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(translateError(body?.error ?? 'server_error', dict));
      return;
    }
    setDetail((d) => (d ? { ...d, holdings: d.holdings.filter((h) => h.id !== holdingId) } : d));
    await refreshList();
  }

  async function handleEditWeight(holdingId: string, weightStr: string) {
    if (!activeId) return;
    const w = weightStr.trim() === '' ? null : Number(weightStr);
    if (w !== null && (!Number.isFinite(w) || w < 0)) return;
    const res = await fetch(`/api/portfolios/${activeId}/holdings/${holdingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight: w }),
    });
    if (!res.ok) {
      setError(dict.portfolios?.errorUpdate ?? 'Could not update weight.');
      return;
    }
    setDetail((d) =>
      d
        ? {
            ...d,
            holdings: d.holdings.map((h) => (h.id === holdingId ? { ...h, weight: w } : h)),
          }
        : d,
    );
  }

  // ─── sidebar plumbing handlers ────────────────────────────────────
  const onNewConversation = () => router.push(getLocalizedPath('/chat', locale));
  const onSwitchSession = (id: string) =>
    router.push(`${getLocalizedPath('/chat', locale)}?session=${encodeURIComponent(id)}`);
  const onDeleteSession = async (id: string) => {
    await fetch(`/api/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
    setSessions((prev) => prev.filter((s) => s.sessionId !== id));
  };

  // ─── render ───────────────────────────────────────────────────────
  // Plan-based portfolio cap (matches the server's 402 gate). Infinity for
  // unlimited tiers.
  const portfolioLimit = PLAN_LIMITS[plan].portfolios;
  const atCap = Number.isFinite(portfolioLimit) && portfolios.length >= portfolioLimit;

  // "New portfolio" stays clickable at the cap — instead of starting the
  // create flow it opens the upgrade dialog. Below the cap it begins naming.
  function onNewPortfolio() {
    if (atCap) {
      openUpgrade({ plan, metric: 'portfolios', limit: portfolioLimit });
      return;
    }
    startCreateNaming();
  }

  return (
    <div className="flex h-svh w-full bg-background text-foreground">
      <Sidebar
        sessions={sessions}
        loading={sessionsLoading}
        onNew={onNewConversation}
        onSwitch={onSwitchSession}
        onDelete={onDeleteSession}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={dict.portfolios?.title ?? 'Portfolios'}
          subtitle={dict.portfolios?.subtitle ?? 'Manage your watchlists.'}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Portfolios list — left rail inside main */}
          <div className="flex w-72 flex-col border-r border-border bg-muted/20">
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {dict.portfolios?.yours ?? 'Your portfolios'}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {portfolios.length}
                {Number.isFinite(portfolioLimit) ? `/${portfolioLimit}` : ''}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {portfolios.length === 0 && createStage === 'idle' && (
                <p className="px-2 py-4 text-xs text-muted-foreground">
                  {dict.portfolios?.empty ?? 'No portfolios yet.'}
                </p>
              )}
              {portfolios.map((p) => (
                <PortfolioListRow
                  key={p.id}
                  portfolio={p}
                  active={p.id === activeId && createStage === 'idle'}
                  onSelect={() => {
                    if (createStage !== 'idle') return;
                    setActiveId(p.id);
                  }}
                  renaming={renamingId === p.id}
                  renameValue={renameValue}
                  onStartRename={() => {
                    setRenamingId(p.id);
                    setRenameValue(p.name);
                  }}
                  onChangeRename={setRenameValue}
                  onCancelRename={() => setRenamingId(null)}
                  onCommitRename={() => handleRename(p.id)}
                  confirmingDelete={confirmingDeleteId === p.id}
                  onAskDelete={() => setConfirmingDeleteId(p.id)}
                  onCancelDelete={() => setConfirmingDeleteId(null)}
                  onConfirmDelete={() => handleDelete(p.id)}
                  labels={dict.portfolios ?? {}}
                />
              ))}

              {createStage === 'name' || createStage === 'holding' ? (
                <div className="rounded-md border border-border bg-background p-2 space-y-2">
                  <input
                    autoFocus={createStage === 'name'}
                    value={newName}
                    disabled={createStage === 'holding'}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') advanceToHoldingPick();
                      if (e.key === 'Escape') cancelCreate();
                    }}
                    placeholder={dict.portfolios?.createPlaceholder ?? 'Portfolio name'}
                    className="w-full rounded border border-border bg-background px-2 py-1 text-sm focus:border-foreground focus:outline-none disabled:opacity-70"
                  />
                  {createStage === 'name' ? (
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={cancelCreate}>
                        <X className="size-3 mr-1" />
                        {dict.portfolios?.cancel ?? 'Cancel'}
                      </Button>
                      <Button size="sm" onClick={advanceToHoldingPick} disabled={!newName.trim()}>
                        {dict.portfolios?.next ?? 'Next'}
                      </Button>
                    </div>
                  ) : (
                    <p className="px-1 text-[11px] text-muted-foreground">
                      {dict.portfolios?.pickFirstHoldingHint ?? 'Pick the first holding in the main panel →'}
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onNewPortfolio}
                >
                  <Plus className="size-3.5 mr-1" />
                  {dict.portfolios?.newPortfolio ?? 'New portfolio'}
                </Button>
              )}
            </div>
          </div>

          {/* Active portfolio detail */}
          <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6">
            {error && (
              <div className="mb-3 flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="size-4" />
                <span className="flex-1">{error}</span>
                <button onClick={() => setError(null)} className="text-xs opacity-70 hover:opacity-100">
                  ×
                </button>
              </div>
            )}

            {createStage === 'holding' ? (
              <CreateFirstHoldingPanel
                name={newName}
                onCancel={cancelCreate}
                onAdd={handleCreateWithHolding}
                dict={dict}
              />
            ) : !activeId ? (
              <EmptyDetail dict={dict} onCreate={onNewPortfolio} />
            ) : detailLoading ? (
              <div className="flex items-center gap-2 py-12 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">{dict.portfolios?.loading ?? 'Loading…'}</span>
              </div>
            ) : detail ? (
              <PortfolioDetailView
                portfolio={detail}
                quotes={quotes}
                quotesLoading={quotesLoading}
                onAddHolding={handleAddHolding}
                onRemoveHolding={handleRemoveHolding}
                onEditWeight={handleEditWeight}
                onRefreshQuotes={handleRefreshQuotes}
                dict={dict}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── sub-components ───────────────────────────────────────────────────

function PortfolioListRow({
  portfolio,
  active,
  onSelect,
  renaming,
  renameValue,
  onStartRename,
  onChangeRename,
  onCancelRename,
  onCommitRename,
  confirmingDelete,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
  labels,
}: {
  portfolio: PortfolioListItem;
  active: boolean;
  onSelect: () => void;
  renaming: boolean;
  renameValue: string;
  onStartRename: () => void;
  onChangeRename: (v: string) => void;
  onCancelRename: () => void;
  onCommitRename: () => void;
  confirmingDelete: boolean;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  labels: any;
}) {
  if (renaming) {
    return (
      <div className="rounded-md border border-border bg-background p-2 space-y-2">
        <input
          autoFocus
          value={renameValue}
          onChange={(e) => onChangeRename(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onCommitRename();
            if (e.key === 'Escape') onCancelRename();
          }}
          className="w-full rounded border border-border bg-background px-2 py-1 text-sm focus:border-foreground focus:outline-none"
        />
        <div className="flex gap-1 justify-end">
          <button onClick={onCancelRename} className="text-xs text-muted-foreground hover:text-foreground">
            {labels.cancel ?? 'Cancel'}
          </button>
          <button onClick={onCommitRename} className="text-xs font-medium hover:text-foreground">
            {labels.save ?? 'Save'}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        'group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm',
        active ? 'bg-muted text-foreground' : 'hover:bg-muted/50',
      )}
    >
      <button onClick={onSelect} className="flex min-w-0 flex-1 flex-col items-start text-left">
        <span className="truncate text-sm font-medium">{portfolio.name}</span>
        <span className="text-[10px] text-muted-foreground">
          {portfolio.holdingsCount} {labels.holdingsLabel ?? 'holdings'}
        </span>
      </button>
      {confirmingDelete ? (
        <div className="flex items-center gap-1">
          <button
            onClick={onConfirmDelete}
            className="rounded p-1 text-destructive hover:bg-destructive/10"
            title={labels.confirmDelete ?? 'Confirm delete'}
          >
            <Check className="size-3" />
          </button>
          <button
            onClick={onCancelDelete}
            className="rounded p-1 text-muted-foreground hover:bg-muted"
            title={labels.cancel ?? 'Cancel'}
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <div className="hidden gap-0.5 group-hover:flex">
          <button
            onClick={onStartRename}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title={labels.rename ?? 'Rename'}
          >
            <Edit2 className="size-3" />
          </button>
          <button
            onClick={onAskDelete}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
            title={labels.delete ?? 'Delete'}
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function PortfolioDetailView({
  portfolio,
  quotes,
  quotesLoading,
  onAddHolding,
  onRemoveHolding,
  onEditWeight,
  onRefreshQuotes,
  dict,
}: {
  portfolio: PortfolioDetail;
  quotes: Record<string, HoldingQuote>;
  quotesLoading: boolean;
  onAddHolding: (hit: SymbolHit, weight: number | null) => Promise<void>;
  onRemoveHolding: (id: string) => void;
  onEditWeight: (id: string, value: string) => void;
  onRefreshQuotes: () => void;
  dict: any;
}) {
  const existing = portfolio.holdings.map((h) => h.ticker);
  const totalWeight = portfolio.holdings.reduce((s, h) => s + (h.weight ?? 0), 0);

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">{portfolio.name}</h2>
        <span className="text-xs text-muted-foreground">
          {portfolio.holdings.length} {dict.portfolios?.holdingsLabel ?? 'holdings'}
          {totalWeight > 0 && ` · ${totalWeight.toFixed(2)}%`}
        </span>
      </div>

      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium">
          {dict.portfolios?.addHolding ?? 'Add holding'}
        </h3>
        <SymbolSearch
          onAdd={onAddHolding}
          existingTickers={existing}
          placeholder={dict.portfolios?.searchPlaceholder ?? 'Search ticker or name (English, pinyin, 中文)'}
          labels={{
            search: dict.portfolios?.search ?? 'Search',
            add: dict.portfolios?.add ?? 'Add',
            cancel: dict.portfolios?.cancel ?? 'Cancel',
            weight: dict.portfolios?.weight ?? 'Weight',
            weightHint: dict.portfolios?.weightHint ?? 'Weight must be 0–100, or leave blank for a watchlist entry.',
            optional: dict.portfolios?.optional ?? 'optional',
            already: dict.portfolios?.already ?? 'Added',
            empty: dict.portfolios?.searchEmpty ?? 'No matches.',
            error: dict.portfolios?.searchError ?? 'Search failed.',
            adding: dict.portfolios?.adding ?? 'Adding…',
          }}
        />
      </section>

      <HoldingsSection
        portfolio={portfolio}
        quotes={quotes}
        quotesLoading={quotesLoading}
        onRemoveHolding={onRemoveHolding}
        onEditWeight={onEditWeight}
        onRefreshQuotes={onRefreshQuotes}
        dict={dict}
      />
    </div>
  );
}

/**
 * Local sort state lives in this section component, not the parent —
 * switching sort doesn't need to round-trip the API; the list is small
 * (≤ 50 holdings) and re-fetching just to reorder would feel laggy.
 *
 * Tri-state cycle:
 *   default     — add-order (server-returned position ASC).
 *   weight-desc — largest weight first; null-weight watchlist entries
 *                 always sort to the bottom regardless of direction.
 *   weight-asc  — smallest weight first (still > null); null last.
 */
type HoldingsSort = 'default' | 'weight-desc' | 'weight-asc';

function HoldingsSection({
  portfolio,
  quotes,
  quotesLoading,
  onRemoveHolding,
  onEditWeight,
  onRefreshQuotes,
  dict,
}: {
  portfolio: PortfolioDetail;
  quotes: Record<string, HoldingQuote>;
  quotesLoading: boolean;
  onRemoveHolding: (id: string) => void;
  onEditWeight: (id: string, value: string) => void;
  onRefreshQuotes: () => void;
  dict: any;
}) {
  const [sort, setSort] = React.useState<HoldingsSort>('default');

  const sorted = React.useMemo(() => {
    const items = [...portfolio.holdings];
    if (sort === 'default') return items;
    items.sort((a, b) => {
      // null weights always rank lower than any number — these are
      // watchlist entries with no position sizing, so the user looking
      // at "biggest positions first" shouldn't see them mixed in.
      if (a.weight == null && b.weight == null) return a.position - b.position;
      if (a.weight == null) return 1;
      if (b.weight == null) return -1;
      return sort === 'weight-desc' ? b.weight - a.weight : a.weight - b.weight;
    });
    return items;
  }, [portfolio.holdings, sort]);

  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/20 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {dict.portfolios?.holdingsTitle ?? 'Holdings'}
        </span>
        <div className="flex items-center gap-1.5">
          {portfolio.holdings.length > 1 && (
            <SortToggle sort={sort} onChange={setSort} dict={dict} />
          )}
          <button
            type="button"
            onClick={onRefreshQuotes}
            disabled={quotesLoading}
            title={dict.portfolios?.refreshQuotes ?? 'Refresh quotes'}
            aria-label={dict.portfolios?.refreshQuotes ?? 'Refresh quotes'}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={cn('size-3.5', quotesLoading && 'animate-spin')} />
          </button>
        </div>
      </div>
      {sorted.length === 0 ? (
        <p className="px-3 py-6 text-sm text-muted-foreground">
          {dict.portfolios?.holdingsEmpty ?? 'No holdings yet. Add one above.'}
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {sorted.map((h) => (
            <HoldingRow
              key={h.id}
              holding={h}
              quote={quotes[h.ticker]}
              quotesLoading={quotesLoading}
              onRemove={() => onRemoveHolding(h.id)}
              onEditWeight={(v) => onEditWeight(h.id, v)}
              dict={dict}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function SortToggle({
  sort,
  onChange,
  dict,
}: {
  sort: HoldingsSort;
  onChange: (next: HoldingsSort) => void;
  dict: any;
}) {
  const next: Record<HoldingsSort, HoldingsSort> = {
    default: 'weight-desc',
    'weight-desc': 'weight-asc',
    'weight-asc': 'default',
  };
  const label =
    sort === 'weight-desc'
      ? dict.portfolios?.sortWeightDesc ?? 'Weight ↓'
      : sort === 'weight-asc'
      ? dict.portfolios?.sortWeightAsc ?? 'Weight ↑'
      : dict.portfolios?.sortDefault ?? 'Add order';
  return (
    <button
      type="button"
      onClick={() => onChange(next[sort])}
      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground hover:bg-muted hover:text-foreground"
      title={dict.portfolios?.sortToggleHint ?? 'Click to cycle sort order'}
    >
      <span className="opacity-70">
        {dict.portfolios?.sortBy ?? 'Sort'}:
      </span>
      <span>{label}</span>
    </button>
  );
}

function HoldingRow({
  holding,
  quote,
  quotesLoading,
  onRemove,
  onEditWeight,
  dict,
}: {
  holding: Holding;
  quote?: HoldingQuote;
  quotesLoading: boolean;
  onRemove: () => void;
  onEditWeight: (v: string) => void;
  dict: any;
}) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(holding.weight == null ? '' : String(holding.weight));
  const [confirming, setConfirming] = React.useState(false);

  React.useEffect(() => {
    setValue(holding.weight == null ? '' : String(holding.weight));
  }, [holding.weight]);

  // Up/down hue follows the user's market-colour convention (toggled
  // in the user-menu). The `text-up` / `text-down` Tailwind tokens
  // resolve through the --up / --down CSS vars in globals.css —
  // default CN (up=red), switches to US (up=green) when the user
  // picks the Western convention. Watchlist-only rows where the
  // chain returned an error fall back to "—".
  const hasQuote = quote && quote.error == null && quote.close != null;
  const pct = hasQuote ? quote.changePct : null;
  const tone =
    pct == null ? '' : pct > 0 ? 'text-up' : pct < 0 ? 'text-down' : 'text-muted-foreground';

  return (
    <li className="flex items-center gap-3 px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="font-mono text-sm font-semibold">{holding.ticker}</div>
        <div className="text-xs text-muted-foreground truncate">
          {holding.displayName ?? '—'}
          {holding.exchange ? ` · ${holding.exchange}` : ''}
        </div>
      </div>
      {/* Price + day-change column. Fixed w-20 (5rem) so all rows align
          on the right edge regardless of how many digits a ticker
          quotes — NVDA at 225.32 sits at the same x as a sub-$10
          A-share. tabular-nums keeps digits monospaced within the
          variable-width inter font. */}
      <div className="hidden w-20 shrink-0 flex-col items-end gap-1 leading-tight sm:flex">
        {hasQuote ? (
          <>
            <span className="font-mono text-sm tabular-nums">{quote.close!.toFixed(2)}</span>
            <span className={cn('font-mono text-[11px] tabular-nums', tone)}>
              {pct != null ? `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%` : ''}
            </span>
          </>
        ) : quotesLoading ? (
          // Skeleton bars sized to mirror the final cells so the row
          // doesn't jump width when the quote lands.
          <>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
          </>
        ) : (
          <>
            <span className="font-mono text-sm text-muted-foreground">—</span>
            <span className="font-mono text-[11px] text-muted-foreground">&nbsp;</span>
          </>
        )}
      </div>
      {/* Weight column — fixed width (w-20) so "—", "5%", and "33.33%"
          all hit the same right edge across rows. The editing input
          and the display button share the same w-20 so the column
          doesn't reflow when the user clicks to edit. */}
      <div className="flex w-20 shrink-0 items-center justify-end gap-1">
        {editing ? (
          <>
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onEditWeight(value);
                  setEditing(false);
                }
                if (e.key === 'Escape') {
                  setEditing(false);
                  setValue(holding.weight == null ? '' : String(holding.weight));
                }
              }}
              inputMode="decimal"
              placeholder="—"
              className="w-14 rounded border border-border bg-background px-2 py-1 text-right text-sm font-mono tabular-nums focus:border-foreground focus:outline-none"
            />
            <button
              onClick={() => {
                onEditWeight(value);
                setEditing(false);
              }}
              className="rounded p-1 hover:bg-muted"
            >
              <Check className="size-3" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full rounded px-2 py-1 text-right text-sm font-mono tabular-nums hover:bg-muted"
            title={dict.portfolios?.editWeight ?? 'Edit weight'}
          >
            {holding.weight == null ? '—' : `${holding.weight}%`}
          </button>
        )}
      </div>
      {confirming ? (
        <div className="flex items-center gap-1">
          <button onClick={onRemove} className="rounded p-1 text-destructive hover:bg-destructive/10">
            <Check className="size-3.5" />
          </button>
          <button onClick={() => setConfirming(false)} className="rounded p-1 text-muted-foreground hover:bg-muted">
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
          title={dict.portfolios?.remove ?? 'Remove'}
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </li>
  );
}

function EmptyDetail({
  dict,
  onCreate,
}: {
  dict: any;
  onCreate: () => void;
}) {
  return (
    <div className="mx-auto mt-12 max-w-md rounded-lg border border-border bg-muted/10 p-6 text-center">
      <Wallet className="mx-auto size-8 text-muted-foreground" />
      <h2 className="mt-3 text-base font-semibold">
        {dict.portfolios?.emptyTitle ?? 'No portfolios yet'}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {dict.portfolios?.emptyHint ?? 'Create your first portfolio to start tracking technical indicators.'}
      </p>
      <Button className="mt-4" onClick={onCreate}>
        <Plus className="size-3.5 mr-1" />
        {dict.portfolios?.newPortfolio ?? 'New portfolio'}
      </Button>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────

function translateError(code: string, dict: any): string {
  const map: Record<string, string | undefined> = {
    name_required: dict.portfolios?.errNameRequired,
    name_too_long: dict.portfolios?.errNameTooLong,
    name_taken: dict.portfolios?.errNameTaken,
    max_portfolios_reached: dict.portfolios?.errMaxPortfolios,
    ticker_required: dict.portfolios?.errTickerRequired,
    ticker_already_in_portfolio: dict.portfolios?.errTickerExists,
    invalid_weight: dict.portfolios?.errInvalidWeight,
    not_found: dict.portfolios?.errNotFound,
    holding_required: dict.portfolios?.errHoldingRequired,
    last_holding_cannot_remove: dict.portfolios?.errLastHolding,
  };
  return map[code] ?? dict.portfolios?.errGeneric ?? code;
}

/**
 * Renders the "pick the first holding for [name]" panel during the
 * 2-stage create flow. The portfolio itself doesn't exist yet — POST
 * /api/portfolios fires with { name, holding } when the user confirms
 * a symbol, and server-side that's a single transaction. Cancel kicks
 * the user back to the idle list with no DB row written.
 */
function CreateFirstHoldingPanel({
  name,
  onCancel,
  onAdd,
  dict,
}: {
  name: string;
  onCancel: () => void;
  onAdd: (hit: SymbolHit, weight: number | null) => Promise<void>;
  dict: any;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">
            {(dict.portfolios?.createHeader ?? 'Create portfolio')}: {name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {dict.portfolios?.firstHoldingSubtitle ??
              'Pick the first holding. Portfolios must have at least one ticker.'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {dict.portfolios?.cancel ?? 'Cancel'}
        </button>
      </header>
      <section className="rounded-lg border border-border bg-card p-4">
        <SymbolSearch
          onAdd={onAdd}
          existingTickers={[]}
          placeholder={
            dict.portfolios?.searchPlaceholder ??
            'Search ticker or name (English, pinyin, 中文)'
          }
          labels={{
            search: dict.portfolios?.search ?? 'Search',
            add: dict.portfolios?.create ?? 'Create',
            cancel: dict.portfolios?.cancel ?? 'Cancel',
            weight: dict.portfolios?.weight ?? 'Weight',
            weightHint:
              dict.portfolios?.weightHint ??
              'Weight 0–100, or leave blank for a watchlist entry.',
            optional: dict.portfolios?.optional ?? 'optional',
            already: dict.portfolios?.already ?? 'Added',
            empty: dict.portfolios?.searchEmpty ?? 'No matches.',
            error: dict.portfolios?.searchError ?? 'Search failed.',
            adding: dict.portfolios?.creating ?? 'Creating…',
          }}
        />
      </section>
    </div>
  );
}
