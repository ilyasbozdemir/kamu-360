"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePrintHub } from "@/lib/print-hub-context";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  GitCommit,
  Lock,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Printer,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  ResmiUstYaziData,
  resmiUstYaziDefinition,
} from "@/lib/document-engine/definition";
import { resmiUstYaziResolver } from "@/lib/document-engine/resolver";
import { ResmiUstYaziTemplate } from "@/lib/document-engine/template";
import { RotaAkisCizelgesi } from "@/lib/document-engine/rota-akis-cizelgesi";
import { buildBelgeSnapshot } from "@/lib/document-engine/snapshot";
import {
  BelgeSnapshotKaydi,
  RotaAdimi,
  RotaAdimTuru,
  RotaDurumu,
} from "@/lib/document-engine/types";

export function DocumentBuilder() {
  const { addToPrintQueue } = usePrintHub();
  const initialData = resmiUstYaziResolver.resolve({});
  const [data, setData] = useState<ResmiUstYaziData>(initialData);
  const [sidebarTab, setSidebarTab] = useState<"form" | "ekler" | "rota">(
    "form",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [snapshot, setSnapshot] = useState<BelgeSnapshotKaydi | null>(null);
  const [isSealing, setIsSealing] = useState(false);

  // Ek ve Dağıtım Ekleme
  const [newEk, setNewEk] = useState("");
  const [newDagitim, setNewDagitim] = useState("");

  const handleAddEk = () => {
    if (!newEk.trim()) return;
    setData((prev) => ({ ...prev, ekler: [...prev.ekler, newEk.trim()] }));
    setNewEk("");
  };

  const handleRemoveEk = (idx: number) => {
    setData((prev) => ({
      ...prev,
      ekler: prev.ekler.filter((_, i) => i !== idx),
    }));
  };

  const handleAddDagitim = () => {
    if (!newDagitim.trim()) return;
    setData((prev) => ({
      ...prev,
      dagitim: [...prev.dagitim, newDagitim.trim()],
    }));
    setNewDagitim("");
  };

  const handleRemoveDagitim = (idx: number) => {
    setData((prev) => ({
      ...prev,
      dagitim: prev.dagitim.filter((_, i) => i !== idx),
    }));
  };

  // Rota Adımı Düzenleme
  const handleUpdateRotaStep = (index: number, updates: Partial<RotaAdimi>) => {
    setData((prev) => {
      const nextRota = [...prev.rota];
      nextRota[index] = { ...nextRota[index], ...updates };
      return { ...prev, rota: nextRota };
    });
  };

  const handleAddRotaStep = () => {
    const nextSira = data.rota.length + 1;
    const newStep: RotaAdimi = {
      sira: nextSira,
      tur: "Paraf",
      adSoyad: "Yeni Görevli",
      unvan: "Uzman / Kontrolör",
      durum: "BEKLIYOR",
    };
    setData((prev) => ({ ...prev, rota: [...prev.rota, newStep] }));
  };

  const handleRemoveRotaStep = (index: number) => {
    setData((prev) => ({
      ...prev,
      rota: prev.rota.filter((_, i) => i !== index).map((step, idx) => ({
        ...step,
        sira: idx + 1,
      })),
    }));
  };

  // Mühürleme (Snapshot)
  const handleSealDocument = async () => {
    setIsSealing(true);
    try {
      const snap = await buildBelgeSnapshot(
        "2026/0142",
        resmiUstYaziDefinition.code,
        resmiUstYaziDefinition.version,
        data,
        "lojtest1",
      );
      setSnapshot(snap);
    } finally {
      setIsSealing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) =>
      Math.min(1.2, Math.max(0.5, +(prev + delta).toFixed(2)))
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-58px)] bg-[#f1f3f7] overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex h-[42px] shrink-0 items-center gap-2 border-b border-[#e3e6eb] bg-white px-4 text-[11px] text-[#7b8794] print:hidden">
        <Link
          href="/temin-dosyasi"
          className="flex size-6 items-center justify-center rounded border border-[#d9dee5] bg-white text-[#26384c] shadow-2xs hover:border-[#2d62d7] hover:bg-[#eef3ff] hover:text-[#2d62d7] transition"
          aria-label="Dosya Listesine Dön"
          title="Dosya Listesine Dön (/temin-dosyasi)"
        >
          <ChevronLeft className="size-3.5" />
        </Link>
        <Link href="/" className="hover:text-[#26384c]">⌂ Kamu 360</Link>
        <span className="text-[#adb5bd]">/</span>
        <Link href="/malzeme-bilgisi" className="hover:text-[#26384c]">Satın Alma Yönetimi</Link>
        <span className="text-[#adb5bd]">/</span>
        <span className="font-semibold text-[#26384c]">Belge Oluşturucu (Document Builder)</span>
      </div>

      {/* 1. ÜST STÜDYO ARAÇ ÇUBUĞU (STUDIO TOOLBAR) */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#dfe3e9] bg-white px-4 py-2.5 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-1.5 rounded-md border border-[#d1d5db] bg-[#fafbfc] px-2.5 py-1.5 text-[11px] font-semibold text-[#475569] transition hover:bg-[#eef3ff] hover:text-[#2d62d7]"
            title={isSidebarOpen ? "Sol Paneli Daralt" : "Sol Paneli Genişlet"}
          >
            {isSidebarOpen
              ? (
                <>
                  <PanelLeftClose className="size-4 text-[#2d62d7]" />
                  <span className="hidden sm:inline">Form Panelini Gizle</span>
                </>
              )
              : (
                <>
                  <PanelLeftOpen className="size-4 text-[#2d62d7]" />
                  <span className="hidden sm:inline">Form Panelini Göster</span>
                </>
              )}
          </button>

          <div className="h-5 w-px bg-[#e2e8f0] hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#172334]">
                EBYS Belge Stüdyosu
              </span>
              <span className="rounded bg-[#eef3ff] px-2 py-0.5 font-mono text-[10px] font-bold text-[#2d62d7]">
                {resmiUstYaziDefinition.code} v{resmiUstYaziDefinition.version}
              </span>
            </div>
          </div>
        </div>

        {/* Orta: Zoom / Ölçek Kontrolleri */}
        <div className="flex items-center gap-1.5 rounded-lg border border-[#dfe3e9] bg-[#f8f9fb] px-2 py-1 text-[11px]">
          <button
            type="button"
            onClick={() => handleZoom(-0.1)}
            className="rounded p-1 text-[#475569] hover:bg-white hover:text-[#172334]"
            title="Uzaklaştır (% -10)"
          >
            <ZoomOut className="size-3.5" />
          </button>

          <span className="w-12 text-center font-mono text-[11px] font-bold text-[#1e293b]">
            %{Math.round(zoomLevel * 100)}
          </span>

          <button
            type="button"
            onClick={() => handleZoom(0.1)}
            className="rounded p-1 text-[#475569] hover:bg-white hover:text-[#172334]"
            title="Yakınlaştır (% +10)"
          >
            <ZoomIn className="size-3.5" />
          </button>

          <div className="mx-1 h-3.5 w-px bg-[#cbd5e1]" />

          <button
            type="button"
            onClick={() => setZoomLevel(0.75)}
            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
              zoomLevel === 0.75
                ? "bg-[#2d62d7] text-white"
                : "text-[#64748b] hover:bg-white"
            }`}
          >
            %75
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(0.85)}
            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
              zoomLevel === 0.85
                ? "bg-[#2d62d7] text-white"
                : "text-[#64748b] hover:bg-white"
            }`}
          >
            %85 (Önerilen)
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
              zoomLevel === 1
                ? "bg-[#2d62d7] text-white"
                : "text-[#64748b] hover:bg-white"
            }`}
          >
            %100
          </button>
        </div>

        {/* Sağ: Aksiyon Butonları */}
        <div className="flex items-center gap-2">
          <Link
            href="/temin-dosyasi"
            className="inline-flex items-center rounded-md border border-blue-300 bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-[#2d62d7] transition hover:bg-blue-100"
          >
            <FileSpreadsheet className="mr-1.5 size-3.5" /> Doğrudan Temin Şablonları
          </Link>

          <Link
            href="/is-akislari"
            className="inline-flex items-center rounded-md border border-[#009688] bg-teal-50 px-2.5 py-1.5 text-[11px] font-semibold text-[#009688] transition hover:bg-teal-100"
          >
            <GitCommit className="mr-1.5 size-3.5" /> Rota İşlemleri (EBYS)
          </Link>

          <button
            type="button"
            onClick={() =>
              addToPrintQueue({
                docNo: data.sayi,
                title: `${data.konu} (EBYS Resmî Yazı)`,
                category: "EBYS Resmî Yazı",
                format: "EBYS e-İmzalı PDF",
                pageCount: 1,
              })}
            className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-[#2d62d7] transition hover:bg-blue-100"
            title="Belgeyi Yazdırma ve Dışa Aktarma Merkezine Gönder"
          >
            <Printer className="mr-1.5 size-3.5" /> Yazdırma Merkezine Gönder
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center rounded-md border border-[#dfe3e9] bg-white px-3 py-1.5 text-[11px] font-medium text-[#334155] transition hover:bg-[#f8f9fb]"
          >
            <Printer className="mr-1.5 size-3.5" /> Hızlı Yazdır
          </button>

          <button
            type="button"
            onClick={handleSealDocument}
            disabled={isSealing || !!snapshot}
            className={`inline-flex items-center rounded-md px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs transition ${
              snapshot ? "bg-emerald-600" : "bg-[#2d62d7] hover:bg-[#2455bd]"
            }`}
          >
            {snapshot
              ? (
                <>
                  <Lock className="mr-1.5 size-3.5" /> Mühürlendi
                </>
              )
              : (
                <>
                  <ShieldCheck className="mr-1.5 size-3.5" /> Mühürle & Kilit
                </>
              )}
          </button>
        </div>
      </div>

      {/* 2. ANA ÇALIŞMA ALANI: SOL FORM SIDEBAR + SAĞ A4 SHEET ÇALIŞMA ALANI */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* SOL PANEL (SIDEBAR FORM & INSPECTOR) */}
        {isSidebarOpen && (
          <aside className="w-full sm:w-[380px] lg:w-[420px] shrink-0 border-r border-[#dfe3e9] bg-white flex flex-col h-full print:hidden">
            {/* Sidebar Üst Sekmeler */}
            <div className="flex border-b border-[#edf0f4] bg-[#f8f9fb] px-2 pt-2 text-[11px]">
              <button
                type="button"
                onClick={() => setSidebarTab("form")}
                className={`flex-1 border-b-2 py-2 text-center font-semibold transition ${
                  sidebarTab === "form"
                    ? "border-[#2d62d7] text-[#2d62d7] bg-white"
                    : "border-transparent text-[#64748b] hover:text-[#172334]"
                }`}
              >
                <Edit3 className="inline size-3.5 mr-1" /> Belge & Metin
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab("ekler")}
                className={`flex-1 border-b-2 py-2 text-center font-semibold transition ${
                  sidebarTab === "ekler"
                    ? "border-[#2d62d7] text-[#2d62d7] bg-white"
                    : "border-transparent text-[#64748b] hover:text-[#172334]"
                }`}
              >
                <FileText className="inline size-3.5 mr-1" />{" "}
                Ek & Dağıtım ({data.ekler.length})
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab("rota")}
                className={`flex-1 border-b-2 py-2 text-center font-semibold transition ${
                  sidebarTab === "rota"
                    ? "border-[#2d62d7] text-[#2d62d7] bg-white"
                    : "border-transparent text-[#64748b] hover:text-[#172334]"
                }`}
              >
                <GitCommit className="inline size-3.5 mr-1" />{" "}
                Onay Rotası ({data.rota.length})
              </button>
            </div>

            {/* Sidebar İçerik Alanı (Kaydırılabilir) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[11px]">
              {/* TAB 1: FORM & METİN */}
              {sidebarTab === "form" && (
                <div className="space-y-3.5">
                  {/* Gizlilik ve İvedilik Dereceleri */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block font-semibold text-[#334155]">
                        Gizlilik Derecesi
                      </label>
                      <select
                        value={data.gizlilikDerecesi || "NORMAL"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            gizlilikDerecesi: e.target.value as any,
                          })}
                        className="w-full rounded border border-[#cbd5e1] bg-white px-2 py-1.5 text-[11px] font-medium text-[#334155] focus:border-[#2d62d7] focus:outline-hidden"
                      >
                        <option value="NORMAL">Normal</option>
                        <option value="HİZMETE ÖZEL">Hizmete Özel</option>
                        <option value="KİŞİYE ÖZEL">Kişiye Özel</option>
                        <option value="GİZLİ">Gizli</option>
                        <option value="ÇOK GİZLİ">Çok Gizli</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-[#334155]">
                        İvedilik Derecesi
                      </label>
                      <select
                        value={data.ivedilikDerecesi || "NORMAL"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            ivedilikDerecesi: e.target.value as any,
                          })}
                        className="w-full rounded border border-[#cbd5e1] bg-white px-2 py-1.5 text-[11px] font-medium text-[#334155] focus:border-[#2d62d7] focus:outline-hidden"
                      >
                        <option value="NORMAL">Normal</option>
                        <option value="GÜNLÜDÜR">Günlüdür</option>
                        <option value="ACELE">Acele</option>
                      </select>
                    </div>
                  </div>

                  {/* Kurum ve Birim Anteti */}
                  <div>
                    <label className="mb-1 block font-semibold text-[#334155]">
                      Kurum / İdare Adı (Antet)
                    </label>
                    <input
                      type="text"
                      value={data.kurumAdi || ""}
                      onChange={(e) =>
                        setData({ ...data, kurumAdi: e.target.value })}
                      className="w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[11px] font-bold text-[#1e293b] focus:border-[#2d62d7] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-[#334155]">
                      Ana Birim / Daire Başkanlığı
                    </label>
                    <input
                      type="text"
                      value={data.birimAdi || ""}
                      onChange={(e) =>
                        setData({ ...data, birimAdi: e.target.value })}
                      className="w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[11px] focus:border-[#2d62d7] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-[#334155]">
                      Sayı (DETSİS / Dosya Planı / Evrak No)
                    </label>
                    <input
                      type="text"
                      value={data.sayi}
                      onChange={(e) =>
                        setData({ ...data, sayi: e.target.value })}
                      className="w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[11px] font-mono focus:border-[#2d62d7] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-[#334155]">
                      Belge Tarihi
                    </label>
                    <input
                      type="text"
                      value={data.tarih}
                      onChange={(e) =>
                        setData({ ...data, tarih: e.target.value })}
                      className="w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[11px] focus:border-[#2d62d7] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-[#334155]">
                      Konu
                    </label>
                    <input
                      type="text"
                      value={data.konu}
                      onChange={(e) =>
                        setData({ ...data, konu: e.target.value })}
                      className="w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[11px] focus:border-[#2d62d7] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="mb-1 block font-semibold text-[#334155]">
                        Muhatap Makam
                      </label>
                      <input
                        type="text"
                        value={data.muhatap}
                        onChange={(e) =>
                          setData({ ...data, muhatap: e.target.value })}
                        className="w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[11px] uppercase font-bold text-[#1e293b] focus:border-[#2d62d7] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-semibold text-[#334155]">
                        Yer
                      </label>
                      <input
                        type="text"
                        value={data.muhatapYer || ""}
                        onChange={(e) =>
                          setData({ ...data, muhatapYer: e.target.value })}
                        className="w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[11px] uppercase focus:border-[#2d62d7] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-[#334155]">
                      İlgi (Dayanak Yazı)
                    </label>
                    <input
                      type="text"
                      value={data.ilgi || ""}
                      onChange={(e) =>
                        setData({ ...data, ilgi: e.target.value })}
                      placeholder="Örn: 15.07.2024 tarihli ve 2024/941 sayılı talep yazısı."
                      className="w-full rounded border border-[#cbd5e1] px-2.5 py-1.5 text-[11px] italic focus:border-[#2d62d7] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-[#334155]">
                        Belge Gövde Metni
                      </label>
                      <span className="text-[10px] text-[#94a3b8]">
                        {data.metin.length} karakter
                      </span>
                    </div>
                    <textarea
                      rows={8}
                      value={data.metin}
                      onChange={(e) =>
                        setData({ ...data, metin: e.target.value })}
                      className="w-full rounded border border-[#cbd5e1] p-2.5 text-[11px] leading-relaxed focus:border-[#2d62d7] focus:outline-hidden resize-y font-sans"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: EKLER & DAĞITIM */}
              {sidebarTab === "ekler" && (
                <div className="space-y-5">
                  {/* Ekler */}
                  <div>
                    <label className="mb-2 block font-bold text-[#172334]">
                      Belge Ekleri (EK)
                    </label>
                    <div className="space-y-1.5">
                      {data.ekler.map((ek, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-md border border-[#e2e8f0] bg-[#fafbfc] px-2.5 py-1.5 text-[11px]"
                        >
                          <span className="truncate pr-2 text-[#334155]">
                            {idx + 1}. {ek}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEk(idx)}
                            className="text-[#94a3b8] hover:text-rose-600"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-1.5">
                      <input
                        type="text"
                        value={newEk}
                        onChange={(e) => setNewEk(e.target.value)}
                        placeholder="Yeni ek açıklaması..."
                        className="flex-1 rounded border border-[#cbd5e1] px-2.5 py-1 text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={handleAddEk}
                        className="rounded bg-[#2d62d7] px-3 py-1 font-bold text-white hover:bg-[#2455bd]"
                      >
                        Ekle
                      </button>
                    </div>
                  </div>

                  {/* Dağıtım */}
                  <div className="border-t border-[#edf0f4] pt-4">
                    <label className="mb-2 block font-bold text-[#172334]">
                      Dağıtım Listesi
                    </label>
                    <div className="space-y-1.5">
                      {data.dagitim.map((d, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-md border border-[#e2e8f0] bg-[#fafbfc] px-2.5 py-1.5 text-[11px]"
                        >
                          <span className="truncate pr-2 text-[#334155]">
                            {d}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDagitim(idx)}
                            className="text-[#94a3b8] hover:text-rose-600"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-1.5">
                      <input
                        type="text"
                        value={newDagitim}
                        onChange={(e) => setNewDagitim(e.target.value)}
                        placeholder="Örn: Bilgi: Mali Hizmetler Dairesi"
                        className="flex-1 rounded border border-[#cbd5e1] px-2.5 py-1 text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={handleAddDagitim}
                        className="rounded bg-[#2d62d7] px-3 py-1 font-bold text-white hover:bg-[#2455bd]"
                      >
                        Ekle
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ONAY ROTASI */}
              {sidebarTab === "rota" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172334]">
                      EBYS Onay Heyeti
                    </span>
                    <button
                      type="button"
                      onClick={handleAddRotaStep}
                      className="rounded bg-[#eef3ff] px-2.5 py-1 text-[10px] font-bold text-[#2d62d7] hover:bg-[#2d62d7] hover:text-white transition-colors"
                    >
                      + Yeni Adım Ekle
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {data.rota.map((step, idx) => (
                      <div
                        key={step.sira}
                        className="rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1e293b]">
                            {step.sira}. {step.tur}
                          </span>
                          <select
                            value={step.durum}
                            onChange={(e) =>
                              handleUpdateRotaStep(idx, {
                                durum: e.target.value as RotaDurumu,
                              })}
                            className={`rounded border px-2 py-0.5 text-[10px] font-bold ${
                              step.durum === "ONAYLANDI"
                                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                : "border-amber-400 bg-amber-50 text-amber-800"
                            }`}
                          >
                            <option value="BEKLIYOR">BEKLİYOR</option>
                            <option value="ONAYLANDI">ONAYLANDI</option>
                            <option value="REDDEDILDI">REDDEDİLDİ</option>
                          </select>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={step.adSoyad}
                            onChange={(e) =>
                              handleUpdateRotaStep(idx, {
                                adSoyad: e.target.value,
                              })}
                            placeholder="Ad Soyad"
                            className="w-full rounded border border-[#cbd5e1] bg-white px-2 py-1 text-[11px] font-semibold"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={step.unvan}
                            onChange={(e) =>
                              handleUpdateRotaStep(idx, {
                                unvan: e.target.value,
                              })}
                            placeholder="Ünvan"
                            className="w-full rounded border border-[#cbd5e1] bg-white px-2 py-1 text-[10px] text-[#64748b]"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px]">
                          <select
                            value={step.tur}
                            onChange={(e) =>
                              handleUpdateRotaStep(idx, {
                                tur: e.target.value as RotaAdimTuru,
                              })}
                            className="rounded border border-[#cbd5e1] bg-white px-2 py-0.5"
                          >
                            <option value="Hazırlayan">Hazırlayan</option>
                            <option value="Paraf">Paraf</option>
                            <option value="İmza">İmza</option>
                            <option value="Bilgi">Bilgi</option>
                            <option value="Onay">Onay</option>
                          </select>

                          {data.rota.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRotaStep(idx)}
                              className="text-rose-500 hover:underline"
                            >
                              Adımı Sil
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <RotaAkisCizelgesi adimlar={data.rota} />
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* SAĞ ÇALIŞMA ALANI: A4 SAYFA CANVAS ALANI */}
        <main className="flex-1 min-w-0 bg-[#252f3e] flex flex-col items-center overflow-auto p-4 sm:p-6 select-none relative">
          {/* Mühür Bildirim Şeridi */}
          {snapshot && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-md border border-emerald-400 bg-emerald-950/80 px-4 py-2 text-[11px] text-emerald-200 shadow-md backdrop-blur-sm print:hidden max-w-xl w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span>
                  Belge <strong>{snapshot.sealedBy}</strong>{" "}
                  tarafından mühürlenmiştir.
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded">
                SHA-256: {snapshot.contentHash.substring(0, 14)}...
              </span>
            </div>
          )}

          {/* Sayfa Başlık Göstergesi */}
          <div className="mb-3 flex items-center gap-2 text-[10px] font-mono text-[#94a3b8] print:hidden">
            <span>Sayfa 1 / 1</span>
            <span>•</span>
            <span>A4 (210mm × 297mm) Dikey</span>
            <span>•</span>
            <span>Ölçek: %{Math.round(zoomLevel * 100)}</span>
          </div>

          {/* ÖLÇEKLENDİRİLMİŞ A4 SHEET CONTAINER */}
          <div
            className="transition-transform duration-150 origin-top shadow-2xl rounded-xs select-text"
            style={{
              transform: `scale(${zoomLevel})`,
              marginBottom: `${(zoomLevel - 1) * 350}px`,
            }}
          >
            <ResmiUstYaziTemplate data={data} />
          </div>
        </main>
      </div>
    </div>
  );
}
