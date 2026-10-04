'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, PlusCircle, Edit2, Trash2, X } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title_mr: '',
    title_en: '',
    description_mr: '',
    description_en: '',
    event_date: '',
    event_time: '',
    location: 'नागपूर (Nagpur)',
    is_published: true,
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events?all=true');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      title_mr: '',
      title_en: '',
      description_mr: '',
      description_en: '',
      event_date: new Date().toISOString().split('T')[0],
      event_time: 'सकाळी ८:०० ते दुपारी १:००',
      location: 'नागपूर (Nagpur)',
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (ev: any) => {
    setEditingId(ev.id);
    setForm({
      title_mr: ev.title_mr,
      title_en: ev.title_en,
      description_mr: ev.description_mr || '',
      description_en: ev.description_en || '',
      event_date: ev.event_date ? new Date(ev.event_date).toISOString().split('T')[0] : '',
      event_time: ev.event_time || '',
      location: ev.location || '',
      is_published: Boolean(ev.is_published),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('आपण हा कार्यक्रम खरोखर हटवू इच्छिता?')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            धार्मिक कार्यक्रम व्यवस्थापन (Events Management)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            विशेष सण, महापर्व व सामुदायिक अनुष्ठानांची माहिती अद्यतनित करा
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-gold-300" />
          <span>नवीन कार्यक्रम जोडा</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gold-300 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-ivory-50 text-charcoal-700 font-semibold border-b border-gold-200 uppercase">
            <tr>
              <th className="py-3 px-4">तारीख</th>
              <th className="py-3 px-4">कार्यक्रम नाव (मराठी)</th>
              <th className="py-3 px-4">Title (English)</th>
              <th className="py-3 px-4">स्थान</th>
              <th className="py-3 px-4 text-center">स्थिती</th>
              <th className="py-3 px-4 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-maroon-900">लोड होत आहे...</td>
              </tr>
            ) : events.map((ev) => (
              <tr key={ev.id} className="hover:bg-gold-50/40">
                <td className="py-3 px-4 font-mono">
                  {new Date(ev.event_date).toLocaleDateString('en-GB')}
                </td>
                <td className="py-3 px-4 font-bold text-maroon-950">{ev.title_mr}</td>
                <td className="py-3 px-4 text-charcoal-800">{ev.title_en}</td>
                <td className="py-3 px-4 text-charcoal-600">{ev.location}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ev.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {ev.is_published ? 'प्रकाशित' : 'मसुदा'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-1.5">
                  <button
                    onClick={() => openEdit(ev)}
                    className="p-1 rounded bg-gold-50 text-maroon-800 hover:bg-gold-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
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
                {editingId ? 'कार्यक्रम संपादित करा' : 'नवीन कार्यक्रम जोडा'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1">कार्यक्रम शीर्षक (मराठी) *</label>
                <input
                  type="text"
                  required
                  value={form.title_mr}
                  onChange={(e) => setForm({ ...form, title_mr: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Event Title (English) *</label>
                <input
                  type="text"
                  required
                  value={form.title_en}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">तारीख *</label>
                  <input
                    type="date"
                    required
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">वेळ</label>
                  <input
                    type="text"
                    value={form.event_time}
                    onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                    placeholder="सकाळी ८:००"
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">स्थान</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="नागपूर"
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">वर्णन (मराठी)</label>
                <textarea
                  rows={3}
                  value={form.description_mr}
                  onChange={(e) => setForm({ ...form, description_mr: e.target.value })}
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
