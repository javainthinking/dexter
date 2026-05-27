import { getAllPosts } from '../../lib/blog';
import { features } from '../../lib/features';

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
- [Pricing](${SITE_URL}/pricing): Free / Starter $15 / Pro $39 / Power $129+ tiers. Differentiator is unlimited memory + file generation quota + auto-refresh portfolio quotes on higher tiers.
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

  const featureLines = features
    .map(
      (f) =>
        `- [${f.name}](${SITE_URL}/features/${f.slug}): ${f.description}`,
    )
    .join('\n');

  const body = `${HEADER}
## Features

- [Features overview](${SITE_URL}/features): What PickSkill does — the AI analyst, the indicators dashboard, and document generation.
${featureLines}

## Blog

${blogLines}
${FOOTER}`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
