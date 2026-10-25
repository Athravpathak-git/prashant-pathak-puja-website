import type { Metadata } from 'next';
import { BlogClient } from '@/components/BlogClient';

export const metadata: Metadata = {
  title: 'वैदिक ज्ञान व धार्मिक लेख (Vedic Blog)',
  description:
    'सत्यनारायण पूजा, वास्तुशांती, गृहप्रवेश, रुद्राभिषेक, सण-उत्सव व सोळा संस्कारांचे महत्त्व विशद करणारे शास्त्रोक्त धार्मिक लेख व अभ्यासपूर्ण माहिती.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/blog',
  },
  openGraph: {
    title: 'वैदिक ज्ञान व धार्मिक लेख (Vedic Blog) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'शास्त्रोक्त पूजा विधींचे महत्त्व व नियम याविषयी अभ्यासपूर्ण धार्मिक लेख. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app/blog',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
