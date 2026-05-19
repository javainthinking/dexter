import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
