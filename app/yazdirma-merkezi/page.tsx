'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  Layers,
  MoreVertical,
  Printer,
  QrCode,
  RotateCcw,
  Save,
  Scale,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  Type,
  Upload,
} from 'lucide-react'
import { PrintJob, usePrintHub } from '@/lib/print-hub-context'
import { UniversalDocumentModal } from '@/components/document-preview/universal-document-modal'
import { getKurumVeRotaAyarlari, saveKurumVeRotaAyarlari } from '@/lib/settings/kurum-ve-rota-ayarlari'
import { WORKDESK_TEMPLATES_CATALOG } from '@/lib/document-engine/workdesk-adapter'

export default function YazdirmaMerkeziPage() {
  const { printQueue, removeFromPrintQueue, clearPrintQueue, batchPrint, addToPrintQueue } =
    usePrintHub()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'kuyruk' | 'ayarlar' | 'sablonlar'>('kuyruk')
  const [printPaper, setPrintPaper] = useState<'A4_DIKEY' | 'A4_YATAY'>('A4_DIKEY')
  const [marginSetting, setMarginSetting] = useState<'STANDART_25MM' | 'DAR_15MM'>('STANDART_25MM')
  const [antetliKagitModu, setAntetliKagitModu] = useState(false)
  const [eImzaKasesiDahil, setEImzaKasesiDahil] = useState(true)

  // Genişletilmiş Profesyonel Baskı & Antet Ayarları
  const [pageSize, setPageSize] = useState<'A4' | 'A3' | 'A5'>('A4')
  const [fontFamily, setFontFamily] = useState<'Times New Roman' | 'Arial' | 'Segoe UI' | 'Roboto'>('Times New Roman')
  const [fontSize, setFontSize] = useState<'10pt' | '11pt' | '12pt'>('11pt')
  const [kurumAdi, setKurumAdi] = useState('T.C. İSTANBUL BÜYÜKŞEHİR BELEDİYESİ')
  const [daireBaskanligi, setDaireBaskanligi] = useState('Destek Hizmetleri Dairesi Başkanlığı')
  const [subeMudurlugu, setSubeMudurlugu] = useState('Satın Alma Şube Müdürlüğü')
  const [antetTipi, setAntetTipi] = useState<'tek' | 'cift' | 'sade'>('tek')
  const [logoGoster, setLogoGoster] = useState(true)
  const [watermark, setWatermark] = useState<'YOK' | 'TASLAK' | 'ASLI GİBİDİR' | 'ÖN ÇALIŞMA' | 'İPTAL'>('YOK')
  const [gizlilikDerecesi, setGizlilikDerecesi] = useState<'YOK' | 'HİZMETE ÖZEL' | 'GİZLİ'>('YOK')
  const [sayfaNumarasiFormati, setSayfaNumarasiFormati] = useState<'SAYFA_X_Y' | 'X_Y' | 'YOK'>('SAYFA_X_Y')
  const [qrKodGoster, setQrKodGoster] = useState(true)
  const [barkodGoster, setBarkodGoster] = useState(false)
  const [komisyonDuzeni, setKomisyonDuzeni] = useState<'3_LU' | '4_LU' | '5_LI'>('3_LU')
  const [muhurYeriGoster, setMuhurYeriGoster] = useState(true)
  const [pdfDpi, setPdfDpi] = useState<'300' | '150'>('300')
  const [dosyaIsimFormati, setDosyaIsimFormati] = useState('{DOSYA_NO}_{BELGE_KODU}_{TARIH}')
  const [settingsToast, setSettingsToast] = useState<string | null>(null)
  const [selectedTemplateCat, setSelectedTemplateCat] = useState<string>('TÜMÜ')

  // LocalStorage'dan kayıtlı ayarları yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem('temin360_baski_ayarlari')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.printPaper) setPrintPaper(parsed.printPaper)
        if (parsed.marginSetting) setMarginSetting(parsed.marginSetting)
        if (parsed.antetliKagitModu !== undefined) setAntetliKagitModu(parsed.antetliKagitModu)
        if (parsed.eImzaKasesiDahil !== undefined) setEImzaKasesiDahil(parsed.eImzaKasesiDahil)
        if (parsed.pageSize) setPageSize(parsed.pageSize)
        if (parsed.fontFamily) setFontFamily(parsed.fontFamily)
        if (parsed.fontSize) setFontSize(parsed.fontSize)
        if (parsed.kurumAdi) setKurumAdi(parsed.kurumAdi)
        if (parsed.daireBaskanligi) setDaireBaskanligi(parsed.daireBaskanligi)
        if (parsed.subeMudurlugu) setSubeMudurlugu(parsed.subeMudurlugu)
        if (parsed.antetTipi) setAntetTipi(parsed.antetTipi)
        if (parsed.logoGoster !== undefined) setLogoGoster(parsed.logoGoster)
        if (parsed.watermark) setWatermark(parsed.watermark)
        if (parsed.gizlilikDerecesi) setGizlilikDerecesi(parsed.gizlilikDerecesi)
        if (parsed.sayfaNumarasiFormati) setSayfaNumarasiFormati(parsed.sayfaNumarasiFormati)
        if (parsed.qrKodGoster !== undefined) setQrKodGoster(parsed.qrKodGoster)
        if (parsed.barkodGoster !== undefined) setBarkodGoster(parsed.barkodGoster)
        if (parsed.komisyonDuzeni) setKomisyonDuzeni(parsed.komisyonDuzeni)
        if (parsed.muhurYeriGoster !== undefined) setMuhurYeriGoster(parsed.muhurYeriGoster)
        if (parsed.pdfDpi) setPdfDpi(parsed.pdfDpi)
        if (parsed.dosyaIsimFormati) setDosyaIsimFormati(parsed.dosyaIsimFormati)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleSaveSettings = () => {
    const payload = {
      printPaper,
      marginSetting,
      antetliKagitModu,
      eImzaKasesiDahil,
      pageSize,
      fontFamily,
      fontSize,
      kurumAdi,
      daireBaskanligi,
      subeMudurlugu,
      antetTipi,
      logoGoster,
      watermark,
      gizlilikDerecesi,
      sayfaNumarasiFormati,
      qrKodGoster,
      barkodGoster,
      komisyonDuzeni,
      muhurYeriGoster,
      pdfDpi,
      dosyaIsimFormati,
    }
    try {
      localStorage.setItem('temin360_baski_ayarlari', JSON.stringify(payload))
      saveKurumVeRotaAyarlari({
        kurumAdi,
        daireBaskanligi,
        subeMudurlugu,
        karekodGoster: qrKodGoster,
        barkodGoster,
        antetTipi,
      })
    } catch {
      // ignore
    }
    setSettingsToast('Baskı ve antet ayarları başarıyla kaydedildi!')
    setTimeout(() => setSettingsToast(null), 3500)
  }

  const handleResetSettings = () => {
    setPrintPaper('A4_DIKEY')
    setMarginSetting('STANDART_25MM')
    setAntetliKagitModu(false)
    setEImzaKasesiDahil(true)
    setPageSize('A4')
    setFontFamily('Times New Roman')
    setFontSize('11pt')
    setKurumAdi('T.C. İSTANBUL BÜYÜKŞEHİR BELEDİYESİ')
    setDaireBaskanligi('Destek Hizmetleri Dairesi Başkanlığı')
    setSubeMudurlugu('Satın Alma Şube Müdürlüğü')
    setAntetTipi('tek')
    setLogoGoster(true)
    setWatermark('YOK')
    setGizlilikDerecesi('YOK')
    setSayfaNumarasiFormati('SAYFA_X_Y')
    setQrKodGoster(true)
    setBarkodGoster(false)
    setKomisyonDuzeni('3_LU')
    setMuhurYeriGoster(true)
    setPdfDpi('300')
    setDosyaIsimFormati('{DOSYA_NO}_{BELGE_KODU}_{TARIH}')
    try {
      localStorage.removeItem('temin360_baski_ayarlari')
    } catch {
      // ignore
    }
    setSettingsToast('Tüm ayarlar fabrika standartlarına sıfırlandı.')
    setTimeout(() => setSettingsToast(null), 3500)
  }
  const [isUniversalModalOpen, setIsUniversalModalOpen] = useState(false)
  const [previewJobs, setPreviewJobs] = useState<PrintJob[]>([])
  const [activeJobId, setActiveJobId] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped')
  const [selectedDosyaFilter, setSelectedDosyaFilter] = useState<string>('all')
  const [expandedDossiers, setExpandedDossiers] = useState<Record<string, boolean>>({})

  const openPreviewForJob = (job: PrintJob) => {
    setPreviewJobs([job])
    setActiveJobId(job.id)
    setIsUniversalModalOpen(true)
  }

  const openPreviewForJobs = (jobs: PrintJob[], initialId?: string) => {
    setPreviewJobs(jobs)
    setActiveJobId(initialId || (jobs.length > 0 ? jobs[0].id : ''))
    setIsUniversalModalOpen(true)
  }

  // Dosya bazlı gruplama ve filtreleme
  const uniqueDossiers = useMemo(() => {
    const map = new Map<string, { dosyaNo: string; dosyaAdi: string; count: number }>()
    for (const job of printQueue) {
      const dNo = job.dosyaNo || 'GENEL'
      const dAdi = job.dosyaAdi || 'Genel / Tanımsız Dosya'
      const existing = map.get(dNo)
      if (existing) {
        existing.count++
      } else {
        map.set(dNo, { dosyaNo: dNo, dosyaAdi: dAdi, count: 1 })
      }
    }
    return Array.from(map.values())
  }, [printQueue])

  const filteredPrintQueue = useMemo(() => {
    if (selectedDosyaFilter === 'all') return printQueue
    return printQueue.filter((j) => (j.dosyaNo || 'GENEL') === selectedDosyaFilter)
  }, [printQueue, selectedDosyaFilter])

  const groupedByDosya = useMemo(() => {
    const groups: { [dNo: string]: { dosyaNo: string; dosyaAdi: string; jobs: typeof printQueue } } = {}
    for (const job of filteredPrintQueue) {
      const dNo = job.dosyaNo || 'GENEL'
      const dAdi = job.dosyaAdi || 'Genel / Tanımsız Dosya'
      if (!groups[dNo]) {
        groups[dNo] = { dosyaNo: dNo, dosyaAdi: dAdi, jobs: [] }
      }
      groups[dNo].jobs.push(job)
    }
    return Object.values(groups)
  }, [filteredPrintQueue])

  const toggleDossierExpand = (dosyaNo: string) => {
    setExpandedDossiers((prev) => ({
      ...prev,
      [dosyaNo]: prev[dosyaNo] === false ? true : false,
    }))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === printQueue.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(printQueue.map((j) => j.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handlePrintSelected = () => {
    const jobsToPrint = selectedIds.length
      ? printQueue.filter((j) => selectedIds.includes(j.id))
      : printQueue
    if (jobsToPrint.length === 0) return
    openPreviewForJobs(jobsToPrint)
  }

  return (
    <div className="space-y-3 pb-8">
      {/* 1. ÜST BREADCRUMB - Satın Alma Temasıyla 1:1 Uyumlu */}
      <div className="flex h-[46px] items-center justify-between border-b border-[#e3e6eb] bg-white px-4 text-[11px] text-[#7b8794]">
        <div className="flex items-center gap-2">
          <Link
            href="/temin-dosyasi"
            className="flex size-6 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#26384c] shadow-2xs hover:border-[#2d62d7] hover:bg-[#eef3ff] hover:text-[#2d62d7] transition"
            aria-label="Dosya Listesine Dön"
            title="Dosya Listesine Dön (/temin-dosyasi)"
          >
            <ChevronLeft className="size-3.5" />
          </Link>
          <Link href="/" className="hover:text-[#26384c]">
            ⌂ KAMU 360
          </Link>
          <span className="text-[#adb5bd]">/</span>
          <Link href="/malzeme-bilgisi" className="font-semibold text-[#172334] hover:text-[#0c67dc]">
            Satın Alma Yönetimi
          </Link>
          <span className="text-[#adb5bd]">/</span>
          <span className="font-semibold text-[#2d62d7]">Yazdırma ve Dışa Aktarma Merkezi</span>
        </div>

        {/* Sağ: Hızlı Kuyruk Yönetim Butonları */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearPrintQueue}
            disabled={printQueue.length === 0}
            className="flex h-7 items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-medium text-[#5b6877] transition hover:border-[#b8c2cc] hover:text-[#172334] disabled:opacity-40"
            title="Tüm yazdırma kuyruğunu temizle"
          >
            <Trash2 className="size-3 text-[#7b8794]" />
            <span>Kuyruğu Temizle</span>
          </button>

          <button
            type="button"
            onClick={handlePrintSelected}
            disabled={printQueue.length === 0}
            className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3.5 text-[11px] font-medium text-white transition hover:bg-[#2455bd] disabled:opacity-40"
            title="Seçili veya tüm belgeleri toplu yazdır"
          >
            <Printer className="size-3" />
            <span>
              {selectedIds.length > 0
                ? `Seçilenleri Yazdır (${selectedIds.length})`
                : `Tümünü Toplu Yazdır (${printQueue.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* 2. ANA ÇALIŞMA ALANI: SEKMELER & İÇERİK KARTI */}
      <div className="mx-3 rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)] overflow-hidden">
        {/* Sekme Başlıkları - Kamu 360 Sekme Standardı */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#e2e8f0] bg-[#f8f9fb] px-2 pt-1 text-[12px]">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('kuyruk')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 font-bold transition ${
                activeTab === 'kuyruk'
                  ? 'border-[#2d62d7] text-[#2d62d7] bg-white rounded-t'
                  : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <Printer className="size-3.5" />
              <span>Aktif Yazdırma Kuyruğu</span>
              <span className="rounded-sm bg-[#d3e0fb] px-1.5 py-0.2 text-[10px] font-semibold text-[#2d62d7]">
                {printQueue.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sablonlar')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 font-bold transition ${
                activeTab === 'sablonlar'
                  ? 'border-[#2d62d7] text-[#2d62d7] bg-white rounded-t'
                  : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <FileSpreadsheet className="size-3.5" />
              <span>Hızlı Belge &amp; Rapor Şablonları</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ayarlar')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 font-bold transition ${
                activeTab === 'ayarlar'
                  ? 'border-[#2d62d7] text-[#2d62d7] bg-white rounded-t'
                  : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <Sliders className="size-3.5" />
              <span>Baskı &amp; Antet Ayarları</span>
            </button>
          </div>

          <Link
            href="/dogrudan-temin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-[#2d62d7] hover:text-[#2455bd] transition"
          >
            <FileSpreadsheet className="size-3.5" />
            <span>Doğrudan Temin Sürecine Git →</span>
          </Link>
        </div>

        {/* SEKME 1: KUYRUK LİSTESİ */}
        {activeTab === 'kuyruk' && (
          <div>
            {printQueue.length === 0 ? (
              <div className="py-16 text-center">
                <Printer className="mx-auto size-10 text-[#adb5bd]" />
                <h3 className="mt-2 text-[13px] font-semibold text-[#26384c]">Yazdırma Kuyruğu Boş</h3>
                <p className="mt-1 text-[11px] text-[#7b8794]">
                  Satın alma veya doğrudan temin ekranlarındaki &quot;Yazdırma Merkezine Gönder&quot; butonuyla belgeleri ekleyebilirsiniz.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Link
                    href="/malzeme-bilgisi"
                    className="flex h-7 items-center rounded bg-[#2d62d7] px-3 text-[11px] font-medium text-white hover:bg-[#2455bd]"
                  >
                    Satın Alma Süreçlerine Git
                  </Link>
                  <Link
                    href="/belge-builder"
                    className="flex h-7 items-center rounded border border-[#d9dee5] bg-white px-3 text-[11px] font-medium text-[#4f5b69] hover:bg-[#f5f6f8]"
                  >
                    Belge Oluşturucuya Git
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Görünüm ve Filtreleme Araç Çubuğu - Kamu 360 Filtre Barı */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e3e6eb] bg-[#f8f9fb] px-3 py-2 text-[11px]">
                  {/* Dosya Filtresi */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="flex items-center gap-1 text-[10.5px] font-medium text-[#5b6877] mr-1">
                      <Filter className="size-3 text-[#7b8794]" /> Dosya:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDosyaFilter('all')}
                      className={`flex h-6 items-center gap-1 rounded border px-2 text-[10.5px] font-medium transition ${
                        selectedDosyaFilter === 'all'
                          ? 'border-[#2d62d7] bg-white text-[#2d62d7] font-semibold shadow-xs'
                          : 'border-[#d9dee5] bg-white text-[#5b6877] hover:border-[#b8c2cc] hover:text-[#26384c]'
                      }`}
                    >
                      <span>Tüm Dosyalar</span>
                      <span className="rounded-sm bg-[#f0f4ff] px-1 py-0.2 text-[9.5px] font-semibold text-[#2d62d7]">
                        {printQueue.length}
                      </span>
                    </button>

                    {uniqueDossiers.map((d) => (
                      <button
                        key={d.dosyaNo}
                        type="button"
                        onClick={() => setSelectedDosyaFilter(d.dosyaNo)}
                        className={`flex h-6 items-center gap-1.5 rounded border px-2 text-[10.5px] font-medium transition ${
                          selectedDosyaFilter === d.dosyaNo
                            ? 'border-[#2d62d7] bg-white text-[#2d62d7] font-semibold shadow-xs'
                            : 'border-[#d9dee5] bg-white text-[#5b6877] hover:border-[#b8c2cc] hover:text-[#26384c]'
                        }`}
                        title={d.dosyaAdi}
                      >
                        <Folder className="size-3 text-[#2d62d7]" />
                        <span className="font-mono">{d.dosyaNo}</span>
                        <span className="rounded-sm bg-[#f0f4ff] px-1 py-0.2 text-[9.5px] font-semibold text-[#2d62d7]">
                          {d.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Görünüm Modu Değiştirici - Segmented Control */}
                  <div className="inline-flex rounded border border-[#d9dee5] bg-[#edf0f4] p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode('grouped')}
                      className={`flex h-6 items-center gap-1 rounded px-2.5 text-[10.5px] font-medium transition ${
                        viewMode === 'grouped'
                          ? 'bg-white text-[#2d62d7] font-bold shadow-xs'
                          : 'text-[#5b6877] hover:text-[#172334]'
                      }`}
                    >
                      <Folder className="size-3" />
                      <span>Dosya Bazlı Klasör</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`flex h-6 items-center gap-1 rounded px-2.5 text-[10.5px] font-medium transition ${
                        viewMode === 'table'
                          ? 'bg-white text-[#2d62d7] font-bold shadow-xs'
                          : 'text-[#5b6877] hover:text-[#172334]'
                      }`}
                    >
                      <Layers className="size-3" />
                      <span>Tablo Listesi</span>
                    </button>
                  </div>
                </div>

                {/* MOD 1: DOSYA BAZLI İÇ İÇE (NESTED) GÖRÜNÜM */}
                {viewMode === 'grouped' ? (
                  <div className="p-3 space-y-3">
                    {groupedByDosya.map((group) => {
                      const isExpanded = expandedDossiers[group.dosyaNo] !== false
                      const allInGroupSelected = group.jobs.every((j) => selectedIds.includes(j.id))
                      return (
                        <div
                          key={group.dosyaNo}
                          className="rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)] overflow-hidden"
                        >
                          {/* Klasör Başlığı */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e3e6eb] bg-[#f8f9fb] px-3.5 py-2 text-[11px]">
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={allInGroupSelected}
                                onChange={() => {
                                  if (allInGroupSelected) {
                                    setSelectedIds((prev) =>
                                      prev.filter((id) => !group.jobs.some((j) => j.id === id))
                                    )
                                  } else {
                                    const toAdd = group.jobs
                                      .map((j) => j.id)
                                      .filter((id) => !selectedIds.includes(id))
                                    setSelectedIds((prev) => [...prev, ...toAdd])
                                  }
                                }}
                                className="size-3.5 accent-[#2d62d7] rounded-sm"
                              />
                              <button
                                type="button"
                                onClick={() => toggleDossierExpand(group.dosyaNo)}
                                className="flex items-center gap-2 text-left hover:text-[#2d62d7] transition"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="size-3.5 text-[#5b6877]" />
                                ) : (
                                  <ChevronRight className="size-3.5 text-[#5b6877]" />
                                )}
                                {isExpanded ? (
                                  <FolderOpen className="size-4 text-[#2d62d7]" />
                                ) : (
                                  <Folder className="size-4 text-[#2d62d7]" />
                                )}
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[11px] font-bold text-[#172334]">
                                    {group.dosyaNo}
                                  </span>
                                  <span className="rounded-sm bg-[#d3e0fb] px-1.5 py-0.5 text-[10px] font-medium text-[#2d62d7]">
                                    {group.jobs.length} Belge
                                  </span>
                                  <span className="text-[11px] text-[#5b6877] font-normal hidden md:inline">
                                    • {group.dosyaAdi}
                                  </span>
                                </div>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openPreviewForJobs(group.jobs)}
                                className="flex h-6 items-center gap-1 rounded border border-[#2d62d7] bg-white px-2.5 text-[10.5px] font-medium text-[#2d62d7] transition hover:bg-[#f2f5ff]"
                              >
                                <Printer className="size-3" />
                                <span>Bu Dosyayı Toplu Yazdır ({group.jobs.length})</span>
                              </button>
                            </div>
                          </div>

                          {/* İçe Açılan Belgeler */}
                          {isExpanded && (
                            <div className="divide-y divide-[#eef0f3]">
                              {group.jobs.map((job) => {
                                const isSelected = selectedIds.includes(job.id)
                                return (
                                  <div
                                    key={job.id}
                                    className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[11px] transition ${
                                      isSelected ? 'bg-[#f0f5ff]' : 'hover:bg-[#fafbfc]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSelect(job.id)}
                                        className="size-3.5 accent-[#2d62d7] rounded-sm shrink-0"
                                      />
                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span className="rounded-sm border border-[#d3e0fb] bg-[#f0f4ff] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#2d62d7]">
                                            {job.docNo}
                                          </span>
                                          <span className="rounded-sm bg-[#e4e6ea] px-1.5 py-0.5 text-[10px] font-medium text-[#4f5b69]">
                                            {job.format}
                                          </span>
                                          <span className="rounded-sm bg-[#dcefd9] px-1.5 py-0.5 text-[10px] font-medium text-[#2f6a2f]">
                                            {job.status}
                                          </span>
                                        </div>
                                        <div className="mt-0.5 truncate text-[11px] font-semibold text-[#26384c]">
                                          {job.title}
                                        </div>
                                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-[#8a94a1]">
                                          <span>Kategori: {job.category}</span>
                                          <span>•</span>
                                          <span>{job.pageCount} Sayfa</span>
                                          <span>•</span>
                                          <span>Eklenme: {job.addedAt}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <Link
                                        href="/dogrudan-temin"
                                        className="flex h-6 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2 text-[10.5px] font-medium text-[#5b6877] transition hover:border-[#2d62d7] hover:text-[#2d62d7]"
                                        title="Doğrudan Temin Sürecinde Aç"
                                      >
                                        <FileSpreadsheet className="size-3" />
                                        <span>Temin Dosyası</span>
                                      </Link>
                                      <button
                                        type="button"
                                        onClick={() => openPreviewForJob(job)}
                                        className="flex h-6 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2.5 text-[10.5px] font-medium text-[#2d62d7] transition hover:border-[#2d62d7] hover:bg-[#f2f5ff]"
                                        title="A4 Matbu Belgeyi Canlı Önizle"
                                      >
                                        <Eye className="size-3" />
                                        <span>Önizle</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => openPreviewForJob(job)}
                                        className="flex h-6 items-center gap-1 rounded bg-[#2d62d7] px-2.5 text-[10.5px] font-medium text-white transition hover:bg-[#2455bd]"
                                        title="Bu Belgeyi Hemen Yazdır"
                                      >
                                        <Printer className="size-3" />
                                        <span>Yazdır</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => removeFromPrintQueue(job.id)}
                                        className="flex size-6 items-center justify-center rounded text-[#8a94a1] transition hover:bg-[#fee2e2]/40 hover:text-[#d7445b]"
                                        title="Kuyruktan Çıkar"
                                      >
                                        <Trash2 className="size-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* MOD 2: KLASİK TABLO LİSTESİ - Kamu 360 Basit Tablo Standardı */
                  <div className="p-3">
                    <div className="overflow-x-auto rounded border border-[#e3e6eb]">
                      <table className="w-full min-w-[640px] border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-[#e3e6eb] bg-[#f4f6f9] text-left text-[10px] font-semibold text-[#44546a]">
                            <th className="w-10 px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={
                                  filteredPrintQueue.length > 0 &&
                                  filteredPrintQueue.every((j) => selectedIds.includes(j.id))
                                }
                                onChange={() => {
                                  if (filteredPrintQueue.every((j) => selectedIds.includes(j.id))) {
                                    setSelectedIds((prev) =>
                                      prev.filter(
                                        (id) => !filteredPrintQueue.some((j) => j.id === id)
                                      )
                                    )
                                  } else {
                                    const toAdd = filteredPrintQueue
                                      .map((j) => j.id)
                                      .filter((id) => !selectedIds.includes(id))
                                    setSelectedIds((prev) => [...prev, ...toAdd])
                                  }
                                }}
                                className="size-3.5 accent-[#2d62d7] rounded-sm"
                              />
                            </th>
                            <th className="px-3 py-2">Dosya No</th>
                            <th className="px-3 py-2">Belge No</th>
                            <th className="px-3 py-2">Belge Adı &amp; Tanımı</th>
                            <th className="px-3 py-2">Kategori</th>
                            <th className="px-3 py-2">Format</th>
                            <th className="px-3 py-2 text-center">Sayfa</th>
                            <th className="px-3 py-2">Zaman</th>
                            <th className="px-3 py-2 text-center">Durum</th>
                            <th className="px-3 py-2 text-right">İşlem</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPrintQueue.map((job) => {
                            const isSelected = selectedIds.includes(job.id)
                            return (
                              <tr
                                key={job.id}
                                className={`border-b border-[#eef0f3] last:border-b-0 transition ${
                                  isSelected ? 'bg-[#f0f5ff]' : 'hover:bg-[#fafbfc]'
                                }`}
                              >
                                <td className="px-3 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelect(job.id)}
                                    className="size-3.5 accent-[#2d62d7] rounded-sm"
                                  />
                                </td>
                                <td className="px-3 py-2 font-mono text-[10.5px] font-bold text-[#2d62d7]">
                                  {job.dosyaNo || '-'}
                                </td>
                                <td className="px-3 py-2">
                                  <span className="rounded-sm border border-[#d3e0fb] bg-[#f0f4ff] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#2d62d7]">
                                    {job.docNo}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="font-semibold text-[#26384c]">{job.title}</div>
                                  <div className="text-[10px] text-[#8a94a1]">
                                    {job.dosyaAdi || 'Yönetmelik Uyumlu EBYS Çıktısı'}
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <span className="rounded-sm bg-[#e4e6ea] px-1.5 py-0.5 text-[10px] font-medium text-[#4f5b69]">
                                    {job.category}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-[#5b6877]">
                                  <span className="font-mono text-[10px]">{job.format}</span>
                                </td>
                                <td className="px-3 py-2 text-center font-bold text-[#26384c]">
                                  {job.pageCount}
                                </td>
                                <td className="px-3 py-2 text-[10px] text-[#8a94a1]">{job.addedAt}</td>
                                <td className="px-3 py-2 text-center">
                                  <span className="rounded-sm bg-[#dcefd9] px-1.5 py-0.5 text-[10px] font-medium text-[#2f6a2f]">
                                    {job.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Link
                                      href="/dogrudan-temin"
                                      className="flex size-6 items-center justify-center rounded text-[#5b6877] hover:bg-[#f2f5ff] hover:text-[#2d62d7]"
                                      title="Doğrudan Temin Sürecinde Aç"
                                    >
                                      <FileSpreadsheet className="size-3.5" />
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => openPreviewForJob(job)}
                                      className="flex size-6 items-center justify-center rounded text-[#2d62d7] hover:bg-[#f2f5ff]"
                                      title="A4 Matbu Belgeyi Canlı Önizle"
                                    >
                                      <Eye className="size-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openPreviewForJob(job)}
                                      className="flex size-6 items-center justify-center rounded text-[#2d62d7] hover:bg-[#f2f5ff]"
                                      title="Bu Belgeyi Hemen Yazdır"
                                    >
                                      <Printer className="size-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeFromPrintQueue(job.id)}
                                      className="flex size-6 items-center justify-center rounded text-[#8a94a1] hover:bg-[#fee2e2]/40 hover:text-[#d7445b]"
                                      title="Kuyruktan Çıkar"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* SEKME 2: HIZLI ŞABLONLAR VE EKLENEBİLİR BELGELER (WORKDESK-360 ENTEGRASYONU) */}
        {activeTab === 'sablonlar' && (
          <div className="p-3.5 space-y-4">
            {/* Workdesk-360 Entegrasyon Başlığı & Kategori Filtreleri */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded bg-[#2d62d7] text-white">
                  <Layers className="size-3.5" />
                </span>
                <div>
                  <h4 className="text-[12px] font-bold text-[#172334]">
                    Workdesk-360 Resmî Satın Alma Şablon Paketi ({WORKDESK_TEMPLATES_CATALOG.length} Belge)
                  </h4>
                  <p className="text-[10px] text-[#5b6877]">
                    github.com/ilyasbozdemir/workdesk-360 mevzuat uyumlu matbu form kataloğu.
                  </p>
                </div>
              </div>

              {/* Kategori Filtreleri */}
              <div className="flex flex-wrap items-center gap-1 text-[10.5px]">
                {['TÜMÜ', 'Piyasa Araştırması', 'Sözleşme & Onay', 'Hazırlık & Talep', 'Muayene & Kabul', 'Ödeme & Mali'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedTemplateCat(cat)}
                    className={`rounded px-2.5 py-1 font-semibold transition ${
                      selectedTemplateCat === cat
                        ? 'bg-[#2d62d7] text-white'
                        : 'border border-[#d9dee5] bg-white text-[#5b6877] hover:bg-[#f2f5ff] hover:text-[#2d62d7]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Workdesk Şablon Grid'i */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-[11px]">
              {WORKDESK_TEMPLATES_CATALOG.filter(
                (t) => selectedTemplateCat === 'TÜMÜ' || t.category === selectedTemplateCat
              ).map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="rounded border border-[#e1e5ea] bg-white p-3.5 space-y-2 shadow-[0_1px_2px_rgba(0,0,0,.03)] hover:border-[#2d62d7]/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-[#f0f4fd] px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#2d62d7]">
                        {tmpl.code}
                      </span>
                      <span className="text-[9.5px] font-medium text-[#7b8794]">{tmpl.category}</span>
                    </div>

                    <h4 className="font-bold text-[#172334] text-[11.5px] line-clamp-1" title={tmpl.name}>
                      {tmpl.name}
                    </h4>
                    <p className="text-[#5b6877] text-[10px] line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#f0f2f5]">
                    <button
                      type="button"
                      onClick={() =>
                        openPreviewForJob({
                          id: `wd-${tmpl.id}`,
                          docNo: tmpl.id,
                          title: tmpl.name,
                          dosyaNo: '2026/DT-001',
                          dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
                          category: tmpl.category as any,
                          format: tmpl.orientation === 'landscape' ? 'A4 Yatay' : 'A4 Dikey',
                          pageCount: 1,
                          addedAt: 'Workdesk-360',
                          status: 'Hazır',
                        })
                      }
                      className="flex-1 h-7 rounded border border-[#2d62d7] bg-white text-center text-[10.5px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff] transition flex items-center justify-center gap-1"
                    >
                      <Eye className="size-3" /> Canlı Önizle
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        addToPrintQueue({
                          docNo: tmpl.id,
                          title: tmpl.name,
                          dosyaNo: '2026/DT-001',
                          dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
                          category: tmpl.category as any,
                          format: tmpl.orientation === 'landscape' ? 'A4 Yatay' : 'A4 Dikey',
                          pageCount: 1,
                        })
                      }
                      className="flex-1 h-7 rounded bg-[#2d62d7] text-center text-[10.5px] font-medium text-white hover:bg-[#2455bd] transition flex items-center justify-center gap-1"
                    >
                      + Kuyruğa Ekle
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Klasik Matbu Şablonlar */}
            <div className="border-t border-[#e2e8f0] pt-3 mt-4">
              <h5 className="text-[11.5px] font-bold text-[#172334] mb-2.5">
                KİK &amp; Standart İhale Matbu Formları
              </h5>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-[11px]">
            {/* 1. Onay Belgesi */}
            <div className="rounded border border-[#e1e5ea] bg-white p-3.5 space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
              <div className="flex items-center gap-2 text-[#2d62d7]">
                <FileCheck2 className="size-4 text-[#2d62d7]" />
                <h4 className="font-semibold text-[#172334] text-[12px]">Harcama Talimatı / İhale Onay Belgesi</h4>
              </div>
              <p className="text-[#5b6877] text-[10.5px]">
                4734 Sayılı Kanun Madde 22/d uyarınca harcama yetkilisinin olurunu alan yasal matbu onay belgesi.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    openPreviewForJob({
                      id: 'tmpl-onay',
                      docNo: 'DOC_ONAY_01',
                      title: 'Harcama Talimatı / İhale Onay Belgesi',
                      dosyaNo: '2026/DT-001',
                      dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
                      category: 'Doğrudan Temin (22/d)',
                      format: 'A4 Dikey',
                      pageCount: 1,
                      addedAt: 'Şablon',
                      status: 'Hazır',
                    })
                  }
                  className="flex-1 h-7 rounded border border-[#2d62d7] bg-white text-center text-[11px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff] transition flex items-center justify-center gap-1"
                >
                  <Eye className="size-3" /> Canlı Önizle
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addToPrintQueue({
                      docNo: 'DOC_ONAY_01',
                      title: 'Harcama Talimatı / İhale Onay Belgesi',
                      dosyaNo: '2026/DT-001',
                      dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
                      category: 'Doğrudan Temin (22/d)',
                      format: 'A4 Dikey',
                      pageCount: 1,
                    })
                  }
                  className="flex-1 h-7 rounded bg-[#2d62d7] text-center text-[11px] font-medium text-white hover:bg-[#2455bd] transition flex items-center justify-center gap-1"
                >
                  + Kuyruğa Ekle
                </button>
              </div>
            </div>

            {/* 2. Piyasa Fiyat Tutanağı */}
            <div className="rounded border border-[#e1e5ea] bg-white p-3.5 space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
              <div className="flex items-center gap-2 text-[#2d62d7]">
                <FileText className="size-4 text-[#2d62d7]" />
                <h4 className="font-semibold text-[#172334] text-[12px]">Piyasa Fiyat Araştırma Tutanağı</h4>
              </div>
              <p className="text-[#5b6877] text-[10.5px]">
                En az 3 firmadan alınan teklifleri ve en uygun fiyat seçim gerekçesini belgeleyen tutanak.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    openPreviewForJob({
                      id: 'tmpl-piyasa',
                      docNo: 'DOC_PIYASA_01',
                      title: 'Piyasa Fiyat Araştırma Tutanağı (3 Firma Teklifi)',
                      dosyaNo: '2026/DT-001',
                      dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
                      category: 'Doğrudan Temin (22/d)',
                      format: 'A4 Dikey',
                      pageCount: 1,
                      addedAt: 'Şablon',
                      status: 'Hazır',
                    })
                  }
                  className="flex-1 h-7 rounded border border-[#2d62d7] bg-white text-center text-[11px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff] transition flex items-center justify-center gap-1"
                >
                  <Eye className="size-3" /> Canlı Önizle
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addToPrintQueue({
                      docNo: 'DOC_PIYASA_01',
                      title: 'Piyasa Fiyat Araştırma Tutanağı (3 Firma Teklifi)',
                      dosyaNo: '2026/DT-001',
                      dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
                      category: 'Doğrudan Temin (22/d)',
                      format: 'A4 Dikey',
                      pageCount: 1,
                    })
                  }
                  className="flex-1 h-7 rounded bg-[#2d62d7] text-center text-[11px] font-medium text-white hover:bg-[#2455bd] transition flex items-center justify-center gap-1"
                >
                  + Kuyruğa Ekle
                </button>
              </div>
            </div>

            {/* 3. Doğrudan Temin Alım Sözleşmesi */}
            <div className="rounded border border-[#e1e5ea] bg-white p-3.5 space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
              <div className="flex items-center gap-2 text-[#2d62d7]">
                <FileSignature className="size-4 text-[#2d62d7]" />
                <h4 className="font-semibold text-[#172334] text-[12px]">Doğrudan Temin Alım Sözleşmesi</h4>
              </div>
              <p className="text-[#5b6877] text-[10.5px]">
                Damga vergisi, karar pulu ve teslim şartlarını içeren bağlayıcı alım ve sipariş akdi metni.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    openPreviewForJob({
                      id: 'tmpl-sozlesme',
                      docNo: 'DOC_SOZLESME_01',
                      title: 'Doğrudan Temin Alım Sözleşmesi (Kesintili)',
                      dosyaNo: '2026/DT-001',
                      dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
                      category: 'Sözleşme',
                      format: 'A4 Dikey',
                      pageCount: 1,
                      addedAt: 'Şablon',
                      status: 'Hazır',
                    })
                  }
                  className="flex-1 h-7 rounded border border-[#2d62d7] bg-white text-center text-[11px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff] transition flex items-center justify-center gap-1"
                >
                  <Eye className="size-3" /> Canlı Önizle
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addToPrintQueue({
                      docNo: 'DOC_SOZLESME_01',
                      title: 'Doğrudan Temin Alım Sözleşmesi (Kesintili)',
                      dosyaNo: '2026/DT-001',
                      dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
                      category: 'Sözleşme',
                      format: 'A4 Dikey',
                      pageCount: 1,
                    })
                  }
                  className="flex-1 h-7 rounded bg-[#2d62d7] text-center text-[11px] font-medium text-white hover:bg-[#2455bd] transition flex items-center justify-center gap-1"
                >
                  + Kuyruğa Ekle
                </button>
              </div>
            </div>

            {/* 4. Yaklaşık Maliyet Cetveli */}
            <div className="rounded border border-[#e1e5ea] bg-white p-3.5 space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
              <div className="flex items-center gap-2 text-[#2d62d7]">
                <FileSpreadsheet className="size-4 text-[#2d62d7]" />
                <h4 className="font-semibold text-[#172334] text-[12px]">Yaklaşık Maliyet Hesap Cetveli</h4>
              </div>
              <p className="text-[#5b6877] text-[10.5px]">
                Tüm kalemlerin piyasa firma teklifleri ve aritmetik ortalaması üzerinden yaklaşık maliyet dökümü.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    openPreviewForJob({
                      id: 'tmpl-maliyet',
                      docNo: 'DOC_YAKLASIK_MALIYET',
                      title: 'Yaklaşık Maliyet Hesap Cetveli & Formu',
                      dosyaNo: '2026/DT-001',
                      dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
                      category: 'Doğrudan Temin (22/d)',
                      format: 'A4 Dikey',
                      pageCount: 1,
                      addedAt: 'Şablon',
                      status: 'Hazır',
                    })
                  }
                  className="flex-1 h-7 rounded border border-[#2d62d7] bg-white text-center text-[11px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff] transition flex items-center justify-center gap-1"
                >
                  <Eye className="size-3" /> Canlı Önizle
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addToPrintQueue({
                      docNo: 'DOC_YAKLASIK_MALIYET',
                      title: 'Yaklaşık Maliyet Hesap Cetveli & Formu',
                      dosyaNo: '2026/DT-001',
                      dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
                      category: 'Doğrudan Temin (22/d)',
                      format: 'A4 Dikey',
                      pageCount: 1,
                    })
                  }
                  className="flex-1 h-7 rounded bg-[#2d62d7] text-center text-[11px] font-medium text-white hover:bg-[#2455bd] transition flex items-center justify-center gap-1"
                >
                  + Kuyruğa Ekle
                </button>
              </div>
            </div>

            {/* 5. Resmî EBYS Üst Yazısı */}
            <div className="rounded border border-[#e1e5ea] bg-white p-3.5 space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
              <div className="flex items-center gap-2 text-[#2d62d7]">
                <FileSignature className="size-4 text-[#2d62d7]" />
                <h4 className="font-semibold text-[#172334] text-[12px]">Resmî EBYS Üst Yazısı</h4>
              </div>
              <p className="text-[#5b6877] text-[10.5px]">
                Cumhurbaşkanlığı Resmî Yazışma Yönetmeliğine (31151) %100 uyumlu, antetli ve e-imza kaşeli döküm.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    openPreviewForJob({
                      id: 'tmpl-resmi',
                      docNo: 'DOC_RESMI_0142',
                      title: 'Resmî Üst Yazı (31151 Sayılı Yönetmelik & e-İmza)',
                      dosyaNo: 'DOC_RESMI_0142',
                      dosyaAdi: 'EBYS Kurumsal Yazışma Dosyası',
                      category: 'EBYS Resmî Yazı',
                      format: 'EBYS e-İmzalı PDF',
                      pageCount: 1,
                      addedAt: 'Şablon',
                      status: 'Hazır',
                    })
                  }
                  className="flex-1 h-7 rounded border border-[#2d62d7] bg-white text-center text-[11px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff] transition flex items-center justify-center gap-1"
                >
                  <Eye className="size-3" /> Canlı Önizle
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addToPrintQueue({
                      docNo: 'DOC_RESMI_0142',
                      title: 'Resmî Üst Yazı (31151 Sayılı Yönetmelik & e-İmza)',
                      dosyaNo: 'DOC_RESMI_0142',
                      dosyaAdi: 'EBYS Kurumsal Yazışma Dosyası',
                      category: 'EBYS Resmî Yazı',
                      format: 'EBYS e-İmzalı PDF',
                      pageCount: 1,
                    })
                  }
                  className="flex-1 h-7 rounded bg-[#2d62d7] text-center text-[11px] font-medium text-white hover:bg-[#2455bd] transition flex items-center justify-center gap-1"
                >
                  + Kuyruğa Ekle
                </button>
              </div>
            </div>

            {/* 6. 2886 Kiralanabilir & Satılabilir Varlıklar */}
            <div className="rounded border border-[#e1e5ea] bg-white p-3.5 space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
              <div className="flex items-center gap-2 text-[#2d62d7]">
                <Scale className="size-4 text-[#2d62d7]" />
                <h4 className="font-semibold text-[#172334] text-[12px]">2886 Varlıklar &amp; İhale Tutanağı</h4>
              </div>
              <p className="text-[#5b6877] text-[10.5px]">
                2886 Sayılı Devlet İhale Kanunu kapsamında Kıymet Takdir Komisyonu onaylı kurumsal varlık envanteri.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    openPreviewForJob({
                      id: 'tmpl-varlik',
                      docNo: '2886-VARLIK-2026/01',
                      title: 'Kiralanabilir & Satılabilir Varlıklar Tutanağı',
                      dosyaNo: '2886-2024/01',
                      dosyaAdi: 'ODTÜ Teknokent Ticari Alan Kiralama İhalesi',
                      category: 'Gelir İhalesi (2886)',
                      format: 'A4 Dikey',
                      pageCount: 1,
                      addedAt: 'Şablon',
                      status: 'Hazır',
                    })
                  }
                  className="flex-1 h-7 rounded border border-[#2d62d7] bg-white text-center text-[11px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff] transition flex items-center justify-center gap-1"
                >
                  <Eye className="size-3" /> Canlı Önizle
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addToPrintQueue({
                      docNo: '2886-VARLIK-2026/01',
                      title: 'Kiralanabilir & Satılabilir Varlıklar Tutanağı',
                      dosyaNo: '2886-2024/01',
                      dosyaAdi: 'ODTÜ Teknokent Ticari Alan Kiralama İhalesi',
                      category: 'Gelir İhalesi (2886)',
                      format: 'A4 Dikey',
                      pageCount: 1,
                    })
                  }
                  className="flex-1 h-7 rounded bg-[#2d62d7] text-center text-[11px] font-medium text-white hover:bg-[#2455bd] transition flex items-center justify-center gap-1"
                >
                  + Kuyruğa Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

        {/* SEKME 3: BASKI VE ANTET AYARLARI */}
        {activeTab === 'ayarlar' && (
          <div className="p-3.5 space-y-4">
            {/* Bildirim Toast */}
            {settingsToast && (
              <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-[11px] font-semibold text-emerald-800 shadow-md animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>{settingsToast}</span>
              </div>
            )}

            {/* Üst Bilgi Başlığı */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e3e6eb] pb-3">
              <div>
                <h3 className="text-[13px] font-semibold text-[#172334] flex items-center gap-2">
                  <Sliders className="size-4 text-[#2d62d7]" />
                  Baskı, Antet ve Sayfa Düzeni Ayarları
                </h3>
                <p className="text-[11px] text-[#7b8794] mt-0.5">
                  Resmî Yazışma Yönetmeliği (31151), KİK matbu şablonları ve EBYS e-imza çıktı parametrelerini buradan yapılandırın.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="flex h-7 items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-3 text-[11px] font-medium text-[#4f5b69] transition hover:bg-[#f5f6f8]"
                >
                  <RotateCcw className="size-3 text-[#7b8794]" />
                  Varsayılana Sıfırla
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3.5 text-[11px] font-medium text-white transition hover:bg-[#2455bd]"
                >
                  <Save className="size-3" />
                  Ayarları Kaydet
                </button>
              </div>
            </div>

            {/* Ana Grid: Ayarlar Formu (7 Kolon) & Canlı Önizleme (5 Kolon) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* SOL: AYAR GRUPLARI (7 KOLON) */}
              <div className="lg:col-span-7 space-y-3.5 text-[11px]">
                {/* 1. KURUMSAL ANTET & BAŞLIK AYARLARI */}
                <div className="rounded border border-[#e1e5ea] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,.03)] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e3e6eb] pb-2">
                    <span className="font-semibold text-[#172334] flex items-center gap-1.5 text-[12px]">
                      <Building2 className="size-3.5 text-[#2d62d7]" />
                      Kurumsal Antet &amp; Başlık Yapılandırması
                    </span>
                    <span className="text-[10px] font-semibold text-[#2d62d7] bg-[#f0f4ff] border border-[#d3e0fb] px-1.5 py-0.5 rounded-sm">
                      Yönetmelik Uyumlu
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">
                        Resmî Kurum Adı (Antet 1. Satır)
                      </label>
                      <input
                        type="text"
                        value={kurumAdi}
                        onChange={(e) => setKurumAdi(e.target.value)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                        placeholder="Örn: T.C. İSTANBUL BÜYÜKŞEHİR BELEDİYESİ"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="mb-1 block text-[10px] text-[#5b6877]">
                          Daire Başkanlığı (Antet 2. Satır)
                        </label>
                        <input
                          type="text"
                          value={daireBaskanligi}
                          onChange={(e) => setDaireBaskanligi(e.target.value)}
                          className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] text-[#5b6877]">
                          Şube / Birim (Antet 3. Satır)
                        </label>
                        <input
                          type="text"
                          value={subeMudurlugu}
                          onChange={(e) => setSubeMudurlugu(e.target.value)}
                          className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div>
                        <label className="mb-1 block text-[10px] text-[#5b6877]">Antet Yerleşim Tipi</label>
                        <select
                          value={antetTipi}
                          onChange={(e) => setAntetTipi(e.target.value as any)}
                          className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                        >
                          <option value="tek">Standart Tek Antet (Ortalanmış)</option>
                          <option value="cift">Çift Antet (Bakanlık / Valilik + Belediye)</option>
                          <option value="sade">Sade Düz Metin Antet</option>
                        </select>
                      </div>

                      <div className="flex flex-col justify-center pt-3">
                        <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#5b6877]">
                          <input
                            type="checkbox"
                            checked={logoGoster}
                            onChange={(e) => setLogoGoster(e.target.checked)}
                            className="size-3.5 accent-[#2d62d7] rounded-sm"
                          />
                          <span>Resmî Kurum Amblemini / Logosunu Göster</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-2.5 rounded border border-[#d9dee5] bg-[#f8f9fb] text-[11px] text-[#5b6877] flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={antetliKagitModu}
                        onChange={(e) => setAntetliKagitModu(e.target.checked)}
                        className="size-3.5 accent-[#2d62d7] rounded-sm mt-0.5"
                      />
                      <div>
                        <span className="font-semibold text-[#26384c]">Fiziksel Antetli Kağıt Modu</span>
                        <p className="text-[10px] text-[#7b8794] mt-0.5 leading-relaxed">
                          Yazıcı tepsisine idarenin hazır basılmış antetli kağıdı yerleştirilmişse, mükerrer basımı önlemek için dijital antet gizlenir.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SAYFA DÜZENİ, MARJLAR & TİPOGRAFİ */}
                <div className="rounded border border-[#e1e5ea] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,.03)] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e3e6eb] pb-2">
                    <span className="font-semibold text-[#172334] flex items-center gap-1.5 text-[12px]">
                      <Type className="size-3.5 text-[#2d62d7]" />
                      Sayfa Düzeni, Marjlar ve Tipografi
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">Kağıt Boyutu</label>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value as any)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                      >
                        <option value="A4">A4 (210 x 297 mm) Standart</option>
                        <option value="A3">A3 (Geniş İhale Cetvelleri)</option>
                        <option value="A5">A5 (Kompakt Makbuz / Fiş)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">Yönlendirme</label>
                      <select
                        value={printPaper}
                        onChange={(e) => setPrintPaper(e.target.value as any)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                      >
                        <option value="A4_DIKEY">Dikey (Portrait - Resmî Evrak)</option>
                        <option value="A4_YATAY">Yatay (Landscape - Matris &amp; Cetvel)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">Kenar Payı (Marj)</label>
                      <select
                        value={marginSetting}
                        onChange={(e) => setMarginSetting(e.target.value as any)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                      >
                        <option value="STANDART_25MM">25 mm - Standart Yönetmelik</option>
                        <option value="DAR_15MM">15 mm - Kompakt Tablo Marjı</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">Yazı Tipi (Font)</label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value as any)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                      >
                        <option value="Times New Roman">Times New Roman (Resmî)</option>
                        <option value="Arial">Arial (Modern Düz)</option>
                        <option value="Segoe UI">Segoe UI</option>
                        <option value="Roboto">Roboto</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">Gövde Punto Boyutu</label>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value as any)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                      >
                        <option value="10pt">10 pt (Kompakt)</option>
                        <option value="11pt">11 pt (Standart)</option>
                        <option value="12pt">12 pt (Büyük ve Okunaklı)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">Filigran (Watermark)</label>
                      <select
                        value={watermark}
                        onChange={(e) => setWatermark(e.target.value as any)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                      >
                        <option value="YOK">Filigran Yok</option>
                        <option value="TASLAK">TASLAK</option>
                        <option value="ASLI GİBİDİR">ASLI GİBİDİR</option>
                        <option value="ÖN ÇALIŞMA">ÖN ÇALIŞMA</option>
                        <option value="İPTAL">İPTAL</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. ALTBİLGİ, DOĞRULAMA & GÜVENLİK */}
                <div className="rounded border border-[#e1e5ea] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,.03)] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e3e6eb] pb-2">
                    <span className="font-semibold text-[#172334] flex items-center gap-1.5 text-[12px]">
                      <ShieldCheck className="size-3.5 text-[#2d62d7]" />
                      Altbilgi, 5070 e-İmza &amp; Doğrulama Güvenliği
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">Sayfa Numarası Formatı</label>
                      <select
                        value={sayfaNumarasiFormati}
                        onChange={(e) => setSayfaNumarasiFormati(e.target.value as any)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                      >
                        <option value="SAYFA_X_Y">Sayfa 1 / 2 (Standart)</option>
                        <option value="X_Y">1 / 2</option>
                        <option value="YOK">Sayfa Numarası Gösterme</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">Gizlilik / Güvenlik Derecesi</label>
                      <select
                        value={gizlilikDerecesi}
                        onChange={(e) => setGizlilikDerecesi(e.target.value as any)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                      >
                        <option value="YOK">Yok (Standart Aleni Evrak)</option>
                        <option value="HİZMETE ÖZEL">HİZMETE ÖZEL</option>
                        <option value="GİZLİ">GİZLİ</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-[#eef0f3]">
                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#5b6877]">
                      <input
                        type="checkbox"
                        checked={eImzaKasesiDahil}
                        onChange={(e) => setEImzaKasesiDahil(e.target.checked)}
                        className="size-3.5 accent-[#2d62d7] rounded-sm"
                      />
                      <span>5070 Sayılı Kanun Uyarınca Elektronik İmza Kaşesi Yazdır</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#5b6877]">
                      <input
                        type="checkbox"
                        checked={qrKodGoster}
                        onChange={(e) => setQrKodGoster(e.target.checked)}
                        className="size-3.5 accent-[#2d62d7] rounded-sm"
                      />
                      <span>EBYS Belge Doğrulama Karekodu (QR Code) Ekle</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#5b6877]">
                      <input
                        type="checkbox"
                        checked={barkodGoster}
                        onChange={(e) => setBarkodGoster(e.target.checked)}
                        className="size-3.5 accent-[#2d62d7] rounded-sm"
                      />
                      <span>Evrak Kayıt Barkodu (Code128) Göster</span>
                    </label>
                  </div>
                </div>

                {/* 4. KOMİSYON DÜZENİ VE DIŞA AKTARMA */}
                <div className="rounded border border-[#e1e5ea] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,.03)] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e3e6eb] pb-2">
                    <span className="font-semibold text-[#172334] flex items-center gap-1.5 text-[12px]">
                      <FileSignature className="size-3.5 text-[#2d62d7]" />
                      Komisyon İmza Blokları &amp; Dışa Aktarma Formatları
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">
                        Komisyon Üyeleri Yerleşim Düzeni
                      </label>
                      <select
                        value={komisyonDuzeni}
                        onChange={(e) => setKomisyonDuzeni(e.target.value as any)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                      >
                        <option value="3_LU">3&apos;lü Yan Yana Blok (Başkan, Üye, Üye)</option>
                        <option value="4_LU">4&apos;lü Yan Yana Blok</option>
                        <option value="5_LI">5&apos;li Geniş Izgara</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] text-[#5b6877]">PDF Çözünürlüğü / DPI</label>
                      <select
                        value={pdfDpi}
                        onChange={(e) => setPdfDpi(e.target.value as any)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                      >
                        <option value="300">300 DPI - Matbaa / Resmî Arşiv Kalitesi</option>
                        <option value="150">150 DPI - Hızlı EBYS &amp; E-Posta Dosyası</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-[10px] text-[#5b6877]">
                        Dışa Aktarma Dosya İsimlendirme Şablonu
                      </label>
                      <input
                        type="text"
                        value={dosyaIsimFormati}
                        onChange={(e) => setDosyaIsimFormati(e.target.value)}
                        className="h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 font-mono text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30"
                        placeholder="{DOSYA_NO}_{BELGE_KODU}_{TARIH}"
                      />
                      <span className="text-[9.5px] text-[#8a94a1] mt-1 block">
                        Kullanılabilir değişkenler: <code>{'{DOSYA_NO}'}</code>, <code>{'{BELGE_KODU}'}</code>, <code>{'{TARIH}'}</code>, <code>{'{KURUM}'}</code>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alt Aksiyon Butonları */}
                <div className="pt-1 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleResetSettings}
                    className="h-7 rounded border border-[#d9dee5] bg-white px-3 text-[11px] font-medium text-[#4f5b69] transition hover:bg-[#f5f6f8]"
                  >
                    Varsayılana Sıfırla
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3.5 text-[11px] font-medium text-white transition hover:bg-[#2455bd]"
                  >
                    <Save className="size-3" />
                    Ayarları Kaydet ve Uygula
                  </button>
                </div>
              </div>

              {/* SAĞ: CANLI A4 MİNİ ÖNİZLEME (5 KOLON - STICKY) */}
              <div className="lg:col-span-5 sticky top-20 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] px-1">
                  <span className="font-semibold text-[#172334] flex items-center gap-1.5">
                    <Eye className="size-3.5 text-[#2d62d7]" />
                    Canlı A4 Sayfa &amp; Antet Önizlemesi
                  </span>
                  <span className="text-[10px] font-mono text-[#8a94a1]">
                    {pageSize} · {printPaper === 'A4_DIKEY' ? 'Dikey' : 'Yatay'} · {fontSize}
                  </span>
                </div>

                {/* A4 Kağıt Temsili Kutu - Kamu 360 Teması */}
                <div className="bg-[#f0f2f5] p-3 sm:p-4 rounded border border-[#d9dee5] flex justify-center shadow-xs">
                  <div
                    className={`bg-white shadow rounded-xs transition-all relative overflow-hidden flex flex-col justify-between border border-[#d9dee5] ${
                      printPaper === 'A4_DIKEY'
                        ? 'w-full max-w-[340px] aspect-[1/1.414]'
                        : 'w-full max-w-[440px] aspect-[1.414/1]'
                    }`}
                    style={{
                      fontFamily: fontFamily,
                      padding: marginSetting === 'STANDART_25MM' ? '18px 20px' : '12px 14px',
                    }}
                  >
                    {/* Filigran (Watermark) Katmanı */}
                    {watermark !== 'YOK' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                        <span className="text-3xl sm:text-4xl font-black uppercase text-red-500/15 -rotate-35 tracking-widest border-2 border-red-500/15 px-4 py-1 rounded">
                          {watermark}
                        </span>
                      </div>
                    )}

                    {/* Gizlilik Derecesi */}
                    {gizlilikDerecesi !== 'YOK' && (
                      <div className="text-center font-bold text-[9px] uppercase tracking-widest text-red-700 border-b border-red-200 pb-1 mb-1">
                        *** {gizlilikDerecesi} ***
                      </div>
                    )}

                    {/* 1. Üst Kısım: Antet */}
                    <div>
                      {!antetliKagitModu ? (
                        <div className="text-center border-b border-[#1e293c] pb-2 mb-2">
                          {logoGoster && (
                            <div className="size-6 mx-auto rounded-full bg-[#1e2a3c] text-white flex items-center justify-center text-[7.5px] font-black mb-1 shadow-xs">
                              İBB
                            </div>
                          )}
                          <div className="text-[9.5px] font-bold text-[#172334] tracking-tight leading-tight uppercase">
                            {kurumAdi}
                          </div>
                          {daireBaskanligi && (
                            <div className="text-[8px] font-medium text-[#475569] leading-tight">
                              {daireBaskanligi}
                            </div>
                          )}
                          {subeMudurlugu && (
                            <div className="text-[7.5px] text-[#64748b] leading-tight">
                              {subeMudurlugu}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="border border-dashed border-amber-300 bg-amber-50/50 p-1.5 text-center text-[8px] text-amber-800 rounded mb-2">
                          [Fiziksel Antetli Kağıt Boşluğu - 40mm]
                        </div>
                      )}

                      {/* Belge Başlığı & Numara */}
                      <div className="flex justify-between items-center text-[7.5px] text-[#64748b] font-mono mb-1.5">
                        <span>Sayı: E-2026/DT-001</span>
                        <span>Tarih: 03.11.2026</span>
                      </div>

                      <div className="text-center my-1">
                        <div className="text-[9px] font-bold text-[#172334] uppercase tracking-tight">
                          HARCAMA TALİMATI / İHALE ONAY BELGESİ
                        </div>
                        <div className="text-[7px] text-[#64748b] font-mono">
                          (4734 Sayılı KİK Madde 22/d Uyarınca)
                        </div>
                      </div>

                      {/* Mock Tablo / İçerik */}
                      <div className="space-y-1 text-[7.5px] text-[#334155] mt-1.5">
                        <div className="grid grid-cols-3 border border-[#cbd5e1] p-1 bg-[#f8fafc] font-semibold">
                          <span>İşin Konusu:</span>
                          <span className="col-span-2 text-[#172334] font-bold">
                            Toner &amp; Sarf Malzemesi Alımı
                          </span>
                        </div>
                        <div className="grid grid-cols-3 border border-[#e2e8f0] p-1">
                          <span>Yaklaşık Maliyet:</span>
                          <span className="col-span-2 font-mono font-bold text-[#172334]">
                            148.500,00 TL
                          </span>
                        </div>
                        <div className="grid grid-cols-3 border border-[#e2e8f0] p-1">
                          <span>Bütçe Tertibi:</span>
                          <span className="col-span-2 font-mono">03.2.1.01 Kırtasiye</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Alt Kısım: İmza Blokları ve Altbilgi */}
                    <div className="mt-3 space-y-2">
                      {/* Komisyon / İmzalar */}
                      <div
                        className={`grid gap-1 text-center text-[7px] border-t border-[#cbd5e1] pt-1.5 ${
                          komisyonDuzeni === '3_LU'
                            ? 'grid-cols-3'
                            : komisyonDuzeni === '4_LU'
                            ? 'grid-cols-4'
                            : 'grid-cols-5'
                        }`}
                      >
                        <div className="border border-[#e2e8f0] p-0.5 rounded">
                          <div className="font-bold text-[#172334]">Başkan</div>
                          <div className="text-[#64748b] text-[6.5px]">Ahmet Yılmaz</div>
                          <div className="h-4 border-b border-dashed border-[#cbd5e1] mt-0.5" />
                        </div>
                        <div className="border border-[#e2e8f0] p-0.5 rounded">
                          <div className="font-bold text-[#172334]">Üye</div>
                          <div className="text-[#64748b] text-[6.5px]">Mehmet Demir</div>
                          <div className="h-4 border-b border-dashed border-[#cbd5e1] mt-0.5" />
                        </div>
                        <div className="border border-[#e2e8f0] p-0.5 rounded">
                          <div className="font-bold text-[#172334]">Üye</div>
                          <div className="text-[#64748b] text-[6.5px]">Ali Kaya</div>
                          <div className="h-4 border-b border-dashed border-[#cbd5e1] mt-0.5" />
                        </div>
                        {komisyonDuzeni !== '3_LU' && (
                          <div className="border border-[#e2e8f0] p-0.5 rounded">
                            <div className="font-bold text-[#172334]">Raportör</div>
                            <div className="text-[#64748b] text-[6.5px]">Zeynep Koç</div>
                            <div className="h-4 border-b border-dashed border-[#cbd5e1] mt-0.5" />
                          </div>
                        )}
                      </div>

                      {/* Altbilgi & e-İmza & Karekod */}
                      <div className="border-t border-[#e2e8f0] pt-1 flex items-center justify-between text-[6.5px] text-[#94a3b8]">
                        <div className="flex items-center gap-1">
                          {qrKodGoster && (
                            <span className="size-4 bg-[#1e2a3c] rounded-xs flex items-center justify-center text-white text-[5px] font-bold">
                              QR
                            </span>
                          )}
                          {eImzaKasesiDahil && (
                            <span className="text-[6px] text-[#475569]">
                              5070 Sayılı Güvenli Elektronik İmza
                            </span>
                          )}
                        </div>

                        {sayfaNumarasiFormati !== 'YOK' && (
                          <span className="font-mono">
                            {sayfaNumarasiFormati === 'SAYFA_X_Y' ? 'Sayfa 1 / 1' : '1 / 1'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-[#f0f5ff] border border-[#d3e0fb] rounded text-[11px] text-[#1e3a8a] flex items-start gap-2">
                  <Sparkles className="size-3.5 text-[#2d62d7] shrink-0 mt-0.5" />
                  <p>
                    <strong>İpucu:</strong> Yaptığınız antet, yönlendirme ve marj değişiklikleri A4 doğrudan baskı ve EBYS PDF dışa aktarma motorlarına eş zamanlı yansıtılır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Evrensel A4 Matbu Belge Önizleme ve Doğrudan Yazdırma Modalı */}
      <UniversalDocumentModal
        isOpen={isUniversalModalOpen}
        onClose={() => setIsUniversalModalOpen(false)}
        jobs={previewJobs}
        initialJobId={activeJobId}
      />
    </div>
  )
}


