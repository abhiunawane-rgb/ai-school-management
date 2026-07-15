'use client';

import { useEffect, useState } from 'react';
import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { saveSchoolState, updateSettings } from '@/lib/school-store';
import type { SchoolSettings } from '@/lib/types';
import { isAdminRole, postLoginPath } from '@/lib/portal/role-config';
import { adminHref } from '@/lib/env';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DEFAULT_SETTINGS: SchoolSettings = {
  timezone: 'Asia/Kolkata',
  language: 'en',
  emailNotifications: true,
  smsNotifications: true,
  whatsappAlerts: false,
};

export default function SettingsPage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  const [form, setForm] = useState<SchoolSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!state) return;
    setForm(state.settings);
  }, [state]);

  if (!state) return null;
  const schoolState = state;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    update(updateSettings(schoolState, form));
    notify.success(
      'Settings saved',
      'School preferences and notification options were updated.',
      'Changes apply immediately for this school.'
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="School preferences and notifications."
      />

      <Card className="shadow-card border-slate-200/80">
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <label className="block text-sm font-medium">
              Timezone
              <select
                value={form.timezone}
                onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
                className="mt-1 w-full border border-input rounded-xl px-3 py-2 text-sm bg-background"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Default language
              <select
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                className="mt-1 w-full border border-input rounded-xl px-3 py-2 text-sm bg-background"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </label>

            <p className="text-sm font-medium pt-2">Notifications</p>
            {[
              { key: 'emailNotifications' as const, label: 'Email notifications' },
              { key: 'smsNotifications' as const, label: 'SMS notifications' },
              { key: 'whatsappAlerts' as const, label: 'WhatsApp alerts' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                {label}
              </label>
            ))}

            <Button type="submit" className="rounded-xl">Save settings</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-card border-slate-200/80">
        <CardHeader>
          <CardTitle>Test role (local only)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p className="text-muted-foreground">
            Switch role to test the web portal or admin dashboard — you will be redirected.
          </p>
          <div className="flex flex-wrap gap-2">
            {(['school_admin', 'sub_admin', 'teacher', 'parent', 'student', 'driver'] as const).map((role) => (
              <Button
                key={role}
                type="button"
                variant={schoolState.currentUser.role === role ? 'default' : 'secondary'}
                size="sm"
                className="rounded-xl capitalize"
                onClick={() => {
                  const next = { ...schoolState, currentUser: { ...schoolState.currentUser, role } };
                  saveSchoolState(next);
                  update(next);
                  window.location.href = adminHref(postLoginPath(role));
                }}
              >
                {role.replace(/_/g, ' ')}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
