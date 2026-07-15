import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion';
import { CtaBanner } from '@/components/sections/cta-banner';
import { CheckCircle2 } from 'lucide-react';
import { APP_NAME } from '@/lib/pricing-data';

export const metadata: Metadata = {
  title: 'Why schools choose AI School Management',
  description: `Why schools choose ${APP_NAME}: OTP-only security, multi-currency pricing, 18+ modules, admin + parent portal, and AI assistance.`,
  alternates: { canonical: '/why-us/' },
};

const reasons = [
  {
    title: 'Built for education',
    body: `Schools often rely on many separate tools for attendance, fees, transport, and communication. ${APP_NAME} brings these capabilities together in one secure platform with AI built in.`,
  },
  {
    title: 'Clear, fair pricing',
    body: 'Transparent pricing based on student count. Secure OTP login. Support for multiple currencies with Stripe and Razorpay. Your school branding on parent and staff apps.',
  },
  {
    title: 'Designed for families',
    body: 'Parents use one app for fees, bus location, homework, and school notices. Younger students can remain on parent accounts according to your school policy.',
  },
  {
    title: 'Fast to get started',
    body: 'Use the live price calculator, start a 7-day free trial online, and complete setup in minutes — without a lengthy sales process.',
  },
];

const proofs = [
  'Cloud platform for schools worldwide',
  '7 role-based user portals',
  '18 integrated modules',
  'AI assistant and translations',
  'Mobile apps for iOS and Android',
  'Enterprise-grade data security',
];

export default function WhyUsPage() {
  return (
    <>
      <section className="gradient-hero section-padding">
        <div className="container-marketing max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-slate-900">Why {APP_NAME}</h1>
          <p className="mt-4 text-lg text-slate-600">
            Modern school software with the reliability and clarity your administration team expects.
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
              <h2 className="text-2xl font-bold font-display">Platform highlights</h2>
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
