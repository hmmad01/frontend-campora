/**
 * @file HomePage.tsx
 * @description Halaman utama (Home) aplikasi CAMPORA yang menyajikan hero banner, kategori produk, produk terpopuler, alasan memilih CAMPORA, alur pemesanan (cara sewa), dan testimoni pelanggan.
 *              Produk populer dimuat dari backend API.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Shield, Star, Clock, Package, Award, ShoppingBag, Search, CalendarDays, MessageCircle, MapPin, ThumbsUp, Quote, Tent, Backpack, Flame, Compass, Loader2 } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { barangApi, toProduct, testimoniApi, ketersediaanApi, type TestimoniItem } from '../../api';
import type { Product } from '../../types';

import imgTenda from '@/images/logo tenda.png';
import imgCarrier from '@/images/logo carrier.png';
import imgSleeping from '@/images/sleeping bag.png';
import imgPerlengkapan from '@/images/logo perlengkapan.png';

import imgHikingIcon from '@/images/orang berjalan.png';
import imgGunung from '@/images/hero.png';

interface FeatureCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, iconBg, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[#fafafa] rounded-[20px] p-6 flex flex-col items-start gap-3 border border-black/10 shadow-[0_4px_4px_rgba(0,0,0,0.1)] min-h-[202px]">
      <div className="w-[61px] h-[61px] rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <p className="text-black text-[16px] font-medium font-['Poppins']">{title}</p>
      <p className="text-black/50 text-[10px] leading-snug font-['Poppins']">{description}</p>
    </div>
  );
}

interface CategoryCardProps {
  image: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

function CategoryCard({ image, icon, label, href }: CategoryCardProps) {
  return (
    <Link to={href} className="relative rounded-[20px] overflow-hidden group cursor-pointer shadow-[0px_4px_10px_rgba(0,0,0,0.25)] h-[221px] block">
      <img src={image} alt={label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 blur-[0.5px]" />
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 transition-all duration-300" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="w-[52px] h-[52px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center">
          {icon}
        </div>
        <p className="text-white text-center drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] font-['Poppins'] font-semibold text-[clamp(24px,3vw,40px)] tracking-[0.02em]">{label}</p>
      </div>
    </Link>
  );
}

const categories = [
  { image: imgTenda, icon: <Tent size={36} className="text-white" />, label: "TENDA", href: "/katalog?kategori=tenda" },
  { image: imgCarrier, icon: <Backpack size={36} className="text-white" />, label: "CARRIER", href: "/katalog?kategori=carrier" },
  { image: imgSleeping, icon: <Flame size={36} className="text-white" />, label: "SLEEPING BAG", href: "/katalog?kategori=sleeping-bag" },
  { image: imgPerlengkapan, icon: <Compass size={36} className="text-white" />, label: "PERLENGKAPAN", href: "/katalog?kategori=perlengkapan" },
];

export function KategoriProduk() {
  return (
    <section className="bg-white/60 py-10">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-black font-['Poppins'] text-[36px] font-semibold leading-[1.1]">KATEGORI</h2>
            <h2 className="text-[#124756] font-['Poppins'] text-[36px] font-semibold leading-[1.1]">PRODUK :</h2>
            <p className="text-black/40 mt-1 font-['Poppins'] text-[11px]">temukan peralatan sesuai kebutuhan anda</p>
          </div>
          <Link to="/katalog" className="bg-[#124756] text-white px-5 py-2 rounded-full text-[14px] shrink-0 font-['Poppins'] -mt-3">Kebutuhanmu</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => <CategoryCard key={cat.label} {...cat} />)}
        </div>
      </div>
    </section>
  );
}

const features = [
  { iconBg: "#d0fae5", icon: <Shield size={28} className="text-[#124756]" strokeWidth={2} />, title: "Peralatan Terjamin", description: "Semua peralatan dalam kondisi baik dan terawat dengan standar kualitas tinggi." },
  { iconBg: "#d0fae5", icon: <Award size={28} className="text-[#8200DB]" strokeWidth={2} />, title: "Terpercaya", description: "Dipercaya oleh ribuan petualang Indonesia sejak 2026." },
  { iconBg: "#d0fae5", icon: <Clock size={28} className="text-[#BB4D00]" strokeWidth={2} />, title: "Sewa Fleksibel", description: "Pilih durasi sewa sesuai kebutuhan, sistem booking yang mudah." },
  { iconBg: "#d0fae5", icon: <ShoppingBag size={28} className="text-[#1447E6]" strokeWidth={2} />, title: "Pilihan Lengkap", description: "Mulai dari tenda, carrier, sampai perlengkapan kecil tersedia semua." },
];


export function KenapaMemilih() {
  return (
    <section className="py-12 bg-white/60">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          <div className="bg-[#124756] text-white px-5 py-1.5 rounded-full text-[12px] font-['Work_Sans']">Kenapa Memilih Kami</div>
          <h2 className="text-black text-[32px] font-semibold font-['Poppins']">KENAPA MEMILIH CAMPORA?</h2>
          <p className="text-black/50 max-w-[540px] text-[15px] font-['Poppins']">Platform rental peralatan outdoor terlengkap dan terpercaya di Indonesia</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => <FeatureCard key={i} {...feature} />)}
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  stepNumber: number;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

function StepCard({ stepNumber, icon, iconBg, title, description }: StepCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-5 relative flex flex-row lg:flex-col gap-4 lg:gap-3 flex-1 border border-black/10 shadow-[0_4px_4px_rgba(0,0,0,0.1)] lg:min-h-[209px]">
      <div className="absolute -top-3 lg:-top-3.5 -right-3 lg:-right-3.5 w-[28px] h-[28px] rounded-full bg-[#124756] text-white flex items-center justify-center z-10 text-[13px] font-semibold font-['Poppins']">
        {stepNumber}
      </div>
      <div className="w-[51px] h-[51px] rounded-[10px] flex items-center justify-center shrink-0 lg:drop-shadow-[0_4px_2px_rgba(0,0,0,0.2)]" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div className="flex-1 lg:mt-1 flex flex-col lg:gap-2">
        <p className="text-black text-[14px] font-medium leading-[1.3] font-['Poppins'] mb-1 lg:mb-0">{title}</p>
        <p className="text-black/50 text-[11px] lg:text-[10px] leading-snug font-['Poppins']">{description}</p>
      </div>
    </div>
  );
}

const steps = [
  { stepNumber: 1, iconBg: "#d0fae5", icon: <Search size={26} className="text-[#124756]" strokeWidth={2} />, title: "Pilih Peralatan", description: "Jelajahi katalog peralatan outdoor kami dan pilih yang sesuai kebutuhan petualanganmu." },
  { stepNumber: 2, iconBg: "#dbeafe", icon: <CalendarDays size={26} className="text-[#008dd2]" strokeWidth={2} />, title: "Tentukan Jadwal", description: "Pilih tanggal pengambilan dan pengembalian sesuai rencana perjalanan Anda." },
  { stepNumber: 3, iconBg: "#fce7f3", icon: <MessageCircle size={26} className="text-[#e91e8c]" strokeWidth={2} />, title: "Hubungi Admin", description: "Konfirmasi pesananmu melalui WhatsApp atau platform komunikasi lainnya." },
  { stepNumber: 4, iconBg: "#fff7ed", icon: <MapPin size={26} className="text-[#BB4D00]" strokeWidth={2} />, title: "Ambil di Lokasi", description: "Datang ke lokasi kami dan ambil peralatan yang sudah kamu pesan." },
  { stepNumber: 5, iconBg: "#d0fae5", icon: <ThumbsUp size={26} className="text-[#16a34a]" strokeWidth={2} />, title: "Nikmati Petualangan", description: "Saatnya memulai petualangan! Kembalikan peralatan sesuai jadwal yang disepakati." },
];

export function CaraSewa() {
  return (
    <section className="py-12 bg-[#f5f5f5]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col items-center gap-4 mb-12 text-center">
          <div className="bg-[#124756] text-white px-5 py-1.5 rounded-full text-[14px] font-['Work_Sans']">Cara Kerja</div>
          <h2 className="text-black text-[32px] font-semibold font-['Poppins']">CARA SEWA DI CAMPORA</h2>
          <p className="text-black/50 max-w-[560px] text-[15px] font-['Poppins']">Proses penyewaan yang mudah dan cepat dalam 4 langkah sederhana</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 lg:gap-6 relative">
          <div className="hidden lg:block absolute top-[37px] left-[60px] right-[60px] h-[1px] bg-black/10 z-0" />
          {steps.map((step, i) => <StepCard key={i} {...step} />)}
        </div>
      </div>
    </section>
  );
}

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

interface Testimonial {
  quote: string;
  name: string;
  product: string;
  activity: string;
  avatarUrl?: string | null;
}

function TestimoniCard({ quote, name, product, activity, avatarUrl }: Testimonial) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="relative w-[320px] shrink-0">
      <div className="relative bg-white rounded-[16px] border border-black/20 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] p-4 h-[220px] flex flex-col">
        <div className="w-8 h-8 rounded-[8px] bg-[#D0FAE5] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] flex items-center justify-center">
          <Quote className="w-3.5 h-3.5 text-[#87D659]" fill="#87D659" />
        </div>
        <p className="mt-3 px-0.5 italic text-black w-full text-[11px] font-medium [word-break:break-word] leading-normal line-clamp-4" style={poppins}>“{quote}”</p>
        <div className="mt-2.5 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-[14px] h-[14px] text-yellow-400 drop-shadow-[0px_2px_2px_rgba(0,0,0,0.15)]" fill="#FACC15" />
          ))}
        </div>
        <div className="mt-auto flex items-center gap-[8px]">
          <div className="w-8 h-8 rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] overflow-hidden shrink-0 flex items-center justify-center bg-gray-100">
            {avatarUrl ? (
              <img
                src={avatarUrl.startsWith('/') ? `http://localhost:8000${avatarUrl}` : avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-semibold text-white text-[10px] select-none"
                style={{ background: nameToColor(name), width: 32, height: 32 }}
              >
                {initials}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[2px] font-medium" style={poppins}>
            <p className="text-[9px] text-black leading-tight">{name}</p>
            {product && <p className="text-[8px] text-black/50 leading-tight">{product}</p>}
            {activity && <p className="text-[8px] text-[#055f08] leading-tight">{activity}</p>}
          </div>
        </div>
      </div>
      <div 
        className="absolute -bottom-[10px] left-8 w-[20px] h-[12px] bg-white" 
        style={{ 
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          filter: 'drop-shadow(0px 3px 1.5px rgba(0,0,0,0.15))'
        }}
      />
    </div>
  );
}

export function TestimoniSection() {
  const [list, setList] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await testimoniApi.getAll();
        if (res.data && res.data.length > 0) {
          setList(res.data.map(item => ({
            quote: item.isi_review,
            name: item.nama_customer,
            product: item.produk_disewa || '',
            activity: item.kegiatan || '',
            avatarUrl: item.foto_customer,
          })));
        }
      } catch (err) {
        console.error('Failed to fetch testimonials', err);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="w-full bg-[#EDFDF6] py-14" style={poppins}>
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center">
        <div className="bg-white rounded-[30px] h-[37px] w-[142px] flex items-center justify-center shadow-sm">
          <p className="text-[#124756] text-[12px] font-medium">Testimoni Pelanggan</p>
        </div>
        <div className="mt-3 flex flex-col items-center gap-[5px] w-[689px] max-w-full text-center">
          <h2 className="text-black text-[30px] font-semibold">APA KATA MEREKA?</h2>
          <p className="text-black/50 text-[14px]">Ribuan petualang telah mempercayai CAMPORA untuk menemani perjalanan mereka</p>
        </div>
        <div className="mt-8 w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-[16px] items-start justify-start lg:justify-center px-2 pb-10 min-w-max mx-auto">
            {list.map((t, idx) => <TestimoniCard key={idx} {...t} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Frame20() {
  return (
    <div className="absolute left-0 right-0 top-[50px] bottom-0"> 
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img 
          alt="" 
          className="absolute w-full h-full object-cover object-top pointer-events-none" 
          src={imgGunung} 
        />
      </div>
    </div>
  );
}

function TulisanKiri() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Poppins'] font-medium items-start leading-[45px] left-[calc(66.67%-27px)] not-italic text-[36px] top-[140px] w-[384px]" data-name="tulisan kiri">
      <p className="h-[41px] relative shrink-0 text-black w-full">
        "Sewa Mudah,
        <br aria-hidden="true" />
        <br aria-hidden="true" />
      </p>
      <p className="h-[41px] relative shrink-0 text-[#124756] w-full">Jelajah Lebih Legah"</p>
    </div>
  );
}

export function HeroSection() {
  return (
    <div className="absolute contents left-[-17px] top-[47px]" data-name="TAMPILAN AWAL">
      {/* Hiking Icon shifted and sized perfectly to match reference image behind "C" */}
      <div className="absolute flex items-center justify-center left-[30px] w-[220px] h-[118px] top-[100px]">
        <div className="opacity-60 relative w-full h-full" data-name="Hiking_Icon">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full" src={imgHikingIcon} />
        </div>
      </div>
      <svg 
        className="absolute left-[110px] top-[174px] overflow-visible select-none pointer-events-none" 
        width="650" 
        height="150" 
        viewBox="0 0 650 150"
      >
        <defs>
          <linearGradient id="camporaFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#124756" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#FFFDFD" stop-opacity="0.2" />
          </linearGradient>
          <filter id="glassTextureShadow" x="-20%" y="-20%" width="145%" height="145%">
            {/* 2x Drop Shadow */}
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.25" result="shadow1" />
            <feDropShadow in="shadow1" dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.20" result="shadow2" />
            
            {/* Glass Specular Reflection */}
            <feSpecularLighting in="SourceAlpha" result="specOut" specularExponent="35" lighting-color="#ffffff">
              <fePointLight x="-5000" y="-10000" z="20000"/>
            </feSpecularLighting>
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" result="lit" />

            {/* Texture Noise Overlay */}
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" result="colorNoise" />
            <feComposite operator="in" in2="lit" result="texturedLit" />
            
            {/* Merge Shadows & Graphic */}
            <feMerge>
              <feMergeNode in="shadow2" />
              <feMergeNode in="texturedLit" />
            </feMerge>
          </filter>
        </defs>
        <text 
          x="10" 
          y="40"
          font-family="'Russo One', sans-serif" 
          font-size="96" 
          font-weight="bold"
          letter-spacing="0.03em"
          fill="url(#camporaFill)" 
          stroke="rgba(0,0,0,0.5)" 
          stroke-width="3" 
          paint-order="stroke fill"
          filter="url(#glassTextureShadow)"
        >
          CAMPORA
        </text>
      </svg>
      <Frame20 />
      <TulisanKiri />
    </div>
  );
}

