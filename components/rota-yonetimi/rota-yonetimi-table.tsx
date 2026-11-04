'use client'

import React, { useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  FileSignature,
  Filter,
  GripVertical,
  HelpCircle,
  Pause,
  PenTool,
  Plus,
  Search,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react'
import {
  HAZIR_PERSONELLER,
  ImzaTuru,
  PersonelKaydi,
  RotaKullaniciAdimi,
  RotaTanimi,
  RotaTuru,
  VARSAYILAN_ROTALAR,
} from '@/lib/rota-yonetimi-data'

export function RotaYonetimiTable() {
  const [rotalar, setRotalar] = useState<RotaTanimi[]>(VARSAYILAN_ROTALAR)
  const [showPasif, setShowPasif] = useState(false)
  const [filterOpen, setFilterOpen] = useState(true)
  const [selectedRota, setSelectedRota] = useState<RotaTanimi | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal Form State
  const [formRotaAdi, setFormRotaAdi] = useState('')
  const [formRotaTuru, setFormRotaTuru] = useState<RotaTuru>('Giden')
  const [formVarsayilanMi, setFormVarsayilanMi] = useState(false)
  const [formAdimlar, setFormAdimlar] = useState<RotaKullaniciAdimi[]>([])

  // Modal Step Form State
  const [selectedImzaTuru, setSelectedImzaTuru] = useState<ImzaTuru>('Paraf')
  const [selectedPersonelId, setSelectedPersonelId] = useState('')
  const [formUnvan, setFormUnvan] = useState('')
  const [formKariyerUnvan, setFormKariyerUnvan] = useState('')
  const [formAdinaBilgisi, setFormAdinaBilgisi] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleOpenEdit = (rota: RotaTanimi) => {
    setSelectedRota(rota)
    setFormRotaAdi(rota.rotaAdi)
    setFormRotaTuru(rota.rotaTuru)
    setFormVarsayilanMi(rota.varsayilanMi)
    setFormAdimlar([...rota.adimlari])
    setValidationError('')
    setIsModalOpen(true)
  }

  const handleOpenNew = () => {
    setSelectedRota(null)
    setFormRotaAdi('')
    setFormRotaTuru('Giden')
    setFormVarsayilanMi(false)
    setFormAdimlar([])
    setValidationError('')
    setIsModalOpen(true)
  }

  const handleSelectPersonel = (pId: string) => {
    setSelectedPersonelId(pId)
    const found = HAZIR_PERSONELLER.find((p) => p.id === pId)
    if (found) {
      setFormUnvan(found.unvan)
      setFormKariyerUnvan(found.kariyerUnvani || '')
    }
  }

  const handleAddKullanici = () => {
    if (!selectedPersonelId) {
      setValidationError('Lütfen bir kullanıcı seçiniz.')
      return
    }
    if (!formUnvan.trim()) {
      setValidationError('Unvan alanı zorunludur.')
      return
    }

    const personel = HAZIR_PERSONELLER.find((p) => p.id === selectedPersonelId)
    if (!personel) return

    const newAdim: RotaKullaniciAdimi = {
      id: 'step-' + Date.now(),
      sira: formAdimlar.length + 1,
      imzaTuru: selectedImzaTuru,
      kullaniciId: personel.id,
      adSoyad: personel.adSoyad,
      unvan: formUnvan.trim(),
      kariyerUnvani: formKariyerUnvan.trim(),
      adinaBilgisi: formAdinaBilgisi.trim(),
      birim: personel.birim,
    }

    setFormAdimlar((prev) => [...prev, newAdim])
    setSelectedPersonelId('')
    setFormUnvan('')
    setFormKariyerUnvan('')
    setFormAdinaBilgisi('')
    setValidationError('')
  }

  const handleRemoveAdim = (id: string) => {
    setFormAdimlar((prev) => prev.filter((a) => a.id !== id))
  }

  const handleToggleAktif = (id: string) => {
    setRotalar((prev) =>
      prev.map((r) => (r.id === id ? { ...r, aktifMi: !r.aktifMi } : r))
    )
  }

  const handleSaveModal = () => {
    if (!formRotaAdi.trim()) {
      setValidationError('Rota Adı alanı zorunludur.')
      return
    }
    if (formAdimlar.length === 0) {
      setValidationError('Rotada en az bir kullanıcı adımı tanımlanmalıdır.')
      return
    }

    if (selectedRota) {
      // Güncelleme
      setRotalar((prev) =>
        prev.map((r) =>
          r.id === selectedRota.id
            ? {
                ...r,
                rotaAdi: formRotaAdi.trim(),
                rotaTuru: formRotaTuru,
                varsayilanMi: formVarsayilanMi,
                adimlari: formAdimlar,
              }
            : formVarsayilanMi
            ? { ...r, varsayilanMi: false }
            : r
        )
      )
    } else {
      // Yeni Ekleme
      const newRota: RotaTanimi = {
        id: 'rota-' + Date.now(),
        rotaAdi: formRotaAdi.trim(),
        rotaTuru: formRotaTuru,
        varsayilanMi: formVarsayilanMi,
        aktifMi: true,
        adimlari: formAdimlar,
      }
      setRotalar((prev) => [
        ...(formVarsayilanMi ? prev.map((r) => ({ ...r, varsayilanMi: false })) : prev),
        newRota,
      ])
    }

    setIsModalOpen(false)
  }

  // Gruplandırma: Paraf & Koordinasyon vs İmza
  const groupedAdimlar: { [groupKey: string]: RotaKullaniciAdimi[] } = {}
  formAdimlar.forEach((adim) => {
    let group = 'Diğer'
    if (adim.imzaTuru.includes('Paraf') || adim.imzaTuru.includes('Koordinasyon')) {
      group = 'Paraf & Koordinasyon'
    } else if (adim.imzaTuru.includes('Teklif')) {
      group = 'Teklif Eden'
    } else if (adim.imzaTuru.includes('Uygun Görüş')) {
      group = 'Uygun Görüşle Arz'
    } else if (adim.imzaTuru.includes('Olur') && adim.imzaTuru.includes('İmza')) {
      group = 'Olur İmza'
    } else if (adim.imzaTuru.includes('İmza')) {
      group = 'İmza'
    }

    if (!groupedAdimlar[group]) groupedAdimlar[group] = []
    groupedAdimlar[group].push(adim)
  })

  const filteredRotalar = rotalar.filter((r) => {
    if (!showPasif && !r.aktifMi) return false
    if (searchTerm && !r.rotaAdi.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Üst Bar: Breadcrumb & Arama & Yardım */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#2d62d7]">
            Rota İşlemleri -&gt; Rota
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Yardım belgelerinde ara..."
              className="h-8 w-60 rounded border border-gray-300 bg-white px-2.5 py-1 text-[12px] text-gray-700 outline-none focus:border-[#2d62d7]"
            />
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded bg-[#2d62d7] text-white hover:bg-[#2455bd]"
            title="Yardım"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded bg-gray-400 text-white hover:bg-gray-500"
            title="Durdur / Duraklat"
          >
            <Pause className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filtreler Akordiyon Kutusu */}
      <div className="rounded border border-gray-200 bg-white">
        <div
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex cursor-pointer items-center justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-2.5 text-[13px] font-medium text-gray-700"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span>Filtreler</span>
          </div>
          {filterOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>

        {filterOpen && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-gray-700">
                <input
                  type="checkbox"
                  checked={showPasif}
                  onChange={(e) => setShowPasif(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#2d62d7] focus:ring-[#2d62d7]"
                />
                <span>Pasifleri de Göster</span>
              </label>

              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rota adında filtrele..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 w-52 rounded border border-gray-300 px-2 text-[12px] text-gray-700 outline-none focus:border-[#2d62d7]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 rounded bg-[#2d62d7] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-[#2455bd]"
            >
              <Plus className="h-4 w-4" />
              <span>Rota Ekle</span>
            </button>
          </div>
        )}
      </div>

      {/* Rota Listesi Tablosu */}
      <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-[12px]">
          <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-4 py-3">Rota Adı</th>
              <th className="px-4 py-3">Rota Türü</th>
              <th className="px-4 py-3 text-center">Varsayılan Mı?</th>
              <th className="px-4 py-3 text-center">Aktif Mi?</th>
              <th className="px-4 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {filteredRotalar.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  Tanımlı rota bulunamadı.
                </td>
              </tr>
            ) : (
              filteredRotalar.map((rota) => (
                <tr key={rota.id} className="hover:bg-blue-50/40">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-[#2d62d7]" />
                      <span>{rota.rotaAdi}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                      {rota.rotaTuru}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {rota.varsayilanMi ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleAktif(rota.id)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition ${
                        rota.aktifMi
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <span>{rota.aktifMi ? 'Açık' : 'Kapalı'}</span>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          rota.aktifMi ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(rota)}
                      className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-[#2d62d7]"
                      title="Rotayı Düzenle"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Sayfalama Altlığı */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/50 px-4 py-2.5 text-[12px] text-gray-600">
          <div className="flex items-center gap-2">
            {[10, 20, 50, 100].map((pageSize) => (
              <button
                key={pageSize}
                type="button"
                className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                  pageSize === 10
                    ? 'bg-[#2d62d7] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pageSize}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span>
              Sayfa 1 / 1 ({filteredRotalar.length} veri)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded border border-gray-300 bg-white px-2 py-0.5 text-gray-300"
              >
                &lt;
              </button>
              <button
                type="button"
                className="rounded border border-[#2d62d7] bg-[#2d62d7] px-2 py-0.5 font-bold text-white"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded border border-gray-300 bg-white px-2 py-0.5 text-gray-300"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ROTA DETAY / GÜNCELLEME MODALI (Görsellerdeki 1 & 5 Modal Ekranı) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            {/* Modal Başlık */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-[16px] font-bold text-gray-800">
                {selectedRota ? 'Rota Detay / Güncelleme' : 'Yeni Rota Tanımlama'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* 1. Rota Tanımlama Bölümü */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-bold text-gray-800">Rota Tanımlama</h4>
                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                  <div className="md:col-span-6">
                    <label className="block text-[11px] font-medium text-gray-600">
                      Rota Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={250}
                      value={formRotaAdi}
                      onChange={(e) => setFormRotaAdi(e.target.value)}
                      placeholder="Örn: İç ve Dış Yazışma Rotası"
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-1.5 text-[13px] outline-none focus:border-[#2d62d7]"
                    />
                    <div className="mt-0.5 text-right text-[10px] text-gray-400">
                      {formRotaAdi.length}/250
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[11px] font-medium text-gray-600">
                      Rota Türü <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formRotaTuru}
                      onChange={(e) => setFormRotaTuru(e.target.value as RotaTuru)}
                      className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-[13px] outline-none focus:border-[#2d62d7]"
                    >
                      <option value="Giden">Giden</option>
                      <option value="Olur">Olur</option>
                      <option value="Gelen">Gelen</option>
                      <option value="İç Yazışma">İç Yazışma</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-3 md:col-span-2">
                    <label className="flex cursor-pointer items-center gap-2 text-[12px] font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={formVarsayilanMi}
                        onChange={(e) => setFormVarsayilanMi(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#2d62d7] focus:ring-[#2d62d7]"
                      />
                      <span>Varsayılan Mı?</span>
                    </label>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* 2. Rota Kullanıcı Ekleme Bölümü */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-bold text-gray-800">Rota Kullanıcı Ekleme</h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  {/* İmza Türü Dropdown */}
                  <div className="md:col-span-6">
                    <label className="block text-[11px] font-medium text-gray-600">
                      İmza Türü <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedImzaTuru}
                      onChange={(e) => setSelectedImzaTuru(e.target.value as ImzaTuru)}
                      className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-[13px] outline-none focus:border-[#2d62d7]"
                    >
                      <option value="Paraf">Paraf</option>
                      <option value="Paraf & Koordinasyon">Paraf &amp; Koordinasyon</option>
                      <option value="İmza">İmza</option>
                      <option value="Olur Parafı">Olur Parafı</option>
                      <option value="Olur Koordinasyonu">Olur Koordinasyonu</option>
                      <option value="Teklif Eden">Teklif Eden ✍️</option>
                      <option value="Uygun Görüşle Arz">Uygun Görüşle Arz ✍️</option>
                      <option value="Olur İmza">Olur İmza ✍️</option>
                    </select>
                  </div>

                  {/* Personel Seçici */}
                  <div className="md:col-span-6">
                    <label className="block text-[11px] font-medium text-gray-600">
                      Kullanıcı Seçimi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1 flex items-center">
                      <span className="absolute left-3 text-gray-400">
                        <User className="h-4 w-4" />
                      </span>
                      <select
                        value={selectedPersonelId}
                        onChange={(e) => handleSelectPersonel(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-[13px] outline-none focus:border-[#2d62d7]"
                      >
                        <option value="">Seçiniz</option>
                        {HAZIR_PERSONELLER.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.adSoyad} ({p.unvan} - {p.birim})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Unvan */}
                  <div className="md:col-span-12">
                    <label className="block text-[11px] font-medium text-gray-600">
                      Unvan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={formUnvan}
                      onChange={(e) => setFormUnvan(e.target.value)}
                      placeholder="Unvan giriniz veya personelden otomatik çekiniz"
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-1.5 text-[13px] outline-none focus:border-[#2d62d7]"
                    />
                    <div className="mt-0.5 text-right text-[10px] text-gray-400">
                      {formUnvan.length}/100
                    </div>
                  </div>

                  {/* Kariyer Unvanı & Adına Bilgisi */}
                  <div className="md:col-span-6">
                    <label className="block text-[11px] font-medium text-gray-600">
                      Kariyer Unvanı (Dr. Av. vb.)
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={formKariyerUnvan}
                      onChange={(e) => setFormKariyerUnvan(e.target.value)}
                      placeholder="Dr., Av., Yük. Müh."
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-1.5 text-[13px] outline-none focus:border-[#2d62d7]"
                    />
                    <div className="mt-0.5 text-right text-[10px] text-gray-400">
                      {formKariyerUnvan.length}/20
                    </div>
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-[11px] font-medium text-gray-600">
                      Adına Bilgisi
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={formAdinaBilgisi}
                      onChange={(e) => setFormAdinaBilgisi(e.target.value)}
                      placeholder="Örn: Bakan Adına, Genel Sekreter Adına"
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-1.5 text-[13px] outline-none focus:border-[#2d62d7]"
                    />
                    <div className="mt-0.5 text-right text-[10px] text-gray-400">
                      {formAdinaBilgisi.length}/100
                    </div>
                  </div>
                </div>

                {/* Ekle Butonu */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleAddKullanici}
                    className="flex items-center gap-1.5 rounded bg-[#2d62d7] px-5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#2455bd]"
                  >
                    <span>↓</span>
                    <span>Kullanıcıyı Ekle</span>
                  </button>
                </div>
              </div>

              {/* 3. Gruplandırılmış Adımlar Tablosu */}
              <div className="overflow-hidden rounded border border-gray-200">
                <table className="w-full text-left text-[12px]">
                  <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-600">
                    <tr>
                      <th className="w-8 px-3 py-2 text-center">#</th>
                      <th className="px-3 py-2">Kullanıcı</th>
                      <th className="px-3 py-2">Unvan</th>
                      <th className="px-3 py-2">Kariyer Unvanı</th>
                      <th className="px-3 py-2">Adına Bilgisi</th>
                      <th className="w-12 px-3 py-2 text-center">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.keys(groupedAdimlar).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-gray-400">
                          Henüz kullanıcı eklenmedi. Yukarıdaki formdan kullanıcı ekleyebilirsiniz.
                        </td>
                      </tr>
                    ) : (
                      Object.entries(groupedAdimlar).map(([groupName, adimlar]) => (
                        <React.Fragment key={groupName}>
                          {/* Grup Başlığı Satırı */}
                          <tr className="bg-gray-100/80 font-bold text-gray-800">
                            <td colSpan={6} className="px-3 py-1.5 text-[11px]">
                              ▾ {groupName}
                            </td>
                          </tr>
                          {/* Grup İçi Satırlar */}
                          {adimlar.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/30">
                              <td className="px-3 py-2 text-center text-gray-400">
                                <GripVertical className="inline-block h-3.5 w-3.5 cursor-grab" />
                              </td>
                              <td className="px-3 py-2 font-medium text-gray-900">
                                {item.adSoyad}
                              </td>
                              <td className="px-3 py-2 text-gray-600">{item.unvan}</td>
                              <td className="px-3 py-2 text-gray-500">
                                {item.kariyerUnvani || '-'}
                              </td>
                              <td className="px-3 py-2 text-gray-500">
                                {item.adinaBilgisi || '-'}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAdim(item.id)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Kaldır"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Hata Mesajı & Zorunlu Alan Bildirimi */}
              {validationError && (
                <div className="rounded border border-red-200 bg-red-50 p-2 text-[12px] font-semibold text-red-700">
                  ⚠️ {validationError}
                </div>
              )}
              <div className="text-[11px] font-semibold text-red-600">
                ! * Alanların Doldurulması Zorunludur
              </div>
            </div>

            {/* Modal Alt Aksiyon Butonları */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-3">
              <button
                type="button"
                onClick={handleSaveModal}
                className="flex items-center gap-1.5 rounded bg-[#2d62d7] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#2455bd]"
              >
                <Check className="h-4 w-4" />
                <span>{selectedRota ? 'Rota Güncelle' : 'Rotayı Kaydet'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-1.5 rounded bg-red-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-red-700"
              >
                <X className="h-4 w-4" />
                <span>Kapat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

