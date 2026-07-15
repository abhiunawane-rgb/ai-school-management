'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { useSchool } from '@/hooks/use-school';
import { isAdminRole, getLoginUrl } from '@/lib/portal/role-config';
import { canAccessBilling, isBillingRoute } from '@/lib/role-access';
import { adminHref } from '@/lib/env';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, ready } = useSchool();

  useEffect(() => {
    if (!ready) return;
    if (!state) {
      window.location.href = getLoginUrl();
      return;
    }
    if (!isAdminRole(state.currentUser.role)) {
      window.location.replace(adminHref('/portal'));
      return;
    }
    if (isBillingRoute(pathname) && !canAccessBilling(state.currentUser.role)) {
      window.location.replace(adminHref('/dashboard'));
    }
  }, [ready, state, pathname]);

  if (!ready || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        Loading dashboard…
      </div>
    );
  }

  if (!isAdminRole(state.currentUser.role)) return null;

  return <DashboardShell>{children}</DashboardShell>;
}
