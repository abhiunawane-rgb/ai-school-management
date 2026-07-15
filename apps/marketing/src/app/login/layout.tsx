import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in — school admin, teacher, parent, student, driver',
  description:
    'Secure OTP login for AI School Management. One mobile number for school admins, teachers, parents, students, and drivers.',
  alternates: { canonical: '/login/' },
  robots: { index: true, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
