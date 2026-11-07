/**
 * BKMYBS & 5018 Mali Yönetim Entegrasyon Servisi
 * 4734 Sayılı Kamu İhale Kanunu Madde 22/d (Doğrudan Temin) ile
 * 5018 Sayılı Kamu Mali Yönetimi ve Kontrol Kanunu (ÖEB, MİF, TKYS) arasındaki veri köprüsü.
 * workdesk-360 ve kamu-360 standartlarına tam uyumludur.
 */

import { TeminDosyasiKaydi } from '@/lib/temin-dosyasi/schema'

// 2026 Yılı 4734 KİK Parasal Limitleri (Tebliğ ve Bütçe Kanunu Göstergeleri)
export interface DogrudanTeminLimitConfig {
  yil: number
  buyuksehirLimiti: number // Büyükşehir belediyesi sınırları dahilindeki idareler için tek alım limiti
  digerIdareLimiti: number // Diğer idareler için tek alım limiti
  toplamMalHizmetOdenegi: number // İdarenin toplam mal ve hizmet alım bütçesi
  yuzdeOnKotaSiniri: number // %10 KİK uygun görüş eşiği (toplam ödenek * 0.10)
  kullanilanToplamDT: number // Bugüne kadar 22/d kapsamında yapılan toplam harcama
}

export const VARSAYILAN_LIMIT_CONFIG_2026: DogrudanTeminLimitConfig = {
  yil: 2026,
  buyuksehirLimiti: 864500, // 2026 KİK 22/d Büyükşehir Eşiği
  digerIdareLimiti: 288100, // 2026 KİK 22/d Diğer İdare Eşiği
  toplamMalHizmetOdenegi: 42200000, // 42.2 Milyon ₺
  yuzdeOnKotaSiniri: 4220000, // 4.22 Milyon ₺ (%10 Kuralı)
  kullanilanToplamDT: 2840450, // Kullanılan: ~2.84 Milyon ₺ (%67.3 kota doluluğu)
}

// Birim Bazlı 22/d Doğrudan Temin Kota Dağılımı
export interface BirimDTHarcama {
  birimKodu: string
  birimAdi: string
  tahsisEdilenKota: number
  harcananTutar: number
  dosyaSayisi: number
}

export const ORNEK_BIRIM_KOTALARI: BirimDTHarcama[] = [
  {
    birimKodu: '34.01.02.45',
    birimAdi: 'Destek Hizmetleri Dairesi (Satın Alma Şb. Md.)',
    tahsisEdilenKota: 1800000,
    harcananTutar: 1320450,
    dosyaSayisi: 14,
  },
  {
    birimKodu: '34.01.02.12',
    birimAdi: 'Su ve Altyapı Dairesi Başkanlığı',
    tahsisEdilenKota: 1200000,
    harcananTutar: 840000,
    dosyaSayisi: 8,
  },
  {
    birimKodu: '34.01.02.18',
    birimAdi: 'Fen İşleri Dairesi Başkanlığı',
    tahsisEdilenKota: 800000,
    harcananTutar: 480000,
    dosyaSayisi: 5,
  },
  {
    birimKodu: '34.01.02.25',
    birimAdi: 'Bilgi İşlem Dairesi Başkanlığı',
    tahsisEdilenKota: 420000,
    harcananTutar: 200000,
    dosyaSayisi: 3,
  },
]

// MİF & Ödeme Emri Belgesi (ÖEB) Kayıt Modeli
export interface MifKaydi {
  id: string
  mifNo: string // Örn: MİF-2026/0142
  oebNo: string // Örn: ÖEB-2026/89
  tarih: string // YYYY-MM-DD
  dosyaId?: number
  dosyaNo?: string // Doğrudan Temin No (Örn: 2026/DT-001)
  harcamaBirimi: string
  harcamaBirimiKodu: string
  muhasebeKodu: string
  butceYili: number
  butceTertibi: string // Örn: 34.01.02.45 - 01.3.1.00 - 05 - 03.2.1.01
  tertipAciklamasi?: string
  alacakliFirma: string
  alacakliVkn: string
  alacakliIban?: string
  isKonusu: string
  alimTuru: 'mal' | 'hizmet' | 'yapim'
  brutTutar: number
  damgaVergisiOrani: number // Binde 9.48 -> 0.00948
  damgaVergisi: number
  kararPulu: number // Binde 5.69 -> 0.00569
  kdvTevkifatOrani?: string // '2/10', '5/10', '7/10', 'Yok'
  kdvTevkifatTutari: number
  toplamKesinti: number
  netOdenecek: number
  tifNo?: string // Taşınır İşlem Fişi No (varsa)
  harcamaYetkilisi: string
  gerceklestirmeGorevlisi: string
  durum: 'Taslak' | 'Gerçekleştirme Onayında' | 'Harcama Yetkilisi Onayında' | 'Muhasebeye Gönderildi' | 'Ödendi'
  created_at: string
}

