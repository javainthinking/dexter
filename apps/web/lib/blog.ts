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
}

export interface Post extends PostMeta {
  /** Raw markdown body (with frontmatter stripped). */
  body: string;
}

const isMarkdown = (filename: string) =>
  filename.endsWith('.md') || filename.endsWith('.mdx');

function parseFile(slug: string, raw: string): PostMeta & { body: string } {
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
    body: content,
  };
}

/**
 * Return metadata for every post, sorted by publishedAt descending.
 * Body is omitted for the index list (saves serialization on the
 * server → client boundary).
 */
export function getAllPosts(): PostMeta[] {
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
    const raw = readFileSync(full, 'utf-8');
    const { body, ...meta } = parseFile(slug, raw);
    void body; // intentionally drop body for list view
    posts.push(meta);
  }
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * Look up a single post by slug. Returns null if not found. Includes
 * the full body for rendering.
 */
export function getPostBySlug(slug: string): Post | null {
  for (const ext of ['md', 'mdx'] as const) {
    try {
      const raw = readFileSync(join(CONTENT_DIR, `${slug}.${ext}`), 'utf-8');
      return parseFile(slug, raw);
    } catch {
      continue;
    }
  }
  return null;
}

/** All slugs — for generateStaticParams. */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
