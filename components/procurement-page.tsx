'use client'

import { useState } from 'react'
import { BrandLogo } from '@/components/ui/brand-logo'
import {
  Bell, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, FileText, Grid3X3, Info, Menu,
  MoreVertical, Network, Printer, Search, Settings, ShieldCheck, Star, Users, X,
} from 'lucide-react'
import { Accordion, AccordionGroup, Field, FieldGrid, OutlineButton, PrimaryButton, type FieldSpec } from './procurement/primitives'
import { LeftPanel, SCREENS } from './procurement/screens'

const PROCUREMENT = 'Satın Alma Yönetimi'

const navItems = [
  { icon: Star, label: PROCUREMENT },
  { icon: Users, label: 'Satış Yönetimi' },
  { icon: ShieldCheck, label: 'Kiralama Yönetimi' },
  { icon: FileText, label: 'Genel Yönetim' },
  { icon: Grid3X3, label: 'Raporlar ve Analitik' },
  { icon: Network, label: 'İş Akışları' },
  { icon: Settings, label: 'Sistem Ayarları' },
]

const moduleTabs: Record<string, string[]> = {
  'Satış Yönetimi': ['Satış Fırsatı', 'Müşteri', 'Teklif Kalemleri', 'Fiyatlandırma', 'Belgeler', 'Onay Akışı'],
  'Kiralama Yönetimi': ['Kiralama Talebi', 'Varlık Bilgileri', 'Kiracı', 'Dönem ve Bedel', 'Belgeler', 'Tahsilat Planı'],
  'Genel Yönetim': ['Görevler', 'Kullanıcılar', 'Birimler', 'Belge Şablonları', 'Rota ve Dağıtım', 'Sistem Parametreleri'],
  'Raporlar ve Analitik': ['Satın Alma Özeti', 'Teklif Karşılaştırma', 'Bütçe Gerçekleşme', 'KPI Panosu'],
  'İş Akışları': ['Akış Tasarımcısı', 'Onay Kuralları', 'Bildirimler', 'Görev Kuyruğu'],
  'Sistem Ayarları': ['Belge Türleri', 'Ek Alanlar', 'Numara Serileri', 'Yetki Rolleri'],
}

