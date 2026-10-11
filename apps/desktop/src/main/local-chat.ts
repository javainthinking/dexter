import { app } from 'electron';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { AgentEvent } from '../shared/ipc';
import type { AgentHost } from './agent-host';

/**
 * Serves web's chat API from this Mac so the shared chat UI
 * (apps/web/app/[lang]/chat/page.tsx) runs on the local OpenCode agent:
 *
 *   POST   /api/agent               SSE turn, same event vocabulary as the server agent
 *   GET    /api/sessions            conversation list (sidebar)
 *   POST   /api/sessions            start a new conversation
 *   GET    /api/sessions/current    turns of the current conversation
 *   POST   /api/sessions/switch     make another conversation current
 *   DELETE /api/sessions?id= | /api/sessions/:id
 *
 * Conversations are stored per user in userData; they never leave the
 * machine (the LLM calls themselves go through the PickSkill gateway).
 *
 * Each turn is admitted by the server first (POST /api/desktop/turns, the
 * same quota gate as web's /api/agent). A 402 is passed through as-is, so
 * web's chat page shows its usual upgrade prompt.
 */

interface Turn {
  turnIndex: number;
  query: string;
  answer: string | null;
}

interface Chat {
  sessionId: string;
  /** OpenCode session that carries this conversation's context. */
  agentSessionID?: string;
  turns: Turn[];
  updatedAt: number;
}

interface Store {
  currentId: string | null;
  chats: Chat[];
}

const TOOL_RESULT_MAX = 4000;

/** Server-side turn admission (see apps/web/app/api/desktop/turns). */
export interface TurnGate {
  /** Admits a turn, or returns the server's refusal (e.g. 402 quota_exceeded) to pass through. */
  start(agentSessionID?: string): Promise<{ turnId: string } | { refusal: Response }>;
  complete(turnId: string): Promise<void>;
}

export class LocalChat {
  private store: Store = { currentId: null, chats: [] };
  private loadedFor: string | null = null;
  private readonly listeners = new Set<(e: AgentEvent) => void>();

  constructor(
    private readonly agent: AgentHost,
    private readonly userId: () => string | null,
    private readonly turns: TurnGate,
  ) {}

  /** Fed every event from the agent worker. */
  onAgentEvent(event: AgentEvent): void {
    for (const l of this.listeners) l(event);
  }

  /** Returns a response for the chat routes, or null to let the request go to the server. */
  async handle(req: Request, url: URL): Promise<Response | null> {
    const p = url.pathname.replace(/\/$/, '');
    const m = req.method;
    if (p === '/api/agent' && m === 'POST') return this.turn(req);
    if (p === '/api/agent/resume') return Response.json({ error: 'not_supported' }, { status: 404 });
    if (!p.startsWith('/api/sessions')) return null;

    await this.load();
    if (p === '/api/sessions' && m === 'GET') return Response.json({ sessions: this.summaries() });
    if (p === '/api/sessions' && m === 'POST') {
      this.store.currentId = null;
      await this.save();
      return Response.json({ ok: true });
    }
    if (p === '/api/sessions' && m === 'DELETE') return this.remove(url.searchParams.get('id'));
    if (p === '/api/sessions/current' && m === 'GET') return Response.json({ session: this.persisted(this.current()) });
    if (p === '/api/sessions/switch' && m === 'POST') {
      const { sessionId } = (await req.json().catch(() => ({}))) as { sessionId?: string };
      const chat = this.store.chats.find((c) => c.sessionId === sessionId);
      if (!chat) return Response.json({ error: 'not_found' }, { status: 404 });
      this.store.currentId = chat.sessionId;
      await this.save();
      return Response.json({ session: this.persisted(chat) });
    }
    const one = /^\/api\/sessions\/([^/]+)$/.exec(p);
    if (one && m === 'DELETE') return this.remove(decodeURIComponent(one[1]));
    return Response.json({ error: 'not_found' }, { status: 404 });
  }

