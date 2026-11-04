'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Users,
  UserCheck,
  Calendar,
  FileText,
  Clock,
  Briefcase,
  Search,
  Plus,
  Download,
  Printer,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  FileSignature,
} from 'lucide-react'

// Örnek Personel Listesi
const INITIAL_STAFF = [
  {
    id: 'PER-1042',
    adSoyad: 'Ahmet Yılmaz',
    tcKimlik: '189******12',
    statu: '657 Devlet Memuru',
    birim: 'Destek Hizmetleri Dairesi Başkanlığı',
    unvan: 'Daire Başkanı',
    gorev: 'Harcama Yetkilisi',
    girisTarihi: '15.03.2012',
    kalanIzin: '24 Gün',
    durum: 'Görevde',
  },
  {
    id: 'PER-2091',
    adSoyad: 'Mehmet Demir',
    tcKimlik: '342******80',
    statu: '657 Devlet Memuru',
    birim: 'Satın Alma Şube Müdürlüğü',
    unvan: 'Şube Müdürü',
    gorev: 'Gerçekleştirme Görevlisi',
    girisTarihi: '01.09.2016',
    kalanIzin: '18 Gün',
    durum: 'Görevde',
  },
  {
    id: 'PER-3814',
    adSoyad: 'Selin Yılmaz',
    tcKimlik: '271******34',
    statu: '4/B Sözleşmeli Personel',
    birim: 'Satın Alma Şube Müdürlüğü',
    unvan: 'Satın Alma & İhale Uzmanı',
    gorev: 'Piyasa Araştırma Görevlisi',
    girisTarihi: '12.02.2020',
    kalanIzin: '12 Gün',
    durum: 'Görevde',
  },
  {
    id: 'PER-4402',
    adSoyad: 'Mustafa Kaya',
    tcKimlik: '519******92',
    statu: '4857 Sürekli İşçi',
    birim: 'Fen İşleri Dairesi / Su Altyapı',
    unvan: 'Saha Bakım & Şebeke Ustası',
    gorev: 'Vana ve Boru Bakım',
    girisTarihi: '10.05.2018',
    kalanIzin: '14 Gün',
    durum: 'Yıllık İzinde (Dönüş: 08.11.2026)',
  },
]

// Örnek 6245 Sayılı Harcırah ve Görevlendirme Verileri
const INITIAL_TRAVEL_ORDERS = [
  {
    onayNo: 'GRV-2026/041',
    personel: 'Selin Yılmaz',
    gorevYeri: 'Ankara -> İzmir (KİK Eğitimi)',
    tarihAraligi: '10.11.2026 - 13.11.2026 (4 Gün)',
    yevmiyeTutari: '3.400,00 ₺',
    ulasimTutari: '4.800,00 ₺ (Uçak/Hızlı Tren)',
    toplamHarcirah: '8.200,00 ₺',
    durum: 'Onaylandı (Harcama Yetkilisi)',
  },
  {
    onayNo: 'GRV-2026/039',
    personel: 'Mehmet Demir & Abdulkadir İlci',
    gorevYeri: 'İlçe Şantiyeleri Yerinde Muayene',
    tarihAraligi: '03.11.2026 - 04.11.2026 (2 Gün)',
    yevmiyeTutari: '1.700,00 ₺',
    ulasimTutari: 'Kurum Aracı',
    toplamHarcirah: '1.700,00 ₺',
    durum: 'Ödendi (MİF No: 2026/89)',
  },
]

function PersonelTakibiContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'ozluk' | 'puantaj' | 'harcirah' | 'terfi'>('ozluk')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'ozluk' || tab === 'puantaj' || tab === 'harcirah' || tab === 'terfi') {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* ÜST BAŞLIK */}
      <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-xl shadow-md">
              <Users className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#0f172a]">
                  İnsan Kaynakları & Personel Yönetimi (İK 360)
                </h1>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                  657 & 4857 Uyumlu
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                Memur, sözleşmeli ve işçi özlük dosyaları, puantaj/izin yönetimi, 6245 Sayılı Kanun harcırah ve geçici görev onayları.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Yeni Personel Özlük Kartı Oluşturma Formu Açılıyor...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              <Plus className="size-3.5" />
              Yeni Personel Ekle
            </button>
          </div>
        </div>

        {/* METRİKLER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Toplam Personel</div>
            <div className="text-lg font-bold text-[#0f172a] mt-0.5">384 Kişi</div>
            <div className="text-[10px] text-indigo-600 font-medium mt-0.5">142 Memur • 242 İşçi</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Bugün Görevde Olan</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">368 Kişi</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">%95.8 Fiilî Mesai</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">İzinde / Raporda</div>
            <div className="text-lg font-bold text-amber-600 mt-0.5">16 Kişi</div>
            <div className="text-[10px] text-[#64748b] mt-0.5">11 Yıllık İzin • 5 Raporlu</div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
            <div className="text-[11px] font-medium text-[#64748b]">Geçici Görevli (6245)</div>
            <div className="text-lg font-bold text-sky-700 mt-0.5">5 Kişi</div>
            <div className="text-[10px] text-sky-600 font-medium mt-0.5">Saha ve Eğitim Görevi</div>
          </div>
        </div>

        {/* SEKME MENÜSÜ */}
        <div className="flex items-center gap-2 mt-4 border-b border-[#e2e8f0]">
          <button
            onClick={() => setActiveTab('ozluk')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'ozluk'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Users className="size-4" />
            1. Personel Özlük & Sicil Listesi
          </button>
          <button
            onClick={() => setActiveTab('puantaj')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'puantaj'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Clock className="size-4" />
            2. Puantaj & İzin Masası
          </button>
          <button
            onClick={() => setActiveTab('harcirah')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'harcirah'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Briefcase className="size-4" />
            3. Görevlendirme & Harcırah (6245)
          </button>
          <button
            onClick={() => setActiveTab('terfi')}
            className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === 'terfi'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Award className="size-4" />
            4. Kademe, Terfi & Disiplin
          </button>
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="p-6 space-y-6 flex-1">
        {/* SEKME 1: ÖZLÜK LİSTESİ */}
        {activeTab === 'ozluk' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="size-4 text-[#94a3b8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Personel adı, TC kimlik, sicil no veya birim ara..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Personel Özlük Listesi Dışa Aktarılıyor...')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg transition"
                >
                  <Download className="size-3.5" />
                  Özlük İcmali
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Sicil No</th>
                    <th className="py-3 px-4">Ad Soyad & TC</th>
                    <th className="py-3 px-4">İstihdam Statüsü</th>
                    <th className="py-3 px-4">Birim & Daire</th>
                    <th className="py-3 px-4">Unvan & Resmî Görev</th>
                    <th className="py-3 px-4">Kalan İzin</th>
                    <th className="py-3 px-4">Fiilî Durum</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {INITIAL_STAFF.map((staff) => (
                    <tr key={staff.id} className="hover:bg-[#f8fafc] transition">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-900">{staff.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0f172a]">{staff.adSoyad}</div>
                        <div className="text-[10px] text-[#94a3b8] font-mono">{staff.tcKimlik}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                          {staff.statu}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#334155]">{staff.birim}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#0f172a]">{staff.unvan}</div>
                        <div className="text-[10px] text-indigo-600">{staff.gorev}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#0f172a]">{staff.kalanIzin}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                            staff.durum.includes('İzinde')
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {staff.durum}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`${staff.adSoyad} özlük dosyası ve hizmet dökümü açılıyor.`)}
                          className="px-2.5 py-1 text-xs text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-md transition font-medium"
                        >
                          Özlük Kartı
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 2: PUANTAJ & İZİN */}
        {activeTab === 'puantaj' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#0f172a]">Aylık Personel Puantaj Cetveli (Kasım 2026)</h2>
              <button
                onClick={() => alert('Puantaj onaylanarak Muhasebeye (MİF/Bordro) aktarılıyor...')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
              >
                Puantajı Onayla & Kapat
              </button>
            </div>
            <p className="text-xs text-[#64748b]">
              Turnike entegrasyonu, parmak izi/kartlı geçiş kayıtları ve yıllık/mazeret izni onayları bu masadan işlenir.
            </p>
          </div>
        )}

        {/* SEKME 3: HARCIRAH & GÖREVLENDİRME */}
        {activeTab === 'harcirah' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0f172a]">6245 Sayılı Harcırah Kanunu Geçici Görev Dosyaları</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Yevmiye, konaklama, yol gideri hesaplamaları ve otomatik Harcırah Beyannamesi</p>
              </div>
              <button
                onClick={() => alert('Yeni 6245 Sayılı Geçici Görev Onayı Hazırlanıyor...')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
              >
                + Yeni Görev Onayı
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Onay No</th>
                    <th className="py-3 px-4">Görevlendirilen Personel</th>
                    <th className="py-3 px-4">Görev Yeri & Amacı</th>
                    <th className="py-3 px-4">Tarih Aralığı</th>
                    <th className="py-3 px-4">Hesaplanan Yevmiye</th>
                    <th className="py-3 px-4">Ulaşım Gideri</th>
                    <th className="py-3 px-4">Toplam Harcırah</th>
                    <th className="py-3 px-4">Onay Durumu</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {INITIAL_TRAVEL_ORDERS.map((t) => (
                    <tr key={t.onayNo} className="hover:bg-[#f8fafc] transition">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-900">{t.onayNo}</td>
                      <td className="py-3 px-4 font-semibold text-[#0f172a]">{t.personel}</td>
                      <td className="py-3 px-4 text-[#334155]">{t.gorevYeri}</td>
                      <td className="py-3 px-4 text-[#475569]">{t.tarihAraligi}</td>
                      <td className="py-3 px-4 font-mono">{t.yevmiyeTutari}</td>
                      <td className="py-3 px-4 font-mono">{t.ulasimTutari}</td>
                      <td className="py-3 px-4 font-bold text-indigo-800 font-mono">{t.toplamHarcirah}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                          {t.durum}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`${t.onayNo} Harcırah Beyannamesi Matbu Çıktısı Hazırlanıyor...`)}
                          className="px-2.5 py-1 text-xs text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-md transition font-medium"
                        >
                          Beyanname Yazdır
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 4: KADEME & TERFİ */}
        {activeTab === 'terfi' && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#0f172a]">657 Memur Kademe & Derece İlerleme Takip Masası</h2>
            <p className="text-xs text-[#64748b] mt-1">
              Yıllık kıdem, hizmet puanı, yeşil pasaport hak edişi ve 8 yıllık olumlu sicil kademe ilerlemeleri.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PersonelTakibiPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-500">Personel & İK Modülü Yükleniyor...</div>}>
      <PersonelTakibiContent />
    </Suspense>
  )
}

