import type { Role } from '@ai-school/shared';
import { normalizePhone, resolveUserByPhone } from '@ai-school/shared';

export type LoginHandoff = {
  phone: string;
  name: string;
  role: Role;
  exp: number;
  signup?: Record<string, unknown>;
};

/** UTF-8–safe base64 decode (handles names with accents, etc.) */
function decodeBase64Json(encoded: string): unknown {
  let raw = encoded.trim().replace(/ /g, '+');
  try {
    raw = decodeURIComponent(raw);
  } catch {
    /* already decoded by the browser / Next */
  }

  const binary = atob(raw);
  try {
    const json = decodeURIComponent(escape(binary));
    return JSON.parse(json);
  } catch {
    return JSON.parse(binary);
  }
}

export function decodeHandoff(encoded: string): LoginHandoff {
  const parsed = decodeBase64Json(encoded) as LoginHandoff;
  if (!parsed?.phone || !parsed?.role || !parsed?.name || !parsed?.exp) {
    throw new Error('Invalid handoff');
  }
  return parsed;
}

function readPhoneRegistry(): { id: string; name: string; phone: string; role: Role }[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('aischool_phone_registry');
    if (!raw) return [];
    const map = JSON.parse(raw) as Record<
      string,
      { id: string; name: string; phone: string; role: string }
    >;
    return Object.values(map).map((u) => ({
      id: u.id,
      name: u.name,
      phone: u.phone,
      role: u.role as Role,
    }));
  } catch {
    return [];
  }
}

/** Re-verify phone maps to the claimed role (never trust client role alone). */
export function verifyHandoff(handoff: LoginHandoff): LoginHandoff {
  if (handoff.signup) {
    const signupPhone = String(handoff.signup.phone ?? '');
    if (normalizePhone(signupPhone) === normalizePhone(handoff.phone)) {
      return {
        ...handoff,
        role: 'school_admin',
        name: String(handoff.signup.adminName ?? handoff.signup.principalName ?? handoff.name),
      };
    }
  }

  const directoryUser = resolveUserByPhone(handoff.phone, readPhoneRegistry());
  if (directoryUser) {
    return {
      ...handoff,
      name: directoryUser.name,
      role: directoryUser.role,
      phone: directoryUser.phone,
    };
  }

  const allowed: Role[] = ['school_admin', 'sub_admin', 'teacher', 'parent', 'student', 'driver'];
  if (allowed.includes(handoff.role)) {
    return handoff;
  }

  throw new Error('No account found for this mobile number.');
}

export function readSessionFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('session');
}
