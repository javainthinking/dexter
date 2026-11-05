import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth/session';
import { isLocale } from '../../../../lib/i18n/locales';
import { DIMENSION_KEYS, type DimensionKey } from '../../../../lib/indicators/labels';
import type {
  IndicatorCardDim,
  IndicatorCardResult,
} from '../../../../lib/stocks/indicator-card-types';
import { getStockCopy, stockPageLang } from '../../../../lib/stocks/copy';
import { resolveStock } from '../../../../lib/stocks/resolve';
import { getStockSnapshot, latestTally, toneOf } from '../../../../lib/stocks/snapshot';
import { displaySymbol, stockName, tickerToSlug } from '../../../../lib/stocks/universe';

/**
 * GET /api/stocks/indicator-cards?tickers=NVDA,0700.HK&locale=zh-CN
 *
 * Compact per-ticker indicator readings for the cards the chat embeds
 * when an answer ends with an ```indicators block. Reads the same cached
 * snapshot as the public /stocks pages (3 h data cache), so a card never
 * costs more than one provider request per ticker per window, and the
 * numbers match the page the card links to.
 *
 * Tickers are validated through resolveStock (symbol search for anything
 * off the curated list), so the endpoint can't be used as an open proxy
 * onto the price providers. Errors are reported per ticker.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_TICKERS = 4;
/** Price-curve length shipped to the client (~3 trading months). */
const CURVE_BARS = 60;

export async function GET(request: NextRequest): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const url = new URL(request.url);
  const localeParam = url.searchParams.get('locale') ?? 'en';
  const lang = stockPageLang(isLocale(localeParam) ? localeParam : 'en');
  const copy = getStockCopy(lang);
  const tickers = [
    ...new Set(
      (url.searchParams.get('tickers') ?? '')
        .split(',')
        .map((t) => t.trim().toUpperCase())
        .filter((t) => /^[A-Z0-9][A-Z0-9.\-]{0,14}$/.test(t)),
    ),
  ].slice(0, MAX_TICKERS);
  if (tickers.length === 0) {
    return NextResponse.json({ error: 'missing_tickers' }, { status: 400 });
  }

  const results = await Promise.all(
    tickers.map(async (ticker): Promise<IndicatorCardResult> => {
      const slug = tickerToSlug(ticker);
      if (!slug) return { ticker, slug: null, error: 'unsupported' };
      try {
        const stock = await resolveStock(slug);
        if (!stock) return { ticker, slug: null, error: 'not_found' };
        const snapshot = await getStockSnapshot(stock.ticker);
        if (!snapshot) return { ticker: stock.ticker, slug: stock.slug, error: 'unavailable' };
        const tally = latestTally(snapshot);
        const tone = toneOf(tally);
        const dims = {} as Record<DimensionKey, IndicatorCardDim>;
        for (const k of DIMENSION_KEYS) {
          dims[k] = {
            bucket: snapshot.dims[k].bucket,
            trail: snapshot.dims[k].bucketTrend.map((s) => s.bucket),
          };
        }
        return {
          ticker: stock.ticker,
          slug: stock.slug,
          symbol: displaySymbol(stock),
          name: stockName(stock, lang),
          asOf: snapshot.asOf,
          close: snapshot.close,
          changePct: snapshot.changePct,
          fiveDayChangePct: snapshot.fiveDayChangePct,
          closes: snapshot.prices.slice(-CURVE_BARS).map((p) => p.close),
          dims,
          tone,
          toneLabel: copy.tone[tone],
          tallyText: copy.tally(tally.bullish, tally.bearish, tally.neutral),
        };
      } catch (err) {
        console.error(
          JSON.stringify({
            level: 'error',
            route: '/api/stocks/indicator-cards',
            ticker,
            error: err instanceof Error ? err.message : String(err),
          }),
        );
        return { ticker, slug, error: 'unavailable' };
      }
    }),
  );

  return NextResponse.json(
    { results },
    { headers: { 'cache-control': 'private, max-age=300' } },
  );
}
