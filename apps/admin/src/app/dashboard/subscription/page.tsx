'use client';

import { useSchool } from '@/hooks/use-school';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatCardBrand } from '@/lib/billing-utils';
import { getMarketingUrl } from '@/lib/env';

import { RequireSchoolAdmin } from '@/components/dashboard/require-school-admin';

export default function SubscriptionPage() {
  const { state } = useSchool();
  if (!state) return null;

  const { school } = state;
  const trialEnd = new Date(school.trialEndsAt).toLocaleDateString();
  const nextBill = school.nextBillingDate
    ? new Date(school.nextBillingDate).toLocaleDateString()
    : trialEnd;
  const pm = school.paymentMethod;
  const marketingUrl = getMarketingUrl();

  return (
    <RequireSchoolAdmin>
    <div className="max-w-3xl space-y-6">
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
          {pm && (
            <p className="rounded-lg bg-slate-50 border p-3 text-slate-800">
              <strong>Payment method on file:</strong> {formatCardBrand(pm.brand)} •••• {pm.last4} (exp{' '}
              {String(pm.expMonth).padStart(2, '0')}/{pm.expYear}) · via{' '}
              {pm.provider === 'razorpay' ? 'Razorpay' : 'Stripe'}
            </p>
          )}
          {school.subscriptionStatus === 'trial' && (
            <p className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-900">
              Free trial ends <strong>{trialEnd}</strong>. First charge (in advance) on{' '}
              <strong>{nextBill}</strong> unless you cancel. Auto-renew:{' '}
              {school.autoRenew !== false ? 'On' : 'Off'}.
            </p>
          )}
          <p className="text-muted-foreground">
            Billing cycle: <strong className="capitalize">{school.billingInterval}</strong> — charged in advance
            each period from your saved card.
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
            <a href={`${marketingUrl}/pricing`} target="_blank" rel="noopener noreferrer">
              Open pricing calculator
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
    </RequireSchoolAdmin>
  );
}
