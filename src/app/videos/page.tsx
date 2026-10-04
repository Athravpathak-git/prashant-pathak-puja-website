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
import { Play, X, Sparkles } from 'lucide-react';

export default function VideosPage() {
  const { t, language, getLocalized } = useI18n();
  const [videos, setVideos] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/videos')
      .then((r) => r.json())
      .then((d) => setVideos(d.videos || []))
      .finally(() => setLoading(false));
  }, []);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/').split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  const featuredVideo = videos[0];
  const otherVideos = videos.slice(1);

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <VedicSectionHeader
          badge={language === 'mr' ? '॥ धार्मिक व्हिडीओ दर्शन ॥' : '॥ Vedic Video Glimpses ॥'}
          title={t('nav.videos')}
          subtitle={
            language === 'mr'
              ? 'पूजा, हवन व वैदिक मंत्रोच्चाराचे पवित्र क्षणचित्रे'
              : 'Sacred glimpses of pujas, havans, and Vedic chanting'
          }
        />

        {loading ? (
          <div className="py-20 text-center text-[#5A1720] font-serif font-medium text-sm">
            {t('common.loading')}
          </div>
        ) : videos.length === 0 ? (
          <GlassCard variant="ivory" padding="p-12" className="text-center text-[#6F625A] text-sm font-serif max-w-lg mx-auto">
            {language === 'mr'
              ? 'सध्या कोणतेही व्हिडीओ उपलब्ध नाहीत. नवीन व्हिडीओ लवकरच जोडले जातील.'
              : 'No videos currently available. Sacred videos will be added soon.'}
          </GlassCard>
        ) : (
          <div className="space-y-8">
            {/* Featured Video Large Card */}
            {featuredVideo && (
              <GlassCard
                variant="white"
                padding="p-6 sm:p-8"
                className="border-2 border-[#B58A3A]/50 shadow-[0_16px_50px_rgba(90,23,32,0.08)] relative"
              >
                <SacredCorner position="top-left" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div
                    onClick={() => setActiveVideo(getEmbedUrl(featuredVideo.youtube_url))}
                    className="lg:col-span-7 aspect-video bg-[#321116] rounded-2xl relative cursor-pointer group flex items-center justify-center overflow-hidden border border-[#B58A3A]/40 shadow-md"
                  >
                    {featuredVideo.thumbnail_url ? (
                      <img
                        src={featuredVideo.thumbnail_url}
                        alt={getLocalized(featuredVideo, 'title')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-[#321116] to-[#5A1720] flex items-center justify-center">
                        <span className="font-serif text-5xl text-[#D8B96A]/60">ॐ</span>
                      </div>
                    )}
                    <div className="absolute w-16 h-16 rounded-full bg-[#5A1720]/90 backdrop-blur-md text-[#FAF7F0] flex items-center justify-center border-2 border-[#D8B96A] shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-current ml-0.5 text-[#D8B96A]" />
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF2F4] text-[#5A1720] border border-[#A32938]/30">
                      <Sparkles className="w-3.5 h-3.5 text-[#C86B24]" />
                      <span>प्रमुख व्हिडीओ</span>
                    </div>
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#321116]">
                      {getLocalized(featuredVideo, 'title')}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6F625A] font-serif leading-relaxed">
                      {getLocalized(featuredVideo, 'description')}
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Other Supporting Video Cards */}
            {otherVideos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherVideos.map((vid) => (
                  <GlassCard
                    key={vid.id}
                    variant="white"
                    padding="p-0"
                    hoverEffect
                    className="border border-[#B58A3A]/40 overflow-hidden flex flex-col justify-between group"
                  >
                    <div
                      onClick={() => setActiveVideo(getEmbedUrl(vid.youtube_url))}
                      className="aspect-video bg-[#321116] relative cursor-pointer flex items-center justify-center overflow-hidden"
                    >
                      {vid.thumbnail_url ? (
                        <img
                          src={vid.thumbnail_url}
                          alt={getLocalized(vid, 'title')}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#321116] to-[#5A1720] flex items-center justify-center">
                          <span className="font-serif text-3xl text-[#D8B96A]/60">ॐ</span>
                        </div>
                      )}
                      <div className="absolute w-12 h-12 bg-[#5A1720]/80 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform border border-[#D8B96A]">
                        <Play className="w-5 h-5 fill-current ml-0.5 text-[#D8B96A]" />
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-sm text-[#321116] mb-1 group-hover:text-[#C86B24] transition-colors">
                          {getLocalized(vid, 'title')}
                        </h3>
                        <p className="text-xs text-[#6F625A] font-serif line-clamp-2 leading-relaxed">
                          {getLocalized(vid, 'description')}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video Player Modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border-2 border-[#B58A3A] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`${activeVideo}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
