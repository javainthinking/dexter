'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Sidebar, type SessionSummary } from '../../../components/chat/sidebar';
import { Button } from '../../../components/ui/button';
import { TopBar } from '../../../components/nav/top-bar';
import { Skeleton } from '../../../components/ui/skeleton';
import { useDictionary, useLocale } from '../../../components/i18n/dictionary-provider';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { cn } from '../../../lib/utils';
import { MoversPanel } from '../../../components/market/movers-panel';

/**
 * Market section client.
 *
 * Today this is a single-tab view (Movers — the gainers/losers
 * leaderboard previously buried inside Indicators). The tab nav stays
 * in place even with one entry so that adding sector heatmaps, market
 * breadth, sentiment indices, or any other market-wide surface later
 * is a one-line `TABS` change rather than another structural rebuild.
 *
 * Movers is intentionally portfolio-independent — it surveys the
 * whole US market — so this client does NOT need the portfolio
 * selector / holdings reconciliation logic that Indicators carries.
 * The Sidebar stays for chat-session continuity (matching every other
 * in-app page).
 *
 * The underlying movers API still lives at /api/indicators/movers; we
 * didn't move the endpoint because nothing user-visible depends on the
 * path and renaming it would just churn caches.
 */

type Tab = 'movers';

interface Mover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent_change: number;
  volume: number;
}

interface MoversResponse {
  asOf: string;
  dimension: 'movers';
  gainers: Mover[];
  losers: Mover[];
  market?: string | null;
  retrieved_at?: string | null;
}

const TABS: ReadonlyArray<{ id: Tab; labelKey: string; fallback: string }> = [
  { id: 'movers', labelKey: 'movers', fallback: 'Gainers & losers' },
];

export function MarketClient() {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();

  // Sidebar
  const [sessions, setSessions] = React.useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);

  const [tab, setTab] = React.useState<Tab>('movers');
  const [data, setData] = React.useState<MoversResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = tab === 'movers' ? '/api/indicators/movers' : '';
      if (!url) throw new Error(`Unknown tab: ${tab}`);
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as MoversResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onNewConversation = () => router.push(getLocalizedPath('/chat', locale));
  const onSwitchSession = (id: string) =>
    router.push(`${getLocalizedPath('/chat', locale)}?session=${encodeURIComponent(id)}`);
  const onDeleteSession = async (id: string) => {
    await fetch(`/api/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
    setSessions((prev) => prev.filter((s) => s.sessionId !== id));
  };

  const tabLabel = (id: Tab, fallback: string) =>
    (dict.market?.tabs as Record<string, string> | undefined)?.[id] ?? fallback;

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
          title={dict.market?.title ?? 'Market'}
          subtitle={dict.market?.subtitle ?? 'Market-wide signals across the tape.'}
        />

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
              {tabLabel(t.id, t.fallback)}
            </button>
          ))}
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            title={dict.market?.refresh ?? 'Refresh'}
            aria-label={dict.market?.refresh ?? 'Refresh'}
          >
            <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
            <span className="hidden md:inline">{dict.market?.refresh ?? 'Refresh'}</span>
          </button>
        </nav>

        <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6">
          {loading && <SkeletonMoversPanel />}
          {error && <ErrorPanel message={error} onRetry={fetchData} dict={dict} />}
          {!loading && !error && tab === 'movers' && data && (
            <MoversPanel data={data} dict={dict} />
          )}
        </div>
      </main>
    </div>
  );
}

function SkeletonMoversPanel() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, col) => (
          <section
            key={col}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            <div className="border-b border-border px-3 py-2">
              <Skeleton className="h-4 w-28" />
            </div>
            <ul className="divide-y divide-border">
              {Array.from({ length: 8 }).map((_, row) => (
                <li key={row} className="flex items-center justify-between gap-2 px-3 py-2">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-2 w-24" />
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-2 w-10" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
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
          <p className="text-sm font-medium">
            {dict.market?.error ?? dict.indicators?.error ?? 'Failed to load market data.'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{message}</p>
        </div>
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw className="size-3.5 mr-1" />
          {dict.market?.retry ?? dict.indicators?.retry ?? 'Retry'}
        </Button>
      </div>
    </div>
  );
}
