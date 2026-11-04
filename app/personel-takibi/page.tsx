'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Users,
  UserCheck,
  Calendar,
  FileText,
  Clock,
  Briefcase,
  Search,
  Plus,
  Download,
  Printer,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  FileSignature,
  Eye,
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  CreditCard,
  Building,
  ChevronRight,
  Plane,
} from 'lucide-react'

// Personel Veri Tipi Tanımı
export interface StaffDetail {
  id: string
  adSoyad: string
  tcKimlik: string
  statu: string
  birim: string
  unvan: string
  gorev: string
  girisTarihi: string
  kalanIzin: string
  durum: string
  // Detaylı Özlük & Kadro Bilgileri
  kimlik: {
    babaAdi: string
    anaAdi: string
    dogumTarihi: string
    dogumYeri: string
    kanGrubu: string
    medeniHal: string
    askerlik: string
    eposta: string
    telefon: string
    adres: string
  }
  kadro: {
    sicilNo: string
    kadroDerece: string
    kadroKademe: string
    ekGosterge: string
    kazanilmisHak: string
    emeklilikTarihi: string
    fiiliHizmet: string
    sendika: string
    iban: string
  }
  hizmetGecmisi: Array<{
    tarihAraligi: string
    kurumBirim: string
    unvan: string
    dayanak: string
    aciklama: string
  }>
  izinKayitlari: {
    cariHak: number
    devreden: number
    kullanilan: number
    kalan: number
    gecmis: Array<{
      tur: string
      baslangic: string
      bitis: string
      gun: number
      onayci: string
      durum: string
    }>
  }
  harcirahlar: Array<{
    onayNo: string
    gorevYeri: string
    tarih: string
    tutar: string
    durum: string
  }>
  egitimBelgeler: {
    ogrenim: Array<{
      seviye: string
      okul: string
      bolum: string
      yil: string
      derece: string
    }>
    sertifikalar: Array<{
      ad: string
      kurum: string
      tarih: string
      no: string
    }>
    oduller: Array<{
      tur: string
      gerekce: string
      makam: string
      tarih: string
    }>
  }
}

