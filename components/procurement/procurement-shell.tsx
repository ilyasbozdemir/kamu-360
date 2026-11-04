'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileSignature,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  GitBranch,
  Layers,
  ListFilter,
  MoreVertical,
  Printer,
  Scale,
  Sparkles,
  Star,
  Table,
} from 'lucide-react'
import { SCREENS } from './screens'
import { usePrintHub } from '@/lib/print-hub-context'
import { ProcurementListView } from './procurement-list-view'

export const PROCUREMENT_PAGES = [
  {
    step: 1,
    slug: 'malzeme-bilgisi',
    path: '/malzeme-bilgisi',
    title: 'Malzeme Satın Alma Bilgisi',
    shortTitle: 'Malzeme Bilgisi',
    icon: Star,
    desc: 'Tedarikçi koşulları, tolerans ve birim fiyat tanımları',
  },
  {
    step: 2,
    slug: 'teklif-degerlendirme',
    path: '/teklif-degerlendirme',
    title: 'Satın Alma Teklif Değerlendirme Detayı',
    shortTitle: 'Teklif Değerlendirme',
    icon: Layers,
    desc: 'Firma teklifleri karşılaştırması ve en avantajlı teklif seçimi',
  },
  {
    step: 3,
    slug: 'ihale-dosyasi',
    path: '/ihale-dosyasi',
    title: 'Satın Alma Dosyası (İhale Onayı)',
    shortTitle: 'İhale Dosyası',
    icon: FolderOpen,
    desc: 'Komisyon onayı, şartname ve ihale usul parametreleri',
  },
  {
    step: 4,
    slug: 'dogrudan-temin',
    path: '/dogrudan-temin',
    title: 'Doğrudan Temin (22/d)',
    shortTitle: 'Doğrudan Temin',
    icon: FileText,
    desc: 'Piyasa fiyat araştırma tutanağı ve harcama yetkilisi oluru',
  },
  {
    step: 5,
    slug: 'sozlesme',
    path: '/sozlesme',
    title: 'Satın Alma Sözleşmesi',
    shortTitle: 'Sözleşme Yönetimi',
    icon: FileSignature,
    desc: 'Kesin teminat, teslimat ve resmi sözleşme hükümleri',
  },
]

