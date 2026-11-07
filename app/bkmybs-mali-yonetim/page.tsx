'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Coins,
  FileSpreadsheet,
  FileCheck2,
  Package,
  Layers,
  Search,
  Plus,
  Download,
  Printer,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle2,
  ExternalLink,
  Sliders,
  Filter,
} from 'lucide-react'
import {
  MifKaydi,
  getStoredMifList,
  saveStoredMifList,
} from '@/lib/bkmybs/mali-entegrasyon'
import { DogrudanTeminLimitCard } from '@/components/bkmybs/dogrudan-temin-limit-card'
import { OebBelgeModal } from '@/components/bkmybs/oeb-belge-modal'

// Örnek Analitik Bütçe Tertipleri (5018 Sayılı Kanun)
const INITIAL_BUDGET_LINES = [
  {
    tertip: '34.01.02.45 - 01.3.1.00 - 05 - 03.2.1.01',
    aciklama: 'Kırtasiye, Büro Malzemesi ve Basılı Evrak Alımları',
    baslangicOdenegi: '4.500.000,00 ₺',
    eklenenDusulen: '+350.000,00 ₺',
    harcanan: '3.120.450,00 ₺',
    bloke: '480.000,00 ₺',
    kalanOdenek: '1.249.550,00 ₺',
    kullanimOrani: '%72.2',
  },
  {
    tertip: '34.01.02.45 - 01.3.1.00 - 05 - 03.5.2.02',
    aciklama: 'Hizmet Binası ve Tesis Taşıt Kiralama Giderleri',
    baslangicOdenegi: '18.000.000,00 ₺',
    eklenenDusulen: '0,00 ₺',
    harcanan: '14.250.000,00 ₺',
    bloke: '1.750.000,00 ₺',
    kalanOdenek: '2.000.000,00 ₺',
    kullanimOrani: '%88.9',
  },
  {
    tertip: '34.01.02.45 - 06.1.1.00 - 05 - 06.5.7.01',
    aciklama: 'Yazılım Alımları ve Büyük Bilişim Sistem Lisansları',
    baslangicOdenegi: '7.200.000,00 ₺',
    eklenenDusulen: '+1.100.000,00 ₺',
    harcanan: '5.400.000,00 ₺',
    bloke: '950.000,00 ₺',
    kalanOdenek: '1.950.000,00 ₺',
    kullanimOrani: '%65.0',
  },
  {
    tertip: '34.01.02.45 - 04.3.1.00 - 05 - 03.7.1.01',
    aciklama: 'Su Şebekesi, Vana ve Pompa Tesisatı Onarım Giderleri',
    baslangicOdenegi: '12.500.000,00 ₺',
    eklenenDusulen: '+2.000.000,00 ₺',
    harcanan: '11.800.000,00 ₺',
    bloke: '1.200.000,00 ₺',
    kalanOdenek: '1.500.000,00 ₺',
    kullanimOrani: '%81.4',
  },
]

// Örnek TKYS Taşınır Mal Kayıtları
const INITIAL_TKYS_ITEMS = [
  {
    kod: '255.02.01.01.001',
    tanim: 'Lazer Yazıcı ve Çok Fonksiyonlu Tarayıcı',
    miktar: '14 Adet',
    ambaraGirisTarihi: '18.10.2026',
    tifNo: 'TİF-2026/045',
    bulunduguOda: 'Satın Alma Şb. Md. Çalışma Alanı',
    zimmetliPersonel: 'Mehmet Demir (Şube Müdürü)',
    durum: 'Faal Kullanımda',
  },
  {
    kod: '253.03.01.02.014',
    tanim: 'Dijital Debimetre ve Basınç Ölçüm Cihazı (SCADA)',
    miktar: '6 Adet',
    ambaraGirisTarihi: '05.10.2026',
    tifNo: 'TİF-2026/038',
    bulunduguOda: 'Kuzey Su İstasyonu Kontrol Odası',
    zimmetliPersonel: 'Mustafa Kaya (Saha Bakım)',
    durum: 'Faal Kullanımda',
  },
]

function BkmybsMaliYonetimContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'butce' | 'mif' | 'tkys' | 'emanet' | 'limit'>('butce')
  const [searchQuery, setSearchQuery] = useState('')
  const [mifList, setMifList] = useState<MifKaydi[]>([])
  const [seciliMifForModal, setSeciliMifForModal] = useState<MifKaydi | null>(null)
  const [isOebModalOpen, setIsOebModalOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // MİF listesini yükle (LocalStorage destekli)
  useEffect(() => {
    setMifList(getStoredMifList())
  }, [])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'butce' || tab === 'mif' || tab === 'tkys' || tab === 'emanet' || tab === 'limit') {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleOpenOebModal = (m: MifKaydi) => {
    setSeciliMifForModal(m)
    setIsOebModalOpen(true)
  }

  const handleUpdateStatus = (id: string, newStatus: MifKaydi['durum']) => {
    const updated = mifList.map((m) => (m.id === id ? { ...m, durum: newStatus } : m))
    setMifList(updated)
    saveStoredMifList(updated)
    setToastMsg(`MİF onay durumu "${newStatus}" olarak güncellendi.`)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const filteredMifs = mifList.filter((m) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      m.mifNo.toLowerCase().includes(q) ||
      m.oebNo.toLowerCase().includes(q) ||
      m.alacakliFirma.toLowerCase().includes(q) ||
      m.isKonusu.toLowerCase().includes(q) ||
      (m.dosyaNo && m.dosyaNo.toLowerCase().includes(q))
    )
  })

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* ÜST BAŞLIK */}
      <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-600 to-yellow-700 text-white rounded-xl shadow-md">
              <Coins className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#0f172a]">
                  BKMYBS &amp; Mali Yönetim Portalı (5018 Kanun)
                </h1>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                  Bütçe &amp; Muhasebat
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                Bütünleşik Kamu Mali Yönetim Bilişim Sistemi: 4734 m. 22/d Doğrudan Temin parasal limitleri, analitik bütçe tertipleri, ÖEB/MİF ve TKYS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/temin-dosyasi"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition"
            >
              <ExternalLink className="size-3.5" />
              <span>22/d Temin Masasına Git</span>
            </Link>
            <button
              onClick={() => {
                setToastMsg('E-Bütçe Muhasebat GM canlı servisi sorgulandı: Tüm ödenek tertipleri güncel.')
                setTimeout(() => setToastMsg(null), 3500)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-[#cbd5e1] rounded-lg transition"
            >
              <Coins className="size-3.5 text-amber-600" />
              E-Bütçe Senkronizasyonu
            </button>
          </div>
        </div>

        {/* BİLDİRİM TOAST */}
        {toastMsg && (
          <div className="mt-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800 flex items-center justify-between">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* METRİKLER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Toplam Bütçe Ödeneği</div>
            <div className="text-lg font-bold text-[#0f172a] mt-0.5">42.200.000 ₺</div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5">2026 Malî Yılı</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Gerçekleşen Harcama</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">34.570.450 ₺</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">%81.9 Bütçe Gerçekleşmesi</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">22/d Doğrudan Temin Kotası (%10)</div>
            <div className="text-lg font-bold text-amber-900 mt-0.5">4.220.000 ₺</div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5">Kalan: 1.379.550 ₺ (KİK Eşiği)</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Kullanılabilir Serbest Ödenek</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">3.249.550 ₺</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Harcamaya Uygun</div>
          </div>
        </div>

        {/* SEKME MENÜSÜ */}
        <div className="flex items-center gap-2 mt-4 border-b border-[#e2e8f0]">
          <button
            onClick={() => setActiveTab('butce')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'butce'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Coins className="size-4" />
            1. Analitik Bütçe Kodları &amp; Ödenek Takibi
          </button>
          <button
            onClick={() => setActiveTab('limit')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'limit'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <ShieldCheck className="size-4" />
            2. 22/d Parasal Limit &amp; %10 Kota Masası
          </button>
          <button
            onClick={() => setActiveTab('mif')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'mif'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <FileSpreadsheet className="size-4" />
            3. MİF &amp; Ödeme Emri Belgesi (ÖEB)
            <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
              {mifList.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('tkys')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'tkys'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Package className="size-4" />
            4. TKYS Taşınır Mal Yönetimi &amp; Zimmet
          </button>
          <button
            onClick={() => setActiveTab('emanet')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'emanet'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <ShieldAlert className="size-4" />
            5. Emanetler &amp; Teminat Mektubu Masası
          </button>
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="p-6 space-y-6 flex-1">
        {/* SEKME 2: DOĞRUDAN TEMİN PARASAL LİMİT VE KOTA MASASI */}
        {activeTab === 'limit' && (
          <div className="space-y-4">
            <DogrudanTeminLimitCard
              currentDosyaTutar={184500}
              currentDosyaNo="2026/DT-001"
              showBirimBreakdown={true}
            />

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                <div>
                  <h3 className="text-xs font-bold text-[#0f172a]">
                    4734 Sayılı Kanun Kapsamında Doğrudan Temin Yıllık Harcama İcmali
                  </h3>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Harcama birimlerinin 22/d kapsamında kullandığı ödenekler ve KİK %10 izin projeksiyonu
                  </p>
                </div>
                <Link
                  href="/temin-dosyasi"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition"
                >
                  Yeni Doğrudan Temin Dosyası Aç
                </Link>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
                <ShieldCheck className="size-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Mevzuat Hatırlatması:</strong> 4734 sayılı Kanunun 22/d bendi uyarınca yapılan alımlarda,
                  ilan yapılmaksızın ve teminat alınmaksızın piyasada fiyat araştırması yapılarak ihtiyaç temin edilir.
                  Ancak bu alımların bütçe ödeneklerinin <strong>%10&apos;unu aşmaması</strong> esastır. Bu portal üzerinden
                  onaylanan her Doğrudan Temin Dosyası, otomatik olarak bütçe tertibinden düşülerek buradaki kota çubuğuna yansır.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEKME 1: ANALİTİK BÜTÇE KODLARI */}
        {activeTab === 'butce' && (
          <div className="space-y-4">
            {/* Hızlı Limit Özeti Kartı */}
            <DogrudanTeminLimitCard
              currentDosyaTutar={184500}
              currentDosyaNo="2026/DT-001"
              showBirimBreakdown={false}
            />

            <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="size-4 text-[#94a3b8] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ekonomik kod, fonksiyonel kod veya tertip ara..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setToastMsg('Analitik bütçe icmali Excel formatında indirildi.')
                      setTimeout(() => setToastMsg(null), 3000)
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg transition"
                  >
                    <Download className="size-3.5" />
                    Bütçe İcmali
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Bütçe Tertibi (Kurumsal - Fonk - Fin - Eko)</th>
                      <th className="py-3 px-4">Açıklama</th>
                      <th className="py-3 px-4">Başlangıç Ödeneği</th>
                      <th className="py-3 px-4">Harcanan</th>
                      <th className="py-3 px-4">Bloke Edilen</th>
                      <th className="py-3 px-4 font-bold text-emerald-800">Kalan Net Ödenek</th>
                      <th className="py-3 px-4">Kullanım %</th>
                      <th className="py-3 px-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {INITIAL_BUDGET_LINES.map((b, idx) => (
                      <tr key={idx} className="hover:bg-[#f8fafc] transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{b.tertip}</td>
                        <td className="py-3 px-4 text-[#334155] max-w-xs">{b.aciklama}</td>
                        <td className="py-3 px-4 font-mono">{b.baslangicOdenegi}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#0f172a]">{b.harcanan}</td>
                        <td className="py-3 px-4 font-mono text-sky-700">{b.bloke}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{b.kalanOdenek}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                            {b.kullanimOrani}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setToastMsg(`${b.tertip} tertibine bağlı harcama talimatları listelendi.`)
                              setTimeout(() => setToastMsg(null), 3000)
                            }}
                            className="px-2.5 py-1 text-xs text-amber-800 hover:bg-amber-50 border border-amber-200 rounded-md transition font-medium"
                          >
                            Ekstre
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SEKME 3: MİF & ÖDEME EMRİ BELGESİ (ÖEB) */}
        {activeTab === 'mif' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#0f172a]">
                  Muhasebe İşlem Fişleri (MİF) ve Ödeme Emirleri (ÖEB)
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Doğrudan temin ve ihale hakedişleri için 5018 sayılı Kanun kapsamında üretilen resmî ödeme paketleri
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/temin-dosyasi"
                  className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition flex items-center gap-1.5"
                >
                  <ExternalLink className="size-3" />
                  <span>22/d Dosyasından MİF Üret</span>
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">MİF No / ÖEB No</th>
                    <th className="py-3 px-4">Kaynak / Dosya No</th>
                    <th className="py-3 px-4">Tarih</th>
                    <th className="py-3 px-4">Alacaklı Firma &amp; VKN</th>
                    <th className="py-3 px-4">İşin Konusu &amp; Tertip</th>
                    <th className="py-3 px-4">Brüt Tutar</th>
                    <th className="py-3 px-4 font-bold text-emerald-800">Net Ödenecek</th>
                    <th className="py-3 px-4">Onay Durumu</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredMifs.map((m) => (
                    <tr key={m.id} className="hover:bg-[#f8fafc] transition">
                      <td className="py-3 px-4 font-mono font-bold text-amber-900">
                        <div>{m.mifNo}</div>
                        <div className="text-[10px] text-[#64748b]">{m.oebNo}</div>
                      </td>
                      <td className="py-3 px-4">
                        {m.dosyaNo ? (
                          <Link
                            href="/temin-dosyasi"
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 rounded-md hover:bg-amber-100 transition"
                          >
                            <span>{m.dosyaNo}</span>
                            <ExternalLink className="size-2.5" />
                          </Link>
                        ) : (
                          <span className="text-[10px] text-slate-500">Münferit Harcama</span>
                        )}
                        {m.tifNo && (
                          <div className="text-[9.5px] font-mono text-emerald-700 mt-0.5">
                            {m.tifNo} (TKYS)
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#475569] font-mono">{m.tarih}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0f172a]">{m.alacakliFirma}</div>
                        <div className="text-[10px] font-mono text-[#64748b]">VKN: {m.alacakliVkn}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-[#334155] truncate" title={m.isKonusu}>
                          {m.isKonusu}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate" title={m.butceTertibi}>
                          {m.butceTertibi}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {m.brutTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        {m.netOdenecek.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={m.durum}
                          onChange={(e) => handleUpdateStatus(m.id, e.target.value as any)}
                          className="px-2 py-1 text-[11px] font-semibold bg-white border border-[#cbd5e1] rounded-md focus:outline-hidden focus:border-amber-600 cursor-pointer"
                        >
                          <option value="Taslak">Taslak</option>
                          <option value="Gerçekleştirme Onayında">Gerçekleştirme Onayında</option>
                          <option value="Harcama Yetkilisi Onayında">Harcama Yetkilisi Onayında</option>
                          <option value="Muhasebeye Gönderildi">Muhasebeye Gönderildi</option>
                          <option value="Ödendi">Ödendi (Kapandı)</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenOebModal(m)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition shadow-xs"
                        >
                          <Printer className="size-3" />
                          <span>ÖEB Matbu Gör</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 4: TKYS TAŞINIR MAL YÖNETİMİ */}
        {activeTab === 'tkys' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0f172a]">
                  TKYS Taşınır Mal Yönetmeliği Kayıtları &amp; Zimmet Masası
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Taşınır İşlem Fişi (TİF), Dayanıklı Taşınırlar Defteri ve Kişisel Zimmet Senetleri
                </p>
              </div>
              <button
                onClick={() => {
                  setToastMsg('Yeni Taşınır Girişi (TİF) formu açıldı.')
                  setTimeout(() => setToastMsg(null), 3000)
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition"
              >
                + Yeni TİF (Taşınır Girişi)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Taşınır Kodu (TKYS)</th>
                    <th className="py-3 px-4">Taşınır Mal Tanımı</th>
                    <th className="py-3 px-4">Miktar</th>
                    <th className="py-3 px-4">Giriş TİF No</th>
                    <th className="py-3 px-4">Bulunduğu Oda / Mahalli</th>
                    <th className="py-3 px-4">Zimmetli Yetkili Personel</th>
                    <th className="py-3 px-4">Durum</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {INITIAL_TKYS_ITEMS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#f8fafc] transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{item.kod}</td>
                      <td className="py-3 px-4 font-semibold text-[#0f172a]">{item.tanim}</td>
                      <td className="py-3 px-4 font-medium">{item.miktar}</td>
                      <td className="py-3 px-4 font-mono text-[#475569]">{item.tifNo}</td>
                      <td className="py-3 px-4 text-[#334155]">{item.bulunduguOda}</td>
                      <td className="py-3 px-4 font-medium text-amber-900">{item.zimmetliPersonel}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                          {item.durum}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setToastMsg(`${item.kod} Taşınır Zimmet Fişi (Zimmet Senedi) yazdırıldı.`)
                            setTimeout(() => setToastMsg(null), 3000)
                          }}
                          className="px-2.5 py-1 text-xs text-amber-900 hover:bg-amber-50 border border-amber-200 rounded-md transition font-medium"
                        >
                          Zimmet Senedi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 5: EMANETLER & TEMİNATLAR */}
        {activeTab === 'emanet' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#0f172a]">
              Geçici &amp; Kesin Teminat Mektupları Masası (4734 &amp; 2886)
            </h2>
            <p className="text-xs text-[#64748b] mt-1">
              Banka teyit yazıları, nakit teminat yatırma dekontları, süre uzatımları ve ihale bitimi teminat iade onayları.
            </p>
          </div>
        )}
      </div>

      {/* ÖDEME EMRİ BELGESİ (ÖEB) A4 MATBU MODAL */}
      <OebBelgeModal
        mif={seciliMifForModal}
        isOpen={isOebModalOpen}
        onClose={() => setIsOebModalOpen(false)}
      />
    </div>
  )
}

export default function BkmybsMaliYonetimPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-xs text-slate-500">BKMYBS &amp; Mali Yönetim Modülü Yükleniyor...</div>
      }
    >
      <BkmybsMaliYonetimContent />
    </Suspense>
  )
}
