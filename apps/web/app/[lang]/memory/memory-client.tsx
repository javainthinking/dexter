'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Trash2, Check, Menu, BrainCircuit, Loader2 } from 'lucide-react';
import { Sidebar, type SessionSummary } from '../../../components/chat/sidebar';
import { Button } from '../../../components/ui/button';
import { ThemeToggle } from '../../../components/theme-toggle';
import { LanguageSwitcher } from '../../../components/i18n/language-switcher';
import { UserMenu } from '../../../components/auth/user-menu';
import { AppNav } from '../../../components/nav/app-nav';
import { Separator } from '../../../components/ui/separator';
import { Logo } from '../../../components/logo';
import {
  useDictionary,
  useLocale,
  format,
} from '../../../components/i18n/dictionary-provider';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { cn } from '../../../lib/utils';

interface MemoryRecord {
  id: string;
  content: string;
  user_id?: string;
  expired?: boolean;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export function MemoryClient() {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();

  // Sidebar state (same as chat page)
  const [sessions, setSessions] = React.useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Memory state
  const [memories, setMemories] = React.useState<MemoryRecord[]>([]);
  const [memoriesLoading, setMemoriesLoading] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [configured, setConfigured] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [queryInput, setQueryInput] = React.useState('');
  const [activeQuery, setActiveQuery] = React.useState('');
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  // ─── data fetch ────────────────────────────────────────────────

  const refreshSessions = React.useCallback(async () => {
    try {
      const res = await fetch('/api/sessions', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as { sessions: SessionSummary[] };
      setSessions(data.sessions ?? []);
    } catch {
      /* ignore */
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  const refreshMemories = React.useCallback(async (query: string) => {
    setMemoriesLoading(true);
    setError(null);
    try {
      const url = query
        ? `/api/memory?q=${encodeURIComponent(query)}&size=50`
        : '/api/memory?size=50';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        setError('errorLoading');
        return;
      }
      const data = (await res.json()) as {
        items: MemoryRecord[];
        total: number;
        configured: boolean;
      };
      setMemories(data.items ?? []);
      setTotalCount(data.total ?? (data.items?.length ?? 0));
      setConfigured(data.configured !== false);
    } catch {
      setError('errorLoading');
    } finally {
      setMemoriesLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  React.useEffect(() => {
    void refreshMemories('');
  }, [refreshMemories]);

  // Debounce search input → active query → refetch
  React.useEffect(() => {
    const trimmed = queryInput.trim();
    const t = setTimeout(() => setActiveQuery(trimmed), 220);
    return () => clearTimeout(t);
  }, [queryInput]);

  React.useEffect(() => {
    void refreshMemories(activeQuery);
  }, [activeQuery, refreshMemories]);

  // ─── sidebar handlers (route to /chat) ────────────────────────

  const goToChat = React.useCallback(() => {
    router.push(getLocalizedPath('/chat', locale));
  }, [locale, router]);

  const onNewConversation = React.useCallback(async () => {
    try {
      await fetch('/api/sessions', { method: 'POST' });
    } catch {
      /* ignore */
    }
    goToChat();
  }, [goToChat]);

  const onSwitchSession = React.useCallback(
    async (sessionId: string) => {
      try {
        await fetch('/api/sessions/switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
      } catch {
        /* ignore */
      }
      goToChat();
    },
    [goToChat],
  );

  const onDeleteSession = React.useCallback(
    async (sessionId: string) => {
      try {
        await fetch(`/api/sessions?id=${encodeURIComponent(sessionId)}`, {
          method: 'DELETE',
        });
      } catch {
        /* ignore */
      }
      void refreshSessions();
    },
    [refreshSessions],
  );

  // ─── memory forget ─────────────────────────────────────────────

  const onForget = React.useCallback(
    async (memoryId: string) => {
      setConfirmingId(null);
      // Optimistic remove
      setMemories((prev) => prev.filter((m) => m.id !== memoryId));
      setTotalCount((c) => Math.max(0, c - 1));
      try {
        const res = await fetch(`/api/memory?id=${encodeURIComponent(memoryId)}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          // Rollback by refetching
          void refreshMemories(activeQuery);
        }
      } catch {
        void refreshMemories(activeQuery);
      }
    },
    [activeQuery, refreshMemories],
  );

  // ─── render ────────────────────────────────────────────────────

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          sessions={sessions}
          loading={sessionsLoading}
          onNew={onNewConversation}
          onSwitch={onSwitchSession}
          onDelete={onDeleteSession}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full">
            <Sidebar
              sessions={sessions}
              loading={sessionsLoading}
              onNew={() => {
                void onNewConversation();
                setSidebarOpen(false);
              }}
              onSwitch={(id) => {
                void onSwitchSession(id);
                setSidebarOpen(false);
              }}
              onDelete={onDeleteSession}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-3 md:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="size-4" />
            </Button>
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-1">
            <AppNav />
            <Separator orientation="vertical" className="h-6" />
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden h-14 shrink-0 items-center justify-between border-b border-border px-5 md:flex">
          <div className="flex items-center gap-3">
            <BrainCircuit className="size-4 text-[color:var(--accent)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
              {dict.nav.memory}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AppNav />
            <Separator orientation="vertical" className="h-4" />
            <LanguageSwitcher />
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="space-y-3">
              <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {dict.memory.title}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {dict.memory.subtitle}
              </p>
            </div>

            {/* Search */}
            <div className="mt-8 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-subtle" />
                <input
                  type="search"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder={dict.memory.searchPlaceholder}
                  className={cn(
                    'block w-full rounded-lg border border-border bg-card pl-9 pr-10 py-2.5 text-sm',
                    'placeholder:text-subtle focus:border-border-strong focus:outline-none',
                    'transition-colors',
                  )}
                />
                {queryInput && (
                  <button
                    type="button"
                    onClick={() => setQueryInput('')}
                    aria-label={dict.memory.clearSearch}
                    className={cn(
                      'absolute right-2 top-1/2 -translate-y-1/2 inline-flex size-6 items-center justify-center',
                      'rounded-md text-subtle transition-colors hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <span className="hidden text-xs tabular-nums text-subtle sm:inline">
                {memoriesLoading
                  ? ''
                  : activeQuery
                    ? format(dict.memory.searchResultCount, { count: memories.length })
                    : countLabel(totalCount, dict.memory.totalCountOne, dict.memory.totalCountOther)}
              </span>
            </div>

            {/* Body */}
            <div className="mt-6">
              {!configured ? (
                <NotConfiguredCard message={dict.memory.notConfigured} />
              ) : error ? (
                <div className="rounded-lg border border-[color:var(--negative)]/40 bg-[color:var(--negative)]/8 p-4 text-sm">
                  {dict.memory.errorLoading}
                </div>
              ) : memoriesLoading && memories.length === 0 ? (
                <SkeletonList />
              ) : memories.length === 0 ? (
                <EmptyState
                  message={
                    activeQuery
                      ? format(dict.memory.emptySearch, { query: activeQuery })
                      : dict.memory.empty
                  }
                />
              ) : (
                <ul className="space-y-3">
                  {memories.map((m) => (
                    <MemoryCardRow
                      key={m.id}
                      memory={m}
                      confirming={confirmingId === m.id}
                      onAskForget={() => setConfirmingId(m.id)}
                      onCancelForget={() => setConfirmingId(null)}
                      onConfirmForget={() => onForget(m.id)}
                      forgetLabel={dict.memory.forget}
                      confirmText={dict.memory.forgetConfirm}
                      confirmYes={dict.memory.forgetConfirmYes}
                      confirmNo={dict.memory.forgetConfirmNo}
                      savedLabel={dict.memory.createdAt}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function countLabel(n: number, singular: string, plural: string): string {
  return n === 1 ? format(singular, { count: n }) : format(plural, { count: n });
}

function SkeletonList() {
  return (
    <ul className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="h-24 animate-pulse-soft rounded-lg border border-border bg-muted" />
      ))}
    </ul>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <BrainCircuit className="mx-auto size-6 text-subtle" />
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function NotConfiguredCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--warning)]/40 bg-[color:var(--warning)]/8 p-4 text-sm">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--warning)]">
        MemoryLake
      </p>
      <p className="mt-2 text-foreground">{message}</p>
    </div>
  );
}

interface MemoryCardRowProps {
  memory: MemoryRecord;
  confirming: boolean;
  onAskForget: () => void;
  onConfirmForget: () => void;
  onCancelForget: () => void;
  forgetLabel: string;
  confirmText: string;
  confirmYes: string;
  confirmNo: string;
  savedLabel: string;
}

function MemoryCardRow({
  memory,
  confirming,
  onAskForget,
  onConfirmForget,
  onCancelForget,
  forgetLabel,
  confirmText,
  confirmYes,
  confirmNo,
  savedLabel,
}: MemoryCardRowProps) {
  const fileTag =
    (memory.metadata as Record<string, unknown> | null)?.file as string | undefined;
  const kindTag =
    (memory.metadata as Record<string, unknown> | null)?.kind as string | undefined;
  const tag = fileTag ?? kindTag;
  const saved = memory.created_at ? new Date(memory.created_at) : null;

  return (
    <li className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-border-strong">
      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
        {memory.content}
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
          {tag && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5">
              {tag}
            </span>
          )}
          {saved && (
            <span className="tabular-nums normal-case tracking-normal">
              {savedLabel} · {formatRelative(saved)}
            </span>
          )}
        </div>

        {confirming ? (
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="font-mono text-[11px] text-[color:var(--negative)]">
              {confirmText}
            </span>
            <button
              type="button"
              onClick={onConfirmForget}
              aria-label={confirmYes}
              title={confirmYes}
              className={cn(
                'inline-flex size-7 items-center justify-center rounded-md',
                'bg-[color:var(--negative)] text-[color:var(--destructive-foreground)] transition-opacity hover:opacity-90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <Check className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={onCancelForget}
              aria-label={confirmNo}
              title={confirmNo}
              className={cn(
                'inline-flex size-7 items-center justify-center rounded-md',
                'border border-border bg-card text-foreground transition-colors hover:bg-muted',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAskForget}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all',
              'text-muted-foreground opacity-60 hover:opacity-100 group-hover:opacity-100',
              'hover:bg-[color:var(--negative)]/10 hover:text-[color:var(--negative)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:opacity-100',
            )}
          >
            <Trash2 className="size-3.5" />
            {forgetLabel}
          </button>
        )}
      </div>
    </li>
  );
}

function formatRelative(d: Date): string {
  const diff = Date.now() - d.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return 'now';
  if (diff < hour) return `${Math.floor(diff / minute)}m`;
  if (diff < day) return `${Math.floor(diff / hour)}h`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d`;
  const yyyy = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${m}-${dd}`;
}
