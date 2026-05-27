import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { isLocale, locales, localeOg, type Locale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { generateAlternatesMetadata } from '../../../lib/i18n/seo';
import { getDictionary } from '../dictionaries';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { SiteHeader } from '../../../components/marketing/site-header';
import { SiteFooter } from '../../../components/marketing/site-footer';

const SITE_URL = 'https://pickskill.ai';
const SITE_NAME = 'PickSkill';

/**
 * /[lang]/pricing — plans & pricing.
 *
 * English-first like the blog: the chrome (header/footer) is localized
 * via the dictionary, the pricing copy itself is English at every locale
 * URL with correct canonical + hreflang. Content mirrors
 * apps/web/docs/pricing-public.md. Carries Offer + FAQPage JSON-LD so the
 * tiers surface in AI answers to "how much does PickSkill cost?".
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
  const title = 'Pricing — PickSkill';
  const description =
    'PickSkill plans: Free, Starter $15/mo, Pro $39/mo, Power $129/mo. Annual billing saves 20%. 7-day Pro trial, no card. Cancel anytime.';
  return {
    title,
    description,
    alternates: generateAlternatesMetadata({ path: '/pricing', locale: lang as Locale }),
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: `${SITE_URL}${getLocalizedPath('/pricing', lang as Locale)}`,
      locale: localeOg[lang as Locale],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeOg[l]),
      type: 'website',
    },
  };
}

interface Plan {
  name: string;
  monthly: string;
  annualNote: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
  priceValue: string;
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    monthly: '$0',
    annualNote: 'No card required',
    blurb: 'Try the AI analyst.',
    priceValue: '0',
    features: [
      '30 conversations / month',
      '5 deep-research turns / month',
      '1 portfolio · 10 holdings',
      '2 files / month (PPT / Word / Excel)',
      'All 8 indicator dimensions',
      'Unlimited long-term memory',
    ],
    cta: 'Try free',
  },
  {
    name: 'Starter',
    monthly: '$15',
    annualNote: '$12/mo billed annually ($144/yr)',
    blurb: 'For the active retail investor.',
    priceValue: '15',
    features: [
      '200 conversations / month',
      '50 deep-research turns / month',
      '3 portfolios · 25 holdings each',
      '8 files / month',
      '1 watchlist · up to 20 symbols',
      'Email support within 48h',
    ],
    cta: 'Start with Starter',
  },
  {
    name: 'Pro',
    monthly: '$39',
    annualNote: '$32/mo billed annually ($384/yr)',
    blurb: 'Best for daily analyst work.',
    priceValue: '39',
    featured: true,
    features: [
      'Advanced AI model',
      '1,000 conversations / month',
      '300 deep-research turns / month',
      '10 portfolios · 50 holdings each',
      '30 files / month',
      'Auto-refresh quotes every 15 min',
      'Export dashboard to a deck',
      'Email support within 24h',
    ],
    cta: 'Go Pro',
  },
  {
    name: 'Power',
    monthly: '$129',
    annualNote: '$104/mo billed annually · + usage overage',
    blurb: 'For power users and pros.',
    priceValue: '129',
    features: [
      'Everything in Pro, plus:',
      'Unlimited conversations & research',
      'Unlimited portfolios · 100 holdings',
      '100+ files / month',
      'Real-time quotes on demand (5-min auto)',
      'Unlimited dashboard exports',
      'Shared Slack channel support',
    ],
    cta: 'Talk to us',
  },
];

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Is there a free trial of Pro?',
    a: 'Every new account gets 7 days of full Pro access on signup — no credit card required. After the trial you choose your plan or stay on Free.',
  },
  {
    q: 'What counts as one "conversation"?',
    a: 'One back-and-forth thread with the AI on a topic — including follow-ups and tool calls inside that thread. We count the whole thread as one conversation against your monthly quota.',
  },
  {
    q: 'How does file generation work?',
    a: 'Ask the AI to make a PowerPoint, Word, or Excel file. We generate it, host it on Cloudflare R2, and give you a 7-day download link in chat. Each file counts as one against your monthly quota regardless of length, and always uses the Advanced AI model.',
  },
  {
    q: 'Can I switch between monthly and annual billing?',
    a: 'Yes, any time. Monthly → annual charges a prorated annual amount and shifts your renewal date. Annual → monthly takes effect at your next renewal.',
  },
  {
    q: 'Will my data carry over if I upgrade or downgrade?',
    a: 'Yes. Portfolios, holdings, memory entries, and conversation history move with your account. If you downgrade past a limit, older data becomes read-only until you remove some or upgrade — nothing is deleted.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Major credit cards via Stripe. Local methods (Alipay, WeChat Pay) for supported regions are on the roadmap.',
  },
];

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
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
        offers: PLANS.map((p) => ({
          '@type': 'Offer',
          name: p.name,
          price: p.priceValue,
          priceCurrency: 'USD',
          description: p.blurb,
          url: `${SITE_URL}/pricing`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
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
            Plans &amp; pricing
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            An AI analyst for the price of a few coffees.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Research, model, and draft equity work in plain English. Annual plans
            save 20%. Every new account gets a 7-day Pro trial — no card required.
          </p>
        </div>
      </section>

      {/* Plan cards */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-xl border bg-card p-6 ${
                  plan.featured ? 'border-[color:var(--accent)]' : 'border-border'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-6">
                    <Badge variant="accent" size="default">
                      Most popular
                    </Badge>
                  </div>
                )}
                <h2 className="font-serif text-lg font-semibold tracking-tight text-foreground">
                  {plan.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{plan.blurb}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-semibold tracking-tight text-foreground">
                    {plan.monthly}
                  </span>
                  <span className="text-sm text-subtle">/mo</span>
                </div>
                <p className="mt-1 text-xs text-subtle">{plan.annualNote}</p>
                <Button asChild size="default" variant={plan.featured ? 'default' : 'outline'} className="mt-5">
                  <Link href={chatHref}>{plan.cta}</Link>
                </Button>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--accent)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-subtle">
            All 8 indicator dimensions and unlimited long-term memory are included on every plan.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <dl className="mt-8 space-y-7">
            {FAQ.map((f) => (
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
