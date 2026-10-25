import type { Metadata } from 'next';
import { VideosClient } from '@/components/VideosClient';

export const metadata: Metadata = {
  title: 'धार्मिक व्हिडीओ दालन (Videos)',
  description:
    'वैदिक मंत्रोच्चार, शांतिपाठ, आरती, रुद्राभिषेक व धार्मिक विधींचे प्रात्यक्षिक व्हिडीओ दर्शन. वेदमूर्ती प्रशांत पाठक गुरुजी, नागपूर.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/videos',
  },
  openGraph: {
    title: 'धार्मिक व्हिडीओ दालन (Videos) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'वैदिक मंत्रोच्चार व धार्मिक विधींचे व्हिडीओ दर्शन. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app/videos',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function VideosPage() {
  return <VideosClient />;
}
