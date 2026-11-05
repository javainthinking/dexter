import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { isLocale, localeBcp47, localeOg, type Locale } from '../../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../../lib/i18n/paths';
import { getDictionary } from '../../dictionaries';
import { Breadcrumbs } from '../../../../components/blog/breadcrumbs';
import { SiteHeader } from '../../../../components/marketing/site-header';
import { SiteFooter } from '../../../../components/marketing/site-footer';
import {
  INDICATOR_REFERENCES,
  StockDetailView,
  stockDetailModel,
} from '../../../../components/stocks/stock-detail-view';
import { DIMENSION_KEYS } from '../../../../lib/indicators/labels';
import { getStockCopy, stockPageLang, STOCK_PAGE_LOCALES } from '../../../../lib/stocks/copy';
import { getNarrative } from '../../../../lib/stocks/narrative';
import { getStockSnapshot, getStockSnapshots, latestTally } from '../../../../lib/stocks/snapshot';
import { resolveStock } from '../../../../lib/stocks/resolve';
import { displaySymbol, relatedStocks, stockName } from '../../../../lib/stocks/universe';

const SITE_URL = 'https://pickskill.ai';
const ORG_ID = `${SITE_URL}/#organization`;

// Pages render on first request and are then served from the ISR cache;
// the price snapshot underneath has its own (longer) data-cache window,
// so a page regeneration only re-reads cached data — it never fans out
// to the price providers by itself.
export const revalidate = 3600;

export function generateStaticParams(): Array<{ slug: string }> {
  return [];
}

function pageUrl(slug: string, locale: Locale): string {
  const path = getLocalizedPath(`/stocks/${slug}`, locale);
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

/** hreflang only for the languages the page is actually written in. */
function alternates(slug: string, locale: Locale): NonNullable<Metadata['alternates']> {
  const lang = stockPageLang(locale);
  const languages: Record<string, string> = {};
  for (const l of STOCK_PAGE_LOCALES) languages[localeBcp47[l]] = pageUrl(slug, l);
  languages['x-default'] = pageUrl(slug, 'en');
  return { canonical: pageUrl(slug, lang), languages };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: locale, slug } = await params;
  const stock = isLocale(locale) ? await resolveStock(slug) : null;
  if (!isLocale(locale) || !stock) return {};
  const lang = stockPageLang(locale);
  const copy = getStockCopy(lang);
  const snapshot = await getStockSnapshot(stock.ticker);
  const vars = { name: stockName(stock, lang), symbol: displaySymbol(stock) };
  const tally = snapshot ? latestTally(snapshot) : null;
  const title = copy.metaTitle(vars);
  const description = copy.metaDescription({
    ...vars,
    asOf: snapshot?.asOf ?? '—',
    tally: tally ? copy.tally(tally.bullish, tally.bearish, tally.neutral) : '—',
  });
  const url = pageUrl(stock.slug, lang);
  const image = `${SITE_URL}/api/og/stocks/${stock.slug}`;
  return {
    title,
    description,
    alternates: alternates(stock.slug, locale),
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PickSkill',
      locale: localeOg[locale],
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  // Curated tickers resolve instantly; any other US / HK / A-share ticker
  // is looked up once and its page generated on this first request.
  const stock = await resolveStock(slug);
  if (!stock) notFound();
  if (stock.slug !== slug) permanentRedirect(getLocalizedPath(`/stocks/${stock.slug}`, locale));

  const dict = await getDictionary(locale);
  const related = relatedStocks(stock);

  const [snapshot, relatedSnapshots] = await Promise.all([
    getStockSnapshot(stock.ticker),
    getStockSnapshots(related.map((s) => s.ticker)),
  ]);
  const { lang, copy, symbol, name, vars, faq, answer } = stockDetailModel(locale, stock, snapshot);
  const narrative = snapshot ? await getNarrative(snapshot, stock, lang) : null;
  const url = pageUrl(stock.slug, lang);
  const indexHref = getLocalizedPath('/stocks', locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'PickSkill',
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'PickSkill',
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: copy.metaTitle(vars),
        inLanguage: localeBcp47[lang],
        isPartOf: { '@id': `${SITE_URL}/#website` },
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        ...(snapshot
          ? {
              dateModified: snapshot.fetchedAt,
              isBasedOn: snapshot.source.url,
              citation: [snapshot.source.url, ...DIMENSION_KEYS.map((k) => INDICATOR_REFERENCES[k].url)],
            }
          : {}),
        about: {
          '@type': 'Corporation',
          name: stock.name.en,
          alternateName: stock.name.zh,
          tickerSymbol: `${stock.exchange}:${symbol}`,
        },
        ...(answer ? { abstract: answer } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: dict.nav?.home ?? 'Home', item: `${SITE_URL}${getLocalizedPath('/', locale)}`.replace(/\/$/, '') },
          { '@type': 'ListItem', position: 2, name: copy.breadcrumb, item: `${SITE_URL}${indexHref}` },
          { '@type': 'ListItem', position: 3, name: `${name} (${symbol})`, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader lang={locale} />

      <StockDetailView
        locale={locale}
        url={url}
        data={{ stock, snapshot, narrative, related, relatedSnapshots: Object.fromEntries(relatedSnapshots) }}
        metricLabels={{
          latest: dict.indicators?.metrics?.latest ?? 'Last',
          change: dict.indicators?.metrics?.change ?? 'Chg %',
          fiveDayChange: dict.indicators?.metrics?.fiveDayChange ?? '5D %',
        }}
        breadcrumbs={
          <Breadcrumbs
            ariaLabel="Breadcrumb"
            items={[
              { label: dict.nav?.home ?? 'Home', href: '/' },
              { label: copy.breadcrumb, href: '/stocks' },
              { label: symbol },
            ]}
          />
        }
      />

      <SiteFooter lang={locale} dict={dict} />
    </div>
  );
}
