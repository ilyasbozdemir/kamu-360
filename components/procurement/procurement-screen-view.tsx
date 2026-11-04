'use client'

import { useState } from 'react'
import { Check, MoreVertical, Printer } from 'lucide-react'
import { LeftPanel, SCREENS, SCREENS_BY_SLUG } from './screens'
import { usePrintHub } from '@/lib/print-hub-context'

export function ProcurementScreenView({ slug }: { slug: string }) {
  const screen = SCREENS_BY_SLUG[slug] ?? SCREENS[0]
  const { addToPrintQueue } = usePrintHub()
  const [added, setAdded] = useState(false)

  if (!screen) return null

  const handleSendToPrintCenter = () => {
    addToPrintQueue({
      title: screen.title,
      docNo: screen.docNo,
      dosyaNo: screen.docNo.startsWith('DT') ? screen.docNo : '2026/DT-001',
      dosyaAdi: screen.title,
      category: screen.slug === 'dogrudan-temin' ? 'Doğrudan Temin (22/d)' : 'Satın Alma (4734)',
      format: 'A4 Dikey',
      pageCount: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="grid gap-2 px-3 pb-3 lg:grid-cols-[300px_1fr]">
      <LeftPanel screen={screen} />
      <div className="min-w-0 rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e3e6eb] px-4 py-2.5 text-[13px] font-semibold text-[#172334] bg-gradient-to-r from-white to-[#f8f9fb]">
          <div className="flex items-center gap-2">
            <span>{screen.title}</span>
            <span className="font-mono text-[11px] font-bold text-[#2d62d7] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              {screen.docNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendToPrintCenter}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-bold transition shadow-2xs ${
                added
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-white border border-[#2d62d7] text-[#2d62d7] hover:bg-blue-50'
              }`}
              title="Bu ekranı Yazdırma & Dışa Aktarma Merkezine ekle"
            >
              {added ? <Check className="size-3 text-emerald-600" /> : <Printer className="size-3" />}
              <span>{added ? 'Kuyruğa Eklendi ✓' : 'Yazdırma Merkezine Gönder'}</span>
            </button>
            <MoreVertical className="size-4 text-[#43505f]" />
          </div>
        </div>
        <div className="p-3">{screen.body}</div>
      </div>
    </div>
  )
}
