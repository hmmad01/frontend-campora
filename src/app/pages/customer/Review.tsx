
import { useState, useEffect, useRef } from 'react';
import { Star, Quote, X, Plus, Send, ImagePlus, Loader2, CheckCircle, ChevronDown } from 'lucide-react';
import { testimoniApi, barangApi, type TestimoniItem } from '../../api';

import imgHero from '@/images/header REVIEW.png';


const poppins = { fontFamily: "'Poppins', sans-serif" } as const;

function nameToColor(name: string): string {
  const colors = [
    '#124756', '#2F855A', '#B7791F', '#6B46C1', '#C05621',
    '#2C7A7B', '#97266D', '#285E61',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ src, name, size = 36 }: { src?: string | null; name: string; size?: number }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  if (src) {
    return (
      <img
        src={src.startsWith('/') ? `http://localhost:8000${src}` : src}
        alt={name}
        className="w-full h-full object-cover"
        style={{ width: size, height: size }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center font-semibold text-white text-[11px] rounded-[8px]"
      style={{ width: size, height: size, background: nameToColor(name) }}
    >
      {initials}
    </div>
  );
}


function TestimoniCard({ item }: { item: TestimoniItem }) {
  const { nama_customer, isi_review, rating, foto_customer } = item;

  return (
    <div className="relative">
      <div className="relative bg-white rounded-[16px] border border-black/20 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] p-5 min-h-[220px] flex flex-col">
        {/* Quote icon */}
        <div className="w-8 h-8 rounded-[8px] bg-[#D0FAE5] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] flex items-center justify-center">
          <Quote className="w-3.5 h-3.5 text-[#87D659]" fill="#87D659" />
        </div>

        {/* Review text */}
        <p
          className="mt-3 px-0.5 italic text-black w-full text-[12px] font-medium [word-break:break-word] leading-normal"
          style={poppins}
        >
          &ldquo;{isi_review}&rdquo;
        </p>

        {/* Stars */}
        <div className="mt-2.5 flex items-center gap-0.5">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-[14px] h-[14px] text-yellow-400 drop-shadow-[0px_2px_2px_rgba(0,0,0,0.15)]" fill="#FACC15" />
          ))}
        </div>

        {/* Author */}
        <div className="mt-auto pt-3 flex items-center gap-[8px]">
          <div className="w-9 h-9 rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] overflow-hidden shrink-0">
            <Avatar src={foto_customer} name={nama_customer} size={36} />
          </div>
          <div className="flex flex-col gap-[2px] font-medium" style={poppins}>
            <p className="text-[11px] text-black leading-tight">{nama_customer}</p>
            {item.produk_disewa && (
              <p className="text-[10px] text-black/50 leading-tight">{item.produk_disewa}</p>
            )}
            {item.kegiatan && (
              <p className="text-[10px] text-[#055f08] leading-tight">{item.kegiatan}</p>
            )}
          </div>
        </div>
      </div>
      {/* Speech bubble triangle */}
      <div
        className="absolute -bottom-[10px] left-8 w-[20px] h-[12px] bg-white"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          filter: 'drop-shadow(0px 3px 1.5px rgba(0,0,0,0.15))',
        }}
      />
    </div>
  );
}


interface ReviewFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

