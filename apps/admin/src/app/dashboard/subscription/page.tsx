'use client';

import { useSchool } from '@/hooks/use-school';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SubscriptionPage() {
  const { state } = useSchool();
  if (!state) return null;

  const { school } = state;
  const trialEnd = new Date(school.trialEndsAt).toLocaleDateString();
  const estimated = school.currency === 'INR' ? '₹2,499' : '$49';

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Subscription</h1>
        <p className="text-slate-600 text-sm mt-1">Your plan, trial, and enabled modules.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid sm:grid-cols-2 gap-3">
            <p>
              <span className="text-muted-foreground block">Plan</span>
              <span className="font-semibold text-lg">{school.planName}</span>
            </p>
            <p>
              <span className="text-muted-foreground block">Status</span>
              <span className="font-semibold capitalize">{school.subscriptionStatus}</span>
            </p>
            <p>
              <span className="text-muted-foreground block">Billing cycle</span>
              <span className="font-medium capitalize">{school.billingInterval}</span>
            </p>
            <p>
              <span className="text-muted-foreground block">Currency</span>
              <span className="font-medium">{school.currency}</span>
            </p>
            <p>
              <span className="text-muted-foreground block">Students</span>
              <span className="font-medium">{school.studentCount}</span>
            </p>
            <p>
              <span className="text-muted-foreground block">Staff</span>
              <span className="font-medium">{school.teacherCount}</span>
            </p>
          </div>
          {school.subscriptionStatus === 'trial' && (
            <p className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-900">
              Free trial ends on <strong>{trialEnd}</strong>. Billing starts automatically after trial unless
              you cancel.
            </p>
          )}
          <p className="text-muted-foreground">
            Estimated cost after trial: <strong>{estimated}</strong> / {school.billingInterval === 'yearly' ? 'year' : 'month'}
          </p>
          <Button asChild variant="secondary">
            <Link href="/dashboard/billing">View invoices</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade or change plan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>To change your plan or add modules, use the marketing site calculator or contact support.</p>
          <Button asChild>
            <a href="http://localhost:3002/pricing" target="_blank" rel="noopener noreferrer">
              Open pricing calculator
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
