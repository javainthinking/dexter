import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { stripFieldsDeep, withFallbackChain } from './api.js';
import { formatToolResult } from '../types.js';
import {
  fetchYahooIncomeStatements,
  fetchYahooBalanceSheets,
  fetchYahooCashFlowStatements,
  fetchYahooAllFinancials,
} from './yahoo.js';
import { fetchValyuCashFlowStatements, fetchValyuIncomeStatements } from './valyu.js';

const REDUNDANT_FINANCIAL_FIELDS = ['accession_number', 'currency', 'period'] as const;

const FinancialStatementsInputSchema = z.object({
  ticker: z
    .string()
    .describe(
      "The stock ticker symbol to fetch financial statements for. For example, 'AAPL' for Apple."
    ),
  period: z
    .enum(['annual', 'quarterly', 'ttm'])
    .describe(
      "The reporting period for the financial statements. 'annual' for yearly, 'quarterly' for quarterly, and 'ttm' for trailing twelve months."
    ),
  limit: z
    .number()
    .default(4)
    .describe(
      'Maximum number of report periods to return (default: 4). Returns the most recent N periods based on the period type. Increase this for longer historical analysis when needed.'
    ),
});

export const getIncomeStatements = new DynamicStructuredTool({
  name: 'get_income_statements',
  description: `Fetches a company's income statements, detailing its revenues, expenses, net income, etc. over a reporting period. Useful for evaluating a company's profitability and operational efficiency.`,
  schema: FinancialStatementsInputSchema,
  func: async (input) => {
    const ticker = input.ticker.trim().toUpperCase();
    const { data, url } = await withFallbackChain(
      `income-statements ${ticker} ${input.period}`,
      [
        { name: 'valyu', run: () => fetchValyuIncomeStatements(ticker, input.limit) },
        { name: 'yahoo', run: () => fetchYahooIncomeStatements(ticker, input.period, input.limit) },
      ],
    );
    return formatToolResult(
      stripFieldsDeep(data.income_statements || {}, REDUNDANT_FINANCIAL_FIELDS),
      [url]
    );
  },
});

export const getBalanceSheets = new DynamicStructuredTool({
  name: 'get_balance_sheets',
  description: `Retrieves a company's balance sheets, providing a snapshot of its assets, liabilities, shareholders' equity, etc. at a specific point in time. Useful for assessing a company's financial position.`,
  schema: FinancialStatementsInputSchema,
  func: async (input) => {
    const ticker = input.ticker.trim().toUpperCase();
    const { data, url } = await fetchYahooBalanceSheets(ticker, input.period, input.limit);
    return formatToolResult(
      stripFieldsDeep(data.balance_sheets || {}, REDUNDANT_FINANCIAL_FIELDS),
      [url]
    );
  },
});

export const getCashFlowStatements = new DynamicStructuredTool({
  name: 'get_cash_flow_statements',
  description: `Retrieves a company's cash flow statements, showing how cash is generated and used across operating, investing, and financing activities. Useful for understanding a company's liquidity and solvency.`,
  schema: FinancialStatementsInputSchema,
  func: async (input) => {
    const ticker = input.ticker.trim().toUpperCase();
    const { data, url } = await withFallbackChain(
      `cash-flow-statements ${ticker} ${input.period}`,
      [
        { name: 'valyu', run: () => fetchValyuCashFlowStatements(ticker, input.limit) },
        { name: 'yahoo', run: () => fetchYahooCashFlowStatements(ticker, input.period, input.limit) },
      ],
    );
    return formatToolResult(
      stripFieldsDeep(data.cash_flow_statements || {}, REDUNDANT_FINANCIAL_FIELDS),
      [url]
    );
  },
});

export const getAllFinancialStatements = new DynamicStructuredTool({
  name: 'get_all_financial_statements',
  description: `Retrieves all three financial statements (income statements, balance sheets, and cash flow statements) for a company in a single call. This is more efficient than calling each statement type separately when you need all three for comprehensive financial analysis.`,
  schema: FinancialStatementsInputSchema,
  func: async (input) => {
    const ticker = input.ticker.trim().toUpperCase();
    const { data, url } = await fetchYahooAllFinancials(ticker, input.period, input.limit);
    return formatToolResult(
      stripFieldsDeep(data.financials || {}, REDUNDANT_FINANCIAL_FIELDS),
      [url]
    );
  },
});

