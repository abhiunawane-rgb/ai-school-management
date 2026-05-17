import type { Role } from '@ai-school/shared';

export type InviteRole = 'teacher' | 'parent' | 'student' | 'driver' | 'sub_admin';

export interface SchoolProfile {
  id: string;
  name: string;
  logoUrl: string | null;
  address: string;
  city: string;
  board: string;
  website: string;
  phone: string;
  email: string;
  principalName: string;
  currency: string;
  planId: string;
  planName: string;
  billingInterval: 'monthly' | 'yearly';
  studentCount: number;
  teacherCount: number;
  trialEndsAt: string;
  subscriptionStatus: 'trial' | 'active' | 'past_due' | 'cancelled';
}

export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  invitedAt: string;
  invitedBy: string;
  status: 'pending' | 'active';
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  phone: string;
  role: Role;
}

export interface SchoolSettings {
  timezone: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappAlerts: boolean;
}

export interface SchoolState {
  school: SchoolProfile;
  currentUser: SessionUser;
  team: TeamMember[];
  invoices: Invoice[];
  settings: SchoolSettings;
}
