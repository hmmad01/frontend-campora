
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Upload, Loader2, AlertCircle, RefreshCw, Search } from "lucide-react";
import { useToast, ToastContainer } from "../../components/Toast";
import {
  barangApi,
  kategoriApi,
  fotoApi,
  type Barang,
  type Kategori,
} from "../../api";

interface ProductFormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  children?: React.ReactNode;
}

const ProductFormField = ({ label, ...props }: ProductFormFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {props.type === "textarea" ? (
      <textarea
        {...props}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F855A] focus:border-transparent resize-none"
      />
    ) : props.type === "select" ? (
      <select {...props} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F855A] focus:border-transparent">
        {props.children}
      </select>
    ) : (
      <input {...props} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F855A] focus:border-transparent" />
    )}
  </div>
);

const ProductStatusBadge = ({ isAktif }: { isAktif: boolean }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
    isAktif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }`}>
    {isAktif ? "Aktif" : "Nonaktif"}
  </span>
);

const ProductActionButtons = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
  <div className="flex items-center gap-2">
    <button onClick={onEdit} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
      <Edit size={16} className="inline mr-1" />
      Edit
    </button>
    <button onClick={onDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
      <Trash2 size={16} className="inline mr-1" />
      Hapus
    </button>
  </div>
);

export default function ProductManagement() {
  const [products, setProducts] = useState<Barang[]>([]);
  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Barang | null>(null);
  const [formData, setFormData] = useState({
    nama_barang: "",
    id_kategori: "",
    harga_per_hari: "",
    merk: "",
    spesifikasi: "",
    stok_total: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [barangRes, kategoriRes] = await Promise.all([
        barangApi.getAll({ per_page: 100 }),
        kategoriApi.getAll(),
      ]);
      const sortedBarang = barangRes.data.sort((a: Barang, b: Barang) => b.id_barang - a.id_barang);
      setProducts(sortedBarang);
      setKategoris(kategoriRes);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => ({
    nama_barang: "",
    id_kategori: "",
    harga_per_hari: "",
    merk: "",
    spesifikasi: "",
    stok_total: "",
  });

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData(resetForm());
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleEdit = (product: Barang) => {
    setEditingProduct(product);
    setFormData({
      nama_barang: product.nama_barang,
      id_kategori: String(product.id_kategori),
      harga_per_hari: product.harga_per_hari,
      merk: product.merk || "",
      spesifikasi: product.spesifikasi || "",
      stok_total: String(product.stok_total),
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menonaktifkan barang ini?")) return;
    try {
      await barangApi.delete(id);
      toast.success("Barang berhasil dinonaktifkan!");
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus barang");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingProduct) {
        await barangApi.update(editingProduct.id_barang, {
          nama_barang: formData.nama_barang,
          id_kategori: Number(formData.id_kategori),
          harga_per_hari: formData.harga_per_hari,
          merk: formData.merk || null,
          spesifikasi: formData.spesifikasi || null,
          stok_total: Number(formData.stok_total),
        } as any);

        if (selectedFile) {
          await fotoApi.upload(editingProduct.id_barang, selectedFile);
        }
      } else {
        const res = await barangApi.create({
          nama_barang: formData.nama_barang,
          id_kategori: Number(formData.id_kategori),
          harga_per_hari: Number(formData.harga_per_hari),
          stok_total: Number(formData.stok_total),
          merk: formData.merk || undefined,
          spesifikasi: formData.spesifikasi || undefined,
        });

        if (selectedFile && res.data?.id_barang) {
          await fotoApi.upload(res.data.id_barang, selectedFile);
        }
      }

      setShowModal(false);
      toast.success(editingProduct ? "Barang berhasil diperbarui!" : "Barang berhasil ditambahkan!");
      if (selectedFile) toast.success("Gambar berhasil diupload!");
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan barang");
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  };

  const getKategoriName = (idKategori: number) => {
    return kategoris.find((k) => k.id_kategori === idKategori)?.nama_kategori || "-";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#2F855A]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-[#2F855A] text-white rounded-xl hover:bg-[#276749] transition-colors"
        >
          <RefreshCw size={16} />
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Data Barang</h3>
          <p className="text-sm text-gray-600 mt-1">Kelola semua barang rental — {products.length} barang</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari barang..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F855A] focus:border-transparent text-sm w-64"
            />
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            <RefreshCw size={18} />
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-3 bg-[#2F855A] text-white rounded-xl font-medium hover:bg-[#276749] transition-colors shadow-sm">
            <Plus size={20} />
            Tambah Barang
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Barang</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kategori</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Harga/Hari</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stok</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Belum ada data barang. Klik "Tambah Barang" untuk menambah.
                </td>
              </tr>
            ) : (
              products
                .filter(product => 
                  product.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  (product.merk && product.merk.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((product) => (
                <tr key={product.id_barang} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.fotos && product.fotos.length > 0 && (
                        <img
                          src={product.fotos[0].url_foto.startsWith('/') ? `http://localhost:8000${product.fotos[0].url_foto}` : product.fotos[0].url_foto}
                          alt={product.nama_barang}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.nama_barang}</p>
                        {product.merk && <p className="text-xs text-gray-500">{product.merk}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{getKategoriName(product.id_kategori)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatRupiah(product.harga_per_hari)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.stok_total}</td>
                  <td className="px-6 py-4"><ProductStatusBadge isAktif={product.is_aktif} /></td>
                  <td className="px-6 py-4"><ProductActionButtons onEdit={() => handleEdit(product)} onDelete={() => handleDelete(product.id_barang)} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{editingProduct ? "Edit Barang" : "Tambah Barang"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProductFormField
                  label="Nama Barang"
                  type="text"
                  value={formData.nama_barang}
                  onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                  placeholder="Masukkan nama barang"
                  required
                />
                <ProductFormField label="Kategori" type="select" value={formData.id_kategori} onChange={(e) => setFormData({ ...formData, id_kategori: e.target.value })} required>
                  <option value="">Pilih kategori</option>
                  {kategoris.map((k) => (
                    <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>
                  ))}
                </ProductFormField>
                <ProductFormField
                  label="Harga per Hari (Rp)"
                  type="number"
                  value={formData.harga_per_hari}
                  onChange={(e) => setFormData({ ...formData, harga_per_hari: e.target.value })}
                  placeholder="100000"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <ProductFormField
                    label="Stok Total"
                    type="number"
                    value={formData.stok_total}
                    onChange={(e) => setFormData({ ...formData, stok_total: e.target.value })}
                    placeholder="10"
                    required
                  />
                  <ProductFormField
                    label="Merk"
                    type="text"
                    value={formData.merk}
                    onChange={(e) => setFormData({ ...formData, merk: e.target.value })}
                    placeholder="Contoh: Eiger"
                  />
                </div>
              </div>

              <ProductFormField
                label="Spesifikasi"
                type="textarea"
                value={formData.spesifikasi}
                onChange={(e) => setFormData({ ...formData, spesifikasi: e.target.value })}
                rows={3}
                placeholder="Masukkan spesifikasi barang"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Gambar</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#2F855A] transition-colors cursor-pointer"
                  onClick={() => document.getElementById("foto-input")?.click()}
                >
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : "Klik untuk upload gambar"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP (max. 2MB)</p>
                </div>
                <input
                  id="foto-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                      if (!validTypes.includes(file.type)) {
                        toast.error("Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.");
                        e.target.value = ''; // Reset input
                        return;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error("Ukuran gambar maksimal 2MB.");
                        e.target.value = ''; // Reset input
                        return;
                      }
                      setSelectedFile(file);
                    } else {
                      setSelectedFile(null);
                    }
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-[#2F855A] text-white rounded-xl font-medium hover:bg-[#276749] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting && <Loader2 size={18} className="animate-spin" />}
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
