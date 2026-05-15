/**
 * JSON-file CronStorage adapter.
 *
 * Delegates to the existing src/cron/store.ts helpers so the legacy CLI/Worker
 * behaviour is unchanged. The Web adapter (Phase 3) will implement the same
 * port against Postgres instead.
 */

import type { CronStorage } from '../../../ports/cron-storage.js';
import type { CronJob, CronJobState, CronStore } from '../../../cron/types.js';
import { loadCronStore, saveCronStore, getCronStorePath } from '../../../cron/store.js';

export interface JsonCronStorageOptions {
  /** Override storage path (defaults to the legacy .dexter/cron/jobs.json). */
  path?: string;
}

export class JsonCronStorage implements CronStorage {
  private readonly path: string;

  constructor(options: JsonCronStorageOptions = {}) {
    this.path = options.path ?? getCronStorePath();
  }

  async load(): Promise<CronJob[]> {
    return loadCronStore().jobs;
  }

  async save(jobs: CronJob[]): Promise<void> {
    const store: CronStore = { version: 1, jobs };
    saveCronStore(store);
  }

  async upsert(job: CronJob): Promise<void> {
    const store = loadCronStore();
    const idx = store.jobs.findIndex((j) => j.id === job.id);
    if (idx >= 0) {
      store.jobs[idx] = job;
    } else {
      store.jobs.push(job);
    }
    saveCronStore(store);
  }

  async remove(jobId: string): Promise<boolean> {
    const store = loadCronStore();
    const before = store.jobs.length;
    store.jobs = store.jobs.filter((j) => j.id !== jobId);
    if (store.jobs.length === before) return false;
    saveCronStore(store);
    return true;
  }

  async updateState(jobId: string, state: Partial<CronJobState>): Promise<void> {
    const store = loadCronStore();
    const job = store.jobs.find((j) => j.id === jobId);
    if (!job) return;
    job.state = { ...job.state, ...state };
    job.updatedAtMs = Date.now();
    saveCronStore(store);
  }
}
