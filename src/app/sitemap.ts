
import type { MetadataRoute } from 'next';
import { sportCategories } from '@/lib/sports-data'; // Using the simple list for URLs

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sportsurge1.com'; // Fallback ensures a value

  const categoryPages = sportCategories.map((category) => ({
    url: `${siteUrl}/${category.id}`, // Updated URL structure
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryPages,
  ];
}
