import { app, utilityProcess, type UtilityProcess } from 'electron';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AgentEvent, AgentStatus, WorkerMessage, WorkerRequest } from '../shared/ipc';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Owns the agent utilityProcess: starts it with the current token, restarts
 * it when the token changes, and correlates prompt requests with replies.
 */
export class AgentHost {
  private child: UtilityProcess | null = null;
  status: AgentStatus = { state: 'stopped' };
  private readonly waiting = new Map<string, { resolve: (id: string) => void; reject: (e: Error) => void }>();

  constructor(
    private readonly apiBase: string,
    private readonly onEvent: (event: AgentEvent) => void,
  ) {}

  start(token: string): void {
    this.stop();
    const child = utilityProcess.fork(path.join(here, 'agent-worker.js'), [], {
      serviceName: 'PickSkill Agent',
      stdio: 'inherit',
    });
    child.on('message', (msg: WorkerMessage) => this.handle(msg));
    child.on('exit', (code) => {
      if (this.child !== child) return;
      this.child = null;
      this.failAll(new Error(`agent exited (${code})`));
      this.status = { state: 'error', message: `Agent stopped (exit ${code}).` };
      this.onEvent({ type: 'error', message: `Agent stopped (exit ${code}).` });
    });
    this.child = child;
    this.status = { state: 'starting' };
    this.send({
      type: 'init',
      apiBase: this.apiBase,
      token,
      dataDir: app.getPath('userData'),
      skillsDir: app.isPackaged
        ? path.join(process.resourcesPath, 'skills')
        : path.resolve(app.getAppPath(), '../../src/skills'),
    });
  }

  stop(): void {
    const child = this.child;
    this.child = null;
    this.status = { state: 'stopped' };
    if (!child) return;
    this.failAll(new Error('agent stopped'));
    child.postMessage({ type: 'shutdown' } satisfies WorkerRequest);
    setTimeout(() => child.kill(), 2000);
  }

  prompt(text: string, sessionID?: string): Promise<string> {
    if (!this.child) return Promise.reject(new Error('Sign in to use the analyst.'));
    const requestID = randomUUID();
    return new Promise((resolve, reject) => {
      this.waiting.set(requestID, { resolve, reject });
      this.send({ type: 'prompt', requestID, sessionID, text });
    });
  }

  abort(sessionID: string): void {
    this.send({ type: 'abort', sessionID });
  }

  private send(req: WorkerRequest): void {
    this.child?.postMessage(req);
  }

  private handle(msg: WorkerMessage): void {
    if (msg.type === 'event') {
      if (msg.event.type === 'ready') this.status = { state: 'ready', tools: msg.event.tools };
      else if (msg.event.type === 'error' && this.status.state === 'starting') {
        this.status = { state: 'error', message: msg.event.message };
      }
      return this.onEvent(msg.event);
    }
    const pending = this.waiting.get(msg.requestID);
    if (!pending) return;
    this.waiting.delete(msg.requestID);
    if (msg.type === 'prompt-accepted') pending.resolve(msg.sessionID);
    else pending.reject(new Error(msg.message));
  }

  private failAll(err: Error): void {
    for (const p of this.waiting.values()) p.reject(err);
    this.waiting.clear();
  }
}
