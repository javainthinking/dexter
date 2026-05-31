import type { FeaturesContent } from '../features';
import type { PricingContent } from '../pricing';

export const features: FeaturesContent = {
  index: {
    metaTitle: '功能 — PickSkill',
    metaDescription:
      'PickSkill 能做什么:一位负责研究与估值的 AI 分析师,一块 8 维度的持仓指标面板,以及投研级别的 PowerPoint / Word / Excel 生成。',
    eyebrow: '功能',
    headline: '一位 AI 分析师、一块信号面板,以及一座文档工厂。',
    sub: 'PickSkill 帮你研究、建模、起草股票投研工作 —— 再把这份判断变成一套幻灯片、一份报告,或一个可分享的实时持仓视图。下面是每个部分的功能。',
    tryFree: '免费试用',
    explore: '了解 {name}',
  },
  sections: {
    whatItDoes: '它能做什么',
    howItWorks: '它如何运作',
    faqHeading: '常见问题',
    ctaSubtitle: '免费试用 —— 每月 30 次对话,无需绑卡。',
    moreFeatures: '更多功能',
  },
  items: {
    'portfolio-indicators': {
      eyebrow: '分析',
      name: '持仓指标',
      tagline: '用八个技术维度审视每一只持仓 —— 还有一条 5 天信号轨迹,过滤掉单根 K 线的噪声。',
      description:
        '在 8 个技术维度上跟踪你的美股、港股和 A股持仓 —— MACD、RSI、KDJ、布林带、ADX、均线、成交量、资金流 —— 每个维度都配一条 5 天信号轨迹。',
      headline: '每一只持仓,八个视角 —— 一眼看尽。',
      imageAlt:
        'PickSkill 指标面板的产品示意图 —— 一格格持仓,每一格都带有 MACD/RSI/KDJ/资金流的信号分档和一条 5 天轨迹。',
      ctaLabel: '打开分析师',
      capabilities: [
        { title: '八个指标维度', body: 'MACD、均线(20/60/200)、RSI、KDJ、布林带、ADX、成交量、资金流 —— 基于每只持仓的最新收盘价计算,并在此之上叠加背离与支撑阻力扫描。' },
        { title: '5 天信号轨迹', body: '每个维度都附带一条 5 天分档轨迹,让你看清一个看多判断是稳定、正在翻转,还是只是闪烁 —— 而不是把单根噪声 K 线伪装成信号。' },
        { title: '为美股、港股和 A股而建', body: '涨停 / 跌停 / 停牌的 K 线会被识别并屏蔽为中性,因此连续的 ±10% 涨跌停日永远不会伪造出一个强趋势分档。同一套算法,懂市场规则。' },
        { title: '跨指标一目了然', body: '悬停任意持仓,即可同时对齐每个维度。把严谨的多信号判断 —— 趋势过滤 + 动量触发 + 参与度 —— 浓缩进一次扫视,而不用切八个标签页。' },
        { title: '导出到对话,再变成幻灯片', body: '把面板视图发进一个对话,一键变成 PowerPoint、Word 或 Excel —— 指标判断成为可分享的成果。' },
      ],
      howItWorks: [
        { step: '添加你的持仓', detail: '建立一个由美股、港股或 A股代码组成的投资组合,按代码添加。' },
        { step: '阅读信号 + 轨迹', detail: '打开指标面板。每只持仓都展示全部 8 个维度以及 5 天分档轨迹。' },
        { step: '用多信号视图过滤', detail: '用 ADX 作为趋势状态过滤器,MACD/RSI/KDJ 作为触发器,成交量 + 资金流作为确认。' },
        { step: '导出为幻灯片', detail: '把这份解读做成 PowerPoint、Word 或 Excel,用于二次意见或交给客户。' },
      ],
      faq: [
        { q: '包含哪些指标?', a: '所有套餐都含全部八个维度:MACD、均线(20/60/200)、RSI(14)、KDJ(9,3,3)、布林带(20,2)、ADX/DMI(14)、量价关系,以及一个资金流代理指标 —— 外加背离与支撑阻力扫描。我们新增的任何维度都对所有人开放。' },
        { q: '什么是 5 天信号轨迹?', a: '对每个指标,分档判断(看多 / 中性 / 看空)会针对最近 5 个交易日重新计算并以轨迹呈现。一个连续保持 5 天的信号,与一个每天翻转的信号有天壤之别 —— 轨迹把这一点变得可见,并过滤掉单根 K 线的噪声。' },
        { q: '它支持中国 A股吗?', a: '支持。面板会识别 A股的涨停 / 跌停 / 停牌 K 线(最高价 == 最低价)并将其屏蔽为中性,因此这类退化 K 线永远不会产生假阳性的分档。按本地惯例,KDJ 在 A股标的上作为主振荡器呈现。' },
      ],
    },
    'research-documents': {
      eyebrow: '产出',
      name: '研究文档',
      tagline: '投研级别的 PowerPoint、Word 和 Excel —— 由一句提示生成,取材于实时数据,下载后可编辑。',
      description:
        '由一句提示生成原生的 .pptx 幻灯片、.docx 报告和 .xlsx 模型 —— 每张图表都取材于实时财报和市场数据,每个文件都可编辑。',
      headline: '从一句提示,到一套可直接演示的幻灯片。',
      imageAlt:
        '产品示意图:一套生成的 PowerPoint 幻灯片、一份 Word 报告和一个 Excel 模型铺开摆放 —— PickSkill 的研究文档产出组合。',
      ctaLabel: '生成一份文档',
      capabilities: [
        { title: 'PowerPoint、Word 和 Excel', body: '原生的 .pptx / .docx / .xlsx —— 不是截图,不是 PDF。可在 PowerPoint、Keynote、Word、Google Docs、Excel 或 Sheets 中打开,并编辑每一张幻灯片、每一段文字、每一个单元格。' },
        { title: '取材于实时数据', body: '图表和表格基于最新的 SEC 财报、市场数据源和计算出的指标构建 —— 而非模型的记忆。每个数字都可追溯到来源。' },
        { title: '投研幻灯片惯例', body: '幻灯片遵循分析师真正演示时的结构:第 2 页摆出论点,估值写明白,风险做事前剖析。Excel 工作簿以多工作表交付,带有真实的跨表公式。' },
        { title: '通过重新提示来编辑', body: '调一个利润率假设、重排幻灯片顺序、加一个情景 —— 在对话里说一句,文件就重新生成。没有模板地狱,无需手动重新排版。' },
        { title: '八种语言', body: '用英语、简体 / 繁体中文、日语、韩语、德语、法语或西班牙语生成同一套幻灯片或报告 —— 面向你要演示的受众。' },
        { title: '以下载链接交付', body: '文件托管在 Cloudflare R2 上,以一个 7 天有效的下载链接在对话中交付 —— 直接分享,或拉进你自己的幻灯片里。' },
      ],
      howItWorks: [
        { step: '在对话里做研究', detail: '搭一个 DCF、读一份 10-K、对比同行 —— 这段对话就成了原始素材。' },
        { step: '要一份文档', detail: '"把这个变成一套 12 页的投资者幻灯片",或"在 Excel 里建一个 5 年期 DCF"。一句话就行。' },
        { step: '下载文件', detail: '一个真正的 .pptx / .docx / .xlsx,约 30–60 秒就绪,附带 7 天链接。' },
        { step: '编辑或重新生成', detail: '直接打开编辑,或在对话里重新提示以更改假设,获得一个全新文件。' },
      ],
      faq: [
        { q: '这些文件是真正的 Office 文档吗?', a: '是的 —— 通过 OfficeCLI 生成的原生 .pptx、.docx 和 .xlsx,而非截图或 PDF。它们能在 PowerPoint、Keynote、Word、Excel、Google Workspace 和 LibreOffice 中打开并编辑。每个形状、表格和公式都是真正的 Office 对象。' },
        { q: '数据来自哪里?', a: '生成时的实时来源:SEC EDGAR 财报(港股 / A股则取 HKEx / Cninfo)、市场数据源,以及基于最新收盘价计算的指标。模型是从有来源的基本数据中组合,而非依赖训练数据,这正是数字既最新又可追溯的原因。' },
        { q: '我能生成多少个文件?', a: '取决于套餐:Free 每月 2 个,Starter 8 个,Pro 30 个,Power 100+ 个。各套餐的生成质量一致。下载链接保留 7 天。' },
      ],
    },
    'ai-analyst': {
      eyebrow: '研究',
      name: 'AI 分析师',
      tagline: '凡是你会问初级分析师的,都可以问它 —— 得到有来源的回答、实时模型,以及跨会话守住你投资逻辑的记忆。',
      description:
        '一位 AI 分析师,会研究 SEC 财报和市场数据、搭建 DCF 模型、阅读 10-K,并跨会话记住你的投资逻辑 —— 全程用大白话。',
      headline: '这位分析师,把研究、建模和起草都做了。',
      imageAlt:
        'PickSkill 对话的产品示意图 —— 一个研究问题、一个带引用和图表的有来源回答,以及一枚守住投资逻辑的记忆标签。',
      ctaLabel: '问问分析师',
      capabilities: [
        { title: '随叫随到的估值', body: '完整的现金流折现模型,配敏感性表格、可比公司分析和反向 DCF —— 输入有来源,假设可编辑,几秒内完成。' },
        { title: '替你读财报', body: '60 秒总结一份 10-K,逐年对比风险因素,提炼 MD&A 信号和值得追查的脚注 —— 每个论断都链接到 EDGAR 上对应的页面。' },
        { title: '多来源研究', body: '一轮之内拉取网页、财报和市场数据,然后带引用作答 —— 不是自信的猜测。对能验证和不能验证的事坦诚以待。' },
        { title: '长期记忆', body: '跨会话记住你的投资逻辑、你关注的标的和偏好,让你接着上次继续,而不必每次都重新解释上下文。' },
        { title: '覆盖美股、港股和 A股', body: '识别 NYSE/NASDAQ、HKEx 和 SSE/SZSE 的代码,并按各市场拉取正确的财报集和市场惯例。' },
      ],
      howItWorks: [
        { step: '用大白话提问', detail: '"给 TSMC 搭一个 5 年期 DCF"、"NVDA 的风险因素有什么变化"、"在 FCF 上对比 AMD 和 Intel"。' },
        { step: '它去研究', detail: '拉取财报、市场数据和网页 —— 跑模型或做对比 —— 并展示它的推演过程。' },
        { step: '得到有来源的回答', detail: '一个经过研究、带引用、带图表和可下载成果的回答 —— 而不是黑箱里的猜测。' },
        { step: '它会记住', detail: '你的投资逻辑和上下文跨会话留存,因此下一个问题建立在上一个之上。' },
      ],
      faq: [
        { q: '这和直接问 ChatGPT 有什么不同?', a: 'PickSkill 把每个回答都锚定在实时数据上 —— 它拉取真实的 10-K、计算 DCF、跑指标,并在查询时引注来源。通用聊天机器人靠训练数据作答,经常编造财务数字。这种数据锚定就是区别所在,尤其在估值和财报工作上。' },
        { q: '"记忆"到底记住什么?', a: '你的投资逻辑、你关注的标的、偏好,以及此前的对话上下文 —— 跨会话留存,并限定在你的账号范围内。你可以查看和编辑记忆条目,而且在每种套餐上都不限量。' },
        { q: '覆盖哪些市场?', a: '美股(NYSE / NASDAQ)、香港(HKEx)和中国 A股(SSE / SZSE)。分析师会拉取各市场对应的财报 —— 美股的 10-K/10-Q、港股的中期/年度报告,以及 A股的扣非净利润这一行。' },
      ],
    },
  },
};

