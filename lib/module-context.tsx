'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Sparkles,
  Star,
  Compass,
  Users,
  Coins,
} from 'lucide-react'

export type ModuleKey = 'all' | 'ihale_satin_alma' | 'cbs_arazi_su' | 'personel_ik' | 'bkmybs_mali'

export interface ModuleDefinition {
  key: ModuleKey
  name: string
  shortName: string
  miniLabel: string
  icon: any
  badge: string
  color: string
  borderColor: string
  bgLight: string
  textColor: string
  tagline: string
  description: string
  defaultRoute: string
}

export const MODULE_DEFINITIONS: Record<ModuleKey, ModuleDefinition> = {
  all: {
    key: 'all',
    name: 'Tüm Modüller (360° Portal)',
    shortName: 'Tüm Modüller',
    miniLabel: 'Tümü',
    icon: Sparkles,
    badge: '360°',
    color: '#3b82f6',
    borderColor: '#3b82f6',
    bgLight: 'bg-blue-500/15',
    textColor: 'text-blue-400',
    tagline: 'Genişletilmiş Tüm Süreçler',
    description: 'İhale, doğrudan temin, CBS arazi/su, personel ve bütçe süreçlerinin tümü.',
    defaultRoute: '/',
  },
  ihale_satin_alma: {
    key: 'ihale_satin_alma',
    name: 'İhale ve Satın Alma Modülü',
    shortName: 'İhale & Satın Alma',
    miniLabel: 'İhale',
    icon: Star,
    badge: '4734 & 2886',
    color: '#2563eb',
    borderColor: '#2563eb',
    bgLight: 'bg-blue-500/15',
    textColor: 'text-blue-400',
    tagline: '4734 KİK Gider & 2886 DİK Gelir',
    description: '22/d Doğrudan Temin Masası, piyasa tutanakları, teklif matrisi ve gelir ihaleleri.',
    defaultRoute: '/temin-dosyasi',
  },
  cbs_arazi_su: {
    key: 'cbs_arazi_su',
    name: 'CBS, Arazi ve Su Altyapı Modülü',
    shortName: 'CBS & Su Altyapı',
    miniLabel: 'CBS/Su',
    icon: Compass,
    badge: 'Harita / Su',
    color: '#10b981',
    borderColor: '#10b981',
    bgLight: 'bg-emerald-500/15',
    textColor: 'text-emerald-400',
    tagline: 'Arazi, Parsel, Şebeke & Sayaç',
    description: 'Ada/parsel kadastro sorgusu, kamu mülkiyeti, içme suyu şebekesi ve sayaç takibi.',
    defaultRoute: '/harita-altyapi',
  },
  personel_ik: {
    key: 'personel_ik',
    name: 'İnsan Kaynakları & Personel (İK 360)',
    shortName: 'Personel & İK 360',
    miniLabel: 'İK 360',
    icon: Users,
    badge: '657 & 4857',
    color: '#8b5cf6',
    borderColor: '#8b5cf6',
    bgLight: 'bg-purple-500/15',
    textColor: 'text-purple-400',
    tagline: 'Memur, İşçi, Puantaj & Harcırah',
    description: 'Özlük dosyaları, puantaj/izin, 6245 Sayılı Kanun harcırah ve geçici görev onayları.',
    defaultRoute: '/personel-takibi',
  },
  bkmybs_mali: {
    key: 'bkmybs_mali',
    name: 'BKMYBS & Mali Yönetim (5018)',
    shortName: 'BKMYBS & Maliye',
    miniLabel: 'Maliye',
    icon: Coins,
    badge: '5018 / MİF',
    color: '#f59e0b',
    borderColor: '#f59e0b',
    bgLight: 'bg-amber-500/15',
    textColor: 'text-amber-400',
    tagline: 'Analitik Bütçe, MİF, ÖEB & TKYS',
    description: 'Analitik bütçe tertipleri, ödenek kontrolü, MİF/Ödeme Emri ve TKYS Taşınır Mal.',
    defaultRoute: '/bkmybs-mali-yonetim',
  },
}

interface ModuleContextType {
  activeModule: ModuleKey
  setActiveModule: (module: ModuleKey) => void
  currentModule: ModuleDefinition
}

const ModuleContext = createContext<ModuleContextType>({
  activeModule: 'all',
  setActiveModule: () => {},
  currentModule: MODULE_DEFINITIONS.all,
})

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [activeModule, setActiveModuleState] = useState<ModuleKey>('all')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kamu360_active_module') as ModuleKey | null
      if (saved && MODULE_DEFINITIONS[saved]) {
        setActiveModuleState(saved)
      }
    } catch {
      // ignore
    }

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<ModuleKey>
      if (customEvent.detail && MODULE_DEFINITIONS[customEvent.detail]) {
        setActiveModuleState(customEvent.detail)
      }
    }

    window.addEventListener('kamu360_module_changed', handleCustomChange)
    return () => {
      window.removeEventListener('kamu360_module_changed', handleCustomChange)
    }
  }, [])

  const setActiveModule = (module: ModuleKey) => {
    setActiveModuleState(module)
    try {
      localStorage.setItem('kamu360_active_module', module)
      window.dispatchEvent(new CustomEvent('kamu360_module_changed', { detail: module }))
    } catch {
      // ignore
    }
  }

  return (
    <ModuleContext.Provider
      value={{
        activeModule,
        setActiveModule,
        currentModule: MODULE_DEFINITIONS[activeModule] || MODULE_DEFINITIONS.all,
      }}
    >
      {children}
    </ModuleContext.Provider>
  )
}

export function useModule() {
  return useContext(ModuleContext)
}
