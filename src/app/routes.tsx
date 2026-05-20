/**
 * @file routes.tsx
 * @description Konfigurasi rute (routing) aplikasi menggunakan react-router. Mendefinisikan layout umum untuk customer dan admin beserta rute halaman masing-masing.
 */

import { createBrowserRouter, Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import HomePage from './pages/customer/HomePage';

import ReviewPage from './pages/customer/ReviewPage';
import KatalogPage from './pages/customer/KatalogPage';
import PaketPage from './pages/customer/PaketPage';
import FAQPage from './pages/customer/FAQPage';
import TentangPage from './pages/customer/TentangPage';
import DetailPage from './pages/customer/DetailPage';
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import AvailabilityCalendar from './pages/admin/AvailabilityCalendar';
import FAQManagement from './pages/admin/FAQManagement';
import ReviewManagement from './pages/admin/ReviewManagement';
import PaketManagement from './pages/admin/PaketManagement';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white pt-[72px]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'review', Component: ReviewPage },
      { path: 'katalog', Component: KatalogPage },
      { path: 'katalog/:id', Component: DetailPage },
      { path: 'paket', Component: PaketPage },
      { path: 'faq', Component: FAQPage },
      { path: 'tentang', Component: TentangPage },
    ],
  },
  {
    path: '/admin',
    Component: Login,
  },
  {
    path: '/dashboard',
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'kelola-barang', Component: ProductManagement },
      { path: 'ketersediaan', Component: AvailabilityCalendar },
      { path: 'faq', Component: FAQManagement },
      { path: 'review', Component: ReviewManagement },
      { path: 'paket', Component: PaketManagement },
    ],
  },
]);
