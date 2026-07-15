'use client';

import { useMemo } from 'react';
import { useSchool } from '@/hooks/use-school';
import { schoolFeeSummary } from '@/lib/fees-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function AnalyticsPage() {
  const { state } = useSchool();

  const feeSummary = useMemo(
    () => (state ? schoolFeeSummary(state.studentFees) : null),
    [state]
  );

  const attendanceSummary = useMemo(() => {
    if (!state?.attendance) return { present: 0, absent: 0, late: 0 };
    const today = new Date().toISOString().slice(0, 10);
    const todayRecords = state.attendance.filter((r) => r.date === today);
    return {
      present: todayRecords.filter((r) => r.status === 'present').length,
      absent: todayRecords.filter((r) => r.status === 'absent').length,
      late: todayRecords.filter((r) => r.status === 'late').length,
    };
  }, [state]);

  if (!state || !feeSummary) return null;

  const { school } = state;
  const activeBuses = (state.busRoutes ?? []).filter((r) => r.status === 'active').length;
  const homeworkCount = (state.homework ?? []).length;
  const teamActive = state.team.filter((m) => m.status === 'active').length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-slate-600 mt-1">Overview from your local school data. Connect Firebase for historical trends.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Students (plan)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{school.studentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fees collected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatMoney(feeSummary.totalPaid, school.currency)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Pending {formatMoney(feeSummary.totalPending, school.currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-700">{attendanceSummary.present}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {attendanceSummary.absent} absent · {attendanceSummary.late} late
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{teamActive}</p>
            <p className="text-xs text-muted-foreground mt-1">{state.team.length} total invites</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Academic activity</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>Homework assignments: <strong>{homeworkCount}</strong></p>
            <p>Timetable periods: <strong>{state.timetable?.length ?? 0}</strong></p>
            <p>Subscription: <strong className="capitalize">{school.subscriptionStatus}</strong> ({school.planName})</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transport</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>Bus routes: <strong>{state.busRoutes?.length ?? 0}</strong></p>
            <p>Routes active now: <strong>{activeBuses}</strong></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
