'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Menu, X, CalendarCheck, Sparkles } from 'lucide-react';

export function Navbar() {
  const { t, language } = useI18n();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If in admin routes, don't show public navbar
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services') },
    { href: '/book-puja', label: t('nav.book_puja') },
    { href: '/events', label: t('nav.events') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/videos', label: t('nav.videos') },
    { href: '/testimonials', label: t('nav.testimonials') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/faq', label: t('nav.faq') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* 1. Top Sacred Mantra Bar */}
      <div className="w-full bg-[#321116] text-[#F3E8D0] py-1 px-3 sm:px-6 border-b border-[#B58A3A]/40 flex items-center justify-center text-center shadow-xs">
        <span className="font-serif text-[10px] sm:text-xs font-medium tracking-normal sm:tracking-wide whitespace-nowrap select-none">
          || श्री गणेशाय नमः ||❖|| श्री त्र्यंबकेश्वराय नमः ||
        </span>
      </div>

      {/* 2. Floating Architectural Liquid Glass Bar */}
      <div className="max-w-[1680px] mx-auto px-3 sm:px-6 pt-2 pb-1">
        <div
          className={`w-full rounded-2xl lg:rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-[#FAF7F0]/92 backdrop-blur-xl border border-[#B58A3A]/50 shadow-[0_12px_40px_rgba(90,23,32,0.12)]'
              : 'bg-[#FAF7F0]/85 backdrop-blur-lg border border-[#B58A3A]/38 shadow-[0_8px_30px_rgba(90,23,32,0.06)]'
          } px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 lg:gap-4`}
        >
          {/* Guruji Branding: Medallion + Compact Name Block */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0 select-none py-0.5"
            aria-label="Guruji Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#321116] via-[#5A1720] to-[#C86B24] border-2 border-[#D8B96A] flex items-center justify-center text-[#FAF7F0] shadow-md group-hover:scale-105 transition-transform shrink-0">
              <span className="font-serif text-lg sm:text-xl font-bold">ॐ</span>
            </div>
            <div className="flex flex-col justify-center leading-tight">
              <span className="font-serif text-xs sm:text-sm 2xl:text-base font-bold text-[#321116] tracking-tight whitespace-nowrap">
                {language === 'mr' ? 'वे.मु. प्रशांत पाठक' : 'Ve.Mu. Prashant Pathak'}
              </span>
              <span className="font-serif text-[11px] sm:text-xs font-bold text-[#944B14] tracking-wide whitespace-nowrap">
                {language === 'mr' ? '(गुरुजी)' : '(Guruji)'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="मुख्य मार्गक्रमण (Main Navigation)" className="hidden xl:flex items-center justify-center gap-1 2xl:gap-1.5 flex-1 px-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 2xl:px-3 py-1.5 rounded-full text-xs 2xl:text-[13px] font-medium transition-all whitespace-nowrap relative ${
                    isActive
                      ? 'text-[#FAF7F0] bg-gradient-to-r from-[#5A1720] to-[#421218] border border-[#D8B96A]/60 shadow-[0_2px_10px_rgba(90,23,32,0.25)] font-semibold'
                      : 'text-[#282321] hover:text-[#5A1720] hover:bg-[#B58A3A]/12'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <LanguageSwitcher />

            <Link
              href="/book-puja"
              className="px-4 2xl:px-5 py-2.5 text-xs font-bold text-[#FAF7F0] bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 rounded-full shadow-[0_4px_16px_rgba(66,18,24,0.3)] border border-[#D8B96A]/70 flex items-center gap-1.5 transition-all hover:scale-105 whitespace-nowrap shrink-0"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#D8B96A]" />
              <span>{language === 'mr' ? 'पूजा बुक करा' : 'Book Puja'}</span>
            </Link>
          </div>

          {/* Mobile / Tablet Controls */}
          <div className="flex items-center gap-2 xl:hidden">
            <LanguageSwitcher />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              className="w-11 h-11 rounded-full bg-white/80 border border-[#B58A3A]/40 text-[#5A1720] hover:bg-[#FAF7F0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B58A3A] flex items-center justify-center shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="xl:hidden mt-2 rounded-2xl bg-[#FAF7F0]/95 backdrop-blur-2xl border border-[#B58A3A]/50 shadow-[0_16px_50px_rgba(90,23,32,0.18)] p-4 space-y-3 animate-in fade-in duration-200"
          >
            <nav aria-label="मोबाइल मेनू (Mobile Navigation)" className="grid grid-cols-2 gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 min-h-[44px] flex items-center rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-[#5A1720] to-[#421218] text-[#FAF7F0] font-bold border border-[#D8B96A]/60'
                        : 'text-[#282321] hover:bg-[#B58A3A]/15'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-[#B58A3A]/30 flex flex-col gap-2">
              <Link
                href="/book-puja"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 min-h-[44px] text-center text-xs font-bold text-[#FAF7F0] bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] rounded-xl border border-[#D8B96A]/60 shadow-md flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-[#D8B96A]" />
                <span>{language === 'mr' ? 'पूजा / विधी बुक करा' : 'Book Puja'}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
