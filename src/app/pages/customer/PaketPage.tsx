/**
 * @file PaketPage.tsx
 * @description Halaman penawaran paket sewa hemat (bundling) peralatan outdoor untuk berbagai level pendakian atau camping keluarga.
 *              Terkoneksi ke backend Laravel via API.
 */

import { useState, useEffect } from 'react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { paketApi, type PaketItem } from '../../api';

import imgBasic from '@/images/paket basic camp.png';
import imgFamily from '@/images/paket family .png';
import imgHiking from '@/images/paket hiking.png';

// Fallback images mapped by partial name match
const FALLBACK_IMAGES: Record<string, string> = {
  basic: imgBasic,
  family: imgFamily,
  hiking: imgHiking,
};

function getImage(paket: PaketItem): string {
  if (paket.gambar) {
    return paket.gambar.startsWith('/') ? `http://localhost:8000${paket.gambar}` : paket.gambar;
  }
  // Try to match fallback by name
  const lower = paket.nama_paket.toLowerCase();
  for (const [key, img] of Object.entries(FALLBACK_IMAGES)) {
    if (lower.includes(key)) return img;
  }
  return imgBasic; // default fallback
}

interface PackageCardProps {
  paket: PaketItem;
}

function PackageCard({ paket }: PackageCardProps) {
  const image = getImage(paket);
  const items = paket.items || [];
  const price = Number(paket.harga);

  return (
    <article
      className={`bg-white rounded-3xl shadow-md overflow-hidden flex flex-col h-full ${paket.is_featured ? 'ring-2 ring-[#219653] shadow-xl' : 'border border-gray-100'
        }`}
    >
      <div className="relative h-52 overflow-hidden">
        <img src={image} alt={paket.nama_paket} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
          {paket.is_featured && (
            <span className="absolute top-4 right-4 bg-[#219653] text-white text-xs px-3 py-1 rounded-full font-medium">
              Terpopuler
            </span>
          )}
          <h2 className="text-white font-semibold leading-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
            {paket.nama_paket}
          </h2>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">{paket.deskripsi}</p>

        <ul className="flex flex-col gap-2.5 mb-6 flex-1">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check size={15} className="text-[#219653] mt-0.5 shrink-0" strokeWidth={2.5} />
              <span className="text-sm text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-100 my-4" />

        <div className="mb-4">
          <span className="text-2xl font-semibold text-gray-900">
            Rp {price.toLocaleString('id-ID')}
          </span>
          <span className="text-sm text-gray-400 ml-1">/ hari</span>
        </div>

        <a
          href={`https://wa.me/6285736292760?text=${encodeURIComponent(`Halo CAMPORA! Saya tertarik dengan ${paket.nama_paket}. Mohon informasi lebih lanjut.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-colors ${paket.is_featured
              ? 'bg-[#219653] text-white hover:bg-[#1a7a44]'
              : 'bg-[#124756] text-white hover:bg-[#0e3a47]'
            }`}
        >
          Sewa Paket Ini
          <ArrowRight size={16} />
        </a>
      </div>
    </article>
  );
}

export default function PaketPage() {
  const [pakets, setPakets] = useState<PaketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPakets = async () => {
      try {
        const data = await paketApi.getAll();
        setPakets(data);
      } catch (err) {
        console.error('Failed to fetch pakets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPakets();
  }, []);

  return (
    <div className="w-full">

      <div className="max-w-3xl mx-auto px-6 md:px-10 pt-14 pb-10">
        <SectionHeader
          badge="Paket Bundling"
          title="PAKET OUTDOOR HEMAT"
          subtitle="Sewa lebih hemat dengan paket lengkap yang dirancang khusus untuk berbagai jenis petualangan Anda."
        />
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#124756]" size={36} />
          </div>
        ) : pakets.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>Belum ada paket tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {pakets.map((p) => (
              <PackageCard key={p.id_paket} paket={p} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
