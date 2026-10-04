'use client';

import React, { useEffect, useState } from 'react';
import { HelpCircle, PlusCircle, Edit2, Trash2, X } from 'lucide-react';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    question_mr: '',
    question_en: '',
    answer_mr: '',
    answer_en: '',
    category: 'सामान्य',
    sort_order: 0,
    is_published: true,
  });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faqs?all=true');
      const data = await res.json();
      setFaqs(data.faqs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      question_mr: '',
      question_en: '',
      answer_mr: '',
      answer_en: '',
      category: 'सामान्य',
      sort_order: faqs.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (f: any) => {
    setEditingId(f.id);
    setForm({
      question_mr: f.question_mr,
      question_en: f.question_en || '',
      answer_mr: f.answer_mr,
      answer_en: f.answer_en || '',
      category: f.category || 'सामान्य',
      sort_order: f.sort_order || 0,
      is_published: Boolean(f.is_published),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/faqs/${editingId}` : '/api/faqs';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchFaqs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('आपण हा प्रश्न खरोखर हटवू इच्छिता?')) return;
    try {
      await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            वारंवार विचारले जाणारे प्रश्न (FAQ Management)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            धार्मिक विधी, मुहूर्त, साहित्य व बुकिंग संदर्भातील प्रश्नोत्तरे व्यवस्थापित करा
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-gold-300" />
          <span>नवीन प्रश्न जोडा</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gold-300 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-ivory-50 text-charcoal-700 font-semibold border-b border-gold-200 uppercase">
            <tr>
              <th className="py-3 px-4">प्रश्न (मराठी)</th>
              <th className="py-3 px-4">वर्गवारी</th>
              <th className="py-3 px-4 text-center">स्थिती</th>
              <th className="py-3 px-4 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-100">
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-maroon-900">लोड होत आहे...</td></tr>
            ) : faqs.map((f) => (
              <tr key={f.id} className="hover:bg-gold-50/40">
                <td className="py-3 px-4 font-bold text-maroon-950 max-w-md truncate" title={f.question_mr}>
                  {f.question_mr}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-gold-100 border border-gold-300 text-[10px]">
                    {f.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    f.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {f.is_published ? 'सक्रिय' : 'निष्क्रिय'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-1.5">
                  <button
                    onClick={() => openEdit(f)}
                    className="p-1 rounded bg-gold-50 text-maroon-800 hover:bg-gold-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-1 rounded bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border-2 border-gold-400 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-200 pb-2">
              <h3 className="font-serif font-bold text-base text-maroon-950">
                {editingId ? 'प्रश्न संपादित करा' : 'नवीन प्रश्न जोडा'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1">प्रश्न (मराठी) *</label>
                <input
                  type="text"
                  required
                  value={form.question_mr}
                  onChange={(e) => setForm({ ...form, question_mr: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">उत्तर (मराठी) *</label>
                <textarea
                  rows={4}
                  required
                  value={form.answer_mr}
                  onChange={(e) => setForm({ ...form, answer_mr: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">वर्गवारी (Category)</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="उदा. मुहूर्त, साहित्य, विधी"
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gold-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-maroon-800 text-gold-100 rounded-lg text-xs font-semibold"
                >
                  जतन करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
