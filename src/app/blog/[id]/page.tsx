'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import {
  VedicDivider,
  TemplePattern,
  SacredCorner,
} from '@/components/VedicDesignSystem';
import {
  GlassCard,
} from '@/components/LiquidGlassSystem';
import { Calendar, ArrowLeft, CalendarCheck, MessageSquare } from 'lucide-react';

export default function BlogPostDetailPage() {
  const { id } = useParams();
  const { t, language, getLocalized } = useI18n();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/blog/${id}`)
      .then((r) => r.json())
      .then((d) => setPost(d.post || null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-[#5A1720] font-serif font-medium">
        {t('common.loading')}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#321116]">
          {language === 'mr' ? 'लेख सापडला नाही' : 'Article Not Found'}
        </h2>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#5A1720] text-[#FAF7F0] rounded-full text-xs font-semibold font-serif"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'mr' ? 'सर्व लेखांकडे परत जा' : 'Back to Articles'}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1720] hover:text-[#C86B24] transition-colors font-serif"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'mr' ? '← सर्व लेख' : '← All Articles'}</span>
          </Link>
        </div>

        <GlassCard
          variant="white"
          padding="p-6 sm:p-12"
          className="border border-[#B58A3A]/45 shadow-[0_12px_40px_rgba(90,23,32,0.06)] space-y-6 relative"
        >
          <SacredCorner position="top-left" />

          <div className="flex items-center gap-3 text-xs text-[#6F625A] border-b border-[#B58A3A]/25 pb-4">
            <span className="px-3 py-1 rounded-full bg-[#FAF7F0] text-[#5A1720] font-semibold font-serif border border-[#B58A3A]/30">
              {post.category || 'धार्मिक माहिती'}
            </span>
            <span className="flex items-center gap-1.5 font-serif text-[#C86B24] font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.published_at || post.created_at).toLocaleDateString(
                language === 'mr' ? 'mr-IN' : 'en-US',
                { day: 'numeric', month: 'long', year: 'numeric' }
              )}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#321116] leading-tight">
            {getLocalized(post, 'title')}
          </h1>

          {post.excerpt_mr && (
            <div className="p-5 bg-[#FAF7F0]/80 rounded-2xl border-l-4 border-l-[#5A1720] border border-[#B58A3A]/30 text-xs sm:text-sm font-serif italic text-[#282321] leading-relaxed">
              {getLocalized(post, 'excerpt')}
            </div>
          )}

          <div className="text-xs sm:text-sm text-[#282321] leading-relaxed space-y-4 whitespace-pre-line font-serif">
            {getLocalized(post, 'content')}
          </div>

          <VedicDivider />

          {/* Consultation CTA Inside Article */}
          <div className="p-7 rounded-2xl bg-[#FAF7F0]/80 border border-[#B58A3A]/40 text-center space-y-3.5 shadow-xs">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#321116]">
              {language === 'mr' ? 'शास्त्रोक्त विधी व मुहूर्त नियोजनासाठी संपर्क' : 'Vedic Ritual Consultation & Muhurat Booking'}
            </h3>
            <p className="text-xs text-[#6F625A] font-serif max-w-md mx-auto">
              आपल्या घरी विधी संपन्न करण्यासाठी गुरुजींशी चर्चा करून शुभ तारीख निश्चित करा.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/book-puja"
                className="px-6 py-2.5 rounded-full text-xs font-bold text-[#FAF7F0] bg-gradient-to-r from-[#5A1720] to-[#421218] hover:brightness-110 shadow-xs border border-[#D8B96A]/50"
              >
                पूजा विधी नोंदणी
              </Link>
              <a
                href="/api/whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] shadow-xs flex items-center gap-1.5 border border-green-600/40"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp चर्चा</span>
              </a>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
