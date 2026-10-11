'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Logo } from '../../../../components/logo';
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

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        {redirectTo ? (
          <>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold">{copy.title}</h1>
              <p className="text-sm text-muted-foreground">{copy.returning}</p>
            </div>
            <Button asChild className="w-full">
              <a href={redirectTo}>{copy.openApp}</a>
            </Button>
            <p className="text-xs text-muted-foreground">{copy.hint}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{copy.invalid}</p>
        )}
      </div>
    </main>
  );
}

/** provider=google: hand straight to Google's account picker, then back to /desktop/authorize. */
export function DesktopGoogleStart({ label, callbackUrl }: { label: string; callbackUrl: string }) {
  React.useEffect(() => {
    void signIn('google', { callbackUrl });
  }, [callbackUrl]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
        <Logo />
        <span className="inline-flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          {label}
        </span>
      </div>
    </main>
  );
}
