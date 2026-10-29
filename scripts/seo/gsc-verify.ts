/**
 * Diagnose Search Console access for the service account.
 *
 *   bun run scripts/seo/gsc-verify.ts
 *
 * Lists every property the service account can see, picks the pickskill.ai
 * one (or checks GSC_SITE_URL when set), and runs one tiny query against it.
 * A 403 means the service account email has to be added in Search Console →
 * Settings → Users and permissions (Full, so sitemap submits work too).
 */

import { addDays, fmt, gscToken, requireEnv } from './lib';

requireEnv('GSC_SERVICE_ACCOUNT_KEY_FILE');

const { token, email } = await gscToken('readonly');
console.log(`🔑 Service account: ${email}`);

const res = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
  headers: { Authorization: `Bearer ${token}` },
});
const { siteEntry = [] } = (await res.json()) as { siteEntry?: { siteUrl: string; permissionLevel: string }[] };
console.log('Accessible properties:');
for (const s of siteEntry) console.log(`   - ${s.siteUrl}  (${s.permissionLevel})`);

const site =
  process.env.GSC_SITE_URL ?? siteEntry.find((s) => s.siteUrl.includes('pickskill.ai'))?.siteUrl ?? 'sc-domain:pickskill.ai';
const entry = siteEntry.find((s) => s.siteUrl === site);
console.log(`\nChecking ${site}${process.env.GSC_SITE_URL ? '' : ' (auto-detected — set GSC_SITE_URL to pin it)'}`);
if (entry && entry.permissionLevel !== 'siteFullUser' && entry.permissionLevel !== 'siteOwner') {
  console.log(`⚠️  Permission is ${entry.permissionLevel}: reads work, sitemap submits will 403. Raise it to Full.`);
}

const end = addDays(new Date(), -3);
const q = await fetch(
  `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate: fmt(addDays(end, -6)), endDate: fmt(end), dimensions: ['date'], rowLimit: 7 }),
  },
);
if (!q.ok) {
  console.error(`❌ searchAnalytics.query failed (HTTP ${q.status}): ${(await q.text()).slice(0, 200)}`);
  if (q.status === 403) {
    console.error(
      `   Add ${email} as a user on the pickskill.ai property in Search Console → Settings → Users and permissions (permission: Full).`,
    );
  }
  process.exit(1);
}
const { rows = [] } = (await q.json()) as { rows?: { keys: string[]; clicks: number; impressions: number }[] };
console.log(`✅ Query OK — last ${rows.length} days:`);
for (const r of rows) console.log(`   ${r.keys[0]}  clicks=${r.clicks}  impressions=${r.impressions}`);
if (!process.env.GSC_SITE_URL) console.log(`\nAdd to repo-root .env.local:\n   GSC_SITE_URL=${site}`);
