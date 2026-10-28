import { describe, expect, test } from 'bun:test';
import { STOCKS, matchCurated, slugToTicker, tickerToSlug } from './universe';

describe('tickerToSlug / slugToTicker', () => {
  test.each([
    ['NVDA', 'nvda', 'us'],
    ['BRK-B', 'brk-b', 'us'],
    ['0700.HK', '0700-hk', 'hk'],
    ['9988.HK', '9988-hk', 'hk'],
    ['600519.SS', '600519-sh', 'cn'],
    ['300750.SZ', '300750-sz', 'cn'],
  ])('%s ⇄ %s', (ticker, slug, market) => {
    expect(tickerToSlug(ticker)).toBe(slug);
    expect(slugToTicker(slug)).toEqual({ ticker, market: market as 'us' | 'hk' | 'cn' });
  });

  test('normalises loose input to the canonical slug', () => {
    expect(tickerToSlug('BRK.B')).toBe('brk-b');
    expect(slugToTicker('700-hk')?.ticker).toBe('0700.HK');
    expect(slugToTicker('NVDA')?.ticker).toBe('NVDA');
  });

  test('rejects anything outside US / HK / A-shares', () => {
    for (const t of ['^GSPC', 'EURUSD=X', '430047.BJ', 'BTC-USD', 'TOOLONG']) expect(tickerToSlug(t)).toBeNull();
    for (const s of ['abcdef', '12345-sh', 'nvda-us', '../etc', '']) expect(slugToTicker(s)).toBeNull();
  });

  test('every curated slug round-trips', () => {
    for (const s of STOCKS) expect(tickerToSlug(s.ticker)).toBe(s.slug);
  });
});

describe('matchCurated', () => {
  test('codes, names and dropped HK zeros', () => {
    expect(matchCurated('茅台')[0]?.slug).toBe('600519-sh');
    expect(matchCurated('700')[0]?.slug).toBe('0700-hk');
    expect(matchCurated('tencent')[0]?.slug).toBe('0700-hk');
    expect(matchCurated('NVDA')[0]?.slug).toBe('nvda');
  });

  test('exact code beats a name substring', () => {
    expect(matchCurated('amd')[0]?.slug).toBe('amd');
  });
});
