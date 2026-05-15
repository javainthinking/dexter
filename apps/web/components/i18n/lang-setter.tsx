'use client';

import * as React from 'react';
import type { Locale } from '../../lib/i18n/locales';

/**
 * Reflect the active locale onto the <html> element after hydration so
 * the lang attribute matches the page content. The root layout renders
 * <html lang="en"> at first paint (since it's outside the [lang] route
 * segment); this corrects it for non-default locales without forcing
 * the root layout to be async.
 *
 * Also persists the user's choice to a cookie so the proxy/middleware
 * routes them to their preferred locale on the next visit to `/`.
 */
export function LangSetter({ locale }: { locale: Locale }) {
  React.useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `dexter_lang=${locale}; path=/; max-age=${maxAge}; samesite=lax`;
  }, [locale]);

  return null;
}
