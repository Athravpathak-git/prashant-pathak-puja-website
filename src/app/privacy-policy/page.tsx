import type { Metadata } from 'next';
import Link from 'next/link';
import {
  VedicSectionHeader,
  VedicDivider,
  SacredCorner,
  TemplePattern,
} from '@/components/VedicDesignSystem';
import { GlassCard } from '@/components/LiquidGlassSystem';
import { ShieldCheck, Lock, Cookie, Eye, MessageSquare, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'गोपनीयता धोरण (Privacy Policy)',
  description:
    'वेदमूर्ती प्रशांत पाठक गुरुजींच्या अधिकृत संकेतस्थळाचे गोपनीयता धोरण. यजमानांच्या वैयक्तिक माहितीचे संरक्षण, कुकीज धोरण आणि गुगल ॲडसेन्स विषयक पारदर्शक नियम.',
  alternates: {
    canonical: 'https://prashant-pathak-puja-website.vercel.app/privacy-policy',
  },
  openGraph: {
    title: 'गोपनीयता धोरण (Privacy Policy) | वे.मु. प्रशांत पाठक (गुरुजी)',
    description:
      'यजमानांच्या माहितीचे पावित्र्य, संरक्षण व गोपनीयता धोरण. नागपूर, महाराष्ट्र.',
    url: 'https://prashant-pathak-puja-website.vercel.app/privacy-policy',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
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
          badge="॥ पावित्र्य व पारदर्शकता ॥"
          title="गोपनीयता धोरण (Privacy Policy)"
          subtitle="Privacy Policy & Devotee Information Protection — वे.मु. प्रशांत पाठक (गुरुजी), नागपूर"
        />

        {/* Main Editorial Privacy Card */}
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
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              अधिकृत गोपनीयता विधान (Official Privacy Notice)
            </span>
            <span>अंतिम अद्यतन: ऑक्टोबर २०२६ (Last Updated: October 2026)</span>
          </div>

          {/* Section 1: Introduction */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <span className="text-[#B58A3A]">१.</span>
              <span>परिचय व गोपनीयता कटिबद्धता (Introduction & Commitment)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              वेदमूर्ती प्रशांत पाठक (गुरुजी) यांच्या अधिकृत धार्मिक सेवा संकेतस्थळावर (
              <span className="font-mono text-xs text-[#5A1720]">prashant-pathak-puja-website.vercel.app</span>)
              आपले सहर्ष स्वागत आहे. आम्ही आमच्या यजमानांच्या आणि भाविकांच्या वैयक्तिक गोपनीयतेचा आदर करतो. हे गोपनीयता धोरण आम्ही कोणती माहिती गोळा करतो, तिचा वापर कसा केला जातो आणि ती कशा प्रकारे सुरक्षित ठेवली जाते हे स्पष्ट करते.
            </p>
            <p className="text-xs sm:text-sm text-[#6F625A] leading-relaxed font-serif">
              Welcome to the official website of Vedmurti Prashant Pathak Guruji, Nagpur. We hold the privacy of our devotees and visitors in the highest regard. This Privacy Policy outlines our transparent protocols regarding the collection, protection, and respectful handling of personal information.
            </p>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 2: Information Collected */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <span className="text-[#B58A3A]">२.</span>
              <span>गोळा केली जाणारी माहिती (Information We Collect)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              आमच्या संकेतस्थळावर पूजा विधींची चौकशी करताना किंवा पूजा बुक करताना आपण स्वेच्छेने खालील माहिती प्रविष्ट करू शकता:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#282321] font-serif pl-4 list-disc list-outside marker:text-[#944B14]">
              <li><strong>वैयक्तिक संपर्क तपशील:</strong> नाव, मोबाईल क्रमांक (WhatsApp संपर्क), आणि ईमेल पत्ता.</li>
              <li><strong>विधी तपशील:</strong> इच्छित पूजेचे नाव, शुभ तिथी/तारीख, अपेक्षित वेळ, आणि उपस्थित व्यक्तींची संख्या.</li>
              <li><strong>विधीचे स्थान:</strong> नागपूर अथवा परिसरातील घराचा किंवा कार्यालयाचा पत्ता (विधी संपन्न करण्यासाठी आवश्यक असल्यास).</li>
              <li><strong>धार्मिक संकल्प माहिती:</strong> यजमानांचे गोत्र किंवा कुलदैवत (केवळ शास्त्रोक्त संकल्प सोडण्यासाठी आवश्यक असल्यास).</li>
              <li><strong>तांत्रिक नोंदी (Technical Logs):</strong> सुरक्षिततेसाठी IP पत्ता, ब्राउझर प्रकार, आणि ॲक्सेस वेळ.</li>
            </ul>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 3: Use of Information */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <span className="text-[#B58A3A]">३.</span>
              <span>माहितीचा वापर व संरक्षण (Use & Protection of Information)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              आपल्याद्वारे दिलेली माहिती केवळ खालील उद्देशांसाठी वापरली जाते:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#B58A3A]/30 text-xs font-serif text-[#282321] space-y-1">
                <span className="font-bold text-[#5A1720] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> विधींचे समन्वय व नियोजन
                </span>
                <p className="text-[#6F625A]">पूजा विधीची तारीख, वेळ, आणि साहित्याची पूर्वतयारी यजमानांशी निश्चित करणे.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#B58A3A]/30 text-xs font-serif text-[#282321] space-y-1">
                <span className="font-bold text-[#5A1720] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> थेट संपर्क व मार्गदर्शन
                </span>
                <p className="text-[#6F625A]">आपल्या चौकशीस WhatsApp किंवा फोनद्वारे वेळेवर प्रतिसाद देणे.</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#282321] font-semibold font-serif pt-2 text-[#5A1720]">
              आम्ही आपली कोणतीही माहिती कोणत्याही व्यावसायिक विपणन कंपन्यांना (Commercial Marketers) विकत नाही, भाड्याने देत नाही किंवा कोणत्याही अनधिकृत तृतीय पक्षाला हस्तांतरित करत नाही.
            </p>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 4: Cookies Policy */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <Cookie className="w-5 h-5 text-[#944B14]" />
              <span>४. कुकीज व ब्राउझर स्टोरेज (Cookies & Storage)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              हे संकेतस्थळ आपल्या सोयीसाठी मर्यादित कुकीजचा वापर करते:
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#282321] font-serif pl-4 list-disc list-outside marker:text-[#944B14]">
              <li><strong>भाषा निवड (Language Preference):</strong> आपण निवडलेली भाषा (मराठी, इंग्रजी, इत्यादी) स्मरणात ठेवण्यासाठी <code className="text-[#5A1720] bg-[#FAF7F0] px-1 py-0.5 rounded font-mono text-[11px]">pp_language</code> कुकी.</li>
              <li><strong>प्रशासकीय सत्र (Admin Authentication):</strong> केवळ अधिकृत प्रशासकीय लॉगिनसाठी सुरक्षित <code className="text-[#5A1720] bg-[#FAF7F0] px-1 py-0.5 rounded font-mono text-[11px]">HttpOnly, SameSite</code> कुकी.</li>
            </ul>
            <p className="text-xs text-[#6F625A] font-serif">
              आपण आपल्या ब्राउझर सेटिंग्जमधून कुकीज नाकारू शकता; तथापि, त्यामुळे काही प्राधान्यक्रम रीसेट होऊ शकतात.
            </p>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 5: Google AdSense & Third-Party Advertising Policy */}
          <section className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#FAF7F0]/90 border border-[#B58A3A]/40">
            <h2 className="font-serif font-bold text-base sm:text-lg text-[#5A1720] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#944B14]" />
              <span>५. गुगल ॲडसेन्स व तृतीय-पक्ष जाहिरात धोरण (Google AdSense & Advertising Disclosures)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              भविष्यात संकेतस्थळाच्या देखभाल व माहिती प्रसारासाठी गुगल ॲडसेन्स (Google AdSense) किंवा अन्य अधिकृत जाहिरात भागीदारांच्या जाहिराती प्रदर्शित केल्या जाऊ शकतात. यासंदर्भात गुगलच्या नियमांनुसार खालील बाबी नमूद केल्या आहेत:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#282321] font-serif pl-4 list-disc list-outside marker:text-[#944B14]">
              <li>
                <strong>तृतीय पक्ष कुकीज (Third-Party Cookies):</strong> गुगलसह तृतीय-पक्ष विक्रेते या संकेतस्थळावर किंवा इंटरनेटवरील इतर संकेतस्थळांवर वापरकर्त्याच्या पूर्वीच्या भेटींच्या आधारे जाहिराती दाखवण्यासाठी कुकीज (उदा. DoubleClick cookie) वापरू शकतात.
              </li>
              <li>
                <strong>वैयक्तिकृत जाहिराती (Personalized Ads):</strong> जाहिरात कुकीजच्या वापरामुळे गुगल आणि त्याच्या भागीदारांना आपल्या आवडीनुसार जाहिराती प्रदर्शित करता येतात.
              </li>
              <li>
                <strong>जाहिरात नियंत्रण व ऑप्ट-आऊट (Opt-out):</strong> वापरकर्ते गुगलच्या अधिकृत जाहिरात सेटिंग्ज पानावर (
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5A1720] underline font-semibold hover:text-[#944B14]"
                >
                  Google Ads Settings
                </a>
                ) जाऊन वैयक्तिकृत जाहिराती बंद करू शकतात किंवा{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5A1720] underline font-semibold hover:text-[#944B14]"
                >
                  www.aboutads.info
                </a>{' '}
                द्वारे तृतीय-पक्ष विक्रेत्यांच्या कुकीज नियंत्रित करू शकतात.
              </li>
            </ul>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 6: Security & User Rights */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#944B14]" />
              <span>६. डेटा सुरक्षा व यजमानांचे अधिकार (Data Security & Your Rights)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              आम्ही SSL/TLS एन्क्रिप्शन, XSS सॅनिटायझेशन, आणि रेट लिमिटिंग तंत्रज्ञानाद्वारे माहिती सुरक्षित ठेवतो. आपल्याकडे आपल्याद्वारे सबमिट केलेल्या कोणत्याही विधी बुकिंग माहितीमध्ये बदल करण्याची किंवा ती हटवण्याची विनंती करण्याचा पूर्ण अधिकार आहे.
            </p>
          </section>

          <VedicDivider className="my-4" variant="diamond" />

          {/* Section 7: Genuine Contact Information */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#321116] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#944B14]" />
              <span>७. संपर्क माहिती (Contact & Inquiries)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif">
              या गोपनीयता धोरणाविषयी आपल्या काही शंका किंवा सूचना असल्यास आपण खालील अधिकृत माध्यमांद्वारे वेदमूर्ती प्रशांत पाठक गुरुजींशी संपर्क साधू शकता:
            </p>
            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#B58A3A]/30 space-y-2 text-xs font-serif text-[#282321]">
              <p><strong>पुरोहित:</strong> वेदमूर्ती प्रशांत पाठक (गुरुजी)</p>
              <p><strong>कार्यक्षेत्र:</strong> नागपूर, विदर्भ व महाराष्ट्र (Nagpur, Maharashtra, India)</p>
              <p>
                <strong>अधिकृत WhatsApp चॅनल:</strong>{' '}
                <a
                  href="/api/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline"
                >
                  @PrashantPathakGuruji (थेट संपर्क साधा)
                </a>
              </p>
              <p>
                <strong>वेबसाईट संपर्क पृष्ठ:</strong>{' '}
                <Link href="/contact" className="text-[#5A1720] font-semibold underline">
                  /contact पानावरून चौकशी पाठवा
                </Link>
              </p>
            </div>
          </section>
        </GlassCard>
      </div>
    </div>
  );
}
