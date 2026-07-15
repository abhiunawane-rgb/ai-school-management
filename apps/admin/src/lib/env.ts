export function getMarketingUrl(): string {
  return (process.env.NEXT_PUBLIC_MARKETING_URL ?? 'http://localhost:3002').replace(/\/$/, '');
}

export function getAdminUrl(): string {
  return (process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001').replace(/\/$/, '');
}

export function getLoginUrl(): string {
  return `${getMarketingUrl()}/login/`;
}

/** Absolute path under the admin base (BigRock /admin). Always trailing slash. */
export function adminHref(path: string): string {
  const base = getAdminUrl();
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  const withSlash = cleaned.endsWith('/') ? cleaned : `${cleaned}/`;
  return `${base}${withSlash}`;
}
