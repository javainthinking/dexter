import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { withFallbackChain } from './api.js';
import { formatToolResult } from '../types.js';
import { fetchYahooPriceSnapshot, fetchYahooHistoricalPrices } from './yahoo.js';
import { fetchValyuPriceSnapshot, fetchValyuHistoricalPrices } from './valyu.js';

export const STOCK_PRICE_DESCRIPTION = `
Fetches the current stock price snapshot for an equity: latest price and the day's change. For open/high/low/close and volume over a range, use historical prices. Powered by Valyu with Yahoo Finance as fallback.
`.trim();

const StockPriceInputSchema = z.object({
  ticker: z
    .string()
    .describe("The stock ticker symbol to fetch current price for. For example, 'AAPL' for Apple."),
});

export const getStockPrice = new DynamicStructuredTool({
  name: 'get_stock_price',
  description:
    "Fetches the current stock price snapshot for an equity ticker: the latest price and the day's change. Does not include intraday OHLC or volume — use get_stock_prices for historical OHLCV.",
  schema: StockPriceInputSchema,
  func: async (input) => {
    const ticker = input.ticker.trim().toUpperCase();
    const { data, url } = await withFallbackChain(`prices/snapshot ${ticker}`, [
      { name: 'valyu', run: () => fetchValyuPriceSnapshot(ticker) },
      { name: 'yahoo', run: () => fetchYahooPriceSnapshot(ticker) },
    ]);
    return formatToolResult(data.snapshot || {}, [url]);
  },
});

const StockPricesInputSchema = z.object({
  ticker: z
    .string()
    .describe("The stock ticker symbol to fetch historical prices for. For example, 'AAPL' for Apple."),
  interval: z
    .enum(['day', 'week', 'month', 'year'])
    .default('day')
    .describe("The time interval for price data. Defaults to 'day'."),
  start_date: z.string().describe('Start date in YYYY-MM-DD format. Required.'),
  end_date: z.string().describe('End date in YYYY-MM-DD format. Required.'),
});

export const getStockPrices = new DynamicStructuredTool({
  name: 'get_stock_prices',
  description:
    'Retrieves historical price data for a stock over a specified date range, including open, high, low, close prices and volume.',
  schema: StockPricesInputSchema,
  func: async (input) => {
    // Widen a same-day request (start_date == end_date) back a week so "price on
    // date X" queries return the row for X (or the nearest prior trading day).
    let startDate = input.start_date;
    if (startDate >= input.end_date) {
      const widened = new Date(input.end_date + 'T00:00:00');
      widened.setDate(widened.getDate() - 7);
      startDate = widened.toISOString().slice(0, 10);
    }
    const ticker = input.ticker.trim().toUpperCase();
    const { data, url } = await withFallbackChain(
      `prices ${ticker} ${startDate}..${input.end_date}`,
      [
        { name: 'valyu', run: () => fetchValyuHistoricalPrices(ticker, startDate, input.end_date, input.interval) },
        { name: 'yahoo', run: () => fetchYahooHistoricalPrices(ticker, startDate, input.end_date, input.interval) },
      ],
    );
    return formatToolResult(data.prices || [], [url]);
  },
});
