import { Hero } from '@/components/sections/hero';
import { TrustBar } from '@/components/sections/trust-bar';
import { SchoolSizes } from '@/components/sections/school-sizes';
import { Stakeholders } from '@/components/sections/stakeholders';
import { FeaturesPreview } from '@/components/sections/features-preview';
import { ExplorePlatform } from '@/components/sections/explore-platform';
import { HowItWorksPreview } from '@/components/sections/how-it-works-preview';
import { GlobalReach } from '@/components/sections/global-reach';
import { SubscriptionJourney } from '@/components/sections/subscription-journey';
import { PlatformStatus } from '@/components/sections/platform-status';
import { CtaBanner } from '@/components/sections/cta-banner';
import { PlanCalculator } from '@/components/pricing/plan-calculator';
import { FadeIn } from '@/components/motion';
import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — Global AI-Powered School ERP` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <PlatformStatus />
      <SchoolSizes />
      <Stakeholders />
      <FeaturesPreview />
      <ExplorePlatform />
      <HowItWorksPreview />
      <GlobalReach />
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
      <SubscriptionJourney />
      <CtaBanner />
    </>
  );
}
