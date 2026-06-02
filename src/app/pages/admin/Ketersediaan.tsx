
import { useState, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Loader2, AlertCircle,
  Plus, Pencil, Trash2, X, Save, Package, CalendarDays,
  Info, Search
} from "lucide-react";
import {
  barangApi,
  ketersediaanApi,
  type Barang,
  type Ketersediaan,
} from "../../api";
import { useToast, ToastContainer } from "../../components/Toast";

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS   = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function today(): string {
  return toDateStr(new Date());
}

interface BookingFormProps {
  product: Barang;
  editing: Ketersediaan | null;
  prefillStart?: string;
  onClose: () => void;
  onSaved: () => void;
}

function BookingFormModal({ product, editing, prefillStart, onClose, onSaved }: BookingFormProps) {
  const adminRaw = sessionStorage.getItem("admin");
  const adminData = adminRaw ? JSON.parse(adminRaw) : null;

  const [mulai, setMulai] = useState(editing ? editing.tanggal_mulai.toString().split("T")[0] : prefillStart ?? today());
  const [selesai, setSelesai] = useState(editing ? editing.tanggal_selesai.toString().split("T")[0] : prefillStart ?? today());
  const [stok, setStok] = useState(editing ? editing.stok_disewa : 1);
  const [catatan, setCatatan] = useState(editing?.catatan ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSave = async () => {
    if (!adminData) { setErr("Silakan login terlebih dahulu."); return; }
    if (mulai > selesai) { setErr("Tanggal mulai harus sebelum atau sama dengan tanggal selesai."); return; }
    if (stok < 1) { setErr("Jumlah stok disewa minimal 1."); return; }
    setErr("");
    setSaving(true);
    try {
      if (editing) {
        await ketersediaanApi.update(editing.id_ketersediaan, {
          tanggal_mulai: mulai as any,
          tanggal_selesai: selesai as any,
          stok_disewa: stok,
          catatan: catatan || undefined,
        });
      } else {
        await ketersediaanApi.create({
          id_barang: product.id_barang,
          id_admin: adminData.id_admin,
          tanggal_mulai: mulai,
          tanggal_selesai: selesai,
          stok_disewa: stok,
          catatan: catatan || undefined,
        });
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setErr(e.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-base font-semibold text-gray-900">
              {editing ? "Edit Periode Sewa" : "Tambah Periode Sewa"}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">{product.nama_barang}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">TANGGAL MULAI</label>
              <input
                type="date"
                value={mulai}
                onChange={e => setMulai(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#124756]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">TANGGAL SELESAI</label>
              <input
                type="date"
                value={selesai}
                min={mulai}
                onChange={e => setSelesai(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#124756]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              STOK DISEWA <span className="font-normal text-gray-400">(Maks: {product.stok_total})</span>
            </label>
            <input
              type="number"
              min={1}
              max={product.stok_total}
              value={stok}
              onChange={e => setStok(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#124756]"
            />
            <p className="text-xs text-gray-400 mt-1">
              Stok tersisa di katalog: {Math.max(0, product.stok_total - stok)}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">CATATAN (Opsional)</label>
            <input
              type="text"
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              placeholder="e.g. Booking atas nama Budi"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#124756]"
            />
          </div>

          {err && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-lg">
              <AlertCircle size={14} /> {err}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-1">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#124756] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#0e3a47] disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {editing ? "Simpan Perubahan" : "Tambah Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCalendarItem({ product, onDataChange }: { product: Barang; onDataChange?: () => void }) {
  const [month, setMonth] = useState(new Date());
  const [ketersediaans, setKetersediaans] = useState<Ketersediaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Ketersediaan | null>(null);
  const [clickedDate, setClickedDate] = useState<string | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const toast = useToast();

  const fetchKetersediaan = async () => {
    setLoading(true);
    try {
      const res = await ketersediaanApi.getAll(product.id_barang);
      setKetersediaans(res.data);
    } catch (err: any) {
      console.error("Failed to fetch ketersediaan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKetersediaan(); }, [product.id_barang]);

  const y = month.getFullYear();
  const m = month.getMonth();
  const totalDays = new Date(y, m + 1, 0).getDate();
  const startOffset = new Date(y, m, 1).getDay();

  const getBookingsForDay = (day: number): Ketersediaan[] => {
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return ketersediaans.filter(k => {
      const mulai = k.tanggal_mulai.toString().split("T")[0];
      const selesai = k.tanggal_selesai.toString().split("T")[0];
      return dateStr >= mulai && dateStr <= selesai;
    });
  };

  const getStokDisewadOnDay = (day: number): number => {
    return getBookingsForDay(day).reduce((sum, k) => sum + k.stok_disewa, 0);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setClickedDate(dateStr);
    setEditingBooking(null);
    setShowForm(true);
  };

  const handleEdit = (k: Ketersediaan) => {
    setEditingBooking(k);
    setClickedDate(undefined);
    setShowForm(true);
  };

  const handleDelete = async (k: Ketersediaan) => {
    if (!confirm(`Hapus periode sewa ${k.tanggal_mulai.toString().split("T")[0]} — ${k.tanggal_selesai.toString().split("T")[0]}?`)) return;
    setDeletingId(k.id_ketersediaan);
    try {
      await ketersediaanApi.delete(k.id_ketersediaan);
      toast.success("Periode sewa berhasil dihapus.");
      await fetchKetersediaan();
      onDataChange?.();
    } catch (e: any) {
      toast.error(e.message || "Gagal menghapus.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = async () => {
    toast.success(editingBooking ? "Periode sewa berhasil diperbarui!" : "Periode sewa berhasil ditambahkan!");
    await fetchKetersediaan();
    onDataChange?.();
  };

  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const todayStr = today();

  return (
    <>
      {showForm && (
        <BookingFormModal
          product={product}
          editing={editingBooking}
          prefillStart={clickedDate}
          onClose={() => { setShowForm(false); setEditingBooking(null); }}
          onSaved={handleSaved}
        />
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col mb-6 shadow-sm">
        {/* Product header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-gray-800">{product.nama_barang}</h4>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-sm text-gray-500">Stok Total: <b className="text-gray-700">{product.stok_total}</b></span>
            </div>
          </div>
          <button
            onClick={() => { setClickedDate(todayStr); setEditingBooking(null); setShowForm(true); }}
            className="flex items-center gap-1.5 bg-[#124756] text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-[#0e3a47] transition-colors"
          >
            <Plus size={14} /> Tambah Booking
          </button>
        </div>

        {/* Month navigator */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
          <button onClick={() => setMonth(new Date(y, m - 1))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <select
              value={m}
              onChange={(e) => setMonth(new Date(y, Number(e.target.value), 1))}
              className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-[#124756] font-semibold"
            >
              {MONTHS.map((monthName, idx) => (
                <option key={monthName} value={idx}>{monthName}</option>
              ))}
            </select>
            <input
              type="number"
              value={y}
              onChange={(e) => setMonth(new Date(Number(e.target.value), m, 1))}
              className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-[#124756] font-semibold"
            />
          </div>
          <button onClick={() => setMonth(new Date(y, m + 1))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 px-6 pt-3">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs text-gray-400 py-2 font-semibold">{d}</div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={28} className="animate-spin text-[#124756]" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5 px-6 pb-4">
            {cells.map((d, i) => {
              if (d === null) return <div key={`e-${i}`} className="h-12" />;

              const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const stokDisewa = getStokDisewadOnDay(d);
              const stokTersedia = Math.max(0, product.stok_total - stokDisewa);
              const isFullyBooked = stokDisewa >= product.stok_total;
              const isPartiallyBooked = stokDisewa > 0 && !isFullyBooked;
              const isToday = dateStr === todayStr;

              let cellClass = "relative flex flex-col items-center justify-center rounded-xl text-xs transition-all select-none w-full h-12 cursor-pointer font-medium ";

              if (isFullyBooked) {
                cellClass += "bg-red-500 text-white hover:bg-red-600 shadow-sm";
              } else if (isPartiallyBooked) {
                cellClass += "bg-amber-400 text-white hover:bg-amber-500 shadow-sm";
              } else {
                cellClass += "bg-green-100 text-green-800 hover:bg-green-200";
              }

              if (isToday) {
                cellClass += " ring-2 ring-offset-1 ring-[#124756]";
              }

              return (
                <div key={d} className={cellClass} onClick={() => handleDayClick(d)} title={`Stok tersedia: ${stokTersedia}/${product.stok_total}`}>
                  <span>{d}</span>
                  {stokDisewa > 0 && (
                    <span className="text-[9px] opacity-90 leading-none mt-0.5">{stokTersedia} sisa</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-green-200 border border-green-400" />
            <span className="text-xs text-gray-500">Tersedia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-amber-400" />
            <span className="text-xs text-gray-500">Sebagian disewa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-red-500" />
            <span className="text-xs text-gray-500">Habis / penuh</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
            <Info size={12} />
            Klik tanggal untuk tambah booking
          </div>
        </div>

        {/* Booking list */}
        {ketersediaans.length > 0 && (
          <div className="border-t border-gray-100 p-4">
            <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Daftar Periode Sewa</h4>
            <div className="space-y-2">
              {ketersediaans.map((k) => {
                const mulai = k.tanggal_mulai.toString().split("T")[0];
                const selesai = k.tanggal_selesai.toString().split("T")[0];
                const stokTersedia = Math.max(0, product.stok_total - k.stok_disewa);
                const isActive = todayStr >= mulai && todayStr <= selesai;

                return (
                  <div
                    key={k.id_ketersediaan}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm border ${isActive ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={13} className="text-gray-400 shrink-0" />
                        <span className="font-medium text-gray-700">{mulai} — {selesai}</span>
                        {isActive && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">Aktif</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 pl-5">
                        <span className="text-xs text-gray-500">
                          Stok disewa: <b className="text-gray-700">{k.stok_disewa}</b>
                          <span className="text-gray-400"> / tersedia: {stokTersedia}</span>
                        </span>
                        {k.catatan && <span className="text-xs text-gray-400 italic truncate max-w-[160px]">{k.catatan}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(k)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(k)}
                        disabled={deletingId === k.id_ketersediaan}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        {deletingId === k.id_ketersediaan
                          ? <Loader2 size={14} className="animate-spin text-red-400" />
                          : <Trash2 size={14} className="text-red-400" />
                        }
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {ketersediaans.length === 0 && !loading && (
          <div className="border-t border-gray-100 px-6 py-5 text-center text-gray-400">
            <Package size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">Belum ada periode sewa. Klik tanggal di kalender atau tombol "Tambah Booking" untuk mulai.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function AvailabilityCalendar() {
  const [products, setProducts] = useState<Barang[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();

  const fetchProducts = async () => {
    try {
      const res = await barangApi.getAll({ per_page: 100 });
      setProducts(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data barang");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#124756]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const ActiveBookingsList = () => {
    const [bookings, setBookings] = useState<Ketersediaan[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    useEffect(() => {
      ketersediaanApi.getAll().then(res => {
        const today = new Date().toISOString().split('T')[0];
        // Urutkan dari yang terbaru/terdekat
        const active = res.data.filter(b => b.tanggal_selesai >= today);
        setBookings(active);
      }).catch(err => console.error(err))
        .finally(() => setLoadingBookings(false));
    }, []);

    if (loadingBookings) {
      return (
        <div className="bg-white border border-gray-200 rounded-2xl h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#124756]" size={32} />
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-2xl h-64 flex items-center justify-center text-gray-400 flex-col gap-2">
          <Package size={32} className="text-gray-300" />
          <p>Belum ada booking aktif saat ini</p>
        </div>
      );
    }

    const formatDate = (dateStr: string) => {
      try {
        return new Date(dateStr).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      } catch {
        return dateStr;
      }
    };

    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <CalendarDays size={18} className="text-[#124756]" />
            Daftar Booking Aktif & Mendatang
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Barang</th>
                <th className="px-4 py-3">Tanggal Mulai</th>
                <th className="px-4 py-3">Tanggal Selesai</th>
                <th className="px-4 py-3">Stok Disewa</th>
                <th className="px-4 py-3 rounded-r-xl">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map(b => (
                <tr 
                  key={b.id_ketersediaan} 
                  className="hover:bg-[#F0FDF4] cursor-pointer transition-colors" 
                  onClick={() => setSelectedProductId(b.id_barang)}
                  title="Klik untuk melihat kalender barang ini"
                >
                  <td className="px-4 py-3 font-medium text-[#124756]">{b.barang?.nama_barang || `ID: ${b.id_barang}`}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(b.tanggal_mulai)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(b.tanggal_selesai)}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{b.stok_disewa} unit</td>
                  <td className="px-4 py-3 text-gray-500 italic max-w-xs truncate">{b.catatan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const selectedProduct = products.find(p => p.id_barang === selectedProductId);

  return (
    <div className="pb-8">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Ketersediaan Stok</h3>
        <p className="text-sm text-gray-400 mt-0.5">
          Kelola periode sewa barang — stok tersedia ditampilkan real-time ke katalog customer
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-sm text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>
          Barang yang <b>stok penuh terpakai</b> pada suatu tanggal akan otomatis mendapat label <b>Tidak Tersedia</b> di halaman Katalog customer.
        </span>
      </div>

      <div className="mb-5">
        <label className="block text-xs text-gray-500 mb-1.5 font-semibold">CARI & PILIH BARANG</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama barang..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#124756]"
            />
          </div>
          <select
            value={selectedProductId}
            onChange={e => setSelectedProductId(Number(e.target.value))}
            className="w-full sm:flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#124756]"
          >
            <option value={0}>— Pilih barang —</option>
            {products
              .filter(p => 
                p.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.merk && p.merk.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map(p => (
              <option key={p.id_barang} value={p.id_barang}>
                {p.nama_barang} (Stok: {p.stok_total})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pb-4">
        {selectedProduct ? (
          <ProductCalendarItem
            key={selectedProduct.id_barang}
            product={selectedProduct}
            onDataChange={() => {}}
          />
        ) : (
          <ActiveBookingsList />
        )}
      </div>
    </div>
  );
}
