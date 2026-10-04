'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  Check,
  AlertCircle,
  Shield,
  MapPin,
  MessageCircle,
  Image as ImageIcon,
  UploadCloud,
  Info
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    guruji_name_mr: '',
    guruji_name_en: '',
    whatsapp_username: '',
    contact_location_mr: '',
    contact_location_en: '',
    logo_url: '',
    favicon_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setFormData({
            guruji_name_mr: data.settings.guruji_name_mr || 'वे.मु. प्रशांत पाठक (गुरुजी)',
            guruji_name_en: data.settings.guruji_name_en || 'Ve.Mu. Prashant Pathak (Guruji)',
            whatsapp_username: data.settings.whatsapp_username || '@PrashantPathakGuruji',
            contact_location_mr: data.settings.contact_location_mr || 'नागपूर, महाराष्ट्र',
            contact_location_en: data.settings.contact_location_en || 'Nagpur, Maharashtra',
            logo_url: data.settings.logo_url || '',
            favicon_url: data.settings.favicon_url || '',
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'favicon_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setUploadingLogo(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (res.ok && result.fileUrl) {
        setFormData((prev) => ({ ...prev, [field]: result.fileUrl }));
        setStatusMsg({ type: 'success', text: 'फाईल यशस्वीरित्या अपलोड केली.' });
      } else {
        setStatusMsg({ type: 'error', text: result.error || 'अपलोड अयशस्वी.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'सर्व्हर त्रुटी.' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'सेटिंग्ज यशस्वीरित्या सेव्ह केल्या.' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'त्रुटी आली.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'सर्व्हरशी संपर्क साधताना त्रुटी आली.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-charcoal-500 font-serif">
        सेटिंग्ज लोड होत आहेत...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-saffron-50 border border-saffron-200 flex items-center justify-center text-saffron-600">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-maroon-900">
              संकेतस्थळ सेटिंग्ज (Website Settings)
            </h1>
            <p className="text-xs text-charcoal-600">
              संपर्क माहिती, सार्वजनिक हँडल आणि अधिकृत ब्रँडिंग व्यवस्थापन
            </p>
          </div>
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

      {/* Privacy Notice Banner */}
      <div className="bg-gradient-to-r from-maroon-900 to-maroon-950 text-gold-100 p-5 rounded-2xl shadow-sm border border-gold-500/30 flex items-start gap-3.5">
        <Shield className="w-6 h-6 text-gold-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-gold-300 font-serif text-sm">
            गोपनीयता व सुरक्षा सूचना (Client Privacy Policy)
          </p>
          <p className="text-ivory-200 leading-relaxed">
            गुरुजींचा वैयक्तिक मोबाईल नंबर वेबसाइटवरील कोणत्याही सार्वजनिक पानावर किंवा क्लायंट कोडमध्ये उघड केला जात नाही. 
            सार्वजनिक संपर्क फक्त अधिकृत व्हॉट्सॲप युझरनेम <strong>@PrashantPathakGuruji</strong> द्वारे सुरक्षित सर्व्हर-साइड पुनर्निर्देशनाद्वारे होतो.
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Brand Identity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold-500/20 space-y-4">
          <h2 className="text-base font-serif font-bold text-maroon-900 border-b border-gold-100 pb-2 flex items-center gap-2">
            <span className="text-saffron-600 font-bold">१.</span> गुरुजींचे नाव (Guruji Name)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                नाव (मराठी) *
              </label>
              <input
                type="text"
                name="guruji_name_mr"
                value={formData.guruji_name_mr}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-ivory-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Name (English) *
              </label>
              <input
                type="text"
                name="guruji_name_en"
                value={formData.guruji_name_en}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-ivory-50/50"
              />
            </div>
          </div>
        </div>

        {/* Public Contact & Location */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold-500/20 space-y-4">
          <h2 className="text-base font-serif font-bold text-maroon-900 border-b border-gold-100 pb-2 flex items-center gap-2">
            <span className="text-saffron-600 font-bold">२.</span> अधिकृत संपर्क व स्थान (Contact & Location)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-saffron-600" />
                स्थान (मराठी) *
              </label>
              <input
                type="text"
                name="contact_location_mr"
                value={formData.contact_location_mr}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-ivory-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-saffron-600" />
                Location (English) *
              </label>
              <input
                type="text"
                name="contact_location_en"
                value={formData.contact_location_en}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-ivory-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              सार्वजनिक व्हॉट्सॲप युझरनेम (Public WhatsApp Username) *
            </label>
            <input
              type="text"
              name="whatsapp_username"
              value={formData.whatsapp_username}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-sm bg-ivory-50/50 font-mono"
            />
            <p className="text-[11px] text-charcoal-500 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-gold-600 shrink-0" />
              सार्वजनिक युझर्सना फक्त हे युझरनेम दिसेल (उदा. @PrashantPathakGuruji).
            </p>
          </div>
        </div>

        {/* Media Branding: Logo and Favicon */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold-500/20 space-y-4">
          <h2 className="text-base font-serif font-bold text-maroon-900 border-b border-gold-100 pb-2 flex items-center gap-2">
            <span className="text-saffron-600 font-bold">३.</span> लोगो व चिन्ह (Logo & Icon)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Logo */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-charcoal-700">
                लोगो URL (Header Logo)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="/images/logo.png"
                  className="flex-1 px-3 py-2 rounded-xl border border-gold-300 text-xs focus:ring-2 focus:ring-saffron-500 bg-ivory-50/50"
                />
                <label className="cursor-pointer px-3 py-2 rounded-xl bg-gold-100 hover:bg-gold-200 text-charcoal-800 text-xs font-semibold flex items-center gap-1 transition">
                  <UploadCloud className="w-3.5 h-3.5" />
                  {uploadingLogo ? '...' : 'अपलोड'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => handleFileUpload(e, 'logo_url')}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.logo_url && (
                <div className="mt-2 p-2 bg-ivory-100 rounded-lg border border-gold-200 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.logo_url} alt="Logo Preview" className="h-10 object-contain" />
                </div>
              )}
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-charcoal-700">
                फेविकॉन URL (Browser Favicon)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="favicon_url"
                  value={formData.favicon_url}
                  onChange={handleChange}
                  placeholder="/favicon.ico"
                  className="flex-1 px-3 py-2 rounded-xl border border-gold-300 text-xs focus:ring-2 focus:ring-saffron-500 bg-ivory-50/50"
                />
                <label className="cursor-pointer px-3 py-2 rounded-xl bg-gold-100 hover:bg-gold-200 text-charcoal-800 text-xs font-semibold flex items-center gap-1 transition">
                  <UploadCloud className="w-3.5 h-3.5" />
                  अपलोड
                  <input
                    type="file"
                    accept="image/png,image/x-icon,image/svg+xml"
                    onChange={(e) => handleFileUpload(e, 'favicon_url')}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.favicon_url && (
                <div className="mt-2 p-2 bg-ivory-100 rounded-lg border border-gold-200 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.favicon_url} alt="Favicon Preview" className="w-6 h-6 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'जतन करत आहे...' : 'सेटिंग्ज सेव्ह करा (Save Settings)'}
          </button>
        </div>
      </form>
    </div>
  );
}
