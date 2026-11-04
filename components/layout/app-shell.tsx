'use client'

import { useState } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { PrintHubProvider } from '@/lib/print-hub-context'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <PrintHubProvider>
      <div className="min-h-screen bg-[#f8f9fb] text-[#1f2937]">
        <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} />
        <div className="flex min-h-[calc(100vh-58px)]">
          <Sidebar menuOpen={menuOpen} onCloseMenu={() => setMenuOpen(false)} />
          <main className="min-w-0 flex-1 bg-[#fafbfc] pb-16">{children}</main>
        </div>
      </div>
    </PrintHubProvider>
  )
}