// Varsayılan İlk MİF Belgeleri
export const INITIAL_MIF_RECORDS: MifKaydi[] = [
  {
    id: 'mif-seed-1',
    mifNo: 'MİF-2026/0142',
    oebNo: 'ÖEB-2026/89',
    tarih: '2026-11-02',
    dosyaId: 1,
    dosyaNo: '2026/DT-001',
    harcamaBirimi: 'Satın Alma Şube Müdürlüğü',
    harcamaBirimiKodu: '34.01.02.45',
    muhasebeKodu: '34.01.00.00',
    butceYili: 2026,
    butceTertibi: '34.01.02.45 - 01.3.1.00 - 05 - 03.2.1.01',
    tertipAciklamasi: 'Kırtasiye, Büro Malzemesi ve Basılı Evrak Alımları',
    alacakliFirma: 'Turuncu Ofis Bilişim ve Kırtasiye San. Tic. Ltd. Şti.',
    alacakliVkn: '9918231201',
    alacakliIban: 'TR42 0006 1000 0001 2345 6789 01',
    isKonusu: '8 Kalem Orijinal Toner ve Sarf Malzemesi Alımı Hakedişi',
    alimTuru: 'mal',
    brutTutar: 184500,
    damgaVergisiOrani: 0.00948,
    damgaVergisi: 1749.06,
    kararPulu: 1049.81,
    kdvTevkifatOrani: 'Yok',
    kdvTevkifatTutari: 0,
    toplamKesinti: 2798.87,
    netOdenecek: 181701.13,
    tifNo: 'TİF-2026/045',
    harcamaYetkilisi: 'Ahmet Yılmaz',
    gerceklestirmeGorevlisi: 'Mehmet Demir',
    durum: 'Harcama Yetkilisi Onayında',
    created_at: '2026-11-02T10:30:00Z',
  },
  {
    id: 'mif-seed-2',
    mifNo: 'MİF-2026/0141',
    oebNo: 'ÖEB-2026/88',
    tarih: '2026-10-30',
    harcamaBirimi: 'Su ve Altyapı Dairesi',
    harcamaBirimiKodu: '34.01.02.12',
    muhasebeKodu: '34.01.00.00',
    butceYili: 2026,
    butceTertibi: '34.01.02.45 - 04.3.1.00 - 05 - 03.7.1.01',
    tertipAciklamasi: 'Su Şebekesi, Vana ve Pompa Tesisatı Onarım Giderleri',
    alacakliFirma: 'Anadolu Vana & Döküm San. Ltd. Şti.',
    alacakliVkn: '4819002314',
    alacakliIban: 'TR11 0001 5000 0009 8765 4321 99',
    isKonusu: 'Kuzey İsale Hattı Ø800 Vana Parçaları Temini',
    alimTuru: 'mal',
    brutTutar: 420000,
    damgaVergisiOrani: 0.00948,
    damgaVergisi: 3981.60,
    kararPulu: 0,
    kdvTevkifatOrani: 'Yok',
    kdvTevkifatTutari: 0,
    toplamKesinti: 3981.60,
    netOdenecek: 416018.40,
    tifNo: 'TİF-2026/038',
    harcamaYetkilisi: 'Hasan Yurt',
    gerceklestirmeGorevlisi: 'Mustafa Kaya',
    durum: 'Muhasebeye Gönderildi',
    created_at: '2026-10-30T14:15:00Z',
  },
]

const LOCAL_STORAGE_KEY_MIF = 'kamu360_bkmybs_mif_list'
const LOCAL_STORAGE_KEY_LIMIT = 'kamu360_bkmybs_limit_config'

/**
 * LocalStorage veya bellekten MİF listesini getirir
 */
export function getStoredMifList(): MifKaydi[] {
  if (typeof window === 'undefined') return INITIAL_MIF_RECORDS
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_MIF)
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY_MIF, JSON.stringify(INITIAL_MIF_RECORDS))
      return INITIAL_MIF_RECORDS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : INITIAL_MIF_RECORDS
  } catch (err) {
    console.error('MİF listesi okunamadı:', err)
    return INITIAL_MIF_RECORDS
  }
}

/**
 * MİF listesini LocalStorage'a kaydeder
 */
export function saveStoredMifList(list: MifKaydi[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_MIF, JSON.stringify(list))
  } catch (err) {
    console.error('MİF listesi kaydedilemedi:', err)
  }
}

/**
 * 22/d Limit yapılandırmasını getirir
 */
