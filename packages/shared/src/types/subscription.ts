import type { FeatureKey } from './features.js';

export type BillingInterval = 'monthly' | 'yearly';
export type PaymentProvider = 'stripe' | 'razorpay';
export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'suspended';

export interface StudentSlab {
  minStudents: number;
  maxStudents: number | null;
  /** Offer / billed price per student for this slab */
  pricePerStudent: number;
  /** Market list price (for strikethrough display); optional */
  listPricePerStudent?: number;
}

export interface CountryPricing {
  countryCode: string;
  currency: string;
  basePrice: number;
  studentSlabs: StudentSlab[];
  featurePrices: Partial<Record<FeatureKey, number>>;
  /** Optional market list prices for add-ons (strikethrough UI) */
  featureListPrices?: Partial<Record<FeatureKey, number>>;
  taxRate?: number;
  paymentProvider: PaymentProvider;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  includedFeatures: FeatureKey[];
  defaultStudentSlabs: StudentSlab[];
  isPublic: boolean;
  /** Plan platform fee (overrides country base when set) — Starter < Growth < Enterprise */
  basePrice?: number;
  /** Market list platform fee for discount display */
  listBasePrice?: number;
  /** Launch / promotional discount percent shown on pricing UI */
  discountPercent?: number;
  /** Short badge e.g. "Best for CBSE schools" */
  badge?: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  countryCode: string;
  currency: string;
  billingInterval: BillingInterval;
  studentCount: number;
  enabledFeatures: FeatureKey[];
  provider: PaymentProvider;
  providerSubscriptionId?: string;
  providerCustomerId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceQuote {
  currency: string;
  baseAmount: number;
  studentAmount: number;
  featureAmount: number;
  taxAmount: number;
  totalAmount: number;
  breakdown: PriceBreakdownItem[];
}

export interface PriceBreakdownItem {
  label: string;
  amount: number;
  type: 'base' | 'students' | 'feature' | 'tax';
}