// Detaylı Örnek Personel Listesi
const INITIAL_STAFF: StaffDetail[] = [
  {
    id: 'PER-1042',
    adSoyad: 'Ahmet Yılmaz',
    tcKimlik: '189******12',
    statu: '657 Devlet Memuru',
    birim: 'Destek Hizmetleri Dairesi Başkanlığı',
    unvan: 'Daire Başkanı',
    gorev: 'Harcama Yetkilisi',
    girisTarihi: '15.03.2012',
    kalanIzin: '24 Gün',
    durum: 'Görevde',
    kimlik: {
      babaAdi: 'Mustafa',
      anaAdi: 'Fatma',
      dogumTarihi: '12.04.1982',
      dogumYeri: 'Fatih / İstanbul',
      kanGrubu: 'A Rh(+)',
      medeniHal: 'Evli (2 Çocuk)',
      askerlik: 'Yaptı (Yedek Subay - 2008)',
      eposta: 'ahmet.yilmaz@ibb.gov.tr',
      telefon: '0 (212) 455 13 00 / Dahili: 1420',
      adres: 'Bahçelievler Mah. Talatpaşa Cad. No:18/4 Bahçelievler / İstanbul',
    },
    kadro: {
      sicilNo: 'MEM-04821',
      kadroDerece: '1',
      kadroKademe: '4',
      ekGosterge: '3600',
      kazanilmisHak: '1/4 (3600 Ek Gösterge)',
      emeklilikTarihi: '12.04.2042',
      fiiliHizmet: '14 Yıl 7 Ay 20 Gün',
      sendika: 'Bem-Bir-Sen (Üye No: 34-8841)',
      iban: 'TR42 0001 0090 1234 5678 5001 01 (VakıfBank - İBB Şubesi)',
    },
    hizmetGecmisi: [
      {
        tarihAraligi: '15.09.2020 - Günümüz',
        kurumBirim: 'İBB Destek Hizmetleri Dairesi Başkanlığı',
        unvan: 'Daire Başkanı',
        dayanak: 'Başkanlık Makamı Onayı (Karar No: 2020/412)',
        aciklama: '5018 Harcama Yetkilisi & İhale Birim Amiri görevi.',
      },
      {
        tarihAraligi: '01.06.2016 - 15.09.2020',
        kurumBirim: 'İBB Satın Alma Şube Müdürlüğü',
        unvan: 'Şube Müdürü',
        dayanak: 'Görevde Yükselme Sınavı & Atama Kararı (2016/189)',
        aciklama: '4734 ve 2886 Sayılı Kanun ihale süreçleri idaresi.',
      },
      {
        tarihAraligi: '15.03.2012 - 01.06.2016',
        kurumBirim: 'İBB Fen İşleri Dairesi / Altyapı Şube Md.',
        unvan: 'İnşaat Mühendisi',
        dayanak: 'KPSS-2011/2 Merkezî Memur Ataması',
        aciklama: 'Hakediş kontrolü ve teknik şartname komisyon üyeliği.',
      },
    ],
    izinKayitlari: {
      cariHak: 30,
      devreden: 0,
      kullanilan: 6,
      kalan: 24,
      gecmis: [
        {
          tur: 'Yıllık İzin',
          baslangic: '14.07.2026',
          bitis: '20.07.2026',
          gun: 6,
          onayci: 'Genel Sekreter Yardımcısı',
          durum: 'Onaylandı (Tamamlandı)',
        },
        {
          tur: 'Mazeret İzni (657/104)',
          baslangic: '10.03.2026',
          bitis: '10.03.2026',
          gun: 1,
          onayci: 'Genel Sekreter Yardımcısı',
          durum: 'Onaylandı (Kullanıldı)',
        },
      ],
    },
    harcirahlar: [
      {
        onayNo: 'GRV-2026/012',
        gorevYeri: 'Ankara (Kamu İhale Kurumu - Düzenleyici Kurul Toplantısı)',
        tarih: '15.04.2026 - 16.04.2026 (2 Gün)',
        tutar: '4.850,00 ₺',
        durum: 'Ödendi (MİF No: 2026/182)',
      },
      {
        onayNo: 'GRV-2025/088',
        gorevYeri: 'Antalya (TBB Belediye Mevzuatı Semineri)',
        tarih: '20.10.2025 - 24.10.2025 (5 Gün)',
        tutar: '9.400,00 ₺',
        durum: 'Ödendi (MİF No: 2025/940)',
      },
    ],
    egitimBelgeler: {
      ogrenim: [
        {
          seviye: 'Lisans',
          okul: 'İstanbul Teknik Üniversitesi (İTÜ)',
          bolum: 'İnşaat Mühendisliği',
          yil: '2005 - 2009',
          derece: '3.62 / 4.00 (Fakülte 3.sü)',
        },
        {
          seviye: 'Yüksek Lisans',
          okul: 'Boğaziçi Üniversitesi',
          bolum: 'Kamu Yönetimi & Kent Politikaları',
          yil: '2012 - 2015',
          derece: '3.80 / 4.00',
        },
      ],
      sertifikalar: [
        {
          ad: '4734 Sayılı Kamu İhale Mevzuatı Uzmanlık Sertifikası',
          kurum: 'Kamu İhale Kurumu (KİK)',
          tarih: '12.05.2022',
          no: 'KIK-UZM-2022/941',
        },
        {
          ad: '5018 Sayılı Kamu Malî Yönetimi Harcama Yetkilisi Sertifikası',
          kurum: 'Hazine ve Maliye Bakanlığı Muhasebat GM',
          tarih: '18.11.2021',
          no: 'HMB-5018-7712',
        },
      ],
      oduller: [
        {
          tur: 'Başarı Belgesi (657 Sayılı Kanun Madde 122)',
          gerekce: 'Kamu İhale ve Doğrudan Temin Süreçlerinde Sağlanan %22 Bütçe Tasarrufu',
          makam: 'İstanbul Büyükşehir Belediye Başkanı',
          tarih: '10.01.2025',
        },
      ],
    },
  },
  {
    id: 'PER-2091',
    adSoyad: 'Mehmet Demir',
    tcKimlik: '342******80',
    statu: '657 Devlet Memuru',
    birim: 'Satın Alma Şube Müdürlüğü',
    unvan: 'Şube Müdürü',
    gorev: 'Gerçekleştirme Görevlisi',
    girisTarihi: '01.09.2016',
    kalanIzin: '18 Gün',
    durum: 'Görevde',
    kimlik: {
      babaAdi: 'İbrahim',
      anaAdi: 'Emine',
      dogumTarihi: '08.11.1986',
      dogumYeri: 'Çankaya / Ankara',
      kanGrubu: '0 Rh(+)',
      medeniHal: 'Evli (1 Çocuk)',
      askerlik: 'Yaptı (Kısa Dönem - 2011)',
      eposta: 'mehmet.demir@ibb.gov.tr',
      telefon: '0 (212) 455 13 00 / Dahili: 1425',
      adres: 'Ataköy 7-8-9-10. Kısım Mah. Barış Cad. No:4 Bakırköy / İstanbul',
    },
    kadro: {
      sicilNo: 'MEM-07492',
      kadroDerece: '2',
      kadroKademe: '2',
      ekGosterge: '3000',
      kazanilmisHak: '2/2 (3000 Ek Gösterge)',
      emeklilikTarihi: '08.11.2046',
      fiiliHizmet: '10 Yıl 2 Ay 11 Gün',
      sendika: 'Bem-Bir-Sen',
      iban: 'TR88 0001 0090 1234 5678 5002 02 (VakıfBank)',
    },
    hizmetGecmisi: [
      {
        tarihAraligi: '15.09.2020 - Günümüz',
        kurumBirim: 'İBB Satın Alma Şube Müdürlüğü',
        unvan: 'Şube Müdürü',
        dayanak: 'Atama Kararı (2020/554)',
        aciklama: '5018 Gerçekleştirme Görevlisi & Satın Alma Süreçleri Yönetimi.',
      },
      {
        tarihAraligi: '01.09.2016 - 15.09.2020',
        kurumBirim: 'İBB Destek Hizmetleri Dairesi',
        unvan: 'Satın Alma Şefi / İktisatçı',
        dayanak: 'Kurumlararası Naklen Atama (2016/32)',
        aciklama: 'Doğrudan temin ve piyasa fiyat araştırması koordinatörü.',
      },
    ],
    izinKayitlari: {
      cariHak: 20,
      devreden: 4,
      kullanilan: 6,
      kalan: 18,
      gecmis: [
        {
          tur: 'Yıllık İzin',
          baslangic: '05.08.2026',
          bitis: '11.08.2026',
          gun: 6,
          onayci: 'Daire Başkanı',
          durum: 'Onaylandı (Tamamlandı)',
        },
      ],
    },
    harcirahlar: [
      {
        onayNo: 'GRV-2026/039',
        gorevYeri: 'İlçe Şantiyeleri Yerinde Muayene',
        tarih: '03.11.2026 - 04.11.2026 (2 Gün)',
        tutar: '1.700,00 ₺',
        durum: 'Ödendi (MİF No: 2026/89)',
      },
    ],
    egitimBelgeler: {
      ogrenim: [
        {
          seviye: 'Lisans',
          okul: 'Hacettepe Üniversitesi',
          bolum: 'İktisadi ve İdari Bilimler Fakültesi / İktisat',
          yil: '2004 - 2008',
          derece: '3.40 / 4.00',
        },
      ],
      sertifikalar: [
        {
          ad: 'EKAP Elektronik İhale ve E-Teklif Eğitimi',
          kurum: 'Kamu İhale Kurumu (KİK)',
          tarih: '14.02.2023',
          no: 'EKAP-ERT-2023/118',
        },
      ],
      oduller: [
        {
          tur: 'Üstün Başarı Belgesi',
          gerekce: 'Elektronik Satın Alma ve Dijitalleştirme Projesi Başarısı',
          makam: 'Genel Sekreterlik Makamı',
          tarih: '28.12.2024',
        },
      ],
    },
  },
  {
    id: 'PER-3814',
    adSoyad: 'Selin Yılmaz',
    tcKimlik: '271******34',
    statu: '4/B Sözleşmeli Personel',
    birim: 'Satın Alma Şube Müdürlüğü',
    unvan: 'Satın Alma & İhale Uzmanı',
    gorev: 'Piyasa Araştırma Görevlisi',
    girisTarihi: '12.02.2020',
    kalanIzin: '12 Gün',
    durum: 'Görevde',
    kimlik: {
      babaAdi: 'Kemal',
      anaAdi: 'Zeynep',
      dogumTarihi: '24.03.1994',
      dogumYeri: 'Konak / İzmir',
      kanGrubu: 'B Rh(+)',
      medeniHal: 'Bekar',
      askerlik: 'Muaf',
      eposta: 'selin.yilmaz@ibb.gov.tr',
      telefon: '0 (212) 455 13 00 / Dahili: 1432',
      adres: 'Caddebostan Mah. Bağdat Cad. No:212/8 Kadıköy / İstanbul',
    },
    kadro: {
      sicilNo: 'SOZ-01824',
      kadroDerece: 'Sözleşmeli',
      kadroKademe: '1. Hizmet Grubu',
      ekGosterge: 'Kadro Karşılığı Sözleşmeli',
      kazanilmisHak: 'Tavan Ücret Skalası (Grup 1)',
      emeklilikTarihi: '24.03.2054',
      fiiliHizmet: '6 Yıl 8 Ay 22 Gün',
      sendika: 'Tüm Yerel-Sen',
      iban: 'TR19 0001 0090 1234 5678 5003 03 (VakıfBank)',
    },
    hizmetGecmisi: [
      {
        tarihAraligi: '12.02.2020 - Günümüz',
        kurumBirim: 'İBB Satın Alma Şube Müdürlüğü',
        unvan: 'Satın Alma & İhale Uzmanı (4/B)',
        dayanak: '4/B Sözleşmeli Personel Alımı (2020/08)',
        aciklama: 'Hizmet ve mal alımı ihaleleri idari şartname ve sözleşme hazırlığı.',
      },
    ],
    izinKayitlari: {
      cariHak: 20,
      devreden: 0,
      kullanilan: 8,
      kalan: 12,
      gecmis: [
        {
          tur: 'Yıllık İzin',
          baslangic: '10.06.2026',
          bitis: '18.06.2026',
          gun: 8,
          onayci: 'Şube Müdürü',
          durum: 'Onaylandı (Tamamlandı)',
        },
      ],
    },
    harcirahlar: [
      {
        onayNo: 'GRV-2026/041',
        gorevYeri: 'Ankara -> İzmir (KİK Eğitimi)',
        tarih: '10.11.2026 - 13.11.2026 (4 Gün)',
        tutar: '8.200,00 ₺',
        durum: 'Onaylandı (Harcama Yetkilisi)',
      },
    ],
    egitimBelgeler: {
      ogrenim: [
        {
          seviye: 'Lisans',
          okul: 'Ankara Üniversitesi',
          bolum: 'Hukuk Fakültesi',
          yil: '2012 - 2016',
          derece: '3.55 / 4.00',
        },
      ],
      sertifikalar: [
        {
          ad: 'Kamu İhale Sözleşmeleri Hukuku ve İtirazen Şikayet Süreçleri',
          kurum: 'Türkiye Barolar Birliği Eğitim Merkezi',
          tarih: '05.09.2022',
          no: 'TBB-KIK-2022/411',
        },
      ],
      oduller: [
        {
          tur: 'Teşekkür Belgesi',
          gerekce: 'Uluslararası Kredi Sözleşmeleri ve İhale Dosyası İncelemesi',
          makam: 'Daire Başkanlığı',
          tarih: '15.11.2024',
        },
      ],
    },
  },
  {
    id: 'PER-4402',
    adSoyad: 'Mustafa Kaya',
    tcKimlik: '519******92',
    statu: '4857 Sürekli İşçi',
    birim: 'Fen İşleri Dairesi / Su Altyapı',
    unvan: 'Saha Bakım & Şebeke Ustası',
    gorev: 'Vana ve Boru Bakım',
    girisTarihi: '10.05.2018',
    kalanIzin: '14 Gün',
    durum: 'Yıllık İzinde (Dönüş: 08.11.2026)',
    kimlik: {
      babaAdi: 'Ali',
      anaAdi: 'Ayşe',
      dogumTarihi: '14.07.1989',
      dogumYeri: 'Üsküdar / İstanbul',
      kanGrubu: 'A Rh(-)',
      medeniHal: 'Evli (2 Çocuk)',
      askerlik: 'Yaptı (Er - 2010)',
      eposta: 'mustafa.kaya@ibb.gov.tr',
      telefon: '0 (533) 890 12 34',
      adres: 'Yavuztürk Mah. Karadeniz Cad. No:82/2 Üsküdar / İstanbul',
    },
    kadro: {
      sicilNo: 'ISC-08912',
      kadroDerece: 'Sürekli İşçi (Kadrolu)',
      kadroKademe: '2. Kıdem Grubu',
      ekGosterge: 'Toplu İş Sözleşmesi (TİS)',
      kazanilmisHak: 'TİS 4. Dilim Yevmiye',
      emeklilikTarihi: '14.07.2049',
      fiiliHizmet: '8 Yıl 5 Ay 24 Gün',
      sendika: 'Hizmet-İş Sendikası (1 No\'lu Şube)',
      iban: 'TR55 0001 0090 1234 5678 5004 04 (VakıfBank)',
    },
    hizmetGecmisi: [
      {
        tarihAraligi: '10.05.2018 - Günümüz',
        kurumBirim: 'İBB Fen İşleri Dairesi / Su Altyapı Şube Md.',
        unvan: 'Saha Bakım & Şebeke Ustası',
        dayanak: 'KHK/696 Sürekli İşçi Kadrosuna Geçiş',
        aciklama: 'Ana isale hatları, içme suyu boru montajı ve arıza onarımı.',
      },
    ],
    izinKayitlari: {
      cariHak: 20,
      devreden: 0,
      kullanilan: 6,
      kalan: 14,
      gecmis: [
        {
          tur: 'Yıllık İzin',
          baslangic: '02.11.2026',
          bitis: '07.11.2026',
          gun: 6,
          onayci: 'Bölge Şefi',
          durum: 'Aktif Kullanımda (Dönüş: 08.11.2026)',
        },
      ],
    },
    harcirahlar: [],
    egitimBelgeler: {
      ogrenim: [
        {
          seviye: 'Lise',
          okul: 'Haydarpaşa Mesleki ve Teknik Anadolu Lisesi',
          bolum: 'Tesisat Teknolojisi ve İklimlendirme',
          yil: '2003 - 2007',
          derece: 'İyi Derece',
        },
      ],
      sertifikalar: [
        {
          ad: 'Su Dağıtım ve İsale Hatları Montaj ve Bakım Operatörü (Seviye 4)',
          kurum: 'Mesleki Yeterlilik Kurumu (MYK)',
          tarih: '20.08.2021',
          no: 'MYK-SU-2021/8802',
        },
        {
          ad: 'İş Sağlığı ve Güvenliği: Kapalı Alanda Çalışma & Gaz Ölçümü',
          kurum: 'İBB İSG Şube Müdürlüğü',
          tarih: '15.01.2025',
          no: 'ISG-IBB-2025/104',
        },
      ],
      oduller: [
        {
          tur: 'TİS İkramiyesi ve Teşvik',
          gerekce: 'Gece Su Patlağı Acil Müdahale ve Kesinti Önleme Başarısı',
          makam: 'Daire Başkanlığı',
          tarih: '12.03.2025',
        },
      ],
    },
  },
]