export function getStoredLimitConfig(): DogrudanTeminLimitConfig {
  if (typeof window === 'undefined') return VARSAYILAN_LIMIT_CONFIG_2026
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_LIMIT)
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY_LIMIT, JSON.stringify(VARSAYILAN_LIMIT_CONFIG_2026))
      return VARSAYILAN_LIMIT_CONFIG_2026
    }
    return JSON.parse(raw)
  } catch {
    return VARSAYILAN_LIMIT_CONFIG_2026
  }
}

/**
 * Bir Doğrudan Temin Dosyasından otomatik MİF & Ödeme Emri Belgesi (ÖEB) üretir
 */
export function createMifFromTeminDosyasi(
  dosya: TeminDosyasiKaydi,
  options?: {
    customTertip?: string
    harcamaYetkilisi?: string
    gerceklestirmeGorevlisi?: string
    tifNo?: string
  }
): { mif: MifKaydi; list: MifKaydi[] } {
  const currentList = getStoredMifList()

  // Kazanan firma tespiti
  const kazananFirma = (dosya.firmalar || []).find((f) => f.kazanan_mi) || dosya.firmalar?.[0]
  const brutTutar = kazananFirma && kazananFirma.toplam_teklif > 0 
    ? kazananFirma.toplam_teklif 
    : (dosya.yaklasik_maliyet || 0)

  // Damga vergisi (binde 9,48)
  const damga = +(brutTutar * 0.00948).toFixed(2)
  // Karar pulu (binde 5,69) - doğrudan teminde sözleşme yapılıyorsa
  const kararPulu = dosya.sozlesme_yapilacak_mi ? +(brutTutar * 0.00569).toFixed(2) : 0
  const kdvTevkifat = dosya.kesinti_kdv_tevkifat || 0
  const toplamKesinti = +(damga + kararPulu + kdvTevkifat).toFixed(2)
  const netOdenecek = +(brutTutar - toplamKesinti).toFixed(2)

  const index = currentList.length + 1
  const mifYear = dosya.butce_yili || 2026
  const mifNo = `MİF-${mifYear}/${String(142 + index).padStart(4, '0')}`
  const oebNo = `ÖEB-${mifYear}/${89 + index}`

  const newMif: MifKaydi = {
    id: `mif-dt-${dosya.id}-${Date.now()}`,
    mifNo,
    oebNo,
    tarih: new Date().toISOString().split('T')[0],
    dosyaId: dosya.id,
    dosyaNo: dosya.temin_no,
    harcamaBirimi: dosya.birim || 'Destek Hizmetleri Dairesi Başkanlığı',
    harcamaBirimiKodu: '34.01.02.45',
    muhasebeKodu: '34.01.00.00',
    butceYili: mifYear,
    butceTertibi: options?.customTertip || dosya.ekonomik_kod 
      ? `34.01.02.45 - ${dosya.fonksiyonel_kod || '01.3.1.00'} - 05 - ${dosya.ekonomik_kod}`
      : '34.01.02.45 - 01.3.1.00 - 05 - 03.2.1.01',
    tertipAciklamasi: dosya.ekonomik_kod || 'Kırtasiye ve Büro Malzemesi Alımları',
    alacakliFirma: kazananFirma?.firma_adi || dosya.kazanan_firma_adi || 'Seçili Yüklenici Firma',
    alacakliVkn: kazananFirma?.vergi_no || '1234567890',
    alacakliIban: 'TR00 0000 0000 0000 0000 0000 00',
    isKonusu: `${dosya.konu} (4734 m. 22/d Doğrudan Temin Hakedişi)`,
    alimTuru: dosya.tur === 'hizmet' ? 'hizmet' : dosya.tur === 'yapim_isi' ? 'yapim' : 'mal',
    brutTutar,
    damgaVergisiOrani: 0.00948,
    damgaVergisi: damga,
    kararPulu,
    kdvTevkifatOrani: kdvTevkifat > 0 ? '5/10' : 'Yok',
    kdvTevkifatTutari: kdvTevkifat,
    toplamKesinti,
    netOdenecek,
    tifNo: options?.tifNo || (dosya.tur === 'mal' ? `TİF-${mifYear}/${String(50 + index).padStart(3, '0')}` : undefined),
    harcamaYetkilisi: options?.harcamaYetkilisi || 'Ahmet Yılmaz',
    gerceklestirmeGorevlisi: options?.gerceklestirmeGorevlisi || 'Mehmet Demir',
    durum: 'Harcama Yetkilisi Onayında',
    created_at: new Date().toISOString(),
  }

  // Listeye en başa ekle
  const updatedList = [newMif, ...currentList.filter((m) => m.dosyaId !== dosya.id)]
  saveStoredMifList(updatedList)

  return { mif: newMif, list: updatedList }
}

