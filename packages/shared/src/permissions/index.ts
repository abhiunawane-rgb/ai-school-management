import type { Role } from '../types/roles.js';
import type { FeatureKey } from '../types/features.js';

/** Granular permission actions */
export const PERMISSIONS = [
  // Platform
  'platform.manage_tenants',
  'platform.view_analytics',
  'platform.manage_billing',
  // School admin
  'school.manage_settings',
  'school.manage_staff',
  'school.manage_students',
  'school.manage_subscription',
  'school.manage_branding',
  'school.view_analytics',
  // Academic
  'academic.manage_attendance',
  'academic.view_attendance',
  'academic.manage_timetable',
  'academic.manage_homework',
  'academic.manage_notices',
  'academic.manage_results',
  'academic.view_results',
  // Finance
  'finance.manage_fees',
  'finance.view_fees',
  'finance.collect_payments',
  // Social & events
  'social.moderate_feed',
  'social.post_feed',
  'social.manage_events',
  'social.manage_gallery',
  // Transport
  'transport.manage_routes',
  'transport.update_location',
  'transport.view_tracking',
  // Classes
  'classes.manage_online',
  'classes.join_online',
  // AI & comms
  'ai.use_assistant',
  'notifications.send_push',
  'notifications.send_whatsapp',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/** Role → default permissions matrix */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [...PERMISSIONS],
  school_admin: [
    'school.manage_settings',
    'school.manage_staff',
    'school.manage_students',
    'school.manage_subscription',
    'school.manage_branding',
    'school.view_analytics',
    'academic.manage_attendance',
    'academic.view_attendance',
    'academic.manage_timetable',
    'academic.manage_homework',
    'academic.manage_notices',
    'academic.manage_results',
    'academic.view_results',
    'finance.manage_fees',
    'finance.view_fees',
    'finance.collect_payments',
    'social.moderate_feed',
    'social.post_feed',
    'social.manage_events',
    'social.manage_gallery',
    'transport.manage_routes',
    'transport.view_tracking',
    'classes.manage_online',
    'ai.use_assistant',
    'notifications.send_push',
    'notifications.send_whatsapp',
  ],
  sub_admin: [
    'school.manage_staff',
    'school.manage_students',
    'school.view_analytics',
    'academic.manage_attendance',
    'academic.view_attendance',
    'academic.manage_timetable',
    'academic.manage_homework',
    'academic.manage_notices',
    'academic.manage_results',
    'academic.view_results',
    'finance.view_fees',
    'social.moderate_feed',
    'social.post_feed',
    'social.manage_events',
    'transport.view_tracking',
    'classes.manage_online',
    'ai.use_assistant',
    'notifications.send_push',
  ],
  teacher: [
    'academic.manage_attendance',
    'academic.view_attendance',
    'academic.manage_homework',
    'academic.manage_notices',
    'academic.manage_results',
    'academic.view_results',
    'social.post_feed',
    'classes.manage_online',
    'classes.join_online',
    'ai.use_assistant',
    'notifications.send_push',
  ],
  parent: [
    'academic.view_attendance',
    'academic.view_results',
    'finance.view_fees',
    'social.post_feed',
    'transport.view_tracking',
    'classes.join_online',
    'ai.use_assistant',
  ],
  student: [
    'academic.view_attendance',
    'academic.view_results',
    'social.post_feed',
    'transport.view_tracking',
    'classes.join_online',
    'ai.use_assistant',
  ],
  driver: ['transport.update_location', 'transport.view_tracking'],
};

/** Feature → minimum permission to access */
export const FEATURE_PERMISSION_MAP: Partial<Record<FeatureKey, Permission>> = {
  attendance: 'academic.view_attendance',
  timetable: 'academic.manage_timetable',
  homework: 'academic.manage_homework',
  notices: 'academic.manage_notices',
  results: 'academic.view_results',
  fees: 'finance.view_fees',
  social_feed: 'social.post_feed',
  events: 'social.manage_events',
  photo_gallery: 'social.manage_gallery',
  bus_tracking: 'transport.view_tracking',
  ai_chatbot: 'ai.use_assistant',
  online_classes: 'classes.join_online',
  analytics: 'school.view_analytics',
  reports: 'school.view_analytics',
  push_notifications: 'notifications.send_push',
  whatsapp_alerts: 'notifications.send_whatsapp',
};

export function hasPermission(
  role: Role,
  permission: Permission,
  extraPermissions?: Permission[]
): boolean {
  const rolePerms = ROLE_PERMISSIONS[role] ?? [];
  if (rolePerms.includes(permission)) return true;
  return extraPermissions?.includes(permission) ?? false;
}

export function hasFeatureAccess(
  role: Role,
  feature: FeatureKey,
  enabledFeatures: FeatureKey[],
  extraPermissions?: Permission[]
): boolean {
  if (!enabledFeatures.includes(feature)) return false;
  const required = FEATURE_PERMISSION_MAP[feature];
  if (!required) return true;
  return hasPermission(role, required, extraPermissions);
}
