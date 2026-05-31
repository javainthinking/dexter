'use client';

import * as React from 'react';
import { Button } from '../ui/button';

/**
 * Opens the Stripe Billing Portal (manage / cancel / switch plan). Posts to
 * /api/stripe/portal and redirects to the returned URL. Used on the account
 * page for paying users.
 */
export function ManageSubscriptionButton({ locale, label }: { locale: string; label: string }) {
  const [busy, setBusy] = React.useState(false);
  return (
    <Button
      type="button"
      size="default"
      variant="outline"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const res = await fetch('/api/stripe/portal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locale }),
          });
          const data = (await res.json().catch(() => ({}))) as { url?: string };
          if (data.url) {
            window.location.href = data.url;
            return;
          }
        } catch {
          /* ignore */
        }
        setBusy(false);
      }}
    >
      {busy ? '…' : label}
    </Button>
  );
}
