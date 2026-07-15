'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';
import { AnimatedCounter } from '@/components/motion';
import { Globe2, Coins, Clock, Cloud } from 'lucide-react';
import { Icon3D } from '@/components/ui/icon-3d';

const regions = [
  { name: 'South Asia', x: '68%', y: '42%', delay: 0 },
  { name: 'Middle East', x: '58%', y: '38%', delay: 0.1 },
  { name: 'Europe', x: '48%', y: '28%', delay: 0.2 },
  { name: 'Americas', x: '22%', y: '38%', delay: 0.3 },
  { name: 'Africa', x: '50%', y: '55%', delay: 0.4 },
  { name: 'APAC', x: '78%', y: '48%', delay: 0.5 },
];

const stats = [
  { icon: Globe2, value: 50, suffix: '+', label: 'Countries supported', color: 'bg-blue-100 text-blue-700' },
  { icon: Coins, value: 5, suffix: '', label: 'Billing currencies', color: 'bg-emerald-100 text-emerald-700' },
  { icon: Clock, value: 24, suffix: '/7', label: 'Cloud availability', color: 'bg-amber-100 text-amber-700' },
  { icon: Cloud, value: 99.9, suffix: '%', label: 'Uptime SLA', color: 'bg-violet-100 text-violet-700' },
];

export function GlobalReach() {
  return (
    <section className="section-padding bg-slate-900 text-white overflow-hidden" aria-labelledby="global-heading">
      <div className="container-marketing">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <FadeIn>
            <h2 id="global-heading" className="font-display text-3xl font-bold sm:text-4xl">
              One platform for schools worldwide
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              From CBSE schools in India to IB campuses in Dubai and public districts in the US — same login,
              same modules, pricing in your local currency.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <Icon3D icon={s.icon} className={s.color} size="sm" />
                  <p className="mt-3 text-2xl font-bold font-display">
                    {s.suffix === '%' ? (
                      <>{s.value}{s.suffix}</>
                    ) : (
                      <AnimatedCounter value={s.value} suffix={s.suffix} />
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="relative">
            <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-brand-900 to-slate-800 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_40%,#6366f1_0%,transparent_50%)]" />
              <Globe2 className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 text-brand-400/40" />
              {regions.map((r) => (
                <motion.span
                  key={r.name}
                  title={r.name}
                  className="absolute h-3 w-3 rounded-full bg-teal-400 shadow-[0_0_12px_#2dd4bf]"
                  style={{ left: r.x, top: r.y }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: [1, 1.35, 1], opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: r.delay, duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
              <p className="absolute bottom-4 left-4 right-4 text-center text-xs text-slate-400">
                Schools active across 6 continents · Data hosted on secure cloud
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
