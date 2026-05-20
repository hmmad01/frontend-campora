/**
 * @file ReviewManagement.tsx
 * @description Halaman admin untuk mengelola review/testimoni pelanggan.
 *              CRUD lengkap terhubung ke backend Laravel via API.
 */

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, X, Save, Star, MessageSquare } from "lucide-react";
import { testimoniApi, type TestimoniItem } from "../../api";
import { useToast, ToastContainer } from "../../components/Toast";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<TestimoniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nama_customer: "", rating: 5, isi_review: "" });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchReviews = async () => {
    try {
      const res = await testimoniApi.getAll();
      setReviews(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const resetForm = () => {
    setFormData({ nama_customer: "", rating: 5, isi_review: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (r: TestimoniItem) => {
    setFormData({ nama_customer: r.nama_customer, rating: r.rating, isi_review: r.isi_review });
    setEditingId(r.id_testimoni);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.nama_customer.trim() || !formData.isi_review.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await testimoniApi.update(editingId, formData);
        toast.success("Review berhasil diperbarui!");
      } else {
        await testimoniApi.create(formData);
        toast.success("Review berhasil ditambahkan!");
      }
      resetForm();
      await fetchReviews();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan review");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus review ini?")) return;
    try {
      await testimoniApi.delete(id);
      toast.success("Review berhasil dihapus!");
      await fetchReviews();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus review");
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
      ))}
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#2F855A]" size={40} /></div>;
  if (error) return <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl"><AlertCircle size={20} /><span>{error}</span></div>;

  return (
    <div className="h-full flex flex-col">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Kelola Review</h3>
          <p className="text-sm text-gray-400 mt-0.5">Kelola testimoni dan ulasan pelanggan</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#2F855A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#276749] transition-colors">
          <Plus size={18} /> Tambah Review
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-800">{editingId ? "Edit Review" : "Tambah Review Baru"}</h4>
            <button onClick={resetForm} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">NAMA CUSTOMER</label>
                <input value={formData.nama_customer} onChange={(e) => setFormData({ ...formData, nama_customer: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2F855A]" placeholder="Nama pelanggan..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">RATING</label>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setFormData({ ...formData, rating: i + 1 })}>
                      <Star size={24} className={i < formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">ISI REVIEW</label>
              <textarea value={formData.isi_review} onChange={(e) => setFormData({ ...formData, isi_review: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2F855A] resize-none" placeholder="Isi ulasan pelanggan..." />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
              <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 bg-[#2F855A] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#276749] disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editingId ? "Simpan Perubahan" : "Tambah Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
            <p>Belum ada review. Klik "Tambah Review" untuk memulai.</p>
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id_testimoni} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-medium text-gray-900">{r.nama_customer}</p>
                    {renderStars(r.rating)}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">"{r.isi_review}"</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleEdit(r)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Pencil size={16} className="text-gray-400" /></button>
                  <button onClick={() => handleDelete(r.id_testimoni)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} className="text-red-400" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
