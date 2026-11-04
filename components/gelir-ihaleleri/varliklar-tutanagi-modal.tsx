'use client'

import React, { useState } from 'react'
import {
  Check,
  CheckCircle2,
  Download,
  Eye,
  FileCheck2,
  Maximize2,
  Printer,
  Scale,
  X,
} from 'lucide-react'
import { VarliklarTutanagiTemplate } from './templates/varliklar-tutanagi'
import { usePrintHub } from '@/lib/print-hub-context'

interface VarliklarTutanagiModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VarliklarTutanagiModal({ isOpen, onClose }: VarliklarTutanagiModalProps) {
  const { addToPrintQueue } = usePrintHub()
  const [eklendiMesaji, setEklendiMesaji] = useState(false)
  const [zoom, setZoom] = useState<'normal' | 'fit'>('normal')

  if (!isOpen) return null

  const handleKuyrugaEkle = () => {
    addToPrintQueue({
      docNo: '2886-VARLIK-2026/01',
      title: 'Kiralanabilir & Satılabilir Varlıklar Tespit ve İhale Tutanağı',
      category: 'Gelir İhalesi (2886)',
      format: 'A4 Dikey',
      pageCount: 1,
    })
    setEklendiMesaji(true)
    setTimeout(() => setEklendiMesaji(false), 3000)
  }

  const handleYazdir = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[96vh] w-full max-w-4xl flex-col rounded-xl border border-gray-300 bg-[#f1f4f9] shadow-2xl overflow-hidden">
        {/* Modal Başlık Çubuğu */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-300 bg-white px-5 py-3 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-[#7c3aed]">
              <Scale className="size-4" />
            </span>
            <div>
              <h3 className="text-[14px] font-bold text-gray-900">
                Kiralanabilir &amp; Satılabilir Varlıklar Tutanağı
              </h3>
              <p className="text-[11px] text-gray-500 font-mono">
                2886 Sayılı Devlet İhale Kanunu • A4 Resmî Evrak
              </p>
            </div>
          </div>

          {/* Modal Üst Aksiyon Butonları */}
          <div className="flex items-center gap-2">
            {eklendiMesaji ? (
              <span className="flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="size-3.5" /> Kuyruğa Eklendi!
              </span>
            ) : (
              <button
                type="button"
                onClick={handleKuyrugaEkle}
                className="flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-[11px] font-bold text-purple-800 transition hover:bg-purple-100"
              >
                <Printer className="size-3.5" />
                <span>Yazdırma Merkezine Gönder</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleYazdir}
              className="flex items-center gap-1.5 rounded-lg bg-[#2d62d7] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-xs transition hover:bg-[#2455bd]"
            >
              <Printer className="size-3.5" />
              <span>A4 Yazdır</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              title="Kapat"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Modal Gövdesi: A4 Kağıt Canlı Render */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-[#e5e9f0]">
          <div className="transform origin-top scale-[0.88] sm:scale-[0.94] transition-transform">
            <VarliklarTutanagiTemplate />
          </div>
        </div>

        {/* Modal Alt Bilgi Çubuğu */}
        <div className="flex items-center justify-between border-t border-gray-300 bg-white px-5 py-2.5 text-[11px] text-gray-600">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-emerald-500" />
            <span>2886 Sayılı Mevzuat Şablonu: <strong>210mm x 297mm A4 Matbu Format</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span>Toplam Portföy: <strong>32.030.000 TL</strong></span>
            <button
              type="button"
              onClick={onClose}
              className="font-bold text-[#2d62d7] hover:underline"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

