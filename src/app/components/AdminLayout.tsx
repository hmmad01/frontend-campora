/**
 * @file AdminLayout.tsx
 * @description Komponen layout untuk panel administrator (Dashboard). Menyediakan sidebar navigasi, topbar profil, dan area konten utama yang dinamis.
 */

import { Outlet, NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Package, Calendar, LogOut, User } from "lucide-react";
import { FC } from "react";

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

  const handleLogout = () => {
    navigate("/admin");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">Outdoor Rental</h1>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
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
            <h2 className="text-2xl font-bold text-gray-900">
              {window.location.pathname.includes("kelola-barang")
                ? "Kelola Barang"
                : window.location.pathname.includes("ketersediaan")
                ? "Ketersediaan"
                : "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-xl">
              <div className="w-8 h-8 bg-[#2F855A] rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Admin</p>
                <p className="text-gray-500">Administrator</p>
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
