/**
 * Supported locales. Default = `en` uses clean URLs (no prefix); every
 * other locale is served under `/{code}/...`. Keep this list in sync
 * with the dictionary import map in `app/[lang]/dictionaries.ts` and
 * (when added) the sitemap generator.
 */

export const locales = ['en', 'fr', 'de', 'es', 'ja', 'ko', 'zh-CN', 'zh-TW'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Native display name for each locale — shown in the language switcher.
 */
export const localeDisplayName: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ja: '日本語',
  ko: '한국어',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
};

/**
 * BCP-47 / IETF language tags used for hreflang and OG locale fields.
 */
export const localeBcp47: Record<Locale, string> = {
  en: 'en',
  fr: 'fr',
  de: 'de',
  es: 'es',
  ja: 'ja',
  ko: 'ko',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
};
