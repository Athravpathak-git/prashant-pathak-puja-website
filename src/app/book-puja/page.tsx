import type { Metadata } from 'next';
import { BookPujaClient } from '@/components/BookPujaClient';

export const metadata: Metadata = {
  title: 'पूजा विधी नोंदणी (Book Puja Online)',
  description:
    'वास्तुशांती, ग्रहशांती, सत्यनारायण, अभिषेक, विवाह संस्कार व सर्व धार्मिक विधींसाठी ऑनलाईन नोंदणी करा. वेदमूर्ती प्रशांत पाठक गुरुजी, नागपूर.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/book-puja',
  },
  openGraph: {
    title: 'पूजा विधी नोंदणी (Book Puja Online) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'शास्त्रोक्त पद्धतीने विधी संपन्न करण्यासाठी तिथी व मुहूर्तानुसार थेट नोंदणी करा. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app/book-puja',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function BookPujaPage() {
  return <BookPujaClient />;
}
