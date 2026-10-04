'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Flame,
  FolderTree,
  Calendar,
  Image as ImageIcon,
  Film,
  MessageSquareQuote,
  BookOpen,
  HelpCircle,
  Home,
  Palette,
  Bell,
  Settings,
  ShieldCheck,
  FileText,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  HardDrive
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminUser, setAdminUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If we are on /admin/login, don't show the dashboard chrome
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    fetch('/api/auth/me')
      .then((r) => {
        if (!r.ok) {
          router.replace('/admin/login');
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d && d.authenticated) {
          setAdminUser(d.user);
          // fetch unread notifications count
          fetch('/api/notifications')
            .then((res) => res.json())
            .then((nData) => setUnreadCount(nData.unreadCount || 0))
            .catch(() => {});
        } else {
          router.replace('/admin/login');
        }
      })
      .catch(() => router.replace('/admin/login'))
      .finally(() => setCheckingAuth(false));
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-ivory-50">{children}</div>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-50 text-maroon-900 font-serif text-base">
        प्रशासकीय सत्र तपासत आहे... / Verifying Session...
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'डॅशबोर्ड (Dashboard)', icon: LayoutDashboard },
    { href: '/admin/bookings', label: 'बुकिंग्स (Bookings)', icon: CalendarCheck, badge: unreadCount },
    { href: '/admin/services', label: 'पूजा / विधी (Services)', icon: Flame },
    { href: '/admin/categories', label: 'वर्गवारी (Categories)', icon: FolderTree },
    { href: '/admin/events', label: 'कार्यक्रम (Events)', icon: Calendar },
    { href: '/admin/gallery', label: 'दालन (Gallery)', icon: ImageIcon },
    { href: '/admin/media', label: 'मिडीया लायब्ररी (Media)', icon: HardDrive },
    { href: '/admin/videos', label: 'व्हिडीओ (Videos)', icon: Film },
    { href: '/admin/testimonials', label: 'अभिप्राय (Testimonials)', icon: MessageSquareQuote },
    { href: '/admin/blog', label: 'लेख / ब्लॉग (Blog)', icon: BookOpen },
    { href: '/admin/faqs', label: 'प्रश्नोत्तरे (FAQs)', icon: HelpCircle },
    { href: '/admin/homepage', label: 'मुख्यपृष्ठ व्यवस्थापन', icon: Home },
    { href: '/admin/appearance', label: 'रंगरूप (Appearance)', icon: Palette },
    { href: '/admin/notifications', label: 'सूचना (Notifications)', icon: Bell, badge: unreadCount },
    { href: '/admin/settings', label: 'सेटिंग्ज (Settings)', icon: Settings },
    { href: '/admin/security', label: 'सुरक्षा (Security)', icon: ShieldCheck },
    { href: '/admin/audit-logs', label: 'ऑडिट लॉग (Audit Logs)', icon: FileText },
    { href: '/admin/profile', label: 'गुरुजी प्रोफाईल (Profile)', icon: User },
  ];

  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-maroon-950 text-gold-200 px-4 py-3 flex items-center justify-between border-b border-gold-500/30">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-bold">ॐ</span>
          <span className="font-serif text-sm font-semibold">प्रशांत पाठक गुरुजी (Admin)</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-gold-200 rounded hover:bg-maroon-900 transition-colors"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-maroon-950 via-[#360e13] to-[#20070a] text-ivory-200 border-r border-gold-500/30 flex flex-col justify-between transition-transform duration-200 ease-in-out shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand */}
          <div className="p-4 border-b border-gold-500/20 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-maroon-900 to-saffron-600 border border-gold-400 flex items-center justify-center text-gold-100 font-serif font-bold text-lg shadow-md">
                ॐ
              </div>
              <div>
                <h2 className="font-serif font-bold text-sm text-gold-200 leading-tight">
                  वे.मु. प्रशांत पाठक
                </h2>
                <span className="text-[10px] text-gold-400 font-serif block">प्रशासकीय नियंत्रण कक्ष</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gold-400 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-serif font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-maroon-800 to-maroon-900 text-gold-100 font-semibold border-l-4 border-gold-400 shadow-xs'
                      : 'text-ivory-300 hover:bg-maroon-900/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-saffron-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gold-500/20 bg-charcoal-950/80 space-y-2 text-xs">
          <div className="flex items-center justify-between px-2 text-gold-300">
            <span className="truncate font-serif">{adminUser?.fullName || 'प्रशासक'}</span>
            <span className="text-[10px] bg-gold-900/60 px-1.5 py-0.5 rounded text-gold-300 font-serif">Admin</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              target="_blank"
              className="text-[11px] text-gold-400 hover:text-white flex items-center gap-1 transition-colors font-serif"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>वेबसाईट पहा</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors font-serif"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex h-16 bg-white/90 backdrop-blur-sm border-b border-gold-300/80 px-6 items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <h2 className="font-heading font-bold text-maroon-950 text-base">
              वे.मु. प्रशांत पाठक (गुरुजी) — व्यवस्थापन प्रणाली
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/notifications"
              className="relative p-2 text-charcoal-700 hover:text-maroon-800 rounded-full hover:bg-gold-100/60 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-saffron-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-maroon-900 hover:text-saffron-700 flex items-center gap-1.5 bg-cream-100 px-3.5 py-1.5 rounded-full border border-gold-300 font-serif transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-saffron-700" />
              <span>वेबसाईट उघडा (View Site)</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-medium text-red-700 hover:text-red-900 flex items-center gap-1.5 bg-red-50 hover:bg-red-100 px-3.5 py-1.5 rounded-full transition-colors font-serif"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
