/**
 * @file Footer.tsx
 * @description Komponen footer global aplikasi CAMPORA. Berisi informasi kontak, link navigasi layanan & bantuan, serta link sosial media.
 */

import { Link } from 'react-router';
import { Mail, MapPin, Phone } from 'lucide-react';
import imgFooterLogo from '@/images/logo campora.png';
import { WhatsAppIcon, InstagramIcon, MailIcon } from './icons/SocialIcons';

// ── Data navigasi footer dengan path yang sesuai routes ──────────────────────

const LAYANAN: { label: string; to: string }[] = [
  { label: 'Rental Peralatan', to: '/katalog' },
  { label: 'Tentang Kami', to: '/tentang' },
  { label: 'Paket Adventure', to: '/paket' },
];

const BANTUAN: { label: string; to: string }[] = [
  { label: 'FAQ', to: '/faq' },
  { label: 'Cara Pemesanan', to: '/faq' },
  { label: 'Syarat & Ketentuan', to: '/faq' },
  { label: 'Kebijakan Privasi', to: '/faq' },
];

const LEGAL_LINKS: { label: string; to: string }[] = [
  { label: 'Privacy Policy', to: '/faq' },
  { label: 'Terms of Service', to: '/faq' },
  { label: 'Cookie Policy', to: '/faq' },
];

// ── Kontak & Sosial Media ────────────────────────────────────────────────────

const WA_LINK =
  'https://wa.me/6285736292760?text=' +
  encodeURIComponent('Halo CAMPORA! Saya ingin bertanya tentang layanan rental perlengkapan camping.');
const IG_LINK = 'https://instagram.com/campora.id';
const EMAIL = 'camporaid@email.com';
const PHONE = '085736292760';

// ── Sub-komponen ─────────────────────────────────────────────────────────────

function SocialButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#303030] rounded-xl p-1.5 text-white hover:bg-[#444] transition-colors"
      aria-label={label}
    >
      {children}
    </a>
  );
}

function FooterLinkList({ heading, items }: { heading: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <h3 className="font-work text-lg font-semibold mb-4 tracking-tight">{heading}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.label}>
            <Link to={item.to} className="font-work text-sm text-white/80 hover:text-white transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Komponen Utama ───────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="bg-black text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">

          {/* ── Brand & Sosial Media ── */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={imgFooterLogo} alt="CAMPORA" className="h-16 w-16 rounded-full object-cover" />
              <span className="text-2xl font-bold tracking-wide">CAMPORA</span>
            </Link>
            <p className="text-sm text-white/75 leading-relaxed max-w-[240px]">
              Platform rental peralatan outdoor terpercaya untuk petualangan Anda di seluruh Indonesia.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <SocialButton href={WA_LINK} label="WhatsApp"><WhatsAppIcon /></SocialButton>
              <SocialButton href={IG_LINK} label="Instagram"><InstagramIcon /></SocialButton>
              <SocialButton href={`mailto:${EMAIL}`} label="Email"><MailIcon /></SocialButton>
            </div>
          </div>

          {/* ── Layanan ── */}
          <FooterLinkList heading="LAYANAN" items={LAYANAN} />

          {/* ── Bantuan ── */}
          <FooterLinkList heading="BANTUAN" items={BANTUAN} />

          {/* ── Kontak ── */}
          <div>
            <h3 className="font-work text-lg font-semibold mb-4 tracking-tight">KONTAK</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <Mail size={20} className="text-[#14AE5C] mt-0.5 shrink-0" />
                <a href={`mailto:${EMAIL}`} className="font-work text-sm text-white/80 hover:text-white transition-colors">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={20} className="text-[#14AE5C] mt-0.5 shrink-0" />
                <a
                  href="https://maps.google.com/?q=Jl.+Veteran,+Lowokwaru,+Malang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-work text-sm text-white/80 hover:text-white transition-colors leading-snug"
                >
                  Jl. Veteran, Kec. Lowokwaru, Malang kota
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={20} className="text-[#14AE5C] mt-0.5 shrink-0" />
                <a href={`tel:+62${PHONE.slice(1)}`} className="font-work text-sm text-white/80 hover:text-white transition-colors">
                  {PHONE}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/20 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-work text-sm text-white/50">© 2026 CAMPORA. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map((item) => (
              <Link key={item.label} to={item.to} className="font-work text-sm text-white/50 hover:text-white/80 transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
