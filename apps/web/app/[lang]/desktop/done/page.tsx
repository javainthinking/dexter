import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check, TriangleAlert } from 'lucide-react';
import { isLocale } from '../../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../../lib/i18n/paths';
import { getDictionary } from '../../dictionaries';
import { Button } from '../../../../components/ui/button';
import { DesktopAuthShell } from '../../../../components/desktop/desktop-auth-shell';

/**
 * /desktop/done?status=ok|error — where the browser lands after "Continue
 * with Google" in PickSkill for Mac. The app's one-shot loopback server
 * (127.0.0.1, RFC 8252) receives the code, exchanges it, then redirects
 * here so the tab ends on a proper PickSkill page instead of the loopback URL.
 */

export const metadata: Metadata = {
  title: 'PickSkill for Mac',
  robots: { index: false, follow: false },
};

export default async function DesktopDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { status } = await searchParams;
  const copy = (await getDictionary(lang)).desktopAuth;
  const ok = status !== 'error';
  const homeHref = getLocalizedPath('/', lang);

  return (
    <DesktopAuthShell
      eyebrow={copy.eyebrow}
      tone={ok ? 'accent' : 'negative'}
      icon={ok ? <Check className="size-5" strokeWidth={2.5} /> : <TriangleAlert className="size-5" />}
      title={ok ? copy.doneTitle : copy.failedTitle}
      homeHref={homeHref}
    >
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{ok ? copy.doneBody : copy.failedBody}</p>
      <div className="mt-8">
        <Button asChild variant="outline" size="default">
          <a href={homeHref}>{copy.backHome}</a>
        </Button>
      </div>
    </DesktopAuthShell>
  );
}
