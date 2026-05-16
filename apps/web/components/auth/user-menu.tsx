'use client';

import * as React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useDictionary, useLocale } from '../i18n/dictionary-provider';
import { getLocalizedPath } from '../../lib/i18n/paths';
import { cn } from '../../lib/utils';

interface UserMenuProps {
  /** Render compact (avatar only, used in headers) or full (avatar + name). */
  variant?: 'compact' | 'full';
  className?: string;
}

export function UserMenu({ variant = 'compact', className }: UserMenuProps) {
  const { data, status } = useSession();
  const dict = useDictionary();
  const locale = useLocale();

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
  if (!data?.user) return null;

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
