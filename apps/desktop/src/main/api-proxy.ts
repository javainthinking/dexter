import { net, protocol } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * The renderer runs apps/web's client components, which call relative
 * `/api/*` URLs. Those calls are forwarded to the PickSkill server with the
 * desktop Bearer token attached here in main — the token never reaches the
 * renderer.
 *
 * The renderer is always loaded from app://pickskill/: from out/renderer
 * when packaged, or forwarded to the Vite dev server in development (HMR
 * connects to Vite directly, see electron.vite.config.ts). Routes the app
 * answers itself (the local chat agent) are tried before the server.
 */

export const APP_SCHEME = 'app';
export const APP_ORIGIN = `${APP_SCHEME}://pickskill`;

export interface ProxyDeps {
  apiBase: string;
  token: () => string | null;
  /** Called when the server rejects the token. */
  onUnauthorized: () => void;
  /** Answers /api routes served on this Mac; null falls through to the server. */
  local?: (req: Request, url: URL) => Promise<Response | null>;
}

/** Must run before app `ready`. */
export function registerAppScheme(): void {
  protocol.registerSchemesAsPrivileged([
    { scheme: APP_SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } },
  ]);
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

/** `renderer` is the built renderer directory, or the Vite dev server URL. */
export function serveApp(renderer: string, deps: ProxyDeps): void {
  const devServer = /^https?:/.test(renderer) ? renderer : null;
  const rendererDir = renderer;
  protocol.handle(APP_SCHEME, async (req) => {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) return (await deps.local?.(req, url)) ?? forward(req, url, deps);
    if (devServer) {
      const res = await net.fetch(new URL(url.pathname + url.search, devServer).toString());
      // In-app routes (no file extension) get Vite's index.html.
      if (res.status !== 404 || path.extname(url.pathname)) return res;
      return net.fetch(new URL('/', devServer).toString());
    }
    // Static asset, or the SPA shell for any in-app route.
    const rel = path.normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
    const file = path.join(rendererDir, rel);
    if (file.startsWith(rendererDir) && path.extname(file)) {
      try {
        const body = await fs.readFile(file);
        return new Response(body, { headers: { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' } });
      } catch {
        return new Response('not found', { status: 404 });
      }
    }
    const html = await fs.readFile(path.join(rendererDir, 'index.html'));
    return new Response(html, { headers: { 'content-type': MIME['.html'] } });
  });
}

async function forward(req: Request, url: URL, deps: ProxyDeps): Promise<Response> {
  const token = deps.token();
  if (!token) return Response.json({ error: 'unauthenticated' }, { status: 401 });
  const headers = new Headers(req.headers);
  headers.set('authorization', `Bearer ${token}`);
  headers.delete('cookie');
  headers.delete('origin');
  const target = new URL(url.pathname + url.search, deps.apiBase);
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const res = await net.fetch(target.toString(), {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    // Required by fetch for streamed request bodies.
    ...(hasBody ? { duplex: 'half' } : {}),
    redirect: 'manual',
    bypassCustomProtocolHandlers: true,
  } as RequestInit);
  if (res.status === 401) deps.onUnauthorized();
  return res;
}
