/**
 * Google Search Console data for the SEO / GEO loop
 * (loops/loop-gsc-optimization, filled by scripts/seo/gsc-pull.ts).
 *
 * Two cuts of the same data, and they answer different questions:
 *
 *   dexter_gsc_totals_daily — one row per (date, page) plus a page='' row
 *     for the whole site. Unbiased: every total, CTR and expected-click
 *     figure comes from here.
 *   dexter_gsc_daily — (date, page, query, country, device). GSC drops
 *     anonymised low-volume cells from this cut, so it under-counts and the
 *     coverage drifts over time. Query-level analysis only; never compare
 *     its absolute numbers with site totals.
 *
 * Re-pulling a date replaces that date's rows (GSC restates recent days).
 */

import { pgTable, bigserial, date, text, integer, doublePrecision, index, unique } from 'drizzle-orm/pg-core';

export const gscDaily = pgTable(
  'dexter_gsc_daily',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    date: date('date').notNull(),
    page: text('page').notNull(),
    query: text('query').notNull(),
    country: text('country').notNull(),
    device: text('device').notNull(),
    clicks: integer('clicks').notNull().default(0),
    impressions: integer('impressions').notNull().default(0),
    ctr: doublePrecision('ctr').notNull().default(0),
    position: doublePrecision('position').notNull().default(0),
  },
  (t) => [
    unique('dexter_gsc_daily_key').on(t.date, t.page, t.query, t.country, t.device),
    index('dexter_gsc_daily_date').on(t.date),
    index('dexter_gsc_daily_page').on(t.page),
  ],
);

export const gscTotalsDaily = pgTable(
  'dexter_gsc_totals_daily',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    date: date('date').notNull(),
    /** Full URL, or '' for the site-wide row. */
    page: text('page').notNull(),
    clicks: integer('clicks').notNull().default(0),
    impressions: integer('impressions').notNull().default(0),
    ctr: doublePrecision('ctr').notNull().default(0),
    position: doublePrecision('position').notNull().default(0),
  },
  (t) => [
    unique('dexter_gsc_totals_daily_key').on(t.date, t.page),
    index('dexter_gsc_totals_daily_date').on(t.date),
  ],
);
