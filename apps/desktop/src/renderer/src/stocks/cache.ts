import { useEffect, useState } from 'react';

/**
 * Stale-while-revalidate cache for the stock pages' JSON.
 *
 * The server already caches the underlying data (3 h price snapshots,
 * 24 h AI read), so this layer is about the app feeling instant: a page
 * seen before renders immediately from memory or localStorage, even after
 * a restart, and is refetched in the background once it is older than
 * FRESH_MS. Entries older than MAX_AGE_MS are not shown.
 */

const FRESH_MS = 10 * 60 * 1000;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 40;
const PREFIX = 'pickskill:stocks:';

interface Entry<T> {
  at: number;
  data: T;
}

const memory = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

function readStored<T>(key: string): Entry<T> | null {
  const hit = memory.get(key) as Entry<T> | undefined;
  if (hit) return hit;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as Entry<T>;
    memory.set(key, entry);
    return entry;
  } catch {
    return null;
  }
}

function writeStored<T>(key: string, data: T): void {
  const entry: Entry<T> = { at: Date.now(), data };
  memory.set(key, entry);
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
    prune();
  } catch {
    // Quota or storage unavailable: drop the oldest half and keep going
    // with the in-memory copy.
    prune(Math.floor(MAX_ENTRIES / 2));
  }
}

/** Keeps the newest `keep` stored entries. */
function prune(keep = MAX_ENTRIES): void {
  try {
    const keys: Array<{ key: string; at: number }> = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k?.startsWith(PREFIX)) continue;
      const at = (JSON.parse(localStorage.getItem(k) ?? '{}') as { at?: number }).at ?? 0;
      keys.push({ key: k, at });
    }
    if (keys.length <= keep) return;
    keys.sort((a, b) => b.at - a.at);
    for (const { key } of keys.slice(keep)) localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}

export class HttpError extends Error {
  constructor(readonly status: number) {
    super(`HTTP ${status}`);
  }
}

function load<T>(url: string): Promise<T> {
  let p = inflight.get(url) as Promise<T> | undefined;
  if (!p) {
    p = fetch(url, { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) throw new HttpError(r.status);
        const data = (await r.json()) as T;
        writeStored(url, data);
        return data;
      })
      .finally(() => inflight.delete(url));
    inflight.set(url, p);
  }
  return p;
}

export interface Cached<T> {
  data: T | null;
  error: Error | null;
  /** True while a fetch is running, including a background refresh. */
  loading: boolean;
}

/** `url`'s JSON: cached copy first (if any and not too old), then a refresh when it's stale. */
export function useCachedJson<T>(url: string | null): Cached<T> {
  const initial = (): Cached<T> => {
    const hit = url ? readStored<T>(url) : null;
    const usable = hit && Date.now() - hit.at < MAX_AGE_MS ? hit.data : null;
    return { data: usable, error: null, loading: !!url && (!hit || Date.now() - hit.at >= FRESH_MS) };
  };
  const [state, setState] = useState<Cached<T>>(initial);

  useEffect(() => {
    if (!url) return;
    const hit = readStored<T>(url);
    const usable = hit && Date.now() - hit.at < MAX_AGE_MS ? hit.data : null;
    const stale = !hit || Date.now() - hit.at >= FRESH_MS;
    setState({ data: usable, error: null, loading: stale });
    if (!stale) return;
    let live = true;
    load<T>(url).then(
      (data) => live && setState({ data, error: null, loading: false }),
      (error: Error) => live && setState((s) => ({ data: s.data, error, loading: false })),
    );
    return () => {
      live = false;
    };
  }, [url]);

  return state;
}
