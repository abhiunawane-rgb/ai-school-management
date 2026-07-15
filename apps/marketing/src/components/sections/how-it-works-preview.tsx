'use client';

import Link from 'next/link';
import { ArrowRight, Calculator, CreditCard, Rocket, UserPlus } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { Icon3D } from '@/components/ui/icon-3d';
import { Button } from '@/components/ui/button';

const steps = [
  {
    icon: Calculator,
    color: 'bg-blue-100 text-blue-700',
    title: 'Calculate your plan',
    desc: 'Pick student count, modules, and currency — see exact pricing instantly.',
    href: '/pricing#calculator',
    cta: 'Open calculator',
  },
  {
    icon: UserPlus,
    color: 'bg-emerald-100 text-emerald-700',
    title: 'Start 7-day trial',
    desc: 'Register your school online. No sales call. Setup in minutes.',
    href: '/signup',
    cta: 'Sign up free',
  },
  {
    icon: CreditCard,
    color: 'bg-violet-100 text-violet-700',
    title: 'Choose billing',
    desc: 'Pay monthly or yearly in INR, USD, EUR, GBP, or AED.',
    href: '/pricing',
    cta: 'View plans',
  },
  {
    icon: Rocket,
    color: 'bg-amber-100 text-amber-700',
    title: 'Go live',
    desc: 'Invite staff and parents. They can use the app or any phone browser.',
    href: '/how-it-works',
    cta: 'See how it works',
  },
];

export function HowItWorksPreview() {
  return (
    <section className="section-padding bg-slate-50" aria-labelledby="how-preview-heading">
      <div className="container-marketing">
        <FadeIn className="text-center max-w-2xl mx-auto">
          <h2 id="how-preview-heading" className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            From signup to live school in four steps
          </h2>
          <p className="mt-4 text-slate-600">
            Self-service onboarding designed for busy principals — small schools and large groups alike.
          </p>
        </FadeIn>

        <div className="mt-12 relative">
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-teal-400 -translate-y-1/2" aria-hidden />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.08}>
                <li className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 h-full hover:shadow-card-hover transition-shadow">
                  <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <Icon3D icon={step.icon} className={step.color} size="md" float />
                  <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 flex-1">{step.desc}</p>
                  <Link
                    href={step.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 min-h-11"
                  >
                    {step.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>

        <FadeIn className="mt-10 text-center">
          <Button href="/how-it-works" variant="secondary" size="lg" className="gap-2">
            Full onboarding guide
            <ArrowRight className="h-4 w-4" />
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
