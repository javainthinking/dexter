import 'server-only';
import { z } from 'zod';
import type { StructuredToolInterface } from '@langchain/core/tools';
import {
  getStockPrice,
  getStockPrices,
  getIncomeStatements,
  getBalanceSheets,
  getCashFlowStatements,
  getKeyRatios,
  getHistoricalKeyRatios,
  getFinancialSegments,
  getFilings,
  getInsiderTrades,
  getEarnings,
  getMarketMovers,
} from '@dexter/core/tools/finance/index';

/**
 * Finance tools exposed to the desktop agent. The desktop never holds the
 * data-provider keys: it fetches this catalog (name, description, JSON
 * Schema) and registers each entry as a local agent tool whose executor
 * calls back into POST /api/desktop/finance/<name>.
 *
 * Only atomic, deterministic data tools belong here. The LLM-routed
 * meta-tools (get_financials / get_market_data) would bill a second model
 * call per invocation server-side; the desktop agent routes itself.
 */
const TOOLS: readonly StructuredToolInterface[] = [
  getStockPrice,
  getStockPrices,
  getIncomeStatements,
  getBalanceSheets,
  getCashFlowStatements,
  getKeyRatios,
  getHistoricalKeyRatios,
  getFinancialSegments,
  getFilings,
  getInsiderTrades,
  getEarnings,
  getMarketMovers,
];

const BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

export interface DesktopToolDescriptor {
  name: string;
  description: string;
  inputSchema: unknown;
}

export function listDesktopFinanceTools(): DesktopToolDescriptor[] {
  return TOOLS.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: z.toJSONSchema(t.schema as z.ZodType),
  }));
}

export function getDesktopFinanceTool(name: string): StructuredToolInterface | undefined {
  return BY_NAME.get(name);
}
