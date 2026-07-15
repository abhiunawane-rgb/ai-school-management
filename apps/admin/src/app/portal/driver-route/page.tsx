'use client';

import { DEMO_DRIVER_ROUTE } from '@/lib/portal/demo-data';
import { PortalPage } from '@/components/portal/portal-page';

export default function PortalDriverRoutePage() {
  const r = DEMO_DRIVER_ROUTE;

  return (
    <PortalPage title="My route">
      <div className="rounded-xl border bg-white p-4 space-y-2">
        <h2 className="font-semibold text-slate-900">{r.name}</h2>
        <p className="text-sm text-slate-600">Vehicle {r.vehicle}</p>
      </div>
      <ol className="space-y-2">
        {r.stops.map((stop, i) => (
          <li key={stop} className="flex gap-3 rounded-xl border bg-white px-4 py-3 text-sm">
            <span className="font-bold text-brand-600">{i + 1}</span>
            <span>{stop}</span>
          </li>
        ))}
      </ol>
    </PortalPage>
  );
}
