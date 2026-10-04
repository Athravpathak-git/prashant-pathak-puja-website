import React from 'react';
import Link from 'next/link';
import { Home, Flame, CalendarCheck, PhoneCall } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="max-w-xl w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-gold-500/30 relative overflow-hidden">
        {/* Subtle Devotional Background Accents */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-saffron-100 rounded-full blur-2xl pointer-events-none opacity-60"></div>
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-gold-100 rounded-full blur-2xl pointer-events-none opacity-60"></div>

        {/* Top Mantras */}
        <div className="space-y-1">
          <p className="text-saffron-700 font-serif font-bold text-sm tracking-wide">
            || श्री गणेशाय नमः ||
          </p>
          <p className="text-maroon-800 font-serif font-semibold text-xs tracking-wider">
            || श्री त्र्यंबकेश्वराय नमः ||
          </p>
        </div>

        {/* 404 Badge & Symbol */}
        <div className="py-2 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-saffron-50 border-2 border-gold-300 flex items-center justify-center text-maroon-900 shadow-inner mb-4">
            <span className="font-serif text-3xl font-extrabold text-saffron-600">ॐ</span>
          </div>
          <h1 className="text-6xl font-serif font-extrabold text-maroon-950 tracking-tight">
            ४०४
          </h1>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-700 mt-1">
            Error 404 — Page Not Found
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-maroon-900">
            पृष्ठ सापडले नाही
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
            तुम्ही शोधत असलेले पृष्ठ उपलब्ध नाही किंवा ते हलवले गेले असावे. खालील पर्यायांचा वापर करून आपल्या आवश्यक सेवेकडे जा.
          </p>
        </div>

        {/* Action Links */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          <Link
            href="/"
            className="py-3 px-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <Home className="w-4 h-4" />
            मुख्यपृष्ठ (Home)
          </Link>

          <Link
            href="/services"
            className="py-3 px-4 rounded-xl bg-maroon-900 hover:bg-maroon-950 text-gold-200 font-medium text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <Flame className="w-4 h-4 text-saffron-400" />
            सर्व पूजा विधी (Services)
          </Link>

          <Link
            href="/book-puja"
            className="py-3 px-4 rounded-xl border border-gold-400 hover:bg-gold-50 text-maroon-950 font-medium text-xs flex items-center justify-center gap-2 transition"
          >
            <CalendarCheck className="w-4 h-4 text-saffron-600" />
            पूजा बुक करा (Book Puja)
          </Link>

          <Link
            href="/contact"
            className="py-3 px-4 rounded-xl border border-gold-400 hover:bg-gold-50 text-maroon-950 font-medium text-xs flex items-center justify-center gap-2 transition"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            संपर्क (Contact)
          </Link>
        </div>
      </div>
    </div>
  );
}
