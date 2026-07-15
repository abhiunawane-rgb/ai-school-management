import type { TeamMember } from './types';
import { GRADES, DIVISIONS, SUBJECTS, formatClassSection } from '@ai-school/shared';

export { GRADES, DIVISIONS, SUBJECTS, formatClassSection };

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const ROOMS = [
  'Room 101',
  'Room 102',
  'Room 103',
  'Room 104',
  'Room 105',
  'Room 201',
  'Room 202',
  'Room 203',
  'Science Lab 1',
  'Science Lab 2',
  'Computer Lab',
  'Art Room',
  'Music Room',
  'Sports Ground',
  'Assembly Hall',
  'Library',
] as const;

export const PERIOD_SCHEDULE = [
  { period: 1, timeFrom: '08:00', timeTo: '08:45', label: 'Period 1' },
  { period: 2, timeFrom: '08:45', timeTo: '09:30', label: 'Period 2' },
  { period: 3, timeFrom: '09:30', timeTo: '10:15', label: 'Period 3' },
  { period: 4, timeFrom: '10:30', timeTo: '11:15', label: 'Period 4' },
  { period: 5, timeFrom: '11:15', timeTo: '12:00', label: 'Period 5' },
  { period: 6, timeFrom: '12:45', timeTo: '13:30', label: 'Period 6' },
  { period: 7, timeFrom: '13:30', timeTo: '14:15', label: 'Period 7' },
  { period: 8, timeFrom: '14:15', timeTo: '15:00', label: 'Period 8' },
] as const;

export const TIME_FROM_OPTIONS = [
  '08:00',
  '08:45',
  '09:30',
  '10:30',
  '11:15',
  '12:45',
  '13:30',
  '14:15',
] as const;

export const TIME_TO_OPTIONS = [
  '08:45',
  '09:30',
  '10:15',
  '11:15',
  '12:00',
  '13:30',
  '14:15',
  '15:00',
] as const;

const DEFAULT_TEACHERS = [
  'Rahul Mehta',
  'Anita Desai',
  'Priya Nair',
  'Suresh Kumar',
  'Meera Joshi',
  'Vikram Singh',
];

export function getTeacherOptions(team: TeamMember[] = []): string[] {
  const fromTeam = team
    .filter((m) => m.status === 'active' && (m.role === 'teacher' || m.role === 'sub_admin'))
    .map((m) => m.name);
  return [...new Set([...DEFAULT_TEACHERS, ...fromTeam])].sort();
}

export function getPeriodOptions() {
  return PERIOD_SCHEDULE.map((p) => ({
    value: String(p.period),
    label: `${p.label} (${p.timeFrom} – ${p.timeTo})`,
    timeFrom: p.timeFrom,
    timeTo: p.timeTo,
  }));
}

export function timesForPeriod(period: number): { timeFrom: string; timeTo: string } {
  const match = PERIOD_SCHEDULE.find((p) => p.period === period);
  return match
    ? { timeFrom: match.timeFrom, timeTo: match.timeTo }
    : { timeFrom: TIME_FROM_OPTIONS[0], timeTo: TIME_TO_OPTIONS[0] };
}

export function formatTimeRange(from: string, to: string): string {
  return `${from} – ${to}`;
}
