import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '../../../lib/i18n/locales';
import { getDictionary } from '../dictionaries';
import { SiteHeader } from '../../../components/marketing/site-header';
import { SiteFooter } from '../../../components/marketing/site-footer';
import { CornerMarks } from '../../../components/marketing/blueprint';

/**
 * Layout for every /blog/* route. Wraps the index and post pages with
 * the shared marketing chrome (header + footer). The footer is the
 * same instance the homepage uses, so users get consistent navigation
 * regardless of where they entered the site.
 *
 * Server component so the chrome is rendered statically alongside the
 * post body — important for SEO/GEO (AI crawlers don't execute JS),
 * and so `next/image`/`next/link` inside the chrome can be optimised
 * by the framework.
 */
export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader lang={lang as Locale} />
      {/* Blueprint rails: the whole blog column sits between two
          vertical hairlines running from header to footer, with
          registration crosses at the junctions (extend.ai register). */}
      {/* (footer supplies the bottom hairline via its own border-t) */}
      <main className="flex-1">
        <div className="relative mx-auto min-h-full max-w-6xl border-border lg:border-x">
          <CornerMarks />
          {children}
        </div>
      </main>
      <SiteFooter lang={lang as Locale} dict={dict} />
    </div>
  );
}
