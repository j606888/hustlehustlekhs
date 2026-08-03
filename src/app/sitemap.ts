import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/site';
import { getPublishedTeacherSlugs } from '@/data/teachers';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: '/', priority: 1 },
    { path: '/courses', priority: 0.9 },
    // 據點頁是「高雄 Hustle」關鍵字的落地頁，優先度拉高
    { path: '/location', priority: 0.9 },
    { path: '/teachers', priority: 0.7 },
  ];

  const teacherRoutes = getPublishedTeacherSlugs().map(({ slug }) => ({
    path: `/teachers/${slug}`,
    priority: 0.6,
  }));

  return [...staticRoutes, ...teacherRoutes].map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority,
  }));
}
