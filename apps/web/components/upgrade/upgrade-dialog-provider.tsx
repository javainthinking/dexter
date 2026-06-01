'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import type { PlanId } from '../../lib/pricing';

/** Quota that triggered the prompt — drives the localized reason line. */
export type UpgradeMetric =
  | 'conversations'
  | 'deep_research'
  | 'files'
  | 'portfolios'
  | 'holdings';

export interface UpgradeOpts {
  /** The user's current plan, so the dialog shows only the tiers above it. */
  plan?: PlanId;
  /** Which limit was hit (omit for a generic "browse plans" open). */
  metric?: UpgradeMetric;
  /** The limit value, interpolated into the reason copy. */
  limit?: number;
}

interface UpgradeCtx {
  openUpgrade: (opts?: UpgradeOpts) => void;
}

const Ctx = React.createContext<UpgradeCtx>({ openUpgrade: () => {} });

/** Open the upgrade dialog from anywhere under the provider. */
export function useUpgradeDialog(): UpgradeCtx {
  return React.useContext(Ctx);
}

// Lazy — the dialog pulls in the (sizable) localized pricing copy, so it
// only loads the first time a user actually hits a paywall.
const UpgradeDialog = dynamic(
  () => import('./upgrade-dialog').then((m) => m.UpgradeDialog),
  { ssr: false },
);

export function UpgradeDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<{ open: boolean } & UpgradeOpts>({ open: false });

  const openUpgrade = React.useCallback((opts?: UpgradeOpts) => {
    setState({ open: true, ...opts });
  }, []);

  const onOpenChange = React.useCallback((open: boolean) => {
    setState((s) => ({ ...s, open }));
  }, []);

  return (
    <Ctx.Provider value={{ openUpgrade }}>
      {children}
      {state.open && (
        <UpgradeDialog
          open={state.open}
          onOpenChange={onOpenChange}
          plan={state.plan}
          metric={state.metric}
          limit={state.limit}
        />
      )}
    </Ctx.Provider>
  );
}
