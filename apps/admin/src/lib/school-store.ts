import type { Role } from '@ai-school/shared';
import { createDemoStudentFees } from './fees-demo-data';
import {
  createDemoAttendance,
  createDemoBusRoutes,
  createDemoHomework,
  createDemoTimetable,
} from './modules-demo-data';
import {
  createDemoEvents,
  createDemoFeed,
  createDemoNotices,
  createDemoSyllabus,
} from './community-demo-data';
import { registerPhoneForLogin } from './phone-registry';
import type {
  AttendanceRecord,
  AttendanceStatus,
  BusRoute,
  CommunityPost,
  FeePayment,
  HomeworkItem,
  InviteRole,
  Invoice,
  NoticeItem,
  SchoolEvent,
  SchoolProfile,
  SchoolSettings,
  SchoolState,
  SessionUser,
  StudentFeeAccount,
  SyllabusUnit,
  TeamMember,
  TimetableSlot,
} from './types';

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
      {
        id: 'tm_2',
        name: 'Suresh Kumar',
        phone: '+91 98444 55555',
        email: 'suresh@greenvalley.edu.in',
        role: 'driver',
        invitedAt: new Date().toISOString(),
        invitedBy: 'Dr. Priya Sharma',
        status: 'active',
      },
      {
        id: 'tm_3',
        name: 'Priya Nair',
        phone: '+91 98222 33333',
        email: 'priya.parent@email.com',
        role: 'parent',
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
    studentFees: createDemoStudentFees(),
    settings: DEFAULT_SETTINGS,
  };
}

function withFees(state: SchoolState): SchoolState {
  if (state.studentFees?.length) return state;
  return { ...state, studentFees: createDemoStudentFees() };
}

function normalizeTimetableSlot(slot: TimetableSlot): TimetableSlot {
  const parts = slot.classSection?.split('-') ?? [];
  const grade = slot.grade ?? parts[0] ?? '8';
  const division = slot.division ?? parts[1] ?? 'A';
  const period = slot.period ?? 1;
  const defaults = timesForPeriod(period);
  return {
    ...slot,
    grade,
    division,
    classSection: slot.classSection ?? `${grade}-${division}`,
    timeFrom: slot.timeFrom ?? defaults.timeFrom,
    timeTo: slot.timeTo ?? defaults.timeTo,
  };
}

function timesForPeriod(period: number): { timeFrom: string; timeTo: string } {
  const schedule: Record<number, { timeFrom: string; timeTo: string }> = {
    1: { timeFrom: '08:00', timeTo: '08:45' },
    2: { timeFrom: '08:45', timeTo: '09:30' },
    3: { timeFrom: '09:30', timeTo: '10:15' },
    4: { timeFrom: '10:30', timeTo: '11:15' },
    5: { timeFrom: '11:15', timeTo: '12:00' },
    6: { timeFrom: '12:45', timeTo: '13:30' },
    7: { timeFrom: '13:30', timeTo: '14:15' },
    8: { timeFrom: '14:15', timeTo: '15:00' },
  };
  return schedule[period] ?? { timeFrom: '08:00', timeTo: '08:45' };
}

