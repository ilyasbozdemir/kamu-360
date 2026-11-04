import { GelirIhaleShell } from '@/components/gelir-ihaleleri/gelir-ihale-shell'
import { DosyaTanimiScreen } from '@/components/gelir-ihaleleri/screens/dosya-tanimi-screen'

export const metadata = {
  title: 'İhale Dosyası & Muhammen Bedel | 2886 Gelir İhaleleri | KAMU 360',
}

export default function DosyaTanimiPage() {
  return (
    <GelirIhaleShell>
      <DosyaTanimiScreen />
    </GelirIhaleShell>
  )
}


