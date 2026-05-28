/**
 * @file SectionHeader.tsx
 * @description Komponen header bagian (SectionHeader) yang reusable. Menampilkan badge kategori, judul utama, dan sub-judul.
 */

interface Props {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

export function SectionHeader({ badge, title, subtitle, align = 'center' }: Props) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';

  return (
    <div className={`mb-10 ${alignClass}`}>
      {badge && (
        <span className="font-work inline-block bg-[#124756] text-white text-xs px-4 py-1.5 rounded-full mb-3 tracking-wide">
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
