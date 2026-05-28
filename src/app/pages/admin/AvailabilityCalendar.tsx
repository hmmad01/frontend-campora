/**
 * @file AvailabilityCalendar.tsx (Ketersediaan)
 * @description Halaman kalender interaktif bagi admin untuk memantau dan memperbarui status ketersediaan masing-masing barang rental.
 *              Terkoneksi ke backend Laravel via API.
 */

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import {
  barangApi,
  ketersediaanApi,
  type Barang,
  type Ketersediaan,
} from "../../api";

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS   = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

type DayStatus = "available" | "booked" | null;

export default function AvailabilityCalendar() {
  const [products, setProducts] = useState<Barang[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | 0>(0);
  const [month, setMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ketersediaans, setKetersediaans] = useState<Ketersediaan[]>([]);

  // Fetch products list
  useEffect(() => {
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
    fetchProducts();
  }, []);

  // Fetch ketersediaan when product changes
  useEffect(() => {
    if (!selectedProductId) {
      setKetersediaans([]);
      return;
    }
    const fetchKetersediaan = async () => {
      try {
        const res = await ketersediaanApi.getAll(selectedProductId);
        setKetersediaans(res.data);
      } catch (err: any) {
        console.error("Failed to fetch ketersediaan:", err);
      }
    };
    fetchKetersediaan();
  }, [selectedProductId]);

  const y = month.getFullYear();
  const m = month.getMonth();
  const totalDays = new Date(y, m + 1, 0).getDate();
  const startOffset = new Date(y, m, 1).getDay();

  // Determine status of a day based on ketersediaan records
  const getDayStatus = (day: number): DayStatus => {
    if (!selectedProductId) return null;
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    for (const k of ketersediaans) {
      const mulai = k.tanggal_mulai.split("T")[0];
      const selesai = k.tanggal_selesai.split("T")[0];
      if (dateStr >= mulai && dateStr <= selesai) {
        return "booked";
      }
    }
    return null;
  };

  const handleSaveBooking = async () => {
    if (!selectedProductId) return;
    
    const admin = sessionStorage.getItem("admin");
    const adminData = admin ? JSON.parse(admin) : null;
    if (!adminData) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    // Get first day of current month as example booking
    const mulai = `${y}-${String(m + 1).padStart(2, "0")}-01`;
    const selesai = `${y}-${String(m + 1).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;

    setSaving(true);
    try {
      await ketersediaanApi.create({
        id_barang: selectedProductId,
        id_admin: adminData.id_admin,
        tanggal_mulai: mulai,
        tanggal_selesai: selesai,
        stok_disewa: 1,
        catatan: `Booking bulan ${MONTHS[m]} ${y}`,
      });
      // Refresh data
      const res = await ketersediaanApi.getAll(selectedProductId);
      setKetersediaans(res.data);
      alert("Booking berhasil disimpan!");
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan booking");
    } finally {
      setSaving(false);
    }
  };

  // Build grid: leading empty cells + days
  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#2F855A]" size={40} />
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

  return (
    <div className="h-full flex flex-col">

      <div className="mb-6">
        <h3 className="text-xl" style={{ fontWeight: 600, color: "#111827" }}>Ketersediaan</h3>
        <p className="text-sm text-gray-400 mt-0.5">Lihat status ketersediaan barang per tanggal</p>
      </div>

      <div className="mb-5">
        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>BARANG</label>
        <select
          value={selectedProductId}
          onChange={e => setSelectedProductId(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#2F855A]"
        >
          <option value={0}>— Pilih barang —</option>
          {products.map(p => (
            <option key={p.id_barang} value={p.id_barang}>
              {p.nama_barang} (Stok: {p.stok_total})
            </option>
          ))}
        </select>
      </div>

      <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col flex-1 ${!selectedProductId ? "opacity-40 pointer-events-none" : ""}`}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={() => setMonth(new Date(y, m - 1))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="text-base text-gray-800" style={{ fontWeight: 600 }}>
            {MONTHS[m]} {y}
          </span>
          <button onClick={() => setMonth(new Date(y, m + 1))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 px-6 pt-4">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs text-gray-300 py-2" style={{ fontWeight: 600 }}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 px-6 pb-4 flex-1">
          {cells.map((d, i) => {
            if (d === null) return <div key={`e-${i}`} />;

            const s = getDayStatus(d);
            const base = "flex items-center justify-center rounded-xl text-sm transition-all select-none w-full h-full";

            const style =
              s === "booked"    ? `${base} bg-red-100 text-red-500` :
              `${base} hover:bg-gray-100 text-gray-600`;

            return (
              <div key={d} className={style}>
                {d}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-gray-100 border border-gray-200" />
            <span className="text-xs text-gray-400">Tersedia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-red-100" />
            <span className="text-xs text-gray-400">Disewa</span>
          </div>
        </div>
      </div>

      {/* Booking list */}
      {selectedProductId > 0 && ketersediaans.length > 0 && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Riwayat Booking</h4>
          <div className="space-y-2">
            {ketersediaans.map((k) => (
              <div key={k.id_ketersediaan} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm">
                <span className="text-gray-700">
                  {k.tanggal_mulai.split("T")[0]} — {k.tanggal_selesai.split("T")[0]}
                </span>
                <span className="text-gray-500">Stok: {k.stok_disewa}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}