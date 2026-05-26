---
title: What Is ROE (Return on Equity)? The Quality Indicator Buffett Lives By
description: >-
  ROE = net income / shareholders' equity. Formula, the DuPont decomposition,
  why leverage inflates ROE, and how to spot quality businesses with high
  durable ROE.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: The PickSkill research team — building an AI analyst for retail investors.
pillar: explainer
tags:
  - roe
  - fundamentals
  - quality
  - valuation
heroImage: /blog/what-is-roe/hero.png
heroAlt: >-
  Editorial infographic — three stacked bars showing how a software, bank, and
  retailer all hit the same 15% ROE via very different DuPont decompositions.
---

**Return on equity (ROE) is net income divided by shareholders' equity, expressed as a percentage.** It measures how efficiently a company turns the capital shareholders have put in (and left in) into profit. Warren Buffett's most-quoted screen is "businesses with high and durable ROE." Done right, ROE captures business quality more concisely than any other single ratio. Done casually, ROE can be inflated by leverage and made meaningless by accounting quirks. The decomposition matters as much as the headline.

### Key takeaways

- **Formula**: `ROE = Net Income / Average Shareholders' Equity`. Use *average* equity (start + end / 2) for cleanness across quarters.
- **The DuPont decomposition**: `ROE = Net Margin × Asset Turnover × Equity Multiplier`. Three drivers; each tells a different story.
- **15% sustained is the threshold.** Businesses earning 15%+ ROE every year over a full cycle are the rare quality category. Most large-caps cluster between 10% and 15%.
- **Leverage inflates ROE.** A business with 50% net margin and zero debt has lower ROE than a business with 5% net margin and 10× leverage. The high-ROE company may be the riskier one.
- **Pairs with [ROIC](/blog/what-is-roic) and [FCF](/blog/what-is-fcf)** for quality assessment. ROE alone can mislead; the trio is robust.

## How is ROE calculated?

Two presentation choices to know:

```
ROE (TTM) = Net Income (last 4 quarters) / Avg Shareholders' Equity (last 4 quarters)
ROE (Q)   = Net Income (quarter) × 4 / Shareholders' Equity (end of quarter)
```

Use trailing-twelve-month (TTM) for stable comparison — single-quarter ROE is too volatile and seasonal effects distort it. Use *average* equity over the period (not end-of-period) because companies aggressively buying back stock or paying dividends shrink the denominator mid-period; using only the end-of-period equity overstates ROE.

## The DuPont decomposition — and why it matters

ROE has three independent drivers. The DuPont framework breaks them out:

```
ROE = (Net Income / Revenue) × (Revenue / Assets) × (Assets / Equity)
    = Net Margin × Asset Turnover × Equity Multiplier
```

| Driver | What it measures | High value means |
|---|---|---|
| **Net Margin** | Profitability per dollar of revenue | Premium pricing, scale, low cost structure |
| **Asset Turnover** | Revenue per dollar of assets | Capital-light business model |
| **Equity Multiplier** | Leverage (assets / equity) | More debt relative to equity |

Two businesses can have identical ROE for very different reasons:

- **Software company**: 30% net margin × 1.0 asset turnover × 2.0 equity multiplier = 60% ROE. High-quality.
- **Bank**: 25% net margin × 0.05 asset turnover × 12 equity multiplier = 15% ROE. Driven by leverage.
- **Retailer**: 4% net margin × 3.0 asset turnover × 2.5 equity multiplier = 30% ROE. Driven by inventory velocity.

The headline number says "good ROE" for all three; the decomposition says they are completely different businesses with completely different risk profiles. Read both.

## Why leverage inflates ROE — and why that's dangerous

The equity multiplier (assets / equity) is mechanically a leverage ratio. Higher debt = higher multiplier = higher ROE for the same operating performance.

A simple example:

| Scenario | Assets | Debt | Equity | Net Income | Equity Mult. | ROE |
|---|---|---|---|---|---|---|
| Unlevered | $1,000 | $0 | $1,000 | $100 | 1.0× | **10%** |
| 2× levered | $1,000 | $500 | $500 | $80 (after interest) | 2.0× | **16%** |
| 5× levered | $1,000 | $800 | $200 | $50 (after interest) | 5.0× | **25%** |

The 5×-levered company has 2.5× the ROE — and 8× the bankruptcy risk if the business stumbles. Quality investors strip out leverage by also looking at [ROIC](/blog/what-is-roic) (return on invested capital), which is largely insensitive to capital structure.

The fastest mental check: if a high-ROE business has high debt-to-equity (>1×) and the ROIC is materially lower than ROE, leverage is doing the work.

## What is "high and durable" ROE — and why is it rare?

Buffett's framework: find businesses that earn high ROE consistently over decades. In practice, that means:

| ROE level | What it implies | How rare |
|---|---|---|
| **<5%** | Capital-intensive, low-margin, often dying business | Very common |
| **5–10%** | Average — cost of equity often higher than ROE | Common |
| **10–15%** | Decent — earning back cost of capital | Common (most large-caps) |
| **15–25%** | Strong — durable competitive position | Uncommon (top quartile) |
| **>25%** | Exceptional — usually monopoly economics or extreme operating leverage | Very rare |

The "durable" part matters as much as the level. A consumer-goods company earning 25% ROE every year for 30 years is much more valuable than a chip company earning 35% in a cycle peak and 8% at the trough. The math: cumulative ROE × time = compound wealth creation.

