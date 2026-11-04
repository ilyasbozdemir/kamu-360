'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BrandLogo } from '@/components/ui/brand-logo'
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileSignature,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Grid3X3,
  HelpCircle,
  LayoutDashboard,
  Layers,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Printer,
  Save,
  Scale,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Table,
  Users,
  X,
  CheckCircle2,
  Compass,
  Droplets,
  Gauge,
  Coins,
  Briefcase,
  Award,
  MapPin,
  Package,
} from 'lucide-react'

export type ModuleKey = 'all' | 'ihale_satin_alma' | 'cbs_arazi_su' | 'personel_ik' | 'bkmybs_mali'

export interface ModuleConfig {
  key: ModuleKey
  name: string
  shortName: string
  icon: any
  badge: string
  color: string
  borderColor: string
  bgLight: string
  textColor: string
  description: string
}

export const MODULE_CONFIGS: Record<ModuleKey, ModuleConfig> = {
  all: {
    key: 'all',
    name: 'Tüm Modüller (360° Portal)',
    shortName: 'Tüm Modüller (360°)',
    icon: Sparkles,
    badge: '360°',
    color: '#4078ea',
    borderColor: '#3b82f6',
    bgLight: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    description: 'Tüm ihale, CBS, personel ve mali süreçler tek ekranda.',
  },
  ihale_satin_alma: {
    key: 'ihale_satin_alma',
    name: 'İhale & Satın Alma Yönetimi',
    shortName: 'İhale & Satın Alma',
    icon: Star,
    badge: '4734 / 2886',
    color: '#2563eb',
    borderColor: '#2563eb',
    bgLight: 'bg-sky-500/10',
    textColor: 'text-sky-400',
    description: 'Doğrudan temin (22/d), 4734 ihale süreci ve 2886 gelir ihaleleri.',
  },
  cbs_arazi_su: {
    key: 'cbs_arazi_su',
    name: 'CBS, Arazi & Su Altyapı',
    shortName: 'CBS, Arazi & Su',
    icon: Compass,
    badge: 'Harita / Su',
    color: '#10b981',
    borderColor: '#10b981',
    bgLight: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    description: 'Ada/parsel kadastro sorgusu, kamu mülkiyeti, su şebekesi & sayaç.',
  },
  personel_ik: {
    key: 'personel_ik',
    name: 'Personel & İK 360',
    shortName: 'Personel & İK 360',
    icon: Users,
    badge: '657 / 4857',
    color: '#6366f1',
    borderColor: '#6366f1',
    bgLight: 'bg-indigo-500/10',
    textColor: 'text-indigo-400',
    description: 'Özlük dosyaları, puantaj/izin, 6245 harcırah ve geçici görev onayları.',
  },
  bkmybs_mali: {
    key: 'bkmybs_mali',
    name: 'BKMYBS & Mali Yönetim',
    shortName: 'BKMYBS & Bütçe',
    icon: Coins,
    badge: '5018 / MİF',
    color: '#f59e0b',
    borderColor: '#f59e0b',
    bgLight: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    description: 'Analitik bütçe tertipleri, ödenek kontrolü, MİF, ÖEB ve TKYS taşınır mal.',
  },
}

export interface NavSubItem {
  icon?: any
  label: string
  shortLabel?: string
  href: string
  badge?: string
  sectionTitle?: string
}

export interface NavItem {
  icon: any
  label: string
  shortLabel: string
  href: string
  exact?: boolean
  isProcurement?: boolean
  prefix?: string
  badge?: string
  modules?: ModuleKey[]
  children?: NavSubItem[]
}

