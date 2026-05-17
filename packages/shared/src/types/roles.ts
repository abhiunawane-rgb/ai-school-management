/** Platform & school roles */
export const ROLES = [
  'super_admin',
  'school_admin',
  'sub_admin',
  'teacher',
  'parent',
  'student',
  'driver',
] as const;

export type Role = (typeof ROLES)[number];

export const ADMIN_ROLES: Role[] = ['super_admin', 'school_admin', 'sub_admin'];
export const STAFF_ROLES: Role[] = ['super_admin', 'school_admin', 'sub_admin', 'teacher', 'driver'];
export const SCHOOL_SCOPED_ROLES: Role[] = [
  'school_admin',
  'sub_admin',
  'teacher',
  'parent',
  'student',
  'driver',
];