function ReviewFormModal({ onClose, onSuccess }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [produk, setProduk] = useState('');
  const [kegiatan, setKegiatan] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [productList, setProductList] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    barangApi.getAll({ per_page: 100 }).then((res) => {
      setProductList(res.data.map((b) => b.nama_barang));
    }).catch(() => {});
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;
    setSubmitting(true);
    try {
      await testimoniApi.submitByCustomer({
        nama_customer: name.trim(),
        rating,
        isi_review: quote.trim(),
        produk_disewa: produk || undefined,
        kegiatan: kegiatan.trim() || undefined,
        foto: avatarFile ?? null,
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim review. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className="relative bg-white rounded-[20px] w-full max-w-[400px] p-8 shadow-2xl text-center"
          style={poppins}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-[20px] font-semibold text-gray-900 mb-2">Review Terkirim!</h3>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            Terima kasih telah berbagi pengalamanmu bersama CAMPORA!
            Review kamu sedang menunggu persetujuan admin dan akan segera muncul di halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white rounded-[20px] w-full max-w-[480px] p-6 shadow-2xl animate-[fadeIn_0.3s_ease-out]"
        style={poppins}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-gray-600" />
        </button>

        <h3 className="text-[20px] font-semibold text-gray-900 mb-1">Tulis Review</h3>
        <p className="text-[12px] text-gray-500 mb-5">Bagikan pengalaman petualanganmu bersama CAMPORA</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Rating */}
          <div>
            <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    className={`transition-colors ${
                      star <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-[12px] text-gray-500">{rating}/5</span>
            </div>
          </div>

          {/* Avatar upload + Name in a row */}
          <div className="flex items-end gap-4">
            <div className="shrink-0">
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Foto (opsional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-[60px] h-[60px] rounded-xl border-2 border-dashed border-gray-300 hover:border-[#124756] flex items-center justify-center overflow-hidden transition-colors bg-gray-50 hover:bg-gray-100 group"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus size={22} className="text-gray-400 group-hover:text-[#124756] transition-colors" />
                )}
              </button>
            </div>

            {/* Name */}
            <div className="flex-1">
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Nama *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama kamu"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-[13px] focus:outline-none focus:border-[#124756] focus:ring-1 focus:ring-[#124756]/20 transition-colors"
              />
            </div>
          </div>

          {/* Produk & Kegiatan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Produk yang disewa</label>
              <div className="relative">
                <select
                  value={produk}
                  onChange={(e) => setProduk(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-9 rounded-xl border border-gray-300 text-[13px] focus:outline-none focus:border-[#124756] focus:ring-1 focus:ring-[#124756]/20 transition-colors bg-white cursor-pointer"
                >
                  <option value="">-- Pilih produk --</option>
                  {productList.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Kegiatan / Trip</label>
              <input
                type="text"
                value={kegiatan}
                onChange={(e) => setKegiatan(e.target.value)}
                placeholder="e.g. Camping di Bromo"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-[13px] focus:outline-none focus:border-[#124756] focus:ring-1 focus:ring-[#124756]/20 transition-colors"
              />
            </div>
          </div>

          {/* Review text */}
          <div>
            <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Ulasan *</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Ceritakan pengalamanmu menyewa di CAMPORA..."
              required
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-[13px] focus:outline-none focus:border-[#124756] focus:ring-1 focus:ring-[#124756]/20 transition-colors resize-none"
            />
          </div>

          {/* Info note */}
          <p className="text-[11px] text-gray-400 -mt-1">
            ℹ️ Review kamu akan muncul setelah disetujui oleh admin kami.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#124756] text-white py-3 rounded-xl text-[14px] font-medium hover:bg-[#0e3a47] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {submitting ? 'Mengirim...' : 'Kirim Review'}
          </button>
        </form>
      </div>
    </div>
  );
}


export default function ReviewPage() {
  const [reviews, setReviews] = useState<TestimoniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await testimoniApi.getAll();
      setReviews(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="w-full" style={poppins}>
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">

        {/* ── Header area: 3 column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center mb-14">

          {/* Left column: headline + button */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <h1 className="font-work text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              MENJADI KEPERCAYAAN &amp; FAVORIT ORANG{' '}
              <span className="text-[#124756]">100K+</span>
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              &ldquo;Mulai dari pendakian santai hingga trip penuh tantangan, setiap pelanggan punya cerita
              tersendiri—dan di sinilah mereka berbagi pengalaman setelah menggunakan layanan kami.&rdquo;
            </p>

            {/* Stats badges */}
            <div className="flex flex-wrap gap-3 mt-1">
              <div className="bg-[#124756]/10 rounded-full px-4 py-1.5 text-xs text-[#124756] font-medium">
                ⭐ {averageRating} / 5.0 Rating
              </div>
              <div className="bg-[#124756]/10 rounded-full px-4 py-1.5 text-xs text-[#124756] font-medium">
                {reviews.length.toLocaleString('id-ID')}+ Ulasan
              </div>
            </div>

            {/* Tulis Review Button */}
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 self-start flex items-center gap-2 bg-[#124756] text-white px-6 py-3 rounded-full text-[14px] font-medium hover:bg-[#0e3a47] active:scale-95 transition-all shadow-lg shadow-[#124756]/25"
            >
              <Plus size={18} strokeWidth={2.5} />
              Tulis Review
            </button>
          </div>

          {/* Center column: hero image */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="rounded-3xl overflow-hidden shadow-lg w-full max-w-md h-[460px]">
              <img src={imgHero} alt="CAMPORA Customer" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right column: scrollable review cards */}
          <div className="lg:col-span-1 flex flex-col gap-6 max-h-[460px] overflow-y-auto pr-2 scrollbar-hide">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 size={32} className="animate-spin text-[#124756]/50" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                Belum ada review. Jadilah yang pertama!
              </div>
            ) : (
              reviews.map((r) => (
                <TestimoniCard key={r.id_testimoni} item={r} />
              ))
            )}
          </div>
        </div>

      </section>

      {/* ── Review Form Modal ── */}
      {showForm && (
        <ReviewFormModal
          onClose={() => setShowForm(false)}
          onSuccess={fetchReviews}
        />
      )}
    </div>
  );
}
