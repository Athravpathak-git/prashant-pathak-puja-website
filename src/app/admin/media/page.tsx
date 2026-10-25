'use client';

import React, { useEffect, useState } from 'react';
import {
  Upload,
  Trash2,
  Search,
  Copy,
  Check,
  Film,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Filter,
} from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryFilter && categoryFilter !== 'all') params.set('category', categoryFilter);

      const res = await fetch(`/api/media?${params.toString()}`);
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
  }, [search, categoryFilter]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setStatusMsg(null);
    setUploading(true);

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`अपलोड होत आहे (${i + 1}/${files.length}): ${file.name}`);

      // Client-side size validation
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm)$/i.test(file.name);
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

      if (file.size > maxSize) {
        failCount++;
        errors.push(`${file.name}: ${isVideo ? 'व्हिडीओ ५० MB' : 'प्रतिमा १० MB'} पेक्षा मोठी आहे.`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', isVideo ? 'videos' : 'general');

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
          errors.push(`${file.name}: ${data.error || 'अपलोड अयशस्वी'}`);
        }
      } catch (err) {
        failCount++;
        errors.push(`${file.name}: नेटवर्क त्रुटी`);
      }
    }

    setUploading(false);
    setUploadProgress(null);
    e.target.value = '';

    if (errors.length > 0) {
      setStatusMsg({
        type: 'error',
        text: `अपलोड निष्कर्ष: ${successCount} यशस्वी, ${failCount} त्रुटी. ${errors.slice(0, 2).join(' | ')}`,
      });
    } else {
      setStatusMsg({
        type: 'success',
        text: `${successCount} फाईल्स यशस्वीरित्या अपलोड झाल्या.`,
      });
    }

    fetchMedia();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('आपण ही फाईल खरोखर हटवू इच्छिता? / Delete this file?')) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'फाईल यशस्वीरित्या हटवली.' });
        fetchMedia();
      } else {
        const data = await res.json();
        setStatusMsg({ type: 'error', text: data.error || 'हटवताना त्रुटी आली.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'सर्व्हर त्रुटी.' });
    }
  };

  const copyUrl = (id: number, url: string) => {
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isVideoFile = (m: any) => {
    return (
      m.mime_type?.startsWith('video/') ||
      m.filename?.endsWith('.mp4') ||
      m.filename?.endsWith('.webm')
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            मिडीया लायब्ररी (Media Library)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            संकेतस्थळावरील सर्व छायाचित्रे (JPG, PNG, WebP) व व्हिडीओ (MP4, WebM) चे सुरक्षित व कायमस्वरूपी व्यवस्थापन
          </p>
        </div>

        <label
          className={`px-4 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow border border-gold-400 flex items-center gap-1.5 transition ${
            uploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 text-gold-300 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-gold-300" />
          )}
          <span>{uploading ? 'अपलोड सुरू आहे...' : 'फोटो / व्हिडीओ अपलोड करा'}</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm"
            disabled={uploading}
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Progress & Status Message */}
      {uploadProgress && (
        <div className="p-3 bg-amber-50 border border-gold-300 text-maroon-900 rounded-xl text-xs flex items-center gap-2 animate-pulse">
          <Loader2 className="w-4 h-4 text-saffron-600 animate-spin shrink-0" />
          <span>{uploadProgress}</span>
        </div>
      )}

      {statusMsg && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
            statusMsg.type === 'success'
              ? 'bg-green-50 border-green-300 text-green-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="text-xs underline hover:no-underline ml-2">
            बंद करा
          </button>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-gold-300 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="फाईल नाव किंवा मूळ नाव शोधा..."
            className="w-full pl-9 pr-4 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-gold-600" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-maroon-800"
          >
            <option value="all">सर्व वर्गवारी (All)</option>
            <option value="general">सामान्य (General)</option>
            <option value="services">पूजा सेवा (Services)</option>
            <option value="gallery">गॅलरी (Gallery)</option>
            <option value="guruji_profile">गुरुजी प्रोफाईल (Profile)</option>
            <option value="videos">व्हिडीओ (Videos)</option>
            <option value="logo">लोगो / चिन्ह (Logo)</option>
          </select>
          <span className="text-xs text-charcoal-600 font-medium whitespace-nowrap">
            एकूण: {mediaList.length}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-maroon-900 font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-saffron-600 animate-spin" />
            <span>मिडीया लोड होत आहे...</span>
          </div>
        ) : mediaList.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-gold-300 text-center text-charcoal-600 text-sm space-y-2">
            <p>कोणतीही फाईल सापडली नाही.</p>
            <p className="text-xs text-charcoal-400">वर दिलेल्या बटनावर क्लिक करून नवीन फोटो किंवा व्हिडीओ अपलोड करा.</p>
          </div>
        ) : (
          mediaList.map((m) => {
            const isVid = isVideoFile(m);
            return (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-gold-300 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-gold-500 transition-colors"
              >
                <div className="aspect-square bg-ivory-100 relative overflow-hidden flex items-center justify-center">
                  {isVid ? (
                    <video
                      src={m.url}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={m.url}
                      alt={m.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  )}

                  {/* Badge */}
                  <div className="absolute top-1.5 left-1.5 bg-black/70 text-gold-200 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                    {isVid ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                    <span>{isVid ? 'व्हिडीओ' : 'फोटो'}</span>
                  </div>

                  {m.storage_provider && (
                    <div className="absolute top-1.5 right-1.5 bg-maroon-900/80 text-gold-200 text-[9px] px-1.5 py-0.5 rounded font-mono">
                      {m.storage_provider === 'database' ? 'DB' : m.storage_provider}
                    </div>
                  )}
                </div>

                <div className="p-2.5 space-y-1">
                  <p className="text-[11px] font-semibold text-maroon-950 truncate" title={m.original_name}>
                    {m.original_name || m.filename}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-charcoal-500">
                    <span>
                      {m.file_size ? `${(m.file_size / 1024).toFixed(0)} KB` : ''}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyUrl(m.id, m.url)}
                        title="URL कॉपी करा"
                        className="p-1 hover:text-maroon-900 rounded hover:bg-gold-100 transition"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        title="हटवा"
                        className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
