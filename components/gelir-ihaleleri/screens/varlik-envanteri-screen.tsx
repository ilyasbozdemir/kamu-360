'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  DollarSign,
  Eye,
  FileCheck2,
  FileSignature,
  FileText,
  Filter,
  Gavel,
  Package,
  Plus,
  Printer,
  Scale,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { ORNEK_VARLIKLAR, VarlikEnvanterKaydi } from '@/lib/gelir-ihaleleri-data'
import { PrimaryButton, OutlineButton } from '@/components/procurement/primitives'
import { VarliklarTutanagiModal } from '../varliklar-tutanagi-modal'

export function VarlıkEnvanteriScreen() {
  const [varliklar, setVarliklar] = useState<VarlikEnvanterKaydi[]>(ORNEK_VARLIKLAR)
  const [filter, setFilter] = useState<string>('Hepsi')
  const [search, setSearch] = useState('')
  const [showTutanakModal, setShowTutanakModal] = useState(false)

  // Etkileşimli Modallar İçin State
  const [seciliVarlik, setSeciliVarlik] = useState<VarlikEnvanterKaydi | null>(null)
  const [modalTuru, setModalTuru] = useState<'ihaleye_cikar' | 'dosyayi_gor' | 'kira_detay' | 'yeni_varlik' | null>(null)
  const [basariMesaji, setBasariMesaji] = useState<string | null>(null)

  // İhaleye Çıkar Form State
  const [ihaleUsulu, setIhaleUsulu] = useState('2886 Sayılı Kanun Madde 45 (Açık Artırma Usulü)')
  const [muhammenBedel, setMuhammenBedel] = useState<number>(0)
  const [ihaleTarihi, setIhaleTarihi] = useState('2026-04-15')
  const [ihaleSaati, setIhaleSaati] = useState('14:30')

  // Yeni Varlık Form State
  const [yeniKod, setYeniKod] = useState('')
  const [yeniAd, setYeniAd] = useState('')
  const [yeniKategori, setYeniKategori] = useState<VarlikEnvanterKaydi['kategori']>('Gayrimenkul / Ofis')
  const [yeniLokasyon, setYeniLokasyon] = useState('')
  const [yeniDeger, setYeniDeger] = useState<number>(500000)
  const [yeniBirim, setYeniBirim] = useState('Emlak ve İstimlak Dairesi')

  // Filtrelenmiş Varlıklar
  const filtered = varliklar.filter((v) => {
    const matchFilter = filter === 'Hepsi' || v.kategori.includes(filter)
    const matchSearch =
      v.ad.toLowerCase().includes(search.toLowerCase()) ||
      v.varlikKodu.toLowerCase().includes(search.toLowerCase()) ||
      v.lokasyon.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  // Dinamik İstatistik Hesaplamaları
  const toplamPortfoy = varliklar.reduce((s, v) => s + v.ekspertizDegeri, 0)
  const ihaledeToplam = varliklar
    .filter((v) => v.durum === 'İhalede')
    .reduce((s, v) => s + v.ekspertizDegeri, 0)
  const bostaToplam = varliklar
    .filter((v) => v.durum === 'Boşta / İhaleye Hazır')
    .reduce((s, v) => s + v.ekspertizDegeri, 0)
  const kiradaToplam = varliklar
    .filter((v) => v.durum === 'Kirada')
    .reduce((s, v) => s + v.ekspertizDegeri, 0)

  // Butona Tıklanınca İlgili Modalı Aç
  const handleActionClick = (v: VarlikEnvanterKaydi) => {
    setSeciliVarlik(v)
    if (v.durum === 'Boşta / İhaleye Hazır') {
      setMuhammenBedel(v.ekspertizDegeri)
      setModalTuru('ihaleye_cikar')
    } else if (v.durum === 'İhalede') {
      setModalTuru('dosyayi_gor')
    } else if (v.durum === 'Kirada') {
      setModalTuru('kira_detay')
    } else {
      setModalTuru('dosyayi_gor')
    }
  }

  // İhaleyi Başlat Onayı
  const handleIhaleyiBaslat = () => {
    if (!seciliVarlik) return
    const dosyaNo = `2886-2026/0${Math.floor(Math.random() * 8 + 2)}`

    // Varlığın durumunu anında 'İhalede' olarak güncelle
    setVarliklar((prev) =>
      prev.map((v) =>
        v.varlikKodu === seciliVarlik.varlikKodu
          ? { ...v, durum: 'İhalede' }
          : v
      )
    )

    setModalTuru(null)
    setBasariMesaji(
      `"${seciliVarlik.ad}" başarıyla 2886 sayılı kanun kapsamında ihaleye çıkarıldı! İhale Dosya No: ${dosyaNo}`
    )
    setTimeout(() => setBasariMesaji(null), 5000)
  }

  // Yeni Varlık Kaydet Onayı
  const handleYeniVarlikKaydet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!yeniKod.trim() || !yeniAd.trim()) {
      alert('Lütfen varlık kodu ve varlık tanımını doldurunuz.')
      return
    }

    const yeniKayit: VarlikEnvanterKaydi = {
      varlikKodu: yeniKod.trim().toUpperCase(),
      ad: yeniAd.trim(),
      kategori: yeniKategori,
      lokasyon: yeniLokasyon.trim() || 'Merkez Yerleşke',
      ekspertizDegeri: Number(yeniDeger) || 100000,
      durum: 'Boşta / İhaleye Hazır',
      tahsisliBirim: yeniBirim,
    }

    setVarliklar([yeniKayit, ...varliklar])
    setModalTuru(null)
    setYeniKod('')
    setYeniAd('')
    setYeniLokasyon('')
    setBasariMesaji(`"${yeniKayit.ad}" (${yeniKayit.varlikKodu}) başarıyla envantere eklendi!`)
    setTimeout(() => setBasariMesaji(null), 4000)
  }

  return (
    <div className="space-y-4">
      {/* Başarı Bildirimi */}
      {basariMesaji && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-[12px] font-semibold text-emerald-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
            <span>{basariMesaji}</span>
          </div>
          <Link
            href="/gelir-ihaleleri/teklif-artirma"
            className="flex items-center gap-1 font-bold text-emerald-800 underline hover:text-emerald-950"
          >
            <span>Canlı Pey Masasına Git</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* Varlık Portföyü Özeti (Dinamik Canlı İstatistikler) */}
      <div className="grid gap-3 sm:grid-cols-4 text-[11px]">
        <div className="rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-xs">
          <span className="text-[#64748b]">Toplam Varlık Portföy Değeri</span>
          <div className="mt-1 text-[18px] font-bold text-[#1e293b]">
            {toplamPortfoy.toLocaleString('tr-TR')} TL
          </div>
          <div className="text-[10px] text-[#8c9ba8]">{varliklar.length} Kayıtlı Kurumsal Varlık</div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-xs">
          <span className="text-[#64748b]">İhalede Olan Varlıklar</span>
          <div className="mt-1 text-[18px] font-bold text-[#2d62d7]">
            {ihaledeToplam.toLocaleString('tr-TR')} TL
          </div>
          <div className="text-[10px] text-[#2d62d7]">
            {varliklar.filter((v) => v.durum === 'İhalede').length} Aktif İhale Dosyası
          </div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-xs">
          <span className="text-[#64748b]">İhaleye Hazır (Boşta)</span>
          <div className="mt-1 text-[18px] font-bold text-[#16a34a]">
            {bostaToplam.toLocaleString('tr-TR')} TL
          </div>
          <div className="text-[10px] text-[#16a34a]">
            {varliklar.filter((v) => v.durum === 'Boşta / İhaleye Hazır').length} Satış / Kiralama Potansiyeli
          </div>
        </div>

        <div className="rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-xs">
          <span className="text-[#64748b]">Kirada Olan Varlıklar</span>
          <div className="mt-1 text-[18px] font-bold text-[#ea580c]">
            {kiradaToplam.toLocaleString('tr-TR')} TL
          </div>
          <div className="text-[10px] text-[#ea580c]">
            {varliklar.filter((v) => v.durum === 'Kirada').length} Düzenli Gelir Kaynağı
          </div>
        </div>
      </div>

      {/* Varlık Tablosu & Filtreleme */}
      <div className="rounded-lg border border-[#e1e5ea] bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-[#edf0f4] pb-3 mb-4 gap-3">
          <div>
            <h3 className="text-[14px] font-bold text-[#172334]">
              Kiralanabilir ve Satılabilir Kurumsal Varlık Envanteri
            </h3>
            <p className="text-[11px] text-[#64748b]">
              2886 Sayılı Kanun kapsamındaki taşınmazlar, araç filosu, hurda malzemeler ve işletme hakları.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <OutlineButton onClick={() => setShowTutanakModal(true)}>
              <FileText className="mr-1.5 inline size-3.5 text-purple-600" />
              <span>Kiralanabilir &amp; Satılabilir Varlıklar Tutanağı (A4)</span>
            </OutlineButton>
            <PrimaryButton
              onClick={() => {
                const nextNo = String(varliklar.length + 1).padStart(3, '0')
                setYeniKod(`VRK-GM-${nextNo}`)
                setYeniAd('')
                setModalTuru('yeni_varlik')
              }}
            >
              <Plus className="mr-1.5 inline size-3.5" />
              <span>Yeni Varlık Kaydet</span>
            </PrimaryButton>
          </div>
        </div>

        {/* Filtre ve Arama Barı */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-[11px]">
          <div className="flex flex-wrap gap-1.5">
            {['Hepsi', 'Gayrimenkul', 'Araç', 'Hurda', 'Tesis'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`rounded px-3 py-1 font-semibold transition ${
                  filter === cat
                    ? 'bg-[#2d62d7] text-white shadow-xs'
                    : 'border border-[#d1d5db] bg-white text-[#475569] hover:bg-[#f1f4f9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2 size-3.5 text-[#94a3b8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Varlık kodu, tanım veya lokasyon ara..."
              className="w-full rounded border border-[#d1d5db] py-1.5 pl-8 pr-3 text-[11px] focus:border-[#2d62d7] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Envanter Tablosu */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-[#edf0f4] text-[#8c9ba8]">
                <th className="pb-2.5 font-bold">Varlık Kodu</th>
                <th className="pb-2.5 font-bold">Varlık Tanımı</th>
                <th className="pb-2.5 font-bold">Kategori</th>
                <th className="pb-2.5 font-bold">Lokasyon</th>
                <th className="pb-2.5 font-bold">Ekspertiz Değeri</th>
                <th className="pb-2.5 font-bold">Durum</th>
                <th className="pb-2.5 text-right font-bold">İşlem &amp; Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f9]">
              {filtered.map((v) => (
                <tr key={v.varlikKodu} className="hover:bg-[#fafbfc] transition">
                  <td className="py-3 font-mono font-bold text-[#1e293b]">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-800 border border-gray-200">
                      {v.varlikKodu}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-[#1e293b]">
                    <div>{v.ad}</div>
                    <div className="text-[10px] text-gray-400 font-normal">{v.tahsisliBirim}</div>
                  </td>
                  <td className="py-3 text-[#64748b]">{v.kategori}</td>
                  <td className="py-3 text-[#475569]">{v.lokasyon}</td>
                  <td className="py-3 font-mono font-bold text-[#2d62d7]">
                    {v.ekspertizDegeri.toLocaleString('tr-TR')} TL
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        v.durum === 'İhalede'
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : v.durum === 'Boşta / İhaleye Hazır'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-amber-200 bg-amber-50 text-amber-800'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          v.durum === 'İhalede'
                            ? 'bg-blue-600'
                            : v.durum === 'Boşta / İhaleye Hazır'
                            ? 'bg-emerald-600'
                            : 'bg-amber-600'
                        }`}
                      />
                      <span>{v.durum}</span>
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Önizle Butonu */}
                      <button
                        type="button"
                        onClick={() => setShowTutanakModal(true)}
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        title="Varlık Tutanağını Gör"
                      >
                        <Eye className="size-3.5" />
                      </button>

                      {/* Ana Aksiyon Butonu (Canlı UI/UX) */}
                      {v.durum === 'Boşta / İhaleye Hazır' ? (
                        <button
                          type="button"
                          onClick={() => handleActionClick(v)}
                          className="inline-flex items-center gap-1 rounded-md bg-[#2d62d7] px-2.5 py-1 text-[10.5px] font-bold text-white shadow-2xs transition hover:bg-[#2455bd]"
                        >
                          <Gavel className="size-3" />
                          <span>İhaleye Çıkar</span>
                        </button>
                      ) : v.durum === 'İhalede' ? (
                        <button
                          type="button"
                          onClick={() => handleActionClick(v)}
                          className="inline-flex items-center gap-1 rounded-md border border-blue-300 bg-blue-50 px-2.5 py-1 text-[10.5px] font-bold text-[#2d62d7] transition hover:bg-blue-100"
                        >
                          <Scale className="size-3" />
                          <span>Dosyayı Gör</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleActionClick(v)}
                          className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-[10.5px] font-bold text-amber-800 transition hover:bg-amber-100"
                        >
                          <FileCheck2 className="size-3" />
                          <span>Kira Planı</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2886 Sayılı Kanun Kiralanabilir & Satılabilir Varlıklar Tutanağı A4 Modalı */}
      <VarliklarTutanagiModal
        isOpen={showTutanakModal}
        onClose={() => setShowTutanakModal(false)}
      />

      {/* 1. İHALEYE ÇIKARMA SİHİRBAZI MODALI (Canlı UI/UX) */}
      {modalTuru === 'ihaleye_cikar' && seciliVarlik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-[#2d62d7]">
                  <Gavel className="size-4" />
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900">
                    2886 İhale Başlatma &amp; Muhammen Bedel Belirleme
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Varlık: <strong>{seciliVarlik.varlikKodu}</strong> — {seciliVarlik.ad}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalTuru(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-[12px]">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  İhale Usulü (2886 Sayılı DİK)
                </label>
                <select
                  value={ihaleUsulu}
                  onChange={(e) => setIhaleUsulu(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 text-[12px] outline-none focus:border-[#2d62d7]"
                >
                  <option value="2886 Sayılı Kanun Madde 45 (Açık Artırma Usulü)">
                    2886 Madde 45 (Açık Artırma Usulü - Pey Masası)
                  </option>
                  <option value="2886 Sayılı Kanun Madde 35 (Kapalı Teklif Usulü)">
                    2886 Madde 35 (Kapalı Teklif Usulü - Zarf Değerlendirme)
                  </option>
                  <option value="2886 Sayılı Kanun Madde 51 (Pazarlık Usulü)">
                    2886 Madde 51 (Pazarlık Usulü)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Muhammen Bedel (TL)
                  </label>
                  <input
                    type="number"
                    value={muhammenBedel}
                    onChange={(e) => setMuhammenBedel(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 font-mono font-bold text-[#1b416c] outline-none focus:border-[#2d62d7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Geçici Teminat Tutarı (%3)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${(muhammenBedel * 0.03).toLocaleString('tr-TR')} TL`}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2 font-mono text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">İhale Tarihi</label>
                  <input
                    type="date"
                    value={ihaleTarihi}
                    onChange={(e) => setIhaleTarihi(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-[#2d62d7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">İhale Saati</label>
                  <input
                    type="time"
                    value={ihaleSaati}
                    onChange={(e) => setIhaleSaati(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-[#2d62d7]"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3 text-[11px] text-blue-900 leading-relaxed">
                <span className="font-bold">Mevzuat Bilgilendirmesi:</span> İhale onaylandığında bu varlık
                için otomatik <strong>2886 ihale dosyası</strong> oluşturulacak ve doğrudan canlı
                Açık Artırma Pey Masasına bağlanacaktır.
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-gray-200 pt-3">
              <button
                type="button"
                onClick={() => setModalTuru(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleIhaleyiBaslat}
                className="flex items-center gap-1.5 rounded-lg bg-[#2d62d7] px-4 py-2 text-[11.5px] font-bold text-white shadow-xs hover:bg-[#2455bd]"
              >
                <Gavel className="size-3.5" />
                <span>Onayla ve İhaleyi Başlat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. AKTİF İHALE DOSYASI GÖRÜNTÜLEME MODALI */}
      {modalTuru === 'dosyayi_gor' && seciliVarlik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-[#2d62d7]">
                  <Scale className="size-4" />
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900">Aktif İhale Dosyası</h3>
                  <p className="text-[11px] text-gray-500 font-mono">2886-2024/01 • İhalede</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalTuru(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-[12px]">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-1.5">
                <div>
                  <span className="text-gray-500">Varlık Adı:</span>{' '}
                  <strong className="text-gray-900">{seciliVarlik.ad}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Kategori &amp; Lokasyon:</span>{' '}
                  <span>{seciliVarlik.kategori} — {seciliVarlik.lokasyon}</span>
                </div>
                <div>
                  <span className="text-gray-500">Muhammen Bedel:</span>{' '}
                  <strong className="text-[#2d62d7] font-mono">
                    {seciliVarlik.ekspertizDegeri.toLocaleString('tr-TR')} TL
                  </strong>
                </div>
                <div>
                  <span className="text-gray-500">Aktif Durum:</span>{' '}
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    Açık Artırma &amp; Pey Sürecinde (3 İstekli)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-gray-200 pt-3">
              <Link
                href="/gelir-ihaleleri/teklif-artirma"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2d62d7] py-2 text-[12px] font-bold text-white shadow-xs hover:bg-[#2455bd]"
              >
                <Scale className="size-4" />
                <span>Canlı Açık Artırma Masasına Git ➔</span>
              </Link>
              <Link
                href="/gelir-ihaleleri/dosya-tanimi"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2 text-[12px] font-semibold text-gray-700 hover:bg-gray-50"
              >
                <FileSignature className="size-4 text-purple-600" />
                <span>İhale Dosyası ve Şartname Detayı</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. KİRA SÖZLEŞMESİ & TAHSİLAT MODALI */}
      {modalTuru === 'kira_detay' && seciliVarlik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                  <FileCheck2 className="size-4" />
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900">Taşınmaz Kira Sözleşmesi</h3>
                  <p className="text-[11px] text-gray-500 font-mono">SÖZ-2886-2024/001 • Kirada</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalTuru(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-[12px]">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-1.5">
                <div>
                  <span className="text-gray-500">Kiralanan Yer:</span>{' '}
                  <strong className="text-gray-900">{seciliVarlik.ad}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Kiracı Şirket:</span>{' '}
                  <strong>Turkuaz Gayrimenkul Yatırım A.Ş.</strong>
                </div>
                <div>
                  <span className="text-gray-500">Aylık Kira Bedeli:</span>{' '}
                  <strong className="text-amber-800 font-mono">85.000 TL / Ay</strong>
                </div>
                <div>
                  <span className="text-gray-500">Tahsilat Durumu:</span>{' '}
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Düzenli (Cari Ay Ödendi)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-3">
              <Link
                href="/gelir-ihaleleri/sozlesme-tahsilat"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-700 py-2 text-[12px] font-bold text-white shadow-xs hover:bg-amber-800"
              >
                <Coins className="size-4" />
                <span>Sözleşme &amp; Tahsilat Planına Git ➔</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. YENİ VARLIK KAYIT FORMU MODALI */}
      {modalTuru === 'yeni_varlik' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <form
            onSubmit={handleYeniVarlikKaydet}
            className="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Plus className="size-4" />
                </span>
                <h3 className="text-[14px] font-bold text-gray-900">
                  Yeni Kurumsal Varlık / Taşınmaz Kaydı
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalTuru(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-[12px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Varlık Kodu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={yeniKod}
                    onChange={(e) => setYeniKod(e.target.value)}
                    placeholder="Örn: VRK-GM-006"
                    className="w-full rounded-lg border border-gray-300 p-2 font-mono uppercase outline-none focus:border-[#2d62d7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kategori</label>
                  <select
                    value={yeniKategori}
                    onChange={(e) => setYeniKategori(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 bg-white p-2 outline-none focus:border-[#2d62d7]"
                  >
                    <option value="Gayrimenkul / Ofis">Gayrimenkul / Ofis</option>
                    <option value="Araç / Filo">Araç / Filo</option>
                    <option value="Hurda / Malzeme">Hurda / Malzeme</option>
                    <option value="Tesis / İşletme">Tesis / İşletme</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Varlık Tanımı / Cinsi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={yeniAd}
                  onChange={(e) => setYeniAd(e.target.value)}
                  placeholder="Örn: Çankaya Gaziosmanpaşa 280 m² İkiz Villa Ofis Alanı"
                  className="w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-[#2d62d7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Lokasyon &amp; Tapu / Ada-Parsel Bilgisi
                </label>
                <input
                  type="text"
                  value={yeniLokasyon}
                  onChange={(e) => setYeniLokasyon(e.target.value)}
                  placeholder="Örn: Çankaya 1420 Ada, 4 Parsel"
                  className="w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-[#2d62d7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Ekspertiz / Muhammen Değer (TL)
                  </label>
                  <input
                    type="number"
                    value={yeniDeger}
                    onChange={(e) => setYeniDeger(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 font-mono font-bold text-[#1b416c] outline-none focus:border-[#2d62d7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tahsisli Birim</label>
                  <input
                    type="text"
                    value={yeniBirim}
                    onChange={(e) => setYeniBirim(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-[#2d62d7]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 pt-3">
              <button
                type="button"
                onClick={() => setModalTuru(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#2d62d7] px-4 py-2 text-[11.5px] font-bold text-white shadow-xs hover:bg-[#2455bd]"
              >
                <Check className="size-3.5" />
                <span>Varlığı Kaydet</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
