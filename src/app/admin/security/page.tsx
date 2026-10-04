'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Lock,
  UserCheck
} from 'lucide-react';
import { GlassCard } from '@/components/LiquidGlassSystem';
import { SacredCorner } from '@/components/VedicDesignSystem';

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword.length < 8) {
      setStatusMsg({
        type: 'error',
        text: 'नवीन पासवर्ड किमान ८ अक्षरांचा असणे आवश्यक आहे. (Min 8 characters required)',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMsg({
        type: 'error',
        text: 'नवीन पासवर्ड आणि खात्री पासवर्ड जुळत नाहीत. (Passwords do not match)',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg({
          type: 'success',
          text: data.message || 'पासवर्ड यशस्वीरित्या बदलला आहे. (Password updated successfully)',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMsg({
          type: 'error',
          text: data.error || 'पासवर्ड बदलताना त्रुटी आढळली.',
        });
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: 'सर्व्हरशी संपर्क होऊ शकला नाही.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#B58A3A]/30 pb-4">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#321116] flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#C86B24]" />
          <span>खाते सुरक्षा (Account Security)</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6F625A] mt-1 font-serif">
          प्रशासक खात्याचा पासवर्ड बदला व सुरक्षितता व्यवस्थापित करा.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-3 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Password Change Form */}
        <div className="md:col-span-2">
          <GlassCard variant="white" padding="p-6 sm:p-7" className="border border-[#B58A3A]/40 space-y-5 relative">
            <SacredCorner position="top-left" />
            <div className="flex items-center gap-2 border-b border-[#B58A3A]/20 pb-3">
              <KeyRound className="w-4 h-4 text-[#C86B24]" />
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#321116]">
                पासवर्ड बदला (Change Admin Password)
              </h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#282321]">
                  सध्याचा पासवर्ड (Current Password) *
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="सध्याचा पासवर्ड प्रविष्ट करा"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#B58A3A]/40 focus:outline-none focus:ring-2 focus:ring-[#B58A3A]/30 text-xs sm:text-sm bg-[#FAF7F0]/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F625A] hover:text-[#282321]"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#282321]">
                  नवीन पासवर्ड (New Password) *
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="किमान ८ अक्षरे (Min 8 characters)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#B58A3A]/40 focus:outline-none focus:ring-2 focus:ring-[#B58A3A]/30 text-xs sm:text-sm bg-[#FAF7F0]/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F625A] hover:text-[#282321]"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#282321]">
                  नवीन पासवर्डची पुष्टी करा (Confirm New Password) *
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="नवीन पासवर्ड पुन्हा प्रविष्ट करा"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#B58A3A]/40 focus:outline-none focus:ring-2 focus:ring-[#B58A3A]/30 text-xs sm:text-sm bg-[#FAF7F0]/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F625A] hover:text-[#282321]"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] hover:brightness-110 text-[#FAF7F0] font-semibold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 border border-[#D8B96A]/60"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'बदलत आहे...' : 'पासवर्ड अपडेट करा (Update Password)'}</span>
                </button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Right Column: General Status */}
        <div className="space-y-4">
          <GlassCard variant="ivory" padding="p-5" className="border border-emerald-300/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              खाते स्थिती (Account Status)
            </div>
            <div className="space-y-2 text-xs text-[#282321]">
              <p className="flex justify-between items-center">
                <span className="text-[#6F625A]">सुरक्षा स्थिती:</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  सक्रिय व सुरक्षित
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-[#6F625A]">सत्र प्रकार:</span>
                <span className="font-medium text-[#321116]">एनक्रिप्टेड कुकी (Secure)</span>
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
