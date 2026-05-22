'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Palette, X, ExternalLink } from 'lucide-react';
import {
  designStyleBrands,
  type DesignStyleBrand,
} from '../../lib/design-styles';
import { useDictionary } from '../i18n/dictionary-provider';
import { cn } from '../../lib/utils';

/**
 * Right-side drawer that lists every brand design system from
 * VoltAgent/awesome-design-md. Clicking a brand card calls
 * `onPickBrand` with the brand metadata — the chat page is
 * responsible for composing the chat-input text (so it can read
 * the current composer value and append vs. replace correctly).
 *
 * The trigger is rendered by the parent (the composer's Palette
 * button) and connects via a controlled open/onOpenChange pair
 * rather than DialogTrigger — the parent already owns the button
 * styling.
 */
export function DesignStylePanel({
  open,
  onOpenChange,
  onPickBrand,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPickBrand: (brand: DesignStyleBrand) => void;
}) {
  const dict = useDictionary();
  const title = dict.chat?.design?.title ?? 'Reference a design system';
  const subtitle =
    dict.chat?.design?.subtitle ??
    'Click a brand to load its design.md into the chat.';
  const sourceLabel = dict.chat?.design?.sourceLabel ?? 'Source';
  const closeLabel = dict.chat?.design?.close ?? 'Close';

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-background/70 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-full max-w-[640px] flex-col',
            'border-l border-border bg-background shadow-[var(--shadow-elev2)]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
            'duration-200',
          )}
        >
          {/* Header */}
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-[color:var(--accent)]" aria-hidden="true" />
                <DialogPrimitive.Title className="font-serif text-lg font-semibold leading-tight tracking-tight">
                  {title}
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Description className="mt-1.5 text-xs text-muted-foreground">
                {subtitle}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              className={cn(
                'rounded-md p-1.5 text-muted-foreground transition-colors',
                'hover:bg-muted hover:text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring',
              )}
              aria-label={closeLabel}
            >
              <X className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          </header>

          {/* Card grid */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {designStyleBrands.map((brand) => (
                <BrandCard
                  key={brand.slug}
                  brand={brand}
                  onClick={() => onPickBrand(brand)}
                />
              ))}
            </div>
          </div>

          {/* Footer attribution */}
          <footer className="shrink-0 border-t border-border px-5 py-3">
            <a
              href="https://github.com/VoltAgent/awesome-design-md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {sourceLabel}: VoltAgent/awesome-design-md
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/**
 * One brand card. Two visual layers:
 *   1. A linear gradient from the brand color → a darker mix, sized
 *      to feel like a "swatch" from the brand's identity.
 *   2. The brand mark (Simple Icons CDN SVG, tinted white for high
 *      contrast against the gradient). When the brand has no Simple
 *      Icons coverage, fall back to the first letter rendered in a
 *      serif font over the same gradient — still visually distinct.
 *
 * The mark is positioned center-large on the swatch, with the name
 * sitting below in a muted band. The whole card lifts subtly on
 * hover so the visual feels like a tactile design swatch rather
 * than a search-result row.
 */
function BrandCard({
  brand,
  onClick,
}: {
  brand: DesignStyleBrand;
  onClick: () => void;
}) {
  const iconUrl = brand.iconSlug
    ? `https://cdn.simpleicons.org/${brand.iconSlug}/ffffff`
    : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border border-border bg-card',
        'transition-all duration-200',
        'hover:border-border-strong hover:-translate-y-0.5 hover:shadow-[var(--shadow-elev1)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
      aria-label={brand.name}
    >
      {/* Visual swatch — brand-coloured gradient with the mark */}
      <div
        className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #${brand.color} 0%, #${darkenHex(brand.color, 0.35)} 100%)`,
        }}
      >
        {iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={iconUrl}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            className="size-9 opacity-95 transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <span
            className="font-serif text-3xl font-semibold text-white opacity-95 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            {brand.name.charAt(0)}
          </span>
        )}
        {/* Faint diagonal accent line to suggest "design swatch" */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            background:
              'linear-gradient(135deg, transparent 0%, transparent 48%, rgba(255,255,255,0.4) 50%, transparent 52%, transparent 100%)',
          }}
        />
      </div>
      {/* Name strip */}
      <div className="flex w-full items-center justify-between gap-2 px-3 py-2">
        <span className="truncate text-xs font-medium text-foreground">{brand.name}</span>
        <span className="font-mono text-[10px] text-subtle">design.md</span>
      </div>
    </button>
  );
}

/**
 * Mix a hex colour toward black by `factor` (0..1). Used to derive
 * the second stop of the card's gradient — gives every card a
 * brand-consistent depth without per-brand handcrafting.
 */
function darkenHex(hex: string, factor: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const dr = Math.max(0, Math.round(r * (1 - factor)));
  const dg = Math.max(0, Math.round(g * (1 - factor)));
  const db = Math.max(0, Math.round(b * (1 - factor)));
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `${toHex(dr)}${toHex(dg)}${toHex(db)}`;
}
