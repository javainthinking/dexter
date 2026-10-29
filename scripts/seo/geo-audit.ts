/**
 * SEO / GEO content audit for the PickSkill blog (and, with --live, the deployed site).
 *
 *   bun run scripts/seo/geo-audit.ts                 # full survey → stdout (exit 0)
 *   bun run scripts/seo/geo-audit.ts --out <file>    # same, written to a file
 *   bun run scripts/seo/geo-audit.ts --gate          # pre-commit gate: errors on new/changed values only (exit 1)
 *   bun run scripts/seo/geo-audit.ts --live          # + live pages, llms.txt and robots.txt
 *
 * The survey is a map, not a to-do list: most of the corpus predates these
 * rules, and only pages with impressions to lose are worth rewriting. The gate
 * therefore compares against origin/main value by value — touching a post's
 * body must not fail on its pre-existing title.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import matter from 'gray-matter';
import { extractFaq } from '../../apps/web/lib/blog';
import { arg, flag, LOCALES, ROOT, SITE_URL, WEB, writeText, type Locale } from './lib';

const BLOG = join(WEB, 'content', 'blog');
const GATE = flag('gate');
const LIVE = flag('live');
const BASE_REF = arg('base') ?? 'origin/main';

/**
 * SERP width in "units": full-width glyphs (CJK, kana, hangul) count 2, the
 * rest 1. Character counts are wrong in both directions across 8 locales —
 * a 30-character Chinese title is already as wide as a 60-character English one.
 * The rendered <title> is `<title> — PickSkill`, so the suffix is counted.
 */
const TITLE_SUFFIX = ' — PickSkill';
const TITLE_BUDGET = 65;
const DESC_BUDGET = 160;
const units = (s: string) => [...s].reduce((n, ch) => n + (/[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯]/.test(ch) ? 2 : 1), 0);
const STALE_DAYS = 180;

type Level = 'error' | 'warn';
interface Finding {
  level: Level;
  rule: string;
  file: string;
  detail: string;
}
const findings: Finding[] = [];
const add = (level: Level, rule: string, file: string, detail: string) => findings.push({ level, rule, file, detail });

// ---- corpus ----

interface Doc {
  locale: Locale;
  slug: string;
  file: string;
  rel: string;
  data: Record<string, unknown>;
  body: string;
}
const docs: Doc[] = [];
for (const locale of LOCALES) {
  const dir = locale === 'en' ? BLOG : join(BLOG, locale);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md') && !f.endsWith('.mdx')) continue;
    const file = join(dir, f);
    const { data, content } = matter(readFileSync(file, 'utf8'));
    docs.push({ locale, slug: f.replace(/\.mdx?$/, ''), file, rel: relative(ROOT, file), data, body: content });
  }
}
const enSlugs = new Set(docs.filter((d) => d.locale === 'en').map((d) => d.slug));
const dateStr = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === 'string' ? v : '');

// ---- what changed vs the base ref (gate mode) ----

