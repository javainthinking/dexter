/**
 * dexter_memory_files / dexter_memory_chunks — persistent storage for the
 * agent's long-term memory (markdown files + per-chunk index for search).
 *
 * Memory is user-scoped (user_id FK → dexter_users.id, ON DELETE CASCADE).
 * Vector column is reserved for pgvector + an embedding fingerprint pipeline.
 */

import { pgTable, text, timestamp, bigserial, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './auth.js';

export const memoryFiles = pgTable(
  'dexter_memory_files',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    path: text('path').notNull(),                 // e.g. "MEMORY.md", "2026-05-14.md"
    content: text('content').default('').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    uniqueUserPath: uniqueIndex('dexter_memory_files_user_path_uq').on(t.userId, t.path),
  }),
);

export const memoryChunks = pgTable(
  'dexter_memory_chunks',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    filePath: text('file_path').notNull(),
    startLine: integer('start_line').notNull(),
    endLine: integer('end_line').notNull(),
    content: text('content').notNull(),
    contentHash: text('content_hash').notNull(),  // sha256 of normalised text
    source: text('source').default('memory').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    uniqueHash: uniqueIndex('dexter_memory_chunks_hash_uq').on(t.userId, t.contentHash),
    byFile: index('dexter_memory_chunks_file_idx').on(t.userId, t.filePath),
  }),
);

export type MemoryFileRow = typeof memoryFiles.$inferSelect;
export type MemoryChunkRow = typeof memoryChunks.$inferSelect;
