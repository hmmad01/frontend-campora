/**
 * @file ReviewManagement.tsx
 * @description Halaman admin untuk mengelola review/testimoni pelanggan.
 *              CRUD + Approve/Unapprove terhubung ke backend Laravel via API.
 *              Admin bisa menyortir review yang ditampilkan di frontend customer
 *              dengan meng-approve / unapprove setiap testimoni.
 */

import { useState, useEffect, useRef } from "react";
import {
  Plus, Pencil, Trash2, Loader2, AlertCircle, X, Save,
  Star, MessageSquare, CheckCircle, XCircle, Eye, EyeOff,
  Filter, ImagePlus, Trash
} from "lucide-react";
import { testimoniApi, type TestimoniItem } from "../../api";
import { useToast, ToastContainer } from "../../components/Toast";

type FilterType = "all" | "approved" | "pending";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<TestimoniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nama_customer: "",
    rating: 0,
    isi_review: "",
    produk_disewa: "",
    kegiatan: "",
    is_approved: false,
  });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [removeFoto, setRemoveFoto] = useState(false);
  const [existingFoto, setExistingFoto] = useState<string | null>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const fetchReviews = async () => {
    try {
      const res = await testimoniApi.adminGetAll();
      const sortedData = res.data.sort((a: TestimoniItem, b: TestimoniItem) => b.id_testimoni - a.id_testimoni);
      setReviews(sortedData);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const resetForm = () => {
    setFormData({ nama_customer: "", rating: 0, isi_review: "", produk_disewa: "", kegiatan: "", is_approved: false });
    setFotoFile(null);
    setFotoPreview("");
    setRemoveFoto(false);
    setExistingFoto(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (r: TestimoniItem) => {
    setFormData({
      nama_customer: r.nama_customer,
      rating: r.rating,
      isi_review: r.isi_review,
      produk_disewa: r.produk_disewa ?? "",
      kegiatan: r.kegiatan ?? "",
      is_approved: r.is_approved,
    });
    setExistingFoto(r.foto_customer);
    setFotoFile(null);
    setFotoPreview("");
    setRemoveFoto(false);
    setEditingId(r.id_testimoni);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.nama_customer.trim() || !formData.isi_review.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await testimoniApi.updateWithFoto(editingId, {
          ...formData,
          foto: fotoFile,
          remove_foto: removeFoto,
        });
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

  const handleToggleApprove = async (r: TestimoniItem) => {
    setTogglingId(r.id_testimoni);
    try {
      if (r.is_approved) {
        await testimoniApi.unapprove(r.id_testimoni);
        toast.success("Review disembunyikan dari frontend.");
      } else {
        await testimoniApi.approve(r.id_testimoni);
        toast.success("Review sekarang tampil di frontend!");
      }
      await fetchReviews();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status review");
    } finally {
      setTogglingId(null);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
      ))}
    </div>
  );

  const filteredReviews = reviews.filter((r) => {
    if (filter === "approved") return r.is_approved;
    if (filter === "pending") return !r.is_approved;
    return true;
  });

  const approvedCount = reviews.filter((r) => r.is_approved).length;
  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#2F855A]" size={40} /></div>;
  if (error) return <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl"><AlertCircle size={20} /><span>{error}</span></div>;

  return (
    <div className="h-full flex flex-col">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Kelola Review</h3>
          <p className="text-sm text-gray-400 mt-0.5">Moderasi & atur review yang tampil di halaman customer</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#2F855A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#276749] transition-colors"
        >
          <Plus size={18} /> Tambah Review
        </button>
      </div>

      {/* Stats + Filter bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1 text-xs text-gray-500 mr-1">
          <Filter size={13} /> Filter:
        </div>
        {(["all", "approved", "pending"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${filter === f
                ? f === "approved"
                  ? "bg-green-50 border-green-300 text-green-700"
                  : f === "pending"
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "bg-gray-900 border-gray-900 text-white"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
          >
            {f === "all" && `Semua (${reviews.length})`}
            {f === "approved" && (
              <span className="flex items-center gap-1">
                <Eye size={11} /> Tampil di Frontend ({approvedCount})
              </span>
            )}
            {f === "pending" && (
              <span className="flex items-center gap-1">
                <EyeOff size={11} /> Pending ({pendingCount})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-800">
              {editingId ? "Edit Review" : "Tambah Review Baru"}
            </h4>
            <button onClick={resetForm} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X size={18} className="text-gray-400" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">NAMA CUSTOMER</label>
                <input
                  value={formData.nama_customer}
                  onChange={(e) => setFormData({ ...formData, nama_customer: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2F855A]"
                  placeholder="Nama pelanggan..."
                />
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">PRODUK YANG DISEWA</label>
                <input
                  value={formData.produk_disewa}
                  onChange={(e) => setFormData({ ...formData, produk_disewa: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2F855A]"
                  placeholder="e.g. Tenda 4 Orang..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">KEGIATAN / TRIP</label>
                <input
                  value={formData.kegiatan}
                  onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2F855A]"
                  placeholder="e.g. Camping di Bromo..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">ISI REVIEW</label>
              <textarea
                value={formData.isi_review}
                onChange={(e) => setFormData({ ...formData, isi_review: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2F855A] resize-none"
                placeholder="Isi ulasan pelanggan..."
              />
            </div>

            {/* Foto Customer — shown when editing existing review */}
            {editingId && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">FOTO CUSTOMER</label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                    {fotoPreview ? (
                      <img src={fotoPreview} alt="preview" className="w-full h-full object-cover" />
                    ) : existingFoto && !removeFoto ? (
                      <img
                        src={existingFoto.startsWith('/') ? `http://localhost:8000${existingFoto}` : existingFoto}
                        alt="existing"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <ImagePlus size={22} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <input
                      ref={fotoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setFotoFile(f);
                          setRemoveFoto(false);
                          const reader = new FileReader();
                          reader.onloadend = () => setFotoPreview(reader.result as string);
                          reader.readAsDataURL(f);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fotoInputRef.current?.click()}
                      className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 flex items-center gap-1.5"
                    >
                      <ImagePlus size={13} /> Pilih Foto
                    </button>
                    {(existingFoto || fotoFile) && !removeFoto && (
                      <button
                        type="button"
                        onClick={() => { setFotoFile(null); setFotoPreview(""); setRemoveFoto(true); }}
                        className="text-xs px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-red-500 flex items-center gap-1.5"
                      >
                        <Trash size={13} /> Hapus Foto
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Approve toggle in form */}
            <div className="flex items-center gap-3">
              <label className="block text-xs font-semibold text-gray-500">TAMPILKAN DI FRONTEND</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_approved: !formData.is_approved })}
                className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${formData.is_approved ? "bg-green-500" : "bg-gray-300"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform mt-0.5 ${formData.is_approved ? "translate-x-4" : "translate-x-0.5"
                    }`}
                />
              </button>
              <span className={`text-xs font-medium ${formData.is_approved ? "text-green-600" : "text-gray-400"}`}>
                {formData.is_approved ? "Akan tampil di halaman review" : "Tersembunyi (pending)"}
              </span>
            </div>

            <div className="flex gap-2 justify-end">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 bg-[#2F855A] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#276749] disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editingId ? "Simpan Perubahan" : "Tambah Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
            <p>
              {filter === "all"
                ? "Belum ada review. Klik \"Tambah Review\" untuk memulai."
                : filter === "approved"
                  ? "Tidak ada review yang disetujui."
                  : "Tidak ada review pending."}
            </p>
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div
              key={r.id_testimoni}
              className={`bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow ${r.is_approved ? "border-green-200 bg-green-50/30" : "border-gray-200"
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{r.nama_customer}</p>
                    {renderStars(r.rating)}
                    {/* Status badge */}
                    {r.is_approved ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        <CheckCircle size={10} /> Tampil di frontend
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        <XCircle size={10} /> Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">"{r.isi_review}"</p>
                  {(r.produk_disewa || r.kegiatan) && (
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {r.produk_disewa && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                          {r.produk_disewa}
                        </span>
                      )}
                      {r.kegiatan && (
                        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                          {r.kegiatan}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(r.created_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Approve / Unapprove toggle */}
                  <button
                    onClick={() => handleToggleApprove(r)}
                    disabled={togglingId === r.id_testimoni}
                    title={r.is_approved ? "Sembunyikan dari frontend" : "Tampilkan di frontend"}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${r.is_approved
                        ? "hover:bg-amber-50 text-amber-500"
                        : "hover:bg-green-50 text-green-600"
                      }`}
                  >
                    {togglingId === r.id_testimoni ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : r.is_approved ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(r)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil size={16} className="text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id_testimoni)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