export function ProcurementShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { addToPrintQueue } = usePrintHub()

  // Görünüm Modu: Detay (Form) veya Liste (Tablo)
  const [viewMode, setViewMode] = useState<'detay' | 'liste'>('detay')
  const [isDossierMenuOpen, setIsDossierMenuOpen] = useState(false)

  // URL query parametre kontrolü (ör: ?view=liste veya ?mode=list)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const mode = params.get('mode') || params.get('view')
      if (mode === 'liste' || mode === 'list' || mode === 'table') {
        setViewMode('liste')
      }
    }
  }, [pathname])

  const isTeminMasasi = pathname === '/temin-dosyasi' || pathname.startsWith('/temin-dosyasi')

  let activeIndex = 0
  if (pathname === '/teklif-degerlendirme' || pathname.includes('teklif-degerlendirme')) {
    activeIndex = 1
  } else if (pathname === '/ihale-dosyasi' || pathname.includes('ihale-dosyasi')) {
    activeIndex = 2
  } else if (pathname === '/dogrudan-temin' || pathname.includes('dogrudan-temin')) {
    activeIndex = 3
  } else if (pathname === '/sozlesme' || pathname.includes('sozlesme')) {
    activeIndex = 4
  } else {
    activeIndex = 0
  }

  const screen = SCREENS[activeIndex] || SCREENS[0]
  const currentStep = PROCUREMENT_PAGES[activeIndex]
  const prevPage =
    PROCUREMENT_PAGES[(activeIndex - 1 + PROCUREMENT_PAGES.length) % PROCUREMENT_PAGES.length]
  const nextPage = PROCUREMENT_PAGES[(activeIndex + 1) % PROCUREMENT_PAGES.length]

  // Görünüm Modu ve URL senkronizasyonu
  const handleSetViewMode = (mode: 'detay' | 'liste') => {
    setViewMode(mode)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('view', mode)
      window.history.replaceState({}, '', url.toString())
    }
  }

  // Geri tuşu mantığı:
  // Detay modundaysa -> Doğrudan Liste Moduna döner
  // Liste modundaysa -> /temin-dosyasi masasına veya Ana Sayfaya döner
  const handleBackButtonClick = () => {
    if (viewMode === 'detay') {
      handleSetViewMode('liste')
    } else {
      router.push('/temin-dosyasi')
    }
  }

  return (
    <div className="space-y-3 pb-8">
      {/* 1. BREADCRUMB */}
      <div className="flex h-[46px] items-center justify-between border-b border-[#e3e6eb] bg-white px-4 text-[11px] text-[#7b8794]">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#26384c]">
            ⌂ Kamu 360
          </Link>
          <span className="text-[#adb5bd]">/</span>
          <Link href="/malzeme-bilgisi" className="font-semibold text-[#172334] hover:text-[#0c67dc]">
            Satın Alma Yönetimi
          </Link>
          <span className="text-[#adb5bd]">/</span>
          {isTeminMasasi ? (
            <span className="font-semibold text-[#2d62d7]">Doğrudan Temin Dosyaları (22/d Masası)</span>
          ) : viewMode === 'liste' ? (
            <span className="font-semibold text-[#2d62d7]">Dosya ve Kayıt Listesi</span>
          ) : (
            <span className="font-semibold text-[#2d62d7]">{currentStep.title}</span>
          )}
        </div>

        {/* Sağ: Diğer Modüllere Hızlı Entegrasyon Butonları */}
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/temin-dosyasi"
            className="flex items-center gap-1.5 rounded border border-[#d9dee5] bg-[#f8f9fb] px-2.5 py-1 text-[11px] font-semibold text-[#172334] transition hover:border-[#2d62d7] hover:text-[#2d62d7] hover:bg-white"
            title="4734 Sayılı KİK Madde 22/d Doğrudan Temin Dosyaları Karar Masası"
          >
            <FolderOpen className="size-3.5 text-[#2d62d7]" />
            <span>Doğrudan Temin Masası</span>
          </Link>

          <Link
            href="/belge-builder"
            className="flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50/60 px-2.5 py-1 text-[11px] font-semibold text-[#2d62d7] transition hover:bg-blue-100"
            title="Bu dosya için Resmî EBYS Üst Yazısı veya Onay Belgesi oluştur"
          >
            <FileSignature className="size-3.5" />
            <span>EBYS Belge Stüdyosu</span>
          </Link>

          <Link
            href="/is-akislari"
            className="flex items-center gap-1.5 rounded border border-[#d9dee5] bg-[#f8f9fb] px-2.5 py-1 text-[11px] font-semibold text-[#172334] transition hover:border-[#2d62d7] hover:text-[#2d62d7] hover:bg-white"
            title="EBYS Paraf ve İmza Rota Akışını Yönet"
          >
            <GitBranch className="size-3.5 text-[#2d62d7]" />
            <span>Onay &amp; Paraf Rotası</span>
          </Link>

          <Link
            href="/gelir-ihaleleri/dosya-tanimi"
            className="flex items-center gap-1.5 rounded border border-[#d9dee5] bg-[#f8f9fb] px-2.5 py-1 text-[11px] font-semibold text-[#172334] transition hover:border-[#2d62d7] hover:text-[#2d62d7] hover:bg-white"
            title="2886 Gelir İhaleleri ve Satış/Kiralama Masasına Geç"
          >
            <Scale className="size-3.5 text-[#2d62d7]" />
            <span>Gelir İhaleleri (2886)</span>
          </Link>
        </div>
      </div>

      {/* 2. ETKİLEŞİMLİ 5 ADIMLI SÜREÇ AKIŞ ÇUBUĞU VEYA DOĞRUDAN TEMİN MASASI */}
      {isTeminMasasi ? (
        <div className="space-y-3">
          {/* Doğrudan Temin Masası Üst Navigasyon & Geri Butonu */}
          <div className="mx-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e1e5ea] bg-white p-2.5 shadow-xs">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => router.push('/malzeme-bilgisi?view=liste')}
                className="flex size-7 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#26384c] shadow-2xs transition hover:border-[#2d62d7] hover:bg-[#eef3ff] hover:text-[#2d62d7]"
                title="Geri Dön: Satın Alma & Temin Dosyaları Listesine Dön"
                aria-label="Geri Dön"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-[#172334]">
                    Doğrudan Temin Dosyaları Karar &amp; İdare Masası
                  </h1>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300/60">
                    4734 Sayılı KİK Madde 22/d
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Satın Alma Yönetimi &bull; 7 Sekmeli Dosya Yönetimi, SQLite Veritabanı ve 30 Resmî Matbu Belge Üretimi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/malzeme-bilgisi?view=liste"
                className="flex items-center gap-1.5 rounded border border-[#d9dee5] bg-[#f8f9fb] px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#2d62d7] hover:text-[#2d62d7] transition"
              >
                <Table className="size-3.5 text-[#2d62d7]" />
                <span>Dosya Listesi (Tablo)</span>
              </Link>
              <Link
                href="/malzeme-bilgisi"
                className="flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2d62d7] hover:bg-blue-100 transition"
              >
                <span>5-Adım İhale Süreci</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Temin Dosyası Yönetici Arayüzü */}
          <div className="px-1">{children}</div>
        </div>
      ) : (
        <>
          {/* 2. ETKİLEŞİMLİ 5 ADIMLI SÜREÇ AKIŞ ÇUBUĞU (PROCESS STEPPER) */}
          <div className="mx-3 rounded-lg border border-[#e1e5ea] bg-white p-2.5 shadow-xs">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {PROCUREMENT_PAGES.map((p, idx) => {
            const isCurrent = idx === activeIndex && viewMode === 'detay'
            const isPassed = idx < activeIndex
            const Icon = p.icon

            return (
              <button
                type="button"
                key={p.slug}
                onClick={() => {
                  handleSetViewMode('detay')
                  router.push(p.path)
                }}
                className={`group relative flex items-center gap-2.5 rounded-md border p-2 text-left transition ${
                  isCurrent
                    ? 'border-[#2d62d7] bg-[#eef3ff] shadow-xs'
                    : isPassed
                    ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50'
                    : 'border-transparent bg-gray-50/60 hover:border-gray-200 hover:bg-gray-100'
                }`}
              >
                {/* Adım No veya Onay İkonu */}
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-[#2d62d7] text-white shadow-xs'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  }`}
                >
                  {isPassed ? <Check className="size-3.5" /> : p.step}
                </div>

                {/* Başlık ve İpucu */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p
                      className={`truncate text-[11px] font-bold ${
                        isCurrent
                          ? 'text-[#2d62d7]'
                          : isPassed
                          ? 'text-emerald-900'
                          : 'text-[#475569]'
                      }`}
                    >
                      {p.shortTitle}
                    </p>
                  </div>
                  <p className="hidden truncate text-[9.5pt] text-gray-500 xl:block">
                    {idx === 0
                      ? 'Tedarik Koşulları'
                      : idx === 1
                      ? 'Teklif Matrisi'
                      : idx === 2
                      ? 'Şartname & Karar'
                      : idx === 3
                      ? 'Piyasa Tutanağı'
                      : 'Kesin Sözleşme'}
                  </p>
                </div>

                {/* Aktif İndikatörü */}
                {isCurrent && (
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-[#2d62d7]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. EKRAN BAŞLIĞI, GERİ BUTONU VE GÖRÜNÜM MODU GEÇİŞ ÇUBUĞU */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-1">
        <div className="flex items-center gap-2.5">
          {/* GERİ TUŞU: Detaydayken Liste Moduna döner, Listedeyken Dosya Masasına döner */}
          <button
            type="button"
            onClick={handleBackButtonClick}
            className="flex size-7 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#26384c] shadow-2xs transition hover:border-[#2d62d7] hover:bg-[#eef3ff] hover:text-[#2d62d7]"
            title={
              viewMode === 'detay'
                ? 'Geri Dön: Satın Alma & Temin Dosyaları Listesine Geç'
                : 'Doğrudan Temin Karar Masasına Git (/temin-dosyasi)'
            }
            aria-label="Geri tuşu: Liste görünümüne dön"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Hızlı Dosya Masası Kısayolu */}
          <Link
            href="/temin-dosyasi"
            className="hidden items-center gap-1 rounded border border-[#d9dee5] bg-[#f8f9fb] px-2 py-1 text-[10.5px] font-semibold text-[#5b6877] hover:border-[#2d62d7] hover:bg-white hover:text-[#2d62d7] md:flex transition"
            title="Tüm Doğrudan Temin Dosyaları ve Karar Masası"
          >
            <FolderOpen className="size-3 text-[#2d62d7]" />
            <span>Dosya Masası</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-bold text-[#172334]">
                {viewMode === 'liste'
                  ? 'Satın Alma ve Temin Dosyaları Listesi'
                  : currentStep.title}
              </h1>

              {/* Aktif Dosya Seçici Rozeti (Detay Modunda) */}
              {viewMode === 'detay' && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDossierMenuOpen(!isDossierMenuOpen)}
                    className="flex items-center gap-1 rounded border border-blue-200 bg-blue-50/80 px-2 py-0.5 text-[10.5px] font-semibold text-[#2d62d7] hover:bg-blue-100 transition"
                    title="Aktif Dosyayı Değiştir"
                  >
                    <span>Dosya: {screen.docNo}</span>
                    <ChevronDown className="size-3" />
                  </button>

                  {isDossierMenuOpen && (
                    <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-md border border-[#d9dee5] bg-white p-1.5 shadow-lg text-[11px]">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Hızlı Dosya Değiştir
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDossierMenuOpen(false)
                          router.push('/malzeme-bilgisi')
                        }}
                        className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-gray-700 hover:bg-[#eef3ff] hover:text-[#2d62d7]"
                      >
                        <span className="font-semibold">24-00000000</span>
                        <span className="text-[9.5px] text-gray-500">Toner Alımı</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDossierMenuOpen(false)
                          router.push('/teklif-degerlendirme')
                        }}
                        className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-gray-700 hover:bg-[#eef3ff] hover:text-[#2d62d7]"
                      >
                        <span className="font-semibold">24-0000005</span>
                        <span className="text-[9.5px] text-gray-500">Teklif Matrisi</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDossierMenuOpen(false)
                          router.push('/dogrudan-temin')
                        }}
                        className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-gray-700 hover:bg-[#eef3ff] hover:text-[#2d62d7]"
                      >
                        <span className="font-semibold">2026/DT-001</span>
                        <span className="text-[9.5px] text-gray-500">22/d Doğrudan Temin</span>
                      </button>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link
                          href="/temin-dosyasi"
                          className="flex items-center gap-1.5 px-2 py-1 text-[10.5px] font-bold text-[#2d62d7] hover:underline"
                        >
                          <FolderOpen className="size-3" />
                          <span>Tüm Dosyalar Masasına Git ➔</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              {viewMode === 'liste'
                ? 'Kurum içi tüm aktif ve tamamlanan doğrudan temin ve ihale dosyaları genel tablosu'
                : currentStep.desc}
            </p>
          </div>
        </div>

        {/* Sağ: GÖRÜNÜM MODU SEÇİCİSİ + YAZDIR VE EBYS AKSİYONLARI */}
        <div className="flex flex-wrap items-center gap-2">
          {/* GÖRÜNÜM MODU SEKMESİ (LİSTE vs DETAY MODU) */}
          <div className="flex items-center rounded-md border border-[#d9dee5] bg-[#f8f9fb] p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => handleSetViewMode('liste')}
              className={`flex h-7 items-center gap-1.5 rounded px-2.5 text-[11px] font-bold transition ${
                viewMode === 'liste'
                  ? 'border border-[#d9dee5] bg-white text-[#2d62d7] shadow-xs'
                  : 'text-[#5b6877] hover:text-[#172334]'
              }`}
              title="Tüm Satın Alma ve Doğrudan Temin Kayıtlarını Tablo Olarak Gör"
            >
              <Table className="size-3.5" />
              <span>Liste Modu</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetViewMode('detay')}
              className={`flex h-7 items-center gap-1.5 rounded px-2.5 text-[11px] font-bold transition ${
                viewMode === 'detay'
                  ? 'border border-[#d9dee5] bg-white text-[#2d62d7] shadow-xs'
                  : 'text-[#5b6877] hover:text-[#172334]'
              }`}
              title="Mevcut Adımın Detay ve Düzenleme Formu"
            >
              <FileText className="size-3.5" />
              <span>Detay / Form Modu</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              addToPrintQueue({
                docNo: screen.docNo,
                title: `${currentStep.title} Dokümanı`,
                category: 'Satın Alma (4734)',
                format: 'A4 Dikey',
                pageCount: 2,
              })
            }
            className="inline-flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-[11px] font-bold text-[#2d62d7] shadow-xs transition hover:bg-blue-100"
            title="Bu belgeyi Yazdırma ve Dışa Aktarma Merkezine kuyruğa ekle"
          >
            <Printer className="size-3.5 text-[#2d62d7]" />
            <span className="hidden sm:inline">Yazdırma Merkezine Gönder</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
          >
            <Printer className="size-3.5 text-gray-500" />
            <span className="hidden sm:inline">Hızlı Yazdır</span>
          </button>

          <Link
            href="/belge-builder"
            className="inline-flex items-center gap-1.5 rounded bg-[#2d62d7] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-xs transition hover:bg-[#2455bd]"
          >
            <FileSignature className="size-3.5" />
            <span>EBYS Belgesi</span>
          </Link>
        </div>
      </div>

      {/* 4. ANA İÇERİK: SEÇİLİ GÖRÜNÜM MODUNA GÖRE RENDER EDİLİR */}
      {viewMode === 'liste' ? (
        <ProcurementListView
          onOpenRecord={(rec) => {
            handleSetViewMode('detay')
            router.push(`/${rec.stepSlug}`)
          }}
        />
      ) : (
        <div className="px-1">{children}</div>
      )}

      {/* 5. ALT ADIM BAĞLANTI ÇUBUĞU (AKICI SÜREÇ GEÇİŞİ - DETAY MODUNDA GÖSTERİLİR) */}
      {viewMode === 'detay' && (
        <div className="mx-3 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e1e5ea] bg-white p-3.5 shadow-xs">
          <div>
            <span className="text-[11px] text-gray-500">Mevcut Aşama: </span>
            <span className="text-[12px] font-bold text-gray-800">
              Adım {currentStep.step} / 5 — {currentStep.shortTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSetViewMode('liste')}
              className="inline-flex items-center gap-1.5 rounded border border-[#d9dee5] bg-[#f8f9fb] px-3.5 py-2 text-[12px] font-semibold text-[#172334] hover:bg-white hover:border-[#2d62d7] hover:text-[#2d62d7] transition"
            >
              <Table className="size-4 text-[#2d62d7]" />
              <span>Liste Moduna Dön</span>
            </button>

            {activeIndex > 0 && (
              <Link
                href={prevPage.path}
                className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3.5 py-2 text-[12px] font-semibold text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="size-4" />
                <span>Önceki Adım</span>
              </Link>
            )}

            {activeIndex < PROCUREMENT_PAGES.length - 1 ? (
              <Link
                href={nextPage.path}
                className="inline-flex items-center gap-2 rounded bg-[#2d62d7] px-5 py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#2455bd]"
              >
                <span>Sonraki Adım: {nextPage.shortTitle}</span>
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link
                href="/gelir-ihaleleri/dosya-tanimi"
                className="inline-flex items-center gap-2 rounded bg-[#2d62d7] px-5 py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#2455bd]"
              >
                <span>Satın Alma Tamamlandı ➔ Gelir Masasına Geç</span>
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}
