'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FolderPlus } from 'lucide-react';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Locale } from '../../lib/i18n/locales';

/**
 * "Add to portfolio" on the public stock pages. Always a plain link to
 * the portfolio console carrying the ticker: signed-in users land on the
 * add dialog directly; everyone else is bounced through sign-in by the
 * /portfolios page, which keeps the query in its callbackUrl, so the
 * dialog is waiting for them after sign-up too.
 *
 * The page itself is ISR-cached for everyone, so the signed-in state is
 * read on the client and only changes the hint underneath.
 */
export function AddToPortfolio({
  locale,
  ticker,
  name,
  exchange,
  labels,
}: {
  locale: Locale;
  ticker: string;
  name: string;
  exchange: string;
  labels: { button: string; signedOutHint: string; signedInHint: string };
}) {
  const { status } = useSession();
  const query = new URLSearchParams({ add: ticker, name, exchange });
  const href = `${getLocalizedPath('/portfolios', locale)}?${query.toString()}`;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <Link
        href={href}
        prefetch={false}
        onClick={() => window.gtag?.('event', 'add_to_portfolio_click', { item_id: ticker, signed_in: status === 'authenticated' })}
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-foreground px-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <FolderPlus className="size-4" />
        {labels.button}
      </Link>
      {status !== 'loading' && (
        <span className="text-xs text-muted-foreground">
          {status === 'authenticated' ? labels.signedInHint : labels.signedOutHint}
        </span>
      )}
    </div>
  );
}
