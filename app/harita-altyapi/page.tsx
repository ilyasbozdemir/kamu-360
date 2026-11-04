'use client'

import React, { useState } from 'react'
import {
  MapPin,
  Layers,
  Search,
  Droplets,
  Compass,
  Building,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  Printer,
  Maximize2,
  Eye,
  FileText,
  Activity,
  ArrowUpRight,
  TrendingDown,
  Gauge,
  SlidersHorizontal,
} from 'lucide-react'

// Örnek Parsel Verileri (TKGM / MEGSİS Standardı)
const INITIAL_PARSELS = [
  {
    id: 'PRSL-001',
    ada: '1420',
    parsel: '4',
    mahalle: 'Gaziosmanpaşa Mah.',
    ilce: 'Çankaya / ANKARA',
    alan: '3.450 m²',
    nitelik: 'Arsa (Belediye Hizmet Alanı)',
    mulkiyet: 'Belediye Mülkiyeti',
    durum: 'Aktif Tahsis',
    kamulastirma: 'Tamamlandı',
    imarDurumu: 'Emsal: 1.80 - Hmax: Serbest',
  },
  {
    id: 'PRSL-002',
    ada: '854',
    parsel: '12',
    mahalle: 'Batısitesi Mah.',
    ilce: 'Yenimahalle / ANKARA',
    alan: '8.200 m²',
    nitelik: 'Tarımsal Arazi & Su Kuyusu',
    mulkiyet: 'Kamuya Terk / Hazine',
    durum: 'Kiralama Sürecinde',
    kamulastirma: 'Kısmi Bedel Davası',
    imarDurumu: 'Tarımsal Koruma Kuşağı',
  },
  {
    id: 'PRSL-003',
    ada: '2311',
    parsel: '9',
    mahalle: 'Ostim OSB',
    ilce: 'Yenimahalle / ANKARA',
    alan: '1.850 m²',
    nitelik: 'Depolama & Altyapı Tesis Alanı',
    mulkiyet: 'Belediye Mülkiyeti',
    durum: 'Kirada (3 Yıllık)',
    kamulastirma: 'Tamamlandı',
    imarDurumu: 'Sanayi Depolama',
  },
  {
    id: 'PRSL-004',
    ada: '3105',
    parsel: '1',
    mahalle: 'Bahçelievler Mah.',
    ilce: 'Çankaya / ANKARA',
    alan: '920 m²',
    nitelik: 'Park ve Rekreasyon',
    mulkiyet: 'Kamu Ortak Mülkiyeti',
    durum: 'Sosyal Tesis',
    kamulastirma: 'Tamamlandı',
    imarDurumu: 'Yeşil Alan',
  },
]

// Örnek Su Şebekesi & Abone Verileri
const INITIAL_WATER_ZONES = [
  {
    id: 'WZ-01',
    hatAdi: 'Kuzey Ana İsale Hattı (Ø800 Çelik)',
    bolge: 'Batı Bölgesi - Çamlıdere Çıkışı',
    debi: '1.450 m³/saat',
    basinc: '6.2 Bar (Nominal)',
    kayipKacak: '%14.2',
    durum: 'Normal',
    sonBakim: '12.10.2026',
  },
  {
    id: 'WZ-02',
    hatAdi: 'Çankaya Yüksek Basınç Dağıtım Hattı',
    bolge: 'Merkez Güneydoğu Şebekesi',
    debi: '820 m³/saat',
    basinc: '4.8 Bar',
    kayipKacak: '%11.8',
    durum: 'Normal',
    sonBakim: '02.11.2026',
  },
  {
    id: 'WZ-03',
    hatAdi: 'Ostim Sanayi Besleme Hattı (Ø500 Duktil)',
    bolge: 'Yenimahalle Sanayi Kuşağı',
    debi: '610 m³/saat',
    basinc: '3.1 Bar (Düşük)',
    kayipKacak: '%22.4',
    durum: 'Uyarı - Basınç Düşüşü',
    sonBakim: '28.10.2026',
  },
]

