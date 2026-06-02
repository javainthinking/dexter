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
      // Builtin Dexter skills (src/skills/<name>/SKILL.md). The install
      // script mirrors them into apps/web/bin/builtin-skills/ so they
      // sit inside the project dir, since Next.js outputFileTracingIncludes
      // silently ignores paths outside the project. The mirror is
      // regenerated on every install run, so src/skills/ stays the
      // canonical source.
      './bin/builtin-skills/**/*',
    ],
  },
  // The agent core uses native node modules. Keep them as externals so
  // the bundler doesn't try to inline them on the server.
  serverExternalPackages: ['better-sqlite3', 'playwright'],
  // Image optimization: serve AVIF where supported (~93% of traffic,
  // smallest format), fall back to WebP (~97% support), then the
  // original PNG/JPEG as last resort. Next.js picks per request based
  // on the browser's `Accept` header. Saves 30–70% on image bytes
  // across the blog without any change to source assets.
  // The OG-card paths in blog metadata stay as PNG because social
  // platforms (Twitter/LinkedIn/Slack/Discord) don't reliably preview
  // WebP — only the in-page <Image> rendering goes through the
  // optimizer.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Lets us import from outside the app dir (workspace root).
    externalDir: true,
  },
  // Security headers applied to every response. Deliberately the
  // zero-risk set — a full Content-Security-Policy is omitted because the
  // app ships inline scripts (market-colour prepaint, GA init) plus
  // external GA/font origins, and a mis-scoped CSP would break rendering;
  // it needs its own allowlist-tested change.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Admin console (/hello-pickskill, and any locale-prefixed variant):
      // keep it out of every search index and AI crawler regardless of how
      // they parse robots.txt. X-Robots-Tag is honored at the HTTP layer, so
      // it covers the login screen too (which is otherwise a 200 HTML page).
      {
        source: '/hello-pickskill',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/:lang/hello-pickskill',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];
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
