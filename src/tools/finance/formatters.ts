/**
 * Result formatters — convert raw financial API JSON into compact
 * markdown tables for efficient model consumption.
 *
 * Each formatter takes the raw `data` field from a sub-tool result
 * and returns a human-readable string that's 5-10x smaller.
 */

// ---------------------------------------------------------------------------
// Number formatting helpers
// ---------------------------------------------------------------------------

function fmtNum(n: unknown): string {
  if (n === null || n === undefined) return '—';
  const num = Number(n);
  if (isNaN(num)) return '—';
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(1)}T`;
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${abs.toFixed(0)}`;
}

function fmtPct(n: unknown): string {
  if (n === null || n === undefined) return '—';
  const num = Number(n);
  if (isNaN(num)) return '—';
  return `${(num * 100).toFixed(1)}%`;
}

function fmtPrice(n: unknown): string {
  if (n === null || n === undefined) return '—';
  const num = Number(n);
  if (isNaN(num)) return '—';
  return `$${num.toFixed(2)}`;
}

function fmtRatio(n: unknown): string {
  if (n === null || n === undefined) return '—';
  const num = Number(n);
  if (isNaN(num)) return '—';
  return num.toFixed(1);
}

function fmtDate(d: unknown): string {
  if (!d) return '—';
  const str = String(d);
  // "2024-12-31" → "Q4 24" for quarterly, "2024" for annual
  if (str.length >= 10) {
    const month = parseInt(str.slice(5, 7), 10);
    const year = str.slice(2, 4);
    const quarter = Math.ceil(month / 3);
    return `Q${quarter} ${year}`;
  }
  return str;
}

type Rec = Record<string, unknown>;

// Period label for statement/metric rows. Prefers the API's authoritative
// fiscal_period ("FY2026", "2027-Q1") — deriving a calendar quarter from
// report_period mislabels annual rows as "Q1 26" and misassigns quarters for
// non-calendar fiscal years (e.g. NVDA's late-January year-end).
function fmtPeriod(row: Rec): string {
  if (row.fiscal_period) return String(row.fiscal_period);
  return fmtDate(row.report_period ?? row.date);
}

// ---------------------------------------------------------------------------
// Financial statement formatters
// ---------------------------------------------------------------------------

export function formatIncomeStatements(data: unknown, args?: Rec): string {
  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) return 'No income statement data available.';
  const ticker = (args?.ticker as string)?.toUpperCase() ?? '';
  const lines = [`${ticker} Income Statement`, ''];
  lines.push('| Period | Revenue | Op Inc | Net Inc | EPS |');
  lines.push('|--------|---------|--------|---------|-----|');
  for (const row of items as Rec[]) {
    lines.push(`| ${fmtPeriod(row)} | ${fmtNum(row.revenue)} | ${fmtNum(row.operating_income)} | ${fmtNum(row.net_income)} | ${fmtPrice(row.earnings_per_share ?? row.basic_earnings_per_share)} |`);
  }
  return lines.join('\n');
}

export function formatBalanceSheets(data: unknown, args?: Rec): string {
  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) return 'No balance sheet data available.';
  const ticker = (args?.ticker as string)?.toUpperCase() ?? '';
  const lines = [`${ticker} Balance Sheet`, ''];
  lines.push('| Period | Total Assets | Total Liab | Equity | Cash |');
  lines.push('|--------|-------------|------------|--------|------|');
  for (const row of items as Rec[]) {
    lines.push(`| ${fmtPeriod(row)} | ${fmtNum(row.total_assets)} | ${fmtNum(row.total_liabilities)} | ${fmtNum(row.shareholders_equity ?? row.total_equity)} | ${fmtNum(row.cash_and_equivalents)} |`);
  }
  return lines.join('\n');
}

export function formatCashFlowStatements(data: unknown, args?: Rec): string {
  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) return 'No cash flow data available.';
  const ticker = (args?.ticker as string)?.toUpperCase() ?? '';
  const lines = [`${ticker} Cash Flow`, ''];
  lines.push('| Period | Op CF | CapEx | FCF |');
  lines.push('|--------|-------|-------|-----|');
  for (const row of items as Rec[]) {
    const opCF = Number(row.operating_cash_flow ?? row.net_cash_flow_from_operations ?? 0);
    // capital_expenditure is often null; the capex outflow lands in
    // property_plant_and_equipment. Prefer the API's own free_cash_flow.
    const capex = Math.abs(Number(row.capital_expenditure ?? row.property_plant_and_equipment ?? 0));
    const fcf = row.free_cash_flow != null ? Number(row.free_cash_flow) : opCF - capex;
    lines.push(`| ${fmtPeriod(row)} | ${fmtNum(opCF)} | ${fmtNum(capex)} | ${fmtNum(fcf)} |`);
  }
  return lines.join('\n');
}

