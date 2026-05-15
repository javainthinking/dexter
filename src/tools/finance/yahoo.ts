/**
 * Yahoo Finance adapter — fallback data source when Financial Datasets fails.
 *
 * Each export returns an `ApiResponse`-shaped object (`{ data, url }`) whose
 * `data` matches the field names the existing tools expect from Financial
 * Datasets. The wrapping payload keys (`snapshot`, `prices`, `income_statements`,
 * `balance_sheets`, `cash_flow_statements`, `financials`, `news`) are preserved
 * so call sites do not need to change.
 *
 * Field coverage is intentionally a subset: we map what Yahoo reliably returns
 * and leave the rest as `null`. The LLM consuming these payloads handles missing
 * fields gracefully via the existing skill prompts.
 */
import YahooFinance from 'yahoo-finance2';
import type { ApiResponse } from './api.js';

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey', 'ripHistorical'],
});

/** FD `interval` (`day`/`week`/`month`/`year`) → Yahoo chart interval. */
const INTERVAL_MAP: Record<string, '1d' | '1wk' | '1mo' | '3mo'> = {
  day: '1d',
  week: '1wk',
  month: '1mo',
  // Yahoo chart has no yearly bucket — '3mo' is the coarsest non-monthly option.
  year: '3mo',
};

/** YYYY-MM-DD without timezone surprises (Yahoo returns UTC Date objects). */
function toIsoDate(value: Date | string | number | undefined): string | null {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function quoteUrl(ticker: string): string {
  return `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}/`;
}

function nullable<T>(value: T | undefined | null): T | null {
  return value === undefined ? null : (value as T | null);
}

/** Yahoo's debtToEquity is a percentage (e.g. 184.04); FD reports it as a decimal. */
function debtEquityToDecimal(value: number | undefined | null): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return value / 100;
}

// =============================================================================
// Price snapshot — wraps `data.snapshot`
// =============================================================================

export async function fetchYahooPriceSnapshot(ticker: string): Promise<ApiResponse> {
  const q = await yahooFinance.quote(ticker);
  const time = q.regularMarketTime instanceof Date ? q.regularMarketTime : null;

  return {
    data: {
      snapshot: {
        ticker: q.symbol ?? ticker,
        price: nullable(q.regularMarketPrice),
        day_change: nullable(q.regularMarketChange),
        day_change_percent: nullable(q.regularMarketChangePercent),
        time: time ? time.toISOString() : null,
        time_milliseconds: time ? time.getTime() : null,
      },
    },
    url: quoteUrl(ticker),
  };
}

// =============================================================================
// Historical prices — wraps `data.prices`
// =============================================================================

export async function fetchYahooHistoricalPrices(
  ticker: string,
  startDate: string,
  endDate: string,
  interval: 'day' | 'week' | 'month' | 'year',
): Promise<ApiResponse> {
  // Yahoo's chart `period2` is exclusive; FD's `end_date` is inclusive. Push
  // out one day so the user's requested end date is actually included.
  const endExclusive = new Date(endDate + 'T00:00:00Z');
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

  const result = await yahooFinance.chart(ticker, {
    period1: startDate,
    period2: endExclusive.toISOString().slice(0, 10),
    interval: INTERVAL_MAP[interval] ?? '1d',
  });

  const prices = (result.quotes ?? [])
    .filter((row) => row.close != null)
    .map((row) => ({
      ticker,
      open: nullable(row.open),
      close: nullable(row.close),
      high: nullable(row.high),
      low: nullable(row.low),
      volume: nullable(row.volume),
      time: toIsoDate(row.date),
    }));

  return {
    data: { ticker, prices },
    url: `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}/history`,
  };
}

// =============================================================================
// Fundamentals — income / balance / cash flow
// =============================================================================

/** Yahoo's `type` parameter matches FD's `period` for annual/quarterly; FD also accepts `ttm` which Yahoo only exposes as a `trailing` type. */
function mapPeriod(period: 'annual' | 'quarterly' | 'ttm'): 'annual' | 'quarterly' | 'trailing' {
  return period === 'ttm' ? 'trailing' : period;
}

