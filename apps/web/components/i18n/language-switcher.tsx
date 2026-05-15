'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useDictionary, useLocale } from './dictionary-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import {
  locales,
  localeDisplayName,
  type Locale,
} from '../../lib/i18n/locales';
import { getLocalizedPath, stripLocalePrefix } from '../../lib/i18n/paths';

export function LanguageSwitcher({ className }: { className?: string }) {
  const dict = useDictionary();
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const cleanPath = stripLocalePrefix(pathname) || '/';

  function pick(target: string) {
    const next = target as Locale;
    if (next === currentLocale) return;
    const href = getLocalizedPath(cleanPath, next);
    // Persist preference so root visits land here next time.
    document.cookie = `dexter_lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.push(href);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className}
          aria-label={dict.language.label}
        >
          <Globe className="size-4" />
          <span className="hidden sm:inline">{localeDisplayName[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <DropdownMenuLabel>{dict.language.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={currentLocale} onValueChange={pick}>
          {locales.map((l) => (
            <DropdownMenuRadioItem key={l} value={l}>
              <span className="flex items-center gap-2">
                <span>{localeDisplayName[l]}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
                  {l}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
