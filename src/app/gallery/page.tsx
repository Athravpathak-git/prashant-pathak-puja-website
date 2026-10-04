'use client';

import React, { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  VedicSectionHeader,
  TemplePattern,
  SacredCorner,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
} from '@/components/LiquidGlassSystem';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';

export default function GalleryPage() {
  const { t, language, getLocalized } = useI18n();

  const [gallery, setGallery] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const categories = [
    'पूजा',
    'धार्मिक विधी',
    'विवाह',
    'उपनयन संस्कार',
    'वास्तुशांती',
    'अभिषेक',
    'नवचंडी',
    'मूर्ती प्राणप्रतिष्ठा',
    'इतर',
  ];

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d) => setGallery(d.gallery || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = gallery.filter((item) => {
    return selectedCategory === 'all' || item.category === selectedCategory;
  });

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex === null || filtered.length === 0) return;
    setActiveIndex((activeIndex - 1 + filtered.length) % filtered.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex === null || filtered.length === 0) return;
    setActiveIndex((activeIndex + 1) % filtered.length);
  };

  const featured = filtered[0];

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <VedicSectionHeader
          badge={language === 'mr' ? '॥ पवित्र विधी क्षणचित्रे ॥' : '॥ Sacred Ceremony Glimpses ॥'}
          title={t('gallery_sec.title')}
          subtitle={t('gallery_sec.subtitle')}
        />

        {/* Category Filter Chips in Liquid Glass Container */}
        <GlassCard
          variant="white"
          padding="p-3.5 sm:p-4"
          className="max-w-4xl mx-auto border border-[#B58A3A]/40 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold font-serif transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#5A1720] to-[#421218] text-[#FAF7F0] border-[#D8B96A]/60 shadow-xs'
                : 'text-[#282321] bg-[#FAF7F0]/80 border border-[#B58A3A]/30 hover:bg-white'
            }`}
          >
            {language === 'mr' ? 'सर्व (All)' : 'All Photos'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold font-serif transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#5A1720] to-[#421218] text-[#FAF7F0] border-[#D8B96A]/60 shadow-xs'
                  : 'text-[#282321] bg-[#FAF7F0]/80 border border-[#B58A3A]/30 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </GlassCard>

        {loading ? (
          <div className="py-20 text-center text-[#5A1720] font-serif font-medium text-sm">
            {t('common.loading')}
          </div>
        ) : filtered.length === 0 ? (
          <GlassCard variant="ivory" padding="p-12" className="text-center text-[#6F625A] text-sm font-serif max-w-lg mx-auto">
            {language === 'mr'
              ? 'या श्रेणीत अद्याप छायाचित्रे उपलब्ध नाहीत.'
              : 'No photographs available in this category.'}
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {/* Masonry / Editorial Composition Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, index) => (
                <div
                  key={item.id || index}
                  onClick={() => setActiveIndex(index)}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#B58A3A]/40 shadow-xs cursor-pointer bg-[#F3E8D0]/40 transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <img
                    src={item.image_url}
                    alt={getLocalized(item, 'title') || 'Puja Ritual'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Top Glare Reflection */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                  {/* Glass Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#321116]/90 via-[#321116]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end text-[#FAF7F0]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-[#FAF7F0]/20 backdrop-blur-md text-[#D8B96A] font-serif">
                        {item.category || 'धार्मिक विधी'}
                      </span>
                      <Maximize2 className="w-4 h-4 text-[#D8B96A]" />
                    </div>
                    <p className="font-serif font-bold text-sm leading-tight text-[#FAF7F0]">
                      {getLocalized(item, 'title')}
                    </p>
                    {item.description_mr && (
                      <p className="text-[11px] text-[#D8B96A] line-clamp-1 mt-0.5">
                        {getLocalized(item, 'description')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeIndex !== null && filtered[activeIndex] && (
        <div
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center cursor-default"
          >
            <img
              src={filtered[activeIndex].image_url}
              alt={getLocalized(filtered[activeIndex], 'title') || 'Ceremony Photo'}
              className="max-w-full max-h-[80vh] rounded-2xl border-2 border-[#B58A3A] object-contain shadow-2xl"
            />

            <div className="mt-3 text-center text-[#FAF7F0] space-y-1">
              <h3 className="font-serif font-bold text-base">
                {getLocalized(filtered[activeIndex], 'title')}
              </h3>
              <p className="text-xs text-[#D8B96A]">
                {getLocalized(filtered[activeIndex], 'description')}
              </p>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#D8B96A] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
