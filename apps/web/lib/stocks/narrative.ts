import 'server-only';

import { unstable_cache } from 'next/cache';
import { MEMORYLAKE_LLM_BASE_URL } from '@dexter/core/providers';
import { DIMENSION_KEYS, type DimensionKey } from '../indicators/labels';
import type { Bucket } from '../indicators/math';
import { latestTally, toneOf, type StockSnapshot, type Tone } from './snapshot';
import { displaySymbol, stockName, type StockEntry } from './universe';

/**
 * The "what happened over the last five sessions" read under the chart.
 *
 * Two layers:
 *   1. `buildFacts` turns a snapshot into a small, fully deterministic
 *      fact sheet (prices, today's calls, persistence, flips, levels).
 *   2. An LLM rewrites those facts into readable prose, cached per
 *      (ticker, fact sheet, language) for a day — so it runs once per
 *      ticker per data refresh, not once per visitor. If the model is
 *      unavailable or its output fails validation, a template renders
 *      the same facts instead. Either way the text only restates
 *      computed numbers; nothing in it is a forecast or a recommendation.
 */

export type NarrativeLang = 'en' | 'zh-CN' | 'zh-TW';

export interface Narrative {
  paragraphs: string[];
  source: 'ai' | 'template';
}

interface NarrativeFacts {
  symbol: string;
  name: string;
  asOf: string;
  close: number | null;
  changePct: number | null;
  fiveDayChangePct: number | null;
  fiveDayHigh: number | null;
  fiveDayLow: number | null;
  tally: { bullish: number; bearish: number; neutral: number };
  tone: Tone;
  latest: Record<DimensionKey, Bucket>;
  /** Days (of 5) each dimension read bullish / bearish. */
  persistence: Record<DimensionKey, { bullish: number; bearish: number }>;
  /** Most recent change of call inside the window, per dimension that changed. */
  flips: Array<{ dim: DimensionKey; from: Bucket; to: Bucket; date: string }>;
  levels: {
    rsi: number | null;
    ma5: number | null;
    ma20: number | null;
    ma60: number | null;
    adx: number | null;
    volRatio: number | null;
    k: number | null;
    d: number | null;
  };
}

export function buildFacts(snapshot: StockSnapshot, stock: StockEntry, lang: NarrativeLang): NarrativeFacts {
  const tally = latestTally(snapshot);
  const window = snapshot.prices.slice(-5).map((p) => p.close).filter((c): c is number => c != null);
  const latest = {} as Record<DimensionKey, Bucket>;
  const persistence = {} as Record<DimensionKey, { bullish: number; bearish: number }>;
  const flips: NarrativeFacts['flips'] = [];
  for (const k of DIMENSION_KEYS) {
    const dim = snapshot.dims[k];
    latest[k] = dim.bucket;
    const trail = dim.bucketTrend;
    persistence[k] = {
      bullish: trail.filter((s) => s.bucket === 'bullish').length,
      bearish: trail.filter((s) => s.bucket === 'bearish').length,
    };
    for (let i = trail.length - 1; i > 0; i--) {
      if (trail[i].bucket !== trail[i - 1].bucket) {
        flips.push({ dim: k, from: trail[i - 1].bucket, to: trail[i].bucket, date: trail[i].time });
        break;
      }
    }
  }
  const x = (k: DimensionKey, field: string) => snapshot.dims[k].latestExtras[field] ?? null;
  return {
    symbol: displaySymbol(stock),
    name: stockName(stock, lang),
    asOf: snapshot.asOf,
    close: snapshot.close,
    changePct: snapshot.changePct,
    fiveDayChangePct: snapshot.fiveDayChangePct,
    fiveDayHigh: window.length ? Math.max(...window) : null,
    fiveDayLow: window.length ? Math.min(...window) : null,
    tally,
    tone: toneOf(tally),
    latest,
    persistence,
    flips,
    levels: {
      rsi: x('rsi', 'rsi'),
      ma5: x('ma', 'ma5'),
      ma20: x('ma', 'ma20'),
      ma60: x('ma', 'ma60'),
      adx: x('adx', 'adx'),
      volRatio: x('volume', 'volRatio'),
      k: x('kdj', 'k'),
      d: x('kdj', 'd'),
    },
  };
}

// ─── Template ──────────────────────────────────────────────────────