/**
 * Yahoo returns at least ~5 years when `period1` is omitted, but the API requires
 * it. Use a fixed lookback large enough to cover any reasonable `limit`.
 */
function yahooLookbackStart(limit: number, period: 'annual' | 'quarterly' | 'ttm'): string {
  const yearsPerPeriod = period === 'annual' ? 1 : period === 'quarterly' ? 0.25 : 0.25;
  const years = Math.max(5, Math.ceil(limit * yearsPerPeriod) + 2);
  const start = new Date();
  start.setUTCFullYear(start.getUTCFullYear() - years);
  return start.toISOString().slice(0, 10);
}

type YahooFinancialsRow = Record<string, unknown> & {
  date?: Date | string;
  periodType?: string;
};

async function fetchYahooStatementRows(
  ticker: string,
  module: 'financials' | 'balance-sheet' | 'cash-flow',
  period: 'annual' | 'quarterly' | 'ttm',
  limit: number,
): Promise<YahooFinancialsRow[]> {
  const rows = (await yahooFinance.fundamentalsTimeSeries(ticker, {
    period1: yahooLookbackStart(limit, period),
    type: mapPeriod(period),
    module,
  })) as YahooFinancialsRow[];

  // Yahoo returns oldest → newest; tools expect newest-first ordering matching FD.
  const sorted = [...(rows ?? [])].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });
  return sorted.slice(0, limit);
}

