'use client';

import React, { useEffect, useState } from 'react';
import { Film, PlusCircle, Edit2, Trash2, X, Play, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { TranslatePairInput, TranslatePairTextarea } from '@/components/admin/AutoTranslate';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
    setUploadError(null);
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
    setUploadError(null);
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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('व्हिडीओ आकार कमाल ५० MB असावा. / Video must be under 50MB.');
      e.target.value = '';
      return;
    }

    setUploadError(null);
    setUploadingVideo(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'videos');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const uploadedUrl = data.url || data.fileUrl;
      if (res.ok && uploadedUrl) {
        setForm((prev) => ({ ...prev, youtube_url: uploadedUrl }));
      } else {
        setUploadError(data.error || 'व्हिडीओ अपलोड अयशस्वी.');
      }
    } catch {
      setUploadError('सर्व्हरशी संपर्क साधताना त्रुटी.');
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('थंबनेल प्रतिमेचा आकार कमाल १० MB असावा. / Thumbnail must be under 10MB.');
      e.target.value = '';
      return;
    }

    setUploadError(null);
    setUploadingThumb(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'video_thumbnail');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const uploadedUrl = data.url || data.fileUrl;
      if (res.ok && uploadedUrl) {
        setForm((prev) => ({ ...prev, thumbnail_url: uploadedUrl }));
      } else {
        setUploadError(data.error || 'थंबनेल अपलोड अयशस्वी.');
      }
    } catch {
      setUploadError('सर्व्हरशी संपर्क साधताना त्रुटी.');
    } finally {
      setUploadingThumb(false);
      e.target.value = '';
    }
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
      } else {
        const data = await res.json();
        setUploadError(data.error || 'माहिती जतन करताना त्रुटी.');
      }
    } catch (err) {
      console.error(err);
      setUploadError('सर्व्हरशी संपर्क साधताना त्रुटी.');
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

  const isUploadedVideo = (url: string) => {
    return (
      url.startsWith('/api/uploads/') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.includes('res.cloudinary.com') ||
      url.includes('vercel-storage.com')
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            व्हिडीओ व्यवस्थापन (Videos Management)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            YouTube व्हिडीओ दुवे किंवा थेट MP4/WebM व्हिडीओ फाईल्स अपलोड करा व व्यवस्थापित करा
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
          videos.map((vid) => {
            const isLocal = isUploadedVideo(vid.youtube_url);
            return (
              <div
                key={vid.id}
                className="bg-white rounded-xl border border-gold-300 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="aspect-video bg-black/90 relative overflow-hidden flex items-center justify-center">
                  {isLocal ? (
                    <video
                      src={vid.youtube_url}
                      poster={vid.thumbnail_url || undefined}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : vid.thumbnail_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gold-400">
                      <Play className="w-10 h-10 mb-1" />
                      <span className="text-[10px] text-gold-200">YouTube Video</span>
                    </div>
                  )}

                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                      vid.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {vid.is_published ? 'प्रकाशित' : 'लपवलेला'}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-maroon-950 truncate" title={vid.title_mr}>
                      {vid.title_mr}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-600 truncate font-mono">{vid.youtube_url}</p>
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
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border-2 border-gold-400 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-gold-200 pb-2">
              <h3 className="font-serif font-bold text-base text-maroon-950">
                {editingId ? 'व्हिडीओ संपादित करा' : 'नवीन व्हिडीओ जोडा'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <TranslatePairInput
                labelMr="व्हिडिओ शीर्षक (मराठी) *"
                labelEn="Video Title (English) *"
                valueMr={form.title_mr}
                valueEn={form.title_en}
                onChangeMr={(val) => setForm((prev) => ({ ...prev, title_mr: val }))}
                onChangeEn={(val) => setForm((prev) => ({ ...prev, title_en: val }))}
                placeholderMr="उदा. श्री रुद्र अभिषेक विधी"
                placeholderEn="e.g. Shri Rudra Abhishek Ritual"
                required
              />

              {/* Video URL or Direct Video Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-maroon-950">
                  व्हिडीओ लिंक किंवा फाईल (YouTube URL or Upload MP4/WebM) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.youtube_url}
                    onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... किंवा फाईल अपलोड करा"
                    className="flex-1 px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none"
                  />
                  <label
                    className={`cursor-pointer px-3 py-2 rounded-lg bg-gold-100 hover:bg-gold-200 text-maroon-950 text-xs font-semibold flex items-center gap-1 transition shrink-0 ${
                      uploadingVideo ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingVideo ? (
                      <Loader2 className="w-3.5 h-3.5 text-maroon-900 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-maroon-900" />
                    )}
                    <span>{uploadingVideo ? 'अपलोड...' : 'फाईल निवडा'}</span>
                    <input
                      type="file"
                      disabled={uploadingVideo}
                      accept="video/mp4,video/webm"
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-charcoal-500">
                  YouTube दुवा प्रविष्ट करा किंवा थेट MP4 / WebM व्हिडीओ फाईल (कमाल ५० MB) अपलोड करा.
                </p>
              </div>

              {/* Thumbnail Image Upload */}
              <div className="bg-ivory-50 p-3 rounded-xl border border-gold-300 space-y-2">
                <label className="block text-xs font-semibold text-maroon-950">
                  थंबनेल प्रतिमा (Custom Video Thumbnail)
                </label>
                <div className="flex items-center gap-3">
                  {form.thumbnail_url ? (
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gold-400 shrink-0 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-lg border-2 border-dashed border-gold-300 flex flex-col items-center justify-center text-charcoal-400 shrink-0 bg-white">
                      <ImageIcon className="w-5 h-5 text-gold-500 mb-0.5" />
                      <span className="text-[9px]">थंबनेल नाही</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <label
                        className={`px-3 py-1.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                          uploadingThumb ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {uploadingThumb ? (
                          <Loader2 className="w-3.5 h-3.5 text-gold-300 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-gold-300" />
                        )}
                        <span>{uploadingThumb ? 'अपलोड सुरू...' : form.thumbnail_url ? 'थंबनेल बदला' : 'थंबनेल जोडा'}</span>
                        <input
                          type="file"
                          disabled={uploadingThumb}
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handleThumbUpload}
                        />
                      </label>

                      {form.thumbnail_url && (
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, thumbnail_url: '' }))}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium text-xs border border-red-200"
                        >
                          काढून टाका
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-charcoal-500">JPG, PNG किंवा WebP (कमाल १० MB)</p>
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs">
                  {uploadError}
                </div>
              )}

              <TranslatePairTextarea
                labelMr="वर्णन (मराठी)"
                labelEn="Video Description (English)"
                valueMr={form.description_mr}
                valueEn={form.description_en}
                onChangeMr={(val) => setForm((prev) => ({ ...prev, description_mr: val }))}
                onChangeEn={(val) => setForm((prev) => ({ ...prev, description_en: val }))}
                rows={3}
                placeholderMr="व्हिडिओबद्दल माहिती, विधी महत्त्व..."
                placeholderEn="Information about the video, ritual significance..."
              />

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
                  disabled={uploadingVideo || uploadingThumb}
                  className="px-5 py-2 bg-maroon-800 disabled:opacity-50 text-gold-100 rounded-lg text-xs font-semibold"
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
