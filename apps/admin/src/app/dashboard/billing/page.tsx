'use client';

import { useSchool } from '@/hooks/use-school';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function BillingPage() {
  const { state } = useSchool();
  if (!state) return null;

  const { school, invoices } = state;

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing & invoices</h1>
        <p className="text-slate-600 text-sm mt-1">Payment history and invoices for {school.name}.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>
            <span className="text-muted-foreground">Plan:</span> {school.planName}
          </p>
          <p>
            <span className="text-muted-foreground">Billing:</span> {school.billingInterval}
          </p>
          <p>
            <span className="text-muted-foreground">Status:</span>{' '}
            <span className="capitalize">{school.subscriptionStatus}</span>
          </p>
          <Button asChild variant="secondary" className="mt-3">
            <Link href="/dashboard/subscription">Manage subscription</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice history</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          ) : (
            <ul className="divide-y">
              {invoices.map((inv) => (
                <li key={inv.id} className="py-4 flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-medium">{inv.description}</p>
                    <p className="text-xs text-muted-foreground">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatMoney(inv.amount, inv.currency)}</p>
                    <p
                      className={`text-xs capitalize ${
                        inv.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                      }`}
                    >
                      {inv.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
