/** Client-safe types for the /stocks AI read (generation lives in ./narrative, server-only). */

export type NarrativeLang = 'en' | 'zh-CN' | 'zh-TW';

export interface Narrative {
  paragraphs: string[];
  source: 'ai' | 'template';
}
