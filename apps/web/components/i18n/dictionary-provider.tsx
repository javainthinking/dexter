'use client';

import * as React from 'react';
import type { Locale } from '../../lib/i18n/locales';
import type { Dictionary } from '../../app/[lang]/dictionaries';

interface DictionaryContextValue {
  locale: Locale;
  dict: Dictionary;
}

const DictionaryContext = React.createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => ({ locale, dict }), [locale, dict]);
  return <DictionaryContext.Provider value={value}>{children}</DictionaryContext.Provider>;
}

/**
 * Read the current locale's dictionary. Throws if used outside a
 * DictionaryProvider — we'd rather fail fast in a client component than
 * silently fall back to English and confuse users.
 */
export function useDictionary(): Dictionary {
  const ctx = React.useContext(DictionaryContext);
  if (!ctx) {
    throw new Error('useDictionary must be used inside <DictionaryProvider>');
  }
  return ctx.dict;
}

export function useLocale(): Locale {
  const ctx = React.useContext(DictionaryContext);
  if (!ctx) {
    throw new Error('useLocale must be used inside <DictionaryProvider>');
  }
  return ctx.locale;
}

/**
 * Substitute `{key}` placeholders in a translated string.
 *
 *   t('{count} turns', { count: 3 })  →  '3 turns'
 */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key) => String(vars[key] ?? `{${key}}`));
}
