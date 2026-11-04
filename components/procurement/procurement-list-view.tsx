'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Building,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Filter,
  FolderOpen,
  Layers,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Tag,
  X,
} from 'lucide-react'
import { ORNEK_TEMIN_DOSYALARI, TeminDosyasiKaydi } from '@/lib/temin-dosyasi/schema'
import { UniversalDocumentModal } from '@/components/document-preview/universal-document-modal'
import { usePrintHub, type PrintJob } from '@/lib/print-hub-context'

export interface UnifiedProcurementRecord {
  id: string | number
  docNo: string
  title: string
  category: string
  department: string
  supplier: string
  amount: number
  currency: string
  stepIndex: number // 1 to 5
  stepSlug: string
  stepTitle: string
  status: 'aktif' | 'onay_bekliyor' | 'tamamlandi' | 'iptal'
  statusLabel: string
  date: string
  tags: string[]
  kikType: string
}

export const UNIFIED_RECORDS: UnifiedProcurementRecord[] = [
  {
    id: 'dt-1',
    docNo: '2026/DT-001',
    title: 'Destek Hizmetleri ve Hizmet Binaları İçin 8 Kalem Orijinal Toner ve Sarf Malzemesi Alımı',
    category: 'Mal Alımı (Kırtasiye & Büro)',
    department: 'Destek Hizmetleri Dairesi Bşk. - Satınalma Şb.',
    supplier: 'Turuncu Ofis Bilişim Ltd. Şti.',
    amount: 145000,
    currency: 'TL',
    stepIndex: 4,
    stepSlug: 'dogrudan-temin',
    stepTitle: '4. Doğrudan Temin (22/d)',
    status: 'aktif',
    statusLabel: 'Piyasa Araştırmasında',
    date: '15.03.2026',
    tags: ['#Acil', '#Toner', '#4734/22-d'],
    kikType: '4734 Sayılı KİK Madde 22/d',
  },
  {
    id: 'mat-1',
    docNo: '24-00000000',
    title: 'HP 658A Orijinal Lazer Toner Kartuşu Alımı & Malzeme Tanımı',
    category: 'Malzeme Tedarik Tanımı',
    department: 'Hammadde ve Malzeme Alımları - Abdulkadir İlci',
    supplier: 'Turuncu Ofis Bilişim Ltd. Şti.',
    amount: 84500,
    currency: 'TL',
    stepIndex: 1,
    stepSlug: 'malzeme-bilgisi',
    stepTitle: '1. Malzeme Satın Alma Bilgisi',
    status: 'aktif',
    statusLabel: 'Tedarik Tanımı Aktif',
    date: '17.07.2024',
    tags: ['#Standart', '#SürekliTedarik'],
    kikType: '4734 Doğrudan Temin',
  },
  {
    id: 'dt-2',
    docNo: '2026/DT-002',
    title: 'Bilgi İşlem Dairesi Sunucu Bellek ve SSD Disk Genişletme Paketi Alımı',
    category: 'Bilişim & Donanım Alımı',
    department: 'Bilgi İşlem Dairesi Başkanlığı',
    supplier: 'Akme Teknoloji Çözümleri A.Ş.',
    amount: 230000,
    currency: 'TL',
    stepIndex: 2,
    stepSlug: 'teklif-degerlendirme',
    stepTitle: '2. Teklif Değerlendirme',
    status: 'onay_bekliyor',
    statusLabel: 'Teklif Değerlendirmede',
    date: '10.03.2026',
    tags: ['#Sunucu', '#SSD', '#Donanım'],
    kikType: '4734 Sayılı KİK Madde 22/d',
  },
  {
    id: 'eval-1',
    docNo: '24-0000005',
    title: 'Ağ Anahtarı (Switch) ve Fiber Optik Modül Karşılaştırmalı Teklif Matrisi',
    category: 'Donanım & Ağ Alımları',
    department: 'Donanım Alımları Şubesi',
    supplier: 'Kuzey Bilişim / Akme Teknoloji',
    amount: 312000,
    currency: 'TL',
    stepIndex: 2,
    stepSlug: 'teklif-degerlendirme',
    stepTitle: '2. Teklif Değerlendirme',
    status: 'aktif',
    statusLabel: 'En Avantajlı Teklif Belirlendi',
    date: '18.07.2024',
    tags: ['#Switch', '#Ağ', '#TeklifMatrisi'],
    kikType: '4734 Açık / 22-d',
  },
  {
    id: 'dt-3',
    docNo: '2026/DT-003',
    title: 'Fen İşleri Yol Bakım Şantiyesi İş Güvenliği Donanımları ve Kıyafetleri Alımı',
    category: 'İş Güvenliği & Donanım',
    department: 'Fen İşleri Dairesi Başkanlığı',
    supplier: 'Yıldız Teknik İş Güvenliği San. Tic. A.Ş.',
    amount: 95000,
    currency: 'TL',
    stepIndex: 3,
    stepSlug: 'ihale-dosyasi',
    stepTitle: '3. İhale Dosyası (Şartname)',
    status: 'tamamlandi',
    statusLabel: 'Komisyon Onaylandı',
    date: '02.03.2026',
    tags: ['#İşGüvenliği', '#Fenİşleri'],
    kikType: '4734 Sayılı KİK Madde 22/d',
  },
  {
    id: 'soz-1',
    docNo: '24-00000001',
    title: 'Kurumsal Ağ Güvenlik Duvarı Lisansı ve Yıllık Destek Sözleşmesi',
    category: 'Yazılım & Bakım Hizmeti',
    department: 'Bilgi İşlem Dairesi Başkanlığı',
    supplier: 'Turuncu Ofis Bilişim Ltd. Şti.',
    amount: 480000,
    currency: 'TL',
    stepIndex: 5,
    stepSlug: 'sozlesme',
    stepTitle: '5. Satın Alma Sözleşmesi',
    status: 'tamamlandi',
    statusLabel: 'Sözleşme İmzalandı',
    date: '01.01.2025',
    tags: ['#Sözleşme', '#Güvenlik', '#Lisans'],
    kikType: '4734 Kesin Sözleşme',
  },
]

