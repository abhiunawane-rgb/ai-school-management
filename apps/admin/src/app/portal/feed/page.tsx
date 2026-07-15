'use client';

import { Heart } from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { likeCommunityPost } from '@/lib/school-store';
import { PortalPage } from '@/components/portal/portal-page';

export default function PortalFeedPage() {
  const { state, update } = useSchool();
  if (!state) return null;

  const feed = state.feed ?? [];
  const events = [...(state.events ?? [])].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <PortalPage title="Community & events">
      <section className="space-y-3 mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Upcoming events</h2>
        <ul className="space-y-2">
          {events.slice(0, 4).map((ev) => (
            <li key={ev.id} className="rounded-xl border bg-white p-3 flex gap-3">
              <div className="rounded-lg bg-ink-900 px-2.5 py-1.5 text-center text-white min-w-[3.25rem]">
                <p className="text-[9px] uppercase text-white/70">
                  {new Date(ev.date + 'T12:00:00').toLocaleString('en', { month: 'short' })}
                </p>
                <p className="text-lg font-bold leading-none">{new Date(ev.date + 'T12:00:00').getDate()}</p>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm text-ink-900">{ev.title}</p>
                <p className="text-xs text-slate-500">
                  {ev.time} · {ev.location}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Feed</h2>
        <ul className="space-y-3">
          {feed.map((post) => (
            <li key={post.id} className="rounded-2xl border bg-white p-4 space-y-2 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">{post.type}</p>
              <h3 className="font-semibold text-ink-900">{post.title}</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{post.body}</p>
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-slate-500">{post.author}</p>
                <button
                  type="button"
                  onClick={() => update(likeCommunityPost(state, post.id))}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600"
                >
                  <Heart className="h-3.5 w-3.5" aria-hidden />
                  {post.likes}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PortalPage>
  );
}
