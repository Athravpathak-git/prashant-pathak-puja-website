'use client';

import React, { useEffect, useState } from 'react';
import { Palette, RotateCcw, Save, CheckCircle2 } from 'lucide-react';

export default function AdminAppearancePage() {
  const [appearance, setAppearance] = useState({
    appearance_primary_color: '#E65100', // Saffron
    appearance_secondary_color: '#660F1A', // Deep Maroon
    appearance_accent_color: '#C5A059', // Muted Antique Gold
    appearance_background: '#FAF7F2', // Warm Ivory
    appearance_text: '#1F1D1D', // Charcoal
    appearance_button_style: 'rounded-md',
  });

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    fetch('/api/appearance')
      .then((r) => r.json())
      .then((d) => {
        if (d.appearance) setAppearance(d.appearance);
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/appearance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appearance),
      });
      if (res.ok) {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('थीम मूळ स्थितीत पूर्ववत करू इच्छिता? (Reset to Default Theme)')) return;
    try {
      const res = await fetch('/api/appearance', { method: 'POST' });
      const data = await res.json();
      if (data.appearance) {
        setAppearance(data.appearance);
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            रंगरूप व थीम सानुकूलन (Appearance & Theme)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            संकेतस्थळाची आध्यात्मिक रंगसंगती, बटणे व फॉन्ट शैली व्यवस्थापित करा
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 border border-maroon-300 text-maroon-900 bg-white hover:bg-ivory-50 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-maroon-800" />
          <span>मूळ स्थितीत आणा (Reset Default)</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>रंगरूप यशस्वीरित्या जतन झाले!</span>
        </div>
      )}

      {/* Live Preview Box */}
      <div className="bg-white p-6 rounded-2xl border border-gold-300 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-sm text-maroon-950 border-b border-gold-200 pb-2">
          थेट पूर्वावलोकन (Live Preview)
        </h3>

        <div
          className="p-6 rounded-xl border border-gold-300 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors"
          style={{ backgroundColor: appearance.appearance_background, color: appearance.appearance_text }}
        >
          <div className="space-y-1 text-center sm:text-left">
            <span
              className="text-xs font-serif font-bold"
              style={{ color: appearance.appearance_primary_color }}
            >
              || श्री गणेशाय नमः ||
            </span>
            <h4
              className="font-serif font-bold text-xl"
              style={{ color: appearance.appearance_secondary_color }}
            >
              वे.मु. प्रशांत पाठक (गुरुजी)
            </h4>
            <p className="text-xs opacity-90">
              सर्व प्रकारचे धार्मिक विधी शास्त्रोक्त पद्धतीने केले जातील
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-xs font-semibold text-white shadow"
              style={{
                backgroundColor: appearance.appearance_secondary_color,
                borderRadius: appearance.appearance_button_style === 'rounded-full' ? '9999px' : '8px',
              }}
            >
              पूजा बुक करा
            </button>
            <button
              className="px-4 py-2 text-xs font-semibold text-white shadow"
              style={{
                backgroundColor: appearance.appearance_primary_color,
                borderRadius: appearance.appearance_button_style === 'rounded-full' ? '9999px' : '8px',
              }}
            >
              WhatsApp संपर्क
            </button>
          </div>
        </div>
      </div>

      {/* Form Controls */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gold-300 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Primary Saffron */}
          <div>
            <label className="block text-xs font-semibold text-maroon-950 mb-1">
              प्राथमिक रंग (Primary Saffron)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.appearance_primary_color}
                onChange={(e) => setAppearance({ ...appearance, appearance_primary_color: e.target.value })}
                className="w-10 h-10 rounded border border-gold-300 cursor-pointer"
              />
              <input
                type="text"
                value={appearance.appearance_primary_color}
                onChange={(e) => setAppearance({ ...appearance, appearance_primary_color: e.target.value })}
                className="w-32 px-3 py-1.5 text-xs font-mono bg-ivory-50 border border-gold-300 rounded"
              />
            </div>
          </div>

          {/* Secondary Maroon */}
          <div>
            <label className="block text-xs font-semibold text-maroon-950 mb-1">
              दुय्यम रंग (Deep Maroon)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.appearance_secondary_color}
                onChange={(e) => setAppearance({ ...appearance, appearance_secondary_color: e.target.value })}
                className="w-10 h-10 rounded border border-gold-300 cursor-pointer"
              />
              <input
                type="text"
                value={appearance.appearance_secondary_color}
                onChange={(e) => setAppearance({ ...appearance, appearance_secondary_color: e.target.value })}
                className="w-32 px-3 py-1.5 text-xs font-mono bg-ivory-50 border border-gold-300 rounded"
              />
            </div>
          </div>

          {/* Accent Gold */}
          <div>
            <label className="block text-xs font-semibold text-maroon-950 mb-1">
              अॅक्सेंट रंग (Muted Gold)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.appearance_accent_color}
                onChange={(e) => setAppearance({ ...appearance, appearance_accent_color: e.target.value })}
                className="w-10 h-10 rounded border border-gold-300 cursor-pointer"
              />
              <input
                type="text"
                value={appearance.appearance_accent_color}
                onChange={(e) => setAppearance({ ...appearance, appearance_accent_color: e.target.value })}
                className="w-32 px-3 py-1.5 text-xs font-mono bg-ivory-50 border border-gold-300 rounded"
              />
            </div>
          </div>

          {/* Background Ivory */}
          <div>
            <label className="block text-xs font-semibold text-maroon-950 mb-1">
              पार्श्वभूमी (Warm Ivory Background)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.appearance_background}
                onChange={(e) => setAppearance({ ...appearance, appearance_background: e.target.value })}
                className="w-10 h-10 rounded border border-gold-300 cursor-pointer"
              />
              <input
                type="text"
                value={appearance.appearance_background}
                onChange={(e) => setAppearance({ ...appearance, appearance_background: e.target.value })}
                className="w-32 px-3 py-1.5 text-xs font-mono bg-ivory-50 border border-gold-300 rounded"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gold-200">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow border border-gold-400 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-gold-300" />
            <span>{saving ? 'जतन करत आहे...' : 'रंगरूप सेव्ह करा (Save Appearance)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
