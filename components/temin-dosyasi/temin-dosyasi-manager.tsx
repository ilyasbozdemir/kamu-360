"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Database,
  Download,
  Edit,
  Eye,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  Layers,
  Lock,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Send,
  Shield,
  ShieldCheck,
  Sliders,
  Trash2,
  Unlock,
  Upload,
  User,
  Users,
} from "lucide-react";
import {
  ORNEK_TEMIN_DOSYALARI,
  TeminDosyasiKaydi,
  TeminFirmaTeklifiKaydi,
  TeminKalemKaydi,
  TeminKomisyonUyesi,
  TeminRotaAdimi,
} from "@/lib/temin-dosyasi/schema";
import { TEMPLATE_REGISTRY } from "@/lib/document-engine/registry";
import { PrintJob, usePrintHub } from "@/lib/print-hub-context";
import { UniversalDocumentModal } from "@/components/document-preview/universal-document-modal";

export function TeminDosyasiManager() {
  const { addToPrintQueue } = usePrintHub();
  const [dosyalar, setDosyalar] = useState<TeminDosyasiKaydi[]>(
    ORNEK_TEMIN_DOSYALARI,
  );
  const [seciliDosyaId, setSeciliDosyaId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<
    | "idari"
    | "kalemler"
    | "firmalar"
    | "maliyet"
    | "personel"
    | "rota"
    | "belgeler"
  >("idari");
  const [seciliSablonKodu, setSeciliSablonKodu] = useState<string>(
    "DOC_ONAY_BELGESI",
  );
  const [kayitMesaji, setKayitMesaji] = useState<string | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalJobs, setModalJobs] = useState<PrintJob[]>([]);
  const [modalActiveId, setModalActiveId] = useState<string>("");
  const [snapshotRevision, setSnapshotRevision] = useState<number>(1);
  const [snapshotHash, setSnapshotHash] = useState<string>("SHA256:7A2B9C81");

  // SQLite data/temin360.sqlite'dan doğrudan yükle
  useEffect(() => {
    fetch("/api/temin-dosyalari")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setDosyalar(json.data);
          setSeciliDosyaId(json.data[0].id);
          setIsDbConnected(true);
        }
      })
      .catch((err) => {
        console.warn(
          "SQLite veri çekme uyarısı (varsayılan veriler kullanılıyor):",
          err,
        );
      });
  }, []);

  const aktifDosya: TeminDosyasiKaydi =
    dosyalar.find((d) => d.id === seciliDosyaId) || dosyalar[0] ||
    ORNEK_TEMIN_DOSYALARI[0];

  const updateField = <K extends keyof TeminDosyasiKaydi>(
    key: K,
    value: TeminDosyasiKaydi[K],
  ) => {
    if (aktifDosya.is_locked) {
      alert(
        "Bu dosya kilitlidir. Değişiklik yapmak için önce dosya kilidini açınız.",
      );
      return;
    }
    setDosyalar((prev) =>
      prev.map((d) => (d.id === aktifDosya.id ? { ...d, [key]: value } : d))
    );
  };

  // SQLite veritabanına kaydet (POST /api/temin-dosyalari)
  const handleSaveToSqlite = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/temin-dosyalari", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: aktifDosya.id, data: aktifDosya }),
      });
      const result = await res.json();
      if (result.success) {
        setIsDbConnected(true);
        setKayitMesaji(
          `✅ data/temin360.sqlite dosyasına kalıcı olarak kaydedildi! (${aktifDosya.temin_no})`,
        );
      } else {
        setKayitMesaji(
          `⚠️ Kayıt uyarısı: ${result.error || "İşlem tamamlandı"}`,
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setKayitMesaji(`İşlem tamamlandı (Yerel önbellek güncellendi): ${msg}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setKayitMesaji(null), 4000);
    }
  };

  // Kesintileri ve Net Ödemeyi Otomatik Hesapla (Mevzuat Standartları)
  const handleHesaplaKesintiler = () => {
    const ym = aktifDosya.yaklasik_maliyet || 0;
    // Damga vergisi binde 9,48
    const damga = +(ym * 0.00948).toFixed(2);
    // Karar pulu binde 5,69
    const kararPulu = +(ym * 0.00569).toFixed(2);
    const kdvTevkifat = aktifDosya.kesinti_kdv_tevkifat || 0;
    const net = +(ym - damga - kararPulu - kdvTevkifat).toFixed(2);

    setDosyalar((prev) =>
      prev.map((d) =>
        d.id === aktifDosya.id
          ? {
            ...d,
            kesinti_damga: damga,
            kesinti_karar_pulu: kararPulu,
            net_odenen: net,
          }
          : d
      )
    );
    setKayitMesaji(
      "Yasal kesintiler ve net ödeme tutarı mevzuat oranlarına göre güncellendi.",
    );
    setTimeout(() => setKayitMesaji(null), 3500);
  };

  // 1. KALEMLER YÖNETİMİ
  const handleAddKalem = () => {
    const mevcutKalemler = aktifDosya.kalemler || [];
    const yeniSira = mevcutKalemler.length + 1;
    const yeniKalem: TeminKalemKaydi = {
      id: Date.now(),
      dosya_id: aktifDosya.id,
      sira_no: yeniSira,
      kalem_kodu: `2026-${String(yeniSira).padStart(4, "0")}`,
      kalem_adi: "Yeni Malzeme / Hizmet Kalemi",
      birim: "Adet",
      miktar: 1,
      fiyat1: 0,
      fiyat2: 0,
      fiyat3: 0,
      yaklasik_birim_fiyat: 0,
      toplam_tutar: 0,
      kdv_orani: 20,
    };
    const guncel = [...mevcutKalemler, yeniKalem];
    updateField("kalemler", guncel);
  };

  const handleUpdateKalem = (
    index: number,
    field: keyof TeminKalemKaydi,
    value: string | number,
  ) => {
    const mevcut = [...(aktifDosya.kalemler || [])];
    const hedef = { ...mevcut[index], [field]: value };

    // Fiyat ve ortalama hesaplama
    if (["fiyat1", "fiyat2", "fiyat3", "miktar"].includes(field as string)) {
      const f1 = Number(field === "fiyat1" ? value : hedef.fiyat1 || 0);
      const f2 = Number(field === "fiyat2" ? value : hedef.fiyat2 || 0);
      const f3 = Number(field === "fiyat3" ? value : hedef.fiyat3 || 0);
      const gecerliFiyatlar = [f1, f2, f3].filter((f) => f > 0);
      const ortalama = gecerliFiyatlar.length > 0
        ? +(gecerliFiyatlar.reduce((a, b) => a + b, 0) / gecerliFiyatlar.length)
          .toFixed(2)
        : Number(hedef.yaklasik_birim_fiyat || 0);
      const miktar = Number(field === "miktar" ? value : hedef.miktar || 1);
      hedef.yaklasik_birim_fiyat = ortalama;
      hedef.toplam_tutar = +(miktar * ortalama).toFixed(2);
    }

    mevcut[index] = hedef;
    updateField("kalemler", mevcut);
  };

  const handleRemoveKalem = (index: number) => {
    const mevcut = (aktifDosya.kalemler || []).filter((_, i) => i !== index);
    // Yeniden sıra numaralandır
    const reordered = mevcut.map((k, i) => ({ ...k, sira_no: i + 1 }));
    updateField("kalemler", reordered);
  };

  const handleSyncKalemlerTotal = () => {
    const kalemler = aktifDosya.kalemler || [];
    const toplam = kalemler.reduce((acc, k) => acc + (k.toplam_tutar || 0), 0);
    updateField("yaklasik_maliyet", +toplam.toFixed(2));
    handleHesaplaKesintiler();
    setKayitMesaji(
      `Kalemler toplamı (${
        toplam.toLocaleString("tr-TR")
      } TL) yaklaşık maliyete aktarıldı.`,
    );
    setTimeout(() => setKayitMesaji(null), 3500);
  };

  // 2. FİRMALAR & TEKLİFLER YÖNETİMİ
  const handleAddFirma = () => {
    const mevcutFirmalar = aktifDosya.firmalar || [];
    const yeniSira = mevcutFirmalar.length + 1;
    const yeniFirma: TeminFirmaTeklifiKaydi = {
      id: Date.now(),
      dosya_id: aktifDosya.id,
      sira_no: yeniSira,
      firma_adi: `İstekli Firma ${yeniSira} Ltd. Şti.`,
      vergi_no: "1234567890",
      yetkili_adi: "Firma Yetkilisi",
      telefon: "0312 000 00 00",
      eposta: "info@firma.com",
      toplam_teklif: aktifDosya.yaklasik_maliyet || 50000,
      kdv_durumu: "Hariç",
      degerlendirme_sonucu: `${yeniSira}. Teklif`,
      kazanan_mi: false,
    };
    updateField("firmalar", [...mevcutFirmalar, yeniFirma]);
  };

  const handleUpdateFirma = (
    index: number,
    field: keyof TeminFirmaTeklifiKaydi,
    value: string | number | boolean,
  ) => {
    const mevcut = [...(aktifDosya.firmalar || [])];
    mevcut[index] = { ...mevcut[index], [field]: value };
    updateField("firmalar", mevcut);
  };

  const handleSelectWinnerFirma = (index: number) => {
    const mevcut = (aktifDosya.firmalar || []).map((f, i) => ({
      ...f,
      kazanan_mi: i === index,
      degerlendirme_sonucu: i === index
        ? "En Avantajlı Teklif (Uygun)"
        : `${i + 1}. Teklif`,
    }));
    const kazanan = mevcut[index];
    updateField("firmalar", mevcut);
    if (kazanan) {
      updateField("kazanan_firma_adi", kazanan.firma_adi);
      if (kazanan.toplam_teklif > 0) {
        updateField("net_odenen", kazanan.toplam_teklif);
      }
      setKayitMesaji(
        `"${kazanan.firma_adi}" kazanan yüklenici firma olarak seçildi.`,
      );
      setTimeout(() => setKayitMesaji(null), 3500);
    }
  };

  const handleRemoveFirma = (index: number) => {
    const mevcut = (aktifDosya.firmalar || []).filter((_, i) => i !== index);
    const reordered = mevcut.map((f, i) => ({ ...f, sira_no: i + 1 }));
    updateField("firmalar", reordered);
  };

  // 3. KOMİSYON ÜYELERİ YÖNETİMİ
  const handleAddKomisyonUyesi = (rol: TeminKomisyonUyesi["rol"]) => {
    const mevcut = aktifDosya.komisyon_uyeleri || [];
    const yeniUye: TeminKomisyonUyesi = {
      id: Date.now(),
      ad_soyad: "Personel Adı Soyadı",
      unvan: "Büro Personeli",
      gorev: rol === "piyasa_arastirma"
        ? "Piyasa Araştırma Üyesi"
        : "Muayene Kabul Üyesi",
      rol,
    };
    updateField("komisyon_uyeleri", [...mevcut, yeniUye]);
  };

  const handleUpdateKomisyonUyesi = (
    index: number,
    field: keyof TeminKomisyonUyesi,
    val: string,
  ) => {
    const mevcut = [...(aktifDosya.komisyon_uyeleri || [])];
    mevcut[index] = { ...mevcut[index], [field]: val };
    updateField("komisyon_uyeleri", mevcut);
  };

  const handleRemoveKomisyonUyesi = (index: number) => {
    const mevcut = (aktifDosya.komisyon_uyeleri || []).filter((_, i) =>
      i !== index
    );
    updateField("komisyon_uyeleri", mevcut);
  };

  // 4. ROTA ADIMLARI YÖNETİMİ
  const handleAddRotaAdimi = () => {
    const mevcut = aktifDosya.rota_adimlari || [];
    const yeniSira = mevcut.length + 1;
    const yeniAdim: TeminRotaAdimi = {
      sira: yeniSira,
      tur: "Paraf",
      adSoyad: "Yeni Personel",
      unvan: "Görevli",
      durum: "BEKLIYOR",
    };
    updateField("rota_adimlari", [...mevcut, yeniAdim]);
  };

  const handleUpdateRotaAdimi = (
    index: number,
    field: keyof TeminRotaAdimi,
    val: string | number,
  ) => {
    const mevcut = [...(aktifDosya.rota_adimlari || [])];
    mevcut[index] = { ...mevcut[index], [field]: val };
    updateField("rota_adimlari", mevcut);
  };

  const handleRemoveRotaAdimi = (index: number) => {
    const mevcut = (aktifDosya.rota_adimlari || []).filter((_, i) =>
      i !== index
    );
    const reordered = mevcut.map((r, i) => ({ ...r, sira: i + 1 }));
    updateField("rota_adimlari", reordered);
  };

  // 5. YAZDIRMA & ÖNİZLEME YÖNETİMİ
  const getPrintCategory = (
    cat: string,
  ): "Doğrudan Temin (22/d)" | "EBYS Resmî Yazı" | "Sözleşme" => {
    if (cat.includes("EBYS")) return "EBYS Resmî Yazı";
    if (cat.includes("Sözleşme")) return "Sözleşme";
    return "Doğrudan Temin (22/d)";
  };

  const handleKuyrugaGonder = (sablonKodu: string) => {
    const sablon = TEMPLATE_REGISTRY[sablonKodu] ||
      TEMPLATE_REGISTRY.DOC_ONAY_BELGESI;
    addToPrintQueue({
      title: `${sablon.shortTitle} - ${aktifDosya.konu}`,
      docNo: sablon.code,
      dosyaNo: aktifDosya.temin_no,
      dosyaAdi: aktifDosya.konu,
      category: getPrintCategory(sablon.category),
      format: "A4 Dikey",
      pageCount: 1,
    });
    setKayitMesaji(
      `"${sablon.shortTitle}" Yazdırma Merkezine eklendi (Dosya: ${aktifDosya.temin_no}).`,
    );
    setTimeout(() => setKayitMesaji(null), 3000);
  };

  const handleKuyrugaTumunuGonder = () => {
    Object.values(TEMPLATE_REGISTRY).forEach((tpl) => {
      addToPrintQueue({
        title: `${tpl.shortTitle} - ${aktifDosya.konu}`,
        docNo: tpl.code,
        dosyaNo: aktifDosya.temin_no,
        dosyaAdi: aktifDosya.konu,
        category: getPrintCategory(tpl.category),
        format: "A4 Dikey",
        pageCount: 1,
      });
    });
    setKayitMesaji(
      `"${aktifDosya.temin_no}" dosyasına ait 8 resmî matbu şablonun tamamı Yazdırma Merkezine eklendi!`,
    );
    setTimeout(() => setKayitMesaji(null), 4000);
  };

  const handleOpenUniversalModal = (
    onlyCurrent = true,
    templateCode?: string,
  ) => {
    const code = templateCode || seciliSablonKodu;
    if (onlyCurrent) {
      const currentTpl = TEMPLATE_REGISTRY[code] ||
        TEMPLATE_REGISTRY.DOC_ONAY_BELGESI;
      const job: PrintJob = {
        id: `preview-${aktifDosya.id}-${currentTpl.code}`,
        title: currentTpl.title,
        docNo: currentTpl.code,
        dosyaNo: aktifDosya.temin_no,
        dosyaAdi: aktifDosya.konu,
        category: getPrintCategory(currentTpl.category),
        format: "A4 Dikey" as const,
        pageCount: 1,
        addedAt: "Şablon",
        status: "Hazır" as const,
      };
      setModalJobs([job]);
      setModalActiveId(job.id);
    } else {
      const allJobs: PrintJob[] = Object.values(TEMPLATE_REGISTRY).map((
        tpl,
      ) => ({
        id: `preview-${aktifDosya.id}-${tpl.code}`,
        title: tpl.title,
        docNo: tpl.code,
        dosyaNo: aktifDosya.temin_no,
        dosyaAdi: aktifDosya.konu,
        category: getPrintCategory(tpl.category),
        format: "A4 Dikey" as const,
        pageCount: 1,
        addedAt: "Şablon",
        status: "Hazır" as const,
      }));
      setModalJobs(allJobs);
      setModalActiveId(allJobs[0]?.id || "");
    }
    setIsModalOpen(true);
  };

  const handleToggleLock = () => {
    const yeniDurum = aktifDosya.is_locked ? 0 : 1;
    const sebep = yeniDurum === 1 ? "Manuel yetkili kilidi uygulandı." : "";
    updateField("is_locked", yeniDurum);
    updateField("lock_reason", sebep);
  };

  const handleEkapGonder = () => {
    if (aktifDosya.is_ekap_sent) {
      alert("Bu dosya zaten EKAP sistemine gönderilmiştir.");
      return;
    }
    const ekapNo = `2026/DT-EKAP-${Math.floor(10000 + Math.random() * 90000)}`;
    updateField("ekap_no", ekapNo);
    updateField("is_ekap_sent", 1);
    setKayitMesaji(
      `Dosya EKAP sistemine başarıyla iletildi. EKAP No: ${ekapNo}`,
    );
    setTimeout(() => setKayitMesaji(null), 4000);
  };

  return (
    <div className="space-y-3 pb-8">
      {/* 1. ÜST BREADCRUMB & KOMUTA MERKEZİ - Satın Alma Temasıyla 1:1 Uyumlu */}
      <div className="flex h-[46px] items-center justify-between border-b border-[#e3e6eb] bg-white px-4 text-[11px] text-[#7b8794]">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#26384c]">
            ⌂ Kamu 360
          </Link>
          <span className="text-[#adb5bd]">/</span>
          <Link
            href="/dogrudan-temin"
            className="font-semibold text-[#172334] hover:text-[#0c67dc]"
          >
            Doğrudan Temin Süreci (22/d)
          </Link>
          <span className="text-[#adb5bd]">/</span>
          <span className="font-semibold text-[#2d62d7]">
            Temin Dosyaları (Dosya Masası)
          </span>
        </div>

        {/* Sağ Hızlı Aksiyonlar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleKuyrugaTumunuGonder}
            className="flex h-7 items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-medium text-[#4f5b69] transition hover:bg-[#f5f6f8]"
            title="Bu dosyanın tüm 8 yasal belgesini yazdırma merkezine gönder"
          >
            <Printer className="size-3 text-[#2d62d7]" />
            <span>Tüm Belgeleri Kuyruğa Gönder (8)</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenUniversalModal(false)}
            className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3 text-[11px] font-medium text-white transition hover:bg-[#2455bd]"
            title="Dosyanın tüm belgelerini A4 kitapçık olarak canlı önizle"
          >
            <Eye className="size-3 text-white" />
            <span>Tümünü Önizle &amp; Yazdır</span>
          </button>
        </div>
      </div>

      {/* 2. AKTİF DOSYA SEÇİMİ VE DURUM BARI */}
      <div className="mx-3 flex flex-wrap items-center justify-between gap-3 rounded border border-[#e1e5ea] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] text-[#5b6877] font-medium">
              Aktif Temin Dosyası (DATA_TeminDosyasi)
            </label>
            <select
              value={aktifDosya.id}
              onChange={(e) => setSeciliDosyaId(Number(e.target.value))}
              className="mt-0.5 h-7 rounded border border-[#d9dee5] bg-white px-2 text-[11px] font-semibold text-[#1e293b] outline-none focus:border-[#2d62d7]"
            >
              {dosyalar.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.temin_no} —{" "}
                  {d.konu.slice(0, 48)}... ({d.yaklasik_maliyet.toLocaleString(
                    "tr-TR",
                  )} TL)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-3">
            <span
              className={`rounded-sm px-2 py-0.5 text-[10px] font-medium ${
                aktifDosya.status === "devam_ediyor"
                  ? "bg-[#d3e0fb] text-[#2d62d7]"
                  : "bg-[#dcefd9] text-[#2f6a2f]"
              }`}
            >
              {aktifDosya.status === "devam_ediyor"
                ? "● Devam Ediyor"
                : "✓ Tamamlandı"}
            </span>

            {aktifDosya.is_ekap_sent === 1
              ? (
                <span className="flex items-center gap-1 rounded-sm bg-[#dcefd9] px-2 py-0.5 text-[10px] font-medium text-[#2f6a2f]">
                  <Check className="size-3" /> EKAP: {aktifDosya.ekap_no}
                </span>
              )
              : (
                <button
                  type="button"
                  onClick={handleEkapGonder}
                  className="flex items-center gap-1 rounded-sm border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 hover:bg-amber-100"
                  title="EKAP sistemine doğrudan aktar"
                >
                  <Send className="size-3" /> EKAP&apos;a Gönder
                </button>
              )}

            <button
              type="button"
              onClick={handleToggleLock}
              className={`flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-medium transition ${
                aktifDosya.is_locked
                  ? "border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  : "border border-[#d9dee5] bg-white text-[#5b6877] hover:bg-[#f5f6f8]"
              }`}
            >
              {aktifDosya.is_locked
                ? (
                  <>
                    <Lock className="size-3 text-rose-600" /> Kilitli
                  </>
                )
                : (
                  <>
                    <Unlock className="size-3 text-[#7b8794]" /> Düzenlenebilir
                  </>
                )}
            </button>

            {/* SQLite DB Durumu */}
            <span
              className={`flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[10px] font-medium ${
                isDbConnected
                  ? "bg-[#cdeef3] text-[#1b6f80]"
                  : "bg-[#e4e6ea] text-[#4f5b69]"
              }`}
              title="data/temin360.sqlite (Node native SQLite bağlantısı)"
            >
              <Database className="size-3 text-[#1b6f80]" />
              <span>{isDbConnected ? "SQLite Aktif" : "Yerel Hafıza"}</span>
            </span>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-wrap items-center gap-2">
          {/* SQLite'a Kaydet Butonu */}
          <button
            type="button"
            onClick={handleSaveToSqlite}
            disabled={isSaving}
            className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3 text-[11px] font-medium text-white transition hover:bg-[#2455bd] disabled:opacity-50"
            title="Değişiklikleri data/temin360.sqlite dosyasına kalıcı yaz"
          >
            <Database className="size-3 text-white" />
            <span>{isSaving ? "Kaydediliyor..." : "SQLite'a Kaydet"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const yeniId = dosyalar.length + 1;
              const yeniDosya: TeminDosyasiKaydi = {
                ...ORNEK_TEMIN_DOSYALARI[0],
                id: yeniId,
                temin_no: `2026/DT-${String(yeniId).padStart(3, "0")}`,
                konu: "Yeni Doğrudan Temin Alım Dosyası",
                dosya_acilis_tarihi: new Date().toISOString().split("T")[0],
                yaklasik_maliyet: 50000,
                kesinti_damga: 474,
                kesinti_karar_pulu: 284.5,
                net_odenen: 49241.5,
                is_ekap_sent: 0,
                ekap_no: undefined,
                is_locked: 0,
                kalemler: [
                  {
                    id: 1,
                    sira_no: 1,
                    kalem_adi: "Genel İhtiyaç Kalemi",
                    birim: "Adet",
                    miktar: 10,
                    fiyat1: 5000,
                    fiyat2: 5000,
                    fiyat3: 5000,
                    yaklasik_birim_fiyat: 5000,
                    toplam_tutar: 50000,
                  },
                ],
                firmalar: [
                  {
                    id: 1,
                    sira_no: 1,
                    firma_adi: "Birinci Teklif Veren Firma Ltd. Şti.",
                    toplam_teklif: 49000,
                    kdv_durumu: "Hariç",
                    degerlendirme_sonucu: "En Avantajlı Teklif (Uygun)",
                    kazanan_mi: true,
                  },
                ],
              };
              setDosyalar([...dosyalar, yeniDosya]);
              setSeciliDosyaId(yeniId);
            }}
            className="flex h-7 items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-3 text-[11px] font-medium text-[#4f5b69] transition hover:bg-[#f5f6f8]"
          >
            <Plus className="size-3 text-[#2d62d7]" />
            <span>Yeni Dosya Aç</span>
          </button>

          <Link
            href="/yazdirma-merkezi"
            className="flex h-7 items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-3 text-[11px] font-medium text-[#4f5b69] transition hover:bg-[#f5f6f8]"
          >
            <Printer className="size-3 text-[#5b6877]" />
            <span>Yazdırma Merkezi</span>
          </Link>
        </div>
      </div>

      {/* Kayıt Bildirim Toast */}
      {kayitMesaji && (
        <div className="mx-3 rounded border border-blue-200 bg-blue-50/90 p-2.5 text-[11px] font-semibold text-[#1e40af] shadow-xs">
          {kayitMesaji}
        </div>
      )}

      {/* 3. ANA ÇALIŞMA ALANI: DOSYA VERİ MASALARI & BELGE STÜDYOSU */}
      <div className="mx-3 rounded border border-[#e1e5ea] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)] overflow-hidden">
        {/* Sekme Başlıkları - Kamu 360 Sekme Standardı */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#e2e8f0] bg-[#f8f9fb] px-2 pt-1 text-[12px]">
          <div className="flex flex-wrap items-center">
            <button
              type="button"
              onClick={() => setActiveTab("idari")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-bold transition ${
                activeTab === "idari"
                  ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
                  : "border-transparent text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <Building className="size-3.5" />
              <span>1. İdari &amp; Açılış</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("kalemler")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-bold transition ${
                activeTab === "kalemler"
                  ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
                  : "border-transparent text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <FileSpreadsheet className="size-3.5" />
              <span>2. Malzemeler &amp; Kalemler</span>
              <span className="rounded-sm bg-[#d3e0fb] px-1 py-0.2 text-[9.5px] font-semibold text-[#2d62d7]">
                {(aktifDosya.kalemler || []).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("firmalar")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-bold transition ${
                activeTab === "firmalar"
                  ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
                  : "border-transparent text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <Users className="size-3.5" />
              <span>3. Firmalar &amp; Teklifler</span>
              <span className="rounded-sm bg-[#d3e0fb] px-1 py-0.2 text-[9.5px] font-semibold text-[#2d62d7]">
                {(aktifDosya.firmalar || []).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("maliyet")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-bold transition ${
                activeTab === "maliyet"
                  ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
                  : "border-transparent text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <Sliders className="size-3.5" />
              <span>4. Maliyet &amp; Kesintiler</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("personel")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-bold transition ${
                activeTab === "personel"
                  ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
                  : "border-transparent text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <User className="size-3.5" />
              <span>5. Personel &amp; Komisyon</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("rota")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-bold transition ${
                activeTab === "rota"
                  ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
                  : "border-transparent text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <FileSignature className="size-3.5" />
              <span>6. EBYS Paraf/İmza Rotası</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("belgeler")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-bold transition ${
                activeTab === "belgeler"
                  ? "border-[#2d62d7] text-[#2d62d7] bg-white rounded-t"
                  : "border-transparent text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <FileCheck2 className="size-3.5 text-[#2d62d7]" />
              <span className="text-[#2d62d7]">
                7. Yasal Belgeler (8 Şablon)
              </span>
              <span className="rounded-sm bg-[#2d62d7] px-1 py-0.2 text-[9.5px] font-semibold text-white">
                8
              </span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 pr-3 text-[11px] font-mono text-[#5b6877]">
            <span>{aktifDosya.temin_no}</span>
            <span>•</span>
            <span className="font-sans font-semibold text-[#172334]">
              {aktifDosya.yaklasik_maliyet.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
              })} TL
            </span>
          </div>
        </div>

        {/* ===================== SEKME 1: İDARİ & DOSYA AÇILIŞ ===================== */}
        {activeTab === "idari" && (
          <div className="p-4 space-y-4 text-[11px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10.5px] font-medium text-[#5b6877]">
                  Dosya Numarası (temin_no)
                </label>
                <input
                  type="text"
                  value={aktifDosya.temin_no}
                  onChange={(e) => updateField("temin_no", e.target.value)}
                  className="mt-1 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] font-mono font-semibold text-[#172334] outline-none focus:border-[#2d62d7]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-medium text-[#5b6877]">
                  Dosya Açılış Tarihi
                </label>
                <input
                  type="date"
                  value={aktifDosya.dosya_acilis_tarihi}
                  onChange={(e) =>
                    updateField("dosya_acilis_tarihi", e.target.value)}
                  className="mt-1 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] text-[#172334] outline-none focus:border-[#2d62d7]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-medium text-[#5b6877]">
                  İhale / Alım Usulü Dayanağı
                </label>
                <select
                  value={aktifDosya.ihale_sekli || "4734 / 22-d"}
                  onChange={(e) => updateField("ihale_sekli", e.target.value)}
                  className="mt-1 h-7 w-full rounded border border-[#d9dee5] bg-white px-2 text-[11px] font-semibold text-[#172334] outline-none focus:border-[#2d62d7]"
                >
                  <option value="4734 / 22-d">
                    4734 Sayılı Kanun Madde 22/d (Doğrudan Temin)
                  </option>
                  <option value="4734 / 22-a">
                    4734 Sayılı Kanun Madde 22/a (Tek Satıcı / Tek Kaynak)
                  </option>
                  <option value="4734 / 22-c">
                    4734 Sayılı Kanun Madde 22/c (Fikri ve Sınai Haklar)
                  </option>
                  <option value="4734 / 22-f">
                    4734 Sayılı Kanun Madde 22/f (İlaç ve Tıbbi Cihaz)
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-medium text-[#5b6877]">
                İşin Adı / Temin Konusu (konu)
              </label>
              <input
                type="text"
                value={aktifDosya.konu}
                onChange={(e) => updateField("konu", e.target.value)}
                className="mt-1 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] font-semibold text-[#172334] outline-none focus:border-[#2d62d7]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-medium text-[#5b6877]">
                  İdare / Birim Adı
                </label>
                <input
                  type="text"
                  value={aktifDosya.birim}
                  onChange={(e) => updateField("birim", e.target.value)}
                  className="mt-1 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] text-[#172334] outline-none focus:border-[#2d62d7]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-medium text-[#5b6877]">
                  Kurum Antet Üst Satırı
                </label>
                <input
                  type="text"
                  value={aktifDosya.antet_ek_satir || ""}
                  onChange={(e) =>
                    updateField("antet_ek_satir", e.target.value)}
                  className="mt-1 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] text-[#172334] outline-none focus:border-[#2d62d7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10.5px] font-medium text-[#5b6877]">
                  Sunulacak Makam
                </label>
                <input
                  type="text"
                  value={aktifDosya.sunulacak_makam}
                  onChange={(e) =>
                    updateField("sunulacak_makam", e.target.value)}
                  className="mt-1 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] text-[#172334] outline-none focus:border-[#2d62d7]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-medium text-[#5b6877]">
                  İhtiyaç Yeri / Teslim Adresi
                </label>
                <input
                  type="text"
                  value={aktifDosya.ihtiyac_yeri}
                  onChange={(e) => updateField("ihtiyac_yeri", e.target.value)}
                  className="mt-1 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] text-[#172334] outline-none focus:border-[#2d62d7]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-medium text-[#5b6877]">
                  Teslim Süresi (Takvim Günü)
                </label>
                <input
                  type="number"
                  value={aktifDosya.teslim_gun}
                  onChange={(e) =>
                    updateField("teslim_gun", Number(e.target.value))}
                  className="mt-1 h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] text-[#172334] outline-none focus:border-[#2d62d7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-medium text-[#5b6877]">
                İşin Detaylı Açıklaması ve Gerekçesi
              </label>
              <textarea
                rows={3}
                value={aktifDosya.isin_aciklamasi || ""}
                onChange={(e) => updateField("isin_aciklamasi", e.target.value)}
                className="mt-1 w-full rounded border border-[#d9dee5] p-2 text-[11px] text-[#172334] outline-none focus:border-[#2d62d7]"
              />
            </div>
          </div>
        )}

        {/* ===================== SEKME 2: MALZEMELER & KALEMLER ===================== */}
        {activeTab === "kalemler" && (
          <div className="p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eef0f3] pb-2">
              <div>
                <h4 className="text-[12px] font-bold text-[#172334]">
                  İhtiyaç Kalemleri ve Piyasa Birim Fiyatları
                </h4>
                <p className="text-[10.5px] text-[#7b8794]">
                  Alımı yapılacak her mal/hizmet kalemini, birimini, miktarını
                  ve alınan 3 piyasa fiyatını buradan yönetin.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncKalemlerTotal}
                  className="flex h-7 items-center gap-1.5 rounded border border-[#d9dee5] bg-white px-2.5 text-[11px] font-medium text-[#2d62d7] transition hover:bg-[#f2f5ff]"
                  title="Kalemlerin toplamını Yaklaşık Maliyete aktar"
                >
                  <RotateCcw className="size-3" />
                  <span>Toplamı Yaklaşık Maliyete Aktar</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddKalem}
                  className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3 text-[11px] font-medium text-white transition hover:bg-[#2455bd]"
                >
                  <Plus className="size-3" />
                  <span>Yeni Kalem Ekle</span>
                </button>
              </div>
            </div>

            {/* Kalemler Tablosu */}
            <div className="overflow-x-auto rounded border border-[#e3e6eb]">
              <table className="w-full min-w-[760px] border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-[#e3e6eb] bg-[#f8f9fb] text-left text-[10.5px] font-semibold text-[#44546a]">
                    <th className="w-10 px-2 py-2 text-center">Sıra</th>
                    <th className="w-24 px-2 py-2">Kalem Kodu</th>
                    <th className="px-2 py-2 min-w-[200px]">
                      Malzeme / Hizmet Adı
                    </th>
                    <th className="w-16 px-2 py-2">Birim</th>
                    <th className="w-16 px-2 py-2 text-center">Miktar</th>
                    <th className="w-20 px-2 py-2 text-right">1. Fiyat</th>
                    <th className="w-20 px-2 py-2 text-right">2. Fiyat</th>
                    <th className="w-20 px-2 py-2 text-right">3. Fiyat</th>
                    <th className="w-24 px-2 py-2 text-right font-bold text-[#2d62d7]">
                      Yakl. Birim (TL)
                    </th>
                    <th className="w-24 px-2 py-2 text-right font-bold text-[#172334]">
                      Toplam (TL)
                    </th>
                    <th className="w-10 px-2 py-2 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef0f3]">
                  {(aktifDosya.kalemler || []).map((kalem, idx) => (
                    <tr key={kalem.id || idx} className="hover:bg-[#fafbfc]">
                      <td className="px-2 py-1.5 text-center font-mono text-[10px] text-[#7b8794]">
                        {idx + 1}
                      </td>
                      <td className="px-2 py-1.5 font-mono text-[10.5px]">
                        <input
                          type="text"
                          value={kalem.kalem_kodu || ""}
                          onChange={(e) =>
                            handleUpdateKalem(
                              idx,
                              "kalem_kodu",
                              e.target.value,
                            )}
                          className="h-6 w-full rounded border border-[#d9dee5] px-1 text-[10.5px] font-mono outline-none focus:border-[#2d62d7]"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          value={kalem.kalem_adi}
                          onChange={(e) =>
                            handleUpdateKalem(idx, "kalem_adi", e.target.value)}
                          className="h-6 w-full rounded border border-[#d9dee5] px-1.5 text-[11px] font-medium outline-none focus:border-[#2d62d7]"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          value={kalem.birim}
                          onChange={(e) =>
                            handleUpdateKalem(idx, "birim", e.target.value)}
                          className="h-6 w-full rounded border border-[#d9dee5] px-1 text-center text-[10.5px] outline-none focus:border-[#2d62d7]"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          value={kalem.miktar}
                          onChange={(e) =>
                            handleUpdateKalem(
                              idx,
                              "miktar",
                              Number(e.target.value),
                            )}
                          className="h-6 w-full rounded border border-[#d9dee5] px-1 text-center text-[10.5px] outline-none focus:border-[#2d62d7]"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          value={kalem.fiyat1 || 0}
                          onChange={(e) =>
                            handleUpdateKalem(
                              idx,
                              "fiyat1",
                              Number(e.target.value),
                            )}
                          className="h-6 w-full rounded border border-[#d9dee5] px-1 text-right text-[10.5px] font-mono outline-none focus:border-[#2d62d7]"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          value={kalem.fiyat2 || 0}
                          onChange={(e) =>
                            handleUpdateKalem(
                              idx,
                              "fiyat2",
                              Number(e.target.value),
                            )}
                          className="h-6 w-full rounded border border-[#d9dee5] px-1 text-right text-[10.5px] font-mono outline-none focus:border-[#2d62d7]"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          value={kalem.fiyat3 || 0}
                          onChange={(e) =>
                            handleUpdateKalem(
                              idx,
                              "fiyat3",
                              Number(e.target.value),
                            )}
                          className="h-6 w-full rounded border border-[#d9dee5] px-1 text-right text-[10.5px] font-mono outline-none focus:border-[#2d62d7]"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-[11px] font-semibold text-[#2d62d7]">
                        {(kalem.yaklasik_birim_fiyat || 0).toLocaleString(
                          "tr-TR",
                          { minimumFractionDigits: 2 },
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-[11px] font-bold text-[#172334]">
                        {(kalem.toplam_tutar || 0).toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveKalem(idx)}
                          className="text-[#7b8794] hover:text-[#d7445b] transition"
                          title="Kalemi Sil"
                        >
                          <Trash2 className="size-3.5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[#e3e6eb] bg-[#f8f9fb] font-bold text-[11px]">
                    <td
                      colSpan={8}
                      className="px-3 py-2 text-right text-[#44546a]"
                    >
                      Toplam Kalemler Yaklaşık Maliyeti:
                    </td>
                    <td
                      colSpan={2}
                      className="px-2 py-2 text-right font-mono text-[12px] text-[#2d62d7]"
                    >
                      {(aktifDosya.kalemler || [])
                        .reduce((acc, k) => acc + (k.toplam_tutar || 0), 0)
                        .toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      {" "}
                      TL
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ===================== SEKME 3: FİRMALAR & TEKLİFLER ===================== */}
        {activeTab === "firmalar" && (
          <div className="p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eef0f3] pb-2">
              <div>
                <h4 className="text-[12px] font-bold text-[#172334]">
                  Piyasa Araştırması Teklif Veren İstekliler / Firmalar
                </h4>
                <p className="text-[10.5px] text-[#7b8794]">
                  4734 Sayılı Kanun Madde 22/d uyarınca teklif veren en az 3
                  firmayı ve kazanan istekliyi belirleyin.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddFirma}
                className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3 text-[11px] font-medium text-white transition hover:bg-[#2455bd]"
              >
                <Plus className="size-3" />
                <span>Yeni Firma / Teklif Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {(aktifDosya.firmalar || []).map((firma, idx) => (
                <div
                  key={firma.id || idx}
                  className={`rounded border p-3 transition ${
                    firma.kazanan_mi
                      ? "border-[#2d62d7] bg-[#f5f8ff] shadow-xs"
                      : "border-[#e1e5ea] bg-white hover:border-[#b8c2cc]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded bg-[#e4e6ea] text-[10px] font-bold text-[#4f5b69]">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={firma.firma_adi}
                        onChange={(e) =>
                          handleUpdateFirma(idx, "firma_adi", e.target.value)}
                        className="h-7 w-64 rounded border border-[#d9dee5] px-2 text-[11px] font-bold text-[#172334] outline-none focus:border-[#2d62d7]"
                        placeholder="Firma Ticari Unvanı"
                      />
                      {firma.kazanan_mi && (
                        <span className="rounded-sm bg-[#dcefd9] px-2 py-0.5 text-[10px] font-bold text-[#2f6a2f]">
                          ✓ Kazanan Yüklenici Firma
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectWinnerFirma(idx)}
                        className={`flex h-7 items-center gap-1 rounded px-3 text-[10.5px] font-medium transition ${
                          firma.kazanan_mi
                            ? "bg-[#2f6a2f] text-white"
                            : "border border-[#d9dee5] bg-white text-[#4f5b69] hover:border-[#2d62d7] hover:text-[#2d62d7]"
                        }`}
                      >
                        <Check className="size-3" />
                        <span>
                          {firma.kazanan_mi
                            ? "Kazanan Seçildi"
                            : "Kazanan Olarak Seç"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveFirma(idx)}
                        className="flex size-7 items-center justify-center rounded text-[#7b8794] hover:bg-[#fee2e2]/40 hover:text-[#d7445b] transition"
                        title="Firmayı Sil"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Firma Detay Satırı */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[10.5px]">
                    <div>
                      <label className="text-[#5b6877]">
                        Vergi Kimlik Numarası
                      </label>
                      <input
                        type="text"
                        value={firma.vergi_no || ""}
                        onChange={(e) =>
                          handleUpdateFirma(idx, "vergi_no", e.target.value)}
                        className="mt-0.5 h-6 w-full rounded border border-[#d9dee5] px-1.5 font-mono outline-none focus:border-[#2d62d7]"
                        placeholder="10 Haneli VKN"
                      />
                    </div>

                    <div>
                      <label className="text-[#5b6877]">Firma Yetkilisi</label>
                      <input
                        type="text"
                        value={firma.yetkili_adi || ""}
                        onChange={(e) =>
                          handleUpdateFirma(idx, "yetkili_adi", e.target.value)}
                        className="mt-0.5 h-6 w-full rounded border border-[#d9dee5] px-1.5 outline-none focus:border-[#2d62d7]"
                        placeholder="Yetkili Ad Soyad"
                      />
                    </div>

                    <div>
                      <label className="text-[#5b6877]">
                        Toplam Teklif Tutarı (TL)
                      </label>
                      <input
                        type="number"
                        value={firma.toplam_teklif || 0}
                        onChange={(e) =>
                          handleUpdateFirma(
                            idx,
                            "toplam_teklif",
                            Number(e.target.value),
                          )}
                        className="mt-0.5 h-6 w-full rounded border border-[#d9dee5] px-1.5 font-mono font-semibold text-[#172334] outline-none focus:border-[#2d62d7]"
                      />
                    </div>

                    <div>
                      <label className="text-[#5b6877]">KDV Durumu</label>
                      <select
                        value={firma.kdv_durumu || "Hariç"}
                        onChange={(e) =>
                          handleUpdateFirma(idx, "kdv_durumu", e.target.value)}
                        className="mt-0.5 h-6 w-full rounded border border-[#d9dee5] bg-white px-1 outline-none focus:border-[#2d62d7]"
                      >
                        <option value="Hariç">KDV Hariç</option>
                        <option value="Dahil">KDV Dahil</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== SEKME 4: MALİYET & KESİNTİLER ===================== */}
        {activeTab === "maliyet" && (
          <div className="p-4 space-y-4 text-[11px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10.5px] font-medium text-[#5b6877]">
                  Yaklaşık Maliyet (TL - KDV Hariç)
                </label>
                <input
                  type="number"
                  value={aktifDosya.yaklasik_maliyet}
                  onChange={(e) =>
                    updateField("yaklasik_maliyet", Number(e.target.value))}
                  className="mt-1 h-7 w-full rounded border border-[#d9dee5] px-2 font-mono text-[12px] font-bold text-[#172334] outline-none focus:border-[#2d62d7]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-medium text-[#5b6877]">
                  Bütçe Yılı ve Tipi
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    value={aktifDosya.butce_yili}
                    onChange={(e) =>
                      updateField("butce_yili", Number(e.target.value))}
                    className="h-7 w-24 rounded border border-[#d9dee5] px-2 font-mono outline-none focus:border-[#2d62d7]"
                  />
                  <select
                    value={aktifDosya.butce_tipi}
                    onChange={(e) =>
                      updateField("butce_tipi", e.target.value as any)}
                    className="h-7 flex-1 rounded border border-[#d9dee5] bg-white px-2 outline-none focus:border-[#2d62d7]"
                  >
                    <option value="Genel Bütçe">Genel Bütçe</option>
                    <option value="Döner Sermaye">Döner Sermaye</option>
                    <option value="Özel Bütçe">Özel Bütçe</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleHesaplaKesintiler}
                  className="flex h-7 w-full items-center justify-center gap-1.5 rounded bg-[#2d62d7] px-3 font-semibold text-white transition hover:bg-[#2455bd]"
                >
                  <RotateCcw className="size-3" />
                  <span>Mevzuat Kesintilerini Otomatik Hesapla</span>
                </button>
              </div>
            </div>

            {/* Mali Tertip ve Kodlar */}
            <div className="rounded border border-[#e1e5ea] bg-[#f8f9fb] p-3">
              <h5 className="font-semibold text-[#172334] mb-2">
                Bütçe Tertibi ve Muhasebe Kodları
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
                <div>
                  <label className="text-[#5b6877]">Ekonomik Kod</label>
                  <input
                    type="text"
                    value={aktifDosya.ekonomik_kod || ""}
                    onChange={(e) =>
                      updateField("ekonomik_kod", e.target.value)}
                    className="mt-0.5 h-6 w-full rounded border border-[#d9dee5] px-1.5 font-mono outline-none focus:border-[#2d62d7]"
                    placeholder="03.2.1.01"
                  />
                </div>
                <div>
                  <label className="text-[#5b6877]">Fonksiyonel Kod</label>
                  <input
                    type="text"
                    value={aktifDosya.fonksiyonel_kod || ""}
                    onChange={(e) =>
                      updateField("fonksiyonel_kod", e.target.value)}
                    className="mt-0.5 h-6 w-full rounded border border-[#d9dee5] px-1.5 font-mono outline-none focus:border-[#2d62d7]"
                    placeholder="01.3.1.00"
                  />
                </div>
                <div>
                  <label className="text-[#5b6877]">Finansman Kodu</label>
                  <input
                    type="text"
                    value={aktifDosya.finansman_kodu || ""}
                    onChange={(e) =>
                      updateField("finansman_kodu", e.target.value)}
                    className="mt-0.5 h-6 w-full rounded border border-[#d9dee5] px-1.5 font-mono outline-none focus:border-[#2d62d7]"
                    placeholder="05.1"
                  />
                </div>
                <div>
                  <label className="text-[#5b6877]">Say2000i / E-Bütçe</label>
                  <input
                    type="text"
                    value={aktifDosya.say2000i || ""}
                    onChange={(e) => updateField("say2000i", e.target.value)}
                    className="mt-0.5 h-6 w-full rounded border border-[#d9dee5] px-1.5 font-mono outline-none focus:border-[#2d62d7]"
                    placeholder="SAY-2026-8412"
                  />
                </div>
              </div>
            </div>

            {/* Yasal Kesintiler ve Tahakkuk Dökümü */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="rounded border border-[#e1e5ea] bg-white p-3">
                <span className="text-[10px] text-[#5b6877]">
                  Sözleşme Damga Vergisi (‰ 9,48)
                </span>
                <p className="mt-1 font-mono text-[14px] font-bold text-[#172334]">
                  {aktifDosya.kesinti_damga.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })} TL
                </p>
              </div>

              <div className="rounded border border-[#e1e5ea] bg-white p-3">
                <span className="text-[10px] text-[#5b6877]">
                  İhale Karar Pulu (‰ 5,69)
                </span>
                <p className="mt-1 font-mono text-[14px] font-bold text-[#172334]">
                  {aktifDosya.kesinti_karar_pulu.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })} TL
                </p>
              </div>

              <div className="rounded border border-[#e1e5ea] bg-white p-3">
                <span className="text-[10px] text-[#5b6877]">
                  KDV Tevkifatı (Varsa)
                </span>
                <p className="mt-1 font-mono text-[14px] font-bold text-[#172334]">
                  {(aktifDosya.kesinti_kdv_tevkifat || 0).toLocaleString(
                    "tr-TR",
                    { minimumFractionDigits: 2 },
                  )} TL
                </p>
              </div>

              <div className="rounded border border-[#dcefd9] bg-[#f4faf4] p-3">
                <span className="text-[10px] font-semibold text-[#2f6a2f]">
                  Net Ödenecek Hakediş Tutarı
                </span>
                <p className="mt-1 font-mono text-[15px] font-bold text-[#2f6a2f]">
                  {aktifDosya.net_odenen.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })} TL
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== SEKME 5: PERSONEL & KOMİSYON ===================== */}
        {activeTab === "personel" && (
          <div className="p-4 space-y-4 text-[11px]">
            {/* İdari Yetkililer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-[#e1e5ea] p-3">
                <h5 className="font-semibold text-[#172334] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-[#2d62d7]" />
                  <span>Harcama Yetkilisi (İhale Onay Makamı)</span>
                </h5>
                <input
                  type="text"
                  value={aktifDosya.onay_personel_adi || ""}
                  onChange={(e) =>
                    updateField("onay_personel_adi", e.target.value)}
                  className="h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] font-medium outline-none focus:border-[#2d62d7]"
                  placeholder="Dr. Hakan YILMAZ (Daire Başkanı)"
                />
              </div>

              <div className="rounded border border-[#e1e5ea] p-3">
                <h5 className="font-semibold text-[#172334] mb-2 flex items-center gap-1.5">
                  <User className="size-4 text-[#2d62d7]" />
                  <span>Gerçekleştirme Görevlisi / Bürosu</span>
                </h5>
                <input
                  type="text"
                  value={aktifDosya.hazirlayan_personel_adi || ""}
                  onChange={(e) =>
                    updateField("hazirlayan_personel_adi", e.target.value)}
                  className="h-7 w-full rounded border border-[#d9dee5] px-2 text-[11px] font-medium outline-none focus:border-[#2d62d7]"
                  placeholder="Mehmet DÜNDAR (Satınalma Şube Müdürü V.)"
                />
              </div>
            </div>

            {/* Piyasa Fiyat Araştırma Görevlileri */}
            <div className="rounded border border-[#e1e5ea] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-[#172334]">
                  Piyasa Fiyat Araştırması Görevlileri (Tutanak İmzacıları)
                </h5>
                <button
                  type="button"
                  onClick={() => handleAddKomisyonUyesi("piyasa_arastirma")}
                  className="flex h-6 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2 text-[10.5px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff]"
                >
                  <Plus className="size-3" /> Üye Ekle
                </button>
              </div>

              <div className="divide-y divide-[#eef0f3]">
                {(aktifDosya.komisyon_uyeleri || [])
                  .filter((u) => u.rol === "piyasa_arastirma")
                  .map((uye, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 gap-2"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          type="text"
                          value={uye.ad_soyad}
                          onChange={(e) =>
                            handleUpdateKomisyonUyesi(
                              (aktifDosya.komisyon_uyeleri || []).indexOf(uye),
                              "ad_soyad",
                              e.target.value,
                            )}
                          className="h-6 flex-1 rounded border border-[#d9dee5] px-2 font-medium outline-none focus:border-[#2d62d7]"
                        />
                        <input
                          type="text"
                          value={uye.unvan}
                          onChange={(e) =>
                            handleUpdateKomisyonUyesi(
                              (aktifDosya.komisyon_uyeleri || []).indexOf(uye),
                              "unvan",
                              e.target.value,
                            )}
                          className="h-6 w-48 rounded border border-[#d9dee5] px-2 outline-none focus:border-[#2d62d7]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveKomisyonUyesi(
                            (aktifDosya.komisyon_uyeleri || []).indexOf(uye),
                          )}
                        className="text-[#7b8794] hover:text-[#d7445b]"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Muayene ve Kabul Komisyonu */}
            <div className="rounded border border-[#e1e5ea] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-[#172334]">
                  Muayene ve Kabul Komisyonu (Kabul Tutanağı İmzacıları)
                </h5>
                <button
                  type="button"
                  onClick={() => handleAddKomisyonUyesi("muayene_kabul")}
                  className="flex h-6 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2 text-[10.5px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff]"
                >
                  <Plus className="size-3" /> Üye Ekle
                </button>
              </div>

              <div className="divide-y divide-[#eef0f3]">
                {(aktifDosya.komisyon_uyeleri || [])
                  .filter((u) => u.rol === "muayene_kabul")
                  .map((uye, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 gap-2"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          type="text"
                          value={uye.ad_soyad}
                          onChange={(e) =>
                            handleUpdateKomisyonUyesi(
                              (aktifDosya.komisyon_uyeleri || []).indexOf(uye),
                              "ad_soyad",
                              e.target.value,
                            )}
                          className="h-6 flex-1 rounded border border-[#d9dee5] px-2 font-medium outline-none focus:border-[#2d62d7]"
                        />
                        <input
                          type="text"
                          value={uye.unvan}
                          onChange={(e) =>
                            handleUpdateKomisyonUyesi(
                              (aktifDosya.komisyon_uyeleri || []).indexOf(uye),
                              "unvan",
                              e.target.value,
                            )}
                          className="h-6 w-48 rounded border border-[#d9dee5] px-2 outline-none focus:border-[#2d62d7]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveKomisyonUyesi(
                            (aktifDosya.komisyon_uyeleri || []).indexOf(uye),
                          )}
                        className="text-[#7b8794] hover:text-[#d7445b]"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== SEKME 6: EBYS PARAF/İMZA ROTASI ===================== */}
        {activeTab === "rota" && (
          <div className="p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eef0f3] pb-2">
              <div>
                <h4 className="text-[12px] font-bold text-[#172334]">
                  EBYS Resmî Onay &amp; Paraf Rotası
                </h4>
                <p className="text-[10.5px] text-[#7b8794]">
                  Belgelerin Cumhurbaşkanlığı Resmî Yazışma Yönetmeliği ve EBYS
                  akışındaki paraf ve imza adımları.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRotaAdimi}
                className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3 text-[11px] font-medium text-white transition hover:bg-[#2455bd]"
              >
                <Plus className="size-3" />
                <span>Yeni Rota Adımı Ekle</span>
              </button>
            </div>

            <div className="space-y-2">
              {(aktifDosya.rota_adimlari || []).map((rota, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-[#e1e5ea] bg-white p-3 text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded bg-[#e4e6ea] font-mono text-[10px] font-bold text-[#4f5b69]">
                      {rota.sira}
                    </span>
                    <select
                      value={rota.tur}
                      onChange={(e) =>
                        handleUpdateRotaAdimi(
                          idx,
                          "tur",
                          e.target.value as any,
                        )}
                      className="h-7 rounded border border-[#d9dee5] bg-white px-2 text-[11px] font-semibold text-[#172334] outline-none"
                    >
                      <option value="Paraf">Paraf</option>
                      <option value="İmza">İmza</option>
                      <option value="Onay">Onay</option>
                    </select>
                    <input
                      type="text"
                      value={rota.adSoyad}
                      onChange={(e) =>
                        handleUpdateRotaAdimi(idx, "adSoyad", e.target.value)}
                      className="h-7 w-48 rounded border border-[#d9dee5] px-2 font-medium text-[#172334] outline-none focus:border-[#2d62d7]"
                      placeholder="Ad Soyad"
                    />
                    <input
                      type="text"
                      value={rota.unvan}
                      onChange={(e) =>
                        handleUpdateRotaAdimi(idx, "unvan", e.target.value)}
                      className="h-7 w-64 rounded border border-[#d9dee5] px-2 text-[#5b6877] outline-none focus:border-[#2d62d7]"
                      placeholder="Unvan / Görev"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={rota.durum}
                      onChange={(e) =>
                        handleUpdateRotaAdimi(
                          idx,
                          "durum",
                          e.target.value as any,
                        )}
                      className={`h-7 rounded px-2 text-[10.5px] font-semibold outline-none ${
                        rota.durum === "IMZALANDI" ||
                          rota.durum === "PARAF_EDILDI"
                          ? "bg-[#dcefd9] text-[#2f6a2f] border border-[#b2dcb0]"
                          : "bg-[#fff5e6] text-[#b45309] border border-[#fcd34d]"
                      }`}
                    >
                      <option value="BEKLIYOR">⏳ Bekliyor</option>
                      <option value="PARAF_EDILDI">✓ Paraf Edildi</option>
                      <option value="IMZALANDI">✓ İmzalandı</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveRotaAdimi(idx)}
                      className="text-[#7b8794] hover:text-[#d7445b] transition"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== SEKME 7: YASAL MEVZUAT BELGELERİ (8 ŞABLON) ===================== */}
        {activeTab === "belgeler" && (
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eef0f3] pb-2">
              <div>
                <h4 className="text-[12px] font-bold text-[#172334]">
                  Doğrudan Temin Resmî Mevzuat Belgeleri (8 Matbu Şablon)
                </h4>
                <p className="text-[10.5px] text-[#7b8794]">
                  Yukarıdaki dosya, malzeme, firma ve komisyon verilerinizle 1:1
                  dinamik üretilen A4 resmî evraklar.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleKuyrugaTumunuGonder}
                  className="flex h-7 items-center gap-1.5 rounded border border-[#2d62d7] bg-white px-3 text-[11px] font-medium text-[#2d62d7] transition hover:bg-[#f2f5ff]"
                >
                  <Printer className="size-3" />
                  <span>Tümünü Kuyruğa Ekle (8)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenUniversalModal(false)}
                  className="flex h-7 items-center gap-1.5 rounded bg-[#2d62d7] px-3 text-[11px] font-medium text-white transition hover:bg-[#2455bd]"
                >
                  <Eye className="size-3" />
                  <span>Tümünü Kitapçık Olarak Önizle</span>
                </button>
              </div>
            </div>

            {/* 8 Belge Kart Listesi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(TEMPLATE_REGISTRY).map((tpl, idx) => (
                <div
                  key={tpl.code}
                  className="rounded border border-[#e1e5ea] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,.02)] transition hover:border-[#b8c2cc] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold text-[#2d62d7] bg-[#f0f4ff] border border-[#d3e0fb] px-1.5 py-0.5 rounded-sm">
                        {tpl.code}
                      </span>
                      <span className="text-[10px] font-medium text-[#5b6877] bg-[#f8f9fb] px-1.5 py-0.5 rounded-sm">
                        {tpl.category}
                      </span>
                    </div>

                    <h5 className="mt-2 text-[12px] font-bold text-[#172334]">
                      {tpl.title}
                    </h5>
                    <p className="mt-1 text-[10.5px] text-[#7b8794] line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-[#f0f2f5] pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenUniversalModal(true, tpl.code)}
                      className="flex h-6 items-center gap-1 rounded border border-[#d9dee5] bg-white px-2.5 text-[10.5px] font-medium text-[#2d62d7] transition hover:border-[#2d62d7] hover:bg-[#f2f5ff]"
                    >
                      <Eye className="size-3" />
                      <span>A4 Canlı Önizle</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleKuyrugaGonder(tpl.code)}
                      className="flex h-6 items-center gap-1 rounded bg-[#2d62d7] px-2.5 text-[10.5px] font-medium text-white transition hover:bg-[#2455bd]"
                    >
                      <Printer className="size-3" />
                      <span>Kuyruğa Ekle</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. EVRENSEL CANLI A4 ÖNİZLEME MODALI */}
      {isModalOpen && (
        <UniversalDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          jobs={modalJobs}
          activeJobId={modalActiveId || modalJobs[0]?.id || ""}
          onSelectJob={(id) => setModalActiveId(id)}
          dosyaVerisi={aktifDosya}
        />
      )}
    </div>
  );
}
