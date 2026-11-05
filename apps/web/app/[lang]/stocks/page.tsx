import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeBcp47, localeOg, type Locale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getDictionary } from '../dictionaries';
import { Breadcrumbs } from '../../../components/blog/breadcrumbs';
import { SiteHeader } from '../../../components/marketing/site-header';
import { SiteFooter } from '../../../components/marketing/site-footer';
import { StocksIndexView } from '../../../components/stocks/stocks-index-view';
import { getStockCopy, stockPageLang, STOCK_PAGE_LOCALES } from '../../../lib/stocks/copy';
import { getStockSnapshots } from '../../../lib/stocks/snapshot';
import { STOCKS, displaySymbol, stockName } from '../../../lib/stocks/universe';

const SITE_URL = 'https://pickskill.ai';

export const revalidate = 3600;

function indexUrl(locale: Locale): string {
  return `${SITE_URL}${getLocalizedPath('/stocks', locale)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: locale } = await params;
  if (!isLocale(locale)) return {};
  const lang = stockPageLang(locale);
  const copy = getStockCopy(lang);
  const languages: Record<string, string> = {};
  for (const l of STOCK_PAGE_LOCALES) languages[localeBcp47[l]] = indexUrl(l);
  languages['x-default'] = indexUrl('en');
  return {
    title: copy.index.metaTitle,
    description: copy.index.metaDescription,
    alternates: { canonical: indexUrl(lang), languages },
    openGraph: {
      title: copy.index.metaTitle,
      description: copy.index.metaDescription,
      url: indexUrl(lang),
      siteName: 'PickSkill',
      locale: localeOg[locale],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: copy.index.metaTitle, description: copy.index.metaDescription },
  };
}

export default async function StocksIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = stockPageLang(locale);
  const copy = getStockCopy(lang);
  const dict = await getDictionary(locale);
  const snapshots = await getStockSnapshots(STOCKS.map((s) => s.ticker));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: indexUrl(lang),
    name: copy.index.metaTitle,
    description: copy.index.metaDescription,
    inLanguage: localeBcp47[lang],
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: STOCKS.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${stockName(s, lang)} (${displaySymbol(s)})`,
        url: `${SITE_URL}${getLocalizedPath(`/stocks/${s.slug}`, lang)}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader lang={locale} />

      <StocksIndexView
        locale={locale}
        snapshots={Object.fromEntries(snapshots)}
        breadcrumbs={
          <Breadcrumbs
            ariaLabel="Breadcrumb"
            items={[{ label: dict.nav?.home ?? 'Home', href: '/' }, { label: copy.breadcrumb }]}
          />
        }
      />

      <SiteFooter lang={locale} dict={dict} />
    </div>
  );
}
