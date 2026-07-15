'use client';

import { CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { paymentProviderForCurrency, type PaymentMethodInput } from '@/lib/payment-utils';
import { TRIAL_DAYS } from '@/lib/pricing-data';

type Props = {
  currency: string;
  interval: 'monthly' | 'yearly';
  amount: number;
  value: PaymentMethodInput;
  onChange: (next: PaymentMethodInput) => void;
};

export function PaymentMethodForm({ currency, interval, amount, value, onChange }: Props) {
  const provider = paymentProviderForCurrency(currency);
  const providerLabel = provider === 'razorpay' ? 'Razorpay' : 'Stripe';

  function patch(partial: Partial<PaymentMethodInput>) {
    onChange({ ...value, ...partial });
  }

  function formatCardDisplay(raw: string) {
    const d = raw.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5">
        <div className="flex items-center justify-between">
          <CreditCard className="h-8 w-8 opacity-80" />
          <span className="text-xs uppercase tracking-wider opacity-70">{providerLabel} secure</span>
        </div>
        <p className="mt-6 text-lg font-mono tracking-widest">
          {value.cardNumber ? formatCardDisplay(value.cardNumber) : '•••• •••• •••• ••••'}
        </p>
        <div className="mt-4 flex justify-between text-sm opacity-90">
          <span>{value.cardholderName || 'NAME ON CARD'}</span>
          <span>
            {value.expMonth || 'MM'}/{value.expYear || 'YY'}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          {TRIAL_DAYS}-day free trial — card required
        </p>
        <p className="mt-2 text-emerald-800">
          <strong>No charge today.</strong> Your card is validated and saved securely. After {TRIAL_DAYS} days,
          <strong> {formatCurrency(amount, currency)}</strong> will be charged{' '}
          <strong>in advance</strong> every {interval === 'yearly' ? 'year' : 'month'} from this card unless you
          cancel in admin billing settings.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Name on card *</span>
        <input
          value={value.cardholderName}
          onChange={(e) => patch({ cardholderName: e.target.value })}
          autoComplete="cc-name"
          className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3"
          placeholder="As printed on card"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Debit or credit card number *</span>
        <input
          value={value.cardNumber}
          onChange={(e) => patch({ cardNumber: e.target.value.replace(/[^\d\s]/g, '') })}
          inputMode="numeric"
          autoComplete="cc-number"
          maxLength={19}
          className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 font-mono"
          placeholder="4111 1111 1111 1111"
        />
      </label>

      <div className="grid grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Expiry month *</span>
          <input
            value={value.expMonth}
            onChange={(e) => patch({ expMonth: e.target.value.replace(/\D/g, '').slice(0, 2) })}
            inputMode="numeric"
            autoComplete="cc-exp-month"
            maxLength={2}
            placeholder="MM"
            className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Expiry year *</span>
          <input
            value={value.expYear}
            onChange={(e) => patch({ expYear: e.target.value.replace(/\D/g, '').slice(0, 4) })}
            inputMode="numeric"
            autoComplete="cc-exp-year"
            maxLength={4}
            placeholder="YY"
            className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">CVV *</span>
          <input
            value={value.cvv}
            onChange={(e) => patch({ cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            placeholder="•••"
            className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3"
          />
        </label>
      </div>

      <p className="text-xs text-slate-500 flex items-start gap-2">
        <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        Card details are verified via {providerLabel}. We never store your full card number — only a secure token
        and last 4 digits.
      </p>
    </div>
  );
}
