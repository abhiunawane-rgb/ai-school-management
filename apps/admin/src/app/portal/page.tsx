'use client';

import Link from 'next/link';
import { useSchool } from '@/hooks/use-school';
import { tilesForRole, ROLE_LABELS } from '@/lib/portal/role-config';
import { FeatureGrid } from '@/components/portal/feature-grid';
import { AlertBanner } from '@/components/ui/alert-banner';

export default function PortalHomePage() {
  const { state } = useSchool();
  if (!state) return null;

  const tiles = tilesForRole(state.currentUser.role);
  const today = new Date().toISOString().slice(0, 10);
  const notice = (state.notices ?? []).find((n) => n.pinned) ?? (state.notices ?? [])[0];
  const nextEvent = [...(state.events ?? [])]
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <div className="space-y-5">
      <div className="mx-4 mt-2 rounded-2xl bg-gradient-to-br from-ink-900 to-brand-800 p-5 text-white shadow-card">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-200/90">
          {state.school.name}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Hello, {state.currentUser.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-white/70">{ROLE_LABELS[state.currentUser.role]} portal</p>
      </div>

      {(notice || nextEvent) && (
        <div className="mx-4 space-y-2">
          {notice ? (
            <Link
              href="/portal/notices"
              className="block rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">Notice</p>
              <p className="font-medium text-sm text-ink-900">{notice.title}</p>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notice.body}</p>
            </Link>
          ) : null}
          {nextEvent ? (
            <Link
              href="/portal/feed"
              className="block rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">Next event</p>
              <p className="font-medium text-sm text-ink-900">{nextEvent.title}</p>
              <p className="text-xs text-slate-500">
                {nextEvent.date} · {nextEvent.time} · {nextEvent.location}
              </p>
            </Link>
          ) : null}
        </div>
      )}

      <div>
        <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Your features</p>
        <FeatureGrid tiles={tiles} />
      </div>

      <div className="px-4 pb-2">
        <AlertBanner variant="info">
          Works on phone and desktop. Demo OTP <strong>123456</strong> for all demo accounts.
        </AlertBanner>
      </div>
    </div>
  );
}
