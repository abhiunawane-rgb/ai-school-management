import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignupWizard } from '@/components/signup/signup-wizard';

export const metadata: Metadata = {
  title: 'Start 7-day trial',
  description:
    'Self-service 7-day trial on AI School Management — school profile, plan, and subscription setup in minutes.',
};

export default function SignupPage() {
  return (
    <section className="section-padding gradient-hero min-h-[70vh]">
      <div className="container-marketing">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Start your 7-day free trial
          </h1>
          <p className="mt-2 text-slate-600">
            Self-service subscription — not a sales demo. Billing starts after 7 days unless you cancel.
          </p>
        </div>
        <Suspense fallback={<p className="text-center text-slate-500">Loading wizard…</p>}>
          <SignupWizard />
        </Suspense>
      </div>
    </section>
  );
}
