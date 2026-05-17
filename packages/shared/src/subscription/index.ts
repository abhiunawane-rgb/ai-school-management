import type {
  BillingInterval,
  CountryPricing,
  Plan,
  PriceBreakdownItem,
  PriceQuote,
  StudentSlab,
} from '../types/subscription.js';
import type { FeatureKey } from '../types/features.js';

export interface PriceCalculatorInput {
  plan: Plan;
  countryPricing: CountryPricing;
  studentCount: number;
  enabledFeatures: FeatureKey[];
  billingInterval: BillingInterval;
  yearlyDiscountPercent?: number;
}

const YEARLY_DISCOUNT_DEFAULT = 15;

function findSlabPrice(slabs: StudentSlab[], count: number): number {
  const slab = slabs.find(
    (s) => count >= s.minStudents && (s.maxStudents === null || count <= s.maxStudents)
  );
  if (!slab) {
    const last = slabs[slabs.length - 1];
    return last ? count * last.pricePerStudent : 0;
  }
  return count * slab.pricePerStudent;
}

/**
 * Live price calculator with student slab + feature toggle pricing
 */
export function calculateSubscriptionPrice(input: PriceCalculatorInput): PriceQuote {
  const {
    plan,
    countryPricing,
    studentCount,
    enabledFeatures,
    billingInterval,
    yearlyDiscountPercent = YEARLY_DISCOUNT_DEFAULT,
  } = input;

  const slabs = countryPricing.studentSlabs.length
    ? countryPricing.studentSlabs
    : plan.defaultStudentSlabs;

  const breakdown: PriceBreakdownItem[] = [];
  const { currency } = countryPricing;

  let baseAmount = countryPricing.basePrice;
  breakdown.push({ label: `${plan.name} base`, amount: baseAmount, type: 'base' });

  const studentAmount = findSlabPrice(slabs, studentCount);
  breakdown.push({
    label: `${studentCount} students`,
    amount: studentAmount,
    type: 'students',
  });

  let featureAmount = 0;
  for (const feature of enabledFeatures) {
    if (plan.includedFeatures.includes(feature)) continue;
    const price = countryPricing.featurePrices[feature] ?? 0;
    if (price > 0) {
      featureAmount += price;
      breakdown.push({ label: feature, amount: price, type: 'feature' });
    }
  }

  let subtotal = baseAmount + studentAmount + featureAmount;

  if (billingInterval === 'yearly') {
    subtotal = subtotal * 12 * (1 - yearlyDiscountPercent / 100);
  }

  const taxRate = countryPricing.taxRate ?? 0;
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  if (taxAmount > 0) {
    breakdown.push({ label: 'Tax', amount: taxAmount, type: 'tax' });
  }

  const totalAmount = Math.round((subtotal + taxAmount) * 100) / 100;

  return {
    currency,
    baseAmount,
    studentAmount,
    featureAmount,
    taxAmount,
    totalAmount,
    breakdown,
  };
}

export function getPaymentProviderForCountry(
  countryCode: string,
  overrides?: Record<string, 'stripe' | 'razorpay'>
): 'stripe' | 'razorpay' {
  const map: Record<string, 'stripe' | 'razorpay'> = {
    IN: 'razorpay',
    ...overrides,
  };
  return map[countryCode] ?? 'stripe';
}
