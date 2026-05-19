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

  console.log('done.');
}

main().catch((err) => {
  console.error('install-officecli failed:', err.message);
  process.exit(1);
});
