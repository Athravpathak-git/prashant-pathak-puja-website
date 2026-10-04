'use client';

import React, { useEffect, useState } from 'react';
import { ImageCropModal } from '@/components/ImageCropModal';
import {
  Image as ImageIcon,
  UploadCloud,
  PlusCircle,
  Crop,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Loader2,
  Tag
} from 'lucide-react';

interface GalleryItem {
  id: number;
  title_mr: string;
  title_en: string;
  category: string;
  image_url: string;
  is_featured: boolean;
  is_hidden: boolean;
  sort_order: number;
  created_at: string;
}

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Crop / Edit Modal
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImgSrc, setTempImgSrc] = useState('');

  // Metadata Edit Modal
  const [metaModalOpen, setMetaModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [metaForm, setMetaForm] = useState({
    title_mr: 'पवित्र पूजा विधी',
    title_en: 'Sacred Vedic Ritual',
    category: 'पूजा',
    is_featured: false,
    is_hidden: false,
    sort_order: 0,
    image_url: '',
  });

  const categories = [
    'पूजा',
    'धार्मिक विधी',
    'विवाह',
    'उपनयन संस्कार',
    'वास्तुशांती',
    'अभिषेक',
    'नवचंडी',
    'मूर्ती प्राणप्रतिष्ठा',
    'इतर',
  ];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery?all=true');
      if (res.ok) {
        const data = await res.json();
        setGallery(data.gallery || []);
      }
    } catch (err) {
      console.error('Failed to fetch gallery', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // 1. User selects a local image file
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size client-side (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setStatusMsg({ type: 'error', text: 'फाईल आकार १० MB पेक्षा कमी असावा. / File too large (max 10MB).' });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImgSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 2. User saves cropped/rotated image in crop modal -> uploads to server & prompts details
  const handleCroppedSave = async (blob: Blob, filename: string) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', blob, filename);
      formData.append('category', 'gallery');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'फोटो अपलोड अयशस्वी.');
      }

      setCropModalOpen(false);

      // Open metadata modal with the newly uploaded image
      setEditingItem(null);
      setMetaForm({
        title_mr: 'पवित्र पूजा विधी',
        title_en: 'Sacred Vedic Ritual',
        category: 'पूजा',
        is_featured: false,
        is_hidden: false,
        sort_order: gallery.length + 1,
        image_url: uploadData.url,
      });
      setMetaModalOpen(true);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'फोटो अपलोड करताना त्रुटी आली.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Save or Update metadata in gallery DB table
  const saveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const url = editingItem ? `/api/gallery/${editingItem.id}` : '/api/gallery';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metaForm),
      });

      const resData = await res.json();
      if (res.ok) {
        setMetaModalOpen(false);
        setStatusMsg({
          type: 'success',
          text: editingItem
            ? 'फोटो माहिती अद्यतनित केली. (Photo updated)'
            : 'नवीन फोटो गॅलरीमध्ये यशस्वीरित्या जोडला गेला! (Photo published to gallery)',
        });
        fetchGallery();
      } else {
        setStatusMsg({ type: 'error', text: resData.error || 'माहिती जतन करताना त्रुटी आली.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'सर्व्हरशी संपर्क साधता आला नाही.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick Toggle Featured (Homepage)
  const toggleFeatured = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, is_featured: !item.is_featured }),
      });
      if (res.ok) {
        setGallery((prev) =>
          prev.map((g) => (g.id === item.id ? { ...g, is_featured: !g.is_featured } : g))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Toggle Hidden (Visible / Hidden)
  const toggleHidden = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, is_hidden: !item.is_hidden }),
      });
      if (res.ok) {
        setGallery((prev) =>
          prev.map((g) => (g.id === item.id ? { ...g, is_hidden: !g.is_hidden } : g))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Photo
  const handleDelete = async (id: number) => {
    if (!confirm('आपण हा फोटो खरोखर गॅलरीतून हटवू इच्छिता? / Delete this photo?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGallery((prev) => prev.filter((g) => g.id !== id));
        setStatusMsg({ type: 'success', text: 'फोटो गॅलरीतून हटवला गेला.' });
      } else {
        setStatusMsg({ type: 'error', text: 'हटवताना त्रुटी आली.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'सर्व्हर त्रुटी.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gold-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-saffron-50 border border-saffron-200 flex items-center justify-center text-saffron-600 shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-maroon-950">
              छायाचित्र दालन व्यवस्थापन (Gallery Management)
            </h1>
            <p className="text-xs text-charcoal-600">
              नवीन फोटो निवडा, क्रॉप व रोटेट करा, शीर्षके द्या आणि सार्वजनिक दालनात प्रदर्शित करा
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={fetchGallery}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gold-300 hover:bg-gold-50 text-charcoal-700 transition flex items-center gap-1.5 text-xs font-semibold"
            title="पुन्हा लोड करा"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            रिफ्रेश
          </button>

          {/* Prominent Upload Button */}
          <label className="px-5 py-2.5 bg-gradient-to-r from-saffron-600 to-maroon-800 hover:from-saffron-700 hover:to-maroon-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md border border-gold-400 flex items-center gap-2 cursor-pointer transition transform active:scale-95 shrink-0">
            <PlusCircle className="w-4 h-4 text-gold-200" />
            <span>+ नवीन फोटो जोडा (Upload Photo)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      </div>

      {/* Status Messages */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between gap-3 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-maroon-900 font-medium font-serif">
            छायाचित्रे लोड होत आहेत...
          </div>
        ) : gallery.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border-2 border-dashed border-gold-300 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-saffron-50 border border-saffron-200 flex items-center justify-center mx-auto text-saffron-600">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-maroon-950">
                दालनात अद्याप कोणतेही छायाचित्र नाही
              </h3>
              <p className="text-xs text-charcoal-600 max-w-md mx-auto">
                धार्मिक विधी, होम-हवन, प्रतिष्ठापना व इतर प्रसंगांची छायाचित्रे अपलोड करा.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition">
              <PlusCircle className="w-4 h-4" />
              <span>पहिला फोटो अपलोड करा (Upload First Photo)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        ) : (
          gallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gold-300/80 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
            >
              {/* Photo Image with Overlay Badges */}
              <div className="aspect-square bg-ivory-100 relative overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title_mr || 'Gallery Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {item.is_featured && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      मुख्यपृष्ठ
                    </span>
                  )}
                  {item.is_hidden && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white shadow-sm flex items-center gap-1">
                      <EyeOff className="w-2.5 h-2.5" />
                      लपवले
                    </span>
                  )}
                </div>

                {/* Quick Action Overlay Buttons */}
                <div className="absolute top-2 right-2 flex gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(item)}
                    className={`p-1.5 rounded-lg transition ${
                      item.is_featured ? 'text-amber-400 bg-black/40' : 'text-white/80 hover:text-white'
                    }`}
                    title={item.is_featured ? 'मुख्यपृष्ठावरून काढा' : 'मुख्यपृष्ठावर दाखवा (Featured)'}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleHidden(item)}
                    className={`p-1.5 rounded-lg transition ${
                      item.is_hidden ? 'text-red-400 bg-black/40' : 'text-white/80 hover:text-white'
                    }`}
                    title={item.is_hidden ? 'सार्वजनिक करा (Show)' : 'लपवा (Hide)'}
                  >
                    {item.is_hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Title & Info */}
              <div className="p-3.5 space-y-2 bg-white">
                <div>
                  <h4 className="font-serif font-bold text-xs text-maroon-950 truncate">
                    {item.title_mr || 'शीर्षक नाही'}
                  </h4>
                  <p className="text-[11px] text-charcoal-500 truncate">
                    {item.title_en || 'Sacred Ritual'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gold-100 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-gold-100 text-maroon-900 font-semibold text-[10px] border border-gold-300">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setMetaForm({
                          title_mr: item.title_mr || '',
                          title_en: item.title_en || '',
                          category: item.category || 'पूजा',
                          is_featured: Boolean(item.is_featured),
                          is_hidden: Boolean(item.is_hidden),
                          sort_order: Number(item.sort_order || 0),
                          image_url: item.image_url,
                        });
                        setMetaModalOpen(true);
                      }}
                      className="p-1 text-charcoal-600 hover:text-maroon-800 transition"
                      title="माहिती संपादन करा (Edit Info)"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition"
                      title="हटवा (Delete)"
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

      {/* 1. Responsive Crop & Rotate Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={tempImgSrc}
        onClose={() => setCropModalOpen(false)}
        onSave={handleCroppedSave}
        aspectRatio={1}
        title="फोटो क्रॉप व संपादन (Crop & Rotate)"
        isSaving={isProcessing}
      />

      {/* 2. Responsive Metadata Details Modal */}
      {metaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border-2 border-gold-400 shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col my-auto overflow-hidden">
            {/* Modal Header */}
            <div className="bg-maroon-900 text-gold-100 px-5 py-3.5 flex items-center justify-between border-b border-gold-500/40 shrink-0">
              <h3 className="font-serif font-bold text-sm sm:text-base">
                {editingItem ? 'छायाचित्र संपादन (Edit Details)' : 'छायाचित्र माहिती (Photo Details)'}
              </h3>
              <button
                type="button"
                onClick={() => setMetaModalOpen(false)}
                className="text-gold-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={saveMetadata} className="overflow-y-auto flex-1 p-5 space-y-4 text-xs sm:text-sm">
              {/* Photo Preview Thumbnail */}
              {metaForm.image_url && (
                <div className="flex items-center gap-3.5 p-3 bg-ivory-100 rounded-xl border border-gold-200">
                  <img
                    src={metaForm.image_url}
                    alt="Uploaded preview"
                    className="w-16 h-16 object-cover rounded-lg border border-gold-300 shrink-0 shadow-xs"
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-maroon-950 font-serif">फोटो यशस्वीरित्या तयार झाला</p>
                    <p className="text-[11px] text-charcoal-600">खालील माहिती भरून गॅलरीमध्ये जतन करा.</p>
                  </div>
                </div>
              )}

              {/* Title Marathi */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  मराठी शीर्षक *
                </label>
                <input
                  type="text"
                  required
                  value={metaForm.title_mr}
                  onChange={(e) => setMetaForm({ ...metaForm, title_mr: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  placeholder="उदा. श्री सत्यनारायण महापूजा"
                />
              </div>

              {/* Title English */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  English Title *
                </label>
                <input
                  type="text"
                  required
                  value={metaForm.title_en}
                  onChange={(e) => setMetaForm({ ...metaForm, title_en: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  placeholder="e.g. Shri Satyanarayan Mahapuja"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  वर्गवारी (Category) *
                </label>
                <select
                  value={metaForm.category}
                  onChange={(e) => setMetaForm({ ...metaForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visibility Options */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gold-100">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gold-200 bg-ivory-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={metaForm.is_featured}
                    onChange={(e) => setMetaForm({ ...metaForm, is_featured: e.target.checked })}
                    className="accent-maroon-800 w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-charcoal-800">
                    मुख्यपृष्ठावर दाखवा (Featured)
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gold-200 bg-ivory-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={metaForm.is_hidden}
                    onChange={(e) => setMetaForm({ ...metaForm, is_hidden: e.target.checked })}
                    className="accent-maroon-800 w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-charcoal-800">
                    लपवा (Hidden)
                  </span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-gold-200 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setMetaModalOpen(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 border border-gold-300 rounded-xl text-xs font-semibold hover:bg-ivory-50"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 border border-gold-500/40 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>जतन करत आहे...</span>
                    </>
                  ) : (
                    <span>दालनात जतन करा (Save to Gallery)</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
