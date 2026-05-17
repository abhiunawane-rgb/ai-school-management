'use client';

import { useState } from 'react';
import { useSchool } from '@/hooks/use-school';
import { saveSchoolState, updateSettings } from '@/lib/school-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const { state, update } = useSchool();
  const [saved, setSaved] = useState(false);

  if (!state) return null;

  const { settings } = state;
  const [form, setForm] = useState(settings);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!state) return;
    update(updateSettings(state, form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-slate-600 text-sm mt-1">School preferences and notifications.</p>
      </div>

      <Card>
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
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
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
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
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
                />
                {label}
              </label>
            ))}

            <Button type="submit">{saved ? 'Saved' : 'Save settings'}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test role (local only)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p className="text-muted-foreground">
            Switch your role to test Sub Admin invite permissions without a second account.
          </p>
          <div className="flex flex-wrap gap-2">
            {(['school_admin', 'sub_admin', 'teacher'] as const).map((role) => (
              <Button
                key={role}
                type="button"
                variant={state.currentUser.role === role ? 'default' : 'secondary'}
                size="sm"
                onClick={() => {
                  const next = { ...state, currentUser: { ...state.currentUser, role } };
                  saveSchoolState(next);
                  update(next);
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
