import type { Metadata } from 'next';
import { query } from '@/lib/db';
import { HomePageClient } from '@/components/HomePageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: 'वे.मु. प्रशांत पाठक (गुरुजी) | शास्त्रोक्त धार्मिक विधी व पुरोहित सेवा — नागपूर',
  },
  description:
    'नागपूर येथील सुप्रसिद्ध पुरोहित वेदमूर्ती प्रशांत पाठक गुरुजींद्वारे सर्व प्रकारचे धार्मिक विधी, वास्तुशांती, ग्रहशांती, सत्यनारायण, अभिषेक, विवाह, उपनयन संस्कार व कुंडली मार्गदर्शन शास्त्रोक्त पद्धतीने केले जाते.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app',
  },
  openGraph: {
    title: 'वे.मु. प्रशांत पाठक (गुरुजी) | शास्त्रोक्त धार्मिक विधी — नागपूर',
    description:
      'सर्व प्रकारचे धार्मिक विधी शास्त्रोक्त पद्धतीने संपन्न केले जातील. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default async function HomePage() {
  let profile = null;
  let services = [];
  let events = [];
  let gallery = [];
  let testimonials = [];
  let faqs = [];

  try {
    const [pRes, sRes, eRes, gRes, tRes, fRes] = await Promise.all([
      query('SELECT * FROM website_settings WHERE id = 1'),
      query(`
        SELECT s.*, c.name_mr AS category_name_mr, c.name_en AS category_name_en, c.slug AS category_slug
        FROM services s
        LEFT JOIN service_categories c ON s.category_id = c.id
        WHERE s.is_active = TRUE AND s.is_featured = TRUE
        ORDER BY s.sort_order ASC, s.id ASC
      `),
      query('SELECT * FROM events WHERE is_published = TRUE ORDER BY event_date ASC, sort_order ASC LIMIT 3'),
      query('SELECT * FROM gallery WHERE is_hidden = FALSE AND is_featured = TRUE ORDER BY sort_order ASC, created_at DESC LIMIT 6'),
      query('SELECT * FROM testimonials WHERE is_approved = TRUE ORDER BY created_at DESC'),
      query('SELECT * FROM faqs WHERE is_published = TRUE ORDER BY sort_order ASC, id ASC')
    ]);

    profile = pRes.rows[0] || null;
    services = sRes.rows || [];
    events = eRes.rows || [];
    gallery = gRes.rows || [];
    testimonials = tRes.rows || [];
    faqs = fRes.rows || [];
  } catch (err) {
    console.error('[HomePage SSR Query Error]', err);
  }

  return (
    <HomePageClient
      initialProfile={profile}
      initialServices={services}
      initialEvents={events}
      initialGallery={gallery}
      initialTestimonials={testimonials}
      initialFaqs={faqs}
    />
  );
}
