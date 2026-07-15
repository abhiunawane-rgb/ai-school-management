import type { Role } from '../types/index.js';

export interface SchoolAiSnapshot {
  schoolName: string;
  role: Role;
  currency: string;
  today: string;
  viewerName?: string;
  fees?: {
    totalFees: number;
    totalPaid: number;
    totalPending: number;
    dueThisMonth: number;
    studentCount: number;
    paidCount: number;
    partialCount: number;
    pendingCount: number;
    overdueCount: number;
    topPending?: { studentName: string; classSection: string; pending: number }[];
  };
  attendance?: {
    date: string;
    present: number;
    absent: number;
    late: number;
    total: number;
    absentStudents?: string[];
    byClass?: Record<string, { present: number; absent: number; late: number }>;
  };
  homework?: {
    count: number;
    upcoming: { title: string; classSection: string; subject: string; dueDate: string }[];
  };
  team?: { total: number; teachers: number; parents: number; students: number; drivers: number };
  busRoutes?: {
    count: number;
    active: number;
    routes: { name: string; driver: string; vehicleNo: string; status: string }[];
  };
  timetable?: {
    count: number;
    todayDay: string;
    todaySlots: { time: string; subject: string; classSection: string; teacher: string; room: string }[];
  };
  subscription?: {
    planName: string;
    status: string;
    trialEndsAt?: string;
    studentCount: number;
    teacherCount: number;
  };
  notices?: {
    count: number;
    latest: { title: string; audience: string; date: string }[];
  };
  syllabus?: {
    count: number;
    units: { title: string; subject: string; classSection: string; weekLabel: string; teacher: string }[];
  };
  events?: {
    count: number;
    upcoming: { title: string; date: string; location: string; category: string }[];
  };
  feed?: {
    count: number;
    latest: { title: string; author: string; type: string }[];
  };
}
