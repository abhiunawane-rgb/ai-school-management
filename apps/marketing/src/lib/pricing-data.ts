import type { CountryPricing, Plan } from '@ai-school/shared';
import { FEATURE_KEYS, type FeatureKey } from '@ai-school/shared';
import { calculateSubscriptionPrice } from '@ai-school/shared/subscription';

export const TRIAL_DAYS = 7;
export const APP_NAME = 'AI School Management';
/** Annual billing discount vs paying monthly */
export const YEARLY_SAVE_PERCENT = 20;

/**
 * Market research (India school ERP / SaaS, 2025–26):
 * - Typical cloud SMS: ₹8–₹25 / student / month (annual billing)
 * - Mid CBSE schools often pay ₹50k–₹1.5L / year all-in
 * - Competitors cluster ~₹10–₹22 / student with add-on modules
 *
 * Our tiers ASCEND (Starter → Growth → Enterprise) — never cheaper at the top.
 * "List" = market rack rate; "offer" = launch discount to convert schools.
 */

export const CURRENCIES = [
  { code: 'INR', label: 'INR — Indian Rupee (₹)', countryCode: 'IN' },
  { code: 'USD', label: 'USD — US Dollar ($)', countryCode: 'US' },
  { code: 'EUR', label: 'EUR — Euro (€)', countryCode: 'EU' },
  { code: 'GBP', label: 'GBP — British Pound (£)', countryCode: 'GB' },
  { code: 'AED', label: 'AED — UAE Dirham', countryCode: 'AE' },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

export function currencyToCountry(currency: string): string {
  return CURRENCIES.find((c) => c.code === currency)?.countryCode ?? 'IN';
}

export const INR_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 1 / 83,
  EUR: 1 / 90,
  GBP: 1 / 105,
  AED: 1 / 22.7,
};

export function convertFromInr(amountInr: number, currency: CurrencyCode): number {
  const value = amountInr * INR_EXCHANGE_RATES[currency];
  if (currency === 'INR' || currency === 'AED') return Math.round(value);
  return Math.round(value * 100) / 100;
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Essentials for small schools & new campuses (up to ~300 students)',
    badge: 'Launch offer',
    discountPercent: 30,
    basePrice: 2999,
    listBasePrice: 4299,
    includedFeatures: [
      'attendance',
      'notices',
      'homework',
      'timetable',
      'multi_language',
      'push_notifications',
    ] as FeatureKey[],
    defaultStudentSlabs: [
      { minStudents: 0, maxStudents: 100, pricePerStudent: 18, listPricePerStudent: 26 },
      { minStudents: 101, maxStudents: 300, pricePerStudent: 15, listPricePerStudent: 22 },
      { minStudents: 301, maxStudents: null, pricePerStudent: 12, listPricePerStudent: 18 },
    ],
    isPublic: true,
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Full academic + fees + community — best for growing CBSE/ICSE schools',
    badge: 'Most popular',
    discountPercent: 28,
    basePrice: 5999,
    listBasePrice: 8499,
    includedFeatures: [
      'attendance',
      'notices',
      'homework',
      'timetable',
      'results',
      'fees',
      'social_feed',
      'events',
      'photo_gallery',
      'push_notifications',
      'multi_language',
      'reports',
    ] as FeatureKey[],
    defaultStudentSlabs: [
      { minStudents: 0, maxStudents: 500, pricePerStudent: 24, listPricePerStudent: 34 },
      { minStudents: 501, maxStudents: 1500, pricePerStudent: 20, listPricePerStudent: 28 },
      { minStudents: 1501, maxStudents: null, pricePerStudent: 16, listPricePerStudent: 24 },
    ],
    isPublic: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Everything unlocked — AI assistant, bus GPS, WhatsApp, analytics & priority support',
    badge: 'All modules',
    discountPercent: 25,
    basePrice: 12999,
    listBasePrice: 17999,
    includedFeatures: [...FEATURE_KEYS],
    defaultStudentSlabs: [
      { minStudents: 0, maxStudents: 1000, pricePerStudent: 35, listPricePerStudent: 48 },
      { minStudents: 1001, maxStudents: null, pricePerStudent: 28, listPricePerStudent: 40 },
    ],
    isPublic: true,
  },
];