interface ProcurementListViewProps {
  onOpenRecord?: (record: UnifiedProcurementRecord) => void
}

export function ProcurementListView({ onOpenRecord }: ProcurementListViewProps) {
  const router = useRouter()
  const { addToPrintQueue } = usePrintHub()

  const [records, setRecords] = useState<UnifiedProcurementRecord[]>(UNIFIED_RECORDS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStep, setSelectedStep] = useState<number | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Yeni Dosya Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [newForm, setNewForm] = useState({
    docNo: `2026/DT-00${UNIFIED_RECORDS.length + 1}`,
    title: '',
    category: 'Mal Alımı (Doğrudan Temin)',
    department: 'Destek Hizmetleri Dairesi Başkanlığı',
    supplier: 'Turuncu Ofis Bilişim Ltd. Şti.',
    amount: 75000,
    stepSlug: 'malzeme-bilgisi',
  })

  // Modal State for instant document preview
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalDocNo, setModalDocNo] = useState('')
  const [modalDosya, setModalDosya] = useState<TeminDosyasiKaydi | undefined>()

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchSearch =
        !searchTerm.trim() ||
        rec.docNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchStep = selectedStep === 'all' || rec.stepIndex === selectedStep
      const matchStatus = selectedStatus === 'all' || rec.status === selectedStatus

      return matchSearch && matchStep && matchStatus
    })
  }, [records, searchTerm, selectedStep, selectedStatus])

  const handleExportCSV = () => {
    const headers = [
      'Sıra',
      'Dosya No',
      'Tarih',
      'Alım / İş Konusu',
      'Kategori',
      'Talep Birimi',
      'İstekli / Tedarikçi',
      'Tutar (TL)',
      'Aşama',
      'Durum',
      'Mevzuat Usulü',
    ]
    const rows = filteredRecords.map((r, idx) => [
      idx + 1,
      `"${r.docNo}"`,
      `"${r.date}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.department.replace(/"/g, '""')}"`,
      `"${r.supplier.replace(/"/g, '""')}"`,
      r.amount,
      `"${r.stepTitle}"`,
      `"${r.statusLabel}"`,
      `"${r.kikType}"`,
    ])
    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `Satin_Alma_Dosyalari_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newForm.title.trim()) return

    const stepMap: Record<string, { index: number; title: string }> = {
      'malzeme-bilgisi': { index: 1, title: '1. Malzeme Satın Alma Bilgisi' },
      'teklif-degerlendirme': { index: 2, title: '2. Teklif Değerlendirme' },
      'ihale-dosyasi': { index: 3, title: '3. İhale Dosyası (Şartname)' },
      'dogrudan-temin': { index: 4, title: '4. Doğrudan Temin (22/d)' },
      'sozlesme': { index: 5, title: '5. Satın Alma Sözleşmesi' },
    }

    const st = stepMap[newForm.stepSlug] || stepMap['malzeme-bilgisi']

    const newRec: UnifiedProcurementRecord = {
      id: `custom-${Date.now()}`,
      docNo: newForm.docNo,
      title: newForm.title,
      category: newForm.category,
      department: newForm.department,
      supplier: newForm.supplier,
      amount: Number(newForm.amount) || 0,
      currency: 'TL',
      stepIndex: st.index,
      stepSlug: newForm.stepSlug,
      stepTitle: st.title,
      status: 'aktif',
      statusLabel: 'Yeni Dosya Açıldı',
      date: new Date().toLocaleDateString('tr-TR'),
      tags: ['#Yeni', '#2026'],
      kikType: '4734 Sayılı KİK Madde 22/d',
    }

    setRecords((prev) => [newRec, ...prev])
    setIsNewModalOpen(false)

    if (onOpenRecord) {
      onOpenRecord(newRec)
    } else {
      router.push(`/${newRec.stepSlug}`)
    }
  }

  const handleOpenDocModal = (rec: UnifiedProcurementRecord) => {
    setModalTitle(rec.title)
    setModalDocNo(rec.docNo)
    const matchedDosya = ORNEK_TEMIN_DOSYALARI.find(
      (d) => d.temin_no === rec.docNo || d.id === 1
    )
    setModalDosya(matchedDosya || ORNEK_TEMIN_DOSYALARI[0])
    setModalOpen(true)
  }

  const handleSendToQueue = (rec: UnifiedProcurementRecord) => {
    addToPrintQueue({
      title: rec.title,
      docNo: rec.docNo,
      dosyaNo: rec.docNo,
      dosyaAdi: rec.title,
      category:
        rec.stepIndex === 4
          ? 'Doğrudan Temin (22/d)'
          : rec.stepIndex === 5
          ? 'Sözleşme'
          : 'Satın Alma (4734)',
      format: 'A4 Dikey',
      pageCount: 2,
    })
  }

  return (
    <div className="space-y-3 px-3 pb-8">
      {/* 1. ÖZET İSTATİSTİK ŞERİDİ */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-lg border border-[#e1e5ea] bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-[#7b8794]">
            <span>Toplam Dosya &amp; Kayıt</span>
            <FolderOpen className="size-4 text-[#2d62d7]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#172334]">{UNIFIED_RECORDS.length}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Tüm Süreçler</span>
          </div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-[#7b8794]">
            <span>Aktif / Devam Eden</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-amber-600">
              {UNIFIED_RECORDS.filter((r) => r.status === 'aktif').length}
            </span>
            <span className="text-[10px] text-gray-500">İşlemde</span>
          </div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-[#7b8794]">
            <span>Teklif &amp; İhale Onayında</span>
            <Layers className="size-4 text-blue-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#2d62d7]">
              {UNIFIED_RECORDS.filter((r) => r.stepIndex === 2 || r.stepIndex === 3).length}
            </span>
            <span className="text-[10px] text-gray-500">Komisyonda</span>
          </div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-[#7b8794]">
            <span>Tamamlanan / Sözleşmeli</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-700">
              {UNIFIED_RECORDS.filter((r) => r.status === 'tamamlandi').length}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Bağlandı</span>
          </div>
        </div>
      </div>

      {/* 2. ARAMA VE AŞAMA FİLTRE PANELİ */}
      <div className="rounded-lg border border-[#e1e5ea] bg-white p-3 shadow-2xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Arama Kutusu */}
          <div className="relative min-w-[260px] flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#9aa3ad]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Dosya no, malzeme adı, birim veya istekli firma ara..."
              className="h-8 w-full rounded border border-[#d9dee5] bg-[#fafbfc] pl-8 pr-3 text-[11px] text-[#172334] placeholder-[#9aa3ad] focus:border-[#2d62d7] focus:bg-white focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Durum Filtresi */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#7b8794] font-medium hidden sm:inline">Durum:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-8 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-medium text-[#172334] focus:border-[#2d62d7] focus:outline-none"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="aktif">Aktif / İşlemde</option>
              <option value="onay_bekliyor">Onay Bekliyor</option>
              <option value="tamamlandi">Tamamlandı</option>
            </select>
          </div>

          {/* Hızlı İşlem Düğmeleri */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="flex h-8 items-center gap-1.5 rounded bg-[#2d62d7] px-3 text-[11px] font-bold text-white shadow-2xs hover:bg-[#2455bd] transition"
              title="Yeni Satın Alma / Temin Dosyası Aç"
            >
              <Plus className="size-3.5" />
              <span>Yeni Dosya Aç</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex h-8 items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-semibold text-[#172334] hover:border-[#2d62d7] hover:text-[#2d62d7] transition shadow-2xs"
              title="Listeyi Excel / CSV Olarak İndir"
            >
              <Download className="size-3.5 text-[#5b6877]" />
              <span className="hidden sm:inline">Excel İndir</span>
            </button>

            <Link
              href="/temin-dosyasi"
              className="flex h-8 items-center gap-1.5 rounded border border-[#2d62d7] bg-[#eef3ff] px-3 text-[11px] font-bold text-[#2d62d7] hover:bg-blue-100 transition"
              title="Doğrudan Temin Karar Masasına Geç"
            >
              <FolderOpen className="size-3.5" />
              <span className="hidden md:inline">Temin Masası (22/d)</span>
            </Link>

            <Link
              href="/belge-builder"
              className="flex h-8 items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-semibold text-[#172334] hover:border-[#2d62d7] transition"
            >
              <FileSignature className="size-3.5 text-[#2d62d7]" />
              <span className="hidden sm:inline">EBYS Oluştur</span>
            </Link>
          </div>
        </div>

        {/* 5 Aşamalı Hızlı Filtre Sekmeleri */}
        <div className="flex flex-wrap items-center gap-1 border-t border-[#f0f2f5] pt-2">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-[#9aa3ad]">
            Aşama:
          </span>
          <button
            type="button"
            onClick={() => setSelectedStep('all')}
            className={`rounded px-2.5 py-1 text-[11px] font-medium transition ${
              selectedStep === 'all'
                ? 'bg-[#2d62d7] text-white shadow-2xs font-semibold'
                : 'border border-[#d9dee5] bg-white text-[#5b6877] hover:bg-[#f8f9fb]'
            }`}
          >
            Tümü ({UNIFIED_RECORDS.length})
          </button>
          {[
            { step: 1, label: '1. Malzeme Bilgisi', icon: Star },
            { step: 2, label: '2. Teklif Değerlendirme', icon: Layers },
            { step: 3, label: '3. İhale Dosyası', icon: FolderOpen },
            { step: 4, label: '4. Doğrudan Temin (22/d)', icon: FileText },
            { step: 5, label: '5. Sözleşme Yönetimi', icon: FileSignature },
          ].map((st) => {
            const count = UNIFIED_RECORDS.filter((r) => r.stepIndex === st.step).length
            const isSelected = selectedStep === st.step
            const Icon = st.icon

            return (
              <button
                key={st.step}
                type="button"
                onClick={() => setSelectedStep(st.step)}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-medium transition ${
                  isSelected
                    ? 'bg-[#2d62d7] text-white shadow-2xs font-semibold'
                    : 'border border-[#d9dee5] bg-white text-[#5b6877] hover:bg-[#f8f9fb]'
                }`}
              >
                <Icon className={`size-3 ${isSelected ? 'text-white' : 'text-[#7b8794]'}`} />
                <span>{st.label}</span>
                <span
                  className={`ml-0.5 rounded px-1 py-0.2 text-[9px] font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. KAMU 360 KURUMSAL KAYIT LİSTE TABLOSU */}
      <div className="overflow-hidden rounded-lg border border-[#e1e5ea] bg-white shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#e3e6eb] bg-[#f8f9fb] px-4 py-2.5 text-[12px] font-bold text-[#172334]">
          <div className="flex items-center gap-2">
            <span>Satın Alma ve Temin Dosyaları Listesi</span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#2d62d7]">
              {filteredRecords.length} Kayıt Listelendi
            </span>
          </div>
          <span className="text-[10px] text-[#7b8794] font-normal">
            Satıra tıklayarak veya &#39;Detaya Git&#39; ile form görünümüne dönebilirsiniz
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#e3e6eb] bg-[#f3f5f8] text-[10.5px] font-bold uppercase tracking-wider text-[#5b6877]">
                <th className="px-3 py-2 w-12 text-center">No</th>
                <th className="px-3 py-2 w-32">Dosya / Belge No</th>
                <th className="px-3 py-2 min-w-[260px]">İş / Malzeme Konusu</th>
                <th className="px-3 py-2 min-w-[170px]">Talep Birimi</th>
                <th className="px-3 py-2 min-w-[160px]">Tedarikçi / İstekli</th>
                <th className="px-3 py-2 w-28 text-right">Tutar (TL)</th>
                <th className="px-3 py-2 w-44">Mevcut Aşama</th>
                <th className="px-3 py-2 w-28">Durum</th>
                <th className="px-3 py-2 w-40 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceff3]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-500">
                    <div className="mx-auto flex max-w-xs flex-col items-center justify-center text-center">
                      <FolderOpen className="size-10 text-gray-300 mb-2" />
                      <p className="text-[13px] font-bold text-gray-700">Kayıt Bulunamadı</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Arama kriterlerine uygun satın alma veya temin dosyası bulunamadı.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedStep('all')
                          setSelectedStatus('all')
                        }}
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#2d62d7] hover:underline"
                      >
                        <RotateCcw className="size-3" />
                        <span>Filtreleri Sıfırla</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, idx) => {
                  return (
                    <tr
                      key={rec.id}
                      className="group transition-colors hover:bg-[#f6f9ff] cursor-pointer"
                      onClick={() => {
                        if (onOpenRecord) {
                          onOpenRecord(rec)
                        } else {
                          router.push(`/${rec.stepSlug}`)
                        }
                      }}
                    >
                      {/* Sıra No */}
                      <td className="px-3 py-2.5 text-center font-mono text-[#7b8794]">
                        {idx + 1}
                      </td>

                      {/* Belge No */}
                      <td className="px-3 py-2.5">
                        <div className="font-mono font-bold text-[#2d62d7] group-hover:underline">
                          {rec.docNo}
                        </div>
                        <span className="text-[9.5px] text-[#9aa3ad]">{rec.date}</span>
                      </td>

                      {/* Başlık ve Etiketler */}
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-[#172334] group-hover:text-[#2d62d7]">
                          {rec.title}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="rounded bg-gray-100 px-1.5 py-0.2 text-[9px] font-medium text-gray-600">
                            {rec.category}
                          </span>
                          {rec.tags.map((tg) => (
                            <span
                              key={tg}
                              className="rounded bg-blue-50 px-1.5 py-0.2 text-[9px] font-medium text-[#2d62d7]"
                            >
                              {tg}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Talep Eden Birim */}
                      <td className="px-3 py-2.5 text-[#475569]">
                        <div className="line-clamp-2 text-[10.5px]">{rec.department}</div>
                      </td>

                      {/* Tedarikçi / İstekli */}
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-[#172334]">{rec.supplier}</div>
                        <span className="text-[9.5px] text-[#7b8794]">{rec.kikType}</span>
                      </td>

                      {/* Tutar */}
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-[#172334]">
                        {rec.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {rec.currency}
                      </td>

                      {/* Aşama */}
                      <td className="px-3 py-2.5">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-2.5 py-0.5 text-[10px] font-bold text-[#2d62d7]">
                          <span className="flex size-4 items-center justify-center rounded-full bg-[#2d62d7] text-white text-[9px]">
                            {rec.stepIndex}
                          </span>
                          <span>{rec.stepTitle.replace(/^\d+\.\s*/, '')}</span>
                        </div>
                      </td>

                      {/* Durum */}
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            rec.status === 'tamamlandi'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : rec.status === 'onay_bekliyor'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {rec.statusLabel}
                        </span>
                      </td>

                      {/* Aksiyonlar */}
                      <td
                        className="px-3 py-2.5 text-center"
                        onClick={(e) => e.stopPropagation()} // Satır tıklamasını engelle
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenRecord) {
                                onOpenRecord(rec)
                              } else {
                                router.push(`/${rec.stepSlug}`)
                              }
                            }}
                            className="flex h-7 items-center gap-1 rounded bg-[#2d62d7] px-2.5 text-[10.5px] font-bold text-white shadow-2xs hover:bg-[#2455bd] transition"
                            title="Bu dosyanın detay ve düzenleme formunu aç"
                          >
                            <span>Detaya Git</span>
                            <ArrowRight className="size-3" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDocModal(rec)}
                            className="flex size-7 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#5b6877] hover:border-[#2d62d7] hover:text-[#2d62d7] transition"
                            title="A4 Resmî Belge Önizle / Yazdır"
                          >
                            <Eye className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendToQueue(rec)}
                            className="flex size-7 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#5b6877] hover:border-[#2d62d7] hover:text-[#2d62d7] transition"
                            title="Yazdırma Merkezine Gönder"
                          >
                            <Printer className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. A4 EVRAK ÖNİZLEME MODALI */}
      {modalOpen && (
        <UniversalDocumentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          dosyaVerisi={modalDosya}
          jobs={[
            {
              id: `job-${modalDocNo || 'preview'}`,
              title: modalTitle || 'Satın Alma Dokümanı',
              docNo: modalDocNo || '2026/DT-001',
              dosyaNo: modalDocNo || '2026/DT-001',
              dosyaAdi: modalTitle || 'Doğrudan Temin Dosyası',
              category: 'Doğrudan Temin (22/d)',
              format: 'A4 Dikey',
              pageCount: 2,
              status: 'Hazır',
              addedAt: 'Bugün',
            },
          ]}
        />
      )}
      {/* 5. YENİ SATIN ALMA DOSYASI AÇMA MODALI */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-lg rounded-xl border border-[#d9dee5] bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e3e6eb] pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-100 p-1.5 text-[#2d62d7]">
                  <Plus className="size-4" />
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-[#172334]">
                    Yeni Satın Alma / Temin Dosyası Aç
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Dosya parametrelerini tanımlayın ve doğrudan ilgili işlem adımına geçin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="mt-4 space-y-3 text-[11px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    Dosya / Belge No:
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.docNo}
                    onChange={(e) => setNewForm({ ...newForm, docNo: e.target.value })}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2.5 font-mono text-gray-900 focus:border-[#2d62d7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    Tahmini / Yaklaşık Maliyet (TL):
                  </label>
                  <input
                    type="number"
                    required
                    value={newForm.amount}
                    onChange={(e) => setNewForm({ ...newForm, amount: Number(e.target.value) })}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2.5 font-mono text-gray-900 focus:border-[#2d62d7] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-gray-700">
                  İş / Malzeme Satın Alma Konusu:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 10 Kalem Toner ve Bilişim Donanımı Temini"
                  value={newForm.title}
                  onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2.5 text-gray-900 focus:border-[#2d62d7] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    Talep Eden Birim:
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.department}
                    onChange={(e) => setNewForm({ ...newForm, department: e.target.value })}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2.5 text-gray-900 focus:border-[#2d62d7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    Tedarikçi / İstekli:
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.supplier}
                    onChange={(e) => setNewForm({ ...newForm, supplier: e.target.value })}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2.5 text-gray-900 focus:border-[#2d62d7] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    Başlangıç Adımı:
                  </label>
                  <select
                    value={newForm.stepSlug}
                    onChange={(e) => setNewForm({ ...newForm, stepSlug: e.target.value })}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2 text-gray-900 focus:border-[#2d62d7] focus:outline-none"
                  >
                    <option value="malzeme-bilgisi">1. Malzeme Satın Alma Bilgisi</option>
                    <option value="teklif-degerlendirme">2. Teklif Değerlendirme</option>
                    <option value="ihale-dosyasi">3. İhale Dosyası (Şartname)</option>
                    <option value="dogrudan-temin">4. Doğrudan Temin (22/d)</option>
                    <option value="sozlesme">5. Satın Alma Sözleşmesi</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    Kategori / Alım Türü:
                  </label>
                  <select
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2 text-gray-900 focus:border-[#2d62d7] focus:outline-none"
                  >
                    <option value="Mal Alımı (Doğrudan Temin)">Mal Alımı (Doğrudan Temin)</option>
                    <option value="Hizmet Alımı">Hizmet Alımı</option>
                    <option value="Bakım & Onarım">Bakım & Onarım</option>
                    <option value="Donanım & Yazılım">Donanım & Yazılım</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#e3e6eb] pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="rounded border border-gray-300 bg-white px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded bg-[#2d62d7] px-4 py-1.5 font-bold text-white hover:bg-[#2455bd] shadow-xs"
                >
                  <Plus className="size-3.5" />
                  <span>Dosyayı Aç ve Başla ➔</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
