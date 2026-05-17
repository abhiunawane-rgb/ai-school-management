import Link from 'next/link';

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/attendance', label: 'Attendance' },
  { href: '/dashboard/timetable', label: 'Timetable' },
  { href: '/dashboard/homework', label: 'Homework' },
  { href: '/dashboard/fees', label: 'Fees' },
  { href: '/dashboard/bus-tracking', label: 'Bus tracking' },
  { href: '/dashboard/ai-assistant', label: 'AI assistant' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/subscription', label: 'Subscription' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="text-xl font-semibold text-slate-900 hover:text-brand-700">
            AI School Management
          </Link>
          <p className="text-sm text-slate-500 mt-0.5">School administration portal</p>
        </div>
        <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">
          Sign out
        </Link>
      </header>
      <div className="flex flex-col lg:flex-row">
        <nav
          className="border-b lg:border-b-0 lg:border-r bg-white px-4 py-4 lg:w-56 shrink-0"
          aria-label="Dashboard navigation"
        >
          <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
