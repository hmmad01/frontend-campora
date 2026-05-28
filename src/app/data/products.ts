/**
 * @file products.ts
 * @description Data tiruan (mock data) untuk katalog produk CAMPORA beserta warna kategori dan opsi filter/pengurutan.
 */

import type { Product } from '../types';

import img01 from '@/images/tenda 2 orang.png';
import img02 from '@/images/head lamp.png';
import img03 from '@/images/tenda 8 orang.png';
import img04 from '@/images/jacket gunung.png';
import img05 from '@/images/snow jacket.png';
import img06 from '@/images/carrier bag 40L.png';
import img07 from '@/images/tenda family 4 orang.png';
import img08 from '@/images/jacket outdoor.png';
import img09 from '@/images/jacket gunung orange.png';
import img10 from '@/images/sleeping bag standar.png';
import img11 from '@/images/sepatu hiking solomon.png';
import img12 from '@/images/carrier 80L.png';
import img13 from '@/images/sleeping bag big.png';
import img14 from '@/images/carrier bag 60L.png';
import img15 from '@/images/jacket outdoor.png';
import img16 from '@/images/trekking pole.png';
import img17 from '@/images/trekking pole.png';
import img18 from '@/images/cooking set.png';
import img19 from '@/images/carrier bag 20L.png';
import img20 from '@/images/sleeping bag standar putih.png';

