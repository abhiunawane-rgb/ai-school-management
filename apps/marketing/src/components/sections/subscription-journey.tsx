'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { Button } from '@/components/ui/button';

const perks = [
  '7-day free trial — no credit card to explore',
  'Cancel anytime · upgrade as you grow',
  'All roles included — admin, teacher, parent, student, driver',
  'Mobile app + browser portal for every user',
  'Multi-currency billing for international schools',
];

export function SubscriptionJourney() {
  return (
    <section className="section-padding bg-white" aria-labelledby="subscribe-heading">
      <div className="container-marketing">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
              <Sparkles className="h-4 w-4" aria-hidden />
              Simple subscription
            </span>
            <h2 id="subscribe-heading" className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              Start small. Scale to thousands of students.
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Pay only for active students and the modules you enable. Add branches, transport, or AI when
              you are ready — pricing updates transparently in the calculator.
            </p>
            <ul className="mt-8 space-y-3">
              {perks.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 text-sm text-slate-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {p}
                </motion.li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.1}>
            <motion.div
              className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-8 shadow-card"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <p className="text-sm font-medium text-brand-700">Recommended path</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-slate-900">Try → Calculate → Subscribe</h3>
              <div className="mt-6 space-y-4">
                {[
                  { step: '1', label: 'Explore features & pricing', href: '/features' },
                  { step: '2', label: 'Run the plan calculator', href: '/pricing#calculator' },
                  { step: '3', label: 'Complete signup & payment', href: '/signup' },
                ].map((item) => (
                  <Link
                    key={item.step}
                    href={item.href}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300 hover:shadow-sm transition-all min-h-11"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                      {item.step}
                    </span>
                    <span className="font-medium text-slate-900">{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button href="/signup" size="lg" className="flex-1">
                  Start 7-day trial
                </Button>
                <Button href="/contact" variant="secondary" size="lg" className="flex-1">
                  Talk to us
                </Button>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
