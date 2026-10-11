import { app, safeStorage } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * In-app sign-in. The renderer shows web's sign-in page (email + 6-digit
 * code); main answers its `/api/auth/email/verify` call by redeeming the
 * code at `/api/desktop/email/verify`, which returns a desktop Bearer token
 * instead of a cookie (apps/web/app/api/desktop/email/verify/route.ts).
 *
 * The token is encrypted with safeStorage (macOS Keychain-backed key) and
 * kept in userData; it never reaches the renderer.
 */
export class AuthStore {
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

  /**
   * Redeems an email code for a desktop token. Returns the server's response
   * shape for web's sign-in form: `{ ok, userId }` or `{ error, message }`.
   */
  async verifyEmailCode(body: unknown): Promise<{ status: number; json: Record<string, unknown> }> {
    const res = await fetch(new URL('/api/desktop/email/verify', this.apiBase), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    });
    const json = (await res.json().catch(() => ({}))) as { token?: string; userId?: string } & Record<string, unknown>;
    if (!res.ok || !json.token) return { status: res.ok ? 500 : res.status, json };
    await this.save(json.token);
    return { status: 200, json: { ok: true, userId: json.userId } };
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
