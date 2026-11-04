'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText,
  History,
  Layers,
  Database,
  Printer,
  Sparkles,
  Download,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Code2,
  ShieldCheck,
  Building2,
  Calendar,
  Tag,
  Copy,
  Check,
} from 'lucide-react'
import {
  OnayBelgesiTemplate,
  PiyasaFiyatArastirmasiTemplate,
  YaklasikMaliyetTemplate,
  TeklifMektubuTemplate,
  SozlesmeTemplate,
  MuayeneKabulTemplate,
  DamgaVergisiTemplate,
} from '@/lib/document-engine/templates/all-templates'
import { ResmiUstYaziTemplate } from '@/lib/document-engine/template'
import { resmiUstYaziResolver } from '@/lib/document-engine/resolver'
import { VarliklarTutanagiTemplate } from '@/components/gelir-ihaleleri/templates/varliklar-tutanagi'
import { ORNEK_TEMIN_DOSYALARI } from '@/lib/temin-dosyasi/schema'

export default function BelgeStudioPage() {
  const [activeTab, setActiveTab] = useState<'preview' | 'overrides' | 'mapping' | 'json' | 'audit'>('preview')
  const [dosyalar, setDosyalar] = useState<any[]>([])
  const [sablonlar, setSablonlar] = useState<any[]>([])
  const [selectedDocId, setSelectedDocId] = useState<string>('1')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('DOC_ONAY_01')
  const [activeSnapshot, setActiveSnapshot] = useState<any>(null)
  const [revisions, setRevisions] = useState<any[]>([])
  const [templateDef, setTemplateDef] = useState<any>(null)
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [overrideEdits, setOverrideEdits] = useState<Record<string, any>>({})
  const [clearedOverrides, setClearedOverrides] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copiedJson, setCopiedJson] = useState<boolean>(false)

  // Fetch data
  const fetchData = async (docId = selectedDocId, tplId = selectedTemplateId, rev?: string) => {
    setLoading(true)
    try {
      let url = `/api/belge-studio?docId=${docId}&templateId=${tplId}`
      if (rev) url += `&rev=${rev}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setDosyalar(data.dosyaListesi || [])
        setSablonlar(data.sablonListesi || [])
        setActiveSnapshot(data.activeSnapshot)
        setRevisions(data.revisions || [])
        setTemplateDef(data.templateDef)
        setAuditLogs(data.auditLogs || [])
        if (data.activeSnapshot?.overrides) {
          setOverrideEdits(data.activeSnapshot.overrides)
        } else {
          setOverrideEdits({})
        }
        setClearedOverrides([])
      }
    } catch (err) {
      console.error('Veri yükleme hatası:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(selectedDocId, selectedTemplateId)
  }, [selectedDocId, selectedTemplateId])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Handle saving new revision
  const handleSaveRevision = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/belge-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId: selectedDocId,
          templateId: selectedTemplateId,
          overrides: overrideEdits,
          clearOverrides: clearedOverrides,
          operator: 'İlyas Bozdemir (Şube Müdürü)',
        }),
      })
      const result = await res.json()
      if (result.success) {
        showToast(result.message || 'Yeni revizyon başarıyla mühürlendi!')
        await fetchData(selectedDocId, selectedTemplateId)
      } else {
        alert('Hata: ' + result.error)
      }
    } catch (err: any) {
      alert('Kaydetme hatası: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // Handle revert field to DB source
  const handleRevertField = (path: string) => {
    const next = { ...overrideEdits }
    delete next[path]
    setOverrideEdits(next)
    if (!clearedOverrides.includes(path)) {
      setClearedOverrides([...clearedOverrides, path])
    }
    showToast(`"${path}" alanı kaynak veri tabanı değerine sıfırlandı.`)
  }

  // Render Template Document
  const renderDocument = () => {
    const docData = activeSnapshot?.data?.document || {}
    const globalData = activeSnapshot?.data?.global || {}
    const matchedSample =
      ORNEK_TEMIN_DOSYALARI.find((d) => String(d.id) === String(selectedDocId)) || ORNEK_TEMIN_DOSYALARI[0]

    // Synthesize mock record with snapshot data
    const synthesizedRecord = {
      ...matchedSample,
      konu: docData?.dosya?.konu || matchedSample.konu,
      temin_no: docData?.dosya?.teminNo || matchedSample.temin_no,
      birim: docData?.dosya?.birim || matchedSample.birim,
      dosya_acilis_tarihi: docData?.dosya?.tarih || matchedSample.dosya_acilis_tarihi,
      yaklasik_maliyet: docData?.dosya?.yaklasikMaliyet || matchedSample.yaklasik_maliyet,
    }

    switch (selectedTemplateId) {
      case 'DOC_ONAY_01':
        return <OnayBelgesiTemplate data={synthesizedRecord} />
      case 'DOC_PIYASA_01':
        return <PiyasaFiyatArastirmasiTemplate data={synthesizedRecord} />
      case 'DOC_SOZLESME_01':
        return <SozlesmeTemplate data={synthesizedRecord} />
      case 'DOC_YAKLASIK_01':
        return <YaklasikMaliyetTemplate data={synthesizedRecord} />
      case 'DOC_TEKLIF_01':
        return <TeklifMektubuTemplate data={synthesizedRecord} />
      case 'DOC_MUAYENE_01':
        return <MuayeneKabulTemplate data={synthesizedRecord} />
      case 'DOC_DAMGA_01':
        return <DamgaVergisiTemplate data={synthesizedRecord} />
      case 'DOC_RESMI_01': {
        const yaziData = resmiUstYaziResolver.resolve({
          dosya: {
            dosya_no: synthesizedRecord.temin_no,
            is_tanimi: synthesizedRecord.konu,
            sunulacak_makam: synthesizedRecord.sunulacak_makam,
            harcama_yetkilisi: synthesizedRecord.onay_personel_adi,
          },
        })
        return <ResmiUstYaziTemplate data={yaziData} />
      }
      default:
        return <OnayBelgesiTemplate data={synthesizedRecord} />
    }
  }

  // Export JSON file
  const handleDownloadJson = () => {
    if (!activeSnapshot) return
    const blob = new Blob([JSON.stringify(activeSnapshot, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Snapshot-${selectedTemplateId}-Doc${selectedDocId}-Rev${activeSnapshot.revision}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="size-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Title Bar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">Belge Stüdyosu (Document Engine V4)</h1>
                <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                  SQLite · Snapshot · React
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Resmî KİK 4734 ve 2886 şablonları, çift yönlü mapping, kontrollü override ve mühürlü revizyon geçmişi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/yazdirma-merkezi"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="size-3.5" />
              Yazdırma Merkezi
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
            >
              <Printer className="size-3.5" />
              A4 Doğrudan Yazdır
            </button>
          </div>
        </div>

        {/* Dossier & Template Selectors Toolbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Dossier Selection */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 flex items-center gap-1">
                <Database className="size-3.5 text-slate-400" />
                Dosya:
              </span>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="h-8 px-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {dosyalar.length > 0 ? (
                  dosyalar.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.temin_no} — {d.konu ? d.konu.substring(0, 32) : 'Dosya'}...
                    </option>
                  ))
                ) : (
                  <option value="1">2026/DT-001 Destek Hizmetleri</option>
                )}
              </select>
            </div>

            {/* Template Selection */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 flex items-center gap-1">
                <Layers className="size-3.5 text-slate-400" />
                Şablon:
              </span>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="h-8 px-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {sablonlar.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.docNo}] {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Revision Badge */}
            {activeSnapshot && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[11px]">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                Revizyon #{activeSnapshot.revision} ({activeSnapshot.contentHash || 'Mühürlü'})
              </span>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="size-3.5" />
              Canlı Önizleme
            </button>
            <button
              onClick={() => setActiveTab('overrides')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'overrides'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="size-3.5" />
              Kontrollü Alanlar ({templateDef?.form?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('mapping')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'mapping'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="size-3.5" />
              Mapping Kataloğu
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'json'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="size-3.5" />
              Snapshot JSON
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'audit'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="size-3.5" />
              Denetim İzi
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="p-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <Sparkles className="size-8 mx-auto animate-spin text-indigo-600 mb-3" />
            <p className="text-sm font-semibold">Belge şablonu ve snapshot verileri yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Revisions Timeline (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <History className="size-3.5 text-indigo-600" />
                    Revizyon Geçmişi
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {revisions.length} Versiyon
                  </span>
                </div>
                <div className="space-y-2">
                  {revisions.length === 0 ? (
                    <p className="text-xs text-slate-400">Henüz kayıtlı revizyon yok.</p>
                  ) : (
                    revisions
                      .slice()
                      .reverse()
                      .map((rev) => {
                        const isCurrent = activeSnapshot?.revision === rev.revision
                        return (
                          <button
                            key={rev.id}
                            onClick={() => fetchData(selectedDocId, selectedTemplateId, String(rev.revision))}
                            className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col gap-1 ${
                              isCurrent
                                ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-semibold ring-1 ring-indigo-200'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1">
                                Revizyon #{rev.revision}
                                {isCurrent && (
                                  <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                                    Aktif
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(rev.createdAt).toLocaleTimeString('tr-TR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono truncate">
                              {rev.contentHash || 'Mühürlü Snapshot'}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 border-t border-slate-200/60 mt-0.5">
                              <span>{rev.operator || 'Sistem'}</span>
                              <span>{Object.keys(rev.overrides || {}).length} Override</span>
                            </div>
                          </button>
                        )
                      })
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={handleSaveRevision}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Save className="size-3.5" />
                    {saving ? 'Mühürleniyor...' : 'Yeni Revizyon Oluştur'}
                  </button>
                </div>
              </div>

              {/* Document Metadata Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs text-xs space-y-2">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-slate-400" />
                  Dosya Bilgisi
                </h4>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dosya No:</span>
                    <span className="font-semibold text-slate-800">
                      {activeSnapshot?.data?.document?.dosya?.teminNo || '2026/DT-001'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alım Usulü:</span>
                    <span className="font-medium text-slate-800">Doğrudan Temin 22/d</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mühürlü Tarih:</span>
                    <span className="font-medium text-slate-800">
                      {activeSnapshot?.createdAt
                        ? new Date(activeSnapshot.createdAt).toLocaleDateString('tr-TR')
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Content (9 Cols) */}
            <div className="lg:col-span-9">
              {/* TAB 1: PREVIEW */}
              {activeTab === 'preview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">A4 Baskı Önizlemesi</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">
                        {templateDef?.title || 'Şablon'} (Rev #{activeSnapshot?.revision || 1})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadJson}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Download className="size-3" />
                        JSON İndir
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors shadow-2xs"
                      >
                        <Printer className="size-3" />
                        A4 Yazdır
                      </button>
                    </div>
                  </div>

                  {/* Document Render Area (A4 Container) */}
                  <div className="bg-slate-300/40 p-4 sm:p-8 rounded-2xl flex justify-center border border-slate-200 shadow-inner overflow-x-auto">
                    <div className="bg-white shadow-xl rounded-sm p-4 sm:p-8 w-full max-w-[210mm] min-h-[297mm]">
                      {renderDocument()}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTROLLED OVERRIDES FORM */}
              {activeTab === 'overrides' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <SlidersHorizontal className="size-4 text-indigo-600" />
                      Kontrollü Alanlar ve Kullanıcı Override Editörü
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Bu form, şablon veritabanından bağımsız olarak tek bir revizyon için alanları özelleştirmenize izin
                      verir. Her değişiklik mühürlenir ve denetim geçmişine kaydedilir.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {templateDef?.form?.map((field: any) => {
                      const isOverridden = Object.prototype.hasOwnProperty.call(overrideEdits, field.path)
                      const currentValue = isOverridden
                        ? overrideEdits[field.path]
                        : field.path.startsWith('document.dosya.konu')
                        ? activeSnapshot?.data?.document?.dosya?.konu || ''
                        : field.path.startsWith('document.sozlesme.bedel')
                        ? activeSnapshot?.data?.document?.sozlesme?.bedel || ''
                        : field.path.startsWith('document.sozlesme.sureGun')
                        ? activeSnapshot?.data?.document?.sozlesme?.sureGun || 30
                        : field.path.startsWith('document.dosya.yaklasikMaliyet')
                        ? activeSnapshot?.data?.document?.dosya?.yaklasikMaliyet || ''
                        : field.path.startsWith('global.kurum.ad')
                        ? activeSnapshot?.data?.global?.kurum?.ad || 'T.C. İSTANBUL BÜYÜKŞEHİR BELEDİYESİ'
                        : ''

                      return (
                        <div
                          key={field.path}
                          className={`p-3.5 rounded-xl border transition-all text-xs ${
                            isOverridden
                              ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-100'
                              : 'bg-slate-50/80 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="font-bold text-slate-800 flex items-center gap-2">
                              {field.label}
                              <code className="text-[10px] font-mono text-slate-400 font-normal">
                                {field.path}
                              </code>
                            </label>
                            {isOverridden && (
                              <button
                                type="button"
                                onClick={() => handleRevertField(field.path)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded transition-colors"
                              >
                                <RotateCcw className="size-3" />
                                Kaynak Verisine Sıfırla
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type={field.kind === 'number' ? 'number' : 'text'}
                              value={currentValue ?? ''}
                              onChange={(e) => {
                                setOverrideEdits({
                                  ...overrideEdits,
                                  [field.path]: field.kind === 'number' ? Number(e.target.value) : e.target.value,
                                })
                              }}
                              className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder={`Örn: ${field.label}`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => fetchData(selectedDocId, selectedTemplateId)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      İptal / Yenile
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveRevision}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                    >
                      <Save className="size-4" />
                      {saving ? 'Kaydediliyor...' : 'Değişiklikleri Yeni Revizyon Olarak Mühürle'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: MAPPING CATALOG */}
              {activeTab === 'mapping' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="size-4 text-indigo-600" />
                      Document Engine V4 · Veri Eşleştirme (Mapping) Kataloğu
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Şablonun SQLite tabloları, ilişkileri ve hesaplanan (computed) alanlarla nasıl eşleştirildiğini
                      gösterir.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="py-2.5 px-3">Alan Yolu (Path)</th>
                          <th className="py-2.5 px-3">Görünen Etiket</th>
                          <th className="py-2.5 px-3">Mapping Türü</th>
                          <th className="py-2.5 px-3">Refresh Policy</th>
                          <th className="py-2.5 px-3">Veri Tipi</th>
                          <th className="py-2.5 px-3">Düzenlenebilir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {templateDef?.fields?.map((f: any) => (
                          <tr key={f.path} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-mono text-indigo-700 font-semibold">{f.path}</td>
                            <td className="py-2.5 px-3 text-slate-800">{f.label || '-'}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                                {f.mapping.kind}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  f.refreshPolicy === 'source'
                                    ? 'bg-blue-50 text-blue-700'
                                    : f.refreshPolicy === 'preserve'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {f.refreshPolicy}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">{f.valueType || 'string'}</td>
                            <td className="py-2.5 px-3">
                              {f.editable ? (
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                  <Check className="size-3" /> Evet
                                </span>
                              ) : (
                                <span className="text-slate-400">Hayır</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: SNAPSHOT JSON */}
              {activeTab === 'json' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Code2 className="size-4 text-indigo-600" />
                        Mühürlü Snapshot JSON İnceleyicisi
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Bu veri paketi değişmez (immutable) olarak saklanır ve revizyon numarasıyla imzalanır.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(activeSnapshot, null, 2))
                          setCopiedJson(true)
                          setTimeout(() => setCopiedJson(false), 2000)
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        {copiedJson ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        {copiedJson ? 'Kopyalandı!' : 'JSON Kopyala'}
                      </button>
                      <button
                        onClick={handleDownloadJson}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                      >
                        <Download className="size-3.5" />
                        İndir (.json)
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-emerald-400 max-h-[600px]">
                    <pre>{JSON.stringify(activeSnapshot, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* TAB 5: AUDIT TRAIL */}
              {activeTab === 'audit' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <History className="size-4 text-indigo-600" />
                      İşlem ve Denetim Günlüğü (Audit Trail)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Hangi kullanıcının ne zaman hangi şablon veya snapshot üzerinde revizyon yaptığını izleyin.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="py-2.5 px-3">İşlem</th>
                          <th className="py-2.5 px-3">Revizyon</th>
                          <th className="py-2.5 px-3">Detay</th>
                          <th className="py-2.5 px-3">Operatör</th>
                          <th className="py-2.5 px-3">Zaman</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {auditLogs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-slate-400">
                              Henüz denetim kaydı bulunamadı.
                            </td>
                          </tr>
                        ) : (
                          auditLogs.map((log: any) => (
                            <tr key={log.id} className="hover:bg-slate-50/60">
                              <td className="py-2.5 px-3 font-semibold text-slate-900">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                                  {log.action}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-bold text-indigo-600">#{log.revision}</td>
                              <td className="py-2.5 px-3 text-slate-700">{log.details}</td>
                              <td className="py-2.5 px-3 text-slate-600 font-medium">{log.operator || 'Sistem'}</td>
                              <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                                {new Date(log.createdAt).toLocaleString('tr-TR')}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
