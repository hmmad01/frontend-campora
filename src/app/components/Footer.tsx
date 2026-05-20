/**
 * @file Footer.tsx
 * @description Komponen footer global aplikasi CAMPORA. Berisi informasi kontak, link navigasi layanan & bantuan, serta link sosial media.
 */

import { Mail, MapPin, Phone } from 'lucide-react';
import imgFooterLogo from '@/images/logo campora.png';
import { WhatsAppIcon, InstagramIcon, MailIcon } from './icons/SocialIcons';

const LAYANAN = ['Rental Peralatan', 'Tentang Kami', 'Paket Adventure'];
const BANTUAN = ['FAQ', 'Cara Pemesanan', 'Syarat & Ketentuan', 'Kebijakan Privasi'];
const LEGAL_LINKS = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

function SocialButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} className="bg-[#303030] rounded-xl p-1.5 text-white hover:bg-[#444] transition-colors" aria-label={label}>
      {children}
    </a>
  );
}

function FooterLinkList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-work text-lg font-semibold mb-4 tracking-tight">{heading}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="font-work text-sm text-white/80 hover:text-white transition-colors">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-black text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={imgFooterLogo} alt="CAMPORA" className="h-16 w-16 rounded-full object-cover" />
              <span className="text-2xl font-bold tracking-wide">CAMPORA</span>
            </div>
            <p className="text-sm text-white/75 leading-relaxed max-w-[240px]">
              Platform rental peralatan outdoor terpercaya untuk petualangan Anda di seluruh Indonesia.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <SocialButton href="#" label="WhatsApp"><WhatsAppIcon /></SocialButton>
              <SocialButton href="#" label="Instagram"><InstagramIcon /></SocialButton>
              <SocialButton href="#" label="Email"><MailIcon /></SocialButton>
            </div>
          </div>

          <FooterLinkList heading="LAYANAN" items={LAYANAN} />
          <FooterLinkList heading="BANTUAN" items={BANTUAN} />

          <div>
            <h3 className="font-work text-lg font-semibold mb-4 tracking-tight">KONTAK</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <Mail size={20} className="text-[#14AE5C] mt-0.5 shrink-0" />
                <span className="font-work text-sm text-white/80">camporaid@email.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={20} className="text-[#14AE5C] mt-0.5 shrink-0" />
                <span className="font-work text-sm text-white/80 leading-snug">
                  Jl. Veteran, Kec. Lowokwaru, Malang kota
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={20} className="text-[#14AE5C] mt-0.5 shrink-0" />
                <span className="font-work text-sm text-white/80">085736292760</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-work text-sm text-white/50">© 2026 CAMPORA. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map((item) => (
              <a key={item} href="#" className="font-work text-sm text-white/50 hover:text-white/80 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
