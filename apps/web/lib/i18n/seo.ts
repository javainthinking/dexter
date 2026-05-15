import type { Metadata } from 'next';
import { locales, defaultLocale, localeBcp47, type Locale } from './locales';
import { getLocalizedPath } from './paths';

/**
 * Build the `alternates.languages` map for hreflang plus the canonical URL.
 * Pass the *clean* (unprefixed) path the page lives at — e.g. `/chat`,
 * `/about` — and the helper computes one entry per locale plus `x-default`.
 *
 * Example:
 *   alternates: generateAlternatesMetadata({ path: '/chat', locale: 'fr' })
 */
export function generateAlternatesMetadata({
  path,
  locale,
}: {
  path: string;
  locale: Locale;
}): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[localeBcp47[l]] = getLocalizedPath(path, l);
  }
  // Search engines treat x-default as the page to serve when no language matches.
  languages['x-default'] = getLocalizedPath(path, defaultLocale);
  return {
    canonical: getLocalizedPath(path, locale),
    languages,
  };
}
