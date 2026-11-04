'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Gavel,
  History,
  Lock,
  Plus,
  Printer,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react'
import { ORNEK_ISTEKLILER, IstekliPey } from '@/lib/gelir-ihaleleri-data'
import { PrimaryButton, OutlineButton } from '@/components/procurement/primitives'

export function TeklifArtirmaScreen() {
  const [istekliler, setIstekliler] = useState<IstekliPey[]>(ORNEK_ISTEKLILER)
  const [selectedIstekli, setSelectedIstekli] = useState<string>(ORNEK_ISTEKLILER[0].istekliAdi)
  const [artirimTutari, setArtirimTutari] = useState<number>(2000)
  const [tutanakKilitli, setTutanakKilitli] = useState(false)

  // En yüksek teklifi bul
  const enYuksekTeklif = Math.max(...istekliler.map((i) => i.sonTeklif))
  const kazanan = istekliler.find((i) => i.sonTeklif === enYuksekTeklif)

  const handlePeySur = () => {
    if (tutanakKilitli) return
    const yeniTeklif = enYuksekTeklif + artirimTutari
    setIstekliler((prev) =>
      prev.map((istekli) => {
        if (istekli.istekliAdi === selectedIstekli) {
          return {
            ...istekli,
            sonTeklif: yeniTeklif,
            durum: 'En Yüksek Teklif (Kazanan)',
          }
        } else {
          return {
            ...istekli,
            durum: istekli.durum === 'Çekildi' ? 'Çekildi' : 'Devam Ediyor',
          }
        }
      })
    )
  }

  const handleIstekliCekil = (ad: string) => {
    setIstekliler((prev) =>
      prev.map((i) => (i.istekliAdi === ad ? { ...i, durum: 'Çekildi' } : i))
    )
  }

  return (
    <div className="space-y-4">
      {/* Üst Canlı İhale Barı */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[11px] font-medium">Başlangıç (Muhammen) Bedel</span>
            <Gavel className="size-4 text-[#2d62d7]" />
          </div>
          <div className="mt-1 text-[22px] font-bold text-[#1e293b]">85.000 TL</div>
          <div className="text-[10px] text-[#8c9ba8]">Dosya: 2886-2024/01</div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[11px] font-semibold">Güncel En Yüksek Pey (Teklif)</span>
            <TrendingUp className="size-4 text-emerald-600" />
          </div>
          <div className="mt-1 text-[22px] font-bold text-emerald-700">
            {enYuksekTeklif.toLocaleString('tr-TR')} TL
          </div>
          <div className="truncate text-[10px] font-medium text-emerald-800">
            Lider: <strong>{kazanan?.istekliAdi}</strong>
          </div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[11px] font-medium">Toplam Artış Tutarı</span>
            <ArrowUpRight className="size-4 text-[#16a34a]" />
          </div>
          <div className="mt-1 text-[22px] font-bold text-[#16a34a]">
            +{(enYuksekTeklif - 85000).toLocaleString('tr-TR')} TL
          </div>
          <div className="text-[10px] text-[#8c9ba8]">
            %{(((enYuksekTeklif - 85000) / 85000) * 100).toFixed(1)} Değer Artışı Sağlandı
          </div>
        </div>
      </div>

      {/* Pey Sürme / Canlı Açık Artırma Kontrol Paneli */}
      <div className="rounded-lg border border-[#e1e5ea] bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-[#edf0f4] pb-3 mb-4">
          <div>
            <h3 className="text-[13px] font-bold text-[#172334]">
              Canlı Açık Artırma & Pey Sürme Masası
            </h3>
            <p className="text-[11px] text-[#64748b]">
              Komisyon huzurunda istekliler adına pey artırımı yapın ve teklif turunu kaydedin.
            </p>
          </div>
          <div className="flex gap-2">
            <OutlineButton onClick={() => window.print()}>
              <Printer className="mr-1 inline size-3.5" /> Pey Tutanak Çıktısı
            </OutlineButton>
            <PrimaryButton onClick={() => setTutanakKilitli(!tutanakKilitli)}>
              {tutanakKilitli ? (
                <>
                  <Lock className="mr-1 inline size-3.5" /> İhale Kilitlendi
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1 inline size-3.5" /> İhaleyi Sonlandır & Kilitle
                </>
              )}
            </PrimaryButton>
          </div>
        </div>

        {/* Pey Giriş Barı */}
        <div className="rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-4">
          <div className="grid gap-3 sm:grid-cols-4 items-end text-[11px]">
            <div>
              <label className="mb-1 block font-semibold text-[#334155]">Pey Süren İstekli</label>
              <select
                value={selectedIstekli}
                onChange={(e) => setSelectedIstekli(e.target.value)}
                disabled={tutanakKilitli}
                className="w-full rounded border border-[#cbd5e1] bg-white px-3 py-1.5 text-[12px] font-medium"
              >
                {istekliler
                  .filter((i) => i.durum !== 'Çekildi')
                  .map((i) => (
                    <option key={i.istekliAdi} value={i.istekliAdi}>
                      {i.istekliAdi}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-[#334155]">Artırım Tutarı</label>
              <div className="flex gap-1.5">
                {[1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setArtirimTutari(amt)}
                    className={`rounded px-2.5 py-1 text-[11px] font-bold transition ${
                      artirimTutari === amt
                        ? 'bg-[#2d62d7] text-white'
                        : 'border border-[#cbd5e1] bg-white text-[#475569] hover:bg-[#f1f4f9]'
                    }`}
                  >
                    +{amt.toLocaleString('tr-TR')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-[#334155]">Oluşacak Yeni Teklif</label>
              <div className="rounded border border-[#cbd5e1] bg-white px-3 py-1 text-[13px] font-bold text-[#2d62d7]">
                {(enYuksekTeklif + artirimTutari).toLocaleString('tr-TR')} TL
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handlePeySur}
                disabled={tutanakKilitli}
                className="w-full rounded bg-emerald-600 px-4 py-2 text-[12px] font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
              >
                Pey Sür (Teklifi Artır)
              </button>
            </div>
          </div>
        </div>

        {/* İstekliler ve Teklif Karşılaştırma Tablosu */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#edf0f4] text-[#8c9ba8]">
                <th className="pb-2.5 font-semibold">Sıra</th>
                <th className="pb-2.5 font-semibold">İstekli Firma / Kişi</th>
                <th className="pb-2.5 font-semibold">Teminat Durumu</th>
                <th className="pb-2.5 font-semibold">İlk Teklif</th>
                <th className="pb-2.5 font-semibold">1. Tur Pey</th>
                <th className="pb-2.5 font-semibold">2. Tur Pey</th>
                <th className="pb-2.5 font-semibold">Nihai (Son) Teklif</th>
                <th className="pb-2.5 font-semibold">Durum</th>
                <th className="pb-2.5 text-right font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f9]">
              {istekliler.map((i) => (
                <tr key={i.sira} className={`hover:bg-[#fafbfc] ${i.durum.includes('Kazanan') ? 'bg-[#f0fdf4]' : ''}`}>
                  <td className="py-3 font-mono font-bold text-[#1e293b]">{i.sira}</td>
                  <td className="py-3">
                    <div className="font-bold text-[#1e293b]">{i.istekliAdi}</div>
                    <div className="text-[10px] text-[#64748b]">VKN: {i.vergiNo} — Yetkili: {i.yetkili}</div>
                  </td>
                  <td className="py-3">
                    <span className="rounded bg-[#f1f4f9] px-2 py-0.5 text-[10px] font-medium text-[#475569]">
                      {i.teminatDurumu} ({i.teminatTutari.toLocaleString('tr-TR')} TL)
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[#475569]">{i.ilkTeklif.toLocaleString('tr-TR')} TL</td>
                  <td className="py-3 font-mono text-[#475569]">{i.tur1Teklif?.toLocaleString('tr-TR') || '-'} TL</td>
                  <td className="py-3 font-mono text-[#475569]">{i.tur2Teklif?.toLocaleString('tr-TR') || '-'} TL</td>
                  <td className="py-3 font-mono text-[12px] font-bold text-[#2d62d7]">
                    {i.sonTeklif.toLocaleString('tr-TR')} TL
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                        i.durum === 'En Yüksek Teklif (Kazanan)'
                          ? 'bg-emerald-100 text-emerald-800'
                          : i.durum === 'Çekildi'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {i.durum}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {i.durum !== 'Çekildi' && (
                      <button
                        type="button"
                        onClick={() => handleIstekliCekil(i.istekliAdi)}
                        disabled={tutanakKilitli}
                        className="rounded border border-[#dfe3e9] bg-white px-2 py-1 text-[10px] font-medium text-[#64748b] hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      >
                        Çekildi İşaretle
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
