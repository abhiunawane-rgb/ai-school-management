import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MODULES: Record<string, { title: string; description: string }> = {
  attendance: {
    title: 'Attendance',
    description: 'Mark daily attendance, view reports, and send alerts to parents.',
  },
  timetable: {
    title: 'Timetable',
    description: 'Create class schedules, assign periods, and publish timetables to teachers and students.',
  },
  homework: {
    title: 'Homework',
    description: 'Assign homework, track submissions, and share updates with parents.',
  },
  fees: {
    title: 'Fees',
    description: 'Manage fee structures, invoices, online payments, and payment reminders.',
  },
  'bus-tracking': {
    title: 'Bus tracking',
    description: 'Monitor live bus locations and share safe arrival updates with parents.',
  },
  'ai-assistant': {
    title: 'AI assistant',
    description: 'School-wide AI help for admins, teachers, and parents — answers and translations.',
  },
  analytics: {
    title: 'Analytics',
    description: 'Dashboards for attendance trends, fee collection, and academic performance.',
  },
};

export function generateStaticParams() {
  return Object.keys(MODULES).map((module) => ({ module }));
}

export default async function DashboardModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const config = MODULES[module];
  if (!config) notFound();

  return (
    <div className="p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{config.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{config.description}</p>
          <p className="text-sm text-slate-600 rounded-lg bg-slate-100 p-4">
            This module is part of your AI School Management subscription. Full functionality will be
            enabled as you complete school setup and connect Firebase services.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/dashboard">Back to overview</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/subscription">View subscription</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
