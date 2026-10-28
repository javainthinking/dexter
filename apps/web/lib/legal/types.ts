export type LegalKind = 'about' | 'privacy' | 'terms';
export type LegalLang = 'en' | 'zh-CN' | 'zh-TW';

/** A body block: a paragraph, or a bullet list. */
export type LegalBlock = string | { list: string[] };

export interface LegalSection {
  id: string;
  /** Phrased as a question — the form AI answers cite most readily. */
  heading: string;
  body: LegalBlock[];
}

export interface LegalDoc {
  metaTitle: string;
  metaDescription: string;
  title: string;
  lead: string;
  sections: LegalSection[];
}

export type LegalDocs = Record<LegalKind, Record<LegalLang, LegalDoc>>;
