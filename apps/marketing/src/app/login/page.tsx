'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { DEMO_USER_DIRECTORY } from '@ai-school/shared';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/pricing-data';
import {
  DEMO_OTP,
  lookupAccountByPhone,
  createLoginHandoff,
  redirectToAppAfterLogin,
  registerPhoneAccount,
} from '@/lib/auth-session';
import { useNotify } from '@/components/notifications/notification-provider';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const notify = useNotify();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [trialBanner, setTrialBanner] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolvedRole, setResolvedRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const signupPhone = params.get('phone');
    if (signupPhone) setPhone(signupPhone);
    if (params.get('trial') === '1' || params.has('tenant')) setTrialBanner(true);
  }, []);

  async function sendOtp() {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      notify.error(
        'Invalid phone number',
        'Enter a valid mobile number with country code.',
        'Use at least 10 digits, e.g. +91 98765 43210.'
      );
      return;
    }

    const account = lookupAccountByPhone(phone);
    if (!account) {
      notify.error(
        'No account found',
        'This mobile number is not registered.',
        'Sign up your school or ask your administrator to add you.'
      );
      return;
    }

    setResolvedName(account.name);
    setResolvedRole(account.role.replace('_', ' '));
    setLoading(true);
    try {
      setStep('otp');
      notify.success(
        'Verification code sent',
        `OTP sent to ${phone}.`,
        `For testing, enter ${DEMO_OTP}.`
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (otp !== DEMO_OTP) {
      notify.error(
        'Incorrect code',
        'The OTP you entered is not valid.',
        `For testing, use ${DEMO_OTP}.`
      );
      return;
    }

    setLoading(true);
    try {
      const account = lookupAccountByPhone(phone);
      if (!account) {
        notify.error('Account not found', 'This mobile number is not registered.', 'Contact your school admin.');
        return;
      }

      registerPhoneAccount(account);
      const handoff = createLoginHandoff(phone);
      notify.success('Signed in', `Welcome, ${account.name}. Opening your account…`);
      redirectToAppAfterLogin(handoff);
    } catch (e) {
      notify.error(
        'Sign in failed',
        e instanceof Error ? e.message : 'Could not complete sign in.',
        'Try again or contact support.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] gradient-hero flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
            <GraduationCap className="h-6 w-6" aria-hidden />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Sign in to {APP_NAME}</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            One login for everyone — school admin, teacher, parent, student, or driver. Your mobile number
            identifies your account automatically.
          </p>
        </div>

        <ol className="mt-6 flex items-center justify-center gap-2 text-xs font-medium" aria-label="Sign-in progress">
          {(['Mobile', 'Verify'] as const).map((label, i) => {
            const active = (step === 'phone' && i === 0) || (step === 'otp' && i === 1);
            const done = step === 'otp' && i === 0;
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs',
                    active && 'border-brand-600 bg-brand-600 text-white',
                    done && 'border-emerald-500 bg-emerald-500 text-white',
                    !active && !done && 'border-slate-200 text-slate-400'
                  )}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span className={cn(active ? 'text-slate-900' : 'text-slate-500')}>{label}</span>
                {i === 0 ? <span className="text-slate-300" aria-hidden>→</span> : null}
              </li>
            );
          })}
        </ol>

        {trialBanner ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            <strong>Trial ready.</strong> Sign in with the mobile number you used during signup.
          </div>
        ) : null}

        {step === 'phone' ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void sendOtp();
            }}
          >
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Mobile number</span>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="mt-1 block text-xs text-slate-500">
                One number = one account. We&apos;ll text a 6-digit OTP.
              </span>
            </label>
            <Button type="submit" className="w-full" size="lg" disabled={loading || !phone.trim()}>
              {loading ? 'Checking…' : 'Send verification code'}
            </Button>
          </form>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void verifyOtp();
            }}
          >
            <p className="text-sm text-slate-600">
              Signing in as <strong className="text-slate-900">{resolvedName}</strong>
              {resolvedRole ? (
                <>
                  {' '}
                  · <span className="capitalize">{resolvedRole}</span>
                </>
              ) : null}{' '}
              · <strong className="text-slate-900">{phone}</strong>
            </p>
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Verification code</span>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="mt-1 block text-xs text-slate-500">Testing: enter {DEMO_OTP}</span>
            </label>
            <Button type="submit" className="w-full" size="lg" disabled={loading || otp.length !== 6}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setStep('phone');
                setOtp('');
              }}
            >
              Change number
            </Button>
          </form>
        )}

        <p className="mt-6 text-xs text-center text-slate-500 leading-relaxed">
          New school?{' '}
          <Link href="/signup" className="text-brand-600 font-medium hover:underline">
            Start your free trial
          </Link>
        </p>

        <button
          type="button"
          onClick={() => setShowDemo(!showDemo)}
          className="mt-4 flex w-full items-center justify-center gap-1 text-xs text-slate-500 hover:text-brand-600"
        >
          Demo test numbers
          {showDemo ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        {showDemo ? (
          <ul className="mt-2 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
            {DEMO_USER_DIRECTORY.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  className="w-full text-left hover:text-brand-700 py-1"
                  onClick={() => setPhone(u.phone)}
                >
                  <span className="font-medium">{u.phone}</span> — {u.name} ({u.role.replace('_', ' ')})
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
