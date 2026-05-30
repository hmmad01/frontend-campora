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

// Sub-komponen untuk kalender per barang
function ProductCalendarItem({ product }: { product: Barang }) {
  const [month, setMonth] = useState(new Date());
  const [ketersediaans, setKetersediaans] = useState<Ketersediaan[]>([]);
  const [cellColors, setCellColors] = useState<Record<string, "hijau" | "merah">>({});
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchKetersediaan = async () => {
      try {
        const res = await ketersediaanApi.getAll(product.id_barang);
        setKetersediaans(res.data);
      } catch (err: any) {
        console.error("Failed to fetch ketersediaan:", err);
      }
    };
    fetchKetersediaan();
  }, [product.id_barang]);

  const y = month.getFullYear();
  const m = month.getMonth();
  const totalDays = new Date(y, m + 1, 0).getDate();
  const startOffset = new Date(y, m, 1).getDay();

  const getDayStatus = (day: number): DayStatus => {
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

  const handleCellClick = (day: number) => {
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    let currentColor = cellColors[dateStr];
    if (!currentColor) {
      const s = getDayStatus(day);
      currentColor = s === "booked" ? "merah" : "hijau";
    }

    let nextColor: "hijau" | "merah" = currentColor === "hijau" ? "merah" : "hijau";

    setCellColors(prev => ({ ...prev, [dateStr]: nextColor }));

    setSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
  };

  const handleSave = async () => {
    if (selectedDates.length === 0) return; // No changes

    const admin = sessionStorage.getItem("admin");
    const adminData = admin ? JSON.parse(admin) : null;
    if (!adminData) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    setSaving(true);
    try {
      // Create array of changes
      const changes = selectedDates.map(dateStr => ({
        date: dateStr,
        status: cellColors[dateStr] as 'merah' | 'hijau'
      }));

      // Send bulk sync to backend
      await ketersediaanApi.sync({
        id_barang: product.id_barang,
        id_admin: adminData.id_admin,
        changes
      });

      // Refresh data after changes
      setCellColors({});
      setSelectedDates([]);
      const res = await ketersediaanApi.getAll(product.id_barang);
      setKetersediaans(res.data);
      alert("Status ketersediaan berhasil disimpan!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col mb-8 shadow-sm">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-gray-800">{product.nama_barang}</h4>
          <span className="text-sm text-gray-500">Stok: {product.stok_total}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button onClick={() => setMonth(new Date(y, m - 1))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center gap-3">
          <select 
            value={m} 
            onChange={(e) => setMonth(new Date(y, Number(e.target.value), 1))}
            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-[#2F855A] font-semibold"
          >
            {MONTHS.map((monthName, idx) => (
              <option key={monthName} value={idx}>{monthName}</option>
            ))}
          </select>
          
          <input 
            type="number" 
            value={y} 
            onChange={(e) => setMonth(new Date(Number(e.target.value), m, 1))}
            className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-[#2F855A] font-semibold"
          />
        </div>

        <button onClick={() => setMonth(new Date(y, m + 1))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 px-6 pt-4">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-gray-300 py-2" style={{ fontWeight: 600 }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 px-6 pb-4">
        {cells.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} className="h-10" />;

          const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          let color = cellColors[dateStr];
          if (!color) {
             const s = getDayStatus(d);
             color = s === "booked" ? "merah" : "hijau";
          }

          const base = "flex items-center justify-center rounded-xl text-sm transition-all select-none w-full h-10 cursor-pointer shadow-sm";

          let style = base;
          if (color === "merah") {
            style += " bg-red-500 text-white hover:bg-red-600";
          } else if (color === "hijau") {
            style += " bg-green-500 text-white hover:bg-green-600";
          }

          return (
            <div key={d} className={style} onClick={() => handleCellClick(d)}>
              {d}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-green-500" />
            <span className="text-xs text-gray-400">Tersedia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-red-500" />
            <span className="text-xs text-gray-400">Disewa</span>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving || Object.keys(cellColors).length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#2F855A] hover:bg-[#276F4A] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      {ketersediaans.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-100 p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Riwayat Booking</h4>
          <div className="space-y-2">
            {ketersediaans.map((k) => (
              <div key={k.id_ketersediaan} className="flex items-center justify-between px-3 py-2 bg-white rounded-lg text-sm border border-gray-200">
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

export default function AvailabilityCalendar() {
  const [products, setProducts] = useState<Barang[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | 0>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const selectedProduct = products.find(p => p.id_barang === selectedProductId);

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

      <div className={`flex-1 overflow-y-auto pr-2 pb-8 ${!selectedProductId ? "opacity-40 pointer-events-none" : ""}`}>
        {selectedProduct ? (
          <ProductCalendarItem key={selectedProduct.id_barang} product={selectedProduct} />
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl h-64 flex items-center justify-center text-gray-400">
            Pilih barang terlebih dahulu untuk melihat kalender
          </div>
        )}
      </div>
    </div>
  );
}