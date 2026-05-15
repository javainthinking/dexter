/**
 * KvStore — simple namespaced key-value store for small structured records.
 *
 * Adapters:
 *   - adapters/kv/json-file     (CLI / Worker — single JSON file per namespace)
 *   - adapters/kv/postgres      (Web SaaS — single row per record)
 *
 * Records are serialised as JSON. Keys must be unique within a namespace.
 */

export interface KvStore<TValue = unknown> {
  /** Namespace identifier (table name / file name). */
  readonly namespace: string;

  get(key: string): Promise<TValue | null>;
  set(key: string, value: TValue): Promise<void>;
  delete(key: string): Promise<boolean>;
  list(): Promise<Array<{ key: string; value: TValue }>>;
  /**
   * Atomic read-modify-write. Adapter MUST guarantee no torn writes within a
   * single namespace (file-rename trick for json-file, transaction for SQL).
   */
  mutate(key: string, fn: (current: TValue | null) => TValue | null): Promise<TValue | null>;
}
