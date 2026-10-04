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
import { MapPin, Clock, Calendar, CalendarCheck, Sparkles } from 'lucide-react';

export default function EventsPage() {
  const { t, language, getLocalized } = useI18n();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-10 sm:py-16 min-h-screen relative">
      <TemplePattern />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <VedicSectionHeader
          badge={language === 'mr' ? '॥ धार्मिक उत्सव व अनुष्ठान ॥' : '॥ Sacred Events & Mahaparvas ॥'}
          title={t('events_sec.title')}
          subtitle={t('events_sec.subtitle')}
        />

        {loading ? (
          <div className="py-20 text-center text-[#5A1720] font-serif font-medium text-sm">
            {t('common.loading')}
          </div>
        ) : events.length === 0 ? (
          <GlassCard variant="ivory" padding="p-12" className="text-center text-[#6F625A] text-sm font-serif max-w-lg mx-auto">
            {language === 'mr'
              ? 'सध्या कोणतेही आगामी कार्यक्रम नियोजित नाहीत. अधिक माहितीसाठी WhatsApp द्वारे संपर्क करा.'
              : 'No upcoming events currently scheduled. Please connect via WhatsApp for updates.'}
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((ev) => (
              <GlassCard
                key={ev.id}
                variant="white"
                padding="p-0"
                hoverEffect
                className="border border-[#B58A3A]/45 flex flex-col justify-between group"
              >
                <div className="h-1 bg-gradient-to-r from-[#5A1720] via-[#C86B24] to-[#B58A3A]" />

                <div className="p-6 sm:p-8 space-y-4">
                  {/* Date & Time Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-[#5A1720] to-[#421218] text-[#FAF7F0] text-xs font-semibold rounded-full font-serif border border-[#D8B96A]/50 shadow-xs">
                      <Calendar className="w-3.5 h-3.5 text-[#D8B96A]" />
                      {new Date(ev.event_date).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    {ev.event_time && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#282321] bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#B58A3A]/30 font-serif">
                        <Clock className="w-3.5 h-3.5 text-[#C86B24]" />
                        {ev.event_time}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#321116] group-hover:text-[#C86B24] transition-colors">
                    {getLocalized(ev, 'title')}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6F625A] font-serif leading-relaxed whitespace-pre-line">
                    {getLocalized(ev, 'description')}
                  </p>
                </div>

                <div className="bg-[#FAF7F0]/80 px-6 sm:px-8 py-4 border-t border-[#B58A3A]/25 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#6F625A] font-serif">
                    <MapPin className="w-4 h-4 text-[#5A1720]" />
                    <span>{ev.location || 'नागपूर (Nagpur)'}</span>
                  </div>

                  <Link
                    href={`/book-puja?service=${encodeURIComponent(getLocalized(ev, 'title'))}`}
                    className="px-4 py-1.5 bg-gradient-to-r from-[#5A1720] to-[#421218] hover:brightness-110 text-[#FAF7F0] font-semibold rounded-full shadow-xs flex items-center gap-1.5 border border-[#D8B96A]/50 transition-colors font-serif"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-[#D8B96A]" />
                    <span>सहभाग नोंदवा</span>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
