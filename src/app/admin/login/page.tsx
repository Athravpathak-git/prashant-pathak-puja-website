'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { VedicDivider, SacredCorner, MandalaBackground } from '@/components/VedicDesignSystem';
import { GlassCard } from '@/components/LiquidGlassSystem';

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLocked(false);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 423 || data.locked) {
          setIsLocked(true);
          // Generic security-safe message for locked account without revealing internal counter or duration
          throw new Error('लॉगिन सध्या उपलब्ध नाही. कृपया नंतर पुन्हा प्रयत्न करा.');
        } else {
          // Generic authentication error message without leaking attempts or policy details
          throw new Error('लॉगिन अयशस्वी. कृपया आपली माहिती तपासा आणि पुन्हा प्रयत्न करा.');
        }
      }

      router.replace('/admin');
    } catch (err: any) {
      setError(err.message || 'लॉगिन अयशस्वी. कृपया आपली माहिती तपासा आणि पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#321116] via-[#240a0e] to-[#170508] text-[#FAF7F0] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Sacred Ambient Geometry Glow */}
      <MandalaBackground className="opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-[#C86B24]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <GlassCard
          variant="ivory"
          padding="p-7 sm:p-9"
          className="border border-[#B58A3A]/50 shadow-[0_20px_60px_rgba(0,0,0,0.5)] space-y-6 relative"
        >
          <SacredCorner position="top-left" />
          <SacredCorner position="bottom-right" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#321116] via-[#5A1720] to-[#C86B24] text-[#FAF7F0] flex items-center justify-center font-serif text-3xl font-bold mx-auto border-2 border-[#D8B96A] shadow-md">
              ॐ
            </div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#321116] tracking-tight">
              प्रशासक लॉगिन (Admin Portal)
            </h1>
            <p className="text-xs text-[#6F625A] font-medium font-serif">
              वे.मु. प्रशांत पाठक (गुरुजी) — अधिकृत व्यवस्थापन प्रणाली
            </p>
            <VedicDivider className="my-2" variant="diamond" />
          </div>

          {/* Generic Error Notification (Zero leak of internal rules/attempts/duration) */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs flex items-start gap-2.5 shadow-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#282321]">
                वापरकर्तानाव (Username / Email)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#B58A3A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  disabled={loading || isLocked}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-[#B58A3A]/40 text-xs sm:text-sm text-[#282321] focus:outline-none focus:ring-2 focus:ring-[#B58A3A]/30 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#282321]">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#B58A3A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={loading || isLocked}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-[#B58A3A]/40 text-xs sm:text-sm text-[#282321] focus:outline-none focus:ring-2 focus:ring-[#B58A3A]/30 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || isLocked}
                className="w-full py-3 bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 disabled:opacity-50 text-[#FAF7F0] font-semibold text-xs sm:text-sm rounded-xl shadow-[0_4px_16px_rgba(66,18,24,0.3)] border border-[#D8B96A]/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <ShieldCheck className="w-4 h-4 text-[#D8B96A]" />
                <span>
                  {loading
                    ? 'पडताळणी करत आहे...'
                    : isLocked
                    ? 'लॉगिन तात्पुरते अनुपलब्ध'
                    : 'लॉगिन करा (Secure Sign In)'}
                </span>
              </button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-[#B58A3A]/20">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#5A1720] hover:text-[#C86B24] font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>मुख्य संकेतस्थळावर परत जा (Back to Website)</span>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
