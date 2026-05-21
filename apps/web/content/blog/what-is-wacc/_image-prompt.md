# Image prompt: what-is-wacc

Source of truth for regenerating the hero. The current PNG is
rasterised from the brand-aligned SVG sibling
(`apps/web/public/blog/what-is-wacc/hero.svg`).

## Editorial direction (current)

**Infographic-first.** A reader who only sees the hero should
understand that WACC is a weighted blend of equity and debt costs:

- Left column: eyebrow + giant serif title (WACC) + subtitle
  (Weighted Average Cost of Capital) + tagline + boxed formula
  card.
- Right column: a horizontal capital-structure bar split into
  "Equity 70%" (bright emerald) and "Debt 30%" (darker teal) —
  labelled with E/V and D/V underneath. Below it, two rows
  showing the cost of each source (Re ≈ 10%, Rd·(1−t) ≈ 4%) with
  matching coloured dots. A divider, then a highlighted result
  row: "Resulting WACC = 8.2%" with a soft emerald glow.

Colour tokens stay in-brand: `#14120b` background, `#1b1913`
surfaces, emerald `#4FCBA8` accents, near-white `#F4F4F5` text.

## Hero (1200×630, GPT Image 2 fallback prompt)

```
A modern editorial infographic for a financial blog post about
WACC (weighted average cost of capital). Layout: two columns.

Left column: the word "WACC" rendered in a large editorial serif
typeface, followed by a smaller sans-serif subtitle "Weighted
Average Cost of Capital", then a dimmed one-line tagline, then a
dark inset card containing the rendered formula
"WACC = (E/V) · Re + (D/V) · Rd · (1 − t)" in a clean monospace.

Right column, top: a single horizontal bar split into two
labelled segments — a brighter emerald segment "Equity 70%" and
a darker teal segment "Debt 30%", with small captions "E / V"
and "D / V" centred beneath each. Then a section heading "COST
OF EACH SOURCE" and two rows, each prefixed by a coloured dot:
"Cost of equity (Re) — 10.0%" and "After-tax cost of debt
(Rd·(1−t)) — 4.0%". A divider line. Then a final highlighted
result row inside a dark card with a glowing emerald outline:
"Resulting WACC — 8.2%" rendered large.

Style: warm dark background (#14120b → #1b1913 gradient), emerald
accents (#4FCBA8), near-white text (#F4F4F5). Editorial, designed,
infographic — Stripe blog / Linear blog / FT Visual Vocabulary
references. The image must be self-explanatory.

Avoid: dollar signs, realistic faces, brand logos, speedometer or
clock metaphors (WACC is a weight, not a meter), neon excess,
stock-photo finance imagery.

Aspect ratio: 1200×630, suitable for OG cards and blog hero.
```

## Regeneration via the SVG → PNG pipeline (preferred)

```bash
bun run scripts/rasterize-svg.ts \
  apps/web/public/blog/what-is-wacc/hero.svg \
  apps/web/public/blog/what-is-wacc/hero.png
```
