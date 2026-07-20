'use client';

import { useState, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FEATURE_KEYS, type FeatureKey, BOARDS, CITIES } from '@ai-school/shared';
import {
  getQuote,
  PLANS,
  CURRENCIES,
  FEATURE_LABELS,
  getAddonPrice,
  isFeatureIncluded,
  TRIAL_DAYS,
  APP_NAME,
  type CurrencyCode,
} from '@/lib/pricing-data';
import { formatCurrency, cn } from '@/lib/utils';
import { Check, Loader2, ArrowLeft, ArrowRight, Upload, AlertCircle } from 'lucide-react';
import { PaymentMethodForm } from './payment-method-form';
import {
  validatePaymentMethod,
  tokenizePaymentMethod,
  type PaymentMethodInput,
} from '@/lib/payment-utils';
import { useNotify } from '@/components/notifications/notification-provider';
import { SelectField } from '@/components/ui/select-field';
import { registerPhoneAccount } from '@/lib/auth-session';
import { getMarketingUrl } from '@/lib/site-urls';

const STEPS = ['School profile', 'Size', 'Plan', 'Subscription', 'Payment', 'Admin', 'Done'] as const;

export function SignupWizard() {
  const notify = useNotify();
  const params = useSearchParams();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [city, setCity] = useState<string>(CITIES[0]);
  const [board, setBoard] = useState<string>(BOARDS[0]);
  const [schoolWebsite, setSchoolWebsite] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  const [currency, setCurrency] = useState<CurrencyCode>(
    (params.get('currency') as CurrencyCode) ?? 'INR'
  );
  const [students, setStudents] = useState(Number(params.get('students')) || 300);
  const [teachers, setTeachers] = useState(Number(params.get('teachers')) || 25);
  const [planId, setPlanId] = useState(params.get('plan') ?? 'growth');
  const [interval, setInterval] = useState<'monthly' | 'yearly'>(
    (params.get('interval') as 'monthly' | 'yearly') ?? 'yearly'
  );
  const [addons, setAddons] = useState<FeatureKey[]>(
    (params.get('addons')?.split(',').filter(Boolean) as FeatureKey[]) ?? []
  );

  const [adminName, setAdminName] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedAutoRenew, setAcceptedAutoRenew] = useState(false);
  const [savedLocally, setSavedLocally] = useState(false);
  const [paymentInput, setPaymentInput] = useState<PaymentMethodInput>({
    cardholderName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
  });
  const [paymentSaved, setPaymentSaved] = useState<{ last4: string; brand: string } | null>(null);

  const plan = PLANS.find((p) => p.id === planId)!;
  const optionalFeatures = FEATURE_KEYS.filter((f) => !isFeatureIncluded(planId, f));

  const quote = useMemo(
    () => getQuote(planId, currency, students, teachers, addons, interval),
    [planId, currency, students, teachers, addons, interval]
  );

  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be under 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      setLogoBase64(result);
      setError('');
    };
    reader.readAsDataURL(file);
  }

  function validateAndTokenizePayment() {
    const err = validatePaymentMethod(paymentInput);
    if (err) {
      setError(err);
      return null;
    }
    return tokenizePaymentMethod(paymentInput, currency);
  }

  async function submit() {
    if (!acceptedTerms || !acceptedAutoRenew) {
      notify.error('Terms required', 'Accept trial and subscription terms to continue.', 'Check both agreement boxes.');
      return;
    }
    const paymentMethod = validateAndTokenizePayment();
    if (!paymentMethod) return;

    setLoading(true);
    setError('');
    const payload = {
      schoolName,
      schoolAddress,
      city,
      board,
      schoolWebsite,
      logoBase64,
      currency,
      countryCode: quote.countryCode,
      students,
      teachers,
      planId,
      interval,
      addons,
      adminName,
      principalName,
      phone,
      email,
      estimatedTotal: quote.totalAmount,
      trialDays: TRIAL_DAYS,
      acceptedTerms,
      acceptedAutoRenew: true,
      paymentMethod,
    };

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Signup failed');
      registerPhoneAccount({
        id: `user_signup_${phone.replace(/\D/g, '').slice(-10)}`,
        name: adminName,
        phone,
        role: 'school_admin',
      });
      localStorage.setItem('aischool_signup_pending', JSON.stringify(payload));
      setSavedLocally(false);
      setPaymentSaved(data.paymentMethod ?? { last4: paymentMethod.last4, brand: paymentMethod.brand });
      setStep(6);
      notify.success(
        'Trial started',
        `${schoolName} is registered. Your ${TRIAL_DAYS}-day trial is active.`,
        'Sign in with your mobile number to open the dashboard.'
      );
      if (data.checkoutUrl && typeof window !== 'undefined') {
        sessionStorage.setItem('aischool_signup_id', data.leadId ?? '');
      }
    } catch (e) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('aischool_signup_pending', JSON.stringify(payload));
        registerPhoneAccount({
          id: `user_signup_${phone.replace(/\D/g, '').slice(-10)}`,
          name: adminName,
          phone,
          role: 'school_admin',
        });
        setSavedLocally(true);
        setPaymentSaved({ last4: paymentMethod.last4, brand: paymentMethod.brand });
        setStep(6);
        notify.warning(
          'Saved on this device',
          `${schoolName} registration is stored locally.`,
          'Use the same browser to sign in. Connect the server for cloud sync.'
        );
        setError('');
        return;
      }
      notify.error(
        'Registration failed',
        e instanceof Error ? e.message : 'Could not complete signup.',
        'Check your details and try again, or contact support.'
      );
      setError(e instanceof Error ? e.message : 'Error saving signup');
    } finally {
      setLoading(false);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const marketingUrl = getMarketingUrl();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
        <strong>{APP_NAME}</strong> — {TRIAL_DAYS}-day free trial. Add a valid debit/credit card now (no charge today).
        After {TRIAL_DAYS} days, your plan amount is charged <strong>in advance</strong> every month or year from the
        same card unless you cancel in admin billing.
      </div>

      <div className="mb-8" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="flex justify-between text-xs font-medium text-slate-600 mb-2 gap-1">
          {STEPS.map((s, i) => (
            <span key={s} className={cn(i <= step && 'text-brand-600', 'truncate')}>
              {s}
            </span>
          ))}
        </div>
        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
          <motion.div
            className="h-full bg-brand-600 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card"
        >
          {step === 0 && (
            <>
              <h2 className="text-xl font-semibold">School profile</h2>
              <p className="mt-1 text-sm text-slate-500">
                Sets up your school on {APP_NAME} including logo on profile
              </p>
              <label className="block mt-6">
                <span className="text-sm font-medium">School name *</span>
                <input
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3"
                />
              </label>
              <div className="mt-4">
                <span className="text-sm font-medium">School logo (profile picture)</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={onLogoChange}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 w-full hover:bg-slate-50 min-h-[44px]"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" width={48} height={48} className="rounded-lg object-contain h-12 w-12" />
                  ) : (
                    <Upload className="h-8 w-8 text-slate-400" />
                  )}
                  <span className="text-sm text-slate-600">PNG/JPG up to 2 MB</span>
                </button>
              </div>
              <label className="block mt-4">
                <span className="text-sm font-medium">Address</span>
                <input
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <SelectField
                  id="signup-city"
                  label="City"
                  value={city}
                  onChange={setCity}
                  options={CITIES.map((c) => ({ value: c, label: c }))}
                />
                <SelectField
                  id="signup-board"
                  label="Board / curriculum"
                  value={board}
                  onChange={setBoard}
                  options={BOARDS.map((b) => ({ value: b, label: b }))}
                />
              </div>
              <label className="block mt-4">
                <span className="text-sm font-medium">School website (optional)</span>
                <input
                  value={schoolWebsite}
                  onChange={(e) => setSchoolWebsite(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3"
                />
              </label>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold">School size</h2>
              <p className="mt-1 text-sm text-slate-500">Used to calculate your subscription price</p>
              <label className="block mt-6">
                <span className="flex justify-between text-sm font-medium">
                  Students <span className="text-brand-600">{students}</span>
                </span>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={students}
                  onChange={(e) => setStudents(Number(e.target.value))}
                  className="mt-2 w-full accent-brand-600"
                />
              </label>
              <label className="block mt-4">
                <span className="flex justify-between text-sm font-medium">
                  Teachers & staff <span className="text-brand-600">{teachers}</span>
                </span>
                <input
                  type="range"
                  min={5}
                  max={500}
                  step={5}
                  value={teachers}
                  onChange={(e) => setTeachers(Number(e.target.value))}
                  className="mt-2 w-full accent-brand-600"
                />
              </label>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold">Plan & add-ons</h2>
              <p className="mt-1 text-sm text-slate-500">
                Estimate:{' '}
                <strong>
                  {formatCurrency(quote.totalAmount, currency)}/{interval === 'yearly' ? 'yr' : 'mo'}
                </strong>
              </p>
              <label className="block mt-4">
                <span className="text-sm font-medium">Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="mt-1 w-full h-11 rounded-xl border px-3"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPlanId(p.id);
                      setAddons((prev) => prev.filter((f) => !isFeatureIncluded(p.id, f)));
                    }}
                    className={cn(
                      'w-full rounded-xl border-2 p-4 text-left',
                      planId === p.id ? 'border-brand-600 bg-brand-50' : 'border-slate-200'
                    )}
                  >
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                    <p className="text-xs font-medium text-slate-700 mt-2">Included:</p>
                    <ul className="mt-1 space-y-1">
                      {p.includedFeatures.map((f) => (
                        <li key={f} className="text-xs text-slate-600 flex gap-1">
                          <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                          {FEATURE_LABELS[f].label} — {FEATURE_LABELS[f].desc}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              {optionalFeatures.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Paid add-ons (optional)</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {optionalFeatures.map((f) => {
                      const on = addons.includes(f);
                      const price = getAddonPrice(f, currency, planId);
                      return (
                        <label
                          key={f}
                          className={cn(
                            'flex gap-2 p-2 rounded-lg border cursor-pointer text-sm',
                            on ? 'border-brand-400 bg-brand-50' : 'border-slate-200'
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() =>
                              setAddons((prev) =>
                                on ? prev.filter((x) => x !== f) : [...prev, f]
                              )
                            }
                            className="mt-1"
                          />
                          <span>
                            <span className="font-medium">{FEATURE_LABELS[f].label}</span>
                            <span className="text-brand-700 font-semibold"> +{formatCurrency(price, currency)}/mo</span>
                            <span className="block text-xs text-slate-500">{FEATURE_LABELS[f].example}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
              <label className="block mt-4">
                <span className="text-sm font-medium">Billing cycle</span>
                <select
                  value={interval}
                  onChange={(e) => setInterval(e.target.value as 'monthly' | 'yearly')}
                  className="mt-1 w-full h-11 rounded-xl border px-3"
                >
                  <option value="yearly">Yearly (save 20%)</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold">Subscription terms</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700 rounded-xl bg-slate-50 p-4 border">
                <p>
                  <strong>Plan:</strong> {plan.name} · {formatCurrency(quote.totalAmount, currency)}/
                  {interval === 'yearly' ? 'year' : 'month'}
                </p>
                <p>
                  <strong>Trial:</strong> {TRIAL_DAYS} days free on your selected plan. This is a real subscription
                  trial — we do not offer separate demo accounts.
                </p>
                <p>
                  <strong>Payment:</strong> Debit or credit card required on the next step. No charge during trial.
                </p>
                <p>
                  <strong>After trial:</strong> {formatCurrency(quote.totalAmount, currency)} charged in advance on
                  day {TRIAL_DAYS + 1}, then each {interval === 'yearly' ? 'year' : 'month'} until canceled.
                </p>
              </div>
              <label className="flex gap-2 mt-4 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1"
                />
                I agree to the{' '}
                <a href="/terms" className="text-brand-600 underline" target="_blank">
                  Terms
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-brand-600 underline" target="_blank">
                  Privacy Policy
                </a>
              </label>
              <label className="flex gap-2 mt-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedAutoRenew}
                  onChange={(e) => setAcceptedAutoRenew(e.target.checked)}
                  className="mt-1"
                />
                I understand that after the {TRIAL_DAYS}-day trial, my subscription renews automatically at the
                quoted price until I cancel.
              </label>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-xl font-semibold">Payment method</h2>
              <p className="mt-1 text-sm text-slate-500">
                Required to start your trial. Same card is used for subscription after {TRIAL_DAYS} days.
              </p>
              <div className="mt-6">
                <PaymentMethodForm
                  currency={currency}
                  interval={interval}
                  amount={quote.totalAmount}
                  value={paymentInput}
                  onChange={setPaymentInput}
                />
              </div>
              {error && (
                <p className="mt-4 text-sm text-red-600 flex gap-1" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </p>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-xl font-semibold">School admin account</h2>
              <p className="mt-1 text-sm text-slate-500">OTP login — no password</p>
              <label className="block mt-6">
                <span className="text-sm font-medium">Admin full name *</span>
                <input
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border px-3"
                />
              </label>
              <label className="block mt-4">
                <span className="text-sm font-medium">Principal name</span>
                <input
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border px-3"
                />
              </label>
              <label className="block mt-4">
                <span className="text-sm font-medium">Mobile (OTP) *</span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border px-3"
                  placeholder="+91 98765 43210"
                />
              </label>
              <label className="block mt-4">
                <span className="text-sm font-medium">Email (invoices) *</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border px-3"
                />
              </label>
              {error && (
                <p className="mt-4 text-sm text-red-600 flex gap-1" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </p>
              )}
            </>
          )}

          {step === 6 && (
            <div className="text-center py-6">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-8 w-8" />
              </span>
              <h2 className="mt-4 text-2xl font-bold">Welcome to {APP_NAME}</h2>
              <p className="mt-2 text-slate-600">
                <strong>{schoolName}</strong> is registered. Your {TRIAL_DAYS}-day trial is active.
                {paymentSaved && (
                  <>
                    {' '}
                    Card •••• {paymentSaved.last4} is on file for billing after trial.
                  </>
                )}
                {savedLocally
                  ? ' Registration saved in this browser — use the same browser for admin login.'
                  : ' Log in with OTP to open your dashboard.'}
              </p>
              <Button
                className="mt-6"
                href={`${marketingUrl}/login?phone=${encodeURIComponent(phone)}&trial=1`}
              >
                Sign in to your dashboard
              </Button>
            </div>
          )}

          {step < 6 && (
            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <Button variant="secondary" onClick={() => { setError(''); setStep((s) => s - 1); }} className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {step < 5 ? (
                <Button
                  className="flex-1"
                  disabled={
                    (step === 0 && !schoolName.trim()) ||
                    (step === 3 && (!acceptedTerms || !acceptedAutoRenew))
                  }
                  onClick={() => {
                    if (step === 4) {
                      const err = validatePaymentMethod(paymentInput);
                      if (err) {
                        setError(err);
                        return;
                      }
                      setError('');
                    }
                    setStep((s) => s + 1);
                  }}
                >
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  disabled={loading || !adminName || !phone || !email}
                  onClick={submit}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Starting trial…
                    </>
                  ) : (
                    `Start ${TRIAL_DAYS}-day free trial`
                  )}
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
