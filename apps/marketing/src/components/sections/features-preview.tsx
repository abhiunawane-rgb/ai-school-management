'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';
import { Icon3D } from '@/components/ui/icon-3d';
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
  { icon: Calendar, title: 'Attendance & timetable', color: 'bg-blue-100 text-blue-700', href: '/features#attendance' },
  { icon: CreditCard, title: 'Fees & payments', color: 'bg-emerald-100 text-emerald-700', href: '/features#fees' },
  { icon: Bus, title: 'Bus tracking', color: 'bg-amber-100 text-amber-700', href: '/features#transport' },
  { icon: Brain, title: 'AI assistant', color: 'bg-violet-100 text-violet-700', href: '/features#ai' },
  { icon: MessageSquare, title: 'Social feed & events', color: 'bg-pink-100 text-pink-700', href: '/features#communication' },
  { icon: BarChart3, title: 'Analytics & reports', color: 'bg-slate-100 text-slate-700', href: '/features#analytics' },
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
              <motion.article
                whileHover={{ y: -4 }}
                className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-card-hover transition-all h-full"
              >
                <Link href={f.href} className="flex gap-4 flex-1 min-h-11">
                  <Icon3D icon={f.icon} className={f.color} size="sm" />
                  <div className="pt-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {f.title}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
