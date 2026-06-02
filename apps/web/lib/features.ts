import type { Locale } from './i18n/locales';
import { features as frFeatures } from './marketing-i18n/fr';
import { features as deFeatures } from './marketing-i18n/de';
import { features as esFeatures } from './marketing-i18n/es';
import { features as jaFeatures } from './marketing-i18n/ja';
import { features as koFeatures } from './marketing-i18n/ko';
import { features as zhCNFeatures } from './marketing-i18n/zh-CN';
import { features as zhTWFeatures } from './marketing-i18n/zh-TW';

/**
 * Feature catalogue — structure + localized content.
 *
 * Structure (slug, image, CTA target, order) is locale-independent and
 * lives in `featureList`. All display text is localized in `featuresI18n`,
 * keyed by locale. English (`en`) is the source of truth and the only
 * required entry; any locale without a full translation falls back to
 * English via `getFeaturesContent` (same English-first pattern as the
 * blog). Translators add a locale by appending one entry to `featuresI18n`.
 */

export const featureSlugs = ['portfolio-indicators', 'research-documents', 'ai-analyst'] as const;
export type FeatureSlug = (typeof featureSlugs)[number];

export interface FeatureMeta {
  slug: FeatureSlug;
  /** Hero/OG image path under /public (locale-independent). */
  image: string;
  /** Primary CTA target (a clean, unprefixed path). */
  ctaHref: string;
}

/** Locale-independent structure + ordering. */
export const featureList: FeatureMeta[] = [
  { slug: 'portfolio-indicators', image: '/features/portfolio-indicators/hero.png', ctaHref: '/portfolios' },
  { slug: 'research-documents', image: '/features/research-documents/hero.png', ctaHref: '/chat' },
  { slug: 'ai-analyst', image: '/features/ai-analyst/hero.png', ctaHref: '/chat' },
];

export interface FeatureItemContent {
  eyebrow: string;
  name: string;
  tagline: string;
  /** Meta description (≤ ~155 chars). */
  description: string;
  headline: string;
  imageAlt: string;
  ctaLabel: string;
  capabilities: { title: string; body: string }[];
  howItWorks: { step: string; detail: string }[];
  faq: { q: string; a: string }[];
}

export interface FeaturesContent {
  /** /features index meta + hero + shared labels. */
  index: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    headline: string;
    sub: string;
    tryFree: string;
    /** "Explore {name}" — {name} is substituted at render time. */
    explore: string;
  };
  /** Section labels shared across detail pages. */
  sections: {
    whatItDoes: string;
    howItWorks: string;
    faqHeading: string;
    ctaSubtitle: string;
    moreFeatures: string;
  };
  /** Per-feature content, keyed by slug. */
  items: Record<FeatureSlug, FeatureItemContent>;
}

