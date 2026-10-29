/**
 * Pull Search Console data into dexter_gsc_daily + dexter_gsc_totals_daily.
 *
 *   bun run scripts/seo/gsc-pull.ts                     # resume from the last stored day
 *   bun run scripts/seo/gsc-pull.ts --days 90           # backfill the last 90 available days
 *   bun run scripts/seo/gsc-pull.ts --start 2026-09-01 --end 2026-09-30
 *
 * - GSC lags ~3 days, so the default end is today − 3.
 * - The default window resumes from max(date) − 2 rather than a fixed look-back:
 *   a fixed window silently loses a day whenever a round is skipped.
 * - Each date is replaced wholesale inside a transaction (GSC restates recent days).
 * - Tables come from src/db/migrations/0011_gsc.sql (bun run scripts/apply-0011.ts).
 */

import { addDays, arg, db, fmt, gscSiteBase, gscToken, latestAvailable, requireEnv, T_DAILY, T_TOTALS } from './lib';

requireEnv('GSC_SERVICE_ACCOUNT_KEY_FILE', 'GSC_SITE_URL');

const MAX_AUTO_DAYS = 30;
const ROW_LIMIT = 25_000;
const sql = db();

const [exists] = await sql`select to_regclass(${`public.${T_TOTALS}`}) as t`;
if (!exists.t) {
  console.error(`❌ ${T_TOTALS} does not exist — run: bun run scripts/apply-0011.ts`);
  process.exit(1);
}

const end = arg('end') ? new Date(`${arg('end')}T00:00:00Z`) : latestAvailable();
let start: Date;
if (arg('start')) start = new Date(`${arg('start')}T00:00:00Z`);
else if (arg('days')) start = addDays(end, -(Number(arg('days')) - 1));
else {
  const [row] = await sql`select max(date)::text as d from ${sql(T_TOTALS)}`;
  start = row.d ? addDays(row.d, -2) : addDays(end, -(MAX_AUTO_DAYS - 1));
  if (start < addDays(end, -(MAX_AUTO_DAYS - 1))) start = addDays(end, -(MAX_AUTO_DAYS - 1));
}
if (start > end) {
  console.log(`Nothing to pull (start ${fmt(start)} > end ${fmt(end)}).`);
  await sql.end();
  process.exit(0);
}

const { token } = await gscToken('readonly');

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };
async function query(day: string, dimensions: string[]): Promise<Row[]> {
  const rows: Row[] = [];
  for (let startRow = 0; ; startRow += ROW_LIMIT) {
    for (let attempt = 1; ; attempt++) {
      const res = await fetch(`${gscSiteBase()}/searchAnalytics/query`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: day, endDate: day, dimensions, rowLimit: ROW_LIMIT, startRow, dataState: 'final' }),
      });
      if (res.ok) {
        const page = ((await res.json()) as { rows?: Row[] }).rows ?? [];
        rows.push(...page);
        if (page.length < ROW_LIMIT) return rows;
        break;
      }
      if (attempt >= 3) throw new Error(`GSC ${res.status} for ${day} [${dimensions}]: ${(await res.text()).slice(0, 200)}`);
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

console.log(`Pulling ${fmt(start)} → ${fmt(end)} (${process.env.GSC_SITE_URL})`);
for (let d = start; d <= end; d = addDays(d, 1)) {
  const day = fmt(d);
  const [detail, pages, site] = await Promise.all([
    query(day, ['page', 'query', 'country', 'device']),
    query(day, ['page']),
    query(day, []),
  ]);
  await sql.begin(async (tx) => {
    await tx`delete from ${tx(T_DAILY)} where date = ${day}`;
    await tx`delete from ${tx(T_TOTALS)} where date = ${day}`;
    const detailRows = detail.map((r) => ({
      date: day,
      page: r.keys[0],
      query: r.keys[1],
      country: r.keys[2],
      device: r.keys[3],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }));
    for (let i = 0; i < detailRows.length; i += 1000) await tx`insert into ${tx(T_DAILY)} ${tx(detailRows.slice(i, i + 1000))}`;
    const totalRows = [
      ...site.map((r) => ({ date: day, page: '', clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })),
      ...pages.map((r) => ({ date: day, page: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })),
    ];
    for (let i = 0; i < totalRows.length; i += 1000) await tx`insert into ${tx(T_TOTALS)} ${tx(totalRows.slice(i, i + 1000))}`;
  });
  const siteRow = site[0];
  const covered = detail.reduce((a, r) => a + r.clicks, 0);
  console.log(
    `  ${day}  site clicks=${siteRow?.clicks ?? 0} impr=${siteRow?.impressions ?? 0}  pages=${pages.length}  detail rows=${detail.length} (click coverage ${siteRow?.clicks ? Math.round((covered / siteRow.clicks) * 100) : '-'}%)`,
  );
}

const [latest] = await sql`select max(date)::text as d, count(distinct date)::int as n from ${sql(T_TOTALS)}`;
console.log(`✅ ${T_TOTALS}: ${latest.n} days stored, latest ${latest.d}`);
await sql.end();
