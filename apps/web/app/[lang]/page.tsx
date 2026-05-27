import { ArrowRight, LineChart, BrainCircuit, Activity } from 'lucide-react';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '../../lib/i18n/locales';
import { getLocalizedPath } from '../../lib/i18n/paths';
import { getDictionary, type Dictionary } from './dictionaries';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { SiteHeader } from '../../components/marketing/site-header';
import { SiteFooter } from '../../components/marketing/site-footer';
import Link from 'next/link';

const SITE_URL = 'https://pickskill.ai';

/**
 * Homepage structured data. The highest-authority page on the site had
 * no JSON-LD; these three nodes anchor the brand entity for Google rich
 * results and AI knowledge graphs:
 *   - Organization — the brand, logo, contact
 *   - WebSite — the site entity (publisher relationship)
 *   - SoftwareApplication — the product + its pricing offers, so the
 *     plans surface in AI answers to "how much does PickSkill cost?"
 * Locale-independent on purpose (the entity is the same in every
 * language); only emitted once, on the homepage.
 */
function buildHomeJsonLd(description: string) {
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
  const offer = (
    name: string,
    price: string,
    description: string,
  ) => ({
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
      offer('Free', '0', '30 conversations/month, 1 portfolio — no card required'),
      offer('Starter', '15', '200 conversations/month, 3 portfolios, 8 files/month'),
      offer('Pro', '39', 'Advanced model, 1,000 conversations, 10 portfolios, auto-refresh quotes'),
      offer('Power', '129', 'Unlimited conversations, 100+ files/month, real-time quotes'),
    ],
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [org, website, application],
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
  const jsonLd = buildHomeJsonLd(dict.common.openGraphDescription);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader lang={lang as Locale} />
      <Hero dict={dict} chatHref={chatHref} />
      <Features dict={dict} />
      <SampleQuestions dict={dict} chatHref={chatHref} />
      <SiteFooter lang={lang as Locale} dict={dict} />
    </div>
  );
}

function Hero({ dict, chatHref }: { dict: Dictionary; chatHref: string }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:px-8">
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
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {dict.landing.hero.subtitle}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" variant="default">
            <Link href={chatHref}>
              {dict.landing.hero.primaryCta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
          {dict.landing.hero.tagline}
        </p>
      </div>
    </section>
  );
}

function Features({ dict }: { dict: Dictionary }) {
  const items = [
    { icon: BrainCircuit, ...dict.landing.features.reasoning },
    { icon: Activity, ...dict.landing.features.liveData },
    { icon: LineChart, ...dict.landing.features.memory },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="bg-card p-6 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                {item.eyebrow}
              </p>
              <div className="mt-4 inline-flex size-9 items-center justify-center rounded-md border border-border bg-muted text-foreground">
                <item.icon className="size-4" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold leading-snug tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleQuestions({ dict, chatHref }: { dict: Dictionary; chatHref: string }) {
  const samples = [
    dict.landing.samples.quickDcf,
    dict.landing.samples.comparable,
    dict.landing.samples.macro,
    dict.landing.samples.thesis,
    dict.landing.samples.pitchDeck,
    dict.landing.samples.researchNote,
    dict.landing.samples.dcfModel,
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          {dict.landing.samples.eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground">
          {dict.landing.samples.title}
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {samples.map((q) => (
            <Link
              key={q}
              href={`${chatHref}?prompt=${encodeURIComponent(q)}`}
              className="group flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 text-sm transition-colors hover:border-border-strong hover:bg-muted"
            >
              <span className="text-foreground">{q}</span>
              <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

