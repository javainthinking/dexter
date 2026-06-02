import type { Metadata } from 'next';
import {
  Users,
  UserPlus,
  CreditCard,
  Wallet,
  Briefcase,
  Bot,
} from 'lucide-react';
import {
  getOverview,
  getDailySignups,
  getPlanBreakdown,
  getPaidUsers,
  getPortfolioStats,
  getAgentJobStats,
} from '../../../lib/admin-stats';
import { isAdminAuthed } from '../../../lib/admin-auth';
import { AdminLogin } from '../../../components/admin/admin-login';
import { AdminLogoutButton } from '../../../components/admin/admin-logout-button';
import { SiteHeader } from '../../../components/marketing/site-header';
import { isLocale, defaultLocale, type Locale } from '../../../lib/i18n/locales';
import { planMeta, type PlanId } from '../../../lib/pricing';

// Live admin console — never cached, never indexed. Gated by the admin
// session cookie (in-page login form, see lib/admin-auth.ts).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PickSkill Admin',
  robots: { index: false, follow: false },
};

const PLAN_NAME: Record<string, string> = Object.fromEntries(
  planMeta.map((p) => [p.id, p.name]),
);

function fmtNum(n: number): string {
  return n.toLocaleString('en-US');
}

function fmtDate(d: Date | null): string {
  if (!d) return '—';
  return new Date(d).toISOString().slice(0, 10);
}

