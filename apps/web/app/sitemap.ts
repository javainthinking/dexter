import type { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/blog';
import { locales, defaultLocale } from '../lib/i18n/locales';

/**
 * Dynamic sitemap.xml — Next.js App Router convention.
 *
 * Includes the marketing pages (/, /pricing if/when it exists, /blog)
 * plus every published blog post, emitted once per locale with
 * hreflang alternates. App-internal pages (/chat, /memory, /portfolios,
 * /indicators, /feedback) are deliberately excluded — they're behind
 * auth and don't have public content for search engines.
 *
 * Build-time call to getAllPosts() is fine — same FS read as the
 * /blog index route uses. Output is one entry per (locale × url)
 * pair with alternates language map so Google understands the
 * translations even when content is English-only today.
 */

const SITE_URL = 'https://pickskill.com';

function path(p: string, locale: string): string {
  if (locale === defaultLocale) return p === '/' ? '' : p;
  return `/${locale}${p === '/' ? '' : p}`;
}

function buildAlternates(p: string): Record<string, string> {
  return Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}${path(p, l)}` || `${SITE_URL}/`]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();

  const staticPages: Array<{
    path: string;
    priority: number;
    changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }> = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${path(page.path, locale)}` || `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: buildAlternates(page.path) },
    })),
  );

  const postEntries: MetadataRoute.Sitemap = posts.flatMap((p) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${path(`/blog/${p.slug}`, locale)}`,
      lastModified: new Date(p.updatedAt ?? p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: { languages: buildAlternates(`/blog/${p.slug}`) },
    })),
  );

  return [...staticEntries, ...postEntries];
}