// Örnek Su Sayaç ve Abone Listesi
const INITIAL_SUBSCRIBERS = [
  {
    aboneNo: 'SU-410092',
    adSoyad: 'İlker Şahin / Şahinler Ltd. Şti.',
    adres: 'Ostim Sanayi Sitesi 1234. Sokak No: 18',
    sayacSeri: 'BAY-2024-99812',
    tip: 'Ticari / Sanayi',
    sonEndeks: '14.820 m³',
    aylikTuketim: '340 m³',
    durum: 'Aktif',
  },
  {
    aboneNo: 'SU-320911',
    adSoyad: 'Meltem Karaca',
    adres: 'Gaziosmanpaşa Mah. Kuleli Cad. 45/6',
    sayacSeri: 'ELSTER-8841',
    tip: 'Mesken',
    sonEndeks: '1.240 m³',
    aylikTuketim: '18 m³',
    durum: 'Aktif',
  },
  {
    aboneNo: 'SU-772104',
    adSoyad: 'Ankara Büyükşehir Fen İşleri Şantiyesi',
    adres: 'Batısitesi Altyapı Tesisleri İçi',
    sayacSeri: 'AKM-DIG-002',
    tip: 'Kurumsal / Belediye',
    sonEndeks: '29.410 m³',
    aylikTuketim: '1.120 m³',
    durum: 'Aktif (Muaf)',
  },
]

