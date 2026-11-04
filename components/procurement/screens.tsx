"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Edit2,
  Eye,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  GitBranch,
  Layers,
  MoreVertical,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Scale,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { usePrintHub } from "@/lib/print-hub-context";
import { UniversalDocumentModal } from "@/components/document-preview/universal-document-modal";
import {
  ORNEK_TEMIN_DOSYALARI,
  TeminDosyasiKaydi,
} from "@/lib/temin-dosyasi/schema";
import {
  Accordion,
  AccordionGroup,
  AttachmentsBox,
  Badge,
  Divider,
  Field,
  FieldGrid,
  type FieldSpec,
  NotesBox,
  OutlineButton,
  PrimaryButton,
  SimpleTable,
} from "./primitives";

const COMPANY = "AKM - Akme Teknoloji Çözümleri A.Ş.";
const LOCATION = "AKM-ANK - Akme Ankara ODTÜ Teknokent";
const GROUP = "001 - Yurtiçi Satınalma Grubu";
const OWNER = "01 - Hammadde Malzeme Alımları - Abdulkadir İlci";
const PARTNER = "2024-0026 - Turuncu Ofis Bilişim";

export type ScreenDef = {
  slug: string;
  title: string;
  docNo: string;
  badges?: { tone: "gray" | "cyan" | "green" | "blue"; text: string }[];
  hasAttachmentIcon?: boolean;
  left: FieldSpec[];
  leftAction?: string;
  body: ReactNode;
  footer?: boolean;
};

