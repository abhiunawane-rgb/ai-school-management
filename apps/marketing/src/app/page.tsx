import { Hero } from '@/components/sections/hero';
import { Stakeholders } from '@/components/sections/stakeholders';
import { FeaturesPreview } from '@/components/sections/features-preview';
import { CtaBanner } from '@/components/sections/cta-banner';
import { PlanCalculator } from '@/components/pricing/plan-calculator';
import { FadeIn } from '@/components/motion';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stakeholders />
      <FeaturesPreview />
      <section className="section-padding bg-white" id="calculator">
        <div className="container-marketing">
          <FadeIn className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900">
              Calculate your plan in seconds
            </h2>
            <p className="mt-3 text-slate-600">
              Transparent pricing by student count. Add modules. See your estimated cost instantly — no sales call required.
            </p>
          </FadeIn>
          <PlanCalculator />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
