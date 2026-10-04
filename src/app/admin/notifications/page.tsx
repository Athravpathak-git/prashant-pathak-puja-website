'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Trash2,
  CalendarCheck,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Check,
  RefreshCw,
} from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PATCH' });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
        setStatusMsg({ type: 'success', text: 'सर्व सूचना वाचल्या म्हणून चिन्हांकित केल्या.' });
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'त्रुटी आली.' });
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const wasUnread = notifications.find((n) => n.id === id)?.is_read === false;
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck className="w-5 h-5 text-saffron-600" />;
      case 'contact':
        return <MessageSquare className="w-5 h-5 text-maroon-700" />;
      default:
        return <Bell className="w-5 h-5 text-gold-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gold-500/20">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-saffron-50 border border-saffron-200 flex items-center justify-center text-saffron-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-maroon-900">
                सूचना केंद्र (Notification Center)
              </h1>
              <p className="text-xs text-charcoal-600">
                नवीन पूजा बुकिंग्स आणि चौकशी संदर्भातील सूचना
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gold-300 hover:bg-gold-50 text-charcoal-700 transition flex items-center gap-1.5 text-xs font-medium"
            title="पुन्हा लोड करा"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            रिफ्रेश
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2.5 rounded-xl bg-maroon-900 hover:bg-maroon-950 text-gold-200 transition text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <CheckCheck className="w-4 h-4" />
              सर्व वाचले (Mark All Read)
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gold-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
            filter === 'all'
              ? 'bg-saffron-600 text-white shadow-sm'
              : 'bg-white text-charcoal-700 hover:bg-ivory-200 border border-gold-200'
          }`}
        >
          सर्व सूचना ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-saffron-600 text-white shadow-sm'
              : 'bg-white text-charcoal-700 hover:bg-ivory-200 border border-gold-200'
          }`}
        >
          न वाचलेल्या ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gold-500/20 overflow-hidden divide-y divide-gold-100">
        {loading && notifications.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500 font-serif">
            सूचना लोड होत आहेत...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500">
            <Bell className="w-10 h-10 mx-auto text-gold-400 mb-3 opacity-50" />
            <p className="font-serif text-maroon-900 font-semibold">कोणतीही सूचना उपलब्ध नाही.</p>
            <p className="text-xs text-charcoal-500 mt-1">नवीन बुकिंग आल्यावर येथे दिसेल.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition hover:bg-ivory-50 ${
                !notif.is_read ? 'bg-saffron-50/40 font-medium' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-gold-300 shadow-xs shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-bold text-maroon-950 font-serif">{notif.title}</h2>
                    {!notif.is_read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-saffron-100 text-saffron-800 border border-saffron-300">
                        नवीन (New)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-700 mt-1 whitespace-pre-wrap leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-charcoal-500 mt-2">
                    {new Date(notif.created_at).toLocaleString('mr-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {notif.link && (
                  <Link
                    href={notif.link}
                    className="p-2 rounded-lg text-charcoal-600 hover:text-saffron-700 hover:bg-gold-50 transition"
                    title="पहा (View Details)"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
                {!notif.is_read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 transition"
                    title="वाचले म्हणून चिन्हांकित करा"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                  title="हटवा (Delete)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
