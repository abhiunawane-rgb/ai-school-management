import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

const links = {
  Product: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/how-it-works', label: 'How it works' },
  ],
  Company: [
    { href: '/why-us', label: 'Why us' },
    { href: '/contact', label: 'Contact' },
    { href: '/signup', label: 'Start trial' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white" role="contentinfo">
      <div className="container-marketing section-padding pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              AI School Management
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-600 leading-relaxed">
              Global AI-powered school ERP. One platform for attendance, fees, bus tracking,
              online classes, and intelligent automation.
            </p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
              <ul className="mt-4 space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-600 hover:text-brand-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AI School Management. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">Built for schools worldwide · Secure OTP login · Cloud platform</p>
        </div>
      </div>
    </footer>
  );
}
