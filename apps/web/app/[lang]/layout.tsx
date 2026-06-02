import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import Script from 'next/script';
import { isLocale, locales, localeBcp47, localeOg, type Locale } from '../../lib/i18n/locales';
import { generateAlternatesMetadata } from '../../lib/i18n/seo';
import { getDictionary } from './dictionaries';
import { Providers } from '../providers';
import { MARKET_COLOR_PREPAINT_SCRIPT } from '../../components/settings/market-color-provider';
import { DictionaryProvider } from '../../components/i18n/dictionary-provider';
import { LangSetter } from '../../components/i18n/lang-setter';
import { UpgradeDialogProvider } from '../../components/upgrade/upgrade-dialog-provider';
import { GoogleOneTap } from '../../components/auth/google-one-tap';

// Google Analytics 4 measurement ID. Env-overrideable so a separate
// preview / staging deploy can point at its own GA property without a
// code change; otherwise falls back to the production property.
// NEXT_PUBLIC_-prefixed env vars are inlined at build time and visible
// in client bundles — that's fine here since GA Measurement IDs are
// public by design (they appear in the gtag.js URL anyway).
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-C64LE343DY';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const serifDisplay = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

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
      // og:locale uses the underscore form (en_US, zh_CN) that
      // Facebook/LinkedIn expect — distinct from the BCP-47 hyphen form
      // used in hreflang. localeOg maps between them.
      locale: localeOg[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeOg[l]),
      siteName: dict.common.appName,
      type: 'website',
    },
  };
}

/**
 * Locale layout owns the `<html>`/`<body>` shell so the server-rendered
 * `lang` attribute reflects the active locale (the root layout sits above
 * the `[lang]` segment and cannot read the locale param). Fonts, the
 * no-flash market-colour script, GA, and the theme provider all live here
 * because they hang off `<html>`/`<body>`.
 */
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
    <html
      lang={localeBcp47[lang]}
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${serifDisplay.variable}`}
    >
      <body>
        {/* No-flash market-colour script — reads localStorage and
            stamps `data-market-color="us"` on <html> *before* React
            hydrates, so a returning Western-convention user never
            sees a flash of CN-coloured charts. Runs synchronously
            before interactivity (the only correct strategy here;
            afterInteractive would paint once with the wrong colour). */}
        <Script
          id="market-color-prepaint"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: MARKET_COLOR_PREPAINT_SCRIPT }}
        />
        {/*
          Google Analytics tag. `next/script` with strategy="afterInteractive"
          injects this immediately after page interactivity instead of
          blocking the initial paint. Empty GA_MEASUREMENT_ID short-circuits
          the render so disabled environments skip GA entirely.
        */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
        <Providers>
          <GoogleOneTap />
          <DictionaryProvider locale={lang} dict={dict}>
            <LangSetter locale={lang} />
            <UpgradeDialogProvider>{children}</UpgradeDialogProvider>
          </DictionaryProvider>
        </Providers>
      </body>
    </html>
  );
}
