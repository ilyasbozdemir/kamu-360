'use client'

import React, { useState, useEffect } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Layers,
  Printer,
  Scale,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { PrintJob } from '@/lib/print-hub-context'
import { ORNEK_TEMIN_DOSYALARI, TeminDosyasiKaydi } from '@/lib/temin-dosyasi/schema'
import {
  OnayBelgesiTemplate,
  PiyasaFiyatArastirmasiTemplate,
  YaklasikMaliyetTemplate,
  TeklifMektubuTemplate,
  SozlesmeTemplate,
  MuayeneKabulTemplate,
  DamgaVergisiTemplate,
} from '@/lib/document-engine/templates/all-templates'
import { ResmiUstYaziTemplate } from '@/lib/document-engine/template'
import { resmiUstYaziResolver } from '@/lib/document-engine/resolver'
import { VarliklarTutanagiTemplate } from '@/components/gelir-ihaleleri/templates/varliklar-tutanagi'
import { renderWorkdeskTemplate, WORKDESK_TEMPLATES_CATALOG } from '@/lib/document-engine/workdesk-adapter'

interface UniversalDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  jobs: PrintJob[]
  initialJobId?: string
  activeJobId?: string
  onSelectJob?: (id: string) => void
  dosyaVerisi?: TeminDosyasiKaydi
}

