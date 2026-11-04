'use client'

import React from 'react'
import { ORNEK_VARLIKLAR } from '@/lib/gelir-ihaleleri-data'

interface VarliklarTutanagiProps {
  tarih?: string
  sayi?: string
}

export function VarliklarTutanagiTemplate({
  tarih = new Date().toLocaleDateString('tr-TR'),
  sayi = 'E-84125801-755.02.01-2026/084',
}: VarliklarTutanagiProps) {
  const varliklar = ORNEK_VARLIKLAR

  const formatTL = (val: number) =>
    val.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' TL'

  return (
    <div className="a4-print-sheet mx-auto min-h-[297mm] w-[210mm] bg-white p-[20mm_18mm_20mm_20mm] text-[10.5pt] font-['Times_New_Roman',Times,serif] leading-tight text-[#111827] shadow-lg print:m-0 print:border-none print:shadow-none select-text">
      {/* 1. Antet ve Başlık */}
      <div className="text-center font-bold">
        <p className="text-[12pt]">T.C.</p>
        <p className="text-[11.5pt]">ANKARA BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI</p>
        <p className="text-[11pt]">Emlak ve İstimlak Dairesi Başkanlığı</p>
        <p className="text-[10pt] text-gray-700 font-normal">Taşınmaz ve Varlık Yönetimi Şube Müdürlüğü</p>
        <div className="mt-3 inline-block border-b-2 border-black pb-0.5">
          <p className="text-[12pt] uppercase tracking-wide">
            KİRALANABİLİR VE SATILABİLİR KURUMSAL VARLIKLAR TESPİT VE İHALE HAZIRLIK TUTANAĞI
          </p>
        </div>
      </div>

      {/* 2. Sayı, Konu, Tarih */}
      <div className="mt-4 flex items-center justify-between text-[10pt]">
        <div>
          <p><strong>Sayı :</strong> {sayi}</p>
          <p className="mt-0.5"><strong>Konu:</strong> 2886 Sayılı DİK Kapsamında Varlık Envanter Tespit Raporu</p>
        </div>
        <div className="text-right">
          <p><strong>Tarih:</strong> {tarih}</p>
          <p className="mt-0.5"><strong>Mevzuat:</strong> 2886 Sayılı Kanun (Madde 35 &amp; 45)</p>
        </div>
      </div>

      {/* 3. Giriş Açıklaması */}
      <div className="mt-3 text-[10pt] leading-relaxed text-justify indent-6">
        <p>
          İdaremiz mülkiyetinde ve tasarrufunda bulunan, 2886 Sayılı Devlet İhale Kanunu hükümleri dairesinde kiraya verilmesi,
          mülkiyet devri (satışı), hurda tasfiyesi veya işletme hakkının devredilmesi uygun görülen kurumsal taşınır ve taşınmaz
          varlıklara ait Kıymet Takdir Komisyonu tespit ve muhammen bedel dökümü aşağıda çıkarılmıştır:
        </p>
      </div>

      {/* 4. Varlık Envanteri Tablosu */}
      <table className="mt-3 w-full border-collapse border border-black text-[9pt]">
        <thead className="bg-gray-100 font-bold text-center">
          <tr>
            <th className="border border-black p-1.5 w-8">S.No</th>
            <th className="border border-black p-1.5 w-20">Varlık Kodu</th>
            <th className="border border-black p-1.5 text-left">Varlık Tanımı / Cinsi</th>
            <th className="border border-black p-1.5 text-left">Lokasyon / Ada-Parsel</th>
            <th className="border border-black p-1.5 w-18">Kategori</th>
            <th className="border border-black p-1.5 w-24 text-right">Muhammen Bedel</th>
            <th className="border border-black p-1.5 w-22">İhale Şekli</th>
          </tr>
        </thead>
        <tbody>
          {varliklar.map((v, idx) => (
            <tr key={v.varlikKodu} className={idx % 2 === 1 ? 'bg-gray-50/60' : 'bg-white'}>
              <td className="border border-black p-1.5 text-center font-semibold">{idx + 1}</td>
              <td className="border border-black p-1.5 text-center font-mono font-bold text-[8.5pt]">
                {v.varlikKodu}
              </td>
              <td className="border border-black p-1.5 font-medium">
                <div>{v.ad}</div>
                <div className="text-[8pt] text-gray-500">{v.durum} • {v.tahsisliBirim}</div>
              </td>
              <td className="border border-black p-1.5 text-[8.5pt]">{v.lokasyon}</td>
              <td className="border border-black p-1.5 text-center text-[8.5pt]">{v.kategori}</td>
              <td className="border border-black p-1.5 text-right font-bold text-[9pt]">
                {formatTL(v.ekspertizDegeri)}
              </td>
              <td className="border border-black p-1.5 text-center text-[8.5pt]">
                {v.kategori.includes('Gayrimenkul') ? '2886 / 45 Açık Artırma' : '2886 / 35 Kapalı Teklif'}
              </td>
            </tr>
          ))}
          {/* Dip Toplam Satırı */}
          <tr className="bg-gray-100 font-bold text-[9.5pt]">
            <td colSpan={5} className="border border-black p-2 text-right">
              TOPLAM PORTFÖY MUHAMMEN BEDELİ:
            </td>
            <td className="border border-black p-2 text-right text-[#1b416c] font-black">
              32.030.000 TL
            </td>
            <td className="border border-black p-2 text-center text-[8.5pt] text-gray-700">
              5 Kalem Varlık
            </td>
          </tr>
        </tbody>
      </table>

      {/* 5. Komisyon Kararı ve Gerekçe */}
      <div className="mt-3 rounded border border-black p-2.5 bg-gray-50/60 text-[9.5pt] leading-relaxed">
        <p className="font-bold underline">KIYMET TAKDİR VE İHALE KOMİSYONU TESPİTİ:</p>
        <p className="mt-1 text-justify indent-4">
          Yukarıda tapu, ada-parsel, plaka ve ambar kayıt numaraları belirtilen 5 (beş) adet kurumsal varlığın mahallinde yapılan
          ekspertiz, emlak piyasa rayiçleri ve kasko/hurda değerlemeleri neticesinde tespit edilen asgari muhammen bedelleri
          mevzuata ve idare menfaatlerine uygun bulunmuştur. 2886 Sayılı Devlet İhale Kanununun ilgili maddeleri uyarınca
          ihale ilanı ve dosya tanzimi işlemlerine başlanması komisyonumuzca mütalaa edilmiştir.
        </p>
      </div>

      {/* 6. İmzalar: Kıymet Takdir Heyeti & İhale Yetkilisi */}
      <div className="mt-6">
        <p className="text-center font-bold text-[10pt] mb-3">KIYMET TAKDİR VE TESPİT HEYETİ</p>
        <div className="grid grid-cols-3 gap-3 text-center text-[9pt]">
          <div>
            <p className="font-bold">Mehmet YILDIRIM</p>
            <p className="text-gray-600">Harita Mühendisi / Üye</p>
            <p className="mt-4 italic">İmza ✍️</p>
          </div>
          <div>
            <p className="font-bold">Selin ÇETİN</p>
            <p className="text-gray-600">Gayrimenkul Değerleme Uzm. / Üye</p>
            <p className="mt-4 italic">İmza ✍️</p>
          </div>
          <div>
            <p className="font-bold">Mustafa YILMAZ</p>
            <p className="text-gray-600">Emlak Şube Müdürü / Komisyon Bşk.</p>
            <p className="mt-4 italic">İmza ✍️</p>
          </div>
        </div>

        {/* Makam Oluru */}
        <div className="mt-6 border-t border-gray-400 pt-3 flex justify-between items-center text-[9pt]">
          <div className="text-left text-gray-600 text-[8pt]">
            <p>Evrak Doğrulama Kodu: <strong>2886-VARLIK-8412-QR</strong></p>
            <p>5070 Sayılı Elektronik İmza Kanununa Uygun Olarak Güvenli e-İmzalanmıştır.</p>
          </div>
          <div className="text-center w-52">
            <p className="font-bold text-[9.5pt]">OLUR</p>
            <p className="text-gray-500 text-[8.5pt]">{tarih}</p>
            <p className="mt-1 font-bold text-[9.5pt]">Kemal ARSLAN</p>
            <p className="text-gray-600">Genel Sekreter Yrd. / İhale Yetkilisi</p>
            <p className="mt-2 text-[8pt] text-emerald-800 font-semibold">e-İmzalıdır ✍️</p>
          </div>
        </div>
      </div>
    </div>
  )
}
