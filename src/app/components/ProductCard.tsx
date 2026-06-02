
import { Link } from 'react-router';
import { Star } from 'lucide-react';
import type { Product } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  Tenda: 'bg-emerald-100 text-emerald-700',
  Carrier: 'bg-blue-100 text-blue-700',
  'Sleeping Bag': 'bg-purple-100 text-purple-700',
  Perlengkapan: 'bg-yellow-100 text-yellow-700',
};

interface Props {
  product: Product;
  variant?: 'grid' | 'scroll';
}

export function ProductCard({ product, variant = 'grid' }: Props) {
  const isScroll = variant === 'scroll';

  const cardClass = isScroll
    ? 'snap-start shrink-0 w-56 md:w-64 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow'
    : 'bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group';

  return (
    <Link to={`/katalog/${product.id}`} className={cardClass}>
      <div className={`relative overflow-hidden bg-gray-100 ${isScroll ? 'h-40' : 'h-52'}`}>
        {!isScroll && product.available && (
          <span className="absolute top-2 left-2 z-10 text-xs bg-[#e5f5ed] text-[#1a8b5e] px-2 py-0.5 rounded-full font-medium">
            Tersedia
          </span>
        )}
        {isScroll && (
          <span className="absolute top-2 left-2 z-10 text-[10px] bg-[#d9d9d9] text-[#525252] px-2 py-0.5 rounded-full font-medium tracking-wide">
            POPULER
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-3.5">
        <span
          className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-1.5 ${
            isScroll
              ? 'bg-[#d9d9d9] text-[#525252]'
              : (CATEGORY_COLORS[product.category] ?? 'bg-gray-100 text-gray-600')
          }`}
        >
          {product.category}
        </span>

        <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1.5">{product.name}</p>

        <p className="text-sm font-semibold text-gray-900 mb-2">
          Rp {product.price.toLocaleString('id-ID')}{' '}
          <span className="text-xs text-gray-400 font-normal">/ hari</span>
        </p>

        <div className="border-t border-black/10 mb-2" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-700 font-medium">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
          {isScroll ? (
            <span className="text-[10px] text-[#525252] bg-[#d9d9d9] px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              {product.brand ?? ''}
            </span>
          ) : (
            <span className="text-xs text-[#124756] font-medium hover:underline">Sewa</span>
          )}
        </div>
      </div>
    </Link>
  );
}
