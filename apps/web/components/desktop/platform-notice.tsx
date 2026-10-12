'use client';

import * as React from 'react';
import Link from 'next/link';

/**
 * Shown on /download only to visitors who are clearly not on a Mac
 * (Windows, Linux, Android, iOS). Decided after mount so the static page
 * renders identically for crawlers and Mac users.
 */
export function PlatformNotice({ text, cta, href }: { text: string; cta: string; href: string }) {
  const [notMac, setNotMac] = React.useState(false);
  React.useEffect(() => {
    const ua = navigator.userAgent;
    const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; // iPadOS reports as Mac
    setNotMac(!/Macintosh|Mac OS X/.test(ua) || touchMac);
  }, []);
  if (!notMac) return null;
  return (
    <div className="mt-6 max-w-xl rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
      {text}{' '}
      <Link href={href} className="font-medium text-foreground underline underline-offset-4">
        {cta}
      </Link>
    </div>
  );
}
