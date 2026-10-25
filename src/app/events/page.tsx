import type { Metadata } from 'next';
import { EventsClient } from '@/components/EventsClient';

export const metadata: Metadata = {
  title: 'धार्मिक उत्सव व आगामी कार्यक्रम (Events)',
  description:
    'आगामी धार्मिक सण, एकादशी, महाशिवरात्री, नवरात्र अनुष्ठान, सत्यनारायण तिथी व विशेष धार्मिक कार्यक्रमांचे संपूर्ण वेळापत्रक व माहिती.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/events',
  },
  openGraph: {
    title: 'धार्मिक उत्सव व आगामी कार्यक्रम (Events) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'आगामी धार्मिक सण व विशेष अनुष्ठानांचे तिथीनिहाय वेळापत्रक. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app/events',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function EventsPage() {
  return <EventsClient />;
}
