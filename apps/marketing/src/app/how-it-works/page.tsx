import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion';
import { CtaBanner } from '@/components/sections/cta-banner';
import { Button } from '@/components/ui/button';
import { UserPlus, Settings, Rocket, LineChart } from 'lucide-react';
import { APP_NAME } from '@/lib/pricing-data';

export const metadata: Metadata = {
  title: 'How school ERP onboarding works',
  description: `How ${APP_NAME} works — calculate your plan, start a 7-day trial, set up billing, invite staff & parents, and go live.`,
  alternates: { canonical: '/how-it-works/' },
};

const steps = [
  {
    icon: UserPlus,
    title: 'Register your school',
    desc: 'Complete a short online form with school details, student and staff counts, and your preferred plan.',
  },
  {
    icon: Settings,
    title: 'Automatic school setup',
    desc: 'We create your dedicated school account, user roles, and enabled modules — ready to use without manual IT configuration.',
  },
  {
    icon: Rocket,
    title: 'Invite your team',
    desc: 'Administrators, teachers, and parents sign in with secure OTP on mobile. Student access follows your school policies.',
  },
  {
    icon: LineChart,
    title: 'Operate with confidence',
    desc: 'Attendance alerts, fee reminders, bus tracking, and the AI assistant help your school run efficiently every day.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="gradient-hero section-padding">
        <div className="container-marketing max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-slate-900">How {APP_NAME} works</h1>
          <p className="mt-4 text-lg text-slate-600">
            A clear, guided process from registration to daily operations — designed for school administrators
            and IT teams.
          </p>
        </div>
      </section>
      <section className="section-padding">
        <ol className="container-marketing space-y-8 max-w-3xl">
          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.08}>
              <li className="flex gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white text-xl font-bold">
                  {i + 1}
                </span>
                <div>
                  <step.icon className="h-6 w-6 text-brand-600 mb-2" aria-hidden />
                  <h2 className="text-xl font-semibold text-slate-900">{step.title}</h2>
                  <p className="mt-2 text-slate-600">{step.desc}</p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>
        <div className="container-marketing mt-12 text-center">
          <Button href="/signup" size="lg">
            Start your 7-day free trial
          </Button>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
