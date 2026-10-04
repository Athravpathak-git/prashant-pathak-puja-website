'use client';

import React, { useEffect, useState } from 'react';
import { HardDrive, Upload, Trash2, Search, Copy, Check, FileImage } from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setMediaList(data.media || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('category', 'general');

        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
      }
      fetchMedia();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('आपण ही फाईल खरोखर हटवू इच्छिता? / Delete this file?')) return;
    try {
      await fetch(`/api/media/${id}`, { method: 'DELETE' });
      fetchMedia();
    } catch (err) {
      console.error(err);
    }
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            मिडीया लायब्ररी (Media Library)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            संकेतस्थळावरील सर्व छायाचित्रे व प्रतिमांचे सुरक्षित व्यवस्थापन (JPG, PNG, WebP)
          </p>
        </div>

        <label className="px-4 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow border border-gold-400 flex items-center gap-1.5 cursor-pointer">
          <Upload className="w-4 h-4 text-gold-300" />
          <span>{uploading ? 'अपलोड होत आहे...' : 'मिडीया अपलोड करा (Upload)'}</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gold-300 shadow-sm flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="फाईल नाव शोधा..."
            className="w-full pl-9 pr-4 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
          />
        </div>
        <span className="text-xs text-charcoal-600 font-medium">
          एकूण फाईल्स: {mediaList.length}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-maroon-900 font-medium">
            लोड होत आहे...
          </div>
        ) : mediaList.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-gold-300 text-center text-charcoal-600 text-sm">
            कोणतीही फाईल सापडली नाही.
          </div>
        ) : (
          mediaList.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-gold-300 shadow-sm overflow-hidden flex flex-col justify-between group"
            >
              <div className="aspect-square bg-ivory-100 relative overflow-hidden flex items-center justify-center">
                <img
                  src={m.url}
                  alt={m.original_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-2.5 space-y-1">
                <p className="text-[11px] font-semibold text-maroon-950 truncate" title={m.original_name}>
                  {m.original_name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-charcoal-500">
                  <span>{(m.file_size / 1024).toFixed(0)} KB</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyUrl(m.id, m.url)}
                      title="URL कॉपी करा"
                      className="p-1 hover:text-maroon-900"
                    >
                      {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      title="हटवा"
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
