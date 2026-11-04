import { ResmiUstYaziData } from './definition'
import { RotaAdimi } from './types'

export interface DocumentContext {
  dosya?: {
    dosya_no?: string
    is_tanimi?: string
    ad?: string
    sunulacak_makam?: string
    talep_sayisi?: string
    talep_tarihi?: string
    sube_muduru?: string
    harcama_yetkilisi?: string
  }
  kurum?: {
    detsisNo?: string
    harcamaYetkilisi?: string
    kurumAdi?: string
    daireBaskanligi?: string
    altBirim?: string
  }
  aktifRota?: RotaAdimi[]
  currentUser?: {
    displayName?: string
    unvan?: string
    birim?: string
  }
}

export interface DocumentContextResolver<T> {
  resolve: (rawContext: DocumentContext) => T
}

export const resmiUstYaziResolver: DocumentContextResolver<ResmiUstYaziData> = {
  resolve: (rawContext): ResmiUstYaziData => {
    const { dosya, kurum, aktifRota, currentUser } = rawContext

    const rotaAdimlari: RotaAdimi[] = aktifRota?.length
      ? aktifRota
      : [
          {
            sira: 1,
            tur: 'Hazırlayan',
            adSoyad: currentUser?.displayName || 'Mehmet DÜNDAR',
            unvan: currentUser?.unvan || 'Büro Personeli',
            durum: 'ONAYLANDI',
            islemTarihi: new Date().toISOString(),
          },
          {
            sira: 2,
            tur: 'Paraf',
            adSoyad: dosya?.sube_muduru || 'Mustafa YILMAZ',
            unvan: 'Satınalma Şube Müdürü V.',
            durum: 'BEKLIYOR',
          },
          {
            sira: 3,
            tur: 'İmza',
            adSoyad:
              dosya?.harcama_yetkilisi ||
              kurum?.harcamaYetkilisi ||
              'Dr. Hakan YILMAZ',
            unvan: 'Destek Hizmetleri Dairesi Başkanı / Harcama Yetkilisi',
            durum: 'BEKLIYOR',
          },
        ]

    return {
      tcIbaresi: 'T.C.',
      kurumAdi: kurum?.kurumAdi || 'ANKARA BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI',
      birimAdi: kurum?.daireBaskanligi || 'Destek Hizmetleri Dairesi Başkanlığı',
      altBirimAdi: kurum?.altBirim || 'Satınalma Şube Müdürlüğü',

      sayi: `${kurum?.detsisNo || 'E-84125801'}-841.01.01-${dosya?.dosya_no || '2026/0142'}`,
      tarih: new Date().toLocaleDateString('tr-TR'),
      konu:
        dosya?.is_tanimi ||
        dosya?.ad ||
        'Piyasa Fiyat Araştırma Tutanağı ve Onay Talebi',

      gizlilikDerecesi: 'NORMAL',
      ivedilikDerecesi: 'NORMAL',

      muhatap: dosya?.sunulacak_makam || 'HARCAMA YETKİLİSİ MAKAMINA',
      muhatapYer: 'ANKARA',

      ilgi: dosya?.talep_sayisi
        ? `${dosya.talep_tarihi || '15.07.2024'} tarihli ve ${dosya.talep_sayisi} sayılı talep yazısı.`
        : '15.07.2024 tarihli ve 2024/941 sayılı talep yazısı.',

      metin: `Birimimiz ihtiyacı için 4734 Sayılı Kamu İhale Kanununun 22/d maddesi kapsamında doğrudan temin usulüyle yapılması planlanan yukarıda konusu belirtilen mal/hizmet alımına ilişkin belgeler ve piyasa fiyat araştırma tutanakları ekte sunulmuştur.\n\nSöz konusu alımın gerçekleştirilmesi ve harcama onay belgesinin düzenlenmesi hususunu olurlarınıza arz ederim.`,

      ekler: [
        '1 Adet Yaklaşık Maliyet ve Teklif Cetveli (2 Sayfa)',
        '3 Adet İmzalı ve Kaşeli Firma Teklif Mektubu',
        '1 Adet Piyasa Fiyat Araştırma Tutanağı',
      ],

      dagitim: [
        'Gereği : Satınalma Şube Müdürlüğüne',
        'Bilgi   : Mali Hizmetler Dairesi Başkanlığına',
      ],

      rota: rotaAdimlari,

      iletisim: {
        adres: 'Emniyet Mah. Hipodrom Cad. No:5 Yenimahalle / ANKARA',
        bilgiIcin: 'Mehmet DÜNDAR',
        unvan: 'Büro Personeli',
        telefon: '(0312) 507 10 00',
        faks: '(0312) 507 10 05',
        eposta: 'satin-alma@belediye.bel.tr',
        web: 'www.belediye.bel.tr',
        kep: 'belediye@hs01.kep.tr',
      },

      ebysDogrulama: {
        dogrulamaKodu: '8A4B-39C2-D81E-4421',
        dogrulamaUrl: 'https://ebys.belediye.bel.tr/dogrulama',
        evrakId: 'EVR-2026-094182',
        karekodVarMi: true,
      },
    }
  },
}
