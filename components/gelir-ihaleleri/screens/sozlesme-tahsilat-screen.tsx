'use client'

import { useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileCheck2,
  FileText,
  Printer,
  ShieldCheck,
} from 'lucide-react'
import { PrimaryButton, OutlineButton, Badge } from '@/components/procurement/primitives'

export function SozlesmeTahsilatScreen() {
  const tahsilatPlani = [
    { ay: 'Ağustos 2024', vade: '05.08.2024', tutar: 112000, durum: 'Tahsil Edildi', faturaNo: 'FTR-2024-0814' },
    { ay: 'Eylül 2024', vade: '05.09.2024', tutar: 112000, durum: 'Tahsil Edildi', faturaNo: 'FTR-2024-0922' },
    { ay: 'Ekim 2024', vade: '05.10.2024', tutar: 112000, durum: 'Tahsil Edildi', faturaNo: 'FTR-2024-1019' },
    { ay: 'Kasım 2024', vade: '05.11.2024', tutar: 112000, durum: 'Bekliyor', faturaNo: '-' },
    { ay: 'Aralık 2024', vade: '05.12.2024', tutar: 112000, durum: 'Bekliyor', faturaNo: '-' },
    { ay: 'Ocak 2025', vade: '05.01.2025', tutar: 112000, durum: 'Bekliyor', faturaNo: '-' },
  ]

  return (
    <div className="space-y-4">
      {/* Sözleşme & Teminat Başlık Kartı */}
      <div className="grid gap-3 sm:grid-cols-3 text-[11px]">
        <div className="rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="font-medium">Sözleşme Numarası</span>
            <FileCheck2 className="size-4 text-[#2d62d7]" />
          </div>
          <div className="mt-1 text-[16px] font-bold text-[#1e293b]">SZL-2886-2024/01</div>
          <div className="mt-1 text-[#475569]">Kiracı: <strong>Turkuaz Gayrimenkul A.Ş.</strong></div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="font-semibold">Kesin Teminat Durumu (%6)</span>
            <ShieldCheck className="size-4 text-emerald-600" />
          </div>
          <div className="mt-1 text-[16px] font-bold text-emerald-700">80.640,00 TL</div>
          <div className="mt-1 text-emerald-800 font-medium">Banka Teminat Mektubu Alındı</div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="font-medium">Yıllık Tahsilat Hedefi</span>
            <CreditCard className="size-4 text-[#16a34a]" />
          </div>
          <div className="mt-1 text-[16px] font-bold text-[#16a34a]">1.344.000,00 TL + KDV</div>
          <div className="mt-1 text-[#64748b]">336.000 TL Tahsil Edildi (%25)</div>
        </div>
      </div>

      {/* Sözleşme Koşulları & Tahsilat Tablosu */}
      <div className="rounded-lg border border-[#e1e5ea] bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-[#edf0f4] pb-3 mb-4">
          <div>
            <h3 className="text-[13px] font-bold text-[#172334]">
              Kira Sözleşmesi & Düzenli Tahsilat Takvimi
            </h3>
            <p className="text-[11px] text-[#64748b]">
              Aylık kira tahsilatları, e-fatura numaraları ve vade takibi.
            </p>
          </div>
          <div className="flex gap-2">
            <OutlineButton onClick={() => window.print()}>
              <Printer className="mr-1 inline size-3.5" /> Sözleşmeyi Yazdır
            </OutlineButton>
            <PrimaryButton>
              <CreditCard className="mr-1 inline size-3.5" /> Yeni Tahsilat Girişi
            </PrimaryButton>
          </div>
        </div>

        {/* Sözleşme Parametreleri */}
        <div className="grid gap-3 sm:grid-cols-4 rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-3.5 text-[11px] mb-4">
          <div>
            <span className="text-[#64748b]">Sözleşme Süresi:</span>
            <div className="font-bold text-[#1e293b]">3 Yıl (36 Ay)</div>
          </div>
          <div>
            <span className="text-[#64748b]">Geçerlilik Aralığı:</span>
            <div className="font-bold text-[#1e293b]">01.08.2024 - 31.07.2027</div>
          </div>
          <div>
            <span className="text-[#64748b]">Yıllık Artış Kriteri:</span>
            <div className="font-bold text-[#2d62d7]">TÜFE (12 Aylık Ort.)</div>
          </div>
          <div>
            <span className="text-[#64748b]">Gecikme Faizi:</span>
            <div className="font-bold text-[#1e293b]">Aylık %3,50 Gecikme Zammı</div>
          </div>
        </div>

        {/* Tahsilat Tablosu */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#edf0f4] text-[#8c9ba8]">
                <th className="pb-2.5 font-semibold">Dönem / Ay</th>
                <th className="pb-2.5 font-semibold">Son Ödeme (Vade)</th>
                <th className="pb-2.5 font-semibold">Tahakkuk Tutarı</th>
                <th className="pb-2.5 font-semibold">Fatura / Makbuz No</th>
                <th className="pb-2.5 font-semibold">Durum</th>
                <th className="pb-2.5 text-right font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f9]">
              {tahsilatPlani.map((t, idx) => (
                <tr key={idx} className="hover:bg-[#fafbfc]">
                  <td className="py-2.5 font-bold text-[#1e293b]">{t.ay}</td>
                  <td className="py-2.5 font-mono text-[#475569]">{t.vade}</td>
                  <td className="py-2.5 font-mono font-bold text-[#2d62d7]">
                    {t.tutar.toLocaleString('tr-TR')} TL
                  </td>
                  <td className="py-2.5 font-mono text-[#64748b]">{t.faturaNo}</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                        t.durum === 'Tahsil Edildi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.durum}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      className="rounded border border-[#dfe3e9] bg-white px-2 py-1 text-[10px] font-medium text-[#475569] hover:border-[#2d62d7] hover:text-[#2d62d7]"
                    >
                      {t.durum === 'Tahsil Edildi' ? 'Makbuz İndir' : 'Tahsil Et'}
                    </button>
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
