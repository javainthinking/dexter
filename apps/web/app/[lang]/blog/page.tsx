import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import {
  isLocale,
  locales,
  localeBcp47,
  localeOg,
  type Locale,
} from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { generateAlternatesMetadata } from '../../../lib/i18n/seo';
import { getAllPosts } from '../../../lib/blog';
import { LocalizedLink } from '../../../components/i18n/localized-link';
import { getDictionary } from '../dictionaries';

const SITE_URL = 'https://pickskill.com';
const SITE_NAME = 'PickSkill';

/**
 * /[lang]/blog — index of every published post, newest first.
 *
 * Server component so the post list is rendered to HTML at build
 * time (AI crawlers don't execute JS — GEO criterion #5 in
 * blog-strategy.md). generateStaticParams emits one page per locale
 * for hreflang correctness.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const title = dict.blog.meta.indexTitle;
  const description = dict.blog.meta.indexDescription;
  return {
    title,
    description,
    alternates: generateAlternatesMetadata({ path: '/blog', locale: lang as Locale }),
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: `${SITE_URL}${getLocalizedPath('/blog', lang as Locale)}`,
      locale: localeOg[lang as Locale],
      alternateLocale: locales
        .filter((l) => l !== lang)
        .map((l) => localeOg[l]),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@pickskill',
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const posts = getAllPosts();

  // Blog JSON-LD: a single Blog entity wrapping the list. Article
  // schema lives on each post page, not here.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PickSkill Blog',
    url: `${SITE_URL}${getLocalizedPath('/blog', lang as Locale)}`,
    inLanguage: localeBcp47[lang as Locale],
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}${getLocalizedPath(`/blog/${p.slug}`, lang as Locale)}`,
      datePublished: p.publishedAt,
      ...(p.updatedAt && { dateModified: p.updatedAt }),
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-10 border-b border-border pb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          {dict.blog.index.eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {dict.blog.index.heading}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {dict.blog.index.subtitle}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {dict.blog.index.empty}
        </p>
      ) : (
        <ul className="space-y-8">
          {posts.map((p) => (
            <li key={p.slug}>
              <LocalizedLink
                href={`/blog/${p.slug}`}
                className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                    {p.pillar}
                  </span>
                  <span className="font-mono text-[10px] text-subtle">
                    {formatDate(p.publishedAt, lang)} ·{' '}
                    {dict.blog.index.minRead.replace('{count}', String(p.readingMinutes))}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--accent)] transition-transform group-hover:translate-x-0.5">
                  {dict.blog.index.readPost} <ArrowRight className="size-3" />
                </span>
              </LocalizedLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatDate(iso: string, locale: string): string {
  // Use the BCP-47 locale tag directly — Intl.DateTimeFormat resolves
  // zh-CN, ja, ko, etc. natively. Server-rendered so no client flicker.
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
