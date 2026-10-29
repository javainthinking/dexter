/**
 * Opportunity report for the SEO / GEO loop.
 *
 *   bun run scripts/seo/gsc-report.ts              # 28-day window ending at the newest stored day
 *   bun run scripts/seo/gsc-report.ts --days 56
 *
 * Writes loops/loop-gsc-optimization/gsc-reports/gsc-report-<data end>.md.
 *
 * Measurement rules baked in (each one cost apipick / 2slides a wrong verdict
 * before it was written down — see loops/loop-gsc-optimization/loop.md):
 *   - Totals, CTR and expected clicks come from dexter_gsc_totals_daily only.
 *     dexter_gsc_daily is anonymisation-truncated; it is used for query-level
 *     questions and always printed with its click coverage.
 *   - Weekly buckets are aligned to the data end and every bucket states its
 *     day count. A trailing partial bucket always "looks like a decline".
 *   - Any week-over-week reading carries its 1σ noise and its sensitivity to
 *     moving the bucket boundary by one day. Changes < 2σ are not findings.
 *   - Expected CTR comes from this site's own per-segment position buckets,
 *     not a generic SERP curve; thin buckets say so and fall back visibly.
 *   - Pages under a running experiment are excluded from the candidate
 *     tables, and their data is not shown before their read date.
 */

import {
  addDays,
  arg,
  barePath,
  db,
  fmt,
  frozenPaths,
  localeOf,
  LOOP_DIR,
  readRegistry,
  readWindow,
  segmentOf,
  T_DAILY,
  T_TOTALS,
  writeText,
  type Segment,
} from './lib';
import { join } from 'node:path';

const DAYS = Number(arg('days') ?? 28);
const sql = db();

const [{ d: dataEnd }] = await sql`select max(date)::text as d from ${sql(T_TOTALS)}`;
if (!dataEnd) {
  console.error('❌ No GSC data stored yet — run bun run scripts/seo/gsc-pull.ts --days 90 first.');
  await sql.end();
  process.exit(1);
}
const E = dataEnd as string;
const S = fmt(addDays(E, -(DAYS - 1)));
const today = fmt(new Date());

const frozen = frozenPaths();
const registry = readRegistry();
const dequeuedPages = new Set(registry.dequeued.flatMap((d) => d.pages ?? []));
const dequeuedQueries = new Set(registry.dequeued.flatMap((d) => d.queries ?? []).map((q) => q.toLowerCase()));
const isFrozen = (page: string) => frozen.has(barePath(page));
const isLive = (page: string) => !isFrozen(page) && !dequeuedPages.has(barePath(page));

type Tot = { date: string; page: string; clicks: number; impressions: number; position: number };
type Det = Tot & { query: string; country: string; device: string };

const totalsAll = (await sql`
  select date::text as date, page, clicks, impressions, position from ${sql(T_TOTALS)}`) as unknown as Tot[];
const totals = totalsAll.filter((r) => r.date >= S && r.date <= E);
const detail = (await sql`
  select date::text as date, page, query, country, device, clicks, impressions, position
  from ${sql(T_DAILY)} where date between ${S} and ${E}`) as unknown as Det[];

const lines: string[] = [];
const out = (s = '') => lines.push(s);
const pct = (x: number | null) => (x === null || !Number.isFinite(x) ? '—' : `${(x * 100).toFixed(x > 0 && x < 0.005 ? 3 : 1)}%`);
const num = (x: number) => x.toLocaleString('en-US');
const pos1 = (x: number) => (Number.isFinite(x) ? x.toFixed(1) : '—');
const short = (page: string) => page.replace('https://pickskill.ai', '') || '/';

function agg<T extends Tot>(rows: T[]) {
  let clicks = 0;
  let impressions = 0;
  let posw = 0;
  for (const r of rows) {
    clicks += r.clicks;
    impressions += r.impressions;
    posw += Number(r.position) * r.impressions;
  }
  return { clicks, impressions, ctr: impressions ? clicks / impressions : null, pos: impressions ? posw / impressions : NaN };
}

// ---- position buckets + per-segment baseline (unbiased, full history) ----

