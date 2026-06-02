
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

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#124756]" size={40} /></div>;
  if (error) return <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl"><AlertCircle size={20} /><span>{error}</span></div>;

  return (
    <div className="h-full flex flex-col">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Kelola Paket</h3>
          <p className="text-sm text-gray-400 mt-0.5">Kelola paket bundling sewa peralatan</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-[#124756] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0e3a47] transition-colors">
          <Plus size={18} /> Tambah Paket
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? "Edit Paket" : "Tambah Paket Baru"}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Paket</label>
                  <input value={formData.nama_paket} onChange={(e) => setFormData({ ...formData, nama_paket: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#124756] focus:border-transparent text-sm" placeholder="Nama paket..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp / hari)</label>
                  <input type="number" value={formData.harga} onChange={(e) => setFormData({ ...formData, harga: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#124756] focus:border-transparent text-sm" placeholder="150000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                <input value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#124756] focus:border-transparent text-sm" placeholder="Deskripsi singkat paket..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Isi Paket (satu item per baris)</label>
                <textarea value={formData.items} onChange={(e) => setFormData({ ...formData, items: e.target.value })} rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#124756] focus:border-transparent text-sm resize-none font-mono" placeholder={"1x Tenda Kapasitas 2 Orang\n2x Sleeping Bag Polar\n1x Lampu Tenda"} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="rounded" />
                <label htmlFor="is_featured" className="text-sm text-gray-700 flex items-center gap-1">
                  <StarIcon size={16} className="text-yellow-500" /> Tandai sebagai Terpopuler
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={resetForm} disabled={saving} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-60">
                  Batal
                </button>
                <button onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-3 bg-[#124756] text-white rounded-xl font-medium hover:bg-[#0e3a47] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {saving ? "Menyimpan..." : (editingId ? "Simpan Perubahan" : "Simpan")}
                </button>
              </div>
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
                  <p className="text-sm font-semibold text-[#124756]">Rp {Number(p.harga).toLocaleString("id-ID")} / hari</p>
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
