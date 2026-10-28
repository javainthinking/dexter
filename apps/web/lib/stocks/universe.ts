/**
 * The tickers that get a public, login-free /stocks/[slug] page.
 *
 * Deliberately a short hand-picked list while the pages are an
 * experiment: every entry costs one cached price fetch per revalidate
 * window, and only listed slugs resolve (anything else 404s), so the
 * pages can't be used as an open proxy onto the data providers.
 *
 * Slugs are the ticker lowercased with the exchange as a suffix in the
 * form people actually type: `nvda`, `0700-hk`, `600519-sh`, `300750-sz`.
 * `ticker` is the Yahoo-style symbol the price chain understands.
 */

export type StockMarket = 'us' | 'hk' | 'cn';

export type StockSector =
  | 'semis'
  | 'internet'
  | 'ev'
  | 'hardware'
  | 'software'
  | 'finance'
  | 'consumer'
  | 'crypto'
  | 'materials';

export interface StockEntry {
  slug: string;
  ticker: string;
  market: StockMarket;
  exchange: string;
  sector: StockSector;
  /** `zhTW` only where the Traditional form differs from `zh`. */
  name: { en: string; zh: string; zhTW?: string };
}

export const STOCKS: StockEntry[] = [
  // ── US ──
  { slug: 'nvda', ticker: 'NVDA', market: 'us', exchange: 'NASDAQ', sector: 'semis', name: { en: 'NVIDIA', zh: '英伟达', zhTW: '輝達' } },
  { slug: 'aapl', ticker: 'AAPL', market: 'us', exchange: 'NASDAQ', sector: 'hardware', name: { en: 'Apple', zh: '苹果', zhTW: '蘋果' } },
  { slug: 'msft', ticker: 'MSFT', market: 'us', exchange: 'NASDAQ', sector: 'software', name: { en: 'Microsoft', zh: '微软', zhTW: '微軟' } },
  { slug: 'tsla', ticker: 'TSLA', market: 'us', exchange: 'NASDAQ', sector: 'ev', name: { en: 'Tesla', zh: '特斯拉' } },
  { slug: 'amzn', ticker: 'AMZN', market: 'us', exchange: 'NASDAQ', sector: 'internet', name: { en: 'Amazon', zh: '亚马逊', zhTW: '亞馬遜' } },
  { slug: 'googl', ticker: 'GOOGL', market: 'us', exchange: 'NASDAQ', sector: 'internet', name: { en: 'Alphabet', zh: '谷歌' } },
  { slug: 'meta', ticker: 'META', market: 'us', exchange: 'NASDAQ', sector: 'internet', name: { en: 'Meta Platforms', zh: 'Meta' } },
  { slug: 'amd', ticker: 'AMD', market: 'us', exchange: 'NASDAQ', sector: 'semis', name: { en: 'AMD', zh: '超威半导体', zhTW: '超微半導體' } },
  { slug: 'pltr', ticker: 'PLTR', market: 'us', exchange: 'NASDAQ', sector: 'software', name: { en: 'Palantir', zh: 'Palantir' } },
  { slug: 'mstr', ticker: 'MSTR', market: 'us', exchange: 'NASDAQ', sector: 'crypto', name: { en: 'Strategy', zh: 'Strategy' } },
  // ── Hong Kong ──
  { slug: '0700-hk', ticker: '0700.HK', market: 'hk', exchange: 'HKEX', sector: 'internet', name: { en: 'Tencent', zh: '腾讯控股', zhTW: '騰訊控股' } },
  { slug: '9988-hk', ticker: '9988.HK', market: 'hk', exchange: 'HKEX', sector: 'internet', name: { en: 'Alibaba', zh: '阿里巴巴' } },
  { slug: '3690-hk', ticker: '3690.HK', market: 'hk', exchange: 'HKEX', sector: 'internet', name: { en: 'Meituan', zh: '美团', zhTW: '美團' } },
  { slug: '1810-hk', ticker: '1810.HK', market: 'hk', exchange: 'HKEX', sector: 'hardware', name: { en: 'Xiaomi', zh: '小米集团', zhTW: '小米集團' } },
  { slug: '1211-hk', ticker: '1211.HK', market: 'hk', exchange: 'HKEX', sector: 'ev', name: { en: 'BYD (H)', zh: '比亚迪股份', zhTW: '比亞迪股份' } },
  { slug: '0981-hk', ticker: '0981.HK', market: 'hk', exchange: 'HKEX', sector: 'semis', name: { en: 'SMIC (H)', zh: '中芯国际', zhTW: '中芯國際' } },
  { slug: '9618-hk', ticker: '9618.HK', market: 'hk', exchange: 'HKEX', sector: 'internet', name: { en: 'JD.com', zh: '京东集团', zhTW: '京東集團' } },
  { slug: '0388-hk', ticker: '0388.HK', market: 'hk', exchange: 'HKEX', sector: 'finance', name: { en: 'HKEX', zh: '香港交易所' } },
  // ── China A-shares ──
  { slug: '600519-sh', ticker: '600519.SS', market: 'cn', exchange: 'SSE', sector: 'consumer', name: { en: 'Kweichow Moutai', zh: '贵州茅台', zhTW: '貴州茅台' } },
  { slug: '300750-sz', ticker: '300750.SZ', market: 'cn', exchange: 'SZSE', sector: 'ev', name: { en: 'CATL', zh: '宁德时代', zhTW: '寧德時代' } },
  { slug: '002594-sz', ticker: '002594.SZ', market: 'cn', exchange: 'SZSE', sector: 'ev', name: { en: 'BYD (A)', zh: '比亚迪', zhTW: '比亞迪' } },
  { slug: '601318-sh', ticker: '601318.SS', market: 'cn', exchange: 'SSE', sector: 'finance', name: { en: 'Ping An Insurance', zh: '中国平安', zhTW: '中國平安' } },
  { slug: '600036-sh', ticker: '600036.SS', market: 'cn', exchange: 'SSE', sector: 'finance', name: { en: 'China Merchants Bank', zh: '招商银行', zhTW: '招商銀行' } },
  { slug: '000858-sz', ticker: '000858.SZ', market: 'cn', exchange: 'SZSE', sector: 'consumer', name: { en: 'Wuliangye', zh: '五粮液', zhTW: '五糧液' } },
  { slug: '688981-sh', ticker: '688981.SS', market: 'cn', exchange: 'SSE', sector: 'semis', name: { en: 'SMIC (A)', zh: '中芯国际', zhTW: '中芯國際' } },
  { slug: '601899-sh', ticker: '601899.SS', market: 'cn', exchange: 'SSE', sector: 'materials', name: { en: 'Zijin Mining', zh: '紫金矿业', zhTW: '紫金礦業' } },
];

