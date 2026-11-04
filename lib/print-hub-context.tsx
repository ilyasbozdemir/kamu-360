'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface PrintJob {
  id: string
  docNo: string
  title: string
  dosyaNo?: string
  dosyaAdi?: string
  category: 'Satın Alma (4734)' | 'Doğrudan Temin (22/d)' | 'Sözleşme' | 'EBYS Resmî Yazı' | 'Gelir İhalesi (2886)' | 'Rapor & Matris'
  format: 'A4 Dikey' | 'A4 Yatay' | 'Excel / CSV' | 'EBYS e-İmzalı PDF'
  pageCount: number
  addedAt: string
  status: 'Hazır' | 'Yazdırıldı' | 'Kuyrukta'
  previewUrl?: string
}

interface PrintHubContextType {
  printQueue: PrintJob[]
  addToPrintQueue: (item: Omit<PrintJob, 'id' | 'addedAt' | 'status'>) => void
  removeFromPrintQueue: (id: string) => void
  clearPrintQueue: () => void
  batchPrint: (selectedIds?: string[]) => void
  toastMessage: string | null
  activeJobModal: PrintJob | null
  setActiveJobModal: (job: PrintJob | null) => void
}

const INITIAL_QUEUE: PrintJob[] = [
  {
    id: 'pj-1',
    docNo: 'DOC_ONAY_01',
    title: 'Harcama Talimatı / İhale Onay Belgesi',
    dosyaNo: '2026/DT-001',
    dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
    category: 'Doğrudan Temin (22/d)',
    format: 'A4 Dikey',
    pageCount: 1,
    addedAt: '10 dk önce',
    status: 'Hazır',
  },
  {
    id: 'pj-2',
    docNo: 'DOC_PIYASA_01',
    title: 'Piyasa Fiyat Araştırma Tutanağı (3 Firma Teklifi)',
    dosyaNo: '2026/DT-001',
    dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
    category: 'Doğrudan Temin (22/d)',
    format: 'A4 Dikey',
    pageCount: 1,
    addedAt: '12 dk önce',
    status: 'Hazır',
  },
  {
    id: 'pj-3',
    docNo: 'DOC_SOZLESME_01',
    title: 'Doğrudan Temin Alım Sözleşmesi (Kesintili)',
    dosyaNo: '2026/DT-001',
    dosyaAdi: 'Destek Hizmetleri Toner & Sarf Malzemesi Alımı',
    category: 'Sözleşme',
    format: 'A4 Dikey',
    pageCount: 1,
    addedAt: '15 dk önce',
    status: 'Hazır',
  },
  {
    id: 'pj-4',
    docNo: '2886-VARLIK-01',
    title: 'Kiralanabilir & Satılabilir Varlıklar Tespit Tutanağı',
    dosyaNo: '2886-2024/01',
    dosyaAdi: 'ODTÜ Teknokent Ticari Alan Kiralama İhalesi',
    category: 'Gelir İhalesi (2886)',
    format: 'A4 Dikey',
    pageCount: 1,
    addedAt: '25 dk önce',
    status: 'Hazır',
  },
  {
    id: 'pj-5',
    docNo: '2886-PEY-01',
    title: 'Taşınmaz Kiralama Açık Artırma Pey Tutanağı',
    dosyaNo: '2886-2024/01',
    dosyaAdi: 'ODTÜ Teknokent Ticari Alan Kiralama İhalesi',
    category: 'Gelir İhalesi (2886)',
    format: 'A4 Dikey',
    pageCount: 2,
    addedAt: '30 dk önce',
    status: 'Hazır',
  },
  {
    id: 'pj-6',
    docNo: 'DOC_RESMI_0142',
    title: 'Resmî Üst Yazı (31151 Sayılı Yönetmelik & e-İmza)',
    dosyaNo: 'DOC_RESMI_0142',
    dosyaAdi: 'EBYS Kurumsal Yazışma Dosyası',
    category: 'EBYS Resmî Yazı',
    format: 'EBYS e-İmzalı PDF',
    pageCount: 1,
    addedAt: '1 saat önce',
    status: 'Hazır',
  },
]

const PrintHubContext = createContext<PrintHubContextType | undefined>(undefined)

export function PrintHubProvider({ children }: { children: React.ReactNode }) {
  const [printQueue, setPrintQueue] = useState<PrintJob[]>(INITIAL_QUEUE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [activeJobModal, setActiveJobModal] = useState<PrintJob | null>(null)

  const addToPrintQueue = (item: Omit<PrintJob, 'id' | 'addedAt' | 'status'>) => {
    const newJob: PrintJob = {
      ...item,
      id: 'pj-' + Date.now(),
      addedAt: 'Az önce',
      status: 'Hazır',
    }
    setPrintQueue((prev) => [newJob, ...prev])
    setToastMessage(`"${newJob.title}" Yazdırma Merkezine Gönderildi!`)

    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const removeFromPrintQueue = (id: string) => {
    setPrintQueue((prev) => prev.filter((j) => j.id !== id))
  }

  const clearPrintQueue = () => {
    setPrintQueue([])
  }

  const batchPrint = (selectedIds?: string[]) => {
    const jobsToPrint = selectedIds?.length
      ? printQueue.filter((j) => selectedIds.includes(j.id))
      : printQueue

    if (jobsToPrint.length === 0) return

    setPrintQueue((prev) =>
      prev.map((j) =>
        jobsToPrint.some((target) => target.id === j.id)
          ? { ...j, status: 'Yazdırıldı' }
          : j
      )
    )

    window.print()
  }

  return (
    <PrintHubContext.Provider
      value={{
        printQueue,
        addToPrintQueue,
        removeFromPrintQueue,
        clearPrintQueue,
        batchPrint,
        toastMessage,
        activeJobModal,
        setActiveJobModal,
      }}
    >
      {children}

      {/* Global Toast Bildirimi */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg border border-blue-200 bg-white p-4 text-[12px] font-semibold text-[#1e293b] shadow-2xl animate-in slide-in-from-bottom-5">
          <div className="flex size-7 items-center justify-center rounded-full bg-[#eef3ff] text-[#2d62d7]">
            🖨️
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#2d62d7]">Yazdırma Merkezi Kuyruğu</p>
            <p className="text-[11px] text-[#475569]">{toastMessage}</p>
          </div>
        </div>
      )}
    </PrintHubContext.Provider>
  )
}

export function usePrintHub() {
  const context = useContext(PrintHubContext)
  if (!context) {
    throw new Error('usePrintHub must be used within a PrintHubProvider')
  }
  return context
}

