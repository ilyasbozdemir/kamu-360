'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Building,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileCheck2,
  FileSignature,
  FileText,
  Filter,
  FolderOpen,
  GitBranch,
  Layers,
  Maximize2,
  Minimize2,
  Paperclip,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Scan,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  User,
  UserCheck,
  Users,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import {
  DAGITIM_YERLERI,
  HAZIR_PERSONELLER,
  PersonelKaydi,
  RotaKullaniciAdimi,
  RotaTanimi,
  STANDART_DOSYA_PLANLARI,
  VARSAYILAN_ROTALAR,
} from '@/lib/rota-yonetimi-data'
import {
  getKurumVeRotaAyarlari,
  saveKurumVeRotaAyarlari,
  useKurumVeRotaAyarlari,
} from '@/lib/settings/kurum-ve-rota-ayarlari'
import { RotaYonetimiTable } from './rota-yonetimi-table'
import { ResmiBelgeFormView } from './resmi-belge-form-view'
import { ResmiUstYaziTemplate } from '@/lib/document-engine/template'
import { ResmiUstYaziData } from '@/lib/document-engine/definition'
import { usePrintHub } from '@/lib/print-hub-context'
import { UniversalDocumentModal } from '@/components/document-preview/universal-document-modal'

export function RotaYonetimiShell() {
  const { addToPrintQueue } = usePrintHub()
  const globalSettings = useKurumVeRotaAyarlari()

  // Sekmeler: Canlı Önizleme & Rota Masası, Rota Tanımları Listesi, Ayarlar
  const [activeTab, setActiveTab] = useState<'onizleme-akis' | 'rota-tanimlari' | 'ayarlar'>('onizleme-akis')

  // Seçili / Aktif Rota
  const [rotalar, setRotalar] = useState<RotaTanimi[]>(VARSAYILAN_ROTALAR)
  const [selectedRotaId, setSelectedRotaId] = useState<string>(globalSettings.aktifRotaId || 'rota-1')
  const activeRota = rotalar.find((r) => r.id === selectedRotaId) || rotalar[0]

  // Belge ve Üst Veri State'leri
  const [dosyaPlani, setDosyaPlani] = useState<string>('841.01.01')
  const [sayiNo, setSayiNo] = useState<string>('E-84125801-841.01.01-2026/DT-001')
  const [tarih, setTarih] = useState<string>(new Date().toLocaleDateString('tr-TR'))
  const [konu, setKonu] = useState<string>('Doğrudan Temin Alımı Harcama Talimatı ve Piyasa Araştırma Onayı')
  const [muhatap, setMuhatap] = useState<string>('HARCAMA YETKİLİSİ MAKAMINA')
  const [muhatapYer, setMuhatapYer] = useState<string>('ANKARA')
  const [metin, setMetin] = useState<string>(
    `Başkanlığımız merkez birimlerinin acil sarf ve toner ihtiyacının karşılanması amacıyla 4734 Sayılı Kamu İhale Kanununun 22/d maddesi kapsamında doğrudan temin usulü ile satın alma işlemi yapılması planlanmaktadır.\n\nSöz konusu alım için piyasa fiyat araştırmasının yapılması, yaklaşık maliyetin belirlenmesi ve görevlendirilen komisyonca işlemlerin ikmal edilmesi hususunu olurlarınıza arz ederim.`
  )
  const [ilgi, setIlgi] = useState<string>('Destek Hizmetleri Dairesi Başkanlığının 01.03.2026 tarihli ve 1042 sayılı ihtiyaç yazısı.')

  // Gizlilik & İvedilik
  const [gizlilik, setGizlilik] = useState<string>('NORMAL')
  const [ivedilik, setIvedilik] = useState<string>('NORMAL')

  // Kurum & Antet & İmza Ayarları (Global Ayarlarla senkron)
  const [kurumAdi, setKurumAdi] = useState<string>(globalSettings.kurumAdi)
  const [birimAdi, setBirimAdi] = useState<string>(globalSettings.daireBaskanligi)
  const [altBirimAdi, setAltBirimAdi] = useState<string>(globalSettings.subeMudurlugu)
  const [harcamaYetkilisiAdi, setHarcamaYetkilisiAdi] = useState<string>(globalSettings.harcamaYetkilisiAdi)
  const [harcamaYetkilisiUnvan, setHarcamaYetkilisiUnvan] = useState<string>(globalSettings.harcamaYetkilisiUnvan)
  const [gerceklestirmeGorevlisiAdi, setGerceklestirmeGorevlisiAdi] = useState<string>(globalSettings.gerceklestirmeGorevlisiAdi)
  const [gerceklestirmeGorevlisiUnvan, setGerceklestirmeGorevlisiUnvan] = useState<string>(globalSettings.gerceklestirmeGorevlisiUnvan)
  const [ebysEvrakFormat, setEbysEvrakFormat] = useState<string>(globalSettings.ebysEvrakFormat)
  const [karekodGoster, setKarekodGoster] = useState<boolean>(globalSettings.karekodGoster)
  const [dogrulamaKodu, setDogrulamaKodu] = useState<string>(globalSettings.dogrulamaKodu)

  // Önizleme Zoom & Ekran Modu
  const [zoomLevel, setZoomLevel] = useState<number>(85) // %
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Global ayarlar değiştiğinde yerel inputları güncelle
  useEffect(() => {
    const s = getKurumVeRotaAyarlari()
    setKurumAdi(s.kurumAdi)
    setBirimAdi(s.daireBaskanligi)
    setAltBirimAdi(s.subeMudurlugu)
    setHarcamaYetkilisiAdi(s.harcamaYetkilisiAdi)
    setHarcamaYetkilisiUnvan(s.harcamaYetkilisiUnvan)
    setGerceklestirmeGorevlisiAdi(s.gerceklestirmeGorevlisiAdi)
    setGerceklestirmeGorevlisiUnvan(s.gerceklestirmeGorevlisiUnvan)
    setKarekodGoster(s.karekodGoster)
    setDogrulamaKodu(s.dogrulamaKodu)
    setEbysEvrakFormat(s.ebysEvrakFormat)
    if (s.aktifRotaId) setSelectedRotaId(s.aktifRotaId)
  }, [])

  const handleSaveAyarlar = () => {
    saveKurumVeRotaAyarlari({
      kurumAdi,
      daireBaskanligi: birimAdi,
      subeMudurlugu: altBirimAdi,
      harcamaYetkilisiAdi,
      harcamaYetkilisiUnvan,
      gerceklestirmeGorevlisiAdi,
      gerceklestirmeGorevlisiUnvan,
      dogrulamaKodu,
      karekodGoster,
      ebysEvrakFormat,
      aktifRotaId: selectedRotaId,
    })
    setToastMessage('EBYS, antet ve yetkili imza ayarları başarıyla tüm belgelere uygulandı ve kaydedildi!')
    setTimeout(() => setToastMessage(null), 3500)
  }

  const mapImzaTuru = (tur: string): 'Hazırlayan' | 'Paraf' | 'İmza' | 'Bilgi' | 'Onay' => {
    if (tur.includes('İmza')) return 'İmza'
    if (tur.includes('Paraf')) return 'Paraf'
    if (tur.includes('Arz') || tur.includes('Teklif')) return 'Hazırlayan'
    return 'Paraf'
  }

  // Canlı Belge Verisi Sentezi (ResmiUstYaziData standardı)
  const previewDocumentData: ResmiUstYaziData = {
    sayi: sayiNo,
    konu,
    tarih,
    muhatap,
    muhatapYer,
    metin,
    ilgi: ilgi || undefined,
    kurumAdi,
    birimAdi,
    altBirimAdi,
    tcIbaresi: 'T.C.',
    gizlilikDerecesi: gizlilik as any,
    ivedilikDerecesi: ivedilik as any,
    ekler: ['1- Piyasa Fiyat Araştırma Tutanağı (1 Sayfa)', '2- Yaklaşık Maliyet Cetveli (1 Sayfa)'],
    dagitim: ['Gereği: Harcama Yetkilisi Makamı', 'Bilgi: Mali Hizmetler Dairesi'],
    ebysDogrulama: {
      dogrulamaKodu,
      dogrulamaUrl: 'https://ebys.belediye.gov.tr/dogrula',
      evrakId: '2026-00412',
      karekodVarMi: karekodGoster,
    },
    rota: activeRota.adimlari.map((a, idx) => ({
      sira: a.sira,
      tur: mapImzaTuru(a.imzaTuru),
      adSoyad: a.adSoyad,
      unvan: a.unvan,
      durum: idx === 0 ? 'ONAYLANDI' : 'BEKLIYOR',
      islemTarihi: idx === 0 ? new Date().toISOString() : undefined,
    })),
  }

  const handleKuyrugaGonder = () => {
    addToPrintQueue({
      title: `EBYS Resmî Yazı - ${konu}`,
      docNo: 'DOC_RESMI_UST_YAZI',
      dosyaNo: 'EBYS-2026/01',
      dosyaAdi: konu,
      category: 'EBYS Resmî Yazı',
      format: 'A4 Dikey',
      pageCount: 1,
    })
    setToastMessage(`"${konu}" EBYS Resmî Yazısı Yazdırma Merkezine eklendi!`)
    setTimeout(() => setToastMessage(null), 3500)
  }

  return (
    <div className="space-y-3 pb-8">
      {/* 1. ÜST BREADCRUMB - Kamu 360 Standardı */}
      <div className="flex h-[46px] items-center justify-between border-b border-[#e3e6eb] bg-white px-4 text-[11px] text-[#7b8794]">
        <div className="flex items-center gap-2">
          <Link
            href="/temin-dosyasi"
            className="flex size-6 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#26384c] shadow-2xs hover:border-[#2d62d7] hover:bg-[#eef3ff] hover:text-[#2d62d7] transition"
            aria-label="Dosya Listesine Dön"
            title="Dosya Listesine Dön (/temin-dosyasi)"
          >
            <ChevronLeft className="size-3.5" />
          </Link>
          <Link href="/" className="hover:text-[#26384c]">
            ⌂ Kamu 360
          </Link>
          <span className="text-[#adb5bd]">/</span>
          <Link href="/malzeme-bilgisi" className="font-semibold text-[#172334] hover:text-[#0c67dc]">
            Satın Alma Yönetimi
          </Link>
          <span className="text-[#adb5bd]">/</span>
          <span className="font-semibold text-[#2d62d7]">Rota İşlemleri ve İş Akışları (EBYS)</span>
        </div>

        {/* Sağ Üst Aksiyonlar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleKuyrugaGonder}
            className="flex h-7 items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-medium text-[#4f5b69] transition hover:bg-[#f5f6f8]"
            title="Bu belgeyi yazdırma kuyruğuna ekle"
          >
            <Printer className="size-3 text-[#2d62d7]" />
            <span>Kuyruğa Gönder</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3 text-[11px] font-medium text-white transition hover:bg-[#2455bd]"
            title="A4 formatında tam ekran canlı önizle"
          >
            <Eye className="size-3 text-white" />
            <span>A4 Canlı Önizle</span>
          </button>
        </div>
      </div>

      {/* Toast Mesajı */}
      {toastMessage && (
        <div className="mx-3 rounded border border-blue-200 bg-blue-50/90 p-2 text-[11px] font-semibold text-[#1e40af] shadow-xs">
          {toastMessage}
        </div>
      )}

      {/* 2. ANA ÇALIŞMA KARTI: SEKMELER */}
      <div className="mx-3 rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)] overflow-hidden">
        {/* Sekme Başlıkları - Kamu 360 Standardı */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#e2e8f0] bg-[#f8f9fb] px-2 pt-1 text-[12px]">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('onizleme-akis')}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2 font-bold transition ${
                activeTab === 'onizleme-akis'
                  ? 'border-[#2d62d7] text-[#2d62d7] bg-white rounded-t'
                  : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <FileSignature className="size-3.5" />
              <span>Canlı Belge Önizleme &amp; Akış Girişi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rota-tanimlari')}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2 font-bold transition ${
                activeTab === 'rota-tanimlari'
                  ? 'border-[#2d62d7] text-[#2d62d7] bg-white rounded-t'
                  : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <GitBranch className="size-3.5" />
              <span>Rota Tanımları &amp; Şablonlar</span>
              <span className="rounded-sm bg-[#d3e0fb] px-1.5 py-0.2 text-[10px] font-semibold text-[#2d62d7]">
                {rotalar.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ayarlar')}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2 font-bold transition ${
                activeTab === 'ayarlar'
                  ? 'border-[#2d62d7] text-[#2d62d7] bg-white rounded-t'
                  : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <Sliders className="size-3.5" />
              <span>EBYS &amp; Belge Parametre Ayarları</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 pr-3 text-[11px] font-medium text-[#5b6877]">
            <span className="inline-block size-2 rounded-full bg-emerald-500" />
            <span>31151 Sayılı Yönetmelik &amp; 5070 Sayılı e-İmza Motoru Aktif</span>
          </div>
        </div>

        {/* ===================== SEKME 1: CANLI BELGE ÖNİZLEME & AKIŞ GİRİŞİ (SPLIT VIEW) ===================== */}
        {activeTab === 'onizleme-akis' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#eef0f3]">
            {/* SOL KOLON: EVRAK GİRİŞ VE ROTA PARAMETRELERİ (5 Kolon) */}
            <div className="lg:col-span-5 p-3.5 space-y-3.5 bg-white text-[11px] overflow-y-auto max-h-[820px]">
              {/* Rota Şablonu Seçici */}
              <div className="rounded border border-[#e1e5ea] bg-[#f8f9fb] p-2.5">
                <label className="block text-[10.5px] font-bold text-[#172334]">
                  Uygulanan Rota Akışı (Paraf &amp; İmza Şablonu)
                </label>
                <select
                  value={selectedRotaId}
                  onChange={(e) => setSelectedRotaId(e.target.value)}
                  className="mt-1 h-7 w-full rounded border border-[#d9dee5] bg-white px-2 text-[11px] font-semibold text-[#172334] outline-none focus:border-[#2d62d7]"
                >
                  {rotalar.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.rotaAdi} ({r.adimlari.length} Adım — {r.rotaTuru})
                    </option>
                  ))}
                </select>

                {/* Rota Adımları Mini Çizelgesi */}
                <div className="mt-2 space-y-1">
                  {activeRota.adimlari.map((a, i) => (
                    <div
                      key={a.id || i}
                      className="flex items-center justify-between rounded bg-white px-2 py-1 text-[10px] border border-[#eef0f3]"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="flex size-4 items-center justify-center rounded bg-[#e4e6ea] font-mono text-[9px] font-bold text-[#4f5b69]">
                          {a.sira}
                        </span>
                        <span className="font-semibold text-[#172334] truncate">{a.adSoyad}</span>
                        <span className="text-[#7b8794] truncate hidden sm:inline">• {a.unvan}</span>
                      </div>
                      <span
                        className={`rounded px-1.5 py-0.2 font-semibold text-[9.5px] ${
                          a.imzaTuru.includes('İmza')
                            ? 'bg-[#dcefd9] text-[#2f6a2f]'
                            : 'bg-[#d3e0fb] text-[#2d62d7]'
                        }`}
                      >
                        {a.imzaTuru}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Üst Bilgiler Formu */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-medium text-[#5b6877]">
                      Standart Dosya Planı (SDP)
                    </label>
                    <select
                      value={dosyaPlani}
                      onChange={(e) => setDosyaPlani(e.target.value)}
                      className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] bg-white px-1.5 text-[10.5px] outline-none focus:border-[#2d62d7]"
                    >
                      {STANDART_DOSYA_PLANLARI.map((sdp) => (
                        <option key={sdp.kod} value={sdp.kod}>
                          {sdp.kod} - {sdp.baslik.slice(0, 24)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-medium text-[#5b6877]">
                      Evrak Tarihi
                    </label>
                    <input
                      type="text"
                      value={tarih}
                      onChange={(e) => setTarih(e.target.value)}
                      className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] outline-none focus:border-[#2d62d7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-medium text-[#5b6877]">
                    EBYS Evrak / Sayı Numarası
                  </label>
                  <input
                    type="text"
                    value={sayiNo}
                    onChange={(e) => setSayiNo(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 font-mono text-[11px] text-[#172334] outline-none focus:border-[#2d62d7]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-medium text-[#5b6877]">
                    Konu Başlığı
                  </label>
                  <input
                    type="text"
                    value={konu}
                    onChange={(e) => setKonu(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] font-semibold text-[#172334] outline-none focus:border-[#2d62d7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-medium text-[#5b6877]">
                      Muhatap Makam
                    </label>
                    <input
                      type="text"
                      value={muhatap}
                      onChange={(e) => setMuhatap(e.target.value)}
                      className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] outline-none focus:border-[#2d62d7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-medium text-[#5b6877]">
                      Muhatap Şehir / Yer
                    </label>
                    <input
                      type="text"
                      value={muhatapYer}
                      onChange={(e) => setMuhatapYer(e.target.value)}
                      className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] outline-none focus:border-[#2d62d7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-medium text-[#5b6877]">
                    İlgi (Varsa)
                  </label>
                  <input
                    type="text"
                    value={ilgi}
                    onChange={(e) => setIlgi(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] outline-none focus:border-[#2d62d7]"
                    placeholder="İlgi yazısı..."
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-medium text-[#5b6877]">
                    Belge Metni (Resmî Gerekçe / Talimat)
                  </label>
                  <textarea
                    rows={6}
                    value={metin}
                    onChange={(e) => setMetin(e.target.value)}
                    className="mt-0.5 w-full rounded border border-[#d9dee5] p-2 text-[11px] leading-relaxed text-[#172334] outline-none focus:border-[#2d62d7]"
                  />
                </div>

                {/* Gizlilik & İvedilik Seçimi */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5b6877]">Gizlilik</label>
                    <select
                      value={gizlilik}
                      onChange={(e) => setGizlilik(e.target.value)}
                      className="mt-0.5 h-6 w-full rounded border border-[#d9dee5] bg-white px-1.5 text-[10px] outline-none"
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="KİŞİYE ÖZEL">Kişiye Özel</option>
                      <option value="HİZMETE ÖZEL">Hizmete Özel</option>
                      <option value="GİZLİ">Gizli</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5b6877]">İvedilik</label>
                    <select
                      value={ivedilik}
                      onChange={(e) => setIvedilik(e.target.value)}
                      className="mt-0.5 h-6 w-full rounded border border-[#d9dee5] bg-white px-1.5 text-[10px] outline-none"
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="ACELE">Acele</option>
                      <option value="GÜNLÜDÜR">Günlüdür</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ KOLON: CANLI A4 EBYS RESMİ YAZI & PARAF ÖNİZLEMESİ (7 Kolon) */}
            <div className="lg:col-span-7 p-4 bg-[#6b7280]/10 flex flex-col items-center">
              {/* Önizleme Araç Çubuğu */}
              <div className="mb-3 flex w-full max-w-[210mm] items-center justify-between rounded border border-[#d9dee5] bg-white px-3 py-1.5 text-[11px] shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#172334]">Canlı A4 Sayfa Önizleme</span>
                  <span className="rounded bg-[#d3e0fb] px-1.5 py-0.2 text-[9.5px] font-bold text-[#2d62d7]">
                    31151 Standardı
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.max(60, prev - 10))}
                    className="flex size-6 items-center justify-center rounded border border-[#d9dee5] text-[#5b6877] hover:bg-[#f5f6f8]"
                    title="Küçült"
                  >
                    <ZoomOut className="size-3" />
                  </button>
                  <span className="font-mono text-[10px] text-[#5b6877] w-8 text-center">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
                    className="flex size-6 items-center justify-center rounded border border-[#d9dee5] text-[#5b6877] hover:bg-[#f5f6f8]"
                    title="Büyüt"
                  >
                    <ZoomIn className="size-3" />
                  </button>

                  <div className="mx-1 h-4 w-px bg-[#d9dee5]" />

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex h-6 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2 text-[10.5px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff]"
                    title="A4 Tam Ekran Modal"
                  >
                    <Maximize2 className="size-3" />
                    <span>Tam Ekran</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleKuyrugaGonder}
                    className="flex h-6 items-center gap-1 rounded bg-[#2d62d7] px-2 text-[10.5px] font-medium text-white hover:bg-[#2455bd]"
                    title="Yazdırma Merkezine Gönder"
                  >
                    <Printer className="size-3" />
                    <span>Yazdır</span>
                  </button>
                </div>
              </div>

              {/* Canlı A4 Kağıt Konteyneri */}
              <div
                className="transition-all duration-200 origin-top overflow-auto shadow-xl"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  marginBottom: `${(1 - zoomLevel / 100) * -200}px`,
                }}
              >
                <ResmiUstYaziTemplate data={previewDocumentData} />
              </div>
            </div>
          </div>
        )}

        {/* ===================== SEKME 2: ROTA TANIMLARI & ŞABLONLAR ===================== */}
        {activeTab === 'rota-tanimlari' && (
          <div className="p-4">
            <RotaYonetimiTable />
          </div>
        )}

        {/* ===================== SEKME 3: EBYS & BELGE PARAMETRE AYARLARI ===================== */}
        {activeTab === 'ayarlar' && (
          <div className="p-5 max-w-4xl space-y-4 text-[11px]">
            <div className="border-b border-[#eef0f3] pb-2">
              <h4 className="text-[13px] font-bold text-[#172334]">
                EBYS Antet, Karekod ve Rota Parametreleri
              </h4>
              <p className="text-[10.5px] text-[#7b8794]">
                Bu ayarlar resmî üst yazılarda, onay belgelerinde ve paraf rotası çıktılarında otomatik uygulanır.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Kurum Antet Bilgileri */}
              <div className="rounded border border-[#e1e5ea] p-3 space-y-2.5 bg-white">
                <h5 className="font-bold text-[#172334] flex items-center gap-1.5">
                  <Building className="size-3.5 text-[#2d62d7]" />
                  <span>Resmî Kurum &amp; Antet Başlığı</span>
                </h5>

                <div>
                  <label className="text-[#5b6877]">Kurum / Belediye Adı (T.C.)</label>
                  <input
                    type="text"
                    value={kurumAdi}
                    onChange={(e) => setKurumAdi(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 font-bold outline-none focus:border-[#2d62d7]"
                  />
                </div>

                <div>
                  <label className="text-[#5b6877]">Daire Başkanlığı / Ana Birim</label>
                  <input
                    type="text"
                    value={birimAdi}
                    onChange={(e) => setBirimAdi(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 outline-none focus:border-[#2d62d7]"
                  />
                </div>

                <div>
                  <label className="text-[#5b6877]">Şube Müdürlüğü / Alt Birim</label>
                  <input
                    type="text"
                    value={altBirimAdi}
                    onChange={(e) => setAltBirimAdi(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 outline-none focus:border-[#2d62d7]"
                  />
                </div>
              </div>

              {/* 2. Harcama Yetkilisi & Gerçekleştirme Görevlisi (Matbu İmzalar) */}
              <div className="rounded border border-[#e1e5ea] p-3 space-y-2.5 bg-white">
                <h5 className="font-bold text-[#172334] flex items-center gap-1.5">
                  <UserCheck className="size-3.5 text-[#2d62d7]" />
                  <span>Yasal İmzacılar (Tüm Belgeler)</span>
                </h5>

                <div>
                  <label className="text-[#5b6877]">Harcama Yetkilisi Adı Soyadı</label>
                  <input
                    type="text"
                    value={harcamaYetkilisiAdi}
                    onChange={(e) => setHarcamaYetkilisiAdi(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 font-bold text-[#172334] outline-none focus:border-[#2d62d7]"
                  />
                </div>

                <div>
                  <label className="text-[#5b6877]">Harcama Yetkilisi Unvanı</label>
                  <input
                    type="text"
                    value={harcamaYetkilisiUnvan}
                    onChange={(e) => setHarcamaYetkilisiUnvan(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 outline-none focus:border-[#2d62d7]"
                  />
                </div>

                <div>
                  <label className="text-[#5b6877]">Gerçekleştirme Görevlisi Adı Soyadı</label>
                  <input
                    type="text"
                    value={gerceklestirmeGorevlisiAdi}
                    onChange={(e) => setGerceklestirmeGorevlisiAdi(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 font-bold text-[#172334] outline-none focus:border-[#2d62d7]"
                  />
                </div>

                <div>
                  <label className="text-[#5b6877]">Gerçekleştirme Görevlisi Unvanı</label>
                  <input
                    type="text"
                    value={gerceklestirmeGorevlisiUnvan}
                    onChange={(e) => setGerceklestirmeGorevlisiUnvan(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 outline-none focus:border-[#2d62d7]"
                  />
                </div>
              </div>

              {/* 3. EBYS Güvenlik ve Kod Ayarları */}
              <div className="rounded border border-[#e1e5ea] p-3 space-y-2.5 bg-white">
                <h5 className="font-bold text-[#172334] flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-[#2d62d7]" />
                  <span>EBYS Doğrulama &amp; Mevzuat Standartları</span>
                </h5>

                <div>
                  <label className="text-[#5b6877]">Yazışma Yönetmeliği Formatı</label>
                  <select
                    value={ebysEvrakFormat}
                    onChange={(e) => setEbysEvrakFormat(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] bg-white px-2 outline-none focus:border-[#2d62d7]"
                  >
                    <option value="STANDART_31151">31151 Sayılı Resmî Yazışma Yönetmeliği (A4 Dikey)</option>
                    <option value="KAMU_IHALE_22D">4734 Sayılı Kanun 22/d Doğrudan Temin Formatı</option>
                    <option value="BELEDIYE_IC_YAZISMA">Belediye İçi Birimler Arası Müzekkere Formatı</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#5b6877]">Evrak Doğrulama Kodu / Barkod Formatı</label>
                  <input
                    type="text"
                    value={dogrulamaKodu}
                    onChange={(e) => setDogrulamaKodu(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] px-2 font-mono outline-none focus:border-[#2d62d7]"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 text-[#172334] font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={karekodGoster}
                      onChange={(e) => setKarekodGoster(e.target.checked)}
                      className="size-3.5 accent-[#2d62d7] rounded-sm"
                    />
                    <span>Belge Altında e-İmza Karekodu ve Doğrulama Bağlantısı Gösterilsin</span>
                  </label>
                </div>
              </div>

              {/* 4. Varsayılan Rota Seçimi & Entegrasyon Durumu */}
              <div className="rounded border border-[#e1e5ea] p-3 space-y-2.5 bg-white">
                <h5 className="font-bold text-[#172334] flex items-center gap-1.5">
                  <GitBranch className="size-3.5 text-[#2d62d7]" />
                  <span>Varsayılan Rota &amp; Sistem Entegrasyonu</span>
                </h5>

                <div>
                  <label className="text-[#5b6877]">Otomatik Bağlanacak Onay Rotası</label>
                  <select
                    value={selectedRotaId}
                    onChange={(e) => setSelectedRotaId(e.target.value)}
                    className="mt-0.5 h-7 w-full rounded border border-[#d9dee5] bg-white px-2 outline-none focus:border-[#2d62d7]"
                  >
                    {rotalar.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.rotaAdi} ({r.adimlari.length} Adım)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded bg-[#f0f4fd] p-2.5 border border-[#2d62d7]/20 text-[10.5px] text-[#1c3f87] space-y-1 mt-2">
                  <div className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="size-3.5 text-[#2d62d7]" />
                    <span>Canlı Şablon Entegrasyonu Aktif</span>
                  </div>
                  <p>
                    Buradaki antet ve imza yetkilileri Onay Belgesi, Piyasa Fiyat Araştırma Tutanağı, Yaklaşık Maliyet Cetveli, Doğrudan Temin Sözleşmesi, Muayene Kabul ve EBYS Resmî Yazısına eş zamanlı olarak yansıtılmaktadır.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAyarlar}
                className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-4 font-semibold text-white transition hover:bg-[#2455bd]"
              >
                <Save className="size-3" />
                <span>Ayarları Kalıcı Kaydet</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. EVRENSEL CANLI A4 ÖNİZLEME MODALI */}
      {isModalOpen && (
        <UniversalDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          jobs={[
            {
              id: 'ebys-preview-1',
              title: `EBYS Resmî Yazı - ${konu}`,
              docNo: 'DOC_RESMI_UST_YAZI',
              dosyaNo: 'EBYS-2026/01',
              dosyaAdi: konu,
              category: 'EBYS Resmî Yazı',
              format: 'A4 Dikey',
              pageCount: 1,
              addedAt: 'Canlı',
              status: 'Hazır',
            },
          ]}
        />
      )}
    </div>
  )
}
