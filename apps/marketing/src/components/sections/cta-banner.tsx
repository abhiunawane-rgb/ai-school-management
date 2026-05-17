import { Button } from '@/components/ui/button';

export function CtaBanner() {
  return (
    <section className="section-padding" aria-labelledby="cta-heading">
      <div className="container-marketing">
        <div className="gradient-cta rounded-3xl px-8 py-12 sm:px-12 sm:py-16 text-center text-white shadow-glow">
          <h2 id="cta-heading" className="font-display text-3xl font-bold sm:text-4xl">
            Ready to transform your school?
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            7-day free trial (self-service — not a sales demo). Calculate your exact plan in 60 seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/signup" variant="secondary" size="lg" className="bg-white text-brand-700">
              Start 7-day trial
            </Button>
            <Button href="/pricing#calculator" variant="outline" size="lg">
              Calculate pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
