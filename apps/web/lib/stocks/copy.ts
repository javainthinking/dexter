import type { Locale } from '../i18n/locales';
import type { DimensionKey } from '../indicators/labels';
import type { NarrativeLang } from './narrative';
import type { Tone } from './snapshot';
import type { StockMarket } from './universe';

/**
 * Copy for the public /stocks pages. Written for en, zh-CN and zh-TW —
 * the languages the indicator labels exist in. Other locales render the
 * English copy and canonicalise to the English URL (see `stockPageLang`),
 * so search engines never see half-translated duplicates.
 */

export const STOCK_PAGE_LOCALES = ['en', 'zh-CN', 'zh-TW'] as const satisfies readonly Locale[];

export function stockPageLang(locale: Locale): NarrativeLang {
  return (STOCK_PAGE_LOCALES as readonly string[]).includes(locale) ? (locale as NarrativeLang) : 'en';
}

interface Vars {
  name: string;
  symbol: string;
}

export interface StockCopy {
  breadcrumb: string;
  market: Record<StockMarket, string>;
  index: { metaTitle: string; metaDescription: string; eyebrow: string; headline: string; sub: string };
  metaTitle: (v: Vars) => string;
  metaDescription: (v: Vars & { asOf: string; tally: string }) => string;
  eyebrow: (market: string, exchange: string) => string;
  headline: (v: Vars) => string;
  sub: string;
  asOf: string;
  refreshNote: string;
  tone: Record<Tone, string>;
  tally: (b: number, r: number, n: number) => string;
  timelineHeading: string;
  timelineSub: string;
  byline: (date: string) => string;
  /** Question-style heading over the 5-day read. */
  readHeading: (v: Vars) => string;
  /** Deterministic one-sentence answer that opens the 5-day read. */
  answer: (v: Vars & { asOf: string; close: string; day: string; five: string; tally: string; toneWord: string }) => string;
  readSourceAi: string;
  readSourceTemplate: string;
  disclaimerTitle: string;
  disclaimer: string;
  levelsHeading: (v: Vars) => string;
  levels: { indicator: string; value: string; signal: string };
  unavailable: string;
  cta: {
    heading: (v: Vars) => string;
    sub: string;
    track: { title: string; body: string; button: string };
    ask: { title: string; body: string; button: string; prompt: (v: Vars) => string };
    deck: { title: string; body: string; button: string; prompt: (v: Vars) => string };
  };
  relatedHeading: string;
  viewAll: string;
  glossaryHeading: string;
  methodology: { heading: string; sourceLabel: string; body: string[]; references: string };
  glossary: Record<DimensionKey, string>;
  faqHeading: string;
  faq: (v: Vars & { tally: string; toneWord: string; asOf: string }) => Array<{ q: string; a: string }>;
  share: { label: string; copy: string; copied: string; more: string; text: (v: Vars & { tone: string }) => string };
}

