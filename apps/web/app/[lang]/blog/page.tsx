import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { isLocale, locales, defaultLocale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getAllPosts } from '../../../lib/blog';
import { LocalizedLink } from '../../../components/i18n/localized-link';

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
  const title = 'Blog — PickSkill';
  const description =
    'Stock theses, valuation explainers, and analyst how-tos from the team building PickSkill — the AI analyst that researches, models, and drafts equity work in plain English.';
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang === defaultLocale ? '' : lang + '/'}blog`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l === defaultLocale ? '' : l + '/'}blog`]),
      ),
    },
    openGraph: {
      title,
      description,
      type: 'website',
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

  const posts = getAllPosts();

  // Blog JSON-LD: a single Blog entity wrapping the list. Article
  // schema lives on each post page, not here.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PickSkill Blog',
    url: `https://pickskill.com${getLocalizedPath('/blog', lang)}`,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://pickskill.com${getLocalizedPath(`/blog/${p.slug}`, lang)}`,
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
          PickSkill · Blog
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Notes from the desk of an AI analyst.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Stock theses, valuation explainers, and analyst how-tos from the
          team building PickSkill. No fluff, no recycled press releases.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No posts yet. Check back soon.
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
                    {formatDate(p.publishedAt)} · {p.readingMinutes} min
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--accent)] transition-transform group-hover:translate-x-0.5">
                  Read post <ArrowRight className="size-3" />
                </span>
              </LocalizedLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  // Render in en-US format on the server to avoid locale flicker; we
  // can re-localise later when content is translated.
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
