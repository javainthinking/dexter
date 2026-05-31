import type { Metadata } from 'next';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { Check, Minus } from 'lucide-react';
import { isLocale, locales, localeOg, type Locale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { generateAlternatesMetadata } from '../../../lib/i18n/seo';
import { planMeta, getPricingContent } from '../../../lib/pricing';
import { getDictionary } from '../dictionaries';
import { PricingCards } from '../../../components/marketing/pricing-cards';
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
          <PricingCards plans={planMeta} copy={c} chatHref={chatHref} locale={lang} />
          <p className="mt-6 text-center text-xs text-subtle">{c.everyPlanNote}</p>
        </div>
      </section>

      {/* Plan comparison matrix */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            {c.comparisonHeading}
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-2/5 py-3 pr-4 text-left font-medium text-subtle" />
                  {planMeta.map((plan) => (
                    <th
                      key={plan.id}
                      className={`px-3 py-3 text-center font-serif text-base font-semibold ${
                        plan.featured ? 'text-[color:var(--accent)]' : 'text-foreground'
                      }`}
                    >
                      {plan.name}
                      <span className="mt-0.5 block font-sans text-xs font-normal text-subtle">
                        {plan.monthly}
                        {plan.priceValue !== '0' && c.perMonth}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.comparison.map((group) => (
                  <Fragment key={group.title}>
                    <tr>
                      <td
                        colSpan={planMeta.length + 1}
                        className="pt-6 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle"
                      >
                        {group.title}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label} className="border-b border-border/60">
                        <td className="py-3 pr-4 text-left text-muted-foreground">{row.label}</td>
                        {row.values.map((value, i) => (
                          <td
                            key={planMeta[i]?.id ?? i}
                            className={`px-3 py-3 text-center ${
                              planMeta[i]?.featured ? 'bg-muted/30' : ''
                            }`}
                          >
                            {typeof value === 'boolean' ? (
                              value ? (
                                <Check className="mx-auto size-4 text-[color:var(--accent)]" />
                              ) : (
                                <Minus className="mx-auto size-4 text-subtle" />
                              )
                            ) : (
                              <span className="text-foreground">{value}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
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
