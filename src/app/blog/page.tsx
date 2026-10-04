'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
  VedicSectionHeader,
  TemplePattern,
  SacredCorner,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
} from '@/components/LiquidGlassSystem';
import { BookOpen, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export default function BlogPage() {
  const { t, language, getLocalized } = useI18n();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .finally(() => setLoading(false));
  }, []);

  const featured = posts[0];
  const others = posts.slice(1);

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <VedicSectionHeader
          badge={language === 'mr' ? '॥ वैदिक ज्ञान व धार्मिक माहिती ॥' : '॥ Vedic Wisdom & Articles ॥'}
          title={t('nav.blog')}
          subtitle={
            language === 'mr'
              ? 'पूजा विधींचे महत्त्व, शास्त्रोक्त नियम व सण उत्सवांची प्रामाणिक माहिती'
              : 'Significance of Vedic rituals, shastra rules, and festivals'
          }
        />

        {loading ? (
          <div className="py-20 text-center text-[#5A1720] font-serif font-medium text-sm">
            {t('common.loading')}
          </div>
        ) : posts.length === 0 ? (
          <GlassCard variant="ivory" padding="p-12" className="text-center text-[#6F625A] text-sm font-serif max-w-lg mx-auto">
            {language === 'mr'
              ? 'सध्या कोणतेही लेख उपलब्ध नाहीत. लवकरच नवीन लेख प्रकाशित केले जातील.'
              : 'No articles currently published. Spiritual articles will be added soon.'}
          </GlassCard>
        ) : (
          <div className="space-y-8">
            {/* Featured Article Card */}
            {featured && (
              <GlassCard
                variant="ivory"
                padding="p-6 sm:p-10"
                className="border-2 border-[#B58A3A]/50 shadow-[0_16px_50px_rgba(90,23,32,0.08)] relative"
              >
                <SacredCorner position="top-left" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-[#FAF7F0] text-[#5A1720] font-serif font-bold border border-[#B58A3A]/40 shadow-xs">
                      {featured.category || 'धार्मिक माहिती'}
                    </span>
                    <span className="flex items-center gap-1.5 font-serif text-[#C86B24] font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(featured.published_at || featured.created_at).toLocaleDateString(
                        language === 'mr' ? 'mr-IN' : 'en-US',
                        { day: 'numeric', month: 'long', year: 'numeric' }
                      )}
                    </span>
                  </div>

                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#321116] leading-snug">
                    {getLocalized(featured, 'title')}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#282321] font-serif leading-relaxed line-clamp-3">
                    {getLocalized(featured, 'excerpt')}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/blog/${featured.slug || featured.id}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5A1720] to-[#421218] text-[#FAF7F0] text-xs font-bold shadow-xs hover:scale-105 transition-transform"
                    >
                      <span>संपूर्ण लेख वाचा</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Other Supporting Article Cards */}
            {others.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {others.map((post) => (
                  <GlassCard
                    key={post.id}
                    variant="white"
                    padding="p-0"
                    hoverEffect
                    className="border border-[#B58A3A]/40 overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="h-1 bg-gradient-to-r from-[#5A1720] via-[#C86B24] to-[#B58A3A]" />

                    <div className="p-6 sm:p-7 space-y-4">
                      <div className="flex items-center justify-between text-xs text-[#6F625A]">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] text-[#5A1720] font-serif font-semibold border border-[#B58A3A]/30">
                          {post.category || 'धार्मिक माहिती'}
                        </span>
                        <span className="flex items-center gap-1.5 font-serif text-[#C86B24] font-medium text-[11px]">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString(
                            language === 'mr' ? 'mr-IN' : 'en-US',
                            { day: 'numeric', month: 'long', year: 'numeric' }
                          )}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#321116] leading-snug group-hover:text-[#C86B24] transition-colors">
                        {getLocalized(post, 'title')}
                      </h3>

                      <p className="text-xs sm:text-[13px] text-[#6F625A] font-serif leading-relaxed line-clamp-3">
                        {getLocalized(post, 'excerpt')}
                      </p>
                    </div>

                    <div className="bg-[#FAF7F0]/80 px-6 sm:px-7 py-3.5 border-t border-[#B58A3A]/25">
                      <Link
                        href={`/blog/${post.slug || post.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1720] hover:text-[#C86B24] transition-colors font-serif"
                      >
                        <span>{language === 'mr' ? 'संपूर्ण लेख वाचा' : 'Read Full Article'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
