'use client';

import React, { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  VedicSectionHeader,
  TemplePattern,
  SacredCorner,
  DiyaIcon,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
  GlassInput,
  GlassTextarea,
  GlassButton,
} from '@/components/LiquidGlassSystem';
import { Star, Send, CheckCircle2, AlertCircle, Quote } from 'lucide-react';

export default function TestimonialsPage() {
  const { t, language, getLocalized } = useI18n();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((d) => setTestimonials(d.testimonials || []))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    setFeedbackSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'त्रुटी आली.');

      setFeedbackSuccess(data.message || 'अभिप्राय यशस्वीरीत्या नोंदवला गेला. धन्यवाद!');
      setForm({ name: '', location: '', rating: 5, comment: '' });
    } catch (err: any) {
      setFeedbackError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const featured = testimonials[0];
  const others = testimonials.slice(1);

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <VedicSectionHeader
          badge={language === 'mr' ? '॥ भक्तांचे मनोगत व अनुभव ॥' : '॥ Devotee Experiences ॥'}
          title={t('testimonials_sec.title')}
          subtitle={t('testimonials_sec.subtitle')}
        />

        {loading ? (
          <div className="py-20 text-center text-[#5A1720] font-serif font-medium text-sm">
            {t('common.loading')}
          </div>
        ) : testimonials.length === 0 ? (
          <GlassCard variant="ivory" padding="p-12" className="text-center text-[#6F625A] text-sm font-serif max-w-lg mx-auto">
            {language === 'mr'
              ? 'सध्या कोणतेही अभिप्राय उपलब्ध नाहीत.'
              : 'No devotee experiences currently published.'}
          </GlassCard>
        ) : (
          <div className="space-y-8">
            {/* Featured Testimonial */}
            {featured && (
              <GlassCard
                variant="ivory"
                padding="p-8 sm:p-12"
                className="border-2 border-[#B58A3A]/50 shadow-[0_16px_50px_rgba(90,23,32,0.08)] relative"
              >
                <SacredCorner position="top-left" />
                <div className="max-w-3xl mx-auto text-center space-y-4">
                  <Quote className="w-10 h-10 text-[#C86B24]/40 mx-auto" />
                  <div className="flex justify-center text-[#C86B24]">
                    {[...Array(featured.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="font-serif text-sm sm:text-base text-[#282321] leading-relaxed italic">
                    &ldquo;{getLocalized(featured, 'comment') || featured.review || featured.content_mr}&rdquo;
                  </p>
                  <div className="pt-2">
                    <p className="font-serif font-bold text-base text-[#321116]">
                      {getLocalized(featured, 'author_name') || featured.client_name}
                    </p>
                    <p className="text-xs text-[#6F625A] font-serif">
                      {getLocalized(featured, 'location') || featured.city || 'नागपूर'}
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Grid of Other Testimonials */}
            {others.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {others.map((tItem) => (
                  <GlassCard
                    key={tItem.id}
                    variant="white"
                    padding="p-6"
                    hoverEffect
                    className="border border-[#B58A3A]/40 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex text-[#C86B24]">
                        {[...Array(tItem.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-[13px] text-[#282321] italic font-serif leading-relaxed">
                        &ldquo;{getLocalized(tItem, 'comment') || tItem.review || tItem.content_mr}&rdquo;
                      </p>
                    </div>

                    <div className="border-t border-[#B58A3A]/25 pt-3">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#321116]">
                        {getLocalized(tItem, 'author_name') || tItem.client_name}
                      </h4>
                      <p className="text-[11px] text-[#6F625A] font-serif">
                        {getLocalized(tItem, 'location') || tItem.city || 'नागपूर'}
                      </p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Devotee Feedback Form */}
        <div className="max-w-2xl mx-auto pt-6">
          <GlassCard
            variant="white"
            padding="p-6 sm:p-10"
            className="border border-[#B58A3A]/50 shadow-[0_12px_40px_rgba(90,23,32,0.06)] space-y-6 relative"
          >
            <SacredCorner position="top-right" />

            <div className="text-center space-y-1">
              <DiyaIcon className="w-6 h-6 text-[#C86B24] mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#321116]">
                आपला अनुभव नोंदवा (Share Your Experience)
              </h3>
              <p className="text-xs text-[#6F625A] font-serif">
                गुरुजींच्या विधीबद्दल आपले मनोगत व्यक्त करा.
              </p>
            </div>

            {feedbackSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{feedbackSuccess}</span>
              </div>
            )}

            {feedbackError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{feedbackError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="आपले नाव (Name) *"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="उदा. अमित कुलकर्णी"
                />

                <GlassInput
                  label="गाव / शहर (Location)"
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="उदा. नागपूर"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#282321]">
                  रेटिंग (Rating)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= form.rating
                            ? 'text-[#C86B24] fill-[#C86B24]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <GlassTextarea
                label="आपला अभिप्राय (Your Review) *"
                required
                rows={4}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="विधीबद्दलचा आपला अनुभव थोडक्यात लिहा..."
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 disabled:opacity-50 text-[#FAF7F0] font-semibold text-xs sm:text-sm rounded-xl shadow-md border border-[#D8B96A]/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4 text-[#D8B96A]" />
                <span>{submitting ? 'नोंदवत आहे...' : 'अभिप्राय पाठवा'}</span>
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
