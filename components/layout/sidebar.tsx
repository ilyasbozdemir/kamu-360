'use client'

import React, { useState, useEffect, Suspense, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { BrandLogo } from '@/components/ui/brand-logo'
import { useModule, MODULE_DEFINITIONS, ModuleKey, ModuleDefinition } from '@/lib/module-context'
import {
  Building2,
  ChevronDown,
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
  Package,
} from 'lucide-react'

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
  children?: NavSubItem[]
}

export interface ModuleSection {
  id: ModuleKey
  title: string
  badge: string
  color: string
  bgBanner: string
  borderColor: string
  items: NavItem[]
}

interface SidebarProps {
  menuOpen: boolean
  onCloseMenu: () => void
}

function SearchParamsWatcher({ onParamsChange }: { onParamsChange: (search: string) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    onParamsChange(searchParams ? searchParams.toString() : '')
  }, [searchParams, onParamsChange])

  return null
}

export function Sidebar({ menuOpen, onCloseMenu }: SidebarProps) {
  const pathname = usePathname()
  const { activeModule, setActiveModule, currentModule } = useModule()
  const [currentSearch, setCurrentSearch] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleParamsChange = useCallback((params: string) => {
    setCurrentSearch(params)
  }, [])
  const [isKurumModalOpen, setIsKurumModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
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
    'CBS, Arazi & Su Altyapı Yönetimi': true,
    'Personel & İK Yönetimi (İK 360)': true,
    'BKMYBS & Mali Yönetim (5018)': true,
  })

  // Aktif sayfaya göre menüyü ve modülü otomatik senkronize et
  useEffect(() => {
    if (
      pathname === '/malzeme-bilgisi' ||
      pathname === '/teklif-degerlendirme' ||
      pathname === '/ihale-dosyasi' ||
      pathname === '/sozlesme' ||
      pathname === '/dogrudan-temin' ||
      pathname === '/temin-dosyasi' ||
      pathname.startsWith('/temin-dosyasi')
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
        pathname.startsWith('/temin-dosyasi')
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
    if (href.includes('?')) {
      const [base, query] = href.split('?')
      if (pathname !== base) {
        return false
      }
      if (currentSearch) {
        return currentSearch.includes(query)
      }
      // Varsayılan sekmeler (URL'de henüz query parametresi yoksa)
      if (base === '/harita-altyapi') return query === 'tab=harita'
      if (base === '/personel-takibi') return query === 'tab=ozluk'
      if (base === '/bkmybs-mali-yonetim') return query === 'tab=butce'
      if (base === '/gelir-ihaleleri/dosya-tanimi') return query === 'view=liste'
      return false
    }
    if (currentSearch && currentSearch.includes('tab=')) {
      return false
    }
    return pathname === href
  }

  // MODÜL GRUPLARI VE SÜREÇLERİ
  const MODULE_SECTIONS: ModuleSection[] = [
    // GRUP 1: İHALE VE SATIN ALMA (4734 & 2886)
    {
      id: 'ihale_satin_alma',
      title: 'İhale & Satın Alma Süreçleri',
      badge: '4734 & 2886',
      color: '#3b82f6',
      bgBanner: 'from-blue-950/80 to-slate-900',
      borderColor: 'border-blue-600/40',
      items: [
        {
          icon: Star,
          label: 'Satın Alma Yönetimi (4734 & DT)',
          shortLabel: 'Satın Alma (4734)',
          href: '/malzeme-bilgisi',
          isProcurement: true,
          badge: 'Gider',
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
      ],
    },

    // GRUP 2: CBS, ARAZİ & SU ALTYAPISI
    {
      id: 'cbs_arazi_su',
      title: 'CBS, Arazi & Su Altyapısı',
      badge: 'Harita / Su',
      color: '#10b981',
      bgBanner: 'from-emerald-950/80 to-slate-900',
      borderColor: 'border-emerald-600/40',
      items: [
        {
          icon: Compass,
          label: 'CBS, Arazi & Su Altyapı Yönetimi',
          shortLabel: 'CBS & Su Altyapı',
          href: '/harita-altyapi',
          prefix: '/harita-altyapi',
          badge: 'CBS/Su',
          children: [
            {
              icon: Compass,
              label: '1. Canlı CBS Harita Katmanı',
              shortLabel: '1. CBS Canlı Harita',
              href: '/harita-altyapi?tab=harita',
              sectionTitle: 'Harita Katmanları & GIS',
            },
            {
              icon: Building2,
              label: '2. Arazi & Parsel Mülkiyet Takibi',
              shortLabel: '2. Arazi & Parsel',
              href: '/harita-altyapi?tab=arazi',
            },
            {
              icon: Droplets,
              label: '3. Su Şebekesi & İsale Hatları',
              shortLabel: '3. Su Şebekesi',
              href: '/harita-altyapi?tab=su',
            },
            {
              icon: Gauge,
              label: '4. Sayaç & Abone Yönetimi',
              shortLabel: '4. Sayaç & Abone',
              href: '/harita-altyapi?tab=abone',
            },
            {
              icon: Table,
              label: '5. Belediye Taşınmaz Envanteri',
              shortLabel: '5. Taşınmaz Listesi',
              href: '/gelir-ihaleleri/varlik-envanteri',
            },
          ],
        },
      ],
    },

    // GRUP 3: İNSAN KAYNAKLARI (İK 360)
    {
      id: 'personel_ik',
      title: 'İnsan Kaynakları & Personel',
      badge: '657 / 4857',
      color: '#8b5cf6',
      bgBanner: 'from-purple-950/80 to-slate-900',
      borderColor: 'border-purple-600/40',
      items: [
        {
          icon: Users,
          label: 'Personel & İK Yönetimi (İK 360)',
          shortLabel: 'Personel & İK 360',
          href: '/personel-takibi',
          prefix: '/personel-takibi',
          badge: 'İK 360',
          children: [
            {
              icon: Users,
              label: '1. Personel Özlük & Sicil Listesi',
              shortLabel: '1. Özlük & Sicil',
              href: '/personel-takibi?tab=ozluk',
              sectionTitle: '657 & 4857 Özlük Masası',
            },
            {
              icon: FileText,
              label: '2. Puantaj & İzin Masası',
              shortLabel: '2. Puantaj & İzin',
              href: '/personel-takibi?tab=puantaj',
            },
            {
              icon: Briefcase,
              label: '3. Görevlendirme & Harcırah (6245)',
              shortLabel: '3. Harcırah & Görev',
              href: '/personel-takibi?tab=harcirah',
              badge: '6245',
            },
            {
              icon: Award,
              label: '4. Kademe, Terfi & Disiplin',
              shortLabel: '4. Terfi & Disiplin',
              href: '/personel-takibi?tab=terfi',
            },
            {
              icon: Network,
              label: '5. EBYS Dağıtım & Onay Rotaları',
              shortLabel: '5. Onay Rotaları',
              href: '/is-akislari',
            },
          ],
        },
      ],
    },

    // GRUP 4: BKMYBS & MALİ YÖNETİM (5018)
    {
      id: 'bkmybs_mali',
      title: 'BKMYBS & Mali Yönetim',
      badge: '5018 MİF',
      color: '#f59e0b',
      bgBanner: 'from-amber-950/80 to-slate-900',
      borderColor: 'border-amber-600/40',
      items: [
        {
          icon: Coins,
          label: 'BKMYBS & Mali Yönetim (5018)',
          shortLabel: 'BKMYBS / Bütçe',
          href: '/bkmybs-mali-yonetim',
          prefix: '/bkmybs-mali-yonetim',
          badge: '5018 MİF',
          children: [
            {
              icon: Coins,
              label: '1. Analitik Bütçe Kodları & Ödenek',
              shortLabel: '1. Analitik Bütçe',
              href: '/bkmybs-mali-yonetim?tab=butce',
              sectionTitle: '5018 Mali İşlemler',
            },
            {
              icon: ShieldCheck,
              label: '2. 22/d Parasal Limit & %10 Kota Masası',
              shortLabel: '2. 22/d Limit & Kota',
              href: '/bkmybs-mali-yonetim?tab=limit',
              badge: 'KİK',
            },
            {
              icon: FileSpreadsheet,
              label: '3. MİF & Ödeme Emri Belgesi (ÖEB)',
              shortLabel: '3. MİF & Ödeme Emri',
              href: '/bkmybs-mali-yonetim?tab=mif',
              badge: 'ÖEB',
            },
            {
              icon: Package,
              label: '4. TKYS Taşınır Mal Yönetimi & Zimmet',
              shortLabel: '4. TKYS Taşınır Mal',
              href: '/bkmybs-mali-yonetim?tab=tkys',
              badge: 'TİF',
            },
            {
              icon: ShieldCheck,
              label: '5. Emanetler & Teminat Mektupları',
              shortLabel: '5. Teminat Mektubu',
              href: '/bkmybs-mali-yonetim?tab=emanet',
            },
            {
              icon: FileSignature,
              label: '6. 4734 Harcama Sözleşmeleri',
              shortLabel: '6. Satın Alma Sözleşmesi',
              href: '/sozlesme',
            },
          ],
        },
      ],
    },
  ]

  // ORTAK ARAÇLAR VE SİSTEM MENÜSÜ
  const COMMON_SECTION: ModuleSection = {
    id: 'all',
    title: 'Ortak Kurumsal Araçlar',
    badge: 'EBYS & Sistem',
    color: '#94a3b8',
    bgBanner: 'from-slate-900 to-slate-900',
    borderColor: 'border-slate-700/60',
    items: [
      {
        icon: Grid3X3,
        label: 'Raporlar ve Analitik',
        shortLabel: 'Raporlar',
        href: '/raporlar',
        prefix: '/raporlar',
      },
      {
        icon: Network,
        label: 'Rota & İş Akışları (EBYS)',
        shortLabel: 'İş Akışları',
        href: '/is-akislari',
        prefix: '/is-akislari',
      },
      {
        icon: FileSignature,
        label: 'EBYS Belge Stüdyosu',
        shortLabel: 'Belge Stüdyosu',
        href: '/belge-builder',
        prefix: '/belge-builder',
        badge: 'EBYS',
      },
      {
        icon: Printer,
        label: 'Yazdırma & Dışa Aktarma',
        shortLabel: 'Yazdırma Merkezi',
        href: '/yazdirma-merkezi',
        prefix: '/yazdirma-merkezi',
      },
      {
        icon: Settings,
        label: 'Sistem Ayarları',
        shortLabel: 'Ayarlar',
        href: '/sistem-ayarlari',
        prefix: '/sistem-ayarlari',
      },
    ],
  }

  // Aktif modüle göre gösterilecek gruplar
  const visibleSections =
    activeModule === 'all'
      ? MODULE_SECTIONS
      : MODULE_SECTIONS.filter((sec) => sec.id === activeModule)

  return (
    <>
      {/* Search Params Dinleyici (SSR Hydration Güvenli) */}
      <Suspense fallback={null}>
        <SearchParamsWatcher onParamsChange={handleParamsChange} />
      </Suspense>

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
        } fixed top-[58px] bottom-0 left-0 z-40 flex flex-col justify-between border-r border-[#26354a] bg-[#162130] text-[#aab6c6] transition-all duration-300 ease-in-out lg:sticky lg:top-[58px] lg:flex h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] overflow-hidden shrink-0 ${
          isCollapsed ? 'w-[72px]' : 'w-[264px]'
        }`}
        aria-label="Uygulama menüsü"
      >
        {/* Üst Kısım: Menü ve Toggle Butonu */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Logo ve Daraltma Başlığı */}
          <div className="shrink-0 flex items-center justify-between px-3 py-3 border-b border-[#26354a]/80 bg-[#141d2b]">
            {!isCollapsed ? (
              <div className="flex items-center gap-2 pl-1">
                <BrandLogo className="size-5 shrink-0" />
                <span className="text-[11.5px] font-black tracking-wider uppercase text-white">
                  KAMU <span className="text-[#3b82f6]">360</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  PORTAL
                </span>
              </div>
            ) : (
              <div className="mx-auto">
                <BrandLogo className="size-5 shrink-0" />
              </div>
            )}
            <button
              type="button"
              onClick={toggleCollapse}
              className={`p-1.5 rounded-lg text-[#7b8794] hover:text-white hover:bg-[#2c3d55] transition-colors ${
                isCollapsed ? 'mx-auto' : ''
              }`}
              title={isCollapsed ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
              aria-label="Menüyü Daralt/Genişlet"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="size-4 text-[#3b82f6]" />
              ) : (
                <PanelLeftClose className="size-4 text-[#7b8794] hover:text-white" />
              )}
            </button>
          </div>

          {/* 1. HIZLI MODÜL DEĞİŞTİRİCİ TAB STRİP (SEGMENTED SELECTOR) */}
          {!isCollapsed ? (
            <div className="shrink-0 p-2 border-b border-[#26354a]/80 bg-[#121a27]">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#64748b]">
                  ÇALIŞMA MODÜLÜ SEÇİMİ
                </span>
                <span className="text-[8.5px] font-bold text-blue-400">
                  {currentModule.badge}
                </span>
              </div>

              {/* 5'li Hızlı Modül Butonları */}
              <div className="grid grid-cols-5 gap-1 bg-[#1a2536] p-1 rounded-xl border border-[#26354a]">
                {(Object.keys(MODULE_DEFINITIONS) as ModuleKey[]).map((key) => {
                  const def = MODULE_DEFINITIONS[key]
                  const Icon = def.icon
                  const isSelected = activeModule === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveModule(key)}
                      title={`${def.name} - ${def.tagline}`}
                      className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition text-center relative ${
                        isSelected
                          ? 'bg-[#2a3a52] text-white shadow-xs font-bold'
                          : 'text-[#7d8fa5] hover:text-white hover:bg-[#202e42]'
                      }`}
                    >
                      <Icon
                        className="size-4 mb-0.5"
                        style={{ color: isSelected ? def.color : undefined }}
                      />
                      <span className="text-[8.5px] truncate w-full leading-none">
                        {def.miniLabel}
                      </span>
                      {isSelected && (
                        <span
                          className="absolute bottom-0 h-0.5 w-3 rounded-full"
                          style={{ backgroundColor: def.color }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Aktif Modül Başlık Kartı */}
              <div className="mt-2 p-2 rounded-xl bg-gradient-to-r from-[#1c293d] to-[#162130] border border-[#2b3c54] flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="size-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: `${currentModule.color}25`, color: currentModule.color }}
                  >
                    <currentModule.icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white truncate leading-tight flex items-center gap-1.5">
                      <span>{currentModule.shortName}</span>
                    </div>
                    <div className="text-[9px] text-[#8ea1ba] truncate">
                      {currentModule.tagline}
                    </div>
                  </div>
                </div>

                {activeModule !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setActiveModule('all')}
                    className="text-[9px] font-bold px-1.5 py-1 rounded bg-[#23334a] hover:bg-[#2d415d] text-blue-300 transition shrink-0"
                    title="Tüm modülleri yan menüde genişlet"
                  >
                    Tümü
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Collapsed Modül Düğmesi */
            <div className="shrink-0 p-2 border-b border-[#26354a]/80 bg-[#121a27] flex justify-center">
              <button
                type="button"
                onClick={() => {
                  const keys = Object.keys(MODULE_DEFINITIONS) as ModuleKey[]
                  const idx = keys.indexOf(activeModule)
                  const next = keys[(idx + 1) % keys.length]
                  setActiveModule(next)
                }}
                className="size-9 rounded-xl flex items-center justify-center transition shadow-xs hover:brightness-125 group relative"
                style={{ backgroundColor: `${currentModule.color}25`, color: currentModule.color }}
                title={`Aktif: ${currentModule.name} (Sonrakine geçmek için tıkla)`}
              >
                <currentModule.icon className="size-4.5" />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-[#162130]" />
              </button>
            </div>
          )}

          {/* Menü Öğeleri Listesi */}
          <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-2.5 space-y-4 sidebar-scroll overscroll-contain">
            {/* Dashboard Linki */}
            <div>
              <Link
                href="/"
                onClick={onCloseMenu}
                className={`group flex items-center rounded-xl transition-all duration-150 ${
                  isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
                } ${
                  pathname === '/'
                    ? 'bg-[#2563eb] text-white font-bold shadow-md'
                    : 'text-[#94a3b8] hover:bg-[#1f2d42] hover:text-white'
                }`}
                title="Ana Sayfa (Dashboard)"
              >
                <LayoutDashboard className={`${isCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="text-xs font-semibold">Ana Sayfa (Dashboard)</span>
                    <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-white/20 text-white font-bold">
                      Özet
                    </span>
                  </div>
                )}
              </Link>
            </div>

            {/* SEÇİLİ VEYA TÜM MODÜL GRUPLARI */}
            {visibleSections.map((section) => (
              <div key={section.id} className="space-y-1">
                {/* Modül Bölüm Başlığı / Ayırıcı */}
                {!isCollapsed ? (
                  <div className="px-2 pt-1 pb-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: section.color }}
                        />
                        <span
                          className="text-[10px] font-extrabold uppercase tracking-wider"
                          style={{ color: section.color }}
                        >
                          {section.title}
                        </span>
                      </div>
                      <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-[#1e2c40] text-[#93a6be] border border-[#2b3d56]">
                        {section.badge}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="my-1.5 mx-auto h-0.5 w-6 rounded bg-[#26354a]" />
                )}

                {/* Modül Maddeleri */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item)
                    const hasChildren = item.children && item.children.length > 0
                    const isSubOpen = openSubMenus[item.label] ?? true

                    if (hasChildren) {
                      return (
                        <div key={item.label} className="relative">
                          {isCollapsed ? (
                            <Link
                              href={item.href}
                              onClick={onCloseMenu}
                              className={`flex items-center justify-center p-2.5 rounded-xl transition ${
                                active
                                  ? 'bg-[#2563eb] text-white shadow-md'
                                  : 'text-[#94a3b8] hover:bg-[#1f2d42] hover:text-white'
                              }`}
                              title={item.label}
                            >
                              <Icon className="size-5 shrink-0" />
                            </Link>
                          ) : (
                            <div className="rounded-xl overflow-hidden bg-[#1a2638]/60 border border-[#26364d]/80">
                              <div
                                className={`group flex items-center justify-between px-3 py-2 transition ${
                                  active
                                    ? 'bg-[#22334b] text-white font-bold'
                                    : 'text-[#94a3b8] hover:bg-[#202f43] hover:text-white'
                                }`}
                              >
                                <Link
                                  href={item.href}
                                  onClick={onCloseMenu}
                                  className="flex items-center gap-2.5 flex-1 min-w-0"
                                >
                                  <Icon
                                    className="size-4 shrink-0 transition"
                                    style={{ color: active ? '#ffffff' : section.color }}
                                  />
                                  <span className="truncate text-xs font-semibold">
                                    {item.shortLabel || item.label}
                                  </span>
                                  {item.badge && (
                                    <span
                                      className="ml-auto mr-1 text-[8.5px] font-bold px-1.5 py-0.2 rounded"
                                      style={{
                                        backgroundColor: `${section.color}25`,
                                        color: section.color,
                                      }}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>

                                <button
                                  type="button"
                                  onClick={(e) => toggleSubMenu(item.label, e)}
                                  className="p-1 -mr-1 rounded hover:bg-[#2d415d] text-[#71859d] hover:text-white transition"
                                  title={isSubOpen ? 'Gizle' : 'Genişlet'}
                                >
                                  {isSubOpen ? (
                                    <ChevronDown className="size-3.5" />
                                  ) : (
                                    <ChevronRight className="size-3.5" />
                                  )}
                                </button>
                              </div>

                              {/* Alt Süreç Maddeleri */}
                              {isSubOpen && (
                                <div className="py-1 px-1.5 space-y-0.5 bg-[#141d2b]/80 border-t border-[#24344a]">
                                  {item.children!.map((child) => {
                                    const ChildIcon = child.icon || FileText
                                    const childActive = isChildActive(child.href)

                                    return (
                                      <React.Fragment key={`${section.id}-${item.label}-${child.label}-${child.href}`}>
                                        {child.sectionTitle && (
                                          <div className="pt-2 pb-1 px-2 flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-wider text-[#637893]">
                                            <span
                                              className="size-1 rounded-full"
                                              style={{ backgroundColor: section.color }}
                                            />
                                            <span>{child.sectionTitle}</span>
                                          </div>
                                        )}
                                        <Link
                                          href={child.href}
                                          onClick={onCloseMenu}
                                          className={`group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] transition-all ${
                                            childActive
                                              ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                                              : 'text-[#8da0b8] hover:bg-[#1d2a3c] hover:text-white'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 min-w-0 truncate">
                                            <ChildIcon
                                              className={`size-3.5 shrink-0 ${
                                                childActive ? 'text-white' : 'text-[#627791]'
                                              }`}
                                            />
                                            <span className="truncate">
                                              {child.shortLabel || child.label}
                                            </span>
                                          </div>
                                          {child.badge && (
                                            <span
                                              className={`ml-1 shrink-0 px-1.5 py-0.2 text-[8px] font-bold rounded ${
                                                childActive
                                                  ? 'bg-white/20 text-white'
                                                  : 'bg-[#1b283a] text-[#93b4fd] border border-[#2d62d7]/30'
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
                        className={`group flex items-center rounded-xl transition-all duration-150 ${
                          isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
                        } ${
                          active
                            ? 'bg-[#2563eb] text-white font-semibold shadow-xs'
                            : 'text-[#94a3b8] hover:bg-[#1f2d42] hover:text-white'
                        }`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <Icon className={`${isCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                        {!isCollapsed && (
                          <span className="truncate text-xs tracking-tight font-medium">
                            {item.shortLabel || item.label}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* ORTAK KURUMSAL ARAÇLAR GRUBU */}
            <div className="pt-2 border-t border-[#26354a]/80 space-y-1">
              {!isCollapsed ? (
                <div className="px-2 pb-1 text-[9.5px] font-extrabold uppercase tracking-wider text-[#64748b]">
                  ORTAK ARAÇLAR & SİSTEM
                </div>
              ) : (
                <div className="my-1 mx-auto h-0.5 w-6 rounded bg-[#26354a]" />
              )}

              {COMMON_SECTION.items.map((c) => {
                const Icon = c.icon
                const active = isActive(c)
                return (
                  <Link
                    key={c.label}
                    href={c.href}
                    onClick={onCloseMenu}
                    className={`group flex items-center rounded-xl transition-all duration-150 ${
                      isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-1.5'
                    } ${
                      active
                        ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                        : 'text-[#8da0b8] hover:bg-[#1f2d42] hover:text-white'
                    }`}
                    title={isCollapsed ? c.label : undefined}
                  >
                    <Icon className={`${isCollapsed ? 'size-5' : 'size-4'} shrink-0 text-[#697d96] group-hover:text-white`} />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate text-xs">{c.shortLabel || c.label}</span>
                        {c.badge && (
                          <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-[#1e2b3c] text-blue-300">
                            {c.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>

        {/* ALT KISIM: KURUM KARTI VE KURUM AYARI */}
        <div className="shrink-0 p-2.5 border-t border-[#26354a] bg-[#121a27]">
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => setIsKurumModalOpen(true)}
              className="group relative flex size-10 mx-auto items-center justify-center rounded-xl bg-[#1e2a3c] text-[#3b82f6] hover:bg-[#2563eb] hover:text-white transition-all shadow-inner"
              title="Kurum ve Antet Ayarları"
            >
              <Building2 className="size-5" />
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-7 rounded-lg bg-[#1e2a3c] text-[#3b82f6] flex items-center justify-center shrink-0 border border-[#2a3c54]">
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
                  className="p-1.5 text-[#71859d] hover:text-white hover:bg-[#1e2a3c] rounded-lg transition"
                  title="Kurum Bilgilerini Düzenle"
                >
                  <Sliders className="size-3.5" />
                </button>
              </div>

              {/* Hızlı Bilgi Şeridi */}
              <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[#233146]/80 text-[9.5px]">
                <div className="bg-[#182333] px-2 py-1 rounded text-[#8da0b8] truncate">
                  <span className="text-[#5b6f88]">Müh. Kodu: </span>
                  <span className="font-mono text-white">{kurumInfo.muhasebeKodu}</span>
                </div>
                <div className="bg-[#182333] px-2 py-1 rounded text-[#8da0b8] truncate">
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
