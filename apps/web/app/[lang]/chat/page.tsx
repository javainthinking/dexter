'use client';

import * as React from 'react';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar, type SessionSummary } from '../../../components/chat/sidebar';
import { Composer, type ComposerHandle } from '../../../components/chat/composer';
import { DesignStylePanel } from '../../../components/chat/design-style-panel';
import { EmptyState } from '../../../components/chat/empty-state';
import { composeDesignReference } from '../../../lib/design-styles';
import {
  AssistantMessage,
  UserMessage,
  type ChatTurn,
  type TurnDeliverable,
} from '../../../components/chat/message';
import type { ToolCardEvent, ToolStatus } from '../../../components/chat/tool-card';
import { Separator } from '../../../components/ui/separator';
import { LanguageSwitcher } from '../../../components/i18n/language-switcher';
import { ThemeToggle } from '../../../components/theme-toggle';
import { UserMenu } from '../../../components/auth/user-menu';
import { AppNav } from '../../../components/nav/app-nav';
import { TopBar } from '../../../components/nav/top-bar';
import {
  useDictionary,
  useLocale,
  format,
} from '../../../components/i18n/dictionary-provider';
import { cn } from '../../../lib/utils';
import { readAndClearChatSeed } from '../../../lib/chat-seed';

// Shape of a persisted session as returned by /api/sessions/current and
// /api/sessions/switch. Deliverables arrive already re-signed (download
// URL + expiry) by the server from the stored R2 keys.
interface PersistedTurn {
  turnIndex: number;
  query: string;
  answer: string | null;
  deliverables?: TurnDeliverable[];
}
interface PersistedSession {
  turns: PersistedTurn[];
}

export default function ChatRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ChatPage />
    </Suspense>
  );
}

function ChatPage() {
  const searchParams = useSearchParams();
  const dict = useDictionary();
  const _locale = useLocale();
  // Capture the deep-link prompt once on mount via a ref. We DON'T want
  // this to be reactive: after we strip ?prompt= from the URL,
  // useSearchParams() will re-render with an empty value, which used to
  // re-trigger the hydration effect and clobber the optimistic
  // streaming turn that send() just added.
  // Two ways to land here with a pre-filled composer:
  //   1. ?prompt= URL param — used by the homepage "try this" cards
  //      (short, marketing-friendly seeds).
  //   2. sessionStorage seed — used by the /indicators export buttons
  //      (multi-KB JSON payloads that don't survive URL transport).
  // We capture both ONCE on mount via a ref so subsequent re-renders
  // (search-params change, etc.) don't replay the seed. URL param
  // takes precedence if both are somehow present.
  const initialPromptRef = useRef<string>(
    (() => {
      const urlPrompt = searchParams.get('prompt') ?? '';
      if (urlPrompt) return urlPrompt;
      // readAndClearChatSeed has its own typeof window guard and is
      // safe to call here in a 'use client' component.
      return readAndClearChatSeed() ?? '';
    })(),
  );
  const hasDeepLinkPrompt = initialPromptRef.current !== '';

  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<ComposerHandle>(null);
  const [designPanelOpen, setDesignPanelOpen] = useState(false);

  // Picking a brand from the design-style panel: append a "please
  // reference this design style: <url>" line to the current composer
  // value (or use it as the entire content if the composer is empty)
  // and close the panel. Replaces nothing — purely additive — because
  // a design reference is something you tack onto an in-progress
  // request, not a request on its own.
  const handlePickDesign = useCallback(
    (brand: Parameters<NonNullable<React.ComponentProps<typeof DesignStylePanel>['onPickBrand']>>[0]) => {
      const prefix =
        dict.chat?.design?.promptPrefix ?? 'Please reference this design style:';
      const nextValue = composeDesignReference(input, prefix, brand);
      composerRef.current?.loadPrompt(nextValue);
      setDesignPanelOpen(false);
    },
    [input, dict],
  );

  // Load a sample-question prompt into the composer (textarea value +
  // focus + cursor-at-end) without sending. Used by both:
  //   - the in-chat empty-state when a user clicks a sample card
  //   - the deep-link consume effect when ?prompt= arrives from the homepage
  // Falls back to setInput when the composer hasn't mounted yet (e.g.
  // first-mount deep-link consume runs before the empty-state renders).
  const loadIntoComposer = useCallback((text: string) => {
    if (composerRef.current) {
      composerRef.current.loadPrompt(text);
    } else {
      setInput(text);
    }
  }, []);

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
  // Deliverables carry presigned download URLs the server re-minted from
  // the stored R2 keys, so reopened conversations show working chips.
  const hydrateFromRecord = useCallback((record: PersistedSession | null) => {
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
        deliverables: t.deliverables ?? [],
      })),
    );
  }, []);

  useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  // On first mount, hydrate the thread from the session referenced by the
  // dexter_session cookie. Without this, refreshing /chat would always
  // show an empty thread even though the conversation lives in Postgres.
  //
  // Skip when ?prompt= was present in the initial URL. The deep-link
  // path populates the composer with the sample question and leaves
  // the user a fresh thread to send into — hydrating would attach the
  // sample question as a follow-up to whatever old conversation lives
  // in the session, which is not what "try this on the homepage" means.
  // hasDeepLinkPrompt is a ref-derived boolean — it's stable across
  // renders, so this effect only runs once.
  useEffect(() => {
    if (hasDeepLinkPrompt) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/sessions/current', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { session: PersistedSession | null };
        if (!cancelled) hydrateFromRecord(data.session);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrateFromRecord, hasDeepLinkPrompt]);

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
        // The initial POST starts chunk 0. If the agent hits the
        // 300 s function-time budget on Vercel, it yields a
        // `continuation_required` event carrying a jobId. We then loop:
        // POST /api/agent/resume with that jobId and keep streaming
        // into the same chat turn until either `done` arrives or the
        // user aborts. From the user's POV one logical "turn" can span
        // many function invocations seamlessly.
        let res = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
          signal: controller.signal,
        });
        while (true) {
          if (!res.ok || !res.body) {
            throw new Error(`agent_failed_${res.status}`);
          }
          const result = await streamSseInto(
            res.body,
            turnId,
            setTurns,
            dict,
          );
          if (!result.continueWith) break;
          res = await fetch('/api/agent/resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobId: result.continueWith.jobId }),
            signal: controller.signal,
          });
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
    if (!hasDeepLinkPrompt) return;
    consumed.current = true;
    // Deep-link from a "try this" sample card on the homepage:
    // populate the composer textarea with the prompt and let the user
    // hit Send when they're ready. Do NOT auto-submit — clicking a
    // homepage example should feel like loading a question into the
    // input box, not committing a turn the user didn't explicitly send.
    //
    // URL is stripped via plain history.replaceState — NOT router.replace
    // — to avoid Suspense re-suspending the page.
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
    loadIntoComposer(initialPromptRef.current);
  }, [hasDeepLinkPrompt, loadIntoComposer]);

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
          const data = (await res.json()) as { session: PersistedSession | null };
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
        <TopBar
          className="md:hidden"
          onOpenSidebar={() => setSidebarOpen(true)}
          showLogo
        />

        <header className="hidden h-14 shrink-0 items-center justify-between border-b border-border px-5 md:flex">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
              {dict.chat.header.workbench}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">{turnCountLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <AppNav />
            <Separator orientation="vertical" className="h-4" />
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
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
            <EmptyState onPick={loadIntoComposer} />
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
              ref={composerRef}
              value={input}
              onChange={setInput}
              onSubmit={() => void send(input)}
              onStop={stop}
              pending={pending}
              onOpenDesignStyle={() => setDesignPanelOpen(true)}
            />
            <p className="mt-2 text-center font-mono text-[10px] tracking-[0.14em] text-subtle">
              {dict.chat.composer.footer}
            </p>
          </div>
        </div>
      </main>
      <DesignStylePanel
        open={designPanelOpen}
        onOpenChange={setDesignPanelOpen}
        onPickBrand={handlePickDesign}
      />
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