export default function HomePage() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const [res, todayAvailRes] = await Promise.all([
          barangApi.getAll({ per_page: 20 }),
          ketersediaanApi.checkToday(),
        ]);

        // Build availability map
        const availMap: Record<number, boolean> = {};
        for (const a of todayAvailRes) {
          availMap[a.id_barang] = a.tersedia;
        }

        // Filter out items with no stock today, then take first 5
        const available = res.data
          .filter((b) => {
            if (b.id_barang in availMap) return availMap[b.id_barang];
            return b.is_aktif && b.stok_total > 0;
          })
          .slice(0, 5)
          .map(toProduct);

        setPopularProducts(available);
      } catch (err) {
        console.error('Failed to fetch popular products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchPopular();
  }, []);


  return (
    <div className="w-full">

      <section className="relative w-full h-[904px] overflow-hidden bg-white">
        <HeroSection />
      </section>

      <KategoriProduk />

      <section 
        className="w-full py-12"
        style={{
          backgroundColor: '#b0b5b9',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="font-work inline-block bg-[#124756] text-white text-xs px-4 py-1.5 rounded-full mb-2 tracking-wide">
                PILIHAN FAVORIT
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold text-black">PRODUK POPULER :</h2>
              <p className="text-sm text-black/60 mt-1">Peralatan terbaik yang sering disewa oleh para petualang berpengalaman.</p>
            </div>
            <Link
              to="/katalog"
              className="font-work shrink-0 flex items-center gap-1.5 bg-[#124756] text-white text-xs px-4 py-2 rounded-full hover:bg-[#0e3a47] transition-colors mb-1"
            >
              Lihat Semua <ChevronRight size={13} />
            </Link>
          </div>
          {loadingProducts ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#124756]" size={30} />
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="scroll" />
              ))}
            </div>
          )}
        </div>
      </section>

      <KenapaMemilih />

      <CaraSewa />

      <TestimoniSection />

    </div>
  );
}
