---
title: How to Summarise Any 10-K in 60 Seconds with PickSkill
description: Paste one prompt → MD&A highlights, FCF, net debt, segment growth, year-over-year Risk Factor diff, and footnotes — every claim linked to EDGAR.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: The PickSkill research team — building an AI analyst for retail investors.
pillar: how-to
tags:
  - tutorial
  - 10-k
  - filings
  - workflow
heroImage: /blog/summarise-a-10k-in-60-seconds/hero.png
heroAlt: Editorial infographic comparing reading a 10-K by hand (30 min) versus PickSkill (60 sec) with the four sections highlighted
---

The [10-K reading guide](/blog/how-to-read-10k) shows the four sections of an annual report that actually matter (Items 7, 8, 1A, and the footnotes flagged from those). That's a 30-minute exercise on your own. This tutorial walks through the same workflow in 60 seconds with PickSkill — MD&A highlights, the three financial-statement numbers that matter, a Risk Factor diff against the prior year's filing, and a list of footnotes worth chasing. Every claim is linked to the page of the source filing.

### Key takeaways

- **Four steps, ~60 seconds.** Open a chat, paste the prompt, get a 90-second walk-through, request follow-ups.
- **MD&A in plain English.** Not the company's own paraphrase — PickSkill extracts the substantive operating commentary and the working-capital / liquidity language that's often the highest-signal part.
- **Three financial numbers** automatically: [FCF](/blog/what-is-fcf) (OCF − Capex), net debt (debt − cash), and year-over-year revenue growth by segment.
- **Risk Factor diff** against the prior year's 10-K — the new or substantively changed language is highlighted; the unchanged boilerplate is suppressed.
- **Source-linked.** Every claim and every number is one click from the original filing page on SEC EDGAR.

## Why this matters

A retail investor who actually reads 10-Ks gets a meaningful edge over one who only reads earnings press releases — but reading a 200-page filing is a real time investment, and the parts that actually matter are scattered across the document. This tutorial removes the scavenger-hunt phase: PickSkill gives you the right 4 sections distilled in 60 seconds so you spend your time on judgement, not document navigation.

## The 4-step workflow

### Step 1 — Open a chat

Go to [/chat](/chat) and sign in (one click, free trial).

### Step 2 — Paste the prompt

Replace the ticker with whatever you're researching:

```text
Summarise NVDA's most recent 10-K. Give me:
- MD&A highlights (year-over-year revenue drivers, liquidity language)
- FCF, net debt, segment revenue growth
- Risk Factor changes vs. last year — only new or substantively changed
- Footnotes I should chase
- Links to the source pages for every claim
```

### Step 3 — Wait ~30 seconds

PickSkill:
1. Pulls the latest 10-K (and the prior year's, for the Risk Factor diff) from [SEC EDGAR][edgar].
2. Extracts Item 7 (MD&A) and locates the "Liquidity and Capital Resources" subsection.
3. Extracts the three financial statements; computes [FCF](/blog/what-is-fcf), net debt, segment revenue growth.
4. Diffs Item 1A (Risk Factors) against the prior year's filing word by word, surfaces only the new or substantively changed paragraphs.
5. Flags the 1–3 footnotes most likely to contain material new disclosures (usually revenue-recognition, debt schedule, contingencies).
6. Writes the result as a streamed 90-second walk-through with every claim linked to the source filing page.

[edgar]: https://www.sec.gov/edgar

### Step 4 — Ask follow-ups

This is where the tutorial separates a summary from a research workflow:

```text
The Risk Factor diff mentioned "customer concentration" — pull the exact
language and tell me which customer they're referring to (cross-reference
with the segment disclosures).
```

```text
The MD&A noted operating margins compressed YoY — break down whether that
was COGS, SG&A, or R&D. Show me the year-over-year delta on each.
```

```text
What's the company's debt maturity wall over the next 3 years? Pull from
the debt schedule footnote.
```

PickSkill keeps the filing in context, so each follow-up retrieves directly from the same document. No re-uploading, no losing your place.

> **Try it now.** [Open a chat](/chat) and paste the Step 2 prompt with any US-listed ticker.

## What the output looks like

| Section | What you get |
|---|---|
| **MD&A** | 4–6 bullet points covering the revenue YoY drivers, margin movement, and the liquidity/capital-resources commentary — each linked back to the Item 7 page. |
| **Financials** | 3 numbers: TTM FCF, net debt as of the most recent balance sheet date, segment revenue YoY growth. Each linked back to the relevant statement page. |
| **Risk Factor diff** | A short list of *only* the new or substantively changed risk paragraphs with the deltas highlighted. Unchanged boilerplate is omitted. |
| **Footnote watchlist** | 1–3 footnote numbers + one sentence on why each is worth reading. |
| **Source links** | Every line in the walk-through has a "[source]" link to the exact page of the filing on EDGAR. |

## What you can't do in 60 seconds

Honest caveats:

- **Full forensic accounting analysis** — finding revenue-recognition irregularities or aggressive cost capitalisation requires reading the relevant footnotes in depth. PickSkill can flag them in the watchlist but won't do the forensic work itself.
- **Reading the proxy (DEF 14A)** — executive compensation and related-party transactions live in a separate filing. Worth knowing what's there before you commit to a position; PickSkill can pull it in as a follow-up but it's not part of the 60-second 10-K flow.
- **Verifying every claim independently.** The 90-second walk-through is a starting point. For consequential decisions, click through to the source pages and verify.

## Why this tutorial complements the explainer

The [10-K reading guide](/blog/how-to-read-10k) teaches you what to look for in each section — that's the framework you'll use for the rest of your investing life. This tutorial removes the friction of getting there. Read the explainer once; use the tutorial workflow every time you research a new name.

The same pattern repeats across the foundation cluster:
- [What Is DCF?](/blog/what-is-dcf) (framework) → [Build a DCF in 60 Seconds](/blog/build-dcf-in-60-seconds) (tutorial)
- [What Is WACC?](/blog/what-is-wacc) (framework) — covered in the DCF tutorial
- [What Is FCF?](/blog/what-is-fcf) (framework) — number 1 in the financials output above
- [How to Read a 10-K](/blog/how-to-read-10k) (framework) → this tutorial

## FAQ

**Does this work on Hong Kong and A-share filings?**
Yes — PickSkill recognises HKEx tickers (e.g. `9988.HK`) and pulls the equivalent annual report from HKEx Disclosure. For A-shares, it pulls from Cninfo. The MD&A structure differs slightly (annual reports rather than 10-Ks), but the four-section extraction logic still applies.

**How accurate is the Risk Factor diff?**
Substantively accurate at the paragraph level. PickSkill does sentence-level alignment between the current and prior year's Item 1A and surfaces only paragraphs that have been added or materially rewritten. Cosmetic edits (re-numbering, sentence reordering) are suppressed.

**Can I run this on 10-Qs (quarterly reports)?**
Yes — same flow, just say "summarise the latest 10-Q" instead. The Risk Factor diff is less useful on 10-Qs (companies rarely refresh Item 1A quarterly), but the MD&A delta against the prior quarter is high-signal.

**What if the filing is too long to summarise reliably?**
A typical 10-K is 150–300 pages. PickSkill handles up to ~500 pages of filing content. For multi-segment conglomerates with massive 10-Ks (e.g. GE in its diversified era), the workflow takes 2–3 minutes rather than 60 seconds.

**Where does PickSkill source filings?**
Direct from [SEC EDGAR](https://www.sec.gov/edgar) for US filings, HKEx Disclosure for Hong Kong, Cninfo for A-shares. No third-party data middleman, so the text and numbers exactly match what's on file with the regulator.
