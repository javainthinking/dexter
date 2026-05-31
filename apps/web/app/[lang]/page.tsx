import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '../../lib/i18n/locales';
import { getLocalizedPath } from '../../lib/i18n/paths';
import { getDictionary, type Dictionary } from './dictionaries';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { SiteHeader } from '../../components/marketing/site-header';
import { SiteFooter } from '../../components/marketing/site-footer';
import { FeatureShowcase } from '../../components/marketing/feature-showcase';
import { HeroCarousel, type HeroSlide, type HeroSceneVariant } from '../../components/marketing/hero-carousel';
import { getFeaturesContent } from '../../lib/features';
import Link from 'next/link';

const SITE_URL = 'https://pickskill.ai';

/**
 * Homepage structured data anchors the brand entity for Google rich
 * results and AI knowledge graphs:
 *   - Organization — the brand, logo, contact
 *   - WebSite — the site entity (publisher relationship)
 *   - SoftwareApplication — the product + its pricing offers
 *   - FAQPage — the homepage FAQ, for AI answers + rich results (GEO)
 */
function buildHomeJsonLd(description: string, faq: { q: string; a: string }[]) {
  const org = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'PickSkill',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description,
  };
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'PickSkill',
    description,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['en', 'fr', 'de', 'es', 'ja', 'ko', 'zh-CN', 'zh-TW'],
  };
  const offer = (name: string, price: string, description: string) => ({
    '@type': 'Offer',
    name,
    price,
    priceCurrency: 'USD',
    description,
    url: `${SITE_URL}/pricing`,
  });
  const application = {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: 'PickSkill',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description,
    publisher: { '@id': `${SITE_URL}/#organization` },
    offers: [
      offer('Free', '0', '30 conversations/month, 1 portfolio, 2 generated files — no card required'),
      offer('Starter', '15', '200 conversations/month, 3 portfolios, 8 generated files/month'),
      offer('Pro', '39', '1,000 conversations/month, 10 portfolios, 30 generated files/month'),
      offer('Power', '129', 'Unlimited conversations & research, 100+ generated files/month'),
    ],
  };
  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [org, website, application, faqPage],
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const chatHref = getLocalizedPath('/chat', lang);
  const featuresHref = getLocalizedPath('/features', lang);
  const jsonLd = buildHomeJsonLd(dict.common.openGraphDescription, dict.landing.faq.items);

  // Hero carousel slides — one per feature, led by document generation to
  // match the subtitle. Each is a localized DOM scene; the caption (name +
  // selling point) reuses the localized feature catalogue.
  const featuresContent = getFeaturesContent(lang as Locale);
  const sceneDefs: { variant: HeroSceneVariant; slug: 'research-documents' | 'portfolio-indicators' | 'ai-analyst' }[] = [
    { variant: 'documents', slug: 'research-documents' },
    { variant: 'indicators', slug: 'portfolio-indicators' },
    { variant: 'analyst', slug: 'ai-analyst' },
  ];
  const heroSlides: HeroSlide[] = sceneDefs.map(({ variant, slug }) => {
    const item = featuresContent.items[slug];
    return {
      variant,
      title: item.name,
      tagline: item.tagline,
      href: getLocalizedPath(`/features/${slug}`, lang),
    };
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader lang={lang as Locale} />
      <Hero
        dict={dict}
        chatHref={chatHref}
        featuresHref={featuresHref}
        slides={heroSlides}
        sceneLabels={dict.landing.heroScenes}
      />
      <FeatureShowcase
        lang={lang as Locale}
        eyebrow={dict.landing.showcase.eyebrow}
        title={dict.landing.showcase.title}
        subtitle={dict.landing.showcase.subtitle}
        learnMoreLabel={dict.landing.showcase.learnMore}
        tryItLabel={dict.landing.showcase.tryItCta}
      />
      <Faq dict={dict} />
      <SiteFooter lang={lang as Locale} dict={dict} />
    </div>
  );
}

function Hero({
  dict,
  chatHref,
  featuresHref,
  slides,
  sceneLabels,
}: {
  dict: Dictionary;
  chatHref: string;
  featuresHref: string;
  slides: HeroSlide[];
  sceneLabels: Dictionary['landing']['heroScenes'];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Ambient accent glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_-10%,color-mix(in_oklch,var(--accent)_16%,transparent),transparent_55%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pt-16 pb-20 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pt-24 lg:pb-28">
        {/* Copy */}
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent" size="default">
              <span className="size-1.5 rounded-full bg-[color:var(--accent)] animate-pulse-soft" />
              {dict.landing.badge}
            </Badge>
            <span className="text-xs tabular-nums text-subtle">{dict.landing.version}</span>
          </div>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {dict.landing.hero.title}
            <br />
            <span className="text-muted-foreground">{dict.landing.hero.titleEmphasis}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {dict.landing.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="default">
              <Link href={chatHref}>
                {dict.landing.hero.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={featuresHref}>{dict.landing.hero.secondaryCta}</Link>
            </Button>
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            {dict.landing.hero.tagline}
          </p>
        </div>

        {/* Visual */}
        <HeroCarousel slides={slides} labels={sceneLabels} />
      </div>
    </section>
  );
}

function Faq({ dict }: { dict: Dictionary }) {
  const { eyebrow, title, items } = dict.landing.faq;
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <dl className="mt-10 space-y-8">
          {items.map((item) => (
            <div key={item.q}>
              <dt className="font-serif text-lg font-medium text-foreground">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
