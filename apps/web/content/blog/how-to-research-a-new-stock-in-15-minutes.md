---
title: How to Research a New Stock in 15 Minutes with PickSkill
description: >-
  A complete first-pass stock research workflow — business model, financials,
  valuation, technical setup, and risks — in 15 minutes with the chat and
  indicator tools.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: The PickSkill research team — building an AI analyst for retail investors.
pillar: how-to
tags:
  - tutorial
  - research
  - workflow
  - dcf
  - 10k
  - indicators
heroImage: /blog/how-to-research-a-new-stock-in-15-minutes/hero.png
heroAlt: >-
  Editorial infographic — the 5-step research workflow on the left (business,
  financials, valuation, technical, risks) with the one-page output decision
  card for TSM on the right.
---

**A first-pass stock research session that used to take 2–3 hours can be completed in 15 minutes with the right workflow.** Not because you skip steps — the framework still covers business model, financials, valuation, technical setup, and risks — but because PickSkill compresses the data-gathering step into seconds and leaves you with the 15 minutes you actually need: the judgement calls. This tutorial is the canonical first-pass workflow. Use it for any new name you are considering, before deciding whether to add to a watchlist or commit further research time.

### Key takeaways

- **5 steps, ~15 minutes total.** Business → financials → valuation → technical → risks. Each step is one prompt.
- **The framework forces structured thinking** — no skipping to "should I buy this?" before answering the upstream questions.
- **Outputs a one-page summary** suitable for adding to a [watchlist](/blog/how-to-build-a-watchlist-that-actually-works) or rejecting the name.
- **The fast version (15 minutes) catches 80% of dealbreakers.** The slow version (2+ hours of deep work) is needed only after the fast version says "interesting."
- **Works on US, HK, and A-share names** with the same workflow — PickSkill pulls market-appropriate filings.

## Why this matters

Most retail investors stumble at the first-pass research stage. Two common failures:

1. **Skipping straight to the chart.** "The chart looks good" is not a thesis. Without the underlying business model and financials check, you are buying a price pattern.
2. **Drowning in detail.** Reading the full 10-K, 8-K, latest earnings call transcript, and every analyst report before deciding if a name is even worth deeper work. By the time you finish, you have spent 4 hours on a name you would have rejected at hour one with a structured framework.

The 15-minute first-pass workflow is the rejection filter. Most names you research will not pass it. The point is to spend 15 minutes per name and reserve the 2-hour deep dive for the names that pass.

## The 5-step workflow

### Step 1 — Business model (3 minutes)

Open [/chat](/chat). Paste this prompt:

```text
Summarize [TICKER] in 5 bullets:
1. What does the company actually do (1 sentence)
2. Revenue split — top 3 segments and their % of total
3. Top 3 customers or customer concentration
4. Top 3 competitors  
5. The single most important question this business needs to get right
```

PickSkill returns a concise business-model summary built from the latest 10-K and recent press releases. The "single most important question" framing forces clarity on what actually drives the business — a useful test of whether you understand the company or just the ticker.

**Red flags at this stage**: business model not clear after 5 bullets, customer concentration above 30% on a single customer, no visible competitive moat. Stop here if you see these; the name is not worth the next 12 minutes.

### Step 2 — Financials health (3 minutes)

Next prompt:

```text
For [TICKER], pull the last 4 quarters and last 3 years of:
- Revenue and revenue growth YoY
- Gross margin trajectory
- Operating margin trajectory  
- Free cash flow (last 4 quarters)
- Net debt position (cash − total debt)
- Share count change YoY (buybacks vs issuance)
```

PickSkill renders this as a small table. The financial story should be coherent in one minute of reading.

**Red flags at this stage**: revenue growth decelerating sharply, margins compressing without a clear cause, negative free cash flow that is not from intentional growth investment, share count rising 5%+ annually without acquisition activity.

### Step 3 — Valuation snapshot (3 minutes)

Next prompt:

```text
For [TICKER], compute:
- Current trailing P/E, forward P/E, EV/EBITDA, P/B
- 5-year historical range for each multiple (10th–90th percentile)
- Where current multiples sit within that historical range
- Compare current multiples to 3 closest peers
- Quick 5-year DCF — implied price at base assumptions
```

PickSkill returns the multiples, peer comparison, and a quick DCF (see [Build a DCF in 60 Seconds](/blog/build-dcf-in-60-seconds) for the full version).

**Red flags at this stage**: every multiple at the top of its 5-year range with no clear acceleration in fundamentals to justify; DCF implied price more than 30% below current; relative valuation higher than every peer.

### Step 4 — Technical setup (3 minutes)

Next prompt:

```text
For [TICKER], show me the current technical setup:
- Price vs 20 / 60 / 200-day MA
- Current MACD, RSI, KDJ readings
- Any active divergence (regular or hidden)
- Nearest support and resistance levels
- 5-day bucket trail across the full indicator suite
```

PickSkill pulls the [/indicators](/indicators) data and surfaces the multi-signal alignment.

**Red flags at this stage**: deeply overbought entry (RSI > 75, every indicator pinned high), bearish divergence forming, price extended far above the 200-day SMA. These are not buy-it-now setups; they are wait-for-pullback names.

### Step 5 — Risks (3 minutes)

Final prompt:

```text
For [TICKER], list:
- Top 3 risks from the latest 10-K's risk factors section
- Top 3 risks from recent earnings calls (last 4 quarters)
- One downside scenario — what does this stock look like if the bull case is wrong?
```

