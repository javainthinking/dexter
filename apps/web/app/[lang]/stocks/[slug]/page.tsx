import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Bot, FileText, LineChart, ShieldAlert, Sparkles } from 'lucide-react';
import { isLocale, localeBcp47, localeOg, type Locale } from '../../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../../lib/i18n/paths';
import { getDictionary } from '../../dictionaries';
import { Button } from '../../../../components/ui/button';
import { Breadcrumbs } from '../../../../components/blog/breadcrumbs';
import { SiteHeader } from '../../../../components/marketing/site-header';
import { SiteFooter } from '../../../../components/marketing/site-footer';
import { CornerMarks } from '../../../../components/marketing/blueprint';
import { SignalTimeline } from '../../../../components/indicators/signal-timeline';
import { ShareBar } from '../../../../components/stocks/share-bar';
import {
  StockCard,
  TONE_CLASS,
  formatSignedPct,
  signClass,
} from '../../../../components/stocks/stock-card';
import {
  DIMENSION_BUCKET_LABELS,
  DIMENSION_FALLBACK_LABEL,
  DIMENSION_KEYS,
  type DimensionKey,
} from '../../../../lib/indicators/labels';
import { cn } from '../../../../lib/utils';
import { getStockCopy, stockPageLang, STOCK_PAGE_LOCALES } from '../../../../lib/stocks/copy';
import { getNarrative } from '../../../../lib/stocks/narrative';
import {
  getStockSnapshot,
  getStockSnapshots,
  latestTally,
  toSummaryEntry,
  toneOf,
  type StockSnapshot,
} from '../../../../lib/stocks/snapshot';
import {
  displaySymbol,
  getStockBySlug,
  relatedStocks,
  stockName,
} from '../../../../lib/stocks/universe';

const SITE_URL = 'https://pickskill.ai';
const ORG_ID = `${SITE_URL}/#organization`;

