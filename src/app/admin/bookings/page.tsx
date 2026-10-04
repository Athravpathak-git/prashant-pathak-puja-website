'use client';

import React, { useEffect, useState } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Clock,
  Phone,
  MapPin,
  Calendar,
  MessageSquare
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = '/api/bookings?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
      const res = await fetch(url);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchBookings();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev: any) => ({ ...prev, status }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveAdminNote = async () => {
    if (!selectedBooking) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedBooking.status,
          admin_notes: adminNote,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedBooking(data.booking);
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('आपण ही बुकिंग खरोखर हटवू इच्छिता? / Are you sure you want to delete this booking?')) {
      return;
    }
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedBooking?.id === id) setSelectedBooking(null);
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            पूजा बुकिंग व्यवस्थापन (Bookings Management)
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            यजमानांनी पाठवलेल्या सर्व विधी विनंत्यांची पडताळणी, स्थिती बदल व नोंद
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gold-300 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="संदर्भ क्र., यजमान नाव, मोबाईल किंवा पूजा नाव शोधा..."
              className="w-full pl-9 pr-4 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-maroon-800 text-gold-100 rounded-lg text-xs font-semibold shadow hover:bg-maroon-900"
          >
            शोधा
          </button>
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-maroon-800" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-maroon-800"
          >
            <option value="">सर्व स्थिती (All Statuses)</option>
            <option value="Pending">प्रलंबित (Pending)</option>
            <option value="Confirmed">निश्चित (Confirmed)</option>
            <option value="Completed">पूर्ण झाले (Completed)</option>
            <option value="Cancelled">रद्द (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Main Content: Table & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table Column */}
        <div className={`bg-white rounded-2xl border border-gold-300 shadow-sm overflow-hidden ${selectedBooking ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-charcoal-700 font-semibold border-b border-gold-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">संदर्भ क्र.</th>
                  <th className="py-3 px-4">यजमान नाव</th>
                  <th className="py-3 px-4">पूजा विधी</th>
                  <th className="py-3 px-4">तारीख व वेळ</th>
                  <th className="py-3 px-4">स्थिती</th>
                  <th className="py-3 px-4 text-right">कृती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-maroon-900">
                      लोड होत आहे...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-charcoal-500">
                      कोणत्याही बुकिंग्स सापडल्या नाहीत.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => {
                        setSelectedBooking(b);
                        setAdminNote(b.admin_notes || '');
                      }}
                      className={`cursor-pointer transition-colors ${
                        selectedBooking?.id === b.id
                          ? 'bg-gold-100/60 font-medium'
                          : 'hover:bg-gold-50/40'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-maroon-900">
                        {b.reference_no}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-charcoal-900">{b.full_name}</div>
                        <div className="text-[11px] text-charcoal-500">{b.mobile}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-charcoal-800">
                        {b.service_name}
                      </td>
                      <td className="py-3 px-4 text-charcoal-700">
                        <div>{new Date(b.preferred_date).toLocaleDateString('en-GB')}</div>
                        <div className="text-[10px] text-charcoal-500">{b.preferred_time}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'Confirmed'
                              ? 'bg-green-100 text-green-800'
                              : b.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : b.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => updateStatus(b.id, 'Confirmed')}
                            title="निश्चित करा (Confirm)"
                            className="p-1 rounded bg-green-50 text-green-700 hover:bg-green-100"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteBooking(b.id)}
                          title="हटवा (Delete)"
                          className="p-1 rounded bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Booking Detail Panel */}
        {selectedBooking && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gold-300 shadow-md p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gold-200 pb-3">
              <div>
                <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                  बुकिंग संदर्भ (Booking Reference)
                </span>
                <span className="font-mono font-bold text-lg text-maroon-900">
                  {selectedBooking.reference_no}
                </span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-charcoal-400 hover:text-charcoal-700 text-xs font-semibold px-2 py-1 rounded"
              >
                बंद करा
              </button>
            </div>

            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-maroon-950 block">स्थिती बदला (Change Status):</label>
              <div className="flex flex-wrap gap-2">
                {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateStatus(selectedBooking.id, st)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                      selectedBooking.status === st
                        ? 'bg-maroon-800 text-gold-100 shadow'
                        : 'bg-ivory-50 text-charcoal-700 border border-gold-300 hover:bg-gold-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Puja Info */}
            <div className="p-4 bg-ivory-50 rounded-xl border border-gold-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-charcoal-900 font-semibold text-sm">
                <span>{selectedBooking.full_name}</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal-700">
                <Phone className="w-3.5 h-3.5 text-saffron-600" />
                <span>{selectedBooking.mobile}</span>
                {selectedBooking.email && <span>• {selectedBooking.email}</span>}
              </div>
              <div className="flex items-center gap-2 text-charcoal-700">
                <Calendar className="w-3.5 h-3.5 text-maroon-800" />
                <span>तारीख: {new Date(selectedBooking.preferred_date).toLocaleDateString('en-GB')} ({selectedBooking.preferred_time})</span>
              </div>
              <div className="flex items-start gap-2 text-charcoal-700">
                <MapPin className="w-3.5 h-3.5 text-maroon-800 shrink-0 mt-0.5" />
                <span>
                  {selectedBooking.address}
                  {selectedBooking.area && `, ${selectedBooking.area}`}
                  {selectedBooking.city && `, ${selectedBooking.city}`}
                  {selectedBooking.pincode && ` - ${selectedBooking.pincode}`}
                </span>
              </div>
              {selectedBooking.message && (
                <div className="pt-2 border-t border-gold-200/60 text-charcoal-800 italic">
                  &ldquo;{selectedBooking.message}&rdquo;
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-maroon-950 block">
                प्रशासकीय नोंदी (Admin Private Notes):
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="यजमानांशी झालेली चर्चा, मुहूर्त वेळ, साहित्याची तयारी इत्यादी नोंदी येथे लिहा..."
                className="w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <button
                type="button"
                onClick={saveAdminNote}
                disabled={savingNote}
                className="px-4 py-1.5 bg-maroon-800 text-gold-100 rounded text-xs font-semibold shadow hover:bg-maroon-900"
              >
                {savingNote ? 'जतन करत आहे...' : 'नोंद सेव्ह करा (Save Notes)'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