const en: StockCopy = {
  breadcrumb: 'Stock signals',
  market: { us: 'US stocks', hk: 'Hong Kong stocks', cn: 'China A-shares' },
  index: {
    metaTitle: 'Stock Technical Signals — US, Hong Kong & A-shares | PickSkill',
    metaDescription:
      'Free daily technical signals for popular US, Hong Kong and China A-share stocks: MACD, MA, RSI, KDJ, Bollinger, ADX, volume and money flow over the last 5 trading days.',
    eyebrow: 'Free · No sign-up · Updated daily',
    headline: 'Technical signals for the stocks everyone is watching',
    sub: 'Eight indicators, five trading days, one glance. Pick a ticker to see its signal timeline and a plain-language read of the week.',
  },
  metaTitle: ({ name, symbol }) => `${name} (${symbol}) Technical Signals — 5-Day Indicator Read | PickSkill`,
  metaDescription: ({ name, symbol, asOf, tally }) =>
    `${name} (${symbol}) technical analysis as of ${asOf}: ${tally}. MACD, MA, RSI, KDJ, Bollinger, ADX, volume and money-flow signals for the last 5 trading days.`,
  eyebrow: (market, exchange) => `${market} · ${exchange} · Technical signals`,
  headline: ({ name, symbol }) => `${name} (${symbol}) technical signals`,
  sub: 'Every indicator, every day, for the last five trading sessions — computed from daily price data.',
  asOf: 'Data as of',
  refreshNote: 'Daily bars · refreshed every few hours',
  tone: { bullish: 'Leaning bullish', bearish: 'Leaning bearish', mixed: 'Mixed signals', neutral: 'Neutral' },
  tally: (b, r, n) => `${b} bullish · ${r} bearish · ${n} neutral`,
  timelineHeading: 'Signal timeline',
  timelineSub: 'The last 5 trading days · every indicator, every day',
  byline: (date) => `By PickSkill Research · generated from daily price data · updated ${date}`,
  readHeading: ({ symbol }) => `How has ${symbol} traded over the last 5 trading days?`,
  answer: ({ name, symbol, asOf, close, day, five, tally, toneWord }) =>
    `As of ${asOf}, ${name} (${symbol}) closed at ${close} (${day} on the day, ${five} over five sessions), and its 8 technical indicators read ${tally}: an overall ${toneWord.toLowerCase()} picture.`,
  readSourceAi: 'Written by AI from the indicator values above.',
  readSourceTemplate: 'Generated from the indicator values above.',
  disclaimerTitle: 'For reference only — not investment advice',
  disclaimer:
    'Technical indicators describe past price and volume behaviour; they do not predict future returns. Data may be delayed or contain errors. Do your own research and consider your own circumstances before making any investment decision.',
  levelsHeading: ({ symbol }) => `What are ${symbol}'s key technical indicator levels?`,
  levels: { indicator: 'Indicator', value: 'Latest value', signal: 'Signal' },
  unavailable: 'Price data is temporarily unavailable for this ticker. Please check back shortly.',
  cta: {
    heading: ({ symbol }) => `Go deeper on ${symbol} with PickSkill`,
    sub: 'This page is a free slice of what PickSkill does. Sign in to put the same signals to work on your own holdings.',
    track: {
      title: 'Track it in a portfolio',
      body: 'Add this ticker to a watchlist and see all 8 indicators for every holding, side by side, every day.',
      button: 'Build a portfolio',
    },
    ask: {
      title: 'Ask the AI analyst',
      body: 'Get a sourced answer combining technicals with earnings, filings and news — in plain English.',
      button: 'Ask about it',
      prompt: ({ name, symbol }) =>
        `Analyze ${name} (${symbol}): combine the latest technical signals with recent earnings, news and valuation. What are the key risks and catalysts?`,
    },
    deck: {
      title: 'Generate a research deck',
      body: 'Turn the analysis into a ready-to-share PowerPoint or Word report in minutes.',
      button: 'Create a deck',
      prompt: ({ name, symbol }) =>
        `Create an investment research deck (PPTX) on ${name} (${symbol}) covering the business, recent financials, technical signals, valuation and key risks.`,
    },
  },
  relatedHeading: 'Related stocks',
  viewAll: 'All stocks',
  glossaryHeading: 'How do you read these technical signals?',
  methodology: {
    heading: 'Where does this data come from?',
    sourceLabel: 'Daily price and volume data',
    body: [
      'PickSkill computes eight indicators from roughly 90 daily bars using standard parameters: MACD(12,26,9), MA5/20/60, RSI(14), KDJ(9,3,3), Bollinger Bands(20,2), ADX/DMI(14), volume versus its 20-day average, and a price-times-volume money-flow proxy.',
      'Each trading day is classified as bullish, bearish or neutral per indicator. Limit-up, limit-down and halted bars (high equal to low) are forced to neutral so they cannot produce false signals.',
      'The written summary is generated by AI strictly from these computed values. It contains no news, fundamentals or forecasts, and every above/below comparison is calculated in code, not by the model.',
    ],
    references: 'Indicator definitions (Wikipedia)',
  },
  glossary: {
    macd: 'MACD — momentum from the gap between the 12- and 26-day EMAs. A golden cross (DIF above DEA) or an expanding positive histogram reads bullish; the opposite reads bearish.',
    ma: 'Moving averages (MA5/20/60) — when the short average is above the medium and long ones the trend is aligned up; tangled averages mean no clear direction.',
    rsi: 'RSI(14) — 0–100 strength gauge. Below 30 is oversold (a potential rebound zone), above 70 is overbought.',
    kdj: 'KDJ(9,3,3) — a stochastic oscillator popular in Asian markets. K crossing above D at low levels is a golden cross; crossing down from high levels is a death cross.',
    boll: 'Bollinger Bands(20,2) — a price channel two standard deviations around the 20-day mean. Riding the upper band shows strength; piercing the lower band shows weakness.',
    adx: 'ADX/DMI(14) — trend strength. ADX above 25 with +DI over −DI is a strong uptrend; below 20 means no meaningful trend.',
    volume: 'Volume — today versus the 20-day average. Heavy volume on an up day reads bullish, on a down day bearish; light volume means consolidation.',
    flow: 'Money flow (estimated) — a direction proxy from price and volume, not real order-book data. Sustained estimated inflow reads bullish.',
  },
  faqHeading: 'Frequently asked questions',
  faq: ({ name, symbol, tally, toneWord, asOf }) => [
    {
      q: `Is ${symbol} bullish or bearish right now?`,
      a: `As of ${asOf}, ${name}'s eight technical indicators read ${tally}, an overall picture of "${toneWord}". This describes past price action only and is not a forecast or a recommendation.`,
    },
    {
      q: `Which indicators does this ${symbol} page track?`,
      a: 'MACD, moving averages (MA5/20/60), RSI(14), KDJ(9,3,3), Bollinger Bands(20,2), ADX/DMI(14), volume versus its 20-day average, and an estimated money-flow proxy, each classified as bullish, bearish or neutral for each of the last five trading days.',
    },
    {
      q: 'How often is the data updated?',
      a: 'The page uses daily price bars and refreshes every few hours, so it reflects the most recent completed or in-progress session. Prices may be delayed.',
    },
    {
      q: 'Is this investment advice?',
      a: 'No. The signals and the written summary are generated automatically from historical prices for reference only. They are not investment advice and do not predict future returns.',
    },
  ],
  share: {
    label: 'Share',
    copy: 'Copy link',
    copied: 'Link copied',
    more: 'More',
    text: ({ name, symbol, tone }) => `${name} (${symbol}) technical signals: ${tone}. See all 8 indicators for the last 5 trading days on PickSkill:`,
  },
};

