import type { Metadata } from 'next';
import { query } from '@/lib/db';
import { AboutClient } from '@/components/AboutClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'गुरुजींविषयी परिचय (About Guruji)',
  description:
    'नागपूर येथील सुप्रसिद्ध पुरोहित वेदमूर्ती प्रशांत पाठक गुरुजींची वैदिक परंपरा, शास्त्रोक्त पद्धती, कार्यक्षेत्र व धार्मिक सेवांचा परिचय.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/about',
  },
  openGraph: {
    title: 'गुरुजींविषयी परिचय (About Guruji) | वे.मु. प्रशांत पाठक',
    description:
      'नागपूर येथील सुप्रसिद्ध पुरोहित वेदमूर्ती प्रशांत पाठक गुरुजींची वैदिक परंपरा व धार्मिक सेवांचा परिचय.',
    url: 'https://prashant-pathak-puja-website.vercel.app/about',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default async function AboutPage() {
  let profile = null;
  try {
    const res = await query('SELECT * FROM website_settings WHERE id = 1');
    profile = res.rows[0] || null;
  } catch (err) {
    console.error('[About SSR Error]', err);
  }

  return <AboutClient initialProfile={profile} />;
}