const t = (label: string, extra: Partial<FieldSpec> = {}): FieldSpec => ({ label, ...extra })
const tabFields: Record<string, FieldSpec[]> = {
  'Satış Fırsatı': [t('Fırsat Başlığı', { required: true }), t('Müşteri', { kind: 'search', required: true }), t('Satış Sorumlusu', { kind: 'select', options: ['Ayşe Demir', 'Mehmet Kaya'] }), t('Tahmini Tutar', { kind: 'number' }), t('Kapanış Tarihi', { kind: 'date' }), t('Kaynak', { kind: 'select', options: ['Web', 'Referans', 'Fuar'] })],
  Müşteri: [t('Müşteri Adı', { required: true }), t('Vergi No'), t('Yetkili'), t('Telefon'), t('E-Mail Adresi'), t('Adres', { span: 2 })],
  'Teklif Kalemleri': [t('Ürün Kodu', { kind: 'search' }), t('Ürün Adı'), t('Miktar', { kind: 'number' }), t('Birim', { kind: 'select', options: ['Adet', 'Kutu'] }), t('Birim Fiyat', { kind: 'number' }), t('İskonto', { kind: 'percent' })],
  Fiyatlandırma: [t('Fiyat Listesi', { kind: 'select', options: ['Standart', 'Kurumsal'] }), t('Para Birimi', { kind: 'select', options: ['TRY', 'USD', 'EUR'] }), t('KDV Oranı', { kind: 'select', options: ['%10', '%20'] }), t('Genel İskonto', { kind: 'percent' })],
  'Kiralama Talebi': [t('Talep Başlığı', { required: true }), t('Kiracı', { kind: 'search', required: true }), t('Varlık Grubu', { kind: 'select', options: ['Araç', 'Ekipman', 'Gayrimenkul'] }), t('Kiralama Başlangıcı', { kind: 'date' }), t('Kiralama Bitişi', { kind: 'date' }), t('Tahsilat Yöntemi', { kind: 'select', options: ['Aylık', 'Peşin'] })],
  'Varlık Bilgileri': [t('Varlık Kodu', { kind: 'search' }), t('Varlık Adı'), t('Seri No'), t('Lokasyon', { kind: 'search' })],
  Kiracı: [t('Kiracı Adı', { required: true }), t('Vergi No'), t('Yetkili'), t('Telefon')],
  'Dönem ve Bedel': [t('Dönem', { kind: 'unit', unitOptions: ['Ay', 'Yıl'] }), t('Aylık Bedel', { kind: 'number' }), t('Depozito', { kind: 'number' }), t('Artış Oranı', { kind: 'percent' })],
  Görevler: [t('Görev Başlığı', { required: true }), t('Atanan Kullanıcı', { kind: 'search' }), t('Öncelik', { kind: 'select', options: ['Düşük', 'Orta', 'Yüksek'] }), t('Son Tarih', { kind: 'date' }), t('Durum', { kind: 'select', options: ['Açık', 'Devam Ediyor', 'Tamamlandı'] }), t('İlgili Belge', { kind: 'search' })],
  Kullanıcılar: [t('Ad Soyad', { required: true }), t('Kullanıcı Adı', { required: true }), t('Rol', { kind: 'select', options: ['Lojistik Yönetici', 'Satın Alma Uzmanı'] }), t('Birim'), t('E-Mail Adresi'), t('Aktif', { kind: 'check', checked: true })],
  Birimler: [t('Birim Adı', { required: true }), t('Üst Birim', { kind: 'search' }), t('Yönetici', { kind: 'search' }), t('Maliyet Merkezi')],
  'Belge Şablonları': [t('Şablon Adı', { required: true }), t('Belge Türü', { kind: 'select', options: ['Sözleşme', 'Teklif', 'Sipariş'] }), t('Antetli Çıktı', { kind: 'toggle' }), t('İmza Alanı', { kind: 'toggle' }), t('Varsayılan Rota', { kind: 'select', options: ['Lojistik / Satın Alma'] }), t('Aktif', { kind: 'check', checked: true })],
  'Rota ve Dağıtım': [t('Rota Adı', { required: true }), t('Belge Türleri', { kind: 'select', options: ['Sözleşme', 'Teklif'] }), t('Birinci Alıcı', { kind: 'search' }), t('İkinci Alıcı', { kind: 'search' }), t('Bilgi Alıcıları'), t('Dağıtım Kanalı', { kind: 'select', options: ['E-posta', 'Uygulama içi'] })],
  'Sistem Parametreleri': [t('Parametre Adı'), t('Değer'), t('Açıklama', { span: 2 })],
  'Satın Alma Özeti': [t('Başlangıç Tarihi', { kind: 'date' }), t('Bitiş Tarihi', { kind: 'date' }), t('Satın Alma Grubu', { kind: 'select', options: ['001 - Yurtiçi Satınalma Grubu'] }), t('İş Ortağı', { kind: 'search' })],
  'Teklif Karşılaştırma': [t('Teklif Değerlendirme No', { kind: 'search' }), t('Malzeme', { kind: 'search' }), t('Karşılaştırma Ölçütü', { kind: 'select', options: ['Birim Fiyat', 'Toplam Fiyat'] })],
  'Bütçe Gerçekleşme': [t('Dönem', { kind: 'select', options: ['2024 Q3', '2024 Q4'] }), t('Maliyet Merkezi', { kind: 'search' }), t('Bütçe', { kind: 'number' }), t('Gerçekleşen', { kind: 'number' })],
  'KPI Panosu': [t('KPI Seti', { kind: 'select', options: ['Satın Alma', 'Tedarikçi'] }), t('Dönem', { kind: 'select', options: ['Aylık', 'Çeyreklik'] }), t('Hedef', { kind: 'number' })],
  'Akış Tasarımcısı': [t('Akış Adı', { required: true }), t('Başlangıç Koşulu'), t('Adım Türü', { kind: 'select', options: ['Onay', 'Bilgi', 'Görev'] }), t('Onaycı Rolü', { kind: 'select', options: ['Lojistik Yönetici'] }), t('SLA Süresi', { kind: 'unit', unitOptions: ['Saat', 'Gün'] }), t('Aktif', { kind: 'check', checked: true })],
  'Onay Kuralları': [t('Kural Adı', { required: true }), t('Tutar Sınırı', { kind: 'number' }), t('Onaycı', { kind: 'search' }), t('Sıra', { kind: 'number' })],
  Bildirimler: [t('Bildirim Türü', { kind: 'select', options: ['E-posta', 'Uygulama içi'] }), t('Şablon', { kind: 'search' }), t('Tetikleyici'), t('Aktif', { kind: 'check', checked: true })],
  'Görev Kuyruğu': [t('Kuyruk Adı'), t('Öncelik', { kind: 'select', options: ['Düşük', 'Orta', 'Yüksek'] }), t('Sorumlu Grup', { kind: 'search' })],
  'Belge Türleri': [t('Belge Adı', { required: true }), t('Kategori', { kind: 'select', options: ['Satın Alma', 'Satış', 'Kiralama'] }), t('Şablon', { kind: 'search' }), t('Antet Tercihi', { kind: 'select', options: ['Antetli', 'Antetsiz'] }), t('Numara Serisi', { kind: 'search' }), t('Versiyonlama', { kind: 'toggle' })],
  'Ek Alanlar': [t('Alan Adı', { required: true }), t('Veri Tipi', { kind: 'select', options: ['Metin', 'Sayı', 'Tarih', 'Liste'] }), t('Zorunlu', { kind: 'check' }), t('Belge Türü', { kind: 'select', options: ['Sözleşme', 'Teklif'] })],
  'Numara Serileri': [t('Seri Adı', { required: true }), t('Ön Ek'), t('Başlangıç No', { kind: 'number' }), t('Yıllık Sıfırla', { kind: 'toggle' })],
  'Yetki Rolleri': [t('Rol Adı', { required: true }), t('Açıklama', { span: 2 }), t('Aktif', { kind: 'check', checked: true })],
}
const fallbackFields: FieldSpec[] = [t('Belge Başlığı', { required: true }), t('İşletme', { kind: 'search' }), t('Lokasyon', { kind: 'search' }), t('Sorumlu Kullanıcı', { kind: 'search' })]

