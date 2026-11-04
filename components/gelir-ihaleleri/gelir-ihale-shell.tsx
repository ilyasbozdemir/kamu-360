'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  FileText,
  Gavel,
  Layers,
  MoreVertical,
  Printer,
  Scale,
  Table,
} from 'lucide-react'
import { usePrintHub } from '@/lib/print-hub-context'
import { VarliklarTutanagiModal } from './varliklar-tutanagi-modal'
import { GelirIhaleListView } from './gelir-ihale-list-view'

export const GELIR_IHALE_PAGES = [
  { slug: 'dosya-tanimi', path: '/gelir-ihaleleri/dosya-tanimi', title: 'İhale Dosyası & Muhammen Bedel' },
  { slug: 'teklif-artirma', path: '/gelir-ihaleleri/teklif-artirma', title: 'İstekliler & Açık Artırma (Pey)' },
  { slug: 'komisyon-karari', path: '/gelir-ihaleleri/komisyon-karari', title: 'Komisyon Kararı & İhale Onayı' },
  { slug: 'sozlesme-tahsilat', path: '/gelir-ihaleleri/sozlesme-tahsilat', title: 'Sözleşme & Tahsilat Planı' },
  { slug: 'varlik-envanteri', path: '/gelir-ihaleleri/varlik-envanteri', title: 'Kiralanabilir & Satılabilir Varlıklar' },
]

