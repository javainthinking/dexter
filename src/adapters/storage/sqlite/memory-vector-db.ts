/**
 * SQLite-backed memory vector index adapter.
 *
 * For Phase 0 this is a thin re-export of the existing MemoryDatabase class.
 * The Memory port wraps higher-level operations; this file marks the storage
 * substrate so that Phase 3 can swap to Postgres + pgvector by introducing
 * a parallel adapters/storage/postgres/memory-vector-db.ts without touching
 * any consumer.
 */

export { MemoryDatabase } from '../../../memory/database.js';
