import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth/session';
import {
  getDesktopFinanceTool,
  listDesktopFinanceTools,
} from '../../../../../lib/desktop-finance-tools';

/**
 * GET  /api/desktop/finance/catalog → { tools: [{ name, description, inputSchema }] }
 * POST /api/desktop/finance/<tool>  body = tool input → { content }
 *
 * Data-provider keys stay server-side; the desktop agent proxies through
 * here with its bearer token. Input is validated by the tool's own zod
 * schema inside invoke().
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ tool: string }> },
): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { tool } = await context.params;
  if (tool !== 'catalog') return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ tools: listDesktopFinanceTools() });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ tool: string }> },
): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { tool: name } = await context.params;
  const tool = getDesktopFinanceTool(name);
  if (!tool) return NextResponse.json({ error: 'unknown_tool' }, { status: 404 });

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  try {
    const content = await tool.invoke(input as Record<string, unknown>);
    return NextResponse.json({ content: typeof content === 'string' ? content : JSON.stringify(content) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Schema failures and upstream "no data" are the model's to recover
    // from, so they come back as 422 with a readable message.
    return NextResponse.json({ error: 'tool_failed', message }, { status: 422 });
  }
}
