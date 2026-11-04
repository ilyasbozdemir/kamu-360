import { ProcurementShell } from '@/components/procurement/procurement-shell'
import { ProcurementScreenView } from '@/components/procurement/procurement-screen-view'

export const metadata = {
  title: 'Satın Alma Dosyası | KAMU 360',
}

export default function IhaleDosyasiPage() {
  return (
    <ProcurementShell>
      <ProcurementScreenView slug="ihale-dosyasi" />
    </ProcurementShell>
  )
}


