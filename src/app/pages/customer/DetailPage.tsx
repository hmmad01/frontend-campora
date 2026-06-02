/**
 * @file DetailPage.tsx
 * @description Halaman detail produk untuk menampilkan spesifikasi barang, harga per hari, asuransi, durasi sewa, dan tombol hubungi admin via WhatsApp.
 *              Terkoneksi ke backend Laravel via API.
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Star, Plus, Minus, Check, Shield, Zap, Loader2, Package } from 'lucide-react';
import { barangApi, toProduct, testimoniApi, ketersediaanApi } from '../../api';
import { WhatsAppIcon } from '../../components/icons/SocialIcons';
import type { Product } from '../../types';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [stokTotal, setStokTotal] = useState(0);
  const [stokTersedia, setStokTersedia] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(1);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const [barang, testimoniRes, availabilityList] = await Promise.all([
          barangApi.getById(Number(id)),
          testimoniApi.getAll(),
          ketersediaanApi.checkToday().catch(() => [] as any),
        ]);
        
        const p = toProduct(barang);
        
        // Stok total dari data barang
        setStokTotal(barang.stok_total);

        // Cari stok tersedia hari ini
        const avail = Array.isArray(availabilityList)
          ? availabilityList.find((a: any) => a.id_barang === barang.id_barang)
          : null;
        setStokTersedia(avail ? avail.stok_tersedia : barang.stok_total);
        
        // Calculate rating from testimonials
        let totalRating = 0;
        let count = 0;
        for (const t of testimoniRes.data) {
          if (t.produk_disewa && t.produk_disewa.trim().toLowerCase() === p.name.trim().toLowerCase()) {
            totalRating += t.rating;
            count += 1;
          }
        }
        
        if (count > 0) {
          p.rating = Math.round((totalRating / count) * 10) / 10;
          p.reviews = count;
        }

        setProduct(p);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 flex justify-center">
        <Loader2 className="animate-spin text-[#124756]" size={36} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-center">
        <p className="text-gray-500 text-lg">Produk tidak ditemukan.</p>
        <Link to="/katalog" className="mt-4 inline-block text-[#124756] hover:underline text-sm">
          ← Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const total = product.price * days * qty;
  const waMessage = encodeURIComponent(
    `Halo CAMPORA! Saya ingin menyewa *${product.name}* sebanyak *${qty} unit* selama *${days} hari*. Total: Rp ${total.toLocaleString('id-ID')}. Mohon informasi lebih lanjut.`
  );

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-8">

      <Link to="/katalog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft size={16} /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        <div className="rounded-3xl overflow-hidden shadow-md h-[350px] md:h-[460px] bg-gray-100">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">Tidak ada gambar</div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block bg-[#e5f5ed] text-[#1a8b5e] text-xs px-3 py-1 rounded-full font-medium">
              {product.category}
            </span>
            {stokTersedia !== null && (
              stokTersedia > 0 ? (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-medium border border-green-200">
                  <Package size={11} />
                  Tersedia: {stokTersedia} dari {stokTotal}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full font-medium border border-red-200">
                  <Package size={11} />
                  Stok Habis
                </span>
              )
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-gray-800">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-500">{product.reviews} ulasan</span>
          </div>

          <div>
            <p className="text-3xl font-bold text-gray-900">
              Rp {product.price.toLocaleString('id-ID')}{' '}
              <span className="text-base text-gray-400 font-normal">/ hari</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Harga sudah termasuk perawatan dan asuransi</p>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-4">
            {/* Durasi Sewa */}
            <div>
              <p className="text-sm text-gray-600 mb-3">Durasi Sewa (Hari)</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xl font-semibold text-gray-900 w-8 text-center">{days}</span>
                <button
                  onClick={() => setDays(days + 1)}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Jumlah Barang */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Jumlah Barang
                {stokTersedia !== null && (
                  <span className="ml-2 text-xs text-gray-400">(maks. {stokTersedia} unit)</span>
                )}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xl font-semibold text-gray-900 w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(stokTersedia ?? 99, qty + 1))}
                  disabled={(stokTersedia !== null && qty >= stokTersedia) || stokTersedia === 0}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total ({qty} unit × {days} hari):</span>
              <span className="font-semibold text-[#124756]">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <a
            href={`https://wa.me/6285736292760?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#219653] text-white py-3.5 rounded-2xl text-sm font-medium hover:bg-[#1a7a44] transition-colors"
          >
            <WhatsAppIcon className="w-5 h-5 text-white" />
            Hubungi Admin
          </a>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-3">
              <Check size={20} className="text-[#219653]" />
              <span className="text-xs text-gray-600 text-center">Kondisi Prima</span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-blue-50 rounded-xl p-3">
              <Shield size={20} className="text-blue-500" />
              <span className="text-xs text-gray-600 text-center">Asuransi</span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-orange-50 rounded-xl p-3">
              <Zap size={20} className="text-orange-500" />
              <span className="text-xs text-gray-600 text-center">Fast Respon</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Fitur &amp; Spesifikasi</h2>
          <ul className="flex flex-col gap-3">
            {(product.features ?? []).map((feat) => (
              <li key={feat} className="flex items-center gap-2.5">
                <Check size={16} className="text-[#219653] shrink-0" />
                <span className="text-sm text-gray-700">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Deskripsi Produk</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Brand</h2>
            <span className="inline-block bg-gray-100 text-gray-700 text-sm px-4 py-1.5 rounded-full">
              {product.brand ?? 'N/A'}
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}
