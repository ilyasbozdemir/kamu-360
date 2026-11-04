'use client'

import React, { useState } from 'react'
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
} from 'lucide-react'

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

// Örnek Muhasebe İşlem Fişleri (MİF & Ödeme Emri Belgesi)
const INITIAL_MIF_DOCS = [
  {
    mifNo: 'MİF-2026/0142',
    oebNo: 'ÖEB-2026/89',
    tarih: '02.11.2026',
    harcamaBirimi: 'Satın Alma Şube Müdürlüğü',
    alacakliFirma: 'Mega Lojistik A.Ş. (VKN: 9918231201)',
    isKonusu: '10 Kalem Toner ve Bilişim Donanımı Temini Hakedişi',
    tutar: '184.500,00 ₺',
    kesintiler: 'KDV Tevkifatı & Damga Vergisi (14.200,00 ₺)',
    netOdenecek: '170.300,00 ₺',
    durum: 'Harcama Yetkilisi Onayında',
  },
  {
    mifNo: 'MİF-2026/0141',
    oebNo: 'ÖEB-2026/88',
    tarih: '30.10.2026',
    harcamaBirimi: 'Su ve Altyapı Dairesi',
    alacakliFirma: 'Anadolu Vana & Döküm San. Ltd. Şti.',
    isKonusu: 'Kuzey İsale Hattı Ø800 Vana Parçaları Temini',
    tutar: '420.000,00 ₺',
    kesintiler: 'Damga Vergisi (3.980,00 ₺)',
    netOdenecek: '416.020,00 ₺',
    durum: 'Muhasebeye Gönderildi / Ödendi',
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

export default function BkmybsMaliYonetimPage() {
  const [activeTab, setActiveTab] = useState<'butce' | 'mif' | 'tkys' | 'emanet'>('butce')
  const [searchQuery, setSearchQuery] = useState('')

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
                  BKMYBS & Mali Yönetim Portalı (5018 Kanun)
                </h1>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                  Bütçe & Muhasebat
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                Bütünleşik Kamu Mali Yönetim Bilişim Sistemi, analitik bütçe tertipleri, MİF/Ödeme Emri Belgesi ve TKYS Taşınır Mal Yönetimi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Hazine ve Maliye Bakanlığı Muhasebat GM ile E-Bütçe Servisi Sorgulanıyor...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
            >
              <Coins className="size-3.5" />
              E-Bütçe Senkronizasyonu
            </button>
            <button
              onClick={() => alert('Yeni Muhasebe İşlem Fişi (MİF) veya Ödeme Emri Hazırlanıyor...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition"
            >
              <Plus className="size-3.5" />
              MİF / ÖEB Düzenle
            </button>
          </div>
        </div>

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
            <div className="text-[11px] font-medium text-[#64748b]">Bloke Edilen (Taahhüt)</div>
            <div className="text-lg font-bold text-sky-700 mt-0.5">4.380.000 ₺</div>
            <div className="text-[10px] text-sky-600 font-medium mt-0.5">Sözleşmeye Bağlı</div>
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
            1. Analitik Bütçe Kodları & Ödenek Takibi
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
            2. MİF & Ödeme Emri Belgesi (ÖEB)
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
            3. TKYS Taşınır Mal Yönetimi & Zimmet
          </button>
          <button
            onClick={() => setActiveTab('emanet')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'emanet'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <ShieldCheck className="size-4" />
            4. Emanetler & Teminat Mektubu Masası
          </button>
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="p-6 space-y-6 flex-1">
        {/* SEKME 1: ANALİTİK BÜTÇE KODLARI */}
        {activeTab === 'butce' && (
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
                  onClick={() => alert('Bütçe İcmali Excel/PDF Olarak İndiriliyor...')}
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
                          onClick={() => alert(`${b.tertip} harcama dökümü ve harcama talimatları listeleniyor.`)}
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
        )}

        {/* SEKME 2: MİF & ÖDEME EMRİ BELGESİ */}
        {activeTab === 'mif' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0f172a]">Muhasebe İşlem Fişleri (MİF) ve Ödeme Emirleri (ÖEB)</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Harcama yetkilisi ve gerçekleştirme görevlisi ıslak/e-imzalı ödeme paketleri</p>
              </div>
              <button
                onClick={() => alert('Yeni MİF ve Ödeme Emri Taslağı Açılıyor...')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition"
              >
                + Yeni MİF Oluştur
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">MİF No / ÖEB No</th>
                    <th className="py-3 px-4">Düzenleme Tarihi</th>
                    <th className="py-3 px-4">Harcama Birimi</th>
                    <th className="py-3 px-4">Alacaklı Firma / Kişi</th>
                    <th className="py-3 px-4">İşin Konusu</th>
                    <th className="py-3 px-4">Brüt Tutar</th>
                    <th className="py-3 px-4 font-bold text-emerald-800">Net Ödenecek</th>
                    <th className="py-3 px-4">Onay Durumu</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {INITIAL_MIF_DOCS.map((m) => (
                    <tr key={m.mifNo} className="hover:bg-[#f8fafc] transition">
                      <td className="py-3 px-4 font-mono font-bold text-amber-900">
                        <div>{m.mifNo}</div>
                        <div className="text-[10px] text-[#64748b]">{m.oebNo}</div>
                      </td>
                      <td className="py-3 px-4 text-[#475569]">{m.tarih}</td>
                      <td className="py-3 px-4 text-[#334155]">{m.harcamaBirimi}</td>
                      <td className="py-3 px-4 font-semibold text-[#0f172a]">{m.alacakliFirma}</td>
                      <td className="py-3 px-4 text-[#475569] max-w-xs">{m.isKonusu}</td>
                      <td className="py-3 px-4 font-mono">{m.tutar}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{m.netOdenecek}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                          {m.durum}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`${m.mifNo} Resmî Ödeme Emri Belgesi (ÖEB) A4 Matbu çıktısı hazırlanıyor...`)}
                          className="px-2.5 py-1 text-xs text-amber-900 hover:bg-amber-50 border border-amber-200 rounded-md transition font-medium"
                        >
                          ÖEB Yazdır
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 3: TKYS TAŞINIR MAL YÖNETİMİ */}
        {activeTab === 'tkys' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0f172a]">TKYS Taşınır Mal Yönetmeliği Kayıtları & Zimmet Masası</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Taşınır İşlem Fişi (TİF), Dayanıklı Taşınırlar Defteri ve Kişisel Zimmet Senetleri</p>
              </div>
              <button
                onClick={() => alert('Yeni Taşınır Girişi (TİF) Açılıyor...')}
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
                          onClick={() => alert(`${item.kod} Taşınır Zimmet Fişi (Zimmet Senedi) yazdırılıyor...`)}
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

        {/* SEKME 4: EMANETLER & TEMİNATLAR */}
        {activeTab === 'emanet' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#0f172a]">Geçici & Kesin Teminat Mektupları Masası (4734 & 2886)</h2>
            <p className="text-xs text-[#64748b] mt-1">
              Banka teyit yazıları, nakit teminat yatırma dekontları, süre uzatımları ve ihale bitimi teminat iade onayları.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
