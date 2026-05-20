/**
 * @file Dashboard.tsx
 * @description Halaman dashboard admin utama CAMPORA. Menyajikan ringkasan statistik seperti total barang, barang tersedia, barang disewa, dan perkiraan pendapatan.
 */

import { Package, Calendar, TrendingUp, DollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Selamat Datang</h3>
        <p className="text-gray-600">Kelola sistem rental outdoor Anda dengan mudah</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">24</h4>
          <p className="text-sm text-gray-600 mt-1">Total Barang</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="text-green-600" size={24} />
            </div>
            <span className="text-sm font-medium text-green-600">+8%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">18</h4>
          <p className="text-sm text-gray-600 mt-1">Barang Tersedia</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <span className="text-sm font-medium text-green-600">+15%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">6</h4>
          <p className="text-sm text-gray-600 mt-1">Sedang Disewa</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <span className="text-sm font-medium text-green-600">+23%</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900">Rp 4.5jt</h4>
          <p className="text-sm text-gray-600 mt-1">Pendapatan Bulan Ini</p>
        </div>
      </div>
    </div>
  );
}
