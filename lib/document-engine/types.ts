/**
 * EBYS ve Doğrudan Temin Süreç Rota Akış Kontratı
 */

export type RotaAdimTuru = 'Hazırlayan' | 'Paraf' | 'İmza' | 'Bilgi' | 'Onay'
export type RotaDurumu = 'BEKLIYOR' | 'ONAYLANDI' | 'REDDEDILDI' | 'IADE_EDILDI'

export interface RotaAdimi {
  sira: number
  tur: RotaAdimTuru
  adSoyad: string
  unvan: string
  birim?: string
  tcKimlikNo?: string // e-İmza / mobil imza doğrulama için
  durum: RotaDurumu
  islemTarihi?: string // ISO 8601
  aciklama?: string // İade veya red gerekçesi
  imzaVerisi?: {
    imzaZamani: string
    sertifikaSeriNo?: string
    imzaTipi: 'ISLAK_IMZA' | 'E_IMZA' | 'MOBIL_IMZA'
  }
}

export interface BelgeRotaAkisi {
  belgeId: string
  dosyaNo: string
  aktifAdimIndex: number
  tamamlandiMi: boolean
  adimlar: RotaAdimi[]
}

export interface BelgeSnapshotKaydi {
  dosyaId: number | string
  templateCode: string
  templateVersion: string
  snapshotJson: string
  contentHash: string
  sealedBy: string
  sealedAt: string
}

