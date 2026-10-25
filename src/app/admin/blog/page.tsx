'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, PlusCircle, Edit2, Trash2, X, Calendar, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { TranslatePairInput, TranslatePairTextarea } from '@/components/admin/AutoTranslate';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title_mr: '',
    title_en: '',
    slug: '',
    category: 'धार्मिक माहिती',
    featured_image: '',
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
    setImageError(null);
    setForm({
      title_mr: '',
      title_en: '',
      slug: '',
      category: 'धार्मिक माहिती',
      featured_image: '',
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
    setImageError(null);
    setForm({
      title_mr: p.title_mr,
      title_en: p.title_en || '',
      slug: p.slug,
      category: p.category || 'धार्मिक माहिती',
      featured_image: p.featured_image || '',
      excerpt_mr: p.excerpt_mr || '',
      excerpt_en: p.excerpt_en || '',
      content_mr: p.content_mr || '',
      content_en: p.content_en || '',
      is_published: Boolean(p.is_published),
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setImageError('प्रतिमेचा आकार कमाल १० MB असावा. / Image must be under 10MB.');
      e.target.value = '';
      return;
    }

    setImageError(null);
    setUploadingImage(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'blog');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const uploadedUrl = data.url || data.fileUrl;
      if (res.ok && uploadedUrl) {
        setForm((prev) => ({ ...prev, featured_image: uploadedUrl }));
      } else {
        setImageError(data.error || 'फोटो अपलोड अयशस्वी.');
      }
    } catch {
      setImageError('सर्व्हरशी संपर्क साधताना त्रुटी.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
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
              <th className="py-3 px-4">फोटो</th>
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
              <tr><td colSpan={7} className="py-8 text-center text-maroon-900">लोड होत आहे...</td></tr>
            ) : posts.map((p) => (
              <tr key={p.id} className="hover:bg-gold-50/40">
                <td className="py-2 px-4">
                  {p.featured_image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.featured_image} alt="" className="w-10 h-8 rounded object-cover border border-gold-300" />
                  ) : (
                    <div className="w-10 h-8 rounded bg-ivory-100 border border-gold-200 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-gold-400" />
                    </div>
                  )}
                </td>
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
              <TranslatePairInput
                labelMr="मराठी शीर्षक *"
                labelEn="English Title *"
                valueMr={form.title_mr}
                valueEn={form.title_en}
                onChangeMr={(val) => setForm((prev) => ({ ...prev, title_mr: val }))}
                onChangeEn={(val) => setForm((prev) => ({ ...prev, title_en: val }))}
                placeholderMr="उदा. वास्तुशांतीचे महत्त्व व लाभ"
                placeholderEn="e.g. Importance & Benefits of Vastu Shanti"
                required
              />

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

              {/* Featured Image Upload & Preview */}
              <div className="bg-ivory-50 p-3 rounded-xl border border-gold-300 space-y-2">
                <label className="block text-xs font-semibold text-maroon-950">
                  मुख्य छायाचित्र (Featured Article Image)
                </label>
                <div className="flex items-center gap-3">
                  {form.featured_image ? (
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gold-400 shrink-0 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.featured_image} alt="Featured" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-lg border-2 border-dashed border-gold-300 flex flex-col items-center justify-center text-charcoal-400 shrink-0 bg-white">
                      <ImageIcon className="w-5 h-5 text-gold-500 mb-0.5" />
                      <span className="text-[9px]">फोटो नाही</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <label
                        className={`px-3 py-1.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                          uploadingImage ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {uploadingImage ? (
                          <Loader2 className="w-3.5 h-3.5 text-gold-300 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-gold-300" />
                        )}
                        <span>
                          {uploadingImage
                            ? 'अपलोड सुरू...'
                            : form.featured_image
                            ? 'फोटो बदला'
                            : 'फोटो जोडा (Upload)'}
                        </span>
                        <input
                          type="file"
                          disabled={uploadingImage}
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>

                      {form.featured_image && (
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, featured_image: '' }))}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium text-xs border border-red-200"
                        >
                          काढून टाका
                        </button>
                      )}
                    </div>

                    <p className="text-[10px] text-charcoal-500">
                      JPG, PNG किंवा WebP (कमाल १० MB)
                    </p>

                    {imageError && (
                      <p className="text-[10px] text-red-600 font-medium">{imageError}</p>
                    )}
                  </div>
                </div>
              </div>

              <TranslatePairTextarea
                labelMr="संक्षिप्त माहिती (Excerpt in Marathi)"
                labelEn="Article Summary (Excerpt in English)"
                valueMr={form.excerpt_mr}
                valueEn={form.excerpt_en}
                onChangeMr={(val) => setForm((prev) => ({ ...prev, excerpt_mr: val }))}
                onChangeEn={(val) => setForm((prev) => ({ ...prev, excerpt_en: val }))}
                rows={2}
                placeholderMr="लेखाचा २-३ ओळींत सारांश..."
                placeholderEn="Brief 2-3 line summary of the article..."
              />

              <TranslatePairTextarea
                labelMr="संपूर्ण लेख मजकूर (Full Content in Marathi) *"
                labelEn="Full Article Content (English) *"
                valueMr={form.content_mr}
                valueEn={form.content_en}
                onChangeMr={(val) => setForm((prev) => ({ ...prev, content_mr: val }))}
                onChangeEn={(val) => setForm((prev) => ({ ...prev, content_en: val }))}
                rows={6}
                required
                placeholderMr="सविस्तर लेख, शास्त्रीय संदर्भ व महत्त्व..."
                placeholderEn="Detailed article, scriptural references and significance..."
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
