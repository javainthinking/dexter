// next-auth/react for the desktop renderer. The session is the desktop
// account (system-browser sign-in, token held by main); signOut revokes it.
import { createContext, useContext, type ReactNode } from 'react';
import type { AccountState } from '../../../shared/ipc';

interface Session {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null };
  expires: string;
}

type SessionValue =
  | { data: Session; status: 'authenticated' }
  | { data: null; status: 'unauthenticated' | 'loading' };

const Ctx = createContext<SessionValue>({ data: null, status: 'loading' });

export function DesktopSessionProvider({ account, children }: { account: AccountState; children: ReactNode }) {
  const value: SessionValue =
    account.status === 'signed-in' && account.user
      ? { data: { user: account.user, expires: '' }, status: 'authenticated' }
      : { data: null, status: 'unauthenticated' };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** web's app/providers.tsx wraps everything in this; the desktop session comes from DesktopSessionProvider above it. */
export function SessionProvider({ children }: { children: ReactNode; refetchInterval?: number; refetchOnWindowFocus?: boolean }) {
  return <>{children}</>;
}

export function useSession(): SessionValue & { update: () => Promise<null> } {
  return { ...useContext(Ctx), update: async () => null };
}

export async function signOut(_opts?: { callbackUrl?: string; redirect?: boolean }): Promise<void> {
  await window.pickskill.account.signOut();
}

export async function signIn(): Promise<void> {
  await window.pickskill.account.signIn();
}