function fmtDateTime(d: Date | null): string {
  if (!d) return '—';
  return new Date(d).toISOString().slice(0, 16).replace('T', ' ');
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-subtle">
        <Icon className="size-4" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-12 font-serif text-xl font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'done'
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      : status === 'error'
        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
        : status === 'running'
          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 font-mono text-[11px] ${tone}`}>
      {status}
    </span>
  );
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang: Locale = isLocale(langParam) ? langParam : defaultLocale;

  // Gate on the admin session cookie. Unauthenticated visitors get the
  // in-page login form (no browser Basic Auth dialog); a successful login
  // sets the cookie and refreshes into the dashboard below.
  if (!(await isAdminAuthed())) {
    return <AdminLogin />;
  }

  // Fetched sequentially on purpose: the app's Postgres client is a single
  // pgbouncer connection (postgres-js `max: 1`), and firing these via
  // Promise.all pipelines concurrent transactions onto that one connection,
  // which the pooler deadlocks. Each query is ~250–500ms; sequential keeps
  // the dashboard correct and still well under a second of total DB time.
  const overview = await getOverview();
  const signups = await getDailySignups(30);
  const plans = await getPlanBreakdown();
  const paidUsers = await getPaidUsers(200);
  const portfolioStats = await getPortfolioStats();
  const agentStats = await getAgentJobStats();

  const maxSignup = Math.max(1, ...signups.map((s) => s.count));
  const totalAgentByStatus = agentStats.byStatus.reduce((a, b) => a + b.count, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
              PickSkill · Admin
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              运营总览 Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-mono text-xs text-muted-foreground">
              {fmtDateTime(new Date())} UTC
            </p>
            <AdminLogoutButton />
          </div>
        </header>

        {/* Overview cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            icon={Users}
            label="用户总数"
            value={fmtNum(overview.totalUsers)}
            sub={`近30天 +${fmtNum(overview.new30d)}`}
          />
          <StatCard
            icon={UserPlus}
            label="今日新增"
            value={fmtNum(overview.newToday)}
            sub={`近7天 +${fmtNum(overview.new7d)}`}
          />
          <StatCard
            icon={CreditCard}
            label="付费用户"
            value={fmtNum(overview.paidUsers)}
            sub={`活跃订阅 ${fmtNum(overview.activePaidUsers)}`}
          />
          <StatCard
            icon={Wallet}
            label="付费占比"
            value={
              overview.totalUsers
                ? `${((overview.paidUsers / overview.totalUsers) * 100).toFixed(1)}%`
                : '0%'
            }
            sub="paid / total"
          />
          <StatCard
            icon={Briefcase}
            label="组合总数"
            value={fmtNum(overview.totalPortfolios)}
            sub={`持仓 ${fmtNum(overview.totalHoldings)}`}
          />
          <StatCard
            icon={Bot}
            label="Agent 任务"
            value={fmtNum(overview.totalAgentJobs)}
            sub={`近24h ${fmtNum(overview.agentJobs24h)}`}
          />
        </div>

        {/* Daily signups bar chart */}
        <SectionTitle>每日新增用户（近 30 天）</SectionTitle>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex h-44 items-end gap-1">
            {signups.map((s) => (
              <div
                key={s.day}
                className="group relative flex h-full flex-1 flex-col items-center justify-end"
              >
                <div
                  className="w-full rounded-t bg-[color:var(--accent)] transition-opacity group-hover:opacity-80"
                  style={{
                    height: `${s.count > 0 ? Math.max(3, (s.count / maxSignup) * 100) : 0}%`,
                  }}
                  title={`${s.day}: ${s.count}`}
                />
                <span className="pointer-events-none absolute -top-6 hidden rounded bg-foreground px-1.5 py-0.5 font-mono text-[10px] text-background group-hover:block">
                  {s.count}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between font-mono text-[10px] text-subtle">
            <span>{signups[0]?.day ?? ''}</span>
            <span>{signups[signups.length - 1]?.day ?? ''}</span>
          </div>
        </div>

        {/* Plan breakdown */}
        <SectionTitle>订阅计划分布</SectionTitle>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3 text-right">用户数</th>
                <th className="px-5 py-3 text-right">月付</th>
                <th className="px-5 py-3 text-right">年付</th>
                <th className="px-5 py-3 text-right">活跃订阅</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.plan} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3">
                    <span className="font-medium text-foreground">
                      {PLAN_NAME[p.plan] ?? p.plan}
                    </span>
                    {p.plan === 'free' && (
                      <span className="ml-2 font-mono text-[10px] text-subtle">免费</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-mono">{fmtNum(p.total)}</td>
                  <td className="px-5 py-3 text-right font-mono text-muted-foreground">
                    {fmtNum(p.monthly)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-muted-foreground">
                    {fmtNum(p.yearly)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-muted-foreground">
                    {fmtNum(p.active)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paid users detail */}
        <SectionTitle>付费用户明细（{fmtNum(paidUsers.length)}）</SectionTitle>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
                <th className="px-5 py-3">邮箱</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">周期</th>
                <th className="px-5 py-3">状态</th>
                <th className="px-5 py-3">续费/到期</th>
                <th className="px-5 py-3">注册时间</th>
              </tr>
            </thead>
            <tbody>
              {paidUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    暂无付费用户
                  </td>
                </tr>
              )}
              {paidUsers.map((u) => (
                <tr key={u.id} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3">
                    <span className="text-foreground">{u.email ?? u.name ?? u.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-5 py-3">{PLAN_NAME[u.plan] ?? u.plan}</td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">
                    {u.interval ?? '—'}
                  </td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">
                    {u.status ?? '—'}
                    {u.cancelAtPeriodEnd && (
                      <span className="ml-1 text-amber-600 dark:text-amber-400">(取消中)</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">
                    {fmtDate(u.periodEnd)}
                  </td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">
                    {fmtDate(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Portfolios */}
        <SectionTitle>用户组合（Portfolio）</SectionTitle>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
                  创建用户数
                </p>
                <p className="mt-2 font-serif text-2xl font-semibold">
                  {fmtNum(portfolioStats.usersWithPortfolio)}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
                  组合总数
                </p>
                <p className="mt-2 font-serif text-2xl font-semibold">
                  {fmtNum(overview.totalPortfolios)}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
                  平均持仓
                </p>
                <p className="mt-2 font-serif text-2xl font-semibold">
                  {portfolioStats.avgHoldingsPerPortfolio}
                </p>
              </div>
            </div>
            <p className="mb-2 mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
              创建最多的用户 Top 10
            </p>
            <ul className="space-y-2">
              {portfolioStats.topCreators.map((c) => (
                <li
                  key={c.userId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate text-muted-foreground">
                    {c.email ?? c.userId.slice(0, 8)}
                  </span>
                  <span className="font-mono">{fmtNum(c.portfolioCount)}</span>
                </li>
              ))}
              {portfolioStats.topCreators.length === 0 && (
                <li className="text-sm text-muted-foreground">暂无数据</li>
              )}
            </ul>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
                  <th className="px-5 py-3">最近创建的组合</th>
                  <th className="px-5 py-3">用户</th>
                  <th className="px-5 py-3 text-right">持仓</th>
                  <th className="px-5 py-3">时间</th>
                </tr>
              </thead>
              <tbody>
                {portfolioStats.recent.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-3 text-foreground">{p.name}</td>
                    <td className="px-5 py-3 truncate text-muted-foreground">
                      {p.email ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-right font-mono">{fmtNum(p.holdings)}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">
                      {fmtDate(p.createdAt)}
                    </td>
                  </tr>
                ))}
                {portfolioStats.recent.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                      暂无组合
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agent jobs */}
        <SectionTitle>Agent 任务情况</SectionTitle>
        <div className="mb-6 flex flex-wrap gap-3">
          {agentStats.byStatus.map((s) => (
            <div
              key={s.status}
              className="rounded-lg border border-border bg-card px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <StatusBadge status={s.status} />
                <span className="font-serif text-lg font-semibold">{fmtNum(s.count)}</span>
              </div>
            </div>
          ))}
          {totalAgentByStatus === 0 && (
            <p className="text-sm text-muted-foreground">暂无任务</p>
          )}
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
                <th className="px-5 py-3">最近任务 Query</th>
                <th className="px-5 py-3">用户</th>
                <th className="px-5 py-3">模型</th>
                <th className="px-5 py-3">状态</th>
                <th className="px-5 py-3 text-right">chunk</th>
                <th className="px-5 py-3 text-right">iters</th>
                <th className="px-5 py-3">时间</th>
              </tr>
            </thead>
            <tbody>
              {agentStats.recent.map((j) => (
                <tr key={j.id} className="border-b border-border/60 last:border-0">
                  <td className="max-w-[280px] truncate px-5 py-3 text-foreground" title={j.query}>
                    {j.query}
                  </td>
                  <td className="px-5 py-3 truncate text-muted-foreground">{j.email ?? '—'}</td>
                  <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">
                    {j.model ?? '—'}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-muted-foreground">
                    {j.chunkIndex}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-muted-foreground">
                    {j.totalIterations}
                  </td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">
                    {fmtDateTime(j.createdAt)}
                  </td>
                </tr>
              ))}
              {agentStats.recent.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                    暂无任务记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
