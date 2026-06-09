---
title: 'From Dexter to PickSkill: Building on an Open-Source Agent'
description: >-
  How we built PickSkill on Dexter, the open-source finance agent — adding a
  web app, Word/PowerPoint/Excel generation, and an 8-indicator portfolio
  suite.
publishedAt: 2026-06-09
updatedAt: 2026-06-09
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: The PickSkill research team — building an AI analyst for retail investors.
pillar: build-in-public
tags:
  - open-source
  - dexter
  - ai-analyst
  - architecture
  - build-in-public
heroImage: /blog/from-dexter-to-pickskill/hero.png
heroAlt: >-
  Editorial infographic — a before/after architecture diagram showing Dexter
  the open-source CLI agent on the left flowing into the PickSkill web app on
  the right, with new layers for Office file generation and the portfolio
  indicator suite.
---

**PickSkill started as a fork of [Dexter](https://github.com/virattt/dexter), the open-source autonomous finance agent by [@virattt](https://twitter.com/virattt) — "Claude Code, but built for financial research."** Dexter gave us a battle-tested agent loop: a CLI tool, written in TypeScript with Ink and LangChain, that decomposes a finance question into a research plan, executes tools against live market data, checks its own work, and iterates until it has a sourced answer. We took that core and built outward — a browser-native web app, native Word/PowerPoint/Excel generation, portfolio management, and an eight-dimension technical-indicator suite. This post is the honest build-in-public account of what we kept, what we added, and why.

### Key takeaways

- **PickSkill is built on Dexter**, the open-source finance agent (MIT-licensed, [github.com/virattt/dexter](https://github.com/virattt/dexter)). We kept the agent loop; we rebuilt almost everything around it.
- **The biggest single change was the surface.** Dexter is a CLI; PickSkill is a multi-locale web app at [pickskill.ai](https://pickskill.ai). The agent runtime is shared; the interaction model is not.
- **We added native Office generation** — the agent now writes real `.docx`, `.pptx`, and `.xlsx` files, not screenshots or Markdown dumps.
- **We added portfolio management and an eight-indicator dashboard** — MACD, MA stack, RSI, KDJ, Bollinger Bands, ADX/DMI, volume, and capital flow, each with a [5-day signal trail](/blog/5-day-signal-trail).
- **We extended coverage to US, Hong Kong, and A-share markets** with market-specific conventions — including masking A-share limit-up / limit-down bars so they don't fire false signals.

## What is Dexter, and why start from open source?

Dexter is an open-source AI agent for deep financial research, written in TypeScript with Ink (React for the terminal) and LangChain. Its design thesis is simple: take a complex finance question, turn it into a step-by-step research plan, execute each step with the right tool against live data, self-validate, and refine until the answer is confident and sourced. It runs in a terminal, logs every tool call to a scratchpad, and persists model and provider choices in a local config. The repository is MIT-licensed and public on [GitHub](https://github.com/virattt/dexter).

Starting from Dexter rather than from scratch was a deliberate GTM decision. The hardest part of an analyst agent is not the chat box — it's the loop that plans, calls tools, and reconciles live financial data without hallucinating numbers. Dexter had already solved that loop in the open. Building on it meant we could spend our first months on the *product surface* — the web app, the file outputs, the portfolio layer — instead of re-deriving agent plumbing that a strong open-source project had already proven.

## What we added on top of Dexter

The table below maps the inheritance. The left column is Dexter's contribution; the right column is what PickSkill added to make it a consumer product.

| Layer | From Dexter (open source) | Added by PickSkill |
|---|---|---|
| **Agent loop** | Task planning, tool execution, self-reflection, scratchpad logging | Multi-tenant session state, quota + billing, memory across sessions |
| **Surface** | Interactive CLI (Ink/React-in-terminal) | Browser web app, 8 locales, mobile layout, shareable links |
| **Data** | Live financials + market data | US + Hong Kong + A-share coverage, limit-bar masking, capital-flow proxy |
| **Output** | Terminal text + scratchpad JSONL | Native `.docx` / `.pptx` / `.xlsx` via OfficeCLI on presigned links |
| **Analysis** | On-demand financial reasoning | [/portfolios](/portfolios) management + [/indicators](/indicators) dashboard with 8 dimensions |

The pattern in that table is the whole strategy: keep the proven core, productise everything a retail investor touches.

## How the web version changed the architecture

Moving from a CLI to a web app is not a UI reskin — it changes the threading model. A CLI agent owns the terminal: one user, one session, blocking output, local files. A web agent serves many users concurrently, streams partial output to a browser, persists session history server-side, and writes artefacts to object storage instead of the local disk.

So while the *agent loop* is inherited from Dexter, the runtime around it is new. Sessions are multi-tenant and resumable — you can close the tab and pick up the same research conversation later. Tool output streams to the browser as it happens, the same way Dexter streams to the terminal. And generated files land on Cloudflare R2 as 7-day presigned download links rather than in a local directory, because a web user has no shell to `cat` a file from. The honest framing: Dexter gave us the brain; the web app is a new body built to carry it to non-technical users.

> **See it run.** Open [/chat](/chat) and ask any finance question — the agent loop you're talking to is Dexter's, productised for the browser.

## Why Office file generation matters

The single most-requested capability that Dexter's CLI didn't have was *deliverables*. A terminal answer is great for the person who ran the query; it's useless for the colleague, the investment club, or the interview committee who needs something they can open. Retail and semi-pro analysts live in Word, PowerPoint, and Excel — those three formats are the universal interchange layer of finance.

So we added OfficeCLI: the agent now compiles its analysis into native OpenXML files. Not screenshots, not PDFs, not Markdown — real `.docx` memos with headings and tables, real `.pptx` decks with embedded charts and editable slide titles, and real `.xlsx` workbooks with live cross-sheet formulas and conditional formatting. Each file ships as a 7-day presigned link. We wrote three step-by-step walk-throughs for the most common flows: [export a portfolio to PowerPoint](/blog/export-portfolio-to-powerpoint), [export a report to Excel](/blog/export-portfolio-report-to-excel), and [generate an investor deck from a chat](/blog/generate-investor-deck-from-chat).

## Portfolio management and the eight-indicator suite

Dexter answers questions one at a time. PickSkill adds *standing* analysis: a portfolio you maintain at [/portfolios](/portfolios) and an indicator dashboard at [/indicators](/indicators) that runs continuously across every holding. The dashboard computes eight technical dimensions on the latest close:

1. **MACD** — momentum and crossover state ([what is MACD](/blog/what-is-macd))
2. **Moving averages** — MA5 / MA20 / MA60 stack and [golden / death cross](/blog/what-is-golden-cross-death-cross)
3. **RSI(14)** — overbought / oversold ([what is RSI](/blog/what-is-rsi))
4. **KDJ(9,3,3)** — stochastic momentum, popular on A-shares ([what is KDJ](/blog/what-is-kdj))
5. **Bollinger Bands(20,2)** — volatility envelope ([what is Bollinger Bands](/blog/what-is-bollinger-bands))
6. **ADX/DMI(14)** — trend strength ([what is ADX](/blog/what-is-adx))
7. **Volume / price relationship** ([volume analysis](/blog/what-is-volume-analysis))
8. **Capital flow proxy** ([what is capital flow](/blog/what-is-capital-flow))

Each dimension ships with a [5-day signal trail](/blog/5-day-signal-trail) — five dots showing how the bucket call evolved across the trading week, so you read trajectory, not just today's snapshot. And because we cover A-shares, the dashboard detects limit-up / limit-down / halt bars (where high equals low) and masks them as neutral, so a degenerate bar never produces a false bullish or bearish signal.

## What we kept from Dexter — and what we changed

We kept the philosophy that defines Dexter: sourced output or it didn't happen, editable assumptions over black-box answers, and a self-validating agent loop. Those principles map directly onto our GTM promise — *PickSkill is the AI analyst that researches, models, and drafts equity work in plain English.*

What we changed is everything a non-technical user touches. The provider layer was generalised — Dexter supports multiple model providers, and PickSkill ships with OpenAI's gpt-5.5 family as default while supporting Anthropic, Google Gemini, xAI, and local Ollama through the same agent surface. We added billing, memory, multi-language UI, and the deliverable layer. For the bigger picture of where AI in equity research actually delivers leverage today, see [AI for Stock Research in 2026](/blog/ai-for-stock-research-2026).

## What's next

A few items on the public roadmap, in the same build-in-public spirit:

- **Scheduled re-exports** — auto-refresh a portfolio workbook or deck on a cadence and deliver it to you, instead of re-running the prompt by hand.
- **Earnings-call transcript extraction** — the Q&A section, where forward-looking signal lives, not just the prepared remarks.
- **More markets** — Tokyo and India next, each a 2–3 month integration to get the filing extractor and indicator conventions right.

If there's a workflow gap you want solved, [tell us](/feedback) — the roadmap is responsive to what users actually need.

## FAQ

**Is PickSkill the same as Dexter?**
No. PickSkill is built on Dexter's open-source agent loop but is a separate product. Dexter is a CLI research tool for developers; PickSkill is a hosted web app with accounts, billing, portfolio management, Office-file generation, and multi-market coverage. We kept Dexter's agent core and its "sourced output" philosophy, then built a consumer product around it.

**Is Dexter open source, and can I use it directly?**
Yes. Dexter is MIT-licensed and public at [github.com/virattt/dexter](https://github.com/virattt/dexter). You can clone it, run it in your terminal, and use it for financial research today. PickSkill exists for people who want the same agent power without running a CLI — in a browser, with deliverables and a portfolio layer.

**What did PickSkill actually add on top of Dexter?**
Four major layers: a multi-locale web app surface, native Word/PowerPoint/Excel generation via OfficeCLI, portfolio management with an eight-indicator dashboard and 5-day signal trail, and US/HK/A-share market coverage with limit-bar masking. The underlying plan-execute-validate agent loop is inherited from Dexter.

**Which AI models does PickSkill use?**
The default is OpenAI's gpt-5.5 family. PickSkill also supports Anthropic, Google Gemini, xAI, and local Ollama models through the same agent surface, inheriting Dexter's multi-provider design. The model choice doesn't change the workflow — sourced output and editable assumptions hold across providers.

**Why build on an existing open-source project instead of from scratch?**
The hard part of an analyst agent is the loop that plans, calls tools, and reconciles live data without hallucinating — Dexter had already proven that in the open. Building on it let us spend our early months on the product surface real users touch (web app, Office files, portfolio dashboard) rather than re-deriving agent plumbing.
