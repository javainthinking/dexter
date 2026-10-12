import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AccountState, AgentEvent } from '../shared/ipc';
import { AgentHost } from './agent-host';
import { AuthStore } from './auth';
import { APP_ORIGIN, registerAppScheme, serveApp, type ProxyDeps } from './api-proxy';
import { LocalChat, type TurnGate } from './local-chat';

const here = path.dirname(fileURLToPath(import.meta.url));

const API_BASE = process.env.PICKSKILL_API_BASE ?? 'https://pickskill.ai';

if (!app.requestSingleInstanceLock()) app.quit();
registerAppScheme();

const auth = new AuthStore(API_BASE);
let win: BrowserWindow | null = null;
let account: AccountState = { status: 'signed-out' };

const broadcast = (channel: string, payload: unknown) => win?.webContents.send(channel, payload);
const agent = new AgentHost(API_BASE, (event: AgentEvent) => chat.onAgentEvent(event));
const turns: TurnGate = {
  async start(agentSessionId) {
    const token = auth.current;
    if (!token) return { refusal: Response.json({ error: 'unauthenticated' }, { status: 401 }) };
    const res = await fetch(new URL('/api/desktop/turns', API_BASE), {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ agentSessionId }),
    });
    if (res.status === 401) void signedOut('Your session expired. Please sign in again.');
    if (!res.ok) return { refusal: new Response(await res.text(), { status: res.status, headers: { 'content-type': 'application/json' } }) };
    return (await res.json()) as { turnId: string };
  },
  async complete(turnId) {
    await api(`/api/desktop/turns/${turnId}/complete`, { method: 'POST' });
  },
};
const chat = new LocalChat(agent, () => (account.status === 'signed-in' ? (account.user?.id ?? null) : null), turns);

function setAccount(next: AccountState): void {
  account = next;
  broadcast('account:changed', account);
}

async function api<T>(pathname: string, init: RequestInit = {}): Promise<T> {
  const token = auth.current;
  if (!token) throw new Error('signed-out');
  const res = await fetch(new URL(pathname, API_BASE), {
    ...init,
    headers: { ...(init.headers as Record<string, string>), authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    await signedOut('Your session expired. Please sign in again.');
    throw new Error('signed-out');
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function refreshAccount(): Promise<void> {
  if (!auth.current) return setAccount({ status: 'signed-out' });
  try {
    const me = await api<{ user: AccountState['user']; plan: string }>('/api/desktop/me');
    setAccount({ status: 'signed-in', user: me.user, plan: me.plan });
    agent.start(auth.current);
  } catch (err) {
    if (auth.current) setAccount({ status: 'signed-out', error: err instanceof Error ? err.message : String(err) });
  }
}

async function signedOut(error?: string): Promise<void> {
  if (!auth.current && account.status === 'signed-out') return;
  agent.stop();
  await auth.signOut();
  setAccount({ status: 'signed-out', error });
}

function createWindow(): void {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    // lg breakpoint, so web's desktop layout (sidebar + top bar) always applies.
    minWidth: 1100,
    minHeight: 600,
    // Traffic lights sit inside web's 56px top bar / sidebar header; the
    // renderer reserves room for them (see renderer styles).
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 18, y: 20 },
    backgroundColor: '#14120b',
    webPreferences: {
      preload: path.join(here, '../preload/index.cjs'),
      contextIsolation: true,
      sandbox: true,
      additionalArguments: [`--pickskill-api=${API_BASE}`],
    },
  });
  // Any link the renderer opens goes to the system browser, never a new
  // Electron window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });
  // Full-page navigations away from the app (Stripe checkout, OAuth, …) go
  // to the system browser too.
  win.webContents.on('will-navigate', (e, url) => {
    e.preventDefault();
    const target = new URL(url);
    // web code that hard-navigates within the app (`location.href = '/x'`)
    // becomes a client-side route change instead of a full reload.
    if (target.origin === APP_ORIGIN) broadcast('app:navigate', target.pathname + target.search + target.hash);
    else void shell.openExternal(url);
  });
  void win.loadURL(`${APP_ORIGIN}/`);
  win.on('closed', () => (win = null));
}

ipcMain.handle('account:get', () => account);
ipcMain.handle('account:signOut', () => signedOut());
ipcMain.handle('account:signInWithGoogle', async () => {
  setAccount({ status: 'signed-out', pending: 'google' });
  try {
    await auth.signInWithGoogle();
    if (win) {
      if (win.isMinimized()) win.restore();
      app.focus({ steal: true });
    }
    await refreshAccount();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    setAccount({ status: 'signed-out', error: message === 'cancelled' ? undefined : message });
  }
});
ipcMain.handle('account:cancelSignIn', () => auth.cancelGoogle());

const proxy: ProxyDeps = {
  apiBase: API_BASE,
  token: () => auth.current,
  onUnauthorized: () => void signedOut('Your session expired. Please sign in again.'),
  local: async (req, url) => {
    // Web's sign-in form posts here; redeem the code for a desktop token.
    if (url.pathname === '/api/auth/email/verify' && req.method === 'POST') {
      const { status, json } = await auth.verifyEmailCode(await req.json().catch(() => ({})));
      if (status === 200) await refreshAccount();
      return Response.json(json, { status });
    }
    return chat.handle(req, url);
  },
};

app.whenReady().then(async () => {
  // Packaged builds get the icon from the bundle; in dev, Electron's default would show.
  if (!app.isPackaged) app.dock?.setIcon(path.join(here, '../../build/icon.png'));
  serveApp(process.env.ELECTRON_RENDERER_URL ?? path.join(here, '../renderer'), proxy);
  createWindow();
  await auth.load();
  await refreshAccount();
});

app.on('activate', () => {
  if (!win) createWindow();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('before-quit', () => agent.stop());
