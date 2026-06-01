'use client';

import { Button } from '../ui/button';
import { useUpgradeDialog } from '../upgrade/upgrade-dialog-provider';
import type { PlanId } from '../../lib/pricing';

/**
 * Account-page upgrade trigger. Opens the shared upgrade dialog (scoped to
 * the tiers above the user's current plan) instead of linking straight to
 * /pricing — the dialog still offers a "compare all plans" link there.
 */
export function AccountUpgradeCta({
  plan,
  label,
  variant = 'default',
}: {
  plan: PlanId;
  label: string;
  variant?: 'default' | 'outline';
}) {
  const { openUpgrade } = useUpgradeDialog();
  return (
    <Button type="button" size="default" variant={variant} onClick={() => openUpgrade({ plan })}>
      {label}
    </Button>
  );
}
