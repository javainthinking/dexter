---
title: 什麼是 EV/EBITDA?穿透資本結構的估值倍數
description: EV/EBITDA 實用指南 — 它衡量什麼、為什麼在跨資本結構對比上勝過 P/E、在哪裡美化資本密集型公司、以及什麼時候選它而不選 P/E。
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: PickSkill 研究團隊 — 為個人投資者打造 AI 分析師。
pillar: explainer
tags:
  - valuation
  - ev-ebitda
  - multiples
  - fundamentals
heroImage: /blog/what-is-ev-ebitda/hero.png
heroAlt: 顯示 EV/EBITDA 公式與各產業典型讀數區間的資訊圖
---

**EV/EBITDA** 是能穿透資本結構的估值倍數。[P/E](/blog/what-is-pe-ratio) 用利息後、稅後盈利除股價 —— 兩者都取決於融資和稅務結構;EV/EBITDA 用*企業價值*(整個業務的價值)除以 *EBITDA*(剔除融資和會計選擇影響前的盈利)。結果是一個讓你能在同產業中比較兩家公司的倍數,即便其中一家高負債、一家無負債。

### 重點摘要

- **EV/EBITDA = 企業價值 ÷ EBITDA。** 企業價值 = 市值 + 負債 − 現金 + 少數股權。EBITDA = 息稅折舊攤銷前盈利。
- **它與資本結構無關。** 比較負債水平不同的公司是 EV/EBITDA 存在的主要原因。
- **它會美化資本密集型公司**,因為忽略 capex。
- **典型讀數**:公用事業 8–10×、工業 10–14×、消費/醫療 14–20×、軟體 18–30×+。

## EV/EBITDA 是什麼

```
EV/EBITDA = 企業價值 / EBITDA
其中:
  企業價值 = 市值 + 總負債 − 現金 + 少數股權
  EBITDA  = 營業利潤 + 折舊 + 攤銷
```

**企業價值(EV)** 是收購整家公司的總成本 —— 買掉所有股權*並*承擔所有債務,手頭現金抵消一部分。**EBITDA** 剔除四件事:利息、稅、折舊、攤銷。剩下的是 capex 和營運資金前的營業現金生成代理。

## 什麼時候用 EV/EBITDA 比 P/E 好

1. **負債水平不同的公司。** 高槓桿公司利息高、淨利低、P/E 機械抬高。EV/EBITDA 切在利息線之上。
2. **近期併購扭曲攤銷。** P/E 反映這個,EBITDA 不反映。
3. **跨境對比。** 不同稅務轄區讓 P/E 雜訊大。

## 什麼時候會誤導

1. **資本密集型業務。** 鋼廠、電信、航空每年 capex 佔收入 5–15%。EBITDA 忽略 capex。要和 FCF 收益率搭配看,見 [什麼是 FCF?](/blog/what-is-fcf)。
2. **資本化軟體開發的科技公司。** SaaS 把內部用軟體資本化,EBITDA 看不到。
3. **激進調整 EBITDA 的公司。** 永遠先讀 10-K 中的 EBITDA 調節表(見 [30 分鐘讀 10-K](/blog/how-to-read-10k))。

## 按產業的讀數區間

| 產業 | 典型 EV/EBITDA |
|---|---|
| **公用事業** | 8–10× |
| **工業/材料** | 10–14× |
| **消費/醫療** | 14–20× |
| **軟體/網路** | 18–30×+ |
| **銀行** | 不用(改用 P/E 或 P/Book) |

跨產業用原始 EV/EBITDA 對比無意義。

## EV/EBITDA vs P/E

| 用 EV/EBITDA 當 | 用 P/E 當 |
|---|---|
| 跨資本結構對比 | 槓桿相似的同業對比 |
| 跨稅務轄區對比 | 同一國家對比 |
| 大額非現金攤銷扭曲淨利 | 損益表乾淨穩定 |
| 併購後跨買方對比 | 成熟無近期交易 |

絕對 vs 相對估值,見 [DCF vs 可比公司分析](/blog/dcf-vs-comparable-company-analysis)。

## PickSkill 怎麼用 EV/EBITDA

打開 [/chat](/chat) 輸入:

> *「在 EV/EBITDA 上對比 AMD、AVGO、INTC、NVDA — TTM 和 NTM — 與各自 5 年均值對照。標出 EV/EBITDA 和 P/E 對『貴不貴』給出相反訊號的名字。」*

PickSkill 從 SEC 申報 + 市場資料拉 EV 各組成部分和 EBITDA,算 EV/EBITDA 和 P/E,並顯式標出兩個倍數給出相反訊號的案例。

與 [DCF vs Comps](/blog/dcf-vs-comparable-company-analysis) 搭配。

## FAQ

**「好」的 EV/EBITDA 是多少?**
沒有通用「好」。9× 對公用事業是公允;9× 對軟體是便宜,除非有問題。

**EV 和市值的區別?**
市值 = 只算股權。EV = 股權 + 負債 − 現金 + 少數股權。

**用前向還是過去 EBITDA?**
NTM 是分析師預設,TTM 更有依據。兩個都用。

**EV/EBITDA 和 EV/EBIT 一樣嗎?**
不一樣 —— EBIT 減去 D&A,EBITDA 不減。資本密集業務用 EV/EBIT 更合理。

**PickSkill 從哪裡取 EBITDA?**
直接從最新 10-K/10-Q 算出,並標出公司應用的調整(SBC 剔除、重組加回等)。
