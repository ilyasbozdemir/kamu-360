'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Building,
  CheckCircle2,
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
  Gavel,
  Layers,
  Plus,
  Printer,
  RotateCcw,
  Scale,
  Search,
  Sparkles,
  Tag,
  X,
} from 'lucide-react'
import { usePrintHub } from '@/lib/print-hub-context'
import { VarliklarTutanagiModal } from './varliklar-tutanagi-modal'

export interface GelirIhaleRecord {
  id: string
  ihaleNo: string
  title: string
  kategori: string
  usul: string
  muhammenBedel: number
  geciciTeminat: number
  paraBirimi: string
  stepIndex: number
  stepSlug: string
  stepTitle: string
  ihaleTarihi: string
  ihaleSaati: string
  istekliSayisi: number
  enYuksekPey: number
  kazananIstekli?: string
  status: 'canli' | 'onay_bekliyor' | 'sozlesme' | 'hazirlik'
  statusLabel: string
  varlikTipi: 'Kiralama' | 'Mülkiyet Satışı' | 'İrtifak Hakkı'
}

export const ORNEK_GELIR_IHALELERI: GelirIhaleRecord[] = [
  {
    id: 'ihale-1',
    ihaleNo: '2886-2026/01',
    title: 'Çankaya Hizmet Binası Zemin Kat Büfe ve Çay Ocağı Alanı 3 Yıllık Kiralama İhalesi',
    kategori: 'Taşınmaz Kiralama (Ticari Ünite)',
    usul: '2886 Sayılı Kanun Madde 45 (Açık Teklif Usulü)',
    muhammenBedel: 360000,
    geciciTeminat: 10800,
    paraBirimi: 'TL/Yıl',
    stepIndex: 2,
    stepSlug: 'teklif-artirma',
    stepTitle: '2. İstekliler & Açık Artırma (Pey)',
    ihaleTarihi: '18.03.2026',
    ihaleSaati: '14:30',
    istekliSayisi: 3,
    enYuksekPey: 420000,
    kazananIstekli: 'Lezzet Büfe İşletmeciliği Ltd. Şti.',
    status: 'canli',
    statusLabel: 'Açık Artırma Canlı',
    varlikTipi: 'Kiralama',
  },
  {
    id: 'ihale-2',
    ihaleNo: '2886-2026/02',
    title: 'Batıkent Rekreasyon Alanı Kafeterya ve Çay Bahçesi 5 Yıllık Kiralama İhalesi',
    kategori: 'Taşınmaz Kiralama (Sosyal Tesis)',
    usul: '2886 Sayılı Kanun Madde 45 (Açık Teklif Usulü)',
    muhammenBedel: 600000,
    geciciTeminat: 18000,
    paraBirimi: 'TL/Yıl',
    stepIndex: 3,
    stepSlug: 'komisyon-karari',
    stepTitle: '3. Komisyon Kararı & İhale Onayı',
    ihaleTarihi: '12.03.2026',
    ihaleSaati: '11:00',
    istekliSayisi: 4,
    enYuksekPey: 785000,
    kazananIstekli: 'Mavi Göl Sosyal Hizmetler A.Ş.',
    status: 'onay_bekliyor',
    statusLabel: 'Komisyon Onayında',
    varlikTipi: 'Kiralama',
  },
  {
    id: 'ihale-3',
    ihaleNo: '2886-2026/03',
    title: 'Fen İşleri Şantiyesi Hizmet Dışı Kalan 14 Adet Hurda İş Makinesi ve Demir Satışı',
    kategori: 'Menkul Mal / Hurda Satışı',
    usul: '2886 Sayılı Kanun Madde 35/a (Kapalı Teklif Usulü)',
    muhammenBedel: 1250000,
    geciciTeminat: 37500,
    paraBirimi: 'TL',
    stepIndex: 4,
    stepSlug: 'sozlesme-tahsilat',
    stepTitle: '4. Sözleşme & Tahsilat Planı',
    ihaleTarihi: '05.03.2026',
    ihaleSaati: '10:00',
    istekliSayisi: 5,
    enYuksekPey: 1480000,
    kazananIstekli: 'Demir Çelik Geri Dönüşüm San. Tic. Ltd. Şti.',
    status: 'sozlesme',
    statusLabel: 'Sözleşme & Tahsilat',
    varlikTipi: 'Mülkiyet Satışı',
  },
  {
    id: 'ihale-4',
    ihaleNo: '2886-2026/04',
    title: 'Kızılay Çok Katlı Otopark İşletmesi 5 Yıllık Kiralama ve İşletme Hakkı İhalesi',
    kategori: 'Otopark ve Ulaşım Tesisi',
    usul: '2886 Sayılı Kanun Madde 51/g (Pazarlık Usulü)',
    muhammenBedel: 2400000,
    geciciTeminat: 72000,
    paraBirimi: 'TL/Yıl',
    stepIndex: 1,
    stepSlug: 'dosya-tanimi',
    stepTitle: '1. İhale Dosyası & Muhammen Bedel',
    ihaleTarihi: '28.03.2026',
    ihaleSaati: '15:00',
    istekliSayisi: 0,
    enYuksekPey: 0,
    status: 'hazirlik',
    statusLabel: 'Şartname Hazırlığında',
    varlikTipi: 'Kiralama',
  },
  {
    id: 'ihale-5',
    ihaleNo: '2886-2026/05',
    title: 'Çayyolu Ticaret Merkezi 1. Kat 4 No&#39;lu Bağımsız Bölüm Dükkan Mülkiyet Satışı',
    kategori: 'Gayrimenkul Mülkiyet Satışı',
    usul: '2886 Sayılı Kanun Madde 35/a (Kapalı Teklif Usulü)',
    muhammenBedel: 4800000,
    geciciTeminat: 144000,
    paraBirimi: 'TL',
    stepIndex: 5,
    stepSlug: 'varlik-envanteri',
    stepTitle: '5. Kiralanabilir & Satılabilir Varlıklar',
    ihaleTarihi: '08.04.2026',
    ihaleSaati: '14:00',
    istekliSayisi: 0,
    enYuksekPey: 0,
    status: 'hazirlik',
    statusLabel: 'Envanterde / İhaleye Açık',
    varlikTipi: 'Mülkiyet Satışı',
  },
]

