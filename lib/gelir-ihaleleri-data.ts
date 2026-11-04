/**
 * 2886 Sayılı Kanun & Özel Sektör Varlık Satış / Kiralama İhaleleri Veri Modeli
 * Kamu ve Özel Sektör Kurumsal Gelir Getirici İhale Süreçleri
 */

export type IhaleUsulu2886 = 'Kapalı Teklif Usulü' | 'Açık Artırma Usulü' | 'Pazarlık Usulü' | 'Belli İstekliler'
export type GelirIhaleTuru = 'Taşınmaz Kiralama' | 'Varlık & Gayrimenkul Satışı' | 'Hurda & Atıl Varlık Satışı' | 'İşletme Hakkı Devri'

export interface GelirIhaleDosyasi {
  dosyaNo: string
  ihaleAdi: string
  tur: GelirIhaleTuru
  usul: IhaleUsulu2886
  muhammenBedel: number // TL
  geciciTeminatOrani: number // %3
  geciciTeminatTutari: number // TL
  ihaleTarihi: string
  ihaleSaati: string
  lokasyon: string
  durum: 'İlanda' | 'Teklif / Pey Aşamasında' | 'Komisyon Kararında' | 'Sözleşme İmzalandı' | 'Tamamlandı'
  varlikKodu: string
  varlikTanimi: string
}

export interface IstekliPey {
  sira: number
  istekliAdi: string
  vergiNo: string
  yetkili: string
  teminatDurumu: 'Alındı (Nakit)' | 'Alındı (Banka Teminat Mektubu)' | 'Eksik'
  teminatTutari: number
  ilkTeklif: number
  sonTeklif: number
  tur1Teklif?: number
  tur2Teklif?: number
  durum: 'En Yüksek Teklif (Kazanan)' | 'Çekildi' | 'Elendi' | 'Devam Ediyor'
}

export interface KomisyonUyesi2886 {
  gorev: string
  adSoyad: string
  unvan: string
  karar: 'Kabul' | 'Ret' | 'Bekliyor'
  imzaTarihi?: string
}

export interface VarlikEnvanterKaydi {
  varlikKodu: string
  ad: string
  kategori: 'Gayrimenkul / Ofis' | 'Araç / Filo' | 'Hurda / Malzeme' | 'Tesis / İşletme'
  lokasyon: string
  ekspertizDegeri: number
  durum: 'Boşta / İhaleye Hazır' | 'İhalede' | 'Kirada' | 'Satıldı / Devredildi'
  tahsisliBirim: string
}

export const ORNEK_GELIR_DOSYALARI: GelirIhaleDosyasi[] = [
  {
    dosyaNo: '2886-2024/01',
    ihaleAdi: 'ODTÜ Teknokent Binası Zemin Kat 180 m² Ticari Alan Kiralama İhalesi',
    tur: 'Taşınmaz Kiralama',
    usul: 'Açık Artırma Usulü',
    muhammenBedel: 85000, // Aylık 85.000 TL
    geciciTeminatOrani: 3,
    geciciTeminatTutari: 30600, // Yıllık kira üzerinden %3
    ihaleTarihi: '22.07.2024',
    ihaleSaati: '14:30',
    lokasyon: 'AKM-ANK - ODTÜ Teknokent Yerleşkesi',
    durum: 'Teklif / Pey Aşamasında',
    varlikKodu: 'VRK-GM-001',
    varlikTanimi: 'Zemin Kat Ticari Ofis / Kafe Alanı (Bağımsız Bölüm 4)',
  },
  {
    dosyaNo: '2886-2024/02',
    ihaleAdi: '8 Adet Kurumsal Hizmet Aracının Toplu Satış İhalesi',
    tur: 'Varlık & Gayrimenkul Satışı',
    usul: 'Kapalı Teklif Usulü',
    muhammenBedel: 4200000,
    geciciTeminatOrani: 3,
    geciciTeminatTutari: 126000,
    ihaleTarihi: '25.07.2024',
    ihaleSaati: '11:00',
    lokasyon: 'Merkez Garaj / Lojistik Park',
    durum: 'İlanda',
    varlikKodu: 'VRK-FL-008',
    varlikTanimi: '2020-2022 Model Sedan ve SUV Şirket Araç Filosu',
  },
  {
    dosyaNo: '2886-2024/03',
    ihaleAdi: 'Elektronik Donanım ve Metal Hurda Geri Dönüşüm Satış İhalesi',
    tur: 'Hurda & Atıl Varlık Satışı',
    usul: 'Açık Artırma Usulü',
    muhammenBedel: 450000,
    geciciTeminatOrani: 5,
    geciciTeminatTutari: 22500,
    ihaleTarihi: '18.07.2024',
    ihaleSaati: '15:00',
    lokasyon: 'Ana Depo Hurdalık Sahası',
    durum: 'Komisyon Kararında',
    varlikKodu: 'VRK-HR-003',
    varlikTanimi: 'Yaklaşık 12 Ton Demir-Çelik ve Sunucu/PC Elektronik Hurda',
  },
  {
    dosyaNo: '2886-2024/04',
    ihaleAdi: 'Şirket Merkezi Personel Kafeteryası 3 Yıllık İşletme Hakkı Devri',
    tur: 'İşletme Hakkı Devri',
    usul: 'Pazarlık Usulü',
    muhammenBedel: 35000, // Aylık asgari ciro payı
    geciciTeminatOrani: 3,
    geciciTeminatTutari: 37800,
    ihaleTarihi: '10.07.2024',
    ihaleSaati: '10:00',
    lokasyon: 'AKM-ANK Yemekhane Bloğu',
    durum: 'Sözleşme İmzalandı',
    varlikKodu: 'VRK-KF-002',
    varlikTanimi: 'Kafeterya ve Otomat Alanları İşletme İmtiyazı',
  },
]

