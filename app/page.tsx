import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Gavel,
  Layers,
  Plus,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Star,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/procurement/primitives'

export const metadata = {
  title: 'KAMU 360 | Kamu İhale, Satın Alma & Gelir Yönetim Portalı',
  description:
    'KAMU 360 — 4734 Sayılı KİK ve 2886 Sayılı DİK uyumlu uçtan uca Kamu İhale, Satın Alma, Doğrudan Temin ve EBYS Belge Yönetim Platformu.',
}

const stats = [
  {
    title: 'Satın Alma Dosyaları (Gider)',
    value: '14',
    subtext: '3 dosya onay bekliyor',
    icon: FolderOpen,
    color: 'text-[#2d62d7]',
    bg: 'bg-[#eef3ff]',
    href: '/malzeme-bilgisi',
  },
  {
    title: 'Gelir İhaleleri (2886)',
    value: '4',
    subtext: '1 açık artırma canlı yayında',
    icon: Scale,
    color: 'text-[#7c3aed]',
    bg: 'bg-[#f5f3ff]',
    href: '/gelir-ihaleleri/dosya-tanimi',
  },
  {
    title: 'Doğrudan Temin (22/d)',
    value: '5',
    subtext: '1 piyasa fiyat araştırmasında',
    icon: Layers,
    color: 'text-[#ea580c]',
    bg: 'bg-[#fff4eb]',
    href: '/dogrudan-temin',
  },
  {
    title: 'Aktif Kira & Satış Sözleşmesi',
    value: '26',
    subtext: '1.344.000 TL yıllık tahsilat',
    icon: FileCheck2,
    color: 'text-[#16a34a]',
    bg: 'bg-[#eaf8ee]',
    href: '/sozlesme',
  },
]

const procurementModules = [
  {
    step: '1',
    title: 'Malzeme Satın Alma Bilgisi',
    docNo: '24-00000000',
    desc: 'Tedarikçi koşulları, teslimat toleransları, satın alma ölçü birimi, birim fiyat ve indirim tanımları.',
    href: '/malzeme-bilgisi',
    badge: { tone: 'green' as const, text: 'Aktif' },
    icon: Star,
  },
  {
    step: '2',
    title: 'Teklif Değerlendirme Detayı',
    docNo: '24-0000005',
    desc: 'Tedarikçi tekliflerinin kalem bazında karşılaştırmalı analizi, en düşük birim fiyat/toplam fiyat tespiti.',
    href: '/teklif-degerlendirme',
    badge: { tone: 'blue' as const, text: 'Tamamlandı' },
    icon: FileSpreadsheet,
  },
  {
    step: '3',
    title: 'Satın Alma Dosyası (İhale)',
    docNo: 'PRF-4-07-0000',
    desc: 'İhale onay bilgileri, şartname koşulları, ilan ve davet süreçleri ile ekonomik yeterlilik kriterleri.',
    href: '/ihale-dosyasi',
    badge: { tone: 'gray' as const, text: 'Kapalı' },
    icon: FolderOpen,
  },
  {
    step: '4',
    title: 'Satın Alma Sözleşmesi',
    docNo: '24-00000001',
    desc: 'Birim fiyat ve miktar kontrollü sözleşme, revizyon takibi, sevkiyat ve teminat şartları.',
    href: '/sozlesme',
    badge: { tone: 'cyan' as const, text: 'Kısmi Açık' },
    icon: FileCheck2,
  },
  {
    step: '5',
    title: 'Doğrudan Temin Süreci',
    docNo: 'DT-24-0000001',
    desc: '4734 Sayılı Kanun Madde 22/d kapsamında piyasa fiyat araştırması, tutanaklar ve onay süreci.',
    href: '/dogrudan-temin',
    badge: { tone: 'blue' as const, text: 'Taslak' },
    icon: Layers,
  },
  {
    step: '6',
    title: 'Belge Oluşturucu (Document Builder)',
    docNo: 'DOC_RESMI_UST_YAZI',
    desc: 'EBYS Resmî Yazışma Yönetmeliği uyumlu üst yazı, paraf/imza rota onay zinciri ve SHA-256 dijital mühürleme.',
    href: '/belge-builder',
    badge: { tone: 'green' as const, text: 'Şablon v1.2' },
    icon: FileSignature,
  },
]