// Örnek 6245 Sayılı Harcırah ve Görevlendirme Verileri
const INITIAL_TRAVEL_ORDERS = [
  {
    onayNo: 'GRV-2026/041',
    personel: 'Selin Yılmaz',
    gorevYeri: 'Ankara -> İzmir (KİK Eğitimi)',
    tarihAraligi: '10.11.2026 - 13.11.2026 (4 Gün)',
    yevmiyeTutari: '3.400,00 ₺',
    ulasimTutari: '4.800,00 ₺ (Uçak/Hızlı Tren)',
    toplamHarcirah: '8.200,00 ₺',
    durum: 'Onaylandı (Harcama Yetkilisi)',
  },
  {
    onayNo: 'GRV-2026/039',
    personel: 'Mehmet Demir & Abdulkadir İlci',
    gorevYeri: 'İlçe Şantiyeleri Yerinde Muayene',
    tarihAraligi: '03.11.2026 - 04.11.2026 (2 Gün)',
    yevmiyeTutari: '1.700,00 ₺',
    ulasimTutari: 'Kurum Aracı',
    toplamHarcirah: '1.700,00 ₺',
    durum: 'Ödendi (MİF No: 2026/89)',
  },
]

function PersonelTakibiContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'ozluk' | 'puantaj' | 'harcirah' | 'terfi'>('ozluk')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<StaffDetail | null>(null)
  const [modalTab, setModalTab] = useState<'ozluk' | 'hizmet' | 'izin' | 'harcirah' | 'egitim'>('ozluk')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'ozluk' || tab === 'puantaj' || tab === 'harcirah' || tab === 'terfi') {
      setActiveTab(tab)
    }
  }, [searchParams])

  // ESC tuşu ile modal kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedStaff(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredStaff = INITIAL_STAFF.filter(
    (s) =>
      s.adSoyad.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.birim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.unvan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePrintServiceDocument = () => {
    window.print()
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* ÜST BAŞLIK */}
      <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-xs">
              <Users className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#0f172a]">
                  İnsan Kaynakları & Personel Yönetimi (İK 360)
                </h1>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                  657 & 4857 Uyumlu
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                Memur, sözleşmeli ve işçi özlük dosyaları, SGK HİTAP hizmet dökümü, puantaj/izin ve 6245 Sayılı Harcırah süreçleri.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (INITIAL_STAFF.length > 0) {
                  setSelectedStaff(INITIAL_STAFF[0])
                  setModalTab('ozluk')
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
            >
              <Eye className="size-3.5" />
              Örnek Özlük Dosyası İncele
            </button>
            <button
              onClick={() => alert('Yeni Personel Özlük Kartı Oluşturma Formu Açılıyor...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              <Plus className="size-3.5" />
              Yeni Personel Ekle
            </button>
          </div>
        </div>

        {/* METRİKLER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Toplam Personel</div>
            <div className="text-lg font-bold text-[#0f172a] mt-0.5">384 Kişi</div>
            <div className="text-[10px] text-indigo-600 font-medium mt-0.5">142 Memur • 242 İşçi</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Bugün Görevde Olan</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">368 Kişi</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">%95.8 Fiilî Mesai</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">İzinde / Raporda</div>
            <div className="text-lg font-bold text-amber-600 mt-0.5">16 Kişi</div>
            <div className="text-[10px] text-[#64748b] mt-0.5">11 Yıllık İzin • 5 Raporlu</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Geçici Görevli (6245)</div>
            <div className="text-lg font-bold text-sky-700 mt-0.5">5 Kişi</div>
            <div className="text-[10px] text-sky-600 font-medium mt-0.5">Saha ve Eğitim Görevi</div>
          </div>
        </div>

        {/* SEKME MENÜSÜ */}
        <div className="flex items-center gap-2 mt-4 border-b border-[#e2e8f0]">
          <button
            onClick={() => setActiveTab('ozluk')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'ozluk'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <UserCheck className="size-4" />
            Özlük & Sicil Yönetimi
          </button>
          <button
            onClick={() => setActiveTab('puantaj')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'puantaj'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Clock className="size-4" />
            Puantaj & Mesai
          </button>
          <button
            onClick={() => setActiveTab('harcirah')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'harcirah'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Briefcase className="size-4" />
            Yolluk & Harcırah (6245)
          </button>
          <button
            onClick={() => setActiveTab('terfi')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'terfi'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Award className="size-4" />
            Terfi & İntibak Masası
          </button>
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="p-6 space-y-6">
        {/* SEKME 1: ÖZLÜK & SİCİL */}
        {activeTab === 'ozluk' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
            {/* Arama ve Filtre */}
            <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[280px] max-w-md">
                <Search className="size-4 text-[#94a3b8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Personel adı, unvanı, birimi veya sicil no ile ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Personel Özlük Listesi Dışa Aktarılıyor...')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] hover:text-[#0f172a] border border-[#cbd5e1] rounded-lg hover:bg-slate-50 transition"
                >
                  <Download className="size-3.5" />
                  Excel / PDF Aktar
                </button>
              </div>
            </div>

            {/* Personel Tablosu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Sicil No / ID</th>
                    <th className="py-3 px-4">Adı Soyadı & TC Kimlik</th>
                    <th className="py-3 px-4">Statü</th>
                    <th className="py-3 px-4">Bağlı Birim & Daire</th>
                    <th className="py-3 px-4">Kadro & Görev</th>
                    <th className="py-3 px-4">Kalan Yıllık İzin</th>
                    <th className="py-3 px-4">Çalışma Durumu</th>
                    <th className="py-3 px-4 text-right">Özlük İşlemleri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-[#f8fafc] transition group">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-900">{staff.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#0f172a]">{staff.adSoyad}</div>
                        <div className="text-[10px] text-[#64748b] font-mono">{staff.tcKimlik}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-[#334155] rounded-md border border-slate-200">
                          {staff.statu}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#334155]">{staff.birim}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#0f172a]">{staff.unvan}</div>
                        <div className="text-[10px] text-indigo-600 font-semibold">{staff.gorev}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#0f172a]">{staff.kalanIzin}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                            staff.durum.includes('İzinde')
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {staff.durum}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedStaff(staff)
                            setModalTab('ozluk')
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs"
                          title={`${staff.adSoyad} Resmî Özlük Dosyası & Hizmet Dökümünü Görüntüle`}
                        >
                          <Eye className="size-3.5" />
                          <span>Özlük & Hizmet Dökümü</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 2: PUANTAJ & İZİN */}
        {activeTab === 'puantaj' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-[#0f172a]">Aylık Personel Puantaj Cetveli (Kasım 2026)</h2>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Turnike entegrasyonu, kartlı geçiş kayıtları, fazla mesai ve yıllık/mazeret izin hak edişleri.
                </p>
              </div>
              <button
                onClick={() => alert('Puantaj onaylanarak Muhasebeye (MİF/Bordro) aktarılıyor...')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs"
              >
                Puantajı Onayla & MİF&apos;e Gönder
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold">Çalışılan İş Günü</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">22 Gün</div>
                <div className="text-[10px] text-slate-500 mt-0.5">176 Net Çalışma Saati</div>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200">
                <div className="text-[11px] text-indigo-700 font-semibold">Toplam Tahakkuk Eden Fazla Mesai</div>
                <div className="text-2xl font-bold text-indigo-900 mt-1">148 Saat</div>
                <div className="text-[10px] text-indigo-600 mt-0.5">Bordroya Yansıtılacak Tutar: 48.250,00 ₺</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <div className="text-[11px] text-emerald-700 font-semibold">Genel Katılım & Devam Oranı</div>
                <div className="text-2xl font-bold text-emerald-800 mt-1">%97.2</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Mazeretli Eksik Gün: 11 Gün</div>
              </div>
            </div>
          </div>
        )}

        {/* SEKME 3: HARCIRAH & GÖREVLENDİRME */}
        {activeTab === 'harcirah' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0f172a]">6245 Sayılı Harcırah Kanunu Geçici Görev Dosyaları</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Yevmiye, konaklama, yol gideri hesaplamaları ve otomatik Harcırah Beyannamesi</p>
              </div>
              <button
                onClick={() => alert('Yeni 6245 Sayılı Geçici Görev Onayı Hazırlanıyor...')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
              >
                + Yeni Görev Onayı
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Onay No</th>
                    <th className="py-3 px-4">Görevlendirilen Personel</th>
                    <th className="py-3 px-4">Görev Yeri & Amacı</th>
                    <th className="py-3 px-4">Tarih Aralığı</th>
                    <th className="py-3 px-4">Hesaplanan Yevmiye</th>
                    <th className="py-3 px-4">Ulaşım Gideri</th>
                    <th className="py-3 px-4">Toplam Harcırah</th>
                    <th className="py-3 px-4">Onay Durumu</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {INITIAL_TRAVEL_ORDERS.map((t) => (
                    <tr key={t.onayNo} className="hover:bg-[#f8fafc] transition">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-900">{t.onayNo}</td>
                      <td className="py-3 px-4 font-semibold text-[#0f172a]">{t.personel}</td>
                      <td className="py-3 px-4 text-[#334155]">{t.gorevYeri}</td>
                      <td className="py-3 px-4 text-[#475569]">{t.tarihAraligi}</td>
                      <td className="py-3 px-4 font-mono">{t.yevmiyeTutari}</td>
                      <td className="py-3 px-4 font-mono">{t.ulasimTutari}</td>
                      <td className="py-3 px-4 font-bold text-indigo-800 font-mono">{t.toplamHarcirah}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                          {t.durum}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`${t.onayNo} Harcırah Beyannamesi Matbu Çıktısı Hazırlanıyor...`)}
                          className="px-2.5 py-1 text-xs text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-md transition font-medium"
                        >
                          Beyanname Yazdır
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 4: KADEME & TERFİ */}
        {activeTab === 'terfi' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#0f172a]">657 Memur Kademe & Derece İlerleme Takip Masası</h2>
            <p className="text-xs text-[#64748b] mt-1">
              Yıllık kıdem, hizmet puanı, yeşil pasaport hak edişi ve 8 yıllık olumlu sicil kademe ilerlemeleri.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DETAY MODAL: RESMÎ PERSONEL ÖZLÜK KARTI & HİTAP HİZMET DÖKÜMÜ           */}
      {/* ========================================================================= */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-[#cbd5e1] overflow-hidden flex flex-col max-h-[92vh]">
            {/* 1. MODAL RESMÎ BAŞLIK ŞERİDİ */}
            <div className="bg-gradient-to-r from-[#0b1329] via-[#16213b] to-[#1e3a8a] text-white p-5 border-b border-[#253858] shrink-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar / Personel Fotoğraf Çerçevesi */}
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center text-white text-lg font-black shadow-lg ring-4 ring-white/10 shrink-0">
                    {selectedStaff.adSoyad
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-black tracking-wide text-white">
                        {selectedStaff.adSoyad}
                      </h2>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {selectedStaff.statu}
                      </span>
                      <span className="px-2 py-0.5 text-[9.5px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {selectedStaff.durum}
                      </span>
                    </div>

                    <p className="text-xs text-blue-200/90 mt-0.5">
                      {selectedStaff.birim} • <span className="font-semibold text-white">{selectedStaff.unvan}</span> ({selectedStaff.gorev})
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-[10.5px] text-slate-300 font-mono">
                      <span>Sicil No: <strong className="text-white font-bold">{selectedStaff.kadro.sicilNo}</strong></span>
                      <span>•</span>
                      <span>T.C. Kimlik: <strong className="text-white">{selectedStaff.tcKimlik}</strong></span>
                      <span>•</span>
                      <span>Kadro: <strong className="text-amber-300">{selectedStaff.kadro.kadroDerece}/{selectedStaff.kadro.kadroKademe} ({selectedStaff.kadro.ekGosterge} Ek Gös.)</strong></span>
                    </div>
                  </div>
                </div>

                {/* Aksiyon Butonları */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintServiceDocument}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition shadow-xs"
                    title="A4 Resmî Hizmet Belgesini Yazdır"
                  >
                    <Printer className="size-3.5 text-blue-300" />
                    <span>Hizmet Belgesi Yazdır</span>
                  </button>
                  <button
                    onClick={() => setSelectedStaff(null)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                    title="Kapat (ESC)"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Modal İç Sekmeleri */}
              <div className="flex items-center gap-1 mt-5 border-t border-white/10 pt-3">
                <button
                  onClick={() => setModalTab('ozluk')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    modalTab === 'ozluk'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <UserCheck className="size-3.5" />
                  <span>Genel Özlük & Kadro</span>
                </button>

                <button
                  onClick={() => setModalTab('hizmet')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    modalTab === 'hizmet'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Clock className="size-3.5" />
                  <span>HİTAP Hizmet Cetveli</span>
                </button>

                <button
                  onClick={() => setModalTab('izin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    modalTab === 'izin'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Calendar className="size-3.5" />
                  <span>İzin & Mazeret Takibi</span>
                </button>

                <button
                  onClick={() => setModalTab('harcirah')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    modalTab === 'harcirah'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Plane className="size-3.5" />
                  <span>6245 Sayılı Harcırahlar</span>
                </button>

                <button
                  onClick={() => setModalTab('egitim')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    modalTab === 'egitim'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Award className="size-3.5" />
                  <span>Eğitim, Belge & Ödüller</span>
                </button>
              </div>
            </div>

            {/* 2. MODAL İÇERİK GÖV значESİ */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] space-y-6">
              {/* TAB 1: GENEL ÖZLÜK & KADRO */}
              {modalTab === 'ozluk' && (
                <div className="space-y-5">
                  {/* Resmî Kurum Künyesi */}
                  <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f1f5f9]">
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-indigo-600" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                          Kadro ve Memuriyet Bilgileri (657 / HİTAP)
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                        Fiilî Hizmet Süresi: {selectedStaff.kadro.fiiliHizmet}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Kurum Sicil Numarası</span>
                        <span className="font-bold font-mono text-[#0f172a] text-sm">{selectedStaff.kadro.sicilNo}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">İstihdam Türü / Statü</span>
                        <span className="font-bold text-[#0f172a]">{selectedStaff.statu}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Kazanılmış Hak Aylığı</span>
                        <span className="font-bold font-mono text-indigo-700">{selectedStaff.kadro.kazanilmisHak}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Ek Gösterge</span>
                        <span className="font-bold font-mono text-emerald-700">{selectedStaff.kadro.ekGosterge}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Memuriyete / İşe Başlama</span>
                        <span className="font-semibold text-[#0f172a]">{selectedStaff.girisTarihi}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Öngörülen Emeklilik Tarihi</span>
                        <span className="font-semibold text-[#0f172a]">{selectedStaff.kadro.emeklilikTarihi}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Sendika Üyeliği</span>
                        <span className="font-semibold text-[#0f172a]">{selectedStaff.kadro.sendika}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Maaş IBAN Hesabı</span>
                        <span className="font-mono text-[10px] text-[#475569]">{selectedStaff.kadro.iban}</span>
                      </div>
                    </div>
                  </div>

                  {/* Nüfus & Kimlik Bilgileri */}
                  <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f1f5f9]">
                      <UserCheck className="size-4 text-blue-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                        Nüfus ve Şahsi Kimlik Bilgileri (MERNİS Uyumlu)
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">T.C. Kimlik No</span>
                        <span className="font-bold font-mono text-[#0f172a]">{selectedStaff.tcKimlik}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Doğum Yeri / Tarihi</span>
                        <span className="font-semibold text-[#0f172a]">{selectedStaff.kimlik.dogumYeri} • {selectedStaff.kimlik.dogumTarihi}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Ana / Baba Adı</span>
                        <span className="font-semibold text-[#0f172a]">{selectedStaff.kimlik.anaAdi} / {selectedStaff.kimlik.babaAdi}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Kan Grubu</span>
                        <span className="font-bold text-rose-600">{selectedStaff.kimlik.kanGrubu}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Medeni Hali</span>
                        <span className="font-semibold text-[#0f172a]">{selectedStaff.kimlik.medeniHal}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Askerlik Durumu</span>
                        <span className="font-semibold text-[#0f172a]">{selectedStaff.kimlik.askerlik}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">Kurumsal E-Posta</span>
                        <span className="font-semibold text-blue-600">{selectedStaff.kimlik.eposta}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[10.5px]">İletişim Telefonu</span>
                        <span className="font-semibold text-[#0f172a]">{selectedStaff.kimlik.telefon}</span>
                      </div>
                      <div className="col-span-2 md:col-span-4 pt-2 border-t border-[#f1f5f9]">
                        <span className="text-[#64748b] block text-[10.5px]">İkametgâh Adresi</span>
                        <span className="font-medium text-[#334155]">{selectedStaff.kimlik.adres}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HİTAP HİZMET CETVELİ (KARİYER & ATAMALAR) */}
              {modalTab === 'hizmet' && (
                <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                    <div>
                      <h3 className="text-sm font-bold text-[#0f172a]">
                        SGK HİTAP Resmî Hizmet Cetveli ve Atama Kararları
                      </h3>
                      <p className="text-xs text-[#64748b]">
                        Personelin memuriyete girişinden bugüne kadar olan kadro terfileri, unvan ve yer değişiklikleri kronolojisi.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
                      Toplam Fiili Hizmet: {selectedStaff.kadro.fiiliHizmet}
                    </span>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#cbd5e1]">
                    {selectedStaff.hizmetGecmisi.map((hizmet, idx) => (
                      <div key={idx} className="relative group">
                        {/* Nokta / Pin */}
                        <div className="absolute -left-6 top-1.5 size-3 rounded-full bg-indigo-600 ring-4 ring-white" />

                        <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] hover:border-indigo-300 transition">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold text-indigo-900 font-mono">
                              {hizmet.tarihAraligi}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-white text-indigo-700 border border-indigo-200 rounded">
                              {hizmet.unvan}
                            </span>
                          </div>

                          <div className="text-sm font-bold text-[#0f172a]">{hizmet.kurumBirim}</div>
                          <div className="text-xs text-[#64748b] mt-1 italic">Dayanak: {hizmet.dayanak}</div>
                          <div className="text-xs text-[#334155] mt-1 font-medium bg-white p-2.5 rounded-lg border border-[#e2e8f0]">
                            {hizmet.aciklama}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: İZİN & MAZERET TAKİBİ */}
              {modalTab === 'izin' && (
                <div className="space-y-5">
                  {/* İzin Bakiye Kartları */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs">
                      <div className="text-xs text-[#64748b] font-medium">2026 Cari İzin Hakkı</div>
                      <div className="text-2xl font-bold text-[#0f172a] mt-1">
                        {selectedStaff.izinKayitlari.cariHak} Gün
                      </div>
                      <div className="text-[10px] text-[#64748b] mt-0.5">Yasal Hak (657/102)</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs">
                      <div className="text-xs text-[#64748b] font-medium">2025&apos;ten Devreden</div>
                      <div className="text-2xl font-bold text-slate-700 mt-1">
                        {selectedStaff.izinKayitlari.devreden} Gün
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Önceki Yıl Bakiyesi</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs">
                      <div className="text-xs text-rose-600 font-medium">Kullanılan İzin</div>
                      <div className="text-2xl font-bold text-rose-600 mt-1">
                        {selectedStaff.izinKayitlari.kullanilan} Gün
                      </div>
                      <div className="text-[10px] text-rose-500 mt-0.5">Düşülen İzinler</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-emerald-300 shadow-xs bg-emerald-50/40">
                      <div className="text-xs text-emerald-800 font-bold">Kalan Kullanılabilir İzin</div>
                      <div className="text-2xl font-black text-emerald-700 mt-1">
                        {selectedStaff.izinKayitlari.kalan} Gün
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Mevcut İzin Bakiyesi</div>
                    </div>
                  </div>

                  {/* İzin Geçmişi Tablosu */}
                  <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-[#e2e8f0]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                        Son İzin ve Mazeret Hareketleri
                      </h4>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] text-[10px] uppercase font-semibold">
                        <tr>
                          <th className="py-2.5 px-4">İzin Türü</th>
                          <th className="py-2.5 px-4">Başlangıç</th>
                          <th className="py-2.5 px-4">Bitiş</th>
                          <th className="py-2.5 px-4">Süre</th>
                          <th className="py-2.5 px-4">Onaylayan Makam</th>
                          <th className="py-2.5 px-4 text-right">Durum</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9]">
                        {selectedStaff.izinKayitlari.gecmis.map((iz, i) => (
                          <tr key={i} className="hover:bg-[#f8fafc]">
                            <td className="py-3 px-4 font-bold text-[#0f172a]">{iz.tur}</td>
                            <td className="py-3 px-4 font-mono">{iz.baslangic}</td>
                            <td className="py-3 px-4 font-mono">{iz.bitis}</td>
                            <td className="py-3 px-4 font-bold text-indigo-700">{iz.gun} Gün</td>
                            <td className="py-3 px-4 text-[#475569]">{iz.onayci}</td>
                            <td className="py-3 px-4 text-right">
                              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                                {iz.durum}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: 6245 SAYILI HARCIRAH & GEÇİCİ GÖREVLER */}
              {modalTab === 'harcirah' && (
                <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden space-y-4 p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                    <div>
                      <h3 className="text-sm font-bold text-[#0f172a]">
                        6245 Sayılı Harcırah Kanunu Geçici Görev ve Yolluk Dosyaları
                      </h3>
                      <p className="text-xs text-[#64748b]">
                        Personel adına düzenlenen resmî görevlendirme onayları ve tahakkuk eden yevmiye/yol giderleri.
                      </p>
                    </div>
                  </div>

                  {selectedStaff.harcirahlar.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#64748b] bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                      Bu personele ait kayıtlı 6245 Sayılı Harcırah veya geçici görevlendirme dosyası bulunmamaktadır.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] text-[10px] uppercase font-semibold">
                        <tr>
                          <th className="py-2.5 px-4">Onay Numarası</th>
                          <th className="py-2.5 px-4">Görev Yeri ve Amacı</th>
                          <th className="py-2.5 px-4">Tarih Aralığı</th>
                          <th className="py-2.5 px-4">Toplam Tutar</th>
                          <th className="py-2.5 px-4 text-right">Tahakkuk Durumu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9]">
                        {selectedStaff.harcirahlar.map((h, i) => (
                          <tr key={i} className="hover:bg-[#f8fafc]">
                            <td className="py-3 px-4 font-mono font-bold text-indigo-900">{h.onayNo}</td>
                            <td className="py-3 px-4 font-medium text-[#0f172a]">{h.gorevYeri}</td>
                            <td className="py-3 px-4 font-mono text-[#475569]">{h.tarih}</td>
                            <td className="py-3 px-4 font-bold font-mono text-indigo-800">{h.tutar}</td>
                            <td className="py-3 px-4 text-right">
                              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                                {h.durum}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB 5: EĞİTİM, SERTİFİKALAR & ÖDÜLLER */}
              {modalTab === 'egitim' && (
                <div className="space-y-5">
                  {/* Öğrenim Bilgileri */}
                  <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#f1f5f9]">
                      <GraduationCap className="size-4 text-indigo-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                        Mezuniyet ve Öğrenim Durumu
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedStaff.egitimBelgeler.ogrenim.map((og, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                          <span className="px-2 py-0.5 text-[9.5px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {og.seviye}
                          </span>
                          <div className="text-xs font-bold text-[#0f172a] mt-1.5">{og.okul}</div>
                          <div className="text-xs text-[#475569] font-medium">{og.bolum}</div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#e2e8f0] text-[10.5px] text-[#64748b]">
                            <span>Dönem: {og.yil}</span>
                            <span className="font-semibold text-indigo-900">{og.derece}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sertifikalar */}
                  <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#f1f5f9]">
                      <ShieldCheck className="size-4 text-emerald-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                        Mesleki Sertifikalar & Uzmanlık Belgeleri
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {selectedStaff.egitimBelgeler.sertifikalar.map((sert, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                          <div>
                            <div className="text-xs font-bold text-[#0f172a]">{sert.ad}</div>
                            <div className="text-[11px] text-[#64748b]">Veren Kurum: {sert.kurum} • Belge No: <span className="font-mono">{sert.no}</span></div>
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-slate-700 bg-white px-2 py-1 rounded border border-[#e2e8f0]">
                            {sert.tarih}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Başarı & Ödüller */}
                  <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#f1f5f9]">
                      <Award className="size-4 text-amber-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                        Taltif, Başarı Belgeleri & Ödüller
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {selectedStaff.egitimBelgeler.oduller.map((odul, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/80">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-900">{odul.tur}</span>
                            <span className="text-[10.5px] font-mono text-amber-800">{odul.tarih}</span>
                          </div>
                          <p className="text-xs text-[#334155] mt-1 italic">&ldquo;{odul.gerekce}&rdquo;</p>
                          <div className="text-[10px] text-amber-800 font-semibold mt-1">Veren Makam: {odul.makam}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. MODAL ALT BİLGİ VE YAZDIRMA ŞERİDİ */}
            <div className="bg-white p-4 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-[#64748b]">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Bu özlük kartı 657 Sayılı DMK ve SGK HİTAP veri tabanı ile tam senkronizedir.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintServiceDocument}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
                >
                  <Printer className="size-4" />
                  <span>Resmî Hizmet Belgesini Yazdır</span>
                </button>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#475569] hover:text-[#0f172a] bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PersonelTakibiPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-500">Personel & İK Modülü Yükleniyor...</div>}>
      <PersonelTakibiContent />
    </Suspense>
  )
}
