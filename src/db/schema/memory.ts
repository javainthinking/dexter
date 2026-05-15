/**
 * dexter_memory_files / dexter_memory_chunks — persistent storage for the
 * agent's long-term memory (markdown files + per-chunk index for search).
 *
 * Phase 3 first-cut: store markdown content per (orgId, path) row. Vector
 * column is included but search is no-op until pgvector is enabled and
 * an embedding fingerprint pipeline is wired in (Phase 3.5).
 */

import { pgTable, text, timestamp, bigserial, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const memoryFiles = pgTable(
  'dexter_memory_files',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    orgId: text('org_id').default('global').notNull(),
    path: text('path').notNull(),                 // e.g. "MEMORY.md", "2026-05-14.md"
    content: text('content').default('').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    uniqueOrgPath: uniqueIndex('dexter_memory_files_org_path_uq').on(t.orgId, t.path),
  }),
);

export const memoryChunks = pgTable(
  'dexter_memory_chunks',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    orgId: text('org_id').default('global').notNull(),
    filePath: text('file_path').notNull(),
    startLine: integer('start_line').notNull(),
    endLine: integer('end_line').notNull(),
    content: text('content').notNull(),
    contentHash: text('content_hash').notNull(),  // sha256 of normalised text
    source: text('source').default('memory').notNull(),
    // Vector column added by migration via raw SQL (drizzle-orm pgvector
    // helper requires the pgvector extension; we keep the column declaration
    // in the migration file rather than the Drizzle schema to avoid hard
    // dependency on the pgvector npm package at build time).
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    uniqueHash: uniqueIndex('dexter_memory_chunks_hash_uq').on(t.orgId, t.contentHash),
    byFile: index('dexter_memory_chunks_file_idx').on(t.orgId, t.filePath),
  }),
);

export type MemoryFileRow = typeof memoryFiles.$inferSelect;
export type MemoryChunkRow = typeof memoryChunks.$inferSelect;
