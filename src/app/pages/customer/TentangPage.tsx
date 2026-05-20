/**
 * @file TentangPage.tsx
 * @description Halaman "Tentang Kami" yang menjelaskan profil CAMPORA, cerita pendirian, komitmen layanan, peta lokasi fisik, dan statistik kepuasan pelanggan.
 */

import { Users, Star, Shield, Clock } from 'lucide-react';
import { FeatureCard } from '../../components/FeatureCard';

import imgHero from '@/images/header tentang kami.png';
import imgStory from '@/images/tentang kami.png';

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const STATS: Stat[] = [
  { value: '10K+', label: 'Pelanggan Dilayani', icon: <Users size={28} className="text-[#009966]" /> },
  { value: '98%', label: 'Rating Kepuasan Pelanggan', icon: <Star size={28} className="text-[#009966]" /> },
  { value: '50+', label: 'Peralatan Premium', icon: <Shield size={28} className="text-[#009966]" /> },
  { value: '24/7', label: 'Siap Respon', icon: <Clock size={28} className="text-[#009966]" /> },
];

export default function TentangPage() {
  return (
    <div className="w-full">

      <section className="relative w-full h-[280px] md:h-[360px] flex items-center justify-center overflow-hidden">
        <img src={imgHero} alt="Tentang CAMPORA" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-widest mb-4">
            TENTANG CAMPORA
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Platform rental peralatan outdoor terlengkap dan terpercaya di Malang.
            Kami ada untuk mempermudah petualangan Anda.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          <div>
            <span className="font-work inline-block bg-[#124756] text-white text-xs px-5 py-2 rounded-full mb-6 tracking-wide">
              Cerita Kami
            </span>

            <div className="float-right ml-5 mb-4 bg-white border border-black/20 rounded-2xl shadow-sm px-4 py-3 w-48">
              <p className="text-[#124756] text-xs font-semibold mb-1">KOMITMEN KAMI :</p>
              <p className="text-xs text-black/70 text-center leading-relaxed">
                Menyediakan peralatan higienis, terawat, dan berstandar keamanan internasional.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug mb-5">
              Berawal dari hobi, kini menjadi solusi.
            </h2>

            <div className="flex flex-col gap-4 clear-right">
              <p className="text-sm text-gray-700 leading-relaxed">
                Didirikan pada tahun 2026 oleh sekelompok pecinta alam yang sering kesulitan menemukan
                peralatan berkualitas untuk mendaki. CAMPORA lahir dari keinginan untuk membuat aktivitas
                outdoor lebih mudah diakses oleh siapa saja.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Kami percaya bahwa setiap orang berhak menikmati keindahan alam Indonesia tanpa harus
                pusing memikirkan mahalnya biaya membeli perlengkapan atau kesulitan menyimpannya di rumah.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Visi kami adalah menjadi ekosistem pendukung aktivitas outdoor terbaik yang tidak hanya
                menyediakan alat, namun juga edukasi dan komunitas.
              </p>
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden shadow-md h-56 md:h-64">
              <iframe
                title="Lokasi CAMPORA"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.4646738597036!2d112.6133273108118!3d-7.950853579185244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78827929a78c1d%3A0x673322d64f0f0326!2sJl.%20Veteran%2C%20Malang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1714800000000!5m2!1sid!2sid"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Jl.+Veteran+No.+12-14,+Ketawanggede,+Lowokwaru,+Malang"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 mt-3"
            >
              <p className="text-xs text-gray-500 leading-relaxed group-hover:text-[#124756] transition-colors">
                Jl. Veteran No. 12–14, Ketawanggede, Kec. Lowokwaru, Kota Malang, Jawa Timur, Indonesia
              </p>
              <span className="text-[10px] font-medium text-[#124756] underline decoration-dotted underline-offset-2">
                Buka di Google Maps →
              </span>
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-lg h-[520px] md:h-[700px]">
            <img src={imgStory} alt="CAMPORA Story" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <FeatureCard
                key={stat.value}
                icon={stat.icon}
                title={stat.value}
                desc={stat.label}
                variant="stat"
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
