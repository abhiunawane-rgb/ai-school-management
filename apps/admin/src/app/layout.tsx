import type { Metadata } from 'next';
import { Outfit, Source_Sans_3 } from 'next/font/google';
import { AppProviders } from '@/components/providers';
import './globals.css';

const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-geist' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'https://aischoolmanagement.tech/admin';

export const metadata: Metadata = {
  metadataBase: new URL(adminUrl),
  title: {
    default: 'AI School Management — Admin & Portal',
    template: '%s | AI School Management',
  },
  description: 'School administration dashboard and staff/parent portal.',
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: `${adminUrl}/favicon.svg`, type: 'image/svg+xml' },
      { url: `${adminUrl}/favicon.png`, type: 'image/png' },
      { url: `${adminUrl}/favicon.ico`, sizes: 'any' },
    ],
    apple: [{ url: `${adminUrl}/apple-touch-icon.png` }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href={`${adminUrl}/favicon.svg`} type="image/svg+xml" />
        <link rel="icon" href={`${adminUrl}/favicon.png`} type="image/png" />
        <link rel="apple-touch-icon" href={`${adminUrl}/apple-touch-icon.png`} />
        <meta name="theme-color" content="#0f766e" />
      </head>
      <body className="font-sans min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
