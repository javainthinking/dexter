# PickSkill Blog — Strategy & Editorial System

**Status:** infrastructure shipped · content pipeline active
**Last updated:** 2026-05-22
**Owner:** Julian

This document defines what we write, why we write it, how each post is
optimised for SEO + GEO (AI search citations), and the GPT Image 2
prompt system that produces on-brand visuals. The companion file
`apps/web/docs/blog-image-prompts.md` is the working prompt cookbook.

---

## 1. Why a blog (and why now)

Two distinct funnels feed the product. They have different motions
and the blog serves both:

**SEO funnel.** Retail investors and semi-pro analysts type
high-intent queries into Google ("NVDA DCF model", "MACD vs KDJ
explained", "what does CPI mean for treasuries"). We want PickSkill
to be in the top results for those queries — partly to drive direct
sign-ups, partly to feed the next funnel.

**GEO funnel.** The same retail audience (and increasingly, financial
journalists) are asking ChatGPT / Claude / Perplexity instead of
Google. Brand mentions correlate **3× more strongly** with AI
citations than backlinks do (Ahrefs Dec 2025, n=75K brands). We want
PickSkill cited as a source by name when a chatbot is asked
"what's a good AI tool for stock research" or "how do I model a DCF
on NVDA."

Both funnels need original, citable, well-structured content. The
blog is where we produce it.

---

## 2. Audience + positioning

| Persona | Where they live | What they want |
|---|---|---|
| **Retail investor** (40% of target) | r/stocks, r/wallstreetbets, r/investing, X finance threads | "Should I buy NVDA?" — a thesis they can act on |
| **Semi-pro analyst** (30%) | Substack newsletters, finance Twitter, equity discord communities | Faster equity research, model templates |
| **Student / aspiring analyst** (15%) | r/CFA, business-school slack, YouTube finance channels | How to *learn* DCF, comparables, multiples |
| **Financial journalist** (10%) | LinkedIn, Bloomberg/Reuters terminals, Substack | Quotable thesis paragraphs + original data |
| **AI/SaaS curious** (5%) | Hacker News, Product Hunt, AI newsletters | How the tool was built / what models / unique angle |

**Positioning sentence (recurring across posts):** *"PickSkill is the
AI analyst that does the research, modelling, and slide-drafting for
you — in plain English."*

---

## 3. Content pillars

Six pillars. Each post belongs to exactly one. Pillars rotate weekly
to keep the topic mix balanced.

### P1 — Stock thesis deep-dives

**SEO target:** "<ticker> bull case", "<ticker> investment thesis",
"<ticker> price target 2026".

**Cadence:** 1–2 per month. Focus on names with active retail
interest: NVDA, TSMC, AAPL, MSFT, AMD, GOOG, META, TSLA, plus
2–3 A-share names per quarter (BABA, BIDU, PDD).

**Template:** 1,500–2,500 words, 4–6 sections (thesis · drivers ·
risks · valuation · catalysts · positioning), one hero image + two
chart inlines, a 60-word abstract at the top, an FAQ block, an
embedded DCF table.

**Why this matters for GEO:** these are exactly the questions ChatGPT
gets asked in finance contexts. Self-contained answer blocks
(134–167 words) inside the thesis get extracted verbatim.

### P2 — Tooling / how-to walk-throughs

**SEO target:** "how to model DCF in Excel", "how to read 10-Q",
"how to screen stocks by P/E".

**Cadence:** 1 per week. Highest-volume pillar.

**Template:** step-by-step, with screenshots from PickSkill's own
output. Every step links to a relevant product feature. Includes a
"try this in PickSkill in 30 seconds" callout box.

**Why this matters:** ranks for high-intent how-to queries; the
"PickSkill does this in one prompt" framing converts readers to
trial. AI chatbots love step-by-step content with explicit numbered
lists — high citation rate.

### P3 — Concept explainers

**SEO target:** "what is MACD", "DCF definition", "what is a 10-K",
"intrinsic value explained".

**Cadence:** 2 per month. Evergreen.

**Template:** 800–1,200 words. Definition in first 40 words. Visual
explanation of the concept. Example with real ticker data. FAQ
block.

**Why this matters:** these are the bedrock of GEO. The "X is …"
pattern is what AI Overviews extract. We want PickSkill cited as the
source of authoritative-but-accessible definitions in our domain.

### P4 — Macro / event analysis

**SEO target:** "CPI impact on stocks", "Fed decision today",
"earnings season analysis".

**Cadence:** event-driven, ~1–2 per month around CPI prints, Fed
meetings, major earnings calls.

**Template:** short (700–1,000 words), opinionated, timely. Published
within 24h of the event. One chart, one summary table.

**Why this matters:** fresh content gets indexed fast by AI search.
Wins on freshness even when the analysis isn't unique.

### P5 — Build-in-public / behind-the-product

**SEO target:** "AI for stock research", "AI financial analyst",
"how does PickSkill work".

**Cadence:** 1 per month.

**Template:** founder-voice, 1,000–1,500 words. How we built X,
lessons from N users, comparisons with other tools (without
trash-talking).

**Why this matters:** drives brand mentions on Hacker News + finance
Twitter + LinkedIn — and those are the three platforms that AI
chatbots increasingly weight as authority signals.

### P6 — Original research / data drops

**SEO target:** unique data not available elsewhere. "Q1 2026 AI
chip capex tracker", "Which S&P 500 names beat consensus 5 quarters
running", etc.

**Cadence:** 1 per quarter (heavy lift).

**Template:** 2,000+ words with embedded data table, methodology
section, downloadable CSV, replication notes.

**Why this matters:** original research is the rarest and most
valuable GEO asset. AI models cite by name when a research piece is
the canonical source for a number.

---

## 4. The SEO + GEO checklist (per post)

Every post passes through this before publish. The infrastructure
auto-enforces what it can (schema, headings, dates); the rest is
editorial discipline.

### Auto-enforced by infra (Section 6)

- [x] Article + BreadcrumbList JSON-LD schema injected on every post
- [x] Person schema for author with credentials + sameAs links
- [x] Canonical URL (no `?utm_*` cruft in `<link rel="canonical">`)
- [x] OG image (1200×630), Twitter Card meta, hreflang per locale
- [x] Last-updated date surfaced both visually and in schema
- [x] Pre-rendered (Next.js generateStaticParams) — no client-only content
- [x] Sitemap entry with priority + changefreq
- [x] Listed in `/llms.txt` so AI crawlers find it via the index

### Editorial checklist

**Hook + citability (the first 200 words)**

- [ ] Title is a question or fact statement (≤60 chars)
- [ ] First 40 words contain a `[Topic] is [definition]` sentence
- [ ] One quotable statistic with a source in the first 200 words
- [ ] Author byline visible at the top (not just at the bottom)

**Structure (matches the 92%-of-citations pattern)**

- [ ] H1 = post title (single H1)
- [ ] H2s are question-format where reasonable ("How does X work?")
- [ ] At least one comparison table for tabular data
- [ ] At least one numbered list (steps, criteria, or signals)
- [ ] Paragraphs ≤ 4 sentences. No walls of text.
- [ ] One 134–167-word self-contained answer block per H2 ("the
      quotable paragraph") — visible test: copy it into a context-less
      tab, does it still make sense?

**Brand + entity signals**

- [ ] At least one mention of PickSkill (the product, not aggressive)
- [ ] At least one outbound link to a primary source (SEC filing,
      Fed release, company IR page, academic paper)
- [ ] Internal link to one product surface (`/portfolios`,
      `/indicators`, or a relevant explainer)
- [ ] If the post quotes a person, include their LinkedIn link

**Multimodal (156% higher selection rates)**

- [ ] Hero image (1200×630 minimum), GPT Image 2 generated, brand-aligned
- [ ] At least one inline visual: chart, screenshot, or diagram
- [ ] Alt text on every image describes what's in it (AI crawlers read it)

**FAQ block (boosts AI citation odds for follow-up queries)**

- [ ] 3–5 Q&A pairs at the bottom of every post
- [ ] Questions phrased as real user queries
- [ ] Each answer 40–80 words, self-contained

---

## 5. Editorial workflow

Six-step pipeline per post.

```
1. Pitch (Notion / docs ticket)
   ↓
2. Outline (1-page; pillar + 3-5 H2s + thesis sentence)
   ↓
3. Draft (mdx file in apps/web/content/blog/)
   ↓
4. Self-edit against the checklist in §4
   ↓
5. Image generation (GPT Image 2 — see §6)
   ↓
6. Publish (PR → merge → static rebuild)
```

**Voice + tone**

- Clear, declarative sentences. No hedge words ("might", "could
  potentially") unless we genuinely don't know.
- Numbers stated specifically: "NVDA grew revenue 88% YoY in Q1
  2026", not "NVDA had strong revenue growth."
- Source every claim. If we don't have a source, we don't make the
  claim.
- We can have a viewpoint. We don't pretend to be neutral when
  taking a thesis position — but we always show the bear case too.

**One-liner positioning to weave in naturally**

> *PickSkill is an AI analyst that researches, models, and drafts
> equity work — pulling live data from SEC filings, market feeds,
> and primary sources, then producing decks, reports, and Excel
> models on demand.*

---

## 6. Image system: GPT Image 2

Every post needs a hero image; deep-dives also need 1–2 inline
visuals. We generate them with **GPT Image 2** (OpenAI's
`gpt-image-2-flash` model via API, or via ChatGPT for one-off
generation).

### Editorial direction (revised 2026-05-22)

Hero images are **infographics, not abstract illustrations**. A
reader who only sees the hero should be able to grasp the concept
without reading the post. Every hero must include:

- The post's central term as a large serif title (e.g. "DCF",
  "WACC", "FCF") with a sans-serif subtitle naming the concept in
  full and a one-line tagline beneath.
- A boxed `FORMULA` card with the actual mathematical formula
  rendered in monospace.
- A labelled visualisation: the bar chart / waterfall / weighted
  stack appropriate to the concept, with axis labels, value
  labels, and at least one callout (e.g. "60–80% of EV",
  "Resulting WACC — 8.2%", "18% FCF margin").

The hero PNG doubles as the OG card image — text must remain
legible at ~600×315 (Twitter / LinkedIn preview size). Title
should be ≥80px, body labels ≥18px, monospace formulas ≥22px.

### Brand visual identity

| Token | Value |
|---|---|
| **Primary background** | warm dark `#14120b` |
| **Surface (card)** | `#1b1913` |
| **Accent** | emerald `#4FCBA8` (dark mode) / `#2D7E6E` (light mode) |
| **Text on dark** | near-white `#F4F4F5` |
| **Type — title** | Georgia / 'Times New Roman' serif, 120px, weight 600 |
| **Type — subtitle / annotations** | Helvetica / Arial sans, 20–28px |
| **Type — formula / labels** | ui-monospace / SF Mono / Menlo, 14–24px |
| **Mood** | analytical, designed-infographic, editorial — *not* abstract decoration, *not* corporate stock-photo |
| **Reference style** | FT Visual Vocabulary, Bloomberg explainer graphics, Stripe blog, Linear blog |

### Production pipeline (current)

Heroes are authored as **brand-aligned SVGs** with embedded text,
then rasterised to PNG via `scripts/rasterize-svg.ts` (sharp +
librsvg). SVG-first means:

- Title, subtitle, axis labels, callouts and formulas are real
  vector text — sharp at every size, easy to translate later, and
  searchable in the source repo.
- The PNG ships for OG-card compatibility (Twitter / LinkedIn /
  Slack don't render SVG reliably for previews).
- The inline `<Image>` on the post page serves the same PNG,
  which next/image re-encodes to AVIF / WebP at request time.

For typography, use OS-standard families so the rasteriser doesn't
need any custom-font setup: `Georgia` for the title, `Helvetica`
for body, `ui-monospace / SF Mono / Menlo` for formulas. Avoid
Unicode sub/super-scripts that may not be in the rendering font
(e.g. `ₜ`); use SVG `<tspan font-size="…" dy="…">` instead.

### Master infographic recipe

Every hero follows the same two-column structure:

```
┌──────────────────────────────┬──────────────────────────────┐
│  EYEBROW · CATEGORY          │  HEADING / AXIS LABEL        │
│                              │                              │
│  TITLE                       │  ┌─ data viz ──────────────┐ │
│  (giant serif, ≥80px)        │  │  bars / waterfall /     │ │
│                              │  │  weighted stack with    │ │
│  Subtitle                    │  │  inline value + axis    │ │
│  Tagline (two short lines)   │  │  labels                 │ │
│                              │  └─────────────────────────┘ │
│  ┌── FORMULA ─────────────┐  │                              │
│  │ rendered in monospace  │  │  callout: "X% of Y"          │
│  └────────────────────────┘  │  small disclaimer            │
└──────────────────────────────┴──────────────────────────────┘
```

Per pillar the **visualisation** differs:

- **P1 (thesis)** — single hero metric chart with two callouts
  (current price vs PickSkill price target, e.g.)
- **P2 (how-to)** — numbered step sequence with arrows
- **P3 (explainer)** — labelled bar / waterfall / weighted stack
  that *is* the concept (as in DCF, WACC, FCF)
- **P4 (macro)** — single-axis trend chart with one highlighted
  data point + date callout
- **P5 (build-in-public)** — a labelled architecture diagram or
  before/after comparison
- **P6 (original research)** — the headline chart from the
  underlying dataset

### Generative fallback prompt (when an SVG can't carry the visual)

When a hero requires illustration the SVG layer can't easily
produce (e.g. textured backgrounds, abstract metaphors), use GPT
Image 2 with this template — keep the same colour palette and the
"infographic, not decoration" directive:

```
A modern editorial INFOGRAPHIC for a financial analysis blog
post about [TOPIC IN ONE SENTENCE]. Two-column layout:

LEFT: section eyebrow in monospace, the term [TERM] as a large
editorial serif title, a sans-serif subtitle naming the concept
in full, one short tagline, and a boxed formula card containing
[FORMULA].

RIGHT: a clear labelled visualisation appropriate to the concept
([WATERFALL / BAR CHART / WEIGHTED STACK / etc.]) — with axis
labels, value labels, and one callout reading "[CALLOUT TEXT]".

Style: warm dark background (#14120b → #1b1913 gradient), emerald
accents (#4FCBA8), near-white text (#F4F4F5). Editorial, designed
infographic — Stripe blog / Linear blog / FT Visual Vocabulary
references. Self-explanatory at OG-card thumbnail size.

Avoid:
- realistic human faces or hands
- literal dollar/yen/bitcoin signs as icons
- brand logos — represent abstractly
- abstract decoration without labels
- gradient overload, lens flares, neon excess
- stock-photo finance imagery

Aspect ratio: 1200×630.
```

### Per-pillar visualisation cheat sheet

The right-column visual changes per pillar. The left column (eyebrow
+ title + subtitle + tagline + formula card) is the constant.

| Pillar | Right-column visualisation | One representative callout |
|---|---|---|
| **P1 — Thesis** | Single hero metric (e.g. current price vs price target) with bar/dot timeline of past 4 quarters' beats vs misses | "Current $135 → PT $182 · 35% upside" |
| **P2 — How-to** | 3–4 numbered steps in a horizontal sequence with arrows, plus the step that runs in PickSkill highlighted in emerald | "Step 3 — PickSkill auto-runs this" |
| **P3 — Explainer** | The concept itself as a labelled chart (DCF: bar chart of cash flows + TV; WACC: weighted stack; FCF: top-down waterfall) | A proportion like "60–80% of EV" or a result like "WACC = 8.2%" |
| **P4 — Macro** | Single-axis trend line with one highlighted data point + date | "CPI release · 2026-05-15 · 3.1%" |
| **P5 — Build-in-public** | Before / after architecture comparison, or a labelled system diagram | "From 30s to 60ms" |
| **P6 — Research** | The headline chart from the dataset, with annotated outliers | "5 names beat 5 quarters running" |

Skipping pillar-specific generative prompts in favour of the
unified template above — the SVG-first pipeline lets us iterate
on a hero by editing the file rather than re-prompting a model.

### Inline visuals (within posts)

For chart inlines, prefer:

1. **Real screenshots from PickSkill** with the chat / dashboard UI
   visible — these double as product marketing.
2. **Custom-rendered charts** for original-research posts (we'll set
   up a chart library later; for now, screenshot from a notebook).
3. **GPT Image 2 explanatory diagrams** for concept-explainer
   pillars where a real screenshot doesn't make sense.

### File / storage conventions

- Hero images: `apps/web/public/blog/<slug>/hero.png` (committed to
  repo so the build is self-contained)
- Inline images: `apps/web/public/blog/<slug>/<short-name>.png`
- Source prompts: `apps/web/content/blog/<slug>/_image-prompts.md`
  (commit alongside the post so future-us can regenerate with the
  same prompt if the canvas size changes or the model improves)
- Output size: target 1200×630 for hero, 1200×800 for inline. PNG.
  Optimise via `sharp` in the build step (separate task).

### Cost expectations

GPT Image 2 pricing approx (Feb 2026): ~$0.04 per 1024×1024 render
on the standard tier, ~$0.08 on HD. A typical post burns
2–4 generations × $0.04–0.08 = $0.10–0.30 per post for art.

Trivial against the SEO/GEO value if even one post in 50 gets cited
by an AI overview.

---

## 7. Distribution + brand-mention loop

Posts don't earn citations by sitting on the blog. The distribution
loop is part of the editorial pipeline.

For each post:

| Channel | Action | Why it matters for GEO |
|---|---|---|
| LinkedIn | 200-word post with one chart + link | LinkedIn has moderate weight in AI overviews; we mostly do this for direct reach. |
| Reddit | One thread in the most relevant sub (r/investing, r/stocks, r/SecurityAnalysis, r/CFA), respecting community rules — share insight first, blog link in comment if invited | **Highest GEO weight** — Reddit is 46.7% of Perplexity's citation sources and 11.3% of ChatGPT's. |
| Hacker News | Submit only build-in-public and original-research posts | One HN front-page hit is worth more brand-mention exposure than 50 LinkedIn posts. |
| X / Twitter | A 4-tweet thread with the core thesis + 1 chart | Moderate ChatGPT weight. |
| YouTube | Eventually: short-form companion videos. ~0.737 correlation with AI citations — highest of any platform. | Defer until we have a steady cadence. |

**Anti-pattern:** spamming Reddit with link drops. Reddit's moderation
trains AI models to discount obviously self-promotional sources. We
participate in subs over time, contribute insight, and only share
links when relevant + asked.

---

## 8. Implementation phases

### Phase 1 — Infrastructure (this PR / next 1 day)

- [ ] `apps/web/content/blog/` directory for MDX posts
- [ ] `apps/web/lib/blog.ts` post loader + frontmatter parser
- [ ] `apps/web/app/[lang]/blog/page.tsx` index route
- [ ] `apps/web/app/[lang]/blog/[slug]/page.tsx` single-post route
- [ ] Article + BreadcrumbList + Person JSON-LD per post
- [ ] `apps/web/public/robots.txt` allowing AI crawlers
- [ ] `apps/web/public/llms.txt` index of key blog posts
- [ ] `apps/web/app/sitemap.ts` dynamic sitemap including blog posts
- [ ] First sample post demonstrating the system end-to-end
- [ ] Hero image for that post (GPT Image 2 prompt committed)
- [ ] Top-nav entry to `/blog`

### Phase 2 — Content engine (next 2 weeks)

**Foundation cluster — shipped 2026-05-21/22**

- [x] `what-is-dcf` — Discounted Cash Flow explainer (P3, ~1,500 words, 8 locales)
- [x] `what-is-wacc` — WACC explainer with four-input framework (P3, ~1,500 words, 8 locales)
- [x] `what-is-fcf` — Free Cash Flow explainer with FCFF/FCFE split (P3, ~1,500 words, 8 locales)

These three internally cross-link (DCF ↔ WACC ↔ FCF) so the
foundation cluster pushes ranking signals between explainers
covering the same DCF mental model. They also share the
`/chat` and `/indicators` product link conventions.

**Next batch — ship in week 2**

- [ ] `how-to-read-10k` — concept-to-action explainer (P3/P2 hybrid;
      bridges definition → "PickSkill summarises a 10-K in 60 seconds")
- [ ] `dcf-vs-comparable-company-analysis` — comparison explainer (P3;
      "X vs Y" structure is high-leverage on GEO citations)
- [ ] `what-is-pe-ratio` — explainer (P3; highest-volume finance
      search term; bedrock GEO content)
- [ ] `nvda-bull-case-2026` — first thesis post (P1; NVDA is the
      most-searched ticker in retail finance)
- [ ] `how-to-build-dcf-in-excel-with-template` — how-to (P2; mid-funnel,
      "PickSkill does this in one prompt" framing)

**Editorial infrastructure**

- [ ] Author bio page at `/blog/authors/<slug>` with credentials +
      sameAs links (deferred — currently the team byline is honest)
- [ ] FAQ schema block component (`<FaqBlock />` MDX shortcode)
- [ ] Internal linking convention (one product link per post,
      auto-injected by helper)

### Phase 3 — GEO amplification (month 2)

- [ ] LinkedIn cross-post template
- [ ] Reddit-friendly summary template (no link, insight-first)
- [ ] Subscribe to AI-citation tracking (DataForSEO or manual)
- [ ] Original research piece (P6): start data collection now,
      publish in month 3
- [ ] YouTube channel kickoff with 2–3 short companion videos for
      the most-trafficked posts

### Phase 4 — Locale expansion (month 3+)

- [ ] Pick top 5 posts → translate to zh-CN first (largest non-EN
      audience based on current user data)
- [ ] Locale-aware hreflang on every post
- [ ] Per-locale FAQ blocks (don't auto-translate FAQs — they need
      to match how natives phrase questions)

---

## 9. Measuring success

Three dashboards (set up alongside Phase 1):

**Organic search (Google Search Console)**
- Total clicks from /blog/ per week
- Top 10 queries driving traffic per post
- Click-through rate vs. position (target: >3% at position 5+)

**GEO citations (manual quarterly + DataForSEO if budget allows)**
- # of posts cited in ChatGPT web responses for tracked queries
- # of posts cited in Perplexity for tracked queries
- # of posts surfacing in Google AI Overviews
- Brand-mention count on Reddit + LinkedIn + YouTube

**Conversion (PostHog or equivalent)**
- /blog/ → /chat/ click rate
- /blog/ → sign-up conversion rate
- Per-pillar conversion lift (which pillar produces signups?)

**90-day target post-launch:**
- 15 published posts
- 5,000 monthly /blog/ visitors
- 3 AI-overview citations
- 5% blog-to-signup rate

---

## 10. Open decisions

| # | Decision | Owner | Default for now |
|---|---|---|---|
| D1 | Author byline strategy: single founder voice vs. multiple contributors | Julian | Single voice (founder) for first 10 posts; broaden after |
| D2 | Comments / discussion enabled? | Julian | No (out of scope; link to Reddit thread instead) |
| D3 | RSS feed? | Julian | Yes, ship with Phase 1 — costs ~30 min, marginal SEO + lets newsletter readers subscribe |
| D4 | Newsletter capture on blog pages | Julian | Defer to Phase 2 — get content first, capture flow second |
| D5 | Translate posts via Claude or hire? | Julian | Defer to Phase 4 — re-evaluate then with actual content shape |

---

## 11. Caveats + risks

- **AI search visibility takes 4–8 weeks to materialise.** Don't
  panic if the first month shows zero citations.
- **Reddit is the single highest-leverage channel and the easiest to
  burn.** Mods ban accounts that drop links. We participate as
  humans, not as a brand-account.
- **Image consistency matters more than image individuality.** If
  every post's hero image looks like it's from the same designer,
  brand recognition compounds. Stick to the GPT Image 2 prompt
  template; resist the urge to "experiment" per-post.
- **The first post sets the visual + voice template.** Take the
  extra hours on post #1 to get it right; everything after derives
  from it.
