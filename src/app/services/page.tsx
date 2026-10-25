import type { Metadata } from 'next';
import { ServicesClient } from '@/components/ServicesClient';

export const metadata: Metadata = {
  title: 'सर्व पूजा व धार्मिक विधी (Vedic Puja Services)',
  description:
    'नागपूर येथील सुप्रसिद्ध पुरोहित वेदमूर्ती प्रशांत पाठक गुरुजींद्वारे संपन्न होणारे सर्व धार्मिक विधी: वास्तुशांती, नवग्रह शांती, सत्यनारायण पूजा, रुद्राभिषेक, विवाह संस्कार, उपनयन संस्कार, लघुरुद्र व कुंडली सेवा.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/services',
  },
  openGraph: {
    title: 'सर्व पूजा व धार्मिक विधी (Vedic Puja Services) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'शास्त्रोक्त पद्धतीने संपन्न होणारे सर्व वैदिक विधी व संस्कार. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app/services',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
