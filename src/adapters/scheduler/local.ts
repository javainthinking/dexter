/**
 * Local in-process Scheduler adapter — wraps the existing setTimeout-based
 * cron runner (src/cron/runner.ts).
 *
 * The legacy runner polls .dexter/cron/jobs.json on a self-rearming timer
 * and dispatches due jobs to the cron executor. This adapter exposes that
 * runner behind the Scheduler port so the rest of the system can stay
 * platform-agnostic.
 *
 * On Vercel use adapters/scheduler/vercel-cron.ts instead — Vercel Cron
 * fires HTTP endpoints, which call `tick(jobId)` for a single job rather
 * than maintaining an internal timer.
 */

import type { Scheduler, SchedulerTickHandler } from '../../ports/scheduler.js';
import type { CronJob } from '../../cron/types.js';
import { startCronRunner } from '../../cron/runner.js';
import { loadCronStore, saveCronStore } from '../../cron/store.js';
import { executeCronJob } from '../../cron/executor.js';

export interface LocalSchedulerOptions {
  configPath?: string;
}

export class LocalScheduler implements Scheduler {
  private runner: { stop: () => void } | null = null;
  private readonly options: LocalSchedulerOptions;

  constructor(options: LocalSchedulerOptions = {}) {
    this.options = options;
  }

  /** Start the polling runner. Idempotent. */
  start(): void {
    if (this.runner) return;
    this.runner = startCronRunner({ configPath: this.options.configPath });
  }

  async schedule(_job: CronJob, _onTick: SchedulerTickHandler): Promise<void> {
    // The legacy runner reads jobs.json directly on every tick, so adding a
    // job to CronStorage is enough — no per-job timer to install here.
    // We still ensure the runner is started.
    this.start();
  }

  async unschedule(_jobId: string): Promise<void> {
    // Same: removal from CronStorage is sufficient.
    this.start();
  }

  async shutdown(): Promise<void> {
    if (this.runner) {
      this.runner.stop();
      this.runner = null;
    }
  }

  /**
   * Manually fire a single job by id (used by CLI commands and tests).
   * Uses the same cron executor as the runner.
   */
  async tick(jobId: string): Promise<void> {
    const store = loadCronStore();
    const job = store.jobs.find((j) => j.id === jobId);
    if (!job) {
      throw new Error(`Cron job not found: ${jobId}`);
    }
    await executeCronJob(job, store, { configPath: this.options.configPath });
    saveCronStore(store);
  }
}
