import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import type { AccountState, PickSkillBridge } from '../shared/ipc';

function subscribe<T>(channel: string, cb: (payload: T) => void): () => void {
  const listener = (_e: IpcRendererEvent, payload: T) => cb(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

const apiArg = process.argv.find((a) => a.startsWith('--pickskill-api='));

const bridge: PickSkillBridge = {
  apiBase: apiArg ? apiArg.slice('--pickskill-api='.length) : 'https://pickskill.ai',
  onNavigate: (cb) => subscribe<string>('app:navigate', cb),
  account: {
    get: () => ipcRenderer.invoke('account:get'),
    signOut: () => ipcRenderer.invoke('account:signOut'),
    signInWithGoogle: () => ipcRenderer.invoke('account:signInWithGoogle'),
    cancelSignIn: () => ipcRenderer.invoke('account:cancelSignIn'),
    onChange: (cb) => subscribe<AccountState>('account:changed', cb),
  },
};

contextBridge.exposeInMainWorld('pickskill', bridge);
