# PickSkill GSC report — 2026-09-29 → 2026-10-26

- 生成：2026-10-29；数据末日 2026-10-26（GSC 延迟约 3 天）；窗口 28 天
- 站点（无偏 totals）：点击 58 · 展示 11,837 · CTR 0.490% · 均位 9.4
- query 明细覆盖率：点击 13.8%（8/58）· 展示 37.0% —— **query 表的绝对量不得与站点总量比较**
- 剔除冻结页族（实验未判读，按规则不看当期数据）：无
- 剔除出队项：无

## 1. 站点周趋势（按数据末日对齐的 7 天桶）

| 桶（结束日） | 天数 | 点击 | 展示 | CTR |
|---|---|---|---|---|
| 2026-10-05 | 7/7 | 17 | 2,332 | 0.7% |
| 2026-10-12 | 7/7 | 9 | 2,791 | 0.322% |
| 2026-10-19 | 7/7 | 21 | 3,530 | 0.6% |
| 2026-10-26 | 7/7 | 11 | 3,184 | 0.345% |

- 日点击均值 2.1，日 σ 1.4 → **7 天环比差值的 1σ ≈ 5.3 次点击**
- 桶边界敏感性（环比）：结束于 2026-10-26: -10（-47.6%，-1.9σ）；结束于 2026-10-25: -4（-22.2%，-0.8σ）；结束于 2026-10-24: +2（12.5%，0.4σ）
- 判读：|差值| < 2σ 或三个读数方向不一致 → ⚪ 噪声，不写解释

## 2. 够得着的关键词（query 级，均位 4–15，展示 ≥ 20）

| query | 页面 | 展示 | 点击 | 均位 |
|---|---|---|---|---|
| fcf | /es/blog/what-is-fcf | 632 | 1 | 7.7 |
| fcff | /es/blog/what-is-fcf | 504 | 0 | 8.1 |
| atr | /es/blog/what-is-atr | 116 | 0 | 10.3 |
| 市值 | /zh-TW/blog/what-is-market-cap | 92 | 0 | 11.4 |
| que es atr | /es/blog/what-is-atr | 85 | 0 | 12.8 |
| fcff formula | /es/blog/what-is-fcf | 71 | 0 | 12.4 |
| fcfe formula | /es/blog/what-is-fcf | 68 | 0 | 6.2 |
| atr que es | /es/blog/what-is-atr | 65 | 0 | 13.0 |
| 데드크로스 | /ko/blog/what-is-golden-cross-death-cross | 54 | 0 | 8.1 |
| f.c.f | /es/blog/what-is-fcf | 53 | 0 | 8.5 |
| fcfe | /es/blog/what-is-fcf | 53 | 0 | 9.3 |
| 골든크로스 | /ko/blog/what-is-golden-cross-death-cross | 53 | 0 | 9.9 |
| fcf fcff | /es/blog/what-is-fcf | 53 | 0 | 6.3 |
| ev/ebitda | /zh-TW/blog/what-is-ev-ebitda | 51 | 0 | 7.9 |
| fcf | /fr/blog/what-is-fcf | 49 | 0 | 13.9 |
| fcf formula | /es/blog/what-is-fcf | 47 | 0 | 4.9 |
| fcff y fcfe | /es/blog/what-is-fcf | 40 | 1 | 6.9 |
| bullische divergenz | /de/blog/find-bullish-divergences | 36 | 0 | 11.4 |
| ev/ebit | /zh-TW/blog/what-is-ev-ebitda | 32 | 0 | 14.5 |
| fcff vs fcfe | /es/blog/what-is-fcf | 30 | 0 | 8.5 |
| que es el fcf yield | /es/blog/what-is-fcf | 29 | 0 | 12.8 |
| 골든크로스 데드크로스 | /ko/blog/what-is-golden-cross-death-cross | 26 | 0 | 9.1 |
| atr | /ko/blog/what-is-atr | 25 | 0 | 9.3 |
| dcf | /zh-TW/blog/what-is-dcf | 24 | 0 | 12.2 |
| formula fcfe | /es/blog/what-is-fcf | 23 | 0 | 5.7 |

## 3. 高展示低 CTR 页面（A 类 meta 重写候选，无偏 totals）

期望 CTR 取本站同分段、同位置桶的全历史 CTR（见 §8）。**A 类闸门：期望点击 ≥ 1/周**，低于它 CTR 翻倍也读不出来。

