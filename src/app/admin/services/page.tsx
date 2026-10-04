'use client';

import React, { useEffect, useState } from 'react';
import {
  Flame,
  PlusCircle,
  Edit2,
  Trash2,
  Copy,
  Star,
  CheckCircle,
  XCircle,
  Search,
  Save,
  X,
  Clock,
  Upload
} from 'lucide-react';
import { ImageCropModal } from '@/components/ImageCropModal';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name_mr: '',
    name_en: '',
    slug: '',
    category_id: '',
    short_desc_mr: '',
    short_desc_en: '',
    detailed_desc_mr: '',
    detailed_desc_en: '',
    duration: '',
    price: '',
    price_label_mr: 'शुल्कासाठी संपर्क करा',
    price_label_en: 'Contact for Dakshina / Fee',
    materials_mr: '',
    materials_en: '',
    procedure_mr: '',
    procedure_en: '',
    image_url: '',
    is_featured: false,
    is_active: true,
    enable_booking: true,
    sort_order: 0,
  });

  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImgSrc, setTempImgSrc] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        fetch('/api/services?all=true'),
        fetch('/api/categories'),
      ]);
      const sData = await sRes.json();
      const cData = await cRes.json();
      setServices(sData.services || []);
      setCategories(cData.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name_mr: '',
      name_en: '',
      slug: '',
      category_id: categories[0]?.id ? String(categories[0].id) : '',
      short_desc_mr: '',
      short_desc_en: '',
      detailed_desc_mr: '',
      detailed_desc_en: '',
      duration: '',
      price: '',
      price_label_mr: 'शुल्कासाठी संपर्क करा',
      price_label_en: 'Contact for Dakshina / Fee',
      materials_mr: '',
      materials_en: '',
      procedure_mr: '',
      procedure_en: '',
      image_url: '',
      is_featured: false,
      is_active: true,
      enable_booking: true,
      sort_order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: any) => {
    setEditingId(service.id);
    setForm({
      name_mr: service.name_mr || '',
      name_en: service.name_en || '',
      slug: service.slug || '',
      category_id: service.category_id ? String(service.category_id) : '',
      short_desc_mr: service.short_desc_mr || '',
      short_desc_en: service.short_desc_en || '',
      detailed_desc_mr: service.detailed_desc_mr || '',
      detailed_desc_en: service.detailed_desc_en || '',
      duration: service.duration || '',
      price: service.price ? String(service.price) : '',
      price_label_mr: service.price_label_mr || 'शुल्कासाठी संपर्क करा',
      price_label_en: service.price_label_en || 'Contact for Dakshina / Fee',
      materials_mr: service.materials_mr || '',
      materials_en: service.materials_en || '',
      procedure_mr: service.procedure_mr || '',
      procedure_en: service.procedure_en || '',
      image_url: service.image_url || '',
      is_featured: Boolean(service.is_featured),
      is_active: Boolean(service.is_active),
      enable_booking: Boolean(service.enable_booking),
      sort_order: Number(service.sort_order || 0),
    });
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/services/${editingId}` : '/api/services';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        const d = await res.json();
        alert(d.error || 'त्रुटी आली.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('आपण ही पूजा विधी सेवा खरोखर हटवू इच्छिता? / Delete this puja service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (service: any) => {
    try {
      const clone = {
        ...service,
        name_mr: `${service.name_mr} (प्रत)`,
        name_en: `${service.name_en} (Copy)`,
        slug: `${service.slug}-copy-${Date.now()}`,
      };
      delete clone.id;
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clone),
      });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeatured = async (service: any) => {
    try {
      await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, is_featured: !service.is_featured }),
      });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (service: any) => {
    try {
      await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, is_active: !service.is_active }),
      });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempImgSrc(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCroppedSave = async (blob: Blob, filename: string) => {
    const formData = new FormData();
    formData.append('file', blob, filename);
    formData.append('category', 'services');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, image_url: data.url }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = services.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      s.name_mr.toLowerCase().includes(term) ||
      s.name_en.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            पूजा व धार्मिक विधी व्यवस्थापन (Puja & Services CMS)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            कोणतीही नवीन पूजा जोडा, माहिती अद्यतनित करा, फोटो संपादित करा — कोडिंगशिवाय थेट व्यवस्थापन
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold rounded-lg shadow border border-gold-400 flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-gold-300" />
          <span>नवीन पूजा जोडा (Add New Puja)</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gold-300 shadow-sm flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="पूजा शोधा (Search by name)..."
            className="w-full pl-9 pr-4 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
          />
        </div>
        <span className="text-xs text-charcoal-600 font-medium">
          एकूण पूजा: {filtered.length}
        </span>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-gold-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-50 text-charcoal-700 font-semibold border-b border-gold-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">पूजा नाव (मराठी)</th>
                <th className="py-3 px-4">Name (English)</th>
                <th className="py-3 px-4">वर्गवारी (Category)</th>
                <th className="py-3 px-4">कालावधी (Duration)</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">स्थिती (Status)</th>
                <th className="py-3 px-4 text-right">कृती (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-maroon-900 font-medium">
                    लोड होत आहे...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-500">
                    कोणतीही पूजा सापडली नाही.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gold-50/40 transition-colors">
                    <td className="py-3 px-4 font-serif font-bold text-maroon-950 text-sm">
                      {s.name_mr}
                    </td>
                    <td className="py-3 px-4 font-medium text-charcoal-800">{s.name_en}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-gold-100 text-maroon-900 font-medium text-[11px] border border-gold-300">
                        {s.category_name_mr || 'धार्मिक विधी'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-charcoal-600">{s.duration || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(s)}
                        className={`p-1 rounded transition-colors ${
                          s.is_featured ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleActive(s)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {s.is_active ? 'सक्रिय (Active)' : 'अक्रिय (Inactive)'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(s)}
                        title="संपादित करा (Edit)"
                        className="p-1 rounded bg-gold-50 text-maroon-800 hover:bg-gold-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(s)}
                        title="प्रत बनवा (Duplicate)"
                        className="p-1 rounded bg-blue-50 text-blue-800 hover:bg-blue-100"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        title="हटवा (Delete)"
                        className="p-1 rounded bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border-2 border-gold-400 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-8">
            <div className="bg-maroon-950 text-gold-100 px-6 py-4 flex items-center justify-between border-b border-gold-500/40">
              <h2 className="font-serif font-bold text-lg">
                {editingId ? 'पूजा विधी संपादित करा (Edit Puja)' : 'नवीन पूजा विधी जोडा (Add New Puja)'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gold-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-maroon-950 mb-1">
                    पूजा नाव (मराठी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name_mr}
                    onChange={(e) => setForm({ ...form, name_mr: e.target.value })}
                    placeholder="उदा. वास्तुशांती"
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-950 mb-1">
                    Puja Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name_en}
                    onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                    placeholder="e.g. Vastu Shanti Puja"
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-950 mb-1">
                    वर्गवारी (Category) *
                  </label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_mr} ({c.name_en})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-950 mb-1">
                    कालावधी (Duration)
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="उदा. ३ ते ४ तास"
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-maroon-950 mb-1">
                    संक्षिप्त वर्णन (मराठी)
                  </label>
                  <textarea
                    rows={2}
                    value={form.short_desc_mr}
                    onChange={(e) => setForm({ ...form, short_desc_mr: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-950 mb-1">
                    Short Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={form.short_desc_en}
                    onChange={(e) => setForm({ ...form, short_desc_en: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-maroon-950 mb-1">
                    सविस्तर वर्णन व महत्त्व (मराठी)
                  </label>
                  <textarea
                    rows={3}
                    value={form.detailed_desc_mr}
                    onChange={(e) => setForm({ ...form, detailed_desc_mr: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-950 mb-1">
                    Detailed Significance (English)
                  </label>
                  <textarea
                    rows={3}
                    value={form.detailed_desc_en}
                    onChange={(e) => setForm({ ...form, detailed_desc_en: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>

              {/* Materials & Procedure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-maroon-950 mb-1">
                    साहित्य यादी (Materials in Marathi)
                  </label>
                  <textarea
                    rows={2}
                    value={form.materials_mr}
                    onChange={(e) => setForm({ ...form, materials_mr: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-950 mb-1">
                    विधी प्रक्रिया (Procedure in Marathi)
                  </label>
                  <textarea
                    rows={2}
                    value={form.procedure_mr}
                    onChange={(e) => setForm({ ...form, procedure_mr: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2 border-t border-gold-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-maroon-950">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="rounded accent-maroon-800"
                  />
                  <span>मुख्यपृष्ठावर दर्शवा (Featured on Home)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-maroon-950">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="rounded accent-maroon-800"
                  />
                  <span>सक्रिय (Active / Published)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-maroon-950">
                  <input
                    type="checkbox"
                    checked={form.enable_booking}
                    onChange={(e) => setForm({ ...form, enable_booking: e.target.checked })}
                    className="rounded accent-maroon-800"
                  />
                  <span>बुकिंग उपलब्ध ठेवा (Enable Booking)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gold-300 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-charcoal-300 rounded-lg text-xs font-medium"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-maroon-800 hover:bg-maroon-900 text-gold-100 rounded-lg text-xs font-semibold shadow"
                >
                  {editingId ? 'बदल जतन करा' : 'नवीन पूजा जोडा'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
