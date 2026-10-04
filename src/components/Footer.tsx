'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { MapPin, MessageSquare, Lock } from 'lucide-react';
import { SacredCorner } from './VedicDesignSystem';

export function Footer() {
  const { t, language } = useI18n();
  const pathname = usePathname();

  // If in admin routes, don't show public footer
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-[#321116] via-[#240a0e] to-[#1a0609] text-[#FAF7F0] border-t-2 border-[#B58A3A]/50 relative overflow-hidden">
      {/* Top Sacred Mantra Ribbon */}
      <div className="bg-[#1f070a]/90 py-3 px-4 border-b border-[#B58A3A]/30 text-center relative z-10 shadow-inner">
        <p className="font-serif text-[#D8B96A] text-xs sm:text-sm tracking-widest font-medium select-none">
          ॥ ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Guruji Bio & Vedic Dignity (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5A1720] via-[#C86B24] to-[#B58A3A] border border-[#D8B96A] flex items-center justify-center text-[#FAF7F0] shadow-md">
                <span className="font-serif text-2xl font-bold">ॐ</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#F3E8D0] leading-tight">
                  {language === 'mr' ? 'वे.मु. प्रशांत पाठक (गुरुजी)' : 'Ve.Mu. Prashant Pathak (Guruji)'}
                </h3>
                <p className="text-[11px] text-[#D8B96A] font-serif tracking-wider">
                  ॥ वैदिक पुरोहित सेवा — नागपूर ॥
                </p>
              </div>
            </div>

            <p className="text-xs text-[#FAF7F0]/80 leading-relaxed font-serif">
              {t('official_desc')}
            </p>

            <div className="pt-1 flex items-start gap-2.5 text-xs text-[#FAF7F0]/90 bg-[#5A1720]/30 p-2.5 rounded-xl border border-[#B58A3A]/25">
              <MapPin className="w-4 h-4 text-[#C86B24] shrink-0 mt-0.5" />
              <span>{t('location')} — नागपूर, विदर्भ व सर्वत्र धार्मिक सेवा उपलब्ध</span>
            </div>
          </div>

          {/* Col 2: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-semibold text-sm text-[#D8B96A] mb-3 border-b border-[#B58A3A]/30 pb-1.5 flex items-center gap-1.5">
              <span className="text-[#B58A3A] text-xs">❖</span>
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F0]/80">
              <li>
                <Link href="/" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link href="/book-puja" className="hover:text-[#D8B96A] transition-colors text-[#D8B96A] font-medium flex items-center gap-1">
                  <span>›</span> {t('nav.book_puja')} ✦
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> {t('nav.events')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sacred Pujas (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="font-serif font-semibold text-sm text-[#D8B96A] mb-3 border-b border-[#B58A3A]/30 pb-1.5 flex items-center gap-1.5">
              <span className="text-[#B58A3A] text-xs">❖</span>
              {t('footer.services_links')}
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F0]/80">
              <li>
                <Link href="/services" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> वास्तुशांती (Vastu Shanti)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> सत्यनारायण महापूजा (Satyanarayan)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> महारुद्र / लघुरुद्र अभिषेक (Rudra)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> नवग्रह शांती विधी (Navgrah Shanti)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> उपनयन संस्कार व विवाह विधी (Vivah)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#D8B96A] transition-colors flex items-center gap-1">
                  <span>›</span> कालसर्प व नारायण नागबली
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & WhatsApp (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-semibold text-sm text-[#D8B96A] mb-3 border-b border-[#B58A3A]/30 pb-1.5 flex items-center gap-1.5">
              <span className="text-[#B58A3A] text-xs">❖</span>
              {t('footer.contact_info')}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="bg-[#5A1720]/40 p-3.5 rounded-2xl border border-[#B58A3A]/30 shadow-md">
                <span className="block text-[#D8B96A] font-medium mb-1.5 text-xs">अधिकृत WhatsApp संपर्क:</span>
                <a
                  href="/api/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 font-bold hover:text-green-300 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>@PrashantPathakGuruji</span>
                </a>
              </div>

              <p className="text-[11.5px] text-[#FAF7F0]/75 leading-relaxed font-serif">
                {language === 'mr'
                  ? 'संपूर्ण विधी शास्त्रोक्त पद्धतीने शुद्ध सामग्री, वेदोक्त मंत्रोच्चार व पूर्ण संकल्पानुसार संपन्न केले जातात.'
                  : 'All rituals conducted strictly conforming to authentic Vedic Shastras with pure samagri.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Accessible 🔒 Admin link */}
        <div className="mt-12 pt-6 border-t border-[#B58A3A]/25 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8B96A]/80 gap-3">
          <p>{t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              aria-label="Admin Portal"
              className="inline-flex items-center gap-1 text-[11px] text-[#D8B96A]/80 hover:text-[#FAF7F0] transition-colors focus:ring-1 focus:ring-[#D8B96A] px-2 py-0.5 rounded border border-[#B58A3A]/30"
            >
              <span>🔒 Admin</span>
            </Link>
            <p className="flex items-center gap-2">
              <span>{t('footer.credits')}</span>
              <span className="text-[#D8B96A] font-serif font-bold">॥ शुभं भवतु ॥</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
