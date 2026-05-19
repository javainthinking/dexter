/**
 * Download the OfficeCLI binary into apps/web/bin/ so it ships with the
 * Vercel function bundle and is also available to the local Dexter CLI
 * without a separate install.
 *
 * Why download-on-build instead of git-committing the binary:
 *   - Binary is ~31 MB per platform; committing two of them (linux + the
 *     local-dev platform) would bloat the repo by ~60 MB per version
 *     bump.
 *   - GitHub Releases is the upstream's canonical distribution channel,
 *     so following it gives us deterministic, version-pinned artifacts
 *     with checksums.
 *   - Build-time fetch is the same pattern Playwright / Puppeteer use.
 *
 * Always fetches `linux-x64` (Vercel runtime). When running on a Mac or
 * Linux dev machine, also fetches the host-platform binary so the local
 * Dexter agent can use it without the user running OfficeCLI's separate
 * install.sh.
 *
 * Run via: `bun run scripts/install-officecli.ts`
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERSION = 'v1.0.94';
const BASE_URL = `https://github.com/iOfficeAI/OfficeCLI/releases/download/${VERSION}`;
const __dirname = dirname(fileURLToPath(import.meta.url));
const BIN_DIR = join(__dirname, '..', 'apps', 'web', 'bin');

interface Asset {
  /** Filename on the GitHub release. */
  asset: string;
  /** Local filename inside apps/web/bin/. Mirrors `asset`. */
  local: string;
}

/** Linux x64 is always required — that's the Vercel runtime. */
const LINUX_X64: Asset = { asset: 'officecli-linux-x64', local: 'officecli-linux-x64' };

/** Pick a host-platform binary for local dev convenience. Vercel-only
 * builds still get linux-x64 above; this is purely additive. */
function hostAsset(): Asset | null {
  const platform = process.platform;
  const arch = process.arch;
  if (platform === 'darwin' && arch === 'arm64') {
    return { asset: 'officecli-mac-arm64', local: 'officecli-mac-arm64' };
  }
  if (platform === 'darwin' && arch === 'x64') {
    return { asset: 'officecli-mac-x64', local: 'officecli-mac-x64' };
  }
  if (platform === 'linux' && arch === 'arm64') {
    return { asset: 'officecli-linux-arm64', local: 'officecli-linux-arm64' };
  }
  // linux-x64 host is already covered by LINUX_X64; no separate fetch.
  return null;
}

async function fetchBytes(url: string): Promise<Uint8Array> {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status} ${res.statusText}`);
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

function sha256(bytes: Uint8Array): string {
  const h = createHash('sha256');
  h.update(bytes);
  return h.digest('hex');
}

/** Parse the SHA256SUMS file ("<hex>  <filename>" per line). */
function parseSums(text: string): Map<string, string> {
  const m = new Map<string, string>();
  for (const line of text.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2) continue;
    m.set(parts[parts.length - 1], parts[0]);
  }
  return m;
}

async function downloadAsset(asset: Asset, expectedHash: string | undefined, dest: string): Promise<void> {
  const url = `${BASE_URL}/${asset.asset}`;
  process.stdout.write(`  ↓ ${asset.asset} … `);
  const bytes = await fetchBytes(url);
  if (expectedHash) {
    const actual = sha256(bytes);
    if (actual !== expectedHash) {
      throw new Error(
        `checksum mismatch for ${asset.asset}: expected ${expectedHash}, got ${actual}`,
      );
    }
  }
  writeFileSync(dest, bytes);
  chmodSync(dest, 0o755);
  console.log(`ok (${(bytes.length / (1024 * 1024)).toFixed(1)} MB)`);
}

/**
 * Pull the upstream design-style library (51 curated presets, each
 * with a style.md philosophy doc). build.sh + template.pptx are
 * skipped — upstream itself says they're "for reference only" and the
 * agent doesn't read binary .pptx. ~150 KB total instead of ~30 MB.
 *
 * Source-of-truth: https://github.com/iOfficeAI/OfficeCLI/tree/main/styles
 */
const STYLES_REPO_API = 'https://api.github.com/repos/iOfficeAI/OfficeCLI/contents/styles';
const STYLES_RAW_BASE = 'https://raw.githubusercontent.com/iOfficeAI/OfficeCLI/main/styles';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      // Public-API anonymous limit is fine for the ~52 calls we make.
      'User-Agent': 'dexter-install-officecli',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status} ${res.statusText}`);
  return await res.text();
}

