import type { Metadata } from 'next';
import { TestimonialsClient } from '@/components/TestimonialsClient';

export const metadata: Metadata = {
  title: 'यजमानांचे अनुभव व अभिप्राय (Testimonials)',
  description:
    'नागपूर व परिसरातील समाधानी यजमानांचे प्रामाणिक अनुभव व अभिप्राय. वास्तुशांती, विवाह, उपनयन व धार्मिक विधींबद्दलचे भाविकांचे मनोगत.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/testimonials',
  },
  openGraph: {
    title: 'यजमानांचे अनुभव व अभिप्राय (Testimonials) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'समाधानी यजमानांचे प्रामाणिक अनुभव व अभिप्राय. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app/testimonials',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}
