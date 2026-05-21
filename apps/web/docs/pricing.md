# PickSkill / Dexter — Pricing Plan

**Status:** draft, planning mode
**Last updated:** 2026-05-21
**Owner:** Julian
**Decision so far:** four-tier structure agreed (Free / Starter / Pro / Power);
final price points pending real GPT-5.5 unit-cost data and a model-quality
eval. Implementation work has not started.

This document is the source of truth for pricing discussion. Numbers in
it are estimates unless explicitly marked as confirmed.

---

## 1. Why we're doing this now

Three converging pressures push us to ship paid tiers in the near term:

1. **Cost per active user is non-trivial.** A regular research session
   that builds a deck consumes 20–30 LLM iterations, multiple
   external-API calls, and significant compute. At list prices a single
   power user can cost $50–200/month to serve. A free-only product is
   not sustainable beyond the validation phase.
2. **The 300s Vercel function ceiling pushed us to add chunked
   execution** (see `src/agent/agent.ts` `CHUNK_BUDGET_MS` and the
   `dexter_agent_jobs` table). That work is in place; it raises the
   ceiling on what a single run can produce, which raises the
   per-run cost. We need pricing levers before scaling traffic.
3. **The default model is OpenAI `gpt-5.5`** today
   (`src/agent/agent.ts:23 DEFAULT_MODEL = 'gpt-5.5'`), not Claude.
   The Anthropic prompt-caching path (90% input discount) is built but
   dormant. This affects per-action cost estimates and the model
   selection strategy per tier.

---

## 2. Cost model

### 2.1 Per-action variable costs (estimated)

Estimates assume **flagship-class** LLM at roughly Claude Sonnet 4.5 list
price ($3 / M input, $15 / M output, $0.30 / M cached input). Numbers
will shift when we substitute real GPT-5.5 rates.

| Action | Iterations | Tokens (typical) | External APIs | Per-action cost |
|---|---|---|---|---|
| Simple chat turn (definition / fact / single tool call) | 1–3 | 5–10K in, 0.5–1.5K out, cached | — | **$0.02 – 0.05** |
| Research chat (web + finance, multi-tool) | 8–15 | 50–100K cumulative in, 5–10K out | Exa $0.005, FinDatasets ~$0.01 | **$0.10 – 0.30** |
| File generation (PPT/Word/Excel, 20-30 iterations across chunks) | 20–30 | 150–300K cumulative, 10–25K out | + R2 PUT (negligible) | **$0.40 – 1.20** |
| Memory search | n/a | embedding only | — | **<$0.001** |
| Portfolio quote (Yahoo path) | n/a | — | Yahoo Finance free | **<$0.001** |
| Portfolio quote (FinDatasets path) | n/a | — | FinDatasets ~$0.001/call | **~$0.001** |

### 2.2 Fixed monthly costs (regardless of users)

| Service | Tier needed | $/mo |
|---|---|---|
| Vercel | Pro + active-CPU usage | 50–150 |
| Postgres (Neon / Supabase) | Pro | 25–50 |
| Financial Datasets | Starter contract | 50–200 (depends on plan) |
| Cloudflare R2 | pay-as-you-go | 5–15 |
| LangSmith (optional tracing) | Plus, skip while small | 0–39 |
| Email auth (Resend / Postmark) | free → cheap | 0–20 |
| Domain + misc | — | 5 |
| **Fixed floor** | | **~$135 – $479 / month** |

R2's free egress is a structural advantage — every office-file download
is free to deliver.

### 2.3 Per-user variable cost bands (estimated)

| Profile | Chats/mo | File gens/mo | Variable COGS / user |
|---|---|---|---|
| **Light** (occasional retail investor) | 20–40 | 1–2 | $2 – 5 |
| **Regular** (daily-ish, light research) | 100–250 | 5–15 | $15 – 35 |
| **Power** (analyst building decks) | 400–800 | 20–50 | $70 – 160 |
| **Whale** (research desk, daily decks) | 1500+ | 80+ | $200 – 400 |

The Power and Whale bands are what blow up flat-rate pricing if not
capped. The shape of the cost curve is *non-linear in file generations*:
each one costs ~10× a simple chat. File gen quota is the most important
single lever.

