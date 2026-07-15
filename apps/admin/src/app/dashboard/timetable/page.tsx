'use client';

import { useId, useMemo, useState } from 'react';
import { CalendarClock, Plus, X } from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { addTimetableSlot } from '@/lib/school-store';
import {
  DIVISIONS,
  GRADES,
  ROOMS,
  SUBJECTS,
  TIME_FROM_OPTIONS,
  TIME_TO_OPTIONS,
  WEEKDAYS,
  formatClassSection,
  formatTimeRange,
  getPeriodOptions,
  getTeacherOptions,
  timesForPeriod,
} from '@/lib/timetable-options';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { useNotify } from '@/components/notifications/notification-provider';
import { SelectField } from '@/components/ui/select-field';
import { FormSection } from '@/components/ui/form-section';
import { StatTile } from '@/components/ui/stat-tile';
import { cn } from '@/lib/utils';

const EMPTY_FORM = {
  grade: '8',
  division: 'A',
  period: '1',
  timeFrom: '08:00',
  timeTo: '08:45',
  subject: '',
  teacher: '',
  room: '',
};

export default function TimetablePage() {
  const formId = useId();
  const notify = useNotify();
  const { state, update } = useSchool();
  const [activeDay, setActiveDay] = useState<(typeof WEEKDAYS)[number]>('Monday');
  const [showForm, setShowForm] = useState(false);
  const [customTime, setCustomTime] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const teacherOptions = useMemo(
    () => getTeacherOptions(state?.team ?? []).map((name) => ({ value: name, label: name })),
    [state?.team]
  );

  const periodOptions = useMemo(() => getPeriodOptions(), []);

  const slots = useMemo(() => {
    if (!state?.timetable) return [];
    return state.timetable
      .filter((s) => s.day === activeDay)
      .sort((a, b) => a.period - b.period);
  }, [state, activeDay]);

  const totalPeriods = state?.timetable?.length ?? 0;
  const classLabel = formatClassSection(form.grade, form.division);
  const timeLabel = formatTimeRange(form.timeFrom, form.timeTo);

  if (!state) return null;
  const schoolState = state;

  function openForm() {
    setForm({ ...EMPTY_FORM });
    setCustomTime(false);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
  }

  function updatePeriod(periodValue: string) {
    const period = Number(periodValue) || 1;
    const times = timesForPeriod(period);
    setForm((f) => ({
      ...f,
      period: periodValue,
      timeFrom: times.timeFrom,
      timeTo: times.timeTo,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.subject || !form.teacher || !form.room) {
      notify.error(
        'Missing fields',
        'Subject, teacher, and room are required.',
        'Select all three dropdowns before saving.'
      );
      return;
    }

    const period = Number(form.period) || 1;
    const duplicate = schoolState.timetable?.some(
      (s) => s.day === activeDay && s.period === period && s.classSection === classLabel
    );
    if (duplicate) {
      notify.error(
        'Period already scheduled',
        `${classLabel} already has period ${period} on ${activeDay}.`,
        'Choose a different period or class section.'
      );
      return;
    }

    const teacherBusy = schoolState.timetable?.some(
      (s) =>
        s.day === activeDay &&
        s.period === period &&
        s.teacher === form.teacher &&
        s.classSection !== classLabel
    );
    if (teacherBusy) {
      notify.error(
        'Teacher unavailable',
        `${form.teacher} is already teaching in period ${period} on ${activeDay}.`,
        'Pick another teacher or change the period.'
      );
      return;
    }

    update(
      addTimetableSlot(schoolState, {
        grade: form.grade,
        division: form.division,
        classSection: classLabel,
        day: activeDay,
        period,
        timeFrom: form.timeFrom,
        timeTo: form.timeTo,
        subject: form.subject,
        teacher: form.teacher,
        room: form.room,
      })
    );
    notify.success(
      'Period saved',
      `${form.subject} for ${classLabel} is on the ${activeDay} timetable.`,
      'Students and teachers will see it in the app.'
    );
    closeForm();
  }

  return (
    <div className="page-container max-w-5xl">
      <PageHeader
        title="Class timetable"
        description="Weekly schedule for each class. Published periods appear in the mobile app and web portal for teachers, students, and parents."
      >
        {!showForm ? (
          <Button onClick={openForm} className="gap-2 min-h-[var(--touch-min)]">
            <Plus className="h-4 w-4" aria-hidden />
            Add period
          </Button>
        ) : null}
      </PageHeader>

      <Card>
        <CardHeader className="pb-4 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <StatTile
              label="Total periods scheduled"
              value={totalPeriods}
              icon={<CalendarClock className="h-5 w-5" aria-hidden />}
            />
            <p className="text-sm text-slate-600 sm:text-right">
              <span className="font-semibold text-slate-900">{slots.length}</span> on {activeDay}
            </p>
          </div>

          <div role="tablist" aria-label="Select day" className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {WEEKDAYS.map((day) => (
              <button
                key={day}
                type="button"
                role="tab"
                id={`tab-${day}`}
                aria-selected={activeDay === day}
                aria-controls={`panel-${day}`}
                onClick={() => setActiveDay(day)}
                className={cn(
                  'shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors min-h-[var(--touch-min)]',
                  activeDay === day
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent
          id={`panel-${activeDay}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeDay}`}
          className="space-y-6"
        >
          {showForm ? (
            <Card className="border-brand-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div>
                  <CardTitle className="text-lg">New period · {activeDay}</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    {classLabel} · Period {form.period} · {timeLabel}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={closeForm}
                  className="shrink-0 touch-target"
                  aria-label="Close form"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <form id={formId} onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <FormSection legend="Class" description="Grade and section for this period">
                    <SelectField
                      id="grade"
                      label="Grade"
                      required
                      value={form.grade}
                      onChange={(grade) => setForm({ ...form, grade })}
                      options={GRADES.map((g) => ({ value: g, label: `Grade ${g}` }))}
                    />
                    <SelectField
                      id="division"
                      label="Section"
                      required
                      value={form.division}
                      onChange={(division) => setForm({ ...form, division })}
                      options={DIVISIONS.map((d) => ({ value: d, label: `Section ${d}` }))}
                    />
                  </FormSection>

                  <FormSection legend="When" description="Period sets the default bell time">
                    <SelectField
                      id="period"
                      label="Period"
                      required
                      value={form.period}
                      onChange={updatePeriod}
                      options={periodOptions.map((p) => ({ value: p.value, label: p.label }))}
                    />
                    <div className="flex flex-col justify-end space-y-2">
                      <p className="text-sm font-medium text-slate-800">Bell time</p>
                      <p
                        className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                        aria-live="polite"
                      >
                        {timeLabel}
                      </p>
                      <button
                        type="button"
                        onClick={() => setCustomTime((v) => !v)}
                        className="text-left text-xs font-medium text-brand-600 hover:underline min-h-[var(--touch-min)] inline-flex items-center"
                        aria-expanded={customTime}
                      >
                        {customTime ? 'Use default bell time' : 'Adjust bell time'}
                      </button>
                    </div>
                    {customTime ? (
                      <>
                        <SelectField
                          id="timeFrom"
                          label="Starts"
                          required
                          value={form.timeFrom}
                          onChange={(timeFrom) => setForm({ ...form, timeFrom })}
                          options={TIME_FROM_OPTIONS.map((t) => ({ value: t, label: t }))}
                        />
                        <SelectField
                          id="timeTo"
                          label="Ends"
                          required
                          value={form.timeTo}
                          onChange={(timeTo) => setForm({ ...form, timeTo })}
                          options={TIME_TO_OPTIONS.map((t) => ({ value: t, label: t }))}
                        />
                      </>
                    ) : null}
                  </FormSection>

                  <FormSection legend="Lesson">
                    <SelectField
                      id="subject"
                      label="Subject"
                      required
                      placeholder="Select subject"
                      value={form.subject}
                      onChange={(subject) => setForm({ ...form, subject })}
                      options={SUBJECTS.map((s) => ({ value: s, label: s }))}
                    />
                    <SelectField
                      id="teacher"
                      label="Teacher"
                      required
                      placeholder="Select teacher"
                      value={form.teacher}
                      onChange={(teacher) => setForm({ ...form, teacher })}
                      options={teacherOptions}
                    />
                    <SelectField
                      id="room"
                      label="Room"
                      required
                      placeholder="Select room"
                      value={form.room}
                      onChange={(room) => setForm({ ...form, room })}
                      options={ROOMS.map((r) => ({ value: r, label: r }))}
                      className="sm:col-span-2"
                    />
                  </FormSection>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
                    <Button type="button" variant="secondary" onClick={closeForm} className="min-h-[var(--touch-min)]">
                      Cancel
                    </Button>
                    <Button type="submit" className="min-h-[var(--touch-min)] sm:min-w-[10rem]">
                      Save period
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : null}

          {slots.length === 0 && !showForm ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
              <p className="text-slate-600">No periods on {activeDay} yet.</p>
              <Button onClick={openForm} className="mt-4 gap-2 min-h-[var(--touch-min)]">
                <Plus className="h-4 w-4" aria-hidden />
                Add first period
              </Button>
            </div>
          ) : null}

          {slots.length > 0 ? (
            <>
              <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <caption className="sr-only">{activeDay} class timetable</caption>
                  <thead>
                    <tr className="border-b bg-slate-50 text-left text-slate-600">
                      <th scope="col" className="py-3 px-4 font-medium w-16">
                        Period
                      </th>
                      <th scope="col" className="py-3 px-4 font-medium">
                        Time
                      </th>
                      <th scope="col" className="py-3 px-4 font-medium">
                        Class
                      </th>
                      <th scope="col" className="py-3 px-4 font-medium">
                        Subject
                      </th>
                      <th scope="col" className="py-3 px-4 font-medium">
                        Teacher
                      </th>
                      <th scope="col" className="py-3 px-4 font-medium">
                        Room
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80">
                        <td className="py-3 px-4">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700 font-semibold text-xs">
                            {s.period}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap tabular-nums">
                          {formatTimeRange(s.timeFrom, s.timeTo)}
                        </td>
                        <td className="py-3 px-4 font-medium">{s.classSection}</td>
                        <td className="py-3 px-4 font-medium text-slate-900">{s.subject}</td>
                        <td className="py-3 px-4">{s.teacher}</td>
                        <td className="py-3 px-4">{s.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="md:hidden space-y-3" aria-label={`${activeDay} schedule`}>
                {slots.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 flex gap-4 shadow-sm"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 font-bold text-sm">
                      {s.period}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{s.subject}</p>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {s.classSection} · {s.teacher}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 tabular-nums">
                        {formatTimeRange(s.timeFrom, s.timeTo)} · {s.room}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
