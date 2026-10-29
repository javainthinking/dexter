/**
 * Keep the GSC sitemap submission in step with the live sitemap.
 *
 *   bun run scripts/seo/gsc-sitemap-sync.ts             # resubmit on drift
 *   bun run scripts/seo/gsc-sitemap-sync.ts --dry-run   # report only
 *   bun run scripts/seo/gsc-sitemap-sync.ts --force     # resubmit regardless
 *
 * Drift = never submitted, live <loc> count ≠ GSC's last fetched count, or GSC
 * reports errors/warnings. A pending GSC fetch already picks up the live file,
 * so count drift alone does not re-ping it. Submitting is not a deploy and
 * needs no user confirmation; it does need Full permission (403 otherwise).
 */

import { flag, gscSiteBase, gscToken, requireEnv, SITEMAP_URL } from './lib';

requireEnv('GSC_SERVICE_ACCOUNT_KEY_FILE', 'GSC_SITE_URL');

const live = await fetch(SITEMAP_URL, { redirect: 'follow' });
if (!live.ok) {
  console.error(`❌ Live sitemap fetch failed: HTTP ${live.status} ${SITEMAP_URL}`);
  process.exit(1);
}
// <loc> only appears inside <url> blocks; alternates are xhtml:link attributes.
const liveCount = ((await live.text()).match(/<loc>/g) ?? []).length;
if (liveCount === 0) {
  console.error('❌ Live sitemap parsed to 0 URLs — refusing to compare/submit.');
  process.exit(1);
}
console.log(`live     : ${liveCount} URLs (${SITEMAP_URL})`);

const { token, email } = await gscToken('full');
const endpoint = `${gscSiteBase()}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`;
const got = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });

let reasons: string[] = [];
if (got.status === 404) {
  reasons.push('sitemap never submitted to GSC');
  console.log('gsc      : not submitted');
} else if (!got.ok) {
  console.error(`❌ sitemaps.get failed: HTTP ${got.status} ${(await got.text()).slice(0, 200)}`);
  console.error('   Diagnose with: bun run scripts/seo/gsc-verify.ts');
  process.exit(1);
} else {
  const info = (await got.json()) as {
    contents?: { submitted?: string }[];
    errors?: string;
    warnings?: string;
    lastSubmitted?: string;
    lastDownloaded?: string;
    isPending?: boolean;
  };
  const gscCount = (info.contents ?? []).reduce((n, c) => n + Number(c.submitted ?? 0), 0);
  const errors = Number(info.errors ?? 0);
  const warnings = Number(info.warnings ?? 0);
  console.log(
    `gsc      : ${gscCount} URLs, lastSubmitted=${info.lastSubmitted ?? '-'}, lastDownloaded=${info.lastDownloaded ?? '-'}, errors=${errors}, warnings=${warnings}${info.isPending ? ', pending' : ''}`,
  );
  if (gscCount !== liveCount) {
    const delta = gscCount ? (liveCount - gscCount) / gscCount : 0;
    reasons.push(`URL count drift: live ${liveCount} vs GSC ${gscCount}${delta < -0.1 ? ' (⚠️ live dropped >10% — sitemap regression?)' : ''}`);
  }
  if (errors > 0) reasons.push(`GSC reports ${errors} error(s)`);
  if (warnings > 0) reasons.push(`GSC reports ${warnings} warning(s)`);
  if (info.isPending) {
    reasons = reasons.filter((r) => !r.startsWith('URL count drift'));
    if (!reasons.length) console.log('note     : count drift ignored — GSC fetch already pending');
  }
}

if (!flag('force') && reasons.length === 0) {
  console.log('result   : ✅ in sync — no action');
  process.exit(0);
}
console.log(`result   : 🔁 needs sync — ${flag('force') ? 'forced' : reasons.join('; ')}`);
if (flag('dry-run')) {
  console.log('action   : dry-run, not submitting');
  process.exit(0);
}

const put = await fetch(endpoint, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
if (put.ok) {
  console.log(`action   : ✅ submitted ${SITEMAP_URL} (${process.env.GSC_SITE_URL})`);
} else {
  console.error(`❌ sitemaps.submit failed: HTTP ${put.status} ${(await put.text()).slice(0, 200)}`);
  if (put.status === 403) console.error(`   ${email} has Restricted access — raise it to Full in Search Console.`);
  process.exit(1);
}
