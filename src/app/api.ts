/**
 * @file api.ts
 * @description Konfigurasi base API client untuk berkomunikasi dengan campora-backend (Laravel).
 *              Semua request ke backend melewati helper ini.
 */

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Generic fetch wrapper yang otomatis set header JSON dan handle error.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  // Only set Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Terjadi kesalahan.' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────────────

export interface AdminUser {
  id_admin: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  data: AdminUser;
}

export const authApi = {
  login: (username: string, password: string) =>
    request<LoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};

// ── Dashboard ────────────────────────────────────────────────────────

export interface DashboardStats {
  total_barang: number;
  barang_aktif: number;
  barang_nonaktif: number;
  total_kategori: number;
  sewa_hari_ini: number;
}

export const dashboardApi = {
  getStats: () => request<DashboardStats>('/admin/inventory/dashboard'),
};

// ── Kategori ─────────────────────────────────────────────────────────

export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
  slug: string;
  barangs_count?: number;
}

export const kategoriApi = {
  getAll: () => request<Kategori[]>('/kategori'),
  create: (data: { nama_kategori: string }) =>
    request('/admin/kategori', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { nama_kategori: string }) =>
    request(`/admin/kategori/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request(`/admin/kategori/${id}`, { method: 'DELETE' }),
};

// ── Barang ───────────────────────────────────────────────────────────

export interface FotoBarang {
  id_foto: number;
  id_barang: number;
  url_foto: string;
}

export interface Barang {
  id_barang: number;
  id_kategori: number;
  nama_barang: string;
  merk: string | null;
  spesifikasi: string | null;
  harga_per_hari: string;
  stok_total: number;
  is_aktif: boolean;
  rating: number;
  jumlah_review: number;
  created_at: string;
  updated_at: string;
  kategori?: Kategori;
  fotos?: FotoBarang[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const barangApi = {
  getAll: (params?: { id_kategori?: number; search?: string; per_page?: number; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.id_kategori) query.set('id_kategori', String(params.id_kategori));
    if (params?.search) query.set('search', params.search);
    if (params?.per_page) query.set('per_page', String(params.per_page));
    if (params?.page) query.set('page', String(params.page));
    const qs = query.toString();
    return request<PaginatedResponse<Barang>>(`/barangs${qs ? `?${qs}` : ''}`);
  },
  getById: (id: number) => request<Barang>(`/barangs/${id}`),
  create: (data: {
    id_kategori: number;
    nama_barang: string;
    merk?: string;
    spesifikasi?: string;
    harga_per_hari: number;
    stok_total: number;
  }) =>
    request<{ message: string; data: Barang }>('/admin/barangs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<Barang>) =>
    request<{ message: string; data: Barang }>(`/admin/barangs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<{ message: string }>(`/admin/barangs/${id}`, { method: 'DELETE' }),
};

// ── Foto ─────────────────────────────────────────────────────────────

export const fotoApi = {
  upload: (idBarang: number, file: File) => {
    const formData = new FormData();
    formData.append('foto', file);
    return request<{ message: string; data: FotoBarang }>(
      `/admin/barangs/${idBarang}/fotos`,
      { method: 'POST', body: formData }
    );
  },
  delete: (idFoto: number) =>
    request<{ message: string }>(`/admin/fotos/${idFoto}`, { method: 'DELETE' }),
};

// ── Ketersediaan ─────────────────────────────────────────────────────

export interface Ketersediaan {
  id_ketersediaan: number;
  id_barang: number;
  id_admin: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  stok_disewa: number;
  catatan: string | null;
  barang?: Barang;
  admin?: AdminUser;
}

export interface AvailabilityCheck {
  id_barang: number;
  nama_barang: string;
  stok_total: number;
  stok_disewa: number;
  stok_tersedia: number;
  tersedia: boolean;
  tanggal_mulai: string;
  tanggal_selesai: string;
}

// ── FAQ (Public) ─────────────────────────────────────────────────────

export interface FaqItem {
  id_faq: number;
  pertanyaan: string;
  jawaban: string;
  id_admin: number;
  created_at: string;
}

export const faqApi = {
  getAll: () => request<FaqItem[]>('/faqs'),
  create: (data: { pertanyaan: string; jawaban: string; id_admin: number }) =>
    request<{ message: string; data: FaqItem }>('/admin/faqs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { pertanyaan?: string; jawaban?: string }) =>
    request<{ message: string; data: FaqItem }>(`/admin/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<{ message: string }>(`/admin/faqs/${id}`, { method: 'DELETE' }),
};

// ── Testimoni (Public + Admin) ───────────────────────────────────────

export interface TestimoniItem {
  id_testimoni: number;
  nama_customer: string;
  foto_customer: string | null;
  rating: number;
  isi_review: string;
  produk_disewa: string | null;
  kegiatan: string | null;
  is_approved: boolean;
  created_at: string;
}

export const testimoniApi = {
  /** Public: only approved reviews */
  getAll: () => request<PaginatedResponse<TestimoniItem>>('/testimonis'),
  /** Admin: all reviews regardless of approval */
  adminGetAll: () => request<PaginatedResponse<TestimoniItem>>('/admin/testimonis'),
  /** Admin: create a review directly */
  create: (data: { nama_customer: string; rating: number; isi_review: string; produk_disewa?: string; kegiatan?: string; is_approved?: boolean }) =>
    request<{ message: string; data: TestimoniItem }>('/admin/testimonis', { method: 'POST', body: JSON.stringify(data) }),
  /** Customer: submit review (pending approval) */
  submitByCustomer: (data: { nama_customer: string; rating: number; isi_review: string; produk_disewa?: string; kegiatan?: string }) =>
    request<{ message: string; data: TestimoniItem }>('/testimonis', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<TestimoniItem>) =>
    request<{ message: string; data: TestimoniItem }>(`/admin/testimonis/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  approve: (id: number) =>
    request<{ message: string; data: TestimoniItem }>(`/admin/testimonis/${id}/approve`, { method: 'PATCH' }),
  unapprove: (id: number) =>
    request<{ message: string; data: TestimoniItem }>(`/admin/testimonis/${id}/unapprove`, { method: 'PATCH' }),
  delete: (id: number) =>
    request<{ message: string }>(`/admin/testimonis/${id}`, { method: 'DELETE' }),
};

// ── Paket (Public + Admin) ───────────────────────────────────────────

export interface PaketItem {
  id_paket: number;
  nama_paket: string;
  gambar: string | null;
  deskripsi: string | null;
  items: string[];
  harga: string;
  is_featured: boolean;
  is_aktif: boolean;
  created_at: string;
}

export const paketApi = {
  getAll: () => request<PaketItem[]>('/pakets'),
  create: (data: { nama_paket: string; deskripsi?: string; items: string[]; harga: number; is_featured?: boolean }) =>
    request<{ message: string; data: PaketItem }>('/admin/pakets', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<PaketItem>) =>
    request<{ message: string; data: PaketItem }>(`/admin/pakets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<{ message: string }>(`/admin/pakets/${id}`, { method: 'DELETE' }),
};

// ── Helper: Backend Barang → Frontend Product ────────────────────────

import type { Product } from './types';

/**
 * Konversi data Barang dari backend API ke format Product yang digunakan
 * oleh komponen-komponen customer (ProductCard, DetailPage, dll).
 */
export function toProduct(b: Barang): Product {
  return {
    id: String(b.id_barang),
    name: b.nama_barang,
    category: b.kategori?.nama_kategori ?? '',
    price: Number(b.harga_per_hari),
    rating: b.rating ?? 4.5,
    reviews: b.jumlah_review ?? 0,
    image: b.fotos?.[0]?.url_foto
      ? (b.fotos[0].url_foto.startsWith('/') ? `http://localhost:8000${b.fotos[0].url_foto}` : b.fotos[0].url_foto)
      : '',
    available: b.is_aktif && b.stok_total > 0,
    description: b.spesifikasi
      ? b.spesifikasi.split(/\n+Fitur:/i)[0].trim()
      : undefined,
    features: b.spesifikasi
      ? b.spesifikasi
          .split('\n')
          .filter((l) => l.startsWith('- '))
          .map((l) => l.replace('- ', ''))
      : undefined,
    brand: b.merk ?? undefined,
  };
}

// ── Ketersediaan ─────────────────────────────────────────────────────

export const ketersediaanApi = {
  getAll: (idBarang?: number) => {
    const qs = idBarang ? `?id_barang=${idBarang}` : '';
    return request<PaginatedResponse<Ketersediaan>>(`/admin/ketersediaan${qs}`);
  },
  check: (idBarang: number, mulai: string, selesai: string) =>
    request<AvailabilityCheck>(
      `/admin/ketersediaan/check?id_barang=${idBarang}&tanggal_mulai=${mulai}&tanggal_selesai=${selesai}`
    ),
  create: (data: {
    id_barang: number;
    id_admin: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
    stok_disewa: number;
    catatan?: string;
  }) =>
    request<{ message: string; data: Ketersediaan }>('/admin/ketersediaan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<Ketersediaan>) =>
    request<{ message: string; data: Ketersediaan }>(`/admin/ketersediaan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<{ message: string }>(`/admin/ketersediaan/${id}`, { method: 'DELETE' }),
};
