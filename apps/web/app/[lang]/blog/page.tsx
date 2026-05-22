import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
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
import { getAllPosts, type PostMeta } from '../../../lib/blog';
import { LocalizedLink } from '../../../components/i18n/localized-link';
import { getDictionary, type Dictionary } from '../dictionaries';

const SITE_URL = 'https://pickskill.ai';
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
  const posts = getAllPosts(lang as Locale);

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

  // Index layout: the newest post gets a "featured" card with a wide
  // image on top + larger title (vertical layout). Every subsequent
  // post renders as a horizontal card — thumbnail on the left,
  // content on the right. On mobile, all cards stack vertically.
  // This gives the most-recent post the visual weight it deserves
  // without making the rest of the index feel like a list of footnotes.
  const [featured, ...rest] = posts;

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
        <div className="space-y-8">
          {featured && (
            <FeaturedCard post={featured} lang={lang} dict={dict} />
          )}
          {rest.length > 0 && (
            <ul className="space-y-6">
              {rest.map((p) => (
                <li key={p.slug}>
                  <CompactCard post={p} lang={lang} dict={dict} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Featured (newest) post card — full-width image on top, big title
 * and description below. `priority` on the image so it counts as the
 * LCP element for /blog and is not lazy-loaded.
 */
function FeaturedCard({
  post,
  lang,
  dict,
}: {
  post: PostMeta;
  lang: string;
  dict: Dictionary;
}) {
  return (
    <LocalizedLink
      href={`/blog/${post.slug}`}
      // lang attribute is per-card, not per-page: the post may be
      // served in English fallback even when the rest of the page is,
      // say, Japanese. Telling the browser / screen readers / search
      // engines the actual language of this card's title + description
      // is more honest than letting them inherit the page locale.
      lang={post.inLanguage}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-border-strong hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {post.heroImage && (
        <div className="relative aspect-[1200/630] w-full overflow-hidden bg-muted">
          <Image
            src={post.heroImage}
            alt={post.heroAlt ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            priority
            unoptimized={post.heroImage.endsWith('.svg')}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-5 sm:p-7">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
            {dict.blog.pillars?.[post.pillar] ?? post.pillar}
          </span>
          <span className="font-mono text-[10px] text-subtle">
            {formatDate(post.publishedAt, lang)} ·{' '}
            {dict.blog.index.minRead.replace('{count}', String(post.readingMinutes))}
          </span>
        </div>
        <h2 className="font-serif text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
          {post.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {post.description}
        </p>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--accent)] transition-transform group-hover:translate-x-0.5">
          {dict.blog.index.readPost} <ArrowRight className="size-3" />
        </span>
      </div>
    </LocalizedLink>
  );
}

/**
 * Compact card for follow-up posts — thumbnail on the left,
 * content on the right at >=sm breakpoint; stacks vertically on
 * mobile. Image lazy-loaded (browser default for non-priority
 * next/image).
 */
function CompactCard({
  post,
  lang,
  dict,
}: {
  post: PostMeta;
  lang: string;
  dict: Dictionary;
}) {
  return (
    <LocalizedLink
      href={`/blog/${post.slug}`}
      lang={post.inLanguage}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-border-strong hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row"
    >
      {post.heroImage && (
        <div className="relative aspect-[1200/630] w-full shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:w-[260px] sm:self-stretch">
          <Image
            src={post.heroImage}
            alt={post.heroAlt ?? post.title}
            fill
            sizes="(max-width: 640px) 100vw, 260px"
            unoptimized={post.heroImage.endsWith('.svg')}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
            {dict.blog.pillars?.[post.pillar] ?? post.pillar}
          </span>
          <span className="font-mono text-[10px] text-subtle">
            {formatDate(post.publishedAt, lang)} ·{' '}
            {dict.blog.index.minRead.replace('{count}', String(post.readingMinutes))}
          </span>
        </div>
        <h2 className="font-serif text-lg font-semibold leading-snug text-foreground sm:text-xl">
          {post.title}
        </h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-[color:var(--accent)] transition-transform group-hover:translate-x-0.5">
          {dict.blog.index.readPost} <ArrowRight className="size-3" />
        </span>
      </div>
    </LocalizedLink>
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
