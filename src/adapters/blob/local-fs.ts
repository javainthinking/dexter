/**
 * LocalFsBlobStore — implements the BlobStore port over the local filesystem.
 *
 * Keys are forward-slash paths and resolve relative to a configurable root
 * (defaults to the legacy .dexter/ directory). Adapter is safe to use from
 * CLI and the WhatsApp Worker. On Vercel use adapters/blob/vercel-blob.ts.
 *
 * Concurrency: writes go through a temp-file rename for atomic replace on
 * POSIX. Append uses appendFileSync which is itself atomic for small writes
 * on local disks (good enough for our log + scratchpad use cases).
 */

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, join, posix, relative, sep, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { BlobStore, BlobPutOptions, BlobUrlOptions } from '../../ports/blob.js';
import { getDexterDir } from '../../utils/paths.js';

export interface LocalFsBlobStoreOptions {
  /** Filesystem root; everything else is below this. Defaults to .dexter/. */
  root?: string;
}

export class LocalFsBlobStore implements BlobStore {
  private readonly root: string;

  constructor(options: LocalFsBlobStoreOptions = {}) {
    this.root = options.root ?? getDexterDir();
  }

  private resolveKey(key: string): string {
    // Treat keys as forward-slash paths; reject .. escapes.
    const normalized = posix.normalize(key.replace(/^\/+/, ''));
    if (normalized.startsWith('..')) {
      throw new Error(`BlobStore key escapes root: ${key}`);
    }
    const native = normalized.split(posix.sep).join(sep);
    const full = resolve(this.root, native);
    const rootResolved = resolve(this.root);
    const rel = relative(rootResolved, full);
    if (rel.startsWith('..')) {
      throw new Error(`BlobStore key escapes root: ${key}`);
    }
    return full;
  }

  private ensureDir(filePath: string): void {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  async getText(key: string): Promise<string> {
    const full = this.resolveKey(key);
    if (!existsSync(full)) return '';
    return readFileSync(full, 'utf-8');
  }

  async getBytes(key: string): Promise<Uint8Array> {
    const full = this.resolveKey(key);
    if (!existsSync(full)) {
      throw new Error(`Blob not found: ${key}`);
    }
    return new Uint8Array(readFileSync(full));
  }

  async exists(key: string): Promise<boolean> {
    return existsSync(this.resolveKey(key));
  }

  async putText(key: string, value: string, options: BlobPutOptions = {}): Promise<void> {
    const full = this.resolveKey(key);
    this.ensureDir(full);
    if (options.append) {
      appendFileSync(full, value, 'utf-8');
      return;
    }
    this.atomicWrite(full, value);
  }

  async putBytes(key: string, value: Uint8Array, options: BlobPutOptions = {}): Promise<void> {
    const full = this.resolveKey(key);
    this.ensureDir(full);
    if (options.append) {
      appendFileSync(full, value);
      return;
    }
    this.atomicWrite(full, value);
  }

  async remove(key: string): Promise<void> {
    const full = this.resolveKey(key);
    if (existsSync(full)) {
      unlinkSync(full);
    }
  }

  async list(prefix: string): Promise<string[]> {
    const fullPrefix = this.resolveKey(prefix);
    if (!existsSync(fullPrefix)) return [];
    const stat = statSync(fullPrefix);
    if (!stat.isDirectory()) {
      return [prefix];
    }
    const out: string[] = [];
    const rootResolved = resolve(this.root);
    const walk = (dir: string): void => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const child = join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(child);
        } else if (entry.isFile()) {
          const rel = relative(rootResolved, child).split(sep).join('/');
          out.push(rel);
        }
      }
    };
    walk(fullPrefix);
    return out.sort();
  }

  async url(key: string, _options?: BlobUrlOptions): Promise<string> {
    return pathToFileURL(this.resolveKey(key)).href;
  }

  private atomicWrite(fullPath: string, value: string | Uint8Array): void {
    const tmp = `${fullPath}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`;
    try {
      if (typeof value === 'string') {
        writeFileSync(tmp, value, 'utf-8');
      } else {
        writeFileSync(tmp, value);
      }
      renameSync(tmp, fullPath);
    } catch (err) {
      try {
        if (existsSync(tmp)) unlinkSync(tmp);
      } catch {
        /* ignore */
      }
      throw err;
    }
  }
}
