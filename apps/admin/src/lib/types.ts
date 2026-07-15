import type { Role } from '@ai-school/shared';

export type InviteRole = 'teacher' | 'parent' | 'student' | 'driver' | 'sub_admin';

export type TeamMemberStatus = 'pending' | 'active' | 'inactive';

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
  nextBillingDate?: string;
  subscriptionStatus: 'trial' | 'active' | 'past_due' | 'cancelled';
  autoRenew?: boolean;
  paymentMethod?: {
    cardholderName: string;
    last4: string;
    brand: 'visa' | 'mastercard' | 'amex' | 'rupay' | 'unknown';
    expMonth: number;
    expYear: number;
    provider: 'stripe' | 'razorpay';
    paymentMethodToken: string;
    onFileSince: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  invitedAt: string;
  invitedBy: string;
  status: TeamMemberStatus;
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

/** School fee line (tuition, transport, etc.) assigned to a student */
export interface FeeLineItem {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
}

/** Payment collected from parent for school fees */
export interface FeePayment {
  id: string;
  date: string;
  amount: number;
  mode: 'cash' | 'upi' | 'card' | 'bank';
  reference?: string;
  recordedBy: string;
}

/** Per-student fee ledger: total, paid, and pending derived from items & payments */
export interface StudentFeeAccount {
  id: string;
  studentName: string;
  classSection: string;
  parentName: string;
  parentPhone: string;
  lineItems: FeeLineItem[];
  payments: FeePayment[];
}

export type StudentFeeStatus = 'paid' | 'partial' | 'pending' | 'overdue';

export interface SchoolFeeSummary {
  totalFees: number;
  totalPaid: number;
  totalPending: number;
  studentCount: number;
  paidCount: number;
  partialCount: number;
  pendingCount: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  date: string;
  classSection: string;
  studentName: string;
  status: AttendanceStatus;
}

export interface HomeworkItem {
  id: string;
  title: string;
  classSection: string;
  subject: string;
  dueDate: string;
  description: string;
}

export interface TimetableSlot {
  id: string;
  grade: string;
  division: string;
  classSection: string;
  day: string;
  period: number;
  timeFrom: string;
  timeTo: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface BusRoute {
  id: string;
  name: string;
  driverName: string;
  vehicleNo: string;
  status: 'active' | 'idle';
  lastLat?: number;
  lastLng?: number;
  lastUpdatedAt?: string;
}

export type NoticeAudience = 'all' | 'parents' | 'students' | 'staff';

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  audience: NoticeAudience;
  pinned: boolean;
  author: string;
  createdAt: string;
}

export interface SyllabusUnit {
  id: string;
  classSection: string;
  subject: string;
  title: string;
  description: string;
  weekLabel: string;
  teacher: string;
  resources?: string;
}

export type EventCategory = 'academic' | 'sports' | 'cultural' | 'holiday' | 'other';

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: EventCategory;
}

export type FeedPostType = 'post' | 'announcement' | 'event';

export interface CommunityPost {
  id: string;
  type: FeedPostType;
  author: string;
  authorRole: string;
  title: string;
  body: string;
  createdAt: string;
  likes: number;
  pinned: boolean;
}

export interface SchoolState {
  school: SchoolProfile;
  currentUser: SessionUser;
  team: TeamMember[];
  invoices: Invoice[];
  studentFees: StudentFeeAccount[];
  settings: SchoolSettings;
  attendance?: AttendanceRecord[];
  homework?: HomeworkItem[];
  timetable?: TimetableSlot[];
  busRoutes?: BusRoute[];
  notices?: NoticeItem[];
  syllabus?: SyllabusUnit[];
  events?: SchoolEvent[];
  feed?: CommunityPost[];
}
