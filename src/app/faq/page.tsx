import type { Metadata } from 'next';
import { FaqClient } from '@/components/FaqClient';

export const metadata: Metadata = {
  title: 'वारंवार विचारले जाणारे प्रश्न (FAQ)',
  description:
    'पूजा विधीची तयारी, साहित्य, मुहूर्त, दक्षिणा, नागपूर बाहेरील विधी व कुंडली मार्गदर्शन याविषयी यजमानांच्या शंकांचे शास्त्रोक्त निरसन.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/faq',
  },
  openGraph: {
    title: 'वारंवार विचारले जाणारे प्रश्न (FAQ) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'पूजा विधी, मुहूर्त व साहित्याविषयी यजमानांच्या सर्व शंकांचे शास्त्रोक्त समाधान.',
    url: 'https://prashant-pathak-puja-website.vercel.app/faq',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function FaqPage() {
  return <FaqClient />;
}
