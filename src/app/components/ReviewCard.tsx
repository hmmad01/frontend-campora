/**
 * @file ReviewCard.tsx
 * @description Komponen kartu testimoni/ulasan (ReviewCard) pelanggan. Menampilkan avatar, nama, jenis trip/kegiatan, rating bintang, dan isi ulasan tertulis.
 */

import { Star } from 'lucide-react';
import type { Review } from '../types';

interface Props {
  review: Review;
}

export function ReviewCard({ review }: Props) {
  return (
    <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-11 h-11 rounded-full object-cover shrink-0"
          loading="lazy"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{review.name}</p>
          <p className="text-xs text-[#219653]">{review.trip}</p>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>

      <p className="text-sm text-gray-600 italic leading-relaxed flex-1">{review.text}</p>
    </article>
  );
}