export const pricing: PricingContent = {
  metaTitle: '价格 — PickSkill',
  metaDescription:
    'PickSkill 套餐:Free、Starter $15/月、Pro $39/月、Power $129/月。年付立省 20%。随时取消。',
  heroEyebrow: '套餐与价格',
  heroHeadline: '一位 AI 分析师,只要几杯咖啡的价钱。',
  heroSub:
    '用大白话研究、建模、起草股票投研工作。年付套餐立省 20%。随时取消。',
  perMonth: '/月',
  mostPopular: '最受欢迎',
  everyPlanNote:
    '全部 8 个指标维度和不限量的长期记忆,每种套餐都包含。',
  comparisonHeading: '套餐对比',
  billing: {
    monthly: '月付',
    annual: '年付',
    save: '省 20%',
    billedAnnually: '按年计费',
    overage: '+ 用量超额',
  },
  faqHeading: '常见问题',
  plans: {
    free: {
      blurb: '试试这位 AI 分析师。',
      annualNote: '无需绑卡',
      cta: '免费试用',
      features: [
        '每月 30 次对话',
        '每月 5 次深度研究轮次',
        '1 个组合 · 10 只持仓',
        '每月生成 2 个文件(PPT / Word / Excel)',
        '全部 8 个指标维度',
        '不限量长期记忆',
      ],
    },
    starter: {
      blurb: '为活跃的散户而设。',
      annualNote: '年付 $12/月(全年 $144)',
      cta: '从 Starter 开始',
      features: [
        '每月 200 次对话',
        '每月 50 次深度研究轮次',
        '3 个组合 · 每个 25 只持仓',
        '每月生成 8 个文件(PPT / Word / Excel)',
        '邮件支持',
      ],
    },
    pro: {
      blurb: '最适合日常分析师工作。',
      annualNote: '年付 $32/月(全年 $384)',
      cta: '升级 Pro',
      features: [
        '每月 1,000 次对话',
        '每月 300 次深度研究轮次',
        '10 个组合 · 每个 50 只持仓',
        '每月生成 30 个文件(PPT / Word / Excel)',
        '邮件支持',
      ],
    },
    power: {
      blurb: '为重度用户和专业人士而设。',
      annualNote: '年付 $104/月 · + 用量超额',
      cta: '升级 Power',
      features: [
        'Pro 的全部功能,另加:',
        '不限量对话与研究',
        '不限量组合 · 100 只持仓',
        '每月生成 100+ 个文件(PPT / Word / Excel)',
        '优先邮件支持',
      ],
    },
  },
  comparison: [
    {
      title: 'AI 助手',
      rows: [
        { label: '每月对话', values: ['30', '200', '1,000', '不限量'] },
        { label: '每月深度研究轮次', values: ['5', '50', '300', '不限量'] },
        { label: '专业工作流(DCF、X 研究)', values: [true, true, true, true] },
        { label: '长期记忆', values: ['不限量', '不限量', '不限量', '不限量'] },
      ],
    },
    {
      title: '文档',
      rows: [
        { label: '每月文件(PPT · Word · Excel)', values: ['2', '8', '30', '100+'] },
        { label: '下载链接保留', values: ['7 天', '7 天', '7 天', '7 天'] },
      ],
    },
    {
      title: '组合',
      rows: [
        { label: '组合数', values: ['1', '3', '10', '不限量'] },
        { label: '每个组合持仓', values: ['10', '25', '50', '100'] },
        { label: '行情刷新', values: ['按需', '按需', '按需', '按需'] },
      ],
    },
    {
      title: '指标看板',
      rows: [
        { label: '技术指标维度', values: ['全部 8 个', '全部 8 个', '全部 8 个', '全部 8 个'] },
        { label: '看板导出(PPT / Word / Excel)', values: [true, true, true, true] },
      ],
    },
    {
      title: '市场与语言',
      rows: [
        { label: '市场覆盖(美股 · 港股 · A股)', values: [true, true, true, true] },
        { label: '输出语言', values: ['8', '8', '8', '8'] },
      ],
    },
    {
      title: '支持',
      rows: [
        { label: '支持', values: ['社区', '邮件', '邮件', '优先邮件'] },
        { label: '随时取消', values: [true, true, true, true] },
      ],
    },
  ],
  faq: [
    { q: '一次"对话"怎么算?', a: '围绕一个主题与 AI 的一来一回 —— 包括该线程内的追问和工具调用。我们把整个线程算作一次对话,计入你的月度额度。' },
    { q: '文件生成如何运作?', a: '让 AI 做一个 PowerPoint、Word 或 Excel 文件。我们生成它,托管在 Cloudflare R2 上,并在对话中给你一个 7 天有效的下载链接。无论篇幅长短,每个文件计为一个额度。' },
    { q: '我能在月付和年付之间切换吗?', a: '可以,随时都行。月付 → 年付会按比例收取一笔年费,并顺移你的续费日期。年付 → 月付在下一个续费日生效。' },
    { q: '升级或降级时我的数据会保留吗?', a: '会。组合、持仓、记忆条目和对话历史都随账号迁移。如果你降级到超出某项限额,较旧的数据会变为只读,直到你删除一部分或升级 —— 任何数据都不会被删除。' },
    { q: '你们接受哪些支付方式?', a: '通过 Stripe 支持主流信用卡。面向支持地区的本地方式(Alipay、WeChat Pay)已在路线图上。' },
  ],
};
