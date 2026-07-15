'use client';

import { DEMO_HOMEWORK } from '@/lib/portal/demo-data';
import { PortalPage } from '@/components/portal/portal-page';

export default function PortalHomeworkPage() {
  return (
    <PortalPage title="Homework">
      <ul className="space-y-3">
        {DEMO_HOMEWORK.map((hw) => (
          <li key={hw.title} className="rounded-xl border bg-white p-4 space-y-2">
            <div className="flex justify-between gap-2">
              <h2 className="font-semibold text-slate-900">{hw.title}</h2>
              <span className="text-xs text-brand-700 font-medium shrink-0">{hw.subject}</span>
            </div>
            <p className="text-sm text-slate-600">{hw.description}</p>
            <p className="text-xs text-slate-500">Due {hw.dueDate}</p>
          </li>
        ))}
      </ul>
    </PortalPage>
  );
}
