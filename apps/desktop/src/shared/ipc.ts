// Contract between main, preload, renderer and the agent worker.

export interface AccountState {
  status: 'signed-out' | 'signed-in';
  /** Google sign-in is waiting on the system browser. */
  pending?: 'google';
  user?: { id: string; name?: string | null; email?: string | null; image?: string | null };
  plan?: string;
  error?: string;
}

/** Normalised agent events from the worker (consumed by main's LocalChat). */
export type AgentEvent =
  | { type: 'ready'; tools: string[] }
  | { type: 'text'; sessionID: string; delta: string }
  | {
      type: 'tool';
      sessionID: string;
      callID: string;
      name: string;
      status: 'called' | 'success' | 'error';
      input?: Record<string, unknown>;
      /** Tool output text (success) or error message (error). */
      detail?: string;
    }
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
  /** PickSkill server origin, for pages that only exist on the web (account, pricing, …). */
  apiBase: string;
  /** In-app paths main intercepted from full-page navigations. */
  onNavigate(cb: (path: string) => void): () => void;
  account: {
    get(): Promise<AccountState>;
    signOut(): Promise<void>;
    signInWithGoogle(): Promise<void>;
    cancelSignIn(): Promise<void>;
    onChange(cb: (state: AccountState) => void): () => void;
  };
}
