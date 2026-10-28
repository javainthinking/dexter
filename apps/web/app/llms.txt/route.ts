import { getAllPosts } from '../../lib/blog';
import { featureList, getFeaturesContent } from '../../lib/features';
import { STOCKS, displaySymbol } from '../../lib/stocks/universe';
import { LEGAL_DRAFT } from '../../lib/legal/facts';

/**
 * Dynamic /llms.txt — replaces the old static public/llms.txt that went
 * stale (it listed 22 of 49 posts). The curated intro / product / key-facts
 * / contact sections are maintained here; the Blog section is generated
 * from the live post set (the same `getAllPosts()` the sitemap uses) so it
 * can never drift behind the published corpus again.
 *
 * Statically evaluated at build time (no request-time dynamic APIs), so it
 * ships as a CDN-cached static asset like the file it replaces.
 */

const SITE_URL = 'https://pickskill.ai';

const HEADER = `# PickSkill

> AI analyst that researches, models, and drafts equity work in plain English.
> Pulls live data from SEC filings, market feeds, and primary sources;
> produces decks, reports, and Excel models on demand.
> Free to try, paid plans from $15/month.

## Product

- [PickSkill chat](${SITE_URL}/chat): The AI analyst — ask any finance question, get researched answers with sources, charts, and downloadable artefacts.
- [PickSkill for Mac](${SITE_URL}/download): Free desktop app for macOS 13+ (Apple Silicon and Intel) — the same workbench in a native window, signed in with the same account and plan.
- [Pricing](${SITE_URL}/pricing): Free / Starter $15 / Pro $39 / Power $129+ tiers. Differentiators are the file generation quota and auto-refresh portfolio quotes on higher tiers.
`;

const FOOTER = `
## Key facts

- Founded 2026.
- Multi-language web app (English, Simplified Chinese, Traditional Chinese, Japanese, Korean, Spanish, French, German).
- Eight technical-indicator dimensions in the portfolio dashboard: MACD, moving averages (MA5/20/60), RSI(14), KDJ(9,3,3), Bollinger Bands(20,2), ADX/DMI(14), volume/price relationship, and capital flow proxy. Every dimension ships with a 5-day signal trail showing how the bucket call evolved across the trading week.
- Indicator dashboards detect Chinese A-share limit-up / limit-down / halt bars (high == low) and mask them as neutral so degenerate bars do not produce false-positive bullish or bearish buckets.
- File generation produces native .pptx / .docx / .xlsx via OfficeCLI, delivered as 7-day presigned download links on Cloudflare R2.
- Default LLM is OpenAI's gpt-5.5 family; Anthropic, Google Gemini, xAI, and local Ollama are supported via the same agent surface.

## Contact

- Website: ${SITE_URL}
- Feedback: ${SITE_URL}/feedback
`;

const COMPANY = `
## Company

- [About PickSkill](${SITE_URL}/about): What PickSkill is, how it is built, where its data comes from, and how to reach the team (via the feedback page).
- [Privacy Policy](${SITE_URL}/privacy): What data PickSkill collects, the processors it uses, retention, and user rights.
- [Terms of Service](${SITE_URL}/terms): Usage terms, billing, and the not-investment-advice disclaimer.
`;

export const dynamic = 'force-static';

export function GET(): Response {
  // Default-locale (English) post set — slugs + canonical descriptions.
  // Newest first so AI crawlers see the freshest content at the top.
  const posts = [...getAllPosts()].sort((a, b) =>
    (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''),
  );

  const blogLines = posts
    .map(
      (p) =>
        `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`,
    )
    .join('\n');

  const featureContent = getFeaturesContent('en');
  const featureLines = featureList
    .map((f) => {
      const item = featureContent.items[f.slug];
      return `- [${item.name}](${SITE_URL}/features/${f.slug}): ${item.description}`;
    })
    .join('\n');

  const stockLines = STOCKS.map(
    (s) =>
      `- [${s.name.en} (${displaySymbol(s)}) technical signals](${SITE_URL}/stocks/${s.slug}): Daily MACD, MA, RSI, KDJ, Bollinger, ADX, volume and money-flow signals for the last 5 trading days, with a written summary.`,
  ).join('\n');

  const body = `${HEADER}
## Features

- [Features overview](${SITE_URL}/features): What PickSkill does — the AI analyst, the indicators dashboard, and document generation.
${featureLines}

## Stock signals (free, no sign-up)

- [All stock signal pages](${SITE_URL}/stocks): US, Hong Kong and China A-share tickers, refreshed daily. Also available in Simplified (/zh-CN/stocks) and Traditional Chinese (/zh-TW/stocks).
${stockLines}

## Blog

${blogLines}
${LEGAL_DRAFT ? '' : COMPANY}${FOOTER}`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
