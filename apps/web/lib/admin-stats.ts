import 'server-only';

import { and, desc, eq, gte, ne, sql } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { users } from '@dexter/core/db/schema/auth';
import { portfolios, portfolioHoldings } from '@dexter/core/db/schema/portfolios';
import { agentJobs } from '@dexter/core/db/schema/agent-jobs';
import { planIds, type PlanId } from './pricing';

/**
 * Read-only aggregations powering the /hello-pickskill admin console.
 *
 * Every function is a single grouped query (no per-row N+1) so the whole
 * dashboard is a handful of round-trips. Counts are cast to ::int because
 * postgres returns bigint as a string through postgres-js, and the UI wants
 * real numbers. All time math is UTC to match how `created_at` is stored.
 *
 * Nothing here is user-scoped — the page is gated by HTTP Basic Auth in
 * proxy.ts (ADMIN_NAME / ADMIN_PASSWORD), so these run with full visibility.
 */

export interface AdminOverview {
  totalUsers: number;
  newToday: number;
  new7d: number;
  new30d: number;
  paidUsers: number;
  activePaidUsers: number;
  totalPortfolios: number;
  totalHoldings: number;
  totalAgentJobs: number;
  agentJobs24h: number;
}

export async function getOverview(): Promise<AdminOverview> {
  const db = getDb();
  const [row] = await db
    .select({
      totalUsers: sql<number>`count(*)::int`,
      newToday: sql<number>`count(*) filter (where ${users.createdAt} >= date_trunc('day', now()))::int`,
      new7d: sql<number>`count(*) filter (where ${users.createdAt} >= now() - interval '7 days')::int`,
      new30d: sql<number>`count(*) filter (where ${users.createdAt} >= now() - interval '30 days')::int`,
      paidUsers: sql<number>`count(*) filter (where ${users.plan} <> 'free')::int`,
      activePaidUsers: sql<number>`count(*) filter (where ${users.plan} <> 'free' and ${users.stripeStatus} in ('active', 'trialing'))::int`,
    })
    .from(users);

  const [pf] = await db
    .select({
      totalPortfolios: sql<number>`count(*)::int`,
    })
    .from(portfolios);

  const [hd] = await db
    .select({ totalHoldings: sql<number>`count(*)::int` })
    .from(portfolioHoldings);

  const [aj] = await db
    .select({
      totalAgentJobs: sql<number>`count(*)::int`,
      agentJobs24h: sql<number>`count(*) filter (where ${agentJobs.createdAt} >= now() - interval '24 hours')::int`,
    })
    .from(agentJobs);

  return {
    totalUsers: row?.totalUsers ?? 0,
    newToday: row?.newToday ?? 0,
    new7d: row?.new7d ?? 0,
    new30d: row?.new30d ?? 0,
    paidUsers: row?.paidUsers ?? 0,
    activePaidUsers: row?.activePaidUsers ?? 0,
    totalPortfolios: pf?.totalPortfolios ?? 0,
    totalHoldings: hd?.totalHoldings ?? 0,
    totalAgentJobs: aj?.totalAgentJobs ?? 0,
    agentJobs24h: aj?.agentJobs24h ?? 0,
  };
}

export interface DailySignup {
  day: string; // 'YYYY-MM-DD' (UTC)
  count: number;
}

/**
 * New-user counts per UTC day for the last `days` days, with zero-signup
 * days filled in so the chart has no gaps.
 *
 * Implementation note: this groups with the drizzle query builder (extended
 * query protocol) rather than a raw `db.execute` CTE (simple query protocol).
 * The whole dashboard fires its queries via Promise.all over a single
 * pgbouncer connection (postgres-js `max: 1`); mixing a simple-protocol
 * statement into that pipeline deadlocks the connection. Keeping every query
 * on the extended protocol lets them pipeline safely. The date series is
 * filled in JS, which is trivial for 30 rows.
 */
