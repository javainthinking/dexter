import { resolve } from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow the workspace root package (dexter-ts) to be resolved from
  // outside apps/web. Needed for monorepo source-tree imports.
  outputFileTracingRoot: resolve(__dirname, '../../'),
  // Ship the OfficeCLI binary + style library in the function bundle.
  // Tracing only includes files Next can statically follow from server
  // code; both the binary (spawn) and the style library (runtime
  // fs.readFile) are loaded dynamically, so we tell it explicitly.
  // Only the linux-x64 binary is needed — Vercel is Linux x86_64. The
  // host-platform binaries stay outside the bundle and are picked up
  // via PATH on local dev.
  outputFileTracingIncludes: {
    '/api/**/*': [
      './bin/officecli-linux-x64',
      './bin/styles/INDEX.md',
      './bin/styles/**/style.md',
      // Specialized SKILL.md design bibles from upstream OfficeCLI
      // (officecli-pptx, officecli-pitch-deck, morph-ppt, etc.) plus
      // the morph-ppt reference tree (pptx-design.md, decision-rules.md).
      // Without these the agent only sees CLI grammar, not the
      // visual-design rules INDEX.md says it MUST follow.
      './bin/upstream-skills/**/SKILL.md',
      './bin/upstream-skills/**/reference/**',
    ],
  },
  // The agent core uses native node modules. Keep them as externals so
  // the bundler doesn't try to inline them on the server.
  serverExternalPackages: ['better-sqlite3', 'playwright'],
  experimental: {
    // Lets us import from outside the app dir (workspace root).
    externalDir: true,
  },
  // TypeScript ESM .js extension trick: the root package writes imports
  // like `from './foo.js'` even when the file is `foo.ts`. Bun/Node strip
  // the extension at runtime; webpack needs to be told explicitly.
  // Turbopack handles this natively in Next.js 16, but we currently dev on
  // webpack until verified end-to-end on Turbopack.
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias ?? {}),
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    };
    return config;
  },
};

export default nextConfig;
