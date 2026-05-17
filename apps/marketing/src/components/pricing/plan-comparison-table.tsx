'use client';

import { FEATURE_KEYS } from '@ai-school/shared';
import { PLANS, FEATURE_LABELS, getAddonPrice, APP_NAME, TRIAL_DAYS } from '@/lib/pricing-data';
import { formatCurrency } from '@/lib/utils';
import { Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PlanComparisonTable({ currency = 'INR' }: { currency?: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="w-full min-w-[800px] text-left text-sm">
        <caption className="sr-only">Full feature comparison for {APP_NAME} plans</caption>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th scope="col" className="p-4 font-semibold text-slate-900 w-[28%]">
              Feature
            </th>
            {PLANS.map((p) => (
              <th key={p.id} scope="col" className="p-4 font-semibold text-slate-900 text-center">
                <span className="block">{p.name}</span>
                <span className="block text-xs font-normal text-slate-500 mt-1">{p.description}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FEATURE_KEYS.map((feature) => (
            <tr key={feature} className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="p-4 align-top">
                <span className="font-medium text-slate-900">{FEATURE_LABELS[feature].label}</span>
                <p className="text-xs text-slate-600 mt-0.5">{FEATURE_LABELS[feature].desc}</p>
                <p className="text-xs text-slate-400 mt-1 italic">e.g. {FEATURE_LABELS[feature].example}</p>
              </td>
              {PLANS.map((plan) => {
                const included = plan.includedFeatures.includes(feature);
                const addonPrice = getAddonPrice(feature, currency, plan.id);
                return (
                  <td key={plan.id} className="p-4 text-center align-top">
                    {included ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="h-4 w-4" aria-hidden />
                        Included
                      </span>
                    ) : (
                      <span className="block text-slate-600">
                        <Minus className="h-4 w-4 mx-auto text-slate-300 mb-1" aria-hidden />
                        <span className="text-xs">Add-on</span>
                        <span className="block text-brand-700 font-semibold text-sm mt-0.5">
                          +{formatCurrency(addonPrice, currency)}/mo
                        </span>
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 border-t border-slate-200 flex flex-wrap gap-3 justify-center">
        <Button href="/signup">Start {TRIAL_DAYS}-day free trial</Button>
        <Button href="/pricing#calculator" variant="secondary">
          Open calculator
        </Button>
      </div>
    </div>
  );
}
