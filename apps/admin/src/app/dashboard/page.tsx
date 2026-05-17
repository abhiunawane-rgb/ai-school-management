import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const modules = [
  { href: '/dashboard/attendance', label: 'Attendance', feature: 'attendance' },
  { href: '/dashboard/timetable', label: 'Timetable', feature: 'timetable' },
  { href: '/dashboard/homework', label: 'Homework', feature: 'homework' },
  { href: '/dashboard/fees', label: 'Fees', feature: 'fees' },
  { href: '/dashboard/bus-tracking', label: 'Bus Tracking', feature: 'bus_tracking' },
  { href: '/dashboard/ai-assistant', label: 'AI Assistant', feature: 'ai_chatbot' },
  { href: '/dashboard/analytics', label: 'Analytics', feature: 'analytics' },
  { href: '/dashboard/subscription', label: 'Subscription', feature: null },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-semibold">School Admin Dashboard</h1>
      </header>
      <main className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base">{m.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {m.feature ? `Feature: ${m.feature}` : 'Billing & plan'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </main>
    </div>
  );
}
