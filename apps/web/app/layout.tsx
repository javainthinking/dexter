import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import Script from 'next/script';
import { Providers } from './providers';
import './globals.css';

// Google Analytics 4 measurement ID. Env-overrideable so a separate
// preview / staging deploy can point at its own GA property without a
// code change; otherwise falls back to the production property.
// NEXT_PUBLIC_-prefixed env vars are inlined at build time and visible
// in client bundles — that's fine here since GA Measurement IDs are
// public by design (they appear in the gtag.js URL anyway).
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-C64LE343DY';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const serifDisplay = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    // Matches the lifted dark-mode --background (oklch 0.19 0.006 240
    // ≈ #1f2126). Mobile browser chrome and PWA shell now tone-match
    // the in-page surface instead of biasing darker.
    { media: '(prefers-color-scheme: dark)', color: '#1f2126' },
  ],
  width: 'device-width',
  initialScale: 1,
};

/**
 * Root layout owns <html>/<body>, font CSS variables, and the theme
 * provider. Locale-aware metadata + dictionary loading lives in the
 * [lang] layout one level deeper, so the same html/body shell serves
 * every language.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${serifDisplay.variable}`}
    >
      <body>
        {/*
          Google Analytics tag. `next/script` with strategy="afterInteractive"
          injects this immediately after page interactivity instead of
          blocking the initial paint — equivalent to the
          "place after <head>" guidance in GA's docs but Next.js-native.
          Empty GA_MEASUREMENT_ID short-circuits the render so disabled
          environments (e.g. unsetting NEXT_PUBLIC_GA_MEASUREMENT_ID to ''
          in a preview deploy) skip GA entirely.
        */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
