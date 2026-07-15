export const SITE_URL = process.env.NEXT_PUBLIC_MARKETING_URL ?? 'https://aischoolmanagement.tech';
export const SITE_NAME = 'AI School Management';
export const SITE_TAGLINE = 'Global AI-Powered School ERP';
export const SITE_DESCRIPTION =
  'All-in-one school management software for attendance, fees, bus tracking, homework, online classes, and AI assistant. Transparent pricing in INR, USD, EUR, GBP & AED. Start a 7-day free trial — no sales call required.';
export const SITE_KEYWORDS = [
  'school management software',
  'school ERP',
  'AI school management',
  'school attendance software',
  'school fee management',
  'bus tracking for schools',
  'online school admin portal',
  'parent app for schools',
  'CBSE school software India',
  'multi currency school software',
  'education management system',
  'SIS school information system',
];

export const SITE_PAGES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/features/', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/pricing/', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/how-it-works/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/why-us/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/signup/', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/contact/', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/login/', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/privacy/', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms/', priority: 0.3, changeFrequency: 'yearly' as const },
];