| 页面 | 展示 | 点击 | CTR | 均位 | 期望 CTR（来源） | 期望点击/周 | 实际/期望 | 判定 |
|---|---|---|---|---|---|---|---|---|
| /es/blog/what-is-fcf | 2,708 | 5 | 0.185% | 8.0 | 0.390%（blog·6–10） | 2.6 | 0.47 | 🎯 候选 |
| /es/blog/what-is-atr | 1,026 | 0 | 0.0% | 16.6 | 0.184%（blog·11–20） | 0.5 | 0.00 | ⚪ 期望点击 <1/周 |
| /ko/blog/what-is-golden-cross-death-cross | 657 | 6 | 0.9% | 6.8 | 0.390%（blog·6–10） | 0.6 | 2.34 | ⚪ 期望点击 <1/周 |
| /fr/blog/what-is-fcf | 463 | 2 | 0.432% | 10.8 | 0.390%（blog·6–10） | 0.5 | 1.11 | ⚪ 期望点击 <1/周 |
| /zh-TW/blog/what-is-eps | 439 | 1 | 0.228% | 11.2 | 0.184%（blog·11–20） | 0.2 | 1.24 | ⚪ 期望点击 <1/周 |
| /zh-TW/blog/what-is-market-cap | 431 | 0 | 0.0% | 8.7 | 0.390%（blog·6–10） | 0.4 | 0.00 | ⚪ 期望点击 <1/周 |
| /zh-TW/blog/what-is-dcf | 415 | 1 | 0.241% | 10.6 | 0.390%（blog·6–10） | 0.4 | 0.62 | ⚪ 期望点击 <1/周 |
| /blog/what-is-cpi-and-how-it-affects-stocks | 310 | 0 | 0.0% | 8.5 | 0.390%（blog·6–10） | 0.3 | 0.00 | ⚪ 期望点击 <1/周 |
| /es/blog/ma-vs-ema | 263 | 0 | 0.0% | 6.7 | 0.390%（blog·6–10） | 0.3 | 0.00 | ⚪ 期望点击 <1/周 |
| /es/blog/what-is-eps | 263 | 1 | 0.380% | 8.6 | 0.390%（blog·6–10） | 0.3 | 0.97 | ⚪ 期望点击 <1/周 |
| /zh-TW/blog/what-is-ev-ebitda | 232 | 1 | 0.431% | 9.6 | 0.390%（blog·6–10） | 0.2 | 1.10 | ⚪ 期望点击 <1/周 |
| /zh-CN/blog/what-is-cpi-and-how-it-affects-stocks | 231 | 1 | 0.433% | 7.3 | 0.390%（blog·6–10） | 0.2 | 1.11 | ⚪ 期望点击 <1/周 |
| /zh-TW/blog/what-is-golden-cross-death-cross | 227 | 0 | 0.0% | 9.2 | 0.390%（blog·6–10） | 0.2 | 0.00 | ⚪ 期望点击 <1/周 |
| /ko/blog/what-is-atr | 207 | 3 | 1.4% | 7.4 | 0.390%（blog·6–10） | 0.2 | 3.71 | ⚪ 期望点击 <1/周 |
| /blog/what-is-ma | 202 | 1 | 0.495% | 8.6 | 0.390%（blog·6–10） | 0.2 | 1.27 | ⚪ 期望点击 <1/周 |
| /zh-TW/blog/what-is-ma | 183 | 3 | 1.6% | 8.0 | 0.390%（blog·6–10） | 0.2 | 4.20 | ⚪ 期望点击 <1/周 |
| /es/blog/what-is-cpi-and-how-it-affects-stocks | 172 | 0 | 0.0% | 8.4 | 0.390%（blog·6–10） | 0.2 | 0.00 | ⚪ 期望点击 <1/周 |
| /zh-TW/blog/what-is-pb-ratio | 167 | 0 | 0.0% | 8.0 | 0.390%（blog·6–10） | 0.2 | 0.00 | ⚪ 期望点击 <1/周 |
| /zh-CN/blog/what-is-roe | 147 | 0 | 0.0% | 8.7 | 0.390%（blog·6–10） | 0.1 | 0.00 | ⚪ 期望点击 <1/周 |
| /blog/dcf-vs-comparable-company-analysis | 143 | 2 | 1.4% | 6.9 | 0.390%（blog·6–10） | 0.1 | 3.58 | ⚪ 期望点击 <1/周 |
| /ko/blog/what-is-ichimoku-cloud | 118 | 0 | 0.0% | 6.6 | 0.390%（blog·6–10） | 0.1 | 0.00 | ⚪ 期望点击 <1/周 |
| /es/blog/what-is-roe | 118 | 1 | 0.8% | 23.3 | 0.152%（blog·21–40） | 0.0 | 5.58 | ⚪ 期望点击 <1/周 |
| /ja/blog/what-is-ma | 106 | 1 | 0.9% | 7.4 | 0.390%（blog·6–10） | 0.1 | 2.42 | ⚪ 期望点击 <1/周 |
| /de/blog/what-is-dcf | 105 | 0 | 0.0% | 32.5 | 0.152%（blog·21–40） | 0.0 | 0.00 | ⚪ 期望点击 <1/周 |
| /ja/blog/what-is-pb-ratio | 98 | 0 | 0.0% | 21.6 | 0.152%（blog·21–40） | 0.0 | 0.00 | ⚪ 期望点击 <1/周 |

## 4. 页面趋势（后 14 天 vs 前 14 天，对齐数据末日，|Δ| ≥ 2σ 才列出）

（无超过 2σ 的变化）

## 5. 新出现的搜索词（近 7 天首次出现、展示 ≥ 10 → C 类新内容候选）

| query | 承接页 | 展示 | 均位 |
|---|---|---|---|
| dcf formel | /de/blog/what-is-dcf | 19 | 29.5 |
| discounted cash flow | /de/blog/what-is-dcf | 16 | 24.2 |
| ema vs bar | /blog/ma-vs-ema | 10 | 8.7 |

## 6. 语种承接（query 文字 / 国家 vs 落地页语种 → D 类候选）

（无展示 ≥ 20 的错配）

## 7. 实验（experiments.json）

（无在册实验）

## 8. 位置分桶 CTR（无偏 totals 全历史，按分段）

> totals 的位置是页面当天所有 query 的加权均位，中间桶的 CTR 偏高估，只作期望值参考；样本 < 200 展示标 thin，期望值退回通用曲线。

| 分段 | 1–2 | 3–5 | 6–10 | 11–20 | 21–40 | 41+ |
|---|---|---|---|---|---|---|
| blog | 2.7% (594) | 1.1% (3,922) | 0.390% (22,539) | 0.184% (6,533) | 0.152% (1,974) | 0.0% (108, thin) |
| stocks | — | — | — | — | — | — |
| product | 5.2% (306) | 3.4% (236) | 0.427% (234) | 0.413% (242) | 0.0% (7, thin) | 0.0% (8, thin) |

