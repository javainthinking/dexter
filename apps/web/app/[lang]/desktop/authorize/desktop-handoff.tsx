'use client';

import * as React from 'react';
import { Button } from '../../../../components/ui/button';
import { Logo } from '../../../../components/logo';
import type { Dictionary } from '../../dictionaries';

interface Props {
  copy: Dictionary['desktopAuth'];
  /** null → the request was malformed or expired. */
  deepLink: string | null;
}

export function DesktopHandoff({ copy, deepLink }: Props) {
  React.useEffect(() => {
    if (deepLink) window.location.href = deepLink;
  }, [deepLink]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        {deepLink ? (
          <>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold">{copy.title}</h1>
              <p className="text-sm text-muted-foreground">{copy.returning}</p>
            </div>
            <Button asChild className="w-full">
              <a href={deepLink}>{copy.openApp}</a>
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
