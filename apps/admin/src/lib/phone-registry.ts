const REGISTRY_KEY = 'aischool_phone_registry';

export type RegistryUser = {
  id: string;
  name: string;
  phone: string;
  role: string;
};

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/** Register a user so marketing login can resolve them (same origin as admin on BigRock). */
export function registerPhoneForLogin(user: RegistryUser): void {
  if (typeof window === 'undefined') return;
  try {
    const key = normalizePhone(user.phone);
    if (!key || key.length < 10) return;
    const raw = localStorage.getItem(REGISTRY_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, RegistryUser>) : {};
    map[key] = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}