/* ---------- Ekran 1: Malzeme Satın Alma Bilgisi ---------- */
function MaterialInfoBody() {
  const [activeTab, setActiveTab] = useState<"genel" | "fiyat" | "notlar">(
    "genel",
  );

  return (
    <div className="space-y-3.5">
      {/* Sekmeler */}
      <div className="flex border-b border-[#e2e8f0] bg-[#f8f9fb] px-2 pt-1 text-[12px]">
        <button
          type="button"
          onClick={() => setActiveTab("genel")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "genel"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          Genel &amp; Satın Alma Bilgileri
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("fiyat")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "fiyat"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          Birim Fiyat &amp; Koşullar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notlar")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "notlar"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          Notlar &amp; Ekler
        </button>
      </div>

      {/* Sekme 1: Genel Bilgiler */}
      {activeTab === "genel" && (
        <div className="rounded-lg border border-[#e2e8f0] bg-white p-4 space-y-4">
          <FieldGrid
            fields={[
              { label: "Satıcı Malzeme Kodu" },
              { label: "Muhattap" },
              { label: "Telefon" },
              { label: "E-Mail Adresi" },
              { label: "Sınırsız Teslimat", kind: "check" },
            ]}
          />
          <Divider />
          <div className="max-w-xs">
            <Field
              spec={{ label: "Teslimat Süresi", kind: "unit", unit: "Gün" }}
            />
          </div>
          <Divider />
          <FieldGrid
            fields={[
              {
                label: "Satın Alma Ölçü Birimi",
                kind: "select",
                options: ["Adet", "Kutu", "Koli", "Kg"],
              },
              { label: "Sipariş Miktarı", kind: "range" },
              {
                label: "Teslimat Toleransı",
                kind: "range",
                placeholders: ["Alt", "Üst"],
              },
              { label: "Üretici" },
              {
                label: "Üretici Ülke",
                kind: "select",
                options: ["Türkiye", "Almanya", "ABD", "Çin"],
              },
              { label: "Birim Fiyat", kind: "number" },
              {
                label: "Satın Alma Para Birimi",
                kind: "select",
                options: ["TRY", "USD", "EUR"],
              },
              {
                label: "Satın Alma KDV Oranı",
                kind: "select",
                options: ["%1", "%10", "%20"],
              },
            ]}
          />
          <Divider />
          <div className="flex justify-end">
            <PrimaryButton>Kaydet</PrimaryButton>
          </div>
        </div>
      )}

      {/* Sekme 2: Birim Fiyat ve İndirim/Arttırım */}
      {activeTab === "fiyat" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2.5">
              Kademeli Birim Fiyat Tablosu
            </h4>
            <SimpleTable
              columns={[
                "Geçerlilik Başlangıcı",
                "Geçerlilik Bitişi",
                "Alt Miktar",
                "Birim Fiyat",
                "Para Birimi",
              ]}
              rows={[
                ["17.07.2024", "31.12.2024", "1", "1.250,00", "TRY"],
                ["01.01.2025", "31.12.2025", "1", "1.380,00", "TRY"],
              ]}
            />
          </div>

          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2.5">
              İndirim &amp; Arttırım Koşulları
            </h4>
            <FieldGrid
              fields={[
                {
                  label: "Koşul Türü",
                  kind: "select",
                  options: ["İskonto", "Arttırım", "Nakliye", "Sigorta"],
                },
                {
                  label: "Hesaplama Tipi",
                  kind: "select",
                  options: ["Oran", "Tutar"],
                },
                { label: "Oran / Tutar", kind: "number" },
                {
                  label: "Para Birimi",
                  kind: "select",
                  options: ["TRY", "USD", "EUR"],
                },
              ]}
            />
            <div className="mt-3 flex justify-end">
              <PrimaryButton>Koşul Ekle</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Sekme 3: Notlar ve Ekler */}
      {activeTab === "notlar" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2">
              Belge Notları
            </h4>
            <NotesBox />
          </div>
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2">
              Resmî Ekler
            </h4>
            <AttachmentsBox />
          </div>
        </div>
      )}

      {/* Süreç ve Entegrasyon Aksiyonları Kartı */}
      <div className="rounded-lg border border-[#e1e5ea] bg-blue-50/40 p-4 shadow-2xs">
        <h4 className="mb-2 flex items-center gap-1.5 text-[12px] font-bold text-[#172334]">
          <Sparkles className="size-4 text-[#2d62d7]" />
          <span>Malzeme Süreç Entegrasyonları &amp; Sonraki Adımlar</span>
        </h4>
        <p className="mb-3 text-[11px] text-gray-600">
          Bu malzeme ve tedarikçi koşullarını onaylayıp doğrudan teklif toplama
          matrisine aktarabilir, veya 22/d doğrudan temin piyasa fiyat
          araştırması başlatabilirsiniz.
        </p>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/teklif-degerlendirme"
            className="inline-flex items-center gap-1.5 rounded bg-[#2d62d7] px-4 py-2 text-[11.5px] font-bold text-white shadow-xs transition hover:bg-[#2455bd]"
          >
            <span>Teklif Değerlendirmeye Aktar</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/dogrudan-temin"
            className="inline-flex items-center gap-1.5 rounded border border-[#2d62d7] bg-[#f2f5ff] px-3.5 py-2 text-[11.5px] font-bold text-[#2d62d7] transition hover:bg-[#2d62d7] hover:text-white"
          >
            <span>22/d Doğrudan Temin Başlat</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/is-akislari"
            className="inline-flex items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#172334] shadow-xs transition hover:border-[#2d62d7] hover:text-[#2d62d7]"
          >
            <FileSignature className="size-3.5 text-[#2d62d7]" />
            <span>EBYS Talep / Onay Yazısı Düzenle</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Ekran 2: Teklif Değerlendirme & Piyasa Fiyat Araştırması ---------- */
interface BidderFirm {
  id: string;
  name: string;
  taxNo: string;
  date: string;
}

interface EvaluationItem {
  id: number;
  code: string;
  name: string;
  qty: number;
  unit: string;
  prices: Record<string, number>; // firmId -> birim fiyat (TL)
}

const fmt = (n: number) =>
  n.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function EvaluationBody() {
  const { addToPrintQueue } = usePrintHub();
  const [activeTab, setActiveTab] = useState<"matris" | "firmalar" | "notlar">(
    "matris",
  );

  // 1. İstekliler / Teklif Veren Firmalar (Kanunen En Az 3 Firma)
  const [firms, setFirms] = useState<BidderFirm[]>([
    {
      id: "f1",
      name: "2024-0026 - Turuncu Ofis Bilişim Ltd. Şti.",
      taxNo: "8491029410",
      date: "2026-03-02",
    },
    {
      id: "f2",
      name: "2024-0022 - Financial Technologies Administration A.Ş.",
      taxNo: "3819401829",
      date: "2026-03-02",
    },
    {
      id: "f3",
      name: "2024-0031 - Bilge Kırtasiye ve Büro Malzemeleri Ltd.",
      taxNo: "1948102948",
      date: "2026-03-03",
    },
  ]);

  // 2. Malzeme Kalemleri ve Birim Fiyatları
  const [items, setItems] = useState<EvaluationItem[]>([
    {
      id: 1,
      code: "2024-0010",
      name: "HP 658A Orijinal Siyah Toner (W2000A)",
      qty: 10,
      unit: "Adet",
      prices: { f1: 3200, f2: 3350, f3: 3400 },
    },
    {
      id: 2,
      code: "2024-0033",
      name: "Std Hs-2 Toner Kartuşu",
      qty: 4,
      unit: "Adet",
      prices: { f1: 1250, f2: 1180, f3: 1300 },
    },
    {
      id: 3,
      code: "2024-0042",
      name: "A4 Fotokopi Kağıdı 80 gr (Koli)",
      qty: 20,
      unit: "Koli",
      prices: { f1: 820, f2: 860, f3: 880 },
    },
  ]);

  // Kazanan firma seçimi (manuel değiştirilebilir)
  const [selectedFirmId, setSelectedFirmId] = useState<string>("f1");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Canlı Belge Modal State'leri
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeDocCode, setActiveDocCode] = useState<string>("DOC_PIYASA_01");

  // Firma Toplamları Hesaplaması
  const firmTotals = useMemo(() => {
    const totals: Record<
      string,
      { subtotal: number; vat: number; grand: number }
    > = {};
    firms.forEach((f) => {
      let sub = 0;
      items.forEach((item) => {
        const p = item.prices[f.id] || 0;
        sub += p * item.qty;
      });
      const vat = sub * 0.2;
      totals[f.id] = { subtotal: sub, vat, grand: sub + vat };
    });
    return totals;
  }, [firms, items]);

  // En Düşük Teklif Veren Firma
  const lowestFirmId = useMemo(() => {
    if (firms.length === 0) return "";
    let minId = firms[0].id;
    let minSub = firmTotals[minId]?.subtotal ?? Infinity;
    firms.forEach((f) => {
      const sub = firmTotals[f.id]?.subtotal ?? Infinity;
      if (sub < minSub) {
        minSub = sub;
        minId = f.id;
      }
    });
    return minId;
  }, [firms, firmTotals]);

  // Otomatik kazanan eşleşmesi
  useEffect(() => {
    if (lowestFirmId && !selectedFirmId) {
      setSelectedFirmId(lowestFirmId);
    }
  }, [lowestFirmId, selectedFirmId]);

  // Yaklaşık Maliyet (Firma Birim Fiyatlarının Aritmetik Ortalaması)
  const yaklasikMaliyet = useMemo(() => {
    let top = 0;
    items.forEach((item) => {
      const firmPrices = firms.map((f) => item.prices[f.id] || 0);
      const ort = firmPrices.length
        ? firmPrices.reduce((a, b) => a + b, 0) / firmPrices.length
        : 0;
      top += ort * item.qty;
    });
    return top;
  }, [items, firms]);

  // Birim Fiyat Değiştirme
  const handlePriceChange = (itemId: number, firmId: string, val: string) => {
    const numVal = parseFloat(val.replace(",", ".")) || 0;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            prices: {
              ...item.prices,
              [firmId]: numVal,
            },
          };
        }
        return item;
      })
    );
  };

  // Yeni Firma Ekleme
  const handleAddFirm = () => {
    const newId = `f${firms.length + 1}`;
    const newName = `Yeni İstekli Firma ${firms.length + 1}`;
    setFirms((
      prev,
    ) => [...prev, {
      id: newId,
      name: newName,
      taxNo: "1111111111",
      date: new Date().toISOString().split("T")[0],
    }]);
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        prices: { ...item.prices, [newId]: 1000 },
      }))
    );
    setToastMsg(`"${newName}" başarıyla listeye eklendi!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Yeni Kalem Ekleme
  const handleAddItem = () => {
    const newId = items.length + 1;
    const newItem: EvaluationItem = {
      id: newId,
      code: `2024-00${40 + newId}`,
      name: `Yeni Malzeme / Hizmet Kalemi ${newId}`,
      qty: 1,
      unit: "Adet",
      prices: {},
    };
    firms.forEach((f) => {
      newItem.prices[f.id] = 500;
    });
    setItems((prev) => [...prev, newItem]);
    setToastMsg("Yeni malzeme kalemi eklendi!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Kalem Silme
  const handleDeleteItem = (id: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Dinamik Temin Dosyası Sentezi (All-Templates için)
  const winningFirm = firms.find((f) => f.id === selectedFirmId) || firms[0];
  const currentDosyaVerisi: TeminDosyasiKaydi = {
    ...ORNEK_TEMIN_DOSYALARI[0],
    id: 101,
    temin_no: "2026/DT-001",
    dosya_acilis_tarihi: new Date().toISOString().split("T")[0],
    butce_yili: 2026,
    butce_tipi: "Genel Bütçe",
    konu: "Destek Hizmetleri Toner ve Büro Sarf Malzemesi Alımı",
    birim: "Destek Hizmetleri Dairesi Başkanlığı - Satınalma Şube Müdürlüğü",
    sunulacak_makam: "HARCAMA YETKİLİSİ MAKAMINA",
    ihtiyac_yeri: "Ankara Büyükşehir Belediyesi Hizmet Binası",
    ihale_sekli: "22/d Doğrudan Temin",
    yaklasik_maliyet: yaklasikMaliyet,
    net_odenen: firmTotals[winningFirm.id]?.subtotal ?? 0,
    kazanan_firma_adi: winningFirm.name,
    firmalar: firms.map((f, idx) => ({
      sira_no: idx + 1,
      firma_adi: f.name,
      toplam_teklif: firmTotals[f.id]?.subtotal ?? 0,
      kdv_durumu: "Hariç",
      teklif_tarihi: f.date,
      kazanan_mi: f.id === winningFirm.id,
      degerlendirme_sonucu: f.id === winningFirm.id
        ? "En Avantajlı Teklif (Uygun)"
        : `${idx + 1}. Teklif`,
    })),
    kalemler: items.map((item, idx) => {
      const f1 = item.prices[firms[0]?.id] || 0;
      const f2 = item.prices[firms[1]?.id] || 0;
      const f3 = item.prices[firms[2]?.id] || 0;
      const ort = (f1 + f2 + f3) / (firms.length || 1);
      return {
        sira_no: idx + 1,
        kalem_kodu: item.code,
        kalem_adi: item.name,
        birim: item.unit,
        miktar: item.qty,
        fiyat1: f1,
        fiyat2: f2,
        fiyat3: f3,
        yaklasik_birim_fiyat: ort,
        toplam_tutar: ort * item.qty,
        kdv_orani: 20,
      };
    }),
  };

  // Canlı Belge Aç
  const handleOpenDocModal = (docCode: string) => {
    setActiveDocCode(docCode);
    setPreviewModalOpen(true);
  };

  // Toplu Kuyruğa Gönder
  const handleKuyrugaTopluEkle = () => {
    addToPrintQueue({
      title: "Piyasa Fiyat Araştırma Tutanağı (3 Firma Teklifi)",
      docNo: "DOC_PIYASA_01",
      dosyaNo: "2026/DT-001",
      dosyaAdi: "Destek Hizmetleri Toner ve Büro Sarf Malzemesi Alımı",
      category: "Doğrudan Temin (22/d)",
      format: "A4 Dikey",
      pageCount: 1,
    });
    addToPrintQueue({
      title: "Yaklaşık Maliyet Hesap Cetveli",
      docNo: "DOC_YAKLASIK_MALIYET",
      dosyaNo: "2026/DT-001",
      dosyaAdi: "Destek Hizmetleri Toner ve Büro Sarf Malzemesi Alımı",
      category: "Doğrudan Temin (22/d)",
      format: "A4 Dikey",
      pageCount: 1,
    });
    addToPrintQueue({
      title: "Birim Fiyat Teklif Mektubu",
      docNo: "DOC_TEKLIF_MEKTUBU",
      dosyaNo: "2026/DT-001",
      dosyaAdi: "Destek Hizmetleri Toner ve Büro Sarf Malzemesi Alımı",
      category: "Doğrudan Temin (22/d)",
      format: "A4 Dikey",
      pageCount: 1,
    });
    setToastMsg(
      "Tüm değerlendirme ve piyasa araştırma belgeleri Yazdırma Merkezine eklendi!",
    );
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-3.5">
      {/* Toast Mesajı */}
      {toastMsg && (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800 animate-in fade-in">
          {toastMsg}
        </div>
      )}

      {/* 1. ÜST BELGE BASTIRMA VE DIŞA AKTARMA MERKEZİ (CANLI ACTION BAR) */}
      <div className="rounded-lg border border-[#2d62d7]/30 bg-[#f0f4fd] p-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded bg-[#2d62d7] text-white">
              <Printer className="size-4" />
            </span>
            <div>
              <h4 className="text-[12px] font-bold text-[#172334]">
                Piyasa Araştırması Resmî Belge Yazdırma &amp; Matbu Önizleme
              </h4>
              <p className="text-[10px] text-[#5b6877]">
                Aşağıdaki butonlarla teklif verilerini doğrudan yasal 31151 A4
                şablonlarına aktarabilir ve yazdırabilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleOpenDocModal("DOC_PIYASA_01")}
              className="flex h-7 items-center gap-1 rounded border border-[#2d62d7] bg-white px-2.5 text-[11px] font-bold text-[#2d62d7] transition hover:bg-[#2d62d7] hover:text-white shadow-2xs"
              title="3 Firma Teklifini Karşılaştıran Yasal Tutanağı Canlı Bastır"
            >
              <Eye className="size-3.5" />
              <span>Piyasa Fiyat Tutanağı (A4)</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenDocModal("DOC_YAKLASIK_MALIYET")}
              className="flex h-7 items-center gap-1 rounded border border-[#2d62d7] bg-white px-2.5 text-[11px] font-bold text-[#2d62d7] transition hover:bg-[#2d62d7] hover:text-white shadow-2xs"
              title="Aritmetik Ortalama Yaklaşık Maliyet Cetvelini Bastır"
            >
              <FileSpreadsheet className="size-3.5" />
              <span>Yaklaşık Maliyet Cetveli</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenDocModal("DOC_TEKLIF_MEKTUBU")}
              className="flex h-7 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2 text-[10.5px] font-medium text-[#172334] transition hover:border-[#2d62d7] hover:text-[#2d62d7]"
              title="İstekli Firmaların Teklif Mektuplarını Bastır"
            >
              <FileText className="size-3.5" />
              <span>Teklif Mektubu</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenDocModal("DOC_ONAY_01")}
              className="flex h-7 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2 text-[10.5px] font-medium text-[#172334] transition hover:border-[#2d62d7] hover:text-[#2d62d7]"
              title="22/d Harcama Talimatı / İhale Onay Belgesini Aç"
            >
              <FileCheck2 className="size-3.5" />
              <span>Onay Belgesi</span>
            </button>

            <button
              type="button"
              onClick={handleKuyrugaTopluEkle}
              className="flex h-7 items-center gap-1 rounded bg-[#2d62d7] px-2.5 text-[11px] font-bold text-white transition hover:bg-[#2455bd] shadow-2xs"
              title="Tüm belgeleri Yazdırma Kuyruğuna Gönder"
            >
              <Plus className="size-3" />
              <span>Kuyruğa Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SEKMELER */}
      <div className="flex border-b border-[#e2e8f0] bg-[#f8f9fb] px-2 pt-1 text-[12px]">
        <button
          type="button"
          onClick={() => setActiveTab("matris")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "matris"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          Piyasa Araştırması &amp; Malzeme Fiyat Matrisi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("firmalar")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "firmalar"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          Teklif Veren İstekliler / Firmalar ({firms.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notlar")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "notlar"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          Komisyon Notları &amp; Resmî Ekler
        </button>
      </div>

      {/* SEKME 1: PİYASA ARAŞTIRMASI & MALZEME FİYAT MATRİSİ */}
      {activeTab === "matris" && (
        <div className="rounded-lg border border-[#e2e8f0] bg-white p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[12px] font-bold text-[#1e293b]">
                Malzeme Birimine Göre Fiyat Veren İstekliler / Karşılaştırma
                Matrisi
              </span>
              <p className="text-[10.5px] text-[#5b6877]">
                Her isteklinin birim fiyatını hücre içerisinden
                değiştirebilirsiniz. Sistem kalem toplamlarını ve kazanan
                teklifi anında günceller.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddItem}
                className="flex h-7 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff]"
              >
                <Plus className="size-3" />
                <span>Malzeme Kalemi Ekle</span>
              </button>
              <button
                type="button"
                onClick={handleAddFirm}
                className="flex h-7 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff]"
              >
                <Building className="size-3" />
                <span>Yeni Firma / İstekli Ekle</span>
              </button>
            </div>
          </div>

          {/* Dinamik Karşılaştırma Tablosu */}
          <div className="overflow-x-auto rounded border border-[#e3e6eb]">
            <table className="w-full min-w-[960px] border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#f4f6f9] text-left text-[10px] font-semibold text-[#44546a]">
                  <th className="border-b border-r border-[#e3e6eb] px-2 py-2 text-center w-10">
                    Sıra
                  </th>
                  <th className="border-b border-r border-[#e3e6eb] px-3 py-2 min-w-[200px]">
                    Malzeme / Hizmet Tanımı
                  </th>
                  <th className="border-b border-r border-[#e3e6eb] px-2 py-2 text-center w-24">
                    Miktar / Birim
                  </th>

                  {/* Firmalar Sütun Başlıkları */}
                  {firms.map((firm) => {
                    const isLowest = firm.id === lowestFirmId;
                    const isSelected = firm.id === selectedFirmId;
                    return (
                      <th
                        key={firm.id}
                        className={`border-b border-r border-[#e3e6eb] p-2 text-center min-w-[170px] ${
                          isSelected ? "bg-[#e9f0fc] text-[#1e40af]" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span
                            className="font-bold truncate max-w-[160px]"
                            title={firm.name}
                          >
                            {firm.name.split("-")[1] || firm.name}
                          </span>
                          <div className="flex items-center gap-1 mt-0.5">
                            {isLowest && (
                              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[8.5px] font-bold text-emerald-800">
                                En Düşük Teklif
                              </span>
                            )}
                            <label className="flex items-center gap-1 text-[9px] text-[#4f5b69] cursor-pointer">
                              <input
                                type="radio"
                                name="winning_firm"
                                checked={isSelected}
                                onChange={() => setSelectedFirmId(firm.id)}
                                className="accent-[#2d62d7] size-3"
                              />
                              <span>{isSelected ? "Kazanan" : "Seç"}</span>
                            </label>
                          </div>
                        </div>
                      </th>
                    );
                  })}

                  <th className="border-b border-r border-[#e3e6eb] px-2 py-2 text-center w-28 bg-[#fafbfc]">
                    En Düşük Fiyat
                  </th>
                  <th className="border-b border-[#e3e6eb] px-2 py-2 text-center w-10">
                    Sil
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  // Bu kalemdeki en düşük birim fiyatı bul
                  const validPrices = firms.map((f) => item.prices[f.id] || 0)
                    .filter((p) => p > 0);
                  const minPrice = validPrices.length
                    ? Math.min(...validPrices)
                    : 0;

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#eef0f3] hover:bg-[#fafbfc]/50"
                    >
                      <td className="border-r border-[#eef0f3] px-2 py-1.5 text-center text-[#7b8794]">
                        {idx + 1}
                      </td>
                      <td className="border-r border-[#eef0f3] px-3 py-1.5">
                        <div className="font-medium text-[#172334]">
                          {item.name}
                        </div>
                        <div className="font-mono text-[9.5px] text-[#7b8794]">
                          {item.code}
                        </div>
                      </td>
                      <td className="border-r border-[#eef0f3] px-2 py-1.5 text-center font-semibold text-[#172334]">
                        {item.qty} {item.unit}
                      </td>

                      {/* Her Firmanın Birim Fiyatı & Tutarı */}
                      {firms.map((firm) => {
                        const price = item.prices[firm.id] || 0;
                        const lineTotal = price * item.qty;
                        const isMin = price > 0 && price === minPrice;
                        const isSelFirm = firm.id === selectedFirmId;

                        return (
                          <td
                            key={firm.id}
                            className={`border-r border-[#eef0f3] p-1.5 ${
                              isSelFirm ? "bg-[#f4f7fe]" : ""
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                step="any"
                                value={price || ""}
                                onChange={(e) =>
                                  handlePriceChange(
                                    item.id,
                                    firm.id,
                                    e.target.value,
                                  )}
                                className={`h-7 w-24 rounded border px-2 text-right font-medium outline-none transition ${
                                  isMin
                                    ? "border-emerald-400 bg-emerald-50/40 text-emerald-950 font-bold"
                                    : "border-[#d9dee5] bg-white text-[#172334] focus:border-[#2d62d7]"
                                }`}
                                title="Birim Fiyatı Düzenle"
                              />
                              <span className="text-[10px] text-[#7b8794]">
                                TL
                              </span>
                            </div>
                            <div className="mt-0.5 text-right font-mono text-[10px] text-[#5b6877]">
                              = {fmt(lineTotal)} TL
                            </div>
                          </td>
                        );
                      })}

                      {/* Kalem En Düşük Birim Fiyat Özeti */}
                      <td className="border-r border-[#eef0f3] px-2 py-1.5 text-center bg-[#fafbfc]">
                        <span className="font-bold text-emerald-700">
                          {fmt(minPrice)} TL
                        </span>
                      </td>

                      {/* Silme */}
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-[#d7445b] hover:opacity-80 transition"
                          title="Bu Kalemi Kaldır"
                        >
                          <Trash2 className="size-3.5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* ARA TOPLAM SATIRI (KDV HARİÇ) */}
                <tr className="bg-[#f8f9fb] font-semibold text-[11px] border-t-2 border-[#d9dee5]">
                  <td
                    colSpan={3}
                    className="border-r border-[#e3e6eb] px-3 py-2 text-right text-[#475569]"
                  >
                    TOPLAM TEKLİF TUTARI (KDV HARİÇ):
                  </td>
                  {firms.map((firm) => {
                    const isLowest = firm.id === lowestFirmId;
                    const isSel = firm.id === selectedFirmId;
                    return (
                      <td
                        key={firm.id}
                        className={`border-r border-[#e3e6eb] px-3 py-2 text-right font-bold ${
                          isLowest
                            ? "text-emerald-800 bg-emerald-50/60"
                            : "text-[#172334]"
                        } ${isSel ? "underline underline-offset-2" : ""}`}
                      >
                        {fmt(firmTotals[firm.id]?.subtotal || 0)} TL
                      </td>
                    );
                  })}
                  <td
                    colSpan={2}
                    className="bg-[#fafbfc] px-2 py-2 text-center text-[10px] text-[#5b6877]"
                  >
                    Yaklaşık Mal.: <strong>{fmt(yaklasikMaliyet)} TL</strong>
                  </td>
                </tr>

                {/* KDV SATIRI (%20) */}
                <tr className="bg-[#f8f9fb] text-[10.5px]">
                  <td
                    colSpan={3}
                    className="border-r border-[#e3e6eb] px-3 py-1.5 text-right text-[#64748b]"
                  >
                    Hesaplanan KDV (%20):
                  </td>
                  {firms.map((firm) => (
                    <td
                      key={firm.id}
                      className="border-r border-[#e3e6eb] px-3 py-1.5 text-right text-[#5b6877]"
                    >
                      {fmt(firmTotals[firm.id]?.vat || 0)} TL
                    </td>
                  ))}
                  <td colSpan={2} className="bg-[#fafbfc]" />
                </tr>

                {/* GENEL TOPLAM SATIRI (KDV DAHİL) */}
                <tr className="bg-[#f0f4fd] font-bold text-[11.5px] border-t border-[#d9dee5]">
                  <td
                    colSpan={3}
                    className="border-r border-[#d3e0fb] px-3 py-2 text-right text-[#1e40af]"
                  >
                    GENEL TOPLAM (KDV DAHİL):
                  </td>
                  {firms.map((firm) => {
                    const isLowest = firm.id === lowestFirmId;
                    return (
                      <td
                        key={firm.id}
                        className={`border-r border-[#d3e0fb] px-3 py-2 text-right ${
                          isLowest
                            ? "text-emerald-900 bg-emerald-100/50"
                            : "text-[#1e40af]"
                        }`}
                      >
                        {fmt(firmTotals[firm.id]?.grand || 0)} TL
                      </td>
                    );
                  })}
                  <td colSpan={2} className="bg-[#e9f0fc]" />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Kazanan İstekli Özeti & Doğrudan Aksiyonlar */}
          <div className="rounded-lg border border-[#2d62d7]/30 bg-white p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[12px] font-bold text-[#172334] flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Belirlenen En Avantajlı / Kazanan Teklif:</span>
                <span className="text-[#2d62d7] underline">
                  {winningFirm.name}
                </span>
              </span>
              <p className="text-[10.5px] text-[#5b6877] mt-0.5">
                Teklif Tutarı (KDV Hariç):{" "}
                <strong>
                  {fmt(firmTotals[winningFirm.id]?.subtotal || 0)} TL
                </strong>{" "}
                | Yaklaşık Maliyet Kıyaslama:{" "}
                <strong>
                  %{fmt(
                    ((firmTotals[winningFirm.id]?.subtotal || 0) /
                      (yaklasikMaliyet || 1)) * 100,
                  )}
                </strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenDocModal("DOC_PIYASA_01")}
                className="inline-flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3 text-[11px] font-bold text-white transition hover:bg-[#2455bd] shadow-2xs"
              >
                <Printer className="size-3.5" />
                <span>Piyasa Araştırma Tutanağını Bastır</span>
              </button>

              <Link
                href="/sozlesme"
                className="inline-flex h-7 items-center gap-1.5 rounded border border-[#2d62d7] bg-white px-3 text-[11px] font-bold text-[#2d62d7] transition hover:bg-[#f2f5ff]"
              >
                <span>Sözleşmeye Aktar</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SEKME 2: İSTEKLİ FİRMALAR DETAY LİSTESİ */}
      {activeTab === "firmalar" && (
        <div className="rounded-lg border border-[#e2e8f0] bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-bold text-[#172334]">
              Piyasa Teklifi Alınan İstekli Listesi
            </h4>
            <button
              type="button"
              onClick={handleAddFirm}
              className="flex h-7 items-center gap-1 rounded bg-[#2d62d7] px-3 text-[11px] font-semibold text-white hover:bg-[#2455bd]"
            >
              <Plus className="size-3" />
              <span>Yeni Firma Ekle</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded border border-[#e3e6eb]">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#f4f6f9] text-left text-[10px] font-semibold text-[#44546a]">
                  <th className="border-b border-[#e3e6eb] px-3 py-2 w-12 text-center">
                    Sıra
                  </th>
                  <th className="border-b border-[#e3e6eb] px-3 py-2">
                    Firma / İstekli Unvanı
                  </th>
                  <th className="border-b border-[#e3e6eb] px-3 py-2">
                    Vergi No
                  </th>
                  <th className="border-b border-[#e3e6eb] px-3 py-2">
                    Teklif Tarihi
                  </th>
                  <th className="border-b border-[#e3e6eb] px-3 py-2 text-right">
                    Teklif Tutarı (TL)
                  </th>
                  <th className="border-b border-[#e3e6eb] px-3 py-2 text-center">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {firms.map((f, idx) => {
                  const isWinner = f.id === selectedFirmId;
                  return (
                    <tr
                      key={f.id}
                      className={`border-b border-[#eef0f3] ${
                        isWinner ? "bg-[#f0f4fd]" : ""
                      }`}
                    >
                      <td className="px-3 py-2 text-center font-bold text-[#7b8794]">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2 font-medium text-[#172334]">
                        {f.name}
                      </td>
                      <td className="px-3 py-2 font-mono text-[#5b6877]">
                        {f.taxNo}
                      </td>
                      <td className="px-3 py-2 text-[#5b6877]">{f.date}</td>
                      <td className="px-3 py-2 text-right font-bold text-[#172334]">
                        {fmt(firmTotals[f.id]?.subtotal || 0)} TL
                      </td>
                      <td className="px-3 py-2 text-center">
                        {isWinner
                          ? (
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9.5px] font-bold text-emerald-800">
                              Kazanan Teklif
                            </span>
                          )
                          : (
                            <span className="text-[#8a94a1] text-[10px]">
                              -
                            </span>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEKME 3: NOTLAR VE EKLER */}
      {activeTab === "notlar" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2">
              Komisyon Değerlendirme Notları
            </h4>
            <NotesBox />
          </div>
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2">
              Resmî Teklif Mektupları ve Belgeler
            </h4>
            <AttachmentsBox />
          </div>
        </div>
      )}

      {/* CANLI A4 MATBU RESMÎ BELGE MODALI */}
      {previewModalOpen && (
        <UniversalDocumentModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          jobs={[
            {
              id: "job-piyasa",
              title: "Piyasa Fiyat Araştırma Tutanağı (3 Firma Teklifi)",
              docNo: "DOC_PIYASA_01",
              dosyaNo: "2026/DT-001",
              dosyaAdi: "Destek Hizmetleri Toner ve Büro Sarf Malzemesi Alımı",
              category: "Doğrudan Temin (22/d)",
              format: "A4 Dikey",
              pageCount: 1,
              addedAt: "Canlı",
              status: "Hazır",
            },
            {
              id: "job-maliyet",
              title: "Yaklaşık Maliyet Hesap Cetveli",
              docNo: "DOC_YAKLASIK_MALIYET",
              dosyaNo: "2026/DT-001",
              dosyaAdi: "Destek Hizmetleri Toner ve Büro Sarf Malzemesi Alımı",
              category: "Doğrudan Temin (22/d)",
              format: "A4 Dikey",
              pageCount: 1,
              addedAt: "Canlı",
              status: "Hazır",
            },
            {
              id: "job-teklif",
              title: "Birim Fiyat Teklif Mektubu",
              docNo: "DOC_TEKLIF_MEKTUBU",
              dosyaNo: "2026/DT-001",
              dosyaAdi: "Destek Hizmetleri Toner ve Büro Sarf Malzemesi Alımı",
              category: "Doğrudan Temin (22/d)",
              format: "A4 Dikey",
              pageCount: 1,
              addedAt: "Canlı",
              status: "Hazır",
            },
            {
              id: "job-onay",
              title: "Harcama Talimatı / İhale Onay Belgesi (22/d)",
              docNo: "DOC_ONAY_01",
              dosyaNo: "2026/DT-001",
              dosyaAdi: "Destek Hizmetleri Toner ve Büro Sarf Malzemesi Alımı",
              category: "Doğrudan Temin (22/d)",
              format: "A4 Dikey",
              pageCount: 1,
              addedAt: "Canlı",
              status: "Hazır",
            },
            {
              id: "job-sozlesme",
              title: "Doğrudan Temin Alım Sözleşmesi",
              docNo: "DOC_SOZLESME_01",
              dosyaNo: "2026/DT-001",
              dosyaAdi: "Destek Hizmetleri Toner ve Büro Sarf Malzemesi Alımı",
              category: "Sözleşme",
              format: "A4 Dikey",
              pageCount: 1,
              addedAt: "Canlı",
              status: "Hazır",
            },
          ]}
          initialJobId={activeDocCode === "DOC_YAKLASIK_MALIYET"
            ? "job-maliyet"
            : activeDocCode === "DOC_TEKLIF_MEKTUBU"
            ? "job-teklif"
            : activeDocCode === "DOC_ONAY_01"
            ? "job-onay"
            : activeDocCode === "DOC_SOZLESME_01"
            ? "job-sozlesme"
            : "job-piyasa"}
          dosyaVerisi={currentDosyaVerisi}
        />
      )}
    </div>
  );
}

/* ---------- Ekran 3: Satın Alma Dosyası ---------- */
function TenderToggleBlock(
  { title, defaultOn = false }: { title: string; defaultOn?: boolean },
) {
  return (
    <div className="space-y-2">
      <Field spec={{ label: title, kind: "toggle", checked: defaultOn }} />
      <Field
        spec={{ label: `${title} açıklaması`, kind: "textarea", rows: 2 }}
      />
    </div>
  );
}

function TenderFileBody() {
  const [activeTab, setActiveTab] = useState<
    "idari" | "sartname" | "yeterlilik"
  >("idari");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  return (
    <div className="space-y-3.5">
      {/* Sekmeler */}
      <div className="flex border-b border-[#e2e8f0] bg-[#f8f9fb] px-2 pt-1 text-[12px]">
        <button
          type="button"
          onClick={() => setActiveTab("idari")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "idari"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          1. Dosya &amp; İhale Onay Bilgileri
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sartname")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "sartname"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          2. Şartname &amp; Karar Parametreleri
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("yeterlilik")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "yeterlilik"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          3. Yeterlilik Belgeleri &amp; Kriterler
        </button>
      </div>

      {/* Sekme 1: Dosya & İhale Onayı */}
      {activeTab === "idari" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-3">
              Temel Dosya Bilgileri
            </h4>
            <FieldGrid
              fields={[
                { label: "Dosya Referans No", value: "PRF-4-07-0000" },
                { label: "Oluşturma Tarihi", kind: "date" },
                {
                  label: "Talep Eden Birim",
                  kind: "select",
                  options: ["Bilgi İşlem", "Lojistik", "Muhasebe"],
                },
                { label: "Tahmini Bedel", kind: "number" },
              ]}
            />
          </div>

          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-3">
              İhale Onay ve Karar Verileri
            </h4>
            <FieldGrid
              fields={[
                {
                  label: "Onay Makamı",
                  kind: "select",
                  options: ["Genel Müdür", "Satın Alma Komisyonu"],
                },
                { label: "Onay Tarihi", kind: "date" },
                { label: "Onay Numarası" },
                {
                  label: "Onay Durumu",
                  kind: "select",
                  options: ["Bekliyor", "Onaylandı", "Reddedildi"],
                },
              ]}
            />
          </div>
        </div>
      )}

      {/* Sekme 2: Şartname ve Karar Parametreleri */}
      {activeTab === "sartname" && (
        <div className="rounded-lg border border-[#e2e8f0] bg-white p-4 space-y-4">
          <FieldGrid
            fields={[
              { label: "İhale Komisyonunun Toplantı Yeri" },
              { label: "Kayıt Numarası" },
              { label: "Komisyon Karar Numarası" },
              {
                label: "Teklif Değerlendirme Para Birimi",
                kind: "select",
                options: ["TRY", "USD", "EUR"],
              },
              { label: "Son Müracaat Tarihi/Saati", kind: "date" },
              { label: "İlk İlan Tarihi/Saati", kind: "date" },
              { label: "İhale Tarihi/Saati", kind: "date" },
              { label: "Karar Tarihi/Saati", kind: "date" },
              { label: "İhale Kararı Onay Tarihi", kind: "date" },
              {
                label: "Teklif Geçerlilik Süresi",
                kind: "unit",
                unitOptions: ["Gün", "Ay"],
              },
              {
                label: "Ekonomik Açıdan En Avantajlı Teklif",
                kind: "select",
                required: true,
                value: "En Düşük Fiyat",
                options: ["En Düşük Fiyat", "En Yüksek Puan"],
              },
            ]}
          />
          <Divider />
          <FieldGrid
            fields={[
              { label: "Konsorsiyum Katılımı", kind: "check" },
              { label: "E-Teklif", kind: "check" },
              { label: "Alternatif Teklif", kind: "check" },
              { label: "Kısmi Teklif", kind: "check" },
            ]}
          />
          <Divider />
          <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
            <Field
              spec={{ label: "Yerli Malına Fiyat Avantajı", kind: "toggle" }}
            />
            <Field
              spec={{ label: "Sadece Yerli İstekli Katılımı", kind: "check" }}
            />
            <Field
              spec={{ label: "Yerli İstekliye Fiyat Avantajı", kind: "check" }}
            />
            <Field spec={{ label: "Malzeme Bazında Teklif", kind: "check" }} />
            <Field spec={{ label: "Fiyat Avantaj Oranı", kind: "percent" }} />
          </div>
        </div>
      )}

      {/* Sekme 3: Yeterlilik Belgeleri */}
      {activeTab === "yeterlilik" && (
        <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
          <h4 className="text-[12px] font-bold text-[#1e293b] mb-3">
            İhale Katılım &amp; Yeterlilik Kriterleri
          </h4>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <TenderToggleBlock title="Mesleki ve Teknik Yeterliliğe İlişkin Belgeler" />
            <TenderToggleBlock title="Ekonomik ve Mali Yeterliliğe İlişkin Belgeler" />
            <TenderToggleBlock title="Numune" />
            <TenderToggleBlock title="İş Deneyimini Gösteren Belgeler" />
            <TenderToggleBlock title="Aşırı Düşük Tekliflerin Değerlendirilmesi" />
            <TenderToggleBlock title="Alt Yüklenici Çalıştırılması" />
          </div>
        </div>
      )}

      {/* İhale Dosyası Entegrasyon Aksiyonları */}
      <div className="rounded-lg border border-[#e1e5ea] bg-blue-50/40 p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold text-[#172334]">
              İhale Dosyası Onaylandıktan Sonraki Süreç:
            </p>
            <p className="text-[11px] text-gray-600">
              Şartname ve komisyon parametreleri tamamlandıysa dosyayı
              sözleşmeye bağlayabilir veya EBYS onay rotasını başlatabilirsiniz.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/sozlesme"
              className="inline-flex items-center gap-1.5 rounded bg-[#2d62d7] px-4 py-2 text-[11.5px] font-bold text-white shadow-xs transition hover:bg-[#2455bd]"
            >
              <span>Satın Alma Sözleşmesine Geç</span>
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/is-akislari"
              className="inline-flex items-center gap-1.5 rounded border border-[#d9dee5] bg-[#f8f9fb] px-3.5 py-2 text-[11.5px] font-bold text-[#172334] transition hover:border-[#2d62d7] hover:text-[#2d62d7]"
            >
              <GitBranch className="size-3.5 text-[#2d62d7]" />
              <span>Komisyon Onay Rotasını Başlat</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsDocModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded border border-[#2d62d7] bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#2d62d7] shadow-xs transition hover:bg-[#f2f5ff]"
            >
              <FileSignature className="size-3.5 text-[#2d62d7]" />
              <span>İhale Onay Belgesi (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* A4 İhale Onay Belgesi Önizleme Modalı */}
      {isDocModalOpen && (
        <UniversalDocumentModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          dosyaVerisi={ORNEK_TEMIN_DOSYALARI[0]}
          jobs={[
            {
              id: "job-ihale-onay",
              title: "İhale Onay Belgesi",
              docNo: "PRF-4-07-0000",
              dosyaNo: "2026/DT-001",
              dosyaAdi: "Satın Alma Dosyası İhale Onayı",
              category: "Satın Alma (4734)",
              format: "A4 Dikey",
              pageCount: 2,
              addedAt: "Canlı",
              status: "Hazır",
            },
          ]}
        />
      )}
    </div>
  );
}

/* ---------- Ekran 4: Satın Alma Sözleşmesi ---------- */
function ContractBody() {
  const [activeTab, setActiveTab] = useState<
    "taraflar" | "odeme" | "cezalar" | "tarihce"
  >("taraflar");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  return (
    <div className="space-y-3.5">
      {/* Sekmeler */}
      <div className="flex border-b border-[#e2e8f0] bg-[#f8f9fb] px-2 pt-1 text-[12px]">
        <button
          type="button"
          onClick={() => setActiveTab("taraflar")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "taraflar"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          1. Sözleşme &amp; Taraflar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("odeme")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "odeme"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          2. Ödeme Planı &amp; Koşullar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cezalar")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "cezalar"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          3. Cezalar, Belgeler &amp; Uyarılar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tarihce")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "tarihce"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          4. Tarihçe, Notlar &amp; Ekler
        </button>
      </div>

      {/* Sekme 1: Sözleşme & Taraflar */}
      {activeTab === "taraflar" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-3">
              Sözleşme Genel Bilgileri
            </h4>
            <FieldGrid
              fields={[
                { label: "Sözleşme Adı", value: "Contract Trial" },
                { label: "İmza Tarihi", kind: "date" },
                { label: "Sözleşme Yeri" },
                { label: "Hukuki Dayanak" },
              ]}
            />
            <Divider />
            <FieldGrid
              fields={[
                { label: "Sözleşme Bedeli", kind: "number" },
                {
                  label: "Para Birimi",
                  kind: "select",
                  options: ["TRY", "USD", "EUR"],
                },
                {
                  label: "KDV Oranı",
                  kind: "select",
                  options: ["%1", "%10", "%20"],
                },
                {
                  label: "Kur Tipi",
                  kind: "select",
                  options: ["Döviz Alış", "Döviz Satış", "Efektif"],
                },
              ]}
            />
          </div>

          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-3">
              Satıcı / Yüklenici Bilgileri
            </h4>
            <FieldGrid
              fields={[
                { label: "İş Ortağı", kind: "search", value: PARTNER },
                { label: "Yetkili" },
                { label: "Telefon" },
                { label: "E-Mail Adresi" },
              ]}
            />
          </div>
        </div>
      )}

      {/* Sekme 2: Ödeme Planı & Koşullar */}
      {activeTab === "odeme" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2.5">
              Taksitli Ödeme Planı
            </h4>
            <SimpleTable
              columns={["Taksit", "Vade Tarihi", "Oran", "Tutar", "Durum"]}
              rows={[
                ["1", "31.08.2024", "%30", "3.750,00 TRY", "Bekliyor"],
                ["2", "30.09.2024", "%30", "3.750,00 TRY", "Bekliyor"],
                ["3", "31.10.2024", "%40", "5.000,00 TRY", "Bekliyor"],
              ]}
            />
          </div>

          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-3">
              Teminat &amp; Sözleşme Koşulları
            </h4>
            <FieldGrid
              fields={[
                { label: "Kesin Teminat Oranı", kind: "percent" },
                {
                  label: "Garanti Süresi",
                  kind: "unit",
                  unitOptions: ["Yıl", "Ay"],
                },
                { label: "İlave Sipariş", kind: "percent" },
                { label: "Eksik Sipariş", kind: "percent" },
                {
                  label: "Sipariş Verilme Süresi",
                  kind: "unit",
                  unitOptions: ["Gün", "Hafta"],
                },
                {
                  label: "Teslimat İadesi",
                  kind: "select",
                  options: ["Kabul", "Ret"],
                },
                {
                  label: "Ödeme Para Birimi",
                  kind: "select",
                  options: ["TRY", "USD", "EUR"],
                },
                {
                  label: "Damga Vergisi Ödeme Tipi",
                  kind: "select",
                  options: ["Satıcı", "Alıcı", "Yarı Yarıya"],
                },
                { label: "Nakit Teminat Kesintisi", kind: "percent" },
                { label: "Stopaj Kesintisi", kind: "percent" },
              ]}
            />
            <Divider />
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
              <Field spec={{ label: "Fiyat Farkı Ödemesi", kind: "toggle" }} />
              <Field spec={{ label: "Avans", kind: "toggle" }} />
              <Field
                spec={{ label: "Fiyat Avantaj Tutarı", kind: "percent" }}
              />
              <Field spec={{ label: "Avans Tutarı", kind: "number" }} />
              <Field spec={{ label: "Avans Oranı", kind: "percent" }} />
              <Field spec={{ label: "Avans İadesi", kind: "number" }} />
            </div>
          </div>
        </div>
      )}

      {/* Sekme 3: Cezalar, Belgeler & Uyarılar */}
      {activeTab === "cezalar" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-3">
              Ceza Koşulları
            </h4>
            <FieldGrid
              fields={[
                { label: "Gecikme Cezası (günlük)", kind: "percent" },
                { label: "Azami Ceza Oranı", kind: "percent" },
                { label: "Eksik İş Cezası", kind: "percent" },
                { label: "Ceza Açıklaması" },
              ]}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
              <h4 className="text-[12px] font-bold text-[#1e293b] mb-2.5">
                Zorunlu Belge Takibi
              </h4>
              <SimpleTable
                columns={["Belge", "Zorunlu", "Son Tarih", "Durum"]}
                rows={[
                  ["Kesin Teminat Mektubu", "Evet", "31.07.2024", "Bekliyor"],
                  ["Vergi Levhası", "Evet", "31.07.2024", "Alındı"],
                ]}
              />
            </div>

            <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
              <h4 className="text-[12px] font-bold text-[#1e293b] mb-3">
                Otomatik Uyarı Kontrolleri
              </h4>
              <FieldGrid
                fields={[
                  {
                    label: "Bitişe Kalan Gün Uyarısı",
                    kind: "unit",
                    unit: "Gün",
                  },
                  { label: "Limit Aşımı Uyarısı", kind: "percent" },
                  {
                    label: "Bildirim Kanalı",
                    kind: "select",
                    options: ["E-posta", "Uygulama içi", "Her ikisi"],
                  },
                  { label: "Aktif", kind: "check", checked: true },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sekme 4: Tarihçe, Notlar ve Ekler */}
      {activeTab === "tarihce" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2.5">
              Sözleşme Revizyon Tarihçesi
            </h4>
            <SimpleTable
              columns={["Revizyon", "İşlem", "Kullanıcı", "Tarih"]}
              rows={[
                ["0", "Oluşturuldu", "lojtest1", "16.07.2024 10:12"],
                ["0", "Onaylandı", "lojtest1", "16.07.2024 14:40"],
              ]}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
              <h4 className="text-[12px] font-bold text-[#1e293b] mb-2">
                Sözleşme Notları
              </h4>
              <NotesBox />
            </div>
            <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
              <h4 className="text-[12px] font-bold text-[#1e293b] mb-2">
                Sözleşme Ekleri &amp; İmzalı Nüshalar
              </h4>
              <AttachmentsBox />
            </div>
          </div>
        </div>
      )}

      {/* Sözleşme Entegrasyon Aksiyonları */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold text-emerald-950">
              Sözleşme Onaylandı ve Yürürlükte:
            </p>
            <p className="text-[11px] text-emerald-800">
              Kesinleşen sözleşme hükümlerini EBYS e-İmza şablonuna aktarabilir
              veya 2886 Gelir İhaleleri Masasına geçiş yapabilirsiniz.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDocModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded bg-[#2d62d7] px-4 py-2 text-[11.5px] font-bold text-white shadow-xs transition hover:bg-[#2455bd]"
            >
              <FileSignature className="size-3.5" />
              <span>Resmî Sözleşmeyi Mühürle &amp; Yazdır (A4)</span>
            </button>
            <Link
              href="/is-akislari"
              className="inline-flex items-center gap-1.5 rounded border border-[#d9dee5] bg-[#f8f9fb] px-3.5 py-2 text-[11.5px] font-bold text-[#172334] transition hover:border-[#2d62d7] hover:text-[#2d62d7] hover:bg-white"
            >
              <GitBranch className="size-3.5 text-[#2d62d7]" />
              <span>Sözleşme Onay İmzaları</span>
            </Link>
            <Link
              href="/gelir-ihaleleri/dosya-tanimi"
              className="inline-flex items-center gap-1.5 rounded border border-[#d9dee5] bg-[#f8f9fb] px-3.5 py-2 text-[11.5px] font-bold text-[#172334] transition hover:border-[#2d62d7] hover:text-[#2d62d7] hover:bg-white"
            >
              <Scale className="size-3.5 text-[#2d62d7]" />
              <span>Gelir İhaleleri (2886) Masası</span>
            </Link>
          </div>
        </div>
      </div>

      {/* A4 Resmî Sözleşme Önizleme Modalı */}
      {isDocModalOpen && (
        <UniversalDocumentModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          dosyaVerisi={ORNEK_TEMIN_DOSYALARI[0]}
          jobs={[
            {
              id: "job-sozlesme",
              title: "Satın Alma Sözleşmesi",
              docNo: "24-00000001",
              dosyaNo: "2026/DT-001",
              dosyaAdi: "Mal Alımı Kesin Sözleşmesi",
              category: "Sözleşme",
              format: "A4 Dikey",
              pageCount: 3,
              addedAt: "Canlı",
              status: "Hazır",
            },
          ]}
        />
      )}
    </div>
  );
}

/* ---------- Ekran 5: Doğrudan Temin ---------- */
type Line = {
  id: number;
  code: string;
  name: string;
  qty: string;
  unit: string;
  price: string;
  vat: string;
};

function DirectProcurementBody() {
  const { addToPrintQueue } = usePrintHub();
  const [activeTab, setActiveTab] = useState<
    "bilgi" | "kalemler" | "teklifler" | "onay"
  >("kalemler");
  const [lines, setLines] = useState<Line[]>([
    {
      id: 1,
      code: "2024-0010",
      name: "HP 658A Toner Kartuşu Siyah W2000A",
      qty: "10",
      unit: "Adet",
      price: "1250",
      vat: "20",
    },
    {
      id: 2,
      code: "2024-0033",
      name: "Std Hs-2 Toner",
      qty: "4",
      unit: "Adet",
      price: "980",
      vat: "20",
    },
  ]);
  const [limit, setLimit] = useState("");
  const [chosen, setChosen] = useState<string>("f2");
  const [nextId, setNextId] = useState(3);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeDocCode, setActiveDocCode] = useState("DOC_PIYASA_01");
  const [directToast, setDirectToast] = useState<string | null>(null);

  const num = (v: string) => Number(v.replace(",", ".")) || 0;
  const update = (id: number, key: keyof Line, v: string) =>
    setLines(lines.map((l) => (l.id === id ? { ...l, [key]: v } : l)));
  const subtotal = lines.reduce((s, l) => s + num(l.qty) * num(l.price), 0);
  const vatTotal = lines.reduce(
    (s, l) => s + num(l.qty) * num(l.price) * (num(l.vat) / 100),
    0,
  );
  const grand = subtotal + vatTotal;
  const limitNum = num(limit);
  const overLimit = limitNum > 0 && subtotal > limitNum;

  const cell =
    "h-7 w-full rounded border border-[#d9dee5] bg-white px-2 text-[11px] outline-none focus:border-[#2d62d7]";
  const firms = [
    {
      id: "f1",
      name: "2024-0026 - Turuncu Ofis Bilişim Ltd. Şti.",
      date: "2024-07-15",
      total: 16550,
    },
    {
      id: "f2",
      name: "2024-0022 - Financial Technologies Administration A.Ş.",
      date: "2024-07-15",
      total: 15200,
    },
    {
      id: "f3",
      name: "2024-0031 - Bilge Kırtasiye Ltd. Şti.",
      date: "2024-07-16",
      total: 17100,
    },
  ];

  const winningDirectFirm = firms.find((f) => f.id === chosen) || firms[0];
  const currentDirectDosya: TeminDosyasiKaydi = {
    ...ORNEK_TEMIN_DOSYALARI[0],
    id: 102,
    temin_no: "2026/DT-001",
    dosya_acilis_tarihi: new Date().toISOString().split("T")[0],
    butce_yili: 2026,
    butce_tipi: "Genel Bütçe",
    konu: "Destek Hizmetleri Toner ve Büro Sarf Malzemesi Alımı",
    birim: "Destek Hizmetleri Dairesi Başkanlığı - Satınalma Şube Müdürlüğü",
    sunulacak_makam: "HARCAMA YETKİLİSİ MAKAMINA",
    ihtiyac_yeri: "Merkez Hizmet Binası",
    ihale_sekli: "22/d Doğrudan Temin",
    yaklasik_maliyet: subtotal,
    net_odenen: winningDirectFirm.total / 1.2,
    kazanan_firma_adi: winningDirectFirm.name,
    firmalar: firms.map((f, idx) => ({
      sira_no: idx + 1,
      firma_adi: f.name,
      toplam_teklif: f.total,
      kdv_durumu: "Dahil",
      teklif_tarihi: f.date,
      kazanan_mi: f.id === chosen,
      degerlendirme_sonucu: f.id === chosen
        ? "En Avantajlı Teklif (Uygun)"
        : `${idx + 1}. Teklif`,
    })),
    kalemler: lines.map((l, idx) => ({
      sira_no: idx + 1,
      kalem_kodu: l.code,
      kalem_adi: l.name,
      birim: l.unit,
      miktar: num(l.qty),
      yaklasik_birim_fiyat: num(l.price),
      toplam_tutar: num(l.qty) * num(l.price),
      kdv_orani: num(l.vat),
    })),
  };

  const handleOpenDocModal = (code: string) => {
    setActiveDocCode(code);
    setPreviewModalOpen(true);
  };

  const handleKuyrugaTopluEkle = () => {
    addToPrintQueue({
      title: "Piyasa Fiyat Araştırma Tutanağı (3 Firma Teklifi)",
      docNo: "DOC_PIYASA_01",
      dosyaNo: "2026/DT-001",
      dosyaAdi: "Destek Hizmetleri Doğrudan Temin Alımı",
      category: "Doğrudan Temin (22/d)",
      format: "A4 Dikey",
      pageCount: 1,
    });
    addToPrintQueue({
      title: "Harcama Talimatı / İhale Onay Belgesi",
      docNo: "DOC_ONAY_01",
      dosyaNo: "2026/DT-001",
      dosyaAdi: "Destek Hizmetleri Doğrudan Temin Alımı",
      category: "Doğrudan Temin (22/d)",
      format: "A4 Dikey",
      pageCount: 1,
    });
    setDirectToast("Belgeler Yazdırma Kuyruğuna başarıyla eklendi!");
    setTimeout(() => setDirectToast(null), 3500);
  };

  return (
    <div className="space-y-3.5">
      {/* Sekmeler */}
      <div className="flex border-b border-[#e2e8f0] bg-[#f8f9fb] px-2 pt-1 text-[12px]">
        <button
          type="button"
          onClick={() => setActiveTab("bilgi")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "bilgi"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          1. Temin Bilgileri &amp; Gerekçe
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("kalemler")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "kalemler"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          2. Malzeme Kalemleri ({lines.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("teklifler")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "teklifler"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          3. Limit &amp; Piyasa Teklifleri
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("onay")}
          className={`border-b-2 px-4 py-2 font-bold transition ${
            activeTab === "onay"
              ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
              : "border-transparent text-[#64748b] hover:text-[#1e293b]"
          }`}
        >
          4. Onay Akışı, Notlar &amp; Ekler
        </button>
      </div>

      {/* Sekme 1: Temin Bilgileri */}
      {activeTab === "bilgi" && (
        <div className="rounded-lg border border-[#e2e8f0] bg-white p-4 space-y-4">
          <FieldGrid
            fields={[
              {
                label: "Temin Gerekçesi",
                kind: "select",
                required: true,
                options: [
                  "Acil ihtiyaç",
                  "Tek kaynak",
                  "Bedel sınırı altında",
                  "Diğer",
                ],
              },
              { label: "Temin Tarihi", kind: "date", required: true },
              {
                label: "İhtiyaç Sahibi Birim",
                kind: "select",
                options: ["Bilgi İşlem", "Lojistik", "Muhasebe"],
              },
              {
                label: "Para Birimi",
                kind: "select",
                value: "TRY",
                options: ["TRY", "USD", "EUR"],
              },
              { label: "Temin Konusu", span: 2, required: true },
              { label: "Teslim Yeri" },
              { label: "Teslim Süresi", kind: "unit", unit: "Gün" },
              {
                label: "Gerekçe Açıklaması",
                kind: "textarea",
                span: 4,
                rows: 2,
              },
            ]}
          />
        </div>
      )}

      {/* Sekme 2: Kalemler */}
      {activeTab === "kalemler" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-[#e3e6eb] bg-white p-3">
            <table className="w-full min-w-[760px] border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#f4f6f9] text-left text-[10px] font-semibold text-[#44546a]">
                  {[
                    "Malzeme Kodu",
                    "Malzeme Adı",
                    "Miktar",
                    "Birim",
                    "Birim Fiyat",
                    "KDV %",
                    "Tutar",
                    "",
                  ].map((c) => (
                    <th key={c} className="border-b border-[#e3e6eb] px-2 py-2">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.id} className="border-b border-[#eef0f3]">
                    <td className="w-28 px-2 py-1.5">
                      <input
                        aria-label="Malzeme kodu"
                        className={cell}
                        value={l.code}
                        onChange={(e) => update(l.id, "code", e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        aria-label="Malzeme adı"
                        className={cell}
                        value={l.name}
                        onChange={(e) => update(l.id, "name", e.target.value)}
                      />
                    </td>
                    <td className="w-20 px-2 py-1.5">
                      <input
                        aria-label="Miktar"
                        inputMode="decimal"
                        className={cell}
                        value={l.qty}
                        onChange={(e) => update(l.id, "qty", e.target.value)}
                      />
                    </td>
                    <td className="w-24 px-2 py-1.5">
                      <select
                        aria-label="Birim"
                        className={cell}
                        value={l.unit}
                        onChange={(e) => update(l.id, "unit", e.target.value)}
                      >
                        {["Adet", "Kutu", "Koli", "Kg"].map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </select>
                    </td>
                    <td className="w-28 px-2 py-1.5">
                      <input
                        aria-label="Birim fiyat"
                        inputMode="decimal"
                        className={cell}
                        value={l.price}
                        onChange={(e) => update(l.id, "price", e.target.value)}
                      />
                    </td>
                    <td className="w-20 px-2 py-1.5">
                      <select
                        aria-label="KDV oranı"
                        className={cell}
                        value={l.vat}
                        onChange={(e) => update(l.id, "vat", e.target.value)}
                      >
                        {["0", "1", "10", "20"].map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </select>
                    </td>
                    <td className="w-28 px-2 py-1.5 text-right font-medium">
                      {fmt(num(l.qty) * num(l.price))}
                    </td>
                    <td className="w-8 px-2 py-1.5">
                      <button
                        type="button"
                        aria-label="Satırı sil"
                        onClick={() =>
                          setLines(lines.filter((x) => x.id !== l.id))}
                        className="text-[#d7445b] hover:underline font-bold"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
                {lines.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-5 text-center text-[#99a4b0]"
                    >
                      Kalem eklenmedi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-3 flex flex-wrap items-start justify-between gap-4 border-t border-[#edf0f4] pt-3">
              <OutlineButton
                onClick={() => {
                  setLines([...lines, {
                    id: nextId,
                    code: "",
                    name: "",
                    qty: "1",
                    unit: "Adet",
                    price: "0",
                    vat: "20",
                  }]);
                  setNextId(nextId + 1);
                }}
              >
                <Plus className="mr-1 inline size-3" />Kalem Ekle
              </OutlineButton>
              <dl className="w-full max-w-xs space-y-1 text-[11px] text-[#5b6877]">
                <div className="flex justify-between">
                  <dt>Ara Toplam</dt>
                  <dd>{fmt(subtotal)} TRY</dd>
                </div>
                <div className="flex justify-between">
                  <dt>KDV</dt>
                  <dd>{fmt(vatTotal)} TRY</dd>
                </div>
                <div className="flex justify-between border-t border-[#e3e6eb] pt-1 text-[12px] font-semibold text-[#172334]">
                  <dt>Genel Toplam</dt>
                  <dd>{fmt(grand)} TRY</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* Sekme 3: Limit ve Teklifler */}
      {activeTab === "teklifler" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2.5">
              22/d Doğrudan Temin Yasal Limit Kontrolü
            </h4>
            <div className="grid items-end gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-1 block text-[10px] text-[#5b6877]">
                  Doğrudan Temin Limiti (KDV hariç)
                </label>
                <input
                  inputMode="decimal"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="Güncel limiti giriniz"
                  className="h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] outline-none focus:border-[#2d62d7]"
                />
              </div>
              <div className="text-[11px] text-[#5b6877]">
                Kalem toplamı (KDV hariç):{" "}
                <strong className="text-[#172334]">{fmt(subtotal)} TRY</strong>
              </div>
            </div>
            <p
              role="status"
              className={`mt-3 rounded px-3 py-2 text-[11px] ${
                limitNum === 0
                  ? "bg-[#f4f6f9] text-[#5b6877]"
                  : overLimit
                  ? "bg-[#fde8ec] text-[#b3263f]"
                  : "bg-[#e4f4ea] text-[#2a6b43]"
              }`}
            >
              {limitNum === 0
                ? "Limit girildiğinde kontrol otomatik yapılır. Limit her yıl güncellendiği için değeri güncel mevzuattan alın."
                : overLimit
                ? `Toplam limiti ${
                  fmt(subtotal - limitNum)
                } TRY aşıyor. Bu temin için ihale usulü gerekebilir.`
                : "Toplam limit içinde."}
            </p>
          </div>

          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2.5">
              Piyasa Fiyat Araştırması &amp; Firma Teklifleri
            </h4>
            <div className="overflow-x-auto rounded border border-[#e3e6eb]">
              <table className="w-full min-w-[560px] border-collapse text-[11px]">
                <thead>
                  <tr className="bg-[#f4f6f9] text-left text-[10px] font-semibold text-[#44546a]">
                    {[
                      "Seç",
                      "Firma",
                      "Teklif Tarihi",
                      "Teklif Tutarı (KDV dahil)",
                      "Durum",
                    ].map((c) => (
                      <th
                        key={c}
                        className="border-b border-[#e3e6eb] px-3 py-2"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {firms.map((f) => {
                    const min = Math.min(...firms.map((x) => x.total));
                    const sel = chosen === f.id;
                    return (
                      <tr
                        key={f.id}
                        className={`border-b border-[#eef0f3] ${
                          sel ? "bg-[#d9e4fb] text-[#2d62d7]" : ""
                        }`}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="radio"
                            name="firm"
                            checked={sel}
                            onChange={() => setChosen(f.id)}
                            aria-label={`${f.name} seç`}
                            className="accent-[#2d62d7]"
                          />
                        </td>
                        <td className="px-3 py-2 font-medium">{f.name}</td>
                        <td className="px-3 py-2">
                          {new Date(f.date).toLocaleDateString("tr-TR")}
                        </td>
                        <td className="px-3 py-2 font-bold">
                          {fmt(f.total)} TRY
                        </td>
                        <td className="px-3 py-2">
                          {f.total === min
                            ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                En Düşük Teklif
                              </span>
                            )
                            : (
                              "-"
                            )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 max-w-md">
              <Field
                spec={{
                  label: "En düşük olmayan teklif seçildiyse gerekçe",
                  kind: "textarea",
                  rows: 2,
                }}
              />
            </div>

            {/* Resmî Belge Yazdırma & Önizleme Butonları */}
            <div className="mt-4 rounded border border-[#2d62d7]/30 bg-[#f0f4fd] p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Printer className="size-4 text-[#2d62d7]" />
                <span className="text-[11.5px] font-bold text-[#172334]">
                  Doğrudan Temin Matbu Evraklarını Bastır:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenDocModal("DOC_PIYASA_01")}
                  className="flex h-7 items-center gap-1 rounded border border-[#2d62d7] bg-white px-2.5 text-[11px] font-bold text-[#2d62d7] hover:bg-[#2d62d7] hover:text-white transition shadow-2xs"
                >
                  <Eye className="size-3.5" />
                  <span>Piyasa Fiyat Tutanağı (A4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDocModal("DOC_ONAY_01")}
                  className="flex h-7 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2 text-[10.5px] font-medium text-[#172334] hover:border-[#2d62d7] hover:text-[#2d62d7]"
                >
                  <FileCheck2 className="size-3.5" />
                  <span>Onay Belgesi</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDocModal("DOC_SOZLESME_01")}
                  className="flex h-7 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2 text-[10.5px] font-medium text-[#172334] hover:border-[#2d62d7] hover:text-[#2d62d7]"
                >
                  <FileSignature className="size-3.5" />
                  <span>Sözleşme</span>
                </button>
                <button
                  type="button"
                  onClick={handleKuyrugaTopluEkle}
                  className="flex h-7 items-center gap-1 rounded bg-[#2d62d7] px-2.5 text-[11px] font-bold text-white hover:bg-[#2455bd] transition"
                >
                  <Plus className="size-3" />
                  <span>Kuyruğa Ekle</span>
                </button>
              </div>
            </div>

            {directToast && (
              <div className="mt-2 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded">
                {directToast}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sekme 4: Onay Akışı, Notlar & Ekler */}
      {activeTab === "onay" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-2.5">
              Doğrudan Temin Onay Akışı
            </h4>
            <SimpleTable
              columns={["Sıra", "Onaycı", "Rol", "Durum"]}
              rows={[
                ["1", "Abdulkadir İlci", "Satın Alma Sorumlusu", "Onaylandı"],
                ["2", "Şube Müdürü", "Birim Harcama Yetkilisi", "Bekliyor"],
              ]}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
              <h4 className="text-[12px] font-bold text-[#1e293b] mb-2">
                Temin Notları
              </h4>
              <NotesBox />
            </div>
            <div className="rounded-lg border border-[#e2e8f0] bg-white p-4">
              <h4 className="text-[12px] font-bold text-[#1e293b] mb-2">
                Piyasa Teklif Mektupları &amp; Ekler
              </h4>
              <AttachmentsBox />
            </div>
          </div>
        </div>
      )}

      {/* Doğrudan Temin Süreç Aksiyonları */}
      <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold text-orange-950">
              Piyasa Fiyat Araştırması Tamamlandı:
            </p>
            <p className="text-[11px] text-orange-800">
              En düşük teklif veren firmaya doğrudan temin siparişi / sözleşmesi
              bağlayabilir veya EBYS Piyasa Araştırma Tutanağı alabilirsiniz.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenDocModal("DOC_PIYASA_01")}
              className="inline-flex items-center gap-1.5 rounded bg-[#2d62d7] px-3.5 py-2 text-[11.5px] font-bold text-white shadow-xs transition hover:bg-[#2455bd]"
            >
              <Printer className="size-3.5" />
              <span>Piyasa Fiyat Araştırma Tutanağı (A4) Bastır</span>
            </button>
            <Link
              href="/sozlesme"
              className="inline-flex items-center gap-1.5 rounded border border-[#2d62d7] bg-white px-3.5 py-2 text-[11.5px] font-bold text-[#2d62d7] shadow-xs transition hover:bg-[#f2f5ff]"
            >
              <span>Sözleşmeye Aktar</span>
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/is-akislari"
              className="inline-flex items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#172334] shadow-xs transition hover:border-[#2d62d7] hover:text-[#2d62d7]"
            >
              <GitBranch className="size-3.5 text-[#2d62d7]" />
              <span>Harcama Yetkilisi Olur Rotası</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CANLI A4 MATBU RESMÎ BELGE MODALI */}
      {previewModalOpen && (
        <UniversalDocumentModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          jobs={[
            {
              id: "direct-piyasa",
              title: "Piyasa Fiyat Araştırma Tutanağı (3 Firma Teklifi)",
              docNo: "DOC_PIYASA_01",
              dosyaNo: "2026/DT-001",
              dosyaAdi: "Destek Hizmetleri Doğrudan Temin Alımı",
              category: "Doğrudan Temin (22/d)",
              format: "A4 Dikey",
              pageCount: 1,
              addedAt: "Canlı",
              status: "Hazır",
            },
            {
              id: "direct-onay",
              title: "Harcama Talimatı / İhale Onay Belgesi (22/d)",
              docNo: "DOC_ONAY_01",
              dosyaNo: "2026/DT-001",
              dosyaAdi: "Destek Hizmetleri Doğrudan Temin Alımı",
              category: "Doğrudan Temin (22/d)",
              format: "A4 Dikey",
              pageCount: 1,
              addedAt: "Canlı",
              status: "Hazır",
            },
            {
              id: "direct-sozlesme",
              title: "Doğrudan Temin Alım Sözleşmesi",
              docNo: "DOC_SOZLESME_01",
              dosyaNo: "2026/DT-001",
              dosyaAdi: "Destek Hizmetleri Doğrudan Temin Alımı",
              category: "Sözleşme",
              format: "A4 Dikey",
              pageCount: 1,
              addedAt: "Canlı",
              status: "Hazır",
            },
          ]}
          initialJobId={activeDocCode === "DOC_ONAY_01"
            ? "direct-onay"
            : activeDocCode === "DOC_SOZLESME_01"
            ? "direct-sozlesme"
            : "direct-piyasa"}
          dosyaVerisi={currentDirectDosya}
        />
      )}
    </div>
  );
}

/* ---------- Ekran tanımları ---------- */
export const SCREENS: ScreenDef[] = [
  {
    slug: "malzeme-bilgisi",
    title: "Malzeme Satın Alma Bilgisi",
    docNo: "24-00000000",
    leftAction: "Kaydet",
    left: [
      { label: "İşletme", kind: "search", required: true, value: COMPANY },
      { label: "Lokasyon", kind: "search", required: true, value: LOCATION },
      {
        label: "Malzeme Satın Alma Bilgi Türü",
        kind: "select",
        required: true,
        value: "03 - Standart",
        options: ["01 - Hizmet", "02 - Malzeme", "03 - Standart", "04 - Sarf"],
      },
      {
        label: "Açıklama",
        value: "Merkez depo ve şubeler için toner tedariki",
      },
      {
        label: "Satın Alma Grubu",
        kind: "select",
        required: true,
        value: GROUP,
        options: [
          "001 - Yurtiçi Satınalma Grubu",
          "002 - İthalat Grubu",
          "003 - Doğrudan Temin",
        ],
      },
      {
        label: "Satın Alma Sorumlusu",
        kind: "select",
        required: true,
        value: OWNER,
        options: [
          OWNER,
          "02 - Kırtasiye & Sarf - Mehmet DÜNDAR",
          "03 - Teknik Hizmetler - Serkan Demir",
        ],
      },
      {
        label: "Malzeme",
        kind: "search",
        required: true,
        value: "2024-0010 - HP 658A Toner Kartuşu Siyah W2000A",
      },
      { label: "İş Ortağı", kind: "search", required: true, value: PARTNER },
      {
        label: "Teslimat Başlangıç Tarihi",
        kind: "date",
        required: true,
        value: "2024-07-17",
      },
      { label: "Teslimat Bitiş Tarihi", kind: "date", value: "2024-12-31" },
      { label: "Sürekli Tedarikçi", kind: "check", checked: true },
      { label: "Aktif", kind: "check", checked: true },
    ],
    body: <MaterialInfoBody />,
  },
  {
    slug: "teklif-degerlendirme",
    title: "Satın Alma Teklif Değerlendirme Detayı",
    docNo: "24-0000005",
    hasAttachmentIcon: true,
    badges: [{ tone: "blue", text: "Tamamlandı" }],
    leftAction: "Kaydet",
    left: [
      {
        label: "Teklif Değerlendirme Türü",
        kind: "select",
        required: true,
        value: "02 - Onaysız-Komisyon Üyeleri yok",
        options: [
          "01 - Komisyon Onaylı",
          "02 - Onaysız-Komisyon Üyeleri yok",
          "03 - Piyasa Araştırma",
        ],
      },
      { label: "İşletme", kind: "search", required: true, value: COMPANY },
      { label: "Lokasyon", kind: "search", required: true, value: LOCATION },
      {
        label: "Açıklama",
        required: true,
        value: "Teklif değerlendirme matrisi ve firma karşılaştırması",
      },
      {
        label: "Satın Alma Grubu",
        kind: "select",
        required: true,
        value: GROUP,
        options: ["001 - Yurtiçi Satınalma Grubu", "002 - İthalat Grubu"],
      },
      {
        label: "Satın Alma Sorumlusu",
        kind: "select",
        required: true,
        value: OWNER,
        options: [OWNER, "02 - Büro Personeli - Mehmet DÜNDAR"],
      },
      {
        label: "Kısmi Teklif",
        kind: "select",
        required: true,
        value: "Hayır",
        options: ["Evet", "Hayır"],
      },
      {
        label: "Malzeme Bazında Teklif",
        kind: "select",
        value: "Hayır",
        options: ["Evet", "Hayır"],
      },
      {
        label: "Teklif Değerlendirme Tarihi",
        kind: "date",
        value: "2024-07-15",
      },
      { label: "Malzeme Bazında En Düşük Birim Fiyata Göre", kind: "check" },
      { label: "Kısım Bazında En Düşük Toplam Fiyata Göre", kind: "check" },
      {
        label: "Teklif Bazında En Düşük Toplam Fiyata Göre",
        kind: "check",
        checked: true,
      },
    ],
    body: <EvaluationBody />,
  },
  {
    slug: "ihale-dosyasi",
    title: "Satın Alma Dosyası",
    docNo: "PRF-4-07-0000",
    hasAttachmentIcon: true,
    badges: [{ tone: "gray", text: "Kapalı" }],
    leftAction: "Kaydet",
    left: [
      { label: "İşletme", kind: "search", required: true, value: COMPANY },
      { label: "Lokasyon", kind: "search", required: true, value: LOCATION },
      {
        label: "İhale Yetkilisi",
        kind: "search",
        value: "8 - Personel 8 (Harcama Yetkilisi)",
      },
      {
        label: "İşin Adı",
        required: true,
        value: "2024 Yılı Toner ve Sarf Malzemesi Alımı",
      },
      {
        label: "Satın Alma Grubu",
        kind: "select",
        value: GROUP,
        options: ["001 - Yurtiçi Satınalma Grubu", "003 - Doğrudan Temin"],
      },
      {
        label: "Satın Alma Sorumlusu",
        kind: "select",
        value: OWNER,
        options: [OWNER, "03 - Şube Müdürü V. - Mustafa Yılmaz"],
      },
      {
        label: "Dosya Türü",
        kind: "select",
        required: true,
        value: "04 - Onaysız",
        options: [
          "01 - Açık İhale",
          "02 - Pazarlık",
          "03 - Belli İstekliler",
          "04 - Onaysız / DT",
        ],
      },
      {
        label: "Alım Türü",
        kind: "select",
        required: true,
        value: "Mal",
        options: ["Mal", "Hizmet", "Yapım İşi"],
      },
      {
        label: "Tedarik Kanalı",
        kind: "select",
        required: true,
        value: "Doğrudan Temin",
        options: ["Doğrudan Temin", "Kamu İhale", "DMO"],
      },
      {
        label: "Tedarik Kapsamı",
        kind: "select",
        required: true,
        value: "Kapsam Dışı",
        options: ["Kapsam Dışı", "Kapsam İçi"],
      },
      {
        label: "İhale Usulü",
        kind: "select",
        required: true,
        value: "4734 / 22-d",
        options: ["4734 / 22-d", "4734 / 22-a", "4734 / 19", "Diğer"],
      },
      {
        label: "KİK Maddesi",
        kind: "select",
        required: true,
        value: "Madde 22/d",
        options: ["Madde 22/d", "Madde 22/a", "Madde 21/f", "-"],
      },
      {
        label: "İşin Kapsamı",
        value: "Kurum genel merkez binaları toner tedariki",
      },
    ],
    body: <TenderFileBody />,
    footer: true,
  },
  {
    slug: "sozlesme",
    title: "Satın Alma Sözleşmesi",
    docNo: "24-00000001",
    hasAttachmentIcon: true,
    badges: [{ tone: "cyan", text: "Kısmi Açık" }, {
      tone: "green",
      text: "Onaylandı",
    }],
    leftAction: "Kaydet",
    left: [
      { label: "Revizyon Numarası", value: "1" },
      { label: "Açıklama", value: "Toner ve Bilişim Sarf Alım Sözleşmesi" },
      { label: "İşletme", kind: "search", required: true, value: COMPANY },
      { label: "Lokasyon", kind: "search", required: true, value: LOCATION },
      { label: "İş Ortağı", kind: "search", required: true, value: PARTNER },
      {
        label: "Sözleşme Belge Türü",
        kind: "select",
        required: true,
        value: "01 - Alım Sözleşmesi",
        options: [
          "01 - Alım Sözleşmesi",
          "02 - Hizmet Akdi",
          "03 - Çerçeve Anlaşma",
        ],
      },
      {
        label: "Sözleşme Kontrol Yöntemi",
        kind: "select",
        required: true,
        value: "Miktar Kontrolü",
        options: ["Miktar Kontrolü", "Tutar Kontrolü"],
      },
      {
        label: "Satın Alma Grubu",
        kind: "select",
        value: GROUP,
        options: ["001 - Yurtiçi Satınalma Grubu"],
      },
      {
        label: "Satın Alma Sorumlusu",
        kind: "select",
        value: OWNER,
        options: [OWNER],
      },
      {
        label: "Proje",
        kind: "search",
        value: "PRJ-2024/01 - Merkez Bilişim Altyapısı",
      },
      {
        label: "Sözleşme Türü",
        kind: "select",
        required: true,
        value: "Birim Fiyat",
        options: ["Birim Fiyat", "Götürü Bedel"],
      },
      { label: "Ana Sözleşme", kind: "search", value: "SÖZ-2024/09" },
      {
        label: "Sözleşme Başlangıç Tarihi",
        kind: "date",
        required: true,
        value: "2024-07-16",
      },
      {
        label: "Sözleşme Bitiş Tarihi",
        kind: "date",
        required: true,
        value: "2024-12-31",
      },
    ],
    body: <ContractBody />,
  },
  {
    slug: "dogrudan-temin",
    title: "Doğrudan Temin",
    docNo: "DT-24-0000001",
    hasAttachmentIcon: true,
    badges: [{ tone: "blue", text: "Taslak" }],
    leftAction: "Kaydet",
    left: [
      { label: "İşletme", kind: "search", required: true, value: COMPANY },
      { label: "Lokasyon", kind: "search", required: true, value: LOCATION },
      {
        label: "Tedarik Kanalı",
        kind: "select",
        required: true,
        value: "Doğrudan Temin",
        options: ["Doğrudan Temin", "Piyasa Araştırması", "Katalog"],
      },
      {
        label: "Alım Türü",
        kind: "select",
        required: true,
        value: "Mal",
        options: ["Mal", "Hizmet", "Yapım"],
      },
      {
        label: "Satın Alma Grubu",
        kind: "select",
        value: GROUP,
        options: ["001 - Yurtiçi Satınalma Grubu", "003 - 22/d Masası"],
      },
      {
        label: "Satın Alma Sorumlusu",
        kind: "select",
        value: OWNER,
        options: [OWNER, "02 - Mehmet DÜNDAR"],
      },
      {
        label: "İş Ortağı",
        kind: "search",
        value: "2024-0026 - Turuncu Ofis Bilişim Ltd. Şti.",
      },
      { label: "Satın Alma Dosyası", kind: "search", value: "PRF-4-07-0000" },
    ],
    body: <DirectProcurementBody />,
  },
];

export const SCREENS_BY_SLUG: Record<string, ScreenDef> = Object.fromEntries(
  SCREENS.map((s) => [s.slug, s]),
);

/* ---------- Arama / Katalog Listeleri ---------- */
const SEARCH_CATALOGS: Record<string, string[]> = {
  "İşletme": [
    "AKM - Akme Teknoloji Çözümleri A.Ş.",
    "İBB - İstanbul Büyükşehir Belediyesi Destek Hizmetleri",
    "ABB - Ankara Büyükşehir Belediyesi Fen İşleri",
    "DHM - Devlet Hava Meydanları İşletmesi Genel Müdürlüğü",
  ],
  "Lokasyon": [
    "AKM-ANK - Akme Ankara ODTÜ Teknokent",
    "İST-MRK - Merkez Lojistik ve Satınalma Ambarı",
    "İST-KAD - Kadıköy Hizmet Binası",
    "ANK-MRK - Ankara Merkez Lojistik Deposu",
  ],
  "Malzeme": [
    "2024-0010 - HP 658A Toner Kartuşu Siyah W2000A",
    "2024-0011 - HP 658A Mavi Toner (W2001A)",
    "2024-0012 - HP 658A Sarı Toner (W2002A)",
    "2024-0013 - HP 658A Kırmızı Toner (W2003A)",
    "2024-0020 - A4 80 gr 1. Hamur Fotokopi Kağıdı (Koli)",
    "2024-0033 - Std Hs-2 Toner Kartuşu",
  ],
  "İş Ortağı": [
    "2024-0026 - Turuncu Ofis Bilişim Limited Şirketi",
    "2024-0022 - Financial Technologies Administration",
    "2024-0045 - Ankara Kurumsal Kırtasiye A.Ş.",
    "2024-0091 - Başkent Bilişim Sistemleri San. Tic.",
  ],
  "İhale Yetkilisi": [
    "8 - Personel 8 (Satınalma Müdürü)",
    "Dr. Hakan YILMAZ (Daire Başkanı / Harcama Yetkilisi)",
    "Mustafa YILMAZ (Satınalma Şube Müdürü V.)",
  ],
  "Satın Alma Dosyası": [
    "PRF-4-07-0000 - 2024 Yılı Toner ve Sarf Malzemesi Alımı",
    "2026/DT-001 - Destek Hizmetleri 8 Kalem Toner Alımı",
    "2026/DT-002 - HVAC Bakım Onarım Hizmet Alımı",
  ],
  "Proje": [
    "PRJ-2024/01 - Merkez Bilişim ve Donanım Yenileme Projesi",
    "PRJ-2024/02 - İdari Kampüs Altyapı Modernizasyonu",
  ],
  "Ana Sözleşme": [
    "SÖZ-2024/09 - Yıllık Sarf ve Malzeme Tedarik Sözleşmesi",
    "SÖZ-2024/01 - Bilişim Donanım Çerçeve Anlaşması",
  ],
};

/* ---------- Yönetilebilir ve Canlı Sol Panel Bileşeni ---------- */
export function LeftPanel({ screen }: { screen: ScreenDef }) {
  // Form alanları için canlı state
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    screen.left.forEach((f) => {
      initial[f.label] = f.checked !== undefined ? f.checked : f.value || "";
    });
    return initial;
  });

  // Arama / Katalog Modalı Durumu
  const [activeSearchField, setActiveSearchField] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // LocalStorage'dan kayıtlı verileri geri yükle
  useState(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(`temin360_proc_${screen.slug}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {
      // ignore
    }
  });

  const handleFieldChange = (label: string, val: any) => {
    setFormData((prev) => ({ ...prev, [label]: val }));
    setIsSaved(false);
  };

  const handleOpenSearchModal = (fieldLabel: string) => {
    setActiveSearchField(fieldLabel);
    setSearchQuery("");
  };

  const handleSelectSearchResult = (chosenValue: string) => {
    if (activeSearchField) {
      handleFieldChange(activeSearchField, chosenValue);
      setActiveSearchField(null);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        `temin360_proc_${screen.slug}`,
        JSON.stringify(formData),
      );
    } catch {
      // ignore
    }
    setIsSaved(true);
    setToastMessage("✓ Satın alma bilgileri başarıyla kaydedildi!");
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleResetToDefault = () => {
    const reset: Record<string, any> = {};
    screen.left.forEach((f) => {
      reset[f.label] = f.checked !== undefined ? f.checked : f.value || "";
    });
    setFormData(reset);
    try {
      localStorage.removeItem(`temin360_proc_${screen.slug}`);
    } catch {
      // ignore
    }
    setToastMessage("Fabrika ayarlarına sıfırlandı.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Arama kataloğu seçenekleri
  const catalogOptions = activeSearchField
    ? SEARCH_CATALOGS[activeSearchField] || [
      `${formData[activeSearchField] || "Varsayılan Kayıt 1"}`,
      "Alternatif Kayıt 2 (Kurumsal)",
      "Alternatif Kayıt 3 (Genel Merkez)",
    ]
    : [];

  const filteredOptions = catalogOptions.filter((opt) =>
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)] flex flex-col justify-between">
      <div>
        {/* Üst Başlık & Durum Rozeti */}
        <div className="flex items-center justify-between border-b border-[#e3e6eb] px-4 py-2.5 text-[12px] font-semibold text-[#172334] bg-white">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold text-[#172334]">
              Belge No: {screen.docNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-sm px-1.5 py-0.5 text-[10px] font-medium transition ${
                isSaved
                  ? "bg-[#dcefd9] text-[#2f6a2f]"
                  : "bg-[#d3e0fb] text-[#2d62d7]"
              }`}
            >
              {isSaved ? "✓ Kaydedildi" : "● Düzenlenebilir"}
            </span>

            {screen.hasAttachmentIcon && (
              <span className="relative" aria-label="0 ek">
                <FileText className="size-3.5 text-[#43505f]" />
                <span className="absolute -bottom-1 -right-1 flex size-3 items-center justify-center rounded-full bg-[#2d62d7] text-[7.5px] text-white">
                  0
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Kayıt Başarı Toast Bildirimi */}
        {toastMessage && (
          <div className="mx-3 mt-2 rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-800 animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* Form Alanları (Aktif, Yönetilebilir, Canlı) */}
        <div className="space-y-2.5 p-3.5 text-[11px]">
          {screen.badges && (
            <div className="flex flex-wrap gap-1.5 mb-1">
              {screen.badges.map((b) => (
                <Badge key={b.text} tone={b.tone}>
                  {b.text}
                </Badge>
              ))}
            </div>
          )}

          {screen.left.map((f) => {
            const currentValue = formData[f.label];
            const fieldSpec: FieldSpec = {
              ...f,
              disabled: false, // KULLANICI ARTIK RAHATÇA YÖNETEBİLİR
              value: f.kind !== "check" && f.kind !== "toggle"
                ? currentValue
                : undefined,
              checked: f.kind === "check" || f.kind === "toggle"
                ? Boolean(currentValue)
                : undefined,
              onChange: (val) => handleFieldChange(f.label, val),
              onSearchClick: () => handleOpenSearchModal(f.label),
            };
            return <Field key={f.label} spec={fieldSpec} />;
          })}
        </div>
      </div>

      {/* Alt Aksiyon Butonları & Bağlantılar */}
      <div>
        <div className="flex items-center justify-between border-t border-[#e3e6eb] bg-[#f8f9fb] px-3.5 py-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1 text-[10.5px] text-[#7b8794] hover:text-[#26384c] transition"
            title="Varsayılan değerlere sıfırla"
          >
            <RotateCcw className="size-3" />
            <span>Sıfırla</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3 text-[11px] font-semibold text-white transition hover:bg-[#2455bd] shadow-2xs"
          >
            <Save className="size-3 text-white" />
            <span>Değişiklikleri Kaydet</span>
          </button>
        </div>

        {/* Hızlı Entegrasyon Bağlantıları */}
        <div className="border-t border-[#e3e6eb] bg-white p-3 text-[11px] space-y-1.5">
          <span className="block font-bold text-[#172334] text-[10.5px]">
            Bağlantılı Süreçler &amp; Modüller
          </span>
          <div className="flex flex-col gap-1 text-[10.5px]">
            <Link
              href="/temin-dosyasi"
              className="flex items-center justify-between rounded border border-[#d9dee5] bg-[#f8f9fb] px-2.5 py-1.5 font-medium text-[#172334] hover:border-[#2d62d7] hover:text-[#2d62d7] transition"
            >
              <span>Doğrudan Temin Dosyaları (22/d Masası)</span>
              <FileSignature className="size-3 text-[#2d62d7]" />
            </Link>
            <Link
              href="/is-akislari"
              className="flex items-center justify-between rounded border border-[#d9dee5] bg-[#f8f9fb] px-2.5 py-1.5 font-medium text-[#172334] hover:border-[#2d62d7] hover:text-[#2d62d7] transition"
            >
              <span>EBYS Onay &amp; Paraf Rota Akışı</span>
              <GitBranch className="size-3 text-[#2d62d7]" />
            </Link>
            <Link
              href="/yazdirma-merkezi"
              className="flex items-center justify-between rounded border border-[#d9dee5] bg-[#f8f9fb] px-2.5 py-1.5 font-medium text-[#172334] hover:border-[#2d62d7] hover:text-[#2d62d7] transition"
            >
              <span>Yazdırma &amp; Dışa Aktarma Merkezi</span>
              <Printer className="size-3 text-[#2d62d7]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Arama / Katalog Seçim Modalı */}
      {activeSearchField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-lg border border-[#e1e5ea] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e3e6eb] bg-[#f8f9fb] px-4 py-2.5 text-[12px] font-bold text-[#172334]">
              <div className="flex items-center gap-1.5">
                <Search className="size-3.5 text-[#2d62d7]" />
                <span>Katalog Seçimi: {activeSearchField}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSearchField(null)}
                className="text-[#7b8794] hover:text-[#172334]"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-3 space-y-2.5 text-[11px]">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Katalog içinde ara..."
                  autoFocus
                  className="h-7 w-full rounded border border-[#d9dee5] pl-7 pr-2 text-[11px] outline-none focus:border-[#2d62d7]"
                />
                <Search className="pointer-events-none absolute left-2 top-2 size-3 text-[#7b8794]" />
              </div>

              <div className="max-h-56 overflow-y-auto divide-y divide-[#eef0f3] rounded border border-[#e3e6eb]">
                {filteredOptions.length > 0
                  ? (
                    filteredOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectSearchResult(opt)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-[11px] text-[#172334] hover:bg-[#f2f5ff] hover:text-[#2d62d7] transition"
                      >
                        <span>{opt}</span>
                        <Check className="size-3 opacity-0 group-hover:opacity-100 text-[#2d62d7]" />
                      </button>
                    ))
                  )
                  : (
                    <div className="py-6 text-center text-[10.5px] text-[#7b8794]">
                      Eşleşen kayıt bulunamadı.
                    </div>
                  )}
              </div>
            </div>

            <div className="flex justify-end border-t border-[#e3e6eb] bg-[#f8f9fb] px-4 py-2">
              <button
                type="button"
                onClick={() => setActiveSearchField(null)}
                className="h-7 rounded border border-[#d9dee5] bg-white px-3 text-[11px] font-medium text-[#4f5b69] hover:bg-[#f5f6f8]"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
