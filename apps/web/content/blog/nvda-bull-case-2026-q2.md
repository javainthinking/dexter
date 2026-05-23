---
title: NVDA Bull Case — Q2 2026 Thesis Framework
description: A worked thesis framework for Nvidia — four pillars, three structural bear risks, and the four assumptions to track quarterly. Refreshed each filing.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: The PickSkill research team — building an AI analyst for retail investors.
pillar: thesis
tags:
  - nvda
  - thesis
  - semiconductors
  - ai-infrastructure
heroImage: /blog/nvda-bull-case-2026-q2/hero.png
heroAlt: Editorial infographic showing the four NVDA bull-case pillars (data centre TAM, software moat, networking attach rate, automotive optionality) with weights and risks
---

This post is a worked **thesis framework** rather than a price call. Nvidia (NVDA) is the most-discussed name in retail finance in 2026; this post walks through how the PickSkill team structures a bull case for it — the four assumptions that move 90% of the answer, the bear-case scenarios that would invalidate each, and the explicit numbers from the most recent 10-K and consensus data. **Refreshed quarterly**; the framework stays the same, the numbers update with each filing cycle. The illustrative figures below are framed clearly; the live numbers in any [/chat](/chat) session pull directly from the most recent filing.

### Key takeaways

- **Four pillars drive the bull case**: data-centre TAM, software-margin moat (CUDA + enterprise), networking attach rate (NVLink, InfiniBand), automotive optionality (Drive platform).
- **The data-centre pillar is ~70% of the thesis weight.** Get the data-centre revenue trajectory right and you get the answer roughly right; get it wrong and nothing else saves the model.
- **The bear case isn't "no growth"** — it's three specific structural risks: hyperscaler insourcing (Google TPU, AWS Trainium, Meta MTIA), gross-margin compression as competition intensifies, and capex digestion if hyperscaler AI spending pauses.
- **The valuation gap depends on assumed terminal margins** more than on near-term revenue. NVDA bears and bulls usually agree on next year's revenue within 10%; they disagree on whether 75% gross margin is sustainable.
- **PickSkill builds and refreshes this thesis** from primary sources — every line item in the DCF pulled from the most recent 10-K, peer multiples from current market data, with the assumptions surfaced for editing.

## The four bull-case pillars

### Pillar 1 — Data-centre TAM (weight: ~70%)

The core of the bull case is that the data-centre TAM for AI training and inference compute compounds at a multi-year pace that justifies current spending levels. Three sub-arguments:

- Hyperscaler capex on AI infrastructure grew rapidly in 2024–2025 and the 2026 guidance from Microsoft, Google, Meta, Amazon has not signalled a pause.
- Inference workloads are scaling faster than training workloads; inference is more compute-intensive on a per-token basis than the 2023 framing suggested.
- Enterprise on-premise AI compute (sovereign data centres, finance, healthcare) is still in the early innings of the build-out.

The bull view is that these three together extend the data-centre revenue ramp through at least 2028. The bear view is that the hyperscaler capex cycle is closer to digestion than to acceleration.

### Pillar 2 — Software margin moat (weight: ~15%)

CUDA's software ecosystem and the enterprise stack (NIM microservices, NeMo) attract recurring revenue at higher margins than the hardware. Bull thesis: software contribution grows from low-single-digits today to mid-teens % of revenue over a 3–5 year horizon, dragging blended gross margins toward 80%+ instead of compressing as hardware competition rises.

The counter: software revenue stays small relative to the hardware base for the same period, and gross margin compression is the dominant force.

### Pillar 3 — Networking attach rate (weight: ~10%)

NVLink, InfiniBand, and Spectrum-X ethernet products turn the GPU sale into a system sale at meaningfully higher dollar content per deployment. The bull thesis is that networking attaches to >90% of large training clusters and becomes a >15% contribution to data-centre revenue.