function withModules(state: SchoolState): SchoolState {
  const timetable = (state.timetable?.length ? state.timetable : createDemoTimetable()).map(
    normalizeTimetableSlot
  );
  const today = new Date().toISOString().slice(0, 10);
  let attendance = state.attendance?.length ? state.attendance : createDemoAttendance();
  // Keep AI / overview useful: roll demo marks forward to today if none for today
  if (!attendance.some((r) => r.date === today)) {
    attendance = [
      ...attendance,
      ...createDemoAttendance().map((r) => ({ ...r, id: `${r.id}_${today}` })),
    ];
  }
  return {
    ...state,
    attendance,
    homework: state.homework?.length ? state.homework : createDemoHomework(),
    timetable,
    busRoutes: state.busRoutes?.length ? state.busRoutes : createDemoBusRoutes(),
    notices: state.notices?.length ? state.notices : createDemoNotices(),
    syllabus: state.syllabus?.length ? state.syllabus : createDemoSyllabus(),
    events: state.events?.length ? state.events : createDemoEvents(),
    feed: state.feed?.length ? state.feed : createDemoFeed(),
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
  const interval = (raw.interval as 'monthly' | 'yearly') ?? 'yearly';
  const estimatedTotal = Number(raw.estimatedTotal ?? 0);
  const paymentMethod = raw.paymentMethod as SchoolProfile['paymentMethod'] | undefined;
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
      billingInterval: interval,
      studentCount: Number(raw.students ?? 300),
      teacherCount: Number(raw.teachers ?? 25),
      trialEndsAt: trialEnd.toISOString(),
      nextBillingDate: trialEnd.toISOString(),
      subscriptionStatus: 'trial',
      autoRenew: raw.acceptedAutoRenew !== false,
      paymentMethod,
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
        description: '7-day free trial started — no charge',
      },
      {
        id: `inv_scheduled_${Date.now()}`,
        date: trialEnd.toISOString().slice(0, 10),
        amount: estimatedTotal,
        currency: String(raw.currency ?? 'INR'),
        status: 'pending',
        description: `Scheduled ${interval} charge after trial (card •••• ${paymentMethod?.last4 ?? '****'})`,
      },
    ],
    studentFees: createDemoStudentFees(),
    settings: DEFAULT_SETTINGS,
    attendance: createDemoAttendance(),
    homework: createDemoHomework(),
    timetable: createDemoTimetable(),
    busRoutes: createDemoBusRoutes(),
    notices: createDemoNotices(),
    syllabus: createDemoSyllabus(),
    events: createDemoEvents(),
    feed: createDemoFeed(),
  };
}

export function loadSchoolState(): SchoolState | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SchoolState;
    const state = withModules(withFees(parsed));
    const needsSave =
      !parsed.studentFees?.length ||
      !parsed.attendance?.length ||
      !parsed.homework?.length ||
      !parsed.timetable?.length ||
      !parsed.busRoutes?.length ||
      !parsed.notices?.length ||
      !parsed.syllabus?.length ||
      !parsed.events?.length ||
      !parsed.feed?.length;
    if (needsSave) saveSchoolState(state);
    return state;
  } catch {
    return null;
  }
}

