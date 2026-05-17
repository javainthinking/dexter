/**
 * Prompt templates for the portfolio dashboard slash commands.
 *
 * Each template instructs the agent to:
 *   1. Resolve the user's portfolio (via memory_search / memory_get).
 *   2. Pull historical OHLCV for every ticker via get_stock_prices.
 *   3. Compute the dimension-specific indicator(s).
 *   4. Bucket each holding into 2–3 signal categories.
 *   5. Mirror the visual register of portfolio_macd_dashboard.html
 *      (the reference style file shipped in the repo).
 *   6. Save the result to `.dexter/dashboards/portfolio_<dim>_YYYY-MM-DD.html`.
 *
 * The prompts are intentionally explicit about layout + colour palette
 * so the rendered HTML stays consistent across dimensions. The agent
 * inlines all data and chart rendering — no external CDN, no build step.
 */

const COMMON_RULES = `
【通用要求 — 所有 dashboard 必须遵守】

数据来源:
1. 先用 memory_search 找用户的持仓清单(关键词:"持仓"、"holdings"、"portfolio")
2. 若 memory 没有,从近期对话上下文中提取;还没有就明确告知用户并停止
3. 对每个 ticker 调 get_stock_prices 取最近 90 个交易日 OHLCV
4. 若个别 ticker 拉数据失败,卡片做 fallback:显示 "数据不足" 提示,不要省略

风格参考(必须先 read_file 一次 ./portfolio_macd_dashboard.html 学习):
- 暗色主题:background #0b1220,panel linear-gradient(#111827, #0f172a),border #1f2937,muted #94a3b8
- 中国惯例红涨绿跌:up = #ef4444,down = #22c55e
- 字体优先级:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif
- max-width 1800px,卡片 grid auto-fit minmax(420px, 1fr) gap 16px

HTML 结构(两部分):
[头部 — 全仓汇总区]
  - <h1> 标题
  - <p class="desc"> 一句话维度说明
  - <div class="overview"> 多句整组结论(由你根据数据生成,提及多少标的看多/看空/中性、值得关注的代表)
  - <div class="summary"> 3 列识别 chip(对应 3 个信号桶)

[主体 — 标的可视化网格]
  按市场分区:美股 / 港股 / A 股 ETF / 加密(若有);每个 section 一个 <h2>+grid
  每个 card:
    - card-head: 名称 + 代码 + 状态 badge(对应该维度的桶)
    - chart-wrap: SVG 图(根据维度而定),width=100% height ~380px
    - metrics: 4 格当前值
    - note(可选):一句话解读

技术约束:
- 单文件 HTML,inline CSS + inline JS + inline 数据(closes/volume/... 数组)
- 不引用任何外部 JS/CSS,所有图表用原生 SVG/Canvas 绘制
- responsive: auto-fit grid

输出:
- 用 write_file 保存到 .dexter/dashboards/portfolio_{DIM}_{YYYY-MM-DD}.html
- 最后给用户一句:"已生成,在浏览器中打开:open <path>"
`;

export const MACD_PROMPT = `${COMMON_RULES}

【MACD 维度】

指标:MACD(12, 26, 9)
- DIF  = EMA(close, 12) − EMA(close, 26)
- DEA  = EMA(DIF, 9)
- HIST = (DIF − DEA) × 2

信号桶(用于头部 summary + 卡片 badge):
- 红柱放大 / 金叉   (看多): HIST 在零轴上方且最新柱比前一根放大;或 DIF 上穿 DEA(尤其零轴下方的金叉更强)
- 绿柱放大 / 死叉   (看空): HIST 在零轴下方且绝对值放大;或 DIF 下穿 DEA(尤其零轴上方的死叉更弱)
- 临界拐点 / 接近翻转 (待观察): HIST 绝对值在最近 3 根内逼近 0,即将变号

每张卡 chart:上半价格折线,下半 DIF/DEA 双线 + HIST 柱(红正绿负)
每张卡 metrics:最新价、日涨跌%、DIF、HIST

输出文件名:portfolio_macd_{YYYY-MM-DD}.html
`;

export const VOLUME_PROMPT = `${COMMON_RULES}

【量价 维度】

指标:
- AVG_VOL_20 = 最近 20 日成交量均值
- VOL_RATIO  = 当日成交量 / AVG_VOL_20
- 当日量价方向 = sign(close − prev_close)

信号桶:
- 放量上涨 / 强势放量 (看多): 最近 3-5 日内 VOL_RATIO ≥ 1.5 且当日收涨(主动买盘进入)
- 放量下跌 / 放量出货 (看空): VOL_RATIO ≥ 1.5 且当日收跌(资金撤出)
- 缩量整理 / 量价背离 (待观察): VOL_RATIO ≤ 0.7 或 量增价滞涨/量减价反弹的背离

每张卡 chart:上半价格折线(收盘),下半成交量柱(柱颜色按当日涨跌 — 红涨绿跌)
每张卡 metrics:最新价、AVG_VOL_20、当日 VOL_RATIO、近 5 日累计涨跌%

输出文件名:portfolio_volume_{YYYY-MM-DD}.html
`;

