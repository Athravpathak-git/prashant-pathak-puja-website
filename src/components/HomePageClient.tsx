'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
  VedicSectionHeader,
  VedicDivider,
  TempleArchFrame,
  VedicBadge,
  OmMedallion,
  DiyaIcon,
  KalashIcon,
  SacredCorner,
  TemplePattern,
  MandalaBackground,
  SacredAccentLine,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
  GlassButton,
  GlassBadge,
} from '@/components/LiquidGlassSystem';
import {
  CalendarCheck,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Sun,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  X,
  Play,
  HeartHandshake,
  Award,
  Flame,
  Check,
} from 'lucide-react';

interface HomePageClientProps {
  initialProfile: any;
  initialServices: any[];
  initialEvents: any[];
  initialGallery: any[];
  initialTestimonials: any[];
  initialFaqs: any[];
}

export function HomePageClient({
  initialProfile,
  initialServices,
  initialEvents,
  initialGallery,
  initialTestimonials,
  initialFaqs,
}: HomePageClientProps) {
  const { t, language, getLocalized } = useI18n();

  const [profile, setProfile] = useState<any>(initialProfile);
  const [services, setServices] = useState<any[]>(initialServices || []);
  const [events, setEvents] = useState<any[]>(initialEvents || []);
  const [gallery, setGallery] = useState<any[]>(initialGallery || []);
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials || []);
  const [faqs, setFaqs] = useState<any[]>(initialFaqs || []);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    // Keep dynamic content fresh on client navigation
    fetch('/api/profile', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.profile) setProfile(d.profile);
      })
      .catch(console.error);

    fetch('/api/services?featured=true', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.services) setServices(d.services);
      })
      .catch(console.error);

    fetch('/api/events', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.events) setEvents((d.events || []).slice(0, 3));
      })
      .catch(console.error);

    fetch('/api/gallery?featured=true', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.gallery) setGallery((d.gallery || []).slice(0, 6));
      })
      .catch(console.error);

    fetch('/api/testimonials', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.testimonials) setTestimonials((d.testimonials || []).slice(0, 3));
      })
      .catch(console.error);

    fetch('/api/faqs', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.faqs) setFaqs((d.faqs || []).slice(0, 5));
      })
      .catch(console.error);

    fetch('/api/blog', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.posts) setBlogPosts((d.posts || []).slice(0, 2));
      })
      .catch(console.error);
  }, []);

  const gurujiPhoto = profile?.hero_image_url || profile?.primary_photo_url || profile?.about_photo_url;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F0] selection:bg-[#B58A3A]/30 selection:text-[#321116] relative overflow-hidden">
      {/* Background Temple Ambience */}
      <TemplePattern />

      {/* ========================================================================= */}
      {/* 1. SECTION 1: LUXURY CINEMATIC HERO */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 overflow-hidden border-b border-[#B58A3A]/30">
        {/* Sacred Atmosphere Lighting */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#B58A3A]/15 via-[#C86B24]/10 to-transparent rounded-full blur-3xl pointer-events-none -mt-32" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#5A1720]/8 rounded-full blur-3xl pointer-events-none -mb-32" />
        <MandalaBackground className="top-10 right-10 opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Sacred Eyebrow, Main Guruji Title, Editorial Credo, CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Sacred Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF7F0]/90 backdrop-blur-md border border-[#B58A3A]/50 shadow-[0_2px_12px_rgba(181,138,58,0.15)] text-[#5A1720] text-xs sm:text-sm font-serif font-semibold">
                <DiyaIcon className="w-3.5 h-3.5 text-[#C86B24]" />
                <span>{t('mantra_ganesh')}</span>
                <span className="text-[#B58A3A]">❖</span>
                <span>{t('mantra_tryambak')}</span>
              </div>

              {/* Dignified Guruji Heading */}
              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#321116] tracking-tight leading-[1.12]">
                  {language === 'mr' ? 'वे.मु. प्रशांत पाठक' : 'Ve.Mu. Prashant Pathak'}
                  <span className="block text-[#C86B24] text-2xl sm:text-4xl mt-2 font-serif font-semibold">
                    {language === 'mr' ? '(गुरुजी)' : '(Guruji)'}
                  </span>
                </h1>
                <p className="text-base sm:text-xl font-serif text-[#5A1720] font-medium tracking-wide">
                  {t('main_tagline')}
                </p>
              </div>

              {/* Glass Service Credo Quote Box */}
              <GlassCard
                variant="white"
                padding="p-4 sm:p-5"
                className="border border-[#B58A3A]/50 shadow-xs relative text-left"
              >
                <SacredCorner position="top-right" />
                <SacredCorner position="bottom-left" />
                <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif italic">
                  &ldquo;{t('official_desc')}&rdquo;
                </p>
              </GlassCard>

              {/* Quality & Tradition Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs font-serif">
                <GlassBadge variant="gold">
                  <Sparkles className="w-3 h-3 text-[#C86B24]" />
                  <span>{language === 'mr' ? 'शुद्ध शास्त्रोक्त विधी' : 'Strict Vedic Shastras'}</span>
                </GlassBadge>
                <GlassBadge variant="saffron">
                  <Sun className="w-3 h-3 text-[#C86B24]" />
                  <span>{language === 'mr' ? 'अचूक मुहूर्त व संकल्प' : 'Precise Auspicious Muhurat'}</span>
                </GlassBadge>
                <GlassBadge variant="maroon">
                  <MapPin className="w-3 h-3 text-[#5A1720]" />
                  <span>{t('location')} — नागपूर व सर्वत्र</span>
                </GlassBadge>
              </div>

              {/* Primary & Secondary Call to Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4">
                <Link
                  href="/book-puja"
                  className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-bold text-[#FAF7F0] bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 rounded-full shadow-[0_8px_25px_rgba(66,18,24,0.35)] hover:shadow-[0_12px_32px_rgba(66,18,24,0.45)] transition-all border border-[#D8B96A]/70 flex items-center justify-center gap-2 group hover:scale-[1.02]"
                >
                  <CalendarCheck className="w-4 h-4 text-[#D8B96A] group-hover:scale-110 transition-transform" />
                  <span>पूजा / विधी बुक करा</span>
                </Link>

                <a
                  href="/api/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-green-600/40 hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('hero.cta_whatsapp')}</span>
                </a>

                <Link
                  href="/services"
                  className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold text-[#321116] bg-[#FAF7F0]/85 hover:bg-[#FAF7F0] rounded-full border border-[#B58A3A]/50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{language === 'mr' ? 'पूजा यादी पहा' : 'View Pujas'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B58A3A]" />
                </Link>
              </div>
            </div>

            {/* Right Column: Authentic Guruji Portrait in Large Temple Arch Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                <TempleArchFrame className="w-72 sm:w-84 md:w-92 aspect-[3.6/5]">
                  {gurujiPhoto ? (
                    <img
                      src={gurujiPhoto}
                      alt="वे.मु. प्रशांत पाठक (गुरुजी)"
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover rounded-t-[10.5rem] sm:rounded-t-[13.5rem] rounded-b-xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 text-[#321116] p-6 text-center">
                      <OmMedallion size="lg" />
                      <div className="space-y-1">
                        <h2 className="font-serif font-bold text-xl text-[#321116]">
                          {language === 'mr' ? 'वे.मु. प्रशांत पाठक' : 'Ve.Mu. Prashant Pathak'}
                        </h2>
                        <p className="text-xs text-[#944B14] font-bold tracking-wider font-serif">
                          ॥ वैदिक पुरोहित सेवा ॥
                        </p>
                      </div>
                      <div className="py-1 px-3 bg-[#FAF7F0] rounded-full border border-[#B58A3A]/40 text-[11px] text-[#282321] font-serif">
                        नागपूर, महाराष्ट्र
                      </div>
                    </div>
                  )}
                </TempleArchFrame>

                {/* Overlaid Floating Liquid Glass Info Card */}
                <div className="absolute -bottom-5 -right-3 sm:-right-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-[#B58A3A]/50 shadow-[0_12px_32px_rgba(90,23,32,0.14)] p-3 sm:p-4 max-w-[210px] sm:max-w-[230px] z-20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5A1720] to-[#C86B24] text-[#FAF7F0] flex items-center justify-center font-serif text-sm font-bold shrink-0">
                      ॐ
                    </div>
                    <div>
                      <p className="font-serif font-bold text-xs text-[#321116] leading-tight">
                        वे.मु. प्रशांत पाठक
                      </p>
                      <p className="text-[10px] text-[#944B14] font-semibold">
                        अधिकृत वैदिक पुरोहित
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#B58A3A]/20 flex items-center justify-between text-[10px] text-[#6F625A]">
                    <span className="flex items-center gap-1 font-serif text-[#5A1720]">
                      <Sparkles className="w-3 h-3 text-[#B58A3A]" />
                      नागपूर व विदर्भ
                    </span>
                    <span className="text-[#B58A3A]">✦ ✦ ✦</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION 2: TRUST / SACRED INTRODUCTION & LINEAGE */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 relative border-b border-[#B58A3A]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <VedicSectionHeader
            badge={language === 'mr' ? '॥ वेदमूर्ती परिचय ॥' : '॥ Guruji Introduction ॥'}
            title={t('guruji_intro.title')}
            subtitle={t('guruji_intro.subtitle')}
          />

          <GlassCard
            variant="ivory"
            padding="p-6 sm:p-10"
            className="border border-[#B58A3A]/45 shadow-[0_12px_40px_rgba(90,23,32,0.06)] relative"
          >
            <SacredCorner position="top-left" />
            <SacredCorner position="bottom-right" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#C86B24]" />
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#321116]">
                    {profile?.guruji_title_mr || 'वेदमूर्ती प्रशांत पाठक (गुरुजी)'}
                  </h3>
                </div>

                <p className="text-[#282321] text-sm sm:text-base leading-relaxed font-serif">
                  {profile?.bio_mr || t('official_desc')}
                </p>

                <p className="text-[#6F625A] text-xs sm:text-sm leading-relaxed font-serif">
                  {language === 'mr'
                    ? 'नागपूरसह संपूर्ण विदर्भ व महाराष्ट्रात अनेक वर्षांपासून अविरतपणे वैदिक धार्मिक विधी, संस्कार व यज्ञांचे पौरोहित्य करत असून यजमानांच्या समाधानास सर्वोच्च प्राधान्य दिले जाते.'
                    : 'Serving Nagpur, Vidarbha, and across Maharashtra for years with uncompromised devotion to Vedic rituals, yajnas, and sanskars.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-2.5 text-xs font-semibold">
                  <GlassBadge variant="gold">
                    <Sparkles className="w-3.5 h-3.5 text-[#C86B24]" />
                    <span>{t('guruji_intro.shastrokta_badge')}</span>
                  </GlassBadge>
                  <GlassBadge variant="saffron">
                    <Sun className="w-3.5 h-3.5 text-[#C86B24]" />
                    <span>{t('guruji_intro.experience_badge')}</span>
                  </GlassBadge>
                  <GlassBadge variant="maroon">
                    <Award className="w-3.5 h-3.5 text-[#5A1720]" />
                    <span>{language === 'mr' ? 'गुरुकुल पद्धती शिक्षण' : 'Gurukul Tradition'}</span>
                  </GlassBadge>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#B58A3A]/40 shadow-xs space-y-3">
                <KalashIcon className="w-12 h-12 text-[#5A1720]" />
                <h4 className="font-serif font-bold text-[#321116] text-base">
                  {language === 'mr' ? 'मुहूर्त व संकल्प शुचिता' : 'Auspicious Muhurat & Sankalpa'}
                </h4>
                <p className="text-xs text-[#6F625A] font-serif leading-relaxed">
                  {language === 'mr'
                    ? 'प्रत्येक विधी शुद्ध साहित्यासह, वैदिक मंत्रोच्चार व यजमानाच्या गोत्र-नक्षत्रानुसार पूर्ण केला जातो.'
                    : 'Every puja performed strictly per Vedic scriptures with pure samagri.'}
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#944B14] hover:text-[#5A1720] pt-1 hover:underline transition-colors"
                >
                  <span>{t('guruji_intro.read_more')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 3: FEATURED SERVICES (ASYMMETRICAL GLASS CARDS) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 relative border-b border-[#B58A3A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#FDF2F4] text-[#5A1720] border border-[#A32938]/30 mb-2">
                <span>॥ प्रमुख पूजा विधी ॥</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#321116]">
                {t('services_sec.title')}
              </h2>
              <p className="text-xs sm:text-sm text-[#944B14] font-serif font-semibold mt-1">
                {t('services_sec.subtitle')}
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-[#321116] bg-[#FAF7F0] hover:bg-white rounded-full border border-[#B58A3A]/50 transition-colors shadow-xs"
            >
              <span>{t('services_sec.view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B58A3A]" />
            </Link>
          </div>

          {/* Asymmetrical Grid: 1 Featured Highlight Card + Grid of Supporting Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {services.slice(0, 6).map((service, index) => (
              <GlassCard
                key={service.id}
                variant={index === 0 ? 'ivory' : 'white'}
                padding="p-0"
                hoverEffect
                className="flex flex-col border border-[#B58A3A]/40 group"
              >
                {/* Architectural Gold Top Header Line */}
                <SacredAccentLine />

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#321116] group-hover:text-[#944B14] transition-colors">
                        {getLocalized(service, 'name')}
                      </h3>
                      <span className="shrink-0 text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF7F0] text-[#5A1720] font-serif font-medium border border-[#B58A3A]/30">
                        {getLocalized(service, 'category_name') || (language === 'mr' ? 'धार्मिक विधी' : 'Vedic Ritual')}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-[#6F625A] line-clamp-3 leading-relaxed font-serif">
                      {getLocalized(service, 'short_desc')}
                    </p>
                  </div>

                  {service.duration && (
                    <div className="pt-3 border-t border-[#B58A3A]/20 text-xs flex items-center gap-2 text-[#6F625A] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#944B14]" />
                      <span>{service.duration}</span>
                    </div>
                  )}
                </div>

                {/* Footer Action Links */}
                <div className="bg-[#FAF7F0]/80 px-6 py-3.5 border-t border-[#B58A3A]/25 flex items-center justify-between text-xs">
                  <Link
                    href={`/services/${service.slug || service.id}`}
                    className="font-medium text-[#5A1720] hover:text-[#944B14] transition-colors flex items-center gap-1 font-serif"
                  >
                    <span>{t('services_sec.view_details')}</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href={`/book-puja?service=${encodeURIComponent(getLocalized(service, 'name'))}`}
                    className="px-4 py-1.5 font-semibold text-[#FAF7F0] bg-gradient-to-r from-[#5A1720] to-[#421218] hover:brightness-110 rounded-full shadow-xs transition-colors border border-[#D8B96A]/50 text-xs"
                  >
                    {t('services_sec.book_now')}
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 4: WHY CHOOSE GURUJI (THREE ARCHITECTURAL PANELS) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 relative border-b border-[#B58A3A]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <VedicSectionHeader
            badge="❖॥ आमची वैशिष्ट्ये ॥❖"
            title="शास्त्रोक्त विधींचे महत्त्व"
            subtitle="आमच्याकडे विधी का करावेत?"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Panel 1 */}
            <GlassCard
              variant="white"
              padding="p-8"
              hoverEffect
              className="text-center space-y-4 border border-[#B58A3A]/45 group relative"
            >
              <SacredCorner position="top-left" />
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#FAF7F0] to-[#F3E8D0] border border-[#B58A3A] flex items-center justify-center text-[#5A1720] shadow-xs group-hover:scale-105 transition-transform">
                <BookOpen className="w-7 h-7 text-[#5A1720]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#321116]">
                शुद्ध वैदिक मंत्रोच्चार
              </h3>
              <p className="text-xs sm:text-sm text-[#6F625A] font-serif leading-relaxed">
                {t('why_choose.item1_desc')}
              </p>
            </GlassCard>

            {/* Panel 2 */}
            <GlassCard
              variant="white"
              padding="p-8"
              hoverEffect
              className="text-center space-y-4 border border-[#B58A3A]/45 group relative"
            >
              <SacredCorner position="top-right" />
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#FAF7F0] to-[#F3E8D0] border border-[#B58A3A] flex items-center justify-center text-[#5A1720] shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-7 h-7 text-[#5A1720]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#321116]">
                संपूर्ण साहित्य यादी व मार्गदर्शन
              </h3>
              <p className="text-xs sm:text-sm text-[#6F625A] font-serif leading-relaxed">
                {t('why_choose.item2_desc')}
              </p>
            </GlassCard>

            {/* Panel 3 */}
            <GlassCard
              variant="white"
              padding="p-8"
              hoverEffect
              className="text-center space-y-4 border border-[#B58A3A]/45 group relative"
            >
              <SacredCorner position="bottom-right" />
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#FAF7F0] to-[#F3E8D0] border border-[#B58A3A] flex items-center justify-center text-[#C86B24] shadow-xs group-hover:scale-105 transition-transform">
                <Sun className="w-7 h-7 text-[#C86B24]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#321116]">
                मुहूर्त व संकल्प शुचिता
              </h3>
              <p className="text-xs sm:text-sm text-[#6F625A] font-serif leading-relaxed">
                {t('why_choose.item3_desc')}
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 5: PUJA PLANNING PROCESS (VISUAL 4-STEP JOURNEY) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 relative border-b border-[#B58A3A]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <VedicSectionHeader
            badge="❖॥ पूजा आयोजन प्रक्रिया ॥❖"
            title={t('booking_flow.title')}
            subtitle={t('booking_flow.subtitle')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <GlassCard
              variant="white"
              padding="p-6"
              hoverEffect
              className="border border-[#B58A3A]/45 space-y-3 relative text-left"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5A1720] to-[#C86B24] text-[#FAF7F0] font-serif font-bold text-sm flex items-center justify-center shadow-md">
                १
              </div>
              <h4 className="font-serif font-bold text-base text-[#321116]">
                १ — पूजा निवडा
              </h4>
              <p className="text-xs text-[#6F625A] font-serif leading-relaxed">
                {t('booking_flow.step1_desc')}
              </p>
            </GlassCard>

            {/* Step 2 */}
            <GlassCard
              variant="white"
              padding="p-6"
              hoverEffect
              className="border border-[#B58A3A]/45 space-y-3 relative text-left"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5A1720] to-[#C86B24] text-[#FAF7F0] font-serif font-bold text-sm flex items-center justify-center shadow-md">
                २
              </div>
              <h4 className="font-serif font-bold text-base text-[#321116]">
                २ — माहिती व तारीख द्या
              </h4>
              <p className="text-xs text-[#6F625A] font-serif leading-relaxed">
                {t('booking_flow.step2_desc')}
              </p>
            </GlassCard>

            {/* Step 3 */}
            <GlassCard
              variant="white"
              padding="p-6"
              hoverEffect
              className="border border-[#B58A3A]/45 space-y-3 relative text-left"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5A1720] to-[#C86B24] text-[#FAF7F0] font-serif font-bold text-sm flex items-center justify-center shadow-md">
                ३
              </div>
              <h4 className="font-serif font-bold text-base text-[#321116]">
                ३ — गुरुजींशी संपर्क
              </h4>
              <p className="text-xs text-[#6F625A] font-serif leading-relaxed">
                {t('booking_flow.step3_desc')}
              </p>
            </GlassCard>

            {/* Step 4 */}
            <GlassCard
              variant="white"
              padding="p-6"
              hoverEffect
              className="border border-[#B58A3A]/45 space-y-3 relative text-left"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5A1720] to-[#C86B24] text-[#FAF7F0] font-serif font-bold text-sm flex items-center justify-center shadow-md">
                ४
              </div>
              <h4 className="font-serif font-bold text-base text-[#321116]">
                ४ — पूजा आयोजन
              </h4>
              <p className="text-xs text-[#6F625A] font-serif leading-relaxed">
                {t('booking_flow.step4_desc')}
              </p>
            </GlassCard>
          </div>

          {/* Central Call-to-Action */}
          <div className="mt-10 text-center">
            <Link
              href="/book-puja"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-[#FAF7F0] bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 shadow-[0_8px_25px_rgba(66,18,24,0.35)] border border-[#D8B96A]/70 transition-all hover:scale-105"
            >
              <CalendarCheck className="w-4 h-4 text-[#D8B96A]" />
              <span>पूजा / विधी बुक करा</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 6: GURUJI / ABOUT SECTION (EDITORIAL BIOGRAPHY) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 relative border-b border-[#B58A3A]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <VedicSectionHeader
            badge="॥ पुरोहित परंपरा व निष्ठा ॥"
            title="वेदमूर्ती प्रशांत पाठक यांच्याविषयी"
            subtitle="सनातन वैदिक संस्कार व शास्त्रोक्त विधींचे नागपूरमधील अग्रगण्य नाव"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <TempleArchFrame className="w-64 sm:w-72 md:w-80 aspect-[3.8/5]">
                {gurujiPhoto ? (
                  <img
                    src={gurujiPhoto}
                    alt="वे.मु. प्रशांत पाठक (गुरुजी)"
                    className="w-full h-full object-cover rounded-t-[9.5rem] sm:rounded-t-[11.5rem] rounded-b-xl"
                  />
                ) : (
                  <div className="p-6 text-center text-[#5A1720]">
                    <OmMedallion size="md" className="mx-auto mb-2" />
                    <p className="font-serif font-bold text-sm">वे.मु. प्रशांत पाठक</p>
                  </div>
                )}
              </TempleArchFrame>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#321116]">
                वैदिक परंपरा, अचूक मंत्रोच्चार आणि यजमानाच्या समाधानाची हमी
              </h3>

              <p className="text-sm text-[#282321] leading-relaxed font-serif">
                वेदमूर्ती प्रशांत पाठक (गुरुजी) नागपूर तसेच संपूर्ण महाराष्ट्रात अनेक वर्षांपासून अविरतपणे वैदिक विधी, वास्तुशांती, गृहप्रवेश, नवग्रह शांती, विवाह, उपनयन संस्कार, सत्यनारायण महापूजा आणि रुद्र अभिषेक यांसारखे सर्व धार्मिक विधी पूर्ण श्रद्धेने व शास्त्रोक्त नियमांनुसार संपन्न करत आहेत.
              </p>

              <div className="space-y-2.5 pt-1 text-xs text-[#282321] font-serif">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C86B24] shrink-0" />
                  <span>यजमानाच्या गोत्र, कुलदैवत आणि नक्षत्रांचा विचार करून अचूक संकल्प.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C86B24] shrink-0" />
                  <span>विधीसाठी लागणाऱ्या संपूर्ण साहित्याची यादी वेळेवर उपलब्ध करून देणे.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C86B24] shrink-0" />
                  <span>विधीदरम्यान यजमानास प्रत्येक कृती व मंत्राचा भावार्थ सहज समजवून सांगणे.</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#FAF7F0] bg-[#5A1720] hover:bg-[#421218] transition-colors border border-[#D8B96A]/60 shadow-xs"
                >
                  सविस्तर परिचय वाचा →
                </Link>
                <a
                  href="/api/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#282321] bg-white/80 hover:bg-white border border-[#B58A3A]/40 transition-colors shadow-xs"
                >
                  गुरुजींशी चर्चा करा
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION 7: TESTIMONIALS (FLOATING GLASS CARDS) */}
      {/* ========================================================================= */}
      {testimonials.length > 0 && (
        <section className="py-16 sm:py-20 relative border-b border-[#B58A3A]/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <VedicSectionHeader
              badge="॥ यजमान अनुभव ॥"
              title={t('testimonials_sec.title')}
              subtitle={t('testimonials_sec.subtitle')}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              {testimonials.slice(0, 3).map((item) => (
                <GlassCard
                  key={item.id}
                  variant="white"
                  padding="p-6"
                  hoverEffect
                  className="border border-[#B58A3A]/40 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#C86B24]">
                      {[...Array(Number(item.rating || 5))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#282321] font-serif leading-relaxed italic">
                      &ldquo;{getLocalized(item, 'review') || item.content_mr || item.content_en}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#B58A3A]/25 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-serif font-bold text-[#321116]">
                        {getLocalized(item, 'client_name')}
                      </p>
                      <p className="text-[11px] text-[#6F625A]">
                        {getLocalized(item, 'city') || 'नागपूर'}
                      </p>
                    </div>
                    {item.service_name && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#5A1720] border border-[#B58A3A]/30 font-serif">
                        {item.service_name}
                      </span>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. SECTION 8: GALLERY PREVIEW (EDITORIAL MASONRY) */}
      {/* ========================================================================= */}
      {gallery.length > 0 && (
        <section className="py-16 sm:py-20 relative border-b border-[#B58A3A]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#FAF7F0] text-[#805E21] border border-[#B58A3A]/50 mb-2">
                  <span>॥ पवित्र विधी छायाचित्रे ॥</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#321116]">
                  {t('gallery_sec.title')}
                </h2>
                <p className="text-xs sm:text-sm text-[#944B14] font-semibold font-serif mt-1">
                  {t('gallery_sec.subtitle')}
                </p>
              </div>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-[#321116] bg-[#FAF7F0] hover:bg-white rounded-full border border-[#B58A3A]/50 transition-colors shadow-xs"
              >
                <span>{t('gallery_sec.view_all')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B58A3A]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {gallery.slice(0, 6).map((img, i) => (
                <div
                  key={img.id || i}
                  onClick={() => setLightboxImg(img.image_url)}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#B58A3A]/40 shadow-xs cursor-pointer bg-[#F3E8D0]/50"
                >
                  <img
                    src={img.image_url}
                    alt={getLocalized(img, 'title') || 'Puja Ritual'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#321116]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-[#FAF7F0]">
                    <p className="font-serif text-xs font-bold leading-tight">
                      {getLocalized(img, 'title')}
                    </p>
                    <p className="text-[10px] text-[#D8B96A]">
                      {getLocalized(img, 'description')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 9. SECTION 9: FINAL MONUMENTAL BOOKING CTA */}
      {/* ========================================================================= */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl bg-gradient-to-br from-[#321116] via-[#5A1720] to-[#421218] p-8 sm:p-14 text-center text-[#FAF7F0] border-2 border-[#D8B96A]/60 shadow-[0_20px_60px_rgba(50,17,22,0.4)] relative overflow-hidden">
            <SacredCorner position="top-left" className="text-[#D8B96A]/60" />
            <SacredCorner position="bottom-right" className="text-[#D8B96A]/60" />

            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#5A1720] to-[#C86B24] border-2 border-[#D8B96A] text-[#FAF7F0] font-serif text-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              ॐ
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#FAF7F0] max-w-2xl mx-auto leading-snug">
              आपल्या घरी शुभकार्यासाठी शास्त्रोक्त पूजा व धार्मिक विधींचे नियोजन करा
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-[#F3E8D0]/90 max-w-xl mx-auto font-serif leading-relaxed">
              वास्तुशांती, सत्यनारायण, विवाह, ग्रहशांती अथवा कोणताही विधी असो — शुद्ध साहित्य, अचूक मुहूर्त आणि संपूर्ण समाधानासाठी आजच संपर्क साधा.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book-puja"
                className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-bold text-[#321116] bg-gradient-to-r from-[#D8B96A] via-[#B58A3A] to-[#9C732B] hover:brightness-105 rounded-full shadow-[0_8px_25px_rgba(181,138,58,0.35)] border border-[#FAF7F0]/40 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-[#321116]" />
                <span>पूजा / विधी बुक करा</span>
              </Link>

              <a
                href="/api/whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-full shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 border border-green-600/40"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp द्वारे संपर्क</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImg}
              alt="Enlarged Ritual Photograph"
              className="max-w-full max-h-[85vh] rounded-2xl border-2 border-[#B58A3A] object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
