'use client';

import { useMemo, useState } from 'react';
import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { updateAttendanceStatus } from '@/lib/school-store';
import type { AttendanceStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { getClassSectionOptions } from '@/lib/school-options';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: AttendanceStatus[] = ['present', 'absent', 'late'];

export default function AttendancePage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  const [classFilter, setClassFilter] = useState('all');
  const today = new Date().toISOString().slice(0, 10);

  const records = useMemo(() => {
    if (!state?.attendance) return [];
    return state.attendance.filter((r) => {
      if (r.date !== today) return false;
      if (classFilter !== 'all' && r.classSection !== classFilter) return false;
      return true;
    });
  }, [state, classFilter, today]);

  const classOptions = useMemo(
    () => [{ value: 'all', label: 'All classes' }, ...getClassSectionOptions()],
    []
  );

  const summary = useMemo(() => {
    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const late = records.filter((r) => r.status === 'late').length;
    return { present, absent, late, total: records.length };
  }, [records]);

  if (!state) return null;

  function markStatus(recordId: string, studentName: string, status: AttendanceStatus) {
    update(updateAttendanceStatus(state!, recordId, status));
    notify.success(
      'Attendance updated',
      `${studentName} marked as ${status}.`,
      'Parents can see updates in the mobile app.'
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <p className="text-sm text-slate-600 mt-1">
          Mark and review daily attendance for {today}. Data is saved locally until Firebase is connected.
        </p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Present', value: summary.present, className: 'text-emerald-700' },
          { label: 'Absent', value: summary.absent, className: 'text-red-700' },
          { label: 'Late', value: summary.late, className: 'text-amber-700' },
          { label: 'Total', value: summary.total, className: 'text-slate-900' },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn('text-2xl font-bold', s.className)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle>Today&apos;s register</CardTitle>
          <SelectField
            id="attendance-class-filter"
            label="Class"
            value={classFilter}
            onChange={setClassFilter}
            options={classOptions}
            className="w-48"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4">Student</th>
                  <th className="py-2 pr-4">Class</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium">{r.studentName}</td>
                    <td className="py-3 pr-4">{r.classSection}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {STATUS_OPTIONS.map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={r.status === status ? 'default' : 'secondary'}
                            onClick={() => markStatus(r.id, r.studentName, status)}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
