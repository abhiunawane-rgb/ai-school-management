/** All billable / toggleable platform features */
export const FEATURE_KEYS = [
  'attendance',
  'timetable',
  'homework',
  'notices',
  'results',
  'fees',
  'social_feed',
  'events',
  'photo_gallery',
  'bus_tracking',
  'ai_chatbot',
  'online_classes',
  'analytics',
  'reports',
  'push_notifications',
  'whatsapp_alerts',
  'ai_translations',
  'multi_language',
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

export interface FeatureFlag {
  key: FeatureKey;
  enabled: boolean;
  source: 'plan' | 'override' | 'trial';
}
