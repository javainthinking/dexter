export interface SlashCommand {
  name: string;
  description: string;
}

export const SLASH_COMMANDS: SlashCommand[] = [
  { name: 'model', description: 'Switch LLM provider and model' },
  { name: 'search', description: 'Choose preferred web search provider' },
  { name: 'rules', description: 'Show your research rules' },
  { name: 'clear', description: 'Clear the conversation' },
  { name: 'memory', description: 'Show what Dexter remembers about you' },
  { name: 'heartbeat', description: 'Show your heartbeat monitoring checklist' },
  { name: 'history', description: 'Show recent conversation summaries' },
  { name: 'macd', description: '持仓 MACD 维度可视化(零轴/金叉/死叉/红绿柱)' },
  { name: 'vol', description: '持仓量价分析(放量缩量与价格走势关系)' },
  { name: 'ma', description: '持仓均线分析(5/20/60 日均线与价格)' },
  { name: 'flow', description: '持仓主力资金流量(净流入/流出与价格)' },
  { name: 'movers', description: '美股今日涨跌榜 dashboard(Valyu 实时聚合)' },
  { name: 'help', description: 'Show keyboard shortcuts and tips' },
];

/**
 * Filter commands matching the current input.
 * Input should start with "/". Bare "/" returns all commands.
 */
export function matchCommands(input: string): SlashCommand[] {
  const query = input.slice(1).toLowerCase();
  if (query === '') return SLASH_COMMANDS;
  return SLASH_COMMANDS.filter(cmd => cmd.name.startsWith(query));
}
