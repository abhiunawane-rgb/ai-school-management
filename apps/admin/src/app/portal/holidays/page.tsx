'use client';

import { DEMO_HOLIDAYS } from '@/lib/portal/demo-data';
import { PortalPage } from '@/components/portal/portal-page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PortalHolidaysPage() {
  const upcoming = DEMO_HOLIDAYS.filter((h) => h.date >= new Date().toISOString().slice(0, 10));

  return (
    <PortalPage title="Holiday calendar">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming holidays</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {upcoming.map((h) => (
              <li key={h.date} className="flex justify-between items-center text-sm border-b pb-2">
                <span className="font-medium">{h.title}</span>
                <span className="text-slate-500">{h.date}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <ul className="space-y-2">
        {DEMO_HOLIDAYS.map((h) => (
          <li key={h.date} className="rounded-xl border bg-white px-4 py-3 text-sm flex justify-between">
            <span>{h.title}</span>
            <span className="text-slate-500">{h.date}</span>
          </li>
        ))}
      </ul>
    </PortalPage>
  );
}