const DIM_NAMES: Record<NarrativeLang, Record<DimensionKey, string>> = {
  en: {
    macd: 'MACD', ma: 'moving averages', rsi: 'RSI', kdj: 'KDJ',
    boll: 'Bollinger Bands', adx: 'ADX', volume: 'volume', flow: 'estimated money flow',
  },
  'zh-CN': {
    macd: 'MACD', ma: '均线', rsi: 'RSI', kdj: 'KDJ',
    boll: '布林带', adx: 'ADX', volume: '成交量', flow: '资金流(估算)',
  },
  'zh-TW': {
    macd: 'MACD', ma: '均線', rsi: 'RSI', kdj: 'KDJ',
    boll: '布林通道', adx: 'ADX', volume: '成交量', flow: '資金流(估算)',
  },
};

const BUCKET_WORD: Record<NarrativeLang, Record<Bucket, string>> = {
  en: { bullish: 'bullish', bearish: 'bearish', neutral: 'neutral' },
  'zh-CN': { bullish: '看多', bearish: '看空', neutral: '中性' },
  'zh-TW': { bullish: '看多', bearish: '看空', neutral: '中性' },
};

const TONE_WORD: Record<NarrativeLang, Record<Tone, string>> = {
  en: { bullish: 'leaning bullish', bearish: 'leaning bearish', mixed: 'mixed', neutral: 'neutral, wait-and-see' },
  'zh-CN': { bullish: '偏多', bearish: '偏空', mixed: '多空分歧', neutral: '中性观望' },
  'zh-TW': { bullish: '偏多', bearish: '偏空', mixed: '多空分歧', neutral: '中性觀望' },
};

function num(v: number | null, digits = 2): string {
  return v == null || !Number.isFinite(v) ? '—' : v.toFixed(digits);
}

