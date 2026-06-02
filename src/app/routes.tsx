
import { createBrowserRouter, Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import HomePage from './pages/customer/Beranda';

import ReviewPage from './pages/customer/Review';
import KatalogPage from './pages/customer/Katalog';
import PaketPage from './pages/customer/PaketOutdoor';
import FAQPage from './pages/customer/FAQ';
import TentangPage from './pages/customer/TentangKami';
import DetailPage from './pages/customer/DetailBarang';
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/KelolaBarang';
import AvailabilityCalendar from './pages/admin/Ketersediaan';
import FAQManagement from './pages/admin/KelolaFAQ';
import ReviewManagement from './pages/admin/KelolaReview';
import PaketManagement from './pages/admin/KelolaPaket';

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
