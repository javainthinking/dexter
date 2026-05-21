# Image prompt: what-is-dcf

Source of truth for regenerating the hero. The current PNG is
rasterised from the brand-aligned SVG sibling
(`apps/web/public/blog/what-is-dcf/hero.svg`) — that's the
preferred render because it keeps the actual title text + formula
text sharp at every size. The GPT Image 2 prompt below is the
fallback path for a fully generative re-shoot if we ever decide
to move away from SVG.

## Editorial direction (current)

**Infographic-first**, not abstract illustration. A reader who only
sees the hero image should be able to grasp the concept without
reading the post:

- Left column: section eyebrow + giant serif title (DCF) +
  subtitle (Discounted Cash Flow) + one-line tagline + boxed formula card.
- Right column: a labelled bar chart of projected cash flows
  (Y1–Y5 + bright Terminal Value bar) with a dashed discount arc
  curving from TV back to a "PV today" anchor at the left edge of
  the chart. Annotation callouts: "60–80% of EV" pointing at TV,
  "Time →" axis label.

Colour tokens stay in-brand: `#14120b` background, `#1b1913`
surfaces, emerald `#4FCBA8` accents, near-white `#F4F4F5` text.

## Hero (1200×630, GPT Image 2 fallback prompt)

```
A modern editorial infographic for a financial blog post about
discounted cash flow (DCF) valuation. Layout: two columns.

Left column: the word "DCF" rendered in a large editorial serif
typeface (Georgia / Garamond), followed by a smaller sans-serif
subtitle "Discounted Cash Flow", then a one-line dimmed tagline,
then a dark inset card containing the rendered formula
"EV = Σ FCFₜ / (1 + WACC)ᵗ  +  TV / (1 + WACC)ⁿ" in a clean
monospace face.

Right column: a clear bar chart showing five tapered emerald
bars labelled Y1, Y2, Y3, Y4, Y5 plus a sixth taller, brighter,
glowing emerald bar labelled "TV" (terminal value). A dashed
emerald arc curves from the top of the TV bar back to a small
arrowhead on the left side of the chart, with the text
"discount back to PV →" near the arrowhead. A small callout near
the TV bar reads "60–80% of EV". Below the bars, an axis label
"Time →".

Style: warm dark background (#14120b → #1b1913 gradient), emerald
accents (#4FCBA8), near-white text (#F4F4F5). Editorial, designed
look — Stripe blog / Linear blog / FT Visual Vocabulary. NOT
abstract decoration. The image must be self-explanatory as an
infographic; a viewer should grasp the DCF mental model from the
image alone.

Avoid: dollar-sign icons, realistic faces or hands, brand logos,
neon glow excess, lens flares, generic stock-photo finance
imagery, vague abstract shapes without labels.

Aspect ratio: 1200×630, suitable for OG cards and blog hero.
```

## Regeneration via the SVG → PNG pipeline (preferred)

```bash
bun run scripts/rasterize-svg.ts \
  apps/web/public/blog/what-is-dcf/hero.svg \
  apps/web/public/blog/what-is-dcf/hero.png
```

The SVG is the source of truth; the PNG is generated for OG-card
compatibility (Twitter / LinkedIn / Slack don't render SVG
reliably for previews). The inline `<Image>` on the post page
serves the same PNG, which next/image then re-encodes to AVIF /
WebP at request time based on the browser's Accept header.
