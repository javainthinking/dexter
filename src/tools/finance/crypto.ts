import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { formatToolResult } from '../types.js';
import { fetchYahooPriceSnapshot, fetchYahooHistoricalPrices } from './yahoo.js';

const CRYPTO_TICKER_FORMAT =
  "Ticker format: use 'CRYPTO-USD' for USD prices (e.g., 'BTC-USD') or 'CRYPTO-CRYPTO' for crypto-to-crypto prices (e.g., 'ETH-BTC' for Ethereum priced in Bitcoin).";

const CryptoPriceSnapshotInputSchema = z.object({
  ticker: z
    .string()
    .describe(
      "The crypto ticker symbol to fetch the price snapshot for. For example, 'BTC-USD' for Bitcoin."
    ),
});

export const getCryptoPriceSnapshot = new DynamicStructuredTool({
  name: 'get_crypto_price_snapshot',
  description: `Fetches the most recent price snapshot for a specific cryptocurrency: the latest price and the day's change. ${CRYPTO_TICKER_FORMAT}`,
  schema: CryptoPriceSnapshotInputSchema,
  func: async (input) => {
    const { data, url } = await fetchYahooPriceSnapshot(input.ticker.trim().toUpperCase());
    return formatToolResult(data.snapshot || {}, [url]);
  },
});

const CryptoPricesInputSchema = z.object({
  ticker: z
    .string()
    .describe(
      "The crypto ticker symbol to fetch historical prices for. For example, 'BTC-USD' for Bitcoin."
    ),
  interval: z
    .enum(['day', 'week', 'month', 'year'])
    .default('day')
    .describe("The time interval for price data. Defaults to 'day'."),
  start_date: z.string().describe('Start date in YYYY-MM-DD format. Required.'),
  end_date: z.string().describe('End date in YYYY-MM-DD format. Required.'),
});

export const getCryptoPrices = new DynamicStructuredTool({
  name: 'get_crypto_prices',
  description: `Retrieves historical price data for a cryptocurrency over a specified date range, including open, high, low, close prices, and volume. ${CRYPTO_TICKER_FORMAT}`,
  schema: CryptoPricesInputSchema,
  func: async (input) => {
    const { data, url } = await fetchYahooHistoricalPrices(
      input.ticker.trim().toUpperCase(),
      input.start_date,
      input.end_date,
      input.interval,
    );
    return formatToolResult(data.prices || [], [url]);
  },
});
