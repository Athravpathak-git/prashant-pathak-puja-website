'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquareQuote, CheckCircle2, XCircle, Trash2, Edit2, PlusCircle, Star, X } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    author_name_mr: '',
    author_name_en: '',
    location_mr: 'नागपूर',
    location_en: 'Nagpur',
    rating: 5,
    comment_mr: '',
    comment_en: '',
    is_approved: true,
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials?all=true');
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      author_name_mr: '',
      author_name_en: '',
      location_mr: 'नागपूर',
      location_en: 'Nagpur',
      rating: 5,
      comment_mr: '',
      comment_en: '',
      is_approved: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (t: any) => {
    setEditingId(t.id);
    setForm({
      author_name_mr: t.author_name_mr,
      author_name_en: t.author_name_en,
      location_mr: t.location_mr || '',
      location_en: t.location_en || '',
      rating: t.rating || 5,
      comment_mr: t.comment_mr,
      comment_en: t.comment_en || '',
      is_approved: Boolean(t.is_approved),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleApproval = async (t: any) => {
    try {
      await fetch(`/api/testimonials/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...t, is_approved: !t.is_approved }),
      });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('आपण हा अभिप्राय खरोखर हटवू इच्छिता?')) return;
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            भक्तांचे अनुभव / अभिप्राय (Testimonials Moderation)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            यजमानांचे अभिप्राय तपासा, मंजूर (Approve) करा किंवा नवीन अनुभव जोडा
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-gold-300" />
          <span>अभिप्राय जोडा</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gold-300 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-ivory-50 text-charcoal-700 font-semibold border-b border-gold-200 uppercase">
            <tr>
              <th className="py-3 px-4">नाव (Author)</th>
              <th className="py-3 px-4">स्थान</th>
              <th className="py-3 px-4">रेटिंग</th>
              <th className="py-3 px-4">अभिप्राय (Comment)</th>
              <th className="py-3 px-4 text-center">मंजुरी (Approval)</th>
              <th className="py-3 px-4 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-maroon-900">लोड होत आहे...</td>
              </tr>
            ) : testimonials.map((t) => (
              <tr key={t.id} className="hover:bg-gold-50/40">
                <td className="py-3 px-4 font-bold text-maroon-950">{t.author_name_mr}</td>
                <td className="py-3 px-4 text-charcoal-600">{t.location_mr}</td>
                <td className="py-3 px-4 text-amber-500 font-bold flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{t.rating}/5</span>
                </td>
                <td className="py-3 px-4 text-charcoal-700 max-w-xs truncate" title={t.comment_mr}>
                  {t.comment_mr}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleApproval(t)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.is_approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.is_approved ? 'मंजूर (Approved)' : 'प्रलंबित (Pending)'}
                  </button>
                </td>
                <td className="py-3 px-4 text-right space-x-1.5">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-1 rounded bg-gold-50 text-maroon-800 hover:bg-gold-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
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
          <div className="bg-white rounded-2xl border-2 border-gold-400 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-200 pb-2">
              <h3 className="font-serif font-bold text-base text-maroon-950">
                {editingId ? 'अभिप्राय संपादित करा' : 'नवीन अभिप्राय जोडा'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1">यजमान नाव (मराठी) *</label>
                <input
                  type="text"
                  required
                  value={form.author_name_mr}
                  onChange={(e) => setForm({ ...form, author_name_mr: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">स्थान / शहर</label>
                <input
                  type="text"
                  value={form.location_mr}
                  onChange={(e) => setForm({ ...form, location_mr: e.target.value })}
                  placeholder="नागपूर"
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">रेटिंग</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                >
                  <option value={5}>५ स्टार (उत्कृष्ट)</option>
                  <option value={4}>४ स्टार (खूप छान)</option>
                  <option value={3}>३ स्टार (चांगला)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">अभिप्राय (मराठी) *</label>
                <textarea
                  rows={4}
                  required
                  value={form.comment_mr}
                  onChange={(e) => setForm({ ...form, comment_mr: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={form.is_approved}
                    onChange={(e) => setForm({ ...form, is_approved: e.target.checked })}
                    className="accent-maroon-800"
                  />
                  <span>संकेतस्थळावर थेट प्रकाशित करा (Approve)</span>
                </label>
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
