'use client';

import { useState } from 'react';
import { useSchool } from '@/hooks/use-school';
import { PortalPage } from '@/components/portal/portal-page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DEMO_CLASS_ROSTER,
  personalAttendance,
  type AttendanceMark,
} from '@/lib/portal/demo-data';
import { cn } from '@/lib/utils';

const STATUS_LABEL: Record<AttendanceMark, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  on_leave: 'On leave',
  holiday: 'Holiday',
};

const STATUS_CLASS: Record<AttendanceMark, string> = {
  present: 'bg-emerald-100 text-emerald-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-amber-100 text-amber-800',
  on_leave: 'bg-blue-100 text-blue-800',
  holiday: 'bg-purple-100 text-purple-800',
};

export default function PortalAttendancePage() {
  const { state } = useSchool();
  const [tab, setTab] = useState<'mine' | 'class'>('mine');
  const [marks, setMarks] = useState<Record<string, AttendanceMark>>({});

  if (!state) return null;
  const role = state.currentUser.role;
  const records = personalAttendance(role);
  const present = records.filter((r) => r.status === 'present').length;
  const pct = Math.round((present / Math.max(records.filter((r) => r.status !== 'holiday').length, 1)) * 100);

  const title =
    role === 'parent'
      ? 'Child attendance'
      : role === 'student'
        ? 'My attendance'
        : role === 'driver'
          ? 'Duty attendance'
          : 'Attendance';

  return (
    <PortalPage title={title}>
      {role === 'teacher' ? (
        <div className="flex gap-2">
          <Button size="sm" variant={tab === 'mine' ? 'default' : 'secondary'} onClick={() => setTab('mine')}>
            My record
          </Button>
          <Button size="sm" variant={tab === 'class' ? 'default' : 'secondary'} onClick={() => setTab('class')}>
            Mark class
          </Button>
        </div>
      ) : null}

      {tab === 'class' && role === 'teacher' ? (
        <Card>
          <CardHeader>
            <CardTitle>Class 8-A — today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEMO_CLASS_ROSTER.map((s) => (
              <div key={s.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-3">
                <span className="font-medium text-sm">{s.name}</span>
                <div className="flex flex-wrap gap-1">
                  {(['present', 'absent', 'late', 'on_leave'] as AttendanceMark[]).map((st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant={(marks[s.id] ?? 'present') === st ? 'default' : 'secondary'}
                      onClick={() => setMarks((m) => ({ ...m, [s.id]: st }))}
                    >
                      {st.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <Button
              className="w-full"
              onClick={() => {
                const marked = DEMO_CLASS_ROSTER.filter((s) => marks[s.id] || true).length;
                alert(`Attendance saved for ${marked} students (demo — stored in this browser).`);
              }}
            >
              Save register
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="pt-6 flex gap-6">
              <div>
                <p className="text-3xl font-bold text-brand-700">{pct}%</p>
                <p className="text-xs text-slate-500">Last 30 school days</p>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <p>{present} present</p>
                <p>{records.filter((r) => r.status === 'absent').length} absent</p>
                <p>{records.filter((r) => r.status === 'late').length} late</p>
              </div>
            </CardContent>
          </Card>
          <ul className="space-y-2">
            {records
              .slice()
              .reverse()
              .map((r) => (
                <li
                  key={r.date}
                  className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm"
                >
                  <span>{r.date}</span>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_CLASS[r.status])}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </li>
              ))}
          </ul>
        </>
      )}
    </PortalPage>
  );
}