export const products: Product[] = [
  { id: '1', name: 'Tenda 2 Orang', category: 'Tenda', price: 29000, rating: 4.7, reviews: 124, image: img01, available: true, description: 'Tenda ringan kapasitas 2 orang, mudah dibawa dan dipasang.', features: ['Kapasitas 2 Orang', 'Waterproof', 'Ringan & Kompak', 'Mudah Dipasang'], brand: 'Consina' },
  { id: '2', name: 'Head Lamp', category: 'Perlengkapan', price: 10000, rating: 4.5, reviews: 88, image: img02, available: true, description: 'Lampu kepala LED terang untuk penerangan malam hari.', features: ['LED Terang', 'Tahan Air', 'Baterai Tahan Lama', 'Adjustable Strap'], brand: 'Black Diamond' },
  { id: '3', name: 'Tenda Family 8 Orang', category: 'Tenda', price: 66000, rating: 4.8, reviews: 56, image: img03, available: true, description: 'Tenda luas untuk keluarga besar, kapasitas hingga 8 orang.', features: ['Kapasitas 8 Orang', 'Dua Pintu', 'Ventilasi Baik', 'Waterproof'], brand: 'Eiger' },
  { id: '4', name: 'Jacket Gunung', category: 'Pakaian', price: 20000, rating: 4.5, reviews: 200, image: img04, available: true, description: 'Jaket gunung anti angin dan air untuk pendakian.', features: ['Anti Angin', 'Waterproof', 'Ringan', 'Pockets'], brand: 'The North Face' },
  { id: '5', name: 'Snow Jacket', category: 'Pakaian', price: 30000, rating: 4.8, reviews: 110, image: img05, available: true, description: 'Jaket tebal untuk suhu sangat dingin dan salju.', features: ['Insulated', 'Waterproof', 'Hood', 'Warm Lining'], brand: 'Columbia' },
  { id: '6', name: 'Carrier Bag 40L', category: 'Carrier', price: 35000, rating: 4.2, reviews: 95, image: img06, available: true, description: 'Tas carrier 40 liter cocok untuk pendakian 2-3 hari.', features: ['40 Liter', 'Hip Belt', 'Rain Cover', 'Multiple Compartments'], brand: 'Deuter' },
  { id: '7', name: 'Tenda Family 4 Orang', category: 'Tenda', price: 45000, rating: 4.8, reviews: 301, image: img07, available: true, description: 'Tenda keluarga 4 orang dengan ruang yang luas dan nyaman.', features: ['Kapasitas 4 Orang', 'Easy Setup', 'Waterproof', 'Mesh Ventilation'], brand: 'Quechua' },
  { id: '8', name: 'Jacket Outdoor', category: 'Pakaian', price: 25000, rating: 4.8, reviews: 140, image: img08, available: true, description: 'Jaket outdoor serbaguna untuk berbagai aktivitas luar ruang.', features: ['Breathable', 'Wind Resistant', 'Packable', 'Lightweight'], brand: 'Patagonia' },
  { id: '9', name: 'Jacket Gunung Premium', category: 'Pakaian', price: 25000, rating: 4.5, reviews: 88, image: img09, available: true, description: 'Jaket gunung premium dengan teknologi terkini.', features: ['Gore-Tex', 'Waterproof', 'Breathable', 'Seam Sealed'], brand: "Arc'teryx" },
  { id: '10', name: 'Sleeping Bag Pillow', category: 'Sleeping Bag', price: 25000, rating: 4.6, reviews: 247, image: img10, available: true, description: 'Sleeping bag nyaman untuk suhu -5°C hingga 10°C.', features: ['Suhu -5°C - 10°C', 'Lightweight', 'Compact', 'Zipper Dua Arah'], brand: 'Handar' },
  { id: '11', name: 'Sepatu Hiking', category: 'Sepatu', price: 30000, rating: 4.9, reviews: 179, image: img11, available: true, description: 'Sepatu hiking waterproof dengan grip anti-slip.', features: ['Waterproof', 'Anti-Slip Sole', 'Ankle Support', 'Breathable'], brand: 'Salomon' },
  { id: '12', name: 'Carrier 80L', category: 'Carrier', price: 75000, rating: 4.5, reviews: 87, image: img12, available: true, description: 'Carrier besar 80L untuk ekspedisi panjang dan beban berat.', features: ['80 Liter', 'Frame Aluminium', 'Load Lifter', 'Rain Cover Included'], brand: 'Osprey' },
  { id: '13', name: 'Sleeping Bag Big', category: 'Sleeping Bag', price: 45000, rating: 4.8, reviews: 135, image: img13, available: true, description: 'Sleeping bag mummy untuk pendakian ekstrem.', features: ['Mummy Shape', 'Suhu -10°C', 'Down Insulation', 'Kompak'], brand: 'Mountain Hardwear' },
  { id: '14', name: 'Carrier Bag 60L', category: 'Carrier', price: 40000, rating: 4.5, reviews: 88, image: img14, available: true, description: 'Carrier 60L ideal untuk pendakian multi-hari.', features: ['60 Liter', 'Ergonomic Back', 'Side Pockets', 'Hydration Compatible'], brand: 'Gregory' },
  { id: '15', name: 'Cooking Set', category: 'Perlengkapan', price: 50000, rating: 4.5, reviews: 200, image: img18, available: true, description: 'Set peralatan memasak lengkap untuk camping di alam terbuka.', features: ['5 Pieces Set', 'Non-Stick', 'Compact Storage', 'Anti-Gores'], brand: 'Snow Peak' },
  { id: '16', name: 'Trekking Pole', category: 'Perlengkapan', price: 10000, rating: 4.9, reviews: 340, image: img16, available: true, description: 'Trekking pole aluminium ringan dan kuat untuk pendakian.', features: ['Aluminium', 'Adjustable Height', 'Cork Handle', 'Wrist Strap'], brand: 'Black Diamond' },
  { id: '17', name: 'Tenda 8 Orang', category: 'Tenda', price: 35000, rating: 4.8, reviews: 271, image: img03, available: true, description: 'Tenda besar 8 orang cocok untuk camping keluarga besar.', features: ['Kapasitas 8 Orang', 'Dome Style', 'Waterproof', 'Carrying Bag'], brand: 'Naturehike' },
  { id: '18', name: 'Cooking Set Portable', category: 'Perlengkapan', price: 35000, rating: 4.5, reviews: 110, image: img18, available: true, description: 'Set memasak portabel ringan untuk pendakian.', features: ['Titanium Material', 'Lightweight', '3 Pieces', 'Compact'], brand: 'MSR' },
  { id: '19', name: 'Carrier Bag 20L', category: 'Carrier', price: 20000, rating: 4.8, reviews: 140, image: img19, available: true, description: 'Daypack 20L ringan untuk hiking sehari.', features: ['20 Liter', 'Hydration Pocket', 'Lightweight', 'Breathable Back'], brand: 'Deuter' },
  { id: '20', name: 'Sleeping Bag Standar', category: 'Sleeping Bag', price: 15000, rating: 4.7, reviews: 190, image: img20, available: true, description: 'Sleeping bag standar untuk suhu 5°C hingga 15°C.', features: ['Suhu 5°C - 15°C', 'Rectangular Shape', 'Soft Lining', 'Machine Washable'], brand: 'Consina' },
];

// Category badge colors
export const CATEGORY_COLORS: Record<string, string> = {
  Tenda: 'bg-emerald-100 text-emerald-700',
  Carrier: 'bg-blue-100 text-blue-700',
  'Sleeping Bag': 'bg-purple-100 text-purple-700',
  Perlengkapan: 'bg-yellow-100 text-yellow-700',
};

export const FILTER_CATEGORIES = ['Semua Kategori', 'Tenda', 'Carrier', 'Sleeping Bag','Perlengkapan'];

export const SORT_OPTIONS = ['Terpopuler', 'Harga Terendah', 'Harga Tertinggi', 'Rating Tertinggi'];