function baseValue(rel: string): Record<string, unknown> | null {
  try {
    const raw = execFileSync('git', ['show', `${BASE_REF}:${rel}`], { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    return matter(raw).data;
  } catch {
    return null; // new file
  }
}
function changedFiles(): Set<string> {
  const run = (args: string[]) =>
    execFileSync('git', args, { cwd: ROOT }).toString().split('\n').filter(Boolean);
  return new Set([
    ...run(['diff', '--name-only', `${BASE_REF}...HEAD`]),
    ...run(['diff', '--name-only']),
    ...run(['diff', '--name-only', '--cached']),
    ...run(['ls-files', '--others', '--exclude-standard']),
  ]);
}
const changed = GATE ? changedFiles() : null;
const inScope = (d: Doc) => !changed || changed.has(d.rel);

// ---- per-document rules ----

const descByLocale = new Map<string, Doc[]>();
for (const d of docs) {
  const title = String(d.data.title ?? '');
  const desc = String(d.data.description ?? '');
  const base = GATE && inScope(d) ? baseValue(d.rel) : null;
  const isNewValue = (key: string) => !GATE || !base || String(base[key] ?? '') !== String(d.data[key] ?? '');

  if (!title || !desc || !dateStr(d.data.publishedAt)) add('error', 'meta-present', d.rel, 'title / description / publishedAt 缺失');
  if (title && isNewValue('title') && units(title + TITLE_SUFFIX) > TITLE_BUDGET)
    add('error', 'title-width', d.rel, `${units(title + TITLE_SUFFIX)} > ${TITLE_BUDGET} units：${title}`);
  if (desc && isNewValue('description') && units(desc) > DESC_BUDGET)
    add('error', 'desc-width', d.rel, `${units(desc)} > ${DESC_BUDGET} units`);
  if (desc) (descByLocale.get(`${d.locale}\u0000${desc}`) ?? descByLocale.set(`${d.locale}\u0000${desc}`, []).get(`${d.locale}\u0000${desc}`)!).push(d);

  // FAQPage schema is generated from the ## FAQ section; < 3 entries means a thin or missing schema.
  const faq = extractFaq(d.body).length;
  if (faq < 3) add('error', 'faq-min-3', d.rel, `FAQ 条目 ${faq}（FAQPage schema 由 ## FAQ 段生成）`);

  // Internal blog links must resolve (a renamed slug silently 404s every translation that links to it).
  for (const m of d.body.matchAll(/\]\((?:https:\/\/pickskill\.ai)?(?:\/[a-z]{2}(?:-[A-Z]{2})?)?\/blog\/([a-z0-9-]+)\/?(?:#[^)]*)?\)/g)) {
    if (!enSlugs.has(m[1])) add('error', 'broken-blog-link', d.rel, `/blog/${m[1]} 不存在`);
  }

  // GEO: answer-first. Answer engines lift the opening paragraph; ours lead with a bolded direct answer.
  const lead = d.body.trim().split(/\n\s*\n/)[0] ?? '';
  if (!lead.startsWith('**')) add('warn', 'answer-first', d.rel, '首段不是加粗的直接答案');
  if (!d.data.heroImage || !d.data.heroAlt) add('warn', 'hero-alt', d.rel, 'heroImage / heroAlt 缺失');
  const internal = (d.body.match(/\]\((?:https:\/\/pickskill\.ai)?\/[^)]*\)/g) ?? []).length;
  if (internal < 3) add('warn', 'internal-links', d.rel, `站内链接 ${internal} < 3`);
  const updated = dateStr(d.data.updatedAt) || dateStr(d.data.publishedAt);
  if (updated && (Date.now() - Date.parse(updated)) / 86_400_000 > STALE_DAYS)
    add('warn', 'freshness', d.rel, `最后更新 ${updated}（> ${STALE_DAYS} 天）`);
  if (d.locale === 'en' || d.locale.startsWith('zh')) {
    const h2 = [...d.body.matchAll(/^## (.+)$/gm)].map((m) => m[1]).filter((h) => !/^FAQ\b/i.test(h));
    const q = h2.filter((h) => /[?？]\s*$/.test(h)).length;
    if (h2.length >= 3 && q / h2.length < 0.4)
      add('warn', 'question-h2', d.rel, `疑问句 H2 ${q}/${h2.length}（段落级可引用性）`);
  }

  // Translation lagging its English source.
  if (d.locale !== 'en') {
    const src = docs.find((x) => x.locale === 'en' && x.slug === d.slug);
    const srcUpdated = src ? dateStr(src.data.updatedAt) || dateStr(src.data.publishedAt) : '';
    if (srcUpdated && updated && srcUpdated > updated) add('warn', 'translation-stale', d.rel, `英文源 ${srcUpdated} 晚于译文 ${updated}`);
  }
}
for (const group of descByLocale.values()) {
  if (group.length > 1)
    for (const d of group) add('error', 'desc-unique', d.rel, `与 ${group.filter((g) => g !== d).map((g) => g.slug).join(', ')} 共用 description`);
}

// ---- translation coverage ----

const gaps = new Map<Locale, string[]>();
for (const locale of LOCALES) {
  if (locale === 'en') continue;
  const have = new Set(docs.filter((d) => d.locale === locale).map((d) => d.slug));
  gaps.set(locale, [...enSlugs].filter((s) => !have.has(s)).sort());
}

// ---- live checks ----

interface LiveRow {
  url: string;
  status: number;
  issues: string[];
}
const live: LiveRow[] = [];
const siteNotes: string[] = [];
if (LIVE) {
  const sitemap = await (await fetch(`${SITE_URL}/sitemap.xml`)).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const queue = [...urls];
  const worker = async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      const res = await fetch(url, { redirect: 'manual' });
      const html = res.status === 200 ? await res.text() : '';
      const issues: string[] = [];
      if (res.status !== 200) issues.push(`HTTP ${res.status}`);
      else {
        const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
        const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
        const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
        const hreflang = (html.match(/<link rel="alternate" hrefLang="/gi) ?? []).length;
        const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
        const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
          try {
            const j = JSON.parse(m[1]);
            return (Array.isArray(j) ? j : [j]).map((x) => x['@type']);
          } catch {
            return ['(invalid JSON-LD)'];
          }
        });
        if (!title) issues.push('无 <title>');
        else if (units(title) > TITLE_BUDGET) issues.push(`title ${units(title)} units`);
        if (!desc) issues.push('无 meta description');
        if (canonical && canonical !== url) issues.push(`canonical → ${canonical}`);
        if (!canonical) issues.push('无 canonical');
        if (hreflang < 2) issues.push(`hreflang ${hreflang}`);
        if (h1 !== 1) issues.push(`H1 × ${h1}`);
        if (url.includes('/blog/')) {
          for (const t of ['BlogPosting', 'BreadcrumbList', 'FAQPage']) if (!ld.includes(t)) issues.push(`缺 ${t}`);
        }
        if (ld.includes('(invalid JSON-LD)')) issues.push('JSON-LD 解析失败');
      }
      live.push({ url, status: res.status, issues });
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  live.sort((a, b) => a.url.localeCompare(b.url));

  const llms = await (await fetch(`${SITE_URL}/llms.txt`)).text();
  const missing = [...enSlugs].filter((s) => !llms.includes(`/blog/${s}`));
  siteNotes.push(missing.length ? `llms.txt 缺 ${missing.length} 篇：${missing.join(', ')}` : `llms.txt 覆盖全部 ${enSlugs.size} 篇英文博客 ✅`);

  const robots = await (await fetch(`${SITE_URL}/robots.txt`)).text();
  for (const bot of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Bingbot']) {
    const group = robots.split(/\n\s*\n/).find((g) => new RegExp(`^User-agent:\\s*${bot}\\s*$`, 'im').test(g));
    const verdict = !group ? '无专属组（走 * 组）' : /^Disallow:\s*\/\s*$/im.test(group) ? '❌ 全站禁止' : '✅ 允许';
    siteNotes.push(`robots ${bot}: ${verdict}`);
  }
}

// ---- output ----

const scoped = changed ? findings.filter((f) => changed.has(f.file)) : findings;
const errors = scoped.filter((f) => f.level === 'error');
const L: string[] = [];
L.push(`# PickSkill GEO / SEO audit — ${new Date().toISOString().slice(0, 10)}`);
L.push('');
L.push(`- 语料：${docs.length} 个文件（英文 ${enSlugs.size} 篇）；模式：${GATE ? `gate（只看相对 ${BASE_REF} 新增/改动的值）` : '全量调查'}`);
L.push(`- 预算：title（含「${TITLE_SUFFIX.trim()}」）≤ ${TITLE_BUDGET} units，description ≤ ${DESC_BUDGET} units（全角 2、半角 1）`);
L.push('');
L.push('## 规则汇总');
L.push('');
L.push('| 规则 | 级别 | 命中 |');
L.push('|---|---|---|');
const byRule = new Map<string, Finding[]>();
for (const f of scoped) (byRule.get(f.rule) ?? byRule.set(f.rule, []).get(f.rule)!).push(f);
for (const [rule, fs] of [...byRule].sort((a, b) => a[0].localeCompare(b[0]))) L.push(`| ${rule} | ${fs[0].level} | ${fs.length} |`);
L.push('');
L.push('## 译文覆盖');
L.push('');
L.push('| 语种 | 缺失篇数 | 缺失 slug |');
L.push('|---|---|---|');
for (const [locale, missing] of gaps) L.push(`| ${locale} | ${missing.length} | ${missing.join(', ') || '—'} |`);
L.push('');
if (LIVE) {
  L.push('## 线上');
  L.push('');
  for (const n of siteNotes) L.push(`- ${n}`);
  const bad = live.filter((r) => r.issues.length);
  L.push(`- 页面：${live.length} 个 sitemap URL，${bad.length} 个有问题`);
  L.push('');
  if (bad.length) {
    L.push('| URL | 问题 |');
    L.push('|---|---|');
    for (const r of bad) L.push(`| ${r.url.replace(SITE_URL, '') || '/'} | ${r.issues.join('；')} |`);
    L.push('');
  }
}
L.push('## 明细');
L.push('');
for (const [rule, fs] of [...byRule].sort((a, b) => a[0].localeCompare(b[0]))) {
  L.push(`### ${rule}（${fs.length}）`);
  L.push('');
  for (const f of fs.slice(0, 60)) L.push(`- \`${f.file.replace('apps/web/content/blog/', '')}\` ${f.detail}`);
  if (fs.length > 60) L.push(`- …另 ${fs.length - 60} 条`);
  L.push('');
}

const text = L.join('\n');
if (arg('out')) {
  writeText(arg('out')!, text + '\n');
  console.log(`✅ ${arg('out')}`);
} else console.log(text);

if (GATE) {
  if (errors.length) {
    console.error(`\n❌ geo-audit gate: ${errors.length} error(s) in changed content`);
    for (const e of errors) console.error(`   ${e.rule}  ${e.file}  ${e.detail}`);
    process.exit(1);
  }
  console.error('\n✅ geo-audit gate: no errors in changed content');
}
