'use client'

import React, { useRef } from 'react'
import {
  Printer,
  Download,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react'
import { MifKaydi } from '@/lib/bkmybs/mali-entegrasyon'

interface OebBelgeModalProps {
  mif: MifKaydi | null
  isOpen: boolean
  onClose: () => void
}

export function OebBelgeModal({ mif, isOpen, onClose }: OebBelgeModalProps) {
  const printRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !mif) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[#cbd5e1] animate-in fade-in zoom-in-95 duration-200">
        {/* MODAL ÜST ARAÇ ÇUBUĞU */}
        <div className="bg-[#0f172a] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg font-bold">
              <FileSpreadsheet className="size-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Ödeme Emri Belgesi (ÖEB) Matbu Görüntüleyici</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-md">
                  5018 &amp; BKMYBS
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                {mif.mifNo} • {mif.oebNo} • {mif.harcamaBirimi}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-sm transition"
            >
              <Printer className="size-3.5" />
              <span>A4 Yazdır / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Kapat"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* MODAL GÖVDE: RESMÎ A4 MATBU ÖDEME EMRİ BELGESİ (Muhasebat Standardı) */}
        <div className="p-6 overflow-y-auto bg-[#f1f5f9] flex-1 flex justify-center">
          <div
            ref={printRef}
            className="w-full max-w-[210mm] bg-white border border-[#cbd5e1] shadow-md p-8 text-[#0f172a] font-sans print:shadow-none print:border-none print:p-0 print:m-0"
          >
            {/* 1. ÜST ANTET & LOGO */}
            <div className="text-center border-b-2 border-slate-900 pb-3">
              <div className="text-xs font-bold tracking-wider">T.C.</div>
              <div className="text-sm font-extrabold tracking-wide uppercase">
                İSTANBUL BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI
              </div>
              <div className="text-xs font-bold uppercase mt-0.5">{mif.harcamaBirimi}</div>
              <div className="mt-2 text-base font-black tracking-widest uppercase border-y border-slate-300 py-1 bg-slate-50">
                ÖDEME EMRİ BELGESİ (ÖEB)
              </div>
            </div>

            {/* 2. BELGE VE BİRİM KÜNYESİ */}
            <div className="grid grid-cols-2 text-xs border-b border-slate-400 mt-2 pb-2 gap-x-4">
              <div className="space-y-1">
                <div className="flex">
                  <span className="w-32 font-bold text-slate-700">Muhasebe Birimi:</span>
                  <span className="font-semibold">{mif.muhasebeKodu} / Mali Hizmetler Dairesi</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-bold text-slate-700">Harcama Birimi:</span>
                  <span className="font-semibold">
                    {mif.harcamaBirimiKodu} - {mif.harcamaBirimi}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 font-bold text-slate-700">İlişkili Dosya No:</span>
                  <span className="font-mono font-bold text-amber-900">
                    {mif.dosyaNo || '4734 m. 22/d Doğrudan Temin'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Bütçe Yılı:</span>
                  <span className="font-mono font-bold">{mif.butceYili}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">MİF / Belge No:</span>
                  <span className="font-mono font-bold">{mif.mifNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">ÖEB Sıra No:</span>
                  <span className="font-mono font-bold text-slate-900">{mif.oebNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Düzenleme Tarihi:</span>
                  <span className="font-mono">{mif.tarih}</span>
                </div>
              </div>
            </div>

            {/* 3. ALACAKLI & HAK SAHİBİ BİLGİLERİ */}
            <div className="mt-3 border border-slate-300 rounded-md p-2.5 bg-slate-50/70 text-xs">
              <div className="font-bold text-slate-800 uppercase text-[11px] mb-1.5 flex items-center justify-between border-b border-slate-200 pb-1">
                <span>HAK SAHİBİ / ALACAKLI BİLGİLERİ</span>
                <span className="text-[10px] font-normal text-slate-500">MYS Yüklenici Tanımı</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">Unvan / Ad Soyad:</span>
                  <span className="font-bold text-slate-900">{mif.alacakliFirma}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Vergi Kimlik No / TCKN:</span>
                  <span className="font-mono font-bold text-slate-900">{mif.alacakliVkn}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px]">Banka Hesap Numarası (IBAN):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {mif.alacakliIban || 'TR33 0006 2000 0001 2345 6789 01 (Vakıfbank)'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. ÖDEMENİN KONUSU VE TERTİP CETVELİ */}
            <div className="mt-3">
              <div className="text-xs font-bold text-slate-800 mb-1">
                ÖDEMENİN GEREKÇESİ VE İŞİN KONUSU:
              </div>
              <div className="p-2 border border-slate-300 bg-white rounded-md text-xs font-medium text-slate-700">
                {mif.isKonusu}
              </div>
            </div>

            {/* 5. ANALİTİK BÜTÇE TERTİBİ VE ÖDENEK CETVELİ */}
            <div className="mt-3">
              <div className="text-xs font-bold text-slate-800 mb-1">
                BÜTÇE TERTİBİ VE TAHAKKUK HESABI:
              </div>
              <table className="w-full border-collapse border border-slate-400 text-xs text-left">
                <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-700">
                  <tr>
                    <th className="border border-slate-400 p-1.5">Bütçe Tertibi (Kur-Fonk-Fin-Eko)</th>
                    <th className="border border-slate-400 p-1.5">Açıklama</th>
                    <th className="border border-slate-400 p-1.5 text-right">Borç (Tutar ₺)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 p-1.5 font-mono font-bold">
                      {mif.butceTertibi}
                    </td>
                    <td className="border border-slate-400 p-1.5 text-slate-700">
                      {mif.tertipAciklamasi || 'Doğrudan Temin Mal ve Hizmet Alımı'}
                    </td>
                    <td className="border border-slate-400 p-1.5 font-mono font-bold text-right">
                      {mif.brutTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 6. YASAL KESİNTİLER VE NET ÖDEME MATRİSİ */}
            <div className="mt-3">
              <div className="text-xs font-bold text-slate-800 mb-1">
                YASAL VE DİĞER KESİNTİLER HESABI (360/368 KODLARI):
              </div>
              <table className="w-full border-collapse border border-slate-400 text-xs">
                <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-700 text-left">
                  <tr>
                    <th className="border border-slate-400 p-1.5">Kesinti Türü</th>
                    <th className="border border-slate-400 p-1.5">Yasal Dayanak / Oran</th>
                    <th className="border border-slate-400 p-1.5 text-right">Kesinti Tutarı (₺)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="border border-slate-400 p-1.5">Damga Vergisi (Hakediş/Fatura)</td>
                    <td className="border border-slate-400 p-1.5 font-mono text-[11px]">
                      488 Sayılı K. (Binde 9,48)
                    </td>
                    <td className="border border-slate-400 p-1.5 font-mono text-right">
                      {mif.damgaVergisi.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                  </tr>
                  {mif.kararPulu > 0 && (
                    <tr>
                      <td className="border border-slate-400 p-1.5">İhale Karar Pulu</td>
                      <td className="border border-slate-400 p-1.5 font-mono text-[11px]">
                        488 Sayılı K. (Binde 5,69)
                      </td>
                      <td className="border border-slate-400 p-1.5 font-mono text-right">
                        {mif.kararPulu.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </td>
                    </tr>
                  )}
                  {mif.kdvTevkifatTutari > 0 && (
                    <tr>
                      <td className="border border-slate-400 p-1.5">KDV Tevkifatı</td>
                      <td className="border border-slate-400 p-1.5 font-mono text-[11px]">
                        KDV Genel Uygulama Tebliği ({mif.kdvTevkifatOrani})
                      </td>
                      <td className="border border-slate-400 p-1.5 font-mono text-right">
                        {mif.kdvTevkifatTutari.toLocaleString('tr-TR', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        ₺
                      </td>
                    </tr>
                  )}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="border border-slate-400 p-1.5 text-right">
                      TOPLAM YASAL KESİNTİLER:
                    </td>
                    <td className="border border-slate-400 p-1.5 font-mono text-right text-rose-700">
                      {mif.toplamKesinti.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 7. NET ÖDENECEK TUTAR KUTUSU */}
            <div className="mt-3 p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold block">
                  HAK SAHİBİNE NET ÖDENECEK TUTAR
                </span>
                <span className="text-xs text-slate-400">
                  {mif.tifNo ? `TKYS Taşınır İşlem Fişi No: ${mif.tifNo}` : 'Hizmet Hakedişi'}
                </span>
              </div>
              <div className="text-xl font-black font-mono text-amber-400">
                {mif.netOdenecek.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </div>
            </div>

            {/* 8. 5018 SAYILI KANUN İMZA VE ONAY BLOKLARI */}
            <div className="mt-6 pt-4 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center text-xs">
              <div className="border border-slate-300 p-3 rounded-md bg-white">
                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  DÜZENLEYEN / MUTEMET
                </div>
                <div className="mt-4 font-bold text-slate-900">Ayşe Yılmaz</div>
                <div className="text-[10px] text-slate-600">Veri Hazırlama ve Kont. İşl.</div>
                <div className="mt-3 text-[9px] text-slate-400 font-mono">Tarih: {mif.tarih}</div>
                <div className="mt-1 text-[10px] font-semibold text-emerald-600">✓ Paraf Edildi</div>
              </div>

              <div className="border border-slate-300 p-3 rounded-md bg-white">
                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  GERÇEKLEŞTİRME GÖREVLİSİ
                </div>
                <div className="mt-4 font-bold text-slate-900">{mif.gerceklestirmeGorevlisi}</div>
                <div className="text-[10px] text-slate-600">Satın Alma Şube Müdürü</div>
                <div className="mt-3 text-[9px] text-slate-400 font-mono">5018 Sayılı K. Madde 33</div>
                <div className="mt-1 text-[10px] font-semibold text-emerald-600">✓ E-İmzalandı</div>
              </div>

              <div className="border border-slate-300 p-3 rounded-md bg-white">
                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  HARCAMA YETKİLİSİ
                </div>
                <div className="mt-4 font-bold text-slate-900">{mif.harcamaYetkilisi}</div>
                <div className="text-[10px] text-slate-600">Destek Hizmetleri Daire Bşk.</div>
                <div className="mt-3 text-[9px] text-slate-400 font-mono">5018 Sayılı K. Madde 31</div>
                <div className="mt-1 text-[10px] font-semibold text-amber-600">
                  ● Onaylandı (Ödemeye Sevk)
                </div>
              </div>
            </div>

            {/* 9. ALT DİPNOT & BARKOD / MEVZUAT */}
            <div className="mt-4 pt-2 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <div>
                BKMYBS-MYS ID: {mif.id} • 5018 Sayılı Kanun Madde 31, 32, 33 Uygunluğu Tamdır.
              </div>
              <div>Kamu-360 / workdesk-360 Matbu Çıktı Standardı</div>
            </div>
          </div>
        </div>

        {/* MODAL ALT ÇUBUĞU */}
        <div className="bg-[#f8fafc] border-t border-[#cbd5e1] px-5 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>MİF Durumu: </span>
            <span className="font-semibold text-slate-900">{mif.durum}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 font-semibold text-slate-800 bg-white border border-[#cbd5e1] hover:bg-slate-100 rounded-lg transition"
            >
              Yazdır
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

