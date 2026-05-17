import type { Role } from './roles.js';

export interface TenantBranding {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  faviconUrl?: string;
  appName: string;
  customDomain?: string;
}

export interface TenantLocale {
  defaultLanguage: string;
  supportedLanguages: string[];
  timezone: string;
  dateFormat: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  currency: string;
  timezone: string;
  isActive: boolean;
  isWhiteLabel: boolean;
  branding: TenantBranding;
  locale: TenantLocale;
  subscriptionId?: string;
  planId?: string;
  featureOverrides?: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface TenantMembership {
  id: string;
  tenantId: string;
  userId: string;
  role: Role;
  permissions?: string[];
  isActive: boolean;
  branchIds?: string[];
  createdAt: string;
}
