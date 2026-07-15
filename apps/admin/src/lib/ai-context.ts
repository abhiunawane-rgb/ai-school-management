import type { SchoolAiSnapshot } from '@ai-school/shared';
import { schoolFeeSummary, studentFeeTotals } from './fees-utils';
import type { SchoolState } from './types';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

function feesDueThisMonth(state: SchoolState): number {
  const month = currentMonthKey();
  let total = 0;
  for (const account of state.studentFees) {
    const { pending } = studentFeeTotals(account);
    if (pending <= 0) continue;
    const dueThisMonth = account.lineItems
      .filter((li) => monthKey(li.dueDate) === month)
      .reduce((sum, li) => sum + li.amount, 0);
    total += Math.min(pending, dueThisMonth);
  }
  return total;
}

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

function countOverdue(state: SchoolState): number {
  const today = new Date().toISOString().slice(0, 10);
  return state.studentFees.filter((account) => {
    const { pending } = studentFeeTotals(account);
    if (pending <= 0) return false;
    return account.lineItems.some((li) => li.dueDate < today);
  }).length;
}

export function buildSchoolAiSnapshot(state: SchoolState): SchoolAiSnapshot {
  const today = new Date().toISOString().slice(0, 10);
  const todayDay = WEEKDAYS[new Date().getDay()];
  const feeSummary = schoolFeeSummary(state.studentFees);

  const topPending = state.studentFees
    .map((account) => {
      const { pending } = studentFeeTotals(account);
      return {
        studentName: account.studentName,
        classSection: account.classSection,
        pending,
      };
    })
    .filter((s) => s.pending > 0)
    .sort((a, b) => b.pending - a.pending)
    .slice(0, 5);

  const todayAttendance = (state.attendance ?? []).filter((r) => r.date === today);
  const byClass: Record<string, { present: number; absent: number; late: number }> = {};
  for (const r of todayAttendance) {
    if (!byClass[r.classSection]) byClass[r.classSection] = { present: 0, absent: 0, late: 0 };
    byClass[r.classSection][r.status] += 1;
  }

  const homework = state.homework ?? [];
  const upcomingHomework = [...homework]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5)
    .map((h) => ({
      title: h.title,
      classSection: h.classSection,
      subject: h.subject,
      dueDate: h.dueDate,
    }));

  const routes = state.busRoutes ?? [];
  const timetable = state.timetable ?? [];
  const todaySlots = timetable
    .filter((s) => s.day === todayDay)
    .sort((a, b) => a.period - b.period)
    .map((s) => ({
      time: `${s.timeFrom} – ${s.timeTo}`,
      subject: s.subject,
      classSection: s.classSection,
      teacher: s.teacher,
      room: s.room,
    }));

  const team = state.team;
  const role = state.currentUser.role;

  return {
    schoolName: state.school.name,
    role,
    currency: state.school.currency,
    today,
    viewerName: state.currentUser.name,
    fees: {
      totalFees: feeSummary.totalFees,
      totalPaid: feeSummary.totalPaid,
      totalPending: feeSummary.totalPending,
      dueThisMonth: feesDueThisMonth(state),
      studentCount: feeSummary.studentCount,
      paidCount: feeSummary.paidCount,
      partialCount: feeSummary.partialCount,
      pendingCount: feeSummary.pendingCount,
      overdueCount: countOverdue(state),
      topPending,
    },
    attendance: todayAttendance.length
      ? {
          date: today,
          present: todayAttendance.filter((r) => r.status === 'present').length,
          absent: todayAttendance.filter((r) => r.status === 'absent').length,
          late: todayAttendance.filter((r) => r.status === 'late').length,
          total: todayAttendance.length,
          absentStudents: todayAttendance.filter((r) => r.status === 'absent').map((r) => r.studentName),
          byClass,
        }
      : undefined,
    homework: homework.length
      ? { count: homework.length, upcoming: upcomingHomework }
      : undefined,
    team: {
      total: team.length,
      teachers: team.filter((m) => m.role === 'teacher').length,
      parents: team.filter((m) => m.role === 'parent').length,
      students: team.filter((m) => m.role === 'student').length,
      drivers: team.filter((m) => m.role === 'driver').length,
    },
    busRoutes: routes.length
      ? {
          count: routes.length,
          active: routes.filter((r) => r.status === 'active').length,
          routes: routes.map((r) => ({
            name: r.name,
            driver: r.driverName,
            vehicleNo: r.vehicleNo,
            status: r.status,
          })),
        }
      : undefined,
    timetable: timetable.length
      ? { count: timetable.length, todayDay, todaySlots }
      : undefined,
    subscription: {
      planName: state.school.planName,
      status: state.school.subscriptionStatus,
      trialEndsAt: state.school.trialEndsAt,
      studentCount: state.school.studentCount,
      teacherCount: state.school.teacherCount,
    },
    notices: (state.notices ?? []).length
      ? {
          count: state.notices!.length,
          latest: state.notices!.slice(0, 5).map((n) => ({
            title: n.title,
            audience: n.audience,
            date: n.createdAt,
          })),
        }
      : undefined,
    syllabus: (state.syllabus ?? []).length
      ? {
          count: state.syllabus!.length,
          units: state.syllabus!.slice(0, 6).map((u) => ({
            title: u.title,
            subject: u.subject,
            classSection: u.classSection,
            weekLabel: u.weekLabel,
            teacher: u.teacher,
          })),
        }
      : undefined,
    events: (state.events ?? []).length
      ? {
          count: state.events!.length,
          upcoming: [...state.events!]
            .filter((e) => e.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5)
            .map((e) => ({
              title: e.title,
              date: e.date,
              location: e.location,
              category: e.category,
            })),
        }
      : undefined,
    feed: (state.feed ?? []).length
      ? {
          count: state.feed!.length,
          latest: state.feed!.slice(0, 5).map((p) => ({
            title: p.title,
            author: p.author,
            type: p.type,
          })),
        }
      : undefined,
  };
}