const revenue2886Modules = [
  {
    dosyaNo: '2886-2024/01',
    title: 'ODTÜ Teknokent Zemin Kat Ticari Alan Kiralama',
    usul: 'Açık Artırma Usulü',
    tur: 'Taşınmaz Kiralama',
    muhammen: '85.000 TL / Ay',
    enYuksekTeklif: '112.000 TL / Ay',
    lider: 'Turkuaz Gayrimenkul Yatırım A.Ş.',
    durum: 'Teklif / Pey Aşamasında',
    href: '/gelir-ihaleleri/teklif-artirma',
  },
  {
    dosyaNo: '2886-2024/02',
    title: '8 Adet Kurumsal Hizmet Aracının Toplu Satışı',
    usul: 'Kapalı Teklif Usulü',
    tur: 'Varlık Satışı',
    muhammen: '4.200.000 TL',
    enYuksekTeklif: 'İlan & Başvuru',
    lider: 'Başvurular Bekleniyor',
    durum: 'İlanda',
    href: '/gelir-ihaleleri/dosya-tanimi',
  },
  {
    dosyaNo: '2886-2024/03',
    title: '12 Ton Elektronik Donanım ve Metal Hurda Satışı',
    usul: 'Açık Artırma Usulü',
    tur: 'Hurda Satışı',
    muhammen: '450.000 TL',
    enYuksekTeklif: '560.000 TL',
    lider: 'Anadolu Geri Dönüşüm A.Ş.',
    durum: 'Komisyon Kararında',
    href: '/gelir-ihaleleri/komisyon-karari',
  },
  {
    dosyaNo: '2886-2024/04',
    title: 'Şirket Merkezi Kafeterya ve Otomat Alanı İmtiyazı',
    usul: 'Pazarlık Usulü',
    tur: 'İşletme Devri',
    muhammen: '35.000 TL / Ay',
    enYuksekTeklif: 'Sözleşme İmzalandı',
    lider: 'Başkent Catering Ltd. Şti.',
    durum: 'Sözleşme İmzalandı',
    href: '/gelir-ihaleleri/sozlesme-tahsilat',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-5 px-4 py-4 sm:px-6">
      {/* Breadcrumb */}
      <div className="-mx-4 -mt-4 mb-4 flex h-[46px] items-center gap-2 border-b border-[#e3e6eb] bg-white px-4 text-[11px] text-[#7b8794] sm:-mx-6 sm:px-6">
        <Link href="/" className="hover:text-[#26384c]">⌂ Kamu 360</Link>
        <span className="text-[#adb5bd]">/</span>
        <span className="font-semibold text-[#26384c]">Satın Alma Yönetimi</span>
        <span className="text-[#adb5bd]">/</span>
        <span className="text-[#7b8794]">Genel Bakış &amp; Kontrol Merkezi</span>
      </div>

      {/* Hero Banner */}
      <div className="rounded-lg border border-[#e1e5ea] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded bg-[#eef3ff] px-2 py-0.5 text-[10px] font-semibold text-[#2d62d7]">
                <Building2 className="mr-1 size-3" /> AKM - Akme Teknoloji
              </span>
              <span className="text-[11px] text-[#8c9ba8]">Ankara ODTÜ Teknokent</span>
            </div>
            <h1 className="mt-1.5 text-[20px] font-bold text-[#172334]">
              Satın Alma Yönetimi Kontrol Merkezi
            </h1>
            <p className="mt-1 text-[12px] text-[#6b7280]">
              Talepten sözleşmeye ve doğrudan temine uçtan uca satın alma süreçleri, EBYS onay akışları ve 2886 gelir operasyonları.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href="/malzeme-bilgisi"
              className="inline-flex items-center rounded-md bg-[#2d62d7] px-3.5 py-2 text-[12px] font-medium text-white shadow-xs transition hover:bg-[#2455bd]"
            >
              <Star className="mr-1.5 size-3.5" />
              Satın Alma (4734 & DT)
            </Link>
            <Link
              href="/gelir-ihaleleri/dosya-tanimi"
              className="inline-flex items-center rounded-md bg-[#7c3aed] px-3.5 py-2 text-[12px] font-medium text-white shadow-xs transition hover:bg-[#6d28d9]"
            >
              <Scale className="mr-1.5 size-3.5" />
              Gelir İhaleleri (2886)
            </Link>
            <Link
              href="/belge-builder"
              className="inline-flex items-center rounded-md border border-[#dfe3e9] bg-white px-3.5 py-2 text-[12px] font-medium text-[#4b5563] transition hover:bg-[#f8f9fb]"
            >
              <FileSignature className="mr-1.5 size-3.5 text-[#16a34a]" />
              Belge Oluşturucu
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.title}
              href={s.href}
              className="group rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,.03)] transition hover:border-[#2d62d7]/50 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#64748b]">{s.title}</span>
                <span className={`flex size-8 items-center justify-center rounded-md ${s.bg} ${s.color}`}>
                  <Icon className="size-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[24px] font-bold text-[#1e293b]">{s.value}</span>
                <span className="text-[11px] text-[#94a3b8]">{s.subtext}</span>
              </div>
              <div className="mt-3 flex items-center text-[11px] font-semibold text-[#2d62d7] group-hover:underline">
                İncele <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* 2886 GELİR İHALELERİ & VARLIK YÖNETİMİ ÖZEL BÖLÜMÜ */}
      <div className="rounded-lg border-2 border-[#7c3aed]/20 bg-linear-to-r from-purple-50/50 via-white to-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-purple-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#7c3aed] text-white">
              <Scale className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-[#1e293b]">
                  2886 Gelir Getirici İhale Süreçleri (Özel Sektör / Kurumsal Varlık Yönetimi)
                </h2>
                <span className="rounded bg-[#7c3aed] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                  Gelir Tarafı
                </span>
              </div>
              <p className="text-[11px] text-[#6b7280]">
                Taşınmaz kiralama, gayrimenkul ve araç filosu satışı, hurda değerlendirme ve açık artırma pey süreçleri.
              </p>
            </div>
          </div>
          <Link
            href="/gelir-ihaleleri/dosya-tanimi"
            className="text-[11px] font-bold text-[#7c3aed] hover:underline flex items-center"
          >
            Tüm 2886 İhalelerini Gör →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {revenue2886Modules.map((item) => (
            <Link
              key={item.dosyaNo}
              href={item.href}
              className="flex flex-col justify-between rounded-lg border border-[#e9d5ff] bg-white p-3.5 shadow-xs transition hover:border-[#7c3aed] hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#7c3aed]">{item.dosyaNo}</span>
                  <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-semibold text-[#6b21a8]">
                    {item.tur}
                  </span>
                </div>
                <h3 className="mt-2 text-[12px] font-bold text-[#1e293b] line-clamp-1">{item.title}</h3>
                <div className="mt-2 text-[10px] space-y-1 text-[#64748b]">
                  <div>Muhammen: <strong className="text-[#1e293b]">{item.muhammen}</strong></div>
                  <div>En Yüksek Teklif: <strong className="text-emerald-700">{item.enYuksekTeklif}</strong></div>
                </div>
              </div>
              <div className="mt-3 border-t border-[#f3e8ff] pt-2 flex items-center justify-between text-[10px]">
                <span className="text-[#7e22ce] font-semibold">{item.durum}</span>
                <span className="font-bold text-[#7c3aed] flex items-center">
                  İncele <ArrowRight className="ml-1 size-2.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Satın Alma & Doğrudan Temin Süreç Kartları */}
      <div className="rounded-lg border border-[#e1e5ea] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
        <div className="flex items-center justify-between border-b border-[#edf0f4] pb-3">
          <div>
            <h2 className="text-[14px] font-semibold text-[#172334]">
              Satın Alma ve Doğrudan Temin Süreç Ekranları (4734 & DT)
            </h2>
            <p className="text-[11px] text-[#828f9d]">
              İhtiyaç tespitinden sözleşmeye ve EBYS resmî onay akışına kadar tüm alım adımları.
            </p>
          </div>
          <Link
            href="/malzeme-bilgisi"
            className="text-[11px] font-semibold text-[#2d62d7] hover:underline"
          >
            Tümünü Aç →
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {procurementModules.map((m) => {
            const Icon = m.icon
            return (
              <Link
                key={m.step}
                href={m.href}
                className="group flex flex-col justify-between rounded-lg border border-[#e7ebf0] bg-[#fafbfc] p-4 transition hover:border-[#2d62d7] hover:bg-white hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-md bg-[#eef3ff] text-[#2d62d7] group-hover:bg-[#2d62d7] group-hover:text-white transition-colors">
                        <Icon className="size-3.5" />
                      </span>
                      <span className="text-[11px] font-bold text-[#475569]">{m.step}. Adım</span>
                    </div>
                    <Badge tone={m.badge.tone}>{m.badge.text}</Badge>
                  </div>
                  <h3 className="mt-2.5 text-[13px] font-bold text-[#1e293b] group-hover:text-[#2d62d7] transition-colors">
                    {m.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#64748b]">{m.desc}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#edf0f4] pt-2.5 text-[10px]">
                  <span className="text-[#8d98a4]">
                    Belge: <strong className="text-[#334155]">{m.docNo}</strong>
                  </span>
                  <span className="flex items-center font-semibold text-[#2d62d7]">
                    Ekranı Aç <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
