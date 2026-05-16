/**
 * Postgres CronStorage adapter — persists scheduled jobs in dexter_cron_jobs.
 *
 * Jobs are user-scoped via dexter_cron_jobs.user_id (FK → dexter_users.id,
 * ON DELETE CASCADE). definition + state stay in jsonb so the CronJob shape
 * can evolve without lockstep migrations; enabled is denormalised for
 * index-friendly filtering by the Scheduler.
 */

import { and, eq } from 'drizzle-orm';
import type { DexterDb } from '../../../db/client.js';
import { getDb } from '../../../db/client.js';
import { cronJobs } from '../../../db/schema/cron.js';
import type { CronStorage } from '../../../ports/cron-storage.js';
import type { CronJob, CronJobState } from '../../../cron/types.js';

export interface PostgresCronStorageOptions {
  userId: string;
  db?: DexterDb;
}

export class PostgresCronStorage implements CronStorage {
  private readonly db: DexterDb;
  private readonly userId: string;

  constructor(options: PostgresCronStorageOptions) {
    if (!options.userId) {
      throw new Error('PostgresCronStorage requires a userId');
    }
    this.db = options.db ?? getDb();
    this.userId = options.userId;
  }

  async load(): Promise<CronJob[]> {
    const rows = await this.db
      .select()
      .from(cronJobs)
      .where(eq(cronJobs.userId, this.userId));
    return rows.map(rowToJob);
  }

  async save(jobs: CronJob[]): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.delete(cronJobs).where(eq(cronJobs.userId, this.userId));
      if (jobs.length === 0) return;
      await tx.insert(cronJobs).values(jobs.map((j) => jobToRow(j, this.userId)));
    });
  }

  async upsert(job: CronJob): Promise<void> {
    const row = jobToRow(job, this.userId);
    await this.db
      .insert(cronJobs)
      .values(row)
      .onConflictDoUpdate({
        target: cronJobs.id,
        set: {
          userId: row.userId,
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
      .where(and(eq(cronJobs.id, jobId), eq(cronJobs.userId, this.userId)))
      .returning({ id: cronJobs.id });
    return out.length > 0;
  }

  async updateState(jobId: string, state: Partial<CronJobState>): Promise<void> {
    const [row] = await this.db
      .select({ state: cronJobs.state })
      .from(cronJobs)
      .where(and(eq(cronJobs.id, jobId), eq(cronJobs.userId, this.userId)))
      .limit(1);
    if (!row) return;
    const merged: CronJobState = { ...row.state, ...state };
    await this.db
      .update(cronJobs)
      .set({ state: merged, updatedAt: new Date() })
      .where(and(eq(cronJobs.id, jobId), eq(cronJobs.userId, this.userId)));
  }
}

function jobToRow(job: CronJob, userId: string) {
  const { state, ...definition } = job;
  return {
    id: job.id,
    userId,
    enabled: job.enabled,
    definition,
    state,
  };
}

function rowToJob(row: typeof cronJobs.$inferSelect): CronJob {
  return { ...row.definition, state: row.state };
}
