'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Save, Check, Loader2, RefreshCw, Menu, AlertTriangle } from 'lucide-react';
import { Sidebar, type SessionSummary } from '../../../components/chat/sidebar';
import { Button } from '../../../components/ui/button';
import { ThemeToggle } from '../../../components/theme-toggle';
import { LanguageSwitcher } from '../../../components/i18n/language-switcher';
import { UserMenu } from '../../../components/auth/user-menu';
import { Logo } from '../../../components/logo';
import { useDictionary, useLocale } from '../../../components/i18n/dictionary-provider';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { cn } from '../../../lib/utils';
import { MacdCard } from '../../../components/indicators/macd-card';
import { MaCard } from '../../../components/indicators/ma-card';
import { VolumeCard } from '../../../components/indicators/volume-card';
import { FlowCard } from '../../../components/indicators/flow-card';
import { MoversPanel } from '../../../components/indicators/movers-panel';

type Tab = 'macd' | 'ma' | 'volume' | 'flow' | 'movers';

interface IndicatorTickerEntry {
  ticker: string;
  sourceUrl?: string;
  prices?: Array<{ time: string; open: number | null; high: number | null; low: number | null; close: number | null; volume: number | null }>;
  indicator?: unknown[];
  bucket?: 'bullish' | 'bearish' | 'neutral';
  latest?: Record<string, number | null | string>;
  error?: string;
}

interface IndicatorsResponse {
  asOf: string;
  dimension: string;
  startDate?: string;
  endDate?: string;
  tickers: IndicatorTickerEntry[];
}

interface MoversResponse {
  asOf: string;
  dimension: 'movers';
  gainers: Array<{ symbol: string; name: string; price: number; change: number; percent_change: number; volume: number }>;
  losers: Array<{ symbol: string; name: string; price: number; change: number; percent_change: number; volume: number }>;
  market?: string | null;
  retrieved_at?: string | null;
}

const TABS: Array<{ id: Tab; needsTickers: boolean }> = [
  { id: 'macd', needsTickers: true },
  { id: 'ma', needsTickers: true },
  { id: 'volume', needsTickers: true },
  { id: 'flow', needsTickers: true },
  { id: 'movers', needsTickers: false },
];

export function IndicatorsClient({ initialTickers }: { initialTickers: string[] }) {
  const dict = useDictionary();
  const locale = useLocale();

  // Sidebar — mirror the memory page so the layout stays consistent across
  // the protected app surface.
  const [sessions, setSessions] = React.useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const [tickers, setTickers] = React.useState<string[]>(initialTickers);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [tab, setTab] = React.useState<Tab>('macd');
  const [data, setData] = React.useState<IndicatorsResponse | MoversResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${getLocalizedPath('/api/sessions', locale)}?size=50`);
        if (res.ok) {
          const json = (await res.json()) as { sessions?: SessionSummary[] };
          setSessions(json.sessions ?? []);
        }
      } catch {
        // sessions list is non-critical
      }
      setSessionsLoading(false);
    })();
  }, [locale]);

  // ─── data fetch ─────────────────────────────────────────────────────
  const needsTickers = TABS.find((t) => t.id === tab)?.needsTickers ?? false;

  const fetchData = React.useCallback(async () => {
    if (needsTickers && tickers.length === 0) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url =
        tab === 'movers'
          ? '/api/indicators/movers'
          : `/api/indicators/${tab}?tickers=${encodeURIComponent(tickers.join(','))}&days=140`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as IndicatorsResponse | MoversResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [tab, tickers, needsTickers]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── holdings save ──────────────────────────────────────────────────
  const handleSaveTickers = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/holdings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers }),
      });
      if (res.ok) {
        const json = (await res.json()) as { updatedAt?: string };
        setSaved(true);
        setSavedAt(json.updatedAt ?? new Date().toISOString());
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      // swallow; UI shows error if needed
    } finally {
      setSaving(false);
    }
  };

  // ─── ticker manipulation ────────────────────────────────────────────
  const addTicker = (raw: string) => {
    setHasInteracted(true);
    const parts = raw
      .split(/[\s,]+/)
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);
    if (parts.length === 0) return;
    setTickers((prev) => {
      const out = [...prev];
      for (const p of parts) if (!out.includes(p)) out.push(p);
      return out;
    });
  };
  const removeTicker = (t: string) => {
    setHasInteracted(true);
    setTickers((prev) => prev.filter((x) => x !== t));
  };

  const router = useRouter();

  const indicatorsLabel = (k: Tab) =>
    (dict.indicators?.tabs as Record<string, string> | undefined)?.[k] ?? k;

  // Sidebar interactions — minimal handlers; full edit-flow lives on the chat page
  const onNewConversation = () => router.push(getLocalizedPath('/chat', locale));
  const onSwitchSession = (id: string) =>
    router.push(`${getLocalizedPath('/chat', locale)}?session=${encodeURIComponent(id)}`);
  const onDeleteSession = async (id: string) => {
    await fetch(`/api/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
    setSessions((prev) => prev.filter((s) => s.sessionId !== id));
  };

  return (
    <div className="flex h-svh w-full bg-background text-foreground">
      <Sidebar
        sessions={sessions}
        loading={sessionsLoading}
        onNew={onNewConversation}
        onSwitch={onSwitchSession}
        onDelete={onDeleteSession}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label={dict.chat?.header?.openSidebar ?? 'Open sidebar'}
            >
              <Menu className="size-5" />
            </Button>
            <Logo />
            <div className="ml-2 hidden flex-col sm:flex">
              <span className="text-sm font-semibold">
                {dict.indicators?.title ?? 'Indicators'}
              </span>
              <span className="text-xs text-muted-foreground">
                {dict.indicators?.subtitle ?? 'Technical signals for your watchlist'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu variant="compact" />
          </div>
        </header>

        {/* Ticker bar */}
        {needsTickers && (
          <TickerBar
            tickers={tickers}
            onAdd={addTicker}
            onRemove={removeTicker}
            onSave={handleSaveTickers}
            saving={saving}
            saved={saved}
            savedAt={savedAt}
            dict={dict}
          />
        )}

        {/* Tab strip */}
        <nav className="flex flex-wrap gap-1 border-b border-border bg-muted/30 px-4 py-2 lg:px-6">
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6">
          {needsTickers && tickers.length === 0 && (
            <EmptyTickersPrompt dict={dict} onAdd={addTicker} hasInteracted={hasInteracted} />
          )}

          {needsTickers && tickers.length > 0 && loading && <LoadingPanel dict={dict} />}
          {error && <ErrorPanel message={error} onRetry={fetchData} dict={dict} />}

          {/* Each card receives `entry as any` for the indicator/series field
              because the API surface is union-typed (one indicator shape per
              dimension) but the runtime guarantee is "tab === X implies the
              entries match X's row shape". Re-narrowing would require a
              per-dimension client component file; the cast is local and the
              card-side types stay strict. */}
          {!loading && data && tab === 'macd' && 'tickers' in data && (
            <CardGrid>
              {data.tickers.map((e) => (
                <MacdCard key={e.ticker} entry={e as never} dict={dict} />
              ))}
            </CardGrid>
          )}
          {!loading && data && tab === 'ma' && 'tickers' in data && (
            <CardGrid>
              {data.tickers.map((e) => (
                <MaCard key={e.ticker} entry={e as never} dict={dict} />
              ))}
            </CardGrid>
          )}
          {!loading && data && tab === 'volume' && 'tickers' in data && (
            <CardGrid>
              {data.tickers.map((e) => (
                <VolumeCard key={e.ticker} entry={e as never} dict={dict} />
              ))}
            </CardGrid>
          )}
          {!loading && data && tab === 'flow' && 'tickers' in data && (
            <CardGrid>
              {data.tickers.map((e) => (
                <FlowCard key={e.ticker} entry={e as never} dict={dict} />
              ))}
            </CardGrid>
          )}
          {!loading && tab === 'movers' && data && 'gainers' in data && (
            <MoversPanel data={data} dict={dict} />
          )}
        </div>
      </main>
    </div>
  );
}

