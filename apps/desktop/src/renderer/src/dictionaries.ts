// web's app/[lang]/dictionaries.ts is server-only; the JSON files are shared directly.
import type { Locale } from '@web/lib/i18n/locales';
import en from '@web/app/[lang]/dictionaries/en.json';
import fr from '@web/app/[lang]/dictionaries/fr.json';
import de from '@web/app/[lang]/dictionaries/de.json';
import es from '@web/app/[lang]/dictionaries/es.json';
import ja from '@web/app/[lang]/dictionaries/ja.json';
import ko from '@web/app/[lang]/dictionaries/ko.json';
import zhCN from '@web/app/[lang]/dictionaries/zh-CN.json';
import zhTW from '@web/app/[lang]/dictionaries/zh-TW.json';

export const dictionaries: Record<Locale, typeof en> = { en, fr, de, es, ja, ko, 'zh-CN': zhCN, 'zh-TW': zhTW };