/**
 * Parse just the `event:` line from an SSE record without doing full
 * JSON parsing on `data:`. Used by the streaming loop to detect
 * `continuation_required` without paying for the JSON parse twice (once
 * here, once inside applyRecord).
 */
function peekSseEventType(record: string): string | null {
  for (const line of record.split('\n')) {
    if (line.startsWith('event:')) return line.slice(6).trim();
  }
  return null;
}

function peekSseData(record: string): Record<string, unknown> | null {
  let dataLine = '';
  for (const line of record.split('\n')) {
    if (line.startsWith('data:')) dataLine += line.slice(5).trim();
  }
  if (!dataLine) return null;
  try {
    return JSON.parse(dataLine) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Pump SSE events from `body` into `setTurns` via applyRecord. Returns
 * a continuation handle if the stream ended on a
 * `continuation_required` event — the caller should immediately POST
 * /api/agent/resume with that jobId and call streamSseInto again on
 * the new response body to keep the turn flowing.
 *
 * Why this split (instead of a single recursive function): the fetch
 * lives in the caller (`send`) where it has access to the AbortController.
 * Splitting keeps signal-handling local and avoids needing to thread
 * it through here.
 */
async function streamSseInto(
  body: ReadableStream<Uint8Array>,
  turnId: string,
  setTurns: React.Dispatch<React.SetStateAction<ChatTurn[]>>,
  dict: ReturnType<typeof useDictionary>,
): Promise<{ continueWith?: { jobId: string } }> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let continueWith: { jobId: string } | undefined;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const records = buf.split('\n\n');
    buf = records.pop() ?? '';
    for (const record of records) {
      if (!record.trim()) continue;
      // Detect continuation BEFORE applyRecord forwards the event,
      // since we want to capture the jobId even if the reducer
      // doesn't have a case for it. The render side ignores
      // continuation_required (it shouldn't visibly affect the turn
      // — UX stays in the 'streaming' state through the resume hop).
      if (peekSseEventType(record) === 'continuation_required') {
        const payload = peekSseData(record);
        const jobId = typeof payload?.jobId === 'string' ? payload.jobId : null;
        if (jobId) continueWith = { jobId };
      }
      applyRecord(turnId, record, setTurns, dict);
    }
  }
  return continueWith ? { continueWith } : {};
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
      // Pick up R2 download URLs the agent loop uploaded at end-of-run.
      // Shape mirrors src/agent/types.ts#Deliverable; we filter for the
      // minimum fields the UI needs to render a download chip so a
      // mis-shaped payload doesn't crash the turn.
      const raw = Array.isArray(payload.deliverables) ? payload.deliverables : [];
      const deliverables = raw
        .map((d) => {
          if (!d || typeof d !== 'object') return null;
          const o = d as Record<string, unknown>;
          const filename = typeof o.filename === 'string' ? o.filename : '';
          const downloadUrl = typeof o.downloadUrl === 'string' ? o.downloadUrl : '';
          const expiresAt = typeof o.expiresAt === 'string' ? o.expiresAt : '';
          const key = typeof o.key === 'string' ? o.key : '';
          const byteLength = typeof o.byteLength === 'number' ? o.byteLength : 0;
          if (!filename || !downloadUrl) return null;
          return { filename, downloadUrl, expiresAt, byteLength, key };
        })
        .filter((d): d is NonNullable<typeof d> => d !== null);
      return { ...turn, answer, status: 'done', statusLabel: undefined, deliverables };
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
