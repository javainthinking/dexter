import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  isLocale,
  locales,
  defaultLocale,
  localeBcp47,
  localeOg,
  type Locale,
} from '../../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../../lib/i18n/paths';
import { generateAlternatesMetadata } from '../../../../lib/i18n/seo';
import { extractFaq, getAllSlugs, getPostBySlug } from '../../../../lib/blog';
import { LocalizedLink } from '../../../../components/i18n/localized-link';
import { getDictionary } from '../../dictionaries';

const SITE_URL = 'https://pickskill.com';
const SITE_NAME = 'PickSkill';

/**
 * /[lang]/blog/[slug] — single post.
 *
 * Renders markdown via react-markdown so we don't have to wire up MDX
 * yet (gray-matter + react-markdown are already deps). When we want
 * embedded JSX (custom shortcodes like <FaqBlock />), migrating to
 * MDX is a separate refactor — the frontmatter shape stays the same.
 *
 * SEO + GEO checklist (matches blog-strategy.md §4):
 *   - Article + BreadcrumbList + Person/Organization JSON-LD ✓
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
  const post = getPostBySlug(slug, lang as Locale);
  if (!post) return {};

  // Canonical + hreflang via the shared helper — same logic the rest
  // of the app uses for chat / portfolios / etc. The helper emits
  // BCP-47 keys (e.g. "zh-CN", "x-default") that Google + Bing expect.
  const alternates = generateAlternatesMetadata({
    path: `/blog/${post.slug}`,
    locale: lang as Locale,
  });
  // OG card image: the PNG path (post.heroImage). Twitter/LinkedIn/
  // Slack/Discord OG renderers don't reliably support WebP/AVIF/SVG,
  // so we deliberately use the source PNG here. Inline rendering on
  // the page goes through next/image for AVIF/WebP — see the
  // <figure> in the body.
  const ogImage = post.heroImage
    ? [
        {
          url: `${SITE_URL}${post.heroImage}`,
          width: 1200,
          height: 630,
          alt: post.heroAlt ?? post.title,
        },
      ]
    : undefined;

  return {
    title: `${post.title} — PickSkill`,
    description: post.description,
    alternates,
    // Tell crawlers explicitly: index, follow, and give us the wide
    // preview treatment that AI overviews + Google Discover prefer.
    // Defaults are conservative; spelling them out unlocks richer
    // SERP cards.
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      siteName: SITE_NAME,
      url: `${SITE_URL}${getLocalizedPath(`/blog/${post.slug}`, lang as Locale)}`,
      // OG locale is the underscore form (en_US, zh_CN) — different
      // from BCP-47 used in hreflang. localeOg map handles the
      // translation. alternateLocale lists every OTHER locale the
      // same URL is available in, so Facebook crawlers know to fetch
      // the localized variants when sharing a post from a different
      // language.
      locale: localeOg[lang as Locale],
      alternateLocale: locales
        .filter((l) => l !== lang)
        .map((l) => localeOg[l]),
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      ...(ogImage && { images: ogImage }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(post.author.twitter && { creator: `@${post.author.twitter}` }),
      site: '@pickskill',
      ...(ogImage && { images: ogImage.map((i) => i.url) }),
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
  const post = getPostBySlug(slug, lang as Locale);
  if (!post) notFound();
  const dict = await getDictionary(lang);

  const postUrl = `${SITE_URL}${getLocalizedPath(`/blog/${post.slug}`, lang as Locale)}`;
  const blogUrl = `${SITE_URL}${getLocalizedPath('/blog', lang as Locale)}`;
  const homeUrl = `${SITE_URL}${getLocalizedPath('/', lang as Locale)}`;

  // BlogPosting JSON-LD — the load-bearing GEO signal. Includes:
  //   - inLanguage: BCP-47 tag of the body's actual language. Critical
  //     for multilingual sites — tells AI crawlers which language to
  //     index this version under, separately from the URL's /lang/
  //     prefix.
  //   - publisher.logo with explicit dimensions (Google's Article rich
  //     result schema validator expects an ImageObject, not a string).
  //   - wordCount + timeRequired so AI overviews can show "5 min read"
  //     style annotations.
  //   - image with width/height — also a Google rich-result requirement.
  const articleSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    inLanguage: localeBcp47[post.inLanguage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    wordCount: post.body.split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${post.readingMinutes}M`,
    author: {
      '@type': /team|group|staff|editors?/i.test(post.author.name) ? 'Organization' : 'Person',
      name: post.author.name,
      ...(post.author.url && { url: post.author.url }),
      ...(post.author.bio && { description: post.author.bio }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
        width: 60,
        height: 60,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    keywords: post.tags.join(', '),
  };
  if (post.heroImage) {
    articleSchema.image = {
      '@type': 'ImageObject',
      url: `${SITE_URL}${post.heroImage}`,
      width: 1200,
      height: 630,
      ...(post.heroAlt && { caption: post.heroAlt }),
    };
  }

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

  // FAQPage schema — emitted only when the post body contains an
  // extractable FAQ section (## FAQ + bold-Q / paragraph-A pattern).
  // Google deprecated FAQ rich results for commercial sites in Aug
  // 2023, BUT:
  //   - AI overviews (ChatGPT web search, Perplexity, Google AIO)
  //     still consume FAQPage as a structured citation signal — and
  //     this blog is partly an AI-overview play (see blog-strategy.md
  //     §1). Worth the schema even without the SERP-result rendering.
  //   - Empty FAQ blocks get flagged by validators; only emit when
  //     extractFaq returns ≥ 1 entries.
  const faqEntries = extractFaq(post.body);
  const faqSchema =
    faqEntries.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          inLanguage: localeBcp47[post.inLanguage],
          mainEntity: faqEntries.map((e) => ({
            '@type': 'Question',
            name: e.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: e.answer,
            },
          })),
        }
      : null;

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <nav className="mb-6">
        <LocalizedLink
          href="/blog"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3" /> {dict.blog.post.backToBlog}
        </LocalizedLink>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
            {post.pillar}
          </span>
          <span className="font-mono text-[10px] text-subtle">
            {formatDate(post.publishedAt, lang)} ·{' '}
            {dict.blog.post.minRead.replace('{count}', String(post.readingMinutes))}
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
          {/* Hero via next/image — Next serves AVIF/WebP automatically
              based on the request's Accept header, generates
              responsive srcset for high-DPI screens, and lazy-loads
              everything below the fold. Heroes are produced at
              1200×630; we provide the same explicit dimensions so the
              optimizer doesn't have to fetch the source to measure.
              SVG sources are passed through unoptimized — Next's
              optimizer refuses SVGs by default (security: SVG can
              contain scripts) and there's no compression upside.
              Priority load (no lazy) since the hero is the LCP
              element on a post page. */}
          <Image
            src={post.heroImage}
            alt={post.heroAlt ?? post.title}
            width={1200}
            height={630}
            priority
            unoptimized={post.heroImage.endsWith('.svg')}
            className="w-full"
            sizes="(max-width: 768px) 100vw, 768px"
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
            {dict.blog.post.cta.title}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {dict.blog.post.cta.body}
          </p>
          <LocalizedLink
            href="/chat"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-xs font-medium text-background hover:opacity-90"
          >
            {dict.blog.post.cta.button}
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
            <span>
              {dict.blog.post.updated.replace(
                '{date}',
                formatDate(post.updatedAt, lang),
              )}
            </span>
          )}
        </div>
      </footer>
    </article>
  );
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

