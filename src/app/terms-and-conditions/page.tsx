import type { Metadata } from 'next';
import Link from 'next/link';
import {
  VedicSectionHeader,
  VedicDivider,
  SacredCorner,
  TemplePattern,
} from '@/components/VedicDesignSystem';
import { GlassCard } from '@/components/LiquidGlassSystem';
import { FileCheck, BookOpen, Calendar, ShieldCheck, AlertCircle, MessageSquare, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'नियम व अटी (Terms & Conditions)',
  description:
    'वेदमूर्ती प्रशांत पाठक गुरुजींच्या अधिकृत संकेतस्थळाचे नियम व अटी. पूजा बुकिंग, विधी समन्वय, आध्यात्मिक मार्गदर्शन व संकेतस्थळ वापर नियमावली — नागपूर, महाराष्ट्र.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/terms-and-conditions',
  },
  openGraph: {
    title: 'नियम व अटी (Terms and Conditions) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'शास्त्रोक्त विधी, बुकिंग नियम व संकेतस्थळ वापर अटी. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app/terms-and-conditions',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1720] hover:text-[#944B14] transition-colors font-serif"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← मुख्यपृष्ठावर परत जा (Back to Home)</span>
          </Link>
        </div>

        {/* Section Header */}
        <VedicSectionHeader
          badge="॥ शास्त्रोक्त नियम व सुव्यवस्था ॥"
          title="नियम व अटी (Terms & Conditions)"
          subtitle="Terms of Service & Ritual Booking Guidelines — वे.मु. प्रशांत पाठक (गुरुजी), नागपूर"
        />

        {/* Main Editorial Terms Card */}
        <GlassCard
          variant="white"
          padding="p-6 sm:p-12"
          className="border border-[#B58A3A]/45 shadow-[0_16px_50px_rgba(90,23,32,0.06)] space-y-8 relative"
        >
          <SacredCorner position="top-left" />
          <SacredCorner position="bottom-right" />

          {/* Meta & Last Updated */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#B58A3A]/25 text-xs text-[#6F625A] font-serif">
            <span className="flex items-center gap-1.5 text-[#5A1720] font-semibold">
              <FileCheck className="w-4 h-4 text-[#944B14]" />
              अधिकृत सेवा नियमावली (Official Service Guidelines)
            </span>
            <span>अंतिम अद्यतन: ऑक्टोबर २०२६ (Last Updated: October 2026)</span>
          </div>

          {/* Section 1: Acceptance */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <span className="text-[#B58A3A]">१.</span>
              <span>अटींचा स्वीकार (Acceptance of Terms)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              वेदमूर्ती प्रशांत पाठक (गुरुजी) यांच्या संकेतस्थळाचा वापर करून आपण या नियम आणि अटींशी बांधील राहण्यास सहमती दर्शविता. जर आपण या अटींशी सहमत नसाल, तर आपण या संकेतस्थळाचा वापर त्वरित थांबवावा.
            </p>
            <p className="text-xs sm:text-sm text-[#6F625A] leading-relaxed font-serif">
              By accessing or using this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.
            </p>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 2: Services */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#944B14]" />
              <span>२. धार्मिक विधी व सेवा माहिती (Ritual Services Information)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              संकेतस्थळावर दर्शविलेले सर्व धार्मिक विधी (उदा. वास्तुशांती, नवग्रह शांती, सत्यनारायण पूजा, रुद्राभिषेक, विवाह संस्कार, उपनयन संस्कार, लघुरुद्र इत्यादी) हे सनातन वैदिक शास्त्र, पारंपरिक धर्मग्रंथ आणि शुद्ध मंत्रोच्चार पद्धतीनुसार संपन्न केले जातात.
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#282321] font-serif pl-4 list-disc list-outside marker:text-[#944B14]">
              <li>विधींचा कालावधी आणि सामग्री यजमानाच्या संकल्प व विधीच्या स्वरूपानुसार बदलू शकते.</li>
              <li>विधीसाठी लागणारा अचूक मुहूर्त हा हिंदू पंचांग, तिथी, आणि यजमानाच्या ग्रहस्थितीवर आधारित निर्धारित केला जातो.</li>
            </ul>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 3: Booking & Coordination */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#944B14]" />
              <span>३. पूजा बुकिंग व समन्वय (Booking & Coordination Guidelines)</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-[#282321] font-serif">
              <p>
                <strong>चौकशी व पुष्टीकरण:</strong> संकेतस्थळावरील फॉर्म भरून केलेली बुकिंग विनंती ही प्राथमिक नोंदणी असते. गुरुजींशी प्रत्यक्ष किंवा WhatsApp द्वारे संपर्क साधून तिथी, वेळ आणि साहित्याचे अंतिम नियोजन झाल्यानंतरच पूजा निश्चित मानली जाते.
              </p>
              <p>
                <strong>पूर्वतयारीची सूचना:</strong> विवाह संस्कार, वास्तुशांती किंवा लघुरुद्र यांसारख्या मोठ्या विधींसाठी किमान १५ ते २० दिवस आधी संपर्क साधण्याची शिफारस केली जाते, जेणेकरून आवश्यक पूर्वतयारी व मुहूर्त नियोजन योग्य प्रकारे करता येईल.
              </p>
              <p>
                <strong>पूजा साहित्य:</strong> बुकिंग निश्चितीनंतर गुरुजींकडून आवश्यक साहित्याची स्पष्ट यादी पुरवली जाते. यजमान स्वेच्छेने हे साहित्य स्वतः आणू शकतात किंवा पूर्वसूचनेनुसार मार्गदर्शनाची विनंती करू शकतात.
              </p>
            </div>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 4: Spiritual Disclaimer */}
          <section className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#FAF7F0]/90 border border-[#B58A3A]/40">
            <h2 className="font-serif font-bold text-base sm:text-lg text-[#5A1720] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#944B14]" />
              <span>४. आध्यात्मिक व ज्योतिष मार्गदर्शन अस्वीकरण (Spiritual Disclaimer)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              ज्योतिषशास्त्र, कुंडली विश्लेषण आणि धार्मिक विधी ही श्रद्धा, शास्त्र आणि परंपरेवर आधारित प्राचीन ज्ञानप्रणाली आहे. हे मार्गदर्शन यजमानांच्या आध्यात्मिक समाधान, मानसिक शांती आणि पारमार्थिक कल्याणासाठी दिले जाते.
            </p>
            <p className="text-xs text-[#6F625A] leading-relaxed font-serif">
              Astrological chart readings and ritual recommendations are traditional Vedic spiritual consultations offered in good faith. They do not constitute legal, financial, or medical advice. Results of spiritual rituals depend upon individual faith, karma, and cosmic factors.
            </p>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 5: Intellectual Property */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#944B14]" />
              <span>५. बौद्धिक संपदा व वापर मर्यादा (Permitted Use & Copyright)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              या संकेतस्थळावरील सर्व मजकूर, छायाचित्रे, धार्मिक लेख, डिझाइन आणि मंत्र रचना ही वेदमूर्ती प्रशांत पाठक (गुरुजी) यांच्या अधिकृत मालकीची किंवा अधिकृत परवानगीने वापरलेली आहे.
            </p>
            <p className="text-xs sm:text-sm text-[#6F625A] leading-relaxed font-serif">
              You may view, read, and share the articles for personal and devotional purposes with due attribution. Commercial reproduction, scraping, or misrepresentation is strictly prohibited.
            </p>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 6: Jurisdiction & Contact */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#944B14]" />
              <span>६. न्यायक्षेत्र व संपर्क (Jurisdiction & Contact)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              या नियमावलीसंदर्भातील सर्व कायदेशीर बाबी नागपूर, महाराष्ट्र (भारत) येथील सक्षम न्यायालयाच्या अधिकारक्षेत्रात येतात. कोणत्याही चौकशीसाठी आपण खालील अधिकृत माध्यमातून संपर्क साधू शकता:
            </p>
            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#B58A3A]/30 space-y-1.5 text-xs font-serif text-[#282321]">
              <p><strong>पुरोहित:</strong> वेदमूर्ती प्रशांत पाठक (गुरुजी)</p>
              <p><strong>स्थान:</strong> नागपूर, महाराष्ट्र (Nagpur, Maharashtra, India)</p>
              <p>
                <strong>अधिकृत WhatsApp चॅनल:</strong>{' '}
                <a
                  href="/api/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline"
                >
                  @PrashantPathakGuruji
                </a>
              </p>
            </div>
          </section>
        </GlassCard>
      </div>
    </div>
  );
}
