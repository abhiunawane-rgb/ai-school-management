'use client';

import { Pin } from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { PortalPage } from '@/components/portal/portal-page';

export default function PortalNoticesPage() {
  const { state } = useSchool();
  if (!state) return null;

  const notices = [...(state.notices ?? [])].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <PortalPage title="Notices">
      <ul className="space-y-3">
        {notices.map((n) => (
          <li key={n.id} className="rounded-2xl border bg-white p-4 space-y-2 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              {n.pinned ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  <Pin className="h-3 w-3" aria-hidden />
                  Pinned
                </span>
              ) : null}
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {n.audience}
              </span>
            </div>
            <h2 className="font-semibold text-ink-900">{n.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{n.body}</p>
            <p className="text-xs text-slate-500">
              {n.createdAt} · {n.author}
            </p>
          </li>
        ))}
      </ul>
    </PortalPage>
  );
}
