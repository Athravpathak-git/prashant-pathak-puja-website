'use client';

import React, { useEffect, useState } from 'react';
import { TranslatePairInput } from '@/components/admin/AutoTranslate';
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
  Info,
  Phone,
  AtSign,
  Lock
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    guruji_name_mr: '',
    guruji_name_en: '',
    contact_location_mr: '',
    contact_location_en: '',
    logo_url: '',
    favicon_url: '',
  });

  // Dedicated WhatsApp Settings state
  const [waData, setWaData] = useState({
    contact_type: 'mobile' as 'mobile' | 'username',
    country_code: '91',
    contact_value: '',
    is_enabled: true,
  });
  const [waSaving, setWaSaving] = useState(false);
  const [waMsg, setWaMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<'logo_url' | 'favicon_url' | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then((r) => r.json()),
      fetch('/api/settings/whatsapp').then((r) => r.json()),
    ])
      .then(([generalData, waSettings]) => {
        if (generalData.settings) {
          setFormData({
            guruji_name_mr: generalData.settings.guruji_name_mr || 'वे.मु. प्रशांत पाठक (गुरुजी)',
            guruji_name_en: generalData.settings.guruji_name_en || 'Ve.Mu. Prashant Pathak (Guruji)',
            contact_location_mr: generalData.settings.contact_location_mr || 'नागपूर, महाराष्ट्र',
            contact_location_en: generalData.settings.contact_location_en || 'Nagpur, Maharashtra',
            logo_url: generalData.settings.logo_url || '',
            favicon_url: generalData.settings.favicon_url || '',
          });
        }
        if (waSettings && !waSettings.error) {
          setWaData({
            contact_type: waSettings.contact_type || 'mobile',
            country_code: waSettings.country_code || '91',
            contact_value: waSettings.contact_value || '',
            is_enabled: waSettings.is_enabled !== false,
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

    if (file.size > 10 * 1024 * 1024) {
      setStatusMsg({ type: 'error', text: 'प्रतिमेचा आकार कमाल १० MB असावा. / Image exceeds 10MB limit.' });
      e.target.value = '';
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('category', field === 'logo_url' ? 'logo' : 'favicon');

    setUploadingField(field);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      const uploadedUrl = result.url || result.fileUrl;
      if (res.ok && uploadedUrl) {
        setFormData((prev) => ({ ...prev, [field]: uploadedUrl }));
        setStatusMsg({ type: 'success', text: `फाईल (${file.name}) यशस्वीरित्या अपलोड झाली.` });
      } else {
        setStatusMsg({ type: 'error', text: result.error || 'अपलोड अयशस्वी.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'सर्व्हरशी संपर्क साधताना त्रुटी.' });
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  // Save General Settings
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
        setStatusMsg({ type: 'success', text: 'संकेतस्थळ सेटिंग्ज यशस्वीरित्या सेव्ह केल्या.' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'त्रुटी आली.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'सर्व्हरशी संपर्क साधताना त्रुटी आली.' });
    } finally {
      setSaving(false);
    }
  };

  // Save WhatsApp Direct Chat Settings
  const handleSaveWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaSaving(true);
    setWaMsg(null);

    try {
      const res = await fetch('/api/settings/whatsapp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waData),
      });

      const data = await res.json();
      if (res.ok) {
        setWaMsg({
          type: 'success',
          text: data.message || 'व्हॉट्सॲप थेट चॅट सेटिंग्ज सुरक्षितपणे जतन केल्या.',
        });
      } else {
        setWaMsg({
          type: 'error',
          text: data.error || 'व्हॉट्सॲप सेटिंग्ज जतन करताना त्रुटी आली.',
        });
      }
    } catch {
      setWaMsg({ type: 'error', text: 'सर्व्हरशी संपर्क साधताना त्रुटी आली.' });
    } finally {
      setWaSaving(false);
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
              अधिकृत ब्रँडिंग, स्थान व सुरक्षित व्हॉट्सॲप थेट चॅट व्यवस्थापन
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

      {/* WhatsApp Settings Section (Dedicated Card) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold-500/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold-100 pb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-maroon-900">
                WhatsApp Settings (व्हॉट्सॲप थेट चॅट सेटिंग्ज)
              </h2>
              <p className="text-[11px] text-charcoal-500">
                वेबसाइटवरील सर्व व्हॉट्सॲप आयकॉन्ससाठी थेट संवादाची सुरक्षित लिंक
              </p>
            </div>
          </div>

          {/* Simple Enabled / Disabled Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-ivory-50 px-3 py-1.5 rounded-xl border border-gold-200 text-xs font-semibold">
            <input
              type="checkbox"
              checked={waData.is_enabled}
              onChange={(e) => setWaData((prev) => ({ ...prev, is_enabled: e.target.checked }))}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
            <span className={waData.is_enabled ? 'text-emerald-700' : 'text-charcoal-400'}>
              {waData.is_enabled ? 'सक्रिय (Enabled)' : 'अक्षम (Disabled)'}
            </span>
          </label>
        </div>

        {waMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              waMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {waMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{waMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveWhatsApp} className="space-y-4 text-xs sm:text-sm">
          {/* 1. Contact Type */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-2">
              संपर्क प्रकार (Contact Type) *
            </label>
            <div className="flex flex-wrap gap-4">
              <label
                className={`flex items-center gap-2 cursor-pointer p-3 rounded-xl border transition ${
                  waData.contact_type === 'mobile'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-gold-200 bg-ivory-50 hover:bg-gold-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="contact_type"
                  value="mobile"
                  checked={waData.contact_type === 'mobile'}
                  onChange={() => setWaData((prev) => ({ ...prev, contact_type: 'mobile' }))}
                  className="accent-emerald-700 w-4 h-4"
                />
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-xs font-semibold text-maroon-950">मोबाईल नंबर (Mobile Number)</span>
              </label>

              <label
                className={`flex items-center gap-2 cursor-pointer p-3 rounded-xl border transition ${
                  waData.contact_type === 'username'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-gold-200 bg-ivory-50 hover:bg-gold-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="contact_type"
                  value="username"
                  checked={waData.contact_type === 'username'}
                  onChange={() => setWaData((prev) => ({ ...prev, contact_type: 'username' }))}
                  className="accent-emerald-700 w-4 h-4"
                />
                <AtSign className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-xs font-semibold text-maroon-950">व्हॉट्सॲप युझरनेम (WhatsApp Username)</span>
              </label>
            </div>
          </div>

          {/* 2. Contact Value */}
          {waData.contact_type === 'mobile' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-charcoal-700">
                कंट्री कोड व मोबाईल क्रमांक (Country Code & Mobile Number) *
              </label>
              <div className="flex gap-2.5">
                <div className="w-24 shrink-0">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-charcoal-400 font-mono text-xs">+</span>
                    <input
                      type="text"
                      value={waData.country_code}
                      onChange={(e) =>
                        setWaData((prev) => ({
                          ...prev,
                          country_code: e.target.value.replace(/[^0-9]/g, ''),
                        }))
                      }
                      placeholder="91"
                      maxLength={4}
                      required
                      className="w-full pl-6 pr-2 py-2 rounded-xl border border-gold-300 font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-ivory-50/50 text-xs sm:text-sm"
                      title="कंट्री कोड (उदा. 91)"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    value={waData.contact_value}
                    onChange={(e) => setWaData((prev) => ({ ...prev, contact_value: e.target.value }))}
                    placeholder="उदा. 9822123456 (१० अंकी मोबाईल क्रमांक)"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gold-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-ivory-50/50 text-xs sm:text-sm"
                  />
                </div>
              </div>
              <p className="text-[11px] text-charcoal-500">
                केवळ आकडे प्रविष्ट करा (+, स्पेस किंवा डॅश देऊ नका). अधिकृत थेट चॅट https://wa.me/91XXXXXXXXXX द्वारे थेट उघडेल.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-charcoal-700">
                व्हॉट्सॲप युझरनेम (WhatsApp Username) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-charcoal-400 font-mono font-bold">@</span>
                <input
                  type="text"
                  value={waData.contact_value.replace(/^@+/, '')}
                  onChange={(e) =>
                    setWaData((prev) => ({ ...prev, contact_value: e.target.value.replace(/^@+/, '') }))
                  }
                  placeholder="उदा. PrashantPathakGuruji"
                  required
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-gold-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-ivory-50/50 text-xs sm:text-sm"
                />
              </div>
              <p className="text-[11px] text-charcoal-500">
                नोंद: थेट व खात्रीशीर संवादासाठी 'मोबाईल नंबर' पर्याय सर्वात विश्वसनीय व सर्व उपकरणांवर त्वरित कार्य करतो.
              </p>
            </div>
          )}

          {/* Encryption Guarantee Notice */}
          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>सुरक्षा हमी:</strong> हा संपर्क तपशील डेटाबेसमध्ये आधुनिक <strong>AES-256-GCM</strong> तंत्रज्ञानाद्वारे कूटबद्ध (Encrypted at rest) ठेवला जातो. सार्वजनिक वेबसाइटवर, HTML कोडमध्ये किंवा API प्रतिसादांमध्ये मोबाईल नंबर अथवा युझरनेम कधीही उघड केला जात नाही.
            </span>
          </div>

          {/* Save Button for WhatsApp Settings */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={waSaving}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>{waSaving ? 'जतन करत आहे...' : 'व्हॉट्सॲप सेव्ह करा (Save WhatsApp Settings)'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Brand Identity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold-500/20 space-y-4">
          <h2 className="text-base font-serif font-bold text-maroon-900 border-b border-gold-100 pb-2 flex items-center gap-2">
            <span className="text-saffron-600 font-bold">१.</span> गुरुजींचे नाव (Guruji Name)
          </h2>

          <TranslatePairInput
            labelMr="नाव (मराठी) *"
            labelEn="Name (English) *"
            valueMr={formData.guruji_name_mr}
            valueEn={formData.guruji_name_en}
            onChangeMr={(val) => setFormData((prev) => ({ ...prev, guruji_name_mr: val }))}
            onChangeEn={(val) => setFormData((prev) => ({ ...prev, guruji_name_en: val }))}
            placeholderMr="उदा. वे.मु. प्रशांत पाठक (गुरुजी)"
            placeholderEn="e.g. Ve.Mu. Prashant Pathak (Guruji)"
            required
          />
        </div>

        {/* Public Contact & Location */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold-500/20 space-y-4">
          <h2 className="text-base font-serif font-bold text-maroon-900 border-b border-gold-100 pb-2 flex items-center gap-2">
            <span className="text-saffron-600 font-bold">२.</span> अधिकृत स्थान (Location & Region)
          </h2>

          <TranslatePairInput
            labelMr="स्थान (मराठी) *"
            labelEn="Location (English) *"
            valueMr={formData.contact_location_mr}
            valueEn={formData.contact_location_en}
            onChangeMr={(val) => setFormData((prev) => ({ ...prev, contact_location_mr: val }))}
            onChangeEn={(val) => setFormData((prev) => ({ ...prev, contact_location_en: val }))}
            placeholderMr="उदा. नागपूर, महाराष्ट्र"
            placeholderEn="e.g. Nagpur, Maharashtra"
            required
          />
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
                <label className={`cursor-pointer px-3 py-2 rounded-xl bg-gold-100 hover:bg-gold-200 text-charcoal-800 text-xs font-semibold flex items-center gap-1 transition ${uploadingField === 'logo_url' ? 'opacity-60 pointer-events-none' : ''}`}>
                  <UploadCloud className="w-3.5 h-3.5" />
                  {uploadingField === 'logo_url' ? 'अपलोड होत आहे...' : 'अपलोड'}
                  <input
                    type="file"
                    disabled={uploadingField !== null}
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
                <label className={`cursor-pointer px-3 py-2 rounded-xl bg-gold-100 hover:bg-gold-200 text-charcoal-800 text-xs font-semibold flex items-center gap-1 transition ${uploadingField === 'favicon_url' ? 'opacity-60 pointer-events-none' : ''}`}>
                  <UploadCloud className="w-3.5 h-3.5" />
                  {uploadingField === 'favicon_url' ? 'अपलोड होत आहे...' : 'अपलोड'}
                  <input
                    type="file"
                    disabled={uploadingField !== null}
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

        {/* Submit Button for General Settings */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'जतन करत आहे...' : 'संकेतस्थळ सेटिंग्ज सेव्ह करा (Save General Settings)'}
          </button>
        </div>
      </form>
    </div>
  );
}
