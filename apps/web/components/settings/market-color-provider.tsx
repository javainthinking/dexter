'use client';

import * as React from 'react';

/**
 * Two color-coding conventions for "up" vs "down":
 *
 *   - 'cn' (default) — 红涨绿跌 — red rises, green falls. The China-
 *     market convention, used in mainland brokerages, A-share apps,
 *     and most CN financial press.
 *   - 'us' — 红跌绿涨 — green rises, red falls. The Western convention
 *     used by Bloomberg, Yahoo Finance, TradingView's default, etc.
 *
 * The setting is purely visual. It does not change which direction
 * is bullish or bearish — only which hue gets painted on top.
 */
export type MarketColorConvention = 'cn' | 'us';

const STORAGE_KEY = 'pickskill-market-color';
const ATTR = 'data-market-color';

interface MarketColorContextValue {
  convention: MarketColorConvention;
  setConvention: (next: MarketColorConvention) => void;
}

const MarketColorContext = React.createContext<MarketColorContextValue | null>(null);

/**
 * Provider that owns the convention state, persists it to
 * localStorage, and keeps `<html data-market-color="…">` in sync so
 * the globals.css override block (`[data-market-color="us"]`)
 * activates immediately. CN is the default — when no preference is
 * stored we leave the attribute off (matches the `:root` defaults)
 * rather than writing `data-market-color="cn"`, keeping the DOM
 * lightweight in the common case.
 *
 * Renders are SSR-safe: the initial state is 'cn' (the CSS default)
 * so server-rendered markup matches what the client paints before
 * hydration. The pre-paint inline script in app/[lang]/layout.tsx
 * handles the rarer case where a returning user prefers 'us' — it
 * flips the attribute before the first paint so there's no flash of
 * mismatched colour.
 */
export function MarketColorProvider({ children }: { children: React.ReactNode }) {
  const [convention, setConventionState] = React.useState<MarketColorConvention>('cn');

  // First-mount sync from localStorage. We deliberately don't read in
  // the useState initializer because that would cause a hydration
  // mismatch when a returning 'us' user lands on an SSR-rendered page
  // (server has no localStorage). The pre-paint script handles the
  // visual; this effect just hydrates React state to match.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === 'us' || raw === 'cn') {
        setConventionState(raw);
      }
    } catch {
      /* localStorage blocked (privacy mode, etc.) — fall back to 'cn'. */
    }
  }, []);

  // Reflect changes onto <html> + localStorage. 'cn' removes the
  // attribute to keep the default DOM clean (the :root rule already
  // defines CN).
  React.useEffect(() => {
    const html = document.documentElement;
    if (convention === 'us') html.setAttribute(ATTR, 'us');
    else html.removeAttribute(ATTR);
    try {
      window.localStorage.setItem(STORAGE_KEY, convention);
    } catch {
      /* persistence is best-effort; the visual state still applies. */
    }
  }, [convention]);

  const value = React.useMemo<MarketColorContextValue>(
    () => ({ convention, setConvention: setConventionState }),
    [convention],
  );

  return <MarketColorContext.Provider value={value}>{children}</MarketColorContext.Provider>;
}

/**
 * Consumer hook. Returns the current convention + a setter that
 * persists across reloads. Throws when used outside the provider so
 * we catch missing-mount bugs at the seam, not silently in a
 * downstream colour calculation.
 */
export function useMarketColor(): MarketColorContextValue {
  const ctx = React.useContext(MarketColorContext);
  if (!ctx) {
    throw new Error(
      'useMarketColor must be used inside <MarketColorProvider>. ' +
        'Did you forget to mount it in app/[lang]/layout.tsx?',
    );
  }
  return ctx;
}

/**
 * Pre-paint inline script. Reads localStorage before React hydrates
 * and sets `data-market-color` on <html> so a returning 'us' user
 * never sees a flash of CN-coloured charts on first paint.
 *
 * Rendered via <Script strategy="beforeInteractive"> inline in the
 * root layout. The body is intentionally a self-contained IIFE
 * string with no closure dependencies — it runs before bundle code,
 * so no imports are available. Wrapped in try/catch because the
 * primary failure mode is localStorage access being blocked.
 */
export const MARKET_COLOR_PREPAINT_SCRIPT = `(function(){try{var v=localStorage.getItem('${STORAGE_KEY}');if(v==='us'){document.documentElement.setAttribute('${ATTR}','us');}}catch(e){}})();`;
