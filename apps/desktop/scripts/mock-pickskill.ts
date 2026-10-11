/**
 * Local stand-in for pickskill.ai's desktop endpoints, for developing the
 * desktop app without the production DB. Run from apps/desktop:
 *
 *   bun scripts/mock-pickskill.ts            # :4319
 *   PICKSKILL_API_BASE=http://127.0.0.1:4319 pnpm dev
 *
 * - Email-code sign-in (/api/auth/email/send + /api/desktop/email/verify)
 *   accepts any email with code 123456 and signs in a fixed demo user.
 * - The finance catalog + tool execution use dexter's real tools
 *   (src/tools/finance), so schemas and results match production; without
 *   data-provider keys they fall back to Yahoo.
 * - The LLM endpoint proxies to OpenAI when OPENAI_API_KEY is set, otherwise
 *   plays a scripted turn: call get_stock_price(NVDA), then summarise.
 */
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import {
  getStockPrice,
  getStockPrices,
  getIncomeStatements,
  getKeyRatios,
  getMarketMovers,
} from '../../../src/tools/finance/index.js';

const PORT = Number(process.env.PORT ?? 4319);
const TOOLS = [getStockPrice, getStockPrices, getIncomeStatements, getKeyRatios, getMarketMovers];
const USER = { id: 'demo-user', name: 'Demo User', email: 'demo@pickskill.local', image: null };

const MOCK_CODE = '123456';
const tokens = new Set<string>();

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const portfolios = [
  {
    id: 'pf-ai',
    name: 'AI Leaders',
    description: null,
    holdingsCount: 3,
    holdings: [
      { id: 'h1', ticker: 'NVDA', displayName: 'NVIDIA', exchange: 'NASDAQ', weight: 40 },
      { id: 'h2', ticker: 'MSFT', displayName: 'Microsoft', exchange: 'NASDAQ', weight: 35 },
      { id: 'h3', ticker: 'TSM', displayName: 'TSMC', exchange: 'NYSE', weight: 25 },
    ],
  },
];

function authed(req: Request): boolean {
  const m = req.headers.get('authorization')?.match(/^Bearer (\S+)$/);
  return !!m && tokens.has(m[1]);
}

async function scriptedCompletion(body: { messages: { role: string; content: unknown }[]; model: string }) {
  const toolMsg = [...body.messages].reverse().find((m) => m.role === 'tool');
  const chunk = (delta: unknown, finish: string | null = null) =>
    `data: ${JSON.stringify({ id: 'mock', object: 'chat.completion.chunk', created: 0, model: body.model, choices: [{ index: 0, delta, finish_reason: finish }] })}\n\n`;
  let out = '';
  if (!toolMsg) {
    out += chunk({
      role: 'assistant',
      tool_calls: [{ index: 0, id: 'call_1', type: 'function', function: { name: 'get_stock_price', arguments: '{"ticker":"NVDA"}' } }],
    });
    out += chunk({}, 'tool_calls');
  } else {
    const content = typeof toolMsg.content === 'string' ? toolMsg.content : JSON.stringify(toolMsg.content);
    out += chunk({ role: 'assistant', content: `(scripted mock LLM) Here is the NVDA snapshot from get_stock_price:\n\n${content.slice(0, 600)}` });
    out += chunk({}, 'stop');
  }
  out += 'data: [DONE]\n\n';
  return new Response(out, { headers: { 'content-type': 'text/event-stream' } });
}

Bun.serve({
  port: PORT,
  hostname: '127.0.0.1',
  idleTimeout: 120,
  async fetch(req) {
    const url = new URL(req.url);
    const p = url.pathname;
    console.log(req.method, p);

    // In-app email-code sign-in. Any email works; the code is always MOCK_CODE
    // and is echoed back as `devCode` like the real server does outside production.
    if (p === '/api/auth/email/send' && req.method === 'POST') {
      return json({ ok: true, expiresInSeconds: 600, devCode: MOCK_CODE });
    }
    if (p === '/api/desktop/email/verify' && req.method === 'POST') {
      const { code } = (await req.json().catch(() => ({}))) as { code?: string };
      if (code !== MOCK_CODE) return json({ error: 'invalid_code', message: 'That code is not valid for this email.' }, 400);
      const token = randomBytes(32).toString('hex');
      tokens.add(token);
      return json({ token, expires: new Date(Date.now() + 90 * 864e5).toISOString(), userId: USER.id });
    }
    if (p === '/api/desktop/token' && req.method === 'DELETE') {
      tokens.delete(req.headers.get('authorization')?.slice(7) ?? '');
      return new Response(null, { status: 204 });
    }

    if (!authed(req)) return json({ error: 'unauthenticated' }, 401);

    if (p === '/api/desktop/me') return json({ user: USER, plan: 'pro' });
    if (p === '/api/portfolios') return json({ portfolios: portfolios.map(({ holdings: _h, ...rest }) => rest) });
    const pf = p.match(/^\/api\/portfolios\/([^/]+)(\/quotes)?$/);
    if (pf) {
      const portfolio = portfolios.find((x) => x.id === pf[1]);
      if (!portfolio) return json({ error: 'not_found' }, 404);
      if (!pf[2]) return json({ portfolio });
      const quotes = await Promise.all(
        portfolio.holdings.map(async (h) => {
          try {
            const raw = JSON.parse((await getStockPrice.invoke({ ticker: h.ticker })) as string);
            const snap = raw.data ?? raw;
            const close = snap.price ?? snap.close ?? null;
            const change = snap.day_change ?? null;
            const changePct = snap.day_change_percent ?? null;
            return { ticker: h.ticker, close, change, changePct };
          } catch (err) {
            return { ticker: h.ticker, error: String(err) };
          }
        }),
      );
      return json({ quotes });
    }

    if (p === '/api/desktop/finance/catalog') {
      return json({
        tools: TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: z.toJSONSchema(t.schema as z.ZodType) })),
      });
    }
    const ft = p.match(/^\/api\/desktop\/finance\/([a-zA-Z0-9_]+)$/);
    if (ft && req.method === 'POST') {
      const tool = TOOLS.find((t) => t.name === ft[1]);
      if (!tool) return json({ error: 'unknown_tool' }, 404);
      try {
        const content = await tool.invoke((await req.json()) as Record<string, unknown>);
        return json({ content: typeof content === 'string' ? content : JSON.stringify(content) });
      } catch (err) {
        return json({ error: 'tool_failed', message: err instanceof Error ? err.message : String(err) }, 422);
      }
    }

    if (p === '/api/desktop/llm/v1/chat/completions') {
      const body = await req.json();
      if (!process.env.OPENAI_API_KEY) return scriptedCompletion(body);
      const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ ...body, model: process.env.DESKTOP_LLM_MODEL ?? 'gpt-5.5' }),
      });
      return new Response(upstream.body, { status: upstream.status, headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' } });
    }

    return json({ error: 'not_found' }, 404);
  },
});
console.log(`mock pickskill on http://127.0.0.1:${PORT}`);
