// Bundles the agent worker (and the whole OpenCode host it imports) into one
// ESM file. electron-builder's pnpm dependency collector flattens
// node_modules incorrectly (wrong brace-expansion, missing @opencode/plugin),
// so the packaged app must not resolve OpenCode from node_modules at runtime.
// Native addons stay external; OpenCode only loads them lazily for features
// this app disables (pty, file watcher, fff search, TUI).
import { build } from 'esbuild';
import fs from 'node:fs/promises';
import { builtinModules } from 'node:module';
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
    // Only the per-platform native binary; its JS wrapper is imported
    // statically and must be bundled (nothing to resolve it from at runtime).
    '@parcel/watcher-*',
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
  // Externals may only be loaded lazily (require() at use). A static import of
  // one fails at startup in an installed app — there is no node_modules to
  // resolve it from (builds under apps/desktop/release find ours, hiding it).
  const output = r.metafile.outputs[path.relative(process.cwd(), outfile)] ?? Object.values(r.metafile.outputs)[0];
  const builtin = new Set(builtinModules);
  const unresolvable = output.imports
    .filter((i) => i.external && i.kind === 'import-statement')
    .map((i) => i.path)
    .filter((p) => !p.startsWith('node:') && !builtin.has(p) && !builtin.has(p.split('/')[0]));
  if (unresolvable.length) {
    throw new Error(`agent-worker statically imports externals: ${[...new Set(unresolvable)].join(', ')}`);
  }
  const bytes = Object.values(r.metafile.outputs).reduce((n, o) => n + o.bytes, 0);
  console.log(`agent-worker bundled: ${(bytes / 1e6).toFixed(1)} MB → ${path.relative(root, outfile)}`);
});