Counter: hyperscalers build their own networking stacks (Google Jupiter, Meta's clusters) and the attach rate stalls.

### Pillar 4 — Automotive + robotics optionality (weight: ~5%)

The Drive platform, plus the Isaac robotics stack, are smaller today but offer optionality on multi-year shifts (self-driving fleets, humanoid robotics). The bull view treats these as a free option attached to the data-centre business; the bear view ignores them entirely.

## The bear case — three structural risks

A complete thesis acknowledges what could break it. For NVDA in 2026:

1. **Hyperscaler insourcing.** Google's TPU programme has been multi-year. AWS Trainium and Inferentia, Meta's MTIA, Microsoft's Maia — every major hyperscaler now has a serious in-house silicon programme. Bear view: 25–40% of hyperscaler AI compute migrates to in-house silicon by 2028, structurally limiting NVDA's data-centre growth.
2. **Gross-margin compression.** NVDA's 70%+ gross margin in the AI-data-centre business is unusual for the semiconductor industry. Bear view: as AMD's MI series, Intel Gaudi, and custom silicon compete on price and supply, NVDA's pricing power compresses, pulling gross margin into the 60s.
3. **Capex digestion.** If 2026 hyperscaler results show flat-to-down AI revenue contribution despite massive 2024–2025 capex, the 2027 capex guides could see meaningful cuts — and NVDA's data-centre revenue would compress alongside.

A bear case doesn't require all three to hit; even one of them at full strength compresses the bull-case valuation 30–50%.

## The four assumptions to track quarterly

For a model that stays useful past the first filing, watch these four quarterly:

| Assumption | Bull-case framing | Bear-case framing |
|---|---|---|
| **Data-centre revenue YoY growth** | sustains 30%+ for several more years | normalises to 10–15% by 2027 |
| **Gross margin trajectory** | holds 70%+ through 2028 | compresses toward 60% as competition scales |
| **Hyperscaler capex guidance** | continues to step up | flattens or guides down |
| **Networking attach rate** | grows to >15% of data-centre revenue | stalls at <10% |

The DCF answer is highly sensitive to the first two. The PickSkill [DCF tool](/blog/build-dcf-in-60-seconds) lets you adjust each and see the implied per-share price update live.

## How PickSkill builds + refreshes this thesis

The thesis above is structurally what PickSkill produces when you ask:

> *"Build a bull-case thesis for NVDA. Use the most recent 10-K and 10-Q for financials, current consensus for forward growth, and Damodaran for the discount rate. List the four assumptions that move the answer, the bear-case counter for each, and the DCF implied per-share price. Refresh assumptions every quarter."*

PickSkill:
1. Pulls the most recent 10-K + 10-Q (data-centre segment revenue, gross margin trajectory, capex)
2. Pulls consensus forward estimates (revenue, gross margin, EPS for the next 4 quarters)
3. Computes the [WACC](/blog/what-is-wacc) (current 10-Y Treasury + Damodaran semiconductor industry ERP and beta)
4. Builds the [DCF](/blog/what-is-dcf) with the four pillars as separate growth drivers
5. Outputs the bull-case implied per-share price, the bear-case scenario, and the spread
6. Generates the underlying Excel with formula links so you can adjust assumptions

The thesis is then *yours to edit*. The default assumptions are sourced and neutral starting points; the editable framework is what makes the thesis useful as your view, not as a press release.

## Common mistakes when reading an NVDA thesis (any direction)

1. **Treating NVDA as a single business.** It's at least four: gaming, professional visualisation, data centre, automotive. Data centre is ~85% of revenue today, but the others have different dynamics. Don't apply one set of growth/margin assumptions to all four.
2. **Anchoring on the past 24 months.** AI compute spending in 2024–2025 was unusually concentrated. Extrapolating that growth rate indefinitely is the most common bull-case mistake.
3. **Ignoring the customer concentration.** Per the most recent 10-K's Risk Factors, a small number of customers account for a large fraction of data-centre revenue. Worth reading the specific language in Item 1A — see [How to Read a 10-K](/blog/how-to-read-10k).
4. **Confusing software revenue with software margin.** Software-as-a-line-item is small today; the *margin uplift* from software-attached deals matters more than the line-item revenue.

## FAQ

**What's the current bull-case implied price?**
Numbers in this post are framing-level; for the live computed implied per-share price (bull / base / bear), use PickSkill's [DCF tool](/blog/build-dcf-in-60-seconds) and run the thesis prompt above. The number updates each filing cycle; we deliberately don't pin one in this post because it would be stale within 90 days.

**Why is this post a framework rather than a recommendation?**
Two reasons. First, a thesis is only useful when paired with your own conviction on the four key assumptions — copying someone else's thesis is the lowest-edge form of research. Second, NVDA's numbers move fast; a static post would be misleading within a quarter. The framework stays useful for longer than any specific number would.

**Does this work for other AI-infrastructure names (AMD, AVGO, TSM)?**
The same four-pillar / three-risk structure applies, with sector-specific tweaks: AMD has lower data-centre concentration but higher gaming/embedded exposure; AVGO has the VMware integration as a fifth pillar; TSM is the foundry layer underneath all of them. Run the same prompt with a different ticker for a comparable structured thesis.

**How often does PickSkill refresh this thesis?**
Quarterly, on a 10-Q / 10-K release cadence. You can also re-run the prompt at any time and PickSkill will pull whatever the most recent filings are. The framework (four pillars, three risks, four assumptions to track) stays stable; the numbers refresh.

**What if I disagree with the bull-case framing?**
That's the right reaction. The framework above is the *structure* of the bull case, not a claim about whether the bull case is right. The PickSkill prompt also runs the bear-case scenario from the same financials — `"now show me the bear-case DCF with the three structural risks at full strength"`. Stress-test both, and the gap between them is where you can locate your own view.
