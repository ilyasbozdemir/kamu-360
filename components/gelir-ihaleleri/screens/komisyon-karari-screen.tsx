'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  FileCheck2,
  FileSignature,
  FileText,
  Gavel,
  Lock,
  Printer,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'
import { ORNEK_KOMISYON, KomisyonUyesi2886 } from '@/lib/gelir-ihaleleri-data'
import { PrimaryButton, OutlineButton } from '@/components/procurement/primitives'

export function KomisyonKarariScreen() {
  const [komisyon, setKomisyon] = useState<KomisyonUyesi2886[]>(ORNEK_KOMISYON)
  const [ihaleYetkilisiOnayi, setIhaleYetkilisiOnayi] = useState(true)
  const [isSigned, setIsSigned] = useState(false)

  return (
    <div className="space-y-4">
      {/* Karar Özet Kartı */}
      <div className="rounded-lg border border-[#e1e5ea] bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-[#edf0f4] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#eef3ff] text-[#2d62d7]">
              <Gavel className="size-5" />
            </span>
            <div>
              <h2 className="text-[14px] font-bold text-[#172334]">
                2886 Sayılı Kanun İhale Komisyonu Karar Tutanağı
              </h2>
              <p className="text-[11px] text-[#64748b]">
                Dosya No: <strong>2886-2024/01</strong> — Karar No: <strong>2024/K-14</strong>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <OutlineButton onClick={() => window.print()}>
              <Printer className="mr-1 inline size-3.5" /> Karar Tutanağını Yazdır
            </OutlineButton>
            <PrimaryButton onClick={() => setIsSigned(true)}>
              {isSigned ? (
                <>
                  <Lock className="mr-1 inline size-3.5" /> Karar Kesinleşti
                </>
              ) : (
                <>
                  <FileSignature className="mr-1 inline size-3.5" /> E-İmza ile Onayla
                </>
              )}
            </PrimaryButton>
          </div>
        </div>

        {/* Karar Metni */}
        <div className="rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-4 text-[12px] leading-relaxed text-[#334155] space-y-3">
          <div className="font-bold text-[#1e293b]">GEREKÇELİ İHALE KOMİSYON KARARI:</div>
          <p className="text-justify indent-6">
            Komisyonumuzca 22.07.2024 tarihinde saat 14:30'da 2886 Sayılı Devlet İhale Kanunu ve Şirketimiz Satış/Kiralama İhale Yönetmeliği uyarınca Açık Artırma Usulü ile icra edilen "ODTÜ Teknokent Binası Zemin Kat 180 m² Ticari Alan Kiralama İhalesi"ne ilişkin oturum tamamlanmıştır.
          </p>
          <p className="text-justify indent-6">
            Yapılan pey artırımları sonucunda, aylık muhammen bedeli 85.000 TL olan taşınmaz için en yüksek teklif aylık <strong>112.000,00 TL (Yüz On İki Bin Türk Lirası) + KDV</strong> ile <strong>Turkuaz Gayrimenkul Yatırım A.Ş.</strong> tarafından verilmiştir. İsteklinin geçici teminat mektubu ve yeterlilik evrakları eksiksiz olup, ihale şartnamesinde aranan tüm yasal ve mali koşulları sağladığı tespit edilmiştir.
          </p>
          <p className="font-semibold text-[#1e293b]">
            SONUÇ: Söz konusu taşınmaz kiralama ihalesinin en yüksek teklif sahibi Turkuaz Gayrimenkul Yatırım A.Ş. üzerine yapılmasına ve karar asıllarının Harcama / İhale Yetkilisinin onayına arz edilmesine oy birliğiyle karar verilmiştir.
          </p>
        </div>

        {/* Komisyon Üyeleri İmzaları */}
        <div className="mt-6">
          <h4 className="mb-3 text-[12px] font-bold text-[#172334]">
            İhale Komisyon Heyeti & İmza Durumu (5/5 İmzalı)
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {komisyon.map((uye, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-lg border border-[#e2e8f0] bg-white p-3 text-center shadow-xs"
              >
                <div>
                  <span className="text-[10px] font-semibold text-[#2d62d7]">{uye.gorev}</span>
                  <div className="mt-1 font-bold text-[12px] text-[#1e293b]">{uye.adSoyad}</div>
                  <div className="text-[10px] text-[#64748b] leading-tight mt-0.5">{uye.unvan}</div>
                </div>
                <div className="mt-3 border-t border-[#edf0f4] pt-2">
                  <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="mr-1 size-3" /> E-İmzalandı
                  </span>
                  <div className="mt-0.5 font-mono text-[9px] text-[#94a3b8]">{uye.imzaTarihi}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* İhale Yetkilisi Onayı */}
        <div className="mt-6 rounded-lg border-2 border-emerald-200 bg-emerald-50/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                İHALE YETKİLİSİ ONAYI (İTA AMİRİ OLURU)
              </span>
              <h3 className="mt-1.5 text-[13px] font-bold text-[#1e293b]">
                İhale Komisyon Kararı Onaylandı — Sözleşmeye Davet Aşamasına Geçildi
              </h3>
              <p className="text-[11px] text-[#475569]">
                2886 Sayılı Kanunun ilgili maddesi gereğince ihale yetkilisince onaylanarak kesinleşmiştir.
              </p>
            </div>
            <div className="text-right text-[11px]">
              <span className="font-semibold text-[#1e293b]">Dr. Hakan Yılmaz</span>
              <div className="text-[#64748b] text-[10px]">Genel Müdür / İhale Yetkilisi</div>
              <div className="font-mono text-[10px] text-emerald-700 font-bold mt-0.5">
                Onay Tarihi: 23.07.2024 10:30
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
