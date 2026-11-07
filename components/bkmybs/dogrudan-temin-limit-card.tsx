'use client'

import React, { useState } from 'react'
import {
  Coins,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Building2,
  TrendingUp,
  Percent,
  Info,
  Layers,
} from 'lucide-react'
import {
  DogrudanTeminLimitConfig,
  VARSAYILAN_LIMIT_CONFIG_2026,
  ORNEK_BIRIM_KOTALARI,
} from '@/lib/bkmybs/mali-entegrasyon'

interface DogrudanTeminLimitCardProps {
  currentDosyaTutar?: number
  currentDosyaNo?: string
  showBirimBreakdown?: boolean
  className?: string
}

export function DogrudanTeminLimitCard({
  currentDosyaTutar = 184500,
  currentDosyaNo = '2026/DT-001',
  showBirimBreakdown = true,
  className = '',
}: DogrudanTeminLimitCardProps) {
  const [idareTipi, setIdareTipi] = useState<'buyuksehir' | 'diger'>('buyuksehir')
  const [config] = useState<DogrudanTeminLimitConfig>(VARSAYILAN_LIMIT_CONFIG_2026)

  // Tek Alım Parasal Limiti (22/d)
  const tekAlimLimiti =
    idareTipi === 'buyuksehir' ? config.buyuksehirLimiti : config.digerIdareLimiti
  const dosyaLimitOrani = Math.min(100, (currentDosyaTutar / tekAlimLimiti) * 100)
  const isDosyaLimitAsildi = currentDosyaTutar > tekAlimLimiti

  // Yıllık %10 KİK Eşik Kontrolü (Madde 62/ı)
  const kullanilanToplam = config.kullanilanToplamDT
  const kalanYuzdeOnKota = Math.max(0, config.yuzdeOnKotaSiniri - kullanilanToplam)
  const yuzdeOnDolulukOrani = (kullanilanToplam / config.yuzdeOnKotaSiniri) * 100

  return (
    <div
      className={`bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs transition ${className}`}
    >
      {/* ÜST BİLGİ VE İDARE TİPİ SEÇİCİ */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-xl shadow-xs">
            <Coins className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#0f172a] tracking-tight">
                4734 Sayılı KİK Madde 22/d Doğrudan Temin Limit &amp; Kota Takibi
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                {config.yil} Malî Yılı
              </span>
            </div>
            <p className="text-[11px] text-[#64748b]">
              KİK Eşik Tebliği parasal sınırları ve 5018 bütçe tertibi %10 kota izleme masası
            </p>
          </div>
        </div>

        {/* İdare Tipi Seçici */}
        <div className="flex items-center bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0] text-xs">
          <button
            type="button"
            onClick={() => setIdareTipi('buyuksehir')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              idareTipi === 'buyuksehir'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Büyükşehir &amp; Bağlı Kuruluş
          </button>
          <button
            type="button"
            onClick={() => setIdareTipi('diger')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              idareTipi === 'diger'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Diğer İdareler
          </button>
        </div>
      </div>

      {/* METRİK KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
        {/* KART 1: TEK ALIM LİMİTİ DURUMU */}
        <div className="bg-[#fcfdfd] border border-[#e2e8f0] rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#64748b]">
              22/d Tek Alım Parasal Sınırı
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                isDosyaLimitAsildi
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isDosyaLimitAsildi ? 'LİMİT AŞILDI' : 'LİMİT DAHİLİNDE'}
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <div className="text-base font-extrabold text-[#0f172a] font-mono">
                {tekAlimLimiti.toLocaleString('tr-TR')} ₺
              </div>
              <div className="text-[10px] text-[#64748b] mt-0.5">
                {idareTipi === 'buyuksehir'
                  ? 'Büyükşehir Belediyesi 2026 Eşiği'
                  : 'Diğer İdareler 2026 Eşiği'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-amber-900 font-mono">
                {currentDosyaTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </div>
              <div className="text-[10px] text-[#64748b]">Aktif Dosya ({currentDosyaNo})</div>
            </div>
          </div>

          {/* İlerleme Çubuğu */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-[#64748b] mb-1 font-medium">
              <span>Dosyanın Limite Oranı</span>
              <span className="font-bold text-[#0f172a]">%{dosyaLimitOrani.toFixed(1)}</span>
            </div>
            <div className="h-2 w-full bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isDosyaLimitAsildi
                    ? 'bg-rose-600'
                    : dosyaLimitOrani > 75
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, dosyaLimitOrani)}%` }}
              />
            </div>
          </div>
        </div>

        {/* KART 2: 4734 m. 62/ı %10 KİK EŞİK KOTASI */}
        <div className="bg-[#fcfdfd] border border-[#e2e8f0] rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#64748b]">
              Yıllık %10 KİK İzin Eşiği (m. 62/ı)
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
              %10 Kuralı
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <div className="text-base font-extrabold text-[#0f172a] font-mono">
                {config.yuzdeOnKotaSiniri.toLocaleString('tr-TR')} ₺
              </div>
              <div className="text-[10px] text-[#64748b] mt-0.5">
                Mal/Hizmet Ödeneği: {config.toplamMalHizmetOdenegi.toLocaleString('tr-TR')} ₺
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-700 font-mono">
                {kalanYuzdeOnKota.toLocaleString('tr-TR')} ₺
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">Kalan İhalesiz Kota</div>
            </div>
          </div>

          {/* İlerleme Çubuğu */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-[#64748b] mb-1 font-medium">
              <span>Kullanılan Toplam DT</span>
              <span className="font-bold text-amber-900 font-mono">
                {kullanilanToplam.toLocaleString('tr-TR')} ₺ (%{yuzdeOnDolulukOrani.toFixed(1)})
              </span>
            </div>
            <div className="h-2 w-full bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  yuzdeOnDolulukOrani > 90
                    ? 'bg-rose-600'
                    : yuzdeOnDolulukOrani > 70
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, yuzdeOnDolulukOrani)}%` }}
              />
            </div>
          </div>
        </div>

        {/* KART 3: İÇ KONTROL & MEVZUAT UYARISI */}
        <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <ShieldCheck className="size-4 text-amber-600" />
              <span>5018 &amp; 4734 İç Kontrol Güvencesi</span>
            </div>
            <p className="text-[11px] text-amber-800/90 mt-1 leading-relaxed">
              4734 sayılı Kanunun 62/ı maddesi gereğince, doğrudan temin (22/d) yoluyla yapılacak mal ve
              hizmet alımları toplamı, bütçeye konulan ödeneklerin <strong>%10&apos;unu</strong> aştığında
              Kamu İhale Kurulu&apos;ndan (KİK) uygun görüş alınması zorunludur.
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-amber-900 font-medium">
            <span>İzin Riski: DÜŞÜK (Güvenli Bölge)</span>
            <span className="font-bold text-emerald-700">✓ Onay Gerekmez</span>
          </div>
        </div>
      </div>

      {/* HARCAMA BİRİMLERİ DAĞILIMI (OPSİYONEL) */}
      {showBirimBreakdown && (
        <div className="mt-4 pt-3 border-t border-[#f1f5f9]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#334155] flex items-center gap-1.5">
              <Building2 className="size-3.5 text-[#64748b]" />
              Harcama Birimi Bazında 22/d Kota Tüketimi
            </span>
            <span className="text-[10px] text-[#64748b]">
              Birim bazlı doğrudan temin bütçe tahsisatı
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {ORNEK_BIRIM_KOTALARI.map((b) => {
              const doluluk = (b.harcananTutar / b.tahsisEdilenKota) * 100
              return (
                <div
                  key={b.birimKodu}
                  className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 text-xs"
                >
                  <div className="font-semibold text-[#0f172a] truncate" title={b.birimAdi}>
                    {b.birimAdi}
                  </div>
                  <div className="text-[10px] text-[#64748b] mt-0.5 font-mono">
                    {b.dosyaSayisi} Dosya • Kod: {b.birimKodu}
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between text-[11px]">
                    <span className="font-mono text-slate-700">
                      {b.harcananTutar.toLocaleString('tr-TR')} ₺
                    </span>
                    <span className="font-bold text-amber-900">%{doluluk.toFixed(0)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#e2e8f0] rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${
                        doluluk > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, doluluk)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