/** Offer (billed) add-on prices INR / month */
const BASE_FEATURE_PRICES_INR: Partial<Record<FeatureKey, number>> = {
  results: 499,
  fees: 599,
  social_feed: 399,
  events: 349,
  photo_gallery: 399,
  bus_tracking: 1999,
  ai_chatbot: 1499,
  online_classes: 999,
  analytics: 799,
  reports: 449,
  whatsapp_alerts: 699,
  ai_translations: 499,
};

/** Market list prices for add-ons (strikethrough) */
const FEATURE_LIST_PRICES_INR: Partial<Record<FeatureKey, number>> = {
  results: 799,
  fees: 899,
  social_feed: 599,
  events: 499,
  photo_gallery: 599,
  bus_tracking: 2999,
  ai_chatbot: 2499,
  online_classes: 1499,
  analytics: 1199,
  reports: 699,
  whatsapp_alerts: 999,
  ai_translations: 799,
};

export const FEATURE_LABELS: Record<
  FeatureKey,
  { label: string; desc: string; example: string }
> = {
  attendance: {
    label: 'Attendance',
    desc: 'Mark and track daily student presence',
    example: 'Teachers mark attendance; parents get instant alerts',
  },
  timetable: {
    label: 'Timetable',
    desc: 'Class schedules and period planning',
    example: 'Publish weekly timetables by class and section',
  },
  homework: {
    label: 'Homework',
    desc: 'Assign and collect homework digitally',
    example: 'Attach PDFs; parents see due dates on mobile',
  },
  notices: {
    label: 'Notices',
    desc: 'School-wide and class-specific announcements',
    example: 'Send holiday notices to all parents in one click',
  },
  results: {
    label: 'Results',
    desc: 'Exams, marks, grades and report cards',
    example: 'Publish term results; parents view per subject',
  },
  fees: {
    label: 'Fees',
    desc: 'Fee structures, invoices and collections',
    example: 'Generate invoices; track paid vs pending online',
  },
  social_feed: {
    label: 'Social Feed',
    desc: 'School community posts and engagement',
    example: 'Share event photos; moderate staff posts',
  },
  events: {
    label: 'Events',
    desc: 'Calendar of school activities',
    example: 'Sports day, PTM, annual function listings',
  },
  photo_gallery: {
    label: 'Photo Gallery',
    desc: 'Albums for events and classes',
    example: 'Upload annual day albums for parents',
  },
  bus_tracking: {
    label: 'Bus Tracking',
    desc: 'Live GPS bus location for parents',
    example: 'Drivers update location; map shows on parent app',
  },
  ai_chatbot: {
    label: 'AI Assistant',
    desc: '24/7 AI help for parents, staff and students',
    example: 'Ask timetable, fees, or homework questions in chat',
  },
  online_classes: {
    label: 'Online Classes',
    desc: 'Virtual class links and schedules',
    example: 'Share Zoom/Meet links per class period',
  },
  analytics: {
    label: 'Analytics',
    desc: 'Dashboards and performance insights',
    example: 'Attendance trends and fee collection reports',
  },
  reports: {
    label: 'Reports',
    desc: 'Exportable PDF/Excel reports',
    example: 'Monthly attendance summary for management',
  },
  push_notifications: {
    label: 'Push Alerts',
    desc: 'Mobile push notifications',
    example: 'Instant alert when homework is posted',
  },
  whatsapp_alerts: {
    label: 'WhatsApp Alerts',
    desc: 'WhatsApp messages for urgent updates',
    example: 'Fee reminder or bus delay via WhatsApp',
  },
  ai_translations: {
    label: 'AI Translations',
    desc: 'Auto-translate notices and content',
    example: 'Notice in English sent in Hindi to parents',
  },
  multi_language: {
    label: 'Multi-language UI',
    desc: 'App interface in multiple languages',
    example: 'Parents switch between English and Hindi',
  },
};

export const COUNTRY_PRICING: Record<string, CountryPricing> = {
  IN: {
    countryCode: 'IN',
    currency: 'INR',
    basePrice: 2999,
    taxRate: 0.18,
    paymentProvider: 'razorpay',
    studentSlabs: [],
    featurePrices: { ...BASE_FEATURE_PRICES_INR },
    featureListPrices: { ...FEATURE_LIST_PRICES_INR },
  },
};

const MIN_ADDON_INR = 349;

