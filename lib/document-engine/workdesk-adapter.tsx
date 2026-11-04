"use client";

import React from "react";
import { TeminDosyasiKaydi } from "@/lib/temin-dosyasi/schema";
import { getKurumVeRotaAyarlari } from "@/lib/settings/kurum-ve-rota-ayarlari";

// Workdesk Şablon İçe Aktarımları (workdesk-360 / packages/document-templates)
import { PiyasaFiyatArastirmaTutanagi } from "./workdesk-templates/templates/piyasa-fiyat-arastirma-tutanagi";
import { DogrudanTeminOnayBelgesi } from "./workdesk-templates/templates/dogrudan-temin-onay-belgesi";
import { DogrudanTeminSozlesmesi } from "./workdesk-templates/templates/dogrudan-temin-sozlesmesi";
import { YaklasikMaliyetCetveli } from "./workdesk-templates/templates/yaklasik-maliyet-cetveli";
import { BirimFiyatTeklifMektubu } from "./workdesk-templates/templates/birim-fiyat-teklif-mektubu";
import { MuayeneKabulTutanagi } from "./workdesk-templates/templates/muayene-kabul-tutanagi";
import { HarcamaTalimati } from "./workdesk-templates/templates/harcama-talimati";
import { IhtiyacTalepFormu } from "./workdesk-templates/templates/ihtiyac-talep-formu";
import { IhtiyacListesi } from "./workdesk-templates/templates/ihtiyac-listesi";
import { LuzumMuzekkeresi } from "./workdesk-templates/templates/luzum-muzekkeresi";
import { KomisyonGorevlendirmeOnayi } from "./workdesk-templates/templates/komisyon-gorevlendirme-onayi";
import { FiyatArastirmaMektubu } from "./workdesk-templates/templates/fiyat-arastirma-mektubu";
import { SozlesmeyeDavet } from "./workdesk-templates/templates/sozlesmeye-davet";
import { OdemeYazisi } from "./workdesk-templates/templates/odeme-yazisi";
import { ButceSorgusu } from "./workdesk-templates/templates/butce-sorgusu";
import { HarcamaPusulasi } from "./workdesk-templates/templates/harcama-pusulasi";
import { KabulEdilenTeklif } from "./workdesk-templates/templates/kabul-edilen-teklif";
import { TasinirKayitYetkilisiGorusu } from "./workdesk-templates/templates/tasinir-kayit-yetkilisi-gorusu";
import { TeknikSartname } from "./workdesk-templates/templates/teknik-sartname";
import { SonAlimFiyatCetveli } from "./workdesk-templates/templates/son-alim-fiyat-cetveli";

export interface WorkdeskTemplateMeta {
  id: string;
  code: string;
  name: string;
  category:
    | "Hazırlık & Talep"
    | "Piyasa Araştırması"
    | "Sözleşme & Onay"
    | "Muayene & Kabul"
    | "Ödeme & Mali";
  description: string;
  orientation?: "portrait" | "landscape";
}

