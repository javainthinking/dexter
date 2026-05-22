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
 * Brand card — minimal swatch style.
 *
 * Layout: the **brand colour itself is the hero**. The logo lives as
 * a small (~28px) badge tucked top-left like a maker's mark on a
 * paint chip — it identifies the brand but doesn't dominate. The
 * remaining space is mostly empty colour with a soft "light source"
 * glow at top-right for tactile depth (no chunky white plate, no
 * centred sticker effect).
 *
 *   ┌──────────────────────────────┐
 *   │ [logo]            ☀ (glow)   │  ← swatch (mostly empty colour)
 *   │                              │
 *   │                              │
 *   ├──────────────────────────────┤
 *   │ Airbnb              #FF5A5F  │  ← paint-chip band
 *   └──────────────────────────────┘
 *
 * Logo rendering is source-aware:
 *   - GitHub avatars come with their own background (Airbnb white-bg
 *     wordmark, ClickHouse black-bg yellow-bars, etc.), so we clip
 *     them with rounded corners and a 1px ring matching the swatch.
 *   - Simple Icons (transparent SVG, brand-coloured fill) render in
 *     a contrast tone — white on dark brands, near-black on light —
 *     so they're readable directly on the swatch with no plate.
 *   - Letter-mark fallback uses serif in the same contrast tone.
 *
 * Hover: card lifts 2px, the corner glow brightens, and the logo
 * scales subtly. No sticker pop.
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
  const swatchSecondary = darkenHex(brand.color, 0.4);
  const isDarkBrand = isDark(brand.color);
  // On light brand swatches we tint Simple Icons + letter marks dark
  // for legibility; on dark brand swatches, white.
  const fgHex = isDarkBrand ? 'ffffff' : '14120b';

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
      {/* Swatch — brand-colour field with a soft top-right glow for
          depth, plus a faint dot texture for tactile feel. */}
      <div
        className="relative aspect-[5/3] w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #${brand.color} 0%, #${swatchSecondary} 100%)`,
        }}
      >
        {/* Soft radial glow at top-right — "light hitting paint". */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.28) 0%, transparent 55%)',
            opacity: 0.7,
          }}
        />
        {/* Faint dot texture — same idea as before but lower opacity
            so it whispers instead of shouting. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)',
            backgroundSize: '14px 14px',
          }}
        />

        {/* Logo badge — 40px top-left, frosted-glass plate that adapts
            to whatever brand swatch sits behind it. On dark swatches
            the plate is a faint white tint + white hairline ring; on
            light swatches, faint black tint + black hairline ring.
            This way the plate reads as a neutral "card stock" frame
            regardless of brand colour, without committing to a single
            grey value that would clash with one extreme or the other. */}
        <div
          className={cn(
            'absolute left-3 top-3 flex size-10 items-center justify-center overflow-hidden',
            'rounded-md transition-transform duration-300 group-hover:scale-105',
            isDarkBrand
              ? 'bg-white/12 ring-1 ring-white/25'
              : 'bg-black/8 ring-1 ring-black/15',
          )}
        >
          {logoUrl && isGithubAvatar ? (
            // GitHub avatar — fills the plate. Org's own background
            // (usually white) sits over the frosted-glass tint, which
            // still shows through any transparent edge pixels and as
            // the visible hairline ring around the outside.
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
            // Simple Icons SVG — inset on the frosted plate, rendered
            // in the contrast tone for the brand swatch.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://cdn.simpleicons.org/${brand.iconSlug}/${fgHex}`}
              alt=""
              width={28}
              height={28}
              loading="lazy"
              className="size-6 object-contain"
            />
          ) : (
            // Letter mark — serif initial inset on the frosted plate.
            <span
              className="font-serif text-xl font-semibold leading-none"
              style={{ color: isDarkBrand ? '#FFFFFF' : '#14120b' }}
              aria-hidden="true"
            >
              {brand.name.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Paint-chip band — darker stripe of the brand colour with the
          name + a hex chip. Auto-switches text colour by luminance. */}
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
