/**
 * Vercel Blob adapter — implements the BlobStore port against @vercel/blob.
 *
 * Phase 3 single-tenant: blobs live in one bucket, keyed by the path the
 * caller supplies. Phase 4 multi-tenant will prepend `orgs/<orgId>/` to
 * every key so cross-tenant URLs are unguessable.
 *
 * Auth: `put`/`del`/`list` rely on `BLOB_READ_WRITE_TOKEN` (auto-injected
 * by Vercel; pull locally with `vercel env pull`).
 *
 * Defaults to `access: 'public'` so reads can go through the CDN. Switch
 * to `'private'` per-key when a blob must require auth (e.g. PII reports).
 */

import {
  put,
  del,
  list as listBlobs,
  head,
} from '@vercel/blob';
import type { BlobStore, BlobPutOptions, BlobUrlOptions } from '../../ports/blob.js';

export interface VercelBlobStoreOptions {
  /** Keys are prefixed with this segment to namespace one app inside a token. */
  prefix?: string;
  access?: 'public' | 'private';
}

export class VercelBlobStore implements BlobStore {
  private readonly prefix: string;
  private readonly access: 'public' | 'private';

  constructor(options: VercelBlobStoreOptions = {}) {
    this.prefix = options.prefix ? trimSlashes(options.prefix) + '/' : '';
    this.access = options.access ?? 'public';
  }

  private key(rawKey: string): string {
    return this.prefix + rawKey.replace(/^\/+/, '');
  }

  async getText(key: string): Promise<string> {
    const meta = await this.headSafe(key);
    if (!meta) return '';
    const response = await fetch(meta.url);
    if (!response.ok) return '';
    return response.text();
  }

  async getBytes(key: string): Promise<Uint8Array> {
    const meta = await this.headSafe(key);
    if (!meta) throw new Error(`Blob not found: ${key}`);
    const response = await fetch(meta.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob ${key}: ${response.status}`);
    }
    return new Uint8Array(await response.arrayBuffer());
  }

  async exists(key: string): Promise<boolean> {
    return (await this.headSafe(key)) !== null;
  }

  async putText(key: string, value: string, options: BlobPutOptions = {}): Promise<void> {
    if (options.append) {
      const existing = await this.getText(key);
      const separator = existing.endsWith('\n') || existing.length === 0 ? '' : '\n';
      await this.writeRaw(key, existing + separator + value, options.contentType);
      return;
    }
    await this.writeRaw(key, value, options.contentType);
  }

  async putBytes(key: string, value: Uint8Array, options: BlobPutOptions = {}): Promise<void> {
    if (options.append) {
      const existing = await this.headSafe(key);
      if (existing) {
        const prev = new Uint8Array(await (await fetch(existing.url)).arrayBuffer());
        const merged = new Uint8Array(prev.length + value.length);
        merged.set(prev, 0);
        merged.set(value, prev.length);
        await this.writeRaw(key, merged, options.contentType);
        return;
      }
    }
    await this.writeRaw(key, value, options.contentType);
  }

  async remove(key: string): Promise<void> {
    const meta = await this.headSafe(key);
    if (!meta) return;
    await del(meta.url);
  }

  async list(prefix: string): Promise<string[]> {
    const fullPrefix = this.key(prefix);
    const out: string[] = [];
    let cursor: string | undefined;
    do {
      const { blobs, cursor: next } = await listBlobs({ prefix: fullPrefix, cursor });
      for (const b of blobs) out.push(this.stripPrefix(b.pathname));
      cursor = next;
    } while (cursor);
    return out;
  }

  async url(key: string, _options?: BlobUrlOptions): Promise<string> {
    const meta = await this.headSafe(key);
    if (!meta) throw new Error(`Blob not found: ${key}`);
    return meta.url;
  }

  // --- internals ---

  private async writeRaw(
    key: string,
    body: string | Uint8Array,
    contentType?: string,
  ): Promise<void> {
    // @vercel/blob's put() accepts Buffer but not bare Uint8Array; wrap it.
    const payload = typeof body === 'string' ? body : Buffer.from(body);
    await put(this.key(key), payload, {
      access: this.access,
      contentType,
      // `addRandomSuffix: false` keeps the path stable so `get`/`exists`
      // by key continues to work after a re-upload.
      addRandomSuffix: false,
      // Allow overwrites — our put*() semantics replace the previous blob.
      allowOverwrite: true,
    });
  }

  private async headSafe(key: string): Promise<{ url: string } | null> {
    try {
      const meta = await head(this.key(key));
      return { url: meta.url };
    } catch {
      return null;
    }
  }

  private stripPrefix(pathname: string): string {
    return this.prefix && pathname.startsWith(this.prefix)
      ? pathname.slice(this.prefix.length)
      : pathname;
  }
}

function trimSlashes(s: string): string {
  return s.replace(/^\/+|\/+$/g, '');
}
