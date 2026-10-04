'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, PlusCircle, Edit2, Trash2, X, Calendar } from 'lucide-react';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title_mr: '',
    title_en: '',
    slug: '',
    category: 'धार्मिक माहिती',
    excerpt_mr: '',
    excerpt_en: '',
    content_mr: '',
    content_en: '',
    is_published: true,
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog?all=true');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      title_mr: '',
      title_en: '',
      slug: '',
      category: 'धार्मिक माहिती',
      excerpt_mr: '',
      excerpt_en: '',
      content_mr: '',
      content_en: '',
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      title_mr: p.title_mr,
      title_en: p.title_en || '',
      slug: p.slug,
      category: p.category || 'धार्मिक माहिती',
      excerpt_mr: p.excerpt_mr || '',
      excerpt_en: p.excerpt_en || '',
      content_mr: p.content_mr || '',
      content_en: p.content_en || '',
      is_published: Boolean(p.is_published),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/blog/${editingId}` : '/api/blog';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('आपण हा लेख खरोखर हटवू इच्छिता?')) return;
    try {
      await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            धार्मिक माहिती व लेख व्यवस्थापन (Spiritual Blog CMS)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            पूजा महात्म्य, शास्त्रोक्त नियम, वास्तुशास्त्र व सणांविषयीचे माहितीपूर्ण लेख प्रकाशित करा
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-gold-300" />
          <span>नवीन लेख लिहा</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gold-300 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-ivory-50 text-charcoal-700 font-semibold border-b border-gold-200 uppercase">
            <tr>
              <th className="py-3 px-4">तारीख</th>
              <th className="py-3 px-4">शीर्षक (मराठी)</th>
              <th className="py-3 px-4">Title (English)</th>
              <th className="py-3 px-4">वर्गवारी</th>
              <th className="py-3 px-4 text-center">स्थिती</th>
              <th className="py-3 px-4 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-100">
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-maroon-900">लोड होत आहे...</td></tr>
            ) : posts.map((p) => (
              <tr key={p.id} className="hover:bg-gold-50/40">
                <td className="py-3 px-4 font-mono">
                  {new Date(p.published_at || p.created_at).toLocaleDateString('en-GB')}
                </td>
                <td className="py-3 px-4 font-bold text-maroon-950">{p.title_mr}</td>
                <td className="py-3 px-4 text-charcoal-800">{p.title_en}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-gold-100 border border-gold-300 text-[10px]">
                    {p.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {p.is_published ? 'प्रकाशित' : 'मसुदा'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-1.5">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1 rounded bg-gold-50 text-maroon-800 hover:bg-gold-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border-2 border-gold-400 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-gold-200 pb-2">
              <h3 className="font-serif font-bold text-base text-maroon-950">
                {editingId ? 'लेख संपादित करा' : 'नवीन लेख जोडा'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1">मराठी शीर्षक *</label>
                <input
                  type="text"
                  required
                  value={form.title_mr}
                  onChange={(e) => setForm({ ...form, title_mr: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">English Title *</label>
                <input
                  type="text"
                  required
                  value={form.title_en}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">वर्गवारी (Category)</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="उदा. वास्तु शास्त्र, पूजा महात्म्य"
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">संक्षिप्त माहिती (Excerpt in Marathi)</label>
                <textarea
                  rows={2}
                  value={form.excerpt_mr}
                  onChange={(e) => setForm({ ...form, excerpt_mr: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">संपूर्ण लेख मजकूर (Full Content in Marathi) *</label>
                <textarea
                  rows={6}
                  required
                  value={form.content_mr}
                  onChange={(e) => setForm({ ...form, content_mr: e.target.value })}
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
