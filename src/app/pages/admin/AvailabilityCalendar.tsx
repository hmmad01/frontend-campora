/**
 * @file AvailabilityCalendar.tsx (Ketersediaan)
 * @description Halaman kalender interaktif bagi admin untuk memantau dan memperbarui status ketersediaan masing-masing barang rental.
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Status = "available" | "booked" | null;

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS   = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

const PRODUCTS = ["Tenda Dome 4 Orang","Sleeping Bag","Kompor Camping","Carrier 60L","Matras Camping"];

const SEED: Record<string, Status> = {
  "2026-4-12":"booked","2026-4-13":"booked","2026-4-14":"booked",
  "2026-4-19":"available","2026-4-20":"available",
  "2026-4-26":"booked","2026-4-27":"booked",
};

export default function Ketersediaan() {
  const [product, setProduct]   = useState("");
  const [month, setMonth]       = useState(new Date(2026, 3));
  const [avail, setAvail]       = useState<Record<string, Status>>(SEED);

  const y = month.getFullYear();
  const m = month.getMonth();
  const totalDays   = new Date(y, m + 1, 0).getDate();
  const startOffset = new Date(y, m, 1).getDay();
  const key = (d: number) => `${y}-${m + 1}-${d}`;

  const toggle = (d: number) => {
    if (!product) return;
    setAvail(prev => {
      const cur = prev[key(d)];
      const next: Status = !cur ? "available" : cur === "available" ? "booked" : null;
      const updated = { ...prev };
      if (next === null) delete updated[key(d)];
      else updated[key(d)] = next;
      return updated;
    });
  };

  // build grid: leading empty cells + days
  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <div className="h-full flex flex-col">

      <div className="mb-6">
        <h3 className="text-xl" style={{ fontWeight: 600, color: "#111827" }}>Ketersediaan</h3>
        <p className="text-sm text-gray-400 mt-0.5">Klik tanggal untuk ubah status</p>
      </div>

      <div className="mb-5">
        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>BARANG</label>
        <select
          value={product}
          onChange={e => setProduct(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#2F855A]"
        >
          <option value="">— Pilih barang —</option>
          {PRODUCTS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col flex-1 ${!product ? "opacity-40 pointer-events-none" : ""}`}>

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

            const s = avail[key(d)];
            const base = "flex items-center justify-center rounded-xl text-sm cursor-pointer transition-all select-none w-full h-full";

            const style =
              s === "available" ? `${base} bg-[#2F855A] text-white` :
              s === "booked"    ? `${base} bg-red-100 text-red-500` :
              `${base} hover:bg-gray-100 text-gray-600`;

            return (
              <button key={d} onClick={() => toggle(d)} className={style}>
                {d}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-[#2F855A]" />
            <span className="text-xs text-gray-400">Tersedia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-red-100" />
            <span className="text-xs text-gray-400">Penuh</span>
          </div>
        </div>
      </div>

      {product && (
        <button
          onClick={() => alert("Tersimpan!")}
          className="mt-4 w-full py-3 bg-[#2F855A] hover:bg-[#276749] text-white text-sm rounded-xl transition-colors"
          style={{ fontWeight: 500 }}
        >
          Simpan
        </button>
      )}
    </div>
  );
}