'use client';

import React, { useEffect, useState } from 'react';
import { Film, PlusCircle, Edit2, Trash2, X, Play } from 'lucide-react';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title_mr: '',
    title_en: '',
    youtube_url: '',
    description_mr: '',
    description_en: '',
    thumbnail_url: '',
    is_published: true,
  });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/videos?all=true');
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      title_mr: '',
      title_en: '',
      youtube_url: '',
      description_mr: '',
      description_en: '',
      thumbnail_url: '',
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (v: any) => {
    setEditingId(v.id);
    setForm({
      title_mr: v.title_mr,
      title_en: v.title_en || '',
      youtube_url: v.youtube_url,
      description_mr: v.description_mr || '',
      description_en: v.description_en || '',
      thumbnail_url: v.thumbnail_url || '',
      is_published: Boolean(v.is_published),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/videos/${editingId}` : '/api/videos';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchVideos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('आपण हा व्हिडीओ खरोखर हटवू इच्छिता?')) return;
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      fetchVideos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            व्हिडीओ व्यवस्थापन (Videos Management)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            YouTube व्हिडीओ दुवे, शीर्षके व धार्मिक विधींची माहिती
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-gold-300" />
          <span>नवीन व्हिडीओ जोडा</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-maroon-900">लोड होत आहे...</div>
        ) : videos.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-gold-300 text-center text-charcoal-600 text-sm">
            कोणतेही व्हिडीओ उपलब्ध नाहीत.
          </div>
        ) : (
          videos.map((vid) => (
            <div
              key={vid.id}
              className="bg-white rounded-xl border border-gold-300 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-maroon-950 truncate">
                    {vid.title_mr}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    vid.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {vid.is_published ? 'प्रकाशित' : 'लपवलेला'}
                  </span>
                </div>
                <p className="text-xs text-charcoal-600 truncate">{vid.youtube_url}</p>
                {vid.description_mr && (
                  <p className="text-xs text-charcoal-700 line-clamp-2">{vid.description_mr}</p>
                )}
              </div>

              <div className="p-3 bg-ivory-50 border-t border-gold-200 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => openEdit(vid)}
                  className="px-3 py-1 bg-gold-100 text-maroon-900 rounded hover:bg-gold-200 font-medium"
                >
                  संपादित करा
                </button>
                <button
                  onClick={() => handleDelete(vid.id)}
                  className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 font-medium"
                >
                  हटवा
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border-2 border-gold-400 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-200 pb-2">
              <h3 className="font-serif font-bold text-base text-maroon-950">
                {editingId ? 'व्हिडीओ संपादित करा' : 'नवीन व्हिडीओ जोडा'}
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
                  placeholder="उदा. श्री रुद्र अभिषेक विधी"
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">YouTube URL *</label>
                <input
                  type="url"
                  required
                  value={form.youtube_url}
                  onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">वर्णन</label>
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