interface GelirIhaleListViewProps {
  onOpenRecord?: (record: GelirIhaleRecord) => void
}

export function GelirIhaleListView({ onOpenRecord }: GelirIhaleListViewProps) {
  const router = useRouter()
  const { addToPrintQueue } = usePrintHub()

  const [records, setRecords] = useState<GelirIhaleRecord[]>(ORNEK_GELIR_IHALELERI)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStep, setSelectedStep] = useState<number | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedVarlikTipi, setSelectedVarlikTipi] = useState<string>('all')
  const [isTutanakModalOpen, setIsTutanakModalOpen] = useState(false)

  // Yeni 2886 İhalesi Başlatma Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [newIhaleForm, setNewIhaleForm] = useState({
    ihaleNo: `2886-2026/0${ORNEK_GELIR_IHALELERI.length + 1}`,
    title: '',
    kategori: 'Taşınmaz Kiralama (Ticari Ünite)',
    usul: '2886 Sayılı Kanun Madde 45 (Açık Teklif Usulü)',
    varlikTipi: 'Kiralama' as 'Kiralama' | 'Mülkiyet Satışı' | 'İrtifak Hakkı',
    muhammenBedel: 450000,
    geciciTeminat: 13500,
    ihaleTarihi: new Date().toLocaleDateString('tr-TR'),
    ihaleSaati: '14:00',
    stepSlug: 'dosya-tanimi',
  })

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchSearch =
        !searchTerm.trim() ||
        rec.ihaleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.usul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.kazananIstekli && rec.kazananIstekli.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchStep = selectedStep === 'all' || rec.stepIndex === selectedStep
      const matchStatus = selectedStatus === 'all' || rec.status === selectedStatus
      const matchVarlik = selectedVarlikTipi === 'all' || rec.varlikTipi === selectedVarlikTipi

      return matchSearch && matchStep && matchStatus && matchVarlik
    })
  }, [records, searchTerm, selectedStep, selectedStatus, selectedVarlikTipi])

  const handleExportCSV = () => {
    const headers = [
      'Sıra',
      'İhale No',
      'İhale Tarihi',
      'İhale Konusu',
      'Varlık Türü',
      'Kategori',
      'İhale Usulü',
      'Muhammen Bedel',
      'Geçici Teminat (TL)',
      'Aşama',
      'Durum',
      'En Yüksek Pey (TL)',
      'Kazanan İstekli',
    ]
    const rows = filteredRecords.map((r, idx) => [
      idx + 1,
      `"${r.ihaleNo}"`,
      `"${r.ihaleTarihi} ${r.ihaleSaati}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.varlikTipi}"`,
      `"${r.kategori}"`,
      `"${r.usul}"`,
      r.muhammenBedel,
      r.geciciTeminat,
      `"${r.stepTitle}"`,
      `"${r.statusLabel}"`,
      r.enYuksekPey,
      `"${r.kazananIstekli || '-'}"`,
    ])
    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `2886_Gelir_Ihaleleri_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCreateIhale = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIhaleForm.title.trim()) return

    const stepMap: Record<string, { index: number; title: string }> = {
      'dosya-tanimi': { index: 1, title: '1. İhale Dosyası & Muhammen Bedel' },
      'teklif-artirma': { index: 2, title: '2. İstekliler & Açık Artırma (Pey)' },
      'komisyon-karari': { index: 3, title: '3. Komisyon Kararı & İhale Onayı' },
      'sozlesme-tahsilat': { index: 4, title: '4. Sözleşme & Tahsilat Planı' },
      'varlik-envanteri': { index: 5, title: '5. Kiralanabilir & Satılabilir Varlıklar' },
    }

    const st = stepMap[newIhaleForm.stepSlug] || stepMap['dosya-tanimi']

    const newRec: GelirIhaleRecord = {
      id: `ihale-${Date.now()}`,
      ihaleNo: newIhaleForm.ihaleNo,
      title: newIhaleForm.title,
      kategori: newIhaleForm.kategori,
      usul: newIhaleForm.usul,
      muhammenBedel: Number(newIhaleForm.muhammenBedel) || 0,
      geciciTeminat: Number(newIhaleForm.geciciTeminat) || Math.round((Number(newIhaleForm.muhammenBedel) || 0) * 0.03),
      paraBirimi: newIhaleForm.varlikTipi === 'Kiralama' ? 'TL/Yıl' : 'TL',
      stepIndex: st.index,
      stepSlug: newIhaleForm.stepSlug,
      stepTitle: st.title,
      ihaleTarihi: newIhaleForm.ihaleTarihi,
      ihaleSaati: newIhaleForm.ihaleSaati,
      istekliSayisi: 0,
      enYuksekPey: 0,
      status: 'hazirlik',
      statusLabel: 'Yeni Dosya Açıldı',
      varlikTipi: newIhaleForm.varlikTipi,
    }

    setRecords((prev) => [newRec, ...prev])
    setIsNewModalOpen(false)

    if (onOpenRecord) {
      onOpenRecord(newRec)
    } else {
      router.push(`/gelir-ihaleleri/${newRec.stepSlug}`)
    }
  }

  const handleSendToQueue = (rec: GelirIhaleRecord) => {
    addToPrintQueue({
      title: `${rec.title} - İhale Tutanağı`,
      docNo: rec.ihaleNo,
      dosyaNo: rec.ihaleNo,
      dosyaAdi: rec.title,
      category: 'Gelir İhalesi (2886)',
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
            <span>Toplam 2886 İhalesi</span>
            <Scale className="size-4 text-purple-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#172334]">{ORNEK_GELIR_IHALELERI.length}</span>
            <span className="text-[10px] text-purple-600 font-semibold">Aktif Dosyalar</span>
          </div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-[#7b8794]">
            <span>Canlı Açık Artırma (Pey)</span>
            <Gavel className="size-4 text-amber-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-amber-600">
              {ORNEK_GELIR_IHALELERI.filter((r) => r.status === 'canli').length}
            </span>
            <span className="text-[10px] text-amber-600 font-medium">Salonda Devam Ediyor</span>
          </div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-[#7b8794]">
            <span>Komisyon Onayında</span>
            <Layers className="size-4 text-blue-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#2d62d7]">
              {ORNEK_GELIR_IHALELERI.filter((r) => r.status === 'onay_bekliyor').length}
            </span>
            <span className="text-[10px] text-gray-500">Encümen Onayı</span>
          </div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-[#7b8794]">
            <span>Sözleşme &amp; Tahsilat</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-700">
              {ORNEK_GELIR_IHALELERI.filter((r) => r.status === 'sozlesme').length}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Kesinleşti</span>
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
              placeholder="İhale no, taşınmaz adı, ihale usulü veya istekli ara..."
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

          {/* Varlık Tipi Filtresi */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#7b8794] font-medium hidden sm:inline">Tür:</span>
            <select
              value={selectedVarlikTipi}
              onChange={(e) => setSelectedVarlikTipi(e.target.value)}
              className="h-8 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-medium text-[#172334] focus:border-[#2d62d7] focus:outline-none"
            >
              <option value="all">Tüm Türler</option>
              <option value="Kiralama">Kiralama</option>
              <option value="Mülkiyet Satışı">Mülkiyet Satışı</option>
            </select>
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
              <option value="canli">Açık Artırma Canlı</option>
              <option value="onay_bekliyor">Komisyon Onayında</option>
              <option value="sozlesme">Sözleşme &amp; Tahsilat</option>
              <option value="hazirlik">Hazırlıkta</option>
            </select>
          </div>

          {/* Butonlar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="flex h-8 items-center gap-1.5 rounded bg-[#7c3aed] px-3 text-[11px] font-bold text-white shadow-2xs hover:bg-[#6d28d9] transition"
              title="Yeni 2886 Gelir İhalesi Dosyası Aç"
            >
              <Plus className="size-3.5" />
              <span>Yeni İhale Başlat</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex h-8 items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-semibold text-[#172334] hover:border-purple-600 hover:text-purple-700 transition shadow-2xs"
              title="2886 İhale Listesini Excel / CSV Olarak İndir"
            >
              <Download className="size-3.5 text-[#5b6877]" />
              <span className="hidden sm:inline">Excel İndir</span>
            </button>

            {/* A4 Tutanak Butonu */}
            <button
              type="button"
              onClick={() => setIsTutanakModalOpen(true)}
              className="flex h-8 items-center gap-1.5 rounded border border-purple-300 bg-purple-50/80 px-3 text-[11px] font-bold text-purple-700 hover:bg-purple-100 transition shadow-2xs"
              title="2886 Varlıklar ve İhale Şartname Tutanağını Görüntüle"
            >
              <FileText className="size-3.5" />
              <span>A4 Varlıklar Tutanağı</span>
            </button>
          </div>
        </div>

        {/* 5 Aşamalı Sekmeler */}
        <div className="flex flex-wrap items-center gap-1 border-t border-[#f0f2f5] pt-2">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-[#9aa3ad]">
            Adım:
          </span>
          <button
            type="button"
            onClick={() => setSelectedStep('all')}
            className={`rounded px-2.5 py-1 text-[11px] font-medium transition ${
              selectedStep === 'all'
                ? 'bg-[#7c3aed] text-white shadow-2xs font-semibold'
                : 'border border-[#d9dee5] bg-white text-[#5b6877] hover:bg-[#f8f9fb]'
            }`}
          >
            Tümü ({ORNEK_GELIR_IHALELERI.length})
          </button>
          {[
            { step: 1, label: '1. Dosya & Muhammen Bedel', icon: Scale },
            { step: 2, label: '2. İstekliler & Açık Artırma', icon: Gavel },
            { step: 3, label: '3. Komisyon Kararı', icon: Layers },
            { step: 4, label: '4. Sözleşme & Tahsilat', icon: FileCheck2 },
            { step: 5, label: '5. Varlık Envanteri', icon: FolderOpen },
          ].map((st) => {
            const count = ORNEK_GELIR_IHALELERI.filter((r) => r.stepIndex === st.step).length
            const isSelected = selectedStep === st.step
            const Icon = st.icon

            return (
              <button
                key={st.step}
                type="button"
                onClick={() => setSelectedStep(st.step)}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-medium transition ${
                  isSelected
                    ? 'bg-[#7c3aed] text-white shadow-2xs font-semibold'
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

      {/* 3. KURUMSAL LİSTE TABLOSU */}
      <div className="overflow-hidden rounded-lg border border-[#e1e5ea] bg-white shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#e3e6eb] bg-[#f8f9fb] px-4 py-2.5 text-[12px] font-bold text-[#172334]">
          <div className="flex items-center gap-2">
            <span>2886 Sayılı Devlet İhale Kanunu Dosyaları</span>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
              {filteredRecords.length} Dosya Listelendi
            </span>
          </div>
          <span className="text-[10px] text-[#7b8794] font-normal">
            Satıra tıklayarak veya &#39;Detaya Git&#39; ile ihale adım formuna dönebilirsiniz
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#e3e6eb] bg-[#f3f5f8] text-[10.5px] font-bold uppercase tracking-wider text-[#5b6877]">
                <th className="px-3 py-2 w-12 text-center">No</th>
                <th className="px-3 py-2 w-32">İhale No</th>
                <th className="px-3 py-2 min-w-[260px]">İhale / Taşınmaz Konusu</th>
                <th className="px-3 py-2 min-w-[150px]">İhale Usulü</th>
                <th className="px-3 py-2 w-32 text-right">Muhammen Bedel</th>
                <th className="px-3 py-2 w-28 text-right">Geçici Teminat</th>
                <th className="px-3 py-2 w-36">Aşama &amp; Durum</th>
                <th className="px-3 py-2 w-36 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceff3]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="mx-auto flex max-w-xs flex-col items-center justify-center text-center">
                      <Scale className="size-10 text-gray-300 mb-2" />
                      <p className="text-[13px] font-bold text-gray-700">İhale Dosyası Bulunamadı</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Arama kriterlerine uygun 2886 gelir ihalesi kaydı bulunamadı.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, idx) => {
                  return (
                    <tr
                      key={rec.id}
                      className="group transition-colors hover:bg-[#faf7ff] cursor-pointer"
                      onClick={() => {
                        if (onOpenRecord) {
                          onOpenRecord(rec)
                        } else {
                          router.push(`/gelir-ihaleleri/${rec.stepSlug}`)
                        }
                      }}
                    >
                      <td className="px-3 py-2.5 text-center font-mono text-[#7b8794]">
                        {idx + 1}
                      </td>

                      <td className="px-3 py-2.5">
                        <div className="font-mono font-bold text-purple-700 group-hover:underline">
                          {rec.ihaleNo}
                        </div>
                        <span className="text-[9.5px] text-[#9aa3ad]">
                          {rec.ihaleTarihi} - {rec.ihaleSaati}
                        </span>
                      </td>

                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-[#172334] group-hover:text-purple-700">
                          {rec.title}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="rounded bg-purple-50 px-1.5 py-0.2 text-[9px] font-semibold text-purple-700">
                            {rec.varlikTipi}
                          </span>
                          <span className="rounded bg-gray-100 px-1.5 py-0.2 text-[9px] font-medium text-gray-600">
                            {rec.kategori}
                          </span>
                          {rec.kazananIstekli && (
                            <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-medium text-emerald-700">
                              En Yüksek Pey: {rec.enYuksekPey.toLocaleString('tr-TR')} TL ({rec.kazananIstekli})
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-2.5 text-[#475569]">
                        <div className="text-[10.5px]">{rec.usul}</div>
                      </td>

                      <td className="px-3 py-2.5 text-right font-mono font-bold text-[#172334]">
                        {rec.muhammenBedel.toLocaleString('tr-TR')} {rec.paraBirimi}
                      </td>

                      <td className="px-3 py-2.5 text-right font-mono font-medium text-[#7c3aed]">
                        {rec.geciciTeminat.toLocaleString('tr-TR')} TL
                      </td>

                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            rec.status === 'canli'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : rec.status === 'sozlesme'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {rec.statusLabel}
                        </span>
                      </td>

                      <td
                        className="px-3 py-2.5 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenRecord) {
                                onOpenRecord(rec)
                              } else {
                                router.push(`/gelir-ihaleleri/${rec.stepSlug}`)
                              }
                            }}
                            className="flex h-7 items-center gap-1 rounded bg-[#7c3aed] px-2.5 text-[10.5px] font-bold text-white shadow-2xs hover:bg-[#6d28d9] transition"
                            title="Bu ihalenin detay ve işlem ekranını aç"
                          >
                            <span>Detaya Git</span>
                            <ArrowRight className="size-3" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendToQueue(rec)}
                            className="flex size-7 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#5b6877] hover:border-purple-500 hover:text-purple-700 transition"
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

      {/* A4 Varlıklar Tutanağı Modalı */}
      {isTutanakModalOpen && (
        <VarliklarTutanagiModal
          isOpen={isTutanakModalOpen}
          onClose={() => setIsTutanakModalOpen(false)}
        />
      )}

      {/* YENİ 2886 İHALESİ BAŞLATMA MODALI */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-lg rounded-xl border border-[#d9dee5] bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e3e6eb] pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-purple-100 p-1.5 text-purple-700">
                  <Plus className="size-4" />
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-[#172334]">
                    Yeni 2886 Sayılı Devlet İhalesi Başlat
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Taşınmaz kiralama, arsa satışı veya hurda ihalesi parametrelerini tanımlayın.
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

            <form onSubmit={handleCreateIhale} className="mt-4 space-y-3 text-[11px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    İhale Dosya No:
                  </label>
                  <input
                    type="text"
                    required
                    value={newIhaleForm.ihaleNo}
                    onChange={(e) => setNewIhaleForm({ ...newIhaleForm, ihaleNo: e.target.value })}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2.5 font-mono text-gray-900 focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    Muhammen Bedel (TL):
                  </label>
                  <input
                    type="number"
                    required
                    value={newIhaleForm.muhammenBedel}
                    onChange={(e) => {
                      const bedel = Number(e.target.value)
                      setNewIhaleForm({
                        ...newIhaleForm,
                        muhammenBedel: bedel,
                        geciciTeminat: Math.round(bedel * 0.03),
                      })
                    }}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2.5 font-mono text-gray-900 focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-gray-700">
                  İhale / Taşınmaz Konusu:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kızılay İşhanı 2. Kat Büfe 3 Yıllık Kiralama İhalesi"
                  value={newIhaleForm.title}
                  onChange={(e) => setNewIhaleForm({ ...newIhaleForm, title: e.target.value })}
                  className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2.5 text-gray-900 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    İşlem / Varlık Türü:
                  </label>
                  <select
                    value={newIhaleForm.varlikTipi}
                    onChange={(e) => setNewIhaleForm({ ...newIhaleForm, varlikTipi: e.target.value as any })}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2 text-gray-900 focus:border-purple-600 focus:outline-none"
                  >
                    <option value="Kiralama">Taşınmaz Kiralama</option>
                    <option value="Mülkiyet Satışı">Mülkiyet / Menkul Satışı</option>
                    <option value="İrtifak Hakkı">İrtifak Hakkı Tesisi</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    İhale Usulü:
                  </label>
                  <select
                    value={newIhaleForm.usul}
                    onChange={(e) => setNewIhaleForm({ ...newIhaleForm, usul: e.target.value })}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2 text-gray-900 focus:border-purple-600 focus:outline-none"
                  >
                    <option value="2886 Sayılı Kanun Madde 45 (Açık Teklif Usulü)">Madde 45 (Açık Teklif Usulü)</option>
                    <option value="2886 Sayılı Kanun Madde 35/a (Kapalı Teklif Usulü)">Madde 35/a (Kapalı Teklif Usulü)</option>
                    <option value="2886 Sayılı Kanun Madde 51/g (Pazarlık Usulü)">Madde 51/g (Pazarlık Usulü)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    İhale Tarihi &amp; Saati:
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newIhaleForm.ihaleTarihi}
                      onChange={(e) => setNewIhaleForm({ ...newIhaleForm, ihaleTarihi: e.target.value })}
                      className="h-8 w-2/3 rounded border border-[#d9dee5] bg-white px-2 text-gray-900 focus:border-purple-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={newIhaleForm.ihaleSaati}
                      onChange={(e) => setNewIhaleForm({ ...newIhaleForm, ihaleSaati: e.target.value })}
                      className="h-8 w-1/3 rounded border border-[#d9dee5] bg-white px-2 text-gray-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">
                    Geçici Teminat Tutarı (%3):
                  </label>
                  <input
                    type="number"
                    value={newIhaleForm.geciciTeminat}
                    onChange={(e) => setNewIhaleForm({ ...newIhaleForm, geciciTeminat: Number(e.target.value) })}
                    className="h-8 w-full rounded border border-[#d9dee5] bg-white px-2.5 font-mono text-purple-700 focus:border-purple-600 focus:outline-none"
                  />
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
                  className="flex items-center gap-1.5 rounded bg-[#7c3aed] px-4 py-1.5 font-bold text-white hover:bg-[#6d28d9] shadow-xs"
                >
                  <Plus className="size-3.5" />
                  <span>İhaleyi Başlat ve Adıma Git ➔</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

