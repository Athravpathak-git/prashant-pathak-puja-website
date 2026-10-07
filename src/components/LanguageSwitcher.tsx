'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n, LANGUAGES, Language } from '@/lib/i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="भाषा निवडा / Select Language"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-full border border-gold-400/50 bg-white/70 backdrop-blur-md shadow-xs text-xs font-semibold text-charcoal-900 hover:border-gold-500 hover:bg-white transition-all select-none focus:outline-none focus:ring-2 focus:ring-gold-500"
      >
        <Globe className="w-4 h-4 text-[#805E21] shrink-0" />
        <span className="font-serif tracking-wide">{currentLang.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#805E21] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Liquid Glass Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 mt-2 w-52 rounded-2xl bg-white/95 backdrop-blur-xl border border-gold-400/50 shadow-[0_12px_36px_rgba(90,23,32,0.14)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#944B14] border-b border-gold-300/40 mb-1 flex items-center justify-between">
            <span>भाषा / Language</span>
            <span className="text-[#805E21]">❖</span>
          </div>

          <div className="space-y-1">
            {LANGUAGES.map((l) => {
              const isSelected = l.code === language;
              return (
                <button
                  key={l.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(l.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-xl text-xs text-left transition-all ${
                    isSelected
                      ? 'bg-maroon-800 text-gold-100 font-bold shadow-xs'
                      : 'text-charcoal-800 hover:bg-gold-200/50 hover:text-maroon-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm leading-none">{l.nativeName}</span>
                    <span
                      className={`text-[10px] ${
                        isSelected ? 'text-gold-300' : 'text-charcoal-700/80'
                      }`}
                    >
                      ({l.name})
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold-200 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
