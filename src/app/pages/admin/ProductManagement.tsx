/**
 * @file ProductManagement.tsx
 * @description Halaman admin untuk mengelola (menambah, mengubah, menghapus) data barang rental CAMPORA.
 */

import { useState } from "react";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";

interface Product {
  id: number;
  nama: string;
  kategori: string;
  harga: string;
  status: "tersedia" | "disewa";
}

const KATEGORI_OPTIONS = ["Tenda", "Peralatan Tidur", "Peralatan Masak", "Tas", "Lainnya"];

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


const ProductStatusBadge = ({ status }: { status: "tersedia" | "disewa" }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
    status === "tersedia" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }`}>
    {status === "tersedia" ? "Tersedia" : "Disewa"}
  </span>
);

const ProductActionButtons = ({ onEdit, onDelete }: any) => (
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
  const [products, setProducts] = useState<Product[]>([
    { id: 1, nama: "Tenda Dome 4 Orang", kategori: "Tenda", harga: "Rp 150.000", status: "tersedia" },
    { id: 2, nama: "Sleeping Bag", kategori: "Peralatan Tidur", harga: "Rp 50.000", status: "tersedia" },
    { id: 3, nama: "Kompor Camping", kategori: "Peralatan Masak", harga: "Rp 75.000", status: "disewa" },
    { id: 4, nama: "Carrier 60L", kategori: "Tas", harga: "Rp 100.000", status: "tersedia" },
    { id: 5, nama: "Matras Camping", kategori: "Peralatan Tidur", harga: "Rp 30.000", status: "disewa" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ nama: "", kategori: "", harga: "", deskripsi: "" });

  const resetForm = () => ({ nama: "", kategori: "", harga: "", deskripsi: "" });

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData(resetForm());
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product, deskripsi: "" });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map((p) => p.id === editingProduct.id ? { ...p, nama: formData.nama, kategori: formData.kategori, harga: formData.harga } : p));
    } else {
      setProducts([...products, { id: Math.max(...products.map((p) => p.id), 0) + 1, ...formData, status: "tersedia" }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Data Barang</h3>
          <p className="text-sm text-gray-600 mt-1">Kelola semua barang rental</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-3 bg-[#2F855A] text-white rounded-xl font-medium hover:bg-[#276749] transition-colors shadow-sm">
          <Plus size={20} />
          Tambah Barang
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Barang</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kategori</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Harga</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.nama}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.kategori}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.harga}</td>
                <td className="px-6 py-4"><ProductStatusBadge status={product.status} /></td>
                <td className="px-6 py-4"><ProductActionButtons onEdit={() => handleEdit(product)} onDelete={() => handleDelete(product.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{editingProduct ? "Edit Barang" : "Tambah Barang"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <ProductFormField label="Nama Barang" type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Masukkan nama barang" required />
              <ProductFormField label="Kategori" type="select" value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} required>
                <option value="">Pilih kategori</option>
                {KATEGORI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
              </ProductFormField>
              <ProductFormField label="Harga" type="text" value={formData.harga} onChange={(e) => setFormData({ ...formData, harga: e.target.value })} placeholder="Rp 100.000" required />
              <ProductFormField label="Deskripsi" type="textarea" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} rows={3} placeholder="Masukkan deskripsi barang" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Gambar</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#2F855A] transition-colors cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG (max. 2MB)</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#2F855A] text-white rounded-xl font-medium hover:bg-[#276749] transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
