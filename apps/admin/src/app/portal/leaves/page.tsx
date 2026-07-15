'use client';

import { useEffect, useState } from 'react';
import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { PortalPage } from '@/components/portal/portal-page';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select-field';
import { LEAVE_REASONS } from '@/lib/school-options';
import { addLeave, loadLeaves, type LeaveRequest } from '@/lib/portal/leaves-store';
import { cn } from '@/lib/utils';

export default function PortalLeavesPage() {
  const { state } = useSchool();
  const notify = useNotify();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState<string>(LEAVE_REASONS[0]);

  if (!state) return null;

  const canApply = state.currentUser.role !== 'school_admin' && state.currentUser.role !== 'sub_admin';

  useEffect(() => {
    setLeaves(loadLeaves());
  }, []);

  const title =
    state.currentUser.role === 'parent' ? 'Child leave requests' : 'Leave requests';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to || !reason) {
      notify.error('Missing dates', 'From date, to date, and reason are required.', 'Complete all fields.');
      return;
    }
    if (from > to) {
      notify.error('Invalid dates', 'End date must be on or after start date.', 'Check the date range.');
      return;
    }
    setLeaves(addLeave({ from, to, reason }));
    notify.success(
      'Leave submitted',
      `Your request from ${from} to ${to} is pending approval.`,
      'You will be notified when admin approves or rejects it.'
    );
    setShowForm(false);
    setFrom('');
    setTo('');
    setReason(LEAVE_REASONS[0]);
  }

  return (
    <PortalPage title={title}>
      {canApply ? (
        <Button className="w-full" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Apply for leave'}
        </Button>
      ) : null}

      {showForm ? (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block text-sm font-medium">
                From
                <Input type="date" className="mt-1" value={from} onChange={(e) => setFrom(e.target.value)} required />
              </label>
              <label className="block text-sm font-medium">
                To
                <Input type="date" className="mt-1" value={to} onChange={(e) => setTo(e.target.value)} required />
              </label>
              <SelectField
                id="leave-reason"
                label="Reason"
                required
                value={reason}
                onChange={setReason}
                options={LEAVE_REASONS.map((r) => ({ value: r, label: r }))}
              />
              <Button type="submit" className="w-full">
                Submit request
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <ul className="space-y-3">
        {leaves.map((lv) => (
          <li key={lv.id} className="rounded-xl border bg-white p-4 space-y-1">
            <div className="flex justify-between items-start gap-2">
              <p className="font-medium text-sm">{lv.reason}</p>
              <span
                className={cn(
                  'text-xs font-medium rounded-full px-2 py-0.5 capitalize',
                  lv.status === 'approved' && 'bg-emerald-100 text-emerald-800',
                  lv.status === 'pending' && 'bg-amber-100 text-amber-800',
                  lv.status === 'rejected' && 'bg-red-100 text-red-800'
                )}
              >
                {lv.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {lv.from} → {lv.to}
            </p>
          </li>
        ))}
      </ul>
    </PortalPage>
  );
}
