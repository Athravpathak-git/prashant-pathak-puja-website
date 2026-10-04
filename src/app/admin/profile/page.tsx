'use client';

import React, { useEffect, useState } from 'react';
import { ImageCropModal } from '@/components/ImageCropModal';
import {
  User,
  Upload,
  Crop,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Star,
  Home,
  BookOpen
} from 'lucide-react';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>({
    guruji_name_mr: '',
    guruji_name_en: '',
    guruji_title_mr: '',
    guruji_title_en: '',
    bio_mr: '',
    bio_en: '',
    hero_image_url: '',
    primary_photo_url: '',
    about_photo_url: '',
    contact_location_mr: '',
    contact_location_en: '',
    whatsapp_username: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Crop Modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>('');
  const [cropTarget, setCropTarget] = useState<'hero' | 'primary' | 'about'>('primary');

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile', { cache: 'no-store' });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'त्रुटी आली.');

      setMsg({ text: 'गुरुजींची प्रोफाईल माहिती यशस्वीरित्या अद्यतनित झाली!', type: 'success' });
      setProfile(data.profile);
    } catch (err: any) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'primary' | 'about') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCropTarget(target);
    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCroppedSave = async (blob: Blob, filename: string) => {
    const formData = new FormData();
    formData.append('file', blob, filename);
    formData.append('category', 'guruji_profile');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'अपलोड त्रुटी.');

      const url = data.url;
      setCropModalOpen(false);

      const updated = {
        ...profile,
        ...(cropTarget === 'hero' ? { hero_image_url: url } : {}),
        ...(cropTarget === 'about' ? { about_photo_url: url } : {}),
        ...(cropTarget === 'primary' ? { primary_photo_url: url } : {}),
      };

      setProfile(updated);

      // Immediately auto-save to database so it reflects on public pages instantly
      const saveRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (saveRes.ok) {
        const savedData = await saveRes.json();
        if (savedData.profile) setProfile(savedData.profile);
        setMsg({ text: 'छायाचित्र यशस्वीरित्या अपलोड व मुख्यपृष्ठावर सेव्ह झाले! (Photo published to website)', type: 'success' });
      } else {
        setMsg({ text: 'छायाचित्र अपलोड झाले. कृपया खालील सेव्ह बटणावर क्लिक करा.', type: 'success' });
      }
    } catch (err: any) {
      setMsg({ text: err.message, type: 'error' });
    }
  };

  const handleDeletePhoto = async (target: 'hero' | 'primary' | 'about') => {
    const updated = {
      ...profile,
      ...(target === 'hero' ? { hero_image_url: '' } : {}),
      ...(target === 'about' ? { about_photo_url: '' } : {}),
      ...(target === 'primary' ? { primary_photo_url: '' } : {}),
    };
    setProfile(updated);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setMsg({ text: 'छायाचित्र हटवले व संकेतस्थळावर अद्यतनित केले.', type: 'success' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-maroon-900 font-medium">लोड होत आहे...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            गुरुजी प्रोफाईल व्यवस्थापन (Guruji Profile Management)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            वे.मु. प्रशांत पाठक गुरुजींचे नाव, पदवी, परिचय व अधिकृत छायाचित्रे व्यवस्थापित करा
          </p>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Photographs Section: Hero, Primary, About */}
      <div className="bg-white p-6 rounded-2xl border border-gold-300 shadow-sm space-y-6">
        <h2 className="font-serif font-bold text-lg text-maroon-950 border-b border-gold-200 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-saffron-600" />
          <span>गुरुजींची अधिकृत छायाचित्रे (Photographs & Image Editor)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Primary Photo */}
          <div className="p-4 bg-ivory-50 rounded-xl border border-gold-300 flex flex-col items-center text-center space-y-3">
            <span className="text-xs font-bold text-maroon-900 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500" /> प्राथमिक छायाचित्र (Primary Photo)
            </span>
            <div className="w-36 h-44 rounded-lg bg-ivory-200 border-2 border-gold-400 overflow-hidden relative flex items-center justify-center">
              {profile.primary_photo_url ? (
                <img
                  src={profile.primary_photo_url}
                  alt="Primary"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[11px] text-charcoal-500 p-2">कोणताही फोटो नाही</span>
              )}
            </div>

            <div className="flex gap-2">
              <label className="px-3 py-1.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>अपलोड / बदला</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, 'primary')}
                />
              </label>
              {profile.primary_photo_url && (
                <button
                  type="button"
                  onClick={() => handleDeletePhoto('primary')}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200"
                  title="हटवा"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Hero Photo */}
          <div className="p-4 bg-ivory-50 rounded-xl border border-gold-300 flex flex-col items-center text-center space-y-3">
            <span className="text-xs font-bold text-maroon-900 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-saffron-600" /> मुख्यपृष्ठ फोटो (Hero Photo)
            </span>
            <div className="w-36 h-44 rounded-lg bg-ivory-200 border-2 border-gold-400 overflow-hidden relative flex items-center justify-center">
              {profile.hero_image_url ? (
                <img
                  src={profile.hero_image_url}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[11px] text-charcoal-500 p-2">कोणताही फोटो नाही</span>
              )}
            </div>

            <div className="flex gap-2">
              <label className="px-3 py-1.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>अपलोड / बदला</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, 'hero')}
                />
              </label>
              {profile.hero_image_url && (
                <button
                  type="button"
                  onClick={() => handleDeletePhoto('hero')}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200"
                  title="हटवा"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3. About Page Photo */}
          <div className="p-4 bg-ivory-50 rounded-xl border border-gold-300 flex flex-col items-center text-center space-y-3">
            <span className="text-xs font-bold text-maroon-900 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-gold-600" /> About पेज फोटो
            </span>
            <div className="w-36 h-44 rounded-lg bg-ivory-200 border-2 border-gold-400 overflow-hidden relative flex items-center justify-center">
              {profile.about_photo_url ? (
                <img
                  src={profile.about_photo_url}
                  alt="About"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[11px] text-charcoal-500 p-2">कोणताही फोटो नाही</span>
              )}
            </div>

            <div className="flex gap-2">
              <label className="px-3 py-1.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>अपलोड / बदला</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, 'about')}
                />
              </label>
              {profile.about_photo_url && (
                <button
                  type="button"
                  onClick={() => handleDeletePhoto('about')}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200"
                  title="हटवा"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-gold-300 shadow-sm space-y-6">
        <h2 className="font-serif font-bold text-lg text-maroon-950 border-b border-gold-200 pb-3">
          तपशीलवार माहिती (Details in Marathi & English)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-maroon-950 mb-1">
              गुरुजींचे नाव (मराठी) *
            </label>
            <input
              type="text"
              required
              value={profile.guruji_name_mr}
              onChange={(e) => setProfile({ ...profile, guruji_name_mr: e.target.value })}
              className="w-full px-3.5 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-950 mb-1">
              Guruji's Name (English) *
            </label>
            <input
              type="text"
              required
              value={profile.guruji_name_en}
              onChange={(e) => setProfile({ ...profile, guruji_name_en: e.target.value })}
              className="w-full px-3.5 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-950 mb-1">
              पदवी / शीर्षक (मराठी)
            </label>
            <input
              type="text"
              value={profile.guruji_title_mr}
              onChange={(e) => setProfile({ ...profile, guruji_title_mr: e.target.value })}
              className="w-full px-3.5 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-950 mb-1">
              Title / Honorific (English)
            </label>
            <input
              type="text"
              value={profile.guruji_title_en}
              onChange={(e) => setProfile({ ...profile, guruji_title_en: e.target.value })}
              className="w-full px-3.5 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-maroon-950 mb-1">
              परिचय / माहिती (मराठी) *
            </label>
            <textarea
              rows={5}
              required
              value={profile.bio_mr}
              onChange={(e) => setProfile({ ...profile, bio_mr: e.target.value })}
              className="w-full px-3.5 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-950 mb-1">
              Biography / Introduction (English) *
            </label>
            <textarea
              rows={5}
              required
              value={profile.bio_en}
              onChange={(e) => setProfile({ ...profile, bio_en: e.target.value })}
              className="w-full px-3.5 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 disabled:opacity-50 text-gold-100 font-semibold text-xs sm:text-sm rounded-lg shadow border border-gold-400 flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-gold-300" />
            <span>{saving ? 'जतन करत आहे...' : 'प्रोफाईल सेव्ह करा (Save Profile)'}</span>
          </button>
        </div>
      </form>

      {/* Image Cropper & Editor Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={tempImageSrc}
        onClose={() => setCropModalOpen(false)}
        onSave={handleCroppedSave}
        aspectRatio={4 / 5}
        title="गुरुजी छायाचित्र संपादन (Crop, Rotate, Zoom & Pan)"
      />
    </div>
  );
}
