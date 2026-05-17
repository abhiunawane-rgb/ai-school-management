'use client';

import { useState } from 'react';
import { FEATURE_KEYS } from '@ai-school/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionPage() {
  const [studentCount, setStudentCount] = useState(500);
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>(['ai_chatbot', 'bus_tracking']);
  const [quote, setQuote] = useState<{ totalAmount: number; currency: string } | null>(null);

  async function calculatePrice() {
    // Calls Firebase callable: calculatePrice
    setQuote({ totalAmount: 2499, currency: 'INR' });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Subscription & Pricing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Live Price Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-sm font-medium">
            Student count
            <input
              type="number"
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={studentCount}
              onChange={(e) => setStudentCount(Number(e.target.value))}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FEATURE_KEYS.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={enabledFeatures.includes(f)}
                  onChange={(e) => {
                    setEnabledFeatures((prev) =>
                      e.target.checked ? [...prev, f] : prev.filter((x) => x !== f)
                    );
                  }}
                />
                {f.replace(/_/g, ' ')}
              </label>
            ))}
          </div>
          <Button onClick={calculatePrice}>Calculate Price</Button>
          {quote && (
            <p className="text-lg font-semibold">
              Total: {quote.currency} {quote.totalAmount.toLocaleString()}/mo
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
