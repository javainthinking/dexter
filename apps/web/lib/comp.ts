import 'server-only';
import type { PlanId } from './pricing';

/**
 * Complimentary access: emails granted the top plan for free, regardless of
 * their Stripe state. Set `COMP_POWER_EMAILS` to a comma-separated list
 * (case-insensitive) — e.g. owner/team accounts you don't want to bill.
 *
 * Honored in BOTH directions so the grant is durable:
 *   - getUserPlan() (the read path for every quota check) returns 'power'.
 *   - syncUserFromStripe() (webhook + daily reconcile cron) writes 'power'
 *     instead of the Stripe-derived plan, so the cron can't downgrade them.
 *
 * No real payment is involved — this never touches Stripe subscriptions.
 */
export const COMP_PLAN: PlanId = 'power';

const COMP_EMAILS: ReadonlySet<string> = new Set(
  (process.env.COMP_POWER_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

/** True when `email` is on the complimentary-power allowlist. */
export function isCompPowerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return COMP_EMAILS.has(email.trim().toLowerCase());
}