export function getAddonPrice(feature: FeatureKey, currency: string, planId: string): number {
  const plan = PLANS.find((p) => p.id === planId);
  if (plan?.includedFeatures.includes(feature)) return 0;
  const inr = COUNTRY_PRICING.IN.featurePrices[feature] ?? MIN_ADDON_INR;
  return convertFromInr(inr, currency as CurrencyCode);
}

export function getAddonListPrice(feature: FeatureKey, currency: string, planId: string): number {
  const plan = PLANS.find((p) => p.id === planId);
  if (plan?.includedFeatures.includes(feature)) return 0;
  const inr =
    COUNTRY_PRICING.IN.featureListPrices?.[feature] ??
    Math.round((COUNTRY_PRICING.IN.featurePrices[feature] ?? MIN_ADDON_INR) * 1.5);
  return convertFromInr(inr, currency as CurrencyCode);
}

export function isFeatureIncluded(planId: string, feature: FeatureKey): boolean {
  return PLANS.find((p) => p.id === planId)?.includedFeatures.includes(feature) ?? false;
}

/** Headline “from ₹X/student” offer + list for a plan card */
export function getPlanStudentFromPrice(planId: string, currency: CurrencyCode = 'INR') {
  const plan = PLANS.find((p) => p.id === planId);
  const slab = plan?.defaultStudentSlabs[0];
  if (!slab) return { offer: 0, list: 0 };
  return {
    offer: convertFromInr(slab.pricePerStudent, currency),
    list: convertFromInr(slab.listPricePerStudent ?? Math.round(slab.pricePerStudent * 1.4), currency),
  };
}

export function getQuote(
  planId: string,
  currency: string,
  studentCount: number,
  teacherCount: number,
  enabledAddons: FeatureKey[],
  billingInterval: 'monthly' | 'yearly'
) {
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1]!;
  const countryCode = currencyToCountry(currency);
  const code = currency as CurrencyCode;
  const staffMultiplier = 1 + Math.floor(teacherCount / 50) * 0.05;

  const quoteInr = calculateSubscriptionPrice({
    plan,
    countryPricing: { ...COUNTRY_PRICING.IN, currency: 'INR' },
    studentCount,
    enabledFeatures: enabledAddons,
    billingInterval,
    yearlyDiscountPercent: YEARLY_SAVE_PERCENT,
  });

  // List (pre-discount) estimate for strikethrough — same mix, list rates, no yearly promo
  const listSlabs = plan.defaultStudentSlabs.map((s) => ({
    ...s,
    pricePerStudent: s.listPricePerStudent ?? Math.round(s.pricePerStudent * 1.4),
  }));
  const listQuoteInr = calculateSubscriptionPrice({
    plan: {
      ...plan,
      basePrice: plan.listBasePrice ?? Math.round((plan.basePrice ?? 2999) * 1.4),
      defaultStudentSlabs: listSlabs,
    },
    countryPricing: {
      ...COUNTRY_PRICING.IN,
      currency: 'INR',
      featurePrices: { ...FEATURE_LIST_PRICES_INR },
    },
    studentCount,
    enabledFeatures: enabledAddons,
    billingInterval: 'monthly',
    yearlyDiscountPercent: 0,
  });
  const listMonthlyInr = Math.round(listQuoteInr.totalAmount * staffMultiplier);
  const listComparableInr =
    billingInterval === 'yearly' ? Math.round(listMonthlyInr * 12) : listMonthlyInr;

  const totalInr = Math.round(quoteInr.totalAmount * staffMultiplier);
  const convert = (amount: number) => convertFromInr(amount, code);
  const savingsInr = Math.max(0, listComparableInr - totalInr);

  if (code === 'INR') {
    return {
      ...quoteInr,
      currency: 'INR',
      totalAmount: totalInr,
      listTotalAmount: listComparableInr,
      savingsAmount: savingsInr,
      teacherCount,
      plan,
      countryCode,
    };
  }

  return {
    ...quoteInr,
    currency: code,
    baseAmount: convert(quoteInr.baseAmount),
    studentAmount: convert(quoteInr.studentAmount),
    featureAmount: convert(quoteInr.featureAmount),
    taxAmount: convert(quoteInr.taxAmount),
    totalAmount: convert(totalInr),
    listTotalAmount: convert(listComparableInr),
    savingsAmount: convert(savingsInr),
    breakdown: quoteInr.breakdown.map((item) => ({
      ...item,
      amount: convert(item.amount),
    })),
    teacherCount,
    plan,
    countryCode,
  };
}
