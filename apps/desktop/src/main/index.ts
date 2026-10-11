import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AccountState, AgentEvent } from '../shared/ipc';
import { AgentHost } from './agent-host';
import { AuthStore, PROTOCOL } from './auth';

const here = path.dirname(fileURLToPath(import.meta.url));

const API_BASE = process.env.PICKSKILL_API_BASE ?? 'https://pickskill.ai';

// pickskill:// links arrive via `open-url` on macOS. In dev the protocol is
// registered against the Electron binary + app path.
if (process.defaultApp && process.argv[1]) {
  app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}
if (!app.requestSingleInstanceLock()) app.quit();

const auth = new AuthStore(API_BASE);
let win: BrowserWindow | null = null;
let account: AccountState = { status: 'signed-out' };

const broadcast = (channel: string, payload: unknown) => win?.webContents.send(channel, payload);
const agent = new AgentHost(API_BASE, (event: AgentEvent) => broadcast('agent:event', event));

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
  agent.stop();
  await auth.signOut();
  setAccount({ status: 'signed-out', error });
}

async function handleDeepLink(url: string): Promise<void> {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
  try {
    await auth.handleCallback(url);
    await refreshAccount();
  } catch (err) {
    setAccount({ status: 'signed-out', error: err instanceof Error ? err.message : String(err) });
  }
}

app.on('open-url', (event, url) => {
  event.preventDefault();
  void app.whenReady().then(() => handleDeepLink(url));
});

function createWindow(): void {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0b0d10',
    webPreferences: {
      preload: path.join(here, '../preload/index.cjs'),
      contextIsolation: true,
      sandbox: true,
    },
  });
  // Any link the renderer opens goes to the system browser, never a new
  // Electron window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });
  if (process.env.ELECTRON_RENDERER_URL) void win.loadURL(process.env.ELECTRON_RENDERER_URL);
  else void win.loadFile(path.join(here, '../renderer/index.html'));
  win.on('closed', () => (win = null));
}

ipcMain.handle('account:get', () => account);
ipcMain.handle('account:signIn', async () => {
  setAccount({ status: 'pending' });
  await auth.begin();
});
ipcMain.handle('account:signOut', () => signedOut());
// Renderer may only read app API paths; writes stay behind dedicated handlers.
ipcMain.handle('api:get', (_e, pathname: string) => {
  if (typeof pathname !== 'string' || !pathname.startsWith('/api/')) throw new Error('forbidden');
  return api(pathname);
});
ipcMain.handle('agent:prompt', async (_e, text: string, sessionID?: string) => ({
  sessionID: await agent.prompt(text, sessionID),
}));
ipcMain.handle('agent:status', () => agent.status);
ipcMain.handle('agent:abort', (_e, sessionID: string) => agent.abort(sessionID));

app.whenReady().then(async () => {
  createWindow();
  await auth.load();
  await refreshAccount();
  // Dev / test hook: a deep link passed on the command line.
  const link = process.argv.find((a) => a.startsWith(`${PROTOCOL}://`));
  if (link) await handleDeepLink(link);
});

app.on('activate', () => {
  if (!win) createWindow();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('before-quit', () => agent.stop());
