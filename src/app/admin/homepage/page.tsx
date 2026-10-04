'use client';

import React, { useEffect, useState } from 'react';
import { Home, Save, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminHomepageManagerPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/homepage');
      const data = await res.json();
      setSections(data.sections || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggle = (index: number) => {
    const updated = [...sections];
    updated[index].is_enabled = !updated[index].is_enabled;
    setSections(updated);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    // update sort orders
    updated.forEach((s, i) => (s.sort_order = i + 1));
    setSections(updated);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    // update sort orders
    updated.forEach((s, i) => (s.sort_order = i + 1));
    setSections(updated);
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      if (res.ok) {
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
            मुख्यपृष्ठ विभाग व्यवस्थापन (Homepage Section Manager)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            मुख्यपृष्ठावरील विभाग चालू/बंद करा, क्रम बदला (Reorder) किंवा शीर्षके संपादित करा
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow border border-gold-400 flex items-center gap-1.5"
        >
          <Save className="w-4 h-4 text-gold-300" />
          <span>बदल सेव्ह करा (Save Sections)</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>मुख्यपृष्ठ विभाग यशस्वीरीत्या अद्यतनित केले गेले!</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gold-300 shadow-sm overflow-hidden divide-y divide-gold-100">
        {loading ? (
          <div className="p-12 text-center text-maroon-900 font-medium text-xs">लोड होत आहे...</div>
        ) : (
          sections.map((sec, index) => (
            <div key={sec.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gold-50/30">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-charcoal-500 hover:text-maroon-900 disabled:opacity-20"
                    title="वर हलवा (Move Up)"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === sections.length - 1}
                    className="p-1 text-charcoal-500 hover:text-maroon-900 disabled:opacity-20"
                    title="खाली हलवा (Move Down)"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <div className="font-serif font-bold text-sm text-maroon-950 flex items-center gap-2">
                    <span>{sec.title_mr || sec.section_key}</span>
                    <span className="text-[11px] font-sans font-normal text-charcoal-500">
                      ({sec.title_en || sec.section_key})
                    </span>
                  </div>
                  <span className="text-[10px] text-charcoal-400 font-mono">
                    Key: {sec.section_key} • Order: {sec.sort_order}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={sec.is_enabled}
                    onChange={() => handleToggle(index)}
                    className="w-4 h-4 accent-maroon-800 rounded cursor-pointer"
                  />
                  <span className={sec.is_enabled ? 'text-green-700' : 'text-gray-400'}>
                    {sec.is_enabled ? 'सक्रिय (Enabled)' : 'बंद (Disabled)'}
                  </span>
                </label>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
