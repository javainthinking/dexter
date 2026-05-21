/**
 * Blog post loader. Reads markdown files from `apps/web/content/blog/`
 * at build time, parses YAML frontmatter via gray-matter (already a
 * project dep), and returns typed metadata + body.
 *
 * Reads happen during Next.js static generation, so the entire blog
 * corpus is baked into the build. No runtime FS access on Vercel.
 *
 * The frontmatter shape is fixed (see PostMeta). A future migration
 * to MDX (richer JSX in posts) keeps the same frontmatter — only the
 * body rendering changes.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { defaultLocale, type Locale } from './i18n/locales';

const CONTENT_DIR = join(process.cwd(), 'content', 'blog');

/** Editorial pillar; matches blog-strategy.md §3. */
export type Pillar = 'thesis' | 'how-to' | 'explainer' | 'macro' | 'build-in-public' | 'research';

export interface PostAuthor {
  name: string;
  /** Public profile URL (LinkedIn / Twitter / personal site). */
  url?: string;
  /** Twitter handle without the @. */
  twitter?: string;
  /** One-line credential / role surfaced under the byline. */
  bio?: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  /** Meta description — keep ≤ 155 chars. */
  description: string;
  /** ISO date string yyyy-mm-dd. */
  publishedAt: string;
  /** Optional ISO date — shown in schema as dateModified. */
  updatedAt?: string;
  author: PostAuthor;
  pillar: Pillar;
  tags: string[];
  /** Path under `/public` (e.g. `/blog/<slug>/hero.png`). Optional. */
  heroImage?: string;
  /** Alt text for the hero — AI crawlers read this. */
  heroAlt?: string;
  /** Estimated reading time in minutes (computed from body length). */
  readingMinutes: number;
  /**
   * Which locale's content this metadata was loaded from. Equals the
   * requested locale when a translated variant exists; otherwise
   * `defaultLocale` (English fallback). Lets the index render an
   * accurate `lang=` attribute per card and lets future code highlight
   * which posts still need translation.
   */
  inLanguage: Locale;
}

export interface Post extends PostMeta {
  /** Raw markdown body (with frontmatter stripped). */
  body: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

const isMarkdown = (filename: string) =>
  filename.endsWith('.md') || filename.endsWith('.mdx');

function parseFile(slug: string, raw: string, inLanguage: Locale): Post {
  const { data, content } = matter(raw);
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  // Avg 200 wpm; round up to nearest minute so a 60-word definition
  // doesn't read as "0 min".
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    publishedAt: String(data.publishedAt ?? ''),
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    author: (data.author as PostAuthor) ?? { name: 'PickSkill' },
    pillar: (data.pillar as Pillar) ?? 'explainer',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    heroImage: data.heroImage ? String(data.heroImage) : undefined,
    heroAlt: data.heroAlt ? String(data.heroAlt) : undefined,
    readingMinutes,
    inLanguage,
    body: content,
  };
}

/**
 * Return metadata for every post, sorted by publishedAt descending.
 * Locale-aware: when a translated variant exists at
 * `content/blog/<locale>/<slug>.md`, its frontmatter (title,
 * description, pillar label, etc.) is used; otherwise the English
 * source is the fallback. So the /blog index cards render in the
 * user's language wherever a translation is available, and in
 * English (with `inLanguage='en'` on each card) for posts that
 * haven't been translated yet.
 *
 * Slugs come from the English root — it's the authoritative slug set,
 * and translated variants are required to mirror that filename so the
 * canonical URL stays stable across locales (a slug change would
 * break hreflang).
 *
 * Body is omitted from the return; the index doesn't need it and
 * dropping it keeps the server → client payload small.
 */
