import { describe, expect, test } from 'bun:test';
import { splitIndicatorBlocks } from './answer-body';
import { parseIndicatorTickers } from './indicator-cards';

describe('splitIndicatorBlocks', () => {
  test('pulls a trailing indicators block out of the markdown', () => {
    const segs = splitIndicatorBlocks('NVDA looks strong.\n\n```indicators\nNVDA\n0700.HK\n```\n');
    expect(segs).toEqual([
      { kind: 'md', text: 'NVDA looks strong.\n\n' },
      { kind: 'cards', tickers: ['NVDA', '0700.HK'] },
    ]);
  });

  test('keeps text after a mid-answer block and leaves other code fences alone', () => {
    const segs = splitIndicatorBlocks('A\n```indicators\naapl\n```\nB\n```python\nx = 1\n```');
    expect(segs.map((s) => s.kind)).toEqual(['md', 'cards', 'md']);
    expect(segs[1]).toEqual({ kind: 'cards', tickers: ['AAPL'] });
    expect((segs[2] as { text: string }).text).toContain('```python');
  });

  test('drops an unclosed block instead of rendering a raw fence', () => {
    expect(splitIndicatorBlocks('Text\n```indicators\nNVDA')).toEqual([{ kind: 'md', text: 'Text\n' }]);
  });

  test('plain answers pass through untouched', () => {
    expect(splitIndicatorBlocks('just text')).toEqual([{ kind: 'md', text: 'just text' }]);
  });
});

describe('parseIndicatorTickers', () => {
  test('normalises, dedupes, caps at 4 and ignores junk', () => {
    expect(parseIndicatorTickers('- nvda\n`TSLA`\nNVDA\n600519.SS, 0700.HK\nBRK-B\nnot a ticker!')).toEqual([
      'NVDA',
      'TSLA',
      '600519.SS',
      '0700.HK',
    ]);
  });
});
