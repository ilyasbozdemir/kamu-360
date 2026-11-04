import { RotaAdimi } from './types'

export interface ResmiUstYaziData {
  // 1. Antet (Başlık)
  tcIbaresi?: string
  kurumAdi?: string
  birimAdi?: string
  altBirimAdi?: string

  // 2. Sayı, Konu, Tarih
  sayi: string
  tarih: string
  konu: string

  // 3. Gizlilik ve İvedilik (Yönetmelik Standardı)
  gizlilikDerecesi?: 'NORMAL' | 'HİZMETE ÖZEL' | 'KİŞİYE ÖZEL' | 'GİZLİ' | 'ÇOK GİZLİ'
  ivedilikDerecesi?: 'NORMAL' | 'GÜNLÜDÜR' | 'ACELE'

  // 4. Muhatap ve İlgi
  muhatap: string
  muhatapYer?: string
  ilgi?: string

  // 5. Metin
  metin: string

  // 6. Ekler ve Dağıtım
  ekler: string[]
  dagitim: string[]

  // 7. Onay / Paraf Rotası
  rota: RotaAdimi[]

  // 8. Resmî İletişim Bilgileri (Alt Bilgi)
  iletisim?: {
    adres: string
    bilgiIcin: string
    unvan: string
    telefon: string
    faks: string
    eposta: string
    web: string
    kep: string
  }

  // 9. EBYS Elektronik İmza & Doğrulama Standartları
  ebysDogrulama?: {
    dogrulamaKodu: string
    dogrulamaUrl: string
    evrakId: string
    karekodVarMi: boolean
  }
}

export interface TemplateDefinition<T> {
  code: string
  name: string
  category: string
  version: string
  description: string
  paper: {
    format: 'A4' | 'A5' | 'Letter'
    orientation: 'portrait' | 'landscape'
    marginsMm: { top: number; right: number; bottom: number; left: number }
  }
  defaultData?: Partial<T>
}

export const resmiUstYaziDefinition: TemplateDefinition<ResmiUstYaziData> = {
  code: 'DOC_RESMI_UST_YAZI',
  name: 'Resmî Üst Yazı (Yönetmelik Uyumlu)',
  category: 'EBYS_YONETMELIK',
  version: '2.0.0',
  description:
    'Resmî Yazışmalarda Uygulanacak Usul ve Esaslar Hakkında Yönetmelik (Cumhurbaşkanlığı Kararı No: 2646) standardında A4 formatlı resmi yazı şablonu.',
  paper: {
    format: 'A4',
    orientation: 'portrait',
    marginsMm: { top: 25, right: 25, bottom: 25, left: 25 },
  },
}
