'use client';

import { useMemo, useState, useEffect } from 'react';
import type { FeatureKey } from '@ai-school/shared';
import { FEATURE_KEYS } from '@ai-school/shared';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import {
  PLANS,
  CURRENCIES,
  FEATURE_LABELS,
  getQuote,
  getAddonPrice,
  isFeatureIncluded,
  TRIAL_DAYS,
  APP_NAME,
  type CurrencyCode,
} from '@/lib/pricing-data';
import { Check, Sparkles, Info } from 'lucide-react';
import { PlanComparisonTable } from './plan-comparison-table';

export function PlanCalculator({ compact = false }: { compact?: boolean }) {
  const [planId, setPlanId] = useState('growth');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [students, setStudents] = useState(500);
  const [teachers, setTeachers] = useState(40);
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('yearly');
  const [addons, setAddons] = useState<FeatureKey[]>([]);

  const plan = PLANS.find((p) => p.id === planId)!;
  const optionalFeatures = FEATURE_KEYS.filter((f) => !isFeatureIncluded(planId, f));

  useEffect(() => {
    setAddons((prev) => prev.filter((f) => !isFeatureIncluded(planId, f)));
  }, [planId]);

  const quote = useMemo(
    () => getQuote(planId, currency, students, teachers, addons, interval),
    [planId, currency, students, teachers, addons, interval]
  );

  const signupHref = `/signup?plan=${planId}&currency=${currency}&students=${students}&teachers=${teachers}&interval=${interval}&addons=${addons.join(',')}`;

  return (
    <div className="space-y-12">
      <div className={cn('grid gap-8', compact ? '' : 'lg:grid-cols-5')}>
        <div className={cn('space-y-6', compact ? '' : 'lg:col-span-3')}>
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900 mb-3">Choose plan</legend>
            <p className="text-xs text-slate-500 mb-4">
              Each plan lists included features. Add-ons below are optional paid extras (minimum monthly charge
              applies).
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm"
                  aria-label="Select billing currency"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  Prices are set in INR and converted — same value, not a higher regional rate.
                </p>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Billing cycle</span>
                <select
                  value={interval}
                  onChange={(e) => setInterval(e.target.value as 'monthly' | 'yearly')}
                  className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 text-sm"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly (save 15%)</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
              {PLANS.map((p) => {
                const selected = planId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlanId(p.id)}
                    className={cn(
                      'relative rounded-2xl border-2 p-5 text-left transition-all w-full',
                      selected
                        ? 'border-brand-600 bg-brand-50 shadow-card-hover'
                        : 'border-slate-200 bg-white hover:border-brand-300'
                    )}
                  >
                    {p.id === 'growth' && (
                      <span className="absolute -top-2.5 left-4 rounded-full bg-accent-amber px-2 py-0.5 text-xs font-bold text-white">
                        Popular
                      </span>
                    )}
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold text-lg text-slate-900">{p.name}</p>
                      {selected && (
                        <span className="text-xs font-medium text-brand-600">Selected</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{p.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Included in {p.name}
                    </p>
                    <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                      {p.includedFeatures.map((f) => (
                        <li key={f} className="flex gap-2 text-sm text-slate-700">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            <span className="font-medium">{FEATURE_LABELS[f].label}</span>
                            <span className="text-slate-500"> — {FEATURE_LABELS[f].desc}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block">
            <span className="flex justify-between text-sm font-medium text-slate-700">
              <span>Students</span>
              <span className="text-brand-600 font-semibold tabular-nums">{students}</span>
            </span>
            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={students}
              onChange={(e) => setStudents(Number(e.target.value))}
              className="mt-2 w-full h-2 accent-brand-600"
            />
          </label>

          <label className="block">
            <span className="flex justify-between text-sm font-medium text-slate-700">
              <span>Teachers & staff</span>
              <span className="text-brand-600 font-semibold tabular-nums">{teachers}</span>
            </span>
            <input
              type="range"
              min={5}
              max={500}
              step={5}
              value={teachers}
              onChange={(e) => setTeachers(Number(e.target.value))}
              className="mt-2 w-full h-2 accent-brand-600"
            />
          </label>

          {optionalFeatures.length > 0 && (
            <fieldset>
              <legend className="text-sm font-semibold text-slate-900 mb-1">Add-on features (paid extra)</legend>
              <p className="text-xs text-slate-500 mb-3 flex items-start gap-1">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                Selecting an add-on adds its monthly charge to your estimate. Not included in your base plan.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {optionalFeatures.map((f) => {
                  const on = addons.includes(f);
                  const price = getAddonPrice(f, currency, planId);
                  const meta = FEATURE_LABELS[f];
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() =>
                        setAddons((prev) => (on ? prev.filter((x) => x !== f) : [...prev, f]))
                      }
                      className={cn(
                        'rounded-xl border-2 p-3 text-left text-sm min-h-[44px] transition-all',
                        on ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-200'
                      )}
                    >
                      <div className="flex gap-2">
                        <span
                          className={cn(
                            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                            on ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                          )}
                        >
                          {on && <Check className="h-3 w-3" />}
                        </span>
                        <span className="flex-1">
                          <span className="font-medium text-slate-900">{meta.label}</span>
                          <span className="block text-xs text-brand-700 font-semibold mt-0.5">
                            +{formatCurrency(price, currency)}/month
                          </span>
                          <span className="block text-xs text-slate-500 mt-1">{meta.desc}</span>
                          <span className="block text-xs text-slate-400 italic mt-0.5">
                            e.g. {meta.example}
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        </div>

        <div
          className={cn(
            'rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:sticky lg:top-24 h-fit',
            compact ? '' : 'lg:col-span-2'
          )}
        >
          <div className="flex items-center gap-2 text-brand-600">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold">Live estimate — {APP_NAME}</span>
          </div>
          <p className="mt-4 text-4xl font-bold text-slate-900 tabular-nums">
            {formatCurrency(quote.totalAmount, currency)}
            <span className="text-lg font-normal text-slate-500">
              /{interval === 'yearly' ? 'year' : 'month'}
            </span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {students} students · {teachers} staff · {plan.name} plan
            {addons.length > 0 && ` · ${addons.length} add-on(s)`}
          </p>

          <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4 max-h-48 overflow-y-auto">
            {quote.breakdown.map((item) => (
              <li key={item.label} className="flex justify-between text-sm gap-2">
                <span className="text-slate-600">{item.label}</span>
                <span className="font-medium tabular-nums shrink-0">
                  {formatCurrency(item.amount, currency)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
            <strong>{TRIAL_DAYS}-day free trial</strong> — not a demo call. You subscribe on your selected plan;
            after {TRIAL_DAYS} days billing starts automatically unless you cancel.
          </div>

          <Button href={signupHref} size="lg" className="mt-6 w-full">
            Start {TRIAL_DAYS}-day free trial
          </Button>
          <p className="mt-3 text-center text-xs text-slate-500">
            Payment method required · Cancel anytime before trial ends
          </p>
        </div>
      </div>

      {!compact && (
        <div>
          <h3 className="text-xl font-bold font-display text-slate-900 mb-4 text-center">
            Full feature comparison
          </h3>
          <PlanComparisonTable currency={currency} />
        </div>
      )}
    </div>
  );
}
