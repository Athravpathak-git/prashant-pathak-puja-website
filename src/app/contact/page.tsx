'use client';

import React, { useState } from 'react';
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
  GlassInput,
  GlassTextarea,
  GlassButton,
} from '@/components/LiquidGlassSystem';
import { MapPin, MessageSquare, CalendarCheck, Clock, Send, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const { t, language } = useI18n();

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.message) {
      setErrorMsg('कृपया नाव, मोबाईल आणि संदेश प्रविष्ट करा.');
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);

    // Encode into WhatsApp prefilled message redirect
    const msg = `|| श्री गणेशाय नमः ||\nनाव: ${form.name}\nमोबाईल: ${form.mobile}\nविषय: ${form.subject || 'चौकशी'}\nसंदेश: ${form.message}`;
    window.location.href = `/api/whatsapp?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <VedicSectionHeader
          badge={language === 'mr' ? '॥ संपर्क व मार्गदर्शन ॥' : '॥ Contact & Inquiries ॥'}
          title={t('contact_page.title')}
          subtitle={t('contact_page.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Verified Official Information Panel */}
          <div className="md:col-span-5 space-y-6">
            <GlassCard
              variant="ivory"
              padding="p-6 sm:p-8"
              className="border border-[#B58A3A]/50 space-y-6 relative"
            >
              <SacredCorner position="top-left" />

              <div className="flex items-center gap-3 border-b border-[#B58A3A]/25 pb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#321116] via-[#5A1720] to-[#C86B24] text-[#FAF7F0] flex items-center justify-center font-serif text-2xl font-bold border border-[#D8B96A] shadow-md">
                  ॐ
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#321116]">
                    {language === 'mr' ? 'वे.मु. प्रशांत पाठक (गुरुजी)' : 'Ve.Mu. Prashant Pathak (Guruji)'}
                  </h3>
                  <p className="text-xs text-[#944B14] font-serif font-semibold">
                    {language === 'mr' ? 'शास्त्रोक्त वैदिक पुरोहित' : 'Vedic Purohit Services'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#282321] font-serif">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#5A1720] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#321116]">
                      {t('contact_page.location_label')}
                    </span>
                    <span>{t('location')}</span>
                    <span className="block text-[11px] text-[#6F625A] mt-0.5">
                      (नागपूर, विदर्भ व संपूर्ण महाराष्ट्रात विधी सेवा)
                    </span>
                  </div>
                </div>

                {/* Official WhatsApp Identity */}
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#321116]">
                      {t('contact_page.whatsapp_label')}
                    </span>
                    <span className="font-bold text-emerald-700 font-mono">@PrashantPathakGuruji</span>
                  </div>
                </div>

                {/* Consultation Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#944B14] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#321116]">
                      {t('contact_page.hours_label')}
                    </span>
                    <span>{t('contact_page.hours_val')}</span>
                  </div>
                </div>
              </div>

              {/* Direct Booking Shortcut */}
              <div className="pt-4 border-t border-[#B58A3A]/25">
                <Link
                  href="/book-puja"
                  className="w-full py-3 px-4 rounded-full text-xs font-bold text-[#FAF7F0] bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 shadow-md border border-[#D8B96A]/60 flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <CalendarCheck className="w-4 h-4 text-[#D8B96A]" />
                  <span>थेट पूजा विधी नोंदणी करा</span>
                </Link>
              </div>
            </GlassCard>
          </div>

          {/* Right: Premium Liquid Glass Contact Form */}
          <div className="md:col-span-7">
            <GlassCard
              variant="white"
              padding="p-6 sm:p-10"
              className="border border-[#B58A3A]/50 shadow-[0_12px_40px_rgba(90,23,32,0.06)] space-y-6 relative"
            >
              <SacredCorner position="top-right" />

              <div>
                <h3 className="font-serif font-bold text-lg text-[#321116]">
                  {t('contact_page.form_title')}
                </h3>
                <p className="text-xs text-[#6F625A] font-serif mt-1">
                  आपला संदेश पाठवा; गुरुजींशी थेट WhatsApp द्वारे त्वरित संवाद सुरू होईल.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassInput
                    label={`${t('contact_page.name_placeholder')} *`}
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="उदा. राहुल शर्मा"
                  />

                  <GlassInput
                    label={`${t('contact_page.phone_placeholder')} *`}
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder="उदा. 98XXXXXXXX"
                  />
                </div>

                <GlassInput
                  label="विषय / विधीचे नाव (Subject)"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="उदा. वास्तुशांती विधी चौकशी"
                />

                <GlassTextarea
                  label={`${t('contact_page.msg_placeholder')} *`}
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="आपला संदेश, अपेक्षित तारीख व वेळ येथे लिहा..."
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 disabled:opacity-50 text-[#FAF7F0] font-semibold text-xs sm:text-sm rounded-xl shadow-md border border-[#D8B96A]/60 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4 text-[#D8B96A]" />
                  <span>
                    {submitting ? 'संदेश तयार करत आहे...' : t('contact_page.submit_btn')}
                  </span>
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
