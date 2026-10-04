'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Flame,
  Calendar,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Eye,
  User,
  Bell,
  Sparkles
} from 'lucide-react';
import { GlassCard, GlassBadge } from '@/components/LiquidGlassSystem';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalServices: 0,
    totalEvents: 0,
    totalGallery: 0,
  });

  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [bRes, sRes, eRes, gRes, nRes] = await Promise.all([
        fetch('/api/bookings?limit=10').then((r) => r.json()),
        fetch('/api/services?all=true').then((r) => r.json()),
        fetch('/api/events?all=true').then((r) => r.json()),
        fetch('/api/gallery?all=true').then((r) => r.json()),
        fetch('/api/notifications').then((r) => r.json()),
      ]);

      const bookings = bRes.bookings || [];
      const services = sRes.services || [];
      const events = eRes.events || [];
      const gallery = gRes.gallery || [];
      const notifications = nRes.notifications || [];

      setStats({
        totalBookings: bRes.pagination?.total || bookings.length,
        pendingBookings: bookings.filter((b: any) => b.status === 'Pending').length,
        confirmedBookings: bookings.filter((b: any) => b.status === 'Confirmed').length,
        completedBookings: bookings.filter((b: any) => b.status === 'Completed').length,
        cancelledBookings: bookings.filter((b: any) => b.status === 'Cancelled').length,
        totalServices: services.length,
        totalEvents: events.length,
        totalGallery: gallery.length,
      });

      setRecentBookings(bookings.slice(0, 6));
      setRecentNotifications(notifications.slice(0, 5));
    } catch (err) {
      console.error('[DASHBOARD-FETCH-ERR]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('[STATUS-UPDATE-ERR]', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <GlassCard
        variant="white"
        padding="p-6 sm:p-7"
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border border-[#B58A3A]/40"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-serif font-bold text-[#C86B24]">॥ शुभं भवतु ॥</span>
            <span className="text-[10px] text-[#B58A3A]">❖</span>
            <span className="text-xs text-[#6F625A] font-medium">प्रशासकीय नियंत्रण कक्ष</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#321116] tracking-tight">
            मुख्य नियंत्रण कक्ष (Admin Dashboard)
          </h1>
          <p className="text-xs text-[#6F625A] mt-1">
            वे.मु. प्रशांत पाठक (गुरुजी) यांच्या संकेतस्थळाचे सर्वसमावेशक व्यवस्थापन
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/services"
            className="px-4 py-2 bg-gradient-to-r from-[#651C24] to-[#5A1720] hover:brightness-110 text-gold-100 text-xs font-semibold rounded-full shadow-[0_4px_14px_rgba(66,18,24,0.25)] border border-[#D8B96A]/50 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-gold-300" />
            <span>नवीन पूजा जोडा (Add Puja)</span>
          </Link>
          <Link
            href="/admin/events"
            className="px-4 py-2 bg-gradient-to-r from-[#C86B24] to-[#DE7F35] hover:brightness-105 text-white text-xs font-semibold rounded-full shadow-[0_4px_14px_rgba(200,107,36,0.25)] border border-amber-300/50 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>कार्यक्रम जोडा (Add Event)</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="px-4 py-2 bg-white/80 hover:bg-white text-[#5A1720] border border-[#B58A3A]/40 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all shadow-xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#C86B24]" />
            <span>फोटो अपलोड (Gallery)</span>
          </Link>
          <Link
            href="/admin/profile"
            className="px-4 py-2 bg-white/80 hover:bg-white text-[#5A1720] border border-[#B58A3A]/40 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all shadow-xs"
          >
            <User className="w-3.5 h-3.5 text-[#5A1720]" />
            <span>गुरुजी प्रोफाईल</span>
          </Link>
        </div>
      </GlassCard>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Bookings */}
        <GlassCard variant="white" padding="p-5" hoverEffect className="border border-[#B58A3A]/35">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#651C24]/10 to-[#B58A3A]/15 text-[#651C24] flex items-center justify-center shrink-0 border border-[#B58A3A]/30">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#6F625A] font-semibold uppercase tracking-wider block">एकूण बुकिंग्स</span>
              <span className="font-serif font-bold text-2xl text-[#321116]">{stats.totalBookings}</span>
            </div>
          </div>
        </GlassCard>

        {/* Pending Bookings */}
        <GlassCard variant="ivory" padding="p-5" hoverEffect className="border border-amber-400/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0 border border-amber-300">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-amber-900 font-bold uppercase tracking-wider block">प्रलंबित (Pending)</span>
              <span className="font-serif font-bold text-2xl text-amber-950">{stats.pendingBookings}</span>
            </div>
          </div>
        </GlassCard>

        {/* Total Services */}
        <GlassCard variant="white" padding="p-5" hoverEffect className="border border-[#B58A3A]/35">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gold-100/80 text-[#805E21] flex items-center justify-center shrink-0 border border-[#B58A3A]/30">
              <Flame className="w-6 h-6 text-[#C86B24]" />
            </div>
            <div>
              <span className="text-[11px] text-[#6F625A] font-semibold uppercase tracking-wider block">सक्रिय पूजा व विधी</span>
              <span className="font-serif font-bold text-2xl text-[#321116]">{stats.totalServices}</span>
            </div>
          </div>
        </GlassCard>

        {/* Total Gallery */}
        <GlassCard variant="white" padding="p-5" hoverEffect className="border border-[#B58A3A]/35">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-300">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#6F625A] font-semibold uppercase tracking-wider block">छायाचित्रे (Gallery)</span>
              <span className="font-serif font-bold text-2xl text-[#321116]">{stats.totalGallery}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Tables Row: Recent Bookings & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Bookings */}
        <GlassCard variant="white" padding="p-0" className="lg:col-span-8 border border-[#B58A3A]/40 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#B58A3A]/20 flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#5A1720]" />
              <h2 className="font-serif font-bold text-base text-[#321116]">
                नुकत्याच आलेल्या पूजा बुकिंग विनंत्या (Recent Bookings)
              </h2>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-[#C86B24] hover:text-[#5A1720] transition-colors"
            >
              सर्व पहा (View All) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F0]/80 text-[#282321] font-semibold border-b border-[#B58A3A]/25 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">संदर्भ / Ref</th>
                  <th className="py-3.5 px-4">यजमान / नाव</th>
                  <th className="py-3.5 px-4">पूजा विधी</th>
                  <th className="py-3.5 px-4">तारीख</th>
                  <th className="py-3.5 px-4">स्थिती</th>
                  <th className="py-3.5 px-4 text-right">कृती / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B58A3A]/15 bg-white/50">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#6F625A]">
                      कोणत्याही बुकिंग विनंत्या उपलब्ध नाहीत.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#FAF7F0]/90 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#5A1720]">
                        {b.reference_no}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#282321]">
                        {b.full_name}
                        <span className="block text-[10px] text-[#6F625A]">{b.mobile}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#282321]">{b.service_name}</td>
                      <td className="py-3.5 px-4 text-[#6F625A]">
                        {new Date(b.preferred_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : b.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : b.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {b.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                              title="स्वीकारा (Confirm)"
                              className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                              title="रद्द करा (Cancel)"
                              className="p-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <Link
                          href={`/admin/bookings?search=${b.reference_no}`}
                          title="पहा (View Details)"
                          className="p-1 inline-block rounded-md bg-[#FAF7F0] text-[#5A1720] hover:bg-gold-100 border border-[#B58A3A]/30 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Right: Notifications Feed */}
        <GlassCard variant="white" padding="p-0" className="lg:col-span-4 border border-[#B58A3A]/40 flex flex-col justify-between overflow-hidden shadow-sm">
          <div>
            <div className="p-5 border-b border-[#B58A3A]/20 flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#C86B24]" />
                <h2 className="font-serif font-bold text-base text-[#321116]">
                  नवीन सूचना (Notifications)
                </h2>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {recentNotifications.length === 0 ? (
                <p className="text-xs text-[#6F625A] py-6 text-center">
                  कोणत्याही नवीन सूचना नाहीत.
                </p>
              ) : (
                recentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all ${
                      notif.is_read
                        ? 'bg-[#FAF7F0]/60 border-[#B58A3A]/20'
                        : 'bg-white/95 border-[#B58A3A]/50 shadow-xs font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#321116]">{notif.title_mr}</span>
                      <span className="text-[10px] text-[#6F625A]">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[#6F625A] text-[11px] leading-relaxed">
                      {notif.message_mr}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 border-t border-[#B58A3A]/20 bg-[#FAF7F0]/50 text-center">
            <Link
              href="/admin/notifications"
              className="text-xs font-semibold text-[#5A1720] hover:text-[#C86B24] transition-colors"
            >
              सर्व सूचना पहा (View All Notifications) →
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