---

## 3. Recommended tier ladder

### 3.1 Full feature matrix

| | **Free** | **Starter $15/mo ($12/mo annual)** | **Pro $39/mo ($32/mo annual)** | **Power $129+/mo + overage** |
|---|---|---|---|---|
| **Agent — chat** | | | | |
| Default model | mini | mini | flagship | flagship |
| Chats / month | 30 | 200 | 1000 (soft cap, then warn) | unlimited (overage above 2000: $0.05/each) |
| File generations / month | 2 | 8 | 30 | 100 (overage: $1.00/each) |
| Memory entries | unlimited | unlimited | unlimited | unlimited |
| **Agent — research** | | | | |
| Deep research turns / month (web + filings) | 5 | 50 | 300 | unlimited |
| Multi-skill workflows (DCF, x-research, etc.) | — | basic | all | all + custom skills |
| **Portfolios** | | | | |
| Portfolios | 1 | 3 | 10 | unlimited |
| Holdings per portfolio | 10 | 25 | 50 | 100 |
| Quote refresh | manual only | manual + on-demand button | auto every 15 min during market hours | auto every 5 min + on-demand real-time |
| Watchlists (no holdings) | — | 1 (≤20 symbols) | 5 (≤50 symbols each) | unlimited |
| **Indicators dashboard** | | | | |
| Dimensions available | all (currently 8, future additions included) | all (currently 8, future additions included) | all (currently 8, future additions included) | all (currently 8, future additions included) |
| Export dashboard to deck | — | — | ✓ (consumes file-gen quota) | ✓ unlimited |
| **Automation** | | | | |
| Scheduled jobs (`cron` tool) | — | — | 3 active | 20 active |
| WhatsApp bot integration | — | — | — | ✓ |
| Email digest | — | weekly | daily | daily + custom schedule |
| **Other** | | | | |
| Priority compute queue | — | — | — | ✓ |
| Support | community | email (48h) | email (24h) | shared Slack channel |
| Annual discount | — | –20% | –20% | –20% |

### 3.2 Pricing positioning

```
$15        $39                $129+
 |          |                   |
 v          v                   v
Starter    Pro                 Power
 |          |                   |
 ChatGPT Plus / Perplexity Pro at $20
```

- **Starter at $15** undercuts the dominant AI subscription
  ($20 ChatGPT Plus / $20 Perplexity Pro) — distinct positioning as
  "the affordable financial AI."
- **Pro at $39** sits in the standard "prosumer analyst" range
  (Notion AI $20, Superhuman $30, Apollo.io $59).
- **Power at $129** is in the territory of Bloomberg Terminal Lite
  alternatives, AlphaSense individual, etc., with usage-based overage
  for users who push past the soft caps.

---

## 4. Cost-driver gates — why each tier is structured this way

### 4.1 Default model: mini vs flagship

The single biggest knob. Flagship models (Claude Sonnet 4.5/4.6, GPT-5.5
flagship) cost 5–10× more per token than mini-class
(gpt-5.5-mini, claude-haiku, gemini-flash).

| Tier | Default model | Rationale |
|---|---|---|
| Free / Starter | mini-class | Low COGS, acceptable quality for everyday chat + research |
| Pro / Power | flagship | Users expect best-in-class output; cost absorbed in higher price |

**Exception: file generation routes to flagship even on lower tiers.**
A poorly-built deck on mini-class is more damaging to product
perception than a costly one on flagship. File gen is a small fraction
of total invocations but the user's most visible deliverable. Mid-run
model upgrade is supported by `AgentConfig.model` plumbing — needs UI +
controller wiring before launch.

### 4.2 File generation quota

The most expensive operation, by a wide margin. A single deck =
$0.40–1.20 in tokens alone.

| Tier | Cap | Margin if cap maxed |
|---|---|---|
| Free | 2 | absorbed (acquisition) |
| Starter | 8 | $4–10 of $15 → 33–73% remaining |
| Pro | 30 | $12–36 of $39 → 8–69% remaining |
| Power | 100 base + $1/each overage | scales linearly above cap |

Without a hard cap, a single user can rack up $100+ in deck builds on
a $39 plan. The cap is what makes the price defensible.

