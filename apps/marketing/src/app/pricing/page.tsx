import type { Metadata } from 'next';
import { PlanCalculator } from '@/components/pricing/plan-calculator';
import { CtaBanner } from '@/components/sections/cta-banner';
import { APP_NAME, TRIAL_DAYS } from '@/lib/pricing-data';

export const metadata: Metadata = {
  title: 'Pricing',
  description: `Flexible plans and optional modules. ${TRIAL_DAYS}-day free trial on ${APP_NAME}.`,
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
            Select currency, compare every feature, add paid modules, and see your live total.{' '}
            {TRIAL_DAYS}-day self-service trial — subscription starts automatically after trial unless
            canceled.
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
