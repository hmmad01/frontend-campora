/**
 * @file PaketManagement.tsx
 * @description Halaman admin untuk mengelola paket bundling sewa peralatan outdoor.
 *              CRUD lengkap terhubung ke backend Laravel via API.
 */

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, X, Save, PackageOpen, Star as StarIcon } from "lucide-react";
import { paketApi, type PaketItem } from "../../api";
import { useToast, ToastContainer } from "../../components/Toast";

export default function PaketManagement() {
  const [pakets, setPakets] = useState<PaketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nama_paket: "", deskripsi: "", items: "", harga: "", is_featured: false });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchPakets = async () => {
    try {
      const data = await paketApi.getAll();
      const sortedData = data.sort((a: PaketItem, b: PaketItem) => b.id_paket - a.id_paket);
      setPakets(sortedData);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data paket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPakets(); }, []);

  const resetForm = () => {
    setFormData({ nama_paket: "", deskripsi: "", items: "", harga: "", is_featured: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (p: PaketItem) => {
    setFormData({
      nama_paket: p.nama_paket,
      deskripsi: p.deskripsi || "",
      items: (p.items || []).join("\n"),
      harga: String(p.harga),
      is_featured: p.is_featured,
    });
    setEditingId(p.id_paket);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.nama_paket.trim() || !formData.items.trim() || !formData.harga) return;
    setSaving(true);
    try {
      const itemsArray = formData.items.split("\n").map(s => s.trim()).filter(Boolean);
      const payload = {
        nama_paket: formData.nama_paket,
        deskripsi: formData.deskripsi || undefined,
        items: itemsArray,
        harga: Number(formData.harga),
        is_featured: formData.is_featured,
      };
      if (editingId) {
        await paketApi.update(editingId, payload as any);
        toast.success("Paket berhasil diperbarui!");
      } else {
        await paketApi.create(payload);
        toast.success("Paket berhasil ditambahkan!");
      }
      resetForm();
      await fetchPakets();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan paket");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus paket ini?")) return;
    try {
      await paketApi.delete(id);
      toast.success("Paket berhasil dihapus!");
      await fetchPakets();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus paket");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#2F855A]" size={40} /></div>;
  if (error) return <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl"><AlertCircle size={20} /><span>{error}</span></div>;

  return (
    <div className="h-full flex flex-col">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Kelola Paket</h3>
          <p className="text-sm text-gray-400 mt-0.5">Kelola paket bundling sewa peralatan</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#2F855A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#276749] transition-colors">
          <Plus size={18} /> Tambah Paket
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-800">{editingId ? "Edit Paket" : "Tambah Paket Baru"}</h4>
            <button onClick={resetForm} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">NAMA PAKET</label>
                <input value={formData.nama_paket} onChange={(e) => setFormData({ ...formData, nama_paket: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2F855A]" placeholder="Nama paket..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">HARGA (Rp / hari)</label>
                <input type="number" value={formData.harga} onChange={(e) => setFormData({ ...formData, harga: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2F855A]" placeholder="150000" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">DESKRIPSI</label>
              <input value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2F855A]" placeholder="Deskripsi singkat paket..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">ISI PAKET (satu item per baris)</label>
              <textarea value={formData.items} onChange={(e) => setFormData({ ...formData, items: e.target.value })} rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2F855A] resize-none font-mono" placeholder={"1x Tenda Kapasitas 2 Orang\n2x Sleeping Bag Polar\n1x Lampu Tenda"} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="rounded" />
              <label htmlFor="is_featured" className="text-sm text-gray-700 flex items-center gap-1">
                <StarIcon size={14} className="text-yellow-400" /> Tandai sebagai Terpopuler
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
              <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 bg-[#2F855A] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#276749] disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editingId ? "Simpan Perubahan" : "Tambah Paket"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {pakets.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <PackageOpen size={48} className="mx-auto mb-3 opacity-50" />
            <p>Belum ada paket. Klik "Tambah Paket" untuk memulai.</p>
          </div>
        ) : (
          pakets.map((p) => (
            <div key={p.id_paket} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{p.nama_paket}</p>
                    {p.is_featured && (
                      <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Terpopuler</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{p.deskripsi}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(p.items || []).map((item, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item}</span>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-[#2F855A]">Rp {Number(p.harga).toLocaleString("id-ID")} / hari</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleEdit(p)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Pencil size={16} className="text-gray-400" /></button>
                  <button onClick={() => handleDelete(p.id_paket)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} className="text-red-400" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
