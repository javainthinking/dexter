import type { Locale } from './i18n/locales';
import { pricing as frPricing } from './marketing-i18n/fr';
import { pricing as dePricing } from './marketing-i18n/de';
import { pricing as esPricing } from './marketing-i18n/es';
import { pricing as jaPricing } from './marketing-i18n/ja';
import { pricing as koPricing } from './marketing-i18n/ko';
import { pricing as zhCNPricing } from './marketing-i18n/zh-CN';
import { pricing as zhTWPricing } from './marketing-i18n/zh-TW';

/**
 * Pricing content — structure + localized copy.
 *
 * Plan tier names (Free / Starter / Pro / Power) and prices ($0 / $15 /
 * $39 / $129) are brand/numeric constants and live in `planMeta`
 * (locale-independent). All prose — blurbs, feature bullets, annual
 * notes, FAQ, hero — is localized in `pricingI18n`, keyed by locale, with
 * English as the canonical source and the fallback for any untranslated
 * locale (see `getPricingContent`).
 */

export const planIds = ['free', 'starter', 'pro', 'power'] as const;
export type PlanId = (typeof planIds)[number];

export interface PlanMeta {
  id: PlanId;
  /** Display name — a brand tier label, not translated. */
  name: string;
  /** Monthly price string, e.g. "$15" — not translated. */
  monthly: string;
  /** Per-month price when billed annually, e.g. "$12" — not translated. */
  annualMonthly: string;
  /** Total billed once per year, e.g. "$144". Null for Free (nothing billed). */
  annualTotal: string | null;
  /** Numeric monthly price for schema offers. */
  priceValue: string;
  featured?: boolean;
}

export const planMeta: PlanMeta[] = [
  { id: 'free', name: 'Free', monthly: '$0', annualMonthly: '$0', annualTotal: null, priceValue: '0' },
  { id: 'starter', name: 'Starter', monthly: '$15', annualMonthly: '$12', annualTotal: '$144', priceValue: '15' },
  { id: 'pro', name: 'Pro', monthly: '$39', annualMonthly: '$32', annualTotal: '$384', priceValue: '39', featured: true },
  { id: 'power', name: 'Power', monthly: '$129', annualMonthly: '$104', annualTotal: '$1,248', priceValue: '129' },
];

export interface PlanCopy {
  blurb: string;
  annualNote: string;
  cta: string;
  features: string[];
}

/**
 * One cell value in the plan-comparison matrix. `true` renders a check,
 * `false` renders a dash, a string renders verbatim (e.g. "30", "Unlimited",
 * "Priority email"). Numbers are kept as strings so locales can localize words
 * like "Unlimited" while leaving digits untouched.
 */
export type ComparisonValue = string | boolean;

export interface ComparisonRow {
  label: string;
  /** Exactly four values, ordered Free, Starter, Pro, Power. */
  values: ComparisonValue[];
}

export interface ComparisonGroup {
  title: string;
  rows: ComparisonRow[];
}

export interface PricingContent {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSub: string;
  perMonth: string;
  mostPopular: string;
  everyPlanNote: string;
  comparisonHeading: string;
  faqHeading: string;
  /** Monthly/annual billing toggle labels + the annual sub-line phrasing. */
  billing: {
    /** Toggle label for monthly billing. */
    monthly: string;
    /** Toggle label for annual billing. */
    annual: string;
    /** Savings badge on the annual toggle, e.g. "Save 20%". */
    save: string;
    /** Suffix after the annual total, e.g. "$144 billed annually". */
    billedAnnually: string;
  };
  plans: Record<PlanId, PlanCopy>;
  comparison: ComparisonGroup[];
  faq: { q: string; a: string }[];
}

