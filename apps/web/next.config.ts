import { resolve } from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow the workspace root package (dexter-ts) to be resolved from
  // outside apps/web. Needed for monorepo source-tree imports.
  outputFileTracingRoot: resolve(__dirname, '../../'),
  // Ship the OfficeCLI binary in the function bundle. Tracing only
  // includes files Next can statically follow from server code; the
  // binary is loaded at runtime via child_process.spawn, so we have to
  // tell it explicitly. Only the linux-x64 binary is needed in the
  // bundle — Vercel runs on Linux x86_64. The local-platform binaries
  // stay outside the bundle and are picked up via PATH when a user
  // runs `bun run dev` on a Mac.
  outputFileTracingIncludes: {
    '/api/**/*': ['./bin/officecli-linux-x64'],
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
