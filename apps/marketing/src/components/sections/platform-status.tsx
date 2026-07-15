'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Globe, Smartphone, Apple, Play, Sparkles, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { getLoginUrl } from '@/lib/site-urls';

const webLive = [
  'Sign up & 7-day trial',
  'Unified OTP login for all roles',
  'Admin dashboard & parent portal',
  'Fees, attendance, homework & more',
  'AI assistant with live school data',
];

export function PlatformStatus() {
  return (
    <section
      className="section-padding bg-gradient-to-b from-emerald-50/80 via-white to-white border-y border-emerald-100/80"
      aria-labelledby="platform-status-heading"
      id="platform-status"
    >
      <div className="container-marketing">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-800">
            <Sparkles className="h-4 w-4" aria-hidden />
            Platform update
          </span>
          <h2 id="platform-status-heading" className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Full website is <span className="text-emerald-700">live & working</span> today
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Sign up, manage your school, and let staff & families sign in — everything runs in the browser right now.
            Native <strong className="text-slate-800">iOS</strong> and <strong className="text-slate-800">Android</strong> apps
            are <strong className="text-slate-800">under active development</strong> and will be ready for everyone soon.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-emerald-200 bg-white p-6 sm:p-8 shadow-card relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 rounded-bl-2xl bg-emerald-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              Live now
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Globe className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">Web platform</h3>
                <p className="text-sm text-emerald-700 font-medium">Fully working · Use today</p>
              </div>
            </div>
            <ul className="mt-6 space-y-2.5">
              {webLive.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/signup" size="md" className="gap-2">
                Start free trial
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <a
                href={getLoginUrl()}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sign in
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 rounded-bl-2xl bg-amber-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              In progress
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                <Smartphone className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">iOS & Android apps</h3>
                <p className="text-sm text-amber-700 font-medium">Under development · Coming soon for all</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-600 leading-relaxed">
              We are building native mobile apps for parents, teachers, students, and drivers — the same secure OTP login
              and features you use on the web. Early builds are in testing; public release for all schools is coming soon.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 opacity-90">
                <Apple className="h-8 w-8 text-slate-800" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-slate-900">iOS app</p>
                  <p className="text-xs text-amber-700 font-medium">In progress</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 opacity-90">
                <Play className="h-8 w-8 text-slate-800" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Android app</p>
                  <p className="text-xs text-amber-700 font-medium">In progress</p>
                </div>
              </div>
            </div>
            <p className="mt-5 text-xs text-slate-500">
              Until store launch, use the website on any phone — it is mobile-optimized and works like an app in your browser.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
