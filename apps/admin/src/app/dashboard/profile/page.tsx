'use client';

import { useEffect, useRef, useState } from 'react';
import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { updateSchoolProfile } from '@/lib/school-store';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select-field';
import { BOARDS, CITIES } from '@/lib/school-options';
import { GraduationCap } from 'lucide-react';

const emptyForm = {
  name: '',
  address: '',
  city: '',
  board: '',
  website: '',
  phone: '',
  email: '',
  principalName: '',
  logoUrl: null as string | null,
};

export default function SchoolProfilePage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!state) return;
    const { school } = state;
    setForm({
      name: school.name,
      address: school.address,
      city: school.city,
      board: school.board,
      website: school.website,
      phone: school.phone,
      email: school.email,
      principalName: school.principalName,
      logoUrl: school.logoUrl,
    });
  }, [state]);

  if (!state) return null;
  const schoolState = state;

  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      notify.error('Logo too large', 'Logo must be under 2 MB.', 'Compress the image or choose a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, logoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    update(updateSchoolProfile(schoolState, form));
    notify.success(
      'Profile saved',
      'School name, logo, and contact details were updated.',
      'Parents and staff will see the new branding in the app.'
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="School profile"
        description="Your school name and logo appear in the header and parent app."
      />

      <Card className="shadow-card border-slate-200/80">
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium">School logo</label>
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onLogoChange} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-slate-200 p-4 w-full hover:bg-brand-50/50 transition-colors"
              >
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="" className="h-14 w-14 rounded-xl object-contain" />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 text-white">
                    <GraduationCap className="h-7 w-7" />
                  </span>
                )}
                <span className="text-sm text-slate-600">Upload PNG or JPG (max 2 MB)</span>
              </button>
            </div>

            <label className="block text-sm font-medium">
              School name
              <Input
                className="mt-1 rounded-xl"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Principal name
              <Input
                className="mt-1 rounded-xl"
                value={form.principalName}
                onChange={(e) => setForm((f) => ({ ...f, principalName: e.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium">
              Address
              <Input
                className="mt-1 rounded-xl"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id="profile-city"
                label="City"
                value={form.city || CITIES[0]}
                onChange={(city) => setForm((f) => ({ ...f, city }))}
                options={CITIES.map((c) => ({ value: c, label: c }))}
              />
              <SelectField
                id="profile-board"
                label="Board / curriculum"
                value={form.board || BOARDS[0]}
                onChange={(board) => setForm((f) => ({ ...f, board }))}
                options={BOARDS.map((b) => ({ value: b, label: b }))}
              />
            </div>
            <label className="block text-sm font-medium">
              Website
              <Input
                className="mt-1 rounded-xl"
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium">
              Admin phone
              <Input
                className="mt-1 rounded-xl"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium">
              Billing email
              <Input
                type="email"
                className="mt-1 rounded-xl"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </label>
            <Button type="submit" className="rounded-xl">Save profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
