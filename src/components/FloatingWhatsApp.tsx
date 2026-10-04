'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { MessageSquare } from 'lucide-react';

export function FloatingWhatsApp({ prefilledMsg }: { prefilledMsg?: string }) {
  const { language } = useI18n();

  const msg = prefilledMsg || (
    language === 'mr'
      ? 'जय श्री गणेश! मला वे.मु. प्रशांत पाठक गुरुजींच्या पूजा विधींबद्दल माहिती हवी आहे.'
      : 'Jai Shree Ganesh! I would like to inquire about Vedic puja services conducted by Guruji.'
  );

  const href = `/api/whatsapp?text=${encodeURIComponent(msg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      <span className="hidden sm:inline-flex items-center gap-1.5 mr-2 px-3.5 py-1.5 bg-maroon-900 text-gold-100 text-xs font-medium rounded-full shadow-lg border border-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
        @PrashantPathakGuruji
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Guruji"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-gold-300 focus:outline-none focus:ring-4 focus:ring-green-400/40 relative"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-400 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-maroon-950">
          ॐ
        </span>
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 2C6.5 2 2 6.5 2 12.031C2 13.805 2.469 15.484 3.297 16.953L2 22L7.203 20.703C8.625 21.469 10.266 21.906 12.031 21.906C17.562 21.906 22.062 17.406 22.062 11.875C22.062 6.344 17.562 2 12.031 2ZM16.484 16.031C16.297 16.547 15.344 17.062 14.938 17.109C14.531 17.156 14 17.172 12.094 16.422C9.656 15.469 8.078 13.016 7.953 12.844C7.828 12.672 6.969 11.531 6.969 10.359C6.969 9.188 7.562 8.625 7.812 8.359C8.031 8.125 8.344 8.031 8.562 8.031C8.719 8.031 8.875 8.031 9 8.047C9.219 8.062 9.328 8.094 9.469 8.438C9.641 8.844 10.062 9.875 10.109 9.984C10.156 10.094 10.203 10.219 10.125 10.359C10.047 10.5 9.984 10.578 9.875 10.703C9.766 10.828 9.641 10.984 9.547 11.094C9.438 11.203 9.328 11.328 9.453 11.547C9.578 11.766 10.016 12.484 10.656 13.047C11.484 13.781 12.172 14.016 12.391 14.125C12.609 14.234 12.75 14.203 12.875 14.062C13 13.922 13.422 13.422 13.562 13.219C13.703 13.016 13.859 13.047 14.078 13.125C14.297 13.203 15.484 13.797 15.719 13.922C15.953 14.047 16.109 14.109 16.172 14.203C16.234 14.312 16.234 14.797 16.047 15.312L16.484 16.031Z" />
        </svg>
      </a>
    </div>
  );
}
