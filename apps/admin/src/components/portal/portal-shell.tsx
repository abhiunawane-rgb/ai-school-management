'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, GraduationCap, Home, LogOut, Megaphone, Newspaper } from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { ROLE_LABELS, getLoginUrl } from '@/lib/portal/role-config';
import { cn } from '@/lib/utils';

const BOTTOM_TABS = [
  { href: '/portal', label: 'Home', icon: Home, match: (p: string) => p === '/portal' },
  { href: '/portal/notices', label: 'Notices', icon: Megaphone, match: (p: string) => p.includes('/notices') },
  { href: '/portal/feed', label: 'Feed', icon: Newspaper, match: (p: string) => p.includes('/feed') },
  { href: '/portal/ai', label: 'AI', icon: Brain, match: (p: string) => p.includes('/ai') },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useSchool();
  const path = pathname.replace(/\/$/, '') || '/';

  if (!state) return null;

  const { school, currentUser } = state;
  const showAiTab = ['teacher', 'parent', 'student'].includes(currentUser.role);
  const tabs = BOTTOM_TABS.filter((t) => t.href !== '/portal/ai' || showAiTab);

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col max-w-lg mx-auto lg:max-w-2xl shadow-xl lg:shadow-card border-x border-slate-200/80">
      <header className="glass-nav sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {school.logoUrl ? (
              <img src={school.logoUrl} alt="" className="h-10 w-10 rounded-xl object-contain border bg-white" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0">
              <p className="font-display font-semibold text-ink-900 truncate text-sm">{school.name}</p>
              <p className="text-xs text-slate-500 truncate">
                {currentUser.name} · {ROLE_LABELS[currentUser.role]}
              </p>
            </div>
          </div>
          <a
            href={getLoginUrl()}
            onClick={() => localStorage.removeItem('aischool_admin_state')}
            className="touch-target rounded-xl text-slate-500 hover:text-brand-700 hover:bg-slate-100"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </a>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">{children}</main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-lg"
        aria-label="Portal navigation"
      >
        <div className="mx-auto max-w-lg lg:max-w-2xl flex">
          {tabs.map((tab) => {
            const active = tab.match(path);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex-1 touch-target-inline flex-col gap-0.5 py-2.5 text-[11px] font-medium',
                  active ? 'text-brand-700' : 'text-slate-500'
                )}
              >
                <tab.icon className="h-5 w-5" aria-hidden />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
