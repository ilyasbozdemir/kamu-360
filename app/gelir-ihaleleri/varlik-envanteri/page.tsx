import { GelirIhaleShell } from '@/components/gelir-ihaleleri/gelir-ihale-shell'
import { VarlıkEnvanteriScreen } from '@/components/gelir-ihaleleri/screens/varlik-envanteri-screen'

export const metadata = {
  title: 'Kiralanabilir & Satılabilir Varlıklar | 2886 Gelir İhaleleri | KAMU 360',
}

export default function VarlikEnvanteriPage() {
  return (
    <GelirIhaleShell>
      <VarlıkEnvanteriScreen />
    </GelirIhaleShell>
  )
}


