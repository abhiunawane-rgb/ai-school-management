'use client';

import { useSchool } from '@/hooks/use-school';
import { PortalPage } from '@/components/portal/portal-page';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export default function PortalSchoolProfilePage() {
  const { state } = useSchool();
  if (!state) return null;

  const { school } = state;

  return (
    <PortalPage title="School profile">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-4">
            {school.logoUrl ? (
              <img src={school.logoUrl} alt="" className="h-16 w-16 rounded-xl object-contain border" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-600 text-white">
                <GraduationCap className="h-8 w-8" />
              </span>
            )}
            <div>
              <h2 className="font-display text-lg font-semibold">{school.name}</h2>
              <p className="text-sm text-slate-600">{school.board}</p>
            </div>
          </div>
          <dl className="grid gap-3 text-sm">
            {[
              ['Principal', school.principalName],
              ['Address', `${school.address}, ${school.city}`],
              ['Phone', school.phone],
              ['Email', school.email],
              ['Website', school.website],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-slate-500 text-xs">{k}</dt>
                <dd className="font-medium text-slate-900">{v || '—'}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </PortalPage>
  );
}
