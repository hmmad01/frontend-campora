/**
 * @file Navbar.tsx
 * @description Komponen navigasi atas (Navbar) aplikasi CAMPORA. Menyediakan menu navigasi responsif (untuk desktop & mobile dropdown) serta tombol WhatsApp.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import imgLogo from '@/images/logo campora.png';
import type { NavLink } from '../types';

const NAV_LINKS: NavLink[] = [
  { href: '/katalog', label: 'KATALOG' },
  { href: '/paket', label: 'PAKET' },
  { href: '/review', label: 'REVIEW' },
  { href: '/tentang', label: 'TENTANG' },
  { href: '/faq', label: 'FAQ' },
];

const WA_LINK =
  'https://wa.me/6285736292760?text=' +
  encodeURIComponent('Halo CAMPORA! Saya ingin bertanya tentang layanan rental perlengkapan camping.');

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-10">
      <nav className="bg-[#dcdcdc]/90 backdrop-blur-md rounded-b-3xl px-4 md:px-8 h-[72px] flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={imgLogo} alt="CAMPORA" className="h-14 w-auto object-contain" />
        </Link>

        <ul className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href) ? 'text-[#124756]' : 'text-black hover:text-[#124756]'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-[#124756] rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            HUBUNGI KAMI
          </a>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-[#dcdcdc] rounded-b-2xl px-6 py-4 flex flex-col gap-2 shadow-md">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={`py-2 text-sm font-medium border-b border-gray-300 last:border-0 ${
                isActive(link.href) ? 'text-[#124756]' : 'text-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium text-center w-full"
          >
            HUBUNGI KAMI
          </a>
        </div>
      )}
    </header>
  );
}
