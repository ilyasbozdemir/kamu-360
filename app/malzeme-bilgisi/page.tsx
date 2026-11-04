import { ProcurementShell } from '@/components/procurement/procurement-shell'
import { ProcurementScreenView } from '@/components/procurement/procurement-screen-view'

export const metadata = {
  title: 'Malzeme Satın Alma Bilgisi | KAMU 360',
}

export default function MalzemeBilgisiPage() {
  return (
    <ProcurementShell>
      <ProcurementScreenView slug="malzeme-bilgisi" />
    </ProcurementShell>
  )
}


