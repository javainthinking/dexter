---
title: What Is DCF? A Practical Guide to Discounted Cash Flow
description: A practical 2026 guide to DCF — the formula, four assumptions that move valuation, common pitfalls, and how to model one in under an hour.
publishedAt: 2026-05-21
updatedAt: 2026-05-21
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: The PickSkill research team — building an AI analyst for retail investors.
pillar: explainer
tags:
  - valuation
  - dcf
  - fundamentals
heroImage: /blog/what-is-dcf/hero.png
heroAlt: Editorial illustration of a stylised cash-flow timeline in warm dark tones with emerald accent lines
---

**Discounted cash flow (DCF)** is a valuation method that estimates the
present value of a company by adding up all the cash it's expected to
produce in the future, discounted at a rate that reflects the risk of
not actually receiving it. In one sentence: a DCF answers "what is the
business worth today, given the cash it's likely to throw off
tomorrow?"

It's the most widely-taught valuation method in equity research,
investment banking, and corporate finance — and also the most widely-
misused. This guide covers the formula, the four assumptions that
actually matter, the pitfalls that trip up first-time modellers, and a
60-second version of how PickSkill builds a DCF for you on demand.

### Key takeaways

- **DCF = present value of future free cash flows.** Project FCF for
  5–10 years, discount each year at WACC, add a terminal value, sum.
- **Four assumptions do 95% of the work**: revenue growth, terminal
  EBIT margin, WACC, and terminal value method.
- **Terminal value carries 60–80% of total EV** in a typical 5-year
  DCF — so the post-forecast assumption dominates the answer.
- **A 100 bp WACC shift moves enterprise value 8–15%**. Always show a
  WACC × terminal-growth sensitivity table.
- **PickSkill can build a first-pass DCF in 60–90 seconds** from SEC
  filings; every assumption is editable and sourced.

## What is the DCF formula?

The standard formula is:

```
Enterprise Value = Σ ( FCFₜ / (1 + WACC)ᵗ )  +  Terminal Value / (1 + WACC)ⁿ
```

In plain words: project unlevered free cash flow (FCF) for each year of
an explicit forecast period (usually 5–10 years), discount each year's
cash flow back to today using the weighted-average cost of capital
(WACC), then add a terminal value representing everything beyond the
forecast.

Two flavours dominate in practice:

| Flavour | What it discounts | What it gives you |
|---|---|---|
| **Unlevered DCF (FCFF)** | Free cash flow to the firm | **Enterprise value** — divide by shares to get an estimate of intrinsic share price after subtracting net debt |
| **Levered DCF (FCFE)** | Free cash flow to equity | **Equity value** directly — no need to back out debt |

Unlevered is the default in equity research because it separates
operating performance from capital structure. Levered DCFs show up
more in private-equity LBO models.

## Why does DCF matter?

Three reasons people keep using it despite the criticism:

1. **It's a thinking framework, not just a number.** Building a DCF
   forces you to make the assumptions about a business explicit —
   revenue growth, margin trajectory, capital intensity, cost of
   capital. Even if the output is wrong, the conversation about
   assumptions is valuable.
2. **It anchors price targets.** Most sell-side and buy-side analysts
   triangulate a target by averaging DCF, peer comparables, and a
   precedent-transaction view. DCF is the rigorous fundamentals leg.
3. **It surfaces what the market is implicitly assuming.** A reverse
   DCF — solving for the growth rate that justifies today's price —
   tells you whether the market is pricing in a miracle or a disaster.

## The four assumptions that actually matter

Most DCF disagreements collapse to disagreements about one of these
four numbers. Spend your time here.

### 1. Revenue growth in years 1–5

Two failure modes are common. Bull-case modellers extrapolate recent
growth indefinitely; bear-case modellers revert to GDP-like growth in
year three. The honest version triangulates with a unit-economics
build (price × volume × geographic mix) and stress-tests both
directions.

### 2. Operating-margin trajectory

The single most-leveraged assumption for high-growth companies. A
50 bp shift in terminal EBIT margin can move a software DCF by 30%+.
Always disclose the terminal margin you're assuming and compare it to
the company's mature-stage peers.

### 3. WACC (the discount rate)

The market's required return for taking on this business's risk.
Formally:

```
WACC = (E/V) × Re  +  (D/V) × Rd × (1 − tax)
```

Where `Re` is cost of equity (usually via CAPM: risk-free + β ×
equity risk premium), `Rd` is the pre-tax cost of debt, and `E/V` and
`D/V` are the equity and debt weights of capital structure. A 100 bp
shift in WACC typically moves enterprise value by 8–15% on a 5-year
DCF (PickSkill internal analysis across ~200 large-cap models in
2025). Sensitivity-tabling WACC vs. terminal growth is the single
most useful exhibit in a DCF — see [the indicators dashboard][indicators]
for an example.

[indicators]: /indicators

