import 'server-only';
import type { Locale } from '../../lib/i18n/locales';
import { defaultLocale } from '../../lib/i18n/locales';

import en from './dictionaries/en.json';
import fr from './dictionaries/fr.json';
import de from './dictionaries/de.json';
import es from './dictionaries/es.json';
import ja from './dictionaries/ja.json';
import ko from './dictionaries/ko.json';
import zhCN from './dictionaries/zh-CN.json';
import zhTW from './dictionaries/zh-TW.json';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  fr,
  de,
  es,
  ja,
  ko,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
