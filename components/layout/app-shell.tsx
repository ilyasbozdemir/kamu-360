'use client'

import { useState } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { PrintHubProvider } from '@/lib/print-hub-context'
import { ModuleProvider } from '@/lib/module-context'
import { ThemeProvider } from '@/lib/theme-context'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ThemeProvider>
      <ModuleProvider>
        <PrintHubProvider>
          <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0b1329] text-[#1f2937] dark:text-[#f8fafc] transition-colors duration-200">
            <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} />
            <div className="flex min-h-[calc(100vh-58px)]">
              <Sidebar menuOpen={menuOpen} onCloseMenu={() => setMenuOpen(false)} />
              <main className="min-w-0 flex-1 bg-[#fafbfc] dark:bg-[#0b1329] pb-16 transition-colors duration-200">{children}</main>
            </div>
          </div>
        </PrintHubProvider>
      </ModuleProvider>
    </ThemeProvider>
  )
}
