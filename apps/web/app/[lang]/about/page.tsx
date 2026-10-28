import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '../../../lib/i18n/locales';
import { getDictionary } from '../dictionaries';
import { LegalPage, legalMetadata } from '../../../components/legal/legal-page';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? legalMetadata('about', lang) : {};
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LegalPage kind="about" locale={lang} dict={await getDictionary(lang)} />;
}
