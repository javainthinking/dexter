'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { Loader2, TriangleAlert } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { DesktopAuthShell } from '../../../../components/desktop/desktop-auth-shell';
import type { Dictionary } from '../../dictionaries';

interface Props {
  copy: Dictionary['desktopAuth'];
  /** The app's loopback callback with the one-time code; null → malformed or expired request. */
  redirectTo: string | null;
}

export function DesktopHandoff({ copy, redirectTo }: Props) {
  React.useEffect(() => {
    if (redirectTo) window.location.href = redirectTo;
  }, [redirectTo]);

  if (!redirectTo) {
    return (
      <DesktopAuthShell eyebrow={copy.eyebrow} tone="negative" icon={<TriangleAlert className="size-5" />} title={copy.failedTitle} homeHref="/">
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.invalid}</p>
      </DesktopAuthShell>
    );
  }
  return (
    <DesktopAuthShell eyebrow={copy.eyebrow} icon={<Loader2 className="size-5 animate-spin" />} title={copy.title} homeHref="/">
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.returning}</p>
      <Button asChild size="lg" className="mt-8 w-full">
        <a href={redirectTo}>{copy.openApp}</a>
      </Button>
      <p className="mt-4 text-xs leading-relaxed text-subtle">{copy.hint}</p>
    </DesktopAuthShell>
  );
}

/** provider=google: hand straight to Google's account picker, then back to /desktop/authorize. */
export function DesktopGoogleStart({ label, callbackUrl }: { label: string; callbackUrl: string }) {
  React.useEffect(() => {
    void signIn('google', { callbackUrl });
  }, [callbackUrl]);

  return (
    <DesktopAuthShell eyebrow="PickSkill for Mac" tone="muted" icon={<Loader2 className="size-5 animate-spin" />} homeHref="/">
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </DesktopAuthShell>
  );
}
