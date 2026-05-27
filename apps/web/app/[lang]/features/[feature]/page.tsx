import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  isLocale,
  locales,
  localeBcp47,
  localeOg,
  type Locale,
} from '../../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../../lib/i18n/paths';
import { generateAlternatesMetadata } from '../../../../lib/i18n/seo';
import {
  featureList,
  featureSlugs,
  getFeaturesContent,
  type FeatureSlug,
} from '../../../../lib/features';
import { getDictionary } from '../../dictionaries';
import { Button } from '../../../../components/ui/button';
import { Breadcrumbs } from '../../../../components/blog/breadcrumbs';
import { SiteHeader } from '../../../../components/marketing/site-header';
import { SiteFooter } from '../../../../components/marketing/site-footer';

const SITE_URL = 'https://pickskill.ai';
const SITE_NAME = 'PickSkill';

function isFeatureSlug(value: string): value is FeatureSlug {
  return (featureSlugs as readonly string[]).includes(value);
}

export function generateStaticParams(): Array<{ lang: Locale; feature: string }> {
  return locales.flatMap((lang) => featureSlugs.map((feature) => ({ lang, feature })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; feature: string }>;
}): Promise<Metadata> {
  const { lang, feature: slug } = await params;
  if (!isLocale(lang) || !isFeatureSlug(slug)) return {};
  const meta = featureList.find((f) => f.slug === slug);
  const item = getFeaturesContent(lang).items[slug];
  if (!meta) return {};

  return {
    title: `${item.name} — PickSkill`,
    description: item.description,
    alternates: generateAlternatesMetadata({ path: `/features/${slug}`, locale: lang as Locale }),
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      title: `${item.name} — PickSkill`,
      description: item.description,
      siteName: SITE_NAME,
      url: `${SITE_URL}${getLocalizedPath(`/features/${slug}`, lang as Locale)}`,
      locale: localeOg[lang as Locale],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeOg[l]),
      type: 'website',
      images: [{ url: `${SITE_URL}${meta.image}`, width: 1200, height: 630, alt: item.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.name} — PickSkill`,
      description: item.description,
      images: [`${SITE_URL}${meta.image}`],
    },
  };
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ lang: string; feature: string }>;
}) {
  const { lang, feature: slug } = await params;
  if (!isLocale(lang) || !isFeatureSlug(slug)) notFound();
  const meta = featureList.find((f) => f.slug === slug);
  if (!meta) notFound();

  const dict = await getDictionary(lang);
  const content = getFeaturesContent(lang);
  const item = content.items[slug];
  const ctaHref = getLocalizedPath(meta.ctaHref, lang);
  const featuresHref = getLocalizedPath('/features', lang);
  const pageUrl = `${SITE_URL}${getLocalizedPath(`/features/${slug}`, lang as Locale)}`;
  const homeUrl = `${SITE_URL}${getLocalizedPath('/', lang as Locale)}`;
  const otherFeatures = featureList.filter((f) => f.slug !== slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${item.name} — PickSkill`,
        description: item.description,
        inLanguage: localeBcp47[lang as Locale],
        primaryImageOfPage: `${SITE_URL}${meta.image}`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: dict.nav?.home ?? 'Home', item: homeUrl },
          { '@type': 'ListItem', position: 2, name: dict.nav?.features ?? 'Features', item: `${SITE_URL}${featuresHref}` },
          { '@type': 'ListItem', position: 3, name: item.name, item: pageUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: item.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader lang={lang as Locale} />

      <div className="mx-auto max-w-6xl px-5 pt-8 lg:px-8">
        <Breadcrumbs
          ariaLabel="Breadcrumb"
          items={[
            { label: dict.nav?.home ?? 'Home', href: '/' },
            { label: dict.nav?.features ?? 'Features', href: '/features' },
            { label: item.name },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-6 lg:grid-cols-2 lg:px-8 lg:pb-20">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
              {item.eyebrow}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {item.headline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {item.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="default">
                <Link href={ctaHref}>
                  {item.ctaLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={getLocalizedPath('/pricing', lang)}>{dict.nav?.pricing ?? 'Pricing'}</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={meta.image}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            {content.sections.whatItDoes}
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {item.capabilities.map((c) => (
              <div key={c.title} className="bg-card p-6">
                <h3 className="font-serif text-lg font-semibold leading-snug tracking-tight text-foreground">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            {content.sections.howItWorks}
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {item.howItWorks.map((s, i) => (
              <li key={s.step} className="rounded-lg border border-border bg-card p-5">
                <span className="font-mono text-xs text-[color:var(--accent)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-medium text-foreground">{s.step}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            {content.sections.faqHeading}
          </h2>
          <dl className="mt-8 space-y-7">
            {item.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-foreground">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA + other features */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <div className="rounded-xl border border-border bg-card p-8 text-center sm:p-12">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {item.headline}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              {content.sections.ctaSubtitle}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="default">
                <Link href={ctaHref}>
                  {item.ctaLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
              {content.sections.moreFeatures}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {otherFeatures.map((f) => {
                const oi = content.items[f.slug];
                return (
                  <Link
                    key={f.slug}
                    href={getLocalizedPath(`/features/${f.slug}`, lang)}
                    className="group flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-muted/40"
                  >
                    <span>
                      <span className="font-serif text-base font-semibold text-foreground">{oi.name}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{oi.tagline}</span>
                    </span>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter lang={lang as Locale} dict={dict} />
    </div>
  );
}
