
import { useEffect, useState } from "react";
import { Package, Calendar, TrendingUp, Layers, Loader2, AlertCircle } from "lucide-react";
import { dashboardApi, type DashboardStats } from "../../api";

interface StatCardProps {
  icon: React.ReactNode;
  bgColor: string;
  value: string | number;
  label: string;
}

const StatCard = ({ icon, bgColor, value, label }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
    <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#124756]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Selamat Datang</h3>
        <p className="text-gray-600">Kelola sistem rental outdoor Anda dengan mudah</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Package className="text-blue-600" size={24} />}
          bgColor="bg-blue-100"
          value={stats?.total_barang ?? 0}
          label="Total Barang"
        />
        <StatCard
          icon={<Calendar className="text-green-600" size={24} />}
          bgColor="bg-green-100"
          value={stats?.barang_aktif ?? 0}
          label="Barang Tersedia"
        />
        <StatCard
          icon={<TrendingUp className="text-orange-600" size={24} />}
          bgColor="bg-orange-100"
          value={stats?.sewa_hari_ini ?? 0}
          label="Unit Disewa Hari Ini"
        />
        <StatCard
          icon={<Layers className="text-purple-600" size={24} />}
          bgColor="bg-purple-100"
          value={stats?.total_kategori ?? 0}
          label="Jumlah Kategori"
        />
      </div>
    </div>
  );
}