const genericLeft: FieldSpec[] = [
  t('İşletme', {
    kind: 'select',
    required: true,
    value: 'AKM - Akme Teknoloji Çözümleri A.Ş.',
    options: [
      'AKM - Akme Teknoloji Çözümleri A.Ş.',
      'ABB - Ankara Büyükşehir Belediyesi',
      'İMAR - İmar ve İnşaat A.Ş.',
      'BELTAŞ - Ankara Beltaş A.Ş.',
      'ASKİ - Su ve Kanalizasyon İdaresi',
    ],
  }),
  t('Lokasyon', {
    kind: 'select',
    required: true,
    value: 'AKM-ANK - Akme Ankara ODTÜ Teknokent',
    options: [
      'AKM-ANK - Akme Ankara ODTÜ Teknokent',
      'MERKEZ - Ankara Merkez Lojistik Deposu',
      'YENİMAHALLE - Fen İşleri Şantiyesi',
      'ÇANKAYA - İdari Binalar Yerleşkesi',
    ],
  }),
  t('Sorumlu Kullanıcı', {
    kind: 'select',
    value: '01 - Abdulkadir İlci (Satınalma Uzmanı)',
    options: [
      '01 - Abdulkadir İlci (Satınalma Uzmanı)',
      '02 - Selin Yılmaz (İhale Yetkilisi)',
      '03 - Mehmet Can (Lojistik Yöneticisi)',
      '04 - Fatma Arslan (Gerçekleştirme Görevlisi)',
    ],
  }),
  t('Aktif', { kind: 'check', checked: true }),
]