const BUCKETS: [string, number, number][] = [
  ['1–2', 0, 3],
  ['3–5', 3, 6],
  ['6–10', 6, 11],
  ['11–20', 11, 21],
  ['21–40', 21, 41],
  ['41+', 41, 1e9],
];
const bucketOf = (pos: number) => BUCKETS.findIndex(([, lo, hi]) => pos >= lo && pos < hi);
const MIN_BASELINE_IMPR = 200;
// Fallback only — visibly labelled wherever it is used.
const genericCtr = (pos: number) => (pos < 3 ? 0.2 : pos < 6 ? 0.08 : pos < 11 ? 0.03 : pos < 21 ? 0.01 : 0.003);

const SEGMENTS: Segment[] = ['blog', 'stocks', 'product'];
const baseline = new Map<Segment, { label: string; impr: number; clicks: number; ctr: number | null; thin: boolean }[]>();
for (const seg of SEGMENTS) {
  baseline.set(
    seg,
    BUCKETS.map(([label, lo, hi]) => {
      const sel = totalsAll.filter((r) => r.page && segmentOf(r.page) === seg && r.position >= lo && r.position < hi);
      const a = agg(sel);
      return { label, impr: a.impressions, clicks: a.clicks, ctr: a.ctr, thin: a.impressions < MIN_BASELINE_IMPR };
    }),
  );
}
function expectedCtr(page: string, pos: number): { ctr: number; source: string } {
  const b = baseline.get(segmentOf(page))![bucketOf(pos)];
  if (b && !b.thin && b.ctr !== null) return { ctr: b.ctr, source: `${segmentOf(page)}·${b.label}` };
  return { ctr: genericCtr(pos), source: 'generic (thin)' };
}

// ---- header ----

const siteRows = totals.filter((r) => r.page === '');
const site = agg(siteRows);
const detailAgg = agg(detail);
const coverage = site.clicks ? detailAgg.clicks / site.clicks : null;

out(`# PickSkill GSC report — ${S} → ${E}`);
out();
out(`- 生成：${today}；数据末日 ${E}（GSC 延迟约 3 天）；窗口 ${DAYS} 天`);
out(`- 站点（无偏 totals）：点击 ${num(site.clicks)} · 展示 ${num(site.impressions)} · CTR ${pct(site.ctr)} · 均位 ${pos1(site.pos)}`);
out(
  `- query 明细覆盖率：点击 ${pct(coverage)}（${num(detailAgg.clicks)}/${num(site.clicks)}）· 展示 ${pct(site.impressions ? detailAgg.impressions / site.impressions : null)} —— **query 表的绝对量不得与站点总量比较**`,
);
out(
  `- 剔除冻结页族（实验未判读，按规则不看当期数据）：${frozen.size ? [...frozen].map(([p, id]) => `\`${p}\`(${id})`).join('、') : '无'}`,
);
out(`- 剔除出队项：${registry.dequeued.length ? registry.dequeued.map((d) => d.id).join('、') : '无'}`);
out();

// ---- 1. site trend, aligned weekly buckets with σ ----

out(`## 1. 站点周趋势（按数据末日对齐的 7 天桶）`);
out();
const byDay = new Map(siteRows.map((r) => [r.date, r]));
const weekSum = (endDay: string) => {
  let clicks = 0;
  let impressions = 0;
  let days = 0;
  for (let i = 0; i < 7; i++) {
    const r = byDay.get(fmt(addDays(endDay, -i)));
    if (r) {
      clicks += r.clicks;
      impressions += r.impressions;
      days++;
    }
  }
  return { clicks, impressions, days };
};
out(`| 桶（结束日） | 天数 | 点击 | 展示 | CTR |`);
out(`|---|---|---|---|---|`);
const weeks = Math.floor(DAYS / 7);
for (let w = weeks - 1; w >= 0; w--) {
  const endDay = fmt(addDays(E, -7 * w));
  const b = weekSum(endDay);
  out(`| ${endDay} | ${b.days}/7 | ${num(b.clicks)} | ${num(b.impressions)} | ${pct(b.impressions ? b.clicks / b.impressions : null)} |`);
}
const daily = siteRows.map((r) => r.clicks);
const mean = daily.reduce((a, b) => a + b, 0) / (daily.length || 1);
const sdDay = Math.sqrt(daily.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(daily.length - 1, 1));
const sdWoW = sdDay * Math.sqrt(7) * Math.SQRT2;
out();
out(`- 日点击均值 ${mean.toFixed(1)}，日 σ ${sdDay.toFixed(1)} → **7 天环比差值的 1σ ≈ ${sdWoW.toFixed(1)} 次点击**`);
const wow = (shift: number) => {
  const endDay = fmt(addDays(E, -shift));
  const cur = weekSum(endDay);
  const prev = weekSum(fmt(addDays(endDay, -7)));
  return { endDay, diff: cur.clicks - prev.clicks, rel: prev.clicks ? (cur.clicks - prev.clicks) / prev.clicks : null, full: cur.days === 7 && prev.days === 7 };
};
const sens = [0, 1, 2].map(wow);
out(
  `- 桶边界敏感性（环比）：${sens.map((s) => `结束于 ${s.endDay}: ${s.diff >= 0 ? '+' : ''}${s.diff}（${pct(s.rel)}，${sdWoW ? (s.diff / sdWoW).toFixed(1) : '—'}σ${s.full ? '' : '，残桶'}）`).join('；')}`,
);
out(`- 判读：|差值| < 2σ 或三个读数方向不一致 → ⚪ 噪声，不写解释`);
out();

