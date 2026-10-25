import { MetadataRoute } from 'next';

const BASE_URL = 'https://prashant-pathak-puja-website.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
        ],
      },
      {
        // Special rule for Google AdSense and Googlebot crawlers
        userAgent: ['Googlebot', 'Mediapartners-Google', 'AdsBot-Google'],
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