const en: FeaturesContent = {
  index: {
    metaTitle: 'Features — PickSkill',
    metaDescription:
      'What PickSkill does: an AI analyst for research and valuation, an 8-dimension portfolio indicators dashboard, and investor-grade PowerPoint / Word / Excel generation.',
    eyebrow: 'Features',
    headline: 'An AI analyst, a signals dashboard, and a document factory.',
    sub: 'PickSkill researches, models, and drafts your equity work — then turns the read into a deck, a report, or a live portfolio you can share. Here is what each piece does.',
    tryFree: 'Try it free',
    explore: 'Explore {name}',
  },
  sections: {
    whatItDoes: 'What it does',
    howItWorks: 'How it works',
    faqHeading: 'Frequently asked questions',
    ctaSubtitle: 'Free to try — 30 conversations a month, no card required.',
    moreFeatures: 'More features',
  },
  items: {
    'portfolio-indicators': {
      eyebrow: 'Analysis',
      name: 'Portfolio Indicators',
      tagline: 'Eight technical lenses on every holding — with a 5-day signal trail that filters single-bar noise.',
      description:
        'Track US, HK, and A-share holdings across 8 technical dimensions — MACD, RSI, KDJ, Bollinger, ADX, MAs, volume, capital flow — each with a 5-day signal trail.',
      headline: 'Every holding, eight ways — at a glance.',
      imageAlt:
        'Product mockup of the PickSkill indicators dashboard — a grid of holdings, each with MACD/RSI/KDJ/flow signal buckets and a 5-day trail.',
      ctaLabel: 'Open the analyst',
      capabilities: [
        { title: 'Eight indicator dimensions', body: 'MACD, moving averages (20/60/200), RSI, KDJ, Bollinger Bands, ADX, volume, and capital flow — computed on the latest close for each holding, with divergence and support/resistance scans on top.' },
        { title: 'The 5-day signal trail', body: 'Every dimension ships a 5-day bucket trail so you see whether a bullish call is stable, flipping, or flickering — not a single noisy bar masquerading as a signal.' },
        { title: 'Built for US, HK and A-shares', body: 'Limit-up / limit-down / halt bars are detected and masked as neutral, so a string of ±10% limit days never fakes a strong-trend bucket. The same math, market-aware.' },
        { title: 'Cross-indicator at a glance', body: 'Hover any holding to line up every dimension at once. The disciplined multi-signal read — trend filter + momentum trigger + participation — in one scan instead of eight tabs.' },
        { title: 'Export to chat, then to a deck', body: 'Send the dashboard view into a chat and turn it into a PowerPoint, Word, or Excel in one click — the indicator read becomes a shareable artefact.' },
      ],
      howItWorks: [
        { step: 'Add your holdings', detail: 'Build a portfolio of US, HK, or A-share tickers, added by symbol.' },
        { step: 'Read the signals + trail', detail: 'Open the indicators dashboard. Every holding shows all 8 dimensions plus the 5-day bucket trail.' },
        { step: 'Filter with the multi-signal view', detail: 'Use ADX as the regime filter, MACD/RSI/KDJ as triggers, volume + flow as confirmation.' },
        { step: 'Export to a deck', detail: 'Turn the read into a PowerPoint, Word, or Excel for a second opinion or a client.' },
      ],
      faq: [
        { q: 'Which indicators are included?', a: 'All eight dimensions on every plan: MACD, moving averages (20/60/200), RSI(14), KDJ(9,3,3), Bollinger Bands(20,2), ADX/DMI(14), volume/price relationship, and a capital-flow proxy — plus divergence and support/resistance scans. Any new dimension we add is included for everyone.' },
        { q: 'What is the 5-day signal trail?', a: 'For each indicator, the bucket call (bullish / neutral / bearish) is recomputed for the last 5 trading days and shown as a trail. A signal that holds for 5 days is very different from one that flips daily — the trail makes that visible and filters single-bar noise.' },
        { q: 'Does it work on Chinese A-shares?', a: 'Yes. The dashboards detect A-share limit-up / limit-down / halt bars (high == low) and mask them as neutral, so degenerate bars never produce false-positive buckets. KDJ is surfaced as the primary oscillator on A-share names per local convention.' },
      ],
    },
    'research-documents': {
      eyebrow: 'Output',
      name: 'Research Documents',
      tagline: 'Investor-grade PowerPoint, Word, and Excel — generated from a prompt, sourced from live data, editable on download.',
      description:
        'Generate native .pptx decks, .docx reports, and .xlsx models from a single prompt — every chart sourced from live filings and market data, every file editable.',
      headline: 'From a prompt to a presentation-ready deck.',
      imageAlt:
        'Product mockup showing a generated PowerPoint deck, Word report, and Excel model fanned out — the PickSkill research-document output stack.',
      ctaLabel: 'Generate a document',
      capabilities: [
        { title: 'PowerPoint, Word, and Excel', body: 'Native .pptx / .docx / .xlsx — not screenshots, not PDFs. Open in PowerPoint, Keynote, Word, Google Docs, Excel, or Sheets and edit every slide, paragraph, and cell.' },
        { title: 'Sourced from live data', body: 'Charts and tables are built from the most recent SEC filings, market feeds, and computed indicators — not the model’s memory. Every number traces to a source.' },
        { title: 'Investor-deck conventions', body: 'Decks follow the structure analysts actually present: thesis on slide 2, valuation explicit, risks pre-mortem’d. Excel workbooks ship multi-sheet with real cross-sheet formulas.' },
        { title: 'Edit by re-prompting', body: 'Push a margin assumption, reorder slides, add a scenario — ask in chat and the file regenerates. No template hell, no manual re-formatting.' },
        { title: 'Eight languages', body: 'Generate the same deck or report in English, Simplified / Traditional Chinese, Japanese, Korean, German, French, or Spanish — for the audience you’re presenting to.' },
        { title: 'Delivered as a download link', body: 'Files are hosted on Cloudflare R2 and delivered as a 7-day download link in chat — share it, or pull it into your own deck.' },
      ],
      howItWorks: [
        { step: 'Do the research in chat', detail: 'Build a DCF, read a 10-K, compare peers — the conversation becomes the source material.' },
        { step: 'Ask for the document', detail: '"Turn this into a 12-slide investor deck" or "build a 5-year DCF in Excel". One sentence.' },
        { step: 'Download the file', detail: 'A real .pptx / .docx / .xlsx, ready in ~30–60 seconds with a 7-day link.' },
        { step: 'Edit or regenerate', detail: 'Open and edit directly, or re-prompt in chat to change assumptions and get a fresh file.' },
      ],
      faq: [
        { q: 'Are the files real Office documents?', a: 'Yes — native .pptx, .docx, and .xlsx generated via OfficeCLI, not screenshots or PDFs. They open and edit in PowerPoint, Keynote, Word, Excel, Google Workspace, and LibreOffice. Every shape, table, and formula is a real Office object.' },
        { q: 'Where does the data come from?', a: 'Live sources at generation time: SEC EDGAR filings (and HKEx / Cninfo for HK / A-shares), market-data feeds, and the indicators computed on the latest close. The model composes from sourced primitives rather than its training data, which is why the numbers are current and traceable.' },
        { q: 'How many files can I generate?', a: 'Depends on plan: Free 2/month, Starter 8, Pro 30, Power 100+. Output quality is the same on every plan. Download links are retained for 7 days.' },
      ],
    },
    'ai-analyst': {
      eyebrow: 'Research',
      name: 'AI Analyst',
      tagline: 'Ask anything you’d ask a junior analyst — get sourced answers, live models, and memory that holds your thesis across sessions.',
      description:
        'An AI analyst that researches SEC filings and market data, builds DCF models, reads 10-Ks, and remembers your thesis across sessions — in plain English.',
      headline: 'The analyst that does the research, modelling, and drafting.',
      imageAlt:
        'Product mockup of the PickSkill chat — a research question, a sourced answer with citations and a chart, and a memory chip holding the thesis.',
      ctaLabel: 'Ask the analyst',
      capabilities: [
        { title: 'Valuation on demand', body: 'Full discounted-cash-flow models with sensitivity tables, comparable-company analysis, and reverse DCFs — sourced inputs, editable assumptions, in seconds.' },
        { title: 'Reads filings for you', body: 'Summarises a 10-K in 60 seconds, diffs Risk Factors year-over-year, surfaces MD&A signal and footnotes to chase — every claim linked to the page on EDGAR.' },
        { title: 'Multi-source research', body: 'Pulls web, filings, and market data in one turn, then answers with citations — not a confident guess. Honest about what it can and can’t verify.' },
        { title: 'Long-term memory', body: 'Remembers your thesis, the tickers you track, and your preferences across sessions, so you pick up where you left off instead of re-explaining context every time.' },
        { title: 'US, HK and A-share coverage', body: 'Recognises NYSE/NASDAQ, HKEx, and SSE/SZSE tickers and pulls the right filing set and market conventions per market.' },
      ],
      howItWorks: [
        { step: 'Ask in plain English', detail: '"Build a 5-year DCF on TSMC", "what changed in NVDA’s risk factors", "compare AMD and Intel on FCF".' },
        { step: 'It researches', detail: 'Pulls filings, market data, and the web — runs the model or the comparison — and shows its work.' },
        { step: 'Get a sourced answer', detail: 'A researched response with citations, charts, and downloadable artefacts — not a black-box guess.' },
        { step: 'It remembers', detail: 'Your thesis and context persist across sessions, so the next question builds on the last.' },
      ],
      faq: [
        { q: 'How is this different from asking ChatGPT?', a: 'PickSkill grounds every answer in live data — it pulls the actual 10-K, computes the DCF, runs the indicators, and cites sources at query time. Generic chatbots answer from training data and routinely fabricate financial figures. The grounding is the difference, especially for valuation and filings work.' },
        { q: 'What does "memory" actually remember?', a: 'Your investment thesis, the tickers you track, preferences, and prior conversation context — persisted across sessions and scoped to your account. You can review and edit memory entries, and they’re unlimited on every plan.' },
        { q: 'Which markets are covered?', a: 'US (NYSE / NASDAQ), Hong Kong (HKEx), and Chinese A-shares (SSE / SZSE). The analyst pulls market-appropriate filings — 10-K/10-Q for US, interim/annual for HK, and the 扣非 net-income line for A-shares.' },
      ],
    },
  },
};

/**
 * Localized feature content. `en` is required and canonical; each other
 * locale lives in its own module under lib/marketing-i18n/ (so translators
 * never edit the same file concurrently). Those modules import only the
 * TYPE from here, so the value graph stays acyclic. Missing locales fall
 * back to English (see `getFeaturesContent`).
 */
export const featuresI18n: Partial<Record<Locale, FeaturesContent>> & { en: FeaturesContent } = {
  en,
  fr: frFeatures,
  de: deFeatures,
  es: esFeatures,
  ja: jaFeatures,
  ko: koFeatures,
  'zh-CN': zhCNFeatures,
  'zh-TW': zhTWFeatures,
};

export function getFeaturesContent(locale: Locale): FeaturesContent {
  return featuresI18n[locale] ?? featuresI18n.en;
}

export function getFeatureSlugs(): readonly string[] {
  return featureSlugs;
}
