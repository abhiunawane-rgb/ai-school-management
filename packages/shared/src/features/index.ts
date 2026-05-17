import type { FeatureKey } from '../types/features.js';
import type { Plan, Subscription } from '../types/subscription.js';
import type { Tenant } from '../types/tenant.js';
import { FEATURE_KEYS } from '../types/features.js';

export interface FeatureContext {
  plan: Plan;
  subscription: Subscription;
  tenant?: Tenant;
}

/**
 * Resolves effective feature flags for a tenant.
 * Priority: tenant override > subscription enabled > plan included
 */
export function resolveFeatureFlags(ctx: FeatureContext): Record<FeatureKey, boolean> {
  const flags = {} as Record<FeatureKey, boolean>;

  for (const key of FEATURE_KEYS) {
    const tenantOverride = ctx.tenant?.featureOverrides?.[key];
    if (tenantOverride !== undefined) {
      flags[key] = tenantOverride;
      continue;
    }
    if (ctx.subscription.status === 'trialing') {
      flags[key] = ctx.plan.includedFeatures.includes(key);
      continue;
    }
    if (['active', 'trialing'].includes(ctx.subscription.status)) {
      flags[key] =
        ctx.plan.includedFeatures.includes(key) ||
        ctx.subscription.enabledFeatures.includes(key);
    } else {
      flags[key] = false;
    }
  }

  return flags;
}

export function isFeatureEnabled(
  flags: Record<FeatureKey, boolean>,
  feature: FeatureKey
): boolean {
  return flags[feature] === true;
}
