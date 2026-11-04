'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, MoreVertical, Printer } from 'lucide-react'
import {
  Accordion,
  AccordionGroup,
  Field,
  FieldGrid,
  OutlineButton,
  PrimaryButton,
} from '@/components/procurement/primitives'
import {
  genericLeft,
  moduleTabs,
  tabFields,
  fallbackFields,
} from '@/lib/modules-data'

export function ModulePageView({ moduleName }: { moduleName: string }) {
  const tabs = moduleTabs[moduleName] ?? []
  const [activeTab, setActiveTab] = useState(tabs[0] || '')
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const currentTab = activeTab || tabs[0] || ''

  const handleSave = () => {
    const timeStr = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    setSavedAt(timeStr)
    setToastMessage(`${currentTab} bilgileri başarıyla kaydedildi!`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div>
      {/* Toast Bildirimi */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-[11px] font-bold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="size-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex h-[46px] items-center gap-2 border-b border-[#e3e6eb] bg-white px-4 text-[11px] text-[#7b8794]">
        <Link href="/" className="hover:text-[#26384c]">⌂ Kamu 360</Link>
        <span className="text-[#adb5bd]">/</span>
        <Link href="/malzeme-bilgisi" className="hover:text-[#26384c]">Satın Alma Yönetimi</Link>
        <span className="text-[#adb5bd]">/</span>
        <span>{moduleName}</span>
        <span className="text-[#adb5bd]">/</span>
        <span className="font-semibold text-[#26384c]">{currentTab}</span>
      </div>

      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-2 pt-3">
        <div className="flex items-center gap-3">
          <Link
            href="/temin-dosyasi"
            className="flex size-7 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#26384c] shadow-2xs hover:border-[#2d62d7] hover:bg-[#eef3ff] hover:text-[#2d62d7] transition"
            aria-label="Dosya Listesine Dön"
            title="Dosya Listesine Dön (/temin-dosyasi)"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <h1 className="text-[18px] font-semibold text-[#172334]">{currentTab}</h1>
          <MoreVertical className="size-4 text-[#9aa3ad]" />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
          >
            <Printer className="size-3.5 text-gray-500" />
            <span>Yazdır</span>
          </button>
          <Link
            href="/malzeme-bilgisi"
            className="inline-flex items-center gap-1 rounded bg-[#2d62d7] px-3 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-[#2455bd] transition"
          >
            <span>Satın Alma Masası</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid gap-2 px-3 pb-3 lg:grid-cols-[300px_1fr]">
        {/* Left Side Panel */}
        <div className="rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)]">
          <div className="border-b border-[#e3e6eb] px-4 py-3 text-[13px] font-semibold text-[#172334]">
            {moduleName}
          </div>
          <div className="space-y-3 p-4">
            {genericLeft.map((f) => (
              <Field key={f.label} spec={f} />
            ))}
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="min-w-0 rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)]">
          <div className="border-b border-[#e3e6eb] px-4 py-3 text-[13px] font-semibold text-[#172334]">
            Belge Detayı
          </div>

          {/* Module Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-[#e3e6eb] px-3 pt-2" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={currentTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 px-3 py-2 text-[11px] font-medium transition ${
                  currentTab === tab
                    ? 'border-[#2d62d7] text-[#2d62d7]'
                    : 'border-transparent text-[#7b8794] hover:text-[#33445a]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4">
            <AccordionGroup>
              <Accordion title={currentTab} defaultOpen key={currentTab}>
                <FieldGrid fields={tabFields[currentTab] ?? fallbackFields} />
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#e6e9ee] pt-4">
                  <div className="flex items-center gap-2 text-[10px] text-[#85909e]">
                    <span className="size-2 rounded-full bg-[#3caf75]" />
                    {savedAt ? `Kaydedildi: ${savedAt}` : 'Taslak olarak kaydedildi'}
                  </div>
                  <div className="flex gap-2">
                    <OutlineButton>İptal</OutlineButton>
                    <PrimaryButton onClick={handleSave}>
                      Kaydet
                    </PrimaryButton>
                  </div>
                </div>
              </Accordion>
            </AccordionGroup>
          </div>
        </div>
      </div>
    </div>
  )
}
