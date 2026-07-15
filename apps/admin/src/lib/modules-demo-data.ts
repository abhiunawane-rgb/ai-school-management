import type { AttendanceRecord, BusRoute, HomeworkItem, TimetableSlot } from './types';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createDemoAttendance(): AttendanceRecord[] {
  const today = todayKey();
  return [
    { id: 'att_1', date: today, classSection: '8-A', studentName: 'Aarav Patel', status: 'present' },
    { id: 'att_2', date: today, classSection: '8-A', studentName: 'Isha Mehta', status: 'present' },
    { id: 'att_3', date: today, classSection: '8-A', studentName: 'Rohan Singh', status: 'late' },
    { id: 'att_4', date: today, classSection: '8-B', studentName: 'Sneha Rao', status: 'absent' },
    { id: 'att_5', date: today, classSection: '8-B', studentName: 'Vikram Das', status: 'present' },
  ];
}

export function createDemoHomework(): HomeworkItem[] {
  const due = new Date();
  due.setDate(due.getDate() + 3);
  return [
    {
      id: 'hw_1',
      title: 'Algebra worksheet — Chapter 5',
      classSection: '8-A',
      subject: 'Mathematics',
      dueDate: due.toISOString().slice(0, 10),
      description: 'Complete exercises 1–12. Show all steps.',
    },
    {
      id: 'hw_2',
      title: 'Essay: My favourite book',
      classSection: '8-B',
      subject: 'English',
      dueDate: due.toISOString().slice(0, 10),
      description: '300–400 words. Submit as PDF or photo.',
    },
  ];
}

export function createDemoTimetable(): TimetableSlot[] {
  return [
    { id: 'tt_1', grade: '8', division: 'A', classSection: '8-A', day: 'Monday', period: 1, timeFrom: '08:00', timeTo: '08:45', subject: 'Mathematics', teacher: 'Rahul Mehta', room: 'Room 201' },
    { id: 'tt_2', grade: '8', division: 'A', classSection: '8-A', day: 'Monday', period: 2, timeFrom: '08:45', timeTo: '09:30', subject: 'Science', teacher: 'Anita Desai', room: 'Science Lab 1' },
    { id: 'tt_3', grade: '8', division: 'A', classSection: '8-A', day: 'Tuesday', period: 1, timeFrom: '08:00', timeTo: '08:45', subject: 'English', teacher: 'Priya Nair', room: 'Room 105' },
    { id: 'tt_4', grade: '8', division: 'B', classSection: '8-B', day: 'Monday', period: 1, timeFrom: '08:00', timeTo: '08:45', subject: 'Mathematics', teacher: 'Rahul Mehta', room: 'Room 201' },
  ];
}

export function createDemoBusRoutes(): BusRoute[] {
  return [
    {
      id: 'bus_1',
      name: 'Route A — Koregaon Park',
      driverName: 'Suresh Patil',
      vehicleNo: 'MH-12-AB-4521',
      status: 'active',
      lastLat: 18.5362,
      lastLng: 73.8958,
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      id: 'bus_2',
      name: 'Route B — Hinjewadi',
      driverName: 'Mahesh Patil',
      vehicleNo: 'MH-12-CD-8890',
      status: 'idle',
      lastLat: 18.5912,
      lastLng: 73.7389,
      lastUpdatedAt: new Date().toISOString(),
    },
  ];
}
