import type { Metadata } from 'next';
import { FEATURE_LABELS } from '@/lib/pricing-data';
import { FEATURE_KEYS } from '@ai-school/shared';
import { FadeIn } from '@/components/motion';
import { CtaBanner } from '@/components/sections/cta-banner';
import {
  Calendar,
  CreditCard,
  Bus,
  Brain,
  MessageSquare,
  Camera,
  Video,
  Bell,
  Languages,
  FileText,
  BarChart3,
  ClipboardList,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Full feature list for AI School Management — attendance, fees, AI, bus tracking, and more.',
};

const icons: Record<string, typeof Calendar> = {
  attendance: Calendar,
  timetable: ClipboardList,
  homework: FileText,
  notices: Bell,
  results: BarChart3,
  fees: CreditCard,
  social_feed: MessageSquare,
  events: Calendar,
  photo_gallery: Camera,
  bus_tracking: Bus,
  ai_chatbot: Brain,
  online_classes: Video,
  analytics: BarChart3,
  reports: FileText,
  push_notifications: Bell,
  whatsapp_alerts: MessageSquare,
  ai_translations: Languages,
  multi_language: Languages,
};

export default function FeaturesPage() {
  return (
    <>
      <section className="gradient-hero section-padding">
        <div className="container-marketing text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
            What we do
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            18 integrated modules. Toggle only what you need. Pay for students and features — not unused bloat.
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-marketing grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_KEYS.map((key, i) => {
            const Icon = icons[key] ?? Calendar;
            const meta = FEATURE_LABELS[key];
            return (
              <FadeIn key={key} delay={(i % 6) * 0.05}>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 h-full hover:border-brand-300 hover:shadow-card transition-all">
                  <Icon className="h-8 w-8 text-brand-600" aria-hidden />
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">{meta.label}</h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{meta.desc}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
