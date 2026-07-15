'use client';

import { useEffect, useState } from 'react';
import type { LoginHandoff } from '@/lib/auth-handoff';
import { decodeHandoff, readSessionFromUrl, verifyHandoff } from '@/lib/auth-handoff';
import { completeLogin } from '@/lib/school-store';
import { postLoginPath } from '@/lib/portal/role-config';
import { adminHref, getMarketingUrl } from '@/lib/env';

/**
 * Static BigRock hosting: useSearchParams + router.replace often hang.
 * Read the session from window.location and hard-redirect after login.
 */
export default function AuthCompletePage() {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Opening your account…');

  useEffect(() => {
    let cancelled = false;

    function fail(message: string) {
      if (!cancelled) setError(message);
    }

    try {
      const session = readSessionFromUrl();
      if (!session) {
        fail('Missing sign-in session. Please log in again.');
        return;
      }

      let handoff: LoginHandoff;
      try {
        handoff = decodeHandoff(session);
      } catch {
        fail('Invalid sign-in session. Please log in again.');
        return;
      }

      if (handoff.exp < Date.now()) {
        fail('Sign-in session expired. Please log in again.');
        return;
      }

      const verified = verifyHandoff(handoff);
      completeLogin(verified);
      if (cancelled) return;

      setStatus(`Welcome, ${verified.name}. Redirecting…`);
      const path = postLoginPath(verified.role);
      window.setTimeout(() => {
        if (!cancelled) window.location.replace(adminHref(path));
      }, 50);
    } catch (e) {
      fail(e instanceof Error ? e.message : 'Could not complete sign in.');
    }

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-red-700 text-sm leading-relaxed">{error}</p>
          <a
            href={`${getMarketingUrl()}/login/`}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white"
          >
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <p className="text-slate-600 text-sm">{status}</p>
    </div>
  );
}
