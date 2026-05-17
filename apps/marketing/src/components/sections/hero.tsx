'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="gradient-hero relative overflow-hidden">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="container-marketing section-padding relative">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm"
          >
            <Zap className="h-4 w-4" aria-hidden />
            AI-powered · Secure · Global
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            The one platform that has{' '}
            <span className="text-gradient">everything your school needs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-slate-600 sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Unify attendance, fees, bus tracking, online classes, and AI for administrators,
            teachers, parents, and students — one platform, one secure login.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href="/signup" size="lg" className="w-full sm:w-auto gap-2">
              Start 7-day trial
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href="/pricing#calculator" variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
              <Play className="h-4 w-4" aria-hidden />
              Calculate your plan
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-600"
          >
            {[
              { icon: Shield, text: 'OTP-only secure login' },
              { icon: Globe, text: '50+ countries · Multi-currency' },
              { icon: Zap, text: '7-day free trial' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-brand-600" aria-hidden />
                {text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mx-auto mt-16 max-w-5xl rounded-2xl border border-slate-200/80 bg-white p-2 shadow-glow"
        >
          <div className="rounded-xl bg-gradient-to-br from-slate-900 to-brand-900 p-8 sm:p-12 text-white">
            <div className="grid gap-6 sm:grid-cols-3 text-center">
              {[
                { value: '18+', label: 'Modules' },
                { value: '7', label: 'User roles' },
                { value: '99.9%', label: 'Uptime SLA' },
              ].map((stat) => (
                <motion.div key={stat.label} whileHover={{ scale: 1.05 }}>
                  <p className="text-3xl font-bold font-display">{stat.value}</p>
                  <p className="mt-1 text-sm text-brand-200">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-brand-100">
              Enterprise-ready — transparent pricing by student and staff count
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
