/**
 * Shared helpers for the SEO / GEO loop (loops/loop-gsc-optimization).
 *
 * Every script in scripts/seo/ runs from the repo root with Bun:
 *   bun run scripts/seo/<name>.ts
 *
 * Env comes from the repo-root .env.local and apps/web/.env.local (whichever
 * defines a key first wins; the shell environment always wins over both):
 *   GSC_SERVICE_ACCOUNT_KEY_FILE  absolute path to the service-account JSON
 *   GSC_SITE_URL                  e.g. sc-domain:pickskill.ai (auto-detected by gsc-verify)
 *   DIRECT_URL / DATABASE_URL     Postgres (DIRECT_URL preferred — no pgbouncer)
 */

import { createSign } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import postgres from 'postgres';

export const ROOT = join(import.meta.dir, '..', '..');
export const WEB = join(ROOT, 'apps', 'web');
export const LOOP_DIR = join(ROOT, 'loops', 'loop-gsc-optimization');
export const SITE_URL = 'https://pickskill.ai';
export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

/** Mirrors apps/web/lib/i18n/locales.ts — `en` is unprefixed. */
export const LOCALES = ['en', 'fr', 'de', 'es', 'ja', 'ko', 'zh-CN', 'zh-TW'] as const;
export type Locale = (typeof LOCALES)[number];

for (const file of [join(ROOT, '.env.local'), join(WEB, '.env.local')]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

export function requireEnv(...names: string[]): void {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    console.error(`❌ Missing env: ${missing.join(', ')} (repo-root .env.local)`);
    process.exit(1);
  }
}

export function arg(name: string): string | undefined {
  const args = process.argv.slice(2);
  const i = args.indexOf(`--${name}`);
  if (i >= 0) return args[i + 1];
  const eq = args.find((a) => a.startsWith(`--${name}=`));
  return eq?.slice(name.length + 3);
}
export const flag = (name: string) => process.argv.slice(2).includes(`--${name}`);

// ---- dates (UTC calendar days; GSC reports in PT but day keys are plain dates) ----

export const fmt = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (d: Date | string, n: number) => {
  const x = new Date(typeof d === 'string' ? `${d}T00:00:00Z` : d.getTime());
  x.setUTCDate(x.getUTCDate() + n);
  return x;
};
/** GSC data lags ~3 days; the newest day worth requesting. */
export const latestAvailable = () => addDays(new Date(), -3);

// ---- database ----

export function db() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error('❌ DIRECT_URL or DATABASE_URL must be set');
    process.exit(1);
  }
  return postgres(url, { prepare: false, max: 2, onnotice: () => {} });
}

export const T_DAILY = 'dexter_gsc_daily';
export const T_TOTALS = 'dexter_gsc_totals_daily';

// ---- GSC auth (service account JWT, no SDK) ----

export type GscScope = 'readonly' | 'full';

export async function gscToken(scope: GscScope = 'readonly'): Promise<{ token: string; email: string }> {
  requireEnv('GSC_SERVICE_ACCOUNT_KEY_FILE');
  const key = JSON.parse(readFileSync(process.env.GSC_SERVICE_ACCOUNT_KEY_FILE!, 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  const b64 = (s: string) => Buffer.from(s).toString('base64url');
  const header = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64(
    JSON.stringify({
      iss: key.client_email,
      scope: `https://www.googleapis.com/auth/webmasters${scope === 'readonly' ? '.readonly' : ''}`,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${signer.sign(key.private_key).toString('base64url')}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const data = (await res.json()) as { access_token?: string };
  if (!res.ok || !data.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  return { token: data.access_token, email: key.client_email };
}

export const gscSiteBase = () =>
  `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(process.env.GSC_SITE_URL!)}`;

// ---- URLs ----

/** Locale of a pickskill.ai URL or path, from its prefix (`/zh-CN/...`). */
export function localeOf(urlOrPath: string): Locale {
  let path = urlOrPath;
  try {
    path = new URL(urlOrPath).pathname;
  } catch {
    /* already a path */
  }
  const seg = path.split('/')[1] ?? '';
  return (LOCALES as readonly string[]).includes(seg) && seg !== 'en' ? (seg as Locale) : 'en';
}

/** Path with the locale prefix removed: `/zh-CN/blog/x` → `/blog/x`. */
export function barePath(urlOrPath: string): string {
  let path = urlOrPath;
  try {
    path = new URL(urlOrPath).pathname;
  } catch {
    /* already a path */
  }
  const loc = localeOf(path);
  if (loc !== 'en') path = path.slice(loc.length + 1) || '/';
  return path.replace(/\/+$/, '') || '/';
}

/**
 * Page segment. CTR baselines are computed per segment because the traffic
 * classes convert very differently (apipick learned this the hard way: one
 * pooled baseline over-stated what a developer page could expect by 3–26x).
 */
export type Segment = 'blog' | 'stocks' | 'product';
export function segmentOf(urlOrPath: string): Segment {
  const p = barePath(urlOrPath);
  if (p.startsWith('/blog/')) return 'blog';
  if (p.startsWith('/stocks')) return 'stocks';
  return 'product';
}

// ---- experiments registry (pre-registered changes + frozen pages) ----

export interface Experiment {
  id: string;
  /** Bare paths (no locale prefix) whose every locale variant is frozen. */
  pages: string[];
  /** Read window length in full days after the push day. */
  windowDays: number;
  /** yyyy-mm-dd of the actual push (deploy). null while awaiting user confirmation. */
  publishedOn: string | null;
  status: 'pending-publish' | 'reading' | 'verdict';
  hypothesis: string;
  metric: string;
  successIf: string;
  verdict?: string;
}

export interface Registry {
  experiments: Experiment[];
  /** Closed items — never re-proposed unless `reopenIf` fires. */
  dequeued: { id: string; pages?: string[]; queries?: string[]; reason: string; reopenIf: string; closedOn: string }[];
}

export const REGISTRY_FILE = join(LOOP_DIR, 'experiments.json');

export function readRegistry(): Registry {
  if (!existsSync(REGISTRY_FILE)) return { experiments: [], dequeued: [] };
  return JSON.parse(readFileSync(REGISTRY_FILE, 'utf8'));
}

/**
 * Read-window dates for an experiment. Anchored on the ACTUAL push day, never
 * the planned one: the push day itself is partial, the window is the next N
 * full days, and GSC needs 3 more days before the last of them is in.
 */
export function readWindow(e: Experiment) {
  if (!e.publishedOn) return null;
  const start = fmt(addDays(e.publishedOn, 1));
  const end = fmt(addDays(e.publishedOn, e.windowDays));
  const readOn = fmt(addDays(e.publishedOn, e.windowDays + 3));
  return { start, end, readOn };
}

/**
 * Bare paths that must not be touched: every experiment without a verdict
 * (awaiting publish, inside its window, or due but not yet read). A page
 * thaws only once its verdict is written.
 */
export function frozenPaths(): Map<string, string> {
  const frozen = new Map<string, string>();
  for (const e of readRegistry().experiments) {
    if (e.status === 'verdict') continue;
    for (const p of e.pages) frozen.set(p, e.id);
  }
  return frozen;
}

export function writeText(file: string, text: string): void {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}
