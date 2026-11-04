'use client'

import React, { useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderOpen,
  HardDrive,
  Link2,
  MoreVertical,
  Paperclip,
  Plus,
  Printer,
  Save,
  Scan,
  Search,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react'
import {
  DAGITIM_YERLERI,
  RotaTanimi,
  STANDART_DOSYA_PLANLARI,
  VARSAYILAN_ROTALAR,
} from '@/lib/rota-yonetimi-data'

export function ResmiBelgeFormView() {
  // Gizlilik ve İvedilik Rozetleri (Görsel 4)
  const [selectedClassification, setSelectedClassification] = useState<string[]>([])
  const [selectedUrgency, setSelectedUrgency] = useState<string[]>([])

  const classificationOptions = [
    'Bilgi Edinme Hakkı',
    'Özel Hayatın Korunması',
    'Kişiye Özel',
    'Hizmete Özel',
    'Gizli',
    'Çok Gizli',
  ]
  const urgencyOptions = ['Günlüdür', 'Acele']

  // Form Alanları
  const [dosyaPlani, setDosyaPlani] = useState('')
  const [konu, setKonu] = useState('')
  const [konuCaseUpper, setKonuCaseUpper] = useState(false)
  const [selectedRotaId, setSelectedRotaId] = useState('rota-1')
  const [isRotaDropdownOpen, setIsRotaDropdownOpen] = useState(false)
  const [rotaSearch, setRotaSearch] = useState('')

  // Akordiyonlar
  const [openDagitimlar, setOpenDagitimlar] = useState(true)
  const [openEklerIlgiler, setOpenEklerIlgiler] = useState(true)
  const [openEkUstVeriler, setOpenEkUstVeriler] = useState(false)

  // Dağıtım
  const [selectedDagitimYeri, setSelectedDagitimYeri] = useState('')
  const [selectedDagitimPlani, setSelectedDagitimPlani] = useState('')
  const [dagitimList, setDagitimList] = useState<string[]>([
    'Gereği: Satınalma Şube Müdürlüğü',
  ])

  // İlgiler ve Ekler
  const [ilgiler, setIlgiler] = useState<string[]>([])
  const [ekler, setEkler] = useState<{ id: string; name: string; sizeKb: number }[]>([])
  const [showAddIlgiModal, setShowAddIlgiModal] = useState(false)
  const [newIlgiText, setNewIlgiText] = useState('')

  // Tarayıcı (Scanner) Modalı
  const [showScannerModal, setShowScannerModal] = useState(false)
  const [scannerDevice, setScannerDevice] = useState('Fujitsu fi-7160 (TWAIN - USB)')
  const [scanResolution, setScanResolution] = useState('300 DPI')
  const [scanColorMode, setScanColorMode] = useState('Renkli (24-bit)')
  const [isScanning, setIsScanning] = useState(false)

  // Kaydetme Durumu
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Rotalar
  const rotalar = VARSAYILAN_ROTALAR
  const activeRota = rotalar.find((r) => r.id === selectedRotaId) || rotalar[0]

  // Kota hesaplama (maks 104.9 MB)
  const totalKb = ekler.reduce((acc, curr) => acc + curr.sizeKb, 0)
  const totalMb = totalKb / 1024
  const maxMb = 104.9
  const kotaYuzdesi = Math.min(100, Math.round((totalMb / maxMb) * 100))

  const toggleBadge = (
    item: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item))
    } else {
      setter([...list, item])
    }
  }

  const toggleKonuCase = () => {
    if (konuCaseUpper) {
      setKonu((prev) => prev.charAt(0).toUpperCase() + prev.slice(1).toLowerCase())
      setKonuCaseUpper(false)
    } else {
      setKonu((prev) => prev.toLocaleUpperCase('tr-TR'))
      setKonuCaseUpper(true)
    }
  }

  const handleAddDagitim = () => {
    if (selectedDagitimYeri && !dagitimList.includes(selectedDagitimYeri)) {
      setDagitimList((prev) => [...prev, selectedDagitimYeri])
      setSelectedDagitimYeri('')
    }
  }

  const handleRemoveDagitim = (idx: number) => {
    setDagitimList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddIlgi = () => {
    if (newIlgiText.trim()) {
      setIlgiler((prev) => [...prev, newIlgiText.trim()])
      setNewIlgiText('')
      setShowAddIlgiModal(false)
    }
  }

  const handleSimulateScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      const scannedFile = {
        id: 'scan-' + Date.now(),
        name: `Tarama_${new Date().toISOString().slice(0, 10)}_Belge_${ekler.length + 1}.pdf`,
        sizeKb: Math.floor(Math.random() * 800) + 400,
      }
      setEkler((prev) => [...prev, scannedFile])
      setShowScannerModal(false)
    }, 1200)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const newFile = {
        id: 'file-' + Date.now(),
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
      }
      setEkler((prev) => [...prev, newFile])
    }
  }

  const handleSaveDocument = () => {
    const errors: string[] = []
    if (!dosyaPlani) errors.push('Standart Dosya Planı seçimi zorunludur.')
    if (!konu.trim()) errors.push('Konu alanı zorunludur.')
    if (!selectedRotaId) errors.push('Rota seçimi zorunludur.')

    if (errors.length > 0) {
      setValidationErrors(errors)
      setSaveSuccess(false)
      return
    }

    setValidationErrors([])
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 4000)
  }

  const filteredRotalar = rotalar.filter((r) =>
    r.rotaAdi.toLowerCase().includes(rotaSearch.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* 1. ÜST SINIFLANDIRMA VE İVEDİLİK ETİKETLERİ (Görsel 4'ün Sağ Üst Butonları) */}
      <div className="flex flex-wrap items-center justify-end gap-1.5 border-b border-gray-200 pb-3">
        {classificationOptions.map((opt) => {
          const isSelected = selectedClassification.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() =>
                toggleBadge(opt, selectedClassification, setSelectedClassification)
              }
              className={`rounded border px-2.5 py-1 text-[11px] font-medium transition ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 font-semibold text-blue-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          )
        })}

        <div className="mx-1 h-5 w-[1px] bg-gray-300" />

        {urgencyOptions.map((opt) => {
          const isSelected = selectedUrgency.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleBadge(opt, selectedUrgency, setSelectedUrgency)}
              className={`rounded border px-2.5 py-1 text-[11px] font-medium transition ${
                isSelected
                  ? 'border-amber-500 bg-amber-50 font-semibold text-amber-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* 2. ZORUNLU ÜST VERİ FORMU (Standart Dosya Planı, Konu, Rota Seçimi) */}
      <div className="space-y-4 rounded border border-gray-200 bg-white p-5 shadow-sm">
        {/* Standart Dosya Planı */}
        <div>
          <label className="block text-[12px] font-semibold text-gray-700">
            Standart Dosya Planı <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <select
              value={dosyaPlani}
              onChange={(e) => setDosyaPlani(e.target.value)}
              className="w-full appearance-none rounded border border-red-400 bg-white px-3 py-2 text-[13px] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]"
            >
              <option value="">Standart Dosya Planı Seçiniz*</option>
              {STANDART_DOSYA_PLANLARI.map((sdp) => (
                <option key={sdp.kod} value={sdp.kod}>
                  {sdp.baslik}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Konu Alanı + Aa Butonu */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-[12px] font-semibold text-gray-700">
              Konu <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">{konu.length}/115</span>
              <button
                type="button"
                onClick={toggleKonuCase}
                title="Büyük / Küçük Harf Değiştir"
                className="flex items-center rounded border border-[#2d62d7] bg-[#f0f4ff] px-2 py-0.5 text-[11px] font-bold text-[#2d62d7] hover:bg-[#d3e0fb]"
              >
                Aa
              </button>
            </div>
          </div>
          <input
            type="text"
            maxLength={115}
            value={konu}
            onChange={(e) => setKonu(e.target.value)}
            placeholder="Belgenin konusunu giriniz... (Örn: Piyasa Fiyat Araştırma Tutanağı ve Onay Talebi)"
            className="mt-1 w-full rounded border border-red-400 px-3 py-2 text-[13px] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]"
          />
        </div>

        {/* ROTA SEÇİMİ (Görsel 2'deki Canlı Rota Akış Kartı Dropdown'u) */}
        <div className="relative">
          <label className="block text-[12px] font-semibold text-gray-700">
            Rota Seçimi <span className="text-red-500">*</span>
          </label>

          {/* Kapalı Görünüm / Dropdown Tetikleyici */}
          <button
            type="button"
            onClick={() => setIsRotaDropdownOpen(!isRotaDropdownOpen)}
            className="mt-1 flex w-full items-center justify-between rounded border border-red-400 bg-white px-3 py-2 text-left text-[13px] shadow-sm focus:outline-none"
          >
            <div className="flex items-center gap-2 text-gray-800">
              <Users className="h-4 w-4 text-[#2d62d7]" />
              <span className="font-semibold">{activeRota.rotaAdi}</span>
              <span className="rounded bg-[#f0f4ff] px-2 py-0.5 text-[10px] font-medium text-[#2d62d7]">
                {activeRota.rotaTuru}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {/* Açılır Panel (Görsel 2 Birebir) */}
          {isRotaDropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-md border border-gray-300 bg-white p-3 shadow-xl">
              {/* Filtre ve Arama Alanı */}
              <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={rotaSearch}
                    onChange={(e) => setRotaSearch(e.target.value)}
                    placeholder="Rotalarda ara..."
                    className="w-full rounded border border-gray-300 px-3 py-1.5 text-[12px] outline-none focus:border-[#2d62d7]"
                  />
                </div>
                <select className="rounded border border-gray-300 bg-white px-2 py-1.5 text-[12px] text-gray-700 outline-none">
                  <option>Rota adlarında</option>
                  <option>Kullanıcı adına göre</option>
                </select>
                <select className="rounded border border-gray-300 bg-white px-2 py-1.5 text-[12px] text-gray-700 outline-none">
                  <option>Tüm rotalarda</option>
                  <option>Sadece Giden rotalar</option>
                  <option>Sadece Olur rotalar</option>
                </select>
              </div>

              {/* Rota Akış Kartları Listesi */}
              <div className="mt-3 max-h-60 space-y-3 overflow-y-auto pr-1">
                {filteredRotalar.map((rota) => (
                  <div
                    key={rota.id}
                    onClick={() => {
                      setSelectedRotaId(rota.id)
                      setIsRotaDropdownOpen(false)
                    }}
                    className={`cursor-pointer rounded-lg border p-3 transition hover:border-[#2d62d7] hover:bg-[#f0f4ff]/20 ${
                      selectedRotaId === rota.id
                        ? 'border-[#2d62d7] bg-[#f0f4ff]/40 ring-1 ring-[#2d62d7]'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#2d62d7]" />
                        <span className="text-[13px] font-bold text-gray-800">
                          {rota.rotaAdi}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-gray-500">
                        {rota.rotaTuru}
                      </span>
                    </div>

                    {/* Akış Şeması (Adım ➔ Adım) */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                      {rota.adimlari.map((adim, idx) => (
                        <React.Fragment key={adim.id}>
                          <div className="rounded border border-gray-300 bg-white px-2.5 py-1 shadow-xs">
                            <p className="font-semibold text-gray-800">
                              {adim.adSoyad}{' '}
                              <span className="font-normal text-gray-600">
                                ({adim.imzaTuru})
                              </span>
                            </p>
                            <p className="text-[10px] italic text-gray-500">
                              {adim.unvan}
                            </p>
                          </div>
                          {idx < rota.adimlari.length - 1 && (
                            <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. AKORDİYON 1: DAĞITIMLAR (Görsel 4) */}
      <div className="rounded border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setOpenDagitimlar(!openDagitimlar)}
          className="flex w-full items-center justify-between bg-blue-50/60 px-4 py-2.5 text-left text-[13px] font-semibold text-blue-900"
        >
          <div className="flex items-center gap-2">
            <span>🌐</span>
            <span>Dağıtımlar</span>
          </div>
          {openDagitimlar ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {openDagitimlar && (
          <div className="space-y-3 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
              <div className="md:col-span-8">
                <select
                  value={selectedDagitimYeri}
                  onChange={(e) => setSelectedDagitimYeri(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-[12px] outline-none focus:border-[#2d62d7]"
                >
                  <option value="">Dağıtım Yeri Seçiniz</option>
                  {DAGITIM_YERLERI.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-4">
                <button
                  type="button"
                  onClick={handleAddDagitim}
                  className="w-full rounded bg-gray-100 px-3 py-1.5 text-[12px] font-semibold text-gray-700 hover:bg-gray-200"
                >
                  + Dağıtıma Ekle
                </button>
              </div>
            </div>

            {/* Eklenen Dağıtımlar Listesi */}
            {dagitimList.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {dagitimList.map((dagitim, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded bg-gray-50 px-3 py-1.5 text-[12px] text-gray-800"
                  >
                    <span>{dagitim}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDagitim(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. AKORDİYON 2: EKLER VE İLGİLER (Görsel 4 Birebir) */}
      <div className="rounded border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setOpenEklerIlgiler(!openEklerIlgiler)}
          className="flex w-full items-center justify-between bg-blue-50/60 px-4 py-2.5 text-left text-[13px] font-semibold text-blue-900"
        >
          <div className="flex items-center gap-2">
            <span>📎</span>
            <span>Ekler ve İlgiler</span>
          </div>
          {openEklerIlgiler ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {openEklerIlgiler && (
          <div className="space-y-4 p-4">
            {/* Dosya Kotası İlerleme Çubuğu */}
            <div className="rounded border border-gray-100 bg-gray-50/70 p-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
                <div className="flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5 text-blue-600" />
                  <span>Dosya Kotası (%{kotaYuzdesi})</span>
                </div>
                <span>
                  {totalMb < 1 ? `${totalKb} KB` : `${totalMb.toFixed(1)} MB`} / {maxMb} MB
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${kotaYuzdesi}%` }}
                />
              </div>
            </div>

            {/* İlgiler Bölümü */}
            <div className="rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-[12px] font-bold text-gray-800">
                  <Link2 className="h-3.5 w-3.5 text-gray-500" />
                  <span>İlgiler ({ilgiler.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddIlgiModal(true)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#2d62d7] hover:underline"
                  >
                    <Plus className="h-3 w-3" /> İlgi Ekle
                  </button>
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="pt-2 text-[12px]">
                {ilgiler.length === 0 ? (
                  <p className="italic text-gray-400">bu bölüme henüz bir içerik eklenmemiş!</p>
                ) : (
                  <ul className="space-y-1">
                    {ilgiler.map((ilgi, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between rounded bg-gray-50 px-2.5 py-1 text-gray-700"
                      >
                        <span>{ilgi}</span>
                        <button
                          type="button"
                          onClick={() => setIlgiler(ilgiler.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Ekler Bölümü */}
            <div className="rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-[12px] font-bold text-gray-800">
                  <Paperclip className="h-3.5 w-3.5 text-gray-500" />
                  <span>Ekler ({ekler.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-[#2d62d7] hover:underline">
                    <Upload className="h-3 w-3" /> Dosya Yükle
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="pt-2 text-[12px]">
                {ekler.length === 0 ? (
                  <p className="italic text-gray-400">bu bölüme henüz bir içerik eklenmemiş!</p>
                ) : (
                  <ul className="space-y-1">
                    {ekler.map((ek) => (
                      <li
                        key={ek.id}
                        className="flex items-center justify-between rounded bg-gray-50 px-2.5 py-1 text-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                          <span>{ek.name}</span>
                          <span className="text-[10px] text-gray-400">({ek.sizeKb} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEkler(ekler.filter((e) => e.id !== ek.id))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Tarayıcı (Scanner) Yoluyla Belge Aktar Butonu (Görsel 4) */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowScannerModal(true)}
                className="flex items-center gap-2 rounded border border-[#2d62d7] bg-[#f0f4ff] px-6 py-2 text-[13px] font-semibold text-[#2d62d7] shadow-xs hover:bg-[#d3e0fb]"
              >
                <Printer className="h-4 w-4" />
                <span>Tarayıcı (Scanner) Yoluyla Belge Aktar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. AKORDİYON 3: EK ÜST VERİLER (Görsel 4) */}
      <div className="rounded border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setOpenEkUstVeriler(!openEkUstVeriler)}
          className="flex w-full items-center justify-between bg-gray-50 px-4 py-2.5 text-left text-[13px] font-semibold text-gray-700"
        >
          <div className="flex items-center gap-2">
            <span>📑</span>
            <span>Ek Üst Veriler</span>
          </div>
          {openEkUstVeriler ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {openEkUstVeriler && (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 text-[12px]">
            <div>
              <label className="block font-medium text-gray-600">DETSIS No</label>
              <input
                type="text"
                defaultValue="E.841258"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-600">EBYS Belge No</label>
              <input
                type="text"
                defaultValue="2026/0142"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-1.5"
              />
            </div>
          </div>
        )}
      </div>

      {/* 6. ALT BİLGİLENDİRME VE KAYDET BUTONU (Görsel 2) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3">
        <div className="text-[11px] italic text-red-600">
          * kırmızı alanların doldurulması zorunludur!
        </div>

        <button
          type="button"
          onClick={handleSaveDocument}
          className="flex items-center gap-2 rounded bg-gray-100 px-6 py-2 text-[13px] font-bold text-gray-700 shadow-sm hover:bg-gray-200"
        >
          <Save className="h-4 w-4" />
          <span>Kaydet</span>
        </button>
      </div>

      {/* Kaydetme Bildirimleri */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded border border-emerald-300 bg-emerald-50 p-3 text-[12px] font-semibold text-emerald-800">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Belge üst verileri ve rota tanımlaması başarıyla kaydedildi!</span>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
          <p className="font-bold">Lütfen zorunlu alanları doldurunuz:</p>
          <ul className="mt-1 list-disc list-inside">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* İLGİ EKLEME MODALI */}
      {showAddIlgiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h4 className="text-[14px] font-bold text-gray-800">İlgi Ekle</h4>
            <textarea
              rows={3}
              value={newIlgiText}
              onChange={(e) => setNewIlgiText(e.target.value)}
              placeholder="Örn: 14.04.2026 tarihli ve 2026/41 sayılı Destek Hizmetleri yazısı."
              className="mt-3 w-full rounded border border-gray-300 p-2.5 text-[12px] outline-none focus:border-[#2d62d7]"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddIlgiModal(false)}
                className="rounded border border-gray-300 px-3 py-1.5 text-[12px]"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleAddIlgi}
                className="rounded bg-[#2d62d7] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[#2455bd]"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TARAYICI (SCANNER) MODALI */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 text-[#2d62d7]">
                <Scan className="h-5 w-5" />
                <h4 className="text-[15px] font-bold text-gray-800">
                  Tarayıcıdan (Scanner) Belge Aktar
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowScannerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-[12px]">
              <div>
                <label className="block font-medium text-gray-700">Bağlı Tarayıcı</label>
                <select
                  value={scannerDevice}
                  onChange={(e) => setScannerDevice(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 bg-white p-2"
                >
                  <option value="Fujitsu fi-7160 (TWAIN - USB)">
                    Fujitsu fi-7160 (TWAIN - USB)
                  </option>
                  <option value="Canon DR-C225 (WIA - Ağ)">Canon DR-C225 (WIA - Ağ)</option>
                  <option value="HP LaserJet MFP (Ağ Tarayıcı)">
                    HP LaserJet MFP (Ağ Tarayıcı)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700">Çözünürlük</label>
                  <select
                    value={scanResolution}
                    onChange={(e) => setScanResolution(e.target.value)}
                    className="mt-1 w-full rounded border border-gray-300 bg-white p-2"
                  >
                    <option>150 DPI (Hafif)</option>
                    <option>200 DPI (Standart)</option>
                    <option>300 DPI (EBYS Kalite)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700">Renk Modu</label>
                  <select
                    value={scanColorMode}
                    onChange={(e) => setScanColorMode(e.target.value)}
                    className="mt-1 w-full rounded border border-gray-300 bg-white p-2"
                  >
                    <option>Siyah / Beyaz (1-bit)</option>
                    <option>Gri Tonlama (8-bit)</option>
                    <option>Renkli (24-bit)</option>
                  </select>
                </div>
              </div>

              <div className="rounded bg-gray-50 p-3 text-[11px] text-gray-600">
                💡 Belgeyi tarayıcının besleyicisine yerleştirdikten sonra Tarama Başlat butonuna
                basınız. Sayfalar otomatik olarak PDF'e dönüştürülüp eklere bağlanacaktır.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-3">
              <button
                type="button"
                onClick={() => setShowScannerModal(false)}
                className="rounded border border-gray-300 px-4 py-2 text-[12px]"
              >
                İptal
              </button>
              <button
                type="button"
                disabled={isScanning}
                onClick={handleSimulateScan}
                className="flex items-center gap-2 rounded bg-[#2d62d7] px-5 py-2 text-[12px] font-bold text-white shadow-sm hover:bg-[#2455bd]"
              >
                {isScanning ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Taranıyor...</span>
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4" />
                    <span>Taramayı Başlat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

