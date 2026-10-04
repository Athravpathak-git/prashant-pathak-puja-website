'use client';

import React, { useEffect, useState } from 'react';
import { FolderTree, PlusCircle, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name_mr: '',
    name_en: '',
    slug: '',
    sort_order: 0,
    is_active: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      name_mr: '',
      name_en: '',
      slug: '',
      sort_order: categories.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (cat: any) => {
    setEditingId(cat.id);
    setForm({
      name_mr: cat.name_mr,
      name_en: cat.name_en,
      slug: cat.slug,
      sort_order: cat.sort_order || 0,
      is_active: Boolean(cat.is_active),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        const d = await res.json();
        alert(d.error || 'त्रुटी.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('आपण ही वर्गवारी खरोखर हटवू इच्छिता? / Delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            पूजा वर्गवारी व्यवस्थापन (Service Categories)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            धार्मिक विधींच्या मुख्य श्रेणींचे व्यवस्थापन (गृहशांती, संस्कार, अभिषेक, इत्यादी)
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-gold-300" />
          <span>नवीन वर्गवारी जोडा</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gold-300 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-ivory-50 text-charcoal-700 font-semibold border-b border-gold-200 uppercase">
            <tr>
              <th className="py-3 px-4">क्रम (Order)</th>
              <th className="py-3 px-4">मराठी नाव</th>
              <th className="py-3 px-4">English Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4 text-center">स्थिती</th>
              <th className="py-3 px-4 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-maroon-900">
                  लोड होत आहे...
                </td>
              </tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gold-50/40">
                <td className="py-3 px-4 font-mono">{cat.sort_order}</td>
                <td className="py-3 px-4 font-bold text-maroon-950">{cat.name_mr}</td>
                <td className="py-3 px-4 text-charcoal-800">{cat.name_en}</td>
                <td className="py-3 px-4 font-mono text-charcoal-600">{cat.slug}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {cat.is_active ? 'सक्रिय' : 'निष्क्रिय'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-1.5">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1 rounded bg-gold-50 text-maroon-800 hover:bg-gold-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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
                {editingId ? 'वर्गवारी संपादित करा' : 'नवीन वर्गवारी जोडा'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1">मराठी नाव *</label>
                <input
                  type="text"
                  required
                  value={form.name_mr}
                  onChange={(e) => setForm({ ...form, name_mr: e.target.value })}
                  placeholder="उदा. गृहशांती"
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">English Name *</label>
                <input
                  type="text"
                  required
                  value={form.name_en}
                  onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                  placeholder="e.g. Grah Shanti"
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="उदा. grah-shanti"
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">क्रम (Sort Order)</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
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
