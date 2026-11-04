import { GelirIhaleShell } from '@/components/gelir-ihaleleri/gelir-ihale-shell'
import { SozlesmeTahsilatScreen } from '@/components/gelir-ihaleleri/screens/sozlesme-tahsilat-screen'

export const metadata = {
  title: 'Sözleşme & Tahsilat Planı | 2886 Gelir İhaleleri | KAMU 360',
}

export default function SozlesmeTahsilatPage() {
  return (
    <GelirIhaleShell>
      <SozlesmeTahsilatScreen />
    </GelirIhaleShell>
  )
}


