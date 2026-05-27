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
} from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { generateAlternatesMetadata } from '../../../lib/i18n/seo';
import { features } from '../../../lib/features';
import { getDictionary } from '../dictionaries';
import { Button } from '../../../components/ui/button';
import { SiteHeader } from '../../../components/marketing/site-header';
import { SiteFooter } from '../../../components/marketing/site-footer';

const SITE_URL = 'https://pickskill.ai';
const SITE_NAME = 'PickSkill';

export function generateStaticParams(): Array<{ lang: Locale }> {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const title = 'Features — PickSkill';
  const description =
    'What PickSkill does: an AI analyst for research and valuation, an 8-dimension portfolio indicators dashboard, and investor-grade PowerPoint / Word / Excel generation.';
  return {
    title,
    description,
    alternates: generateAlternatesMetadata({ path: '/features', locale: lang as Locale }),
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: `${SITE_URL}${getLocalizedPath('/features', lang as Locale)}`,
      locale: localeOg[lang as Locale],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeOg[l]),
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function FeaturesIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const chatHref = getLocalizedPath('/chat', lang);
  const pageUrl = `${SITE_URL}${getLocalizedPath('/features', lang as Locale)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#collection`,
    url: pageUrl,
    name: 'PickSkill Features',
    inLanguage: localeBcp47[lang as Locale],
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: features.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: f.name,
        url: `${SITE_URL}${getLocalizedPath(`/features/${f.slug}`, lang as Locale)}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader lang={lang as Locale} />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:pt-20 lg:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
            {dict.nav?.features ?? 'Features'}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            An AI analyst, a signals dashboard, and a document factory.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            PickSkill researches, models, and drafts your equity work — then turns
            the read into a deck, a report, or a live portfolio you can share. Here
            is what each piece does.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="default">
              <Link href={chatHref}>
                Try it free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
          <div className="space-y-4">
            {features.map((f, i) => (
              <Link
                key={f.slug}
                href={getLocalizedPath(`/features/${f.slug}`, lang)}
                className="group grid items-center gap-6 overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border-strong hover:bg-muted/30 lg:grid-cols-2"
              >
                <div className={`p-7 sm:p-9 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                    {f.eyebrow}
                  </p>
                  <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {f.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {f.tagline}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--accent)] transition-transform group-hover:translate-x-0.5">
                    Explore {f.name} <ArrowRight className="size-4" />
                  </span>
                </div>
                <div className={`relative aspect-[1200/630] w-full overflow-hidden bg-muted ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <Image
                    src={f.image}
                    alt={f.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    priority={i === 0}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter lang={lang as Locale} dict={dict} />
    </div>
  );
}
