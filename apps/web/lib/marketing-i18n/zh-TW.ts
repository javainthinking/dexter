import type { FeaturesContent } from '../features';
import type { PricingContent } from '../pricing';

export const features: FeaturesContent = {
  index: {
    metaTitle: '功能 — PickSkill',
    metaDescription:
      'PickSkill 能做什麼:一位負責研究與估值的 AI 分析師、一個八維度的投資組合指標儀表板,以及投資人等級的 PowerPoint / Word / Excel 文件生成。',
    eyebrow: '功能',
    headline: '一位 AI 分析師、一個訊號儀表板,加上一座文件工廠。',
    sub: 'PickSkill 替你研究、建模、撰寫個股工作 —— 再把分析結果變成一份簡報、一份報告,或一個可分享的即時投資組合。以下說明每個部分各自負責什麼。',
    tryFree: '免費試用',
    explore: '了解 {name}',
  },
  sections: {
    whatItDoes: '功能介紹',
    howItWorks: '運作方式',
    faqHeading: '常見問題',
    ctaSubtitle: '免費試用 —— 每月 30 次對話,無需信用卡。',
    moreFeatures: '更多功能',
  },
  items: {
    'portfolio-indicators': {
      eyebrow: '分析',
      name: '投資組合指標',
      tagline: '對每一檔持股提供八種技術面視角 —— 並附上 5 日訊號軌跡,過濾單根 K 棒的雜訊。',
      description:
        '橫跨美股、港股與 A股 持股,以 8 個技術面維度追蹤 —— MACD、RSI、KDJ、布林通道、ADX、均線、成交量、資金流 —— 每一項都附帶 5 日訊號軌跡。',
      headline: '每一檔持股,八個面向 —— 一眼看盡。',
      imageAlt:
        'PickSkill 指標儀表板的產品示意圖 —— 一格格的持股,每檔都有 MACD/RSI/KDJ/資金流的訊號分類與 5 日軌跡。',
      ctaLabel: '開啟分析師',
      capabilities: [
        { title: '八個指標維度', body: 'MACD、移動平均線(20/60/200)、RSI、KDJ、布林通道、ADX、成交量與資金流 —— 以每檔持股的最新收盤價計算,並在上層加上背離與支撐/壓力掃描。' },
        { title: '5 日訊號軌跡', body: '每個維度都附上 5 日的分類軌跡,讓你看出一個看多訊號究竟是穩定、翻轉,還是閃爍不定 —— 而不是讓一根帶雜訊的 K 棒假裝成訊號。' },
        { title: '為美股、港股與 A股 打造', body: '漲停 / 跌停 / 停牌的 K 棒會被偵測並遮蔽為中性,因此一連串 ±10% 的漲跌停日永遠不會偽造出強趨勢分類。同一套算法,因市場而異。' },
        { title: '跨指標一眼掌握', body: '將游標移到任一持股,即可同時對齊每個維度。把有紀律的多訊號判讀 —— 趨勢過濾 + 動量觸發 + 參與度 —— 收進一次掃視,而不是八個分頁。' },
        { title: '匯出到對話,再做成簡報', body: '把儀表板畫面送進對話,一鍵變成 PowerPoint、Word 或 Excel —— 讓指標判讀成為可分享的成品。' },
      ],
      howItWorks: [
        { step: '加入你的持股', detail: '建立一個由美股、港股或 A股代碼組成的投資組合,以代碼加入。' },
        { step: '判讀訊號與軌跡', detail: '開啟指標儀表板。每檔持股都顯示全部 8 個維度,外加 5 日的分類軌跡。' },
        { step: '用多訊號視圖過濾', detail: '以 ADX 作為盤勢過濾器,MACD/RSI/KDJ 作為觸發訊號,成交量 + 資金流作為確認。' },
        { step: '匯出成簡報', detail: '把這份解讀做成 PowerPoint、Word 或 Excel,用於第二意見或交給客戶。' },
      ],
      faq: [
        { q: '包含哪些指標?', a: '所有方案皆含全部八個維度:MACD、移動平均線(20/60/200)、RSI(14)、KDJ(9,3,3)、布林通道(20,2)、ADX/DMI(14)、量價關係,以及資金流代理指標 —— 外加背離與支撐/壓力掃描。我們新增的任何維度都會免費提供給所有人。' },
        { q: '什麼是 5 日訊號軌跡?', a: '針對每個指標,分類判讀(看多 / 中性 / 看空)會以最近 5 個交易日重新計算,並以軌跡呈現。一個維持 5 天的訊號,跟一個每天翻轉的訊號截然不同 —— 軌跡讓這點清楚可見,並過濾單根 K 棒的雜訊。' },
        { q: '它適用於中國 A股 嗎?', a: '可以。儀表板會偵測 A股 的漲停 / 跌停 / 停牌 K 棒(最高 == 最低)並遮蔽為中性,因此退化的 K 棒永遠不會產生假陽性分類。依照當地慣例,KDJ 會作為 A股 個股的主要振盪指標呈現。' },
      ],
    },
    'research-documents': {
      eyebrow: '輸出',
      name: '研究文件',
      tagline: '投資人等級的 PowerPoint、Word 與 Excel —— 由一個提示生成、取材自即時數據、下載後即可編輯。',
      description:
        '從單一提示生成原生的 .pptx 簡報、.docx 報告與 .xlsx 模型 —— 每張圖表都取材自即時財報與市場數據,每個檔案皆可編輯。',
      headline: '從一個提示,到一份可直接上台的簡報。',
      imageAlt:
        '產品示意圖,展示生成的 PowerPoint 簡報、Word 報告與 Excel 模型攤開排列 —— PickSkill 研究文件的輸出堆疊。',
      ctaLabel: '生成文件',
      capabilities: [
        { title: 'PowerPoint、Word 與 Excel', body: '原生的 .pptx / .docx / .xlsx —— 不是截圖,也不是 PDF。可在 PowerPoint、Keynote、Word、Google Docs、Excel 或 Sheets 中開啟,並編輯每一張投影片、每一段文字、每一個儲存格。' },
        { title: '取材自即時數據', body: '圖表與表格由最新的 SEC 財報、市場行情與計算出的指標建構 —— 而非模型的記憶。每個數字都可追溯到來源。' },
        { title: '投資人簡報慣例', body: '簡報遵循分析師實際上台的結構:第 2 頁放論點、估值明確列出、風險預先沙盤推演。Excel 活頁簿以多工作表交付,並含真正的跨表公式。' },
        { title: '靠重新下提示來編輯', body: '推一個利潤率假設、重排投影片順序、加入一種情境 —— 在對話中提出要求,檔案就會重新生成。沒有範本地獄,也不必手動重新排版。' },
        { title: '八種語言', body: '用英文、簡體 / 繁體中文、日文、韓文、德文、法文或西班牙文生成同一份簡報或報告 —— 配合你要上台面對的對象。' },
        { title: '以下載連結交付', body: '檔案託管於 Cloudflare R2,在對話中以 7 天有效的下載連結交付 —— 直接分享,或拉進你自己的簡報。' },
      ],
      howItWorks: [
        { step: '在對話中做研究', detail: '建一個 DCF、讀一份 10-K、比較同業 —— 對話本身就成了素材來源。' },
        { step: '要求生成文件', detail: '「把這個做成 12 頁的投資人簡報」或「在 Excel 裡建一個 5 年期 DCF」。一句話即可。' },
        { step: '下載檔案', detail: '一個真正的 .pptx / .docx / .xlsx,約 30–60 秒內完成,附 7 天連結。' },
        { step: '編輯或重新生成', detail: '直接開啟編輯,或在對話中重新下提示來變更假設,取得一份全新檔案。' },
      ],
      faq: [
        { q: '這些檔案是真正的 Office 文件嗎?', a: '是的 —— 透過 OfficeCLI 生成的原生 .pptx、.docx 與 .xlsx,不是截圖也不是 PDF。它們可在 PowerPoint、Keynote、Word、Excel、Google Workspace 與 LibreOffice 中開啟並編輯。每個圖形、表格與公式都是真正的 Office 物件。' },
        { q: '數據從哪裡來?', a: '生成當下的即時來源:SEC EDGAR 財報(港股 / A股 則為 HKEx / Cninfo)、市場數據行情,以及以最新收盤價計算的指標。模型是從有來源的素材組合而成,而非取自訓練資料,這就是為什麼數字既即時又可追溯。' },
        { q: '我可以生成幾個檔案?', a: '視方案而定:Free 每月 2 個、Starter 8 個、Pro 30 個、Power 100+ 個。各方案的生成品質一致。下載連結保留 7 天。' },
      ],
    },
    'ai-analyst': {
      eyebrow: '研究',
      name: 'AI 分析師',
      tagline: '任何你會問初級分析師的問題都能問 —— 取得有來源的答案、即時模型,以及跨工作階段守住你論點的記憶。',
      description:
        '一位研究 SEC 財報與市場數據、建立 DCF 模型、閱讀 10-K,並跨工作階段記住你論點的 AI 分析師 —— 用白話即可溝通。',
      headline: '這位分析師會替你做研究、建模與撰寫。',
      imageAlt:
        'PickSkill 對話的產品示意圖 —— 一個研究問題、一個附引用與圖表的有來源答案,以及一枚守住論點的記憶晶片。',
      ctaLabel: '詢問分析師',
      capabilities: [
        { title: '隨需估值', body: '完整的現金流折現模型,附敏感度表、可比公司分析與反推 DCF —— 輸入有來源、假設可編輯,數秒內完成。' },
        { title: '替你讀財報', body: '60 秒摘要一份 10-K、逐年比對風險因子、點出 MD&A 訊號與值得追查的附註 —— 每個論述都連結到 EDGAR 上的對應頁面。' },
        { title: '多來源研究', body: '在一輪內同時拉取網路、財報與市場數據,然後附引用回答 —— 而不是一個自信的猜測。對於能否查證,它都誠實以告。' },
        { title: '長期記憶', body: '跨工作階段記住你的論點、你關注的標的與偏好,讓你從上次中斷處接續,而不必每次都重新解釋來龍去脈。' },
        { title: '美股、港股與 A股 覆蓋', body: '辨識 NYSE/NASDAQ、HKEx 與 SSE/SZSE 代碼,並依各市場拉取正確的財報集與市場慣例。' },
      ],
      howItWorks: [
        { step: '用白話提問', detail: '「替 TSMC 建一個 5 年期 DCF」、「NVDA 的風險因子有什麼變化」、「比較 AMD 與 Intel 的 FCF」。' },
        { step: '它去研究', detail: '拉取財報、市場數據與網路 —— 跑模型或做比較 —— 並展示其推導過程。' },
        { step: '取得有來源的答案', detail: '一個經研究的回應,附引用、圖表與可下載成品 —— 不是黑箱式的猜測。' },
        { step: '它會記住', detail: '你的論點與來龍去脈會跨工作階段保留,因此下一個問題能接續上一個。' },
      ],
      faq: [
        { q: '這跟問 ChatGPT 有什麼不同?', a: 'PickSkill 把每個答案都奠基於即時數據 —— 它會拉取真正的 10-K、計算 DCF、跑指標,並在查詢當下引用來源。一般的聊天機器人靠訓練資料作答,並經常捏造財務數字。這份奠基就是差別所在,在估值與財報工作上尤其明顯。' },
        { q: '「記憶」實際上記住什麼?', a: '你的投資論點、你關注的標的、偏好,以及先前的對話脈絡 —— 跨工作階段保留,並限定於你的帳號範圍內。你可以檢視並編輯記憶項目,且所有方案皆無上限。' },
        { q: '覆蓋哪些市場?', a: '美股(NYSE / NASDAQ)、香港(HKEx)與中國 A股(SSE / SZSE)。分析師會拉取各市場合適的財報 —— 美股的 10-K/10-Q、港股的中期/年度報告,以及 A股 的扣非淨利項目。' },
      ],
    },
  },
};

