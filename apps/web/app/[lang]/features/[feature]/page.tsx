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
import { features, getFeature, getFeatureSlugs } from '../../../../lib/features';
import { getDictionary } from '../../dictionaries';
import { Button } from '../../../../components/ui/button';
import { Breadcrumbs } from '../../../../components/blog/breadcrumbs';
import { SiteHeader } from '../../../../components/marketing/site-header';
import { SiteFooter } from '../../../../components/marketing/site-footer';

const SITE_URL = 'https://pickskill.ai';
const SITE_NAME = 'PickSkill';

export function generateStaticParams(): Array<{ lang: Locale; feature: string }> {
  const slugs = getFeatureSlugs();
  return locales.flatMap((lang) => slugs.map((feature) => ({ lang, feature })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; feature: string }>;
}): Promise<Metadata> {
  const { lang, feature: slug } = await params;
  if (!isLocale(lang)) return {};
  const feature = getFeature(slug);
  if (!feature) return {};

  return {
    title: `${feature.name} — PickSkill`,
    description: feature.description,
    alternates: generateAlternatesMetadata({ path: `/features/${slug}`, locale: lang as Locale }),
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      title: `${feature.name} — PickSkill`,
      description: feature.description,
      siteName: SITE_NAME,
      url: `${SITE_URL}${getLocalizedPath(`/features/${slug}`, lang as Locale)}`,
      locale: localeOg[lang as Locale],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeOg[l]),
      type: 'website',
      images: [{ url: `${SITE_URL}${feature.image}`, width: 1200, height: 630, alt: feature.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${feature.name} — PickSkill`,
      description: feature.description,
      images: [`${SITE_URL}${feature.image}`],
    },
  };
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ lang: string; feature: string }>;
}) {
  const { lang, feature: slug } = await params;
  if (!isLocale(lang)) notFound();
  const feature = getFeature(slug);
  if (!feature) notFound();

  const dict = await getDictionary(lang);
  const ctaHref = getLocalizedPath(feature.cta.href, lang);
  const featuresHref = getLocalizedPath('/features', lang);
  const pageUrl = `${SITE_URL}${getLocalizedPath(`/features/${slug}`, lang as Locale)}`;
  const homeUrl = `${SITE_URL}${getLocalizedPath('/', lang as Locale)}`;
  const otherFeatures = features.filter((f) => f.slug !== slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${feature.name} — PickSkill`,
        description: feature.description,
        inLanguage: localeBcp47[lang as Locale],
        primaryImageOfPage: `${SITE_URL}${feature.image}`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: dict.nav?.home ?? 'Home', item: homeUrl },
          { '@type': 'ListItem', position: 2, name: dict.nav?.features ?? 'Features', item: `${SITE_URL}${featuresHref}` },
          { '@type': 'ListItem', position: 3, name: feature.name, item: pageUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: feature.faq.map((f) => ({
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
            { label: feature.name },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-6 lg:grid-cols-2 lg:px-8 lg:pb-20">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
              {feature.eyebrow}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {feature.headline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {feature.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="default">
                <Link href={ctaHref}>
                  {feature.cta.label}
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
              src={feature.image}
              alt={feature.imageAlt}
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
            What it does
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {feature.capabilities.map((c) => (
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
            How it works
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {feature.howItWorks.map((s, i) => (
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
            Frequently asked questions
          </h2>
          <dl className="mt-8 space-y-7">
            {feature.faq.map((f) => (
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
              {feature.headline}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Free to try — 30 conversations a month, no card required.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="default">
                <Link href={ctaHref}>
                  {feature.cta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
              {dict.nav?.features ?? 'Features'}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {otherFeatures.map((f) => (
                <Link
                  key={f.slug}
                  href={getLocalizedPath(`/features/${f.slug}`, lang)}
                  className="group flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-muted/40"
                >
                  <span>
                    <span className="font-serif text-base font-semibold text-foreground">{f.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{f.tagline}</span>
                  </span>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter lang={lang as Locale} dict={dict} />
    </div>
  );
}
