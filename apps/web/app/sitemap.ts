import type { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/blog';
import { locales, defaultLocale, type Locale } from '../lib/i18n/locales';

/**
 * Dynamic sitemap.xml — Next.js App Router convention.
 *
 * Spec (apps/web/docs/blog-i18n.md + i18n-nextjs reference):
 *
 *   - Each public URL is listed EXACTLY ONCE. The <loc> is the
 *     default-locale URL (clean, no `/en` prefix). Every locale
 *     variant of that URL is attached as <xhtml:link rel="alternate">
 *     via `alternates.languages`, and an `x-default` entry points
 *     to the same default URL.
 *   - Emitting one entry per (URL × locale) violates Google's
 *     hreflang requirement that alternates be mutually consistent
 *     across all language variants of the same page — the previous
 *     shape duplicated each URL N times and inflated the sitemap.
 *
 * What's included:
 *   - / (homepage)
 *   - /blog (index)
 *   - /chat (public marketing entry-point — primary CTA)
 *   - /blog/<slug> for every published post
 *
 * What's excluded:
 *   - /memory, /portfolios, /indicators, /market, /feedback — behind
 *     auth, no public content for crawlers
 *   - /sign-in — utility route, zero SEO value
 *   - /api/* — never indexable
 */

const SITE_URL = 'https://pickskill.ai';

/**
 * Compose the locale-prefixed pathname. Default locale uses the
 * clean URL (no `/en` prefix) per our routing convention.
 *
 *   path('/', 'en')        → ''
 *   path('/', 'zh-CN')     → '/zh-CN'
 *   path('/blog', 'en')    → '/blog'
 *   path('/blog', 'zh-CN') → '/zh-CN/blog'
 */
function localePath(canonicalPath: string, locale: Locale): string {
  const clean = canonicalPath === '/' ? '' : canonicalPath;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean}`;
}

function localeUrl(canonicalPath: string, locale: Locale): string {
  const tail = localePath(canonicalPath, locale);
  // Homepage in the default locale: emit the bare origin (no trailing
  // slash) so the sitemap matches the canonical tag the page itself
  // renders (`<link rel="canonical" href="https://pickskill.ai">`) and
  // the head hreflang alternates. Consistency across all three avoids
  // mixed-signal canonicalization.
  return tail === '' ? SITE_URL : `${SITE_URL}${tail}`;
}

/**
 * Build the `alternates.languages` map for a given canonical path.
 * Includes every supported locale plus `x-default`. Next.js renders
 * each entry as `<xhtml:link rel="alternate" hreflang="…" href="…"/>`.
 *
 * Returned keys use BCP-47 (`en`, `zh-CN`) — already the format the
 * `locales` array stores. `x-default` mirrors the default-locale URL
 * so search engines have a fallback when none of the more specific
 * hreflangs match the user's preferences.
 */
function buildAlternates(canonicalPath: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = localeUrl(canonicalPath, locale);
  }
  languages['x-default'] = localeUrl(canonicalPath, defaultLocale);
  return languages;
}

interface StaticEntry {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
}

const STATIC_PAGES: StaticEntry[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/chat', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Slugs are locale-independent (translated variants live under
  // content/blog/<locale>/<slug>.md but reuse the English slug). One
  // call to getAllPosts() in the default locale gives the canonical
  // slug set + their lastmod stamps.
  const posts = getAllPosts(defaultLocale);
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: localeUrl(page.path, defaultLocale),
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: { languages: buildAlternates(page.path) },
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => {
    const postPath = `/blog/${p.slug}`;
    // Defensive Date construction: a malformed publishedAt / updatedAt
    // (broken YAML frontmatter that fell through gray-matter as an
    // empty string, for example) would otherwise crash the build with
    // `RangeError: Invalid time value` inside next/sitemap's
    // toISOString call. Fall through to `now` so the post still
    // appears in the sitemap and the build keeps going — the
    // underlying frontmatter bug should be fixed separately.
    const parsed = new Date(p.updatedAt ?? p.publishedAt);
    const lastModified = Number.isNaN(parsed.getTime()) ? now : parsed;
    return {
      url: localeUrl(postPath, defaultLocale),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: { languages: buildAlternates(postPath) },
    };
  });

  return [...staticEntries, ...postEntries];
}
