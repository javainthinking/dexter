---
title: 从 Dexter 到 PickSkill — 在开源 agent 上构建产品
description: 我们如何在开源金融 agent Dexter 之上构建 PickSkill — 加入 Web 应用、Word/PowerPoint/Excel 生成,以及一套 8 维指标组合工具。
publishedAt: 2026-06-09
updatedAt: 2026-06-09
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: PickSkill 研究团队 — 为个人投资者打造 AI 分析师。
pillar: build-in-public
tags:
  - open-source
  - dexter
  - ai-analyst
  - architecture
  - build-in-public
heroImage: /blog/from-dexter-to-pickskill/hero.png
heroAlt: 编辑风格信息图 — 一张前后对比的架构图,左侧是开源 CLI agent Dexter,流向右侧的 PickSkill Web 应用,并新增了 Office 文件生成层和组合指标套件层。
---

**PickSkill 起步于对 [Dexter](https://github.com/virattt/dexter) 的一次 fork —— 这是 [@virattt](https://twitter.com/virattt) 开源的自主金融 agent,被称为「为金融研究而生的 Claude Code」。** Dexter 给了我们一套经过实战检验的 agent 循环:一个用 TypeScript 配合 Ink 与 LangChain 写成的 CLI 工具,它把一个金融问题拆解成研究计划、对实时市场数据执行工具调用、自检结果、并不断迭代,直到得出一个有出处的答案。我们留下了这个内核,然后向外构建 —— 一个浏览器原生的 Web 应用、原生的 Word/PowerPoint/Excel 生成、组合管理,以及一套八维技术指标套件。本文是关于我们保留了什么、新增了什么、以及为什么这么做的诚实「build-in-public」记录。

### 核心要点

- **PickSkill 构建在 Dexter 之上** —— 这个开源金融 agent 采用 MIT 许可([github.com/virattt/dexter](https://github.com/virattt/dexter))。我们保留了 agent 循环,几乎重建了它周围的一切。
- **最大的一项改变是「界面」。** Dexter 是 CLI;PickSkill 是一个多语言 Web 应用,地址在 [pickskill.ai](https://pickskill.ai)。agent 运行时是共享的;交互模型不是。
- **我们加入了原生 Office 生成** —— agent 现在会写出真正的 `.docx`、`.pptx` 和 `.xlsx` 文件,而不是截图或 Markdown 堆砌。
- **我们加入了组合管理和一个八维指标仪表板** —— MACD、均线堆栈、RSI、KDJ、布林带、ADX/DMI、成交量和资金流,每一项都带 [5 日信号轨迹](/blog/5-day-signal-trail)。
- **我们把覆盖范围扩展到美股、港股和 A 股市场**,并采用各市场特有的惯例 —— 包括把 A 股的涨停 / 跌停 K 线屏蔽掉,使其不会触发假信号。

## Dexter 是什么,为什么从开源起步?

Dexter 是一个用于深度金融研究的开源 AI agent,用 TypeScript 配合 Ink(终端里的 React)与 LangChain 写成。它的设计主张很简单:拿到一个复杂的金融问题,把它变成一份分步研究计划,用合适的工具对实时数据逐步执行,自我校验,再不断打磨,直到答案足够可信且有出处。它运行在终端里,把每一次工具调用记录到一个 scratchpad,并把模型和提供商的选择持久化到本地配置中。该仓库采用 MIT 许可,在 [GitHub](https://github.com/virattt/dexter) 上公开。

从 Dexter 起步而不是从零开始,是一个深思熟虑的 GTM 决策。一个分析师 agent 最难的部分不是聊天框 —— 而是那个会规划、调用工具、并在不编造数字的前提下对齐实时金融数据的循环。Dexter 已经在开源中解决了这个循环。在它之上构建,意味着我们能把头几个月花在*产品界面*上 —— Web 应用、文件输出、组合层 —— 而不是去重新推导一个强大开源项目早已验证过的 agent 底层管线。

## 我们在 Dexter 之上加了什么

下表勾勒了这份继承关系。左列是 Dexter 的贡献;右列是 PickSkill 为把它变成消费级产品而新增的部分。

| 层 | 来自 Dexter(开源) | PickSkill 新增 |
|---|---|---|
| **Agent 循环** | 任务规划、工具执行、自我反思、scratchpad 记录 | 多租户会话状态、配额 + 计费、跨会话记忆 |
| **界面** | 交互式 CLI(Ink / 终端里的 React) | 浏览器 Web 应用、8 种语言、移动端布局、可分享链接 |
| **数据** | 实时财务 + 市场数据 | 美股 + 港股 + A 股覆盖、涨跌停 K 线屏蔽、资金流代理指标 |
| **输出** | 终端文本 + scratchpad JSONL | 通过 OfficeCLI 生成的原生 `.docx` / `.pptx` / `.xlsx`,以预签名链接交付 |
| **分析** | 按需金融推理 | [/portfolios](/portfolios) 组合管理 + 带 8 个维度的 [/indicators](/indicators) 仪表板 |

那张表里的模式就是整套策略:保留经过验证的内核,把散户会触碰到的一切都产品化。

## Web 版如何改变了架构

从 CLI 迁到 Web 应用不是换张 UI 皮 —— 它改变的是线程模型。一个 CLI agent 独占终端:单用户、单会话、阻塞式输出、本地文件。一个 Web agent 要并发服务许多用户,把部分输出流式推到浏览器,把会话历史持久化在服务端,并把产物写入对象存储而不是本地磁盘。

所以尽管*agent 循环*继承自 Dexter,围绕它的运行时却是全新的。会话是多租户且可恢复的 —— 你可以关掉标签页,稍后再接着这场研究对话。工具输出会随发生实时流式推到浏览器,就像 Dexter 流式推到终端那样。生成的文件落在 Cloudflare R2 上,以 7 天有效的预签名下载链接形式提供,而不是落在本地目录里,因为一个 Web 用户没有终端可以 `cat` 出一个文件。诚实地说:Dexter 给了我们大脑;Web 应用是为把它带给非技术用户而新造的身体。

> **看它跑起来。** 打开 [/chat](/chat) 问任意金融问题 —— 你正在对话的那个 agent 循环就是 Dexter 的,为浏览器做了产品化。

## 为什么 Office 文件生成很重要

Dexter 的 CLI 没有、而呼声最高的一项能力,是*可交付物*。一个终端里的答案对运行查询的那个人很好;但对那位需要能打开的东西的同事、投资俱乐部或面试委员会而言毫无用处。散户和半职业分析师生活在 Word、PowerPoint 和 Excel 里 —— 这三种格式是金融领域通用的交换层。

于是我们加入了 OfficeCLI:agent 现在会把它的分析编译成原生的 OpenXML 文件。不是截图、不是 PDF、不是 Markdown —— 是带标题和表格的真正 `.docx` 备忘录、带内嵌图表和可编辑幻灯标题的真正 `.pptx` 演示文稿、以及带实时跨表公式和条件格式的真正 `.xlsx` 工作簿。每个文件都以 7 天有效的预签名链接交付。我们为最常见的几条流程写了三篇分步走的教程:[把组合导出为 PowerPoint](/blog/export-portfolio-to-powerpoint)、[把报告导出为 Excel](/blog/export-portfolio-report-to-excel),以及[从一次聊天生成投资演示](/blog/generate-investor-deck-from-chat)。

## 组合管理与八维指标套件

Dexter 一次回答一个问题。PickSkill 加入了*常驻*分析:一个你在 [/portfolios](/portfolios) 维护的组合,以及一个在 [/indicators](/indicators) 上、对每只持仓持续运行的指标仪表板。该仪表板在最新收盘价上计算八个技术维度:

1. **MACD** —— 动量与交叉状态([什么是 MACD](/blog/what-is-macd))
2. **均线** —— MA5 / MA20 / MA60 堆栈与[金叉 / 死叉](/blog/what-is-golden-cross-death-cross)
3. **RSI(14)** —— 超买 / 超卖([什么是 RSI](/blog/what-is-rsi))
4. **KDJ(9,3,3)** —— 随机动量,在 A 股很流行([什么是 KDJ](/blog/what-is-kdj))
5. **布林带(20,2)** —— 波动率通道([什么是布林带](/blog/what-is-bollinger-bands))
6. **ADX/DMI(14)** —— 趋势强度([什么是 ADX](/blog/what-is-adx))
7. **量价关系**([成交量分析](/blog/what-is-volume-analysis))
8. **资金流代理指标**([什么是资金流](/blog/what-is-capital-flow))

每个维度都带一条 [5 日信号轨迹](/blog/5-day-signal-trail) —— 五个圆点显示这个 bucket 判定在交易周内如何演变,让你读到的是轨迹,而不只是今天的快照。而且因为我们覆盖 A 股,仪表板会检测涨停 / 跌停 / 停牌 K 线(最高价等于最低价的情形),并把它们屏蔽为中性,这样一根退化的 K 线绝不会产生假的看涨或看跌信号。

## 我们从 Dexter 保留了什么 —— 又改变了什么

我们保留了定义 Dexter 的那套哲学:要么有出处的输出、要么当它没发生,可编辑的假设优于黑箱答案,以及一个自我校验的 agent 循环。这些原则直接对应到我们的 GTM 承诺 —— *PickSkill 是那位用大白话做研究、建模并起草股票研究工作的 AI 分析师。*

我们改变的,是非技术用户会触碰到的一切。提供商层被泛化了 —— Dexter 支持多个模型提供商,PickSkill 默认搭载 OpenAI 的 gpt-5.5 系列,同时通过同一个 agent 界面支持 Anthropic、Google Gemini、xAI 和本地 Ollama。我们加入了计费、记忆、多语言 UI 和那套可交付物层。关于 AI 在股票研究中今天究竟在哪里带来真正杠杆的更大图景,见 [2026 年的 AI 选股研究](/blog/ai-for-stock-research-2026)。

## 接下来在做什么

公开路线图上的几项,延续同样的 build-in-public 精神:

- **定时重新导出** —— 按某个节奏自动刷新一份组合工作簿或演示文稿并交付给你,而不用手动重跑 prompt。
- **财报电话会议转录抽取** —— 抽取 Q&A 部分,那里藏着前瞻信号,而不只是准备好的开场陈述。
- **更多市场** —— 接下来是东京和印度,每个都是 2–3 个月的集成,把申报抽取器和指标惯例做对。

如果有你想要被解决的工作流缺口,[告诉我们](/feedback) —— 路线图会根据用户真正需要的东西响应。

## FAQ

**PickSkill 和 Dexter 是一回事吗?**
不是。PickSkill 构建在 Dexter 的开源 agent 循环之上,但它是一个独立的产品。Dexter 是给开发者用的 CLI 研究工具;PickSkill 是一个托管的 Web 应用,带账户、计费、组合管理、Office 文件生成和多市场覆盖。我们保留了 Dexter 的 agent 内核和它「有出处的输出」哲学,然后围绕它构建了一个消费级产品。

**Dexter 是开源的吗,我能直接用吗?**
能。Dexter 采用 MIT 许可,在 [github.com/virattt/dexter](https://github.com/virattt/dexter) 公开。你今天就可以 clone 它、在终端里运行、并用它做金融研究。PickSkill 是为那些想要同样 agent 能力、却不想跑 CLI 的人而存在 —— 在浏览器里、带可交付物和组合层。

**PickSkill 在 Dexter 之上究竟加了什么?**
四个主要的层:一个多语言 Web 应用界面、通过 OfficeCLI 实现的原生 Word/PowerPoint/Excel 生成、带八维指标仪表板和 5 日信号轨迹的组合管理,以及带涨跌停 K 线屏蔽的美股/港股/A 股市场覆盖。底层那套规划-执行-校验的 agent 循环继承自 Dexter。

**PickSkill 用哪些 AI 模型?**
默认是 OpenAI 的 gpt-5.5 系列。PickSkill 还通过同一个 agent 界面支持 Anthropic、Google Gemini、xAI 和本地 Ollama 模型,继承了 Dexter 的多提供商设计。模型的选择不会改变工作流 —— 有出处的输出和可编辑的假设在各提供商间都成立。

**为什么要在一个已有的开源项目上构建,而不是从零开始?**
分析师 agent 难的那部分,是那个会规划、调用工具、并在不产生幻觉的前提下对齐实时数据的循环 —— Dexter 已经在开源中验证了这一点。在它之上构建,让我们能把早期的几个月花在真实用户会触碰到的产品界面上(Web 应用、Office 文件、组合仪表板),而不是去重新推导 agent 底层管线。