export function formatAllFinancials(data: unknown, args?: Rec): string {
  const rec = (data && typeof data === 'object') ? data as Rec : {};
  const parts: string[] = [];
  if (rec.income_statements) parts.push(formatIncomeStatements(rec.income_statements, args));
  if (rec.balance_sheets) parts.push(formatBalanceSheets(rec.balance_sheets, args));
  if (rec.cash_flow_statements) parts.push(formatCashFlowStatements(rec.cash_flow_statements, args));
  return parts.length > 0 ? parts.join('\n\n') : 'No financial data available.';
}

// ---------------------------------------------------------------------------
// Key ratios / metrics
// ---------------------------------------------------------------------------

export function formatKeyRatios(data: unknown, args?: Rec): string {
  const d = (data && typeof data === 'object') ? data as Rec : {};
  if (Object.keys(d).length === 0) return 'No key metrics available.';
  const ticker = ((d.ticker ?? args?.ticker) as string)?.toUpperCase() ?? '';
  const lines = [`${ticker} Key Metrics`];
  lines.push(`- Market Cap: ${fmtNum(d.market_cap)}`);
  lines.push(`- P/E: ${fmtRatio(d.price_to_earnings_ratio)} | P/S: ${fmtRatio(d.price_to_sales_ratio)} | P/B: ${fmtRatio(d.price_to_book_ratio)} | EPS: ${fmtPrice(d.earnings_per_share)}`);
  lines.push(`- Revenue Growth: ${fmtPct(d.revenue_growth)} | Earnings Growth: ${fmtPct(d.earnings_growth)}`);
  if (d.gross_margin !== undefined || d.operating_margin !== undefined || d.net_margin !== undefined) {
    lines.push(`- Gross Margin: ${fmtPct(d.gross_margin)} | Op Margin: ${fmtPct(d.operating_margin)} | Net Margin: ${fmtPct(d.net_margin)}`);
  }
  if (d.return_on_equity !== undefined) lines.push(`- ROE: ${fmtPct(d.return_on_equity)} | ROIC: ${fmtPct(d.return_on_invested_capital)}`);
  if (d.debt_to_equity !== undefined) lines.push(`- D/E: ${fmtRatio(d.debt_to_equity)}`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Market data formatters
// ---------------------------------------------------------------------------

export function formatStockPrice(data: unknown): string {
  const d = (data && typeof data === 'object') ? data as Rec : {};
  const ticker = (d.ticker as string)?.toUpperCase() ?? '';
  // The /prices/snapshot/ endpoint is a last-trade snapshot: price + day change,
  // no OHLC/volume. Show the day move instead of blank H/L/Vol columns.
  const chg = d.day_change_percent != null
    ? ` (${Number(d.day_change_percent) >= 0 ? '+' : ''}${Number(d.day_change_percent).toFixed(2)}% today)`
    : '';
  return `${ticker}: ${fmtPrice(d.price ?? d.close)}${chg}`;
}

export function formatStockPrices(data: unknown): string {
  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) return 'No price history available.';
  const lines = ['Price History', ''];
  lines.push('| Date | Open | Close | Volume |');
  lines.push('|------|------|-------|--------|');
  for (const row of items.slice(0, 20) as Rec[]) {
    lines.push(`| ${row.time ?? row.date ?? '—'} | ${fmtPrice(row.open)} | ${fmtPrice(row.close)} | ${fmtNum(row.volume)} |`);
  }
  if (items.length > 20) lines.push(`... and ${items.length - 20} more rows`);
  return lines.join('\n');
}

export function formatNews(data: unknown): string {
  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) return 'No news articles found.';
  return items.map((item, i) => {
    const d = item as Rec;
    const date = d.date ? String(d.date).slice(0, 10) : '';
    const source = d.source ?? '';
    return `${i + 1}. ${d.title}${source ? ` — ${source}` : ''}${date ? `, ${date}` : ''}`;
  }).join('\n');
}

export function formatInsiderTrades(data: unknown): string {
  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) return 'No insider trades found.';
  // Totals cover ALL rows so aggregate questions ("how much did X sell?")
  // are answerable even though the table below is truncated.
  const totals = new Map<string, { count: number; shares: number; value: number }>();
  for (const row of items as Rec[]) {
    const type = String(row.transaction_type ?? 'Other');
    const t = totals.get(type) ?? { count: 0, shares: 0, value: 0 };
    t.count += 1;
    t.shares += Number(row.transaction_shares) || 0;
    t.value += Number(row.transaction_value) || 0;
    totals.set(type, t);
  }
  const lines = [`Insider Trades — ${items.length} transactions`, ''];
  lines.push('Totals by type (all rows):');
  for (const [type, t] of totals) {
    lines.push(`- ${type}: ${t.count} txns, ${fmtNum(t.shares)} shares, $${fmtNum(t.value)}`);
  }
  lines.push('');
  lines.push('| Name | Title | Type | Shares | Price | Value | Owned After | Date |');
  lines.push('|------|-------|------|--------|-------|-------|-------------|------|');
  for (const row of items.slice(0, 15) as Rec[]) {
    const title = row.title ?? (row.is_board_director ? 'Director' : '—');
    lines.push(`| ${row.name ?? '—'} | ${title} | ${row.transaction_type ?? '—'} | ${fmtNum(row.transaction_shares)} | ${fmtPrice(row.transaction_price_per_share)} | ${fmtNum(row.transaction_value)} | ${fmtNum(row.shares_owned_after_transaction)} | ${String(row.filing_date ?? row.transaction_date ?? '').slice(0, 10)} |`);
  }
  if (items.length > 15) lines.push(`... and ${items.length - 15} more rows (totals above cover all rows)`);
  return lines.join('\n');
}

