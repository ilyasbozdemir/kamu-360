import { GelirIhaleShell } from '@/components/gelir-ihaleleri/gelir-ihale-shell'
import { TeklifArtirmaScreen } from '@/components/gelir-ihaleleri/screens/teklif-artirma-screen'

export const metadata = {
  title: 'İstekliler & Açık Artırma (Pey) | 2886 Gelir İhaleleri | KAMU 360',
}

export default function TeklifArtirmaPage() {
  return (
    <GelirIhaleShell>
      <TeklifArtirmaScreen />
    </GelirIhaleShell>
  )
}


