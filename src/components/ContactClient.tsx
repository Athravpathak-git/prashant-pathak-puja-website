'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
  VedicSectionHeader,
  TemplePattern,
  SacredCorner,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
  GlassInput,
  GlassTextarea,
} from '@/components/LiquidGlassSystem';
import { MapPin, MessageSquare, CalendarCheck, Clock, AlertCircle, CheckCircle2, User, Phone, FileText } from 'lucide-react';

export function ContactClient() {
  const { t, language } = useI18n();

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    mobile?: string;
    message?: string;
    general?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const validate = () => {
    const newErrors: { name?: string; mobile?: string; message?: string } = {};
    const trimmedName = form.name.trim();
    const rawMobile = form.mobile.trim();
    const trimmedMsg = form.message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      newErrors.name = t('contact_page.validation_name', 'कृपया आपले पूर्ण नाव प्रविष्ट करा.');
    }

    // Validate 10-digit Indian mobile number (allows optional +91 or 0 prefix)
    const digitsOnly = rawMobile.replace(/\D/g, '');
    const isValidDigits =
      digitsOnly.length === 10 ||
      (digitsOnly.length === 11 && digitsOnly.startsWith('0')) ||
      (digitsOnly.length === 12 && digitsOnly.startsWith('91'));

    if (!rawMobile || !isValidDigits) {
      newErrors.mobile = t('contact_page.validation_mobile', 'कृपया १० अंकी वैध मोबाईल नंबर प्रविष्ट करा.');
    }

    if (!trimmedMsg || trimmedMsg.length < 3) {
      newErrors.message = t('contact_page.validation_message', 'कृपया आपला संदेश लिहा.');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setSubmittedNotice(false);
      return;
    }

    setSubmitting(true);
    setSubmittedNotice(true);

    // Build structured, authentic Marathi prefilled text for WhatsApp consultation
    const messageLines = [
      '|| श्री गणेशाय नमः ||',
      '',
      'सस्नेह नमस्कार वे.मु. प्रशांत पाठक गुरुजी,',
      `नाव: ${form.name.trim()}`,
      `मोबाईल: ${form.mobile.trim()}`,
      `विषय / विधी: ${form.subject.trim() || 'पूजा विधी मार्गदर्शन चौकशी'}`,
      `संदेश: ${form.message.trim()}`,
      '',
      '(वेबसाईट संपर्क फॉर्मद्वारे चौकशी)',
    ];

    const fullMessage = messageLines.join('\n');
    const whatsappUrl = `/api/whatsapp?text=${encodeURIComponent(fullMessage)}`;

    // Safely open WhatsApp
    try {
      const newWin = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch {
      window.location.href = whatsappUrl;
    }

    setTimeout(() => {
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <VedicSectionHeader
          badge={language === 'mr' ? '॥ संपर्क व मार्गदर्शन ॥' : '॥ Contact & Inquiries ॥'}
          title={t('contact_page.title', 'संपर्क साधा')}
          subtitle={t('contact_page.subtitle', 'वे.मु. प्रशांत पाठक (गुरुजी) — नागपूर')}
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
                  <MapPin className="w-5 h-5 text-[#5A1720] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-bold block text-[#321116]">
                      {t('contact_page.location_label', 'स्थान:')}
                    </span>
                    <span>{t('location', 'नागपूर, महाराष्ट्र')}</span>
                    <span className="block text-[11px] text-[#6F625A] mt-0.5">
                      (नागपूर, विदर्भ व संपूर्ण महाराष्ट्रात विधी सेवा)
                    </span>
                  </div>
                </div>

                {/* Official WhatsApp Identity */}
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-bold block text-[#321116]">
                      {t('contact_page.whatsapp_label', 'अधिकृत WhatsApp:')}
                    </span>
                    <a
                      href="/api/whatsapp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
                    >
                      {language === 'mr' ? 'थेट चॅट सुरू करा' : 'Start Direct Chat'}
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>

                {/* Consultation Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#944B14] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-bold block text-[#321116]">
                      {t('contact_page.hours_label', 'संपर्क वेळ:')}
                    </span>
                    <span>{t('contact_page.hours_val', 'सकाळी ७:०० ते रात्री ९:००')}</span>
                  </div>
                </div>
              </div>

              {/* Direct Booking Shortcut */}
              <div className="pt-4 border-t border-[#B58A3A]/25">
                <Link
                  href="/book-puja"
                  className="w-full py-3 px-4 rounded-full text-xs font-bold text-[#FAF7F0] bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 shadow-md border border-[#D8B96A]/60 flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <CalendarCheck className="w-4 h-4 text-[#D8B96A]" aria-hidden="true" />
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
                  {t('contact_page.form_title', 'आपला संदेश पाठवा')}
                </h3>
                <p className="text-xs text-[#6F625A] font-serif mt-1">
                  {t(
                    'contact_page.form_subtitle',
                    'आपला संदेश पाठवा; गुरुजींशी थेट WhatsApp द्वारे त्वरित संवाद सुरू होईल.'
                  )}
                </p>
              </div>

              {/* Validation Summary Alert */}
              {Object.keys(errors).length > 0 && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
                  <span>
                    {t('contact_page.validation_required', 'कृपया सर्व आवश्यक माहिती योग्यरित्या प्रविष्ट करा.')}
                  </span>
                </div>
              )}

              {/* Active WhatsApp Launch Guidance */}
              {submittedNotice && Object.keys(errors).length === 0 && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">
                      {language === 'mr' ? 'WhatsApp सुरू होत आहे...' : 'Launching WhatsApp...'}
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      {language === 'mr'
                        ? 'कृपया उघडलेल्या WhatsApp मध्ये संदेश तपासून पाठवा (Send) बटण दाबा. गुरुजींशी थेट संवाद सुरू होईल.'
                        : 'Please review the message in WhatsApp and tap Send to start the conversation.'}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassInput
                    id="contact-name"
                    name="name"
                    label={`${t('contact_page.form_name', 'आपले पूर्ण नाव')} *`}
                    required
                    aria-required="true"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder={t('contact_page.name_placeholder', 'आपले पूर्ण नाव')}
                    error={errors.name}
                    icon={User}
                    autoComplete="name"
                  />

                  <GlassInput
                    id="contact-mobile"
                    name="mobile"
                    type="tel"
                    label={`${t('contact_page.form_mobile', 'मोबाईल नंबर')} *`}
                    required
                    aria-required="true"
                    value={form.mobile}
                    onChange={(e) => {
                      setForm({ ...form, mobile: e.target.value });
                      if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
                    }}
                    placeholder={t('contact_page.phone_placeholder', 'मोबाईल नंबर')}
                    error={errors.mobile}
                    icon={Phone}
                    autoComplete="tel"
                  />
                </div>

                <GlassInput
                  id="contact-subject"
                  name="subject"
                  label={t('contact_page.subject_label', 'विषय / विधीचे नाव')}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder={t('contact_page.subject_placeholder', 'उदा. वास्तुशांती विधी चौकशी')}
                  icon={FileText}
                />

                <GlassTextarea
                  id="contact-message"
                  name="message"
                  label={`${t('contact_page.form_message', 'आपला संदेश')} *`}
                  required
                  aria-required="true"
                  rows={4}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  placeholder={t('contact_page.msg_placeholder', 'आपला संदेश लिहा')}
                  error={errors.message}
                />

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-label={t('contact_page.submit_btn', 'WhatsApp वर संदेश पाठवा')}
                    className="w-full py-3.5 bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-[#FAF7F0] font-semibold text-xs sm:text-sm rounded-xl shadow-md border border-[#D8B96A]/60 flex items-center justify-center gap-2.5 transition-all"
                  >
                    {/* Authentic WhatsApp Icon with SVG accessibility guardrails */}
                    <svg
                      className="w-5 h-5 fill-current text-[#25D366] shrink-0"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12.031 2C6.5 2 2 6.5 2 12.031C2 13.805 2.469 15.484 3.297 16.953L2 22L7.203 20.703C8.625 21.469 10.266 21.906 12.031 21.906C17.562 21.906 22.062 17.406 22.062 11.875C22.062 6.344 17.562 2 12.031 2ZM16.484 16.031C16.297 16.547 15.344 17.062 14.938 17.109C14.531 17.156 14 17.172 12.094 16.422C9.656 15.469 8.078 13.016 7.953 12.844C7.828 12.672 6.969 11.531 6.969 10.359C6.969 9.188 7.562 8.625 7.812 8.359C8.031 8.125 8.344 8.031 8.562 8.031C8.719 8.031 8.875 8.031 9 8.047C9.219 8.062 9.328 8.094 9.469 8.438C9.641 8.844 10.062 9.875 10.109 9.984C10.156 10.094 10.203 10.219 10.125 10.359C10.047 10.5 9.984 10.578 9.875 10.703C9.766 10.828 9.641 10.984 9.547 11.094C9.438 11.203 9.328 11.328 9.453 11.547C9.578 11.766 10.016 12.484 10.656 13.047C11.484 13.781 12.172 14.016 12.391 14.125C12.609 14.234 12.75 14.203 12.875 14.062C13 13.922 13.422 13.422 13.562 13.219C13.703 13.016 13.859 13.047 14.078 13.125C14.297 13.203 15.484 13.797 15.719 13.922C15.953 14.047 16.109 14.109 16.172 14.203C16.234 14.312 16.234 14.797 16.047 15.312L16.484 16.031Z" />
                    </svg>
                    <span>
                      {submitting
                        ? (language === 'mr' ? 'WhatsApp सुरू करत आहे...' : 'Opening WhatsApp...')
                        : t('contact_page.submit_btn', 'WhatsApp वर संदेश पाठवा')}
                    </span>
                  </button>

                  <p className="text-[11px] text-[#6F625A] text-center font-serif leading-relaxed px-2">
                    {t(
                      'contact_page.submit_note',
                      'नोंद: बटण दाबल्यानंतर WhatsApp उघडेल, जिथे आपण संदेश तपासून पाठवू (Send) शकता.'
                    )}
                  </p>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