export const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Ana Sayfa (Dashboard)',
    shortLabel: 'Dashboard',
    href: '/',
    exact: true,
    modules: ['all', 'ihale_satin_alma', 'cbs_arazi_su', 'personel_ik', 'bkmybs_mali'],
  },
  {
    icon: Star,
    label: 'Satın Alma Yönetimi (4734 & DT)',
    shortLabel: 'Satın Alma (4734)',
    href: '/malzeme-bilgisi',
    isProcurement: true,
    badge: 'Gider',
    modules: ['all', 'ihale_satin_alma'],
    children: [
      {
        icon: FolderOpen,
        label: 'Doğrudan Temin Dosya Listesi (22/d Masası)',
        shortLabel: '22/d Dosya Listesi & Masası',
        href: '/temin-dosyasi',
        badge: '22/d',
        sectionTitle: 'Doğrudan Temin (22/d)',
      },
      {
        icon: FileText,
        label: 'Piyasa Araştırma Tutanağı (22/d)',
        shortLabel: 'Piyasa Tutanağı (22/d)',
        href: '/dogrudan-temin',
        badge: 'Tutanak',
      },
      {
        icon: Star,
        label: '1. Malzeme Satın Alma Bilgisi',
        shortLabel: '1. Malzeme Bilgisi',
        href: '/malzeme-bilgisi',
        sectionTitle: '4734 İhale & Satın Alma Süreci',
      },
      {
        icon: Layers,
        label: '2. Teklif Değerlendirme & Matris',
        shortLabel: '2. Teklif Matrisi',
        href: '/teklif-degerlendirme',
      },
      {
        icon: FolderOpen,
        label: '3. İhale Dosyası & Şartname (Açık/Pazarlık)',
        shortLabel: '3. İhale Dosyası',
        href: '/ihale-dosyasi',
      },
      {
        icon: FileSignature,
        label: '4. Kesin Satın Alma Sözleşmesi',
        shortLabel: '4. Sözleşme Yönetimi',
        href: '/sozlesme',
      },
    ],
  },
  {
    icon: Scale,
    label: 'Gelir Yönetimi (2886 & Kiralama)',
    shortLabel: 'Gelirler (2886)',
    href: '/gelir-ihaleleri/dosya-tanimi',
    prefix: '/gelir-ihaleleri',
    badge: 'Gelir',
    modules: ['all', 'ihale_satin_alma', 'cbs_arazi_su'],
    children: [
      {
        icon: Table,
        label: '2886 Gelir İhaleleri Listesi',
        shortLabel: 'İhale Listesi & Dosyalar',
        href: '/gelir-ihaleleri/dosya-tanimi?view=liste',
        badge: 'Liste',
        sectionTitle: '2886 İhale Dosyaları',
      },
      {
        icon: FileSpreadsheet,
        label: '1. Dosya & Muhammen Bedel',
        shortLabel: '1. Dosya & Bedel',
        href: '/gelir-ihaleleri/dosya-tanimi',
        sectionTitle: 'İhale Aşamaları',
      },
      {
        icon: Scale,
        label: '2. İhale Usulü & Açık Artırma',
        shortLabel: '2. Açık Artırma',
        href: '/gelir-ihaleleri/ihale-usulu-acik-artirma',
      },
      {
        icon: FileText,
        label: '3. Komisyon İhale Kararı',
        shortLabel: '3. Komisyon Kararı',
        href: '/gelir-ihaleleri/komisyon-karari',
      },
      {
        icon: FileSignature,
        label: '4. Sözleşme & Tahsilat Planı',
        shortLabel: '4. Sözleşme & Tahsilat',
        href: '/gelir-ihaleleri/sozlesme-tahsilat',
      },
      {
        icon: Building2,
        label: '5. Belediye Taşınmaz & Varlık',
        shortLabel: '5. Varlık Envanteri',
        href: '/gelir-ihaleleri/varlik-envanteri',
      },
    ],
  },
  {
    icon: Compass,
    label: 'CBS, Arazi & Su Altyapı Yönetimi',
    shortLabel: 'CBS, Arazi & Su',
    href: '/harita-altyapi',
    prefix: '/harita-altyapi',
    badge: 'CBS/Su',
    modules: ['all', 'cbs_arazi_su'],
    children: [
      {
        icon: Compass,
        label: '1. Canlı CBS Harita Katmanı',
        shortLabel: '1. CBS Canlı Harita',
        href: '/harita-altyapi',
        sectionTitle: 'Harita & Altyapı Katmanları',
      },
      {
        icon: Building2,
        label: '2. Arazi & Parsel Mülkiyet Takibi',
        shortLabel: '2. Arazi & Parsel',
        href: '/harita-altyapi',
      },
      {
        icon: Droplets,
        label: '3. Su Şebekesi & İsale Hatları',
        shortLabel: '3. Su Şebekesi',
        href: '/harita-altyapi',
      },
      {
        icon: Gauge,
        label: '4. Sayaç & Abone Yönetimi',
        shortLabel: '4. Sayaç & Abone',
        href: '/harita-altyapi',
      },
      {
        icon: Table,
        label: '5. Belediye Taşınmaz Envanteri',
        shortLabel: '5. Taşınmaz Listesi',
        href: '/gelir-ihaleleri/varlik-envanteri',
      },
    ],
  },
  {
    icon: Users,
    label: 'Personel & İK Yönetimi (İK 360)',
    shortLabel: 'Personel & İK 360',
    href: '/personel-takibi',
    prefix: '/personel-takibi',
    badge: 'İK 360',
    modules: ['all', 'personel_ik'],
    children: [
      {
        icon: Users,
        label: '1. Personel Özlük & Sicil Listesi',
        shortLabel: '1. Özlük & Sicil',
        href: '/personel-takibi',
        sectionTitle: '657 & 4857 Özlük Masası',
      },
      {
        icon: FileText,
        label: '2. Puantaj & İzin Masası',
        shortLabel: '2. Puantaj & İzin',
        href: '/personel-takibi',
      },
      {
        icon: Briefcase,
        label: '3. Görevlendirme & Harcırah (6245)',
        shortLabel: '3. Harcırah & Görev',
        href: '/personel-takibi',
        badge: '6245',
      },
      {
        icon: Award,
        label: '4. Kademe, Terfi & Disiplin',
        shortLabel: '4. Terfi & Disiplin',
        href: '/personel-takibi',
      },
      {
        icon: Network,
        label: '5. EBYS Dağıtım & Onay Rotaları',
        shortLabel: '5. Onay Rotaları',
        href: '/is-akislari',
      },
    ],
  },
  {
    icon: Coins,
    label: 'BKMYBS & Mali Yönetim (5018)',
    shortLabel: 'BKMYBS / Bütçe',
    href: '/bkmybs-mali-yonetim',
    prefix: '/bkmybs-mali-yonetim',
    badge: '5018 MİF',
    modules: ['all', 'bkmybs_mali'],
    children: [
      {
        icon: Coins,
        label: '1. Analitik Bütçe Kodları & Ödenek',
        shortLabel: '1. Analitik Bütçe',
        href: '/bkmybs-mali-yonetim',
        sectionTitle: '5018 Mali İşlemler',
      },
      {
        icon: FileSpreadsheet,
        label: '2. MİF & Ödeme Emri Belgesi (ÖEB)',
        shortLabel: '2. MİF & Ödeme Emri',
        href: '/bkmybs-mali-yonetim',
        badge: 'ÖEB',
      },
      {
        icon: Package,
        label: '3. TKYS Taşınır Mal Yönetimi & Zimmet',
        shortLabel: '3. TKYS Taşınır Mal',
        href: '/bkmybs-mali-yonetim',
        badge: 'TİF',
      },
      {
        icon: ShieldCheck,
        label: '4. Emanetler & Teminat Mektupları',
        shortLabel: '4. Teminat Mektubu',
        href: '/bkmybs-mali-yonetim',
      },
      {
        icon: FileSignature,
        label: '5. 4734 Harcama Sözleşmeleri',
        shortLabel: '5. Satın Alma Sözleşmesi',
        href: '/sozlesme',
      },
    ],
  },
  {
    icon: Grid3X3,
    label: 'Raporlar ve Analitik',
    shortLabel: 'Raporlar',
    href: '/raporlar',
    prefix: '/raporlar',
    modules: ['all', 'ihale_satin_alma', 'cbs_arazi_su', 'personel_ik', 'bkmybs_mali'],
  },
  {
    icon: Network,
    label: 'Rota & İş Akışları (EBYS)',
    shortLabel: 'İş Akışları',
    href: '/is-akislari',
    prefix: '/is-akislari',
    modules: ['all', 'ihale_satin_alma', 'personel_ik'],
  },
  {
    icon: FileSignature,
    label: 'EBYS Belge Stüdyosu',
    shortLabel: 'Belge Stüdyosu',
    href: '/belge-builder',
    prefix: '/belge-builder',
    badge: 'EBYS',
    modules: ['all', 'ihale_satin_alma', 'cbs_arazi_su', 'personel_ik', 'bkmybs_mali'],
  },
  {
    icon: Printer,
    label: 'Yazdırma & Dışa Aktarma',
    shortLabel: 'Yazdırma Merkezi',
    href: '/yazdirma-merkezi',
    prefix: '/yazdirma-merkezi',
    modules: ['all', 'ihale_satin_alma', 'cbs_arazi_su', 'personel_ik', 'bkmybs_mali'],
  },
  {
    icon: Settings,
    label: 'Sistem Ayarları',
    shortLabel: 'Ayarlar',
    href: '/sistem-ayarlari',
    prefix: '/sistem-ayarlari',
    modules: ['all', 'ihale_satin_alma', 'cbs_arazi_su', 'personel_ik', 'bkmybs_mali'],
  },
]