export const ORNEK_ISTEKLILER: IstekliPey[] = [
  {
    sira: 1,
    istekliAdi: 'Turkuaz Gayrimenkul Yatırım A.Ş.',
    vergiNo: '8490128471',
    yetkili: 'Caner Öztürk',
    teminatDurumu: 'Alındı (Banka Teminat Mektubu)',
    teminatTutari: 35000,
    ilkTeklif: 85000,
    tur1Teklif: 92000,
    tur2Teklif: 104000,
    sonTeklif: 112000,
    durum: 'En Yüksek Teklif (Kazanan)',
  },
  {
    sira: 2,
    istekliAdi: 'Başkent Kurumsal Hizmetler Ltd. Şti.',
    vergiNo: '1420918231',
    yetkili: 'Seda Korkmaz',
    teminatDurumu: 'Alındı (Nakit)',
    teminatTutari: 31000,
    ilkTeklif: 86000,
    tur1Teklif: 90000,
    tur2Teklif: 98000,
    sonTeklif: 106000,
    durum: 'Çekildi',
  },
  {
    sira: 3,
    istekliAdi: 'Anadolu Ticari İşletmecilik A.Ş.',
    vergiNo: '0981249812',
    yetkili: 'Mustafa Eren',
    teminatDurumu: 'Alındı (Banka Teminat Mektubu)',
    teminatTutari: 32000,
    ilkTeklif: 85000,
    tur1Teklif: 88000,
    tur2Teklif: 94000,
    sonTeklif: 94000,
    durum: 'Çekildi',
  },
]

export const ORNEK_KOMISYON: KomisyonUyesi2886[] = [
  {
    gorev: 'İhale Komisyon Başkanı',
    adSoyad: 'Dr. Hakan Yılmaz',
    unvan: 'Destek Hizmetleri Daire Başkanı / Genel Müdür Yrd.',
    karar: 'Kabul',
    imzaTarihi: '22.07.2024 16:15',
  },
  {
    gorev: 'Mali Üye',
    adSoyad: 'Ayşe Güler',
    unvan: 'Mali İşler ve Finans Müdürü',
    karar: 'Kabul',
    imzaTarihi: '22.07.2024 16:10',
  },
  {
    gorev: 'Hukuk Müşaviri',
    adSoyad: 'Av. Zeynep Bilgin',
    unvan: 'Başhukuk Müşaviri',
    karar: 'Kabul',
    imzaTarihi: '22.07.2024 16:05',
  },
  {
    gorev: 'Teknik Üye',
    adSoyad: 'Murat Şahin',
    unvan: 'Gayrimenkul ve Tesisler Yöneticisi',
    karar: 'Kabul',
    imzaTarihi: '22.07.2024 15:55',
  },
  {
    gorev: 'Raportör / Satış Sorumlusu',
    adSoyad: 'Abdulkadir İlci (lojtest1)',
    unvan: 'Lojistik & Gelir İhaleleri Yetkilisi',
    karar: 'Kabul',
    imzaTarihi: '22.07.2024 15:50',
  },
]

export const ORNEK_VARLIKLAR: VarlikEnvanterKaydi[] = [
  {
    varlikKodu: 'VRK-GM-001',
    ad: 'Teknokent Zemin Kat 180 m² Ticari Alan',
    kategori: 'Gayrimenkul / Ofis',
    lokasyon: 'ODTÜ Teknokent / Ankara',
    ekspertizDegeri: 9500000,
    durum: 'İhalede',
    tahsisliBirim: 'Tesis Yönetimi',
  },
  {
    varlikKodu: 'VRK-FL-008',
    ad: '8 Adet Sedan/SUV Kurumsal Filo Aracı',
    kategori: 'Araç / Filo',
    lokasyon: 'Merkez Lojistik Park',
    ekspertizDegeri: 4350000,
    durum: 'Boşta / İhaleye Hazır',
    tahsisliBirim: 'Ulaştırma Birimi',
  },
  {
    varlikKodu: 'VRK-HR-003',
    ad: '12 Ton Metal ve Elektronik Hurda Partisi',
    kategori: 'Hurda / Malzeme',
    lokasyon: 'Depo Hurdalık Sahası',
    ekspertizDegeri: 480000,
    durum: 'İhalede',
    tahsisliBirim: 'Depo ve Envanter',
  },
  {
    varlikKodu: 'VRK-KF-002',
    ad: 'Personel Kafeteryası ve Otomat Alanı',
    kategori: 'Tesis / İşletme',
    lokasyon: 'Merkez Yemekhane Katı',
    ekspertizDegeri: 1200000,
    durum: 'Kirada',
    tahsisliBirim: 'İdari İşler',
  },
  {
    varlikKodu: 'VRK-GM-005',
    ad: 'İstanbul Ataşehir 320 m² Depo & Lojistik Alanı',
    kategori: 'Gayrimenkul / Ofis',
    lokasyon: 'Ataşehir / İstanbul',
    ekspertizDegeri: 16500000,
    durum: 'Boşta / İhaleye Hazır',
    tahsisliBirim: 'Lojistik Dairesi',
  },
]

