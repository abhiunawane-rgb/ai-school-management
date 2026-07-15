'use client';

import Link from 'next/link';
import {
  BookOpen,
  Brain,
  Bus,
  Calendar,
  ClipboardList,
  FileText,
  Megaphone,
  Newspaper,
  Receipt,
  UserCircle,
  Users,
  Wallet,
} from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { AlertBanner } from '@/components/ui/alert-banner';
import { schoolFeeSummary } from '@/lib/fees-utils';
import { canAccessBilling } from '@/lib/role-access';

export default function DashboardPage() {
  const { state } = useSchool();
  if (!state) return null;

  const { school, team, invoices, studentFees, currentUser, attendance, homework, events, notices } =
    state;
  const pendingInvites = team.filter((m) => m.status === 'pending').length;
  const fees = schoolFeeSummary(studentFees);
  const today = new Date().toISOString().slice(0, 10);
  const todayAtt = (attendance ?? []).filter((r) => r.date === today);
  const present = todayAtt.filter((r) => r.status === 'present').length;
  const upcomingEvents = [...(events ?? [])]
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);
  const pinnedNotice = (notices ?? []).find((n) => n.pinned) ?? (notices ?? [])[0];
  const hwCount = (homework ?? []).length;

  const ops = [
    { href: '/dashboard/attendance', icon: Calendar, title: 'Attendance', meta: todayAtt.length ? `${present}/${todayAtt.length} today` : 'Mark register' },
    { href: '/dashboard/fees', icon: Wallet, title: 'Fees', meta: formatMoney(fees.totalPending, school.currency) + ' pending' },
    { href: '/dashboard/homework', icon: FileText, title: 'Homework', meta: `${hwCount} assigned` },
    { href: '/dashboard/syllabus', icon: BookOpen, title: 'Syllabus', meta: 'Publish units' },
    { href: '/dashboard/notices', icon: Megaphone, title: 'Notices', meta: `${(notices ?? []).length} posted` },
    { href: '/dashboard/feed', icon: Newspaper, title: 'Community', meta: 'Posts & events' },
    { href: '/dashboard/timetable', icon: ClipboardList, title: 'Timetable', meta: 'Periods' },
    { href: '/dashboard/bus-tracking', icon: Bus, title: 'Transport', meta: 'Live routes' },
    { href: '/dashboard/ai-assistant', icon: Brain, title: 'AI assistant', meta: 'Ask school data' },
  ];

  const adminLinks = [
    { href: '/dashboard/profile', icon: UserCircle, title: 'School profile' },
    { href: '/dashboard/users', icon: Users, title: 'User management' },
    ...(canAccessBilling(currentUser.role)
      ? [
          { href: '/dashboard/subscription', icon: Receipt, title: 'Subscription' },
          { href: '/dashboard/billing', icon: Receipt, title: 'Billing' },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-ink-900 via-ink-800 to-brand-800 p-6 sm:p-8 text-white shadow-card overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20_184_166_/_0.25),transparent_50%)]" aria-hidden />
        <div className="relative space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-200/90">School operations</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Good day, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-white/75 max-w-xl">
            {school.name} · {school.planName} plan · {school.studentCount} students on roll
          </p>
        </div>
        <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <HeroStat label="Team" value={String(team.length)} sub={`${pendingInvites} pending`} />
          <HeroStat label="Present today" value={todayAtt.length ? `${present}` : '—'} sub={todayAtt.length ? `of ${todayAtt.length}` : 'No marks yet'} />
          <HeroStat label="Fees pending" value={formatShort(fees.totalPending, school.currency)} sub={`${fees.pendingCount} accounts`} />
          <HeroStat label="Invoices" value={String(invoices.length)} sub={school.subscriptionStatus} />
        </div>
      </div>

      {pinnedNotice ? (
        <div className="dash-panel p-4 sm:p-5 flex gap-3 items-start">
          <Megaphone className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" aria-hidden />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Pinned notice</p>
            <p className="font-medium text-ink-900">{pinnedNotice.title}</p>
            <p className="text-sm text-slate-600 line-clamp-2">{pinnedNotice.body}</p>
            <Link href="/dashboard/notices" className="text-sm font-medium text-brand-700 hover:underline mt-1 inline-block">
              View notices →
            </Link>
          </div>
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="dash-section-title">Daily modules</h2>
          <Link href="/dashboard/analytics" className="text-sm font-medium text-brand-700 hover:underline">
            Analytics
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ops.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-sm transition hover:border-brand-200 hover:shadow-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 group-hover:bg-brand-100">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-ink-900 group-hover:text-brand-800">{item.title}</p>
                <p className="text-xs text-slate-500 truncate">{item.meta}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3 space-y-3">
          <h2 className="dash-section-title">Upcoming events</h2>
          <div className="dash-panel divide-y divide-slate-100">
            {upcomingEvents.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">No upcoming events. Publish one from Community & events.</p>
            ) : (
              upcomingEvents.map((ev) => (
                <Link
                  key={ev.id}
                  href="/dashboard/feed"
                  className="flex gap-4 p-4 sm:px-5 hover:bg-slate-50 transition"
                >
                  <div className="shrink-0 rounded-xl bg-ink-900 px-3 py-2 text-center text-white min-w-[3.5rem]">
                    <p className="text-[9px] uppercase text-white/70">
                      {new Date(ev.date + 'T12:00:00').toLocaleString('en', { month: 'short' })}
                    </p>
                    <p className="text-lg font-bold leading-none">{new Date(ev.date + 'T12:00:00').getDate()}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink-900">{ev.title}</p>
                    <p className="text-sm text-slate-500">
                      {ev.time} · {ev.location}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="lg:col-span-2 space-y-3">
          <h2 className="dash-section-title">Administration</h2>
          <ul className="dash-panel divide-y divide-slate-100">
            {adminLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-ink-900 hover:bg-slate-50"
                >
                  <item.icon className="h-4 w-4 text-brand-700" aria-hidden />
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <AlertBanner variant="info" title="Browser demo mode">
        Data is saved in this browser. Sign up on the marketing site to load your school profile, or continue with the
        demo school.
      </AlertBanner>
    </div>
  );
}

function HeroStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-sm ring-1 ring-white/10">
      <p className="text-[10px] font-medium uppercase tracking-wide text-white/60">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-white/55 truncate">{sub}</p>
    </div>
  );
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function formatShort(amount: number, currency: string) {
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k`;
  return formatMoney(amount, currency);
}
