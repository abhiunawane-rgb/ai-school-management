import type { Role } from '@ai-school/shared';
import type { InviteRole } from './types';

/** Platform subscription & SaaS billing — school principal only */
export function canAccessBilling(role: Role): boolean {
  return role === 'school_admin';
}

/** Invite / manage sub admins — school principal only */
export function canManageSubAdmins(role: Role): boolean {
  return role === 'school_admin';
}

export function canManageUsers(role: Role): boolean {
  return role === 'school_admin' || role === 'sub_admin';
}

/** Add / invite new users — principal and sub admin */
export function canAddUsers(role: Role): boolean {
  return canManageUsers(role);
}

/** Activate, deactivate, remove, or change roles — principal only */
export function canModifyExistingUsers(role: Role): boolean {
  return role === 'school_admin';
}

export function getInviteableRoles(role: Role): { value: InviteRole; label: string }[] {
  const staff: { value: InviteRole; label: string }[] = [
    { value: 'teacher', label: 'Teacher' },
    { value: 'parent', label: 'Parent' },
    { value: 'student', label: 'Student' },
    { value: 'driver', label: 'Bus driver' },
  ];
  if (role === 'school_admin') {
    return [{ value: 'sub_admin', label: 'Sub Admin' }, ...staff];
  }
  return staff;
}

/** Roles a principal can assign when editing an existing user */
export function getEditableUserRoles(role: Role): { value: InviteRole; label: string }[] {
  return getInviteableRoles(role);
}

export function canChangeUserRole(actorRole: Role): boolean {
  return actorRole === 'school_admin';
}

export const BILLING_NAV_HREFS = ['/dashboard/subscription', '/dashboard/billing'] as const;

export function isBillingRoute(pathname: string): boolean {
  return BILLING_NAV_HREFS.some((href) => pathname === href || pathname.startsWith(`${href}/`));
}
