/**
 * Agent worker — runs in an Electron utilityProcess, never in main.
 *
 * Hosts OpenCode in-process (@opencode/sdk) configured as a finance-only
 * agent:
 *   - LLM: the pickskill.ai gateway (OpenAI-compatible) authenticated with the
 *     desktop session token; no provider keys on the machine.
 *   - Tools: the server's finance catalog, registered dynamically; each call
 *     proxies to /api/desktop/finance/<tool>. Every built-in coding tool
 *     (shell, edit, write, read, glob, …) is denied by permission rules.
 *   - Skills: dexter's SKILL.md files, mounted from the app bundle.
 *   - Isolation: all OpenCode global paths, and the "home" it scans for
 *     ~/.claude / ~/.agents, are redirected into the app's data dir.
 *
 * Talks to main over process.parentPort with the WorkerRequest/WorkerMessage
 * contract in src/shared/ipc.ts.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import type { AgentEvent, WorkerMessage, WorkerRequest } from '../shared/ipc';

const port = process.parentPort;
const post = (msg: WorkerMessage) => port.postMessage(msg);
const emit = (event: AgentEvent) => post({ type: 'event', event });

const MODEL_ALIAS = 'analyst-default';

// Placeholder: the production prompt is generated from src/agent/prompts.ts
// so web and desktop answer with the same voice and rules.
const ANALYST_SYSTEM = [
  'You are PickSkill Analyst, an AI research agent for equities across US, HK and A-share markets.',
  'Use the finance tools for every number you report; cite the tool data, never guess prices or financials.',
  'When a question matches a skill (for example a DCF valuation), load that skill first and follow it.',
  'Be concise. Use markdown tables for multi-period or multi-ticker comparisons.',
].join('\n');

interface CatalogTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

type Host = Awaited<ReturnType<typeof import('@opencode/sdk').OpenCode.create>>;

let host: Host | null = null;
let workspace = '';

async function init(req: Extract<WorkerRequest, { type: 'init' }>): Promise<void> {
  const root = path.join(req.dataDir, 'agent');
  for (const [key, sub] of [
    ['XDG_CONFIG_HOME', 'config'],
    ['XDG_DATA_HOME', 'data'],
    ['XDG_CACHE_HOME', 'cache'],
    ['XDG_STATE_HOME', 'state'],
  ] as const) process.env[key] = path.join(root, sub);
  process.env.OPENCODE_TEST_HOME = path.join(root, 'home');
  process.env.OPENCODE_DISABLE_MODELS_FETCH = '1';
  process.env.OPENCODE_DISABLE_AUTOUPDATE = '1';

  const configDir = path.join(root, 'profile');
  workspace = path.join(root, 'workspace');
  await fs.rm(path.join(configDir, 'skills'), { recursive: true, force: true });
  await fs.mkdir(configDir, { recursive: true });
  await fs.mkdir(workspace, { recursive: true });
  await fs.cp(req.skillsDir, path.join(configDir, 'skills'), { recursive: true });

  const auth = { authorization: `Bearer ${req.token}` };
  const catalogRes = await fetch(new URL('/api/desktop/finance/catalog', req.apiBase), { headers: auth });
  if (!catalogRes.ok) throw new Error(`finance catalog: HTTP ${catalogRes.status}`);
  const { tools: catalog } = (await catalogRes.json()) as { tools: CatalogTool[] };

  // Import only after the env redirect above: OpenCode resolves its global
  // paths at module load.
  const { OpenCode } = await import('@opencode/sdk');
  const { Plugin } = await import('@opencode/plugin');

  const financePlugin = Plugin.define({
    id: 'pickskill.finance',
    setup: async (ctx) => {
      await ctx.tool.transform((tools) => {
        for (const t of catalog) {
          tools.add({
            name: t.name,
            options: { codemode: false },
            description: t.description,
            input: t.inputSchema,
            execute: async (input, toolCtx) => {
              const res = await fetch(new URL(`/api/desktop/finance/${t.name}`, req.apiBase), {
                method: 'POST',
                headers: { ...auth, 'content-type': 'application/json' },
                body: JSON.stringify(input),
                signal: toolCtx.signal,
              });
              const body = (await res.json().catch(() => ({}))) as { content?: string; message?: string; error?: string };
              const content = res.ok ? (body.content ?? '') : `Error: ${body.message ?? body.error ?? `HTTP ${res.status}`}`;
              // No output schema → the result must not carry an `output` key at all.
              return { content: content || '(empty result)' };
            },
          });
        }
      });
    },
  });

  const allow = (action: string) => ({ action, resource: '*', effect: 'allow' as const });
  const config = {
    model: `pickskill/${MODEL_ALIAS}`,
    default_agent: 'analyst',
    update: 'disable',
    share: 'disabled',
    snapshots: false,
    providers: {
      pickskill: {
        name: 'PickSkill',
        package: '@opencode/ai/providers/openai-compatible',
        settings: { baseURL: new URL('/api/desktop/llm/v1', req.apiBase).toString(), apiKey: req.token },
        models: { [MODEL_ALIAS]: { name: 'PickSkill Analyst' } },
      },
    },
    agents: {
      analyst: {
        mode: 'primary',
        description: 'Financial research analyst',
        system: ANALYST_SYSTEM,
        permissions: [
          { action: '*', resource: '*', effect: 'deny' as const },
          allow('skill'),
          ...catalog.map((t) => allow(t.name)),
        ],
      },
    },
  };

  host = await OpenCode.create({
    app: { name: 'pickskill-desktop' },
    database: { path: path.join(root, 'data', 'sessions.db') },
    config: { directory: configDir, project: false, content: JSON.stringify(config) },
    models: { fetch: false },
    fs: { filewatcher: false },
    plugins: [financePlugin],
  });
  void pumpEvents(host);
  emit({ type: 'ready', tools: catalog.map((t) => t.name) });
}

async function pumpEvents(h: Host): Promise<void> {
  const toolNames = new Map<string, string>();
  for await (const ev of h.events.subscribe()) {
    const e = ev as { type: string; data?: Record<string, any> };
    const d = e.data ?? {};
    switch (e.type) {
      case 'session.text.delta':
        emit({ type: 'text', sessionID: d.sessionID, delta: d.delta });
        break;
      case 'session.tool.input.started':
        toolNames.set(d.id, d.name);
        break;
      case 'session.tool.called':
        emit({ type: 'tool', sessionID: d.sessionID, name: toolNames.get(d.id) ?? 'tool', status: 'called', detail: JSON.stringify(d.input) });
        break;
      case 'session.tool.success':
        emit({ type: 'tool', sessionID: d.sessionID, name: toolNames.get(d.id) ?? 'tool', status: 'success' });
        break;
      case 'session.tool.failed':
        emit({ type: 'tool', sessionID: d.sessionID, name: toolNames.get(d.id) ?? 'tool', status: 'error', detail: d.error?.message });
        break;
      case 'session.execution.succeeded':
        emit({ type: 'done', sessionID: d.sessionID, ok: true });
        break;
      case 'session.execution.failed':
        emit({ type: 'done', sessionID: d.sessionID, ok: false, error: d.error?.message });
        break;
      case 'session.execution.interrupted':
        emit({ type: 'done', sessionID: d.sessionID, ok: false, error: `interrupted (${d.reason})` });
        break;
    }
  }
}

async function prompt(req: Extract<WorkerRequest, { type: 'prompt' }>): Promise<void> {
  if (!host) throw new Error('agent not initialised');
  const sessionID = req.sessionID ?? (await host.sessions.create({ location: { directory: workspace } })).id;
  post({ type: 'prompt-accepted', requestID: req.requestID, sessionID });
  await host.sessions.prompt({ sessionID, text: req.text });
}

port.on('message', async ({ data }: { data: WorkerRequest }) => {
  try {
    switch (data.type) {
      case 'init':
        await init(data);
        break;
      case 'prompt':
        await prompt(data).catch((err: unknown) =>
          post({ type: 'prompt-failed', requestID: data.requestID, message: err instanceof Error ? err.message : String(err) }),
        );
        break;
      case 'abort':
        await host?.sessions.interrupt({ sessionID: data.sessionID });
        break;
      case 'shutdown':
        await host?.close();
        process.exit(0);
    }
  } catch (err) {
    emit({ type: 'error', message: err instanceof Error ? err.message : String(err) });
  }
});
