import { GelirIhaleShell } from '@/components/gelir-ihaleleri/gelir-ihale-shell'
import { KomisyonKarariScreen } from '@/components/gelir-ihaleleri/screens/komisyon-karari-screen'

export const metadata = {
  title: 'Komisyon Kararı & İhale Onayı | 2886 Gelir İhaleleri | KAMU 360',
}

export default function KomisyonKarariPage() {
  return (
    <GelirIhaleShell>
      <KomisyonKarariScreen />
    </GelirIhaleShell>
  )
}


