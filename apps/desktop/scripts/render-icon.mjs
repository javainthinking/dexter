// Renders build/icon.svg → build/icon.png (1024×1024, transparent) with
// Electron's own Chromium, so no extra image tooling is needed.
// Run: npx electron scripts/render-icon.mjs
import { app, BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../build');
const svg = fs.readFileSync(path.join(dir, 'icon.svg'), 'utf8');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 1024,
    show: false,
    frame: false,
    transparent: true,
    useContentSize: true,
    webPreferences: { offscreen: true, zoomFactor: 1 },
  });
  win.webContents.setZoomFactor(1);
  const html = `<html><body style="margin:0;background:transparent">${svg}</body></html>`;
  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  await new Promise((r) => setTimeout(r, 300));
  const image = await win.webContents.capturePage({ x: 0, y: 0, width: 1024, height: 1024 });
  const png = image.resize({ width: 1024, height: 1024, quality: 'best' }).toPNG();
  fs.writeFileSync(path.join(dir, 'icon.png'), png);
  console.log(`build/icon.png ${image.getSize().width}x${image.getSize().height}`);
  app.quit();
});
