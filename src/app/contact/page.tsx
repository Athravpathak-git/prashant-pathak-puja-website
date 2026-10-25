import type { Metadata } from 'next';
import { ContactClient } from '@/components/ContactClient';

export const metadata: Metadata = {
  title: 'संपर्क व मार्गदर्शन (Contact)',
  description:
    'वेदमूर्ती प्रशांत पाठक गुरुजींशी पूजा विधी, मुहूर्त व धार्मिक मार्गदर्शनासाठी संपर्क साधा. स्थान: नागपूर, महाराष्ट्र. WhatsApp: @PrashantPathakGuruji',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/contact',
  },
  openGraph: {
    title: 'संपर्क व मार्गदर्शन (Contact) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'पूजा विधी, मुहूर्त व कुंडली मार्गदर्शनासाठी संपर्क साधा. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app/contact',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
