/**
 * @file ReviewPage.tsx
 * @description Halaman ulasan (reviews) dan testimoni dari pelanggan setia CAMPORA. Menampilkan statistik rating rata-rata serta kartu ulasan.
 */

import { ReviewCard } from '../../components/ReviewCard';
import type { Review } from '../../types';

import imgHero from '@/images/header REVIEW.png';
import imgAvatar1 from '@/images/hammad.png';
import imgAvatar2 from '@/images/raihan.png';
import imgAvatar3 from '@/images/bintang.png';

const REVIEWS: Review[] = [
  {
    id: 1,
    avatar: imgAvatar1,
    name: 'Abdullah Hammad',
    trip: 'Camping Melihat Aurora',
    rating: 5,
    text: '"Nyewa di sini enak, nggak pake ribet. Tinggal tanya-tanya dikit langsung dibantu. Barangnya juga bersih, kelatan dirawat."',
  },
  {
    id: 2,
    avatar: imgAvatar2,
    name: 'Bintang Fatahillah',
    trip: 'Pendakian Gunung Bokong',
    rating: 5,
    text: '"Peralatannya lengkap dan kondisinya bagus. Proses sewa juga gampang, tinggal cek di website terus langsung hubungi lewat WhatsApp. Pelayanannya cepat dan responsif."',
  },
];

export default function ReviewPage() {
  return (
    <div className="w-full">
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center mb-12">

          <div className="lg:col-span-1 flex flex-col gap-5">
            <h1 className="font-work text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              MENJADI KEPERCAYAAN &amp; FAVORIT ORANG{' '}
              <span className="text-[#124756]">100K+</span>
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              "Mulai dari pendakian santai hingga trip penuh tantangan, setiap pelanggan punya cerita
              tersendiri—dan di sinilah mereka berbagi pengalaman setelah menggunakan layanan kami."
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="bg-[#124756]/10 rounded-full px-4 py-1.5 text-xs text-[#124756] font-medium">
                ⭐ 4.9 / 5.0 Rating
              </div>
              <div className="bg-[#124756]/10 rounded-full px-4 py-1.5 text-xs text-[#124756] font-medium">
                10,000+ Ulasan
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex justify-center">
            <div className="rounded-3xl overflow-hidden shadow-lg w-full max-w-md h-[460px]">
              <img src={imgHero} alt="CAMPORA Customer" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-5">
            {REVIEWS.slice(0, 2).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

        {REVIEWS.length > 2 && (
          <>
            <div className="text-center mb-8">
              <span className="font-work inline-block bg-[#124756] text-white text-xs px-4 py-1.5 rounded-full tracking-wide">
                SEMUA ULASAN
              </span>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-3">
                Apa Kata Pelanggan Kami?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {REVIEWS.slice(2).map((review) => (
                <ReviewCard key={`bottom-${review.id}`} review={review} />
              ))}
            </div>
          </>
        )}

      </section>
    </div>
  );
}
