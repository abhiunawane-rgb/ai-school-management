'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { addHomework } from '@/lib/school-store';
import {
  DUE_IN_DAYS,
  GRADES,
  DIVISIONS,
  SUBJECTS,
  dueDateFromDays,
  formatClassSection,
} from '@/lib/school-options';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { FormField } from '@/components/ui/form-field';
import { SelectField } from '@/components/ui/select-field';
import { FormSection } from '@/components/ui/form-section';

const EMPTY_FORM = {
  title: '',
  grade: '8',
  division: 'A',
  subject: '',
  dueInDays: '7',
  description: '',
};

export default function HomeworkPage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const subjectOptions = useMemo(
    () => SUBJECTS.map((s) => ({ value: s, label: s })),
    []
  );

  if (!state) return null;
  const schoolState = state;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      notify.error('Title required', 'Enter an assignment title.', 'Add a short title students will recognize.');
      return;
    }
    if (!form.subject) {
      notify.error('Subject required', 'Select a subject from the list.', 'Choose the subject for this homework.');
      return;
    }

    const classSection = formatClassSection(form.grade, form.division);
    const dueDate = dueDateFromDays(Number(form.dueInDays) || 7);

    update(
      addHomework(schoolState, {
        title: form.title.trim(),
        classSection,
        subject: form.subject,
        dueDate,
        description: form.description.trim(),
      })
    );
    notify.success(
      'Homework published',
      `"${form.title.trim()}" assigned to ${classSection}.`,
      'Teachers and students will see it in the app.'
    );
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  const items = state.homework ?? [];

  return (
    <div className="page-container max-w-4xl">
      <PageHeader
        title="Homework"
        description="Assign homework to classes. Visible to teachers and students on mobile."
      >
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Assign homework
          </Button>
        ) : null}
      </PageHeader>

      {showForm ? (
        <Card className="border-brand-200/60 shadow-card">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>New assignment</CardTitle>
              <CardDescription>Select class, subject, and due date — no manual typing for standard fields.</CardDescription>
            </div>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-5">
              <FormField
                id="hw-title"
                label="Assignment title"
                required
                placeholder="e.g. Algebra worksheet — Chapter 5"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <FormSection legend="Class & subject">
                <SelectField
                  id="hw-grade"
                  label="Grade"
                  required
                  value={form.grade}
                  onChange={(grade) => setForm({ ...form, grade })}
                  options={GRADES.map((g) => ({ value: g, label: `Grade ${g}` }))}
                />
                <SelectField
                  id="hw-division"
                  label="Section"
                  required
                  value={form.division}
                  onChange={(division) => setForm({ ...form, division })}
                  options={DIVISIONS.map((d) => ({ value: d, label: `Section ${d}` }))}
                />
                <SelectField
                  id="hw-subject"
                  label="Subject"
                  required
                  placeholder="Select subject"
                  value={form.subject}
                  onChange={(subject) => setForm({ ...form, subject })}
                  options={subjectOptions}
                  className="sm:col-span-2"
                />
              </FormSection>

              <SelectField
                id="hw-due"
                label="Due date"
                required
                value={form.dueInDays}
                onChange={(dueInDays) => setForm({ ...form, dueInDays })}
                options={DUE_IN_DAYS.map((d) => ({ value: d.value, label: d.label }))}
              />

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-800">Instructions for students</span>
                <textarea
                  id="hw-desc"
                  className="w-full min-h-[88px] rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  placeholder="Optional — exercises, page numbers, submission format"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>

              <Button type="submit" size="lg">
                Publish assignment
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {items.map((hw) => (
          <Card key={hw.id}>
            <CardHeader>
              <CardTitle className="text-lg">{hw.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1 text-slate-600">
              <p>
                <strong className="text-slate-800">{hw.classSection}</strong> · {hw.subject} · Due {hw.dueDate}
              </p>
              {hw.description ? <p>{hw.description}</p> : null}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && !showForm ? (
          <p className="text-sm text-muted-foreground text-center py-8">No homework assigned yet.</p>
        ) : null}
      </div>
    </div>
  );
}
