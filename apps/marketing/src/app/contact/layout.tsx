import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact school software sales',
  description:
    'Contact AI School Management for demos, pricing questions, partnerships, and support. We help schools in India and worldwide start a 7-day free trial.',
  alternates: { canonical: '/contact/' },
  openGraph: {
    title: 'Contact AI School Management',
    description: 'Talk to us about school ERP pricing, demos, and onboarding.',
    url: '/contact/',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
