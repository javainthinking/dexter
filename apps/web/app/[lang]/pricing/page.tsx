import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { isLocale, locales, localeOg, type Locale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { generateAlternatesMetadata } from '../../../lib/i18n/seo';
import { planMeta, getPricingContent } from '../../../lib/pricing';
import { getDictionary } from '../dictionaries';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { SiteHeader } from '../../../components/marketing/site-header';
import { SiteFooter } from '../../../components/marketing/site-footer';

const SITE_URL = 'https://pickskill.ai';
const SITE_NAME = 'PickSkill';

/**
 * /[lang]/pricing — plans & pricing. Copy is localized via lib/pricing
 * (English-first, falls back to English for untranslated locales); plan
 * tier names + prices are locale-independent constants. Carries Product +
 * Offer + FAQPage JSON-LD.
 */

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
  const c = getPricingContent(lang);
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: generateAlternatesMetadata({ path: '/pricing', locale: lang as Locale }),
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      siteName: SITE_NAME,
      url: `${SITE_URL}${getLocalizedPath('/pricing', lang as Locale)}`,
      locale: localeOg[lang as Locale],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeOg[l]),
      type: 'website',
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const c = getPricingContent(lang);
  const chatHref = getLocalizedPath('/chat', lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: 'PickSkill',
        description:
          'AI analyst that researches, models, and drafts equity work in plain English.',
        url: `${SITE_URL}/pricing`,
        offers: planMeta.map((p) => ({
          '@type': 'Offer',
          name: p.name,
          price: p.priceValue,
          priceCurrency: 'USD',
          description: c.plans[p.id].blurb,
          url: `${SITE_URL}/pricing`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: c.faq.map((f) => ({
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

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:pt-20 lg:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
            {c.heroEyebrow}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {c.heroHeadline}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {c.heroSub}
          </p>
        </div>
      </section>

      {/* Plan cards */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-4">
            {planMeta.map((plan) => {
              const copy = c.plans[plan.id];
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-xl border bg-card p-6 ${
                    plan.featured ? 'border-[color:var(--accent)]' : 'border-border'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-6">
                      <Badge variant="accent" size="default">
                        {c.mostPopular}
                      </Badge>
                    </div>
                  )}
                  <h2 className="font-serif text-lg font-semibold tracking-tight text-foreground">
                    {plan.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{copy.blurb}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-semibold tracking-tight text-foreground">
                      {plan.monthly}
                    </span>
                    <span className="text-sm text-subtle">{c.perMonth}</span>
                  </div>
                  <p className="mt-1 text-xs text-subtle">{copy.annualNote}</p>
                  <Button asChild size="default" variant={plan.featured ? 'default' : 'outline'} className="mt-5">
                    <Link href={chatHref}>{copy.cta}</Link>
                  </Button>
                  <ul className="mt-6 space-y-2.5">
                    {copy.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--accent)]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-subtle">{c.everyPlanNote}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            {c.faqHeading}
          </h2>
          <dl className="mt-8 space-y-7">
            {c.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-foreground">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <SiteFooter lang={lang as Locale} dict={dict} />
    </div>
  );
}