export const pricing: PricingContent = {
  metaTitle: '定價 — PickSkill',
  metaDescription:
    'PickSkill 方案:Free、Starter $15/月、Pro $39/月、Power $129/月。年繳省 20%。隨時可取消。',
  heroEyebrow: '方案與定價',
  heroHeadline: '一位 AI 分析師,只要幾杯咖啡的價格。',
  heroSub:
    '用白話研究、建模並撰寫個股工作。年繳方案省 20%。隨時可取消。',
  perMonth: '/月',
  mostPopular: '最受歡迎',
  everyPlanNote:
    '全部 8 個指標維度與無上限的長期記憶,所有方案皆含。',
  comparisonHeading: '方案比較',
  billing: {
    monthly: '月繳',
    annual: '年繳',
    save: '省 20%',
    billedAnnually: '按年計費',
  },
  faqHeading: '常見問題',
  plans: {
    free: {
      blurb: '試用 AI 分析師。',
      annualNote: '無需信用卡',
      cta: '免費試用',
      features: [
        '每月 30 次對話',
        '每月 5 次深度研究輪次',
        '1 個投資組合 · 10 檔持股',
        '每月生成 2 個檔案(PPT / Word / Excel)',
        '全部 8 個指標維度',
        '無上限長期記憶',
      ],
    },
    starter: {
      blurb: '為活躍的散戶而設。',
      annualNote: '年繳每月 $12($144/年)',
      cta: '從 Starter 開始',
      features: [
        'Free 的全部功能,外加:',
        '每月 200 次對話',
        '每月 50 次深度研究輪次',
        '3 個投資組合 · 每個 25 檔持股',
        '每月生成 8 個檔案(PPT / Word / Excel)',
        '電子郵件支援',
      ],
    },
    pro: {
      blurb: '日常分析師工作的最佳選擇。',
      annualNote: '年繳每月 $32($384/年)',
      cta: '升級 Pro',
      features: [
        'Starter 的全部功能,外加:',
        '每月 1,000 次對話',
        '每月 300 次深度研究輪次',
        '10 個投資組合 · 每個 50 檔持股',
        '每月生成 30 個檔案(PPT / Word / Excel)',
      ],
    },
    power: {
      blurb: '為進階使用者與專業人士而設。',
      annualNote: '年繳每月 $104($1,248/年)',
      cta: '升級 Power',
      features: [
        'Pro 的全部功能,外加:',
        '無上限對話與研究',
        '無上限投資組合 · 100 檔持股',
        '每月生成 100+ 個檔案(PPT / Word / Excel)',
        '優先電子郵件支援',
      ],
    },
  },
  comparison: [
    {
      title: 'AI 助手',
      rows: [
        { label: '每月對話', values: ['30', '200', '1,000', '無上限'] },
        { label: '每月深度研究輪次', values: ['5', '50', '300', '無上限'] },
        { label: '專業工作流(DCF、X 研究)', values: [true, true, true, true] },
        { label: '長期記憶', values: ['無上限', '無上限', '無上限', '無上限'] },
      ],
    },
    {
      title: '文件',
      rows: [
        { label: '每月檔案(PPT · Word · Excel)', values: ['2', '8', '30', '100+'] },
        { label: '下載連結保留', values: ['7 天', '7 天', '7 天', '7 天'] },
      ],
    },
    {
      title: '投資組合',
      rows: [
        { label: '投資組合數', values: ['1', '3', '10', '無上限'] },
        { label: '每個組合持股', values: ['10', '25', '50', '100'] },
        { label: '報價更新', values: ['隨需', '隨需', '隨需', '隨需'] },
      ],
    },
    {
      title: '指標儀表板',
      rows: [
        { label: 'MACD(趨勢)', values: [true, true, true, true] },
        { label: '均線 — MA', values: [true, true, true, true] },
        { label: 'RSI(動量)', values: [true, true, true, true] },
        { label: 'KDJ(隨機指標)', values: [true, true, true, true] },
        { label: '布林通道 — BOLL', values: [true, true, true, true] },
        { label: 'ADX(趨勢強度)', values: [true, true, true, true] },
        { label: '成交量', values: [true, true, true, true] },
        { label: '資金流(估算)', values: [true, true, true, true] },
        { label: '儀表板匯出(PPT / Word / Excel)', values: [true, true, true, true] },
      ],
    },
    {
      title: '市場與語言',
      rows: [
        { label: '市場覆蓋(美股 · 港股 · A股)', values: [true, true, true, true] },
        { label: '輸出語言', values: ['8', '8', '8', '8'] },
      ],
    },
    {
      title: '支援',
      rows: [
        { label: '支援', values: ['社群', '郵件', '郵件', '優先郵件'] },
        { label: '隨時取消', values: [true, true, true, true] },
      ],
    },
  ],
  faq: [
    { q: '一次「對話」如何計算?', a: '與 AI 針對某個主題的一段來回對話串 —— 包含該對話串內的後續追問與工具呼叫。我們把整段對話串算作一次對話,計入你的每月額度。' },
    { q: '檔案生成如何運作?', a: '請 AI 製作一個 PowerPoint、Word 或 Excel 檔案。我們會生成它、託管於 Cloudflare R2,並在對話中給你一個 7 天有效的下載連結。每個檔案不論長度都算作每月額度中的一個。' },
    { q: '我可以在月繳與年繳之間切換嗎?', a: '可以,隨時都行。月繳 → 年繳會按比例收取年費並調整你的續訂日期。年繳 → 月繳則於下次續訂時生效。' },
    { q: '升級或降級後,我的資料會保留嗎?', a: '會。投資組合、持股、記憶項目與對話記錄都會隨你的帳號移轉。若你降級後超出限制,較舊的資料會變成唯讀,直到你移除部分資料或升級為止 —— 不會刪除任何東西。' },
    { q: '你們接受哪些付款方式?', a: '透過 Stripe 的主要信用卡。支援地區的本地付款方式(Alipay、WeChat Pay)已在規劃中。' },
  ],
};
