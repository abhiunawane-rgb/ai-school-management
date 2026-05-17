'use client';

import { useRef, useState } from 'react';
import { useSchool } from '@/hooks/use-school';
import { updateSchoolProfile } from '@/lib/school-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GraduationCap } from 'lucide-react';

export default function SchoolProfilePage() {
  const { state, update } = useSchool();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);

  if (!state) return null;
  const { school } = state;
  const [form, setForm] = useState({
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

  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, logoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!state) return;
    update(updateSchoolProfile(state, form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">School profile</h1>
        <p className="text-slate-600 text-sm mt-1">Your school name and logo appear in the header and parent app.</p>
      </div>

      <Card>
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
                className="mt-2 flex items-center gap-3 rounded-lg border border-dashed p-4 w-full hover:bg-slate-50"
              >
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="" className="h-14 w-14 rounded-lg object-contain" />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <GraduationCap className="h-7 w-7" />
                  </span>
                )}
                <span className="text-sm text-slate-600">Upload PNG or JPG (max 2 MB)</span>
              </button>
            </div>

            <label className="block text-sm font-medium">
              School name
              <Input
                className="mt-1"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Principal name
              <Input
                className="mt-1"
                value={form.principalName}
                onChange={(e) => setForm((f) => ({ ...f, principalName: e.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium">
              Address
              <Input
                className="mt-1"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                City
                <Input
                  className="mt-1"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </label>
              <label className="block text-sm font-medium">
                Board / curriculum
                <Input
                  className="mt-1"
                  value={form.board}
                  onChange={(e) => setForm((f) => ({ ...f, board: e.target.value }))}
                />
              </label>
            </div>
            <label className="block text-sm font-medium">
              Website
              <Input
                className="mt-1"
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium">
              Admin phone
              <Input
                className="mt-1"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium">
              Billing email
              <Input
                type="email"
                className="mt-1"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </label>
            <Button type="submit">{saved ? 'Saved' : 'Save profile'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
