'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getLoginUrl } from '@/lib/site-urls';
import { FadeIn } from '@/components/motion';

export function CtaBanner() {
  return (
    <section className="section-padding" aria-labelledby="cta-heading">
      <div className="container-marketing">
        <FadeIn>
          <motion.div
            className="gradient-cta rounded-3xl px-8 py-12 sm:px-12 sm:py-16 text-center text-white shadow-glow relative overflow-hidden"
            whileHover={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 40%), radial-gradient(circle at 80% 50%, white 0%, transparent 35%)',
              }}
              animate={{ opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <div className="relative">
              <h2 id="cta-heading" className="font-display text-3xl font-bold sm:text-4xl">
                Ready to transform your school?
              </h2>
              <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
                The full website is working properly today — start your 7-day trial and onboard your school now.
                iOS & Android apps are under progress and will be ready for all roles soon.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/signup" variant="secondary" size="lg" className="bg-white text-brand-700">
                  Start 7-day trial
                </Button>
                <Button href="/pricing#calculator" variant="outline" size="lg">
                  Calculate pricing
                </Button>
                <a
                  href={getLoginUrl()}
                  className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-white/80 px-8 text-base font-semibold text-white hover:bg-white/10 transition-all min-w-[48px]"
                >
                  Sign in
                </a>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
