'use client'

import { useState, useEffect } from 'react'

export interface KurumVeRotaAyarlari {
  kurumAdi: string
  daireBaskanligi: string
  subeMudurlugu: string
  tcIbaresi: string
  antetTipi: 'tek' | 'cift' | 'sade'
  karekodGoster: boolean
  barkodGoster: boolean
  dogrulamaKodu: string
  ebysEvrakFormat: string

  // Yetkililer & İmzalar
  harcamaYetkilisiAdi: string
  harcamaYetkilisiUnvan: string
  gerceklestirmeGorevlisiAdi: string
  gerceklestirmeGorevlisiUnvan: string

  // Komisyonlar
  piyasaArastirmaUyeleri?: { adSoyad: string; unvan: string }[]
  muayeneKabulUyeleri?: { adSoyad: string; unvan: string }[]

  // Aktif Rota
  aktifRotaId: string
  aktifRotaAdi: string
}

export const VARSAYILAN_KURUM_ROTA_AYARLARI: KurumVeRotaAyarlari = {
  kurumAdi: 'T.C. ANKARA BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI',
  daireBaskanligi: 'Destek Hizmetleri Dairesi Başkanlığı',
  subeMudurlugu: 'Satınalma Şube Müdürlüğü',
  tcIbaresi: 'T.C.',
  antetTipi: 'tek',
  karekodGoster: true,
  barkodGoster: false,
  dogrulamaKodu: 'EBYS-2026-89412-TR',
  ebysEvrakFormat: 'STANDART_31151',

  harcamaYetkilisiAdi: 'Dr. Hakan YILMAZ',
  harcamaYetkilisiUnvan: 'Destek Hizmetleri Dairesi Başkanı / Harcama Yetkilisi',
  gerceklestirmeGorevlisiAdi: 'Mehmet DÜNDAR',
  gerceklestirmeGorevlisiUnvan: 'Satınalma Şube Müdürlüğü / Büro Personeli',

  piyasaArastirmaUyeleri: [
    { adSoyad: 'Mehmet DÜNDAR', unvan: 'Büro Personeli / Üye' },
    { adSoyad: 'Serkan DEMİR', unvan: 'Tekniker / Üye' },
    { adSoyad: 'Mustafa YILMAZ', unvan: 'Satınalma Şube Müdürü V. / Başkan' },
  ],

  muayeneKabulUyeleri: [
    { adSoyad: 'Ali KAYA', unvan: 'Taşınır Kayıt Yetkilisi / Üye' },
    { adSoyad: 'Serkan DEMİR', unvan: 'Teknik Personel / Üye' },
    { adSoyad: 'Mustafa YILMAZ', unvan: 'Şube Müdürü V. / Komisyon Başkanı' },
  ],

  aktifRotaId: 'rota-1',
  aktifRotaAdi: 'Harcama Talimatı & İhale Onay Rotası',
}

/**
 * Tarayıcıdan ayarları birleştirerek okur
 */
export function getKurumVeRotaAyarlari(): KurumVeRotaAyarlari {
  if (typeof window === 'undefined') return VARSAYILAN_KURUM_ROTA_AYARLARI

  try {
    const rotaSaved = localStorage.getItem('temin360_rota_ayarlari')
    const baskiSaved = localStorage.getItem('temin360_baski_ayarlari')
    const kurumSaved = localStorage.getItem('temin360_kurum_info')

    let merged = { ...VARSAYILAN_KURUM_ROTA_AYARLARI }

    if (baskiSaved) {
      const p = JSON.parse(baskiSaved)
      if (p.kurumAdi) merged.kurumAdi = p.kurumAdi
      if (p.daireBaskanligi) merged.daireBaskanligi = p.daireBaskanligi
      if (p.subeMudurlugu) merged.subeMudurlugu = p.subeMudurlugu
      if (p.qrKodGoster !== undefined) merged.karekodGoster = p.qrKodGoster
      if (p.antetTipi) merged.antetTipi = p.antetTipi
    }

    if (kurumSaved) {
      const p = JSON.parse(kurumSaved)
      if (p.kurumAdi) merged.kurumAdi = p.kurumAdi
      if (p.daireBaskanligi) merged.daireBaskanligi = p.daireBaskanligi
      if (p.subeMudurlugu) merged.subeMudurlugu = p.subeMudurlugu
    }

    if (rotaSaved) {
      const p = JSON.parse(rotaSaved)
      merged = { ...merged, ...p }
    }

    return merged
  } catch {
    return VARSAYILAN_KURUM_ROTA_AYARLARI
  }
}

/**
 * Ayarları kalıcı kaydeder ve tüm açık belgelere bildirir
 */
export function saveKurumVeRotaAyarlari(settings: Partial<KurumVeRotaAyarlari>): KurumVeRotaAyarlari {
  const current = getKurumVeRotaAyarlari()
  const updated: KurumVeRotaAyarlari = { ...current, ...settings }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('temin360_rota_ayarlari', JSON.stringify(updated))

      // Diğer anahtarları da eşitle
      const kurumPayload = {
        kurumAdi: updated.kurumAdi,
        daireBaskanligi: updated.daireBaskanligi,
        subeMudurlugu: updated.subeMudurlugu,
      }
      localStorage.setItem('temin360_kurum_info', JSON.stringify(kurumPayload))

      // Global event tetikle
      window.dispatchEvent(new CustomEvent('temin360_settings_updated', { detail: updated }))
    } catch {
      // ignore
    }
  }

  return updated
}

/**
 * React Hook: Canlı Ayarları Dinler ve Günceller
 */
export function useKurumVeRotaAyarlari() {
  const [ayarlar, setAyarlar] = useState<KurumVeRotaAyarlari>(VARSAYILAN_KURUM_ROTA_AYARLARI)

  useEffect(() => {
    setAyarlar(getKurumVeRotaAyarlari())

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<KurumVeRotaAyarlari>
      if (custom.detail) {
        setAyarlar(custom.detail)
      } else {
        setAyarlar(getKurumVeRotaAyarlari())
      }
    }

    window.addEventListener('temin360_settings_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('temin360_settings_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return ayarlar
}

