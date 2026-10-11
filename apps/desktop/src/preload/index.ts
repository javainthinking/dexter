import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import type { AccountState, AgentEvent, PickSkillBridge } from '../shared/ipc';

function subscribe<T>(channel: string, cb: (payload: T) => void): () => void {
  const listener = (_e: IpcRendererEvent, payload: T) => cb(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

const bridge: PickSkillBridge = {
  account: {
    get: () => ipcRenderer.invoke('account:get'),
    signIn: () => ipcRenderer.invoke('account:signIn'),
    signOut: () => ipcRenderer.invoke('account:signOut'),
    onChange: (cb) => subscribe<AccountState>('account:changed', cb),
  },
  api: {
    get: (path) => ipcRenderer.invoke('api:get', path),
  },
  agent: {
    prompt: (text, sessionID) => ipcRenderer.invoke('agent:prompt', text, sessionID),
    abort: (sessionID) => ipcRenderer.invoke('agent:abort', sessionID),
    status: () => ipcRenderer.invoke('agent:status'),
    onEvent: (cb) => subscribe<AgentEvent>('agent:event', cb),
  },
};

contextBridge.exposeInMainWorld('pickskill', bridge);