### 4.3 Quote refresh policy

The second-biggest cost driver after LLM tokens for any tier with
auto-refresh.

- Pro: 50 holdings × 15-min refresh × 6.5 market hours = ~1,300 quote
  fetches/user/day
- Power: 100 holdings × 5-min refresh = ~7,800 fetches/user/day

Yahoo Finance is free but rate-limited (~2000/hour per IP). FinDatasets
is paid (~$0.001/call). With holdings capped at 100 max even on the
Power tier, quote-refresh COGS stays modest — Yahoo-primary keeps it
near zero, and the FinDatasets-fallback worst case is ~$8/user/month
on Power, comfortably absorbed by the $129 anchor.

**Strategy:**
- Free + Starter: manual refresh only (user clicks button)
- Pro: auto every 15 min during market hours
- Power: auto every 5 min + on-demand real-time
- Overage on Power based on holdings × refresh-frequency (TBD formula)

### 4.4 Indicators dimensions

All 8 dashboard dimensions (capital flow, divergence, KDJ, MACD,
support/resistance, golden-cross, etc., per the dashboards we've
already generated) are available on every tier, and any new
dimensions we add will be included for everyone — no Power-only
indicators.

Rationale for not gating:
- Each access is a small, bounded cost (a few historical-bar calls
  against Yahoo Finance free + cached results) — gating by tier
  produces minimal COGS relief
- The "you only get N indicators on the cheap plan" message creates
  a worse impression than the relief is worth
- Cost control here lives in the data layer (Yahoo-primary,
  server-side quote cache, batched fetches), not in feature gating

If we ever ship a "build your own indicator" feature, it'd be a
candidate for tier gating then. Today there's no such feature on the
roadmap, so the dimensions row is uniform across all four plans.

### 4.5 Automation gates (cron + WhatsApp)

Reserved for Pro/Power because:
- Cron jobs run unattended agent turns → each fires LLM + tools
  without user-side feedback → can rack up cost silently if not capped
- WhatsApp delivery via Baileys ties to user's own WhatsApp account
  (no provider fees) but represents serious power-user functionality
- Pricing signal: "I want my AI to push results to me" is a power-user
  intent, worth the higher tier

---

## 5. Per-user economics at recommended prices

### 5.1 Starter $15 — target COGS ≤ $7

| Cost line | Estimated $/user/mo |
|---|---|
| 200 chats × $0.002 (mini model) | $0.40 |
| 50 research × $0.025 (mini + 1 search) | $1.25 |
| 8 file gens × $0.40 (routed to flagship) | $3.20 |
| Memory + portfolios + quotes (manual) | $0.75 |
| APIs (FinDatasets allocation, Exa, R2, Postgres) | $0.50 |
| Vercel compute | $0.30 |
| **Total** | **~$6.40** |
| **Gross margin at $15** | **57%** |

### 5.2 Pro $39 — target COGS ≤ $20

| Cost line | Estimated $/user/mo |
|---|---|
| 500 chats × $0.02 (flagship) | $10.00 |
| 100 research × $0.10 | $10.00 |
| 15 file gens × $0.50 | $7.50 |
| Auto quote refresh (Pro cadence, capped portfolios) | $1.50 |
| APIs + compute | $1.00 |
| **Total** | **~$30** |
| **Gross margin at $39** | **23%** |

This is **slim**. Pro economics depend on:
- Most users not maxing the chat cap (real median ≈ 200/mo, not 500)
- File gen averaging 10/mo, not 30
- If those assumptions break, raise Pro to $49 or tighten caps

### 5.3 Power $129+ — overage-protected

Estimated unprotected COGS for a typical Power user: $100–160/mo.
Whale at unrestricted usage: $250–400/mo.

Overage component is what protects margin:
- Chats above 2000/mo: $0.05/each
- File gens above 100/mo: $1.00/each
- (TBD) Quote-refresh load above N: tiered $/k-fetches

With overage, a 4000-chat / 250-file-gen month bills:
- $129 base
- + (4000–2000) × $0.05 = $100
- + (250–100) × $1.00 = $150
- = **$379/mo total**, vs. ~$300–400 cost

Roughly break-even at extreme usage; healthy margin at median.

