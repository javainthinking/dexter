---
title: 什么是 EV/EBITDA?穿透资本结构的估值倍数
description: EV/EBITDA 实用指南 — 它衡量什么、为什么在跨资本结构对比上胜过 P/E、在哪里美化资本密集型公司、以及什么时候选它而不选 P/E。
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: PickSkill 研究团队 — 为个人投资者打造 AI 分析师。
pillar: explainer
tags:
  - valuation
  - ev-ebitda
  - multiples
  - fundamentals
heroImage: /blog/what-is-ev-ebitda/hero.png
heroAlt: 显示 EV/EBITDA 公式与各行业典型读数区间的信息图
---

**EV/EBITDA** 是能穿透资本结构的估值倍数。[P/E](/blog/what-is-pe-ratio) 用利息后、税后盈利除股价 —— 两者都取决于融资和税务结构;EV/EBITDA 用*企业价值*(整个业务的价值)除以 *EBITDA*(剔除融资和会计选择影响前的盈利)。结果是一个让你能在同行业中比较两家公司的倍数,即便其中一家高负债、一家无负债。

本文涵盖公式、EV/EBITDA 何时胜过 P/E、何时会美化资本密集型公司、以及怎样在不踩典型陷阱的前提下使用它。

### 重点摘要

- **EV/EBITDA = 企业价值 ÷ EBITDA。** 企业价值 = 市值 + 负债 − 现金 + 少数股东权益。EBITDA = 息税折旧摊销前盈利。
- **它与资本结构无关。** 比较两家负债水平不同的公司是 EV/EBITDA 存在的主要原因。P/E 在这种对比下崩,EV/EBITDA 不会。
- **它会美化资本密集型公司**,因为忽略 capex。每年花 10 亿美元 capex 的钢厂,在相同 EV/EBITDA 下看起来比几乎不花钱的软件公司「便宜」。
- **典型读数**:公用事业 8–10×、工业 10–14×、消费/医疗 14–20×、软件 18–30×+。永远要锚定同行和自身历史。
- **PickSkill 同时算 EV/EBITDA**,做完整同行对比,并在 EV/EBITDA 与 P/E 给出相反结论时自动标红 —— 这通常是资本结构或会计选择在作怪。

## EV/EBITDA 是什么

```
EV/EBITDA = 企业价值 / EBITDA

其中:
  企业价值 = 市值 + 总负债 − 现金及等价物 + 少数股东权益
  EBITDA  = 营业利润 + 折旧 + 摊销
```

**企业价值(EV)** 是收购整家公司的总成本 —— 买掉所有股权 *并* 承担所有债务,手头现金抵消一部分。

**EBITDA** 剔除四件事:利息(融资选择)、税(税务辖区)、折旧、摊销(都是非现金会计分摊)。剩下的是 capex 和营运资金前的营业现金生成代理。

## 什么时候用 EV/EBITDA 比 P/E 好

三种场景:

1. **负债水平不同的公司。** 高杠杆公司利息高、净利低、P/E 机械抬高。EV/EBITDA 切在利息线之上,对比保持干净。经典例子:电信公司。
2. **近期并购扭曲摊销。** 收购带来的无形资产摊销会波及多年。P/E 反映这个,EBITDA 不反映。
3. **跨境对比。** 不同税务辖区让 P/E 噪声大;EV/EBITDA 对税收中性。

## 什么时候会误导

1. **资本密集型业务。** 钢厂、电信、航空每年 capex 占收入 5–15%。EBITDA 忽略 capex。在 FCF(扣 capex 后)疲软时 EV/EBITDA 会让公司看起来很便宜。要和 FCF 收益率搭配看,见 [什么是 FCF?](/blog/what-is-fcf)。
2. **资本化软件开发的科技公司。** SaaS 把内部用软件资本化,将其从经营费用挪到 capex(EBITDA 看不到)。32× EV/EBITDA 的 SaaS 公司可能和另一家不资本化的 32× 同行底层现金经济完全不同。
3. **激进调整 EBITDA 的公司。** 「Adjusted EBITDA」「Pro Forma EBITDA」「EBITDAS」 —— 每一次调整都拉大 EBITDA 与实际现金的差距。永远先读 10-K 中的 EBITDA 调节表(参见 [30 分钟读 10-K](/blog/how-to-read-10k))。

## 按行业的读数区间(粗略)

| 行业 | 典型 EV/EBITDA |
|---|---|
| **公用事业** | 8–10× |
| **工业/材料** | 10–14× |
| **消费/医疗** | 14–20× |
| **软件/互联网** | 18–30×+ |
| **银行** | 不用(改用 P/E 或 P/Book) |

跨行业用原始 EV/EBITDA 对比无意义 —— 公用事业 9× 对软件 25× 是结构差异,不是「软件更贵」。

## EV/EBITDA vs P/E — 用哪个

| 用 EV/EBITDA 当 | 用 P/E 当 |
|---|---|
| 跨资本结构对比 | 杠杆相似的同行对比 |
| 跨税务辖区对比 | 同一国家对比 |
| 大额非现金摊销扭曲净利 | 损益表干净稳定 |
| 并购后跨买方对比 | 成熟无近期交易 |
| 收购/LBO 分析 | 纯股权侧对比 |

绝对 vs 相对估值的大图,见 [DCF vs 可比公司分析](/blog/dcf-vs-comparable-company-analysis)。

## PickSkill 怎么用 EV/EBITDA

打开 [/chat](/chat) 输入:

> *「在 EV/EBITDA 上对比 AMD、AVGO、INTC、NVDA — TTM 和 NTM — 与各自 5 年均值对照。标出 EV/EBITDA 和 P/E 对「贵不贵」给出相反信号的名字。」*

PickSkill 从 SEC 申报 + 市场数据拉 EV 各组成部分(市值 + 负债 + 少数股东权益 − 现金)和 EBITDA(TTM + 共识 NTM),算 EV/EBITDA 和 P/E,并显式标出两个倍数给出相反信号的案例 —— 这是资本结构、摊销或激进 EBITDA 调整在做实际工作的有用信号。

与 [DCF vs Comps 对比](/blog/dcf-vs-comparable-company-analysis) 搭配 —— EV/EBITDA 通常是 Comps 表的头条倍数。

## FAQ

**「好」的 EV/EBITDA 是多少?**
没有通用「好」。9× 对公用事业是公允;9× 对软件是便宜,除非有问题。永远锚定同行和自身历史。

**EV 和市值有什么区别?**
市值 = 只算股权。EV = 股权 + 负债 − 现金 + 少数股东权益。同一家公司;EV 反映收购包括承担债务的总成本。

**用前向还是过去 EBITDA?**
前向(NTM)是分析师对比的默认;过去(TTM)更有依据(EBITDA 真实报告)。两个都用 —— 二者差距隐含共识增长观点。

**EV/EBITDA 和 EV/EBIT 一样吗?**
不一样 —— EBIT 减去 D&A,EBITDA 不减。EV/EBIT 更接近「真实盈利」;EV/EBITDA 更接近 capex 前营运现金。资本密集业务用 EV/EBIT 更合理;轻资产对比用 EV/EBITDA。

**PickSkill 从哪里取 EBITDA?**
直接从最新 10-K/10-Q 的损益表和现金流量表算出。与公司自报的 EBITDA(如有)对账,并标出公司应用的调整(SBC 剔除、重组加回等),让你看到上报数字有多激进。
