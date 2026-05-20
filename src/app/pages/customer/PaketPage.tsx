/**
 * @file PaketPage.tsx
 * @description Halaman penawaran paket sewa hemat (bundling) peralatan outdoor untuk berbagai level pendakian atau camping keluarga.
 */

import { Check, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import type { Package } from '../../types';

import imgBasic from '@/images/paket basic camp.png';
import imgFamily from '@/images/paket family .png';
import imgHiking from '@/images/paket hiking.png';

const PACKAGES: Package[] = [
  {
    id: 'basic',
    title: 'PAKET BASIC CAMP SET',
    image: imgBasic,
    description: 'Cocok untuk pemula atau camping ringan 2 orang. Praktis dan mudah dibawa.',
    items: [
      '1x Tenda Kapasitas 2 Orang',
      '2x Sleeping Bag Polar',
      '2x Matras Spons',
      '1x Lampu Tenda',
      '1x Nesting & Kompor Portable',
    ],
    price: 150000,
  },
  {
    id: 'family',
    title: 'PAKET FAMILY CAMP',
    image: imgFamily,
    description: 'Paket premium untuk kenyamanan maksimal liburan keluarga di alam terbuka.',
    items: [
      '1x Tenda Tunnel Kapasitas 6-8P',
      '4x Air Mattress & Pompa',
      '4x Kursi Lipat Premium',
      '1x Meja Lipat Besar',
      'Lampu Hias & Penerangan Ekstra',
    ],
    price: 500000,
    featured: true,
  },
  {
    id: 'hiking',
    title: 'PAKET HIKING',
    image: imgHiking,
    description: 'Peralatan lengkap untuk pendakian gunung tingkat menengah hingga sulit.',
    items: [
      '1x Tenda Dome Double Layer 4P',
      '4x Sleeping Bag Mummy',
      '1x Carrier 60L + Cover',
      '4x Trekking Pole',
      '1x Set Alat Masak Lengkap',
      '2x Headlamp LED',
    ],
    price: 350000,
  },
];

function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article
      className={`bg-white rounded-3xl shadow-md overflow-hidden flex flex-col ${pkg.featured ? 'ring-2 ring-[#219653] shadow-xl' : 'border border-gray-100'
        }`}
    >
      <div className="relative h-52 overflow-hidden">
        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
          {pkg.featured && (
            <span className="absolute top-4 right-4 bg-[#219653] text-white text-xs px-3 py-1 rounded-full font-medium">
              Terpopuler
            </span>
          )}
          <h2 className="text-white font-semibold leading-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
            {pkg.title}
          </h2>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">{pkg.description}</p>

        <ul className="flex flex-col gap-2.5 mb-6 flex-1">
          {pkg.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check size={15} className="text-[#219653] mt-0.5 shrink-0" strokeWidth={2.5} />
              <span className="text-sm text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-100 my-4" />

        <div className="mb-4">
          <span className="text-2xl font-semibold text-gray-900">
            Rp {pkg.price.toLocaleString('id-ID')}
          </span>
          <span className="text-sm text-gray-400 ml-1">/ hari</span>
        </div>

        <a
          href={`https://wa.me/6285736292760?text=${encodeURIComponent(`Halo CAMPORA! Saya tertarik dengan ${pkg.title}. Mohon informasi lebih lanjut.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-colors ${pkg.featured
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>

    </div>
  );
}
