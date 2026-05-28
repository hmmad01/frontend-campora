/**
 * @file Login.tsx
 * @description Halaman login administrator untuk mengamankan akses ke dashboard manajemen produk dan ketersediaan barang CAMPORA.
 *              Terkoneksi ke backend Laravel via API.
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authApi } from "../../api";
import imgLogo from '@/images/logo campora.png';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal harus 8 karakter");
      return;
    }
    if (password.length > 20) {
      setError("Password maksimal harus 20 karakter");
      return;
    }
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9\s]/.test(password);
    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSymbol) {
      setError("Password harus mengandung minimal 1 huruf kapital, 1 huruf kecil, 1 angka, dan 1 simbol");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login(username, password);
      // Simpan data admin ke sessionStorage
      sessionStorage.setItem("admin", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1564577160324-112d603f750f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Camping"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA] p-8">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 flex flex-col items-center text-center">
            <img src={imgLogo} alt="CAMPORA" className="h-20 object-contain mb-5" />
            <h1 className="text-3xl font-extrabold text-[#111827] mb-2 tracking-tight">Admin Login</h1>
            <p className="text-gray-500 text-[14px]">Masuk untuk mengelola sistem</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-[13px]">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-[13px] font-semibold text-gray-800 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#F3F4F6] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4a38]/30 focus:border-[#1a4a38] transition-all text-[14px]"
                placeholder="Masukkan username"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-semibold text-gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F3F4F6] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4a38]/30 focus:border-[#1a4a38] transition-all pr-12 text-[14px]"
                  placeholder="Masukkan password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-gray-400 leading-relaxed">
                Ketentuan: 8-20 karakter, minimal 1 huruf kapital, 1 huruf kecil, 1 angka, dan 1 simbol.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e583e] text-white py-3 mt-2 rounded-lg text-[14px] font-medium hover:bg-[#15422d] transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
