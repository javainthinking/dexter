/**
 * Postgres CronStorage adapter — persists scheduled jobs in dexter_cron_jobs.
 *
 * `definition` and `state` are jsonb columns so the CronJob shape can evolve
 * without lockstep migrations. `enabled` is denormalised into its own column
 * for index-friendly filtering by the Scheduler.
 */

import { and, eq } from 'drizzle-orm';
import type { DexterDb } from '../../../db/client.js';
import { getDb } from '../../../db/client.js';
import { cronJobs } from '../../../db/schema/cron.js';
import type { CronStorage } from '../../../ports/cron-storage.js';
import type { CronJob, CronJobState } from '../../../cron/types.js';

export interface PostgresCronStorageOptions {
  db?: DexterDb;
  orgId?: string;
}

export class PostgresCronStorage implements CronStorage {
  private readonly db: DexterDb;
  private readonly orgId: string;

  constructor(options: PostgresCronStorageOptions = {}) {
    this.db = options.db ?? getDb();
    this.orgId = options.orgId ?? 'global';
  }

  async load(): Promise<CronJob[]> {
    const rows = await this.db
      .select()
      .from(cronJobs)
      .where(eq(cronJobs.orgId, this.orgId));
    return rows.map(rowToJob);
  }

  async save(jobs: CronJob[]): Promise<void> {
    // Naive rewrite — fine for the in-process scheduler; concurrent edits
    // are guarded at the Scheduler/runner level rather than the storage.
    await this.db.transaction(async (tx) => {
      await tx.delete(cronJobs).where(eq(cronJobs.orgId, this.orgId));
      if (jobs.length === 0) return;
      await tx.insert(cronJobs).values(jobs.map((j) => jobToRow(j, this.orgId)));
    });
  }

  async upsert(job: CronJob): Promise<void> {
    const row = jobToRow(job, this.orgId);
    await this.db
      .insert(cronJobs)
      .values(row)
      .onConflictDoUpdate({
        target: cronJobs.id,
        set: {
          orgId: row.orgId,
          enabled: row.enabled,
          definition: row.definition,
          state: row.state,
          updatedAt: new Date(),
        },
      });
  }

  async remove(jobId: string): Promise<boolean> {
    const out = await this.db
      .delete(cronJobs)
      .where(and(eq(cronJobs.id, jobId), eq(cronJobs.orgId, this.orgId)))
      .returning({ id: cronJobs.id });
    return out.length > 0;
  }

  async updateState(jobId: string, state: Partial<CronJobState>): Promise<void> {
    const [row] = await this.db
      .select({ state: cronJobs.state })
      .from(cronJobs)
      .where(and(eq(cronJobs.id, jobId), eq(cronJobs.orgId, this.orgId)))
      .limit(1);
    if (!row) return;
    const merged: CronJobState = { ...row.state, ...state };
    await this.db
      .update(cronJobs)
      .set({ state: merged, updatedAt: new Date() })
      .where(and(eq(cronJobs.id, jobId), eq(cronJobs.orgId, this.orgId)));
  }
}

function jobToRow(job: CronJob, orgId: string) {
  const { state, ...definition } = job;
  return {
    id: job.id,
    orgId,
    enabled: job.enabled,
    definition,
    state,
  };
}

function rowToJob(row: typeof cronJobs.$inferSelect): CronJob {
  return { ...row.definition, state: row.state };
}
