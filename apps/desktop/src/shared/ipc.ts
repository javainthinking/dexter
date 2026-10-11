// Contract between main, preload, renderer and the agent worker.

export interface AccountState {
  status: 'signed-out' | 'pending' | 'signed-in';
  user?: { id: string; name?: string | null; email?: string | null; image?: string | null };
  plan?: string;
  error?: string;
}

/** Normalised agent events forwarded to the renderer. */
export type AgentEvent =
  | { type: 'ready'; tools: string[] }
  | { type: 'text'; sessionID: string; delta: string }
  | { type: 'tool'; sessionID: string; name: string; status: 'called' | 'success' | 'error'; detail?: string }
  | { type: 'done'; sessionID: string; ok: boolean; error?: string }
  | { type: 'error'; message: string };

export type AgentStatus =
  | { state: 'stopped' }
  | { state: 'starting' }
  | { state: 'ready'; tools: string[] }
  | { state: 'error'; message: string };

/** main → worker */
export type WorkerRequest =
  | { type: 'init'; apiBase: string; token: string; dataDir: string; skillsDir: string }
  | { type: 'prompt'; requestID: string; sessionID?: string; text: string }
  | { type: 'abort'; sessionID: string }
  | { type: 'shutdown' };

/** worker → main */
export type WorkerMessage =
  | { type: 'event'; event: AgentEvent }
  | { type: 'prompt-accepted'; requestID: string; sessionID: string }
  | { type: 'prompt-failed'; requestID: string; message: string };

export interface PickSkillBridge {
  account: {
    get(): Promise<AccountState>;
    signIn(): Promise<void>;
    signOut(): Promise<void>;
    onChange(cb: (state: AccountState) => void): () => void;
  };
  api: {
    get<T = unknown>(path: string): Promise<T>;
  };
  agent: {
    prompt(text: string, sessionID?: string): Promise<{ sessionID: string }>;
    abort(sessionID: string): Promise<void>;
    /** Latest lifecycle status, for views that mount after `ready` fired. */
    status(): Promise<AgentStatus>;
    onEvent(cb: (event: AgentEvent) => void): () => void;
  };
}
