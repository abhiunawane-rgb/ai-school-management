'use client';

import { BookOpen } from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { PortalPage } from '@/components/portal/portal-page';

export default function PortalSyllabusPage() {
  const { state } = useSchool();
  if (!state) return null;
  const items = state.syllabus ?? [];

  return (
    <PortalPage title="Syllabus">
      <p className="text-sm text-slate-600 -mt-2 mb-4">Weekly units and chapter plans from your teachers.</p>
      <ul className="space-y-3">
        {items.map((unit) => (
          <li key={unit.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <BookOpen className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 space-y-1">
                <p className="font-semibold text-ink-900">{unit.title}</p>
                <p className="text-xs text-slate-500">
                  {unit.subject} · {unit.classSection} · {unit.weekLabel}
                </p>
                {unit.description ? <p className="text-sm text-slate-700">{unit.description}</p> : null}
                {unit.resources ? (
                  <p className="text-xs font-medium text-brand-800">Resources: {unit.resources}</p>
                ) : null}
                <p className="text-xs text-slate-400">{unit.teacher}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </PortalPage>
  );
}
