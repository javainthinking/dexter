---
title: 60 秒讀完任意一份 10-K — PickSkill 實操教程
description: 4 步教程,把任意美股公司最新的 10-K 從 EDGAR 一路走到 MD&A + 財務 + Risk Factors 同比 diff,得到 90 秒級走讀 — 全部有出處、可追問。
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: PickSkill 研究團隊 — 為個人投資者打造 AI 分析師。
pillar: how-to
tags:
  - tutorial
  - 10-k
  - filings
  - workflow
heroImage: /blog/summarise-a-10k-in-60-seconds/hero.png
heroAlt: 對比手動讀 10-K(30 分鐘)和 PickSkill(60 秒)的資訊圖
---

[10-K 閱讀指南](/blog/how-to-read-10k) 告訴你年報中真正重要的四個部分(Item 7、8、1A 和它們指向的附註)。手動是 30 分鐘的功課。本教程用 PickSkill 把同一流程壓到 60 秒。每個論斷都鏈回原始申報頁面。

### 重點摘要

- **4 步,~60 秒。** 打開對話、貼 prompt、看 90 秒走讀、追問。
- **MD&A 用人話說。** 不是公司自己的複述。
- **自動給出三個財務數字**:[FCF](/blog/what-is-fcf)、淨負債、分部同比收入增長。
- **與上一年 10-K 的 Risk Factors diff** —— 高亮新增或實質變化。
- **每個數字、每句話**距離 SEC EDGAR 原文一鍵之內。

## 為什麼這件事值得做

願意親自讀 10-K 的散戶,相對只讀財報新聞稿的人有真正的邊際。但 200 頁的文件是真投入,且關鍵內容散布全卷。本教程拿掉「翻找」階段。

## 4 步工作流

### Step 1 — 打開對話

去 [/chat](/chat),一鍵登入(免費試用)。

### Step 2 — 貼 prompt

```text
總結 NVDA 最新的 10-K。給我:
- MD&A 要點(同比收入驅動、流動性語言)
- FCF、淨負債、按分部的同比收入增長
- 和去年相比的 Risk Factors 變化 — 只看新增或實質變更的
- 我應該追的附註
- 每個論斷鏈回原始頁面
```

### Step 3 — 等 ~30 秒

PickSkill 依序執行:
1. 從 [SEC EDGAR][edgar] 拉最新 10-K 和上一年 10-K。
2. 抽取 Item 7(MD&A),定位「流動性與資本資源」子節。
3. 抽取三張表;算 [FCF](/blog/what-is-fcf)、淨負債、分部同比收入增長。
4. 對 Item 1A 做逐句對齊 diff,只浮出新增或實質改動的段落。
5. 標出最可能含實質新披露的 1–3 個附註。
6. 把結果作為 90 秒串流走讀輸出。

[edgar]: https://www.sec.gov/edgar

### Step 4 — 追問

```text
Risk Factors diff 提到「客戶集中度」 — 把原文拉出來,告訴我是哪個客戶。
```

```text
MD&A 說營業利潤率同比壓縮 — 拆成 COGS、SG&A、R&D。
```

```text
公司未來 3 年的債務到期牆是什麼?
```

PickSkill 保持申報在上下文,每次追問直接從同一份文件裡取。

> **現在就試。** [打開對話](/chat) 貼 Step 2 的 prompt。

## 輸出長什麼樣

| 板塊 | 內容 |
|---|---|
| **MD&A** | 4–6 個要點:同比收入驅動、利潤率變動、流動性評論。 |
| **財務** | 3 個數字:TTM FCF、淨負債、分部同比收入增長。 |
| **Risk Factors diff** | *只* 列新增或實質變更的風險段落。 |
| **附註看護清單** | 1–3 個附註編號 + 每個一句話說明。 |
| **來源連結** | 每一行都有「[source]」連結到 EDGAR 文件的精確頁面。 |

## 60 秒做不到

- **完整的鑑識會計分析。**
- **讀股東會代理書(DEF 14A)。**
- **獨立驗證每個論斷。** 90 秒走讀是起點。

## 為什麼這個教程是 explainer 的搭檔

讀 explainer 一次;每研究一個新名字就用一次教程工作流。

- [什麼是 DCF?](/blog/what-is-dcf) → [60 秒搭一份 DCF](/blog/build-dcf-in-60-seconds)
- [什麼是 WACC?](/blog/what-is-wacc) — 包含在 DCF 教程裡
- [什麼是 FCF?](/blog/what-is-fcf) — 上面財務輸出第 1 項
- [30 分鐘讀 10-K](/blog/how-to-read-10k) → 本教程

## FAQ

**港股、A 股有效嗎?**
有效 — PickSkill 識別 HKEx 代碼從 HKEx 披露易拉年報,A 股從巨潮 Cninfo 拉。

**Risk Factors diff 多準?**
段落級實質準確。表面編輯(重編號、句序調整)被壓制。

**能在 10-Q 季報上跑嗎?**
能 — 同樣的流程,說「總結最新的 10-Q」就行。

**如果申報太長摘要不可靠怎麼辦?**
PickSkill 能處理約 500 頁內的申報。對多元化巨型 10-K,整個流程會變成 2–3 分鐘。

**PickSkill 從哪裡取申報?**
美國從 SEC EDGAR、港股從 HKEx、A 股從巨潮 Cninfo。沒有第三方資料中介。
