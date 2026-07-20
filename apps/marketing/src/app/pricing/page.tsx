import type { Metadata } from 'next';
import { PlanCalculator } from '@/components/pricing/plan-calculator';
import { CtaBanner } from '@/components/sections/cta-banner';
import { APP_NAME, TRIAL_DAYS } from '@/lib/pricing-data';

export const metadata: Metadata = {
  title: 'School ERP pricing calculator — INR, USD, EUR, GBP, AED',
  description: `Transparent school management pricing by student count. Monthly or yearly plans with optional modules. ${TRIAL_DAYS}-day free trial on ${APP_NAME}.`,
  alternates: { canonical: '/pricing/' },
  openGraph: {
    title: 'Pricing & plan calculator | AI School Management',
    description: 'Calculate school ERP cost by students, staff, and add-ons. Multi-currency billing.',
    url: '/pricing/',
  },
};

export default function PricingPage() {
  return (
    <>
      <section className="gradient-hero section-padding pb-8">
        <div className="container-marketing text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
            {APP_NAME} pricing
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Market-aligned pricing that rises with each plan — Starter, Growth, then Enterprise — with launch
            discounts vs list rates. Add paid modules as needed. {TRIAL_DAYS}-day self-service trial; billing
            starts after trial unless you cancel.
          </p>
        </div>
      </section>

      <section className="section-padding pt-0" id="calculator">
        <div className="container-marketing">
          <PlanCalculator />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
