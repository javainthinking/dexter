# Image prompt: build-dcf-in-60-seconds

Source of truth for regenerating the hero. Current PNG is rasterised
from `apps/web/public/blog/build-dcf-in-60-seconds/hero.svg`.

## Editorial direction (current)

Infographic-first. Tutorial-pillar hero. The viewer should read the
core promise — Excel by hand ≈ 60 min, PickSkill ≈ 60 sec — from
the image alone, with a concrete 4-step preview on the left.

- Left column: eyebrow "TUTORIAL · VALUATION"; two-line serif title
  "Build a DCF / in 60 seconds." with the second line in emerald;
  short two-line tagline; "THE 4 STEPS" workflow card.
- Right column: a TIME-TO-COMPLETE bar chart with two rows —
  "Excel by hand ≈ 60 min" (long muted bar) and "PickSkill ≈ 60 sec"
  (tiny glowing emerald bar at the same horizontal scale). Below
  the divider, a callout "~60× faster, same math — every
  assumption sourced + editable."

The visual point is the magnitude difference. The narrow PickSkill
bar next to the wide Excel bar carries the entire message without
text being strictly necessary.

## Hero (1200×630, GPT Image 2 fallback prompt)

```
A modern editorial infographic for a tutorial blog post titled
"Build a DCF in 60 seconds with PickSkill". Two-column layout.

LEFT: eyebrow "TUTORIAL · VALUATION" in monospace, then a large
two-line serif title — "Build a DCF" on top in near-white, "in 60
seconds." on the second line in bright emerald. Below that, a
short two-line sans-serif tagline ("A 4-step walkthrough of the
PickSkill DCF workflow"). At the bottom, a dark inset card titled
"THE 4 STEPS" listing: "1. Open a chat", "2. Paste the DCF
prompt", "3. Edit assumptions inline → download .xlsx".

RIGHT: a comparison bar chart titled "TIME TO COMPLETE". Two
rows at the same horizontal scale:
- "Excel by hand" — wide muted-grey bar with caption
  "data plumbing · template setup · projection · sensitivity" —
  labelled "~60 min" on the right edge.
- "PickSkill" — a tiny emerald bar (~1/40th of the width of the
  Excel bar) with a soft glow, captioned "prompt → sourced output"
  and labelled "~60 sec" on the right edge.

Underneath, a thin divider, then a large serif callout "~60×" with
a smaller note: "faster, same math — every assumption sourced +
editable."

Style: warm dark background (#14120b → #1b1913 gradient), emerald
accents (#4FCBA8), near-white text (#F4F4F5). Editorial,
designed-infographic — Stripe blog / Linear blog / FT Visual
Vocabulary. Self-explanatory at OG-card thumbnail size.

Avoid: realistic faces, gold coins, dollar signs, stock-photo
finance imagery, neon excess, generic AI-cliché imagery.

Aspect ratio: 1200×630.
```

## Regeneration

```bash
bun run scripts/rasterize-svg.ts \
  apps/web/public/blog/build-dcf-in-60-seconds/hero.svg \
  apps/web/public/blog/build-dcf-in-60-seconds/hero.png
```
