import { app, safeStorage, shell } from 'electron';
import { createHash, randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

/**
 * Sign-in. The renderer shows web's sign-in page. Email + 6-digit code
 * stays in-app: main answers its `/api/auth/email/verify` call by redeeming the
 * code at `/api/desktop/email/verify`, which returns a desktop Bearer token
 * instead of a cookie (apps/web/app/api/desktop/email/verify/route.ts).
 *
 * Google refuses to sign in inside embedded app windows, so "Continue with
 * Google" uses the system browser (RFC 8252): a one-shot loopback server on
 * 127.0.0.1 receives the code from /desktop/authorize, which is exchanged
 * with the PKCE verifier at /api/desktop/token (apps/web/lib/auth/desktop.ts).
 *
 * The token is encrypted with safeStorage (macOS Keychain-backed key) and
 * kept in userData; it never reaches the renderer.
 */

const GOOGLE_TIMEOUT_MS = 10 * 60 * 1000;

const DONE_PAGE = `<!doctype html><meta charset="utf-8"><title>PickSkill</title>
<body style="font:15px -apple-system,system-ui,sans-serif;display:grid;place-items:center;height:90vh;color:#444">
<div style="text-align:center"><h2 style="color:#111">Signed in to PickSkill</h2><p>You can close this tab and return to the app.</p></div>`;

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

  private google: { server: http.Server; timer: NodeJS.Timeout; reject: (e: Error) => void } | null = null;

  /**
   * Runs the browser-based Google sign-in. Resolves once the token is
   * stored; rejects on cancel, timeout or a failed exchange.
   */
  signInWithGoogle(): Promise<void> {
    this.cancelGoogle();
    const verifier = randomBytes(48).toString('base64url');
    const state = randomBytes(24).toString('base64url');
    const challenge = createHash('sha256').update(verifier).digest('base64url');

    return new Promise<void>((resolve, reject) => {
      const server = http.createServer((req, res) => {
        const url = new URL(req.url ?? '/', 'http://127.0.0.1');
        if (url.pathname !== '/callback') {
          res.writeHead(404).end();
          return;
        }
        const code = url.searchParams.get('code');
        if (!code || url.searchParams.get('state') !== state) {
          res.writeHead(400, { 'content-type': 'text/plain' }).end('Invalid sign-in response.');
          return;
        }
        this.exchange(code, verifier).then(
          () => {
            res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(DONE_PAGE);
            this.finishGoogle();
            resolve();
          },
          (err: Error) => {
            res.writeHead(500, { 'content-type': 'text/plain' }).end('Sign-in failed. Please try again from PickSkill.');
            this.finishGoogle();
            reject(err);
          },
        );
      });
      const timer = setTimeout(() => this.cancelGoogle(new Error('Google sign-in timed out.')), GOOGLE_TIMEOUT_MS);
      this.google = { server, timer, reject };
      server.listen(0, '127.0.0.1', () => {
        const { port } = server.address() as { port: number };
        const url = new URL('/desktop/authorize', this.apiBase);
        url.search = new URLSearchParams({
          state,
          code_challenge: challenge,
          code_challenge_method: 'S256',
          redirect_uri: `http://127.0.0.1:${port}/callback`,
          provider: 'google',
        }).toString();
        void shell.openExternal(url.toString());
      });
    });
  }

  cancelGoogle(reason = new Error('cancelled')): void {
    const pending = this.google;
    if (!pending) return;
    this.finishGoogle();
    pending.reject(reason);
  }

  private finishGoogle(): void {
    if (!this.google) return;
    clearTimeout(this.google.timer);
    this.google.server.close();
    this.google = null;
  }

  private async exchange(code: string, verifier: string): Promise<void> {
    const res = await fetch(new URL('/api/desktop/token', this.apiBase), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code, code_verifier: verifier }),
    });
    const json = (await res.json().catch(() => ({}))) as { token?: string };
    if (!res.ok || !json.token) throw new Error(`Sign-in failed (${res.status})`);
    await this.save(json.token);
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
