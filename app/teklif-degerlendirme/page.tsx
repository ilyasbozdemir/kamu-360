import { ProcurementShell } from '@/components/procurement/procurement-shell'
import { ProcurementScreenView } from '@/components/procurement/procurement-screen-view'

export const metadata = {
  title: 'Satın Alma Teklif Değerlendirme Detayı | KAMU 360',
}

export default function TeklifDegerlendirmePage() {
  return (
    <ProcurementShell>
      <ProcurementScreenView slug="teklif-degerlendirme" />
    </ProcurementShell>
  )
}


