"use client";

import React from "react";
import { TeminDosyasiKaydi } from "@/lib/temin-dosyasi/schema";
import { useKurumVeRotaAyarlari } from "@/lib/settings/kurum-ve-rota-ayarlari";

/**
 * 1. İHALE / HARCAMA ONAY BELGESİ (DOC_ONAY_BELGESI)
 * 4734 Sayılı Kanun Madde 22/d Doğrudan Temin ve Bütçe Kanunu Uyumlu
 */
export function OnayBelgesiTemplate({ data }: { data: TeminDosyasiKaydi }) {
  const settings = useKurumVeRotaAyarlari();

  const kurumBasligi = data.antet_ek_satir || settings.kurumAdi;
  const birimAdi = data.birim ||
    `${settings.daireBaskanligi} - ${settings.subeMudurlugu}`;
  const harcamaYetkilisi = data.onay_personel_adi ||
    settings.harcamaYetkilisiAdi;
  const gerceklestirmeGorevlisi = data.hazirlayan_personel_adi ||
    settings.gerceklestirmeGorevlisiAdi;

  return (
    <div className="a4-print-sheet mx-auto min-h-[297mm] w-[210mm] bg-white p-[20mm_18mm_20mm_20mm] text-[11pt] font-['Times_New_Roman',Times,serif] leading-tight text-[#111827] shadow-lg print:m-0 print:border-none print:shadow-none flex flex-col justify-between">
      <div>
        {/* Antet */}
        <div className="text-center font-bold">
          <p className="text-[12pt]">{kurumBasligi}</p>
          <p className="text-[11pt]">{birimAdi}</p>
          <p className="mt-3 text-[13pt] tracking-wide underline underline-offset-4">
            HARCAMA TALİMATI / ONAY BELGESİ
          </p>
        </div>

        {/* Belge Üst Bilgileri */}
        <div className="mt-4 flex justify-between text-[10pt] font-semibold">
          <div>
            <span>Dosya No:</span>
            <span className="font-mono">{data.temin_no}</span>
          </div>
          <div>
            <span>Tarih:</span>
            <span>
              {data.temin_tarihi || new Date().toLocaleDateString("tr-TR")}
            </span>
          </div>
        </div>

        {/* Onay Tablosu (Kamu İhale Mevzuatı Matbu Formatı) */}
        <table className="mt-3 w-full border-collapse border border-black text-[10pt]">
          <tbody>
            <tr>
              <td className="w-1/3 border border-black bg-gray-100 p-2 font-bold">
                1. İdarenin Adı
              </td>
              <td className="border border-black p-2">{birimAdi}</td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-2 font-bold">
                2. İşin Adı / Konusu
              </td>
              <td className="border border-black p-2 font-bold">{data.konu}</td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-2 font-bold">
                3. İşin Niteliği, Türü ve Miktarı
              </td>
              <td className="border border-black p-2">
                {data.tur.toUpperCase()}{" "}
                Alımı ({data.isin_aciklamasi ||
                  "İhtiyaç listesinde belirtilen kalemler"})
              </td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-2 font-bold">
                4. Yasal Dayanağı / İhale Usulü
              </td>
              <td className="border border-black p-2 font-semibold">
                4734 Sayılı KİK Madde {data.ihale_sekli || "22/d"}{" "}
                (Doğrudan Temin Usulü)
              </td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-2 font-bold">
                5. Yaklaşık Maliyet (KDV Hariç)
              </td>
              <td className="border border-black p-2 font-bold text-[#1b416c]">
                {data.yaklasik_maliyet.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })} TL
              </td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-2 font-bold">
                6. Bütçe Tertibi / Mali Kodlar
              </td>
              <td className="border border-black p-2">
                <div className="grid grid-cols-2 gap-1 text-[9pt]">
                  <div>
                    <strong>Bütçe Yılı:</strong> {data.butce_yili}
                  </div>
                  <div>
                    <strong>Bütçe Tipi:</strong> {data.butce_tipi}
                  </div>
                  <div>
                    <strong>Ekonomik Kod:</strong>{" "}
                    {data.ekonomik_kod || "03.2.1.01"}
                  </div>
                  <div>
                    <strong>Fonksiyonel Kod:</strong>{" "}
                    {data.fonksiyonel_kod || "01.3.1.00"}
                  </div>
                  <div>
                    <strong>Finansman Kodu:</strong>{" "}
                    {data.finansman_kodu || "05.1"}
                  </div>
                  <div>
                    <strong>Say2000i:</strong> {data.say2000i || "-"}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-2 font-bold">
                7. Görevlendirilen Personeller
              </td>
              <td className="border border-black p-2 text-[9pt]">
                Piyasa Fiyat Araştırması ve Muayene Kabul işlemleri için
                görevlendirilen komisyon üyeleri.
              </td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-2 font-bold">
                8. İfa / Teslim Yeri ve Süresi
              </td>
              <td className="border border-black p-2">
                {data.ihtiyac_yeri} (Sözleşme/Sipariş tarihinden itibaren{" "}
                {data.teslim_gun} takvim günü)
              </td>
            </tr>
          </tbody>
        </table>

        {/* Makam Olur Metni */}
        <div className="mt-4 text-[10.5pt] leading-relaxed">
          <p className="text-justify indent-8">
            Yukarıda konusu, niteliği, yaklaşık maliyeti ve bütçe tertibi
            belirtilen iş için 4734 Sayılı Kamu İhale Kanununun{" "}
            <strong>{data.ihale_sekli || "22/d"}</strong>{" "}
            maddesi uyarınca doğrudan temin usulüyle alımın gerçekleştirilmesi,
            gerekli piyasa fiyat araştırmasının yapılması ve harcama talimatının
            verilmesi hususunu olurlarınıza arz ederim.
          </p>
        </div>
      </div>

      <div>
        {/* İmzalar */}
        <div className="mt-8 flex justify-between px-4 text-center">
          <div className="w-56">
            <p className="font-bold">{gerceklestirmeGorevlisi}</p>
            <p className="text-[9.5pt] text-gray-700">
              {settings.gerceklestirmeGorevlisiUnvan}
            </p>
            <p className="mt-8 text-[9pt] italic">Teklif Eden ✍️</p>
          </div>

          <div className="w-56">
            <p className="font-bold">UYGUNDUR</p>
            <p className="text-[9.5pt]">
              {new Date().toLocaleDateString("tr-TR")}
            </p>
            <p className="mt-2 font-bold">{harcamaYetkilisi}</p>
            <p className="text-[9.5pt] text-gray-700">
              {settings.harcamaYetkilisiUnvan}
            </p>
            <p className="mt-4 text-[9pt] font-semibold text-emerald-800">
              5070 Sayılı Kanun Uyarınca e-İmzalıdır ✍️
            </p>
          </div>
        </div>

        {/* EBYS Doğrulama & Karekod Şeridi */}
        {settings.karekodGoster && (
          <div className="mt-6 border-t border-gray-300 pt-2 flex items-center justify-between text-[7.5pt] text-gray-600 font-mono">
            <span>
              EBYS Doğrulama Kodu: {settings.dogrulamaKodu}{" "}
              | 5070 S.K. Güvenli e-İmzalı
            </span>
            <span>{settings.ebysEvrakFormat} Standardı</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 2. PİYASA FİYAT ARAŞTIRMASI TUTANAĞI (DOC_PIYASA_FIYAT_ARASTIRMASI)
 */
export function PiyasaFiyatArastirmasiTemplate(
  { data }: { data: TeminDosyasiKaydi },
) {
  const settings = useKurumVeRotaAyarlari();

  const kurumBasligi = data.antet_ek_satir || settings.kurumAdi;
  const birimAdi = data.birim ||
    `${settings.daireBaskanligi} - ${settings.subeMudurlugu}`;

  const firmalar = data.firmalar && data.firmalar.length > 0
    ? data.firmalar.map((f, idx) => ({
      sira: f.sira_no || idx + 1,
      firma: f.firma_adi,
      teklif: f.toplam_teklif,
      kdv: f.kdv_durumu || "Hariç",
      sonuc: f.degerlendirme_sonucu ||
        (f.kazanan_mi ? "En Avantajlı Teklif (Uygun)" : `${idx + 1}. Teklif`),
      kazanan: f.kazanan_mi ?? (idx === 0),
    }))
    : [
      {
        sira: 1,
        firma: data.kazanan_firma_adi || "Turuncu Ofis Bilişim Ltd. Şti.",
        teklif: data.net_odenen || 142800.0,
        kdv: "Hariç",
        sonuc: "En Avantajlı Teklif (Uygun)",
        kazanan: true,
      },
      {
        sira: 2,
        firma: "Ankara Kurumsal Kırtasiye A.Ş.",
        teklif: data.yaklasik_maliyet * 1.025,
        kdv: "Hariç",
        sonuc: "İkinci Teklif",
        kazanan: false,
      },
      {
        sira: 3,
        firma: "Başkent Bilişim Sistemleri San. Tic.",
        teklif: data.yaklasik_maliyet * 1.055,
        kdv: "Hariç",
        sonuc: "Üçüncü Teklif",
        kazanan: false,
      },
    ];

  const arastirmaUyeleri =
    data.komisyon_uyeleri?.filter((u) => u.rol === "piyasa_arastirma") || [];
  const uyeler = arastirmaUyeleri.length > 0
    ? arastirmaUyeleri
    : settings.piyasaArastirmaUyeleri &&
        settings.piyasaArastirmaUyeleri.length > 0
    ? settings.piyasaArastirmaUyeleri
    : [
      { ad_soyad: "Mehmet DÜNDAR", unvan: "Büro Personeli / Üye" },
      { ad_soyad: "Serkan DEMİR", unvan: "Tekniker / Üye" },
      {
        ad_soyad: "Mustafa YILMAZ",
        unvan: "Satınalma Şube Müdürü V. / Başkan",
      },
    ];

  return (
    <div className="a4-print-sheet mx-auto min-h-[297mm] w-[210mm] bg-white p-[20mm_18mm_20mm_20mm] text-[11pt] font-['Times_New_Roman',Times,serif] leading-tight text-[#111827] shadow-lg print:m-0 print:border-none print:shadow-none flex flex-col justify-between">
      <div>
        <div className="text-center font-bold">
          <p className="text-[12pt]">{kurumBasligi}</p>
          <p className="text-[11pt]">{birimAdi}</p>
          <p className="mt-3 text-[13pt] underline underline-offset-4">
            PİYASA FİYAT ARAŞTIRMASI TUTANAĞI
          </p>
        </div>

        <div className="mt-4 space-y-1 text-[10pt]">
          <div>
            <strong>Dosya Numarası :</strong> {data.temin_no}
          </div>
          <div>
            <strong>Temin Konusu :</strong> {data.konu}
          </div>
          <div>
            <strong>İhale Şekli :</strong> 4734 Sayılı Kanun Madde{" "}
            {data.ihale_sekli || "22/d"}
          </div>
          <div>
            <strong>Yaklaşık Maliyet:</strong>{" "}
            {data.yaklasik_maliyet.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
            })} TL
          </div>
        </div>

        {/* Alınan Teklifler Tablosu */}
        <table className="mt-4 w-full border-collapse border border-black text-[9.5pt]">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="border border-black p-2 text-center w-12">Sıra</th>
              <th className="border border-black p-2 text-left">
                Firma / İstekli Adı
              </th>
              <th className="border border-black p-2 text-right">
                Teklif Tutarı (TL)
              </th>
              <th className="border border-black p-2 text-center">
                KDV Durumu
              </th>
              <th className="border border-black p-2 text-center">
                Değerlendirme Sonucu
              </th>
            </tr>
          </thead>
          <tbody>
            {firmalar.map((t, idx) => (
              <tr
                key={idx}
                className={t.kazanan ? "bg-emerald-50/50 font-semibold" : ""}
              >
                <td className="border border-black p-2 text-center">
                  {t.sira}
                </td>
                <td className="border border-black p-2">{t.firma}</td>
                <td className="border border-black p-2 text-right">
                  {t.teklif.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })} TL
                </td>
                <td className="border border-black p-2 text-center">{t.kdv}</td>
                <td className="border border-black p-2 text-center">
                  {t.kazanan
                    ? <strong className="text-emerald-700">{t.sonuc}</strong>
                    : t.sonuc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Komisyon Kararı ve Gerekçe */}
        <div className="mt-4 rounded border border-gray-400 bg-gray-50 p-3 text-[10pt] leading-relaxed">
          <p className="font-bold underline">KOMİSYON KARARI VE GEREKÇESİ:</p>
          <p className="mt-1 text-justify">
            İdaremizce 4734 Sayılı Kanun 22/d maddesi gereğince yapılan piyasa
            fiyat araştırması neticesinde; teknik şartnameye ve istenen evsaf
            şartlarına haiz, en uygun ve ekonomik fiyatı sunan{" "}
            <strong>
              {data.kazanan_firma_adi || "Turuncu Ofis Bilişim Ltd. Şti."}
            </strong>
            üzerinde alımın yapılması komisyonumuzca uygun mütalaa edilmiştir.
          </p>
        </div>
      </div>

      <div>
        {/* Araştırma Görevlileri İmzaları */}
        <div className="mt-10">
          <p className="text-center font-bold text-[10.5pt] mb-6">
            PİYASA FİYAT ARAŞTIRMASI GÖREVLİLERİ
          </p>
          <div className="grid grid-cols-3 gap-4 text-center text-[9.5pt]">
            {uyeler.map((u: any, i: number) => (
              <div key={i}>
                <p className="font-bold">{u.ad_soyad || u.adSoyad || ""}</p>
                <p className="text-gray-600">{u.unvan}</p>
                <p className="mt-6 italic">İmza ✍️</p>
              </div>
            ))}
          </div>
        </div>

        {/* EBYS Doğrulama */}
        {settings.karekodGoster && (
          <div className="mt-6 border-t border-gray-300 pt-2 flex items-center justify-between text-[7.5pt] text-gray-600 font-mono">
            <span>
              EBYS Doğrulama Kodu: {settings.dogrulamaKodu}{" "}
              | 5070 S.K. Güvenli e-İmzalı
            </span>
            <span>{settings.ebysEvrakFormat} Standardı</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 3. YAKLAŞIK MALİYET HESAP CETVELİ VE FORMU (DOC_YAKLASIK_MALIYET)
 */
export function YaklasikMaliyetTemplate({ data }: { data: TeminDosyasiKaydi }) {
  const settings = useKurumVeRotaAyarlari();

  const kurumBasligi = data.antet_ek_satir || settings.kurumAdi;
  const birimAdi = data.birim ||
    `${settings.daireBaskanligi} - ${settings.subeMudurlugu}`;

  const kalemler = data.kalemler && data.kalemler.length > 0
    ? data.kalemler.map((k, idx) => ({
      sira: k.sira_no || idx + 1,
      ad: k.kalem_adi,
      birim: k.birim,
      miktar: k.miktar,
      f1: k.fiyat1 ??
        (k.yaklasik_birim_fiyat ? k.yaklasik_birim_fiyat * 0.98 : 0),
      f2: k.fiyat2 ??
        (k.yaklasik_birim_fiyat ? k.yaklasik_birim_fiyat * 1.0 : 0),
      f3: k.fiyat3 ??
        (k.yaklasik_birim_fiyat ? k.yaklasik_birim_fiyat * 1.02 : 0),
      ort: k.yaklasik_birim_fiyat ?? 0,
      tutar: k.toplam_tutar ?? (k.miktar * (k.yaklasik_birim_fiyat ?? 0)),
    }))
    : [
      {
        sira: 1,
        ad: "HP 658A Orijinal Siyah Toner (W2000A)",
        birim: "Adet",
        miktar: 10,
        f1: 3200,
        f2: 3350,
        f3: 3400,
        ort: 3316.66,
        tutar: 33166.6,
      },
      {
        sira: 2,
        ad: "HP 658A Orijinal Mavi Toner (W2001A)",
        birim: "Adet",
        miktar: 8,
        f1: 3800,
        f2: 3950,
        f3: 4100,
        ort: 3950.0,
        tutar: 31600.0,
      },
      {
        sira: 3,
        ad: "HP 658A Orijinal Sarı Toner (W2002A)",
        birim: "Adet",
        miktar: 8,
        f1: 3800,
        f2: 3950,
        f3: 4100,
        ort: 3950.0,
        tutar: 31600.0,
      },
      {
        sira: 4,
        ad: "HP 658A Orijinal Kırmızı Toner (W2003A)",
        birim: "Adet",
        miktar: 8,
        f1: 3800,
        f2: 3950,
        f3: 4100,
        ort: 3950.0,
        tutar: 31600.0,
      },
      {
        sira: 5,
        ad: "A4 Fotokopi Kağıdı 80 gr (Koli)",
        birim: "Koli",
        miktar: 20,
        f1: 820,
        f2: 860,
        f3: 880,
        ort: 853.33,
        tutar: 17033.4,
      },
    ];

  return (
    <div className="a4-print-sheet mx-auto min-h-[297mm] w-[210mm] bg-white p-[20mm_18mm_20mm_20mm] text-[10.5pt] font-['Times_New_Roman',Times,serif] leading-tight text-[#111827] shadow-lg print:m-0 print:border-none print:shadow-none flex flex-col justify-between">
      <div>
        <div className="text-center font-bold">
          <p className="text-[12pt]">{kurumBasligi}</p>
          <p className="text-[11pt]">{birimAdi}</p>
          <p className="mt-3 text-[13pt] underline underline-offset-4">
            YAKLAŞIK MALİYET HESAP CETVELİ
          </p>
        </div>

        <div className="mt-4 flex justify-between text-[10pt]">
          <div>
            <strong>Dosya No:</strong> {data.temin_no}
          </div>
          <div>
            <strong>Hesaplama Tarihi:</strong> {data.dosya_acilis_tarihi}
          </div>
        </div>
        <div className="mt-1 text-[10pt]">
          <strong>İşin Adı:</strong> {data.konu}
        </div>

        <table className="mt-3 w-full border-collapse border border-black text-[9pt]">
          <thead className="bg-gray-100 font-bold text-center">
            <tr>
              <th className="border border-black p-1">S.No</th>
              <th className="border border-black p-1 text-left">
                Malzemenin Cinsi / Açıklaması
              </th>
              <th className="border border-black p-1">Birim</th>
              <th className="border border-black p-1">Miktar</th>
              <th className="border border-black p-1">1. Fiyat</th>
              <th className="border border-black p-1">2. Fiyat</th>
              <th className="border border-black p-1">3. Fiyat</th>
              <th className="border border-black p-1">Ort. Fiyat (TL)</th>
              <th className="border border-black p-1">Toplam (TL)</th>
            </tr>
          </thead>
          <tbody>
            {kalemler.map((k) => (
              <tr key={k.sira}>
                <td className="border border-black p-1 text-center">
                  {k.sira}
                </td>
                <td className="border border-black p-1">{k.ad}</td>
                <td className="border border-black p-1 text-center">
                  {k.birim}
                </td>
                <td className="border border-black p-1 text-center">
                  {k.miktar}
                </td>
                <td className="border border-black p-1 text-right">
                  {k.f1.toLocaleString("tr-TR")}
                </td>
                <td className="border border-black p-1 text-right">
                  {k.f2.toLocaleString("tr-TR")}
                </td>
                <td className="border border-black p-1 text-right">
                  {k.f3.toLocaleString("tr-TR")}
                </td>
                <td className="border border-black p-1 text-right font-semibold">
                  {k.ort.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </td>
                <td className="border border-black p-1 text-right font-bold">
                  {k.tutar.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold text-[9.5pt]">
              <td colSpan={8} className="border border-black p-1.5 text-right">
                TOPLAM YAKLAŞIK MALİYET (KDV HARİÇ):
              </td>
              <td className="border border-black p-1.5 text-right text-[#1b416c]">
                {data.yaklasik_maliyet.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })} TL
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-3 text-[9.5pt] leading-relaxed">
          <p>
            <strong>Hesaplama Esası:</strong>{" "}
            {data.hesaplama_esasi ||
              "Piyasa fiyat araştırması kapsamında en az 3 yetkili satıcıdan alınan fiyat tekliflerinin aritmetik ortalaması alınarak tespit edilmiştir."}
          </p>
          <p className="mt-1">
            <strong>Komisyon Takdiri:</strong>{" "}
            {data.komisyon_takdiri ||
              "Tespit edilen yaklaşık maliyet tutarı piyasa rayiçlerine uygun bulunmuştur."}
          </p>
        </div>
      </div>

      <div>
        <div className="mt-8">
          <p className="text-center font-bold text-[10pt] mb-4">
            YAKLAŞIK MALİYET TESPİT GÖREVLİLERİ
          </p>
          <div className="grid grid-cols-2 gap-8 text-center text-[9.5pt]">
            <div>
              <p className="font-bold">
                {data.hazirlayan_personel_adi ||
                  settings.gerceklestirmeGorevlisiAdi}
              </p>
              <p className="text-gray-600">
                {settings.gerceklestirmeGorevlisiUnvan}
              </p>
              <p className="mt-6 italic">İmza ✍️</p>
            </div>
            <div>
              <p className="font-bold">Mustafa YILMAZ</p>
              <p className="text-gray-600">Satınalma Şube Müdürü V. / Başkan</p>
              <p className="mt-6 italic">İmza ✍️</p>
            </div>
          </div>
        </div>

        {settings.karekodGoster && (
          <div className="mt-6 border-t border-gray-300 pt-2 flex items-center justify-between text-[7.5pt] text-gray-600 font-mono">
            <span>
              EBYS Doğrulama Kodu: {settings.dogrulamaKodu}{" "}
              | 5070 S.K. Güvenli e-İmzalı
            </span>
            <span>{settings.ebysEvrakFormat} Standardı</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 4. BİRİM FİYAT TEKLİF İSTEME MEKTUBU VE CETVELİ (DOC_TEKLIF_MEKTUBU)
 */
export function TeklifMektubuTemplate({ data }: { data: TeminDosyasiKaydi }) {
  const settings = useKurumVeRotaAyarlari();

  const kurumBasligi = data.antet_ek_satir || settings.kurumAdi;
  const birimAdi = data.birim ||
    `${settings.daireBaskanligi} - ${settings.subeMudurlugu}`;

  return (
    <div className="a4-print-sheet mx-auto min-h-[297mm] w-[210mm] bg-white p-[20mm_18mm_20mm_20mm] text-[10.5pt] font-['Times_New_Roman',Times,serif] leading-tight text-[#111827] shadow-lg print:m-0 print:border-none print:shadow-none flex flex-col justify-between">
      <div>
        <div className="text-center font-bold">
          <p className="text-[12pt]">{kurumBasligi}</p>
          <p className="text-[11pt]">{birimAdi}</p>
          <p className="mt-3 text-[13pt] underline underline-offset-4">
            FİYAT TEKLİF İSTEME MEKTUBU
          </p>
        </div>

        <div className="mt-4 flex justify-between text-[10pt]">
          <div>
            <strong>Sayı :</strong> E-84125801-841.01.01-{data.temin_no}
          </div>
          <div>
            <strong>Tarih:</strong> {new Date().toLocaleDateString("tr-TR")}
          </div>
        </div>

        <div className="mt-3 rounded border border-gray-300 p-2 text-[10pt] bg-gray-50 font-semibold">
          Sayın:{" "}
          {data.kazanan_firma_adi || "İlgili Firma / İstekli Yetkilisine"}
        </div>

        <p className="mt-3 text-justify text-[10pt] leading-relaxed indent-6">
          İdaremiz ihtiyacı olan ve aşağıda cinsi ile miktarı belirtilen
          mal/hizmet alımı işi 4734 Sayılı Kamu İhale Kanununun{" "}
          <strong>{data.ihale_sekli || "22/d"}</strong>{" "}
          maddesi uyarınca doğrudan temin usulü ile satın alınacaktır. Söz
          konusu alıma ilişkin KDV hariç birim ve toplam fiyat teklifinizi en
          geç{" "}
          <strong>
            {data.son_teklif_verme_tarihi || "20.03.2026 saat 17:00’a"}
          </strong>{" "}
          kadar idaremize kaşeli ve imzalı olarak iletmenizi rica ederiz.
        </p>

        {/* İhtiyaç Listesi Tablosu */}
        <table className="mt-3 w-full border-collapse border border-black text-[9pt]">
          <thead className="bg-gray-100 font-bold text-center">
            <tr>
              <th className="border border-black p-1.5 w-10">S.No</th>
              <th className="border border-black p-1.5 text-left">
                Malzemenin / İşin Cinsi
              </th>
              <th className="border border-black p-1.5 w-16">Birim</th>
              <th className="border border-black p-1.5 w-16">Miktar</th>
              <th className="border border-black p-1.5 w-24">
                Birim Fiyat (TL)
              </th>
              <th className="border border-black p-1.5 w-24">
                Toplam Tutar (TL)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.kalemler && data.kalemler.length > 0
              ? (
                data.kalemler.map((k, idx) => (
                  <tr key={idx}>
                    <td className="border border-black p-1.5 text-center">
                      {k.sira_no || idx + 1}
                    </td>
                    <td className="border border-black p-1.5 font-medium">
                      {k.kalem_adi}
                    </td>
                    <td className="border border-black p-1.5 text-center">
                      {k.birim}
                    </td>
                    <td className="border border-black p-1.5 text-center">
                      {k.miktar}
                    </td>
                    <td className="border border-black p-1.5 text-right">
                      ..................
                    </td>
                    <td className="border border-black p-1.5 text-right">
                      ..................
                    </td>
                  </tr>
                ))
              )
              : (
                <tr>
                  <td className="border border-black p-2 text-center">1</td>
                  <td className="border border-black p-2 font-medium">
                    {data.konu}
                  </td>
                  <td className="border border-black p-2 text-center">Kalem</td>
                  <td className="border border-black p-2 text-center">1</td>
                  <td className="border border-black p-2 text-right">
                    ..................
                  </td>
                  <td className="border border-black p-2 text-right">
                    ..................
                  </td>
                </tr>
              )}
          </tbody>
        </table>

        <div className="mt-3 space-y-1 text-[9.5pt] text-gray-700">
          <div>
            • <strong>Teslim Yeri:</strong> {data.ihtiyac_yeri}
          </div>
          <div>
            • <strong>Teslim Süresi:</strong> Sipariş tarihinden itibaren{" "}
            {data.teslim_gun} takvim günü.
          </div>
          <div>
            • <strong>Ödeme:</strong>{" "}
            Muayene kabul ve fatura teslimine müteakip 30 takvim günü.
          </div>
        </div>
      </div>

      <div>
        {/* İki Taraflı Alan */}
        <div className="mt-8 flex justify-between px-4 text-center text-[9.5pt]">
          <div className="w-56">
            <p className="font-bold">
              {data.hazirlayan_personel_adi ||
                settings.gerceklestirmeGorevlisiAdi}
            </p>
            <p className="text-gray-600">
              {settings.gerceklestirmeGorevlisiUnvan}
            </p>
            <p className="mt-8 italic">İmza ✍️</p>
          </div>

          <div className="w-56">
            <p className="font-bold">TEKLİF VEREN FİRMA</p>
            <p className="text-gray-600">Yetkili İsim / Kaşe / İmza</p>
            <p className="mt-8 italic">Kaşe &amp; İmza ✍️</p>
          </div>
        </div>

        {settings.karekodGoster && (
          <div className="mt-6 border-t border-gray-300 pt-2 flex items-center justify-between text-[7.5pt] text-gray-600 font-mono">
            <span>
              EBYS Doğrulama Kodu: {settings.dogrulamaKodu}{" "}
              | 5070 S.K. Güvenli e-İmzalı
            </span>
            <span>{settings.ebysEvrakFormat} Standardı</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 5. DOĞRUDAN TEMİN SÖZLEŞMESİ / SİPARİŞ MEKTUBU (DOC_SOZLESME_TASLAGI)
 */
export function SozlesmeTemplate({ data }: { data: TeminDosyasiKaydi }) {
  const settings = useKurumVeRotaAyarlari();

  const kurumBasligi = data.antet_ek_satir || settings.kurumAdi;
  const birimAdi = data.birim ||
    `${settings.daireBaskanligi} - ${settings.subeMudurlugu}`;
  const harcamaYetkilisi = data.onay_personel_adi ||
    settings.harcamaYetkilisiAdi;

  return (
    <div className="a4-print-sheet mx-auto min-h-[297mm] w-[210mm] bg-white p-[20mm_18mm_20mm_20mm] text-[10.5pt] font-['Times_New_Roman',Times,serif] leading-normal text-[#111827] shadow-lg print:m-0 print:border-none print:shadow-none flex flex-col justify-between">
      <div>
        <div className="text-center font-bold">
          <p className="text-[12pt]">{kurumBasligi}</p>
          <p className="text-[11pt]">{birimAdi}</p>
          <p className="mt-3 text-[13pt] underline underline-offset-4">
            DOĞRUDAN TEMİN ALIM SÖZLEŞMESİ / SİPARİŞ AKDİ
          </p>
        </div>

        <div className="mt-4 space-y-2 text-[10pt] text-justify leading-relaxed">
          <p>
            <strong>Madde 1 - Taraflar:</strong> Bir tarafta{" "}
            <strong>{birimAdi}</strong>{" "}
            (bundan böyle &quot;İdare&quot; olarak anılacaktır) ile diğer
            tarafta{" "}
            <strong>
              {data.kazanan_firma_adi || "Turuncu Ofis Bilişim Ltd. Şti."}
            </strong>{" "}
            (bundan böyle &quot;Yüklenici&quot; olarak anılacaktır) arasında
            aşağıdaki şartlarla sözleşme imzalanmıştır.
          </p>
          <p>
            <strong>Madde 2 - İşin Konusu:</strong> {data.konu} işidir.
          </p>
          <p>
            <strong>Madde 3 - Sözleşme Bedeli ve Kesintiler:</strong>{" "}
            İşin toplam sözleşme bedeli{" "}
            <strong>
              {data.yaklasik_maliyet.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
              })} TL
            </strong>{" "}
            (KDV Hariç) olup, hakediş ödemesi sırasında mevzuat gereğince
            aşağıdaki kanuni kesintiler tahakkuk ettirilecektir:
          </p>

          {/* Kesintiler Özeti Tablosu */}
          <div className="rounded border border-black p-2 bg-gray-50 text-[9pt] my-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                • Damga Vergisi Kesintisi (Binde 9,48):{" "}
                <strong>{data.kesinti_damga.toFixed(2)} TL</strong>
              </div>
              <div>
                • Karar Pulu Kesintisi (Binde 5,69):{" "}
                <strong>{data.kesinti_karar_pulu.toFixed(2)} TL</strong>
              </div>
              <div>
                • KDV Tevkifatı Kesintisi:{" "}
                <strong>{data.kesinti_kdv_tevkifat.toFixed(2)} TL</strong>
              </div>
              <div>
                • Net Ödenecek Tahmini Tutar:{" "}
                <strong className="text-emerald-800">
                  {data.net_odenen.toFixed(2)} TL
                </strong>
              </div>
            </div>
          </div>

          <p>
            <strong>Madde 4 - Teslim Süresi ve Yeri:</strong>{" "}
            Malzemeler, sözleşmenin imzalanmasına müteakip en geç{" "}
            <strong>{data.teslim_gun} takvim günü</strong> içerisinde{" "}
            <strong>{data.ihtiyac_yeri}</strong>{" "}
            adresine eksiksiz teslim edilecektir.
          </p>
          <p>
            <strong>Madde 5 - Muayene ve Kabul:</strong>{" "}
            Teslim edilen malların muayenesi Muayene ve Kabul Komisyonunca
            yapılacak olup, şartnameye uygun bulunmayan mallar 48 saat
            içerisinde yüklenici tarafından yenisiyle değiştirilecektir.
          </p>
        </div>
      </div>

      <div>
        {/* İki Taraflı İmzalar */}
        <div className="mt-12 flex justify-between px-6 text-center">
          <div className="w-56">
            <p className="font-bold underline">İDARE ADINA</p>
            <p className="mt-2 font-bold">{harcamaYetkilisi}</p>
            <p className="text-[9pt] text-gray-600">
              {settings.harcamaYetkilisiUnvan}
            </p>
            <p className="mt-8 italic text-emerald-800">e-İmzalıdır ✍️</p>
          </div>

          <div className="w-56">
            <p className="font-bold underline">YÜKLENİCİ FİRMA ADINA</p>
            <p className="mt-2 font-bold">
              {data.kazanan_firma_adi || "Turuncu Ofis Bilişim Ltd. Şti."}
            </p>
            <p className="text-[9pt] text-gray-600">
              Şirket Müdürü / Kaşe &amp; Yetkili İmza
            </p>
            <p className="mt-8 italic">İmza &amp; Kaşe ✍️</p>
          </div>
        </div>

        {settings.karekodGoster && (
          <div className="mt-6 border-t border-gray-300 pt-2 flex items-center justify-between text-[7.5pt] text-gray-600 font-mono">
            <span>
              EBYS Doğrulama Kodu: {settings.dogrulamaKodu}{" "}
              | 5070 S.K. Güvenli e-İmzalı
            </span>
            <span>{settings.ebysEvrakFormat} Standardı</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 6. MUAYENE VE KABUL TUTANAĞI (DOC_MUAYENE_KABUL)
 */
export function MuayeneKabulTemplate({ data }: { data: TeminDosyasiKaydi }) {
  const settings = useKurumVeRotaAyarlari();

  const kurumBasligi = data.antet_ek_satir || settings.kurumAdi;
  const birimAdi = data.birim ||
    `${settings.daireBaskanligi} - ${settings.subeMudurlugu}`;

  const muayeneUyeleri =
    data.komisyon_uyeleri?.filter((u) => u.rol === "muayene_kabul") || [];
  const uyeler = muayeneUyeleri.length > 0
    ? muayeneUyeleri
    : settings.muayeneKabulUyeleri && settings.muayeneKabulUyeleri.length > 0
    ? settings.muayeneKabulUyeleri
    : [
      { ad_soyad: "Ahmet KAYA", unvan: "Taşınır Kayıt Yetkilisi / Üye" },
      { ad_soyad: "Serkan DEMİR", unvan: "Teknik Personel / Üye" },
      {
        ad_soyad: "Mustafa YILMAZ",
        unvan: "Şube Müdürü V. / Komisyon Başkanı",
      },
    ];

  return (
    <div className="a4-print-sheet mx-auto min-h-[297mm] w-[210mm] bg-white p-[20mm_18mm_20mm_20mm] text-[11pt] font-['Times_New_Roman',Times,serif] leading-tight text-[#111827] shadow-lg print:m-0 print:border-none print:shadow-none flex flex-col justify-between">
      <div>
        <div className="text-center font-bold">
          <p className="text-[12pt]">{kurumBasligi}</p>
          <p className="text-[11pt]">{birimAdi}</p>
          <p className="mt-3 text-[13pt] underline underline-offset-4">
            MUAYENE VE KABUL KOMİSYONU TUTANAĞI
          </p>
        </div>

        <div className="mt-5 space-y-1 text-[10pt]">
          <div>
            <strong>Dosya Numarası :</strong> {data.temin_no}
          </div>
          <div>
            <strong>Yüklenici Adı :</strong>{" "}
            {data.kazanan_firma_adi || "Turuncu Ofis Bilişim Ltd. Şti."}
          </div>
          <div>
            <strong>Alımın Konusu :</strong> {data.konu}
          </div>
          <div>
            <strong>Teslim Tarihi :</strong>{" "}
            {data.teslim_tarihi || new Date().toLocaleDateString("tr-TR")}
          </div>
        </div>

        <div className="mt-4 rounded border border-black p-3 text-[10pt] leading-relaxed text-justify bg-gray-50/50">
          <p>
            Yukarıda adı geçen yüklenici tarafından taahhüt edilen ve idaremiz
            {" "}
            <strong>{data.ihtiyac_yeri}</strong>{" "}
            adresine teslim edilen malların muayenesi komisyonumuz tarafından
            yapılmıştır. Yapılan fiziksel, teknik ve ambalaj kontrollerinde
            malların teknik şartnameye, sipariş mektubuna ve numunelerine tam
            olarak uygun olduğu tespit edilmiş olup, kesin kabulü oy birliğiyle
            yapılmıştır.
          </p>
        </div>
      </div>

      <div>
        {/* Muayene Komisyonu İmzaları */}
        <div className="mt-12">
          <p className="text-center font-bold text-[11pt] mb-6">
            MUAYENE VE KABUL KOMİSYONU
          </p>
          <div className="grid grid-cols-3 gap-4 text-center text-[9.5pt]">
            {uyeler.map((u: any, i: number) => (
              <div key={i}>
                <p className="font-bold">{u.ad_soyad || u.adSoyad || ""}</p>
                <p className="text-gray-600">{u.unvan}</p>
                <p className="mt-8 italic">İmza ✍️</p>
              </div>
            ))}
          </div>
        </div>

        {settings.karekodGoster && (
          <div className="mt-6 border-t border-gray-300 pt-2 flex items-center justify-between text-[7.5pt] text-gray-600 font-mono">
            <span>
              EBYS Doğrulama Kodu: {settings.dogrulamaKodu}{" "}
              | 5070 S.K. Güvenli e-İmzalı
            </span>
            <span>{settings.ebysEvrakFormat} Standardı</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 7. DAMGA VERGİSİ VE KARAR PULU TAHAKKUK MÜZEKKERESİ (DOC_DAMGA_VERGISI)
 */
export function DamgaVergisiTemplate({ data }: { data: TeminDosyasiKaydi }) {
  const settings = useKurumVeRotaAyarlari();

  const kurumBasligi = data.antet_ek_satir || settings.kurumAdi;
  const birimAdi = data.birim ||
    `${settings.daireBaskanligi} - ${settings.subeMudurlugu}`;
  const harcamaYetkilisi = data.onay_personel_adi ||
    settings.harcamaYetkilisiAdi;
  const gerceklestirmeGorevlisi = data.hazirlayan_personel_adi ||
    settings.gerceklestirmeGorevlisiAdi;

  return (
    <div className="a4-print-sheet mx-auto min-h-[297mm] w-[210mm] bg-white p-[20mm_18mm_20mm_20mm] text-[10.5pt] font-['Times_New_Roman',Times,serif] leading-tight text-[#111827] shadow-lg print:m-0 print:border-none print:shadow-none flex flex-col justify-between">
      <div>
        <div className="text-center font-bold">
          <p className="text-[12pt]">{kurumBasligi}</p>
          <p className="text-[11pt]">{birimAdi}</p>
          <p className="mt-3 text-[13pt] underline underline-offset-4">
            DAMGA VERGİSİ VE KARAR PULU TAHAKKUK MÜZEKKERESİ
          </p>
        </div>

        <div className="mt-4 flex justify-between text-[10pt] font-semibold">
          <div>
            <strong>Dosya No:</strong> {data.temin_no}
          </div>
          <div>
            <strong>Tarih:</strong> {new Date().toLocaleDateString("tr-TR")}
          </div>
        </div>

        <div className="mt-3 text-[10pt] leading-relaxed">
          <p>
            <strong>Muhasebe Birimi:</strong>{" "}
            {data.muhasebe_birimi ||
              "Mali Hizmetler Dairesi Muhasebe Şube Müdürlüğü"}
          </p>
          <p>
            <strong>Yüklenici Firma:</strong>{" "}
            {data.kazanan_firma_adi || "Turuncu Ofis Bilişim Ltd. Şti."}
          </p>
          <p>
            <strong>İşin Konusu:</strong> {data.konu}
          </p>
        </div>

        {/* Yasal Kesinti Cetveli Tablosu */}
        <table className="mt-4 w-full border-collapse border border-black text-[9.5pt]">
          <thead className="bg-gray-100 font-bold text-center">
            <tr>
              <th className="border border-black p-2">Yasal Kesinti Türü</th>
              <th className="border border-black p-2">Yasal Dayanak</th>
              <th className="border border-black p-2">Matrah (TL)</th>
              <th className="border border-black p-2">Oran</th>
              <th className="border border-black p-2 text-right">
                Kesinti Tutarı (TL)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 font-medium">
                İhale Karar Pulu
              </td>
              <td className="border border-black p-2 text-center">
                488 S.K. Tablo 1
              </td>
              <td className="border border-black p-2 text-right">
                {data.yaklasik_maliyet.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="border border-black p-2 text-center">‰ 5,69</td>
              <td className="border border-black p-2 text-right font-semibold">
                {data.kesinti_karar_pulu.toFixed(2)} TL
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-medium">
                Sözleşme Damga Vergisi
              </td>
              <td className="border border-black p-2 text-center">
                488 S.K. Tablo 1
              </td>
              <td className="border border-black p-2 text-right">
                {data.yaklasik_maliyet.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="border border-black p-2 text-center">‰ 9,48</td>
              <td className="border border-black p-2 text-right font-semibold">
                {data.kesinti_damga.toFixed(2)} TL
              </td>
            </tr>
            {data.kesinti_kdv_tevkifat > 0 && (
              <tr>
                <td className="border border-black p-2 font-medium">
                  KDV Tevkifatı
                </td>
                <td className="border border-black p-2 text-center">
                  3065 S.K.
                </td>
                <td className="border border-black p-2 text-right">
                  {data.yaklasik_maliyet.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="border border-black p-2 text-center">
                  5/10 Tevkifat
                </td>
                <td className="border border-black p-2 text-right font-semibold">
                  {data.kesinti_kdv_tevkifat.toFixed(2)} TL
                </td>
              </tr>
            )}
            <tr className="bg-gray-100 font-bold">
              <td colSpan={4} className="border border-black p-2 text-right">
                TOPLAM KESİNTİLER:
              </td>
              <td className="border border-black p-2 text-right text-rose-700">
                {(data.kesinti_karar_pulu + data.kesinti_damga +
                  data.kesinti_kdv_tevkifat).toFixed(2)} TL
              </td>
            </tr>
            <tr className="bg-emerald-50 font-bold">
              <td colSpan={4} className="border border-black p-2 text-right">
                YÜKLENİCİYE ÖDENECEK NET TUTAR:
              </td>
              <td className="border border-black p-2 text-right text-emerald-800 text-[10.5pt]">
                {data.net_odenen.toFixed(2)} TL
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 text-[10pt] leading-relaxed text-justify">
          <p className="indent-6">
            Yukarıda dökümü yapılan doğrudan temin alımına ait karar pulu ve
            damga vergisi kesintilerinin yüklenici hakedişinden mahsup edilerek
            ilgili vergi dairesi hesabına aktarılması hususunu arz ederim.
          </p>
        </div>
      </div>

      <div>
        <div className="mt-10 flex justify-between px-6 text-center text-[9.5pt]">
          <div className="w-56">
            <p className="font-bold">{gerceklestirmeGorevlisi}</p>
            <p className="text-gray-600">
              {settings.gerceklestirmeGorevlisiUnvan}
            </p>
            <p className="mt-8 italic">İmza ✍️</p>
          </div>

          <div className="w-56">
            <p className="font-bold">UYGUNDUR</p>
            <p className="mt-1 font-bold">{harcamaYetkilisi}</p>
            <p className="text-gray-600">{settings.harcamaYetkilisiUnvan}</p>
            <p className="mt-8 italic text-emerald-800">e-İmzalıdır ✍️</p>
          </div>
        </div>

        {settings.karekodGoster && (
          <div className="mt-6 border-t border-gray-300 pt-2 flex items-center justify-between text-[7.5pt] text-gray-600 font-mono">
            <span>
              EBYS Doğrulama Kodu: {settings.dogrulamaKodu}{" "}
              | 5070 S.K. Güvenli e-İmzalı
            </span>
            <span>{settings.ebysEvrakFormat} Standardı</span>
          </div>
        )}
      </div>
    </div>
  );
}
