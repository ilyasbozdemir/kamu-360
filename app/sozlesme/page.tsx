import { ProcurementShell } from '@/components/procurement/procurement-shell'
import { ProcurementScreenView } from '@/components/procurement/procurement-screen-view'

export const metadata = {
  title: 'Satın Alma Sözleşmesi | KAMU 360',
}

export default function SozlesmePage() {
  return (
    <ProcurementShell>
      <ProcurementScreenView slug="sozlesme" />
    </ProcurementShell>
  )
}