function pct(v: number | null): string {
  if (v == null || !Number.isFinite(v)) return '—';
  return `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function list(items: string[], lang: NarrativeLang): string {
  if (lang !== 'en') return items.join('、');
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export function templateNarrative(f: NarrativeFacts, lang: NarrativeLang): string[] {
  const names = DIM_NAMES[lang];
  const byBucket = (b: Bucket) => DIMENSION_KEYS.filter((k) => f.latest[k] === b).map((k) => names[k]);
  const bulls = byBucket('bullish');
  const bears = byBucket('bearish');
  const persistent = DIMENSION_KEYS.flatMap((k) => {
    const p = f.persistence[k];
    if (p.bullish >= 3) return [{ k, b: 'bullish' as Bucket, n: p.bullish }];
    if (p.bearish >= 3) return [{ k, b: 'bearish' as Bucket, n: p.bearish }];
    return [];
  });
  const { rsi, ma20, ma60, adx, volRatio } = f.levels;
  const close = f.close;
  const out: string[] = [];

  if (lang === 'en') {
    out.push(
      `As of ${f.asOf}, ${f.name} (${f.symbol}) closed at ${num(close)}, ${pct(f.changePct)} on the day and ${pct(f.fiveDayChangePct)} over the last five sessions, with closes ranging from ${num(f.fiveDayLow)} to ${num(f.fiveDayHigh)}.`,
    );
    let p2 = `On the latest bar, ${f.tally.bullish} of 8 indicators read bullish, ${f.tally.bearish} bearish and ${f.tally.neutral} neutral — an overall ${TONE_WORD.en[f.tone]} picture.`;
    if (bulls.length) p2 += ` Bullish: ${list(bulls, lang)}.`;
    if (bears.length) p2 += ` Bearish: ${list(bears, lang)}.`;
    out.push(p2);
    const p3: string[] = [];
    for (const p of persistent) p3.push(`${cap(names[p.k])} read ${p.b} on ${p.n} of the last 5 days.`);
    for (const fl of f.flips.slice(0, 3)) {
      p3.push(`${cap(names[fl.dim])} moved from ${fl.from} to ${fl.to} on ${fl.date}.`);
    }
    out.push(p3.length ? p3.join(' ') : 'No indicator changed its call during the week; the signals were stable.');
    const p4: string[] = [];
    if (rsi != null) p4.push(`RSI(14) stands at ${num(rsi, 1)}${rsi >= 70 ? ', in overbought territory' : rsi <= 30 ? ', in oversold territory' : ', inside its normal range'}.`);
    if (close != null && ma20 != null) {
      p4.push(`The close is ${close >= ma20 ? 'above' : 'below'} its 20-day average (${num(ma20)})${ma60 != null ? ` and ${close >= ma60 ? 'above' : 'below'} the 60-day (${num(ma60)})` : ''}.`);
    }
    if (adx != null) p4.push(`ADX at ${num(adx, 1)} points to a ${adx >= 25 ? 'strong' : adx >= 20 ? 'developing' : 'weak'} trend.`);
    if (volRatio != null) p4.push(`Volume ran at ${num(volRatio)}× its 20-day average.`);
    if (p4.length) out.push(p4.join(' '));
    return out;
  }

  const tw = lang === 'zh-TW';
  const w = BUCKET_WORD[lang];
  out.push(
    `截至 ${f.asOf}，${f.name}（${f.symbol}）收于 ${num(close)}，当日 ${pct(f.changePct)}，近 5 个交易日累计 ${pct(f.fiveDayChangePct)}，收盘价区间 ${num(f.fiveDayLow)} – ${num(f.fiveDayHigh)}。`,
  );
  let p2 = `最新交易日 8 项指标中 ${f.tally.bullish} 项看多、${f.tally.bearish} 项看空、${f.tally.neutral} 项中性，整体${TONE_WORD[lang][f.tone]}。`;
  if (bulls.length) p2 += `看多信号：${list(bulls, lang)}。`;
  if (bears.length) p2 += `看空信号：${list(bears, lang)}。`;
  out.push(p2);
  const p3: string[] = [];
  for (const p of persistent) p3.push(`${names[p.k]}近 5 日中有 ${p.n} 天${w[p.b]}。`);
  for (const fl of f.flips.slice(0, 3)) p3.push(`${names[fl.dim]}于 ${fl.date} 由${w[fl.from]}转为${w[fl.to]}。`);
  out.push(p3.length ? p3.join('') : '本周各项指标信号未发生切换，整体保持稳定。');
  const p4: string[] = [];
  if (rsi != null) p4.push(`RSI(14) 为 ${num(rsi, 1)}，${rsi >= 70 ? '处于超买区' : rsi <= 30 ? '处于超卖区' : '处于正常区间'}。`);
  if (close != null && ma20 != null) {
    p4.push(`收盘价位于 20 日均线（${num(ma20)}）${close >= ma20 ? '上方' : '下方'}${ma60 != null ? `，60 日均线（${num(ma60)}）${close >= ma60 ? '上方' : '下方'}` : ''}。`);
  }
  if (adx != null) p4.push(`ADX 为 ${num(adx, 1)}，趋势强度${adx >= 25 ? '较强' : adx >= 20 ? '正在形成' : '偏弱'}。`);
  if (volRatio != null) p4.push(`成交量为 20 日均量的 ${num(volRatio)} 倍。`);
  if (p4.length) out.push(p4.join(''));
  return tw ? out.map(toTraditional) : out;
}

/** Simplified → Traditional for every glyph the zh template emits that differs. */
const TRAD: Record<string, string> = {
  '于': '於', '当': '當', '个': '個', '计': '計', '盘': '盤', '价': '價', '区': '區', '间': '間', '项': '項', '标': '標', '体': '體', '观': '觀', '号': '號', '线': '線', '带': '帶', '转': '轉', '为': '為', '发': '發', '换': '換', '处': '處', '买': '買', '卖': '賣', '势': '勢', '强': '強', '较': '較', '稳': '穩', '资': '資', '周': '週', '时': '時', '态': '態', '场': '場', '说': '說', '开': '開', '关': '關', '趋': '趨',
};

function toTraditional(s: string): string {
  return Array.from(s).map((ch) => TRAD[ch] ?? ch).join('');
}

function rel(a: number | null, b: number | null): 'above' | 'below' | 'equal' | null {
  if (a == null || b == null) return null;
  return a > b ? 'above' : a < b ? 'below' : 'equal';
}

/**
 * Self-describing key names for the model, so it can't misread what a
 * number means. Every above/below comparison is precomputed here — models
 * get "385.52 vs 411.70" wrong often enough that they must not do it.
 */
function describeFacts(f: NarrativeFacts) {
  const { ma5, ma20, ma60 } = f.levels;
  return {
    indicatorCount: DIMENSION_KEYS.length,
    ticker: f.symbol,
    company: f.name,
    latestTradingDay: f.asOf,
    latestClose: f.close,
    latestDayChangePct: f.changePct,
    fiveDayChangePct: f.fiveDayChangePct,
    fiveDayCloseRange: { lowestClose: f.fiveDayLow, highestClose: f.fiveDayHigh },
    latestDayTally: f.tally,
    latestDayOverallTone: f.tone,
    latestDaySignals: f.latest,
    daysOutOfLast5BullishOrBearish: f.persistence,
    signalChangesWithinLast5Days: f.flips,
    latestLevels: {
      rsi14: f.levels.rsi,
      movingAverage5: f.levels.ma5,
      movingAverage20: f.levels.ma20,
      movingAverage60: f.levels.ma60,
      adx14: f.levels.adx,
      volumeVs20DayAverage: f.levels.volRatio,
      kdjK: f.levels.k,
      kdjD: f.levels.d,
    },
    precomputedComparisons: {
      closeVsMovingAverage5: rel(f.close, ma5),
      closeVsMovingAverage20: rel(f.close, ma20),
      closeVsMovingAverage60: rel(f.close, ma60),
      movingAverage5VsMovingAverage20: rel(ma5, ma20),
      movingAverage20VsMovingAverage60: rel(ma20, ma60),
    },
  };
}

// ─── LLM ───────────────────────────────────────────────────────────

const LANG_INSTRUCTION: Record<NarrativeLang, string> = {
  en: 'Write in English.',
  'zh-CN': '用简体中文写作。',
  'zh-TW': '用繁體中文（台灣/香港用語）寫作。',
};

const BANNED = /\b(buy|sell|price target|we recommend|should invest)\b|买入|卖出|目标价|建议|買入|賣出|目標價|建議/i;

/** "9 indicators", "9 項中", "of 7" … — any indicator total other than 8 is a hallucination. */
const WRONG_COUNT = /\b(?:[0-79]|1\d)\s+(?:technical\s+)?indicators\b|\bof\s+(?:[0-79]|1\d)\s+(?:technical\s+)?indicators\b|(?:[0-79]|1\d)\s*[项項](?:指标|指標)?中(?!性)/i;

async function generateAi(facts: NarrativeFacts, lang: NarrativeLang): Promise<string[]> {
  const apiKey = process.env.MEMORYLAKE_API_KEY;
  if (!apiKey) throw new Error('MEMORYLAKE_API_KEY not set');
  const res = await fetch(`${MEMORYLAKE_LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(25_000),
    body: JSON.stringify({
      model: 'gpt-5.4-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            'You write the short technical-signal recap shown on a public stock page.',
            'Use ONLY the facts in the JSON the user sends. Never invent news, fundamentals, causes, or numbers.',
            'Describe what the indicators showed over the last 5 trading days: price move, the latest bullish/bearish/neutral balance, which signals persisted or flipped, and key levels (RSI, moving averages, ADX, volume).',
            'Counts in latestDayTally and latestDaySignals describe the most recent trading day only — never call them a 5-day count. fiveDayCloseRange is the lowest and highest CLOSE of the window, not intraday extremes.',
            'There are exactly indicatorCount (8) indicators. For any above/below statement use precomputedComparisons verbatim; never compare two numbers yourself.',
            'Refer to indicators by their common names (RSI, MACD, 20-day moving average, volume vs its 20-day average…); never print the JSON field names.',
            'Do not forecast prices, give price targets, or tell anyone to buy, sell, or hold. Neutral, factual, plain language for retail readers.',
            'Write 3 paragraphs, each 40-80 words (or 70-140 characters in Chinese). Mention the date and the ticker in the first paragraph.',
            'Return JSON: {"paragraphs": ["...", "...", "..."]}.',
            LANG_INSTRUCTION[lang],
          ].join('\n'),
        },
        { role: 'user', content: JSON.stringify(describeFacts(facts)) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`narrative LLM HTTP ${res.status}`);
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content ?? '';
  const parsed = JSON.parse(content) as { paragraphs?: unknown };
  const paragraphs = Array.isArray(parsed.paragraphs)
    ? parsed.paragraphs.filter((p): p is string => typeof p === 'string' && p.trim().length > 0).map((p) => p.trim())
    : [];
  if (paragraphs.length < 2 || paragraphs.length > 5) throw new Error('narrative LLM: bad paragraph count');
  if (paragraphs.some((p) => p.length > 900 || BANNED.test(p) || WRONG_COUNT.test(p))) {
    throw new Error('narrative LLM: output failed validation');
  }
  return paragraphs;
}

// Keyed by the whole fact sheet, so an intraday refresh of the snapshot
// (same date, new close) gets a fresh write-up instead of stale numbers.
const cachedAi = unstable_cache(generateAi, ['stock-narrative-v3'], {
  revalidate: 24 * 60 * 60,
  tags: ['stock-narrative'],
});

export async function getNarrative(
  snapshot: StockSnapshot,
  stock: StockEntry,
  lang: NarrativeLang,
): Promise<Narrative> {
  const facts = buildFacts(snapshot, stock, lang);
  try {
    return { paragraphs: await cachedAi(facts, lang), source: 'ai' };
  } catch (err) {
    console.warn(
      JSON.stringify({
        level: 'warn',
        route: '/stocks narrative',
        ticker: stock.ticker,
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return { paragraphs: templateNarrative(facts, lang), source: 'template' };
  }
}
