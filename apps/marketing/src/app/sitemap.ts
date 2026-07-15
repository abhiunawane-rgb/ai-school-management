import type { MetadataRoute } from 'next';
import { SITE_PAGES, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return SITE_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path === '/' ? '/' : page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
