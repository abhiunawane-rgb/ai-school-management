'use client';

import { Fragment, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { schoolFeeSummary, studentFeeTotals } from '@/lib/fees-utils';
import { addStudentFeeAccount, recordFeePayment } from '@/lib/school-store';
import type { StudentFeeStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select-field';
import {
  DUE_IN_DAYS,
  FEE_AMOUNTS_INR,
  FEE_LABELS,
  PAYMENT_MODES,
  dueDateFromDays,
  getClassSectionOptions,
} from '@/lib/school-options';
import { cn } from '@/lib/utils';

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
      amount
    );
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

const STATUS_LABEL: Record<StudentFeeStatus, string> = {
  paid: 'Paid',
  partial: 'Partial',
  pending: 'Pending',
  overdue: 'Overdue',
};

const STATUS_CLASS: Record<StudentFeeStatus, string> = {
  paid: 'bg-emerald-100 text-emerald-800',
  partial: 'bg-amber-100 text-amber-800',
  pending: 'bg-slate-100 text-slate-700',
  overdue: 'bg-red-100 text-red-800',
};

type Filter = 'all' | StudentFeeStatus;

export default function FeesPage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [payStudentId, setPayStudentId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState<'cash' | 'upi' | 'card' | 'bank'>('upi');
  const [payRef, setPayRef] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentName: '',
    classSection: '8-A',
    parentName: '',
    parentPhone: '',
    feeLabel: FEE_LABELS[0] as string,
    feeAmount: String(FEE_AMOUNTS_INR[4]),
    dueInDays: '30',
  });

  const classOptions = useMemo(() => getClassSectionOptions(), []);

  const summary = useMemo(
    () => (state ? schoolFeeSummary(state.studentFees) : null),
    [state]
  );

  const rows = useMemo(() => {
    if (!state) return [];
    return state.studentFees
      .map((account) => ({ account, ...studentFeeTotals(account) }))
      .filter(({ account, status }) => {
        if (filter !== 'all' && status !== filter) return false;
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          account.studentName.toLowerCase().includes(q) ||
          account.classSection.toLowerCase().includes(q) ||
          account.parentName.toLowerCase().includes(q)
        );
      });
  }, [state, filter, search]);

  if (!state || !summary) return null;
  const schoolState = state;

  const currency = schoolState.school.currency;

  function handleRecordPayment(studentId: string, maxPending: number) {
    const amount = Number(payAmount);
    if (!amount || amount <= 0) return;
    if (amount > maxPending) {
      notify.error(
        'Amount too high',
        `Payment cannot exceed pending balance of ${formatMoney(maxPending, currency)}.`,
        'Enter an amount up to the pending balance.'
      );
      return;
    }
    update(
      recordFeePayment(schoolState, studentId, {
        date: new Date().toISOString().slice(0, 10),
        amount,
        mode: payMode,
        reference: payRef || undefined,
      })
    );
    notify.success(
      'Payment recorded',
      `${formatMoney(amount, currency)} received via ${payMode.toUpperCase()}.`,
      'Receipt is visible to parents in the fees section.'
    );
    setPayStudentId(null);
    setPayAmount('');
    setPayRef('');
  }

  function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(newStudent.feeAmount);
    if (!newStudent.studentName || !amount) {
      notify.error('Missing details', 'Student name and fee amount are required.', 'Complete all required fields.');
      return;
    }
    const due = dueDateFromDays(Number(newStudent.dueInDays) || 30);
    update(
      addStudentFeeAccount(schoolState, {
        studentName: newStudent.studentName,
        classSection: newStudent.classSection || '—',
        parentName: newStudent.parentName,
        parentPhone: newStudent.parentPhone,
        lineItems: [
          {
            id: `li_${Date.now()}`,
            label: newStudent.feeLabel,
            amount,
            dueDate: due,
          },
        ],
      })
    );
    notify.success(
      'Student added',
      `${newStudent.studentName} was added to the fees register.`,
      'You can record payments from their fee row.'
    );
    setShowAdd(false);
    setNewStudent({
      studentName: '',
      classSection: '8-A',
      parentName: '',
      parentPhone: '',
      feeLabel: FEE_LABELS[0],
      feeAmount: String(FEE_AMOUNTS_INR[4]),
      dueInDays: '30',
    });
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Fees management</h1>
        <p className="text-slate-600 text-sm mt-1">
          Track total fees, amounts paid, and pending balance for each student.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total fees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatMoney(summary.totalFees, currency)}</p>
            <p className="text-xs text-muted-foreground mt-1">Assigned to {summary.studentCount} students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-700">
              {formatMoney(summary.totalPaid, currency)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.paidCount} fully paid · {summary.partialCount} partial
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-700">
              {formatMoney(summary.totalPending, currency)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.pendingCount} students with balance due
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Student fee ledger</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => setShowAdd((v) => !v)}>
              {showAdd ? 'Cancel' : 'Add student'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAdd && (
            <form
              onSubmit={handleAddStudent}
              className="grid gap-3 sm:grid-cols-2 p-4 rounded-xl bg-slate-50 border border-slate-200"
            >
              <label className="text-sm">
                <span className="font-medium">Student name *</span>
                <Input
                  className="mt-1"
                  value={newStudent.studentName}
                  onChange={(e) => setNewStudent((s) => ({ ...s, studentName: e.target.value }))}
                  required
                />
              </label>
              <SelectField
                id="fee-class"
                label="Class"
                required
                value={newStudent.classSection}
                onChange={(classSection) => setNewStudent((s) => ({ ...s, classSection }))}
                options={classOptions}
              />
              <label className="text-sm">
                <span className="font-medium">Parent name</span>
                <Input
                  className="mt-1"
                  value={newStudent.parentName}
                  onChange={(e) => setNewStudent((s) => ({ ...s, parentName: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <span className="font-medium">Parent phone</span>
                <Input
                  className="mt-1"
                  type="tel"
                  value={newStudent.parentPhone}
                  onChange={(e) => setNewStudent((s) => ({ ...s, parentPhone: e.target.value }))}
                />
              </label>
              <SelectField
                id="fee-label"
                label="Fee type"
                required
                value={newStudent.feeLabel}
                onChange={(feeLabel) => setNewStudent((s) => ({ ...s, feeLabel }))}
                options={FEE_LABELS.map((l) => ({ value: l, label: l }))}
              />
              <SelectField
                id="fee-amount"
                label={`Amount (${currency})`}
                required
                value={newStudent.feeAmount}
                onChange={(feeAmount) => setNewStudent((s) => ({ ...s, feeAmount }))}
                options={FEE_AMOUNTS_INR.map((a) => ({
                  value: String(a),
                  label: formatMoney(a, currency),
                }))}
              />
              <SelectField
                id="fee-due"
                label="Due date"
                required
                value={newStudent.dueInDays}
                onChange={(dueInDays) => setNewStudent((s) => ({ ...s, dueInDays }))}
                options={DUE_IN_DAYS.map((d) => ({ value: d.value, label: d.label }))}
                className="sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <Button type="submit">Save student fees</Button>
              </div>
            </form>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search student, class, or parent…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              {(['all', 'paid', 'partial', 'pending', 'overdue'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    filter === key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  )}
                >
                  {key === 'all' ? 'All' : STATUS_LABEL[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Student</th>
                  <th className="py-3 pr-4 font-medium">Class</th>
                  <th className="py-3 pr-4 font-medium text-right">Total</th>
                  <th className="py-3 pr-4 font-medium text-right">Paid</th>
                  <th className="py-3 pr-4 font-medium text-right">Pending</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No students match this filter.
                    </td>
                  </tr>
                ) : (
                  rows.map(({ account, totalFees, totalPaid, pending, status }) => (
                    <Fragment key={account.id}>
                      <tr className="border-b hover:bg-slate-50/80">
                        <td className="py-3 pr-4 font-medium">{account.studentName}</td>
                        <td className="py-3 pr-4">{account.classSection}</td>
                        <td className="py-3 pr-4 text-right">{formatMoney(totalFees, currency)}</td>
                        <td className="py-3 pr-4 text-right text-emerald-700">
                          {formatMoney(totalPaid, currency)}
                        </td>
                        <td className="py-3 pr-4 text-right text-amber-700">
                          {formatMoney(pending, currency)}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={cn(
                              'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                              STATUS_CLASS[status]
                            )}
                          >
                            {STATUS_LABEL[status]}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                setExpandedId(expandedId === account.id ? null : account.id)
                              }
                            >
                              {expandedId === account.id ? 'Hide' : 'Details'}
                            </Button>
                            {pending > 0 && (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  setPayStudentId(account.id);
                                  setPayAmount(String(pending));
                                  setExpandedId(account.id);
                                }}
                              >
                                Record payment
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedId === account.id && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={7} className="py-4 px-2">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                  Fee breakdown
                                </p>
                                <ul className="space-y-2">
                                  {account.lineItems.map((item) => (
                                    <li
                                      key={item.id}
                                      className="flex justify-between text-sm border-b border-slate-200 pb-2"
                                    >
                                      <span>
                                        {item.label}
                                        <span className="block text-xs text-muted-foreground">
                                          Due {item.dueDate}
                                        </span>
                                      </span>
                                      <span className="font-medium">
                                        {formatMoney(item.amount, currency)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                <p className="text-sm mt-2 text-muted-foreground">
                                  Parent: {account.parentName} · {account.parentPhone}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                  Payment history
                                </p>
                                {account.payments.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No payments yet.</p>
                                ) : (
                                  <ul className="space-y-2">
                                    {account.payments.map((p) => (
                                      <li
                                        key={p.id}
                                        className="flex justify-between text-sm border-b border-slate-200 pb-2"
                                      >
                                        <span>
                                          {p.date} · {p.mode.toUpperCase()}
                                          {p.reference && (
                                            <span className="block text-xs text-muted-foreground">
                                              {p.reference}
                                            </span>
                                          )}
                                        </span>
                                        <span className="font-medium text-emerald-700">
                                          {formatMoney(p.amount, currency)}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {payStudentId === account.id && (
                                  <div className="mt-4 p-3 rounded-lg border border-blue-200 bg-blue-50/50 space-y-2">
                                    <p className="text-sm font-medium">Record payment</p>
                                    <div className="flex flex-wrap gap-2 items-end">
                                      <SelectField
                                        id={`pay-amount-${account.id}`}
                                        label="Amount"
                                        value={payAmount}
                                        onChange={setPayAmount}
                                        className="w-40"
                                        options={[
                                          { value: String(pending), label: `Full — ${formatMoney(pending, currency)}` },
                                          ...FEE_AMOUNTS_INR.filter((a) => a < pending)
                                            .slice(-3)
                                            .map((a) => ({
                                              value: String(a),
                                              label: formatMoney(a, currency),
                                            })),
                                        ]}
                                      />
                                      <SelectField
                                        id={`pay-mode-${account.id}`}
                                        label="Payment mode"
                                        value={payMode}
                                        onChange={(v) => setPayMode(v as typeof payMode)}
                                        className="w-36"
                                        options={[...PAYMENT_MODES]}
                                      />
                                      <Input
                                        placeholder="Reference (optional)"
                                        value={payRef}
                                        onChange={(e) => setPayRef(e.target.value)}
                                        className="flex-1 min-w-[120px]"
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleRecordPayment(account.id, pending)}
                                      >
                                        Save payment
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setPayStudentId(null)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        <strong>Preferred flow:</strong> Assign fee heads per student → parents pay online or at office →
        staff records payment → pending updates automatically. In production this syncs with Firebase and
        parent mobile app.{' '}
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
