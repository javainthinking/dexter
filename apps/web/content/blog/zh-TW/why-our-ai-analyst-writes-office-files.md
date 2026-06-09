---
title: '為什麼我們的 AI 分析師會寫 Word、PowerPoint 與 Excel'
description: >-
  聊天答案無法交付。我們教 PickSkill 生成原生 Word、PPT 與 Excel 檔,讓研究變成一份你能寄出、能演示的交付物。
publishedAt: 2026-06-09
updatedAt: 2026-06-09
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: PickSkill 研究團隊 —— 為散戶打造一位 AI 分析師。
pillar: build-in-public
tags:
  - file-generation
  - office
  - ai-analyst
  - product
  - build-in-public
heroImage: /blog/why-our-ai-analyst-writes-office-files/hero.png
heroAlt: >-
  資訊圖 —— 左邊一個聊天泡泡,經過一個 OfficeCLI 圖層,流向右邊三個原生檔案輸出:一份 .docx 備忘錄、一份
  .pptx 簡報、一份 .xlsx 活頁簿,每個都標註「真實 OpenXML,不是截圖」。
---

**一個聊天答案被讀過一次就散失了;一份 Word 備忘錄、一份 PowerPoint 簡報、一份 Excel 活頁簿則會被轉寄、編輯、演示與歸檔。** 當我們在開源的 [Dexter](https://github.com/virattt/dexter) agent 之上打造 [PickSkill](https://pickskill.ai) 時,底層那個 CLI 唯一沒有、也是我們最早一批使用者呼聲最高的能力,就是*交付物*。於是我們加上了 OfficeCLI:一個把 agent 的分析轉成原生 `.docx`、`.pptx` 與 `.xlsx` 檔的圖層。不是截圖、不是 PDF、不是 Markdown 傾印。這篇文章用 build-in-public 的方式說明:為什麼一位認真的 AI 分析師非得會寫 Office 檔不可,以及我們是怎麼做到的。

### 重點摘要

- **聊天輸出無法交付。** 在金融界被分享、編輯與演示的格式是 Word、PowerPoint 與 Excel —— 不是一段聊天紀錄。
- **PickSkill 透過 OfficeCLI 生成原生 OpenXML 檔案**:真實的 `.docx` 備忘錄、帶內嵌圖表的 `.pptx` 簡報,以及帶即時跨表公式的 `.xlsx` 活頁簿。
- **每個檔案都源自即時資料** —— 指標用最新收盤計算、財務拉自最新申報、估值反映當前共識。
- **檔案以 Cloudflare R2 上 7 天有效的預簽連結交付**,所以沒什麼要安裝,也沒有平台綁定。
- **一個 prompt,三種格式。** 同一份研究能變成備忘錄、簡報或模型 —— 你為受眾挑選交付物。

## 為什麼一個聊天答案不算交付物

生成式 AI 讓研究*答案*變便宜了,卻沒讓研究*產出物*變便宜。在「模型告訴我 NVDA 的自由現金流率是 18%」和「我有一份投資俱樂部週日能讀的四頁備忘錄」之間,有一道鴻溝。那道鴻溝 —— 呈現層 —— 正是多數散戶分析悄悄陣亡的地方,因為等你把想分享的分析做好時,你已經沒耐心去組裝那份讓它變得可分享的簡報或活頁簿了。

格式之所以重要,是因為受眾不同。備忘錄是給那個讀散文、想要論證的人。簡報是給一場現場對話,你會帶著大家走過整套論點。活頁簿是給那位想要排序、樞紐分析、加上自己欄位的協作者。一段聊天紀錄對這三者都沒用 —— 它無法排序、無法演示,讀起來像一份日誌。彌合答案與產出物之間的鴻溝,正是 OfficeCLI 存在的全部理由。

## 「原生 OpenXML」究竟是什麼意思

當我們說 PickSkill 生成真實的 Office 檔,意思是每一個形狀、儲存格、公式與圖表都是貨真價實的 OpenXML 物件 —— 就是 Microsoft Office 所寫出的那種檔案格式。這個區別不只是表面功夫。一張表格的截圖是死的像素;一張真實的 `.xlsx` 表格能排序、能篩選、能餵進樞紐分析。一份投影片的 PDF 沒辦法重新套主題;一份真實的 `.pptx` 簡報能透過「設計→變化」套上你公司的範本,並讓你編輯任何一張投影片標題。

以下是每種格式承載的內容:

| 格式 | PickSkill 寫出什麼 | 你能拿它做什麼 |
|---|---|---|
| **`.docx`** | 帶標題的章節、表格、有出處的論斷、散文敘事 | 在 Word／Google Docs 裡編輯、當備忘錄轉寄、貼進報告 |
| **`.pptx`** | 封面、持倉／論點投影片、內嵌圖表圖片、可編輯標題 | 用 PowerPoint／Keynote 演示、重新套主題、編輯任何投影片 |
| **`.xlsx`** | 多工作表活頁簿、即時跨表公式、條件格式、走勢圖 | 排序、樞紐分析、加欄位、在上面建你自己的模型 |

因為輸出是標準的 OpenXML,它能在 Excel、Google Sheets、LibreOffice、Apple Numbers、Keynote 與 Google Slides 中開啟 —— 不需要 PickSkill 帳號就能打開別人分享給你的檔案。

## OfficeCLI 如何嵌入 agent 循環

PickSkill 繼承了 Dexter 那套規劃—執行—驗證的 agent 循環(完整的緣起故事見[從 Dexter 到 PickSkill](/blog/from-dexter-to-pickskill))。檔案生成嵌在這個循環的最後一個階段:一旦 agent 完成研究、計算與驗證,OfficeCLI 就把結果編譯成一份文件。

以一份投資組合簡報為例,整個流程是這樣跑的:

1. agent 拉取每一檔持倉的當前價與價格歷史。
2. 它跑完八維度指標套件([/indicators](/indicators))並偵測活躍訊號。
3. 它拉取估值倍數與最新的財務摘要。
4. 它把指標圖渲染成高解析度圖片。
5. OfficeCLI 組合出 `.pptx` —— 內嵌圖表、格式化表格、把可編輯標題繫結到分析。
6. 檔案被寫到 Cloudflare R2,並以 7 天有效的預簽下載連結回傳。

關鍵的設計選擇:檔案是*繫結*到分析,而不是從分析裡*貼*過來的。在聊天裡要求一個改動 —— 「用 FCF 敘事帶頭」、「把每檔持倉的投影片壓到各一張」—— agent 就會重跑相關分析並產出一份全新的檔案。文件位於推理的下游,所以它能保持誠實。

> **現在就試。** 在 [/portfolios](/portfolios) 開啟任一投資組合,點擊 *Export to PowerPoint* 或 *Export to Excel* —— 檔案大約一分鐘就準備好。

## 三種格式,三種受眾

我們做全部三種、而不是只挑一種,原因是散戶與半職業分析師會對不同的場子做簡報,而產出物必須對得上場子:

- **Word** 給用散文思考的分析師 —— 一份論點備忘錄、一份 10-K 摘要、一份持倉理由。想了解散文 vs 投影片的取捨,讀我們的[從聊天生成投資人簡報](/blog/generate-investor-deck-from-chat)教學。
- **PowerPoint** 給現場演示 —— 投資俱樂部、面試委員會、操盤家族帳本的夥伴。見[把投資組合匯出成 PowerPoint](/blog/export-portfolio-to-powerpoint)。
- **Excel** 給想*動手玩*數字的協作者 —— 按訊號強度排序、按行業樞紐分析、疊上自己的情境。見[把投資組合報告匯出成 Excel](/blog/export-portfolio-report-to-excel)。

一段研究對話,三種可能的產出物。你在挑選受眾的同時挑選格式 —— 底下的分析是一模一樣的。

## 誠實的告誡

build-in-public 意味著也要標明檔案生成做不到什麼:

- **它是一張快照,不是一條即時連結。** 活頁簿的公式會對它自己的儲存格更新,但不會即時抓取新的市場資料。要刷新就重新匯出 —— 大約 30 秒。
- **自訂企業範本需要手動設定。** 簡報用的是 PickSkill 的設計系統;重度品牌化的範本(自訂字型、Logo 位置)請在匯出後透過你的 Office 主題套用。
- **沒有 VBA／巨集。** 輸出的是資料、公式與圖表。巨集與自訂功能區仍需手動補上。
- **沒有直接的券商同步。** 持倉來自你在 [/portfolios](/portfolios) 維護的投資組合,而不是即時券商資料源。

這些是刻意的邊界,不是 bug —— 檔案是一個乾淨、有出處、供你在其上構建的起點,不是一個你得盲目信任的黑箱。

## FAQ

**一位 AI 分析師到底為什麼需要寫 Office 檔?**
因為研究只有在被分享時才創造價值,而金融界用 Word、PowerPoint 與 Excel 來分享。一個聊天答案無法被演示、排序或歸檔。生成原生 Office 檔,彌合了「模型回答了我的問題」和「我有一份同事或俱樂部真正用得上的交付物」之間的鴻溝。

**這些檔案是真正的 Office 文件,還是只是截圖的匯出?**
是真正的 OpenXML 文件。每一個儲存格、公式、投影片與圖表都是貨真價實的 Office 物件 —— 活頁簿能排序與樞紐分析、簡報能重新套主題與編輯、備忘錄能在 Word 或 Google Docs 中開啟。沒有任何一處是平面截圖或唯讀 PDF。

**我需要安裝 Microsoft Office 才能用嗎?**
不用。這些檔案能在 Excel、Google Sheets、LibreOffice、Apple Numbers、Keynote 與 Google Slides 中開啟。因為 PickSkill 寫的是標準 OpenXML,並在預設匯出中避開供應商專屬的函式,所以檔案在每一款主流的 Office 相容套件裡都能正確渲染。

**下載連結能維持多久?**
每個檔案都以 Cloudflare R2 上 7 天有效的預簽連結交付。檔案本身一旦下載就是永久的 —— 任何時候需要一份帶最新資料的更新版本,就從聊天重新生成。連結的範圍鎖定在你的帳號內。

**一段研究對話能產出不只一種格式嗎?**
能。同一份分析能變成一份 `.docx` 備忘錄、一份 `.pptx` 簡報,或一份 `.xlsx` 活頁簿 —— 你為受眾挑選產出物。底層的研究是一模一樣的,改變的只有交付物,因為檔案是在 agent 推理的下游生成的,而不是貼進一個固定範本裡。