// ---- 2. striking-distance queries ----

out(`## 2. 够得着的关键词（query 级，均位 4–15，展示 ≥ 20）`);
out();
const qp = new Map<string, Det[]>();
for (const r of detail) {
  if (!isLive(r.page) || dequeuedQueries.has(r.query.toLowerCase())) continue;
  const k = `${r.query}\u0000${r.page}`;
  (qp.get(k) ?? qp.set(k, []).get(k)!).push(r);
}
const striking = [...qp.entries()]
  .map(([k, rows]) => ({ query: k.split('\u0000')[0], page: k.split('\u0000')[1], ...agg(rows) }))
  .filter((r) => r.pos >= 4 && r.pos <= 15 && r.impressions >= 20)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 25);
if (!striking.length) out(`（无）`);
else {
  out(`| query | 页面 | 展示 | 点击 | 均位 |`);
  out(`|---|---|---|---|---|`);
  for (const r of striking) out(`| ${r.query} | ${short(r.page)} | ${r.impressions} | ${r.clicks} | ${pos1(r.pos)} |`);
}
out();

// ---- 3. low-CTR pages with expected clicks (unbiased) ----

out(`## 3. 高展示低 CTR 页面（A 类 meta 重写候选，无偏 totals）`);
out();
out(`期望 CTR 取本站同分段、同位置桶的全历史 CTR（见 §8）。**A 类闸门：期望点击 ≥ 1/周**，低于它 CTR 翻倍也读不出来。`);
out();
const pageRows = new Map<string, Tot[]>();
for (const r of totals) if (r.page) (pageRows.get(r.page) ?? pageRows.set(r.page, []).get(r.page)!).push(r);
const pages = [...pageRows.entries()]
  .map(([page, rows]) => ({ page, ...agg(rows) }))
  .filter((p) => p.impressions >= 50 && isLive(p.page))
  .map((p) => {
    const e = expectedCtr(p.page, p.pos);
    const expClicks = p.impressions * e.ctr;
    const lambdaWeek = expClicks / (DAYS / 7);
    const ratio = expClicks ? p.clicks / expClicks : null;
    const verdict = lambdaWeek < 1 ? '⚪ 期望点击 <1/周' : ratio !== null && ratio < 0.5 ? '🎯 候选' : '✅ 正常';
    return { ...p, e, lambdaWeek, ratio, verdict };
  })
  .sort((a, b) => b.impressions - a.impressions);
const shownPages = pages.filter((p) => p.verdict !== '✅ 正常').slice(0, 25);
if (!shownPages.length) out(`（无）`);
else {
  out(`| 页面 | 展示 | 点击 | CTR | 均位 | 期望 CTR（来源） | 期望点击/周 | 实际/期望 | 判定 |`);
  out(`|---|---|---|---|---|---|---|---|---|`);
  for (const p of shownPages)
    out(
      `| ${short(p.page)} | ${num(p.impressions)} | ${p.clicks} | ${pct(p.ctr)} | ${pos1(p.pos)} | ${pct(p.e.ctr)}（${p.e.source}） | ${p.lambdaWeek.toFixed(1)} | ${p.ratio === null ? '—' : p.ratio.toFixed(2)} | ${p.verdict} |`,
    );
}
out();

// ---- 4. page trends (aligned halves, Poisson σ) ----

