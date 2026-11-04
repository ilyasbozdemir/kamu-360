import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { AppShell } from '@/components/layout/app-shell'
import './globals.css'

export const metadata: Metadata = {
  title: 'KAMU 360 | Kamu İhale, Satın Alma & Gelir Yönetim Portalı',
  description:
    '4734 Sayılı Kamu İhale Kanunu ve 2886 Sayılı Devlet İhale Kanunu uyumlu uçtan uca Satın Alma, Doğrudan Temin, Gelir İhaleleri ve EBYS Belge Yönetim Platformu.',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
