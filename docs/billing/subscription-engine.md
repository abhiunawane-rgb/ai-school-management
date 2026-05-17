# Subscription Engine

## Pricing Model

```
Total = Base Plan + Student Slabs + Add-on Features + Tax
```

### Student Slab Pricing

```typescript
// packages/shared/src/subscription/index.ts
{ minStudents: 0, maxStudents: 100, pricePerStudent: 2.5 }
{ minStudents: 101, maxStudents: 500, pricePerStudent: 2.0 }
{ minStudents: 501, maxStudents: null, pricePerStudent: 1.5 }
```

### Feature Toggle Pricing

Features not in plan's `includedFeatures` are billed per `country_pricing.featurePrices`.

### Country & Currency

- `country_pricing/{countryCode}` defines currency, tax, provider
- India → Razorpay (INR)
- US, UK, EU, etc. → Stripe (local currency)

## Live Price Calculator

**Admin UI** → Firebase Callable `calculatePrice` → `@ai-school/shared` `calculateSubscriptionPrice()`

Input:
- `planId`, `countryCode`, `studentCount`, `enabledFeatures[]`, `billingInterval`

Output: `PriceQuote` with breakdown array.

## Payment Flow

| Step | Stripe | Razorpay |
|------|--------|----------|
| Checkout | `createCheckoutSession` | Client order + server webhook |
| Webhook | `stripeWebhook` | `razorpayWebhook` |
| Activate | Update `subscriptions/{tenantId}` | Same |

## Feature Resolution

After subscription active:

```
resolveFeatureFlags({ plan, subscription, tenant })
```

Priority: `tenant.featureOverrides` > subscription.enabled > plan.included

## Trial

`status: trialing` → all plan features enabled until `trialEndsAt`.
