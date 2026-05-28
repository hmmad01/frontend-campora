/**
 * @file ReviewPage.tsx
 * @description Halaman ulasan (reviews) dan testimoni dari pelanggan setia CAMPORA.
 *              Menampilkan statistik rating, kartu review (style sama seperti di beranda),
 *              serta form untuk customer menambah review baru.
 */

import { useState, useRef } from 'react';
import { Star, Quote, X, Plus, Send, ImagePlus } from 'lucide-react';

import imgHero from '@/images/header REVIEW.png';
import imgAvatar1 from '@/images/hammad.png';
import imgAvatar2 from '@/images/raihan.png';
import imgAvatar3 from '@/images/bintang.png';
import imgAvatar4 from '@/images/nathan.png';

// ── Data ─────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  product: string;
  activity: string;
  avatar: string;
  rating: number;
}

const INITIAL_REVIEWS: Testimonial[] = [
  {
    id: 1,
    quote: 'Nyewa di sini enak, nggak pake ribet. Tinggal tanya-tanya dikit langsung dibantuin. Barangnya juga bersih, keliatan dirawat.',
    name: 'Abdulloh Hammad',
    product: 'Sleeping Bag Standar',
    activity: 'Camping Melihat Aurora',
    avatar: imgAvatar1,
    rating: 5,
  },
  {
    id: 2,
    quote: 'Peralatannya lengkap dan kondisinya bagus. Proses sewa juga gampang, tinggal cek di website terus langsung hubungi lewat WhatsApp. Pelayanannya cepat dan responsif.',
    name: 'Bintang Fatahillah',
    product: 'Tenda Family 6 Orang',
    activity: 'Pendakian Gunung Bokong',
    avatar: imgAvatar3,
    rating: 5,
  },
  {
    id: 3,
    quote: 'Enak sih nyewanya, tinggal chat langsung beres. Nentuin tanggal juga gampang, jadi nggak ribet. Kemarin sewa tenda sama sleeping bag, semuanya oke dipake.',
    name: 'Nathanael Eleazar',
    product: 'Cooking Set',
    activity: 'Camping di Gunung Buthak',
    avatar: imgAvatar4,
    rating: 5,
  },
  {
    id: 4,
    quote: 'Enak banget buat yang nggak mau ribet prepare alat sendiri. Tinggal sewa, semua udah siap. Kemarin gue pake buat seharian dan semuanya aman. Balikin juga gampang, nggak dipersulit.',
    name: 'Raihan Ferriand',
    product: 'Adventurer',
    activity: 'Hiking di Kawah Idjen',
    avatar: imgAvatar2,
    rating: 5,
  },
];

const poppins = { fontFamily: "'Poppins', sans-serif" } as const;

// ── TestimoniCard (sama persis seperti di beranda) ───────────────────────────

function TestimoniCard({ quote, name, product, activity, avatar, rating }: Omit<Testimonial, 'id'>) {
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
          &ldquo;{quote}&rdquo;
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
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-[2px] font-medium" style={poppins}>
            <p className="text-[11px] text-black leading-tight">{name}</p>
            <p className="text-[10px] text-black/50 leading-tight">{product}</p>
            <p className="text-[10px] text-[#055f08] leading-tight">{activity}</p>
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

// ── Review Form Modal ────────────────────────────────────────────────────────

interface ReviewFormProps {
  onClose: () => void;
  onSubmit: (review: Testimonial) => void;
  nextId: number;
}

function ReviewFormModal({ onClose, onSubmit, nextId }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [activity, setActivity] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    onSubmit({
      id: nextId,
      quote: quote.trim(),
      name: name.trim(),
      product: product.trim() || '-',
      activity: activity.trim() || '-',
      avatar: avatarPreview,
      rating,
    });
    onClose();
  };

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
            {/* Image upload */}
            <div className="shrink-0">
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Foto</label>
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

          {/* Product & Activity in a row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Produk yang disewa</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Tenda 4 Orang"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-[13px] focus:outline-none focus:border-[#124756] focus:ring-1 focus:ring-[#124756]/20 transition-colors"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-gray-700 mb-1.5 block">Kegiatan / Trip</label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#124756] text-white py-3 rounded-xl text-[14px] font-medium hover:bg-[#0e3a47] transition-colors flex items-center justify-center gap-2"
          >
            <Send size={15} />
            Kirim Review
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Halaman Utama ────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Testimonial[]>(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState(false);

  const handleAddReview = (review: Testimonial) => {
    setReviews((prev) => [review, ...prev]);
  };

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="w-full" style={poppins}>
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">

        {/* ── Header area: 3 column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center mb-14">

          {/* Left column: headline + button */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <h1 className="font-work text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              MENJADI KEPERCAYAAN & FAVORIT ORANG{' '}
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

            {/* ── Tulis Review Button ── */}
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
            {reviews.map((review) => (
              <TestimoniCard key={review.id} {...review} />
            ))}
          </div>
        </div>

      </section>

      {/* ── Review Form Modal ── */}
      {showForm && (
        <ReviewFormModal
          onClose={() => setShowForm(false)}
          onSubmit={handleAddReview}
          nextId={reviews.length + 1}
        />
      )}
    </div>
  );
}
