'use client';

import { useEffect } from 'react';
import { useSchool } from '@/hooks/use-school';
import { isAdminRole, getLoginUrl } from '@/lib/portal/role-config';
import { PortalShell } from '@/components/portal/portal-shell';
import { adminHref } from '@/lib/env';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { state, ready } = useSchool();

  useEffect(() => {
    if (!ready) return;
    if (!state) {
      window.location.href = getLoginUrl();
      return;
    }
    if (isAdminRole(state.currentUser.role)) {
      window.location.replace(adminHref('/dashboard'));
    }
  }, [ready, state]);

  if (!ready || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        Loading…
      </div>
    );
  }

  if (isAdminRole(state.currentUser.role)) return null;

  return <PortalShell>{children}</PortalShell>;
}
