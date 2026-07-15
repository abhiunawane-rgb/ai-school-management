import type { Role } from '../types/roles.js';

export type DirectoryUser = {
  id: string;
  name: string;
  phone: string;
  role: Role;
};

/** Demo accounts — one phone number per user, one role each. */
export const DEMO_USER_DIRECTORY: DirectoryUser[] = [
  {
    id: 'user_principal',
    name: 'Dr. Priya Sharma',
    phone: '+91 98765 43210',
    role: 'school_admin',
  },
  {
    id: 'user_sub_admin',
    name: 'Anita Desai',
    phone: '+91 98555 66666',
    role: 'sub_admin',
  },
  {
    id: 'user_teacher',
    name: 'Rahul Mehta',
    phone: '+91 98111 22222',
    role: 'teacher',
  },
  {
    id: 'user_parent',
    name: 'Priya Nair',
    phone: '+91 98222 33333',
    role: 'parent',
  },
  {
    id: 'user_student',
    name: 'Aarav Patel',
    phone: '+91 98333 44444',
    role: 'student',
  },
  {
    id: 'user_driver',
    name: 'Suresh Patil',
    phone: '+91 98444 55555',
    role: 'driver',
  },
];

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function phonesMatch(a: string, b: string): boolean {
  return normalizePhone(a) === normalizePhone(b);
}

export function resolveUserByPhone(
  phone: string,
  extra: DirectoryUser[] = []
): DirectoryUser | null {
  const target = normalizePhone(phone);
  if (!target || target.length < 10) return null;

  const all = [...DEMO_USER_DIRECTORY, ...extra];
  return all.find((u) => normalizePhone(u.phone) === target) ?? null;
}

export function isLoginRole(role: Role): boolean {
  return role !== 'super_admin';
}
