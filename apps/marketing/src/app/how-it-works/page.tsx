import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion';
import { CtaBanner } from '@/components/sections/cta-banner';
import { Button } from '@/components/ui/button';
import { UserPlus, Settings, Rocket, LineChart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'How AI School Management works — signup, setup, and go live on autopilot.',
};

const steps = [
  {
    icon: UserPlus,
    title: 'Sign up in minutes',
    desc: 'Enter school details, student & teacher counts. Our wizard configures your plan automatically.',
  },
  {
    icon: Settings,
    title: 'We provision your tenant',
    desc: 'Multi-tenant workspace, roles, and feature flags are created instantly — no manual IT setup.',
  },
  {
    icon: Rocket,
    title: 'Invite stakeholders',
    desc: 'Admins, teachers, parents get OTP login links. Students follow grade-based access rules.',
  },
  {
    icon: LineChart,
    title: 'Run on autopilot',
    desc: 'Attendance alerts, fee reminders, bus GPS, and AI assistant work 24/7 with minimal admin effort.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="gradient-hero section-padding">
        <div className="container-marketing max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-slate-900">How we do it</h1>
          <p className="mt-4 text-lg text-slate-600">
            From signup to live school — a guided, automatic journey. Matches how you already think about
            onboarding (real-world mental model).
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
            Start automated onboarding
          </Button>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