export function UniversalDocumentModal({
  isOpen,
  onClose,
  jobs,
  initialJobId,
  activeJobId: controlledActiveId,
  onSelectJob,
  dosyaVerisi,
}: UniversalDocumentModalProps) {
  const [internalActiveJobId, setInternalActiveJobId] = useState<string>(
    controlledActiveId || initialJobId || (jobs.length > 0 ? jobs[0].id : '')
  )
  const [scaleMode, setScaleMode] = useState<'normal' | 'fit'>('normal')
  const [viewAllPages, setViewAllPages] = useState<boolean>(false)
  const [engineMode, setEngineMode] = useState<'workdesk' | 'standart'>('workdesk')

  const activeJobId = controlledActiveId || internalActiveJobId

  const setActiveJobId = (id: string) => {
    setInternalActiveJobId(id)
    if (onSelectJob) onSelectJob(id)
  }

  useEffect(() => {
    if (controlledActiveId) {
      setInternalActiveJobId(controlledActiveId)
    } else if (initialJobId) {
      setInternalActiveJobId(initialJobId)
    } else if (jobs.length > 0) {
      setInternalActiveJobId(jobs[0].id)
    }
  }, [controlledActiveId, initialJobId, jobs])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || jobs.length === 0) return null

  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0]
  const activeIndex = jobs.findIndex((j) => j.id === activeJob.id)

  // Dosya verisini eşle
  const resolveDosya = (job: PrintJob): TeminDosyasiKaydi => {
    if (dosyaVerisi && (dosyaVerisi.temin_no === job.dosyaNo || !job.dosyaNo || jobs.length <= 8)) {
      return dosyaVerisi
    }
    const matched = ORNEK_TEMIN_DOSYALARI.find(
      (d) => d.temin_no === job.dosyaNo || d.temin_no === job.docNo
    )
    if (matched) return matched

    // Eşleşme yoksa dinamik doldur
    return {
      ...ORNEK_TEMIN_DOSYALARI[0],
      temin_no: job.dosyaNo || job.docNo || '2026/DT-001',
      konu: job.dosyaAdi || job.title,
    }
  }

  // Şablonu eşle ve render et
  const renderTemplateForJob = (job: PrintJob) => {
    const dosya = resolveDosya(job)
    const code = (job.docNo || '').toUpperCase()
    const title = (job.title || '').toLowerCase()

    // 0. Workdesk 360 Şablon Motoru (workdesk-360 / packages/document-templates)
    if (engineMode === 'workdesk' || code.startsWith('WD_')) {
      const workdeskElement = renderWorkdeskTemplate(job.docNo || job.id, dosya)
      if (workdeskElement) return workdeskElement
    }

    // 1. Harcama Talimatı / İhale Onay Belgesi
    if (
      code.includes('ONAY') ||
      title.includes('onay belgesi') ||
      title.includes('harcama talimatı')
    ) {
      return <OnayBelgesiTemplate data={dosya} />
    }

    // 2. Piyasa Fiyat Araştırma Tutanağı
    if (
      code.includes('PIYASA') ||
      title.includes('piyasa fiyat') ||
      title.includes('fiyat araştırma')
    ) {
      return <PiyasaFiyatArastirmasiTemplate data={dosya} />
    }

    // 3. Doğrudan Temin Alım Sözleşmesi
    if (code.includes('SOZLESME') || title.includes('sözleşme') || title.includes('sipariş akdi')) {
      return <SozlesmeTemplate data={dosya} />
    }

    // 4. Yaklaşık Maliyet Hesap Cetveli
    if (code.includes('YAKLASIK') || title.includes('yaklaşık maliyet') || title.includes('maliyet cetveli')) {
      return <YaklasikMaliyetTemplate data={dosya} />
    }

    // 5. Teklif Mektubu ve Cetveli
    if (code.includes('TEKLIF') || title.includes('teklif mektubu') || title.includes('fiyat isteme')) {
      return <TeklifMektubuTemplate data={dosya} />
    }

    // 6. Muayene ve Kabul Tutanağı
    if (code.includes('MUAYENE') || title.includes('muayene') || title.includes('kabul tutanağı')) {
      return <MuayeneKabulTemplate data={dosya} />
    }

    // 7. Damga Vergisi ve Tahakkuk
    if (code.includes('DAMGA') || title.includes('damga') || title.includes('tahakkuk') || title.includes('karar pulu')) {
      return <DamgaVergisiTemplate data={dosya} />
    }

    // 8. Resmî Üst Yazı (EBYS 31151)
    if (code.includes('RESMI') || code.includes('EBYS') || title.includes('üst yazı') || title.includes('resmî')) {
      const data = resmiUstYaziResolver.resolve({
        dosya: {
          dosya_no: dosya.temin_no,
          is_tanimi: dosya.konu,
          sunulacak_makam: dosya.sunulacak_makam,
          harcama_yetkilisi: dosya.onay_personel_adi,
        },
      })
      return <ResmiUstYaziTemplate data={data} />
    }

    // 9. 2886 Varlıklar & Pey Tutanağı
    if (
      code.includes('2886') ||
      code.includes('PEY') ||
      code.includes('VARLIK') ||
      title.includes('varlık') ||
      title.includes('kiralama') ||
      title.includes('açık artırma')
    ) {
      return <VarliklarTutanagiTemplate />
    }

    // Varsayılan resmi onay belgesi
    return <OnayBelgesiTemplate data={dosya} />
  }

  // Sadece A4 belgesini yazdır (arayüz gizlenir)
  const handlePrint = () => {
    document.body.classList.add('printing-mode')
    window.print()
    setTimeout(() => {
      document.body.classList.remove('printing-mode')
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[96vh] w-full max-w-5xl flex-col rounded border border-[#e1e5ea] bg-[#f1f3f7] shadow-2xl overflow-hidden">
        {/* MODAL ÜST ARAÇ ÇUBUĞU (Yazıcıda gizlenir) - Kamu 360 Teması */}
        <div className="no-print flex flex-wrap items-center justify-between border-b border-[#e3e6eb] bg-[#f8f9fb] px-4 py-2.5 gap-3">
          {/* Sol: Belge Başlığı ve Kategori */}
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded bg-[#eef3ff] text-[#2d62d7]">
              <Printer className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[12px] font-bold text-[#172334] leading-none">
                  {activeJob.title}
                </h3>
                <span className="rounded-sm bg-[#f0f4ff] border border-[#d3e0fb] px-1.5 py-0.5 text-[10px] font-semibold font-mono text-[#2d62d7]">
                  {activeJob.docNo}
                </span>
                <span className="rounded-sm bg-[#dcefd9] px-1.5 py-0.5 text-[10px] font-medium text-[#2f6a2f]">
                  A4 Matbu Evrak
                </span>
              </div>
              <p className="text-[10px] text-[#7b8794] mt-0.5">
                Dosya: <strong className="text-[#26384c]">{activeJob.dosyaNo || '2026/DT-001'}</strong> • {activeJob.category}
              </p>
            </div>
          </div>

          {/* Sağ: Aksiyon Butonları */}
          <div className="flex items-center gap-2">
            {/* Şablon Motoru Seçici: Workdesk 360 vs Standart KİK */}
            <div className="flex items-center rounded border border-[#d9dee5] bg-[#f8f9fb] p-0.5 text-[10.5px]">
              <button
                type="button"
                onClick={() => setEngineMode('workdesk')}
                className={`rounded px-2.5 py-1 font-semibold transition ${
                  engineMode === 'workdesk'
                    ? 'bg-[#2d62d7] text-white shadow-2xs'
                    : 'text-[#5b6877] hover:text-[#172334]'
                }`}
                title="Workdesk-360 Matris ve Tablo Motoru"
              >
                Workdesk 360
              </button>
              <button
                type="button"
                onClick={() => setEngineMode('standart')}
                className={`rounded px-2.5 py-1 font-semibold transition ${
                  engineMode === 'standart'
                    ? 'bg-[#2d62d7] text-white shadow-2xs'
                    : 'text-[#5b6877] hover:text-[#172334]'
                }`}
                title="Klasik KİK Matbu Formatı"
              >
                Standart KİK
              </button>
            </div>
            {/* Tek / Çoklu Sayfa Geçişi */}
            {jobs.length > 1 && (
              <button
                type="button"
                onClick={() => setViewAllPages(!viewAllPages)}
                className={`flex h-7 items-center gap-1.5 rounded border px-2.5 text-[11px] font-medium transition ${
                  viewAllPages
                    ? 'border-[#2d62d7] bg-[#f0f5ff] text-[#2d62d7] font-semibold'
                    : 'border-[#d9dee5] bg-white text-[#5b6877] hover:bg-[#f5f6f8]'
                }`}
              >
                <Layers className="size-3.5" />
                <span>{viewAllPages ? 'Tek Belge Modu' : `Tüm Sayfaları Aç (${jobs.length})`}</span>
              </button>
            )}

            {/* Ölçek Düğmesi */}
            <button
              type="button"
              onClick={() => setScaleMode(scaleMode === 'normal' ? 'fit' : 'normal')}
              className="flex h-7 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-medium text-[#5b6877] hover:bg-[#f5f6f8]"
              title="Ölçeği Değiştir"
            >
              {scaleMode === 'normal' ? <ZoomOut className="size-3.5" /> : <ZoomIn className="size-3.5" />}
              <span>{scaleMode === 'normal' ? 'Sığdır (%85)' : 'Gerçek Boyut (%100)'}</span>
            </button>

            {/* A4 Yazdır Butonu */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3.5 text-[11px] font-medium text-white transition hover:bg-[#2455bd]"
            >
              <Printer className="size-3.5" />
              <span>{viewAllPages ? `Tümünü Yazdır (${jobs.length} Sayfa)` : 'Bu Belgeyi Yazdır (A4)'}</span>
            </button>

            {/* Kapat */}
            <button
              type="button"
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded text-[#8a94a1] hover:bg-[#e4e6ea] hover:text-[#172334] ml-1 transition"
              title="Kapat (Esc)"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* EĞER BİRDEN FAZLA BELGE VARSA HIZLI SAYFA SEÇİCİ SEKMELER - Kamu 360 Teması */}
        {jobs.length > 1 && !viewAllPages && (
          <div className="no-print flex items-center justify-between border-b border-[#e3e6eb] bg-[#f8f9fb] px-3 py-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="font-semibold text-[#5b6877] mr-1 text-[10.5px]">Belgeler:</span>
              {jobs.map((j, idx) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => setActiveJobId(j.id)}
                  className={`h-6 rounded border px-2 text-[10.5px] font-medium transition flex items-center gap-1.5 ${
                    activeJobId === j.id
                      ? 'border-[#2d62d7] bg-white text-[#2d62d7] font-semibold shadow-xs'
                      : 'border-[#d9dee5] bg-white text-[#5b6877] hover:border-[#b8c2cc] hover:text-[#26384c]'
                  }`}
                >
                  <span className="size-3.5 rounded-sm bg-[#f0f4ff] text-[9px] flex items-center justify-center font-mono text-[#2d62d7]">
                    {idx + 1}
                  </span>
                  <span>{j.title.split('(')[0].trim()}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => setActiveJobId(jobs[activeIndex - 1].id)}
                className="flex size-6 items-center justify-center rounded text-[#5b6877] hover:bg-[#e4e6ea] disabled:opacity-30"
                title="Önceki Belge"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="font-mono text-[10.5px] font-bold text-[#26384c] px-1">
                {activeIndex + 1} / {jobs.length}
              </span>
              <button
                type="button"
                disabled={activeIndex === jobs.length - 1}
                onClick={() => setActiveJobId(jobs[activeIndex + 1].id)}
                className="flex size-6 items-center justify-center rounded text-[#5b6877] hover:bg-[#e4e6ea] disabled:opacity-30"
                title="Sonraki Belge"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* CANLI A4 KAĞIT ALANI (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#687385]/10 flex flex-col items-center">
          <div
            id="universal-print-container"
            className={`transition-transform duration-150 origin-top ${
              scaleMode === 'fit' ? 'scale-[0.84]' : 'scale-[0.95]'
            }`}
          >
            {viewAllPages ? (
              // TÜM SEÇİLİ BELGELERİ PEŞ PEŞE YAZDIRILABİLİR BASKI FORMATINDA GÖSTER
              <div className="space-y-8">
                {jobs.map((job, idx) => (
                  <div key={job.id} className="relative">
                    <div className="no-print mb-2 flex items-center justify-between text-[11px] font-bold text-gray-500 bg-white/80 backdrop-blur px-3 py-1 rounded border border-gray-300">
                      <span>Sayfa {idx + 1} / {jobs.length}: {job.title}</span>
                      <span className="font-mono">{job.docNo}</span>
                    </div>
                    {renderTemplateForJob(job)}
                  </div>
                ))}
              </div>
            ) : (
              // TEK SEÇİLİ BELGEYİ GÖSTER
              renderTemplateForJob(activeJob)
            )}
          </div>
        </div>

        {/* MODAL ALT BİLGİ DİPNOTU */}
        <div className="no-print flex items-center justify-between border-t border-gray-300 bg-white px-4 py-2 text-[10.5px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500"></span>
            <span>4734 &amp; 2886 Sayılı Kanun ve Cumhurbaşkanlığı Resmî Yazışma Yönetmeliğine %100 Uygun A4 Çıktısı</span>
          </div>
          <span>Baskı boyutu: <strong>A4 (210 x 297 mm)</strong></span>
        </div>
      </div>
    </div>
  )
}

