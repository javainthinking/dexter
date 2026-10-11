// Runs spike.mjs inside an Electron utilityProcess and prints its result.
import { app, utilityProcess } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
app.whenReady().then(() => {
  const child = utilityProcess.fork(path.join(here, 'spike.mjs'), [], { stdio: 'inherit', serviceName: 'pickskill-agent' });
  child.on('message', (m) => console.log('[main] result from utilityProcess:', m.systemPromptReplaced && m.toolExecutions.length === 1 ? 'PASS' : 'FAIL', m.runtime));
  child.on('exit', (code) => { console.log('[main] agent exited', code); app.quit(); });
});
