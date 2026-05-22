'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, AlertTriangle, Wallet, ChevronDown } from 'lucide-react';
import { Sidebar, type SessionSummary } from '../../../components/chat/sidebar';
import { Button } from '../../../components/ui/button';
import { TopBar } from '../../../components/nav/top-bar';
import { Skeleton } from '../../../components/ui/skeleton';
import { useDictionary, useLocale } from '../../../components/i18n/dictionary-provider';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { cn } from '../../../lib/utils';
import { LocalizedLink } from '../../../components/i18n/localized-link';
import { MacdCard } from '../../../components/indicators/macd-card';
import { MaCard } from '../../../components/indicators/ma-card';
import { VolumeCard } from '../../../components/indicators/volume-card';
import { FlowCard } from '../../../components/indicators/flow-card';

// The Movers (gainers/losers) tab moved to /market — that surface is
// portfolio-independent and the broader Market section is where future
// market-wide signals will land too. Indicators stays focused on
// per-watchlist technicals.

type Tab = 'macd' | 'ma' | 'volume' | 'flow';

interface PortfolioSummary {
  id: string;
  name: string;
  holdingsCount: number;
}

interface PortfolioWithHoldings extends PortfolioSummary {
  holdings: Array<{ ticker: string; displayName: string | null }>;
}

interface IndicatorTickerEntry {
  ticker: string;
  sourceUrl?: string;
  prices?: Array<{ time: string; open: number | null; high: number | null; low: number | null; close: number | null; volume: number | null }>;
  indicator?: unknown[];
  bucket?: 'bullish' | 'bearish' | 'neutral';
  /**
   * Last N bucket samples (oldest → newest, last = today). Forwarded
   * verbatim from /api/indicators/:dim and consumed by the card shell
   * to render the multi-day signal trail in the badge.
   */
  bucketTrend?: Array<{ time: string; bucket: 'bullish' | 'bearish' | 'neutral' }>;
  latest?: Record<string, number | null | string>;
  error?: string;
}

interface IndicatorsResponse {
  asOf: string;
  dimension: string;
  tickers: IndicatorTickerEntry[];
}

const TABS: ReadonlyArray<{ id: Tab }> = [
  { id: 'macd' },
  { id: 'ma' },
  { id: 'volume' },
  { id: 'flow' },
];