/** Outbound reference per indicator — cited from the glossary and methodology. */
const INDICATOR_REFERENCES: Record<DimensionKey, { label: string; url: string }> = {
  macd: { label: 'MACD', url: 'https://en.wikipedia.org/wiki/MACD' },
  ma: { label: 'Moving average', url: 'https://en.wikipedia.org/wiki/Moving_average' },
  rsi: { label: 'Relative strength index', url: 'https://en.wikipedia.org/wiki/Relative_strength_index' },
  kdj: { label: 'Stochastic oscillator (KDJ)', url: 'https://en.wikipedia.org/wiki/Stochastic_oscillator' },
  boll: { label: 'Bollinger Bands', url: 'https://en.wikipedia.org/wiki/Bollinger_Bands' },
  adx: { label: 'Average directional movement index', url: 'https://en.wikipedia.org/wiki/Average_directional_movement_index' },
  volume: { label: 'Volume', url: 'https://en.wikipedia.org/wiki/Volume_(finance)' },
  flow: { label: 'On-balance volume', url: 'https://en.wikipedia.org/wiki/On-balance_volume' },
};

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
  const stock = getStockBySlug(slug);
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
  const stock = getStockBySlug(slug);
  if (!stock) notFound();

  const lang = stockPageLang(locale);
  const labelLang = lang === 'en' ? 'en' : 'zh';
  const copy = getStockCopy(lang);
  const dict = await getDictionary(locale);
  const symbol = displaySymbol(stock);
  const name = stockName(stock, lang);
  const vars = { name, symbol };
  const related = relatedStocks(stock);

  const [snapshot, relatedSnapshots] = await Promise.all([
    getStockSnapshot(stock.ticker),
    getStockSnapshots(related.map((s) => s.ticker)),
  ]);
  const narrative = snapshot ? await getNarrative(snapshot, stock, lang) : null;
  const tally = snapshot ? latestTally(snapshot) : null;
  const tone = tally ? toneOf(tally) : null;
  const tallyText = tally ? copy.tally(tally.bullish, tally.bearish, tally.neutral) : '—';
  const url = pageUrl(stock.slug, lang);
  const indexHref = getLocalizedPath('/stocks', locale);
  const faq = copy.faq({
    ...vars,
    tally: tallyText,
    toneWord: tone ? copy.tone[tone] : '—',
    asOf: snapshot?.asOf ?? '—',
  });
  const answer = snapshot
    ? copy.answer({
        ...vars,
        asOf: snapshot.asOf,
        close: snapshot.close?.toFixed(2) ?? '—',
        day: formatSignedPct(snapshot.changePct),
        five: formatSignedPct(snapshot.fiveDayChangePct),
        tally: tallyText,
        toneWord: tone ? copy.tone[tone] : '—',
      })
    : null;
  const chatHref = (prompt: string) =>
    `${getLocalizedPath('/chat', locale)}?prompt=${encodeURIComponent(prompt)}`;

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

      {/* Hero */}
      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 pt-8 lg:border-x lg:px-8">
          <CornerMarks />
          <Breadcrumbs
            ariaLabel="Breadcrumb"
            items={[
              { label: dict.nav?.home ?? 'Home', href: '/' },
              { label: copy.breadcrumb, href: '/stocks' },
              { label: symbol },
            ]}
          />
          <div className="grid gap-8 pb-10 pt-2 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                {copy.eyebrow(copy.market[stock.market], stock.exchange)}
              </p>
              <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
                {copy.headline(vars)}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{copy.sub}</p>
              {snapshot && (
                <p className="mt-3 font-mono text-[11px] text-subtle">
                  <time dateTime={snapshot.fetchedAt}>{copy.byline(snapshot.asOf)}</time>
                </p>
              )}
              {snapshot && (
                <dl className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono tabular-nums">
                  <div className="flex items-baseline gap-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {dict.indicators?.metrics?.latest ?? 'Last'}
                    </dt>
                    <dd className="text-2xl font-semibold text-foreground">{snapshot.close?.toFixed(2) ?? '—'}</dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {dict.indicators?.metrics?.change ?? 'Chg %'}
                    </dt>
                    <dd className={cn('text-base font-semibold', signClass(snapshot.changePct))}>
                      {formatSignedPct(snapshot.changePct)}
                    </dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {dict.indicators?.metrics?.fiveDayChange ?? '5D %'}
                    </dt>
                    <dd className={cn('text-base font-semibold', signClass(snapshot.fiveDayChangePct))}>
                      {formatSignedPct(snapshot.fiveDayChangePct)}
                    </dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{copy.asOf}</dt>
                    <dd className="text-sm text-muted-foreground">
                      <time dateTime={snapshot.asOf}>{snapshot.asOf}</time>
                    </dd>
                  </div>
                </dl>
              )}
              <div className="mt-6">
                <ShareBar
                  pageUrl={url}
                  symbol={symbol}
                  text={copy.share.text({ ...vars, tone: tone ? `${copy.tone[tone]} (${tallyText})` : '' })}
                  labels={{
                    label: copy.share.label,
                    copy: copy.share.copy,
                    copied: copy.share.copied,
                    more: copy.share.more,
                  }}
                />
              </div>
            </div>

            {tally && tone && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                    {copy.timelineHeading}
                  </span>
                  <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium', TONE_CLASS[tone])}>
                    {copy.tone[tone]}
                  </span>
                </div>
                <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <span className="bg-up" style={{ width: `${(tally.bullish / 8) * 100}%` }} />
                  <span className="bg-muted-foreground/40" style={{ width: `${(tally.neutral / 8) * 100}%` }} />
                  <span className="bg-down" style={{ width: `${(tally.bearish / 8) * 100}%` }} />
                </div>
                <p className="mt-3 font-mono text-xs text-muted-foreground">{tallyText}</p>
                <ul className="mt-4 grid grid-cols-4 gap-2">
                  {DIMENSION_KEYS.map((k) => (
                    <li key={k} className="flex flex-col items-center gap-1">
                      <span
                        className={cn(
                          'size-2 rounded-full',
                          snapshot!.dims[k].bucket === 'bullish' && 'bg-up',
                          snapshot!.dims[k].bucket === 'bearish' && 'bg-down',
                          snapshot!.dims[k].bucket === 'neutral' && 'bg-muted-foreground',
                        )}
                      />
                      <span className="font-mono text-[10px] uppercase text-muted-foreground">
                        {DIMENSION_FALLBACK_LABEL[k]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Chart + timeline, then the 5-day read directly below it */}
      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 py-12 lg:border-x lg:px-8">
          <CornerMarks />
          {snapshot ? (
            <>
              <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
                      {copy.timelineHeading}
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">{copy.timelineSub}</p>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{copy.refreshNote}</span>
                </div>
                <SignalTimeline entry={toSummaryEntry(snapshot, stock, labelLang)} autoScroll={false} />
              </div>

              {narrative && (
                <article className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
                  <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight">
                    <Sparkles className="size-5 text-[color:var(--accent)]" aria-hidden="true" />
                    {copy.readHeading(vars)}
                  </h2>
                  {answer && (
                    <p className="mt-4 border-l-2 border-[color:var(--accent)] pl-4 text-base font-medium leading-relaxed text-foreground">
                      {answer}
                    </p>
                  )}
                  <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-foreground/90">
                    {narrative.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <p className="mt-5 font-mono text-[11px] text-muted-foreground">
                    {narrative.source === 'ai' ? copy.readSourceAi : copy.readSourceTemplate}{' '}
                    {copy.asOf} <time dateTime={snapshot.asOf}>{snapshot.asOf}</time>
                  </p>
                  <div className="mt-6 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{copy.disclaimerTitle}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{copy.disclaimer}</p>
                    </div>
                  </div>
                </article>
              )}

              <LevelsTable snapshot={snapshot} copy={copy} labelLang={labelLang} vars={vars} />
            </>
          ) : (
            <p className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              {copy.unavailable}
            </p>
          )}
        </div>
      </section>

      {/* PickSkill funnel */}
      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 py-14 lg:border-x lg:px-8">
          <CornerMarks />
          <div className="blueprint-grid-soft rounded-xl border border-border bg-card p-6 sm:p-10">
            <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{copy.cta.heading(vars)}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{copy.cta.sub}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <CtaCard
                icon={<LineChart className="size-5" />}
                title={copy.cta.track.title}
                body={copy.cta.track.body}
                button={copy.cta.track.button}
                href={getLocalizedPath('/portfolios', locale)}
                primary
              />
              <CtaCard
                icon={<Bot className="size-5" />}
                title={copy.cta.ask.title}
                body={copy.cta.ask.body}
                button={copy.cta.ask.button}
                href={chatHref(copy.cta.ask.prompt(vars))}
              />
              <CtaCard
                icon={<FileText className="size-5" />}
                title={copy.cta.deck.title}
                body={copy.cta.deck.body}
                button={copy.cta.deck.button}
                href={chatHref(copy.cta.deck.prompt(vars))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 py-14 lg:border-x lg:px-8">
          <CornerMarks />
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">{copy.relatedHeading}</h2>
            <Link
              href={indexHref}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              {copy.viewAll}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <StockCard
                key={s.slug}
                stock={s}
                snapshot={relatedSnapshots.get(s.ticker) ?? null}
                lang={lang}
                locale={locale}
                copy={copy}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Glossary + FAQ */}
      <section className="border-b border-border">
        <div className="relative mx-auto grid max-w-6xl gap-12 border-border px-5 py-14 lg:grid-cols-2 lg:border-x lg:px-8">
          <CornerMarks />
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight">{copy.glossaryHeading}</h2>
            <dl className="mt-6 space-y-4">
              {DIMENSION_KEYS.map((k) => {
                const [term, ...rest] = copy.glossary[k].split(' — ');
                const body = rest.join(' — ');
                return (
                  <div key={k}>
                    <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                      <a
                        href={INDICATOR_REFERENCES[k].url}
                        target="_blank"
                        rel="noopener"
                        className="underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        {term}
                      </a>
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{body.charAt(0).toUpperCase() + body.slice(1)}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight">{copy.faqHeading}</h2>
            <div className="mt-6 space-y-6">
              {faq.map((f) => (
                <div key={f.q}>
                  <h3 className="font-medium text-foreground">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sources & methodology — named, linked provenance for every number */}
      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 py-14 lg:border-x lg:px-8">
          <CornerMarks />
          <h2 className="font-serif text-2xl font-semibold tracking-tight">{copy.methodology.heading}</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {snapshot && (
                <p>
                  <span className="font-medium text-foreground">{copy.methodology.sourceLabel}:</span>{' '}
                  <a
                    href={snapshot.source.url}
                    target="_blank"
                    rel="noopener"
                    className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    {snapshot.source.name}
                  </a>{' '}
                  · {copy.asOf} <time dateTime={snapshot.asOf}>{snapshot.asOf}</time>
                </p>
              )}
              {copy.methodology.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                {copy.methodology.references}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {DIMENSION_KEYS.map((k) => (
                  <li key={k}>
                    <a
                      href={INDICATOR_REFERENCES[k].url}
                      target="_blank"
                      rel="noopener"
                      className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                    >
                      {INDICATOR_REFERENCES[k].label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter lang={locale} dict={dict} />
    </div>
  );
}

function CtaCard({
  icon,
  title,
  body,
  button,
  href,
  primary = false,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  button: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-background p-5">
      <span className="text-[color:var(--accent)]">{icon}</span>
      <h3 className="mt-3 font-medium text-foreground">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <Button asChild size="sm" variant={primary ? 'default' : 'outline'} className="mt-4 self-start">
        <Link href={href}>
          {button}
          <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}

function fmt(v: number | null | undefined, digits = 2): string {
  return v == null || !Number.isFinite(v) ? '—' : v.toFixed(digits);
}

function compact(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return '—';
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(v);
}

/** Server-rendered latest values — the crawlable, quotable counterpart to the chart. */
function LevelsTable({
  snapshot,
  copy,
  labelLang,
  vars,
}: {
  snapshot: StockSnapshot;
  copy: ReturnType<typeof getStockCopy>;
  labelLang: 'en' | 'zh';
  vars: { name: string; symbol: string };
}) {
  const x = (k: DimensionKey, f: string) => snapshot.dims[k].latestExtras[f];
  const rows: Array<{ k: DimensionKey; label: string; value: string }> = [
    { k: 'macd', label: 'MACD (12,26,9)', value: `DIF ${fmt(x('macd', 'dif'))} · DEA ${fmt(x('macd', 'dea'))} · HIST ${fmt(x('macd', 'hist'))}` },
    { k: 'ma', label: 'MA 5 / 20 / 60', value: `${fmt(x('ma', 'ma5'))} / ${fmt(x('ma', 'ma20'))} / ${fmt(x('ma', 'ma60'))}` },
    { k: 'rsi', label: 'RSI (14)', value: fmt(x('rsi', 'rsi'), 1) },
    { k: 'kdj', label: 'KDJ (9,3,3)', value: `K ${fmt(x('kdj', 'k'), 1)} · D ${fmt(x('kdj', 'd'), 1)} · J ${fmt(x('kdj', 'j'), 1)}` },
    { k: 'boll', label: 'BOLL (20,2)', value: `${fmt(x('boll', 'upper'))} / ${fmt(x('boll', 'mid'))} / ${fmt(x('boll', 'lower'))}` },
    { k: 'adx', label: 'ADX / DMI (14)', value: `ADX ${fmt(x('adx', 'adx'), 1)} · +DI ${fmt(x('adx', 'plusDi'), 1)} · −DI ${fmt(x('adx', 'minusDi'), 1)}` },
    { k: 'volume', label: 'Vol / MA20', value: `${fmt(x('volume', 'volRatio'))}×` },
    { k: 'flow', label: 'Flow (5D, est.)', value: compact(x('flow', 'cum5')) },
  ];
  return (
    <div className="mt-8">
      <h2 className="font-serif text-2xl font-semibold tracking-tight">{copy.levelsHeading(vars)}</h2>
      <div className="mt-5 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-muted/50 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">{copy.levels.indicator}</th>
              <th className="px-4 py-2.5 font-medium">{copy.levels.value}</th>
              <th className="px-4 py-2.5 font-medium">{copy.levels.signal}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {rows.map((r) => {
              const bucket = snapshot.dims[r.k].bucket;
              return (
                <tr key={r.k}>
                  <td className="px-4 py-2.5 font-mono text-xs text-foreground">{r.label}</td>
                  <td className="px-4 py-2.5 font-mono text-xs tabular-nums text-muted-foreground">{r.value}</td>
                  <td
                    className={cn(
                      'px-4 py-2.5 text-xs',
                      bucket === 'bullish' && 'text-up',
                      bucket === 'bearish' && 'text-down',
                      bucket === 'neutral' && 'text-muted-foreground',
                    )}
                  >
                    {DIMENSION_BUCKET_LABELS[r.k][bucket][labelLang]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
