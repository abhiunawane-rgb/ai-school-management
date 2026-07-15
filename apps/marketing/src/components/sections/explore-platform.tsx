'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Brain,
  Bus,
  Calendar,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
} from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { Icon3D } from '@/components/ui/icon-3d';
import { Button } from '@/components/ui/button';

const tabs = [
  {
    id: 'admin',
    label: 'Admin dashboard',
    icon: LayoutDashboard,
    color: 'bg-brand-100 text-brand-700',
    headline: 'Command center for principals & admins',
    bullets: ['Fees, attendance & analytics at a glance', 'Module toggles per plan', 'Multi-branch overview'],
    stat: { value: '18+', label: 'Modules' },
  },
  {
    id: 'teacher',
    label: 'Teachers',
    icon: GraduationCap,
    color: 'bg-blue-100 text-blue-700',
    headline: 'Mark attendance, assign homework, run classes',
    bullets: ['Timetable & class roster', 'Homework & results', 'Online class links'],
    stat: { value: '2 min', label: 'Daily roll call' },
  },
  {
    id: 'parent',
    label: 'Parents',
    icon: MessageSquare,
    color: 'bg-pink-100 text-pink-700',
    headline: 'Stay connected from any phone',
    bullets: ['Fee dues & payment history', 'Bus live tracking', 'Notices & social feed'],
    stat: { value: 'OTP', label: 'Secure login' },
  },
  {
    id: 'ai',
    label: 'AI assistant',
    icon: Brain,
    color: 'bg-violet-100 text-violet-700',
    headline: 'Smart help for staff and families',
    bullets: ['Answer policy questions', 'Homework hints for students', 'Admin insights on demand'],
    stat: { value: '24/7', label: 'Available' },
  },
];

const miniIcons = [Calendar, CreditCard, Bus, BarChart3];

export function ExplorePlatform() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <section className="section-padding bg-white overflow-hidden" aria-labelledby="explore-heading">
      <div className="container-marketing">
        <FadeIn className="text-center max-w-2xl mx-auto">
          <h2 id="explore-heading" className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Explore the platform
          </h2>
          <p className="mt-4 text-slate-600">
            Tap each role to see what your school community gets. The <strong className="text-slate-800">website is fully working now</strong>;
            native iOS & Android apps are in progress for everyone soon.
          </p>
        </FadeIn>

        <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Platform roles">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => setActive(tab.id)}
              className={`touch-target rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                active === tab.id
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            role="tabpanel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center rounded-3xl border border-slate-200 bg-slate-50/80 p-8 lg:p-10"
          >
            <div>
              <Icon3D icon={current.icon} className={current.color} size="lg" float />
              <h3 className="mt-5 font-display text-2xl font-bold text-slate-900">{current.headline}</h3>
              <ul className="mt-4 space-y-2">
                {current.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/signup" size="md">
                  Start trial
                </Button>
                <Button href="/features" variant="secondary" size="md">
                  All features
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-900 to-brand-900 p-6 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_70%_30%,#818cf8_0%,transparent_55%)]" />
              <p className="relative text-sm text-brand-200">Live preview</p>
              <p className="relative mt-2 text-4xl font-bold font-display">{current.stat.value}</p>
              <p className="relative text-brand-200">{current.stat.label}</p>
              <div className="relative mt-8 flex gap-3">
                {miniIcons.map((Icon, i) => (
                  <motion.div
                    key={i}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ delay: i * 0.2, duration: 3, repeat: Infinity }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
