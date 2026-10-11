import { app, safeStorage, shell } from 'electron';
import { createHash, randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * System-browser sign-in (RFC 8252 + PKCE), see apps/web/lib/auth/desktop.ts.
 *
 *   begin()            → opens <api>/desktop/authorize?state&code_challenge
 *   handleCallback(u)  → pickskill://auth/callback?code&state → POST /api/desktop/token
 *
 * The token is encrypted with safeStorage (macOS Keychain-backed key) and
 * kept in userData; it never reaches the renderer.
 */

export const PROTOCOL = 'pickskill';

interface Pending {
  state: string;
  verifier: string;
  startedAt: number;
}

const PENDING_TTL_MS = 10 * 60 * 1000;

export class AuthStore {
  private pending: Pending | null = null;
  private token: string | null = null;
  private readonly file = path.join(app.getPath('userData'), 'session.bin');

  constructor(private readonly apiBase: string) {}

  async load(): Promise<string | null> {
    try {
      const buf = await fs.readFile(this.file);
      this.token = safeStorage.decryptString(buf);
    } catch {
      this.token = null;
    }
    return this.token;
  }

  get current(): string | null {
    return this.token;
  }

  async begin(): Promise<void> {
    const verifier = randomBytes(48).toString('base64url');
    const state = randomBytes(24).toString('base64url');
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    this.pending = { state, verifier, startedAt: Date.now() };
    const url = new URL('/desktop/authorize', this.apiBase);
    url.search = new URLSearchParams({ state, code_challenge: challenge, code_challenge_method: 'S256' }).toString();
    await shell.openExternal(url.toString());
  }

  /** Returns the new token, or throws with a user-presentable reason. */
  async handleCallback(raw: string): Promise<string> {
    const url = new URL(raw);
    if (url.protocol !== `${PROTOCOL}:` || url.host !== 'auth' || url.pathname !== '/callback') {
      throw new Error('Unrecognised link');
    }
    const pending = this.pending;
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    // State must match the sign-in this app instance started; anything else
    // (stale tab, link from elsewhere) is dropped.
    if (!pending || !code || state !== pending.state || Date.now() - pending.startedAt > PENDING_TTL_MS) {
      throw new Error('Sign-in link expired. Please try again.');
    }
    this.pending = null;
    const res = await fetch(new URL('/api/desktop/token', this.apiBase), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code, code_verifier: pending.verifier }),
    });
    if (!res.ok) throw new Error(`Sign-in failed (${res.status})`);
    const { token } = (await res.json()) as { token: string };
    await this.save(token);
    return token;
  }

  async signOut(): Promise<void> {
    const token = this.token;
    await this.save(null);
    if (token) {
      await fetch(new URL('/api/desktop/token', this.apiBase), {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  }

  private async save(token: string | null): Promise<void> {
    this.token = token;
    if (token) await fs.writeFile(this.file, safeStorage.encryptString(token));
    else await fs.rm(this.file, { force: true });
  }
}
