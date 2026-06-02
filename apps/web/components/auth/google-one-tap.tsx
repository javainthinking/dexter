'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * Site-wide Google One Tap prompt for logged-out visitors.
 *
 * Loads Google Identity Services and shows the One Tap prompt when the
 * NextAuth session is `unauthenticated`. On a credential, it posts the ID
 * token to /api/auth/google-one-tap (which verifies it and mints the
 * session cookie) and refreshes the route so the page re-renders signed-in.
 *
 * Renders nothing — and never prompts — when:
 *   - NEXT_PUBLIC_GOOGLE_CLIENT_ID is unset (feature off / not configured),
 *   - the user is already signed in (or session is still loading),
 *   - we're on the dedicated /sign-in page (its own Google button covers it).
 *
 * Gating on useSession() keeps the marketing layout static — no server-side
 * session read needed to decide whether to mount this.
 */

interface GoogleIdConfig {
  client_id: string;
  callback: (resp: { credential?: string }) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  use_fedcm_for_prompt?: boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfig) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GSI_SRC = 'https://accounts.google.com/gsi/client';

function loadGsi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('gsi_load_failed')));
      return;
    }
    const script = document.createElement('script');
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('gsi_load_failed'));
    document.head.appendChild(script);
  });
}

export function GoogleOneTap() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useRef(false);

  const onSignInPage = pathname?.includes('/sign-in') ?? false;

  useEffect(() => {
    if (!clientId) return;
    if (status !== 'unauthenticated') return;
    if (onSignInPage) return;
    if (initialized.current) return;
    initialized.current = true;

    let cancelled = false;

    loadGsi()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          use_fedcm_for_prompt: true,
          cancel_on_tap_outside: false,
          callback: async (resp) => {
            if (!resp.credential) return;
            try {
              const res = await fetch('/api/auth/google-one-tap', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ credential: resp.credential }),
              });
              if (res.ok) router.refresh();
            } catch {
              /* swallow — user can still sign in via /sign-in */
            }
          },
        });
        window.google.accounts.id.prompt();
      })
      .catch(() => {
        // Allow a retry on a later effect run if the script failed to load.
        initialized.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, status, onSignInPage, router]);

  return null;
}
