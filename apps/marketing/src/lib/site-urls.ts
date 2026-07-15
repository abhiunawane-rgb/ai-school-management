export function getLoginUrl(): string {
  return `${getMarketingUrl().replace(/\/$/, '')}/login/`;
}

export function getAdminUrl(): string {
  return (process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001').replace(/\/$/, '');
}

export function getMarketingUrl(): string {
  return (process.env.NEXT_PUBLIC_MARKETING_URL ?? 'http://localhost:3002').replace(/\/$/, '');
}
