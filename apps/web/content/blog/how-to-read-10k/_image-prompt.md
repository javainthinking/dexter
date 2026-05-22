# Image prompt: how-to-read-10k

Source of truth for regenerating the hero. Current PNG is
rasterised from `apps/web/public/blog/how-to-read-10k/hero.svg`.

## Editorial direction (current)

Infographic-first. A reader who only sees the hero should
understand that a 10-K has 15 numbered items but only 4 of them
carry the signal, and that there's a defined 30-minute reading
order.

- Left column: eyebrow + giant serif "10-K" + subtitle ("Annual
  Report Reading Guide") + tagline + a `30-MIN WORKFLOW` card
  listing the three reading steps with their minute budgets.
- Right column: a 5×3 grid representing the 15 numbered Items
  (Item 1, 1A, 1B, 2, 3 / 4, 5, 6, 7, 7A / 8, 9, 9A, 9B, 10–15
  condensed). The four that matter (1A, 7, 8 — and conceptually
  the footnotes that come with 8) are emerald-filled with a soft
  glow; the rest are dimmed outlines. A legend underneath shows
  the two states.

## Hero (1200×630, GPT Image 2 fallback prompt)

```
A modern editorial infographic for a how-to blog post about
reading the SEC 10-K filing. Two-column layout.

LEFT: section eyebrow in monospace ("HOW-TO · FILINGS"), the
abbreviation "10-K" in a large editorial serif typeface (Georgia
or similar), a sans-serif subtitle "Annual Report Reading Guide",
a one-line tagline ("What Wall Street actually reads — in 30
minutes"), and a dark inset card titled "30-MIN WORKFLOW" with
three rows: "1. MD&A (Item 7) — 15 min", "2. Financials (Item 8)
— 10 min", "3. Risk Factors diff (1A) — 5 min".

RIGHT: a grid of 15 small rectangles arranged 5 columns × 3 rows,
each labelled with its 10-K Item number and a short caption
(Business, Risk Factors, MD&A, Financials, etc.). Four cells are
filled with bright emerald and given a soft glow — Item 1A (Risk
Factors), Item 7 (MD&A), Item 8 (Financials), and a conceptual
"Footnotes" marker. The other cells are dim dark-grey outlines.
A small two-swatch legend underneath: "Read carefully" /
"Skim or skip".

Style: warm dark background (#14120b → #1b1913 gradient), emerald
accents (#4FCBA8), near-white text (#F4F4F5). Editorial,
designed-infographic — Stripe blog / Linear blog / FT Visual
Vocabulary references.

Avoid: literal scrolls, stacks of paper, magnifying glasses,
realistic faces or hands, gradient overload, neon excess, generic
stock-photo finance imagery.

Aspect ratio: 1200×630.
```

## Regeneration

```bash
bun run scripts/rasterize-svg.ts \
  apps/web/public/blog/how-to-read-10k/hero.svg \
  apps/web/public/blog/how-to-read-10k/hero.png
```
