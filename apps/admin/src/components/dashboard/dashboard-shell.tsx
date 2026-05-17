'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { initSchoolState, loadSchoolState } from '@/lib/school-store';
import { useSchool } from '@/hooks/use-school';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UserCircle,
  Settings,
  CreditCard,
  Receipt,
  Users,
  GraduationCap,
  Calendar,
  ClipboardList,
  FileText,
  Bus,
  Brain,
  BarChart3,
} from 'lucide-react';

const mainNav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'School profile', icon: UserCircle },
  { href: '/dashboard/team', label: 'Team & invites', icon: Users },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/billing', label: 'Billing & invoices', icon: Receipt },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const modulesNav = [
  { href: '/dashboard/attendance', label: 'Attendance', icon: Calendar },
  { href: '/dashboard/timetable', label: 'Timetable', icon: ClipboardList },
  { href: '/dashboard/homework', label: 'Homework', icon: FileText },
  { href: '/dashboard/fees', label: 'Fees', icon: CreditCard },
  { href: '/dashboard/bus-tracking', label: 'Bus tracking', icon: Bus },
  { href: '/dashboard/ai-assistant', label: 'AI assistant', icon: Brain },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, ready } = useSchool();

  useEffect(() => {
    if (!loadSchoolState()) initSchoolState();
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        Loading dashboard…
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 p-6">
        <p className="text-slate-600">No school session found. Please sign in.</p>
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  const { school, currentUser } = state;
  const trialDaysLeft = Math.max(
    0,
    Math.ceil((new Date(school.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b bg-white px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {school.logoUrl ? (
            <img
              src={school.logoUrl}
              alt=""
              className="h-10 w-10 rounded-lg object-contain border border-slate-200 bg-white"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <GraduationCap className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{school.name}</p>
            <p className="text-xs text-slate-500 truncate">
              {currentUser.name} · {currentUser.role.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {school.subscriptionStatus === 'trial' && (
            <span className="hidden sm:inline text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
              Trial · {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left
            </span>
          )}
          <Link
            href="/login"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('aischool_admin_state');
              }
            }}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Sign out
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row min-h-0">
        <aside className="border-b lg:border-b-0 lg:border-r bg-white lg:w-60 shrink-0 overflow-y-auto">
          <nav className="p-3 space-y-6" aria-label="Dashboard">
            <div>
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Administration
              </p>
              <ul className="space-y-0.5">
                {mainNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          active
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-100'
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Modules
              </p>
              <ul className="space-y-0.5">
                {modulesNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          active
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-100'
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </aside>
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