export const WORKDESK_TEMPLATES_CATALOG: WorkdeskTemplateMeta[] = [
  // 1. Hazırlık ve Talep
  {
    id: "ihtiyac-talep-formu",
    code: "WD_TALEP_01",
    name: "İhtiyaç Talep Formu",
    category: "Hazırlık & Talep",
    description:
      "Birim ihtiyaç sahibinin gerekçeli malzeme veya hizmet talep formu.",
  },
  {
    id: "ihtiyac-listesi",
    code: "WD_IHTIYAC_01",
    name: "İhtiyaç Listesi Cetveli",
    category: "Hazırlık & Talep",
    description: "Talep edilen malzemelerin kalem, miktar ve özellik dökümü.",
  },
  {
    id: "luzum-muzekkeresi",
    code: "WD_LUZUM_01",
    name: "Lüzum Müzekkeresi",
    category: "Hazırlık & Talep",
    description:
      "Harcama yetkilisi makamına sunulan gerekçeli alım müzekkeresi.",
  },
  {
    id: "tasinir-kayit-yetkilisi-gorusu",
    code: "WD_TASINIR_01",
    name: "Taşınır Kayıt Yetkilisi Görüşü",
    category: "Hazırlık & Talep",
    description: "Depo stok kontrolü ve ihtiyaç onay görüş belgesi.",
  },
  {
    id: "teknik-sartname",
    code: "WD_SARTNAME_01",
    name: "Teknik Şartname Formu",
    category: "Hazırlık & Talep",
    description: "Alınacak ürün ve hizmetlerin teknik asgari şartları.",
  },

  // 2. Piyasa Fiyat Araştırması
  {
    id: "piyasa-fiyat-arastirma-tutanagi",
    code: "DOC_PIYASA_01",
    name: "Piyasa Fiyat Araştırma Tutanağı (Geniş Matris)",
    category: "Piyasa Araştırması",
    description:
      "En az 3 istekli firmanın tekliflerini karşılaştıran resmî komisyon tutanağı.",
    orientation: "landscape",
  },
  {
    id: "yaklasik-maliyet-cetveli",
    code: "DOC_YAKLASIK_MALIYET",
    name: "Yaklaşık Maliyet Hesap Cetveli",
    category: "Piyasa Araştırması",
    description: "Aritmetik ortalama ve piyasa rayiç hesap cetveli.",
  },
  {
    id: "birim-fiyat-teklif-mektubu",
    code: "DOC_TEKLIF_MEKTUBU",
    name: "Birim Fiyat Teklif Mektubu & Cetveli",
    category: "Piyasa Araştırması",
    description:
      "İstekli firmalardan alınan kaşeli-imzalı resmî teklif mektubu.",
  },
  {
    id: "fiyat-arastirma-mektubu",
    code: "WD_ARASTIRMA_MEKTUBU",
    name: "Fiyat Araştırma İsteme Mektubu",
    category: "Piyasa Araştırması",
    description:
      "Firmalara fiyat teklifi vermeleri için gönderilen resmî davet yazısı.",
  },
  {
    id: "son-alim-fiyat-cetveli",
    code: "WD_SON_ALIM_01",
    name: "Son Alım Fiyat Cetveli & Yİ-ÜFE Güncellemesi",
    category: "Piyasa Araştırması",
    description:
      "Önceki dönem alım fiyatlarının endekslenerek kıyaslandığı cetvel.",
  },

  // 3. Sözleşme ve Onay
  {
    id: "dogrudan-temin-onay-belgesi",
    code: "DOC_ONAY_01",
    name: "Doğrudan Temin Onay Belgesi (22/d)",
    category: "Sözleşme & Onay",
    description:
      "Harcama yetkilisinin olurunu alan yasal matbu ihale onay belgesi.",
  },
  {
    id: "harcama-talimati",
    code: "WD_TALIMAT_01",
    name: "Harcama Talimatı Onay Belgesi",
    category: "Sözleşme & Onay",
    description:
      "5018 sayılı kanun uyarınca harcama yetkilisinin resmî talimatı.",
  },
  {
    id: "dogrudan-temin-sozlesmesi",
    code: "DOC_SOZLESME_01",
    name: "Doğrudan Temin Alım Sözleşmesi",
    category: "Sözleşme & Onay",
    description:
      "Yüklenici firma ile idare arasında akdedilen yasal alım sözleşmesi.",
  },
  {
    id: "komisyon-gorevlendirme-onayi",
    code: "WD_KOMISYON_01",
    name: "Komisyon Görevlendirme Onayı",
    category: "Sözleşme & Onay",
    description:
      "Piyasa araştırması veya muayene kabul komisyon üyeleri görevlendirme yazısı.",
  },
  {
    id: "sozlesmeye-davet",
    code: "WD_DAVET_01",
    name: "Sözleşmeye Davet Yazısı",
    category: "Sözleşme & Onay",
    description:
      "Teklifi uygun görülen istekliye sözleşme imzalaması için tebliğ yazısı.",
  },
  {
    id: "kabul-edilen-teklif",
    code: "WD_KABUL_TEKLIF_01",
    name: "Kabul Edilen Teklif Bildirimi",
    category: "Sözleşme & Onay",
    description: "Alımın üzerine yapıldığını firmaya bildiren resmî tebligat.",
  },

  // 4. Muayene ve Kabul
  {
    id: "muayene-kabul-tutanagi",
    code: "DOC_MUAYENE_01",
    name: "Muayene ve Kabul Komisyon Tutanağı",
    category: "Muayene & Kabul",
    description: "Teslim edilen malların şartnameye uygunluğunun tasdiki.",
  },

  // 5. Ödeme ve Mali
  {
    id: "butce-sorgusu",
    code: "WD_BUTCE_01",
    name: "Bütçe ve Ödenek Sorgu Formu",
    category: "Ödeme & Mali",
    description:
      "Mali hizmetler biriminden alınan kullanılabilir ödenek teyit belgesi.",
  },
  {
    id: "odeme-yazisi",
    code: "WD_ODEME_01",
    name: "Ödeme Emri Üst Yazısı",
    category: "Ödeme & Mali",
    description:
      "Fatura ve eklerinin Muhasebe Müdürlüğüne tahakkuk için sevki.",
  },
  {
    id: "harcama-pusulasi",
    code: "WD_PUSULA_01",
    name: "Harcama Pusulası Belgesi",
    category: "Ödeme & Mali",
    description:
      "Vergi mükellefi olmayan şahıslardan yapılan alımlarda tanzim edilen belge.",
  },
];

