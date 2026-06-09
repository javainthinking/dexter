---
title: '從 Dexter 到 PickSkill:在開源 agent 上打造產品'
description: >-
  我們如何在開源金融 agent Dexter 上打造 PickSkill —— 加上網頁 app、Word／PowerPoint／Excel
  生成,以及一套 8 維度指標的投資組合工具。
publishedAt: 2026-06-09
updatedAt: 2026-06-09
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: PickSkill 研究團隊 —— 為散戶打造一位 AI 分析師。
pillar: build-in-public
tags:
  - open-source
  - dexter
  - ai-analyst
  - architecture
  - build-in-public
heroImage: /blog/from-dexter-to-pickskill/hero.png
heroAlt: >-
  資訊圖 —— 一張前後對照的架構圖,左邊是開源 CLI agent Dexter,流向右邊的 PickSkill 網頁 app,並新增了
  Office 檔案生成與投資組合指標套件的圖層。
---

**PickSkill 最初是 [Dexter](https://github.com/virattt/dexter) 的一個 fork —— Dexter 是 [@virattt](https://twitter.com/virattt) 打造的開源自主金融 agent,號稱「Claude Code,但為金融研究而生」。** Dexter 給了我們一套久經考驗的 agent 循環:一個用 TypeScript、Ink 與 LangChain 寫成的 CLI 工具,能把一個金融問題拆解成研究計畫、對即時市場資料執行工具、自我檢查,並反覆迭代直到拿出一份有出處的答案。我們拿這個核心向外打造 —— 一個瀏覽器原生的網頁 app、原生的 Word／PowerPoint／Excel 生成、投資組合管理,以及一套八維度的技術指標工具。這篇文章是 build-in-public 式的誠實記錄:我們保留了什麼、加了什麼,以及為什麼。

### 重點摘要

- **PickSkill 建立在 Dexter 之上**,後者是開源金融 agent(MIT 授權,[github.com/virattt/dexter](https://github.com/virattt/dexter))。我們保留了 agent 循環,幾乎把它周邊的一切都重建了。
- **最大的單一改變是介面層。** Dexter 是 CLI;PickSkill 是位於 [pickskill.ai](https://pickskill.ai) 的多語系網頁 app。agent 執行環境是共用的,互動模式則不是。
- **我們加上了原生 Office 生成** —— agent 現在會寫出真正的 `.docx`、`.pptx` 與 `.xlsx` 檔,而不是截圖或 Markdown 傾印。
- **我們加上了投資組合管理與八指標儀表板** —— MACD、均線組合、RSI、KDJ、布林通道、ADX/DMI、成交量與資金流,每一項都附 [5 日訊號軌跡](/blog/5-day-signal-trail)。
- **我們把覆蓋範圍延伸到美股、港股與 A 股市場**,並沿用各市場特有的慣例 —— 包括遮蔽 A 股漲跌停 K 線,讓它們不會觸發假訊號。

## Dexter 是什麼,為什麼從開源出發?

Dexter 是一個用於深度金融研究的開源 AI agent,以 TypeScript、Ink(終端機版的 React)與 LangChain 寫成。它的設計主張很單純:拿一個複雜的金融問題,轉成一份逐步的研究計畫,用對的工具對即時資料執行每一步,自我驗證,並持續修正直到答案既有信心又有出處。它在終端機裡運作,把每一次工具呼叫記錄到一份草稿區,並把模型與供應商的選擇保存在本機設定中。整個 repository 採 MIT 授權,公開在 [GitHub](https://github.com/virattt/dexter) 上。

從 Dexter 出發、而不是從零開始,是一個刻意的 GTM 決策。一個分析師 agent 最難的部分不是聊天框 —— 而是那個會規劃、呼叫工具、並在不杜撰數字的前提下協調即時金融資料的循環。Dexter 早已在開源世界裡把這個循環解決了。建立在它之上,意味著我們最初幾個月能把心力花在*產品介面*上 —— 網頁 app、檔案輸出、投資組合層 —— 而不必重新推導一個強大開源專案早已驗證過的 agent 配管。

## 我們在 Dexter 上加了什麼

下表整理了這份繼承關係。左欄是 Dexter 的貢獻;右欄是 PickSkill 為了讓它成為一款消費級產品而加上的東西。

| 圖層 | 來自 Dexter(開源) | PickSkill 新增 |
|---|---|---|
| **Agent 循環** | 任務規劃、工具執行、自我反思、草稿區記錄 | 多租戶 session 狀態、額度與計費、跨 session 記憶 |
| **介面** | 互動式 CLI(Ink／終端機版 React) | 瀏覽器網頁 app、8 種語系、行動版版面、可分享連結 |
| **資料** | 即時財務 + 市場資料 | 美股 + 港股 + A 股覆蓋、漲跌停 K 線遮蔽、資金流代理指標 |
| **輸出** | 終端機文字 + 草稿區 JSONL | 透過 OfficeCLI 在預簽連結上產出原生 `.docx`／`.pptx`／`.xlsx` |
| **分析** | 按需的金融推理 | [/portfolios](/portfolios) 管理 + 含 8 維度的 [/indicators](/indicators) 儀表板 |

那張表裡的模式就是整套策略:保留已驗證的核心,把散戶會碰到的每一處都產品化。

## 網頁版如何改變了架構

從 CLI 搬到網頁 app,不是換一張 UI 皮 —— 它改變了執行緒模型。一個 CLI agent 獨佔終端機:一位使用者、一個 session、阻塞式輸出、本機檔案。一個網頁 agent 則同時服務眾多使用者、把部分輸出串流到瀏覽器、在伺服器端保存 session 歷史,並把產出寫進物件儲存而不是本機磁碟。

所以雖然*agent 循環*是從 Dexter 繼承來的,周邊的執行環境卻是全新的。Session 是多租戶且可恢復的 —— 你可以關掉分頁,稍後再接回同一段研究對話。工具輸出隨發生隨串流到瀏覽器,就跟 Dexter 串流到終端機的方式一樣。而生成的檔案會落在 Cloudflare R2 上,以 7 天有效的預簽下載連結形式提供,而不是放在本機目錄裡,因為網頁使用者根本沒有 shell 可以 `cat` 出一個檔案。誠實的講法是:Dexter 給了我們大腦;網頁 app 是為了把它帶給非技術使用者而打造的全新身體。

> **看它跑起來。** 開啟 [/chat](/chat),問任何金融問題 —— 你正在對話的這套 agent 循環就是 Dexter 的,為瀏覽器而產品化。

## 為什麼 Office 檔案生成很重要

Dexter 的 CLI 沒有、而呼聲最高的單一能力,就是*交付物*。一個終端機裡的答案,對跑這條查詢的人來說很棒;但對那位需要能打得開的東西的同事、投資俱樂部或面試委員會來說,毫無用處。散戶與半職業分析師活在 Word、PowerPoint 與 Excel 裡 —— 這三種格式是金融界通用的交換層。

於是我們加上了 OfficeCLI:agent 現在會把它的分析編譯成原生 OpenXML 檔案。不是截圖、不是 PDF、不是 Markdown —— 而是帶標題與表格的真實 `.docx` 備忘錄、帶內嵌圖表與可編輯投影片標題的真實 `.pptx` 簡報,以及帶即時跨表公式與條件格式的真實 `.xlsx` 活頁簿。每個檔案都以 7 天有效的預簽連結交付。我們為最常見的流程寫了三篇逐步教學:[把投資組合匯出成 PowerPoint](/blog/export-portfolio-to-powerpoint)、[把報告匯出成 Excel](/blog/export-portfolio-report-to-excel),以及[從一段聊天生成投資人簡報](/blog/generate-investor-deck-from-chat)。

## 投資組合管理與八指標套件

Dexter 一次回答一個問題。PickSkill 加上了*常駐*分析:一個你在 [/portfolios](/portfolios) 維護的投資組合,以及一個在 [/indicators](/indicators) 的指標儀表板,持續橫跨每一檔持倉運作。這個儀表板會在最新收盤上計算八個技術維度:

1. **MACD** —— 動能與交叉狀態([什麼是 MACD](/blog/what-is-macd))
2. **均線** —— MA5／MA20／MA60 組合與[黃金交叉／死亡交叉](/blog/what-is-golden-cross-death-cross)
3. **RSI(14)** —— 超買／超賣([什麼是 RSI](/blog/what-is-rsi))
4. **KDJ(9,3,3)** —— 隨機動能,A 股常用([什麼是 KDJ](/blog/what-is-kdj))
5. **布林通道(20,2)** —— 波動率通道([什麼是布林通道](/blog/what-is-bollinger-bands))
6. **ADX/DMI(14)** —— 趨勢強度([什麼是 ADX](/blog/what-is-adx))
7. **量價關係**([成交量分析](/blog/what-is-volume-analysis))
8. **資金流代理指標**([什麼是資金流](/blog/what-is-capital-flow))

每個維度都附一條 [5 日訊號軌跡](/blog/5-day-signal-trail) —— 五個圓點顯示 bucket 判讀在整個交易週裡如何演變,讓你讀到的是趨勢走向,而不只是今天的一張快照。而且因為我們覆蓋 A 股,儀表板會偵測漲停／跌停／停牌 K 線(最高價等於最低價的情況)並把它們遮蔽為中性,讓一根退化的 K 線永遠不會產出假的多頭或空頭訊號。

## 我們從 Dexter 保留了什麼 —— 又改了什麼

我們保留了定義 Dexter 的那套哲學:有出處的輸出,否則就當沒發生;可編輯的假設,勝過黑箱式的答案;以及一個會自我驗證的 agent 循環。這些原則直接對應到我們的 GTM 承諾 —— *PickSkill 是那位用白話研究、建模並草擬股票工作的 AI 分析師。*

我們改的是非技術使用者會碰到的一切。供應商層被通用化了 —— Dexter 支援多家模型供應商,而 PickSkill 預設搭載 OpenAI 的 gpt-5.5 系列,同時透過同一套 agent 介面支援 Anthropic、Google Gemini、xAI 與本機 Ollama。我們加上了計費、記憶、多語系 UI 與交付物層。想看 AI 在股票研究中今天究竟在哪裡帶來真槓桿的全貌,請見 [2026 年的 AI 選股研究](/blog/ai-for-stock-research-2026)。

## 接下來在做什麼

幾項列在公開路線圖上的項目,同樣秉持 build-in-public 的精神:

- **排程重新匯出** —— 按固定節奏自動刷新一份投資組合活頁簿或簡報並送到你手上,而不必手動重跑 prompt。
- **財報電話會議轉錄抽取** —— 抽取 Q&A 環節,前瞻性訊號就藏在那裡,而不只是準備好的開場談話。
- **更多市場** —— 接下來是東京與印度,每一個都是 2–3 個月的整合,才能把申報抽取器與指標慣例做對。

如果你有想看到被解決的工作流缺口,[告訴我們](/feedback) —— 這份路線圖會回應使用者真正的需求。

## FAQ

**PickSkill 跟 Dexter 是同一個東西嗎?**
不是。PickSkill 建立在 Dexter 的開源 agent 循環之上,但是一款獨立的產品。Dexter 是給開發者用的 CLI 研究工具;PickSkill 是一款託管的網頁 app,帶帳號、計費、投資組合管理、Office 檔案生成與多市場覆蓋。我們保留了 Dexter 的 agent 核心與它「有出處的輸出」哲學,然後圍繞它打造了一款消費級產品。

**Dexter 是開源的嗎,我能直接用嗎?**
可以。Dexter 採 MIT 授權,公開在 [github.com/virattt/dexter](https://github.com/virattt/dexter)。你今天就能 clone 它、在終端機裡跑、拿來做金融研究。PickSkill 是為那些想要同樣 agent 威力、卻不想跑 CLI 的人而存在 —— 在瀏覽器裡,帶交付物與投資組合層。

**PickSkill 究竟在 Dexter 上加了什麼?**
四個主要圖層:一個多語系網頁 app 介面、透過 OfficeCLI 的原生 Word／PowerPoint／Excel 生成、帶八指標儀表板與 5 日訊號軌跡的投資組合管理,以及帶漲跌停 K 線遮蔽的美股／港股／A 股市場覆蓋。底層那套規劃—執行—驗證的 agent 循環則是從 Dexter 繼承來的。

**PickSkill 用哪些 AI 模型?**
預設是 OpenAI 的 gpt-5.5 系列。PickSkill 也透過同一套 agent 介面支援 Anthropic、Google Gemini、xAI 與本機 Ollama 模型,繼承了 Dexter 的多供應商設計。模型的選擇不會改變工作流 —— 有出處的輸出與可編輯的假設在各家供應商之間都成立。

**為什麼要建立在既有開源專案上,而不從零開始?**
一個分析師 agent 最難的部分,是那個會規劃、呼叫工具、並在不杜撰的前提下協調即時資料的循環 —— Dexter 早已在開源世界裡證明了這一點。建立在它之上,讓我們能把早期幾個月花在真實使用者會碰到的產品介面上(網頁 app、Office 檔案、投資組合儀表板),而不是重新推導 agent 配管。
