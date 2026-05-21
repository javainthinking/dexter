# Hero prompt — what-is-fcf

Master template (see `docs/blog-strategy.md` §6) with per-post bracketed parts filled in.

## GPT Image 2 prompt

```
A modern editorial illustration for a financial analysis blog post
about Free Cash Flow (FCF) — the cash a business actually generates
that's available to investors after paying for operations and capex.

Style: dark warm aesthetic with deep blacks (#14120b) and soft
emerald accents (#4FCBA8). Minimalist, designed feel — think Stripe
blog, Linear blog. NOT corporate stock photography.

Composition: a stylised "cash funnel" arrangement on the left side
of the canvas — a wider bar at the top (representing revenue),
narrowing through two horizontal stages to a brighter, smaller bar
at the bottom (representing FCF). On the right side of each stage,
two abstract "deduction" chips (operating costs, capex) — no text,
just iconography. Below the funnel, a soft glowing emerald reservoir
ellipse, suggesting cash pooling — what's actually left for
investors. Connect the funnel stages with subtle dashed lines.

Composition: left-aligned funnel + deduction chips on the right +
reservoir pool at the bottom. Generous warm-black negative space
above and to the right for the post title (added in HTML).

Avoid:
- realistic human faces or hands
- literal dollar signs, cash bills, gold coins
- text overlays inside the image
- gradient overload, lens flares, neon excess
- a literal "funnel cone" — keep it more like minimalist editorial
  diagrams, not literal funnels
- corporate stock-photo signals

Aspect ratio: 1200×630 (16:8.4 horizontal, suitable for OG cards
and blog hero).
```

## Regeneration

```bash
bun run scripts/rasterize-svg.ts \
  apps/web/public/blog/what-is-fcf/hero.svg \
  apps/web/public/blog/what-is-fcf/hero.png
```
