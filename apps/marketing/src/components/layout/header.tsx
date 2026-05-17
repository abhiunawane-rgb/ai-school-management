'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/why-us', label: 'Why us' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001';

  return (
    <header className="glass-nav sticky top-0 z-50" role="banner">
      <div className="container-marketing flex h-16 items-center justify-between lg:h-[4.5rem]">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold text-slate-900"
          aria-label="AI School Management home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <span className="hidden sm:inline text-sm leading-tight max-w-[140px]">
            AI School Management
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={adminUrl}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-700"
          >
            Login
          </a>
          <Button href="/signup" size="md">
            Start 7-day trial
          </Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          'border-t border-slate-200 bg-white lg:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <nav className="container-marketing flex flex-col gap-1 py-4" aria-label="Mobile navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="mt-2 rounded-xl bg-brand-600 px-4 py-3 text-center font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Start 7-day trial
          </Link>
        </nav>
      </div>
    </header>
  );
}
