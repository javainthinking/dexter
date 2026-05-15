import { locales, defaultLocale, isLocale, type Locale } from './locales';

/**
 * Convert a pathname to the path that belongs to a given locale.
 *
 *   getLocalizedPath('/chat', 'fr')        → '/fr/chat'
 *   getLocalizedPath('/chat', 'en')        → '/chat'              (default locale is unprefixed)
 *   getLocalizedPath('/zh-CN/chat', 'fr')  → '/fr/chat'           (strips other locale prefix first)
 *   getLocalizedPath('/', 'ja')            → '/ja'
 */
export function getLocalizedPath(pathname: string, locale: Locale): string {
  const stripped = stripLocalePrefix(pathname);
  if (locale === defaultLocale) {
    return stripped === '' ? '/' : stripped;
  }
  return `/${locale}${stripped}`;
}

/**
 * Return the path with any leading locale segment removed. Returns the
 * empty string for the root path so callers can compose with prefixes.
 *
 *   stripLocalePrefix('/fr/chat')      → '/chat'
 *   stripLocalePrefix('/fr')           → ''
 *   stripLocalePrefix('/chat')         → '/chat'
 */
export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return '';
  const first = segments[0];
  if (isLocale(first)) {
    const rest = segments.slice(1).join('/');
    return rest ? `/${rest}` : '';
  }
  return pathname;
}

/**
 * Read the locale from a pathname. Returns the default locale when no
 * locale prefix is present.
 */
export function readLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    return segments[0];
  }
  return defaultLocale;
}

export { locales, defaultLocale, isLocale };
export type { Locale };
