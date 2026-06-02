/**
 * @file FAQManagement.tsx
 * @description Halaman admin untuk mengelola FAQ (Frequently Asked Questions).
 *              CRUD lengkap terhubung ke backend Laravel via API.
 */

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, X, Save, HelpCircle } from "lucide-react";
import { faqApi, type FaqItem } from "../../api";
import { useToast, ToastContainer } from "../../components/Toast";

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ pertanyaan: "", jawaban: "" });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchFaqs = async () => {
    try {
      const data = await faqApi.getAll();
      const sortedData = data.sort((a: FaqItem, b: FaqItem) => b.id_faq - a.id_faq);
      setFaqs(sortedData);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data FAQ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const resetForm = () => {
    setFormData({ pertanyaan: "", jawaban: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (faq: FaqItem) => {
    setFormData({ pertanyaan: faq.pertanyaan, jawaban: faq.jawaban });
    setEditingId(faq.id_faq);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.pertanyaan.trim() || !formData.jawaban.trim()) return;
    setSaving(true);
    try {
      const admin = JSON.parse(sessionStorage.getItem("admin") || "{}");
      if (editingId) {
        await faqApi.update(editingId, formData);
        toast.success("FAQ berhasil diperbarui!");
      } else {
        await faqApi.create({ ...formData, id_admin: admin.id_admin || 1 });
        toast.success("FAQ berhasil ditambahkan!");
      }
      resetForm();
      await fetchFaqs();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus FAQ ini?")) return;
    try {
      await faqApi.delete(id);
      toast.success("FAQ berhasil dihapus!");
      await fetchFaqs();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus FAQ");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#2F855A]" size={40} /></div>;
  if (error) return <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl"><AlertCircle size={20} /><span>{error}</span></div>;

  return (
    <div className="h-full flex flex-col">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Kelola FAQ</h3>
          <p className="text-sm text-gray-400 mt-0.5">Kelola pertanyaan yang sering diajukan</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#2F855A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#276749] transition-colors">
          <Plus size={18} /> Tambah FAQ
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? "Edit FAQ" : "Tambah FAQ Baru"}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pertanyaan</label>
                <input value={formData.pertanyaan} onChange={(e) => setFormData({ ...formData, pertanyaan: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F855A] focus:border-transparent text-sm" placeholder="Masukkan pertanyaan..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jawaban</label>
                <textarea value={formData.jawaban} onChange={(e) => setFormData({ ...formData, jawaban: e.target.value })} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F855A] focus:border-transparent text-sm resize-none" placeholder="Masukkan jawaban..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={resetForm} disabled={saving} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-60">
                  Batal
                </button>
                <button onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-3 bg-[#2F855A] text-white rounded-xl font-medium hover:bg-[#276749] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {saving ? "Menyimpan..." : (editingId ? "Simpan Perubahan" : "Simpan")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <HelpCircle size={48} className="mx-auto mb-3 opacity-50" />
            <p>Belum ada FAQ. Klik "Tambah FAQ" untuk memulai.</p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id_faq} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">{faq.pertanyaan}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{faq.jawaban}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleEdit(faq)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Pencil size={16} className="text-gray-400" /></button>
                  <button onClick={() => handleDelete(faq.id_faq)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} className="text-red-400" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