## Four pitfalls in reading ROE

1. **Not decomposing the source.** Two businesses with 20% ROE can have completely different risk profiles. Always check the DuPont split — if leverage is doing the work, the ROE is fragile.
2. **Comparing across industries without context.** Banks and insurance companies structurally run higher equity multipliers than software companies. Comparing a bank's 15% ROE to a SaaS company's 15% ROE is meaningless without context. Compare ROE within the same industry.
3. **Ignoring the trend.** A static ROE snapshot misses the trajectory. ROE declining from 25% to 18% over 4 years is a worse signal than ROE stable at 18% — the trajectory implies the competitive moat is eroding.
4. **Reading ROE on negative-equity businesses.** Heavy buyback programs can drive shareholders' equity negative on the balance sheet (Apple briefly, McDonald's, Philip Morris). When equity is small or negative, ROE explodes mathematically — the ratio becomes meaningless. Switch to ROIC or earnings yield.

## How ROE relates to other quality metrics

| Metric | Formula | Best at measuring |
|---|---|---|
| **ROE** | Net Income / Equity | Returns to equity holders, capital-structure-sensitive |
| **[ROIC](/blog/what-is-roic)** | NOPAT / Invested Capital | Operating quality, capital-structure-insensitive |
| **ROA** | Net Income / Total Assets | Asset efficiency, ignores capital structure |
| **Gross Margin** | Gross Profit / Revenue | Pricing power, ignores OpEx and capital base |

ROIC is the cleaner quality metric — it strips out capital-structure effects so two companies with very different debt loads are directly comparable. ROE is more popular because it is more readily quoted and shows up in screening tools, but for serious quality screens, ROIC is the better lens.

> **Run ROE analysis on your portfolio.** In [/chat](/chat), ask "for each holding, show me 5-year ROE, ROIC, and the DuPont decomposition. Flag any where ROE is high but ROIC is below 10% — those are leverage-driven." PickSkill pulls the data and renders the comparison.

## How ROE behaves across markets

| Market | Typical large-cap median ROE | Quality threshold |
|---|---|---|
| **US large-cap** | 13–17% | 20%+ is durable-quality territory |
| **HK / China large-cap** | 8–12% | 15%+ is strong |
| **A-shares (扣非 basis)** | 8–11% | 15%+ is strong; SOE ROE structurally lower |

A-share ROE is most useful when read on the "扣非 ROE" basis — net income excluding non-recurring items, which the exchange defines. Headline ROE can be inflated by one-time gains (asset disposals, government subsidies) that distort the quality read.

For market-specific context see [Best Indicators for A-shares](/blog/best-indicators-for-a-shares).

## Common follow-up prompts

- *"For [ticker], show me 10-year ROE history and decompose each year into DuPont components."*
- *"Find S&P 500 names with ROE above 20% AND debt-to-equity below 1× — the unlevered quality screen."*
- *"Compare [ticker] ROE to its 5 closest peers. Is the gap widening or shrinking?"*
- *"Build a watchlist of every A-share with 5-year 扣非 ROE above 15%."*

## Further reading

- [Investopedia on ROE](https://www.investopedia.com/terms/r/returnonequity.asp) — comprehensive reference covering the standard formula and decomposition.
- [Aswath Damodaran on the DuPont decomposition](https://pages.stern.nyu.edu/~adamodar/) — academic treatment of how to use ROE in valuation.
- [Berkshire Hathaway annual letters](https://www.berkshirehathaway.com/letters/letters.html) — Buffett's repeated articulation of why durable ROE matters.

## FAQ

**Is a high ROE always good?**
Not always — leverage inflates ROE without making the business better. A company with 40% ROE driven by 5× leverage is much riskier than a company with 20% ROE driven entirely by operating performance. Pair ROE with [ROIC](/blog/what-is-roic) (which strips out leverage) and check the DuPont decomposition to know which driver is doing the work.

**What's a good ROE for the S&P 500?**
The long-run median for S&P 500 companies is roughly 13–15%, with significant cross-industry variation (banks structurally higher, capital-intensive utilities structurally lower). 20%+ sustained for a full cycle is the durable-quality threshold; very few companies achieve and maintain that level. Apple, Microsoft, and Visa are the rare examples.

**Why does Apple sometimes report ROE above 100% or even negative?**
Heavy buyback programs can shrink shareholders' equity dramatically — Apple's equity has been a small positive number relative to its earnings for years. When equity approaches zero, ROE mathematically explodes. The same buyback program can briefly push equity negative (cumulative buybacks exceed retained earnings), causing ROE to flip negative even with strong net income. For buyback-heavy businesses, switch to ROIC or earnings yield as the quality metric.

**ROE vs ROIC — which should I use?**
ROIC for serious quality analysis; ROE for screens and quick comparisons. ROIC is capital-structure-insensitive (it includes both debt and equity in the denominator), so it isolates operating quality. ROE captures the *combination* of operating quality and capital structure — useful for understanding the returns equity holders actually see, but harder to compare across companies with very different debt loads.

**How do I decompose ROE in the chat?**
Ask PickSkill: "for [ticker], decompose ROE into DuPont components for the last 5 years — net margin, asset turnover, equity multiplier — and tell me which driver is moving most." The agent pulls income statement and balance sheet data, computes the components, and surfaces the trend. The decomposition is the cleanest way to spot whether returns are coming from operations getting better or just from more leverage.