const zhCN: StockCopy = {
  breadcrumb: '个股技术信号',
  market: { us: '美股', hk: '港股', cn: 'A股' },
  index: {
    metaTitle: '个股技术信号 — 美股、港股、A股每日指标 | PickSkill',
    metaDescription:
      '免费查看热门美股、港股、A股的每日技术信号：MACD、均线、RSI、KDJ、布林带、ADX、成交量与资金流，近 5 个交易日一目了然。',
    eyebrow: '免费 · 无需登录 · 每日更新',
    headline: '热门个股技术信号，一眼看懂',
    sub: '8 项指标 × 5 个交易日。选择一只股票，查看它的信号时间线和本周走势解读。',
  },
  metaTitle: ({ name, symbol }) => `${name}（${symbol}）技术分析 — 近5日指标信号解读 | PickSkill`,
  metaDescription: ({ name, symbol, asOf, tally }) =>
    `${name}（${symbol}）技术面，截至 ${asOf}：${tally}。近 5 个交易日 MACD、均线、RSI、KDJ、布林带、ADX、成交量与资金流信号。`,
  eyebrow: (market, exchange) => `${market} · ${exchange} · 技术信号`,
  headline: ({ name, symbol }) => `${name}（${symbol}）技术信号`,
  sub: '近 5 个交易日，每一项指标、每一天的信号 — 基于日线行情计算。',
  asOf: '数据截至',
  refreshNote: '日线数据 · 每隔数小时更新',
  tone: { bullish: '偏多', bearish: '偏空', mixed: '多空分歧', neutral: '中性观望' },
  tally: (b, r, n) => `${b} 项看多 · ${r} 项看空 · ${n} 项中性`,
  timelineHeading: '信号时间线',
  timelineSub: '近 5 个交易日 · 每项指标每日信号',
  byline: (date) => `PickSkill Research · 基于每日行情自动生成 · 更新于 ${date}`,
  readHeading: ({ name }) => `${name}近 5 个交易日走势如何？`,
  answer: ({ name, symbol, asOf, close, day, five, tally, toneWord }) =>
    `截至 ${asOf}，${name}（${symbol}）收于 ${close}（当日 ${day}，近 5 个交易日 ${five}），8 项技术指标为 ${tally}，整体${toneWord}。`,
  readSourceAi: '由 AI 根据上方指标数值撰写。',
  readSourceTemplate: '根据上方指标数值自动生成。',
  disclaimerTitle: '仅供参考，不构成投资建议',
  disclaimer:
    '技术指标描述的是历史价格与成交量表现，不能预测未来收益。数据可能存在延迟或误差。投资有风险，请结合自身情况独立判断。',
  levelsHeading: ({ name }) => `${name}当前的关键技术指标数值是多少？`,
  levels: { indicator: '指标', value: '最新值', signal: '信号' },
  unavailable: '该股票的行情数据暂时无法获取，请稍后再试。',
  cta: {
    heading: ({ name }) => `用 PickSkill 深入研究${name}`,
    sub: '本页只是 PickSkill 能力的一小部分。登录后，把同样的信号用在你自己的持仓上。',
    track: {
      title: '加入组合跟踪',
      body: '把这只股票加入自选组合，每天并排查看所有持仓的 8 项技术指标。',
      button: '创建组合',
    },
    ask: {
      title: '问问 AI 分析师',
      body: '结合技术面、财报、公告与新闻，给出有来源依据的分析。',
      button: '立即提问',
      prompt: ({ name, symbol }) =>
        `分析${name}（${symbol}）：结合最新技术信号、近期财报、新闻与估值，主要的风险和催化剂是什么？`,
    },
    deck: {
      title: '一键生成研究报告',
      body: '几分钟内把分析变成可分享的 PPT 或 Word 研报。',
      button: '生成报告',
      prompt: ({ name, symbol }) =>
        `为${name}（${symbol}）生成一份投资研究 PPT，涵盖业务概况、近期财务、技术信号、估值和主要风险。`,
    },
  },
  relatedHeading: '相关股票',
  viewAll: '全部股票',
  glossaryHeading: '如何看懂这些技术信号？',
  methodology: {
    heading: '数据从哪里来？',
    sourceLabel: '每日行情与成交量数据',
    body: [
      'PickSkill 基于约 90 根日线、按标准参数计算 8 项指标：MACD(12,26,9)、MA5/20/60、RSI(14)、KDJ(9,3,3)、布林带(20,2)、ADX/DMI(14)、成交量对比 20 日均量，以及按价格×成交量估算的资金流。',
      '每个交易日、每项指标都会被判定为看多、看空或中性。涨停、跌停和停牌（最高价等于最低价）的交易日一律视为中性，避免产生虚假信号。',
      '文字解读由 AI 严格依据上述计算结果撰写，不包含新闻、基本面或预测；所有高于/低于的比较均由程序计算，而非模型判断。',
    ],
    references: '指标定义（维基百科）',
  },
  glossary: {
    macd: 'MACD — 由 12 日与 26 日指数均线之差衡量动能。DIF 上穿 DEA（金叉）或红柱放大为看多，反之为看空。',
    ma: '均线（MA5/20/60）— 短期均线位于中长期均线之上为多头排列；均线缠绕表示方向不明。',
    rsi: 'RSI(14) — 0–100 的强弱指标。低于 30 为超卖（可能反弹），高于 70 为超买。',
    kdj: 'KDJ(9,3,3) — A 股常用的随机指标。低位 K 上穿 D 为金叉，高位下穿为死叉。',
    boll: '布林带(20,2) — 以 20 日均价为中轨、上下两倍标准差的通道。沿上轨运行偏强，跌破下轨偏弱。',
    adx: 'ADX/DMI(14) — 趋势强度。ADX 高于 25 且 +DI 大于 −DI 为较强上升趋势；低于 20 表示无明显趋势。',
    volume: '成交量 — 当日成交量对比 20 日均量。放量上涨看多，放量下跌看空，缩量为整理。',
    flow: '资金流（估算）— 基于价格与成交量推算的方向指标，并非真实盘口数据。持续估算流入为看多。',
  },
  faqHeading: '常见问题',
  faq: ({ name, symbol, tally, toneWord, asOf }) => [
    {
      q: `${name}（${symbol}）现在是看多还是看空？`,
      a: `截至 ${asOf}，${name}的 8 项技术指标为：${tally}，整体${toneWord}。这只描述历史走势，不是预测，也不构成投资建议。`,
    },
    {
      q: `本页跟踪${symbol}的哪些指标？`,
      a: 'MACD、均线（MA5/20/60）、RSI(14)、KDJ(9,3,3)、布林带(20,2)、ADX/DMI(14)、成交量（对比 20 日均量）以及估算资金流，每项指标在近 5 个交易日的每一天都会被判定为看多、看空或中性。',
    },
    {
      q: '数据多久更新一次？',
      a: '页面基于日线数据，每隔数小时刷新一次，反映最近一个已完成或进行中的交易日。行情可能存在延迟。',
    },
    {
      q: '这是投资建议吗？',
      a: '不是。信号与文字解读均由历史行情自动生成，仅供参考，不构成投资建议，也不能预测未来收益。',
    },
  ],
  share: {
    label: '分享',
    copy: '复制链接',
    copied: '已复制链接',
    more: '更多',
    text: ({ name, symbol, tone }) => `${name}（${symbol}）技术信号：${tone}。在 PickSkill 查看近 5 个交易日全部 8 项指标：`,
  },
};

