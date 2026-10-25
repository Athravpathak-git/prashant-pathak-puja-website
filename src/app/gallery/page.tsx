import type { Metadata } from 'next';
import { GalleryClient } from '@/components/GalleryClient';

export const metadata: Metadata = {
  title: 'छायाचित्र दालन (Photo Gallery)',
  description:
    'वेदमूर्ती प्रशांत पाठक गुरुजींच्या उपस्थितीत संपन्न झालेल्या विविध धार्मिक विधी, वास्तुशांती, होम-हवन, प्रतिष्ठापना व संस्कारांची छायाचित्रे.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/gallery',
  },
  openGraph: {
    title: 'छायाचित्र दालन (Photo Gallery) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'संपन्न झालेल्या वैदिक पूजा विधी व यज्ञांची क्षणचित्रे. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app/gallery',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
