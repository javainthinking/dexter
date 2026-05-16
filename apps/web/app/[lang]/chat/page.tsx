'use client';

import * as React from 'react';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Menu, RotateCcw } from 'lucide-react';
import { Sidebar, type SessionSummary } from '../../../components/chat/sidebar';
import { Composer } from '../../../components/chat/composer';
import { EmptyState } from '../../../components/chat/empty-state';
import {
  AssistantMessage,
  UserMessage,
  type ChatTurn,
} from '../../../components/chat/message';
import type { ToolCardEvent, ToolStatus } from '../../../components/chat/tool-card';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { ThemeToggle } from '../../../components/theme-toggle';
import { Logo } from '../../../components/logo';
import { LanguageSwitcher } from '../../../components/i18n/language-switcher';
import { UserMenu } from '../../../components/auth/user-menu';
import {
  useDictionary,
  useLocale,
  format,
} from '../../../components/i18n/dictionary-provider';
import { cn } from '../../../lib/utils';

export default function ChatRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ChatPage />
    </Suspense>
  );
}

function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = useDictionary();
  const _locale = useLocale();
  const promptFromUrl = searchParams.get('prompt') ?? '';

  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const refreshSessions = useCallback(async () => {
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

  // Map persisted WebChatTurn rows into the client-side ChatTurn shape used
  // by the thread. Historical turns have no tool-call records (we don't
  // persist tool events yet) and are always considered 'done' for status.
  const hydrateFromRecord = useCallback(
    (record: { turns: Array<{ turnIndex: number; query: string; answer: string | null }> } | null) => {
      if (!record) {
        setTurns([]);
        return;
      }
      setTurns(
        record.turns.map((t) => ({
          id: `turn-${t.turnIndex}`,
          question: t.query,
          answer: t.answer ?? '',
          status: 'done' as const,
          tools: [],
        })),
      );
    },
    [],
  );

  useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  // On first mount, hydrate the thread from the session referenced by the
  // dexter_session cookie. Without this, refreshing /chat would always
  // show an empty thread even though the conversation lives in Postgres.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/sessions/current', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as {
          session: { turns: Array<{ turnIndex: number; query: string; answer: string | null }> } | null;
        };
        if (!cancelled) hydrateFromRecord(data.session);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrateFromRecord]);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [turns]);

  const send = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || pending) return;
      setInput('');
      setPending(true);

      const turnId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : String(Date.now());

      setTurns((prev) => [
        ...prev,
        {
          id: turnId,
          question: q,
          answer: '',
          status: 'streaming',
          statusLabel: dict.chat.message.status.thinking,
          tools: [],
        },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`agent_failed_${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const records = buf.split('\n\n');
          buf = records.pop() ?? '';
          for (const record of records) {
            if (record.trim()) applyRecord(turnId, record, setTurns, dict);
          }
        }

        setTurns((prev) =>
          prev.map((t) =>
            t.id === turnId ? { ...t, status: 'done' as const, statusLabel: undefined } : t,
          ),
        );
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setTurns((prev) =>
            prev.map((t) =>
              t.id === turnId
                ? { ...t, status: 'interrupted' as const, statusLabel: undefined }
                : t,
            ),
          );
        } else {
          const message = err instanceof Error ? err.message : String(err);
          setTurns((prev) =>
            prev.map((t) =>
              t.id === turnId
                ? {
                    ...t,
                    status: 'error' as const,
                    statusLabel: undefined,
                    errorMessage: message,
                  }
                : t,
            ),
          );
        }
      } finally {
        abortRef.current = null;
        setPending(false);
        void refreshSessions();
      }
    },
    [pending, refreshSessions, dict],
  );

  const consumed = useRef(false);
  useEffect(() => {
    if (consumed.current) return;
    if (!promptFromUrl) return;
    consumed.current = true;
    setInput('');
    void send(promptFromUrl);
    // strip ?prompt off so refresh doesn't resend
    router.replace(window.location.pathname);
  }, [promptFromUrl, router, send]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const newConversation = useCallback(async () => {
    abortRef.current?.abort();
    setTurns([]);
    try {
      await fetch('/api/sessions', { method: 'POST' });
    } catch {
      /* ignore */
    }
    void refreshSessions();
  }, [refreshSessions]);

  const switchSession = useCallback(
    async (sessionId: string) => {
      abortRef.current?.abort();
      try {
        const res = await fetch('/api/sessions/switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            session: {
              turns: Array<{ turnIndex: number; query: string; answer: string | null }>;
            } | null;
          };
          hydrateFromRecord(data.session);
          void refreshSessions();
          setSidebarOpen(false);
        }
      } catch {
        /* ignore */
      }
    },
    [hydrateFromRecord, refreshSessions],
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      const wasCurrent = sessions.find((s) => s.sessionId === sessionId)?.isCurrent ?? false;
      try {
        await fetch(`/api/sessions?id=${encodeURIComponent(sessionId)}`, {
          method: 'DELETE',
        });
      } catch {
        /* ignore — refresh below will reflect server state regardless */
      }
      if (wasCurrent) {
        // Server's ON DELETE CASCADE wiped the row; clear the local thread.
        // The next /api/agent call will mint a fresh session under this user.
        abortRef.current?.abort();
        setTurns([]);
      }
      void refreshSessions();
    },
    [sessions, refreshSessions],
  );

  const empty = turns.length === 0 && !pending;
  const turnCountLabel =
    turns.length === 0
      ? dict.chat.header.ready
      : turns.length === 1
        ? format(dict.chat.header.turnsOne, { count: turns.length })
        : format(dict.chat.header.turnsOther, { count: turns.length });

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          sessions={sessions}
          loading={sessionsLoading}
          onNew={newConversation}
          onSwitch={switchSession}
          onDelete={deleteSession}
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
                void newConversation();
                setSidebarOpen(false);
              }}
              onSwitch={switchSession}
              onDelete={deleteSession}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-3 md:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(true)}
              aria-label={dict.chat.header.openSidebar}
            >
              <Menu className="size-4" />
            </Button>
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={newConversation}
              aria-label={dict.chat.header.newConversation}
            >
              <RotateCcw className="size-4" />
            </Button>
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <header className="hidden h-14 shrink-0 items-center justify-between border-b border-border px-5 md:flex">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
              {dict.chat.header.workbench}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">{turnCountLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={newConversation}>
              <RotateCcw className="size-3.5" />
              {dict.chat.header.reset}
            </Button>
          </div>
        </header>

        <div
          ref={threadRef}
          className={cn(
            'flex-1 overflow-y-auto',
            empty && 'flex items-center justify-center',
          )}
        >
          {empty ? (
            <EmptyState onPick={(p) => void send(p)} />
          ) : (
            <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
              <div className="space-y-7">
                {turns.map((turn, idx) => (
                  <div key={turn.id} className="space-y-4">
                    <UserMessage text={turn.question} />
                    <AssistantMessage turn={turn} />
                    {idx < turns.length - 1 && <Separator className="my-7" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-background px-3 pb-4 pt-3 sm:px-6">
          <div className="mx-auto w-full max-w-3xl">
            <Composer
              value={input}
              onChange={setInput}
              onSubmit={() => void send(input)}
              onStop={stop}
              pending={pending}
            />
            <p className="mt-2 text-center font-mono text-[10px] tracking-[0.14em] text-subtle">
              {dict.chat.composer.footer}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function applyRecord(
  turnId: string,
  record: string,
  setTurns: React.Dispatch<React.SetStateAction<ChatTurn[]>>,
  dict: ReturnType<typeof useDictionary>,
): void {
  const lines = record.split('\n');
  let eventType = 'message';
  let dataLine = '';
  for (const line of lines) {
    if (line.startsWith('event:')) eventType = line.slice(6).trim();
    else if (line.startsWith('data:')) dataLine += line.slice(5).trim();
  }
  if (!dataLine) return;
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(dataLine) as Record<string, unknown>;
  } catch {
    return;
  }
  setTurns((prev) =>
    prev.map((t) => (t.id === turnId ? reduceEvent(t, eventType, payload, dict) : t)),
  );
}

function reduceEvent(
  turn: ChatTurn,
  type: string,
  payload: Record<string, unknown>,
  dict: ReturnType<typeof useDictionary>,
): ChatTurn {
  const s = dict.chat.message.status;
  switch (type) {
    case 'thinking':
      return { ...turn, statusLabel: s.thinking };
    case 'tool_start': {
      const id = (payload.toolCallId as string) ?? `tool-${Date.now()}`;
      const tool = (payload.tool as string) ?? 'tool';
      const args = payload.args as Record<string, unknown> | undefined;
      const card: ToolCardEvent = { id, tool, status: 'running', args };
      return {
        ...turn,
        statusLabel: format(s.runningTool, { tool }),
        tools: [...turn.tools, card],
      };
    }
    case 'tool_progress': {
      const tool = payload.tool as string | undefined;
      const message = payload.message as string | undefined;
      return {
        ...turn,
        tools: turn.tools.map((t) =>
          t.tool === tool && t.status === 'running'
            ? { ...t, progressMessage: message }
            : t,
        ),
      };
    }
    case 'tool_end': {
      const id = (payload.toolCallId as string) ?? '';
      const result = payload.result as string | undefined;
      const duration = payload.duration as number | undefined;
      return {
        ...turn,
        statusLabel: s.thinking,
        tools: turn.tools.map((t) =>
          t.id === id
            ? {
                ...t,
                status: 'done' as ToolStatus,
                result,
                durationMs: duration,
                progressMessage: undefined,
              }
            : t,
        ),
      };
    }
    case 'tool_error': {
      const id = (payload.toolCallId as string) ?? '';
      const errorMessage = (payload.error as string) ?? (payload.message as string);
      return {
        ...turn,
        tools: turn.tools.map((t) =>
          t.id === id ? { ...t, status: 'error' as ToolStatus, errorMessage } : t,
        ),
      };
    }
    case 'stream_progress': {
      const mode = payload.mode as string | undefined;
      if (!mode) return turn;
      const labelMap: Record<string, string> = {
        requesting: s.thinking,
        thinking: s.thinking,
        responding: s.writingAnswer,
        'tool-input': s.planningTool,
        'tool-use': s.callingTool,
      };
      return { ...turn, statusLabel: labelMap[mode] ?? mode };
    }
    case 'done': {
      const answer = (payload.answer as string) ?? '';
      return { ...turn, answer, status: 'done', statusLabel: undefined };
    }
    case 'error': {
      const message = (payload.message as string) ?? 'Unknown error';
      return {
        ...turn,
        status: 'error',
        statusLabel: undefined,
        errorMessage: message,
      };
    }
    default:
      return turn;
  }
}
