import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for AI School Management — how we handle school, staff, and parent data.',
  alternates: { canonical: '/privacy/' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <article className="section-padding">
      <div className="container-marketing max-w-3xl prose prose-slate">
        <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
        <p className="text-slate-600 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-6 text-slate-700 leading-relaxed">
          AI School Management (&quot;we&quot;) processes school, staff, parent, and student data to provide
          educational software services. We use OTP authentication via Twilio, store data in Firebase, and comply
          with applicable data protection laws.
        </p>
        <h2 className="text-xl font-semibold mt-8">Data we collect</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-700">
          <li>Phone numbers for OTP login</li>
          <li>School and academic records you enter</li>
          <li>Usage analytics to improve the product</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8">Contact</h2>
        <p className="text-slate-700">hello@aischool.app</p>
      </div>
    </article>
  );
}
