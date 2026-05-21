# Hero prompt — what-is-wacc

Master template (see `docs/blog-strategy.md` §6) with the per-post bracketed parts filled in.

## GPT Image 2 prompt

```
A modern editorial illustration for a financial analysis blog post
about WACC (Weighted Average Cost of Capital) — the discount rate
that blends a company's cost of equity and after-tax cost of debt,
weighted by capital structure.

Style: dark warm aesthetic with deep blacks (#14120b) and soft
emerald accents (#4FCBA8). Minimalist, designed feel — think Stripe
blog, Linear blog. NOT corporate stock photography.

Composition: a central concentric two-arc dial — the outer arc
(longer, in emerald) representing the equity weight, the inner arc
(shorter, in deeper teal) representing the debt weight. A single
glowing emerald node at the centre of the dial where the two arcs
"weight" together — the WACC point. Around the dial, generous warm
negative space; on one side, three minimal abstract chips suggesting
the inputs (Re, Rd, tax shield) — no text labels, just iconography.

Elements: weighted-average dial, abstract input chips (no text),
soft glow on the central node, single thin baseline rule for grounding.

Avoid:
- realistic human faces or hands
- literal dollar/yen signs as icons
- text overlays (the post title is added in HTML)
- gradient overload, lens flares, neon excess
- cliched stock-photo finance signals
- a clock or speedometer aesthetic — this is a *weight* dial, not a meter

Aspect ratio: 1200×630 (16:8.4 horizontal, suitable for OG cards
and blog hero).
```

## Regeneration

```bash
# After saving a new PNG to hero.png, no further action needed.
# If only an updated SVG is shipped, rasterise:
bun run scripts/rasterize-svg.ts \
  apps/web/public/blog/what-is-wacc/hero.svg \
  apps/web/public/blog/what-is-wacc/hero.png
```