interface SidebarProps {
  menuOpen: boolean
  onCloseMenu: () => void
}

export function Sidebar({ menuOpen, onCloseMenu }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isKurumModalOpen, setIsKurumModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<ModuleKey>('all')
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false)

  // Kurum Bilgileri State'i (LocalStorage destekli)
  const [kurumInfo, setKurumInfo] = useState({
    kurumAdi: 'T.C. İSTANBUL BÜYÜKŞEHİR BELEDİYESİ',
    daireBaskanligi: 'Destek Hizmetleri Dairesi Başkanlığı',
    subeMudurlugu: 'Satın Alma Şube Müdürlüğü',
    harcamaYetkilisi: 'Ahmet Yılmaz',
    harcamaYetkilisiUnvan: 'Destek Hizmetleri Daire Başkanı',
    gerceklestirmeGorevlisi: 'Mehmet Demir',
    gerceklestirmeGorevlisiUnvan: 'Satın Alma Şube Müdürü',
    muhasebeKodu: '34.01.00.00',
    harcamaBirimiKodu: '34.01.02.45',
    butceYili: '2026',
    vergiNo: '4810052341',
    vergiDairesi: 'Fatih Vergi Dairesi',
    adres: 'Kemalpaşa Mah. 15 Temmuz Şehitleri Cad. No:5 Saraçhane / Fatih / İSTANBUL',
    kepAdresi: 'ibb@hs01.kep.tr',
  })

  // LocalStorage'dan yükle
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem('temin360_sidebar_collapsed')
      if (savedCollapsed !== null) {
        setIsCollapsed(savedCollapsed === 'true')
      }
      const savedKurum = localStorage.getItem('temin360_kurum_info')
      if (savedKurum) {
        setKurumInfo(JSON.parse(savedKurum))
      }
      const savedModule = localStorage.getItem('kamu360_active_module') as ModuleKey | null
      if (savedModule && MODULE_CONFIGS[savedModule]) {
        setSelectedModule(savedModule)
      }
    } catch {
      // ignore
    }
  }, [])

  const toggleCollapse = () => {
    const next = !isCollapsed
    setIsCollapsed(next)
    try {
      localStorage.setItem('temin360_sidebar_collapsed', String(next))
    } catch {
      // ignore
    }
  }

  const handleSaveKurum = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      localStorage.setItem('temin360_kurum_info', JSON.stringify(kurumInfo))
    } catch {
      // ignore
    }
    setIsKurumModalOpen(false)
    setToastMessage('Kurum ve antet ayarları başarıyla güncellendi!')
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Sub-menu açılıp kapanma state'i
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    'Satın Alma Yönetimi (4734 & DT)': true,
    'Gelir Yönetimi (2886 & Kiralama)': false,
    'CBS, Arazi & Su Altyapı Yönetimi': false,
    'Personel & İK Yönetimi (İK 360)': false,
    'BKMYBS & Mali Yönetim (5018)': false,
  })

  // Aktif sayfaya göre menüyü otomatik aç
  useEffect(() => {
    if (
      pathname === '/malzeme-bilgisi' ||
      pathname === '/teklif-degerlendirme' ||
      pathname === '/ihale-dosyasi' ||
      pathname === '/sozlesme' ||
      pathname === '/dogrudan-temin' ||
      pathname === '/temin-dosyasi' ||
      pathname.startsWith('/temin-dosyasi') ||
      pathname.startsWith('/satin-alma')
    ) {
      setOpenSubMenus((prev) => ({ ...prev, 'Satın Alma Yönetimi (4734 & DT)': true }))
    } else if (pathname.startsWith('/gelir-ihaleleri')) {
      setOpenSubMenus((prev) => ({ ...prev, 'Gelir Yönetimi (2886 & Kiralama)': true }))
    } else if (pathname.startsWith('/harita-altyapi')) {
      setOpenSubMenus((prev) => ({ ...prev, 'CBS, Arazi & Su Altyapı Yönetimi': true }))
    } else if (pathname.startsWith('/personel-takibi')) {
      setOpenSubMenus((prev) => ({ ...prev, 'Personel & İK Yönetimi (İK 360)': true }))
    } else if (pathname.startsWith('/bkmybs-mali-yonetim')) {
      setOpenSubMenus((prev) => ({ ...prev, 'BKMYBS & Mali Yönetim (5018)': true }))
    }
  }, [pathname])

  const toggleSubMenu = (label: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setOpenSubMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === '/'
    }
    if (item.isProcurement) {
      return (
        pathname === '/malzeme-bilgisi' ||
        pathname === '/teklif-degerlendirme' ||
        pathname === '/ihale-dosyasi' ||
        pathname === '/sozlesme' ||
        pathname === '/dogrudan-temin' ||
        pathname === '/temin-dosyasi' ||
        pathname.startsWith('/temin-dosyasi') ||
        pathname.startsWith('/satin-alma')
      )
    }
    if (item.prefix) {
      return pathname.startsWith(item.prefix)
    }
    return pathname === item.href
  }

  const isChildActive = (href: string) => {
    if (href === '/temin-dosyasi') {
      return pathname === '/temin-dosyasi' || pathname.startsWith('/temin-dosyasi')
    }
    if (href.includes('?view=liste')) {
      const [base] = href.split('?')
      if (typeof window !== 'undefined') {
        return pathname === base && window.location.search.includes('view=liste')
      }
      return false
    }
    if (typeof window !== 'undefined' && window.location.search.includes('view=liste')) {
      return false
    }
    return pathname === href
  }

  // Seçili modüle göre filtrelenmiş nav öğeleri
  const filteredNavItems = navItems.filter((item) => {
    if (!item.modules) return true
    if (selectedModule === 'all') return true
    return item.modules.includes(selectedModule)
  })

  const currentModuleConfig = MODULE_CONFIGS[selectedModule] || MODULE_CONFIGS.all
  const CurrentModuleIcon = currentModuleConfig.icon

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="size-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${
          menuOpen ? 'flex' : 'hidden'
        } fixed inset-y-[58px] left-0 z-40 flex-col justify-between border-r border-[#26354a] bg-[#1e2a3c] text-[#aab6c6] transition-all duration-300 ease-in-out lg:static lg:flex lg:min-h-[calc(100vh-58px)] ${
          isCollapsed ? 'w-[68px]' : 'w-[258px]'
        }`}
        aria-label="Uygulama menüsü"
      >
        {/* Üst Kısım: Menü ve Toggle Butonu */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Collapse / Expand Toggle Başlığı */}
          <div className="flex items-center justify-between px-3 py-3 border-b border-[#26354a]/80">
            {!isCollapsed ? (
              <div className="flex items-center gap-2 pl-1">
                <BrandLogo className="size-5 shrink-0" />
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-white">
                  KAMU <span className="text-[#4078ea]">360</span>
                </span>
              </div>
            ) : (
              <div className="mx-auto mb-1">
                <BrandLogo className="size-5 shrink-0" />
              </div>
            )}
            <button
              type="button"
              onClick={toggleCollapse}
              className={`p-1.5 rounded-lg text-[#7b8794] hover:text-white hover:bg-[#2c3d55] transition-colors ${
                isCollapsed ? 'mx-auto' : ''
              }`}
              title={isCollapsed ? 'Kenar Çubuğunu Genişlet' : 'Kenar Çubuğunu Daralt'}
              aria-label="Menüyü Daralt/Genişlet"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="size-4 text-[#4078ea]" />
              ) : (
                <PanelLeftClose className="size-4 text-[#7b8794] hover:text-white" />
              )}
            </button>
          </div>

          {/* İNTERAKTİF MODÜL SEÇİCİ (MODÜL DEĞİŞTİRİCİ) */}
          {!isCollapsed ? (
            <div className="relative px-2.5 py-2.5 border-b border-[#26354a]/80 bg-[#162130]">
              <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#73859b] px-1 mb-1.5 flex items-center justify-between">
                <span>AKTİF MODÜL</span>
                <span className="text-[8.5px] text-[#4078ea] bg-[#4078ea]/15 px-1.5 py-0.5 rounded font-extrabold">
                  {currentModuleConfig.badge}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
                className="w-full flex items-center justify-between gap-2 p-2 rounded-xl bg-[#233146] hover:bg-[#2b3c54] border border-[#31435d] text-left transition group shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="size-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: `${currentModuleConfig.color}25`, color: currentModuleConfig.color }}
                  >
                    <CurrentModuleIcon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-bold text-white truncate leading-tight">
                      {currentModuleConfig.shortName}
                    </div>
                    <div className="text-[9px] text-[#8e9fb5] truncate">
                      {selectedModule === 'all' ? 'Tüm Süreçler Açık' : 'Özelleştirilmiş Modül'}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`size-3.5 text-[#8e9fb5] group-hover:text-white transition-transform ${
                    isModuleDropdownOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {/* Modül Seçim Popover */}
              {isModuleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsModuleDropdownOpen(false)}
                  />
                  <div className="absolute left-2.5 right-2.5 top-full mt-1.5 z-50 rounded-xl bg-[#111927] p-1.5 shadow-2xl border border-[#2b3a4f] space-y-1 animate-in fade-in zoom-in-95">
                    {Object.values(MODULE_CONFIGS).map((mod) => {
                      const ModIcon = mod.icon
                      const isSelected = selectedModule === mod.key
                      return (
                        <button
                          key={mod.key}
                          type="button"
                          onClick={() => {
                            setSelectedModule(mod.key)
                            setIsModuleDropdownOpen(false)
                            try {
                              localStorage.setItem('kamu360_active_module', mod.key)
                            } catch {}
                          }}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition ${
                            isSelected
                              ? 'bg-[#1e2a3c] border border-[#3a4d6b]'
                              : 'hover:bg-[#1a2535] text-[#94a3b8] hover:text-white'
                          }`}
                        >
                          <div
                            className="size-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: `${mod.color}25`, color: mod.color }}
                          >
                            <ModIcon className="size-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-[#cbd5e1]'}`}>
                                {mod.name}
                              </span>
                              <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-[#233146] text-[#93b4fd]">
                                {mod.badge}
                              </span>
                            </div>
                            <p className="text-[9.5px] text-[#71859d] line-clamp-1 mt-0.5">
                              {mod.description}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Collapsed Modül Değiştirici Buton */
            <div className="px-2 py-2 border-b border-[#26354a]/80 bg-[#162130] flex justify-center">
              <button
                type="button"
                onClick={() => {
                  const keys = Object.keys(MODULE_CONFIGS) as ModuleKey[]
                  const currentIndex = keys.indexOf(selectedModule)
                  const nextKey = keys[(currentIndex + 1) % keys.length]
                  setSelectedModule(nextKey)
                  try {
                    localStorage.setItem('kamu360_active_module', nextKey)
                  } catch {}
                }}
                className="size-9 rounded-xl flex items-center justify-center transition shadow-xs group relative hover:brightness-110"
                style={{ backgroundColor: `${currentModuleConfig.color}25`, color: currentModuleConfig.color }}
                title={`Aktif: ${currentModuleConfig.name} (Değiştirmek için tıkla)`}
              >
                <CurrentModuleIcon className="size-4.5" />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-[#1e2a3c]" />
              </button>
            </div>
          )}

          {/* Menü Öğeleri Listesi */}
          <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1.5 scrollbar-thin">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item)
              const hasChildren = item.children && item.children.length > 0
              const isSubOpen = openSubMenus[item.label] ?? false

              if (hasChildren) {
                return (
                  <div key={item.label} className="relative">
                    {/* Collapsed Durumunda Üst Buton & Hover Flyout */}
                    {isCollapsed ? (
                      <div className="group relative">
                        <Link
                          href={item.href}
                          onClick={onCloseMenu}
                          className={`flex items-center justify-center p-2.5 rounded-lg transition-all ${
                            active
                              ? 'bg-[#2d62d7] text-white shadow-xs'
                              : 'text-[#94a3b8] hover:bg-[#28374d] hover:text-white'
                          }`}
                        >
                          <Icon className="size-5 shrink-0" />
                        </Link>

                        {/* Collapsed Flyout Popover */}
                        <div className="absolute left-full top-0 ml-2 hidden group-hover:flex flex-col z-50 rounded-xl bg-[#111927] p-2.5 text-xs text-white shadow-2xl border border-[#2b3a4f] whitespace-nowrap min-w-[240px] pointer-events-auto animate-in fade-in">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#243347]">
                            <div className="flex items-center gap-2">
                              <Icon className="size-4 text-[#4078ea]" />
                              <span className="font-bold text-white text-[11.5px]">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="px-1.5 py-0.2 text-[9px] rounded bg-[#2d62d7] text-white font-bold">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            {item.children!.map((child) => {
                              const ChildIcon = child.icon || FileText
                              const childActive = isChildActive(child.href)
                              return (
                                <React.Fragment key={child.href}>
                                  {child.sectionTitle && (
                                    <div className="pt-2 pb-0.5 px-2 text-[8.5px] font-extrabold uppercase tracking-wider text-[#7e95b0]">
                                      {child.sectionTitle}
                                    </div>
                                  )}
                                  <Link
                                    href={child.href}
                                    onClick={onCloseMenu}
                                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-all ${
                                      childActive
                                        ? 'bg-[#2d62d7] text-white font-bold'
                                        : 'text-[#94a3b8] hover:bg-[#202f43] hover:text-white'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <ChildIcon className="size-3.5 shrink-0 text-[#71859d]" />
                                      <span className="truncate">{child.shortLabel || child.label}</span>
                                    </div>
                                    {child.badge && (
                                      <span className="ml-1.5 px-1.5 py-0.2 text-[8px] rounded bg-[#2d62d7]/30 text-[#93b4fd] border border-[#2d62d7]/40 font-bold">
                                        {child.badge}
                                      </span>
                                    )}
                                  </Link>
                                </React.Fragment>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Genişletilmiş Durum: Akordeon Başlığı ve Alt Menü */
                      <div>
                        <div
                          className={`group flex items-center justify-between rounded-lg transition-all duration-150 px-3 py-2 ${
                            active
                              ? 'bg-[#283952] text-white font-semibold'
                              : 'text-[#94a3b8] hover:bg-[#28374d] hover:text-white'
                          }`}
                        >
                          <Link
                            href={item.href}
                            onClick={onCloseMenu}
                            className="flex items-center gap-3 flex-1 min-w-0"
                          >
                            <Icon
                              className={`size-4 shrink-0 transition-transform ${
                                active ? 'text-[#4078ea]' : 'text-[#8194ad] group-hover:text-white'
                              }`}
                            />
                            <div className="flex items-center justify-between flex-1 min-w-0">
                              <span className="truncate text-xs tracking-tight">
                                {item.shortLabel || item.label}
                              </span>
                              {item.badge && (
                                <span
                                  className={`ml-1.5 shrink-0 px-1.5 py-0.2 text-[9px] font-bold rounded-md ${
                                    item.badge === 'Gelir'
                                      ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                                      : item.badge === 'CBS/Su'
                                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                                      : item.badge === 'İK 360'
                                      ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                                      : item.badge.includes('5018')
                                      ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                                      : 'bg-[#152338] text-[#82aaff] border border-[#2d62d7]/40'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </Link>

                          {/* Akordeon Aç / Kapa Çentiği */}
                          <button
                            type="button"
                            onClick={(e) => toggleSubMenu(item.label, e)}
                            className="p-1 -mr-1 rounded hover:bg-[#344661] text-[#71859d] hover:text-white transition"
                            title={isSubOpen ? 'Alt Süreçleri Gizle' : 'Alt Süreçleri Göster'}
                            aria-label="Alt süreçleri aç/kapat"
                          >
                            {isSubOpen ? (
                              <ChevronDown className="size-3.5 text-[#8da0b8]" />
                            ) : (
                              <ChevronRight className="size-3.5 text-[#71859d]" />
                            )}
                          </button>
                        </div>

                        {/* Akordeon Alt Maddeleri */}
                        {isSubOpen && (
                          <div className="ml-3 my-1 pl-2.5 border-l-2 border-[#2c3d55] space-y-0.5">
                            {item.children!.map((child) => {
                              const ChildIcon = child.icon || FileText
                              const childActive = isChildActive(child.href)

                              return (
                                <React.Fragment key={child.href}>
                                  {child.sectionTitle && (
                                    <div className="pt-2 pb-1 px-1 flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-[#7e95b0]">
                                      <span className="size-1.5 rounded-full bg-[#4078ea]" />
                                      <span>{child.sectionTitle}</span>
                                    </div>
                                  )}
                                  <Link
                                    href={child.href}
                                    onClick={onCloseMenu}
                                    className={`group flex items-center justify-between rounded-md px-2.5 py-1.5 text-[11px] transition-all ${
                                      childActive
                                        ? 'bg-[#2d62d7] text-white font-bold shadow-xs'
                                        : 'text-[#8da0b8] hover:bg-[#28374d] hover:text-white'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0 truncate">
                                      <ChildIcon
                                        className={`size-3.5 shrink-0 ${
                                          childActive
                                            ? 'text-white'
                                            : 'text-[#627791] group-hover:text-white'
                                        }`}
                                      />
                                      <span className="truncate">
                                        {child.shortLabel || child.label}
                                      </span>
                                    </div>
                                    {child.badge && (
                                      <span
                                        className={`ml-1 shrink-0 px-1.5 py-0.2 text-[8.5px] font-bold rounded ${
                                          childActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-[#152338] text-[#82aaff] border border-[#2d62d7]/30'
                                        }`}
                                      >
                                        {child.badge}
                                      </span>
                                    )}
                                  </Link>
                                </React.Fragment>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onCloseMenu}
                  className={`group relative flex items-center rounded-lg transition-all duration-150 ${
                    isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
                  } ${
                    active
                      ? 'bg-[#2d62d7] text-white font-semibold shadow-xs'
                      : 'text-[#94a3b8] hover:bg-[#28374d] hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`shrink-0 transition-transform ${
                      active ? 'text-white' : 'text-[#8194ad] group-hover:text-white'
                    } ${isCollapsed ? 'size-5' : 'size-4'}`}
                  />

                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate text-xs tracking-tight">
                        {item.shortLabel || item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`ml-1.5 shrink-0 px-1.5 py-0.2 text-[9px] font-bold rounded-md ${
                            active
                              ? 'bg-white/20 text-white'
                              : item.badge === 'Gelir'
                              ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                              : item.badge === 'EBYS'
                              ? 'bg-[#152338] text-[#82aaff] border border-[#2d62d7]/40'
                              : 'bg-[#152338] text-[#82aaff] border border-[#2d62d7]/40'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Collapsed Tooltip Hover */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2.5 hidden group-hover:flex items-center z-50 rounded-lg bg-[#111927] px-3 py-1.5 text-xs font-semibold text-white shadow-xl whitespace-nowrap border border-[#2b3a4f] pointer-events-none">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.2 text-[9px] rounded bg-[#2d62d7] text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* ALT KISIM: KURUM KARTI VE KURUM AYARI */}
        <div className="p-2.5 border-t border-[#26354a] bg-[#162130]">
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => setIsKurumModalOpen(true)}
              className="group relative flex size-10 mx-auto items-center justify-center rounded-xl bg-[#233146] text-[#4078ea] hover:bg-[#2d62d7] hover:text-white transition-all shadow-inner"
              title="Kurum ve Antet Ayarları"
            >
              <Building2 className="size-5" />
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-7 rounded-lg bg-[#233146] text-[#4078ea] flex items-center justify-center shrink-0 border border-[#2c3d55]">
                    <Building2 className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white truncate leading-tight">
                      {kurumInfo.kurumAdi.replace('T.C. ', '')}
                    </p>
                    <p className="text-[9.5px] text-[#71859d] truncate">
                      {kurumInfo.subeMudurlugu}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsKurumModalOpen(true)}
                  className="p-1.5 text-[#71859d] hover:text-white hover:bg-[#233146] rounded-lg transition"
                  title="Kurum ve İhale Bilgilerini Düzenle"
                >
                  <Sliders className="size-3.5" />
                </button>
              </div>

              {/* Hızlı Bilgi Şeridi */}
              <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[#233146]/80 text-[9.5px]">
                <div className="bg-[#1b2738] px-2 py-1 rounded text-[#8da0b8] truncate">
                  <span className="text-[#5b6f88]">Müh. Kodu: </span>
                  <span className="font-mono text-white">{kurumInfo.muhasebeKodu}</span>
                </div>
                <div className="bg-[#1b2738] px-2 py-1 rounded text-[#8da0b8] truncate">
                  <span className="text-[#5b6f88]">Mali Yıl: </span>
                  <span className="font-mono text-emerald-400 font-bold">{kurumInfo.butceYili}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* KURUM BİLGİLERİ VE ANTET DÜZENLEME MODALI */}
      {isKurumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-[#cbd5e1] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Başlığı */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e3a8a] text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white/10">
                  <Building2 className="size-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Kurum ve Resmî Antet Ayarları</h3>
                  <p className="text-xs text-blue-200">
                    Tüm matbu evraklar, şartnameler, MİF ve ihale onayları bu antet ile basılır.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsKurumModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Form Alanı */}
            <form onSubmit={handleSaveKurum} className="flex flex-col flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Resmî Kurum Adı (Büyük Harflerle Antet)
                  </label>
                  <input
                    type="text"
                    required
                    value={kurumInfo.kurumAdi}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, kurumAdi: e.target.value })}
                    placeholder="Örn: T.C. İSTANBUL BÜYÜKŞEHİR BELEDİYESİ"
                    className="w-full text-xs font-semibold px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Daire Başkanlığı
                  </label>
                  <input
                    type="text"
                    required
                    value={kurumInfo.daireBaskanligi}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, daireBaskanligi: e.target.value })}
                    placeholder="Destek Hizmetleri Dairesi Başkanlığı"
                    className="w-full text-xs px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Şube Müdürlüğü / Birim
                  </label>
                  <input
                    type="text"
                    required
                    value={kurumInfo.subeMudurlugu}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, subeMudurlugu: e.target.value })}
                    placeholder="Satın Alma Şube Müdürlüğü"
                    className="w-full text-xs px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Harcama Yetkilisi (İta Amiri)
                  </label>
                  <input
                    type="text"
                    required
                    value={kurumInfo.harcamaYetkilisi}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, harcamaYetkilisi: e.target.value })}
                    placeholder="Ahmet Yılmaz"
                    className="w-full text-xs px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Harcama Yetkilisi Unvanı
                  </label>
                  <input
                    type="text"
                    required
                    value={kurumInfo.harcamaYetkilisiUnvan}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, harcamaYetkilisiUnvan: e.target.value })}
                    placeholder="Daire Başkanı"
                    className="w-full text-xs px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Gerçekleştirme Görevlisi
                  </label>
                  <input
                    type="text"
                    required
                    value={kurumInfo.gerceklestirmeGorevlisi}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, gerceklestirmeGorevlisi: e.target.value })}
                    placeholder="Mehmet Demir"
                    className="w-full text-xs px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Gerçekleştirme Görevlisi Unvanı
                  </label>
                  <input
                    type="text"
                    required
                    value={kurumInfo.gerceklestirmeGorevlisiUnvan}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, gerceklestirmeGorevlisiUnvan: e.target.value })}
                    placeholder="Şube Müdürü"
                    className="w-full text-xs px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Muhasebe Birimi Kodu (Saymanlık)
                  </label>
                  <input
                    type="text"
                    value={kurumInfo.muhasebeKodu}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, muhasebeKodu: e.target.value })}
                    placeholder="34.01.00.00"
                    className="w-full text-xs font-mono px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Harcama Birimi Kodu
                  </label>
                  <input
                    type="text"
                    value={kurumInfo.harcamaBirimiKodu}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, harcamaBirimiKodu: e.target.value })}
                    placeholder="34.01.02.45"
                    className="w-full text-xs font-mono px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Bütçe Yılı
                  </label>
                  <input
                    type="text"
                    value={kurumInfo.butceYili}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, butceYili: e.target.value })}
                    placeholder="2026"
                    className="w-full text-xs font-mono px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Resmî KEP Adresi
                  </label>
                  <input
                    type="text"
                    value={kurumInfo.kepAdresi}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, kepAdresi: e.target.value })}
                    placeholder="ibb@hs01.kep.tr"
                    className="w-full text-xs px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Resmî Kurum Adresi & İletişim
                  </label>
                  <input
                    type="text"
                    value={kurumInfo.adres}
                    onChange={(e) => setKurumInfo({ ...kurumInfo, adres: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#2563eb] focus:bg-white"
                  />
                </div>
              </div>

              {/* Alt Butonlar */}
              <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsKurumModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#475569] hover:bg-[#f1f5f9] rounded-lg transition"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg shadow-sm transition"
                >
                  <Save className="size-3.5" />
                  Antet Ayarlarını Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
