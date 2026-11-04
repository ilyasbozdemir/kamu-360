import React from 'react'

interface BrandLogoProps {
  className?: string
  size?: number
  showText?: boolean
  showSubtitle?: boolean
}

export function BrandLogo({
  className = 'size-8',
  size,
  showText = false,
  showSubtitle = false,
}: BrandLogoProps) {
  const style = size ? { width: size, height: size } : undefined

  return (
    <div className={`inline-flex items-center gap-2.5 ${showText ? '' : 'shrink-0'}`}>
      {/* Özel Vektör Kurumsal Amblem */}
      <svg
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-label="Kamu 360 Logo"
      >
        <defs>
          {/* Arka Plan Kurumsal Gradyan */}
          <linearGradient id="kamuBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* 4734 Satın Alma Sol Kanat (Kraliyet Mavisi) */}
          <linearGradient id="kamuBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* 2886 Gelir Sağ Kanat (Zümrüt & Turkuaz) */}
          <linearGradient id="kamuCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Merkez Işıltı & Belge Mührü */}
          <linearGradient id="kamuGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <filter id="kamuShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. Dış Çerçeve: Yuvarlatılmış Modern Şekil */}
        <rect
          x="6"
          y="6"
          width="168"
          height="168"
          rx="40"
          fill="url(#kamuBg)"
          stroke="#334155"
          strokeWidth="3"
          filter="url(#kamuShadow)"
        />

        {/* 2. İç Halka / Çift Katman Vurgusu */}
        <rect
          x="12"
          y="12"
          width="156"
          height="156"
          rx="34"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1.5"
        />

        {/* 3. Geometrik Kurumsal Kret: Sol Kanat (4734 Harcama/Satın Alma) */}
        <path
          d="M48 64C48 50.7452 58.7452 40 72 40H84V102L56 126C51.0294 130.349 48 126.791 48 120.211V64Z"
          fill="url(#kamuBlue)"
        />

        {/* 4. Geometrik Kurumsal Kret: Sağ Kanat (2886 Gelir/İhale & Değer) */}
        <path
          d="M132 64C132 50.7452 121.255 40 108 40H96V102L124 126C128.971 130.349 132 126.791 132 120.211V64Z"
          fill="url(#kamuCyan)"
        />

        {/* 5. Merkez Dinamik Kalkan / Belge Mührü (360 Döngüsü) */}
        <polygon
          points="90,52 110,88 90,124 70,88"
          fill="#ffffff"
          opacity="0.95"
        />

        {/* 6. İç Yıldız / Karar & Adalet Çekirdeği */}
        <circle cx="90" cy="88" r="8.5" fill="#1e3a8a" />
        <circle cx="90" cy="88" r="4.5" fill="#60a5fa" />

        {/* 7. Alt İmzalı Yay / Kamu Onay Yolu (EBYS Rota) */}
        <path
          d="M62 136C70 142 80 145 90 145C100 145 110 142 118 136"
          stroke="url(#kamuGold)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* İsteğe Bağlı Başlık & Açıklama */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-black tracking-tight text-[#16253b]">
              KAMU
            </span>
            <span className="rounded bg-[#2d62d7] px-1.5 py-0.5 text-[10.5px] font-extrabold text-white tracking-wide shadow-2xs">
              360
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[9px] font-semibold text-[#64748b] tracking-wider uppercase mt-0.5">
              İhale &bull; Satın Alma &bull; Gelir
            </span>
          )}
        </div>
      )}
    </div>
  )
}

