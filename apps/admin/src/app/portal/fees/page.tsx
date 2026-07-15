'use client';

import { DEMO_PARENT_FEES } from '@/lib/portal/demo-data';
import { PortalPage } from '@/components/portal/portal-page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PortalFeesPage() {
  const f = DEMO_PARENT_FEES;

  return (
    <PortalPage title="Fees & pay">
      <Card>
        <CardHeader>
          <CardTitle>{f.studentName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold">₹{f.total.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-700">₹{f.paid.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Paid</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-700">₹{f.pending.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => alert('Online payment (Razorpay/Stripe) will connect when Firebase is live.')}
          >
            Pay pending balance
          </Button>
        </CardContent>
      </Card>
    </PortalPage>
  );
}
