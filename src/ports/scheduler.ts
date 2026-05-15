/**
 * Scheduler — fires cron callbacks on schedule.
 *
 * Adapters:
 *   - adapters/scheduler/croner       (in-process timer; CLI / Worker)
 *   - adapters/scheduler/vercel-cron  (external HTTP trigger; Web SaaS).
 *     Vercel Cron implementation registers nothing locally — it just exposes
 *     a `tick(jobId)` method that the /api/cron/:id Function route calls.
 */

import type { CronJob } from '../cron/types.js';

export type SchedulerTickHandler = (job: CronJob) => Promise<void> | void;

export interface Scheduler {
  /** Register or update the firing schedule for a job. */
  schedule(job: CronJob, onTick: SchedulerTickHandler): Promise<void>;

  /** Stop firing for a job id. */
  unschedule(jobId: string): Promise<void>;

  /** Stop firing for all jobs and release resources. */
  shutdown(): Promise<void>;

  /**
   * Manually trigger a single job (e.g. for Vercel Cron HTTP entrypoint
   * or a CLI "/cron run X" command).
   */
  tick(jobId: string): Promise<void>;
}