const zhTW: StockCopy = {
  ...zhCN,
  breadcrumb: '個股技術訊號',
  market: { us: '美股', hk: '港股', cn: 'A股' },
  index: {
    metaTitle: '個股技術訊號 — 美股、港股、A股每日指標 | PickSkill',
    metaDescription:
      '免費查看熱門美股、港股、A股的每日技術訊號：MACD、均線、RSI、KDJ、布林通道、ADX、成交量與資金流，近 5 個交易日一目了然。',
    eyebrow: '免費 · 無需登入 · 每日更新',
    headline: '熱門個股技術訊號，一眼看懂',
    sub: '8 項指標 × 5 個交易日。選擇一檔股票，查看它的訊號時間線和本週走勢解讀。',
  },
  metaTitle: ({ name, symbol }) => `${name}（${symbol}）技術分析 — 近5日指標訊號解讀 | PickSkill`,
  metaDescription: ({ name, symbol, asOf, tally }) =>
    `${name}（${symbol}）技術面，截至 ${asOf}：${tally}。近 5 個交易日 MACD、均線、RSI、KDJ、布林通道、ADX、成交量與資金流訊號。`,
  eyebrow: (market, exchange) => `${market} · ${exchange} · 技術訊號`,
  headline: ({ name, symbol }) => `${name}（${symbol}）技術訊號`,
  sub: '近 5 個交易日，每一項指標、每一天的訊號 — 基於日線行情計算。',
  asOf: '資料截至',
  refreshNote: '日線資料 · 每隔數小時更新',
  tone: { bullish: '偏多', bearish: '偏空', mixed: '多空分歧', neutral: '中性觀望' },
  tally: (b, r, n) => `${b} 項看多 · ${r} 項看空 · ${n} 項中性`,
  timelineHeading: '訊號時間線',
  timelineSub: '近 5 個交易日 · 每項指標每日訊號',
  byline: (date) => `PickSkill Research · 根據每日行情自動產生 · 更新於 ${date}`,
  readHeading: ({ name }) => `${name}近 5 個交易日走勢如何？`,
  answer: ({ name, symbol, asOf, close, day, five, tally, toneWord }) =>
    `截至 ${asOf}，${name}（${symbol}）收於 ${close}（當日 ${day}，近 5 個交易日 ${five}），8 項技術指標為 ${tally}，整體${toneWord}。`,
  readSourceAi: '由 AI 根據上方指標數值撰寫。',
  readSourceTemplate: '根據上方指標數值自動產生。',
  disclaimerTitle: '僅供參考，不構成投資建議',
  disclaimer:
    '技術指標描述的是歷史價格與成交量表現，不能預測未來收益。資料可能存在延遲或誤差。投資有風險，請結合自身情況獨立判斷。',
  levelsHeading: ({ name }) => `${name}目前的關鍵技術指標數值是多少？`,
  levels: { indicator: '指標', value: '最新值', signal: '訊號' },
  unavailable: '該股票的行情資料暫時無法取得，請稍後再試。',
  cta: {
    heading: ({ name }) => `用 PickSkill 深入研究${name}`,
    sub: '本頁只是 PickSkill 能力的一小部分。登入後，把同樣的訊號用在你自己的持股上。',
    track: {
      title: '加入組合追蹤',
      body: '把這檔股票加入自選組合，每天並排查看所有持股的 8 項技術指標。',
      button: '建立組合',
    },
    ask: {
      title: '問問 AI 分析師',
      body: '結合技術面、財報、公告與新聞，給出有來源依據的分析。',
      button: '立即提問',
      prompt: ({ name, symbol }) =>
        `分析${name}（${symbol}）：結合最新技術訊號、近期財報、新聞與估值，主要的風險和催化劑是什麼？`,
    },
    deck: {
      title: '一鍵產生研究報告',
      body: '幾分鐘內把分析變成可分享的 PPT 或 Word 研究報告。',
      button: '產生報告',
      prompt: ({ name, symbol }) =>
        `為${name}（${symbol}）產生一份投資研究 PPT，涵蓋業務概況、近期財務、技術訊號、估值和主要風險。`,
    },
  },
  relatedHeading: '相關股票',
  viewAll: '全部股票',
  glossaryHeading: '如何看懂這些技術訊號？',
  methodology: {
    heading: '資料從哪裡來？',
    sourceLabel: '每日行情與成交量資料',
    body: [
      'PickSkill 根據約 90 根日線、以標準參數計算 8 項指標：MACD(12,26,9)、MA5/20/60、RSI(14)、KDJ(9,3,3)、布林通道(20,2)、ADX/DMI(14)、成交量對比 20 日均量，以及以價格×成交量估算的資金流。',
      '每個交易日、每項指標都會被判定為看多、看空或中性。漲停、跌停和停牌（最高價等於最低價）的交易日一律視為中性，避免產生虛假訊號。',
      '文字解讀由 AI 嚴格依據上述計算結果撰寫，不包含新聞、基本面或預測；所有高於/低於的比較均由程式計算，而非模型判斷。',
    ],
    references: '指標定義（維基百科）',
  },
  glossary: {
    macd: 'MACD — 以 12 日與 26 日指數均線之差衡量動能。DIF 上穿 DEA（黃金交叉）或紅柱放大為看多，反之為看空。',
    ma: '均線（MA5/20/60）— 短期均線位於中長期均線之上為多頭排列；均線糾結表示方向不明。',
    rsi: 'RSI(14) — 0–100 的強弱指標。低於 30 為超賣（可能反彈），高於 70 為超買。',
    kdj: 'KDJ(9,3,3) — 亞洲市場常用的隨機指標。低檔 K 上穿 D 為黃金交叉，高檔下穿為死亡交叉。',
    boll: '布林通道(20,2) — 以 20 日均價為中軌、上下兩倍標準差的通道。沿上軌運行偏強，跌破下軌偏弱。',
    adx: 'ADX/DMI(14) — 趨勢強度。ADX 高於 25 且 +DI 大於 −DI 為較強上升趨勢；低於 20 表示無明顯趨勢。',
    volume: '成交量 — 當日成交量對比 20 日均量。量增上漲看多，量增下跌看空，量縮為整理。',
    flow: '資金流（估算）— 基於價格與成交量推算的方向指標，並非真實委託簿資料。持續估算流入為看多。',
  },
  faqHeading: '常見問題',
  faq: ({ name, symbol, tally, toneWord, asOf }) => [
    {
      q: `${name}（${symbol}）現在是看多還是看空？`,
      a: `截至 ${asOf}，${name}的 8 項技術指標為：${tally}，整體${toneWord}。這只描述歷史走勢，不是預測，也不構成投資建議。`,
    },
    {
      q: `本頁追蹤${symbol}的哪些指標？`,
      a: 'MACD、均線（MA5/20/60）、RSI(14)、KDJ(9,3,3)、布林通道(20,2)、ADX/DMI(14)、成交量（對比 20 日均量）以及估算資金流，每項指標在近 5 個交易日的每一天都會被判定為看多、看空或中性。',
    },
    {
      q: '資料多久更新一次？',
      a: '頁面基於日線資料，每隔數小時更新一次，反映最近一個已完成或進行中的交易日。行情可能存在延遲。',
    },
    {
      q: '這是投資建議嗎？',
      a: '不是。訊號與文字解讀均由歷史行情自動產生，僅供參考，不構成投資建議，也不能預測未來收益。',
    },
  ],
  share: {
    label: '分享',
    copy: '複製連結',
    copied: '已複製連結',
    more: '更多',
    text: ({ name, symbol, tone }) => `${name}（${symbol}）技術訊號：${tone}。在 PickSkill 查看近 5 個交易日全部 8 項指標：`,
  },
};

const COPY: Record<NarrativeLang, StockCopy> = { en, 'zh-CN': zhCN, 'zh-TW': zhTW };

export function getStockCopy(lang: NarrativeLang): StockCopy {
  return COPY[lang];
}
