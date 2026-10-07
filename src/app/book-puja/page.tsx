'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import {
  VedicSectionHeader,
  VedicDivider,
  SacredCorner,
  DiyaIcon,
  KalashIcon,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
  GlassInput,
  GlassSelect,
  GlassTextarea,
  GlassButton,
  GlassBadge,
} from '@/components/LiquidGlassSystem';
import {
  CalendarCheck,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Users,
} from 'lucide-react';

function BookPujaForm() {
  const { t, language, getLocalized } = useI18n();
  const searchParams = useSearchParams();

  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    email: '',
    service_id: '',
    service_name: searchParams.get('service') || '',
    preferred_date: '',
    preferred_time: 'सकाळ (Morning 7 AM - 11 AM)',
    people_count: '',
    address: '',
    area: '',
    city: 'नागपूर (Nagpur)',
    pincode: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((d) => setServices(d.services || []))
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'service_id') {
        const found = services.find((s) => String(s.id) === value);
        if (found) {
          updated.service_name = getLocalized(found, 'name');
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'नोंदणी करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
      }

      setSuccessBooking(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <VedicSectionHeader
          badge={language === 'mr' ? '॥ शुभ मुहूर्त व विधी नोंदणी ॥' : '॥ Auspicious Puja Booking ॥'}
          title="पूजा / धार्मिक विधी बुकिंग"
          subtitle={
            language === 'mr'
              ? 'आपल्या घर, कार्यालय अथवा तीर्थक्षेत्रासाठी शास्त्रोक्त पूजा विधींचे आगाऊ आरक्षण करा.'
              : 'Reserve authentic Vedic pujas with auspicious muhurat guidance by Guruji.'
          }
        />

        {/* Success Screen */}
        {successBooking ? (
          <GlassCard
            variant="ivory"
            padding="p-8 sm:p-14"
            className="border-2 border-[#B58A3A]/70 text-center space-y-6 max-w-2xl mx-auto relative"
          >
            <SacredCorner position="top-left" />
            <SacredCorner position="bottom-right" />

            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#321116]">
                {t('booking_page.success_title')}
              </h2>
              <p className="text-xs sm:text-sm text-[#6F625A] max-w-lg mx-auto leading-relaxed font-serif">
                {t('booking_page.success_note')}
              </p>
            </div>

            {/* Reference Box */}
            <div className="p-5 bg-white/80 rounded-2xl border border-[#B58A3A]/50 inline-block shadow-xs">
              <span className="text-xs text-[#6F625A] block font-serif mb-1">
                {t('booking_page.success_desc')}
              </span>
              <span className="font-mono font-bold text-2xl text-[#5A1720] tracking-wider">
                {successBooking.reference_no}
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`/api/whatsapp?text=${encodeURIComponent(
                  `जय श्री गणेश! मी पूजा विधी नोंदणी विनंती पाठवली आहे. संदर्भ क्रमांक: ${successBooking.reference_no}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm rounded-full shadow-md flex items-center justify-center gap-2 transition-all border border-green-600/40"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp द्वारे संदर्भ पाठवा</span>
              </a>

              <Link
                href="/"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#5A1720] to-[#421218] text-[#FAF7F0] font-semibold text-xs sm:text-sm rounded-full shadow-md border border-[#D8B96A]/60 transition-all font-serif"
              >
                {t('booking_page.back_home')}
              </Link>
            </div>
          </GlassCard>
        ) : (
          /* Two-Column Booking Layout: Left Step Indicator + Right Glass Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Architectural Glass Step Indicator */}
            <div className="lg:col-span-4 space-y-6">
              <GlassCard
                variant="ivory"
                padding="p-6 sm:p-7"
                className="border border-[#B58A3A]/50 space-y-6 relative"
              >
                <SacredCorner position="top-left" />

                <div className="border-b border-[#B58A3A]/30 pb-4">
                  <span className="text-[11px] font-serif uppercase tracking-widest text-[#944B14] font-bold block mb-1">
                    मार्गदर्शन
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#321116]">
                    पूजा नोंदणी टप्पे
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5A1720] to-[#C86B24] text-[#FAF7F0] font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      १
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#321116]">
                        पूजा निवडा
                      </h4>
                      <p className="text-[11.5px] text-[#6F625A] font-serif mt-0.5 leading-relaxed">
                        आपणास आवश्यक असलेला विशिष्ट धार्मिक विधी निवडा.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5A1720] to-[#C86B24] text-[#FAF7F0] font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      २
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#321116]">
                        माहिती द्या
                      </h4>
                      <p className="text-[11.5px] text-[#6F625A] font-serif mt-0.5 leading-relaxed">
                        यजमानांचे नाव, संपर्क क्रमांक व पत्ता नमूद करा.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5A1720] to-[#C86B24] text-[#FAF7F0] font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      ३
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#321116]">
                        तारीख निवडा
                      </h4>
                      <p className="text-[11.5px] text-[#6F625A] font-serif mt-0.5 leading-relaxed">
                        अपेक्षित तारीख व वेळ निवडून अचूक मुहूर्त निश्चित करा.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5A1720] to-[#C86B24] text-[#FAF7F0] font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      ४
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#321116]">
                        पुष्टी करा
                      </h4>
                      <p className="text-[11.5px] text-[#6F625A] font-serif mt-0.5 leading-relaxed">
                        नोंदणी पाठवल्यानंतर गुरुजी स्वतः संपर्क साधून पुष्टी करतील.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#B58A3A]/25 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#5A1720] font-serif font-medium">
                    <DiyaIcon className="w-4 h-4 text-[#944B14]" />
                    <span>नागपूर व संपूर्ण विदर्भासाठी थेट सेवा</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5A1720] font-serif font-medium">
                    <KalashIcon className="w-4 h-4 text-[#944B14]" />
                    <span>संपूर्ण साहित्य यादी वेळेवर उपलब्ध</span>
                  </div>
                </div>
              </GlassCard>

              {/* Direct WhatsApp Callout Card */}
              <GlassCard
                variant="white"
                padding="p-5"
                className="border border-[#B58A3A]/40 text-center space-y-3"
              >
                <p className="text-xs text-[#6F625A] font-serif">
                  त्वरित चर्चा किंवा विशेष मुहूर्तासाठी:
                </p>
                <a
                  href="/api/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp वर गुरुजींशी बोला</span>
                </a>
              </GlassCard>
            </div>

            {/* RIGHT: Premium Liquid Glass Booking Form */}
            <div className="lg:col-span-8">
              <GlassCard
                variant="white"
                padding="p-6 sm:p-10"
                className="border border-[#B58A3A]/50 shadow-[0_12px_40px_rgba(90,23,32,0.06)] relative"
              >
                <SacredCorner position="top-right" />

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Service Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#B58A3A]/25 pb-2">
                      <Sparkles className="w-4 h-4 text-[#944B14]" />
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#321116]">
                        १. पूजा विधी निवड (Select Ceremony)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GlassSelect
                        label={`${t('booking_page.select_service')} *`}
                        name="service_id"
                        value={formData.service_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- विधी निवडा (Select Ritual) --</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {getLocalized(s, 'name')}
                          </option>
                        ))}
                      </GlassSelect>

                      <GlassInput
                        label="अपेक्षित लोकांची संख्या (Expected People)"
                        name="people_count"
                        type="number"
                        placeholder="उदा. 15"
                        value={formData.people_count}
                        onChange={handleChange}
                        icon={Users}
                      />
                    </div>
                  </div>

                  {/* Step 2: Devotee Personal Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#B58A3A]/25 pb-2">
                      <User className="w-4 h-4 text-[#5A1720]" />
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#321116]">
                        २. यजमानांची माहिती (Devotee Details)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <GlassInput
                        label={`${t('booking_page.full_name')} *`}
                        name="full_name"
                        type="text"
                        required
                        placeholder="उदा. राजेश जोशी"
                        value={formData.full_name}
                        onChange={handleChange}
                        icon={User}
                      />

                      <GlassInput
                        label={`${t('booking_page.mobile')} *`}
                        name="mobile"
                        type="tel"
                        required
                        placeholder="उदा. 98XXXXXXXX"
                        value={formData.mobile}
                        onChange={handleChange}
                        icon={Phone}
                      />

                      <GlassInput
                        label={t('booking_page.email')}
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        icon={Mail}
                      />
                    </div>
                  </div>

                  {/* Step 3: Date, Time & Location */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#B58A3A]/25 pb-2">
                      <Calendar className="w-4 h-4 text-[#944B14]" />
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#321116]">
                        ३. तारीख व ठिकाण (Auspicious Date & Place)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GlassInput
                        label={`${t('booking_page.preferred_date')} *`}
                        name="preferred_date"
                        type="date"
                        required
                        value={formData.preferred_date}
                        onChange={handleChange}
                        icon={Calendar}
                      />

                      <GlassSelect
                        label={t('booking_page.preferred_time')}
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleChange}
                      >
                        <option value="सकाळ (Morning 7 AM - 11 AM)">सकाळ (Morning 7 AM - 11 AM)</option>
                        <option value="दुपार (Afternoon 11 AM - 3 PM)">दुपार (Afternoon 11 AM - 3 PM)</option>
                        <option value="संध्याकाळ (Evening 4 PM - 8 PM)">संध्याकाळ (Evening 4 PM - 8 PM)</option>
                        <option value="मुहूर्तानुसार (As per Shubh Muhurat)">मुहूर्तानुसार (As per Shubh Muhurat)</option>
                      </GlassSelect>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <GlassInput
                          label={`${t('booking_page.address')} *`}
                          name="address"
                          type="text"
                          required
                          placeholder="घर/फ्लॅट क्र., सोसायटी/रस्ता"
                          value={formData.address}
                          onChange={handleChange}
                          icon={MapPin}
                        />
                      </div>

                      <GlassInput
                        label={t('booking_page.area')}
                        name="area"
                        type="text"
                        placeholder="उदा. धरमपेठ, प्रतापनगर"
                        value={formData.area}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Additional Requests */}
                  <div className="space-y-4">
                    <GlassTextarea
                      label="काही विशेष आवश्यकता / गोत्र / नक्षत्र (Optional Message)"
                      name="message"
                      rows={3}
                      placeholder="आपले गोत्र, नक्षत्र किंवा काही विशेष विनंती असल्यास येथे नमूद करा..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 text-xs sm:text-sm font-bold text-[#FAF7F0] bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 rounded-2xl shadow-[0_8px_25px_rgba(66,18,24,0.35)] border border-[#D8B96A]/70 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                    >
                      <CalendarCheck className="w-4 h-4 text-[#D8B96A]" />
                      <span>
                        {loading
                          ? 'नोंदणी पाठवत आहे...'
                          : t('booking_page.submit_btn') || 'पूजा विधी नोंदणी पाठवा'}
                      </span>
                    </button>
                  </div>
                </form>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookPujaPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center font-serif text-[#5A1720]">
          लोड होत आहे...
        </div>
      }
    >
      <BookPujaForm />
    </Suspense>
  );
}