interface GhContent {
  name: string;
  type: 'dir' | 'file';
  sha: string;
  download_url: string | null;
}

async function syncStyles(stylesDir: string): Promise<number> {
  if (!existsSync(stylesDir)) mkdirSync(stylesDir, { recursive: true });

  // 1. INDEX.md is the agent's entry point — the topic→preset table.
  const indexText = await fetchText(`${STYLES_RAW_BASE}/INDEX.md`);
  writeFileSync(join(stylesDir, 'INDEX.md'), indexText);

  // 2. List the 51 preset directories and pull style.md from each.
  const root = await fetchJson<GhContent[]>(STYLES_REPO_API);
  const dirs = root.filter((r) => r.type === 'dir');
  let written = 0;
  for (const dir of dirs) {
    const localDir = join(stylesDir, dir.name);
    if (!existsSync(localDir)) mkdirSync(localDir, { recursive: true });
    const styleUrl = `${STYLES_RAW_BASE}/${encodeURIComponent(dir.name)}/style.md`;
    try {
      const styleText = await fetchText(styleUrl);
      writeFileSync(join(localDir, 'style.md'), styleText);
      written += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`  ⚠ ${dir.name}/style.md skipped: ${message}`);
    }
  }
  return written;
}

async function main(): Promise<void> {
  if (!existsSync(BIN_DIR)) {
    mkdirSync(BIN_DIR, { recursive: true });
  }

  console.log(`OfficeCLI ${VERSION} → ${BIN_DIR}`);

  // Fetch the SHA256SUMS once and verify both binaries against it.
  const sumsBytes = await fetchBytes(`${BASE_URL}/SHA256SUMS`);
  const sums = parseSums(new TextDecoder().decode(sumsBytes));
  writeFileSync(join(BIN_DIR, 'SHA256SUMS'), sumsBytes);

  const targets: Asset[] = [LINUX_X64];
  const host = hostAsset();
  if (host) targets.push(host);

  for (const asset of targets) {
    const dest = join(BIN_DIR, asset.local);
    // Skip re-download if the local file already matches the published
    // checksum — keeps CI/build fast on warm caches.
    if (existsSync(dest)) {
      const existing = readFileSync(dest);
      const existingHash = sha256(new Uint8Array(existing));
      if (existingHash === sums.get(asset.asset)) {
        console.log(`  ✓ ${asset.asset} (cached, checksum matches)`);
        continue;
      }
    }
    await downloadAsset(asset, sums.get(asset.asset), dest);
  }

  // Symlink-friendly alias `officecli` → host binary. The Dexter tool
  // looks up host-platform names first; this is purely a convenience
  // for users running `apps/web/bin/officecli --version` directly.
  if (host) {
    const alias = join(BIN_DIR, 'officecli');
    const hostPath = join(BIN_DIR, host.local);
    try {
      writeFileSync(alias, readFileSync(hostPath));
      chmodSync(alias, 0o755);
    } catch {
      /* non-critical */
    }
  }

  // Pull the style preset library — gives the agent 51 curated designs
  // to pick from when authoring decks. Failure here is non-fatal: the
  // generic design fallback in SKILL.md still applies if INDEX or any
  // individual style.md can't be fetched.
  try {
    const stylesDir = join(BIN_DIR, 'styles');
    process.stdout.write(`  ↓ styles/ … `);
    const count = await syncStyles(stylesDir);
    console.log(`ok (INDEX.md + ${count} style.md presets)`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`  ⚠ styles/ skipped: ${message}`);
  }

  console.log('done.');
}

main().catch((err) => {
  console.error('install-officecli failed:', err.message);
  process.exit(1);
});
