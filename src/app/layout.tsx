import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#660F1A',
};

export const metadata: Metadata = {
  title: 'वे.मु. प्रशांत पाठक (गुरुजी) | धार्मिक विधी व संस्कार — नागपूर',
  description: 'नागपूर येथील सुप्रसिद्ध पुरोहित वेदमूर्ती प्रशांत पाठक गुरुजींद्वारे सर्व प्रकारचे धार्मिक विधी, वास्तुशांती, ग्रहशांती, सत्यनारायण, अभिषेक, विवाह, उपनयन संस्कार व कुंडली मार्गदर्शन शास्त्रोक्त पद्धतीने केले जाते.',
  keywords: [
    'प्रशांत पाठक गुरुजी',
    'Prashant Pathak Guruji',
    'Purohit Nagpur',
    'Vedic Puja Nagpur',
    'Vastu Shanti Nagpur',
    'Grah Shanti',
    'Satyanarayan Puja Nagpur',
    'Vivah Sanskar Guruji',
    'Munj Guruji Nagpur',
    'Religious rituals Maharashtra'
  ],
  authors: [{ name: 'वे.मु. प्रशांत पाठक (गुरुजी)' }],
  openGraph: {
    title: 'वे.मु. प्रशांत पाठक (गुरुजी) | वैदिक धार्मिक विधी — नागपूर',
    description: 'सर्व प्रकारचे धार्मिक विधी शास्त्रोक्त पद्धतीने केले जातील. नागपूर, महाराष्ट्र.',
    locale: 'mr_IN',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Noto+Serif+Devanagari:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&family=Rozha+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory-100 text-charcoal-900 antialiased selection:bg-gold-300 selection:text-maroon-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#5A1720] focus:text-[#FAF7F0] focus:rounded-md focus:border focus:border-[#D8B96A] focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#D8B96A] font-serif text-xs font-semibold"
        >
          मुख्य मजकुरावर जा (Skip to main content)
        </a>
        <LanguageProvider>
          <Navbar />
          <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
        </LanguageProvider>
      </body>
    </html>
  );
}
