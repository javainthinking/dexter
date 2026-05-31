/**
 * Drizzle schema barrel. drizzle-kit reads from here via drizzle.config.ts.
 * All tables in the database are prefixed `dexter_` so they coexist with
 * other Supabase projects without collision.
 */

export * from './auth.js';
export * from './billing.js';
export * from './web-sessions.js';
export * from './memory.js';
export * from './cron.js';
export * from './portfolios.js';
export * from './agent-jobs.js';
export * from './feedback.js';
