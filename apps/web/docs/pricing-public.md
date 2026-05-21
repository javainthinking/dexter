# PickSkill — Plans & Pricing (customer-facing)

> Audience: end users browsing a `/pricing` page on the web app.
> Web mode only — WhatsApp bot, Email digest, and scheduled-job
> features are deferred for now and not listed here.
>
> Internal pricing rationale, cost model, and feature gates that
> aren't yet shipped live in `apps/web/docs/pricing.md`.

---

## The pitch

> An AI analyst that researches, models, and drafts your equity work —
> in plain English. Track portfolios, generate decks and reports, and
> keep your investment thesis in one place.

---

## Plans

```
   Free            Starter $15/mo       Pro $39/mo         Power $129/mo
                   ($12 billed annual)  ($32 billed annual) ($104 billed annual)
                                                            + usage overage
```

Annual plans save 20%. Cancel anytime.

---

## What you get

| | **Free** | **Starter** | **Pro** | **Power** |
|---|---|---|---|---|
| **Price (monthly)** | $0 | $15 | $39 | $129+ |
| **Price (annual)** | $0 | $144 ($12/mo) | $384 ($32/mo) | $1,248 ($104/mo) |
| **The AI assistant** | | | | |
| AI model | Standard | Standard | **Advanced** | **Advanced** |
| Conversations per month | 30 | 200 | 1,000 | Unlimited |
| Deep-research turns per month *(web + filings + multi-source)* | 5 | 50 | 300 | Unlimited |
| Specialised workflows *(DCF, X/Twitter research, sector deep-dives)* | — | Basic | All | All + custom |
| Long-term memory entries | 50 | 500 | 1,000 | Unlimited |
| **Documents generated** | | | | |
| Files per month *(PowerPoint / Word / Excel)* | 2 | 8 | 30 | 100+ |
| AI model used for file generation | Advanced | Advanced | Advanced | Advanced |
| Download links retained | 7 days | 7 days | 7 days | 7 days |
| **Portfolios** | | | | |
| Number of portfolios | 1 | 3 | 10 | Unlimited |
| Holdings per portfolio | 10 | 25 | 50 | 100 |
| Quote refresh | Manual | Manual + on-demand | Auto every 15 min during market hours | Auto every 5 min + real-time on demand |
| Historical data window | 1 month | 6 months | 2 years | 5 years |
| Watchlists *(symbols you track without owning)* | — | 1 list, up to 20 symbols | 5 lists, up to 50 symbols each | Unlimited |
| **Indicators dashboard** | | | | |
| Technical & analytical dimensions | 1 *(price)* | 3 *(price, fundamentals, sentiment)* | All 8 *(adds capital flow, divergence, KDJ, MACD, support/resistance, golden-cross)* | All 8 + custom dimension builder |
| Drill-down per stock | Basic | Basic | Full | Full + side-by-side compare |
| Export dashboard to a deck | — | — | ✓ *(uses your file-gen quota)* | ✓ Unlimited |
| **Other** | | | | |
| Priority compute queue | — | — | — | ✓ |
| Support | Community | Email reply within 48h | Email reply within 24h | Shared Slack channel |
| Cancel anytime | ✓ | ✓ | ✓ | ✓ |

### Power tier — usage overage

The Power plan includes generous base limits and bills overage only if
you exceed them:

| What | Base included | Overage rate |
|---|---|---|
| Conversations | 2,000 / month | $0.05 each |
| File generations | 100 / month | $1.00 each |

So a typical Power month is $129. A heavy month with 4,000 chats and
200 file generations would bill: $129 base + $100 over-chat +
$100 over-file = $329 — still well below alternatives like Bloomberg
Terminal or AlphaSense individual seats.

---

## Frequently asked questions

### What counts as one "conversation"?

A conversation is one back-and-forth with the AI on a topic — you ask
something, the AI researches and answers, you may ask follow-ups in
the same thread. We count the whole thread (turns and tool calls
inside) as one conversation against your monthly quota.

### What counts as a "deep-research turn"?

A turn where the AI runs web search, reads SEC filings, or calls
multiple data sources to answer you. Quick price-lookup or
definitional questions don't count against this — only the heavier
research workflows do.

### What's a "specialised workflow"?

A pre-built multi-step analysis you can ask for by name — for example:

- **DCF valuation** — runs a full discounted-cash-flow on a ticker
  with sensitivity matrices
- **X/Twitter research** — sentiment + thread mining around a stock
- *(more added over time)*

Starter gets a basic subset; Pro and Power get everything.

### How does "file generation" work?

Ask the AI to make a PowerPoint deck, Word document, or Excel sheet —
e.g. *"Build a 2-page equity research note on Apple in Word"*. We
generate the file, host it on Cloudflare R2, and give you a
download link in chat. Each file counts as one against your monthly
quota, regardless of how many slides/pages/rows it contains. File
generation **always uses the Advanced AI model** so the output quality
stays high regardless of which plan you're on.

### What are the "indicator dimensions"?

Eight lenses on the same set of stocks in your portfolio, each
answering a different question:

1. **Price** — current quotes, daily/weekly returns
2. **Fundamentals** — revenue growth, margins, P/E, etc.
3. **Sentiment** — news + social mood
4. **Capital flow** — institutional buying/selling pressure
5. **Divergence** — when price and volume disagree
6. **KDJ** — short-term momentum oscillator
7. **MACD** — trend strength and reversal signals
8. **Support / resistance** — key technical price levels

Free shows only price. Starter unlocks the first three. Pro and Power
get all eight.

### How does quote refresh differ between plans?

- **Free / Starter:** quotes update when you open the page or click a
  refresh button.
- **Pro:** quotes auto-refresh every 15 minutes during US market hours.
- **Power:** quotes auto-refresh every 5 minutes during market hours,
  with a "fetch real-time now" button for instant updates.

### Will my data carry over if I upgrade or downgrade?

Yes. Portfolios, holdings, memory entries, and conversation history
move with your account. If you downgrade and exceed the lower plan's
limits, we keep all your data — older portfolios become read-only
until you remove some or upgrade again, but nothing is deleted.

### Can I switch between monthly and annual billing?

Yes, any time. Monthly → annual: you're charged a prorated annual
amount and your renewal date shifts. Annual → monthly: takes effect at
your next renewal.

### What payment methods do you accept?

Major credit cards via Stripe. Local payment methods (Alipay, WeChat
Pay, etc.) for users in supported regions are on our roadmap.

### Is there a free trial of Pro?

Every new account gets 7 days of full Pro access on signup —
no credit card required. After the trial you choose your plan or stay
on Free.

### Can I get a refund?

If you're on a monthly plan, cancel anytime — no refund needed since
you're billed for the month you used. If you're on an annual plan and
cancel within 14 days of renewal, we'll refund the difference between
your annual price and the monthly equivalent for any months you used.

### Do you offer team or enterprise pricing?

Coming soon. If you need multiple seats, a custom contract, or
on-premises deployment, contact us and we'll work out a plan.

---

## Why these limits exist

We chose monthly limits over per-token billing so you always know what
your bill will be. The quotas are sized so a typical user on each
plan never hits the cap — the cap exists to prevent abuse and to keep
the lower tiers affordable.

If you're regularly hitting a limit, that's usually a signal to look
at the next tier up. We'll show you a usage gauge in the app so you
never get surprised.

---

## Get started

- **Try free** — 30 conversations / month, no card required
- **Start with Starter** — $15/mo or $144/year, cancel anytime
- **Go Pro** — best for daily analyst work
- **Talk to us about Power or Team** — drop a line at hello@pickskill.com