### 5.4 Free — pure acquisition

Estimated COGS: $1–2/user/mo at the 30-chat / 2-file-gen cap.

This is a marketing budget line, not a profit center. Acceptable if:
- Free → Paid conversion ≥ 3% (1 paid user covers ~10 free users)
- Free tier is restrictive enough to drive upgrade without being
  hostile (current spec passes the smell test, but needs UX testing)

---

## 6. Open decisions before launch

| # | Decision | What it depends on | Owner |
|---|---|---|---|
| D1 | Final per-action cost numbers | GPT-5.5 actual unit pricing from OpenAI dashboard | Julian |
| D2 | Whether to default to Claude instead of GPT-5.5 | Side-by-side quality eval on ~10 financial prompts | Julian + Claude |
| D3 | Mini-class quality threshold for Starter | Same eval, mini vs flagship | Julian + Claude |
| D4 | Starter price: $15, $19, or other | D1–D3 inform; also pricing-page A/B testing | Julian |
| D5 | Pro price: $39 vs $49 | Pro COGS sensitivity; competitive scan | Julian |
| D6 | Whether to ship Power at launch | Have we seen real whale usage yet? | Julian (data-driven) |
| D7 | Annual discount %: 20% or different | Cash flow vs LTV trade | Julian |
| D8 | Quote-refresh overage formula for Power | Need real usage data on Pro auto-refresh first | Julian |
| D9 | Free tier conversion target | Marketing assumption, will be measured post-launch | Julian |
| D10 | Free trial of Pro at signup (7-day vs none) | A/B testable | Julian |

**Recommendation:** decide D1–D5 before any implementation. D6–D10 can
be decided in flight once Pro has 4+ weeks of real usage data.

---

## 7. Pre-launch implementation work

Ordered by dependency. Estimates are rough — each line is 0.25–2
focused days.

| # | Component | Notes |
|---|---|---|
| 1 | `dexter_user_quotas` schema + Drizzle | Add to migrations; reset period_start logic |
| 2 | `getUserPlan(userId)` resolver | Reads tier from `dexter_users.plan` (column to add) |
| 3 | Quota middleware on `/api/agent` + `/api/agent/resume` | Refuse with 402 if over chats or file-gen cap |
| 4 | Tier-aware model selector | Default model based on tier; file gen routes to flagship regardless |
| 5 | Portfolio + holdings count enforcement | `/api/portfolios POST` and holdings POST check tier limits |
| 6 | Quote-refresh policy gates | Manual-only on Free/Starter; Pro auto worker; Power higher cadence |
| 7 | Indicators dimension gating | Frontend reads `tier.allowedDimensions`, hides locked tabs with upgrade CTA |
| 8 | Background quote refresher (Pro+) | Dedicated scheduler, not the cron tool |
| 9 | File-gen counter increment + tier-aware cap | Hooked into `dexter_agent_jobs.finalAnswer` or office-run drain |
| 10 | Stripe integration | Subscription objects, webhooks, plan transitions |
| 11 | `/pricing` marketing page | Public, i18n'd, with the matrix above |
| 12 | Subscription management UI | Upgrade / downgrade / cancel / payment method |
| 13 | Free → Pro upgrade prompts | In-app CTAs at cap boundaries (out of file gens, etc.) |
| 14 | Usage dashboard (in-app) | Show user "X / Y chats used this month" so caps don't feel surprising |

Steps 1–4 are the minimum viable enforcement layer. Steps 11–12 are the
minimum viable purchase path. Everything else can ship in the second wave.

---

## 8. Risks and mitigations

### 8.1 LLM cost sensitivity to cache hit rate

- **Risk:** OpenAI cache discount (~50%) and Anthropic ephemeral cache
  (~90%) both depend on prompt prefix stability. Chunked-agent resumes
  rebuild the messages array, invalidating cache. If cache hit rate
  drops below 50%, COGS rises 2–3× on agent runs.
- **Mitigation:** track `cache_read_tokens / input_tokens` per
  invocation in the agent's `tokenCounter`. Alert if median <50%.
  Optimization candidate: preserve cache breakpoints across chunk
  boundaries by structuring the messages array deterministically.

### 8.2 File-gen abuse on lower tiers

