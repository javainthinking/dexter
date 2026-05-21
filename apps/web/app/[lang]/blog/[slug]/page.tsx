import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { isLocale, locales, defaultLocale } from '../../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../../lib/i18n/paths';
import { getAllSlugs, getPostBySlug } from '../../../../lib/blog';
import { LocalizedLink } from '../../../../components/i18n/localized-link';

/**
 * /[lang]/blog/[slug] — single post.
 *
 * Renders markdown via react-markdown so we don't have to wire up MDX
 * yet (gray-matter + react-markdown are already deps). When we want
 * embedded JSX (custom shortcodes like <FaqBlock />), migrating to
 * MDX is a separate refactor — the frontmatter shape stays the same.
 *
 * SEO + GEO checklist (matches blog-strategy.md §4):
 *   - Article + BreadcrumbList + Person JSON-LD ✓
 *   - Author byline at top ✓
 *   - Hero image + alt text ✓
 *   - "Last updated" surfaced visually + in schema ✓
 *   - Server-rendered (Next.js generateStaticParams) ✓
 *   - Canonical URL + hreflang languages map ✓
 *   - OG image (uses hero image if set) ✓
 *   - "Back to blog" + product CTA at the bottom ✓
 */

export function generateStaticParams() {
  const slugs = getAllSlugs();
  // Emit (lang × slug) combinations so every locale's URL is
  // pre-rendered. Content is English-only for now; localized variants
  // can later live at content/blog/<locale>/<slug>.md.
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = getPostBySlug(slug);
  if (!post) return {};
  const canonical = `/${lang === defaultLocale ? '' : lang + '/'}blog/${post.slug}`;
  return {
    title: `${post.title} — PickSkill`,
    description: post.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((l) => [
          l,
          `/${l === defaultLocale ? '' : l + '/'}blog/${post.slug}`,
        ]),
      ),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author.name],
      ...(post.heroImage && {
        images: [{ url: post.heroImage, alt: post.heroAlt ?? post.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(post.heroImage && { images: [post.heroImage] }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const siteUrl = 'https://pickskill.com';
  const postUrl = `${siteUrl}${getLocalizedPath(`/blog/${post.slug}`, lang)}`;
  const blogUrl = `${siteUrl}${getLocalizedPath('/blog', lang)}`;
  const homeUrl = `${siteUrl}${getLocalizedPath('/', lang)}`;

  // Article schema — the load-bearing GEO signal. Includes Person,
  // headline, dates, image, mainEntityOfPage so AI overviews and
  // Google rich results can both parse it.
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.url && { url: post.author.url }),
      ...(post.author.bio && { description: post.author.bio }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'PickSkill',
      url: siteUrl,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    ...(post.heroImage && {
      image: {
        '@type': 'ImageObject',
        url: `${siteUrl}${post.heroImage}`,
        ...(post.heroAlt && { caption: post.heroAlt }),
      },
    }),
    keywords: post.tags.join(', '),
  };

  // Breadcrumbs schema — helps Google show the post inside the right
  // section in search results.
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: blogUrl },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav className="mb-6">
        <LocalizedLink
          href="/blog"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3" /> Back to blog
        </LocalizedLink>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
            {post.pillar}
          </span>
          <span className="font-mono text-[10px] text-subtle">
            {formatDate(post.publishedAt)} · {post.readingMinutes} min read
          </span>
        </div>
        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
          {/* Author byline — visible at top per GEO best practice
              (authority signal must appear above the fold). */}
          <div className="flex size-9 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs text-foreground">
            {post.author.name
              .split(/\s+/)
              .map((s) => s[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {post.author.url ? (
                <a
                  href={post.author.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[color:var(--accent)]"
                >
                  {post.author.name}
                </a>
              ) : (
                post.author.name
              )}
            </span>
            {post.author.bio && (
              <span className="text-xs text-muted-foreground">{post.author.bio}</span>
            )}
          </div>
        </div>
      </header>

      {post.heroImage && (
        <figure className="mb-8 overflow-hidden rounded-lg border border-border">
          {/* Hero. Using a plain <img> for SVG/PNG mix; next/image
              would need configured loaders for SVG. Alt text is the
              AI-crawler signal — never leave it blank. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.heroImage}
            alt={post.heroAlt ?? post.title}
            className="w-full"
            loading="eager"
          />
        </figure>
      )}

      <div className="prose-dexter">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {post.body}
        </ReactMarkdown>
      </div>

      <footer className="mt-12 space-y-6 border-t border-border pt-10">
        {/* Primary CTA at the bottom: convert engaged reader to a
            trial. Subtle, not over-aggressive. */}
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="font-serif text-xl font-semibold leading-snug text-foreground">
            Want PickSkill to build this for you?
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Open a chat and ask. The AI pulls live data, runs the
            calculation, and drops the result into a deck, doc, or
            spreadsheet you can download.
          </p>
          <LocalizedLink
            href="/chat"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-xs font-medium text-background hover:opacity-90"
          >
            Try a free chat
            <ArrowRight className="size-3.5" />
          </LocalizedLink>
        </div>

        {/* Tags + meta footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <span>Updated {formatDate(post.updatedAt)}</span>
          )}
        </div>
      </footer>
    </article>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Suppress next/image not used warning — using <img> for SVG hero
// support without configuring image loaders. Phase 2 will swap to
// next/image when posts use PNG heroes exclusively.
void Image;
