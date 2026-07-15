'use client';

import { useState } from 'react';
import { CalendarDays, Heart, Megaphone, Plus } from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { addCommunityPost, addSchoolEvent, likeCommunityPost } from '@/lib/school-store';
import type { EventCategory, FeedPostType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { FormField } from '@/components/ui/form-field';
import { SelectField } from '@/components/ui/select-field';

type Tab = 'feed' | 'events';

export default function CommunityFeedPage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  const [tab, setTab] = useState<Tab>('feed');
  const [showPost, setShowPost] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', body: '', type: 'post' as FeedPostType });
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '10:00 AM',
    location: '',
    description: '',
    category: 'academic' as EventCategory,
  });

  if (!state) return null;

  const canPublish = ['school_admin', 'sub_admin', 'teacher'].includes(state.currentUser.role);
  const feed = state.feed ?? [];
  const events = [...(state.events ?? [])].sort((a, b) => a.date.localeCompare(b.date));

  function publishPost(e: React.FormEvent) {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.body.trim()) {
      notify.error('Incomplete post', 'Add a title and message.');
      return;
    }
    update(
      addCommunityPost(state!, {
        type: postForm.type,
        author: state!.currentUser.name,
        authorRole: state!.currentUser.role,
        title: postForm.title.trim(),
        body: postForm.body.trim(),
        pinned: false,
      })
    );
    notify.success('Posted', 'Your update is on the community feed.');
    setPostForm({ title: '', body: '', type: 'post' });
    setShowPost(false);
  }

  function publishEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date) {
      notify.error('Incomplete event', 'Add a title and date.');
      return;
    }
    update(
      addSchoolEvent(state!, {
        title: eventForm.title.trim(),
        date: eventForm.date,
        time: eventForm.time.trim() || 'TBA',
        location: eventForm.location.trim() || 'School campus',
        description: eventForm.description.trim(),
        category: eventForm.category,
      })
    );
    notify.success('Event published', 'Families will see it on the events list.');
    setEventForm({
      title: '',
      date: '',
      time: '10:00 AM',
      location: '',
      description: '',
      category: 'academic',
    });
    setShowEvent(false);
    setTab('events');
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Community & events"
        description="Share school updates and publish events — the school’s social board for families and staff."
      >
        {canPublish ? (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { setShowPost(true); setShowEvent(false); }} className="gap-2">
              <Plus className="h-4 w-4" aria-hidden />
              New post
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowEvent(true); setShowPost(false); }}
              className="gap-2"
            >
              <CalendarDays className="h-4 w-4" aria-hidden />
              New event
            </Button>
          </div>
        ) : null}
      </PageHeader>

      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {(['feed', 'events'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t ? 'bg-white text-ink-900 shadow-sm' : 'text-slate-600 hover:text-ink-900'
            }`}
          >
            {t === 'feed' ? 'Feed' : 'Events'}
          </button>
        ))}
      </div>

      {showPost ? (
        <Card>
          <CardHeader>
            <CardTitle>New community post</CardTitle>
            <CardDescription>Announcements, highlights, or class updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={publishPost} className="space-y-4">
              <SelectField
                id="fp-type"
                label="Type"
                value={postForm.type}
                onChange={(type) => setPostForm((f) => ({ ...f, type: type as FeedPostType }))}
                options={[
                  { value: 'post', label: 'Social post' },
                  { value: 'announcement', label: 'Announcement' },
                  { value: 'event', label: 'Event highlight' },
                ]}
              />
              <FormField
                id="fp-title"
                label="Title"
                required
                value={postForm.title}
                onChange={(e) => setPostForm((f) => ({ ...f, title: e.target.value }))}
              />
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-800">Message</span>
                <textarea
                  required
                  className="w-full min-h-[100px] rounded-xl border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  value={postForm.body}
                  onChange={(e) => setPostForm((f) => ({ ...f, body: e.target.value }))}
                />
              </label>
              <div className="flex gap-2">
                <Button type="submit">Publish</Button>
                <Button type="button" variant="outline" onClick={() => setShowPost(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {showEvent ? (
        <Card>
          <CardHeader>
            <CardTitle>New school event</CardTitle>
            <CardDescription>Sports, cultural, academic dates for the calendar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={publishEvent} className="space-y-4">
              <FormField
                id="ev-title"
                label="Event title"
                required
                value={eventForm.title}
                onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  id="ev-date"
                  label="Date"
                  type="date"
                  required
                  value={eventForm.date}
                  onChange={(e) => setEventForm((f) => ({ ...f, date: e.target.value }))}
                />
                <FormField
                  id="ev-time"
                  label="Time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm((f) => ({ ...f, time: e.target.value }))}
                />
              </div>
              <FormField
                id="ev-location"
                label="Location"
                value={eventForm.location}
                onChange={(e) => setEventForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Auditorium"
              />
              <SelectField
                id="ev-cat"
                label="Category"
                value={eventForm.category}
                onChange={(category) =>
                  setEventForm((f) => ({ ...f, category: category as EventCategory }))
                }
                options={[
                  { value: 'academic', label: 'Academic' },
                  { value: 'sports', label: 'Sports' },
                  { value: 'cultural', label: 'Cultural' },
                  { value: 'holiday', label: 'Holiday' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-800">Details</span>
                <textarea
                  className="w-full min-h-[80px] rounded-xl border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  value={eventForm.description}
                  onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>
              <div className="flex gap-2">
                <Button type="submit">Publish event</Button>
                <Button type="button" variant="outline" onClick={() => setShowEvent(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {tab === 'feed' ? (
        <ul className="space-y-3">
          {feed.map((post) => (
            <li key={post.id} className="dash-panel p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {post.pinned ? <span className="stat-chip">Pinned</span> : null}
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {post.type}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-ink-900">{post.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{post.body}</p>
                  <p className="text-xs text-slate-500">
                    {post.author} · {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <Megaphone className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
              </div>
              <button
                type="button"
                onClick={() => update(likeCommunityPost(state, post.id))}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-800"
              >
                <Heart className="h-3.5 w-3.5" aria-hidden />
                {post.likes} likes
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-3">
          {events.map((ev) => (
            <li key={ev.id} className="dash-panel p-4 sm:p-5 flex gap-4">
              <div className="shrink-0 rounded-xl bg-ink-900 px-3 py-2 text-center text-white min-w-[4.5rem]">
                <p className="text-[10px] uppercase tracking-wide text-white/70">
                  {new Date(ev.date + 'T12:00:00').toLocaleString('en', { month: 'short' })}
                </p>
                <p className="text-xl font-bold tabular-nums">{new Date(ev.date + 'T12:00:00').getDate()}</p>
              </div>
              <div className="min-w-0 space-y-1">
                <h3 className="font-display font-semibold text-ink-900">{ev.title}</h3>
                <p className="text-sm text-slate-600">
                  {ev.time} · {ev.location} · <span className="capitalize">{ev.category}</span>
                </p>
                {ev.description ? <p className="text-sm text-slate-700">{ev.description}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
