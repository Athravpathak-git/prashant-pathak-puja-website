'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
  VedicSectionHeader,
  VedicDivider,
  SacredCorner,
  TemplePattern,
  DiyaIcon,
  KalashIcon,
  SacredAccentLine,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
  GlassButton,
  GlassBadge,
} from '@/components/LiquidGlassSystem';
import { Clock, Search, ArrowRight, CalendarCheck, Sparkles, MessageSquare } from 'lucide-react';

export default function ServicesPage() {
  const { t, language, getLocalized } = useI18n();

  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([sData, cData]) => {
        setServices(sData.services || []);
        setCategories(cData.categories || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter((s) => {
    const matchesCat =
      selectedCat === 'all' ||
      s.category_slug === selectedCat ||
      String(s.category_id) === selectedCat;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      s.name_mr.toLowerCase().includes(term) ||
      s.name_en.toLowerCase().includes(term) ||
      (s.short_desc_mr && s.short_desc_mr.toLowerCase().includes(term)) ||
      (s.short_desc_en && s.short_desc_en.toLowerCase().includes(term));

    return matchesCat && matchesSearch;
  });

  const featuredService = services.find((s) => s.is_featured) || services[0];

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header */}
        <VedicSectionHeader
          badge={language === 'mr' ? '॥ शास्त्रोक्त पूजा व संस्कार ॥' : '॥ Vedic Pujas & Sanskars ॥'}
          title={t('services_sec.title')}
          subtitle={
            language === 'mr'
              ? 'वेदमूर्ती प्रशांत पाठक (गुरुजी) यांच्या मार्गदर्शनाखाली शुद्ध साहित्यासह वैदिक पद्धतीने संपन्न होणारे सर्व विधी.'
              : t('services_sec.subtitle')
          }
        />

        {/* Featured Service Highlight Banner (if available) */}
        {featuredService && !searchTerm && selectedCat === 'all' && (
          <GlassCard
            variant="ivory"
            padding="p-6 sm:p-10"
            className="border-2 border-[#B58A3A]/60 shadow-[0_16px_50px_rgba(90,23,32,0.08)] relative overflow-hidden"
          >
            <SacredCorner position="top-left" />
            <SacredCorner position="bottom-right" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF2F4] text-[#5A1720] border border-[#A32938]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#944B14]" />
                  <span>विशेष विधी (Featured Puja)</span>
                </div>

                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#321116]">
                  {getLocalized(featuredService, 'name')}
                </h2>

                <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif max-w-2xl">
                  {getLocalized(featuredService, 'short_desc')}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={`/book-puja?service=${encodeURIComponent(getLocalized(featuredService, 'name'))}`}
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-[#FAF7F0] bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 shadow-md border border-[#D8B96A]/60 flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <CalendarCheck className="w-4 h-4 text-[#D8B96A]" />
                    <span>हा विधी बुक करा</span>
                  </Link>

                  <Link
                    href={`/services/${featuredService.slug || featuredService.id}`}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#5A1720] bg-white/80 hover:bg-white border border-[#B58A3A]/40 transition-colors flex items-center gap-1.5"
                  >
                    <span>सविस्तर माहिती वाचा</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-[#B58A3A]/40 shadow-xs space-y-2">
                <KalashIcon className="w-14 h-14 text-[#5A1720]" />
                <p className="font-serif font-bold text-sm text-[#321116]">
                  वेदोक्त मंत्रोच्चार व संकल्प
                </p>
                <p className="text-[11px] text-[#6F625A] font-serif">
                  नागपूर व संपूर्ण विदर्भ
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Search & Category Filter Navigation */}
        <GlassCard
          variant="white"
          padding="p-5 sm:p-7"
          className="border border-[#B58A3A]/40 shadow-xs space-y-5"
        >
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="w-4 h-4 text-[#B58A3A] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'पूजा किंवा विधी शोधा (उदा. वास्तुशांती, सत्यनारायण...)'
                  : 'Search puja or ceremony (e.g. Vastu, Satyanarayan...)'
              }
              className="w-full pl-11 pr-4 py-2.5 bg-white/90 border border-[#B58A3A]/40 rounded-full text-xs sm:text-sm font-serif focus:outline-none focus:ring-2 focus:ring-[#B58A3A]/30 focus:bg-white transition-all text-[#282321]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedCat('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold font-serif border transition-all ${
                selectedCat === 'all'
                  ? 'bg-gradient-to-r from-[#5A1720] to-[#421218] text-[#FAF7F0] border-[#D8B96A]/60 shadow-xs'
                  : 'bg-[#FAF7F0]/80 text-[#282321] border-[#B58A3A]/35 hover:bg-white'
              }`}
            >
              {language === 'mr' ? 'सर्व विधी (All)' : 'All Pujas'}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCat(c.slug || String(c.id))}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-serif border transition-all ${
                  selectedCat === c.slug || selectedCat === String(c.id)
                    ? 'bg-gradient-to-r from-[#5A1720] to-[#421218] text-[#FAF7F0] border-[#D8B96A]/60 shadow-xs'
                    : 'bg-[#FAF7F0]/80 text-[#282321] border-[#B58A3A]/35 hover:bg-white'
                }`}
              >
                {getLocalized(c, 'name')}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Asymmetrical Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filtered.map((service) => (
            <GlassCard
              key={service.id}
              variant="white"
              padding="p-0"
              hoverEffect
              className="flex flex-col border border-[#B58A3A]/40 group"
            >
              {/* Header Accent Band */}
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

        {/* Bottom Booking Call to Action */}
        <div className="pt-6">
          <GlassCard
            variant="dark"
            padding="p-8 sm:p-12"
            className="text-center space-y-4 max-w-4xl mx-auto border-2 border-[#D8B96A]/50 relative"
          >
            <SacredCorner position="top-left" className="text-[#D8B96A]/60" />
            <SacredCorner position="bottom-right" className="text-[#D8B96A]/60" />

            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#FAF7F0]">
              इतर कोणत्याही विशेष धार्मिक विधीसाठी थेट संपर्क साधा
            </h3>
            <p className="text-xs sm:text-sm text-[#F3E8D0]/90 max-w-xl mx-auto font-serif">
              कुंडली मार्गदर्शन, नक्षत्र दोष निवारण अथवा विशेष यज्ञासाठी गुरुजींशी थेट चर्चा करून मुहूर्त निश्चित करा.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/book-puja"
                className="px-7 py-3 rounded-full text-xs font-bold text-[#321116] bg-gradient-to-r from-[#D8B96A] via-[#B58A3A] to-[#9C732B] hover:brightness-105 shadow-md border border-[#FAF7F0]/40 transition-transform hover:scale-105"
              >
                पूजा / विधी बुक करा
              </Link>
              <a
                href="/api/whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 rounded-full text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] shadow-md transition-transform hover:scale-105 flex items-center gap-2 border border-green-600/40"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp वर बोला</span>
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