export function saveSchoolState(state: SchoolState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function initSchoolState(opts?: {
  phone?: string;
  role?: import('@ai-school/shared').Role;
  name?: string;
}): SchoolState {
  const role = opts?.role ?? 'school_admin';
  const displayName = opts?.name?.trim() || defaultNameForRole(role);

  const existing = loadSchoolState();
  if (existing) {
    if (opts?.phone) existing.currentUser.phone = opts.phone;
    existing.currentUser.role = role;
    existing.currentUser.name = displayName;
    saveSchoolState(existing);
    return existing;
  }

  const pending = localStorage.getItem('aischool_signup_pending');
  if (pending) {
    try {
      const parsed = JSON.parse(pending) as Record<string, unknown>;
      const state = signupToState(parsed);
      state.currentUser.role = role;
      state.currentUser.name = displayName;
      if (opts?.phone) state.currentUser.phone = opts.phone;
      saveSchoolState(state);
      return state;
    } catch {
      /* fall through */
    }
  }

  const state = withModules(withFees(demoSchool()));
  state.currentUser.role = role;
  state.currentUser.name = displayName;
  if (opts?.phone) state.currentUser.phone = opts.phone;
  saveSchoolState(state);
  return state;
}

export function completeLogin(handoff: {
  phone: string;
  name: string;
  role: Role;
  signup?: Record<string, unknown>;
}): SchoolState {
  const existing = loadSchoolState();

  // First-time signup from marketing — create school once, then clear pending so re-login keeps data
  if (handoff.signup && !existing) {
    const state = signupToState(handoff.signup);
    state.currentUser = {
      id: `user_${Date.now()}`,
      name: handoff.name,
      phone: handoff.phone,
      role: 'school_admin',
    };
    saveSchoolState(state);
    localStorage.removeItem('aischool_signup_pending');
    registerPhoneForLogin({
      id: state.currentUser.id,
      name: state.currentUser.name,
      phone: state.currentUser.phone,
      role: state.currentUser.role,
    });
    return state;
  }

  // Returning user — keep school data, only switch who is signed in
  if (existing) {
    existing.currentUser = {
      id: `user_${handoff.role}_${normalizePhoneLocal(handoff.phone)}`,
      name: handoff.name,
      phone: handoff.phone,
      role: handoff.role,
    };
    saveSchoolState(existing);
    localStorage.removeItem('aischool_signup_pending');
    registerPhoneForLogin({
      id: existing.currentUser.id,
      name: existing.currentUser.name,
      phone: existing.currentUser.phone,
      role: existing.currentUser.role,
    });
    return existing;
  }

  // Fresh demo school for first demo-account login
  const state = demoSchool();
  state.currentUser = {
    id: `user_${handoff.role}`,
    name: handoff.name,
    phone: handoff.phone,
    role: handoff.role,
  };
  saveSchoolState(state);
  registerPhoneForLogin({
    id: state.currentUser.id,
    name: state.currentUser.name,
    phone: state.currentUser.phone,
    role: state.currentUser.role,
  });
  return state;
}

function normalizePhoneLocal(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function defaultNameForRole(role: import('@ai-school/shared').Role): string {
  const names: Record<string, string> = {
    school_admin: 'Dr. Priya Sharma',
    sub_admin: 'Rahul Mehta',
    teacher: 'Rahul Mehta',
    parent: 'Priya Nair',
    student: 'Aarav Patel',
    driver: 'Suresh Patil',
  };
  return names[role] ?? 'School User';
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

export function canInviteRole(actorRole: Role, targetRole: InviteRole): boolean {
  if (!canManageTeam(actorRole)) return false;
  if (targetRole === 'sub_admin') return actorRole === 'school_admin';
  return true;
}

export function inviteTeamMember(
  state: SchoolState,
  input: { name: string; phone: string; email: string; role: InviteRole }
): SchoolState {
  if (!canInviteRole(state.currentUser.role, input.role)) {
    return state;
  }
  const member: TeamMember = {
    id: `tm_${Date.now()}`,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    role: input.role,
    invitedAt: new Date().toISOString(),
    invitedBy: state.currentUser.name,
    status: 'active',
  };
  const next = { ...state, team: [...state.team, member] };
  saveSchoolState(next);
  registerPhoneForLogin({
    id: member.id,
    name: member.name,
    phone: member.phone,
    role: member.role,
  });
  return next;
}

export function setTeamMemberStatus(
  state: SchoolState,
  memberId: string,
  status: TeamMember['status']
): SchoolState {
  if (state.currentUser.role !== 'school_admin') return state;
  const next = {
    ...state,
    team: state.team.map((m) => (m.id === memberId ? { ...m, status } : m)),
  };
  saveSchoolState(next);
  const member = next.team.find((m) => m.id === memberId);
  if (member && status === 'active') {
    registerPhoneForLogin({
      id: member.id,
      name: member.name,
      phone: member.phone,
      role: member.role,
    });
  }
  return next;
}

export function removeTeamMember(state: SchoolState, memberId: string): SchoolState {
  if (state.currentUser.role !== 'school_admin') return state;
  const next = { ...state, team: state.team.filter((m) => m.id !== memberId) };
  saveSchoolState(next);
  return next;
}

export function updateTeamMemberRole(
  state: SchoolState,
  memberId: string,
  role: InviteRole
): SchoolState {
  if (state.currentUser.role !== 'school_admin') return state;
  const next = {
    ...state,
    team: state.team.map((m) => (m.id === memberId ? { ...m, role } : m)),
  };
  saveSchoolState(next);
  return next;
}

export function promoteTeacherToSubAdmin(state: SchoolState, memberId: string): SchoolState {
  if (!canPromoteToSubAdmin(state.currentUser.role)) return state;
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

export function recordFeePayment(
  state: SchoolState,
  studentId: string,
  payment: Omit<FeePayment, 'id' | 'recordedBy'>
): SchoolState {
  const entry: FeePayment = {
    ...payment,
    id: `pay_${Date.now()}`,
    recordedBy: state.currentUser.name,
  };
  const next = {
    ...state,
    studentFees: state.studentFees.map((account) =>
      account.id === studentId
        ? { ...account, payments: [entry, ...account.payments] }
        : account
    ),
  };
  saveSchoolState(next);
  return next;
}

export function addStudentFeeAccount(
  state: SchoolState,
  input: Omit<StudentFeeAccount, 'id' | 'payments'> & { lineItems: StudentFeeAccount['lineItems'] }
): SchoolState {
  const account: StudentFeeAccount = {
    id: `stu_${Date.now()}`,
    payments: [],
    ...input,
  };
  const next = { ...state, studentFees: [...state.studentFees, account] };
  saveSchoolState(next);
  return next;
}

export function updateAttendanceStatus(
  state: SchoolState,
  recordId: string,
  status: AttendanceStatus
): SchoolState {
  const next = {
    ...state,
    attendance: (state.attendance ?? []).map((r) =>
      r.id === recordId ? { ...r, status } : r
    ),
  };
  saveSchoolState(next);
  return next;
}

export function addHomework(
  state: SchoolState,
  item: Omit<HomeworkItem, 'id'>
): SchoolState {
  const entry: HomeworkItem = { ...item, id: `hw_${Date.now()}` };
  const next = { ...state, homework: [entry, ...(state.homework ?? [])] };
  saveSchoolState(next);
  return next;
}

export function addTimetableSlot(
  state: SchoolState,
  slot: Omit<TimetableSlot, 'id'>
): SchoolState {
  const entry: TimetableSlot = { ...slot, id: `tt_${Date.now()}` };
  const next = { ...state, timetable: [...(state.timetable ?? []), entry] };
  saveSchoolState(next);
  return next;
}

export function updateBusRouteStatus(
  state: SchoolState,
  routeId: string,
  status: BusRoute['status']
): SchoolState {
  const next = {
    ...state,
    busRoutes: (state.busRoutes ?? []).map((r) =>
      r.id === routeId ? { ...r, status } : r
    ),
  };
  saveSchoolState(next);
  return next;
}

export function updateBusLocation(
  state: SchoolState,
  routeId: string,
  lat: number,
  lng: number
): SchoolState {
  const next = {
    ...state,
    busRoutes: (state.busRoutes ?? []).map((r) =>
      r.id === routeId
        ? {
            ...r,
            lastLat: lat,
            lastLng: lng,
            lastUpdatedAt: new Date().toISOString(),
            status: 'active' as const,
          }
        : r
    ),
  };
  saveSchoolState(next);
  return next;
}

export function addNotice(
  state: SchoolState,
  item: Omit<NoticeItem, 'id' | 'createdAt'>
): SchoolState {
  const entry: NoticeItem = {
    ...item,
    id: `nt_${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  const next = { ...state, notices: [entry, ...(state.notices ?? [])] };
  saveSchoolState(next);
  return next;
}

export function addSyllabusUnit(
  state: SchoolState,
  item: Omit<SyllabusUnit, 'id'>
): SchoolState {
  const entry: SyllabusUnit = { ...item, id: `sy_${Date.now()}` };
  const next = { ...state, syllabus: [entry, ...(state.syllabus ?? [])] };
  saveSchoolState(next);
  return next;
}

export function addSchoolEvent(
  state: SchoolState,
  item: Omit<SchoolEvent, 'id'>
): SchoolState {
  const entry: SchoolEvent = { ...item, id: `ev_${Date.now()}` };
  const next = {
    ...state,
    events: [...(state.events ?? []), entry].sort((a, b) => a.date.localeCompare(b.date)),
  };
  saveSchoolState(next);
  return next;
}

export function addCommunityPost(
  state: SchoolState,
  item: Omit<CommunityPost, 'id' | 'createdAt' | 'likes'>
): SchoolState {
  const entry: CommunityPost = {
    ...item,
    id: `fp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  const next = { ...state, feed: [entry, ...(state.feed ?? [])] };
  saveSchoolState(next);
  return next;
}

export function likeCommunityPost(state: SchoolState, postId: string): SchoolState {
  const next = {
    ...state,
    feed: (state.feed ?? []).map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)),
  };
  saveSchoolState(next);
  return next;
}
