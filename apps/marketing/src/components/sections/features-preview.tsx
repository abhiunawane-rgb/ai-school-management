'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/motion';
import { APP_NAME } from '@/lib/pricing-data';
import {
  Bus,
  Brain,
  CreditCard,
  Calendar,
  MessageSquare,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

const features = [
  { icon: Calendar, title: 'Attendance & timetable', color: 'bg-blue-100 text-blue-700' },
  { icon: CreditCard, title: 'Fees & payments', color: 'bg-emerald-100 text-emerald-700' },
  { icon: Bus, title: 'Bus tracking', color: 'bg-amber-100 text-amber-700' },
  { icon: Brain, title: 'AI assistant', color: 'bg-violet-100 text-violet-700' },
  { icon: MessageSquare, title: 'Social feed & events', color: 'bg-pink-100 text-pink-700' },
  { icon: BarChart3, title: 'Analytics & reports', color: 'bg-slate-100 text-slate-700' },
];

export function FeaturesPreview() {
  return (
    <section className="section-padding bg-slate-50" aria-labelledby="features-preview-heading">
      <div className="container-marketing">
        <FadeIn className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 id="features-preview-heading" className="font-display text-3xl font-bold text-slate-900">
              Everything in one ecosystem
            </h2>
            <p className="mt-2 text-slate-600 max-w-xl">
              Replace disconnected systems with one integrated platform from {APP_NAME}.
            </p>
          </div>
          <Link
            href="/features"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 min-h-[44px]"
          >
            View all features <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.05}>
              <article className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-card-hover transition-all">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors pt-2">
                  {f.title}
                </h3>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
