'use client';

import { useState } from 'react';
import { Pin, Plus } from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { addNotice } from '@/lib/school-store';
import type { NoticeAudience } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { FormField } from '@/components/ui/form-field';
import { SelectField } from '@/components/ui/select-field';

export default function NoticesPage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    body: '',
    audience: 'all' as NoticeAudience,
    pinned: false,
  });

  if (!state) return null;
  const canEdit = ['school_admin', 'sub_admin', 'teacher'].includes(state.currentUser.role);
  const notices = [...(state.notices ?? [])].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      notify.error('Incomplete notice', 'Add a title and body.');
      return;
    }
    update(
      addNotice(state!, {
        title: form.title.trim(),
        body: form.body.trim(),
        audience: form.audience,
        pinned: form.pinned,
        author: state!.currentUser.name,
      })
    );
    notify.success('Notice published', 'Visible according to the selected audience.');
    setForm({ title: '', body: '', audience: 'all', pinned: false });
    setShowForm(false);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Notices"
        description="Official circulars for parents, students, and staff — pin urgent items to the top."
      >
        {canEdit && !showForm ? (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Publish notice
          </Button>
        ) : null}
      </PageHeader>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>New notice</CardTitle>
            <CardDescription>Appears on the portal notice board.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <FormField
                id="nt-title"
                label="Title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-800">Body</span>
                <textarea
                  required
                  className="w-full min-h-[100px] rounded-xl border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                />
              </label>
              <SelectField
                id="nt-audience"
                label="Audience"
                value={form.audience}
                onChange={(audience) => setForm((f) => ({ ...f, audience: audience as NoticeAudience }))}
                options={[
                  { value: 'all', label: 'Everyone' },
                  { value: 'parents', label: 'Parents' },
                  { value: 'students', label: 'Students' },
                  { value: 'staff', label: 'Staff' },
                ]}
              />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.pinned}
                  onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                Pin to top
              </label>
              <div className="flex gap-2">
                <Button type="submit">Publish</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <ul className="space-y-3">
        {notices.map((n) => (
          <li key={n.id} className="dash-panel p-4 sm:p-5 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {n.pinned ? (
                <span className="inline-flex items-center gap-1 stat-chip">
                  <Pin className="h-3 w-3" aria-hidden />
                  Pinned
                </span>
              ) : null}
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {n.audience}
              </span>
            </div>
            <h3 className="font-display font-semibold text-ink-900">{n.title}</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{n.body}</p>
            <p className="text-xs text-slate-500">
              {n.author} · {n.createdAt}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
