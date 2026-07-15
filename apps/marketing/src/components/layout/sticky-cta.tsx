'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > 480);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-lg p-3 shadow-[0_-8px_30px_rgb(0_0_0/0.08)] lg:hidden"
      role="region"
      aria-label="Quick actions"
    >
      <div className="container-marketing flex items-center gap-2">
        <Button href="/signup" size="md" className="flex-1 gap-1 text-sm">
          Start trial
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Link
          href="/pricing#calculator"
          className="touch-target flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-center text-sm font-semibold text-brand-700"
        >
          Pricing
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="touch-target rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
