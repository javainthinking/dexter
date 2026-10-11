// End-to-end smoke test against the mock server (bun scripts/mock-pickskill.ts).
// Drives the built app with Playwright: in-app email-code sign-in,
// web's portfolio page renders with live quotes, and web's chat page runs a
// tool-calling turn on the local agent.
import { _electron as electron } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(here, '..');
const API = process.env.PICKSKILL_API_BASE ?? 'http://127.0.0.1:4319';
// E2E_APP=release/mac-arm64/PickSkill.app tests the packaged build instead of out/.
const packaged = process.env.E2E_APP;
const executablePath = packaged
  ? path.resolve(appDir, packaged, 'Contents/MacOS/PickSkill')
  : createRequire(import.meta.url)('electron');
const launchArgs = packaged ? [] : [appDir];
const shots = process.env.E2E_SHOTS ?? path.join(appDir, 'e2e-shots');

const app = await electron.launch({
  executablePath,
  args: launchArgs,
  cwd: appDir,
  env: { ...process.env, PICKSKILL_API_BASE: API },
});
const step = (msg) => console.log(`✓ ${msg}`);
try {
  const win = await app.firstWindow();
  await app.evaluate(({ shell }) => {
    globalThis.__opened = [];
    shell.openExternal = async (url) => void globalThis.__opened.push(url);
  });
  // Start from a clean signed-out state.
  const email = win.locator('input[type="email"]');
  await email.or(win.locator('nav[aria-label="Primary"]')).first().waitFor({ timeout: 15_000 });
  if (!(await email.isVisible())) await win.evaluate(() => window.pickskill.account.signOut());

  // Sign in inside the app: web's email + code form, no browser.
  await email.fill('demo@pickskill.local');
  await win.locator('button[type="submit"]').click();
  await win.locator('input[autocomplete="one-time-code"]').fill('123456');
  await win.locator('button[type="submit"]').click();
  await email.waitFor({ state: 'detached', timeout: 15_000 });
  const opened = await app.evaluate(() => globalThis.__opened);
  if (opened.length) throw new Error(`sign-in opened the browser: ${opened}`);
  step('signed in in-app with email code (no browser opened)');
  await win.screenshot({ path: `${shots}/1-portfolios-loading.png` });

  await win.getByText('NVDA', { exact: true }).first().waitFor({ timeout: 15_000 });
  await win.getByText(/^\$?\d{2,}\.\d{2}$/).first().waitFor({ timeout: 30_000 });
  step('shared web portfolio page rendered holdings + live quotes');
  await win.screenshot({ path: `${shots}/2-portfolios.png` });

  // Chat (web's page) runs on the local OpenCode agent via main's /api/agent.
  await win.evaluate(() => {
    history.pushState(null, '', '/chat');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  const composer = win.locator('textarea').first();
  await composer.waitFor({ timeout: 15_000 });
  const mock = (p, body) =>
    fetch(new URL(p, API), body === undefined ? {} : { method: 'POST', body: JSON.stringify(body) }).then((r) => r.json());
  const before = await mock('/__mock/usage');
  await composer.fill('What is NVDA trading at?');
  await composer.press('Enter');
  await win.getByText(/get_stock_price/).first().waitFor({ timeout: 60_000 });
  step('local agent called get_stock_price (tool card rendered)');
  await win.getByText(/"price"/).first().waitFor({ timeout: 60_000 });
  step('answer rendered in shared chat UI');
  await win.getByText('What is NVDA trading at?').first().waitFor();
  await win.screenshot({ path: `${shots}/3-chat.png` });

  // Quota, same as web: the turn above made two LLM calls (tool call +
  // answer) through the gateway and counts as exactly one conversation.
  let usage = await mock('/__mock/usage');
  for (let i = 0; i < 20 && usage.turns.some((t) => !t.completed); i++) {
    await new Promise((r) => setTimeout(r, 100));
    usage = await mock('/__mock/usage');
  }
  const newTurns = usage.turns.slice(before.turns.length);
  if (usage.conversations - before.conversations !== 1 || newTurns.length !== 1 || !newTurns[0].completed) {
    throw new Error(`metering: ${JSON.stringify(usage)}`);
  }
  step('turn admitted, metered once (1 conversation for 2 LLM calls), closed');
  // Over the limit: the server refuses the turn and web's upgrade dialog opens.
  await mock('/__mock/limit', { conversations: usage.conversations });
  await composer.fill('And MSFT?');
  await composer.press('Enter');
  await win.getByRole('dialog').waitFor({ timeout: 15_000 });
  await mock('/__mock/limit', { conversations: null });
  if ((await mock('/__mock/usage')).turns.length !== usage.turns.length) throw new Error('refused turn was admitted');
  step('over quota: 402 from turn admission opens the upgrade dialog');
  await win.screenshot({ path: `${shots}/4-quota.png` });
  await win.keyboard.press('Escape');

  // Token survives restart via safeStorage.
  await app.close();
  const app2 = await electron.launch({ executablePath, args: launchArgs, cwd: appDir, env: { ...process.env, PICKSKILL_API_BASE: API } });
  const win2 = await app2.firstWindow();
  await win2.getByText('NVDA', { exact: true }).first().waitFor({ timeout: 15_000 }).catch(async () => {
    throw new Error('session did not persist across restart');
  });
  step('session restored from Keychain-encrypted store after restart');
  await win2.evaluate(() => window.pickskill.account.signOut());
  await win2.locator('input[type="email"]').waitFor();
  step('sign out revokes token and returns to sign-in');

  // Google: system browser → /desktop/authorize → loopback callback → token.
  await app2.evaluate(({ shell }) => {
    globalThis.__opened = [];
    shell.openExternal = async (url) => void globalThis.__opened.push(url);
  });
  await win2.getByRole('button', { name: /Google/ }).click();
  const authorizeUrl = await app2.evaluate(async () => {
    for (let i = 0; i < 50 && !globalThis.__opened.length; i++) await new Promise((r) => setTimeout(r, 100));
    return globalThis.__opened[0];
  });
  const authorize = new URL(authorizeUrl);
  if (authorize.pathname !== '/desktop/authorize' || authorize.searchParams.get('provider') !== 'google') {
    throw new Error(`unexpected Google URL: ${authorizeUrl}`);
  }
  // Stand-in for the browser: follow the redirect chain to the app's loopback server.
  const done = await fetch(authorizeUrl);
  if (!(await done.text()).includes('Signed in to PickSkill')) throw new Error(`loopback page: ${done.status}`);
  await win2.locator('input[type="email"]').waitFor({ state: 'detached', timeout: 15_000 });
  step(`Google sign-in via system browser + loopback ${new URL(authorize.searchParams.get('redirect_uri')).host}`);
  await win2.evaluate(() => window.pickskill.account.signOut());
  await app2.close();
  console.log('E2E PASS');
} catch (err) {
  console.error('E2E FAIL:', err);
  await app.windows()[0]?.screenshot({ path: `${shots}/failure.png` }).catch(() => {});
  await app.close().catch(() => {});
  process.exit(1);
}
