import { NextResponse, type NextRequest } from 'next/server';
import { isLocale } from '../../../../lib/i18n/locales';
import { DIMENSION_KEYS } from '../../../../lib/indicators/labels';
import { stockPageLang } from '../../../../lib/stocks/copy';
import { getNarrative } from '../../../../lib/stocks/narrative';
import { resolveStock } from '../../../../lib/stocks/resolve';
import { getStockSnapshot, getStockSnapshots, type StockSnapshot } from '../../../../lib/stocks/snapshot';
import { STOCKS, relatedStocks } from '../../../../lib/stocks/universe';

/**
 * GET /api/stocks/view?locale=zh-CN             → { snapshots }  (the /stocks index)
 * GET /api/stocks/view?slug=nvda&locale=zh-CN   → StockDetailData  (one /stocks/[slug] page)
 *
 * The data behind the public /stocks pages as JSON, for clients that
 * render StocksIndexView / StockDetailView themselves (the desktop app).
 * Reads the same caches as the pages — 3 h price snapshots, 24 h AI read,
 * cached symbol resolution — so it never costs more provider calls than
 * the pages do. The data is public, like the pages.
 *
 * Snapshots shown only as cards (index, related) are trimmed to what
 * StockCard draws. `stock.slug` is canonical; clients should switch to it
 * when it differs from the slug they asked for.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CACHE = { 'cache-control': 'private, max-age=300' };
/** StockCard's sparkline length. */
const CARD_BARS = 30;

function forCard(s: StockSnapshot | null): StockSnapshot | null {
  if (!s) return null;
  const dims = { ...s.dims };
  for (const k of DIMENSION_KEYS) dims[k] = { bucket: s.dims[k].bucket, bucketTrend: [], latestExtras: {} };
  return { ...s, prices: s.prices.slice(-CARD_BARS), dailyChanges: [], dims };
}

function cardMap(m: Map<string, StockSnapshot | null>): Record<string, StockSnapshot | null> {
  return Object.fromEntries([...m].map(([t, s]) => [t, forCard(s)]));
}

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const localeParam = url.searchParams.get('locale') ?? 'en';
  const lang = stockPageLang(isLocale(localeParam) ? localeParam : 'en');
  const slug = url.searchParams.get('slug')?.trim().toLowerCase();

  if (!slug) {
    const snapshots = await getStockSnapshots(STOCKS.map((s) => s.ticker));
    return NextResponse.json({ snapshots: cardMap(snapshots) }, { headers: CACHE });
  }
  if (!/^[a-z0-9][a-z0-9.\-]{0,31}$/.test(slug)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  let stock: Awaited<ReturnType<typeof resolveStock>>;
  try {
    stock = await resolveStock(slug);
  } catch {
    // Symbol feeds down: retryable, unlike a real miss.
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
  if (!stock) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const related = relatedStocks(stock);
  const [snapshot, relatedSnapshots] = await Promise.all([
    getStockSnapshot(stock.ticker),
    getStockSnapshots(related.map((s) => s.ticker)),
  ]);
  const narrative = snapshot ? await getNarrative(snapshot, stock, lang) : null;
  return NextResponse.json(
    { stock, snapshot, narrative, related, relatedSnapshots: cardMap(relatedSnapshots) },
    { headers: CACHE },
  );
}
