import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const modules = [
  { href: '/dashboard/attendance', label: 'Attendance', desc: 'Daily presence and parent alerts' },
  { href: '/dashboard/timetable', label: 'Timetable', desc: 'Class schedules and periods' },
  { href: '/dashboard/homework', label: 'Homework', desc: 'Assignments and submissions' },
  { href: '/dashboard/fees', label: 'Fees', desc: 'Billing, invoices, and payments' },
  { href: '/dashboard/bus-tracking', label: 'Bus tracking', desc: 'Live GPS for school transport' },
  { href: '/dashboard/ai-assistant', label: 'AI assistant', desc: 'Smart help for your school' },
  { href: '/dashboard/analytics', label: 'Analytics', desc: 'Reports and insights' },
  { href: '/dashboard/subscription', label: 'Subscription', desc: 'Plan, billing, and trial' },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">Dashboard overview</h1>
      <p className="text-slate-600 mb-6 max-w-2xl">
        Welcome to AI School Management. Select a module below to manage your school operations.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base">{m.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
