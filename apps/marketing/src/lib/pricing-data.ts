import type { CountryPricing, Plan } from '@ai-school/shared';
import { FEATURE_KEYS, type FeatureKey } from '@ai-school/shared';
import { calculateSubscriptionPrice } from '@ai-school/shared/subscription';

export const TRIAL_DAYS = 7;
export const APP_NAME = 'AI School Management';

/** Currency selector — maps to internal country pricing */
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

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Essential tools for small schools (up to ~300 students)',
    includedFeatures: [
      'attendance',
      'notices',
      'homework',
      'timetable',
      'multi_language',
      'push_notifications',
    ] as FeatureKey[],
    defaultStudentSlabs: [
      { minStudents: 0, maxStudents: 100, pricePerStudent: 15 },
      { minStudents: 101, maxStudents: 300, pricePerStudent: 12 },
      { minStudents: 301, maxStudents: null, pricePerStudent: 10 },
    ],
    isPublic: true,
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Full academic suite for growing schools',
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
      { minStudents: 0, maxStudents: 500, pricePerStudent: 12 },
      { minStudents: 501, maxStudents: 1500, pricePerStudent: 9 },
      { minStudents: 1501, maxStudents: null, pricePerStudent: 7 },
    ],
    isPublic: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'All modules including AI, bus GPS, WhatsApp & analytics',
    includedFeatures: [...FEATURE_KEYS],
    defaultStudentSlabs: [
      { minStudents: 0, maxStudents: 1000, pricePerStudent: 8 },
      { minStudents: 1001, maxStudents: null, pricePerStudent: 5 },
    ],
    isPublic: true,
  },
];

const BASE_FEATURE_PRICES_INR: Partial<Record<FeatureKey, number>> = {
  results: 399,
  fees: 499,
  social_feed: 299,
  events: 249,
  photo_gallery: 299,
  bus_tracking: 1499,
  ai_chatbot: 999,
  online_classes: 799,
  analytics: 599,
  reports: 349,
  whatsapp_alerts: 499,
  ai_translations: 399,
};

const BASE_FEATURE_PRICES_USD: Partial<Record<FeatureKey, number>> = {
  results: 9,
  fees: 12,
  social_feed: 8,
  events: 7,
  photo_gallery: 8,
  bus_tracking: 49,
  ai_chatbot: 29,
  online_classes: 25,
  analytics: 19,
  reports: 12,
  whatsapp_alerts: 19,
  ai_translations: 15,
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
    basePrice: 4999,
    taxRate: 0.18,
    paymentProvider: 'razorpay',
    studentSlabs: [],
    featurePrices: { ...BASE_FEATURE_PRICES_INR },
  },
  US: {
    countryCode: 'US',
    currency: 'USD',
    basePrice: 99,
    taxRate: 0,
    paymentProvider: 'stripe',
    studentSlabs: [],
    featurePrices: { ...BASE_FEATURE_PRICES_USD },
  },
  EU: {
    countryCode: 'EU',
    currency: 'EUR',
    basePrice: 89,
    taxRate: 0.2,
    paymentProvider: 'stripe',
    studentSlabs: [],
    featurePrices: { ...BASE_FEATURE_PRICES_USD },
  },
  GB: {
    countryCode: 'GB',
    currency: 'GBP',
    basePrice: 79,
    taxRate: 0.2,
    paymentProvider: 'stripe',
    studentSlabs: [],
    featurePrices: { ...BASE_FEATURE_PRICES_USD },
  },
  AE: {
    countryCode: 'AE',
    currency: 'AED',
    basePrice: 369,
    taxRate: 0.05,
    paymentProvider: 'stripe',
    studentSlabs: [],
    featurePrices: {
      ...Object.fromEntries(
        Object.entries(BASE_FEATURE_PRICES_USD).map(([k, v]) => [k, Math.round((v ?? 0) * 3.67)])
      ),
    },
  },
};

const MIN_ADDON: Record<string, number> = { INR: 299, USD: 9, EUR: 8, GBP: 7, AED: 29 };

export function getAddonPrice(feature: FeatureKey, currency: string, planId: string): number {
  const plan = PLANS.find((p) => p.id === planId);
  if (plan?.includedFeatures.includes(feature)) return 0;
  const country = currencyToCountry(currency);
  const pricing = COUNTRY_PRICING[country] ?? COUNTRY_PRICING.IN;
  const c = pricing.currency;
  return pricing.featurePrices[feature] ?? MIN_ADDON[c] ?? MIN_ADDON.INR;
}

export function isFeatureIncluded(planId: string, feature: FeatureKey): boolean {
  return PLANS.find((p) => p.id === planId)?.includedFeatures.includes(feature) ?? false;
}

export function getQuote(
  planId: string,
  currency: string,
  studentCount: number,
  teacherCount: number,
  enabledAddons: FeatureKey[],
  billingInterval: 'monthly' | 'yearly'
) {
  const countryCode = currencyToCountry(currency);
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1]!;
  const countryPricing = COUNTRY_PRICING[countryCode] ?? COUNTRY_PRICING.IN;
  const pricingWithCurrency = { ...countryPricing, currency };
  const staffMultiplier = 1 + Math.floor(teacherCount / 50) * 0.05;
  const quote = calculateSubscriptionPrice({
    plan,
    countryPricing: pricingWithCurrency,
    studentCount,
    enabledFeatures: enabledAddons,
    billingInterval,
  });
  return {
    ...quote,
    currency,
    totalAmount: Math.round(quote.totalAmount * staffMultiplier),
    teacherCount,
    plan,
    countryCode,
  };
}
