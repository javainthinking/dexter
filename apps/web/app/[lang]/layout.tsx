import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { isLocale, locales, localeBcp47, type Locale } from '../../lib/i18n/locales';
import { generateAlternatesMetadata } from '../../lib/i18n/seo';
import { getDictionary } from './dictionaries';
import { DictionaryProvider } from '../../components/i18n/dictionary-provider';
import { LangSetter } from '../../components/i18n/lang-setter';

/**
 * Pre-generate the static segment for every supported locale so `next build`
 * emits one rendered page per language at build time.
 */
export function generateStaticParams(): Array<{ lang: Locale }> {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.common.openGraphTitle,
    description: dict.common.openGraphDescription,
    applicationName: dict.common.appName,
    alternates: generateAlternatesMetadata({ path: '/', locale: lang }),
    openGraph: {
      title: dict.common.openGraphTitle,
      description: dict.common.openGraphDescription,
      locale: localeBcp47[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeBcp47[l]),
      siteName: dict.common.appName,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <DictionaryProvider locale={lang} dict={dict}>
      <LangSetter locale={lang} />
      {children}
    </DictionaryProvider>
  );
}
