import React from 'react'
import { TeminDosyasiKaydi } from '@/lib/temin-dosyasi/schema'
import {
  OnayBelgesiTemplate,
  PiyasaFiyatArastirmasiTemplate,
  YaklasikMaliyetTemplate,
  TeklifMektubuTemplate,
  SozlesmeTemplate,
  MuayeneKabulTemplate,
  DamgaVergisiTemplate,
} from './templates/all-templates'
import { ResmiUstYaziTemplate } from './template'
import { resmiUstYaziResolver } from './resolver'

export interface TemplateInfo {
  code: string
  title: string
  shortTitle: string
  category: 'Doğrudan Temin' | 'EBYS & Resmî Yazı' | 'Sözleşme & Kabul' | 'Maliye & Tahakkuk'
  description: string
  render: (dosya: TeminDosyasiKaydi) => React.ReactNode
}

export const TEMPLATE_REGISTRY: Record<string, TemplateInfo> = {
  DOC_ONAY_BELGESI: {
    code: 'DOC_ONAY_BELGESI',
    title: 'Harcama Talimatı / İhale Onay Belgesi',
    shortTitle: 'Onay Belgesi',
    category: 'Doğrudan Temin',
    description: '4734 Sayılı Kanun Madde 22/d uyarınca harcama yetkilisinin olurunu alan yasal onay belgesi.',
    render: (dosya) => <OnayBelgesiTemplate data={dosya} />,
  },
  DOC_PIYASA_FIYAT_ARASTIRMASI: {
    code: 'DOC_PIYASA_FIYAT_ARASTIRMASI',
    title: 'Piyasa Fiyat Araştırması Tutanağı',
    shortTitle: 'Piyasa Fiyat Tutanağı',
    category: 'Doğrudan Temin',
    description: 'En az 3 firmadan alınan teklifleri ve en uygun fiyat seçim gerekçesini belgeleyen tutanak.',
    render: (dosya) => <PiyasaFiyatArastirmasiTemplate data={dosya} />,
  },
  DOC_YAKLASIK_MALIYET: {
    code: 'DOC_YAKLASIK_MALIYET',
    title: 'Yaklaşık Maliyet Hesap Cetveli & Formu',
    shortTitle: 'Yaklaşık Maliyet',
    category: 'Doğrudan Temin',
    description: 'Tüm kalemlerin firma teklifleri ve aritmetik ortalaması üzerinden yaklaşık maliyet dökümü.',
    render: (dosya) => <YaklasikMaliyetTemplate data={dosya} />,
  },
  DOC_TEKLIF_MEKTUBU: {
    code: 'DOC_TEKLIF_MEKTUBU',
    title: 'Birim Fiyat Teklif İsteme Mektubu ve Cetveli',
    shortTitle: 'Teklif Mektubu',
    category: 'Doğrudan Temin',
    description: 'Firmalara gönderilen resmi fiyat isteme mektubu ve birim fiyat teklif cetveli.',
    render: (dosya) => <TeklifMektubuTemplate data={dosya} />,
  },
  DOC_SOZLESME_TASLAGI: {
    code: 'DOC_SOZLESME_TASLAGI',
    title: 'Doğrudan Temin Alım Sözleşmesi / Sipariş Akdi',
    shortTitle: 'Alım Sözleşmesi',
    category: 'Sözleşme & Kabul',
    description: 'Damga vergisi, karar pulu ve teslim şartlarını içeren bağlayıcı sözleşme metni.',
    render: (dosya) => <SozlesmeTemplate data={dosya} />,
  },
  DOC_MUAYENE_KABUL: {
    code: 'DOC_MUAYENE_KABUL',
    title: 'Muayene ve Kabul Komisyonu Tutanağı',
    shortTitle: 'Muayene Kabul',
    category: 'Sözleşme & Kabul',
    description: 'Teslim edilen malların fiziksel ve teknik şartnameye uygunluğunu onaylayan kabul tutanağı.',
    render: (dosya) => <MuayeneKabulTemplate data={dosya} />,
  },
  DOC_DAMGA_VERGISI: {
    code: 'DOC_DAMGA_VERGISI',
    title: 'Damga Vergisi ve Karar Pulu Tahakkuk Müzekkeresi',
    shortTitle: 'Damga & Tahakkuk',
    category: 'Maliye & Tahakkuk',
    description: 'İhale karar pulu (binde 5,69) ve sözleşme damga vergisi (binde 9,48) kesinti tahakkuk belgesi.',
    render: (dosya) => <DamgaVergisiTemplate data={dosya} />,
  },
  DOC_RESMI_UST_YAZI: {
    code: 'DOC_RESMI_UST_YAZI',
    title: 'Resmî Üst Yazı (31151 Sayılı Yönetmelik)',
    shortTitle: 'Resmî Üst Yazı',
    category: 'EBYS & Resmî Yazı',
    description: 'Cumhurbaşkanlığı Resmî Yazışma Yönetmeliğine tam uyumlu A4 EBYS üst yazı belgesi.',
    render: (dosya) => {
      const data = resmiUstYaziResolver.resolve({
        dosya: {
          dosya_no: dosya.temin_no,
          is_tanimi: dosya.konu,
          sunulacak_makam: dosya.sunulacak_makam,
          harcama_yetkilisi: dosya.onay_personel_adi,
        },
      })
      return <ResmiUstYaziTemplate data={data} />
    },
  },
}
