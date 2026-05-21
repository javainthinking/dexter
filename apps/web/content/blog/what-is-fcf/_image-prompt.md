# Image prompt: what-is-fcf

Source of truth for regenerating the hero. The current PNG is
rasterised from the brand-aligned SVG sibling
(`apps/web/public/blog/what-is-fcf/hero.svg`).

## Editorial direction (current)

**Infographic-first.** A reader who only sees the hero should
understand that FCF is what's left after operating costs and
capex come out of revenue:

- Left column: eyebrow + giant serif title (FCF) + subtitle
  (Free Cash Flow) + tagline + boxed formula card.
- Right column: a top-down waterfall — Revenue (full-width bar,
  $100) → "−Operating costs −$72" → Operating Cash Flow (narrower
  bar, $28) → "−Capex −$10" → FCF (narrowest, brightest emerald
  bar, $18, with a soft glow). To the right of the FCF bar, a
  "18% FCF margin · cash to investors" annotation.

Colour tokens stay in-brand: `#14120b` background, `#1b1913`
surfaces, emerald `#4FCBA8` accents, near-white `#F4F4F5` text.

## Hero (1200×630, GPT Image 2 fallback prompt)

```
A modern editorial infographic for a financial blog post about
Free Cash Flow (FCF). Layout: two columns.

Left column: the abbreviation "FCF" rendered in a large editorial
serif typeface, followed by a smaller sans-serif subtitle
"Free Cash Flow", then a dimmed one-line tagline ("The cash
that's actually left for investors after the bills"), then a
dark inset card containing the rendered formula
"FCF = Operating Cash Flow − Capital Expenditure" in a clean
monospace.

Right column: a top-down waterfall chart, three bars stacked
vertically with deduction labels between them:

  - "Revenue" — full-width emerald bar at 32% opacity, labelled
    "$100".
  - Between bars: a downward arrow and "− Operating costs" with
    "−$72" on the right.
  - "Operating Cash Flow" — narrower bar at 58% opacity, labelled
    "$28".
  - Between bars: downward arrow and "− Capex (PP&E)" with "−$10".
  - "FCF" — the narrowest, brightest, glowing emerald bar with
    nearly opaque emerald fill and a soft glow. Labelled "$18".
  - To the right of the FCF bar, a callout: "18% FCF margin —
    cash to investors".

Style: warm dark background (#14120b → #1b1913 gradient), emerald
accents (#4FCBA8), near-white text (#F4F4F5). Editorial, designed
infographic — Stripe blog / Linear blog / FT Visual Vocabulary.
Self-explanatory as an infographic.

Avoid: literal funnel cones, dollar-sign icons, gold coins, brand
logos, realistic faces, neon excess, gradient overload.

Aspect ratio: 1200×630, suitable for OG cards and blog hero.
```

## Regeneration via the SVG → PNG pipeline (preferred)

```bash
bun run scripts/rasterize-svg.ts \
  apps/web/public/blog/what-is-fcf/hero.svg \
  apps/web/public/blog/what-is-fcf/hero.png
```
