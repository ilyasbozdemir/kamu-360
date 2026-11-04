import { Metadata } from 'next'
import { ProcurementShell } from '@/components/procurement/procurement-shell'
import { TeminDosyasiManager } from '@/components/temin-dosyasi/temin-dosyasi-manager'

export const metadata: Metadata = {
  title: 'Doğrudan Temin Dosya Yönetimi | KAMU 360',
  description: '4734 Sayılı KİK Madde 22/d Doğrudan Temin Dosyaları ve Matbu Belge Üretim Merkezi',
}

export default function TeminDosyasiPage() {
  return (
    <ProcurementShell>
      <div className="px-3 pb-3">
        <TeminDosyasiManager />
      </div>
    </ProcurementShell>
  )
}