out(`## 4. 页面趋势（后 14 天 vs 前 14 天，对齐数据末日，|Δ| ≥ 2σ 才列出）`);
out();
const mid = fmt(addDays(E, -13));
const prevStart = fmt(addDays(E, -27));
const trends = [...pageRows.entries()]
  .filter(([page]) => isLive(page))
  .map(([page, rows]) => {
    const cur = agg(rows.filter((r) => r.date >= mid));
    const prev = agg(rows.filter((r) => r.date >= prevStart && r.date < mid));
    const sigma = Math.sqrt(cur.clicks + prev.clicks);
    return { page, cur, prev, delta: cur.clicks - prev.clicks, sigma };
  })
  .filter((t) => t.cur.clicks + t.prev.clicks >= 10 && Math.abs(t.delta) >= 2 * t.sigma)
  .sort((a, b) => a.delta - b.delta);
if (DAYS < 28) out(`（窗口不足 28 天，跳过）`);
else if (!trends.length) out(`（无超过 2σ 的变化）`);
else {
  out(`| 页面 | 前 14 天点击 | 后 14 天点击 | Δ | σ | 均位 前→后 |`);
  out(`|---|---|---|---|---|---|`);
  for (const t of trends)
    out(`| ${short(t.page)} | ${t.prev.clicks} | ${t.cur.clicks} | ${t.delta > 0 ? '+' : ''}${t.delta} | ${t.sigma.toFixed(1)} | ${pos1(t.prev.pos)} → ${pos1(t.cur.pos)} |`);
}
out();

// ---- 5. new queries ----

out(`## 5. 新出现的搜索词（近 7 天首次出现、展示 ≥ 10 → C 类新内容候选）`);
out();
const recentStart = fmt(addDays(E, -6));
const firstRows = (await sql`
  select query, min(date)::text as first from ${sql(T_DAILY)} group by query`) as unknown as { query: string; first: string }[];
const firstOf = new Map(firstRows.map((r) => [r.query, r.first]));
const byQuery = new Map<string, Det[]>();
for (const r of detail) if (r.date >= recentStart) (byQuery.get(r.query) ?? byQuery.set(r.query, []).get(r.query)!).push(r);
const fresh = [...byQuery.entries()]
  .filter(([q]) => (firstOf.get(q) ?? '') >= recentStart && !dequeuedQueries.has(q.toLowerCase()))
  .map(([query, rows]) => {
    const best = [...rows].sort((a, b) => b.impressions - a.impressions)[0];
    return { query, page: best.page, ...agg(rows) };
  })
  .filter((r) => r.impressions >= 10)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 20);
if (!fresh.length) out(`（无）`);
else {
  out(`| query | 承接页 | 展示 | 均位 |`);
  out(`|---|---|---|---|`);
  for (const r of fresh) out(`| ${r.query} | ${short(r.page)} | ${r.impressions} | ${pos1(r.pos)} |`);
}
out();

// ---- 6. locale fit ----

out(`## 6. 语种承接（query 文字 / 国家 vs 落地页语种 → D 类候选）`);
out();
const scriptOf = (q: string): 'ko' | 'ja' | 'zh' | 'latin' =>
  /[가-힯]/.test(q) ? 'ko' : /[぀-ヿ]/.test(q) ? 'ja' : /[一-鿿]/.test(q) ? 'zh' : 'latin';
const COUNTRY: Record<string, string> = {
  jpn: 'ja', kor: 'ko', chn: 'zh-CN', sgp: 'zh-CN', twn: 'zh-TW', hkg: 'zh-TW', mac: 'zh-TW',
  deu: 'de', aut: 'de', che: 'de', fra: 'fr', bel: 'fr', esp: 'es', mex: 'es', arg: 'es', col: 'es', chl: 'es', per: 'es',
};
const mismatch = new Map<string, { page: string; reason: string; impressions: number; clicks: number }>();
for (const r of detail) {
  const pl = localeOf(r.page);
  const sc = scriptOf(r.query);
  let reason = '';
  if (sc !== 'latin' && !(sc === 'zh' ? pl.startsWith('zh') : pl === sc)) reason = `${sc} 文字 query → ${pl} 页`;
  else if (sc === 'latin' && pl === 'en' && COUNTRY[r.country]) reason = `${r.country.toUpperCase()} 用户 → en 页（应为 ${COUNTRY[r.country]}?）`;
  if (!reason) continue;
  const k = `${r.page}\u0000${reason}`;
  const m = mismatch.get(k) ?? { page: r.page, reason, impressions: 0, clicks: 0 };
  m.impressions += r.impressions;
  m.clicks += r.clicks;
  mismatch.set(k, m);
}
const mm = [...mismatch.values()].filter((m) => m.impressions >= 20).sort((a, b) => b.impressions - a.impressions).slice(0, 20);
if (!mm.length) out(`（无展示 ≥ 20 的错配）`);
else {
  out(`| 落地页 | 错配 | 展示 | 点击 |`);
  out(`|---|---|---|---|`);
  for (const m of mm) out(`| ${short(m.page)} | ${m.reason} | ${m.impressions} | ${m.clicks} |`);
  out();
  out(`> 拉丁文字 query 分不出 en/fr/de/es，按国家推断，仅作线索：先查该语种译文是否存在、hreflang 是否正确，再下结论。`);
}
out();

