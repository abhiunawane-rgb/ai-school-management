import type { DirectoryUser } from '@ai-school/shared';
import { normalizePhone, resolveUserByPhone } from '@ai-school/shared';
import { getAdminUrl } from '@/lib/site-urls';

const REGISTRY_KEY = 'aischool_phone_registry';
const DEMO_OTP = '123456';

export { DEMO_OTP };

export type LoginHandoff = {
  phone: string;
  name: string;
  role: DirectoryUser['role'];
  exp: number;
  signup?: Record<string, unknown>;
};

function readRegistry(): DirectoryUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return [];
    const map = JSON.parse(raw) as Record<string, DirectoryUser>;
    return Object.values(map);
  } catch {
    return [];
  }
}

export function registerPhoneAccount(user: DirectoryUser): void {
  if (typeof window === 'undefined') return;
  const key = normalizePhone(user.phone);
  const raw = localStorage.getItem(REGISTRY_KEY);
  const map = raw ? (JSON.parse(raw) as Record<string, DirectoryUser>) : {};
  if (map[key] && map[key].role !== user.role) {
    throw new Error('This mobile number is already registered to another account.');
  }
  map[key] = user;
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(map));
}

export function lookupAccountByPhone(phone: string): DirectoryUser | null {
  const pending = readSignupPending(phone);
  if (pending) {
    return {
      id: `user_signup_${normalizePhone(phone)}`,
      name: String(pending.adminName ?? pending.principalName ?? 'School Admin'),
      phone: String(pending.phone ?? phone),
      role: 'school_admin',
    };
  }
  return resolveUserByPhone(phone, readRegistry());
}

function readSignupPending(phone: string): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('aischool_signup_pending');
    if (!raw) return null;
    const pending = JSON.parse(raw) as Record<string, unknown>;
    if (phonesMatchPending(pending, phone)) return pending;
    return null;
  } catch {
    return null;
  }
}

function phonesMatchPending(pending: Record<string, unknown>, phone: string): boolean {
  return normalizePhone(String(pending.phone ?? '')) === normalizePhone(phone);
}

export function createLoginHandoff(phone: string, signup?: Record<string, unknown>): LoginHandoff {
  const account = lookupAccountByPhone(phone);
  if (!account) {
    throw new Error(
      'No account found for this mobile number. Sign up your school or ask your administrator to add you.'
    );
  }
  return {
    phone: account.phone,
    name: account.name,
    role: account.role,
    exp: Date.now() + 5 * 60 * 1000,
    signup: signup ?? readSignupPending(phone) ?? undefined,
  };
}

export function encodeHandoff(handoff: LoginHandoff): string {
  // UTF-8–safe base64 so names with accents / non-ASCII don't break login
  return btoa(unescape(encodeURIComponent(JSON.stringify(handoff))));
}

export function redirectToAppAfterLogin(handoff: LoginHandoff): void {
  const adminUrl = getAdminUrl().replace(/\/$/, '');
  const session = encodeURIComponent(encodeHandoff(handoff));
  // Trailing slash required for BigRock static folders
  window.location.href = `${adminUrl}/auth/complete/?session=${session}`;
}
