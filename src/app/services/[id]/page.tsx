'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import {
  VedicDivider,
  KalashIcon,
  DiyaIcon,
  SacredCorner,
  TemplePattern,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
  GlassBadge,
} from '@/components/LiquidGlassSystem';
import {
  Clock,
  CalendarCheck,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { t, language, getLocalized } = useI18n();

  const [service, setService] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/services/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.service) {
          setService(d.service);
          fetch(`/api/services?category=${d.service.category_id}`)
            .then((res) => res.json())
            .then((rData) => {
              const others = (rData.services || []).filter((s: any) => s.id !== d.service.id);
              setRelated(others.slice(0, 3));
            })
            .catch(console.error);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-[#5A1720] font-serif font-medium">
        {t('common.loading')}
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#321116]">
          {language === 'mr' ? 'पूजा विधी सापडला नाही' : 'Service Not Found'}
        </h2>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#5A1720] text-[#FAF7F0] rounded-full text-xs font-semibold font-serif"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'mr' ? 'सर्व पूजा सूचीकडे परत जा' : 'Back to Services'}</span>
        </Link>
      </div>
    );
  }

  const serviceName = getLocalized(service, 'name');

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Breadcrumb / Back Link */}
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1720] hover:text-[#C86B24] transition-colors font-serif"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'mr' ? '← सर्व पूजा व विधी' : '← All Pujas & Services'}</span>
          </Link>
        </div>

        {/* Two-Column Layout: Left Details + Right Floating Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Service Title, Description, Sacred Information */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard
              variant="white"
              padding="p-6 sm:p-10"
              className="border border-[#B58A3A]/45 shadow-[0_12px_40px_rgba(90,23,32,0.06)] space-y-6 relative"
            >
              <SacredCorner position="top-left" />

              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F0] text-[#5A1720] border border-[#B58A3A]/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#C86B24]" />
                  <span>{getLocalized(service, 'category_name') || 'धार्मिक विधी'}</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#321116] leading-tight">
                  {serviceName}
                </h1>

                {service.duration && (
                  <div className="flex items-center gap-2 text-xs text-[#C86B24] font-medium font-serif">
                    <Clock className="w-4 h-4" />
                    <span>कालावधी: {service.duration}</span>
                  </div>
                )}
              </div>

              <VedicDivider className="my-2" variant="kalash" />

              {/* Service Description */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-base text-[#321116]">
                  विधीचा सविस्तर परिचय व महत्त्व
                </h3>
                <p className="text-xs sm:text-sm text-[#282321] leading-relaxed font-serif whitespace-pre-line">
                  {getLocalized(service, 'full_desc') || getLocalized(service, 'short_desc')}
                </p>
              </div>

              {/* Samagri Guidance */}
              {service.samagri_summary && (
                <div className="p-5 rounded-2xl bg-[#FAF7F0]/80 border border-[#B58A3A]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#5A1720]">
                    <KalashIcon className="w-4 h-4 text-[#C86B24]" />
                    <span>साहित्य मार्गदर्शन (Samagri Overview)</span>
                  </div>
                  <p className="text-xs text-[#6F625A] font-serif leading-relaxed">
                    {service.samagri_summary}
                  </p>
                </div>
              )}

              {/* Trust Assurances */}
              <div className="pt-4 border-t border-[#B58A3A]/25 space-y-2.5 text-xs text-[#282321] font-serif">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>शुद्ध व शास्त्रोक्त वैदिक मंत्रोच्चारांसह संपूर्ण विधी.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>यजमानाच्या गोत्र, नक्षत्र व कुलदैवतानुसार अचूक संकल्प.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>विधीसाठी आवश्यक सर्व पूजा साहित्याची पूर्वतयारी व मार्गदर्शन.</span>
                </div>
              </div>
            </GlassCard>

            {/* Related Services */}
            {related.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="font-serif font-bold text-lg text-[#321116]">
                  संबंधित विधी (Related Pujas)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <GlassCard
                      key={r.id}
                      variant="white"
                      padding="p-4"
                      hoverEffect
                      className="border border-[#B58A3A]/35 space-y-2"
                    >
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#321116]">
                        {getLocalized(r, 'name')}
                      </h4>
                      <p className="text-[11px] text-[#6F625A] line-clamp-2 font-serif">
                        {getLocalized(r, 'short_desc')}
                      </p>
                      <Link
                        href={`/services/${r.slug || r.id}`}
                        className="text-[11px] text-[#5A1720] font-semibold hover:underline block pt-1 font-serif"
                      >
                        पहा →
                      </Link>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Floating Glass Booking Panel */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <GlassCard
              variant="ivory"
              padding="p-6 sm:p-7"
              className="border-2 border-[#B58A3A]/50 shadow-[0_16px_40px_rgba(90,23,32,0.1)] space-y-5 relative"
            >
              <SacredCorner position="top-right" />

              <div className="text-center space-y-1.5 border-b border-[#B58A3A]/25 pb-4">
                <DiyaIcon className="w-6 h-6 text-[#C86B24] mx-auto" />
                <h3 className="font-serif font-bold text-lg text-[#321116]">
                  हा विधी संपन्न करा
                </h3>
                <p className="text-xs text-[#6F625A] font-serif">
                  शुभ मुहूर्त व तारखेच्या नियोजनासाठी
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/book-puja?service=${encodeURIComponent(serviceName)}`}
                  className="w-full py-3.5 px-4 rounded-full text-xs sm:text-sm font-bold text-[#FAF7F0] bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 shadow-md border border-[#D8B96A]/60 flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <CalendarCheck className="w-4 h-4 text-[#D8B96A]" />
                  <span>पूजा नोंदणी करा (Book Now)</span>
                </Link>

                <a
                  href={`/api/whatsapp?text=${encodeURIComponent(`जय श्री गणेश! मला ${serviceName} विधीबद्दल माहिती व मुहूर्त हवा आहे.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-full text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba59] shadow-sm flex items-center justify-center gap-2 transition-transform hover:scale-105 border border-green-600/40"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp वर चर्चा करा</span>
                </a>
              </div>

              <div className="pt-4 border-t border-[#B58A3A]/20 space-y-2 text-[11.5px] text-[#6F625A] font-serif">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#5A1720]" />
                  <span>नागपूर व संपूर्ण विदर्भ क्षेत्रात उपलब्ध</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#C86B24]" />
                  <span>पंचांगानुसार अचूक शुभ मुहूर्त निवड</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
