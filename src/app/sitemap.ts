import { MetadataRoute } from 'next';
import { query } from '@/lib/db';

const BASE_URL = 'https://prashant-pathak-puja-website.vercel.app';

// Fallback slugs for build-time safety if database is unreachable
const FALLBACK_SERVICES = [
  'vastu-shanti',
  'grah-shanti',
  'satyanarayan-puja',
  'rudra-abhishek',
  'nakshatra-shanti',
  'kalsarp-shanti',
  'vivah-sanskar',
  'upanayan-sanskar',
  'murti-pran-pratishtha',
  'udak-shanti',
  'navchandi-pujan',
  'laghurudra',
  'dharmik-vidhi',
  'kundali-seva',
];

const FALLBACK_BLOGS = [
  'vastu-shanti-mahatva-niyam',
  'satyanarayan-puja-faldruti-vidhi',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/book-puja`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/videos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/testimonials`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // 2. Dynamic Services
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await query('SELECT slug, updated_at FROM services WHERE is_active = TRUE');
    if (res.rows && res.rows.length > 0) {
      serviceRoutes = res.rows.map((row: any) => ({
        url: `${BASE_URL}/services/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      }));
    }
  } catch (err) {
    // Graceful fallback to verified services
    serviceRoutes = FALLBACK_SERVICES.map((slug) => ({
      url: `${BASE_URL}/services/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }));
  }

  // 3. Dynamic Blog Articles
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await query('SELECT slug, updated_at, published_at FROM blog_posts');
    if (res.rows && res.rows.length > 0) {
      blogRoutes = res.rows.map((row: any) => ({
        url: `${BASE_URL}/blog/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : (row.published_at ? new Date(row.published_at) : now),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    // Graceful fallback to verified articles
    blogRoutes = FALLBACK_BLOGS.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  }

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