/**
 * TeminDosyasiKaydi verisini Workdesk şablonlarının beklediği veri modeline dönüştürür
 */
export function mapTeminToWorkdeskData(
  dosya: TeminDosyasiKaydi,
): Record<string, any> {
  const settings = getKurumVeRotaAyarlari();

  const idare = settings.kurumAdi ||
    "T.C. ANKARA BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI";
  const birim = dosya.birim ||
    `${settings.daireBaskanligi} - ${settings.subeMudurlugu}`;

  const processedKalemler = (dosya.kalemler || []).map((k, idx) => ({
    siraNo: k.sira_no || idx + 1,
    malzemeKodu: k.kalem_kodu || `2024-00${idx + 10}`,
    malzemeAdi: k.kalem_adi,
    birim: k.birim,
    miktar: k.miktar,
    fiyat1: k.fiyat1 ??
      (k.yaklasik_birim_fiyat ? k.yaklasik_birim_fiyat * 0.98 : 0),
    fiyat2: k.fiyat2 ??
      (k.yaklasik_birim_fiyat ? k.yaklasik_birim_fiyat * 1.0 : 0),
    fiyat3: k.fiyat3 ??
      (k.yaklasik_birim_fiyat ? k.yaklasik_birim_fiyat * 1.02 : 0),
    ortalamaFiyat: k.yaklasik_birim_fiyat || 0,
    toplamTutar: k.toplam_tutar || (k.miktar * (k.yaklasik_birim_fiyat || 0)),
  }));

  const displayFirmalar = (dosya.firmalar || []).map((f, idx) => ({
    id: `firm-${idx + 1}`,
    name: f.firma_adi,
    taxNo: f.vergi_no || "1111111111",
    totalOffer: f.toplam_teklif,
    isWinner: f.kazanan_mi ?? (idx === 0),
  }));

  const displayKomisyon =
    (dosya.komisyon_uyeleri && dosya.komisyon_uyeleri.length > 0)
      ? dosya.komisyon_uyeleri.map((u) => ({
        adSoyad: u.ad_soyad,
        unvan: u.unvan,
        gorevi: (u as any).gorevi || (u as any).gorev || "Komisyon Üyesi",
      }))
      : (settings.piyasaArastirmaUyeleri || []).map((u) => ({
        adSoyad: u.adSoyad,
        unvan: u.unvan,
        gorevi: "Piyasa Araştırma Görevlisi",
      }));

  return {
    idareAdi: idare,
    kurumAdi: idare,
    mudurluk: settings.subeMudurlugu || "Satınalma Şube Müdürlüğü",
    daireBaskanligi: settings.daireBaskanligi ||
      "Destek Hizmetleri Dairesi Başkanlığı",
    birim,
    evrakSayisi: `E-84125801-934.01.02-${dosya.temin_no}`,
    dosyaTarihi: dosya.dosya_acilis_tarihi ||
      new Date().toLocaleDateString("tr-TR"),
    tarih: dosya.dosya_acilis_tarihi || new Date().toLocaleDateString("tr-TR"),
    isAdi: dosya.konu,
    isBasligi: dosya.konu,
    dosyaKonusu: dosya.konu,
    isinAdi: dosya.konu,
    isinAciklamasi: dosya.isin_aciklamasi || dosya.konu,
    teminNo: dosya.temin_no,
    teminSekli: dosya.ihale_sekli ||
      "4734 Sayılı K.İ.K. Madde 22/d (Doğrudan Temin)",
    yaklasikMaliyet: dosya.yaklasik_maliyet,
    sozlesmeBedeli: dosya.net_odenen || (dosya.yaklasik_maliyet * 0.95),
    kazananFirmaAdi: dosya.kazanan_firma_adi ||
      (displayFirmalar[0]?.name || "Turuncu Ofis Bilişim Ltd. Şti."),
    baskanAdi: settings.harcamaYetkilisiAdi || "Dr. Hakan YILMAZ",
    baskanUnvan: settings.harcamaYetkilisiUnvan ||
      "Destek Hizmetleri Dairesi Başkanı / Harcama Yetkilisi",
    gerceklestirmeGorevlisiAdi: settings.gerceklestirmeGorevlisiAdi ||
      "Mehmet DÜNDAR",
    gerceklestirmeGorevlisiUnvan: settings.gerceklestirmeGorevlisiUnvan ||
      "Satınalma Şube Müdürlüğü / Büro Personeli",
    displayFirmalar,
    firmalar: displayFirmalar,
    processedKalemler,
    kalemler: processedKalemler,
    displayKomisyon,
    komisyon: displayKomisyon,
    komisyonUyeleri: displayKomisyon,
  };
}

