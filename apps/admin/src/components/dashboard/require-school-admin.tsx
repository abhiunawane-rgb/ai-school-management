'use client';

import { useEffect } from 'react';
import { useSchool } from '@/hooks/use-school';
import { canAccessBilling } from '@/lib/role-access';
import { adminHref } from '@/lib/env';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function RequireSchoolAdmin({ children }: { children: React.ReactNode }) {
  const { state } = useSchool();

  useEffect(() => {
    if (state && !canAccessBilling(state.currentUser.role)) {
      window.location.replace(adminHref('/dashboard'));
    }
  }, [state]);

  if (!state) return null;

  if (!canAccessBilling(state.currentUser.role)) {
    return (
      <Card className="border-amber-200 bg-amber-50 max-w-lg">
        <CardContent className="pt-6 space-y-3 text-sm text-amber-900">
          <p className="font-medium">Principal access only</p>
          <p>
            Subscription and platform billing are managed by the school principal (School Admin).
            Sub Admins can use all other dashboard features.
          </p>
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard">Back to overview</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
