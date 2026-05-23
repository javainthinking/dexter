---
title: What Is WACC? The Discount Rate That Quietly Decides Every Valuation
description: WACC is the discount rate that decides every DCF. Formula, the four inputs that matter, why 100bp changes valuation 8-15%, and triangulation workflow.
publishedAt: 2026-05-22
updatedAt: 2026-05-22
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: The PickSkill research team — building an AI analyst for retail investors.
pillar: explainer
tags:
  - valuation
  - wacc
  - capital-cost
  - fundamentals
heroImage: /blog/what-is-wacc/hero.png
heroAlt: Editorial illustration of a stylised weighted-average dial in warm dark tones with emerald accents
---

**WACC (Weighted Average Cost of Capital)** is the blended return a company must earn on its assets to satisfy both its equity holders and its lenders. In a DCF model, it's the rate you use to discount future cash flows back to today — the single number that quietly determines whether a stock looks 30% undervalued or 30% overvalued. Get WACC wrong and every other number in your model rounds to noise.

This guide covers the formula, the four inputs that actually move the answer, the mistakes that survive into published reports, and how to triangulate a WACC that holds up under cross-examination.

### Key takeaways

- **WACC = (E/V) × Re + (D/V) × Rd × (1 − t).** Equity weight times cost of equity, plus debt weight times after-tax cost of debt.
- **A 100 bp change in WACC moves a 5-year DCF's enterprise value by 8–15%.** WACC sensitivity is the table reviewers look at first.
- **Four inputs do 90% of the work**: risk-free rate, equity risk premium, beta, after-tax cost of debt. Spend your time here.
- **Use market values, not book values, for the E/V and D/V weights** — book equity is an accounting artefact, not what the market actually prices.
- **PickSkill computes a sourced WACC in under a minute** from current Treasury yields, Damodaran's industry data, and the company's own filings — every input editable inline.

## What is the WACC formula?

The textbook version, with one tax adjustment that matters in practice:

```
WACC = (E/V) × Re + (D/V) × Rd × (1 − t)
```

Where:

| Symbol | Meaning |
|---|---|
| `E` | Market value of equity (share price × shares outstanding) |
| `D` | Market value of debt (bond prices if traded, otherwise book value as proxy) |
| `V` | Total capital, `E + D` |
| `Re` | Cost of equity — what equity holders require |
| `Rd` | Pre-tax cost of debt — what lenders charge |
| `t` | Marginal tax rate (used because interest is tax-deductible) |

The `(1 − t)` is the load-bearing detail — debt is cheaper than equity not just because lenders demand less, but because the interest expense lowers the tax bill. A company in a 25% tax bracket with 5% pre-tax debt is actually paying 3.75% after tax.

## Why does WACC matter?

Three reasons WACC is treated as the most consequential number in a DCF model:

1. **It compounds across the projection period.** A 100 bp shift in WACC discounts year-five cash flow at `1.10⁵ vs 1.11⁵` — that's roughly a 4.5% gap, and it widens with every year you forecast. Over a typical 5-year DCF this lands at an 8–15% swing in enterprise value (PickSkill internal analysis of ~200 large-cap models in 2025).
2. **It governs the terminal value spread.** Gordon Growth terminal value uses `FCFn+1 / (WACC − g)`. A 50 bp move in WACC against a 3% growth rate changes the denominator from 7% to 7.5% — a 7% swing in terminal value, which is 60–80% of EV in most 5-year DCFs.
3. **It's the lever reviewers tug on first.** When an analyst's price target disagrees with consensus, the first question is almost always "what WACC are you using?" If you can't defend the WACC, you can't defend the model.

## The four inputs that actually matter

Cost of equity is the largest piece for most non-financial companies (typically 70–90% of the weight). Inside cost of equity, three sub-inputs do almost all the work via CAPM:

```
Re = Rf + β × ERP
```

### 1. The risk-free rate (Rf)

The yield on a long-duration sovereign bond — for US-listed equities, the 10-year or 30-year Treasury. Use the **current** yield, not a historical average. Today's yield is what an investor actually trades off against equity returns.

The 30-year is more theoretically correct for matching a perpetuity terminal value, but the 10-year is the practical convention — it's more liquid and tracks Fed policy more cleanly. Most sell-side desks use the 10-year; matching that convention makes your model comparable to theirs.

### 2. Equity risk premium (ERP)

The extra return investors demand to hold equities instead of risk-free bonds. There is no single "correct" ERP, only ranges that survive academic scrutiny. The two methods used in practice:

- **Historical**: long-run realised premium of equities over Treasuries. US data points to ~5.0–5.5% (Damodaran's data on the NYU Stern site is the most commonly cited source, refreshed quarterly).
- **Implied**: solve for the ERP that the current S&P 500 price implies given consensus earnings forecasts. Today this lands closer to 4.0–4.5% — lower because valuations are elevated.

Pick one method and disclose it. Switching between historical and implied in different sections of the same model is the kind of inconsistency reviewers catch.

[damodaran]: https://pages.stern.nyu.edu/~adamodar/

### 3. Beta (β)

The sensitivity of the stock's returns to the market's returns. Calculated from rolling regression — typically 5 years of monthly data, or 2 years of weekly data.

Two failure modes are common:

- **Stale beta on a transformed company.** A 5-year beta for a SaaS company that's just acquired a hardware business is misleading — half the period reflects a different business.
- **Pure-play comparable, then ignoring it.** When public comparables are noisy, the standard fix is to use a peer-group average beta, unlever it to remove capital structure differences, and re-lever to the target company's structure. Skipping the unlevering step is the most common mistake in undergraduate models.

### 4. After-tax cost of debt (Rd × (1 − t))

For investment-grade companies with traded bonds, read the yield-to-maturity off the bond. For companies whose debt doesn't trade, infer the cost by adding a credit spread (matched to credit rating) to the matching-maturity Treasury yield. Damodaran publishes synthetic credit spreads by interest-coverage bucket — useful when you don't have a rating to work from.

Apply the **marginal** tax rate, not the effective rate. The interest deduction shields income at the marginal rate, which can differ meaningfully from the effective rate when a company has NOLs, foreign-source income, or one-off items.

## How to triangulate a WACC in 15 minutes

A practical sequence we use in PickSkill's WACC tool:

1. **Pull the 10-year Treasury yield** from any liquid source. Don't average; use today.
2. **Pick ERP from a single source** — Damodaran is the standard reference. Note historical vs implied; we default to historical.
3. **Get a regression beta** from a price service, plus the [Damodaran industry beta dataset][damodaran] as a sanity check. If the company-level beta is more than 0.3 from the industry average, ask why.
4. **Estimate cost of debt** via traded bond yield, or via the synthetic spread method (Damodaran's "interest coverage" lookup).
5. **Compute weights from market values.** Equity weight is straightforward. Debt weight uses market value of debt — for non-traded debt, book value is a reasonable proxy if interest rates haven't moved 200 bp since issuance.
6. **Apply the marginal tax rate.** For US filers, that's the federal 21% plus blended state — usually 24–26% all-in.
7. **Cross-check against industry WACC.** Damodaran publishes industry-level WACCs quarterly. If your number is more than 100 bp off the industry, write down why — and own that gap when you present it.

## Common pitfalls that survive into published models

The 134-word checklist worth memorising:

1. **Book-value weights instead of market-value weights.** Book equity is what accountants record; market equity is what investors actually own. A profitable company can have book equity that's a quarter of market equity — using book values triple-counts the cost of equity by overweighting debt.
2. **Pre-tax cost of debt.** Forgetting the `(1 − t)` term inflates WACC by 100–200 bp on debt-heavy companies.
3. **Stale tax rate.** Companies in transition (US tax reform, multinationals moving HQ) often have rates that don't match the headline statutory rate. Verify against the most recent 10-K tax note.
4. **Ignoring leases.** Under IFRS 16 / ASC 842, operating leases sit on the balance sheet as debt — and most retail / airline / restaurant analysts still forget to include them in `D/V`.
5. **CAPM for a private company without unlevering peer betas.** A levered-from-comparables beta with the wrong capital structure produces nonsense numbers. Always unlever and re-lever.

## How PickSkill builds a WACC for you

Open a chat and type:

> *"Pull a WACC for AMD — show me the inputs and let me adjust the ERP."*

PickSkill grabs the current 10-year Treasury yield, Damodaran's most recent ERP and industry beta, the company's traded bond yields (or synthetic credit spread if it has no rated debt), and the most recent marginal tax rate from the 10-K tax footnote. It computes the weighted average, surfaces every input, and lets you adjust any of them inline — the result updates live, and the source for every number is one click away.

The math is the same DCF you'd build in Excel. The difference is the 8 minutes of data-gathering get compressed to ~30 seconds, and the inputs are sourced — so when a reviewer asks "where did you get the ERP", the answer is a link, not a guess.

This WACC feeds straight into the [DCF tool](/blog/what-is-dcf) if you want the full valuation flow.

## FAQ

**What's a typical WACC for a public company?**
For US large-caps in 2025–2026, WACCs cluster in the 8–11% range. Mature defensive sectors (utilities, consumer staples) sit closer to 6–8%; high-growth tech and biotech run 10–13%; deeply cyclical commodity producers can land anywhere from 9% to 15% depending on leverage.

**Should WACC change over the projection period?**
In a textbook DCF, yes — capital structure typically converges toward a long-run target as a company matures. In practice, most analysts use a single WACC across the projection horizon to keep the model tractable, and only flex it in the terminal-value step. Both approaches are defensible; just be consistent within a single model.

**Why use market value of debt instead of book value?**
When interest rates rise, the market value of fixed-rate debt falls below book. A company that issued 3% notes when rates were 2% has debt that today trades meaningfully below par — and that lower market value is what actually backs the equity claim. For investment-grade public debt, the gap can be 5–15% of par; ignoring it skews D/V.

**Can I use a single WACC for a multi-segment company?**
Only as a first pass. If a company runs businesses with materially different risk profiles (consumer software + payment processing + hardware), a sum-of-the-parts valuation with segment-specific WACCs is more honest. For a first-cut model, blended WACC weighted by segment EBIT is acceptable.

**Where do I find current WACC inputs?**
[Damodaran's NYU Stern data page][damodaran] is the standard reference, updated quarterly with risk-free rates, equity risk premia, industry betas, and synthetic credit spreads. [PickSkill](/chat) defaults to those values and lets you override any of them inline.