function num(row: YahooFinancialsRow, key: string): number | null {
  const v = row[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function mapIncomeStatement(ticker: string, row: YahooFinancialsRow) {
  const reportPeriod = toIsoDate(row.date);
  return {
    ticker,
    report_period: reportPeriod,
    fiscal_period: row.periodType ?? null,
    revenue: num(row, 'totalRevenue'),
    cost_of_revenue: num(row, 'costOfRevenue'),
    gross_profit: num(row, 'grossProfit'),
    operating_expense: num(row, 'operatingExpense'),
    selling_general_and_administrative_expenses: num(row, 'sellingGeneralAndAdministration'),
    research_and_development: num(row, 'researchAndDevelopment'),
    operating_income: num(row, 'operatingIncome'),
    interest_expense: num(row, 'interestExpense'),
    ebit: num(row, 'EBIT'),
    ebitda: num(row, 'EBITDA'),
    income_tax_expense: num(row, 'taxProvision'),
    nonoperating_income_expense: num(row, 'otherNonOperatingIncomeExpenses'),
    net_income: num(row, 'netIncome'),
    net_income_common_stock: num(row, 'netIncomeCommonStockholders'),
    earnings_per_share: num(row, 'basicEPS'),
    earnings_per_share_diluted: num(row, 'dilutedEPS'),
    weighted_average_shares: num(row, 'basicAverageShares'),
    weighted_average_shares_diluted: num(row, 'dilutedAverageShares'),
  };
}

function mapBalanceSheet(ticker: string, row: YahooFinancialsRow) {
  return {
    ticker,
    report_period: toIsoDate(row.date),
    fiscal_period: row.periodType ?? null,
    total_assets: num(row, 'totalAssets'),
    current_assets: num(row, 'currentAssets'),
    cash_and_equivalents: num(row, 'cashAndCashEquivalents'),
    inventory: num(row, 'inventory'),
    current_investments: num(row, 'otherShortTermInvestments'),
    trade_and_non_trade_receivables: num(row, 'accountsReceivable'),
    non_current_assets: num(row, 'totalNonCurrentAssets'),
    property_plant_and_equipment: num(row, 'netPPE'),
    goodwill_and_intangible_assets: num(row, 'goodwillAndOtherIntangibleAssets'),
    investments: num(row, 'investmentsAndAdvances'),
    non_current_investments: num(row, 'longTermInvestments'),
    total_liabilities: num(row, 'totalLiabilitiesNetMinorityInterest'),
    current_liabilities: num(row, 'currentLiabilities'),
    current_debt: num(row, 'currentDebt'),
    non_current_liabilities: num(row, 'totalNonCurrentLiabilitiesNetMinorityInterest'),
    long_term_debt: num(row, 'longTermDebt'),
    total_debt: num(row, 'totalDebt'),
    shareholders_equity: num(row, 'stockholdersEquity'),
    retained_earnings: num(row, 'retainedEarnings'),
    outstanding_shares: num(row, 'ordinarySharesNumber'),
  };
}

function mapCashFlow(ticker: string, row: YahooFinancialsRow) {
  // Yahoo reports capex as a negative number ("cash out"); FD reports it positive.
  const capex = num(row, 'capitalExpenditure');
  return {
    ticker,
    report_period: toIsoDate(row.date),
    fiscal_period: row.periodType ?? null,
    net_income: num(row, 'netIncomeFromContinuingOperations'),
    depreciation_and_amortization: num(row, 'depreciationAndAmortization'),
    share_based_compensation: num(row, 'stockBasedCompensation'),
    net_cash_flow_from_operations: num(row, 'operatingCashFlow'),
    net_cash_flow_from_investing: num(row, 'cashFlowFromContinuingInvestingActivities'),
    capital_expenditure: capex == null ? null : Math.abs(capex),
    business_acquisitions_and_disposals: num(row, 'purchaseOfBusiness'),
    investment_acquisitions_and_disposals: num(row, 'saleOfInvestment'),
    net_cash_flow_from_financing: num(row, 'cashFlowFromContinuingFinancingActivities'),
    issuance_or_repayment_of_debt_securities: num(row, 'netIssuancePaymentsOfDebt'),
    issuance_or_purchase_of_equity_shares: num(row, 'repurchaseOfCapitalStock'),
    dividends_and_other_cash_distributions: num(row, 'commonStockDividendPaid'),
    free_cash_flow: num(row, 'freeCashFlow'),
  };
}

export async function fetchYahooIncomeStatements(
  ticker: string,
  period: 'annual' | 'quarterly' | 'ttm',
  limit: number,
): Promise<ApiResponse> {
  const rows = await fetchYahooStatementRows(ticker, 'financials', period, limit);
  return {
    data: { income_statements: rows.map((r) => mapIncomeStatement(ticker, r)) },
    url: `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}/financials`,
  };
}

export async function fetchYahooBalanceSheets(
  ticker: string,
  period: 'annual' | 'quarterly' | 'ttm',
  limit: number,
): Promise<ApiResponse> {
  const rows = await fetchYahooStatementRows(ticker, 'balance-sheet', period, limit);
  return {
    data: { balance_sheets: rows.map((r) => mapBalanceSheet(ticker, r)) },
    url: `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}/balance-sheet`,
  };
}

export async function fetchYahooCashFlowStatements(
  ticker: string,
  period: 'annual' | 'quarterly' | 'ttm',
  limit: number,
): Promise<ApiResponse> {
  const rows = await fetchYahooStatementRows(ticker, 'cash-flow', period, limit);
  return {
    data: { cash_flow_statements: rows.map((r) => mapCashFlow(ticker, r)) },
    url: `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}/cash-flow`,
  };
}

export async function fetchYahooAllFinancials(
  ticker: string,
  period: 'annual' | 'quarterly' | 'ttm',
  limit: number,
): Promise<ApiResponse> {
  const [income, balance, cash] = await Promise.all([
    fetchYahooStatementRows(ticker, 'financials', period, limit),
    fetchYahooStatementRows(ticker, 'balance-sheet', period, limit),
    fetchYahooStatementRows(ticker, 'cash-flow', period, limit),
  ]);

  return {
    data: {
      financials: {
        income_statements: income.map((r) => mapIncomeStatement(ticker, r)),
        balance_sheets: balance.map((r) => mapBalanceSheet(ticker, r)),
        cash_flow_statements: cash.map((r) => mapCashFlow(ticker, r)),
      },
    },
    url: `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}/financials`,
  };
}

// =============================================================================
// Key ratios snapshot — wraps `data.snapshot`
// =============================================================================

export async function fetchYahooKeyRatiosSnapshot(ticker: string): Promise<ApiResponse> {
  const qs = await yahooFinance.quoteSummary(ticker, {
    modules: ['summaryDetail', 'defaultKeyStatistics', 'financialData', 'price'],
  });
  // The library's narrowed module types omit many optional fields. Cast to a
  // loose record so we can read whatever Yahoo actually returned without
  // declaring every possible field.
  const sd = (qs.summaryDetail ?? {}) as Record<string, number | undefined>;
  const ks = (qs.defaultKeyStatistics ?? {}) as Record<string, number | undefined>;
  const fd = (qs.financialData ?? {}) as Record<string, number | undefined>;

  return {
    data: {
      snapshot: {
        ticker,
        market_cap: nullable(sd.marketCap ?? qs.price?.marketCap),
        enterprise_value: nullable(ks.enterpriseValue),
        price_to_book_ratio: nullable(ks.priceToBook),
        price_to_earnings_ratio: nullable(sd.trailingPE),
        price_to_sales_ratio: nullable(sd.priceToSalesTrailing12Months),
        enterprise_value_to_ebitda_ratio: nullable(ks.enterpriseToEbitda),
        enterprise_value_to_revenue_ratio: nullable(ks.enterpriseToRevenue),
        free_cash_flow_yield: null,
        peg_ratio: nullable(ks.pegRatio),
        gross_margin: nullable(fd.grossMargins),
        operating_margin: nullable(fd.operatingMargins),
        net_margin: nullable(fd.profitMargins),
        return_on_equity: nullable(fd.returnOnEquity),
        return_on_assets: nullable(fd.returnOnAssets),
        return_on_invested_capital: null,
        asset_turnover: null,
        inventory_turnover: null,
        days_sales_outstanding: null,
        operating_cycle: null,
        debt_to_equity: debtEquityToDecimal(fd.debtToEquity),
        current_ratio: nullable(fd.currentRatio),
        quick_ratio: nullable(fd.quickRatio),
        revenue_growth: nullable(fd.revenueGrowth),
        earnings_growth: nullable(fd.earningsGrowth),
        free_cash_flow_per_share: null,
        book_value_per_share: nullable(ks.bookValue),
        revenue_per_share: nullable(fd.revenuePerShare),
        free_cash_flow: nullable(fd.freeCashflow),
        cash_flow_from_operations: nullable(fd.operatingCashflow),
        dividend_yield: nullable(sd.dividendYield),
      },
    },
    url: quoteUrl(ticker),
  };
}

// =============================================================================
// News — wraps `data.news`
// =============================================================================

export async function fetchYahooNews(ticker: string | undefined, limit: number): Promise<ApiResponse> {
  // Yahoo's `search` returns the most relevant news for a query. When no
  // ticker is given, the FD `/news/` endpoint returns broad market news;
  // Yahoo's closest analogue is searching for "market".
  const query = ticker?.trim() || 'market';
  const result = await yahooFinance.search(query, { newsCount: Math.max(1, Math.min(limit, 20)) });

  const news = (result.news ?? []).slice(0, limit).map((item) => {
    const date = item.providerPublishTime instanceof Date
      ? item.providerPublishTime
      : item.providerPublishTime
      ? new Date(item.providerPublishTime as string | number)
      : null;
    return {
      ticker: ticker ?? null,
      title: item.title ?? null,
      source: item.publisher ?? null,
      date: date ? date.toISOString() : null,
      url: item.link ?? null,
    };
  });

  return {
    data: { news },
    url: ticker
      ? `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}/news`
      : 'https://finance.yahoo.com/news/',
  };
}