export async function getDailySignups(days = 30): Promise<DailySignup[]> {
  const db = getDb();
  const rows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${users.createdAt}), 'YYYY-MM-DD')`,
      count: sql<number>`count(*)::int`,
    })
    .from(users)
    .where(sql`${users.createdAt} >= date_trunc('day', now()) - (${days - 1} || ' days')::interval`)
    .groupBy(sql`1`);

  const counts = new Map(rows.map((r) => [r.day, Number(r.count)]));

  // Build the contiguous UTC day series [today-(days-1) … today].
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const series: DailySignup[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({ day: key, count: counts.get(key) ?? 0 });
  }
  return series;
}

export interface PlanBreakdownRow {
  plan: PlanId;
  total: number;
  monthly: number;
  yearly: number;
  active: number;
}

/** Per-plan user counts, ordered free → power. Includes the free tier so
 *  the page can show the full funnel; paid revenue rows are the rest. */
export async function getPlanBreakdown(): Promise<PlanBreakdownRow[]> {
  const db = getDb();
  const rows = await db
    .select({
      plan: users.plan,
      total: sql<number>`count(*)::int`,
      monthly: sql<number>`count(*) filter (where ${users.billingInterval} = 'month')::int`,
      yearly: sql<number>`count(*) filter (where ${users.billingInterval} = 'year')::int`,
      active: sql<number>`count(*) filter (where ${users.stripeStatus} in ('active', 'trialing'))::int`,
    })
    .from(users)
    .groupBy(users.plan);

  const byPlan = new Map(rows.map((r) => [r.plan as PlanId, r]));
  // Always return one row per known plan, in tier order, so the table is stable.
  return planIds.map((plan) => {
    const r = byPlan.get(plan);
    return {
      plan,
      total: r?.total ?? 0,
      monthly: r?.monthly ?? 0,
      yearly: r?.yearly ?? 0,
      active: r?.active ?? 0,
    };
  });
}

export interface PaidUser {
  id: string;
  email: string | null;
  name: string | null;
  plan: string;
  interval: string | null;
  status: string | null;
  periodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
}

/** Detail list of paying subscribers (plan != free), newest first. */
export async function getPaidUsers(limit = 200): Promise<PaidUser[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      plan: users.plan,
      interval: users.billingInterval,
      status: users.stripeStatus,
      periodEnd: users.stripeCurrentPeriodEnd,
      cancelAtPeriodEnd: users.stripeCancelAtPeriodEnd,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(ne(users.plan, 'free'))
    .orderBy(desc(users.createdAt))
    .limit(limit);
  return rows;
}

export interface PortfolioStats {
  usersWithPortfolio: number;
  avgHoldingsPerPortfolio: number;
  topCreators: Array<{
    userId: string;
    email: string | null;
    portfolioCount: number;
  }>;
  recent: Array<{
    id: string;
    name: string;
    email: string | null;
    holdings: number;
    createdAt: Date;
  }>;
}

export async function getPortfolioStats(): Promise<PortfolioStats> {
  const db = getDb();

  const [distinct] = await db
    .select({
      usersWithPortfolio: sql<number>`count(distinct ${portfolios.userId})::int`,
    })
    .from(portfolios);

  const [avg] = await db
    .select({
      avgHoldings: sql<number>`coalesce(avg(c.cnt), 0)`,
    })
    .from(
      sql`(select ${portfolioHoldings.portfolioId} as pid, count(*) as cnt
           from ${portfolioHoldings} group by ${portfolioHoldings.portfolioId}) as c`,
    );

  const topCreators = await db
    .select({
      userId: portfolios.userId,
      email: users.email,
      portfolioCount: sql<number>`count(*)::int`,
    })
    .from(portfolios)
    .leftJoin(users, eq(users.id, portfolios.userId))
    .groupBy(portfolios.userId, users.email)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  const recent = await db
    .select({
      id: portfolios.id,
      name: portfolios.name,
      email: users.email,
      holdings: sql<number>`count(${portfolioHoldings.id})::int`,
      createdAt: portfolios.createdAt,
    })
    .from(portfolios)
    .leftJoin(users, eq(users.id, portfolios.userId))
    .leftJoin(portfolioHoldings, eq(portfolioHoldings.portfolioId, portfolios.id))
    .groupBy(portfolios.id, portfolios.name, users.email, portfolios.createdAt)
    .orderBy(desc(portfolios.createdAt))
    .limit(15);

  return {
    usersWithPortfolio: distinct?.usersWithPortfolio ?? 0,
    avgHoldingsPerPortfolio: Math.round(Number(avg?.avgHoldings ?? 0) * 10) / 10,
    topCreators: topCreators.map((r) => ({
      userId: r.userId,
      email: r.email,
      portfolioCount: r.portfolioCount,
    })),
    recent,
  };
}

export interface AgentJobStats {
  byStatus: Array<{ status: string; count: number }>;
  recent: Array<{
    id: string;
    email: string | null;
    query: string;
    model: string | null;
    status: string;
    chunkIndex: number;
    totalIterations: number;
    createdAt: Date;
  }>;
}

export async function getAgentJobStats(): Promise<AgentJobStats> {
  const db = getDb();

  const byStatus = await db
    .select({
      status: agentJobs.status,
      count: sql<number>`count(*)::int`,
    })
    .from(agentJobs)
    .groupBy(agentJobs.status)
    .orderBy(desc(sql`count(*)`));

  const recent = await db
    .select({
      id: agentJobs.id,
      email: users.email,
      query: agentJobs.query,
      model: agentJobs.model,
      status: agentJobs.status,
      chunkIndex: agentJobs.chunkIndex,
      totalIterations: agentJobs.totalIterations,
      createdAt: agentJobs.createdAt,
    })
    .from(agentJobs)
    .leftJoin(users, eq(users.id, agentJobs.userId))
    .orderBy(desc(agentJobs.createdAt))
    .limit(25);

  return { byStatus, recent };
}
