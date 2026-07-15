'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Role } from '@ai-school/shared';
import { getLoginUrl } from '@/lib/portal/role-config';
import { loadSchoolState } from '@/lib/school-store';
import { useSchool } from '@/hooks/use-school';
import { Breadcrumb } from '@/components/dashboard/breadcrumb';
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
  Menu,
  X,
  BookOpen,
  Megaphone,
  Newspaper,
} from 'lucide-react';

const mainNav: { href: string; label: string; icon: typeof LayoutDashboard; roles?: Role[] }[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'School profile', icon: UserCircle },
  { href: '/dashboard/users', label: 'User management', icon: Users },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard, roles: ['school_admin'] },
  { href: '/dashboard/billing', label: 'Billing & invoices', icon: Receipt, roles: ['school_admin'] },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const modulesNav = [
  { href: '/dashboard/attendance', label: 'Attendance', icon: Calendar },
  { href: '/dashboard/timetable', label: 'Timetable', icon: ClipboardList },
  { href: '/dashboard/homework', label: 'Homework', icon: FileText },
  { href: '/dashboard/syllabus', label: 'Syllabus', icon: BookOpen },
  { href: '/dashboard/notices', label: 'Notices', icon: Megaphone },
  { href: '/dashboard/feed', label: 'Community & events', icon: Newspaper },
  { href: '/dashboard/fees', label: 'Fees', icon: CreditCard },
  { href: '/dashboard/bus-tracking', label: 'Bus tracking', icon: Bus },
  { href: '/dashboard/ai-assistant', label: 'AI assistant', icon: Brain },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

function NavLinks({
  pathname,
  role,
  onNavigate,
}: {
  pathname: string;
  role: Role;
  onNavigate?: () => void;
}) {
  const linkClass = (active: boolean) =>
    cn(
      'flex items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors touch-target-inline w-full',
      active
        ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100'
        : 'text-slate-700 hover:bg-slate-100 hover:text-brand-700'
    );

  const adminItems = mainNav.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <>
      <div>
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Administration
        </p>
        <ul className="space-y-1">
          {adminItems.map((item) => {
            const active = pathname.replace(/\/$/, '') === item.href.replace(/\/$/, '');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={linkClass(active)}
                  aria-current={active ? 'page' : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden />
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
        <ul className="space-y-1">
          {modulesNav.map((item) => {
            const active = pathname.replace(/\/$/, '') === item.href.replace(/\/$/, '');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={linkClass(active)}
                  aria-current={active ? 'page' : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, ready } = useSchool();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    loadSchoolState();
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileNavOpen]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero text-slate-600" role="status">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          Loading dashboard…
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 gradient-hero p-6">
        <p className="text-slate-600 text-center max-w-sm">
          No school session found. Sign in with your phone number to continue.
        </p>
        <a
          href={getLoginUrl()}
          className="touch-target-inline rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Go to sign in
        </a>
      </div>
    );
  }

  const { school, currentUser } = state;
  const trialDaysLeft = Math.max(
    0,
    Math.ceil((new Date(school.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col">
      <header className="glass-nav sticky top-0 z-40 px-4 py-2 sm:py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="touch-target rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          {school.logoUrl ? (
            <img
              src={school.logoUrl}
              alt={`${school.name} logo`}
              className="h-10 w-10 rounded-xl object-contain border border-slate-200 bg-white shadow-sm"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
          )}
          <div className="min-w-0">
            <p className="font-display font-semibold text-slate-900 truncate text-sm sm:text-base">
              {school.name}
            </p>
            <p className="text-xs text-slate-500 truncate capitalize">
              {currentUser.name} · {currentUser.role.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {school.subscriptionStatus === 'trial' && (
            <span className="hidden sm:inline text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-full">
              Trial · {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left
            </span>
          )}
          <a
            href={getLoginUrl()}
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('aischool_admin_state');
              }
            }}
            className="touch-target-inline rounded-xl text-sm text-slate-600 hover:text-brand-700 font-medium hover:bg-slate-100"
          >
            Sign out
          </a>
        </div>
      </header>

      {/* Mobile nav drawer — Hick's Law: progressive disclosure on small screens */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside
            id="mobile-nav"
            className="absolute left-0 top-0 h-full w-[min(100%,20rem)] bg-white shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="font-display font-semibold text-slate-900">Menu</span>
              <button
                type="button"
                className="touch-target rounded-xl hover:bg-slate-100"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-6" aria-label="Dashboard">
              <NavLinks pathname={pathname} role={currentUser.role} onNavigate={() => setMobileNavOpen(false)} />
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col lg:flex-row min-h-0">
        <aside className="hidden lg:block border-r border-slate-200/80 bg-white lg:w-64 shrink-0 overflow-y-auto shadow-sidebar">
          <div className="px-4 pt-5 pb-2">
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-brand-700">
              Operations
            </p>
          </div>
          <nav className="p-3 space-y-6 sticky top-0" aria-label="Dashboard">
            <NavLinks pathname={pathname} role={currentUser.role} />
          </nav>
        </aside>
        <main id="main-content" className="flex-1 min-w-0 overflow-y-auto focus:outline-none" tabIndex={-1}>
          <div className="page-container">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
