'use client'

import React, { useState } from 'react'
import { ProcurementShell } from '@/components/procurement/procurement-shell'
import { ProcurementScreenView } from '@/components/procurement/procurement-screen-view'
import { TeminDosyasiManager } from '@/components/temin-dosyasi/temin-dosyasi-manager'
import { FileSpreadsheet, Layers } from 'lucide-react'

export default function DogrudanTeminPage() {
  const [activeView, setActiveView] = useState<'sablonlar' | 'klasik'>('sablonlar')

  return (
    <ProcurementShell>
      <div className="px-3 pb-3">
        {/* Görünüm Geçiş Sekmesi - Kamu 360 Teması */}
        <div className="mb-3 flex items-center justify-between rounded border border-[#e1e5ea] bg-[#f8f9fb] px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveView('sablonlar')}
              className={`flex h-7 items-center gap-1.5 rounded px-3 text-[11px] font-medium transition ${
                activeView === 'sablonlar'
                  ? 'bg-[#2d62d7] text-white shadow-xs font-semibold'
                  : 'border border-[#d9dee5] bg-white text-[#5b6877] hover:border-[#b8c2cc] hover:text-[#26384c]'
              }`}
            >
              <FileSpreadsheet className="size-3.5" />
              <span>Temin Dosyası &amp; Matbu Evrak Şablonları (DATA_TeminDosyasi)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('klasik')}
              className={`flex h-7 items-center gap-1.5 rounded px-3 text-[11px] font-medium transition ${
                activeView === 'klasik'
                  ? 'bg-[#2d62d7] text-white shadow-xs font-semibold'
                  : 'border border-[#d9dee5] bg-white text-[#5b6877] hover:border-[#b8c2cc] hover:text-[#26384c]'
              }`}
            >
              <Layers className="size-3.5" />
              <span>Klasik Kalem ve Teklif Masası</span>
            </button>
          </div>

          <span className="text-[10px] text-[#7b8794] hidden sm:inline">
            workdesk-360 / document-templates standardı
          </span>
        </div>

        {/* Seçili Görünüm */}
        {activeView === 'sablonlar' ? (
          <TeminDosyasiManager />
        ) : (
          <ProcurementScreenView slug="dogrudan-temin" />
        )}
      </div>
    </ProcurementShell>
  )
}
