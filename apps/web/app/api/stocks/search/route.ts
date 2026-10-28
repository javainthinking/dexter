import { NextResponse, type NextRequest } from 'next/server';
import { stockPageLang } from '../../../../lib/stocks/copy';
import { searchStockPages } from '../../../../lib/stocks/resolve';
import { stockName } from '../../../../lib/stocks/universe';
import { isLocale } from '../../../../lib/i18n/locales';

export const runtime = 'nodejs';

/**
 * GET /api/stocks/search?q=<query>&lang=<locale>
 *
 * Public counterpart of /api/portfolios/symbols/search for the
 * login-free stock pages. Only returns tickers that map to a /stocks
 * slug; results are cached per query server-side and at the CDN.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const locale = url.searchParams.get('lang') ?? 'en';
  const lang = stockPageLang(isLocale(locale) ? locale : 'en');
  if (!q) return NextResponse.json({ results: [] });
  const results = await searchStockPages(q, (s) => stockName(s, lang));
  return NextResponse.json(
    { results },
    { headers: { 'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