/**
 * Workdesk şablonunu dinamik seçip render eden ana fonksiyon
 */
export function renderWorkdeskTemplate(
  templateIdOrCode: string,
  dosya: TeminDosyasiKaydi,
  options?: { pageSize?: "A4" | "A3"; orientation?: "portrait" | "landscape" },
): React.ReactNode {
  const data = mapTeminToWorkdeskData(dosya);
  const pageSize = options?.pageSize || "A4";
  const orientation = options?.orientation;

  const code = templateIdOrCode.toLowerCase();

  // 1. Piyasa Fiyat Araştırma Tutanağı
  if (
    code.includes("piyasa") || code.includes("tutanak") ||
    code === "doc_piyasa_01"
  ) {
    return (
      <PiyasaFiyatArastirmaTutanagi
        data={data}
        pageSize={pageSize}
        orientation={orientation || "landscape"}
      />
    );
  }

  // 2. Doğrudan Temin Onay Belgesi
  if (code.includes("onay") || code === "doc_onay_01") {
    return (
      <DogrudanTeminOnayBelgesi
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 3. Doğrudan Temin Sözleşmesi
  if (code.includes("sozlesme") || code === "doc_sozlesme_01") {
    return (
      <DogrudanTeminSozlesmesi
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 4. Yaklaşık Maliyet Cetveli
  if (
    code.includes("yaklasik") || code.includes("maliyet") ||
    code === "doc_yaklasik_maliyet"
  ) {
    return (
      <YaklasikMaliyetCetveli
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 5. Birim Fiyat Teklif Mektubu
  if (code.includes("teklif") || code === "doc_teklif_mektubu") {
    return (
      <BirimFiyatTeklifMektubu
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 6. Muayene ve Kabul Tutanağı
  if (
    code.includes("muayene") || code.includes("kabul") ||
    code === "doc_muayene_01"
  ) {
    return (
      <MuayeneKabulTutanagi
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 7. Harcama Talimatı
  if (code.includes("talimat")) {
    return (
      <HarcamaTalimati
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 8. İhtiyaç Talep Formu
  if (code.includes("talep")) {
    return (
      <IhtiyacTalepFormu
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 9. İhtiyaç Listesi
  if (code.includes("ihtiyac")) {
    return (
      <IhtiyacListesi
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 10. Lüzum Müzekkeresi
  if (code.includes("luzum")) {
    return (
      <LuzumMuzekkeresi
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 11. Komisyon Görevlendirme
  if (code.includes("komisyon")) {
    return (
      <KomisyonGorevlendirmeOnayi
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 12. Fiyat Araştırma Mektubu
  if (code.includes("arastirma-mektubu")) {
    return (
      <FiyatArastirmaMektubu
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 13. Sözleşmeye Davet
  if (code.includes("davet")) {
    return (
      <SozlesmeyeDavet
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 14. Ödeme Yazısı
  if (code.includes("odeme")) {
    return (
      <OdemeYazisi
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 15. Bütçe Sorgusu
  if (code.includes("butce")) {
    return (
      <ButceSorgusu
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 16. Harcama Pusulası
  if (code.includes("pusula")) {
    return (
      <HarcamaPusulasi
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 17. Kabul Edilen Teklif
  if (code.includes("kabul-edilen")) {
    return (
      <KabulEdilenTeklif
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 18. Taşınır Kayıt Görüşü
  if (code.includes("tasinir")) {
    return (
      <TasinirKayitYetkilisiGorusu
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 19. Teknik Şartname
  if (code.includes("sartname")) {
    return (
      <TeknikSartname
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // 20. Son Alım Fiyat Cetveli
  if (code.includes("son-alim")) {
    return (
      <SonAlimFiyatCetveli
        data={data}
        pageSize={pageSize}
        orientation={orientation || "portrait"}
      />
    );
  }

  // Varsayılan: Piyasa Fiyat Araştırma Tutanağı
  return (
    <PiyasaFiyatArastirmaTutanagi
      data={data}
      pageSize={pageSize}
      orientation={orientation || "landscape"}
    />
  );
}