export function formatEarnings(data: unknown): string {
  const d = (data && typeof data === 'object' && !Array.isArray(data)) ? data as Rec : {};
  if (Object.keys(d).length === 0) return 'No earnings data available.';
  const ticker = (d.ticker as string)?.toUpperCase() ?? '';
  const when = [d.report_date, d.report_time].filter(Boolean).join(', ');
  const lines = [`${ticker} Latest Earnings${when ? ` — ${when}` : ''}`, ''];
  lines.push(`EPS: ${fmtPrice(d.eps_actual)} actual vs ${fmtPrice(d.eps_estimate)} estimate`);
  if (d.eps_surprise != null) {
    const surprise = Number(d.eps_surprise);
    const label = surprise > 0 ? 'BEAT' : surprise < 0 ? 'MISS' : 'MEET';
    // eps_surprise_percent is already a percentage (6.88 = 6.88%).
    const pct = d.eps_surprise_percent != null ? ` (${Number(d.eps_surprise_percent).toFixed(2)}%)` : '';
    lines.push(`EPS Surprise: ${label} ${fmtPrice(surprise)}${pct}`);
  }
  return lines.join('\n');
}

export function formatMarketMovers(data: unknown): string {
  const d = (data && typeof data === 'object') ? data as Rec : {};
  const gainers = Array.isArray(d.gainers) ? (d.gainers as Rec[]) : [];
  const losers = Array.isArray(d.losers) ? (d.losers as Rec[]) : [];
  if (gainers.length === 0 && losers.length === 0) return 'No market movers data available.';

  const lines: string[] = [];
  const ts = d.retrieved_at ? ` · as of ${String(d.retrieved_at)}` : '';
  lines.push(`US Market Movers${ts}`);
  lines.push('');

  function renderTable(title: string, rows: Rec[]): void {
    lines.push(`**${title}**`);
    lines.push('| Symbol | Name | Price | Chg | % Chg | Volume |');
    lines.push('|--------|------|-------|-----|-------|--------|');
    for (const row of rows.slice(0, 10)) {
      const name = String(row.name ?? '—').slice(0, 32);
      const pct = Number(row.percent_change ?? 0);
      lines.push(
        `| ${row.symbol ?? '—'} | ${name} | ${fmtPrice(row.price)} | ${fmtPrice(row.change)} | ${pct.toFixed(2)}% | ${fmtNum(row.volume)} |`,
      );
    }
    lines.push('');
  }

  if (gainers.length) renderTable('Top Gainers', gainers);
  if (losers.length) renderTable('Top Losers', losers);
  return lines.join('\n').trimEnd();
}

export function formatCryptoPrice(data: unknown): string {
  const d = (data && typeof data === 'object') ? data as Rec : {};
  const ticker = (d.ticker as string)?.toUpperCase() ?? '';
  // Only surface OHLC/volume when the snapshot actually carries them; the
  // last-trade snapshot has just price + day change.
  const extras: string[] = [];
  if (d.high != null || d.low != null) extras.push(`H: ${fmtPrice(d.high)} L: ${fmtPrice(d.low)}`);
  if (d.volume != null) extras.push(`Vol: ${fmtNum(d.volume)}`);
  if (d.day_change_percent != null) extras.push(`${Number(d.day_change_percent) >= 0 ? '+' : ''}${Number(d.day_change_percent).toFixed(2)}% today`);
  return `${ticker}: ${fmtPrice(d.price ?? d.close)}${extras.length ? ` (${extras.join(' ')})` : ''}`;
}

// ---------------------------------------------------------------------------
// Formatter registry — maps sub-tool names to formatters
// ---------------------------------------------------------------------------

export const FINANCIAL_FORMATTERS: Record<string, (data: unknown, args?: Rec) => string> = {
  get_income_statements: formatIncomeStatements,
  get_balance_sheets: formatBalanceSheets,
  get_cash_flow_statements: formatCashFlowStatements,
  get_all_financial_statements: formatAllFinancials,
  get_key_ratios: formatKeyRatios,
  get_earnings: formatEarnings,
};

export const MARKET_DATA_FORMATTERS: Record<string, (data: unknown, args?: Rec) => string> = {
  get_stock_price: formatStockPrice,
  get_stock_prices: formatStockPrices,
  get_crypto_price_snapshot: formatCryptoPrice,
  get_crypto_prices: formatStockPrices,
  get_company_news: formatNews,
  get_insider_trades: formatInsiderTrades,
  get_market_movers: formatMarketMovers,
};