export const MA_PROMPT = `${COMMON_RULES}

【均线 维度】

指标:MA5、MA20、MA60(简单移动平均收盘价)

信号桶:
- 多头排列    (看多): close > MA5 > MA20 > MA60(短期>中期>长期,强势)
- 空头排列    (看空): close < MA5 < MA20 < MA60(全面走弱)
- 缠绕 / 转折 (待观察): 均线交叉中或纠缠,方向尚未确定;或一根均线刚被价格上/下穿

每张卡 chart:价格折线 + 三条 MA(MA5 浅蓝、MA20 黄、MA60 紫),legend 在右上
每张卡 metrics:最新价、距 MA5 偏离%、距 MA20 偏离%、距 MA60 偏离%

输出文件名:portfolio_ma_{YYYY-MM-DD}.html
`;

/**
 * MOVERS_PROMPT is not portfolio-scoped — it's a market-pulse dashboard.
 * It deliberately bypasses COMMON_RULES (which mandates memory_search for
 * holdings) because the data source is the whole US market, not the user's
 * book.
 */
export const MOVERS_PROMPT = `
【美股市场涨跌榜 Dashboard】

数据来源:
1. 调用 get_market_data,query 写 "today's top US stock market movers gainers and losers"
   (会路由到 get_market_movers,Valyu valyu-market-movers-US 数据源)
2. 对每侧前 6 个标的并行调 get_stock_prices 取最近 30 个交易日收盘价(用于绘制 sparkline)
3. 可选:对每侧 top 3 调 get_company_news 取 1-2 条最新利好/利空标题,加在 note 区
4. 若 get_market_movers 失败,直接给用户报错并停止 — 这个维度没有 fallback

风格(沿用 portfolio dashboard 视觉语言,先 read_file ./portfolio_macd_dashboard.html):
- 暗色主题:background #0b1220,panel linear-gradient(#111827, #0f172a),border #1f2937,muted #94a3b8
- 中国惯例红涨绿跌:up = #ef4444,down = #22c55e
- max-width 1800px,两栏布局(Gainers 左 / Losers 右),栏内 grid auto-fit minmax(360px, 1fr)
- 字体:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif

HTML 结构(两部分):
[头部 — 全市场识别]
  - <h1> "美股盘中风向标 · {retrieved_at 字段, 显示最后更新时间}"
  - <p class="desc"> 一句话说明数据来源(Valyu 实时聚合)与口径
  - <div class="overview"> 多句:今日多少只票涨幅 > X%、多少只跌幅 > X%、最大涨幅/跌幅代表、是否集中在某些题材(若从 ticker 列表能识别 AI/能源/生物科技等板块)
  - <div class="summary"> 3 列 chip:
      • Top Gainer 代表(最高 % 那一只 + 涨幅)
      • Top Loser 代表(最低 % 那一只 + 跌幅)
      • 成交活跃代表(最高 volume × |percent_change| 那一只)

[主体 — 涨跌榜栅格]
  两个 section:
    <section class="gainers"> <h2>🔥 Top Gainers</h2> <div class="grid"> ... </div> </section>
    <section class="losers">  <h2>❄️ Top Losers</h2>  <div class="grid"> ... </div> </section>
  每张 card:
    - card-head: symbol + name + percent_change badge (红/绿底色)
    - chart-wrap: 30 日收盘价 sparkline SVG,高度 ~80px,红涨绿跌
    - metrics: 4 格 — 现价 | $ 变动 | % 变动 | 成交量
    - note(可选,前 3 名带):一句最新新闻标题

技术约束:
- 单文件 HTML,inline CSS + inline JS + inline 数据数组
- 不引用任何外部 JS/CSS
- responsive grid

输出:
- 用 write_file 保存到 .dexter/dashboards/market_movers_{YYYY-MM-DD}.html
- 最后给用户一句:"已生成,在浏览器中打开:open <path>"
`;

export const FLOW_PROMPT = `${COMMON_RULES}

【主力资金流量 维度】

数据说明:financial-datasets API 没有直接的"主力资金净流入"字段(那是 A 股特有的盘口口径)。
我们用 "量价代理" 近似:NET_FLOW(t) = sign(close(t) − close(t-1)) × volume(t) × close(t),按交易日累计。
对 A 股 / ETF,如果通过 get_stock_prices 拿到分笔大单数据,优先使用;否则全部用代理。

指标(用代理近似):
- DAILY_NET_FLOW(t) = sign(close(t) − close(t-1)) × volume(t) × close(t)
- CUM_FLOW_20  = 最近 20 个交易日 DAILY_NET_FLOW 累加
- FLOW_5D     = 最近 5 个交易日 DAILY_NET_FLOW 累加

信号桶:
- 主力净流入 (看多): CUM_FLOW_20 显著为正(占成交额的有意义比例) 且 FLOW_5D 同号
- 主力净流出 (看空): CUM_FLOW_20 显著为负 且 FLOW_5D 同号
- 资金震荡 / 方向不明 (待观察): 累计接近 0 或近期与累计方向相反

每张卡 chart:上半价格折线,下半 DAILY_NET_FLOW 柱(红正绿负),底部叠加 CUM_FLOW_20 折线
每张卡 metrics:最新价、CUM_FLOW_20、FLOW_5D、近 5 日价格变化%

⚠️ 头部 overview 中明确写一句:"本视图基于量价代理估算主力资金,非真实盘口数据。"

输出文件名:portfolio_flow_{YYYY-MM-DD}.html
`;