export function IndicatorsClient({
  initialPortfolios,
}: {
  initialPortfolios: PortfolioSummary[];
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();

  // Sidebar
  const [sessions, setSessions] = React.useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);

  const [portfolios, setPortfolios] = React.useState<PortfolioSummary[]>(initialPortfolios);
  const [activeId, setActiveId] = React.useState<string | null>(initialPortfolios[0]?.id ?? null);
  const [activeDetail, setActiveDetail] = React.useState<PortfolioWithHoldings | null>(null);
  const [tab, setTab] = React.useState<Tab>('macd');
  const [data, setData] = React.useState<IndicatorsResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // ─── sidebar plumbing ──────────────────────────────────────────────
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/sessions?size=50');
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

  // Reconcile portfolios with the API on mount + tab-focus so a user
  // who created portfolios on another tab/device sees them immediately
  // without a hard reload.
  React.useEffect(() => {
    void refetchOnce();
    const onFocus = () => void refetchOnce();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
    async function refetchOnce() {
      try {
        const res = await fetch('/api/portfolios', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as { portfolios: PortfolioSummary[] };
        setPortfolios(json.portfolios);
        setActiveId((cur) => cur ?? json.portfolios[0]?.id ?? null);
      } catch {
        /* swallow */
      }
    }
  }, []);

  // Load detail (holdings) for the active portfolio.
  React.useEffect(() => {
    if (!activeId) {
      setActiveDetail(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/portfolios/${activeId}`);
        if (!res.ok) return;
        const json = (await res.json()) as { portfolio: PortfolioWithHoldings };
        if (!cancelled) setActiveDetail(json.portfolio);
      } catch {
        /* swallow */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const tickers = React.useMemo(
    () => (activeDetail?.holdings.map((h) => h.ticker) ?? []),
    [activeDetail],
  );

  // Ticker → company name lookup so the indicator API's bare-ticker
  // results can be enriched before they reach the card components.
  // The API only returns prices + indicator values; names live with the
  // portfolio holdings (different ownership boundary).
  const tickerNames = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const h of activeDetail?.holdings ?? []) {
      if (h.displayName) m.set(h.ticker, h.displayName);
    }
    return m;
  }, [activeDetail]);

  const enrichedEntries = React.useCallback(
    (entries: IndicatorTickerEntry[]) =>
      entries.map((e) => ({ ...e, displayName: tickerNames.get(e.ticker) ?? null })),
    [tickerNames],
  );

  // ─── indicator fetch ──────────────────────────────────────────────
  // Every remaining tab is portfolio-scoped (per-ticker technicals), so
  // we just bail out when the active portfolio has no holdings.
  const fetchData = React.useCallback(async () => {
    if (tickers.length === 0) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `/api/indicators/${tab}?tickers=${encodeURIComponent(tickers.join(','))}&days=140`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as IndicatorsResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [tab, tickers]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── sidebar handlers ─────────────────────────────────────────────
  const onNewConversation = () => router.push(getLocalizedPath('/chat', locale));
  const onSwitchSession = (id: string) =>
    router.push(`${getLocalizedPath('/chat', locale)}?session=${encodeURIComponent(id)}`);
  const onDeleteSession = async (id: string) => {
    await fetch(`/api/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
    setSessions((prev) => prev.filter((s) => s.sessionId !== id));
  };

  const indicatorsLabel = (k: Tab) =>
    (dict.indicators?.tabs as Record<string, string> | undefined)?.[k] ?? k;

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
          title={dict.indicators?.title ?? 'Indicators'}
          subtitle={dict.indicators?.subtitle ?? 'Technical signals across your watchlist'}
        />

        {/* Portfolio selector bar — every remaining tab is per-watchlist
            now that Movers has moved to /market. */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-background px-4 py-3 lg:px-6">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {dict.indicators?.portfolio ?? 'Portfolio'}
          </span>
          {portfolios.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              {dict.indicators?.noPortfolios ?? 'No portfolios — create one first.'}
            </span>
          ) : (
            <PortfolioPicker
              portfolios={portfolios}
              value={activeId}
              onChange={setActiveId}
            />
          )}
          <button
            type="button"
            onClick={fetchData}
            disabled={loading || tickers.length === 0}
            className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            title={dict.indicators?.refresh ?? 'Refresh'}
            aria-label={dict.indicators?.refresh ?? 'Refresh'}
          >
            <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
            <span className="hidden md:inline">{dict.indicators?.refresh ?? 'Refresh'}</span>
          </button>
          <LocalizedLink
            href="/portfolios"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <Wallet className="size-3.5" />
            {dict.indicators?.managePortfolios ?? 'Manage portfolios'}
          </LocalizedLink>
        </div>

        {/* Tabs */}
        <nav className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 px-4 py-2 lg:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {indicatorsLabel(t.id)}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6">
          {portfolios.length === 0 && <EmptyNoPortfolios dict={dict} locale={locale} />}
          {portfolios.length > 0 && tickers.length === 0 && (
            <EmptyEmptyPortfolio dict={dict} locale={locale} activeId={activeId} />
          )}

          {tickers.length > 0 && loading && <SkeletonCardGrid count={tickers.length} />}
          {error && <ErrorPanel message={error} onRetry={fetchData} dict={dict} />}

          {!loading && data && tab === 'macd' && (
            <CardGrid>
              {enrichedEntries(data.tickers).map((e) => (
                <MacdCard key={e.ticker} entry={e as never} dict={dict} />
              ))}
            </CardGrid>
          )}
          {!loading && data && tab === 'ma' && (
            <CardGrid>
              {enrichedEntries(data.tickers).map((e) => (
                <MaCard key={e.ticker} entry={e as never} dict={dict} />
              ))}
            </CardGrid>
          )}
          {!loading && data && tab === 'volume' && (
            <CardGrid>
              {enrichedEntries(data.tickers).map((e) => (
                <VolumeCard key={e.ticker} entry={e as never} dict={dict} />
              ))}
            </CardGrid>
          )}
          {!loading && data && tab === 'flow' && (
            <CardGrid>
              {enrichedEntries(data.tickers).map((e) => (
                <FlowCard key={e.ticker} entry={e as never} dict={dict} />
              ))}
            </CardGrid>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── sub-components ───────────────────────────────────────────────────

function PortfolioPicker({
  portfolios,
  value,
  onChange,
}: {
  portfolios: PortfolioSummary[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const active = portfolios.find((p) => p.id === value);
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
      >
        <span className="font-medium">{active?.name ?? '—'}</span>
        <span className="text-xs text-muted-foreground">
          {active ? `${active.holdingsCount}` : ''}
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 min-w-[14rem] rounded-md border border-border bg-popover shadow-lg">
          <ul className="py-1">
            {portfolios.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(p.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-muted',
                    p.id === value && 'bg-muted',
                  )}
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.holdingsCount}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EmptyNoPortfolios({ dict, locale }: { dict: any; locale: string }) {
  return (
    <div className="mx-auto mt-12 max-w-md rounded-lg border border-border bg-muted/10 p-6 text-center">
      <Wallet className="mx-auto size-8 text-muted-foreground" />
      <h2 className="mt-3 text-base font-semibold">
        {dict.indicators?.emptyNoPortfolios ?? 'Create a portfolio first.'}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {dict.indicators?.emptyNoPortfoliosHint ?? 'Indicators run against your portfolios. Add one to get started.'}
      </p>
      <LocalizedLink
        href="/portfolios"
        className="mt-4 inline-flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90"
      >
        <Wallet className="size-3.5" />
        {dict.indicators?.goToPortfolios ?? 'Go to portfolios'}
      </LocalizedLink>
    </div>
  );
}

function EmptyEmptyPortfolio({ dict, locale, activeId }: { dict: any; locale: string; activeId: string | null }) {
  return (
    <div className="mx-auto mt-12 max-w-md rounded-lg border border-border bg-muted/10 p-6 text-center">
      <h2 className="text-base font-semibold">
        {dict.indicators?.emptyPortfolio ?? 'This portfolio has no holdings yet.'}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {dict.indicators?.emptyPortfolioHint ?? 'Add a few tickers to see indicators.'}
      </p>
      <LocalizedLink
        href="/portfolios"
        className="mt-4 inline-flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90"
      >
        {dict.indicators?.addHoldings ?? 'Add holdings'}
      </LocalizedLink>
    </div>
  );
}

/**
 * Skeleton placeholder for a single indicator card. Mirrors the real
 * card's vertical rhythm — header row with ticker + bucket badge,
 * chart area roughly the same height as the SVG, then the four-cell
 * metrics row — so the layout doesn't jump when real data arrives.
 *
 * Used in a grid (SkeletonCardGrid) sized to `count` to match the
 * number of holdings being loaded; that way the user can see "I have
 * 11 cards coming" rather than a single generic spinner.
 */
function SkeletonCard() {
  return (
    <article className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="px-3 pt-3">
        <Skeleton className="h-[220px] w-full" />
      </div>
      <div className="grid grid-cols-4 gap-2 px-3 py-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-2 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </article>
  );
}

function SkeletonCardGrid({ count }: { count: number }) {
  // Cap visible skeletons so a huge portfolio doesn't paint a wall of
  // pulsing blocks. The real cards then fill in as they arrive.
  const n = Math.min(Math.max(count, 1), 6);
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(420px,1fr))]">
      {Array.from({ length: n }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
  dict,
}: {
  message: string;
  onRetry: () => void;
  dict: any;
}) {
  return (
    <div className="mx-auto mt-6 max-w-xl rounded-lg border border-destructive/40 bg-destructive/5 p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 size-4 text-destructive" />
        <div className="flex-1">
          <p className="text-sm font-medium">{dict.indicators?.error ?? 'Failed to load indicators.'}</p>
          <p className="mt-1 text-xs text-muted-foreground">{message}</p>
        </div>
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw className="size-3.5 mr-1" />
          {dict.indicators?.retry ?? 'Retry'}
        </Button>
      </div>
    </div>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(420px,1fr))]">
      {children}
    </div>
  );
}