  private async turn(req: Request): Promise<Response> {
    const { query } = (await req.json().catch(() => ({}))) as { query?: string };
    if (typeof query !== 'string' || !query.trim()) return Response.json({ error: 'invalid_query' }, { status: 400 });
    await this.load();

    if (this.agent.status.state !== 'ready') {
      const message =
        this.agent.status.state === 'error' ? this.agent.status.message : 'The local agent is still starting. Try again in a moment.';
      return sseError(message);
    }

    let chat = this.current();
    const admitted = await this.turns.start(chat?.agentSessionID);
    if ('refusal' in admitted) return admitted.refusal;
    const { turnId } = admitted;
    const gate = this.turns;

    if (!chat) {
      chat = { sessionId: randomUUID(), turns: [], updatedAt: Date.now() };
      this.store.chats.unshift(chat);
      this.store.currentId = chat.sessionId;
    }
    const turn: Turn = { turnIndex: chat.turns.length, query, answer: null };
    chat.turns.push(turn);
    chat.updatedAt = Date.now();
    await this.save();

    const encoder = new TextEncoder();
    const agent = this.agent;
    const listeners = this.listeners;
    const persist = () => this.save();
    const target = chat;

    const stream = new ReadableStream<Uint8Array>({
      start: (controller) => {
        let closed = false;
        let answer = '';
        let sessionID: string | undefined;
        const started = new Map<string, number>();
        const send = (event: string, data: unknown) => {
          if (!closed) controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };
        const finish = () => {
          if (closed) return;
          closed = true;
          listeners.delete(listener);
          controller.close();
          void persist();
          void gate.complete(turnId).catch(() => {});
        };
        const listener = (e: AgentEvent) => {
          if (e.type === 'error') {
            send('error', { message: e.message });
            return finish();
          }
          if (e.type === 'ready' || e.sessionID !== sessionID) return;
          if (e.type === 'text') {
            if (!answer) send('stream_progress', { mode: 'responding' });
            answer += e.delta;
          } else if (e.type === 'tool') {
            if (e.status === 'called') {
              started.set(e.callID, Date.now());
              send('tool_start', { toolCallId: e.callID, tool: e.name, args: e.input });
            } else if (e.status === 'success') {
              const result = e.detail && e.detail.length > TOOL_RESULT_MAX ? `${e.detail.slice(0, TOOL_RESULT_MAX)}…` : e.detail;
              send('tool_end', { toolCallId: e.callID, tool: e.name, result, duration: Date.now() - (started.get(e.callID) ?? Date.now()) });
            } else {
              send('tool_error', { toolCallId: e.callID, tool: e.name, error: e.detail ?? 'Tool failed' });
            }
          } else if (e.type === 'done') {
            if (e.ok) {
              turn.answer = answer;
              send('done', { answer });
            } else {
              send('error', { message: e.error ?? 'The agent failed.' });
            }
            finish();
          }
        };

        listeners.add(listener);
        send('thinking', {});
        req.signal.addEventListener('abort', () => {
          if (sessionID) void agent.abort(sessionID);
          finish();
        });
        agent.prompt(query, target.agentSessionID).then(
          (id) => {
            sessionID = id;
            target.agentSessionID = id;
          },
          (err: unknown) => {
            send('error', { message: err instanceof Error ? err.message : String(err) });
            finish();
          },
        );
      },
    });
    return new Response(stream, { headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' } });
  }

  private async remove(id: string | null): Promise<Response> {
    this.store.chats = this.store.chats.filter((c) => c.sessionId !== id);
    if (this.store.currentId === id) this.store.currentId = null;
    await this.save();
    return Response.json({ ok: true });
  }

  private current(): Chat | undefined {
    return this.store.chats.find((c) => c.sessionId === this.store.currentId);
  }

  private persisted(chat: Chat | undefined) {
    return chat ? { turns: chat.turns.map((t) => ({ turnIndex: t.turnIndex, query: t.query, answer: t.answer })) } : null;
  }

  private summaries() {
    return [...this.store.chats]
      .filter((c) => c.turns.length > 0)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((c) => {
        const first = c.turns[0]?.query.trim() ?? '';
        return {
          sessionId: c.sessionId,
          title: first ? clip(first, 60) : 'New conversation',
          preview: clip(first, 120),
          turnCount: c.turns.length,
          updatedAt: c.updatedAt,
          isCurrent: c.sessionId === this.store.currentId,
        };
      });
  }

  private file(): string | null {
    const id = this.userId();
    return id ? path.join(app.getPath('userData'), 'chats', `${id.replace(/[^A-Za-z0-9-]/g, '')}.json`) : null;
  }

  private async load(): Promise<void> {
    const id = this.userId();
    if (id === this.loadedFor) return;
    this.loadedFor = id;
    this.store = { currentId: null, chats: [] };
    const file = this.file();
    if (!file) return;
    try {
      this.store = JSON.parse(await fs.readFile(file, 'utf8')) as Store;
    } catch {
      /* first run for this user */
    }
  }

  private async save(): Promise<void> {
    const file = this.file();
    if (!file) return;
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(this.store));
  }
}

/** A one-event SSE response: the chat page shows `error` events inline. */
function sseError(message: string): Response {
  const body = `event: error\ndata: ${JSON.stringify({ message })}\n\n`;
  return new Response(body, { headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' } });
}

function clip(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}
