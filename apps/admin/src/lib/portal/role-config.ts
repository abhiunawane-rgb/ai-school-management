import type { Role } from '@ai-school/shared';
import { ADMIN_ROLES } from '@ai-school/shared';
import type { LucideIcon } from 'lucide-react';
import { getLoginUrl as getEnvLoginUrl } from '@/lib/env';
import {
  Bus,
  Calendar,
  ClipboardList,
  FileText,
  Megaphone,
  Brain,
  Palmtree,
  Route,
  School,
  ShieldAlert,
  UserCheck,
  Wallet,
  BookOpen,
  Newspaper,
} from 'lucide-react';

export function isAdminRole(role: Role): boolean {
  return (ADMIN_ROLES as readonly Role[]).includes(role);
}

export function postLoginPath(role: Role): string {
  return isAdminRole(role) ? '/dashboard/' : '/portal/';
}

export function getLoginUrl(): string {
  return getEnvLoginUrl();
}

export type PortalTile = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  hint?: string;
  roles: Role[];
  external?: string;
};

const PORTAL_ROLES: Role[] = ['teacher', 'parent', 'student', 'driver'];

export const PORTAL_TILES: PortalTile[] = [
  {
    id: 'attendance',
    label: 'Attendance',
    href: '/portal/attendance',
    icon: UserCheck,
    hint: 'My record & mark class',
    roles: PORTAL_ROLES,
  },
  {
    id: 'school-profile',
    label: 'School profile',
    href: '/portal/school-profile',
    icon: School,
    roles: PORTAL_ROLES,
  },
  {
    id: 'leaves',
    label: 'Leave requests',
    href: '/portal/leaves',
    icon: Palmtree,
    roles: PORTAL_ROLES,
  },
  {
    id: 'holidays',
    label: 'Holiday calendar',
    href: '/portal/holidays',
    icon: Calendar,
    roles: PORTAL_ROLES,
  },
  {
    id: 'homework',
    label: 'Homework',
    href: '/portal/homework',
    icon: FileText,
    roles: ['teacher', 'student', 'parent'],
  },
  {
    id: 'syllabus',
    label: 'Syllabus',
    href: '/portal/syllabus',
    icon: BookOpen,
    roles: ['teacher', 'student', 'parent'],
  },
  {
    id: 'notices',
    label: 'Notices',
    href: '/portal/notices',
    icon: Megaphone,
    roles: ['teacher', 'parent', 'student'],
  },
  {
    id: 'feed',
    label: 'Community',
    href: '/portal/feed',
    icon: Newspaper,
    roles: ['teacher', 'parent', 'student'],
  },
  {
    id: 'timetable',
    label: 'Timetable',
    href: '/portal/timetable',
    icon: ClipboardList,
    roles: ['student', 'teacher', 'parent'],
  },
  {
    id: 'fees',
    label: 'Fees & pay',
    href: '/portal/fees',
    icon: Wallet,
    roles: ['parent'],
  },
  {
    id: 'bus',
    label: 'Bus tracking',
    href: '/portal/bus-tracking',
    icon: Bus,
    roles: ['parent', 'driver'],
  },
  {
    id: 'route',
    label: 'My route',
    href: '/portal/driver-route',
    icon: Route,
    roles: ['driver'],
  },
  {
    id: 'emergency',
    label: 'Emergency',
    href: '/portal/emergency',
    icon: ShieldAlert,
    roles: ['driver'],
  },
  {
    id: 'ai',
    label: 'AI assistant',
    href: '/portal/ai',
    icon: Brain,
    roles: ['teacher', 'parent', 'student'],
  },
];

export function tilesForRole(role: Role): PortalTile[] {
  return PORTAL_TILES.filter((t) => t.roles.includes(role));
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super admin',
  school_admin: 'School admin',
  sub_admin: 'Sub admin',
  teacher: 'Teacher',
  parent: 'Parent',
  student: 'Student',
  driver: 'Driver',
};

export const LOGIN_ROLES: Role[] = [
  'school_admin',
  'sub_admin',
  'teacher',
  'parent',
  'student',
  'driver',
];