// ---- 7. experiments ----

out(`## 7. 实验（experiments.json）`);
out();
if (!registry.experiments.length) out(`（无在册实验）`);
for (const e of registry.experiments) {
  const w = readWindow(e);
  const head = `- **${e.id}**（${e.status}）：${e.pages.map((p) => `\`${p}\``).join('、')} · 指标：${e.metric}`;
  if (e.status === 'verdict') {
    out(`${head} · 已结案：${e.verdict ?? ''}`);
    continue;
  }
  if (!w) {
    out(`${head} · ⏸️ 待发布（读窗 = push 日次日起 ${e.windowDays} 个完整自然日；push 后写入 publishedOn）`);
    continue;
  }
  if (today < w.readOn) {
    out(`${head} · ⏳ 读窗 ${w.start} → ${w.end}，判读日 ${w.readOn}（未到期，不展示当期数据）`);
    continue;
  }
  const match = (page: string) => page !== '' && e.pages.includes(barePath(page));
  const post = agg(totalsAll.filter((r) => match(r.page) && r.date >= w.start && r.date <= w.end));
  const preEnd = fmt(addDays(e.publishedOn!, -1));
  const preStart = fmt(addDays(e.publishedOn!, -e.windowDays));
  const pre = agg(totalsAll.filter((r) => match(r.page) && r.date >= preStart && r.date <= preEnd));
  const sigma = Math.sqrt(pre.clicks + post.clicks);
  out(`${head} · 🔔 **到期**（判读日 ${w.readOn}）`);
  out(`  - 前窗 ${preStart} → ${preEnd}：点击 ${pre.clicks} · 展示 ${num(pre.impressions)} · CTR ${pct(pre.ctr)} · 均位 ${pos1(pre.pos)}`);
  out(`  - 读窗 ${w.start} → ${w.end}：点击 ${post.clicks} · 展示 ${num(post.impressions)} · CTR ${pct(post.ctr)} · 均位 ${pos1(post.pos)}`);
  out(`  - 点击 Δ ${post.clicks - pre.clicks}（Poisson 1σ ≈ ${sigma.toFixed(1)}）；成功判据：${e.successIf}`);
}
out();

// ---- 8. position buckets ----

out(`## 8. 位置分桶 CTR（无偏 totals 全历史，按分段）`);
out();
out(`> totals 的位置是页面当天所有 query 的加权均位，中间桶的 CTR 偏高估，只作期望值参考；样本 < ${MIN_BASELINE_IMPR} 展示标 thin，期望值退回通用曲线。`);
out();
out(`| 分段 | ${BUCKETS.map((b) => b[0]).join(' | ')} |`);
out(`|---|${BUCKETS.map(() => '---').join('|')}|`);
for (const seg of SEGMENTS) {
  const cells = baseline.get(seg)!.map((b) => (b.impr ? `${pct(b.ctr)} (${num(b.impr)}${b.thin ? ', thin' : ''})` : '—'));
  out(`| ${seg} | ${cells.join(' | ')} |`);
}
out();

const file = join(LOOP_DIR, 'gsc-reports', `gsc-report-${E}.md`);
writeText(file, lines.join('\n') + '\n');
console.log(`✅ ${file.replace(`${LOOP_DIR}/`, 'loops/loop-gsc-optimization/')}`);
console.log(`   window ${S} → ${E}; site clicks ${site.clicks}, impressions ${site.impressions}; query coverage ${pct(coverage)}`);
await sql.end();
