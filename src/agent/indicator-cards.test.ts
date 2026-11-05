import { describe, expect, test } from 'bun:test';
import { appendIndicatorBlock, hasIndicatorBlock, parseTickerReply } from './indicator-cards.js';

describe('parseTickerReply', () => {
  test('accepts the supported markets and normalises', () => {
    expect(parseTickerReply('{"tickers": ["nvda", "0700.HK", "600519.SS", "300750.SZ", "BRK.B"]}')).toEqual([
      'NVDA',
      '0700.HK',
      '600519.SS',
    ]);
    expect(parseTickerReply('```json\n{"tickers": ["BRK.B"]}\n```')).toEqual(['BRK-B']);
  });

  test('drops unsupported symbols, duplicates and junk', () => {
    expect(parseTickerReply('{"tickers": ["^GSPC", "BTC-USD", "EURUSD=X", "AAPL", "AAPL", 3]}')).toEqual(['AAPL']);
    expect(parseTickerReply('{"tickers": []}')).toEqual([]);
    expect(parseTickerReply('no json here')).toEqual([]);
    expect(parseTickerReply('{"tickers": "AAPL"}')).toEqual([]);
  });
});

describe('appendIndicatorBlock', () => {
  test('appends a fenced block, or leaves the answer alone when empty', () => {
    expect(appendIndicatorBlock('Answer.\n', ['NVDA', '0700.HK'])).toBe('Answer.\n\n```indicators\nNVDA\n0700.HK\n```\n');
    expect(appendIndicatorBlock('Answer.', [])).toBe('Answer.');
    expect(hasIndicatorBlock(appendIndicatorBlock('A', ['TSLA']))).toBe(true);
  });
});
