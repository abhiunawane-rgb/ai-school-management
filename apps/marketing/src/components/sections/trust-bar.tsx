'use client';

import { motion } from 'framer-motion';
import { Building2, Globe2, Languages, ShieldCheck, Smartphone } from 'lucide-react';

const items = [
  { icon: Building2, label: 'Any school size', sub: '50 to 50,000+ students' },
  { icon: Globe2, label: '50+ countries', sub: 'INR · USD · EUR · GBP · AED' },
  { icon: Languages, label: 'Multi-language UI', sub: 'Parents & staff worldwide' },
  { icon: Smartphone, label: 'Web live today', sub: 'iOS & Android — coming soon' },
  { icon: ShieldCheck, label: 'OTP-only login', sub: 'Secure by design' },
];

export function TrustBar() {
  return (
    <section className="border-y border-slate-200/80 bg-white/90 backdrop-blur-sm" aria-label="Platform trust highlights">
      <div className="container-marketing py-6">
        <div className="flex gap-6 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex min-w-[200px] snap-start items-center gap-3 shrink-0"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