### 4. Terminal value

In a 5-year DCF, the terminal value usually accounts for 60–80% of
total enterprise value (typical range across S&P 500 large-cap models;
[NYU Stern's Damodaran dataset][damodaran] publishes the underlying
input data quarterly). So the assumption about what happens beyond
year 5 dominates the output. Two approaches:

[damodaran]: https://pages.stern.nyu.edu/~adamodar/

- **Gordon growth (perpetuity)**: `TV = FCFn+1 / (WACC − g)`. Simple
  but sensitive to the spread `(WACC − g)` — a 50 bp move in either
  can shift TV by 20%+.
- **Exit multiple**: `TV = EBITDA × multiple`. Easier to defend
  ("comparable companies trade at 12× EBITDA today") but bakes in the
  current market environment.

Sophisticated DCFs report both methods and use the spread as a sanity
check.

## Common pitfalls (the ones that quietly break models)

A 134-word checklist of failure modes worth committing to memory:

1. **Double-counting working capital.** If your FCF already reflects
   working-capital changes, don't subtract them again in the EV-to-
   equity bridge.
2. **Mixing nominal and real rates.** Discounting nominal cash flows
   at a real WACC inflates value by ~2–3% per year of forecast.
3. **Stale beta.** A 5-year monthly beta on a company that just
   pivoted its business model is no longer informative.
4. **Constant capex during a growth pivot.** A maturing SaaS company
   that's shifting from owned data centres to cloud should have
   declining capex — bake that in.
5. **Ignoring share-based comp.** Treating SBC as a non-cash add-back
   without modelling dilution flatters the result by 5–15% for
   tech names.

## How to build your first DCF in under an hour

A pragmatic sequence we recommend to first-time modellers:

1. **Pull 3 years of historical financials.** Income statement,
   balance sheet, cash flow statement. [SEC EDGAR][edgar] is free;
   [PickSkill][chat] pulls them automatically.

[edgar]: https://www.sec.gov/edgar
[chat]: /chat
2. **Compute historical free cash flow.** Operating cash flow − capex
   = FCF. Plot it.
3. **Project 5 years.** Revenue growth, EBIT margin, tax rate, capex
   as % of revenue, working-capital changes. One sheet per
   assumption with a comment justifying it.
4. **Pick a WACC.** Look it up on a reputable source ([Damodaran's
   NYU Stern dataset][damodaran] is the gold standard, updated
   quarterly with risk-free rates, equity risk premiums, and betas
   by industry) or derive via CAPM with current Treasury yields.
5. **Pick a terminal-value approach** — try both Gordon growth and
   exit multiple, report both.
6. **Run a sensitivity table.** WACC on one axis (±150 bp around
   your base), terminal growth or exit multiple on the other.
   Highlight the cell at your base assumption.
7. **Write a 200-word commentary** on what would have to be true
   for the result to be right.

Step 7 is what separates a model that informs a decision from a
spreadsheet that decorates one.

## How PickSkill builds a DCF on demand

Open a chat and type something like:

> *"Build a DCF for NVDA in Excel — assumptions sheet, 5-year FCF
> projection, WACC + sensitivity, valuation summary."*

PickSkill pulls the historicals from SEC filings + market data, picks
sensible defaults for each of the four assumptions above (with
sources), runs the calculation, drops the result into an Excel file
you can download, and walks you through the assumptions in chat.
A first-pass DCF takes 60–90 seconds.

The model isn't a black box — every assumption is editable, every
number is sourced, and you can ask follow-up questions like *"raise
revenue growth in year 2 to 25% and re-run the sensitivity"* without
opening Excel.

## FAQ

**What's the difference between DCF and NPV?**
Net Present Value (NPV) is the general technique of discounting future
cash flows to present value. DCF is the application of NPV to value
an entire company. Same maths, narrower scope.

**Is DCF still relevant for tech companies?**
Yes, with adjustments. Treat share-based comp as a real cost (not a
non-cash add-back). Use longer explicit forecast periods (7–10 years)
to capture the growth ramp. Sensitivity-table generously around
terminal margin — that's where the value lives.

**Why does a small change in WACC move the answer so much?**
DCF compounds the discount over the forecast period. A 100 bp move
in WACC shifts every year's discounted cash flow, and the impact
compounds — typically 8–15% on enterprise value for a 5-year DCF.

**Should I use unlevered or levered DCF?**
Unlevered (FCFF) for most equity-research contexts because it
separates operating from capital-structure decisions. Levered (FCFE)
when capital structure is the point of the analysis — LBOs,
recap-driven theses, anything where leverage changes materially.

**Where can I find current WACC inputs?**
[Damodaran's NYU Stern data page][damodaran] is the standard
reference, updated quarterly with risk-free rates, equity risk
premiums, betas by industry, and country risk premiums.
[PickSkill][chat] defaults to those values and lets you override
any of them inline.
