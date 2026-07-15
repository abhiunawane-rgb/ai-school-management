'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getMarketingUrl } from '@/lib/env';

function LoginRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    window.location.replace(`${getMarketingUrl()}/login${qs ? `?${qs}` : ''}`);
  }, [searchParams]);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <p className="text-slate-600">Redirecting to sign in…</p>
    </div>
  );
}

export default function LoginRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
          <p className="text-slate-600">Redirecting to sign in…</p>
        </div>
      }
    >
      <LoginRedirect />
    </Suspense>
  );
}
