'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
  VedicSectionHeader,
  TemplePattern,
  SacredCorner,
  DiyaIcon,
  KalashIcon,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
} from '@/components/LiquidGlassSystem';
import { ChevronDown, Search, HelpCircle, MessageSquare } from 'lucide-react';

export default function FaqPage() {
  const { t, language, getLocalized } = useI18n();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/faqs')
      .then((r) => r.json())
      .then((d) => setFaqs(d.faqs || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = faqs.filter((f) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      f.question_mr.toLowerCase().includes(term) ||
      f.question_en.toLowerCase().includes(term) ||
      f.answer_mr.toLowerCase().includes(term) ||
      f.answer_en.toLowerCase().includes(term)
    );
  });

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <VedicSectionHeader
          badge={language === 'mr' ? '॥ शंका व समाधान ॥' : '॥ Questions & Clarifications ॥'}
          title={t('faq_sec.title')}
          subtitle={t('faq_sec.subtitle')}
        />

        {/* Two-Column Premium FAQ Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: FAQ Introduction & Decorative Temple Geometry */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard
              variant="ivory"
              padding="p-6 sm:p-8"
              className="border border-[#B58A3A]/50 space-y-5 relative"
            >
              <SacredCorner position="top-left" />

              <div className="space-y-2">
                <DiyaIcon className="w-8 h-8 text-[#C86B24]" />
                <h3 className="font-serif font-bold text-lg text-[#321116]">
                  विधी व मुहूर्त मार्गदर्शन
                </h3>
                <p className="text-xs text-[#6F625A] font-serif leading-relaxed">
                  पूजेचे नियोजन, लागणारे साहित्य, मुहूर्त आणि शास्त्रोक्त नियमांबद्दल यजमानांच्या नेहमीच्या प्रश्नांची उत्तरे येथे दिली आहेत.
                </p>
              </div>

              <div className="pt-2 border-t border-[#B58A3A]/25 space-y-3 text-xs text-[#282321] font-serif">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#944B14] font-bold text-sm">✦</span>
                  <span>विधीच्या किमान २ ते ३ दिवस आधी संपर्क साधणे योग्य ठरते.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#944B14] font-bold text-sm">✦</span>
                  <span>पंचांगानुसार अचूक शुभ तिथी व वेळ गुरुजी सुचवतील.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#944B14] font-bold text-sm">✦</span>
                  <span>साहित्याची सविस्तर यादी डिजिटल स्वरूपात पाठवली जाते.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#B58A3A]/25">
                <p className="text-[11px] text-[#6F625A] font-serif mb-2">
                  आपला प्रश्न येथे आढळला नाही?
                </p>
                <a
                  href="/api/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>थेट गुरुजींना विचारा</span>
                </a>
              </div>
            </GlassCard>
          </div>

          {/* RIGHT: Search & Accessible Glass Accordion */}
          <div className="lg:col-span-8 space-y-5">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#B58A3A] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  language === 'mr'
                    ? 'प्रश्न शोधा (उदा. साहित्य, मुहूर्त, बुकिंग...)'
                    : 'Search questions (e.g. samagri, muhurat, booking...)'
                }
                className="w-full pl-11 pr-4 py-2.5 bg-white/85 backdrop-blur-md border border-[#B58A3A]/40 rounded-full text-xs sm:text-sm font-serif focus:outline-none focus:ring-2 focus:ring-[#B58A3A]/30 focus:bg-white transition-all text-[#282321]"
              />
            </div>

            {loading ? (
              <div className="py-20 text-center text-[#5A1720] font-serif font-medium text-sm">
                {t('common.loading')}
              </div>
            ) : filtered.length === 0 ? (
              <GlassCard variant="white" padding="p-12" className="text-center text-[#6F625A] text-sm font-serif">
                {language === 'mr' ? 'कोणताही प्रश्न सापडला नाही.' : 'No matching questions found.'}
              </GlassCard>
            ) : (
              <div className="space-y-3.5">
                {filtered.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <GlassCard
                      key={faq.id}
                      variant="white"
                      padding="p-0"
                      className="border border-[#B58A3A]/40 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                        className="w-full p-4 sm:p-5 text-left font-serif font-bold text-xs sm:text-sm text-[#321116] flex items-center justify-between gap-4 hover:bg-[#FAF7F0]/60 transition-colors focus:outline-none"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-3">
                          <HelpCircle className="w-4 h-4 text-[#944B14] shrink-0" />
                          <span>{getLocalized(faq, 'question')}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[#944B14] transition-transform duration-200 shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-[#282321] font-serif leading-relaxed border-t border-[#B58A3A]/20 pt-3.5 pl-11 whitespace-pre-line animate-in fade-in duration-150">
                          {getLocalized(faq, 'answer')}
                        </div>
                      )}
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
