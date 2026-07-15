'use client';

import { useMemo } from 'react';
import { useSchool } from '@/hooks/use-school';
import { AiChatPanel } from '@/components/ai/ai-chat-panel';
import { PageHeader } from '@/components/ui/page-header';
import { buildSchoolAiSnapshot } from '@/lib/ai-context';
import { tryLiveAi } from '@/lib/try-live-ai';

export default function AiAssistantPage() {
  const { state } = useSchool();
  const snapshot = useMemo(() => (state ? buildSchoolAiSnapshot(state) : null), [state]);

  if (!state || !snapshot) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="AI assistant"
        description="Answers use your school's fees, attendance, homework, syllabus, notices, events, and transport data."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {snapshot.fees ? (
          <>
            <Stat label="Outstanding" value={formatInr(snapshot.fees.totalPending, snapshot.currency)} />
            <Stat label="Due this month" value={formatInr(snapshot.fees.dueThisMonth, snapshot.currency)} />
            <Stat
              label="Attendance today"
              value={
                snapshot.attendance
                  ? `${snapshot.attendance.present}/${snapshot.attendance.total} present`
                  : '—'
              }
            />
          </>
        ) : null}
      </div>

      <AiChatPanel
        snapshot={snapshot}
        subtitle={`${snapshot.schoolName} · admin view`}
        onLiveChat={(message) => tryLiveAi(state, message)}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="dash-panel px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink-900 tabular-nums">{value}</p>
    </div>
  );
}

function formatInr(amount: number, currency: string) {
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
