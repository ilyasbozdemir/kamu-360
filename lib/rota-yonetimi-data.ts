export type ImzaTuru =
  | 'Paraf'
  | 'Paraf & Koordinasyon'
  | 'İmza'
  | 'Olur Parafı'
  | 'Olur Koordinasyonu'
  | 'Teklif Eden'
  | 'Uygun Görüşle Arz'
  | 'Olur İmza'

export type RotaTuru = 'Giden' | 'Olur' | 'Gelen' | 'İç Yazışma'

export interface RotaKullaniciAdimi {
  id: string
  sira: number
  imzaTuru: ImzaTuru
  kullaniciId: string
  adSoyad: string
  unvan: string
  kariyerUnvani?: string // Dr., Av., Yük. Müh. vb.
  adinaBilgisi?: string // 'Makam Adına' vb.
  birim?: string
}

export interface RotaTanimi {
  id: string
  rotaAdi: string
  rotaTuru: RotaTuru
  varsayilanMi: boolean
  aktifMi: boolean
  aciklama?: string
  adimlari: RotaKullaniciAdimi[]
}

export interface PersonelKaydi {
  id: string
  adSoyad: string
  unvan: string
  kariyerUnvani?: string
  birim: string
  tcKimlikNo?: string
}

export const HAZIR_PERSONELLER: PersonelKaydi[] = [
  { id: 'p1', adSoyad: 'Mehmet DÜNDAR', unvan: 'Büro Personeli', kariyerUnvani: '', birim: 'Destek Hizmetleri Dairesi' },
  { id: 'p2', adSoyad: 'Ahmet ARI', unvan: 'Belediye Başkanı', kariyerUnvani: '', birim: 'Başkanlık Makamı' },
  { id: 'p3', adSoyad: 'Mustafa YILMAZ', unvan: 'Şube Müdürü V.', kariyerUnvani: 'Yük. Müh.', birim: 'Satınalma Şube Müdürlüğü' },
  { id: 'p4', adSoyad: 'Av. Zeynep KAYA', unvan: 'Hukuk Müşaviri', kariyerUnvani: 'Av.', birim: 'Hukuk İşleri Dairesi' },
  { id: 'p5', adSoyad: 'Serkan DEMİR', unvan: 'Mali Hizmetler Uzmanı', kariyerUnvani: '', birim: 'Mali Hizmetler Dairesi' },
  { id: 'p6', adSoyad: 'Dr. Erhan ÖZTÜRK', unvan: 'Genel Sekreter Yrd.', kariyerUnvani: 'Dr.', birim: 'Genel Sekreterlik' },
]

export const VARSAYILAN_ROTALAR: RotaTanimi[] = [
  {
    id: 'rota-1',
    rotaAdi: 'İç ve Dış Yazışma Rotası',
    rotaTuru: 'Giden',
    varsayilanMi: true,
    aktifMi: true,
    aciklama: 'Standart giden evrak ve resmi yazışma paraf ve imza akışı.',
    adimlari: [
      {
        id: 'step-1',
        sira: 1,
        imzaTuru: 'Paraf',
        kullaniciId: 'p1',
        adSoyad: 'Mehmet DÜNDAR',
        unvan: 'Büro Personeli',
        kariyerUnvani: '',
        adinaBilgisi: '',
        birim: 'Destek Hizmetleri Dairesi',
      },
      {
        id: 'step-2',
        sira: 2,
        imzaTuru: 'İmza',
        kullaniciId: 'p2',
        adSoyad: 'Ahmet Yılmaz',
        unvan: 'Belediye Başkanı',
        kariyerUnvani: '',
        adinaBilgisi: '',
        birim: 'Başkanlık Makamı',
      },
    ],
  },
  {
    id: 'rota-2',
    rotaAdi: 'Olur Yazısı',
    rotaTuru: 'Olur',
    varsayilanMi: false,
    aktifMi: true,
    aciklama: 'Harcama yetkilisi ve üst makam onay/olur akışı.',
    adimlari: [
      {
        id: 'step-3',
        sira: 1,
        imzaTuru: 'Teklif Eden',
        kullaniciId: 'p1',
        adSoyad: 'Mehmet DÜNDAR',
        unvan: 'Büro Personeli',
        kariyerUnvani: '',
        adinaBilgisi: '',
        birim: 'Destek Hizmetleri Dairesi',
      },
      {
        id: 'step-4',
        sira: 2,
        imzaTuru: 'Uygun Görüşle Arz',
        kullaniciId: 'p3',
        adSoyad: 'Mustafa YILMAZ',
        unvan: 'Şube Müdürü V.',
        kariyerUnvani: 'Yük. Müh.',
        adinaBilgisi: '',
        birim: 'Satınalma Şube Müdürlüğü',
      },
      {
        id: 'step-5',
        sira: 3,
        imzaTuru: 'Olur İmza',
        kullaniciId: 'p2',
        adSoyad: 'Ahmet Yılmaz',
        unvan: 'Belediye Başkanı',
        kariyerUnvani: '',
        adinaBilgisi: '',
        birim: 'Başkanlık Makamı',
      },
    ],
  },
]

export const STANDART_DOSYA_PLANLARI = [
  { kod: '841.01.01', baslik: '841.01.01 - Mal ve Hizmet Satınalma İşlemleri' },
  { kod: '841.01.02', baslik: '841.01.02 - Doğrudan Temin ve Piyasa Fiyat Araştırması' },
  { kod: '841.02.01', baslik: '841.02.01 - İhale Onay Belgeleri ve Komisyon Kararları' },
  { kod: '805.01.01', baslik: '805.01.01 - Bütçe ve Ödenek Talep Yazışmaları' },
  { kod: '934.01.02', baslik: '934.01.02 - Taşınmaz ve Araç Kiralama İşlemleri (2886)' },
]

export const DAGITIM_YERLERI = [
  'Gereği: Satınalma Şube Müdürlüğü',
  'Gereği: Destek Hizmetleri Dairesi Başkanlığı',
  'Bilgi: Mali Hizmetler Dairesi Başkanlığı',
  'Bilgi: Hukuk Müşavirliği',
  'Bilgi: Teftiş Kurulu Başkanlığı',
]

