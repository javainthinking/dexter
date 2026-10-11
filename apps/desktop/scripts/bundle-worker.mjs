// Bundles the agent worker (and the whole OpenCode host it imports) into one
// ESM file. electron-builder's pnpm dependency collector flattens
// node_modules incorrectly (wrong brace-expansion, missing @opencode/plugin),
// so the packaged app must not resolve OpenCode from node_modules at runtime.
// Native addons stay external; OpenCode only loads them lazily for features
// this app disables (pty, file watcher, fff search, TUI).
import { build } from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outfile = process.argv[2] ?? path.join(root, 'out/main/agent-worker.js');

await build({
  entryPoints: [path.join(root, 'src/agent/worker.ts')],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node24',
  logLevel: 'warning',
  metafile: true,
  // jsonc-parser's `main` is a UMD build that loads its submodules through a
  // dynamic AMD-style require esbuild can't follow; use its ESM build.
  alias: { 'jsonc-parser': path.join(root, 'node_modules/jsonc-parser/lib/esm/main.js') },
  external: [
    'electron',
    '@opencode-ai/pty*',
    '@lydell/node-pty*',
    '@parcel/watcher*',
    'tree-sitter*',
    'ffi-rs',
    '@yuuang/*',
    '@ff-labs/*',
    'msgpackr-extract',
    '@msgpackr-extract/*',
    '@opentui/*',
    'bun:*',
    'playwright*',
    'chromium-bidi*',
  ],
  // CJS dependencies inside an ESM bundle still call require().
  banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
}).then(async (r) => {
  // Files OpenCode locates with require.resolve() at module load (its shell
  // parser grammars). Mirror them next to the bundle so resolution works
  // without the real node_modules tree.
  for (const asset of [
    'web-tree-sitter/tree-sitter.wasm',
    'tree-sitter-bash/tree-sitter-bash.wasm',
    'tree-sitter-powershell/tree-sitter-powershell.wasm',
  ]) {
    const dest = path.join(path.dirname(outfile), 'node_modules', asset);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(path.join(root, 'node_modules', asset), dest);
  }
  const bytes = Object.values(r.metafile.outputs).reduce((n, o) => n + o.bytes, 0);
  console.log(`agent-worker bundled: ${(bytes / 1e6).toFixed(1)} MB → ${path.relative(root, outfile)}`);
});
