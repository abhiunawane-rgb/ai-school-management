'use client';

import { useMemo, useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { addSyllabusUnit } from '@/lib/school-store';
import { DIVISIONS, GRADES, SUBJECTS, formatClassSection } from '@/lib/school-options';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { FormField } from '@/components/ui/form-field';
import { SelectField } from '@/components/ui/select-field';
import { FormSection } from '@/components/ui/form-section';

const EMPTY = {
  title: '',
  grade: '8',
  division: 'A',
  subject: '',
  weekLabel: 'Week 12',
  description: '',
  resources: '',
};

export default function SyllabusPage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const subjectOptions = useMemo(() => SUBJECTS.map((s) => ({ value: s, label: s })), []);

  if (!state) return null;
  const schoolState = state;
  const canEdit = ['school_admin', 'sub_admin', 'teacher'].includes(schoolState.currentUser.role);
  const items = schoolState.syllabus ?? [];

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.subject) {
      notify.error('Missing details', 'Add a title and subject.', 'Teachers publish syllabus units by chapter.');
      return;
    }
    update(
      addSyllabusUnit(schoolState, {
        title: form.title.trim(),
        classSection: formatClassSection(form.grade, form.division),
        subject: form.subject,
        description: form.description.trim(),
        weekLabel: form.weekLabel.trim() || 'This week',
        teacher: schoolState.currentUser.name,
        resources: form.resources.trim() || undefined,
      })
    );
    notify.success('Syllabus published', `"${form.title.trim()}" is now visible to the class.`);
    setForm(EMPTY);
    setShowForm(false);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Syllabus"
        description="Teachers publish chapter plans, weekly units, and resource links for each class."
      >
        {canEdit && !showForm ? (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Add unit
          </Button>
        ) : null}
      </PageHeader>

      {showForm ? (
        <Card className="border-brand-200/60 shadow-card">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>New syllabus unit</CardTitle>
              <CardDescription>Visible to students and parents for the selected class.</CardDescription>
            </div>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-5">
              <FormField
                id="sy-title"
                label="Title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Chapter 5 — Algebra"
              />
              <FormSection legend="Class & subject">
                <SelectField
                  id="sy-grade"
                  label="Grade"
                  required
                  value={form.grade}
                  onChange={(grade) => setForm((f) => ({ ...f, grade }))}
                  options={GRADES.map((g) => ({ value: g, label: `Grade ${g}` }))}
                />
                <SelectField
                  id="sy-division"
                  label="Section"
                  required
                  value={form.division}
                  onChange={(division) => setForm((f) => ({ ...f, division }))}
                  options={DIVISIONS.map((d) => ({ value: d, label: `Section ${d}` }))}
                />
                <SelectField
                  id="sy-subject"
                  label="Subject"
                  required
                  placeholder="Select subject"
                  value={form.subject}
                  onChange={(subject) => setForm((f) => ({ ...f, subject }))}
                  options={subjectOptions}
                  className="sm:col-span-2"
                />
              </FormSection>
              <FormField
                id="sy-week"
                label="Week / term label"
                value={form.weekLabel}
                onChange={(e) => setForm((f) => ({ ...f, weekLabel: e.target.value }))}
              />
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-800">Description</span>
                <textarea
                  id="sy-desc"
                  className="w-full min-h-[88px] rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  placeholder="Topics, exercises, and expectations"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>
              <FormField
                id="sy-resources"
                label="Resources (optional)"
                value={form.resources}
                onChange={(e) => setForm((f) => ({ ...f, resources: e.target.value }))}
                placeholder="Worksheet PDF · Textbook pages"
              />
              <Button type="submit" size="lg">
                Publish unit
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <ul className="space-y-3">
        {items.map((unit) => (
          <li key={unit.id} className="dash-panel p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <BookOpen className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-semibold text-ink-900">{unit.title}</h3>
                  <span className="stat-chip">{unit.weekLabel}</span>
                </div>
                <p className="text-sm text-slate-600">
                  {unit.subject} · {unit.classSection} · {unit.teacher}
                </p>
                {unit.description ? <p className="text-sm text-slate-700 leading-relaxed">{unit.description}</p> : null}
                {unit.resources ? (
                  <p className="text-xs font-medium text-brand-800">Resources: {unit.resources}</p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
