/**
 * CronStorage — persistence for scheduled jobs (definition + state).
 *
 * Adapters:
 *   - adapters/cron-storage/json-file   (CLI / Worker)
 *   - adapters/cron-storage/postgres    (Web SaaS — one row per job)
 *
 * Separate from `Scheduler`: this only stores; Scheduler does the firing.
 */

import type { CronJob, CronJobState } from '../cron/types.js';

export interface CronStorage {
  load(): Promise<CronJob[]>;
  save(jobs: CronJob[]): Promise<void>;

  /** Upsert a single job by id. */
  upsert(job: CronJob): Promise<void>;

  /** Delete by id. Returns true if a row was removed. */
  remove(jobId: string): Promise<boolean>;

  /** Patch the state field for a single job (lastRunAtMs, errors, etc). */
  updateState(jobId: string, state: Partial<CronJobState>): Promise<void>;
}
