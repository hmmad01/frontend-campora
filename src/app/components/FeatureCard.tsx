/**
 * @file FeatureCard.tsx
 * @description Komponen kartu informasi untuk menampilkan fitur utama (pada HomePage) atau statistik pencapaian (pada TentangPage).
 */

import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  desc: string;
  variant?: 'feature' | 'stat';
}

export function FeatureCard({ icon, title, desc, variant = 'feature' }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
      <div className="w-14 h-14 bg-[#d0fae5] rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      {variant === 'stat' ? (
        <p className="text-3xl font-extrabold text-gray-900 mb-1">{title}</p>
      ) : (
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      )}
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
