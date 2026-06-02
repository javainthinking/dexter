'use client';

import * as React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { BrainCircuit, CreditCard, LogOut, Palette, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LocalizedLink } from '../i18n/localized-link';
import { useDictionary, useLocale } from '../i18n/dictionary-provider';
import { getLocalizedPath } from '../../lib/i18n/paths';
import { cn } from '../../lib/utils';
import { useMarketColor } from '../settings/market-color-provider';

interface UserMenuProps {
  /** Render compact (avatar only, used in headers) or full (avatar + name). */
  variant?: 'compact' | 'full';
  className?: string;
}

export function UserMenu({ variant = 'compact', className }: UserMenuProps) {
  const { data, status } = useSession();
  const dict = useDictionary();
  const locale = useLocale();
  const { convention, setConvention } = useMarketColor();
  const marketColorDict = dict.userMenu?.marketColor;

  if (status === 'loading') {
    return (
      <div
        className={cn(
          'inline-flex size-8 animate-pulse-soft rounded-full bg-muted',
          className,
        )}
      />
    );
  }
  // Logged out: show a sign-in button in the avatar slot to guide login,
  // rather than rendering nothing.
  if (!data?.user) {
    return (
      <LocalizedLink
        href="/sign-in"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors',
          'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
      >
        <UserIcon className="size-4" aria-hidden="true" />
        {dict.auth.signIn}
      </LocalizedLink>
    );
  }

  const user = data.user as { name?: string | null; email?: string | null; image?: string | null };

  const initials = (user.name ?? user.email ?? '?')
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-2 rounded-md p-1 transition-colors',
            'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            className,
          )}
          aria-label={user.name ?? user.email ?? 'Account'}
        >
          <Avatar image={user.image ?? null} initials={initials} />
          {variant === 'full' && (
            <span className="hidden flex-1 min-w-0 text-left sm:flex sm:flex-col">
              <span className="truncate text-xs font-medium text-foreground">
                {user.name ?? user.email}
              </span>
              {user.name && user.email && (
                <span className="truncate font-mono text-[10px] text-subtle">{user.email}</span>
              )}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[14rem]">
        <DropdownMenuLabel>{dict.auth.signedInAs}</DropdownMenuLabel>
        <div className="px-2.5 pb-2">
          <p className="truncate text-sm font-medium text-foreground">
            {user.name ?? user.email}
          </p>
          {user.email && (
            <p className="truncate font-mono text-[11px] text-subtle">{user.email}</p>
          )}
        </div>
        <DropdownMenuSeparator />
        {/* Memory lives in the user menu rather than the top-bar nav
            cluster — it's a personal-account surface ('what does
            PickSkill remember about me'), not a section like
            Portfolios or Indicators. The dropdown grouping fits the
            mental model and keeps the global nav lean. */}
        <DropdownMenuItem asChild>
          <LocalizedLink href="/account">
            <CreditCard className="size-4" />
            {dict.account.title}
          </LocalizedLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <LocalizedLink href="/memory">
            <BrainCircuit className="size-4" />
            {dict.nav.memory}
          </LocalizedLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* Market-colour convention toggle. Visible inside the user
            menu (not the global theme toggle) because it's a personal
            financial-display preference — like dark mode is to vision,
            this is to "which colour means up." Two radio items keep
            the choice obvious: 红涨绿跌 (CN) vs 红跌绿涨 (Western).
            onSelect preventDefault keeps the menu open so users can
            flip between the two and see the live preview in the
            charts behind the popover. */}
        <DropdownMenuLabel className="flex items-center gap-1.5">
          <Palette className="size-3" aria-hidden="true" />
          {marketColorDict?.title ?? 'Color convention'}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={convention}
          onValueChange={(v) => {
            if (v === 'cn' || v === 'us') setConvention(v);
          }}
        >
          <DropdownMenuRadioItem
            value="cn"
            onSelect={(e) => e.preventDefault()}
          >
            <span className="flex items-center gap-2">
              {/* Inline swatch row — left dot is "up" (red in CN), right is
                  "down" (green in CN). The swatches are hard-coded for the
                  CN label because the label text describes red-as-up
                  literally; flipping them would contradict the words. */}
              <span className="inline-flex items-center gap-0.5">
                <span className="size-2 rounded-full bg-rose-500" aria-hidden="true" />
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
              </span>
              {marketColorDict?.redUp ?? 'Red up · CN'}
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="us"
            onSelect={(e) => e.preventDefault()}
          >
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5">
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="size-2 rounded-full bg-rose-500" aria-hidden="true" />
              </span>
              {marketColorDict?.redDown ?? 'Red down · US/EU'}
            </span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => void signOut({ callbackUrl: getLocalizedPath('/', locale) })}
        >
          <LogOut className="size-4" />
          {dict.auth.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Avatar({ image, initials }: { image: string | null; initials: string }) {
  if (image) {
    return (
      // Plain <img> is fine here — these are user avatars from arbitrary
      // domains, and next/image's remote allowlist would be heavy-handed.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        className="size-7 rounded-full border border-border object-cover"
      />
    );
  }
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-muted text-[11px] font-medium text-foreground">
      {initials || <UserIcon className="size-3.5" />}
    </span>
  );
}
