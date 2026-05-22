'use client';

import * as React from 'react';
// formatNum is a tiny number-formatter shared with the indicator cards.
// Keeping the import points at the original module so we don't fork the
// helper just because the panel moved namespaces — the helper itself is
// not market-specific and refactoring it would be scope creep.
import { formatNum } from '../indicators/card-shell';

interface Mover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent_change: number;
  volume: number;
  exchange?: string | null;
}

interface MoversData {
  asOf: string;
  gainers: Mover[];
  losers: Mover[];
  market?: string | null;
  retrieved_at?: string | null;
}

export function MoversPanel({ data, dict }: { data: MoversData; dict: any }) {
  // _localeHint is a per-namespace marker every dictionary carries; read
  // it from the market namespace now that the panel lives there. Falls
  // back to indicators for backwards compatibility while dictionaries
  // roll out (no-op once every locale ships the market namespace).
  const isZh =
    (dict.market?._localeHint ?? dict.indicators?._localeHint) === 'zh';

  return (
    <div className="space-y-4">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">
          {isZh ? '美股盘中风向标' : 'US Market Movers'}
        </h2>
        {data.retrieved_at && (
          <span className="text-xs text-muted-foreground">
            {isZh ? '更新于 ' : 'Updated '} {data.retrieved_at}
          </span>
        )}
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <MoversList
          title={isZh ? '🔥 涨幅榜' : '🔥 Top Gainers'}
          rows={data.gainers}
          accent="up"
        />
        <MoversList
          title={isZh ? '❄️ 跌幅榜' : '❄️ Top Losers'}
          rows={data.losers}
          accent="down"
        />
      </div>
    </div>
  );
}

function MoversList({
  title,
  rows,
  accent,
}: {
  title: string;
  rows: Mover[];
  accent: 'up' | 'down';
}) {
  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden">
      <header className="border-b border-border px-3 py-2 text-sm font-semibold">{title}</header>
      <div className="divide-y divide-border">
        {rows.slice(0, 15).map((r) => (
          <div key={r.symbol} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-xs font-semibold">{r.symbol}</div>
              <div className="truncate text-xs text-muted-foreground">{r.name}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs font-semibold">${formatNum(r.price, 2)}</div>
              <div
                className={
                  'font-mono text-[11px] ' + (accent === 'up' ? 'text-rose-500' : 'text-emerald-500')
                }
              >
                {r.percent_change >= 0 ? '+' : ''}
                {r.percent_change.toFixed(2)}%
              </div>
            </div>
            <div className="hidden text-right text-[11px] text-muted-foreground sm:block">
              {formatNum(r.volume, 0)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