export function GelirIhaleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { addToPrintQueue } = usePrintHub()

  // Görünüm Modu: Detay (Form) veya Liste (Tablo)
  const [viewMode, setViewMode] = useState<'detay' | 'liste'>('detay')
  const [showTutanakModal, setShowTutanakModal] = useState(false)
  const [isDossierMenuOpen, setIsDossierMenuOpen] = useState(false)

  let activeIndex = 0
  if (pathname.includes('teklif-artirma')) {
    activeIndex = 1
  } else if (pathname.includes('komisyon-karari')) {
    activeIndex = 2
  } else if (pathname.includes('sozlesme-tahsilat')) {
    activeIndex = 3
  } else if (pathname.includes('varlik-envanteri')) {
    activeIndex = 4
  } else {
    activeIndex = 0
  }

  const currentPage = GELIR_IHALE_PAGES[activeIndex]
  const prevPage = GELIR_IHALE_PAGES[(activeIndex - 1 + GELIR_IHALE_PAGES.length) % GELIR_IHALE_PAGES.length]
  const nextPage = GELIR_IHALE_PAGES[(activeIndex + 1) % GELIR_IHALE_PAGES.length]

  // Görünüm Modu ve URL senkronizasyonu
  const handleSetViewMode = (mode: 'detay' | 'liste') => {
    setViewMode(mode)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('view', mode)
      window.history.replaceState({}, '', url.toString())
    }
  }

  // Geri tuşu mantığı
  const handleBackButtonClick = () => {
    if (viewMode === 'detay') {
      handleSetViewMode('liste')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="space-y-2 pb-8">
      {/* 1. Breadcrumb */}
      <div className="flex h-[46px] items-center justify-between border-b border-[#e3e6eb] bg-white px-4 text-[11px] text-[#7b8794]">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#26384c]">⌂ Kamu 360</Link>
          <span className="text-[#adb5bd]">/</span>
          <Link href="/gelir-ihaleleri/dosya-tanimi" className="font-semibold text-[#7c3aed] hover:underline">
            Gelir Yönetimi (2886)
          </Link>
          <span className="text-[#adb5bd]">/</span>
          {viewMode === 'liste' ? (
            <span className="font-semibold text-purple-700">2886 Gelir İhaleleri Listesi</span>
          ) : (
            <span className="font-semibold text-[#26384c]">{currentPage.title}</span>
          )}
        </div>

        {/* Sağ: Satın Alma & EBYS Geçiş Butonları */}
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/malzeme-bilgisi"
            className="flex items-center gap-1.5 rounded border border-[#d9dee5] bg-[#f8f9fb] px-2.5 py-1 text-[11px] font-semibold text-[#172334] transition hover:border-[#2d62d7] hover:text-[#2d62d7] hover:bg-white"
          >
            <span>Satın Alma Masası (4734) ➔</span>
          </Link>
        </div>
      </div>

      {/* 2. Screen Title & Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-2 pt-2">
        <div className="flex items-center gap-3">
          {/* GERİ TUŞU: Detaydayken Liste Moduna, Listedeyken Ana Panele döner */}
          <button
            type="button"
            onClick={handleBackButtonClick}
            className="flex size-7 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#26384c] shadow-2xs hover:border-purple-600 hover:bg-purple-50 hover:text-purple-700 transition"
            aria-label="Geri tuşu: İhale listesine dön"
            title={viewMode === 'detay' ? '2886 Gelir İhaleleri Listesine Dön' : 'Kamu 360 Ana Paneline Dön'}
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="rounded bg-purple-50 p-1 text-purple-700 border border-purple-200">
              <Scale className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-bold text-[#172334]">
                  {viewMode === 'liste'
                    ? '2886 Sayılı Devlet İhale Kanunu Dosyaları Listesi'
                    : currentPage.title}
                </h1>

                {/* Hızlı İhale Seçici Dropdown (Detay Modunda) */}
                {viewMode === 'detay' && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDossierMenuOpen(!isDossierMenuOpen)}
                      className="flex items-center gap-1 rounded border border-purple-200 bg-purple-50/80 px-2 py-0.5 text-[10.5px] font-semibold text-purple-700 hover:bg-purple-100 transition"
                      title="Aktif İhale Dosyasını Değiştir"
                    >
                      <span>İhale: 2886-2026/01</span>
                      <ChevronDown className="size-3" />
                    </button>

                    {isDossierMenuOpen && (
                      <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-md border border-[#d9dee5] bg-white p-1.5 shadow-lg text-[11px]">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Hızlı İhale Dosyası Seçimi
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDossierMenuOpen(false)
                            router.push('/gelir-ihaleleri/dosya-tanimi')
                          }}
                          className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                        >
                          <span className="font-semibold">2886-2026/01</span>
                          <span className="text-[9.5px] text-gray-500">Büfe Kiralaması (Madde 45)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDossierMenuOpen(false)
                            router.push('/gelir-ihaleleri/teklif-artirma')
                          }}
                          className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                        >
                          <span className="font-semibold">2886-2026/02</span>
                          <span className="text-[9.5px] text-gray-500">Kafeterya Kiralaması</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDossierMenuOpen(false)
                            router.push('/gelir-ihaleleri/sozlesme-tahsilat')
                          }}
                          className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                        >
                          <span className="font-semibold">2886-2026/03</span>
                          <span className="text-[9.5px] text-gray-500">Hurda Araç Satışı</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                {viewMode === 'liste'
                  ? 'Taşınmaz kiralama, satış, irtifak hakkı ve açık artırma süreçlerinin toplu tablosu'
                  : '2886 Sayılı Devlet İhale Kanunu Kapsamında Taşınmaz Kiralama ve Satış Süreci'}
              </p>
            </div>
          </div>
          <MoreVertical className="size-4 text-[#9aa3ad]" />
        </div>

        {/* Sağ: GÖRÜNÜM MODU + TUTANAK VE YAZDIRMA AKSİYONLARI */}
        <div className="flex flex-wrap items-center gap-2">
          {/* GÖRÜNÜM MODU SEÇİCİ */}
          <div className="flex items-center rounded-md border border-[#d9dee5] bg-[#f8f9fb] p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => handleSetViewMode('liste')}
              className={`flex h-7 items-center gap-1.5 rounded px-2.5 text-[11px] font-bold transition ${
                viewMode === 'liste'
                  ? 'border border-[#d9dee5] bg-white text-purple-700 shadow-xs'
                  : 'text-[#5b6877] hover:text-[#172334]'
              }`}
              title="Tüm 2886 İhale Dosyalarını Tablo Olarak Gör"
            >
              <Table className="size-3.5" />
              <span>Liste Modu</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetViewMode('detay')}
              className={`flex h-7 items-center gap-1.5 rounded px-2.5 text-[11px] font-bold transition ${
                viewMode === 'detay'
                  ? 'border border-[#d9dee5] bg-white text-purple-700 shadow-xs'
                  : 'text-[#5b6877] hover:text-[#172334]'
              }`}
              title="İhale Adımının Detay ve İşlem Ekranı"
            >
              <FileText className="size-3.5" />
              <span>Detay / Form Modu</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowTutanakModal(true)}
            className="inline-flex items-center gap-1.5 rounded border border-purple-300 bg-white px-2.5 py-1.5 text-[10.5px] font-bold text-purple-700 transition hover:bg-purple-50 shadow-2xs"
            title="2886 Sayılı Kanun Kiralanabilir &amp; Satılabilir Varlıklar A4 Tutanağını Görüntüle &amp; Yazdır"
          >
            <FileText className="size-3 text-purple-600" />
            <span>A4 Tutanağı Gör &amp; Yazdır</span>
          </button>

          <button
            type="button"
            onClick={() =>
              addToPrintQueue({
                docNo: `2886-${currentPage.slug}`,
                title: `${currentPage.title} Tutanağı`,
                category: 'Gelir İhalesi (2886)',
                format: 'A4 Dikey',
                pageCount: 1,
              })
            }
            className="inline-flex items-center gap-1.5 rounded border border-purple-200 bg-purple-50/70 px-2.5 py-1.5 text-[10.5px] font-bold text-purple-800 transition hover:bg-purple-100"
            title="Bu tutanağı Yazdırma Merkezine gönder"
          >
            <Printer className="size-3 text-purple-700" />
            <span className="hidden sm:inline">Yazdırma Merkezine Gönder</span>
          </button>
        </div>
      </div>

      {/* 3. 5 Adımlı Ekran Butonları (Detay Modunda Aktif) */}
      <div className="flex flex-wrap items-center gap-1.5 px-5 pb-2" role="tablist" aria-label="Ekranlar">
        {GELIR_IHALE_PAGES.map((p, i) => {
          const isCurrent = i === activeIndex && viewMode === 'detay'
          return (
            <button
              type="button"
              key={p.slug}
              onClick={() => {
                handleSetViewMode('detay')
                router.push(p.path)
              }}
              role="tab"
              aria-selected={isCurrent}
              className={`rounded px-2.5 py-1 text-[10px] font-medium transition ${
                isCurrent
                  ? 'bg-[#7c3aed] text-white shadow-xs font-semibold'
                  : 'border border-[#d7dce3] bg-white text-[#526174] hover:bg-[#f2f5ff]'
              }`}
            >
              {i + 1}. {p.title}
            </button>
          )
        })}
      </div>

      {/* 4. Ana İçerik: Seçili Görünüm Moduna Göre */}
      {viewMode === 'liste' ? (
        <GelirIhaleListView
          onOpenRecord={(rec) => {
            handleSetViewMode('detay')
            router.push(`/gelir-ihaleleri/${rec.stepSlug}`)
          }}
        />
      ) : (
        <div className="px-4 py-1 sm:px-5">{children}</div>
      )}

      {/* 2886 Sayılı Kanun Kiralanabilir & Satılabilir Varlıklar Tutanağı A4 Modalı */}
      <VarliklarTutanagiModal
        isOpen={showTutanakModal}
        onClose={() => setShowTutanakModal(false)}
      />

      {/* 5. Pagination Footer (Detay Modunda) */}
      {viewMode === 'detay' && (
        <div className="flex items-center justify-center gap-2 pb-6 pt-3">
          <Link
            href={prevPage.path}
            className="rounded border bg-white p-1.5 text-[#526174] transition hover:bg-[#f2f5ff]"
            aria-label="Önceki ekran"
          >
            <ChevronLeft className="size-4" />
          </Link>
          {GELIR_IHALE_PAGES.map((p, i) => (
            <Link
              key={p.slug}
              href={p.path}
              aria-label={`${p.title} ekranını göster`}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'w-8 bg-[#7c3aed]' : 'w-2 bg-[#bfc7d1]'
              }`}
            />
          ))}
          <Link
            href={nextPage.path}
            className="rounded border bg-white p-1.5 text-[#526174] transition hover:bg-[#f2f5ff]"
            aria-label="Sonraki ekran"
          >
            <ChevronRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
