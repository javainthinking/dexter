'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { MarketColorProvider } from '../components/settings/market-color-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        {/* MarketColorProvider sits *inside* ThemeProvider so the
            up/down hue follows whichever colour mode the user picks,
            but *outside* page content so every signed-in surface
            (cards, charts, percent cells) reads the same convention.
            Lightweight (one enum + a localStorage listener) — the
            broad scope costs nothing. */}
        <MarketColorProvider>{children}</MarketColorProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
