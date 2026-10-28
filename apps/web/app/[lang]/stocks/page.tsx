import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeBcp47, localeOg, type Locale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getDictionary } from '../dictionaries';
import { Breadcrumbs } from '../../../components/blog/breadcrumbs';
import { SiteHeader } from '../../../components/marketing/site-header';
import { SiteFooter } from '../../../components/marketing/site-footer';
import { CornerMarks } from '../../../components/marketing/blueprint';
import { StockCard } from '../../../components/stocks/stock-card';
import { getStockCopy, stockPageLang, STOCK_PAGE_LOCALES } from '../../../lib/stocks/copy';
import { getStockSnapshots } from '../../../lib/stocks/snapshot';
import { STOCKS, STOCK_MARKETS, displaySymbol, stockName } from '../../../lib/stocks/universe';

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
  const labelLang = lang === 'en' ? 'en' : 'zh';
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

      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 pt-8 lg:border-x lg:px-8">
          <CornerMarks />
          <Breadcrumbs
            ariaLabel="Breadcrumb"
            items={[{ label: dict.nav?.home ?? 'Home', href: '/' }, { label: copy.breadcrumb }]}
          />
          <div className="pb-12 pt-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{copy.index.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
              {copy.index.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {copy.index.sub}
            </p>
          </div>
        </div>
      </section>

      {STOCK_MARKETS.map((market) => (
        <section key={market} className="border-b border-border">
          <div className="relative mx-auto max-w-6xl border-border px-5 py-12 lg:border-x lg:px-8">
            <CornerMarks />
            <h2 className="font-serif text-2xl font-semibold tracking-tight">{copy.market[market]}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STOCKS.filter((s) => s.market === market).map((s) => (
                <StockCard
                  key={s.slug}
                  stock={s}
                  snapshot={snapshots.get(s.ticker) ?? null}
                  lang={lang}
                  locale={locale}
                  copy={copy}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 py-10 lg:border-x lg:px-8">
          <CornerMarks />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{copy.disclaimerTitle}.</span> {copy.disclaimer}
          </p>
        </div>
      </section>

      <SiteFooter lang={locale} dict={dict} />
    </div>
  );
}