/** Company name in the page language. */
export function stockName(stock: StockEntry, lang: 'en' | 'zh-CN' | 'zh-TW'): string {
  if (lang === 'en') return stock.name.en;
  return lang === 'zh-TW' ? stock.name.zhTW ?? stock.name.zh : stock.name.zh;
}

export const STOCK_MARKETS: StockMarket[] = ['us', 'hk', 'cn'];

const BY_SLUG = new Map(STOCKS.map((s) => [s.slug, s]));

export function getStockBySlug(slug: string): StockEntry | null {
  return BY_SLUG.get(slug.toLowerCase()) ?? null;
}

/**
 * Display symbol: A-share codes are shown bare (600519) with the
 * exchange alongside, HK codes keep their suffix, US tickers as-is.
 */
export function displaySymbol(stock: StockEntry): string {
  if (stock.market === 'cn') return stock.ticker.split('.')[0];
  return stock.ticker;
}

/**
 * Related pages: same sector first (across markets, so BYD A links to
 * BYD H and Tesla), then the rest of the same market. Deterministic, so
 * the internal link graph is stable between renders.
 */
export function relatedStocks(stock: StockEntry, limit = 6): StockEntry[] {
  const others = STOCKS.filter((s) => s.slug !== stock.slug);
  const sameSector = others.filter((s) => s.sector === stock.sector);
  const sameMarket = others.filter((s) => s.market === stock.market && s.sector !== stock.sector);
  const rest = others.filter((s) => s.sector !== stock.sector && s.market !== stock.market);
  return [...sameSector, ...sameMarket, ...rest].slice(0, limit);
}
