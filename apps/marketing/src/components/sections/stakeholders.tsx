'use client';

import { motion } from 'framer-motion';
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion';
import { Icon3D } from '@/components/ui/icon-3d';
import { getLoginUrl } from '@/lib/site-urls';
import { GraduationCap, Users, Heart, Bus, Shield, ArrowRight } from 'lucide-react';

const roles = [
  { icon: Shield, title: 'School leadership', desc: 'Analytics, billing, multi-branch control', color: 'bg-brand-100 text-brand-700' },
  { icon: Users, title: 'Teachers', desc: 'Attendance, homework, results, online classes', color: 'bg-blue-100 text-blue-700' },
  { icon: Heart, title: 'Parents', desc: 'Fees, bus tracking, notices, social feed', color: 'bg-pink-100 text-pink-700' },
  { icon: GraduationCap, title: 'Students', desc: 'Grade-smart login, classes, AI help', color: 'bg-violet-100 text-violet-700' },
  { icon: Bus, title: 'Drivers', desc: 'Live GPS updates for parent peace of mind', color: 'bg-amber-100 text-amber-700' },
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
              <motion.article
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center hover:shadow-card-hover hover:border-brand-200 transition-all h-full flex flex-col items-center"
              >
                <Icon3D icon={r.icon} className={r.color} size="md" float />
                <h3 className="mt-4 font-semibold text-slate-900">{r.title}</h3>
                <p className="mt-2 text-sm text-slate-600 flex-1">{r.desc}</p>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerChildren>
        <FadeIn className="mt-10 text-center">
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 min-h-11"
          >
            Sign in with your mobile number
            <ArrowRight className="h-4 w-4" />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
