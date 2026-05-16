import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../lib/auth/session';
import {
  forgetMemory,
  isMemoryLakeConfigured,
  listMemories,
  searchMemories,
  type MemoryRecord,
} from '../../../lib/memorylake-client';

/**
 * Memory management endpoints.
 *
 * GET /api/memory?q=…&page=…&size=…
 *   - When `q` is omitted: paginated list of all memories for the current user.
 *   - When `q` is set:     semantic search (top_k = size, threshold = 0).
 *
 * DELETE /api/memory?id=mem-…
 *   - Forgets a single memory. We re-validate user ownership by listing the
 *     user's memories first and rejecting if the id isn't theirs.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest): Promise<Response> {
  const requestId = crypto.randomUUID();
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
    }
    if (!isMemoryLakeConfigured()) {
      return NextResponse.json({
        items: [],
        total: 0,
        page: 1,
        size: 20,
        totalPages: 1,
        configured: false,
      });
    }

    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.trim() ?? '';
    const page = Number.parseInt(url.searchParams.get('page') ?? '1', 10) || 1;
    const size = Number.parseInt(url.searchParams.get('size') ?? '20', 10) || 20;

    let items: MemoryRecord[];
    let total: number;
    let totalPages: number;
    if (q) {
      // Semantic search ignores pagination — top_k results.
      items = await searchMemories({ userId: user.id, query: q, topK: size });
      total = items.length;
      totalPages = 1;
    } else {
      const result = await listMemories({ userId: user.id, page, size, expired: false });
      items = result.items;
      total = result.total;
      totalPages = result.totalPages;
    }

    return NextResponse.json({
      items,
      total,
      page,
      size,
      totalPages,
      configured: true,
      query: q || null,
    });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/memory',
        requestId,
        msg: 'list_failed',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<Response> {
  const requestId = crypto.randomUUID();
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
    }
    if (!isMemoryLakeConfigured()) {
      return NextResponse.json({ error: 'memorylake_not_configured' }, { status: 503 });
    }

    const id = new URL(request.url).searchParams.get('id')?.trim();
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

    // Cross-user guard: walk the user's memories until we either match the
    // id or determine it doesn't belong to them. The MemoryLake `/forget`
    // endpoint itself doesn't enforce ownership server-side from our key's
    // perspective — we're a project-level admin — so we have to gate here.
    // To avoid pulling 100 memories on every delete, we do a 1-page check
    // with a generous size; users with >100 memories will need pagination
    // refinement later.
    const page = await listMemories({ userId: user.id, page: 1, size: 100, expired: false });
    const owned = page.items.some((m) => m.id === id);
    if (!owned) {
      // Try with expired included — forget on an already-expired memory is harmless
      // but ensures the cross-user check is sound.
      const fullPage = await listMemories({ userId: user.id, page: 1, size: 100 });
      if (!fullPage.items.some((m) => m.id === id)) {
        console.warn(
          JSON.stringify({
            level: 'warn',
            route: '/api/memory',
            requestId,
            userId: user.id,
            memoryId: id,
            msg: 'forget_denied_not_owned',
          }),
        );
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      }
    }

    await forgetMemory(id);
    console.log(
      JSON.stringify({
        level: 'info',
        route: '/api/memory',
        requestId,
        userId: user.id,
        memoryId: id,
        msg: 'memory_forgotten',
      }),
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/memory',
        requestId,
        msg: 'forget_failed',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
