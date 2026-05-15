import { resolve } from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow the workspace root package (dexter-ts) to be resolved from
  // outside apps/web. Needed for monorepo source-tree imports.
  outputFileTracingRoot: resolve(__dirname, '../../'),
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
