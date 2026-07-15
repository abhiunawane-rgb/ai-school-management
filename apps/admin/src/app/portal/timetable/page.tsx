'use client';

import { DEMO_TIMETABLE } from '@/lib/portal/demo-data';
import { PortalPage } from '@/components/portal/portal-page';

export default function PortalTimetablePage() {
  return (
    <PortalPage title="Timetable — Monday">
      <ul className="space-y-3">
        {DEMO_TIMETABLE.map((p) => (
          <li key={p.period} className="rounded-xl border bg-white p-4 flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 font-bold text-sm">
              P{p.period}
            </span>
            <div>
              <p className="font-semibold text-slate-900">{p.subject}</p>
              <p className="text-sm text-slate-600">{p.teacher}</p>
              <p className="text-xs text-slate-500">Room {p.room}</p>
            </div>
          </li>
        ))}
      </ul>
    </PortalPage>
  );
}
