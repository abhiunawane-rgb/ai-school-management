'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building, School, University } from 'lucide-react';
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion';
import { Icon3D } from '@/components/ui/icon-3d';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    icon: School,
    color: 'bg-emerald-100 text-emerald-700',
    title: 'Small & boutique schools',
    range: '50 – 300 students',
    desc: 'Private academies, preschools, and single-campus schools. Start with essentials — attendance, fees, notices — and grow.',
    plan: 'starter',
    students: 150,
    cta: 'Explore Starter',
  },
  {
    icon: Building,
    color: 'bg-brand-100 text-brand-700',
    title: 'Growing schools',
    range: '300 – 2,000 students',
    desc: 'K-12 schools adding grades, transport, and online classes. Full academic suite with optional AI and analytics.',
    plan: 'growth',
    students: 500,
    cta: 'Explore Growth',
    popular: true,
  },
  {
    icon: University,
    color: 'bg-violet-100 text-violet-700',
    title: 'Large & multi-branch',
    range: '2,000+ students',
    desc: 'Groups, international schools, and districts. Enterprise modules, WhatsApp alerts, bus GPS, and dedicated support.',
    plan: 'enterprise',
    students: 2500,
    cta: 'Explore Enterprise',
  },
];

export function SchoolSizes() {
  return (
    <section className="section-padding bg-white" aria-labelledby="school-sizes-heading">
      <div className="container-marketing">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <h2 id="school-sizes-heading" className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Built for every school — anywhere in the world
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Whether you run a neighborhood preschool or a multi-city school group, pricing scales with your
            student count. No enterprise sales call required to get started.
          </p>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <StaggerItem key={t.title}>
              <motion.article
                whileHover={{ y: -6 }}
                className={`relative flex flex-col rounded-3xl border bg-slate-50/50 p-6 h-full transition-shadow hover:shadow-card-hover ${
                  t.popular ? 'border-brand-300 ring-2 ring-brand-100' : 'border-slate-200'
                }`}
              >
                {t.popular ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Most popular
                  </span>
                ) : null}
                <Icon3D icon={t.icon} className={t.color} size="lg" float />
                <h3 className="mt-5 font-display text-xl font-semibold text-slate-900">{t.title}</h3>
                <p className="text-sm font-medium text-brand-700 mt-1">{t.range}</p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">{t.desc}</p>
                <div className="mt-6 flex flex-col gap-2">
                  <Button
                    href={`/pricing?plan=${t.plan}&students=${t.students}#calculator`}
                    size="md"
                    variant={t.popular ? 'primary' : 'secondary'}
                    className="w-full gap-2"
                  >
                    {t.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Link
                    href="/signup"
                    className="text-center text-sm font-medium text-brand-600 hover:underline min-h-11 flex items-center justify-center"
                  >
                    Start free trial →
                  </Link>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
