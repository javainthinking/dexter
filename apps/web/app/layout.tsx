import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

/**
 * metadataBase is the URL Next.js uses to resolve every relative URL
 * in metadata — canonical, hreflang languages, OG image paths,
 * Twitter image paths, etc. Without it, those render as relative
 * paths (e.g. `/blog/what-is-fcf`), which SEO auditors and Google's
 * stricter validators flag as invalid: canonicals and hreflang must
 * be absolute URLs.
 *
 * Hardcoded to the production origin on purpose. Preview deploys
 * intentionally advertise the production canonical so they never
 * compete for indexing — Vercel preview URLs would otherwise leak
 * into search results.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://pickskill.ai'),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    // Matches the warm-tone dark --background (#14120b). Mobile
    // browser chrome and PWA shell now tone-match the in-page surface.
    { media: '(prefers-color-scheme: dark)', color: '#14120b' },
  ],
  width: 'device-width',
  initialScale: 1,
};

/**
 * Root layout is a pass-through. The `<html>`/`<body>` shell — and the
 * `lang` attribute — is owned by `app/[lang]/layout.tsx` so the
 * server-rendered HTML carries the correct language per locale (crawlers,
 * especially non-JS AI crawlers, read the SSR `lang`; a client-side
 * correction is too late for them). All real HTML routes live under the
 * `[lang]` segment, so this root never needs to render a shell itself.
 *
 * `metadata`/`viewport` exports stay here because metadataBase + theme
 * colour are locale-independent and apply globally.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
