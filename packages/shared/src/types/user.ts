import type { Role } from './roles.js';

export interface UserProfile {
  id: string;
  phone: string;
  phoneVerified: boolean;
  displayName: string;
  avatarUrl?: string;
  preferredLanguage: string;
  countryCode: string;
  fcmTokens: string[];
  activeTenantId?: string;
  activeRole?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface OtpSession {
  phone: string;
  countryCode: string;
  verificationSid: string;
  expiresAt: string;
  attempts: number;
}