const en: PricingContent = {
  metaTitle: 'Pricing — PickSkill',
  metaDescription:
    'PickSkill plans: Free, Starter $15/mo, Pro $39/mo, Power $129/mo. Annual billing saves 20%. Cancel anytime.',
  heroEyebrow: 'Plans & pricing',
  heroHeadline: 'An AI analyst for the price of a few coffees.',
  heroSub:
    'Research, model, and draft equity work in plain English. Annual plans save 20%. Cancel anytime.',
  perMonth: '/mo',
  mostPopular: 'Most popular',
  everyPlanNote:
    'All 8 indicator dimensions and unlimited long-term memory are included on every plan.',
  comparisonHeading: 'Compare plans',
  billing: {
    monthly: 'Monthly',
    annual: 'Annual',
    save: 'Save 20%',
    billedAnnually: 'billed annually',
  },
  faqHeading: 'Frequently asked questions',
  plans: {
    free: {
      blurb: 'Try the AI analyst.',
      annualNote: 'No card required',
      cta: 'Try free',
      features: [
        '30 conversations / month',
        '5 deep-research turns / month',
        '1 portfolio · 10 holdings',
        '2 generated files / month (PPT / Word / Excel)',
        'All 8 indicator dimensions',
        'Unlimited long-term memory',
      ],
    },
    starter: {
      blurb: 'For the active retail investor.',
      annualNote: '$12/mo billed annually ($144/yr)',
      cta: 'Start with Starter',
      features: [
        '200 conversations / month',
        '50 deep-research turns / month',
        '3 portfolios · 25 holdings each',
        '8 generated files / month (PPT / Word / Excel)',
        'Email support',
      ],
    },
    pro: {
      blurb: 'Best for daily analyst work.',
      annualNote: '$32/mo billed annually ($384/yr)',
      cta: 'Go Pro',
      features: [
        '1,000 conversations / month',
        '300 deep-research turns / month',
        '10 portfolios · 50 holdings each',
        '30 generated files / month (PPT / Word / Excel)',
        'Email support',
      ],
    },
    power: {
      blurb: 'For power users and pros.',
      annualNote: '$104/mo billed annually ($1,248/yr)',
      cta: 'Go Power',
      features: [
        'Everything in Pro, plus:',
        'Unlimited conversations & research',
        'Unlimited portfolios · 100 holdings',
        '100+ generated files / month (PPT / Word / Excel)',
        'Priority email support',
      ],
    },
  },
  comparison: [
    {
      title: 'The AI assistant',
      rows: [
        { label: 'Conversations / month', values: ['30', '200', '1,000', 'Unlimited'] },
        { label: 'Deep-research turns / month', values: ['5', '50', '300', 'Unlimited'] },
        { label: 'Specialised workflows (DCF, X research)', values: [true, true, true, true] },
        { label: 'Long-term memory', values: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited'] },
      ],
    },
    {
      title: 'Documents',
      rows: [
        { label: 'Files / month (PPT · Word · Excel)', values: ['2', '8', '30', '100+'] },
        { label: 'Download links retained', values: ['7 days', '7 days', '7 days', '7 days'] },
      ],
    },
    {
      title: 'Portfolios',
      rows: [
        { label: 'Portfolios', values: ['1', '3', '10', 'Unlimited'] },
        { label: 'Holdings per portfolio', values: ['10', '25', '50', '100'] },
        { label: 'Quote refresh', values: ['On-demand', 'On-demand', 'On-demand', 'On-demand'] },
      ],
    },
    {
      title: 'Indicators dashboard',
      rows: [
        { label: 'Technical dimensions', values: ['All 8', 'All 8', 'All 8', 'All 8'] },
        { label: 'Export dashboard (PPT / Word / Excel)', values: [true, true, true, true] },
      ],
    },
    {
      title: 'Markets & languages',
      rows: [
        { label: 'Market coverage (US · HK · A-share)', values: [true, true, true, true] },
        { label: 'Output languages', values: ['8', '8', '8', '8'] },
      ],
    },
    {
      title: 'Support',
      rows: [
        { label: 'Support', values: ['Community', 'Email', 'Email', 'Priority email'] },
        { label: 'Cancel anytime', values: [true, true, true, true] },
      ],
    },
  ],
  faq: [
    { q: 'What counts as one "conversation"?', a: 'One back-and-forth thread with the AI on a topic — including follow-ups and tool calls inside that thread. We count the whole thread as one conversation against your monthly quota.' },
    { q: 'How does file generation work?', a: 'Ask the AI to make a PowerPoint, Word, or Excel file. We generate it, host it on Cloudflare R2, and give you a 7-day download link in chat. Each file counts as one against your monthly quota regardless of how many slides, pages, or rows it contains.' },
    { q: 'Can I switch between monthly and annual billing?', a: 'Yes, any time. Monthly → annual charges a prorated annual amount and shifts your renewal date. Annual → monthly takes effect at your next renewal.' },
    { q: 'Will my data carry over if I upgrade or downgrade?', a: 'Yes. Portfolios, holdings, memory entries, and conversation history move with your account. If you downgrade past a limit, older data becomes read-only until you remove some or upgrade — nothing is deleted.' },
    { q: 'What payment methods do you accept?', a: 'Major credit cards via Stripe. Local methods (Alipay, WeChat Pay) for supported regions are on the roadmap.' },
  ],
};

/**
 * Localized pricing content. `en` is required and canonical; add a locale
 * by appending its translated `PricingContent`. Missing locales fall back
 * to English.
 */
export const pricingI18n: Partial<Record<Locale, PricingContent>> & { en: PricingContent } = {
  en,
  fr: frPricing,
  de: dePricing,
  es: esPricing,
  ja: jaPricing,
  ko: koPricing,
  'zh-CN': zhCNPricing,
  'zh-TW': zhTWPricing,
};

export function getPricingContent(locale: Locale): PricingContent {
  return pricingI18n[locale] ?? pricingI18n.en;
}