- **Risk:** A user on the $15 Starter generates 30 decks in a
  month (despite the 8-cap). Each is ~$0.40–1.20. Without enforcement
  they cost us $12–36 against a $15 price.
- **Mitigation:** quota middleware is the line between "viable" and
  "subsidizing abuse." Cannot ship paid tiers without it.

### 8.3 Quote-refresh load on auto-refresh tiers

- **Risk:** With holdings capped at 100/portfolio even on Power, a
  single user's max load is ~7,800 fetches/day at 5-min refresh.
  Multiplied across hundreds of users on Power, this approaches
  Yahoo's rate limits (~2000/hour per IP). FinDatasets fallback
  would be ~$8/user/month at this load — affordable but not zero.
- **Mitigation:** strongly prefer Yahoo Finance (free) as primary;
  FinDatasets only on fallback. Add per-user fetch ceiling.
  Consider batched fetches (one call returns N tickers) where
  Yahoo's API supports it. Cache quotes for 30–60s server-side so
  two users watching the same ticker share the fetch.

### 8.4 Mini-class model quality on financial reasoning

- **Risk:** gpt-5.5-mini / claude-haiku produce visibly worse output
  on DCF, comparable analysis, multi-step research. Starter feels
  inferior to ChatGPT Plus, killing the affordable-tier positioning.
- **Mitigation:** D2/D3 eval before locking the Starter default.
  Backstop: route specific tools (DCF skill, deep research) to
  flagship even on Starter, eating the cost as a quality differentiator.

### 8.5 Vendor pricing volatility

- **Risk:** OpenAI / Anthropic raise prices. Financial Datasets changes
  rate card. Our COGS rises overnight.
- **Mitigation:** keep this doc current; review per-action cost matrix
  quarterly; build the model selector so we can switch defaults
  quickly. Multi-provider plumbing already exists in
  `src/model/llm.ts`.

### 8.6 Free tier conversion below assumption

- **Risk:** Free → Starter conversion <3%. Free tier is a pure cost.
- **Mitigation:** measure conversion rate from day 1 of paid launch.
  If <2% after 4 weeks, tighten Free (e.g., 10 chats, 0 file gens).
  If still <2%, consider removing Free entirely in favour of a 14-day
  Pro trial.

---

## 9. Decisions made (committed)

- [x] Four-tier structure: Free / Starter / Pro / Power
- [x] Starter targets $15 as primary anchor (final +/- TBD per D4)
- [x] Default model differs by tier (mini for Free/Starter, flagship for Pro/Power)
- [x] File generation always routes to flagship regardless of default
- [x] Annual billing offered with ~20% discount
- [x] Power tier ships with usage-based overage, not flat rate

## 10. Decisions explicitly deferred

- [ ] D1–D10 above (see Section 6)
- [ ] Team / Enterprise pricing — wait for first inbound request
- [ ] "Lifetime" or one-time payment — explicitly rejected (variable
      cost per user too high)
- [ ] Add-on packs (extra file gens, extra portfolios) — defer until
      we see which constraint users bump into most

---

## 11. Notes from prior discussion (preserved for context)

- Initial cost analysis used Claude pricing. We've since confirmed the
  current default is OpenAI gpt-5.5. Per-action numbers in Section 2.1
  will be revised once GPT-5.5 actual rates are confirmed (D1).
- Anthropic prompt-caching infrastructure exists in `src/model/llm.ts`
  but is dormant — only activates on `claude-*` model prefix.
- The cron-tool and WhatsApp-Baileys paths in the codebase make the
  Power tier's automation features cheap to expose (mostly UI work,
  the backend is already built).
- The chunked-agent layer (`dexter_agent_jobs`, `runContinuation`,
  CHUNK_BUDGET_MS) raises the ceiling on what a single user can produce
  in one prompt — making file-gen quota even more important as a
  cost gate.

---

## 12. Next discussion topics

When we come back to this doc, the unblocking question is **D1**:
the actual GPT-5.5 unit cost from your OpenAI dashboard. With those
numbers we can revise Sections 2.1 and 5.1–5.3, confirm or revise the
$15 / $39 / $129 anchors, and move from planning to implementation
(Section 7).
