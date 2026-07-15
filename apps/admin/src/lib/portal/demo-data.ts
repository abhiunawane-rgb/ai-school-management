export type Holiday = { date: string; title: string; optional?: boolean };

export type HomeworkItem = {
  title: string;
  subject: string;
  dueDate: string;
  description: string;
};

export type NoticeItem = {
  title: string;
  body: string;
  date: string;
  author: string;
};

export type TimetablePeriod = {
  period: number;
  subject: string;
  teacher: string;
  room: string;
};

export type ClassStudent = { id: string; name: string; classSection: string };

export type AttendanceMark = 'present' | 'absent' | 'late' | 'on_leave' | 'holiday';

export type DailyAttendance = {
  date: string;
  status: AttendanceMark;
  note?: string;
};

const year = new Date().getFullYear();

export const DEMO_HOLIDAYS: Holiday[] = [
  { date: `${year}-01-26`, title: 'Republic Day' },
  { date: `${year}-03-14`, title: 'Holi' },
  { date: `${year}-08-15`, title: 'Independence Day' },
  { date: `${year}-10-02`, title: 'Gandhi Jayanti' },
  { date: `${year}-10-20`, title: 'Diwali break' },
  { date: `${year}-10-21`, title: 'Diwali break' },
  { date: `${year}-10-22`, title: 'Diwali break' },
  { date: `${year}-12-25`, title: 'Christmas' },
  { date: `${year}-12-31`, title: 'New Year Eve (half day)', optional: true },
];

export const DEMO_HOMEWORK: HomeworkItem[] = [
  {
    title: 'Algebra worksheet — Chapter 5',
    subject: 'Mathematics',
    dueDate: '2026-06-02',
    description: 'Complete exercises 1–12. Show all steps.',
  },
  {
    title: 'Essay: My favourite book',
    subject: 'English',
    dueDate: '2026-06-05',
    description: '300–400 words.',
  },
];

export const DEMO_NOTICES: NoticeItem[] = [
  {
    title: 'Parent–teacher meeting',
    body: 'PTM for classes 6–8 on Saturday 10:00 AM in the auditorium.',
    date: '2026-05-28',
    author: 'Principal office',
  },
  {
    title: 'Sports day practice',
    body: 'Students selected for march-past must report at 7:30 AM.',
    date: '2026-05-25',
    author: 'Sports dept',
  },
];

export const DEMO_TIMETABLE: TimetablePeriod[] = [
  { period: 1, subject: 'Mathematics', teacher: 'Rahul Mehta', room: '201' },
  { period: 2, subject: 'Science', teacher: 'Anita Desai', room: 'Lab 1' },
  { period: 3, subject: 'English', teacher: 'Priya Nair', room: '105' },
  { period: 4, subject: 'Hindi', teacher: 'Vikram Joshi', room: '102' },
];

export const DEMO_CLASS_ROSTER: ClassStudent[] = [
  { id: 's1', name: 'Aarav Patel', classSection: '8-A' },
  { id: 's2', name: 'Isha Sharma', classSection: '8-A' },
  { id: 's3', name: 'Vihaan Khan', classSection: '8-A' },
  { id: 's4', name: 'Ananya Reddy', classSection: '8-A' },
  { id: 's5', name: 'Rohan Das', classSection: '8-A' },
];

export const DEMO_PARENT_FEES = {
  studentName: 'Aarav Patel',
  total: 45000,
  paid: 30000,
  pending: 15000,
  status: 'partial' as const,
};

export const DEMO_DRIVER_ROUTE = {
  name: 'Route A — Koregaon Park',
  vehicle: 'MH-12-AB-4521',
  stops: ['Gate 1 — Sun City', 'Lane 5 pickup', 'Kalyani Nagar', 'School main gate'],
};

export function personalAttendance(role: string): DailyAttendance[] {
  const holidayDates = new Set(DEMO_HOLIDAYS.map((h) => h.date));
  const list: DailyAttendance[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const key = d.toISOString().slice(0, 10);
    if (holidayDates.has(key)) {
      list.push({ date: key, status: 'holiday', note: 'School holiday' });
      continue;
    }
    let status: AttendanceMark = 'present';
    if (i === 3) status = 'on_leave';
    else if (i === 7) status = 'late';
    else if (role === 'driver' && i === 14) status = 'absent';
    else if (role === 'student' && i === 21) status = 'absent';
    list.push({ date: key, status });
  }
  return list;
}
