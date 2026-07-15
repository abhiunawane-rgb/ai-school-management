'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const LABELS: Record<string, string> = {
  dashboard: 'Overview',
  profile: 'School profile',
  team: 'User management',
  users: 'User management',
  subscription: 'Subscription',
  billing: 'Billing',
  settings: 'Settings',
  attendance: 'Attendance',
  timetable: 'Timetable',
  homework: 'Homework',
  syllabus: 'Syllabus',
  notices: 'Notices',
  feed: 'Community & events',
  fees: 'Fees',
  'bus-tracking': 'Bus tracking',
  'ai-assistant': 'AI assistant',
  analytics: 'Analytics',
};

/** Jakob's Law: familiar breadcrumb pattern for orientation and escape. */
export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label = LABELS[seg] ?? seg;
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <li>
          <Link
            href="/dashboard"
            className="touch-target-inline flex items-center gap-1 rounded-lg text-slate-600 hover:text-brand-700"
          >
            <Home className="h-4 w-4" aria-hidden />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>
        {crumbs.slice(1).map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
            {crumb.isLast ? (
              <span className="font-medium text-slate-900" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="hover:text-brand-700 rounded-lg">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