PickSkill summarizes the 10-K risk factors and recent management commentary. The downside-scenario question is the one most retail readers skip — and the one that catches the most expensive mistakes.

**Red flags at this stage**: management's stated risks include single-customer concentration, regulatory overhang, balance sheet stress, or any "going concern" language. These are not automatic disqualifiers but they should reframe the position-sizing conversation.

## How to compile the output

After step 5, ask:

```text
Compile this conversation into a one-page summary I can save:
- Business model in 2 sentences
- Financials trajectory in 4 bullets
- Valuation summary with 3-line bull/base/bear
- Technical setup status
- Top 3 risks
- Decision: watchlist, deeper research, or pass
```

PickSkill returns a structured one-pager. Save it via the chat session bookmark. If you decide to put the name on the [watchlist](/blog/how-to-build-a-watchlist-that-actually-works), the one-pager becomes your thesis document.

> **Try it now.** Open [/chat](/chat) and run the 5 prompts above on a name you are considering. The whole loop is ~15 minutes including reading time.

## What the workflow catches that ad-hoc research misses

### 1. Structural rejection vs price-driven rejection

Ad-hoc research often rejects names based on chart appearance ("looks overbought") without checking whether the business is even worth owning at any price. The structured workflow flips the order: business → financials → valuation → technical. If the business or financials fail, the chart doesn't matter; if business and financials pass, the chart tells you about timing, not viability.

### 2. The downside scenario question

The single most-skipped step in retail research is "what does the bear case look like?" The structured workflow forces it. Without it, you over-weight the bull case and under-prepare for the variance.

### 3. Multi-source synthesis in one place

The workflow pulls 10-K data, recent earnings, current multiples, peer comparison, and technical state into one chat session. Each piece would take 10–20 minutes to gather manually — PickSkill compresses each to seconds, leaving time for the actual thinking.

## Four pitfalls in stock research

1. **Skipping the business-model step.** Knowing a stock's ticker is not knowing the company. Without the 5-bullet summary, you are trading a ticker, not researching a business.
2. **Ignoring the downside scenario.** Bull cases sell themselves; bear cases need to be deliberately surfaced. If you cannot articulate the bear case, you have not done the research.
3. **Treating "everything green" as a buy.** A stock with strong fundamentals, attractive valuation, and good technicals is not automatically a buy — sometimes it is a name where the easy money has been made and the next 12 months are flat. Position sizing and entry-level discipline matter.
4. **Not committing the output to a watchlist or rejection.** The whole point of the 15-minute first-pass is decision-making at the end. "Need to think about it" is the killer — it consumes mental bandwidth without producing a decision. Force yourself to land on watchlist, deeper research, or pass.

## How this applies on A-shares

The workflow works identically on A-share and HK names. Two specific adjustments:

- For A-shares, the "扣非净利润" (net income excluding non-recurring) is the relevant earnings number; PickSkill defaults to this when computing A-share P/E and EPS growth.
- A-share valuation multiples are structurally lower than US peers for most sectors. Compare to the A-share historical range, not the US equivalent.

See [Best Indicators for A-shares](/blog/best-indicators-for-a-shares) for the broader market-specific playbook.

## Common follow-up prompts

After the 15-minute first-pass:

- *"Deeper DCF on [ticker] — full sensitivity table, segment-level revenue projection."*
- *"Compare [ticker] to its 3 closest peers on the full multiple stack and FCF growth."*
- *"Generate an investor deck for [ticker] from this conversation."* (See [Generate an Investor Deck from a Chat](/blog/generate-investor-deck-from-chat).)
- *"Add [ticker] to my watchlist with this thesis: [...]"*
- *"Schedule a re-review of [ticker] for the next earnings release."*

## Further reading

- [Build a DCF in 60 Seconds](/blog/build-dcf-in-60-seconds) — the valuation deep-dive when the 15-minute first-pass passes.
- [How to Read a 10-K in 30 Minutes](/blog/how-to-read-10k) — the manual deep-read version of step 1 + step 2.
- [How to Build a Watchlist That Actually Works](/blog/how-to-build-a-watchlist-that-actually-works) — where successful first-pass names go next.

## FAQ

**Why 15 minutes — isn't that too fast for a stock?**
For a first-pass yes/no decision, 15 minutes is more than enough — most names should be rejected at this stage. The deep work (modelling specific assumptions, reading every recent SEC filing, talking to ex-employees) is reserved for the small subset of names that survive the first-pass. Spending 4 hours on every name you encounter is the dominant failure mode of motivated retail investors.

**Can I research multiple names in parallel?**
Yes — PickSkill supports parallel chat sessions. Many users open 3–5 sessions simultaneously and run the same 5-prompt template on each. The structure makes batch research practical.

**What if PickSkill doesn't have data on the name?**
PickSkill covers most US-listed (NYSE / NASDAQ), HK-listed (HKEx), and A-share-listed (SSE / SZSE) names. For very small or recently-listed names, coverage may be thinner — PickSkill will tell you which data points are unavailable rather than fabricating.

**Should I save the chat sessions?**
Yes — every chat session in PickSkill is persistent. Bookmark useful research sessions for later reference. When you decide to take a position, the chat session is the audit trail of how you arrived at the thesis.

**How does this differ from generic ChatGPT research?**
PickSkill's chat is grounded in live filings, market data, and computed indicators — not in the model's training data. ChatGPT will hallucinate revenue figures and P/E ratios; PickSkill pulls them from primary sources at query time. The structural difference matters most for the financial and valuation steps, where stale or fabricated numbers can completely change the conclusion.
