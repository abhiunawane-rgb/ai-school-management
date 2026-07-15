'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type Props = {
  title: string;
  backHref?: string;
  children: React.ReactNode;
};

export function PortalPage({ title, backHref = '/portal', children }: Props) {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Link
          href={backHref}
          className="touch-target rounded-xl text-slate-600 hover:bg-slate-100 hover:text-brand-700"
          aria-label="Back to home"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="font-display text-xl font-semibold text-slate-900">{title}</h1>
      </div>
      {children}
    </div>
  );
}
