
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Search, Filter, ChevronDown, Loader2, PackageX } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { barangApi, kategoriApi, testimoniApi, ketersediaanApi, toProduct, type Kategori } from '../../api';
import type { Product } from '../../types';

const SORT_OPTIONS = ['Terpopuler', 'Harga Terendah', 'Harga Tertinggi', 'Rating Tertinggi'];

export default function KatalogPage() {
  const [searchParams] = useSearchParams();
  const queryKategori = searchParams.get('kategori');

  const getInitialCategory = () => {
    if (!queryKategori) return 'Semua Kategori';
    const lower = queryKategori.toLowerCase();
    if (lower === 'tenda') return 'Tenda';
    if (lower === 'carrier') return 'Carrier';
    if (lower === 'sleeping-bag') return 'Sleeping Bag';
    if (lower === 'perlengkapan') return 'Perlengkapan';
    return 'Semua Kategori';
  };

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(getInitialCategory());
  const [sort, setSort] = useState('Terpopuler');
  const [products, setProducts] = useState<Product[]>([]);
  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (queryKategori) {
      setCategory(getInitialCategory());
    }
  }, [queryKategori]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barangRes, kategoriRes, testimoniRes, todayAvailRes] = await Promise.all([
          barangApi.getAll({ per_page: 100 }),
          kategoriApi.getAll(),
          testimoniApi.getAll(),
          ketersediaanApi.checkToday(),
        ]);

        const availMap: Record<number, boolean> = {};
        for (const a of todayAvailRes) {
          availMap[a.id_barang] = a.tersedia;
        }

        const ratingMap: Record<string, { total: number; count: number }> = {};
        for (const t of testimoniRes.data) {
          if (!t.produk_disewa) continue;
          const key = t.produk_disewa.trim().toLowerCase();
          if (!ratingMap[key]) ratingMap[key] = { total: 0, count: 0 };
          ratingMap[key].total += t.rating;
          ratingMap[key].count += 1;
        }

        const converted = barangRes.data
          .map((b) => {
            const product = toProduct(b);
            if (b.id_barang in availMap) {
              product.available = availMap[b.id_barang];
            } else if (b.stok_total <= 0) {
              product.available = false;
            }
            const key = b.nama_barang.trim().toLowerCase();
            if (ratingMap[key] && ratingMap[key].count > 0) {
              product.rating = Math.round((ratingMap[key].total / ratingMap[key].count) * 10) / 10;
              product.reviews = ratingMap[key].count;
            }
            return product;
          });

        setProducts(converted);
        setKategoris(kategoriRes);
      } catch (err) {
        console.error('Failed to fetch catalog data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const ALLOWED_CATEGORIES = ['Carrier', 'Tenda', 'Sleeping Bag', 'Perlengkapan'];
  const filterCategories = [
    'Semua Kategori',
    ...kategoris
      .map((k) => k.nama_kategori)
      .filter((nama) => ALLOWED_CATEGORIES.includes(nama)),
  ];

  const filtered: Product[] = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'Semua Kategori' || p.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === 'Harga Terendah') return a.price - b.price;
      if (sort === 'Harga Tertinggi') return b.price - a.price;
      if (sort === 'Rating Tertinggi') return b.rating - a.rating;
      return b.reviews - a.reviews; // default: Terpopuler
    });

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">

      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">KATALOG PRODUK SEWA</h1>
        <p className="text-sm text-gray-500 mt-1">Temukan peralatan outdoor yang anda butuhkan</p>
      </header>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter &amp; Pencarian</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Cari Produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#124756] transition-colors bg-gray-50"
            />
          </div>

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#124756] bg-gray-50 min-w-[160px] cursor-pointer"
            >
              {filterCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#124756] bg-gray-50 min-w-[140px] cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#124756]" size={36} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Produk tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>
      )}

    </main>
  );
}
