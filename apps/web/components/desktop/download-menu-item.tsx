'use client';

import * as React from 'react';
import { Download } from 'lucide-react';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { LocalizedLink } from '../i18n/localized-link';
import { useDictionary } from '../i18n/dictionary-provider';
import { isDesktopApp } from '../../lib/desktop';

/** "Download Mac app" entry in the user menu — omitted inside the desktop app. */
export function DownloadMenuItem() {
  const dict = useDictionary();
  const [inApp, setInApp] = React.useState(true);
  React.useEffect(() => setInApp(isDesktopApp()), []);
  if (inApp) return null;
  return (
    <DropdownMenuItem asChild>
      <LocalizedLink href="/download">
        <Download className="size-4" />
        {dict.download.menuItem}
      </LocalizedLink>
    </DropdownMenuItem>
  );
}
