import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignupWizard } from '@/components/signup/signup-wizard';

export const metadata: Metadata = {
  title: 'Start 7-day free trial — school management software',
  description:
    'Start your AI School Management 7-day free trial online. Register your school, choose a plan, and onboard staff — no sales call required.',
  alternates: { canonical: '/signup/' },
  openGraph: {
    title: 'Start free school ERP trial',
    description: 'Self-service signup for school admins. Trial ready in minutes.',
    url: '/signup/',
  },
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
            Add your card to start a 7-day free trial. No charge today — billing in advance after trial unless you cancel.
          </p>
        </div>
        <Suspense fallback={<p className="text-center text-slate-500">Loading wizard…</p>}>
          <SignupWizard />
        </Suspense>
      </div>
    </section>
  );
}
