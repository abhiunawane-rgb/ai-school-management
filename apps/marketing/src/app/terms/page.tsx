import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  return (
    <article className="section-padding">
      <div className="container-marketing max-w-3xl prose prose-slate">
        <h1 className="font-display text-4xl font-bold">Terms of Use</h1>
        <p className="text-slate-600 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-6 text-slate-700 leading-relaxed">
          By using AI School Management you agree to these terms. Subscriptions are billed per the plan
          selected in our pricing calculator. Trials convert to paid plans unless canceled.
        </p>
        <h2 className="text-xl font-semibold mt-8">Service</h2>
        <p className="text-slate-700 mt-2">
          We provide school management software on a subscription basis. Availability targets 99.9% uptime
          excluding scheduled maintenance.
        </p>
      </div>
    </article>
  );
}