export default function HaritaAltyapiPage() {
  const [activeTab, setActiveTab] = useState<'harita' | 'arazi' | 'su' | 'abone'>('harita')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLayer, setSelectedLayer] = useState<'uydu' | 'imar' | 'kombine'>('kombine')
  const [filterDurum, setFilterDurum] = useState('all')

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* ÜST BİLGİ VE MODÜL BAŞLIĞI */}
      <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl shadow-md">
              <Compass className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#0f172a]">
                  CBS, Arazi & Su Altyapı Yönetimi
                </h1>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  Harita & Altyapı 360
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                Ada/Parsel kadastro sorgusu, kamu arazileri mülkiyet takibi, içme suyu şebekesi ve sayaç izleme portalı.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('TKGM / MEGSİS Kadastro Servisi Senkronize Ediliyor...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
            >
              <Compass className="size-3.5" />
              TKGM / MEGSİS Çek
            </button>
            <button
              onClick={() => alert('Yeni Parsel veya Su Vanası Kaydı Açılıyor...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
            >
              <Plus className="size-3.5" />
              Yeni Kayıt Ekle
            </button>
          </div>
        </div>

        {/* METRİK KARTLARI */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Kayıtlı Parsel</div>
            <div className="text-lg font-bold text-[#0f172a] mt-0.5">1.428 Adet</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5 flex items-center gap-0.5">
              <ArrowUpRight className="size-3" /> %100 Kadastral
            </div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Kamu Arazisi (m²)</div>
            <div className="text-lg font-bold text-[#0f172a] mt-0.5">4.250.000 m²</div>
            <div className="text-[10px] text-[#64748b] mt-0.5">Belediye & Hazine</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Su Şebeke Hattı</div>
            <div className="text-lg font-bold text-sky-700 mt-0.5">1.840 km</div>
            <div className="text-[10px] text-sky-600 font-medium mt-0.5">Ana & Tali Borular</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Aktif Su Abonesi</div>
            <div className="text-lg font-bold text-[#0f172a] mt-0.5">248.650</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Akıllı Sayaç</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Günlük Tüketim</div>
            <div className="text-lg font-bold text-[#0f172a] mt-0.5">142.000 m³</div>
            <div className="text-[10px] text-[#64748b] mt-0.5">Şebeke Çıkışı</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Kayıp-Kaçak Oranı</div>
            <div className="text-lg font-bold text-amber-600 mt-0.5">%15.4</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5 flex items-center gap-0.5">
              <TrendingDown className="size-3" /> -%2.1 İyileşme
            </div>
          </div>
        </div>

        {/* SEKME MENÜSÜ */}
        <div className="flex items-center gap-2 mt-4 border-b border-[#e2e8f0]">
          <button
            onClick={() => setActiveTab('harita')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'harita'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Compass className="size-4" />
            1. CBS & Canlı Harita Katmanı
          </button>
          <button
            onClick={() => setActiveTab('arazi')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'arazi'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Building className="size-4" />
            2. Arazi & Parsel Mülkiyet Takibi
          </button>
          <button
            onClick={() => setActiveTab('su')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'su'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Droplets className="size-4" />
            3. Su Şebekesi & İsale Hatları
          </button>
          <button
            onClick={() => setActiveTab('abone')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'abone'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Gauge className="size-4" />
            4. Sayaç & Abone Yönetimi
          </button>
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="p-6 space-y-6 flex-1">
        {/* SEKME 1: CANLI CBS HARİTA MASASI */}
        {activeTab === 'harita' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden flex flex-col">
            {/* Harita Kontrol Araç Çubuğu */}
            <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300">Katman Seçimi:</span>
                <div className="inline-flex rounded-lg bg-slate-800 p-0.5 text-xs">
                  <button
                    onClick={() => setSelectedLayer('uydu')}
                    className={`px-3 py-1 rounded-md font-medium transition ${
                      selectedLayer === 'uydu' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Uydu / Ortofoto
                  </button>
                  <button
                    onClick={() => setSelectedLayer('imar')}
                    className={`px-3 py-1 rounded-md font-medium transition ${
                      selectedLayer === 'imar' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    İmar & Kadastro
                  </button>
                  <button
                    onClick={() => setSelectedLayer('kombine')}
                    className={`px-3 py-1 rounded-md font-medium transition ${
                      selectedLayer === 'kombine' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Kombine (Parsel + Su Şebekesi)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/60 rounded-md">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  GIS Katmanı Aktif
                </span>
                <button
                  onClick={() => alert('Tam Ekran Harita Görünümüne Geçildi')}
                  className="p-1.5 text-slate-300 hover:text-white bg-slate-800 rounded-md transition"
                  title="Tam Ekran"
                >
                  <Maximize2 className="size-4" />
                </button>
              </div>
            </div>

            {/* İnteraktif Vektörel Harita Temsili */}
            <div className="relative h-[480px] bg-[#0c1322] overflow-hidden flex items-center justify-center">
              {/* Izgara ve Topoğrafik Çizgiler */}
              <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="gisGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1e293b" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gisGrid)" />
                {/* Ana Su İsale Hattı (Mavi Parlayan Hat) */}
                <path
                  d="M 50 380 Q 240 290 420 340 T 800 180 T 1200 120"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="5"
                  strokeDasharray="8 4"
                />
                {/* Tali Boru Hattı */}
                <path
                  d="M 420 340 L 490 120 L 750 90"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
                {/* Parsel Sınır Poligonları */}
                <polygon points="180,80 320,60 360,190 210,210" fill="#047857" fillOpacity="0.25" stroke="#10b981" strokeWidth="2" />
                <polygon points="560,220 720,200 750,340 600,360" fill="#0369a1" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="2" />
                <polygon points="850,240 1020,210 1050,380 880,390" fill="#b45309" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
              </svg>

              {/* Parsel ve Nokta Etiketleri (Overlay UI) */}
              <div className="absolute top-16 left-36 bg-emerald-950/90 border border-emerald-500/50 text-white rounded-lg p-2.5 text-xs backdrop-blur-md shadow-xl max-w-xs">
                <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <Building className="size-3.5" />
                  Ada: 1420 / Parsel: 4 (3.450 m²)
                </div>
                <div className="text-[11px] text-slate-300 mt-1">Belediye Hizmet Alanı • Çankaya</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Kamulaştırma Tamamlandı</div>
              </div>

              <div className="absolute bottom-28 right-48 bg-sky-950/90 border border-sky-500/50 text-white rounded-lg p-2.5 text-xs backdrop-blur-md shadow-xl max-w-xs">
                <div className="font-bold flex items-center gap-1.5 text-sky-300">
                  <Droplets className="size-3.5" />
                  Kuzey Ana İsale Hattı (Ø800)
                </div>
                <div className="text-[11px] text-slate-300 mt-1">Debi: 1.450 m³/h • Basınç: 6.2 Bar</div>
                <div className="text-[10px] text-sky-400 mt-0.5">SCADA Sensör: Çevrimiçi</div>
              </div>

              {/* Alt Gösterge Bilgi Çubuğu */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="size-3 rounded-xs bg-emerald-500/40 border border-emerald-400"></span>
                    Belediye Taşınmazı
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-3 rounded-xs bg-sky-500/40 border border-sky-400"></span>
                    Su İsale Hattı
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-3 rounded-xs bg-amber-500/40 border border-amber-400"></span>
                    Kamulaştırma Bekleyen
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Koordinat Referansı: <strong>ITRF96 / TM30 • ED50 Uyumlu</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEKME 2: ARAZİ & PARSEL MÜLKİYET TABLOSU */}
        {activeTab === 'arazi' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="size-4 text-[#94a3b8] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ada, parsel, mahalle veya mülkiyet türü ara..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Parsel İcmal Listesi Excel/PDF Olarak İndiriliyor...')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg transition"
                >
                  <Download className="size-3.5" />
                  Dışa Aktar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Parsel ID</th>
                    <th className="py-3 px-4">Ada / Parsel</th>
                    <th className="py-3 px-4">Konum & Mahalle</th>
                    <th className="py-3 px-4">Yüzölçümü</th>
                    <th className="py-3 px-4">Nitelik & Fonksiyon</th>
                    <th className="py-3 px-4">Mülkiyet Durumu</th>
                    <th className="py-3 px-4">Kamulaştırma</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {INITIAL_PARSELS.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f8fafc] transition">
                      <td className="py-3 px-4 font-mono font-medium text-[#0f172a]">{p.id}</td>
                      <td className="py-3 px-4 font-bold text-emerald-800">
                        {p.ada} / {p.parsel}
                      </td>
                      <td className="py-3 px-4 text-[#334155]">
                        <div>{p.mahalle}</div>
                        <div className="text-[10px] text-[#94a3b8]">{p.ilce}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#0f172a]">{p.alan}</td>
                      <td className="py-3 px-4 text-[#475569]">{p.nitelik}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                          {p.mulkiyet}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-slate-700">{p.kamulastirma}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`${p.ada}/${p.parsel} tapu ve imar çapı görüntüleniyor.`)}
                          className="px-2.5 py-1 text-xs text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-md transition font-medium"
                        >
                          Detay & Çap
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 3: SU VE KANALİZASYON ŞEBEKESİ */}
        {activeTab === 'su' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INITIAL_WATER_ZONES.map((zone) => (
                <div key={zone.id} className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                      {zone.id}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      {zone.durum}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0f172a] mt-2">{zone.hatAdi}</h3>
                  <p className="text-xs text-[#64748b] mt-0.5">{zone.bolge}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#f1f5f9] text-xs">
                    <div>
                      <div className="text-[10px] text-[#94a3b8]">Anlık Debi</div>
                      <div className="font-bold text-[#0f172a] mt-0.5">{zone.debi}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#94a3b8]">Şebeke Basıncı</div>
                      <div className="font-bold text-sky-700 mt-0.5">{zone.basinc}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#94a3b8]">Kayıp-Kaçak</div>
                      <div className="font-bold text-amber-600 mt-0.5">{zone.kayipKacak}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#94a3b8]">Son Saha Bakımı</div>
                      <div className="text-[#475569] mt-0.5">{zone.sonBakim}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => alert(`${zone.hatAdi} SCADA vanası ve telemetri telemetrik değerleri açılıyor.`)}
                      className="w-full py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition"
                    >
                      SCADA Telemetri
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEKME 4: SAYAÇ & ABONE YÖNETİMİ */}
        {activeTab === 'abone' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0f172a]">Su Sayaç & Abone Dökümü</h2>
              <button
                onClick={() => alert('Yeni Abone & Sayaç Montaj Kaydı Açılıyor...')}
                className="px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition"
              >
                + Yeni Abone Kaydı
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Abone No</th>
                    <th className="py-3 px-4">Abone / Kurum Adı</th>
                    <th className="py-3 px-4">Sayaç Seri No</th>
                    <th className="py-3 px-4">Abone Türü</th>
                    <th className="py-3 px-4">Son Endeks (m³)</th>
                    <th className="py-3 px-4">Aylık Tüketim</th>
                    <th className="py-3 px-4">Durum</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {INITIAL_SUBSCRIBERS.map((s) => (
                    <tr key={s.aboneNo} className="hover:bg-[#f8fafc] transition">
                      <td className="py-3 px-4 font-mono font-bold text-sky-800">{s.aboneNo}</td>
                      <td className="py-3 px-4 font-medium text-[#0f172a]">
                        <div>{s.adSoyad}</div>
                        <div className="text-[10px] text-[#94a3b8]">{s.adres}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#475569]">{s.sayacSeri}</td>
                      <td className="py-3 px-4 text-[#334155]">{s.tip}</td>
                      <td className="py-3 px-4 font-semibold text-[#0f172a]">{s.sonEndeks}</td>
                      <td className="py-3 px-4 font-bold text-sky-700">{s.aylikTuketim}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                          {s.durum}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`${s.aboneNo} fatura ve sayaç okuma geçmişi açılıyor.`)}
                          className="px-2.5 py-1 text-xs text-sky-700 hover:bg-sky-50 border border-sky-200 rounded-md transition font-medium"
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
        )}
      </div>
    </div>
  )
}
