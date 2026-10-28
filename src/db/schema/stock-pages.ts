/**
 * dexter_stock_pages — public /stocks/[slug] pages generated on demand.
 *
 * The 26 curated tickers live in code (apps/web/lib/stocks/universe.ts);
 * every other ticker gets a row here the first time its page resolves,
 * so the sitemap can list it. A ticker that exists keeps its URL for
 * good — only the data behind the page changes day to day.
 *
 * Names are cached from the symbol feeds at first resolve, which also
 * lets a page keep rendering when those feeds are briefly down.
 */

import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';

export const stockPages = pgTable(
  'dexter_stock_pages',
  {
    /** Canonical page slug: `coin`, `2318-hk`, `601127-sh`. */
    slug: text('slug').primaryKey(),
    /** Yahoo-style ticker the price chain understands. */
    ticker: text('ticker').notNull(),
    /** 'us' | 'hk' | 'cn' — soft enum, derived from the slug. */
    market: text('market').notNull(),
    exchange: text('exchange').notNull(),
    nameEn: text('name_en').notNull(),
    nameZh: text('name_zh').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    /** Last time the symbol feeds re-confirmed the ticker (≤ weekly). */
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('dexter_stock_pages_created').on(t.createdAt)],
);

export type StockPageRow = typeof stockPages.$inferSelect;
