'use client';

import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion';
import { GraduationCap, Users, Heart, Bus, Shield } from 'lucide-react';

const roles = [
  { icon: Shield, title: 'School leadership', desc: 'Analytics, billing, multi-branch control' },
  { icon: Users, title: 'Teachers', desc: 'Attendance, homework, results, online classes' },
  { icon: Heart, title: 'Parents', desc: 'Fees, bus tracking, notices, social feed' },
  { icon: GraduationCap, title: 'Students', desc: 'Grade-smart login, classes, AI help' },
  { icon: Bus, title: 'Drivers', desc: 'Live GPS updates for parent peace of mind' },
];

export function Stakeholders() {
  return (
    <section className="section-padding bg-white" aria-labelledby="stakeholders-heading">
      <div className="container-marketing">
        <FadeIn className="text-center max-w-2xl mx-auto">
          <h2 id="stakeholders-heading" className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            One platform for your entire school community
          </h2>
          <p className="mt-4 text-slate-600">
            Purpose-built access for leadership, staff, parents, students, and transport — each with the tools they need.
          </p>
        </FadeIn>
        <StaggerChildren className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {roles.map((r) => (
            <StaggerItem key={r.title}>
              <article className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center hover:shadow-card-hover hover:border-brand-200 transition-all h-full">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <r.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{r.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{r.desc}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
