import type { Role } from '@ai-school/shared';
import type { InviteRole, Invoice, SchoolProfile, SchoolSettings, SchoolState, SessionUser, TeamMember } from './types';

const STORAGE_KEY = 'aischool_admin_state';

const DEFAULT_SETTINGS: SchoolSettings = {
  timezone: 'Asia/Kolkata',
  language: 'en',
  emailNotifications: true,
  smsNotifications: true,
  whatsappAlerts: false,
};

function demoSchool(): SchoolState {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);
  return {
    school: {
      id: 'school_demo',
      name: 'Green Valley International School',
      logoUrl: null,
      address: '12 Education Lane',
      city: 'Pune',
      board: 'CBSE',
      website: 'https://greenvalley.edu.in',
      phone: '+91 98765 43210',
      email: 'admin@greenvalley.edu.in',
      principalName: 'Dr. Priya Sharma',
      currency: 'INR',
      planId: 'growth',
      planName: 'Growth',
      billingInterval: 'yearly',
      studentCount: 500,
      teacherCount: 40,
      trialEndsAt: trialEnd.toISOString(),
      subscriptionStatus: 'trial',
    },
    currentUser: {
      id: 'user_principal',
      name: 'Dr. Priya Sharma',
      phone: '+91 98765 43210',
      role: 'school_admin',
    },
    team: [
      {
        id: 'tm_1',
        name: 'Rahul Mehta',
        phone: '+91 98111 22222',
        email: 'rahul@greenvalley.edu.in',
        role: 'teacher',
        invitedAt: new Date().toISOString(),
        invitedBy: 'Dr. Priya Sharma',
        status: 'active',
      },
    ],
    invoices: [
      {
        id: 'inv_trial',
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        currency: 'INR',
        status: 'paid',
        description: '7-day free trial — no charge',
      },
    ],
    settings: DEFAULT_SETTINGS,
  };
}

function signupToState(raw: Record<string, unknown>): SchoolState {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);
  const planNames: Record<string, string> = {
    starter: 'Starter',
    growth: 'Growth',
    enterprise: 'Enterprise',
  };
  const planId = String(raw.planId ?? 'growth');
  return {
    school: {
      id: `school_${Date.now()}`,
      name: String(raw.schoolName ?? 'My School'),
      logoUrl: typeof raw.logoBase64 === 'string' ? raw.logoBase64 : null,
      address: String(raw.schoolAddress ?? ''),
      city: String(raw.city ?? ''),
      board: String(raw.board ?? ''),
      website: String(raw.schoolWebsite ?? ''),
      phone: String(raw.phone ?? ''),
      email: String(raw.email ?? ''),
      principalName: String(raw.principalName ?? raw.adminName ?? ''),
      currency: String(raw.currency ?? 'INR'),
      planId,
      planName: planNames[planId] ?? 'Growth',
      billingInterval: (raw.interval as 'monthly' | 'yearly') ?? 'yearly',
      studentCount: Number(raw.students ?? 300),
      teacherCount: Number(raw.teachers ?? 25),
      trialEndsAt: trialEnd.toISOString(),
      subscriptionStatus: 'trial',
    },
    currentUser: {
      id: `user_${Date.now()}`,
      name: String(raw.adminName ?? 'School Admin'),
      phone: String(raw.phone ?? ''),
      role: 'school_admin',
    },
    team: [],
    invoices: [
      {
        id: 'inv_trial',
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        currency: String(raw.currency ?? 'INR'),
        status: 'paid',
        description: '7-day free trial started',
      },
    ],
    settings: DEFAULT_SETTINGS,
  };
}

export function loadSchoolState(): SchoolState | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SchoolState;
  } catch {
    return null;
  }
}

export function saveSchoolState(state: SchoolState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function initSchoolState(phone?: string): SchoolState {
  const existing = loadSchoolState();
  if (existing) {
    if (phone) {
      existing.currentUser.phone = phone;
      saveSchoolState(existing);
    }
    return existing;
  }

  const pending = localStorage.getItem('aischool_signup_pending');
  if (pending) {
    try {
      const parsed = JSON.parse(pending) as Record<string, unknown>;
      const state = signupToState(parsed);
      saveSchoolState(state);
      return state;
    } catch {
      /* fall through */
    }
  }

  const state = demoSchool();
  if (phone) state.currentUser.phone = phone;
  saveSchoolState(state);
  return state;
}

export function clearSchoolState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function canManageTeam(role: Role): boolean {
  return role === 'school_admin' || role === 'sub_admin';
}

export function canPromoteToSubAdmin(role: Role): boolean {
  return role === 'school_admin';
}

export function inviteTeamMember(
  state: SchoolState,
  input: { name: string; phone: string; email: string; role: InviteRole }
): SchoolState {
  const member: TeamMember = {
    id: `tm_${Date.now()}`,
    name: input.name,
    phone: input.phone,
    email: input.email,
    role: input.role === 'sub_admin' ? 'sub_admin' : input.role,
    invitedAt: new Date().toISOString(),
    invitedBy: state.currentUser.name,
    status: 'pending',
  };
  const next = { ...state, team: [...state.team, member] };
  saveSchoolState(next);
  return next;
}

export function promoteTeacherToSubAdmin(state: SchoolState, memberId: string): SchoolState {
  const next = {
    ...state,
    team: state.team.map((m) =>
      m.id === memberId && m.role === 'teacher' ? { ...m, role: 'sub_admin' as Role } : m
    ),
  };
  saveSchoolState(next);
  return next;
}

export function updateSchoolProfile(state: SchoolState, patch: Partial<SchoolProfile>): SchoolState {
  const next = { ...state, school: { ...state.school, ...patch } };
  saveSchoolState(next);
  return next;
}

export function updateSettings(state: SchoolState, patch: Partial<SchoolSettings>): SchoolState {
  const next = { ...state, settings: { ...state.settings, ...patch } };
  saveSchoolState(next);
  return next;
}

export function addInvoice(state: SchoolState, invoice: Omit<Invoice, 'id'>): SchoolState {
  const next = {
    ...state,
    invoices: [{ ...invoice, id: `inv_${Date.now()}` }, ...state.invoices],
  };
  saveSchoolState(next);
  return next;
}

export function switchUserRole(state: SchoolState, role: Role): SchoolState {
  const next = { ...state, currentUser: { ...state.currentUser, role } };
  saveSchoolState(next);
  return next;
}
