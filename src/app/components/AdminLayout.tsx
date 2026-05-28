/**
 * @file AdminLayout.tsx
 * @description Komponen layout untuk panel administrator (Dashboard). Menyediakan sidebar navigasi, topbar profil, dan area konten utama yang dinamis.
 *              Mengecek session admin dari sessionStorage dan redirect ke login jika belum login.
 */

import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Package, Calendar, LogOut, User, HelpCircle, MessageSquare, PackageOpen } from "lucide-react";
import { FC, useEffect, useState } from "react";
import type { AdminUser } from "../api";
import imgLogo from '@/images/logo campora.png';

const sidebarNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
    isActive
      ? "bg-[#2F855A] text-white"
      : "text-gray-300 hover:bg-gray-800"
  }`;

const sidebarNavItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/kelola-barang", icon: Package, label: "Kelola Barang" },
  { to: "/dashboard/ketersediaan", icon: Calendar, label: "Ketersediaan" },
  { to: "/dashboard/faq", icon: HelpCircle, label: "Kelola FAQ" },
  { to: "/dashboard/review", icon: MessageSquare, label: "Kelola Review" },
  { to: "/dashboard/paket", icon: PackageOpen, label: "Kelola Paket" },
];

interface SidebarNavItemProps {
  to: string;
  icon: any;
  label: string;
}

const SidebarNavItem: FC<SidebarNavItemProps> = ({ to, icon: Icon, label }) => (
  <NavLink to={to} end={to === "/dashboard"} className={sidebarNavLinkClass}>
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin");
    if (!stored) {
      navigate("/admin");
      return;
    }
    try {
      setAdmin(JSON.parse(stored));
    } catch {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    navigate("/admin");
  };

  const getPageTitle = () => {
    if (location.pathname.includes("kelola-barang")) return "Kelola Barang";
    if (location.pathname.includes("ketersediaan")) return "Ketersediaan";
    if (location.pathname.includes("faq")) return "Kelola FAQ";
    if (location.pathname.includes("review")) return "Kelola Review";
    if (location.pathname.includes("paket")) return "Kelola Paket";
    return "Dashboard";
  };

  if (!admin) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shrink-0">
            <img src={imgLogo} alt="Campora" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider">CAMPORA</h1>
            <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarNavItems.map((item) => (
            <SidebarNavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-xl">
              <div className="w-8 h-8 bg-[#2F855A] rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{admin.username}</p>
                <p className="text-gray-500">{admin.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