// ─── sub-components ───────────────────────────────────────────────────

function TickerBar({
  tickers,
  onAdd,
  onRemove,
  onSave,
  saving,
  saved,
  savedAt,
  dict,
}: {
  tickers: string[];
  onAdd: (raw: string) => void;
  onRemove: (t: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  savedAt: string | null;
  dict: any;
}) {
  const [input, setInput] = React.useState('');
  const submit = () => {
    if (!input.trim()) return;
    onAdd(input);
    setInput('');
  };
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background px-4 py-3 lg:px-6">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {dict.indicators?.tickers ?? 'Tickers'}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {tickers.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-mono"
          >
            {t}
            <button
              type="button"
              onClick={() => onRemove(t)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${t}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex flex-1 items-center gap-1.5 min-w-[140px]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={dict.indicators?.tickerPlaceholder ?? 'Add ticker (e.g. NVDA, 0700.HK)'}
          className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm focus:border-foreground focus:outline-none"
        />
        <Button variant="ghost" size="sm" onClick={submit} disabled={!input.trim()}>
          <Plus className="size-3.5 mr-1" />
          {dict.indicators?.addTicker ?? 'Add'}
        </Button>
      </div>
      <Button variant="outline" size="sm" onClick={onSave} disabled={saving || tickers.length === 0}>
        {saving ? (
          <Loader2 className="size-3.5 animate-spin mr-1" />
        ) : saved ? (
          <Check className="size-3.5 mr-1" />
        ) : (
          <Save className="size-3.5 mr-1" />
        )}
        {saved
          ? dict.indicators?.saved ?? 'Saved'
          : dict.indicators?.saveToMemory ?? 'Save to memory'}
      </Button>
      {savedAt && !saved && (
        <span className="text-xs text-muted-foreground">
          {dict.indicators?.lastSavedAt ?? 'Last saved'}{' '}
          {new Date(savedAt).toLocaleString()}
        </span>
      )}
    </div>
  );
}

function EmptyTickersPrompt({
  dict,
  onAdd,
  hasInteracted,
}: {
  dict: any;
  onAdd: (raw: string) => void;
  hasInteracted: boolean;
}) {
  const [input, setInput] = React.useState('');
  const submit = () => {
    if (!input.trim()) return;
    onAdd(input);
    setInput('');
  };
  return (
    <div className="mx-auto mt-12 max-w-xl rounded-lg border border-border bg-muted/20 p-6">
      <h2 className="text-lg font-semibold">
        {hasInteracted
          ? dict.indicators?.emptyAfterClear ?? 'Add at least one ticker to view this indicator.'
          : dict.indicators?.emptyTitle ?? 'No portfolio found in memory.'}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {dict.indicators?.emptyHint ??
          'Tell Dexter your holdings — e.g. NVDA, TSLA, 0700.HK — and pick "Save to memory" so you only do this once.'}
      </p>
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="NVDA, TSLA, 0700.HK"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
        />
        <Button onClick={submit} disabled={!input.trim()}>
          <Plus className="size-3.5 mr-1" />
          {dict.indicators?.confirm ?? 'Confirm'}
        </Button>
      </div>
    </div>
  );
}

function LoadingPanel({ dict }: { dict: any }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      <span className="text-sm">{dict.indicators?.loading ?? 'Computing indicators…'}</span>
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
