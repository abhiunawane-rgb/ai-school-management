import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion';
import { CtaBanner } from '@/components/sections/cta-banner';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why us',
  description: 'Why schools choose AI School Management over fragmented tools.',
};

const reasons = [
  {
    title: 'Why we built it',
    body: 'Schools juggle 10+ apps for attendance, fees, transport, and communication. We unified them with AI — like leading platforms Entrar and modern work OS products, but purpose-built for education.',
  },
  {
    title: 'Why schools switch',
    body: 'Transparent slab pricing by student count. OTP-only security. White-label for your brand. Multi-country currency with Stripe and Razorpay.',
  },
  {
    title: 'Why parents love it',
    body: 'One app for fees, bus location, homework, and notices. Grade-smart student login keeps younger children on parent accounts.',
  },
  {
    title: 'Why decisions are faster',
    body: 'Live calculator, 7-day trial, and autopilot onboarding — no week-long sales cycles. Visual hierarchy and familiar patterns reduce cognitive load.',
  },
];

const proofs = [
  'Multi-tenant global SaaS',
  '7 role-based portals',
  '18 feature modules',
  'AI assistant + translations',
  'Offline-ready mobile app',
  'Enterprise Firestore security',
];

export default function WhyUsPage() {
  return (
    <>
      <section className="gradient-hero section-padding">
        <div className="container-marketing max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-slate-900">Why AI School Management</h1>
          <p className="mt-4 text-lg text-slate-600">
            What we believe, why it matters, and how we help you decide with confidence.
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-marketing grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            {reasons.map((r, i) => (
              <FadeIn key={r.title} delay={i * 0.06}>
                <article className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-xl font-semibold text-slate-900">{r.title}</h2>
                  <p className="mt-2 text-slate-600 leading-relaxed">{r.body}</p>
                </article>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <aside className="rounded-2xl gradient-cta p-8 text-white h-fit sticky top-24">
              <h2 className="text-2xl font-bold font-display">Best-in-market checklist</h2>
              <ul className="mt-6 space-y-3">
                {proofs.map((p) => (
                  <li key={p} className="flex gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </aside>
          </FadeIn>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
