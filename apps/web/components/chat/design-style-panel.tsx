'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Palette, X, ExternalLink } from 'lucide-react';
import {
  designStyleBrands,
  getBrandLogoUrl,
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
 * Brand card — paint-chip style.
 *
 * Three visual layers stacked top-to-bottom:
 *   1. **Swatch** (aspect 4:3) — brand-colour gradient with a soft dot
 *      texture overlaid for tactile depth. The diagonal highlight line
 *      from the previous design is retained as a subtle "design swatch"
 *      cue.
 *   2. **Logo plate** (centred on the swatch) — a soft white rounded
 *      square that *frames* the brand mark. GitHub avatars are
 *      full-bleed inside the plate (they come pre-cropped from the
 *      org's avatar). Simple Icons SVGs render inverted (brand colour
 *      on white) for contrast. Letter-mark fallbacks render in serif
 *      over the same plate.
 *   3. **Paint-chip band** below — a darker stripe of the same brand
 *      colour holding the brand name + an inline hex chip in mono.
 *      This is the visual cue that links "see, that's the brand
 *      colour" to "and here's exactly what hex it is".
 *
 * Hover: lifts 2px, brightens the swatch, scales the logo plate
 * slightly. The whole interaction reads as picking up a paint chip
 * from a designer's swatch book — not clicking a row in a list.
 */
function BrandCard({
  brand,
  onClick,
}: {
  brand: DesignStyleBrand;
  onClick: () => void;
}) {
  const logoUrl = getBrandLogoUrl(brand);
  const isGithubAvatar = brand.githubOrg !== null;
  const darkerStripe = darkenHex(brand.color, 0.25);
  const swatchSecondary = darkenHex(brand.color, 0.45);
  const isDarkBrand = isDark(brand.color);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border border-border bg-card',
        'transition-all duration-200',
        'hover:border-border-strong hover:-translate-y-0.5 hover:shadow-[var(--shadow-elev2)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
      aria-label={brand.name}
    >
      {/* Swatch — gradient + texture + diagonal highlight + logo plate */}
      <div
        className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #${brand.color} 0%, #${swatchSecondary} 100%)`,
        }}
      >
        {/* Dot-texture overlay — readable depth on solid swatches */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
            backgroundSize: '14px 14px',
          }}
        />
        {/* Diagonal swatch highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            background:
              'linear-gradient(135deg, transparent 0%, transparent 48%, rgba(255,255,255,0.4) 50%, transparent 52%, transparent 100%)',
          }}
        />

        {/* Logo plate — pure-white rounded square so brand marks read
            consistently across colours (a dark logo on a dark brand
            colour would otherwise vanish). GitHub avatars fill the
            plate; Simple Icons + letter marks are inset. */}
        <div
          className={cn(
            'relative flex size-[58%] items-center justify-center overflow-hidden rounded-lg',
            'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.18)]',
            'transition-transform duration-300 group-hover:scale-[1.04]',
          )}
        >
          {logoUrl && isGithubAvatar ? (
            // GitHub avatar — full-bleed. The org's avatar is already
            // cropped/styled by GitHub; we just frame it.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              width={256}
              height={256}
              loading="lazy"
              className="size-full object-cover"
            />
          ) : logoUrl ? (
            // Simple Icons — brand colour glyph inset on the plate so
            // it doesn't touch the edges.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://cdn.simpleicons.org/${brand.iconSlug}/${brand.color}`}
              alt=""
              width={64}
              height={64}
              loading="lazy"
              className="size-[60%] object-contain"
            />
          ) : (
            // Last-resort monogram: brand initial in the brand colour
            // on the white plate. Distinct from the gradient swatch
            // outside, still readable.
            <span
              className="font-serif text-3xl font-semibold leading-none"
              style={{ color: `#${brand.color}` }}
              aria-hidden="true"
            >
              {brand.name.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Paint-chip band — darker stripe of the brand colour with the
          name + a hex chip. White text on dark brand colours, dark
          text on light brand colours. */}
      <div
        className="flex w-full items-center justify-between gap-2 px-3 py-2"
        style={{
          background: `#${darkerStripe}`,
          color: isDarkBrand ? '#F4F4F5' : '#14120b',
        }}
      >
        <span className="truncate text-xs font-semibold tracking-tight">
          {brand.name}
        </span>
        <span
          className={cn(
            'shrink-0 rounded-sm border px-1 py-0.5 font-mono text-[9px] tabular-nums',
            isDarkBrand
              ? 'border-white/25 bg-white/10'
              : 'border-black/25 bg-black/10',
          )}
        >
          #{brand.color.toUpperCase()}
        </span>
      </div>
    </button>
  );
}

/**
 * Heuristic luminance check: returns true when the brand colour is
 * dark enough that the paint-chip band needs light text.
 */
function isDark(hex: string): boolean {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Standard relative-luminance approximation (ITU-R BT.601).
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.6;
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
