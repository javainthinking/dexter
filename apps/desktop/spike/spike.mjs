// POC spike: run OpenCode in-process with a finance-only agent, a custom
// tool, dexter's SKILL.md skills, and an OpenAI-compatible "pickskill"
// gateway provider. Run: node spike/spike.mjs   (or under Electron utilityProcess)
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startMockGateway } from './mock-gateway.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../..');

// Isolation: every opencode global path (config/data/cache/state) and the
// "home" used to discover ~/.claude and ~/.agents point into an app-owned dir.
const appHome = process.env.SPIKE_HOME ?? (await fs.mkdtemp(path.join(os.tmpdir(), 'pickskill-agent-')));
for (const [k, sub] of [
  ['XDG_CONFIG_HOME', 'config'],
  ['XDG_DATA_HOME', 'data'],
  ['XDG_CACHE_HOME', 'cache'],
  ['XDG_STATE_HOME', 'state'],
]) process.env[k] = path.join(appHome, sub);
process.env.OPENCODE_TEST_HOME = path.join(appHome, 'home');
process.env.OPENCODE_DISABLE_MODELS_FETCH = '1';
process.env.OPENCODE_DISABLE_AUTOUPDATE = '1';

// Agent config dir: mirrors dexter's builtin skills.
const configDir = path.join(appHome, 'agent');
await fs.mkdir(path.join(configDir, 'skills'), { recursive: true });
await fs.cp(path.join(repoRoot, 'src/skills/dcf'), path.join(configDir, 'skills/dcf'), { recursive: true });
const workspace = path.join(appHome, 'workspace');
await fs.mkdir(workspace, { recursive: true });

const TOKEN = 'desktop-token-test';
const gw = await startMockGateway({ token: TOKEN });

const { OpenCode } = await import('@opencode/sdk');
const { Plugin } = await import('@opencode/plugin');
const { Schema } = await import('effect');

const toolCalls = [];
const financePlugin = Plugin.define({
  id: 'pickskill.finance',
  setup: async (ctx) => {
    await ctx.tool.transform((tools) => {
      tools.add({
        name: 'get_stock_price',
        options: { codemode: false },
        description: 'Fetch the latest price snapshot for an equity ticker.',
        input: Schema.Struct({ ticker: Schema.String }),
        output: Schema.Struct({ ticker: Schema.String, close: Schema.Number }),
        execute: async ({ ticker }) => {
          toolCalls.push(ticker);
          // Real build: GET https://pickskill.ai/api/desktop/finance/... with the desktop Bearer token.
          const output = { ticker, close: 123.45 };
          return { output, content: JSON.stringify(output) };
        },
      });
    });
  },
});

const ANALYST_SYSTEM = 'You are PickSkill Analyst, a financial research agent. [dexter system prompt goes here]';
const config = {
  model: 'pickskill/analyst-default',
  default_agent: 'analyst',
  update: 'disable',
  share: 'disabled',
  snapshots: false,
  providers: {
    pickskill: {
      name: 'PickSkill',
      package: '@opencode/ai/providers/openai-compatible',
      settings: { baseURL: `http://127.0.0.1:${gw.port}/api/desktop/llm/v1`, apiKey: TOKEN },
      models: { 'analyst-default': { name: 'PickSkill Analyst' } },
    },
  },
  agents: {
    analyst: {
      mode: 'primary',
      description: 'Financial research analyst',
      system: ANALYST_SYSTEM,
      permissions: [
        { action: '*', resource: '*', effect: 'deny' },
        { action: 'get_stock_price', resource: '*', effect: 'allow' },
        { action: 'skill', resource: '*', effect: 'allow' },
      ],
    },
  },
};

const t0 = Date.now();
const opencode = await OpenCode.create({
  database: { path: path.join(appHome, 'data', 'sessions.db') },
  config: { directory: configDir, project: false, content: JSON.stringify(config) },
  models: { fetch: false },
  fs: { filewatcher: false },
  plugins: [financePlugin],
  log: { level: 'warn', emit: (e) => console.error('[opencode]', e.level, e.message, e.attributes ?? '', e.cause ?? '') },
});
const tCreate = Date.now() - t0;

const session = await opencode.sessions.create({ location: { directory: workspace } });
const controller = new AbortController();
const seen = [];
const done = (async () => {
  for await (const ev of opencode.events.subscribe({ signal: controller.signal })) {
    seen.push(ev.type);
    if (process.env.SPIKE_VERBOSE) console.log('event', ev.type, JSON.stringify(ev).slice(0, 300));
    if (ev.type === 'session.execution.succeeded' || ev.type === 'session.execution.failed') return;
  }
})().catch(() => {});

const t1 = Date.now();
await opencode.sessions.prompt({ sessionID: session.id, text: 'What is NVDA trading at?' });
await Promise.race([done, new Promise((r) => setTimeout(r, 30_000))]);
const tPrompt = Date.now() - t1;
controller.abort();

const isTitle = (r) => JSON.stringify(r.messages?.[0] ?? '').includes('title generator');
const first = gw.requests.find((r) => !isTitle(r));
const titleRequests = gw.requests.filter(isTitle).length;
const toolNames = (first?.tools ?? []).map((t) => t.function?.name);
const systemText = (first?.messages ?? []).filter((m) => m.role === 'system').map((m) => (typeof m.content === 'string' ? m.content : JSON.stringify(m.content))).join('\n');
const result = {
  runtime: process.versions.electron ? `electron ${process.versions.electron} / node ${process.versions.node}` : `node ${process.versions.node}`,
  createMs: tCreate,
  promptMs: tPrompt,
  gatewayRequests: gw.requests.length,
  titleRequests,
  toolsExposedToModel: toolNames,
  toolExecutions: toolCalls,
  systemPromptReplaced: systemText.startsWith(ANALYST_SYSTEM),
  systemPromptHead: systemText.slice(0, 160),
  mentionsDcfSkill: JSON.stringify(first ?? {}).includes('dcf'),
  leakedClaudeSkills: /gstack|office-hours/.test(JSON.stringify(first ?? {})),
  eventTypes: [...new Set(seen)],
};
console.log(JSON.stringify(result, null, 2));
await opencode.close();
gw.server.close();
process.parentPort?.postMessage(result);
process.exit(0);