export function ProcurementPage() {
  const [screenIndex, setScreenIndex] = useState(0)
  const [activeModule, setActiveModule] = useState(PROCUREMENT)
  const [activeTab, setActiveTab] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const isProcurement = activeModule === PROCUREMENT
  const screen = SCREENS[screenIndex]
  const tabs = moduleTabs[activeModule] ?? []
  const currentTab = activeTab || tabs[0] || ''
  const displayTitle = isProcurement ? screen.title : currentTab

  const goScreen = (i: number) => setScreenIndex((i + SCREENS.length) % SCREENS.length)
  const pickModule = (label: string) => {
    setActiveModule(label)
    setActiveTab('')
    setMenuOpen(false)
  }

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-[#1f2937]">
      <header className="flex h-[58px] items-center border-b border-[#dfe3e9] bg-white px-4 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
        <button className="mr-4 rounded-md p-2 text-[#526174] lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menüyü aç">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <div className="mr-6 flex items-center gap-2 text-[#1b416c]">
          <BrandLogo className="size-6 shrink-0" />
          <span className="text-[17px] font-black tracking-tight text-[#16253b]">
            KAMU <span className="text-[#2d62d7]">360</span>
          </span>
        </div>
        <div className="hidden h-8 w-[265px] items-center gap-2 rounded-md border border-[#e4e7ec] px-3 text-[11px] text-[#9aa2ad] sm:flex">
          <Search className="size-3.5" /> Size Nasıl Yardımcı Olabilirim?
        </div>
        <div className="ml-auto flex items-center gap-4 text-[#43505f]">
          <span className="relative"><Bell className="size-[18px] text-[#0c67dc]" /><span className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-[#2d62d7] text-[8px] text-white">0</span></span>
          <Printer className="hidden size-[18px] sm:block" />
          <CalendarDays className="hidden size-[18px] sm:block" />
          <Info className="hidden size-[18px] sm:block" />
          <div className="hidden items-center gap-2 border-l pl-4 text-right text-[10px] leading-3 sm:flex">
            <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#677381] text-sm">◉</span>
            <span>lojtest1<br /><span className="text-[#8d98a4]">Lojistik Yönetici</span></span>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-58px)]">
        <aside
          className={`${menuOpen ? 'flex' : 'hidden'} absolute inset-y-[58px] left-0 z-20 w-[58px] flex-col items-center gap-5 border-r border-[#dfe3e9] bg-[#1e2a3c] py-5 text-[#aab6c6] lg:static lg:flex`}
          aria-label="Uygulama menüsü"
        >
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => pickModule(label)}
              className={`flex size-8 items-center justify-center rounded-md transition ${activeModule === label ? 'bg-[#30425a] text-white' : 'hover:bg-[#30425a] hover:text-white'}`}
              aria-label={label}
              title={label}
            >
              <Icon className="size-[17px]" />
            </button>
          ))}
        </aside>

        <section className="min-w-0 flex-1 bg-[#fafbfc] pb-16">
          <div className="flex h-[46px] items-center gap-2 border-b border-[#e3e6eb] bg-white px-4 text-[11px] text-[#7b8794]">
            <span>⌂</span><ChevronRight className="size-3" /><span>{activeModule}</span><ChevronRight className="size-3" />
            <span className="font-semibold text-[#26384c]">{displayTitle}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-2 pt-3">
            <div className="flex items-center gap-3">
              <button
                className="flex size-7 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#26384c] shadow-2xs hover:border-[#2d62d7] hover:bg-[#eef3ff] hover:text-[#2d62d7]"
                aria-label="Dosya Listesine Dön"
                title={screenIndex === 0 ? "Dosya Listesine Dön (/temin-dosyasi)" : "Önceki Ekran"}
                onClick={() => {
                  if (isProcurement) {
                    if (screenIndex > 0) {
                      goScreen(screenIndex - 1)
                    } else {
                      window.location.href = '/temin-dosyasi'
                    }
                  }
                }}
              >
                <ChevronLeft className="size-4" />
              </button>
              <h1 className="text-[18px] font-semibold text-[#172334]">{displayTitle}</h1>
              <MoreVertical className="size-4 text-[#9aa3ad]" />
            </div>
            {isProcurement && (
              <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Ekranlar">
                {SCREENS.map((s, i) => (
                  <button
                    key={s.title}
                    role="tab"
                    aria-selected={i === screenIndex}
                    onClick={() => setScreenIndex(i)}
                    className={`rounded px-2.5 py-1 text-[10px] font-medium transition ${i === screenIndex ? 'bg-[#2d62d7] text-white' : 'border border-[#d7dce3] bg-white text-[#526174] hover:bg-[#f2f5ff]'}`}
                  >
                    {i + 1}. {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isProcurement ? (
            <div className="grid gap-2 px-3 pb-3 lg:grid-cols-[300px_1fr]">
              <LeftPanel key={screenIndex} screen={screen} />
              <div className="min-w-0 rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)]">
                <div className="flex items-center justify-between border-b border-[#e3e6eb] px-4 py-3 text-[13px] font-semibold text-[#172334]">
                  Belge Detayı <MoreVertical className="size-4 text-[#43505f]" />
                </div>
                <div key={screenIndex} className="p-3">{screen.body}</div>
              </div>
            </div>
          ) : (
            <div className="grid gap-2 px-3 pb-3 lg:grid-cols-[300px_1fr]">
              <div className="rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)]">
                <div className="border-b border-[#e3e6eb] px-4 py-3 text-[13px] font-semibold text-[#172334]">{activeModule}</div>
                <div className="space-y-3 p-4">
                  {genericLeft.map((f) => <Field key={f.label} spec={f} />)}
                </div>
              </div>
              <div className="min-w-0 rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)]">
                <div className="border-b border-[#e3e6eb] px-4 py-3 text-[13px] font-semibold text-[#172334]">Belge Detayı</div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3e6eb] px-3 pt-2" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      role="tab"
                      aria-selected={currentTab === tab}
                      onClick={() => setActiveTab(tab)}
                      className={`whitespace-nowrap border-b-2 px-3 py-2 text-[11px] font-medium ${currentTab === tab ? 'border-[#2d62d7] text-[#2d62d7]' : 'border-transparent text-[#7b8794] hover:text-[#33445a]'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="p-4">
                  <AccordionGroup>
                    <Accordion title={currentTab} defaultOpen key={currentTab}>
                      <FieldGrid fields={tabFields[currentTab] ?? fallbackFields} />
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#e6e9ee] pt-4">
                        <div className="flex items-center gap-2 text-[10px] text-[#85909e]">
                          <span className="size-2 rounded-full bg-[#3caf75]" />
                          {savedAt ? `Kaydedildi: ${savedAt}` : 'Taslak olarak kaydedildi'}
                        </div>
                        <div className="flex gap-2">
                          <OutlineButton>İptal</OutlineButton>
                          <PrimaryButton onClick={() => setSavedAt(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }))}>Kaydet</PrimaryButton>
                        </div>
                      </div>
                    </Accordion>
                  </AccordionGroup>
                </div>
              </div>
            </div>
          )}

          {isProcurement && (
            <div className="flex items-center justify-center gap-2 pb-4 pt-1">
              <button onClick={() => goScreen(screenIndex - 1)} className="rounded border bg-white p-1.5 text-[#526174]" aria-label="Önceki ekran"><ChevronLeft className="size-4" /></button>
              {SCREENS.map((s, i) => (
                <button key={s.title} onClick={() => setScreenIndex(i)} aria-label={`${s.title} ekranını göster`} className={`h-1.5 rounded-full transition-all ${i === screenIndex ? 'w-8 bg-[#2d62d7]' : 'w-2 bg-[#bfc7d1]'}`} />
              ))}
              <button onClick={() => goScreen(screenIndex + 1)} className="rounded border bg-white p-1.5 text-[#526174]" aria-label="Sonraki ekran"><ChevronRight className="size-4" /></button>
            </div>
          )}
        </section>
      </div>

      {isProcurement && screen.footer && (
        <div className="fixed inset-x-0 bottom-0 z-10 flex justify-end gap-3 border-t border-[#dfe3e9] bg-white px-6 py-3 lg:left-[58px]">
          <button className="px-3 text-[11px] font-medium text-[#2d62d7] hover:underline">Vazgeç</button>
          <OutlineButton><Printer className="mr-1 inline size-3" />Yazdır</OutlineButton>
        </div>
      )}
    </main>
  )
}

