/**
 * BlobStore — generic byte/text blob storage abstraction.
 *
 * Adapters:
 *   - adapters/blob/local-fs       (CLI / WhatsApp Worker — writes to .dexter/)
 *   - adapters/blob/vercel-blob    (Web SaaS — Vercel Blob)
 *
 * Keys are forward-slash paths (no leading slash). Adapters translate to
 * filesystem paths or object-storage object keys.
 */

export interface BlobPutOptions {
  contentType?: string;
  /** If true, append to existing content instead of overwrite. */
  append?: boolean;
}

export interface BlobUrlOptions {
  /** TTL for signed URL in seconds; ignored by adapters that always return public URLs. */
  ttlSec?: number;
}

export interface BlobStore {
  /** Read a blob as UTF-8 text. Returns empty string if not found. */
  getText(key: string): Promise<string>;

  /** Read a blob as raw bytes. Throws if not found. */
  getBytes(key: string): Promise<Uint8Array>;

  /** Check whether a blob exists. */
  exists(key: string): Promise<boolean>;

  /** Write a blob (overwrite by default; append when options.append). */
  putText(key: string, value: string, options?: BlobPutOptions): Promise<void>;

  /** Write raw bytes. */
  putBytes(key: string, value: Uint8Array, options?: BlobPutOptions): Promise<void>;

  /** Remove a blob. No-op if it does not exist. */
  remove(key: string): Promise<void>;

  /** List blob keys under a prefix. */
  list(prefix: string): Promise<string[]>;

  /**
   * Return a URL clients can use to fetch the blob.
   * For local-fs this may return a file:// URL or a relative path.
   * For Vercel Blob this returns the public (or signed) https URL.
   */
  url(key: string, options?: BlobUrlOptions): Promise<string>;
}
