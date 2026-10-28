import type { Locale } from '../i18n/locales';
import type { LegalLang } from './types';

/**
 * Facts the legal copy depends on, filled into its {{TOKENS}}. {{FEEDBACK}}
 * is special: it renders as a link to the feedback page (the only contact
 * channel), labelled per language via LEGAL_CHROME.feedbackLink.
 *
 * While LEGAL_DRAFT is true the pages show a draft banner, highlight any
 * remaining placeholders and are excluded from search indexing (noindex +
 * left out of the sitemap). Flip it once the text has been reviewed.
 */
export const LEGAL_DRAFT = true;

/** "Last updated" date shown on Privacy and Terms. */
export const LEGAL_UPDATED = '2026-10-28';

export const LEGAL_FACTS: Record<string, string> = {
  DELETION_DAYS: '30',
};

export const LEGAL_LOCALES = ['en', 'zh-CN', 'zh-TW'] as const satisfies readonly Locale[];

export function legalLang(locale: Locale): LegalLang {
  return (LEGAL_LOCALES as readonly string[]).includes(locale) ? (locale as LegalLang) : 'en';
}

/** Fill plain tokens; {{FEEDBACK}} becomes plain label text (for meta tags). */
export function fillLegalTokens(text: string, feedbackLabel = 'feedback page'): string {
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (m, key: string) =>
    key === 'FEEDBACK' ? feedbackLabel : LEGAL_FACTS[key] ?? m,
  );
}

export const LEGAL_CHROME: Record<
  LegalLang,
  { updated: string; onThisPage: string; draft: string; feedbackLink: string }
> = {
  en: {
    updated: 'Last updated',
    onThisPage: 'On this page',
    draft: 'Draft for review. This page is not indexed until it is finalised.',
    feedbackLink: 'feedback page',
  },
  'zh-CN': {
    updated: '最后更新',
    onThisPage: '本页目录',
    draft: '待审阅草稿，定稿前本页不会被搜索引擎收录。',
    feedbackLink: '反馈页面',
  },
  'zh-TW': {
    updated: '最後更新',
    onThisPage: '本頁目錄',
    draft: '待審閱草稿，定稿前本頁不會被搜尋引擎收錄。',
    feedbackLink: '意見回饋頁面',
  },
};
