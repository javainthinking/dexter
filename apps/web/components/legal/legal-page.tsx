import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { localeBcp47, localeOg, type Locale } from '../../lib/i18n/locales';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Dictionary } from '../../app/[lang]/dictionaries';
import { LEGAL_CONTENT } from '../../lib/legal/content';
import {
  LEGAL_CHROME,
  LEGAL_DRAFT,
  LEGAL_LOCALES,
  LEGAL_UPDATED,
  fillLegalTokens,
  legalLang,
} from '../../lib/legal/facts';
import type { LegalBlock, LegalKind } from '../../lib/legal/types';
import { Breadcrumbs } from '../blog/breadcrumbs';
import { SiteHeader } from '../marketing/site-header';
import { SiteFooter } from '../marketing/site-footer';
import { CornerMarks } from '../marketing/blueprint';

/**
 * Shared shell for /about, /privacy and /terms. Copy lives in
 * lib/legal/content.ts (en, zh-CN, zh-TW); other locales render English
 * and canonicalise to the English URL, like the /stocks pages.
 */

const SITE_URL = 'https://pickskill.ai';
const ORG_ID = `${SITE_URL}/#organization`;

function absUrl(kind: LegalKind, locale: Locale): string {
  return `${SITE_URL}${getLocalizedPath(`/${kind}`, locale)}`;
}

export function legalMetadata(kind: LegalKind, locale: Locale): Metadata {
  const lang = legalLang(locale);
  const doc = LEGAL_CONTENT[kind][lang];
  const description = fillLegalTokens(doc.metaDescription);
  const languages: Record<string, string> = {};
  for (const l of LEGAL_LOCALES) languages[localeBcp47[l]] = absUrl(kind, l);
  languages['x-default'] = absUrl(kind, 'en');
  return {
    title: doc.metaTitle,
    description,
    alternates: { canonical: absUrl(kind, lang), languages },
    robots: LEGAL_DRAFT ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: doc.metaTitle,
      description,
      url: absUrl(kind, lang),
      siteName: 'PickSkill',
      locale: localeOg[locale],
      type: 'website',
    },
  };
}

/** Fill tokens and turn {{FEEDBACK}} into a link to the feedback page. */
function renderText(raw: string, locale: Locale): ReactNode[] {
  const label = LEGAL_CHROME[legalLang(locale)].feedbackLink;
  return raw.split('{{FEEDBACK}}').flatMap((chunk, i) => {
    const text = fillLegalTokens(chunk);
    if (i === 0) return [text];
    return [
      <Link
        key={i}
        href={getLocalizedPath('/feedback', locale)}
        className="text-foreground underline underline-offset-4"
      >
        {label}
      </Link>,
      text,
    ];
  });
}

function Block({ block, locale }: { block: LegalBlock; locale: Locale }) {
  if (typeof block === 'string') return <p>{renderText(block, locale)}</p>;
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-subtle">
      {block.list.map((item) => (
        <li key={item}>{renderText(item, locale)}</li>
      ))}
    </ul>
  );
}

export function LegalPage({
  kind,
  locale,
  dict,
}: {
  kind: LegalKind;
  locale: Locale;
  dict: Dictionary;
}) {
  const lang = legalLang(locale);
  const doc = LEGAL_CONTENT[kind][lang];
  const chrome = LEGAL_CHROME[lang];
  const url = absUrl(kind, lang);
  const showUpdated = kind !== 'about';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'PickSkill',
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        foundingDate: '2026',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: `${SITE_URL}/feedback`,
        },
      },
      {
        '@type': kind === 'about' ? 'AboutPage' : 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: doc.metaTitle,
        description: fillLegalTokens(doc.metaDescription, chrome.feedbackLink),
        inLanguage: localeBcp47[lang],
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        dateModified: LEGAL_UPDATED,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: dict.nav?.home ?? 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: doc.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader lang={locale} />

      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 pt-8 lg:border-x lg:px-8">
          <CornerMarks />
          <Breadcrumbs
            ariaLabel="Breadcrumb"
            items={[{ label: dict.nav?.home ?? 'Home', href: '/' }, { label: doc.title }]}
          />
          <div className="max-w-3xl pb-12 pt-2">
            <h1 className="font-serif text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{renderText(doc.lead, locale)}</p>
            {showUpdated && (
              <p className="mt-4 font-mono text-[11px] text-subtle">
                {chrome.updated}: <time dateTime={LEGAL_UPDATED}>{LEGAL_UPDATED}</time>
              </p>
            )}
            {LEGAL_DRAFT && (
              <p className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-muted-foreground">
                {chrome.draft}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="relative mx-auto grid max-w-6xl gap-10 border-border px-5 py-12 lg:grid-cols-[220px_1fr] lg:border-x lg:px-8">
          <CornerMarks />
          <nav aria-label={chrome.onThisPage} className="lg:sticky lg:top-20 lg:self-start">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">{chrome.onThisPage}</p>
            <ol className="mt-3 space-y-2 text-sm">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="max-w-3xl space-y-10">
            {doc.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">{s.heading}</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  {s.body.map((b, i) => (
                    <Block key={i} block={b} locale={locale} />
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>

      <SiteFooter lang={locale} dict={dict} />
    </div>
  );
}
