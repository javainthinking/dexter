import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, locales, localeOg, localeBcp47, type Locale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { generateAlternatesMetadata } from '../../../lib/i18n/seo';
import { DESKTOP_DOWNLOADS, DESKTOP_RELEASE } from '../../../lib/desktop';
import { getDictionary } from '../dictionaries';
import { Badge } from '../../../components/ui/badge';
import { SiteHeader } from '../../../components/marketing/site-header';
import { SiteFooter } from '../../../components/marketing/site-footer';
import { CornerMarks } from '../../../components/marketing/blueprint';
import { DownloadButtons } from '../../../components/desktop/download-buttons';
import { MacWindowShot } from '../../../components/desktop/mac-window-shot';
import { PlatformNotice } from '../../../components/desktop/platform-notice';

const SITE_URL = 'https://pickskill.ai';

export function generateStaticParams(): Array<{ lang: Locale }> {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = (await getDictionary(lang)).download;
  return {
    title: d.metaTitle,
    description: d.metaDescription,
    alternates: generateAlternatesMetadata({ path: '/download', locale: lang }),
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      title: d.metaTitle,
      description: d.metaDescription,
      siteName: 'PickSkill',
      url: `${SITE_URL}${getLocalizedPath('/download', lang)}`,
      locale: localeOg[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeOg[l]),
      type: 'website',
      images: [{ url: '/desktop/desktop-home-light.webp', width: 1600, height: 1025, alt: d.screenshotAlt }],
    },
    twitter: { card: 'summary_large_image', title: d.metaTitle, description: d.metaDescription },
  };
}

export default async function DownloadPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const d = dict.download;
  const pageUrl = `${SITE_URL}${getLocalizedPath('/download', lang)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/download#app`,
        name: 'PickSkill for Mac',
        applicationCategory: 'FinanceApplication',
        operatingSystem: `macOS ${DESKTOP_RELEASE.minMacOS} or later`,
        softwareVersion: DESKTOP_RELEASE.version,
        downloadUrl: DESKTOP_DOWNLOADS.arm64,
        url: pageUrl,
        image: `${SITE_URL}/desktop/desktop-home-light.webp`,
        description: d.metaDescription,
        inLanguage: localeBcp47[lang],
        publisher: { '@id': `${SITE_URL}/#organization` },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: d.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_-10%,color-mix(in_oklch,var(--accent)_16%,transparent),transparent_55%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 border-border px-5 pt-16 pb-20 lg:grid-cols-[1fr_1.2fr] lg:gap-12 lg:border-x lg:px-8 lg:pt-24 lg:pb-24">
          <CornerMarks />
          <div>
            <Badge variant="accent" size="default">
              <span className="size-1.5 rounded-full bg-[color:var(--accent)] animate-pulse-soft" />
              {d.badge}
            </Badge>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              {d.pageTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{d.pageSubtitle}</p>
            <div className="mt-9">
              <DownloadButtons d={d} showReleaseLink />
            </div>
            <PlatformNotice text={d.otherPlatform} cta={d.openWeb} href={getLocalizedPath('/chat', lang)} />
          </div>
          <MacWindowShot alt={d.screenshotAlt} priority figLabel="Fig. 01" />
        </div>
      </section>

      {/* Install steps */}
      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 py-20 lg:border-x lg:px-8">
          <CornerMarks />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{d.installEyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{d.installTitle}</h2>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {d.steps.map((s, i) => (
              <li key={s.title} className={`p-6 ${i === 2 ? 'bg-card' : 'bg-background'}`}>
                <span className="font-mono text-[10px] tracking-[0.18em] text-subtle">0{i + 1}</span>
                <h3 className="mt-3 font-serif text-xl font-semibold tracking-tight text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Requirements + FAQ */}
      <section className="border-b border-border">
        <div className="relative mx-auto grid max-w-6xl gap-12 border-border px-5 py-20 lg:grid-cols-[1fr_2fr] lg:border-x lg:px-8">
          <CornerMarks />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{d.requirementsTitle}</p>
            <ul className="mt-5 space-y-3">
              {d.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">{d.faqTitle}</h2>
            <dl className="mt-8 space-y-8">
              {d.faq.map((f) => (
                <div key={f.q}>
                  <dt className="font-serif text-lg font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
