'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
  VedicDivider,
  TempleArchFrame,
  SacredCorner,
  TemplePattern,
  DiyaIcon,
  KalashIcon,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
  GlassBadge,
} from '@/components/LiquidGlassSystem';
import {
  MapPin,
  CalendarCheck,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Sun,
  Award,
  Sparkles,
} from 'lucide-react';

interface AboutClientProps {
  initialProfile: any;
}

export function AboutClient({ initialProfile }: AboutClientProps) {
  const { t, language } = useI18n();
  const [profile, setProfile] = useState<any>(initialProfile);

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.profile) setProfile(d.profile);
      })
      .catch(console.error);
  }, []);

  const photoUrl = profile?.about_photo_url || profile?.primary_photo_url || profile?.hero_image_url;

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F0] text-[#805E21] border border-[#B58A3A]/45 mx-auto">
            <span>{language === 'mr' ? '॥ वैदिक परंपरा व सेवा संकल्प ॥' : '॥ Vedic Heritage & Service ॥'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#321116] tracking-tight">
            {language === 'mr' ? 'वे.मु. प्रशांत पाठक (गुरुजींविषयी)' : 'About Ve.Mu. Prashant Pathak (Guruji)'}
          </h1>
          <p className="text-xs sm:text-sm text-[#C86B24] font-serif font-medium">
            {language === 'mr' ? 'नागपूर, महाराष्ट्र — शास्त्रोक्त धार्मिक विधी व पौरोहित्य सेवा' : 'Nagpur, Maharashtra — Authentic Vedic Purohit Services'}
          </p>
          <VedicDivider />
        </div>

        {/* Guruji Bio Main Editorial Card */}
        <GlassCard
          variant="white"
          padding="p-6 sm:p-12"
          className="border border-[#B58A3A]/50 shadow-[0_16px_50px_rgba(90,23,32,0.08)] relative"
        >
          <SacredCorner position="top-left" />
          <SacredCorner position="bottom-right" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Guruji Portrait in Large Temple Arch */}
            <div className="md:col-span-5 flex justify-center">
              <TempleArchFrame className="w-68 sm:w-76 aspect-[3.7/5] shadow-xl">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="वे.मु. प्रशांत पाठक (गुरुजी)"
                    className="w-full h-full object-cover rounded-t-[10.5rem] sm:rounded-t-[13.5rem] rounded-b-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <KalashIcon className="w-16 h-16 text-[#5A1720] mb-3" />
                    <h3 className="font-serif font-bold text-[#321116] text-base">
                      {language === 'mr' ? 'वे.मु. प्रशांत पाठक' : 'Ve.Mu. Prashant Pathak'}
                    </h3>
                    <p className="text-xs text-[#C86B24] font-medium mt-1">
                      नागपूर (Nagpur)
                    </p>
                  </div>
                )}
              </TempleArchFrame>
            </div>

            {/* Bio Details */}
            <div className="md:col-span-7 space-y-5 text-[#282321] text-xs sm:text-sm leading-relaxed font-serif">
              <div className="border-l border-[#B58A3A]/60 pl-4 py-1 space-y-1">
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#321116]">
                  {profile?.guruji_title_mr || 'वेदमूर्ती प्रशांत पाठक (गुरुजी)'}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#944B14] font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#5A1720]" />
                  <span>कर्मभूमी: नागपूर, विदर्भ व सर्वत्र महाराष्ट्र</span>
                </div>
              </div>

              <p className="leading-relaxed">
                {profile?.bio_mr ||
                  'वेदमूर्ती प्रशांत पाठक (गुरुजी) सनातन वैदिक संस्कृती आणि शास्त्रोक्त धार्मिक विधींचे अग्रगण्य अभ्यासक आहेत. पारंपरिक गुरुकुल पद्धतीतून वेद, उपनिषद, कर्मकांड व पौरोहित्याचे गहन शिक्षण प्राप्त करून त्यांनी अनेक वर्षांपासून समाजोपयोगी धार्मिक सेवा अविरतपणे दिली आहे.'}
              </p>

              <p className="leading-relaxed text-[#6F625A]">
                वास्तुशांती, गृहप्रवेश, सत्यनारायण महापूजा, नक्षत्र-ग्रह शांती, विवाह संस्कार, उपनयन आणि रुद्र अभिषेक यांसारखे सर्व विधी यजमानाच्या गोत्र, नक्षत्र व शुचिता विचारात घेऊन संपन्न केले जातात. विधीपूर्वी संपूर्ण साहित्याचे स्पष्ट मार्गदर्शन दिले जाते जेणेकरून विधी निर्विघ्न पार पडावा.
              </p>

              {/* Quality & Credential Badges */}
              <div className="pt-2 flex flex-wrap gap-2.5 text-xs font-semibold">
                <GlassBadge variant="gold">
                  <Sparkles className="w-3.5 h-3.5 text-[#C86B24]" />
                  <span>शास्त्रोक्त विधी व संकल्प</span>
                </GlassBadge>
                <GlassBadge variant="saffron">
                  <Sun className="w-3.5 h-3.5 text-[#C86B24]" />
                  <span>अचूक मुहूर्त निवड</span>
                </GlassBadge>
                <GlassBadge variant="maroon">
                  <Award className="w-3.5 h-3.5 text-[#5A1720]" />
                  <span>गुरुकुल वेद परंपरा</span>
                </GlassBadge>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <Link
                  href="/book-puja"
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-[#FAF7F0] bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 shadow-md border border-[#D8B96A]/60 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <CalendarCheck className="w-4 h-4 text-[#D8B96A]" />
                  <span>पूजा विधी बुक करा</span>
                </Link>

                <a
                  href="/api/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] shadow-md flex items-center gap-2 transition-transform hover:scale-105 border border-green-600/40"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp वर संपर्क</span>
                </a>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Sacred Principles (Three Architectural Panels) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="ivory" padding="p-6" hoverEffect className="space-y-3 border border-[#B58A3A]/40 text-center">
            <div className="w-12 h-12 rounded-full bg-white border border-[#B58A3A]/40 flex items-center justify-center text-[#5A1720] mx-auto shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#321116]">
              शुद्ध व वेदोक्त मंत्रोच्चार
            </h3>
            <p className="text-xs text-[#6F625A] font-serif leading-relaxed">
              प्रत्येक ऋचा व श्लोक शास्त्रोक्त स्वराघात व शुद्ध उच्चारणासह पठण केले जातात.
            </p>
          </GlassCard>

          <GlassCard variant="ivory" padding="p-6" hoverEffect className="space-y-3 border border-[#B58A3A]/40 text-center">
            <div className="w-12 h-12 rounded-full bg-white border border-[#B58A3A]/40 flex items-center justify-center text-[#5A1720] mx-auto shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#321116]">
              पवित्र सामग्री व शुचिता
            </h3>
            <p className="text-xs text-[#6F625A] font-serif leading-relaxed">
              विधीमध्ये केवळ शुद्ध, अस्सल व प्रमाणित पूजोपयोगी साहित्याचा वापर करण्याचे मार्गदर्शन.
            </p>
          </GlassCard>

          <GlassCard variant="ivory" padding="p-6" hoverEffect className="space-y-3 border border-[#B58A3A]/40 text-center">
            <div className="w-12 h-12 rounded-full bg-white border border-[#B58A3A]/40 flex items-center justify-center text-[#944B14] mx-auto shadow-xs">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#321116]">
              यजमान समाधान व आदर
            </h3>
            <p className="text-xs text-[#6F625A] font-serif leading-relaxed">
              विधीची प्रत्येक कृती यजमानांना शांततेने समजावून सांगून मनःशांती व आनंद प्रदान करणे.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
