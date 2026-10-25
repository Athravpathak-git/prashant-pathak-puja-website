import type { Metadata } from 'next';
import { query } from '@/lib/db';
import { ServiceDetailClient } from '@/components/ServiceDetailClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const identifier = params.id;
  let service: any = null;

  try {
    const isNum = !isNaN(Number(identifier));
    const sql = isNum
      ? 'SELECT * FROM services WHERE id = $1 LIMIT 1'
      : 'SELECT * FROM services WHERE slug = $1 LIMIT 1';
    const res = await query(sql, [identifier]);
    service = res.rows[0] || null;
  } catch (err) {
    // DB fallback
  }

  const title = service
    ? `${service.name_mr} (${service.name_en || 'शास्त्रोक्त विधी'})`
    : 'पूजा विधी तपशील';
  const description =
    service?.short_desc_mr ||
    'वेदमूर्ती प्रशांत पाठक गुरुजींद्वारे शास्त्रोक्त पद्धतीने संपन्न होणारा वैदिक विधी. नागपूर, महाराष्ट्र.';
  const canonicalUrl = `https://prashant-pathak-puja-website.vercel.app/services/${identifier}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      locale: 'mr_IN',
      type: 'website',
    },
  };
}

export default function ServiceDetailPage({ params }: Props) {
  return <ServiceDetailClient initialServiceId={params.id} />;
}
