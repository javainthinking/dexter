/**
 * dexter_portfolios / dexter_portfolio_holdings — user-managed equity
 * portfolios for the /indicators page (and any future portfolio-aware
 * tools).
 *
 * Design notes:
 *
 * - Per-user cap (5 portfolios) is enforced in the API layer, not as a DB
 *   constraint, so we can raise the limit per-user later without a
 *   migration.
 * - `(user_id, name)` is unique so a user can't create two portfolios
 *   with the same name — saves the UI from having to disambiguate.
 * - `(portfolio_id, ticker)` is unique so adding the same symbol twice
 *   updates rather than duplicates.
 * - `display_name` + `exchange` are cached at add-time so the UI can show
 *   "0700.HK · 腾讯控股 · HKEX" without re-hitting the symbol search on
 *   every render. The cache is best-effort — names can drift after IPO
 *   renames or M&A but those are rare and a manual re-add fixes it.
 * - `weight` is nullable: the product spec says weight is optional and
 *   blank means "user didn't specify a percentage". Stored as numeric so
 *   downstream math (weighted indicators) stays precise even with values
 *   like 33.3333%.
 * - `position` lets the UI preserve add-order or user-driven reordering
 *   without changing the (portfolio_id, ticker) primary identity.
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  integer,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './auth.js';

export const portfolios = pgTable(
  'dexter_portfolios',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index('dexter_portfolios_user_idx').on(t.userId),
    userNameUniq: uniqueIndex('dexter_portfolios_user_name_uniq').on(t.userId, t.name),
  }),
);

export const portfolioHoldings = pgTable(
  'dexter_portfolio_holdings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    portfolioId: uuid('portfolio_id')
      .notNull()
      .references(() => portfolios.id, { onDelete: 'cascade' }),
    ticker: text('ticker').notNull(),
    displayName: text('display_name'),
    exchange: text('exchange'),
    weight: numeric('weight', { precision: 7, scale: 4 }),
    position: integer('position').notNull().default(0),
    addedAt: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    portfolioIdx: index('dexter_portfolio_holdings_portfolio_idx').on(t.portfolioId),
    portfolioTickerUniq: uniqueIndex('dexter_portfolio_holdings_pt_uniq').on(
      t.portfolioId,
      t.ticker,
    ),
  }),
);

export type Portfolio = typeof portfolios.$inferSelect;
export type NewPortfolio = typeof portfolios.$inferInsert;
export type PortfolioHolding = typeof portfolioHoldings.$inferSelect;
export type NewPortfolioHolding = typeof portfolioHoldings.$inferInsert;