export function getAllPosts(locale: Locale = defaultLocale): PostMeta[] {
  let files: string[];
  try {
    files = readdirSync(CONTENT_DIR);
  } catch {
    // Content dir doesn't exist yet — fine, return empty list.
    return [];
  }
  const posts: PostMeta[] = [];
  for (const f of files) {
    if (!isMarkdown(f)) continue;
    const full = join(CONTENT_DIR, f);
    if (!statSync(full).isFile()) continue;
    const slug = f.replace(/\.(md|mdx)$/, '');
    const post = getPostBySlug(slug, locale);
    if (!post) continue;
    const { body, ...meta } = post;
    void body;
    posts.push(meta);
  }
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * Look up a single post by slug. Locale-aware lookup order:
 *   1. content/blog/<locale>/<slug>.md         (translated variant)
 *   2. content/blog/<locale>/<slug>.mdx
 *   3. content/blog/<slug>.md                  (English source = fallback)
 *   4. content/blog/<slug>.mdx
 *
 * Returns `null` if nothing matches. The returned Post's `inLanguage`
 * reflects which file actually served — so a zh-CN request that falls
 * through to the English source comes back with inLanguage='en', and
 * the schema honestly tells crawlers what language the body is in.
 */
export function getPostBySlug(slug: string, locale: Locale = defaultLocale): Post | null {
  const candidates: Array<{ path: string; lang: Locale }> = [];
  if (locale !== defaultLocale) {
    for (const ext of ['md', 'mdx']) {
      candidates.push({
        path: join(CONTENT_DIR, locale, `${slug}.${ext}`),
        lang: locale,
      });
    }
  }
  for (const ext of ['md', 'mdx']) {
    candidates.push({
      path: join(CONTENT_DIR, `${slug}.${ext}`),
      lang: defaultLocale,
    });
  }
  for (const { path, lang } of candidates) {
    try {
      const raw = readFileSync(path, 'utf-8');
      return parseFile(slug, raw, lang);
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Extract FAQ entries from a markdown body. Convention (documented in
 * apps/web/docs/blog-i18n.md): an H2 starting with "FAQ", followed by
 * alternating `**question?**` and answer paragraph blocks until the
 * next H2 or end-of-document.
 *
 * Used to emit FAQPage JSON-LD. Returns an empty array when no FAQ
 * section is found — caller must skip schema injection in that case
 * (an empty FAQPage block is worse than no block; Google flags it).
 *
 * Implementation note: split on H2 boundaries first, then run the
 * Q/A regex inside the FAQ segment. Cleaner than a single nested
 * regex with multiple lookaheads — the earlier version's
 * `(?=^##\s|\n*$)` lookahead matched empty strings at end-of-line,
 * which starved the non-greedy capture to zero characters. The split
 * approach is also locale-friendly: only the "FAQ" detection needs
 * localizing later, not the entire grammar.
 */
export function extractFaq(body: string): FaqEntry[] {
  // Split on H2 boundaries. After the split, every segment except the
  // first starts with that H2's heading text (the `\n## ` separator
  // is consumed by the split).
  const segments = body.split(/\n##\s+/);
  // Find the FAQ segment by its leading word. Anchored on \b so we
  // don't false-match a heading like "FAQs about pricing" — though
  // any leading-FAQ heading is fine. Future i18n: this regex can
  // accept localized "FAQ" headings via a per-locale token list.
  let faqSection: string | undefined;
  for (const seg of segments) {
    if (/^FAQ\b/i.test(seg)) {
      // Strip the heading line itself; keep just the Q/A body.
      const newline = seg.indexOf('\n');
      faqSection = newline >= 0 ? seg.slice(newline + 1) : '';
      break;
    }
  }
  if (!faqSection) return [];

  const entries: FaqEntry[] = [];
  // `**Question?**\nAnswer text...` until next **bold-question** or
  // end-of-section. No /m flag — $ here is end-of-input (the sliced
  // faqSection has no further H2 sections), which is exactly the
  // boundary we want.
  const re = /\*\*([^*\n]+?)\*\*\s*\n+([\s\S]+?)(?=\n+\*\*|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(faqSection)) !== null) {
    const question = m[1].trim();
    const answer = m[2].trim();
    if (question && answer) entries.push({ question, answer });
  }
  return entries;
}

/** All slugs — for generateStaticParams. */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
