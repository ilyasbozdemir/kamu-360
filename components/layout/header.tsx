"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PrintJob, usePrintHub } from "@/lib/print-hub-context";
import { UniversalDocumentModal } from "@/components/document-preview/universal-document-modal";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useModule, MODULE_DEFINITIONS, ModuleKey } from "@/lib/module-context";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Building,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  HelpCircle,
  Info,
  Key,
  Layers,
  Lock,
  LogOut,
  Mail,
  Menu,
  Phone,
  Printer,
  Scale,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Moon,
  Monitor,
  Tag,
  Trash2,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";

interface HeaderProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
}

type ActiveDropdown =
  | "notifications"
  | "print"
  | "calendar"
  | "info"
  | "profile"
  | "search"
  | "theme"
  | null;

export function Header({ menuOpen, onToggleMenu }: HeaderProps) {
  const pathname = usePathname();
  const { activeModule, setActiveModule, currentModule } = useModule();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isHeaderModuleOpen, setIsHeaderModuleOpen] = useState(false);
  const { printQueue, removeFromPrintQueue, clearPrintQueue, batchPrint } =
    usePrintHub();
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notificationFilter, setNotificationFilter] = useState<
    "all" | "onay" | "sure"
  >("all");
  const [printFormat, setPrintFormat] = useState<"a4" | "excel" | "tutanak">(
    "a4",
  );
  const [infoTab, setInfoTab] = useState<
    "mevzuat" | "kisayollar" | "destek" | "sistem"
  >("mevzuat");
  const [activeLocation, setActiveLocation] = useState(
    "AKM-ANK - ODTÜ Teknokent",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDosyaFilter, setSelectedDosyaFilter] = useState<string>("all");
  const [expandedDossiers, setExpandedDossiers] = useState<
    Record<string, boolean>
  >({});
  const [isUniversalModalOpen, setIsUniversalModalOpen] = useState(false);
  const [previewJobs, setPreviewJobs] = useState<PrintJob[]>([]);
  const [activeJobId, setActiveJobId] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const openPreviewForJob = (job: PrintJob) => {
    setActiveDropdown(null);
    setPreviewJobs([job]);
    setActiveJobId(job.id);
    setIsUniversalModalOpen(true);
  };

  const openPreviewForJobs = (jobs: PrintJob[], initialId?: string) => {
    setActiveDropdown(null);
    setPreviewJobs(jobs);
    setActiveJobId(initialId || (jobs.length > 0 ? jobs[0].id : ""));
    setIsUniversalModalOpen(true);
  };

  // Dosya bazlı gruplama ve filtreleme
  const uniqueDossiers = useMemo(() => {
    const map = new Map<
      string,
      { dosyaNo: string; dosyaAdi: string; count: number }
    >();
    for (const job of printQueue) {
      const dNo = job.dosyaNo || "GENEL";
      const dAdi = job.dosyaAdi || "Genel / Tanımsız Dosya";
      const existing = map.get(dNo);
      if (existing) {
        existing.count++;
      } else {
        map.set(dNo, { dosyaNo: dNo, dosyaAdi: dAdi, count: 1 });
      }
    }
    return Array.from(map.values());
  }, [printQueue]);

  const filteredPrintQueue = useMemo(() => {
    if (selectedDosyaFilter === "all") return printQueue;
    return printQueue.filter((j) =>
      (j.dosyaNo || "GENEL") === selectedDosyaFilter
    );
  }, [printQueue, selectedDosyaFilter]);

  const groupedByDosya = useMemo(() => {
    const groups: {
      [dNo: string]: {
        dosyaNo: string;
        dosyaAdi: string;
        jobs: typeof printQueue;
      };
    } = {};
    for (const job of filteredPrintQueue) {
      const dNo = job.dosyaNo || "GENEL";
      const dAdi = job.dosyaAdi || "Genel / Tanımsız Dosya";
      if (!groups[dNo]) {
        groups[dNo] = { dosyaNo: dNo, dosyaAdi: dAdi, jobs: [] };
      }
      groups[dNo].jobs.push(job);
    }
    return Object.values(groups);
  }, [filteredPrintQueue]);

  const toggleDossierExpand = (dosyaNo: string) => {
    setExpandedDossiers((prev) => ({
      ...prev,
      // Default is expanded (undefined is open, false is closed)
      [dosyaNo]: prev[dosyaNo] === false ? true : false,
    }));
  };

  let currentModuleTitle = "Satın Alma Yönetimi";
  let currentModuleBadge = "4734 & DT";
  let isGelir = false;

  if (pathname.startsWith("/gelir-ihaleleri")) {
    currentModuleTitle = "Gelir Yönetimi";
    currentModuleBadge = "2886 Gelir";
    isGelir = true;
  } else if (
    pathname.startsWith("/is-akislari") || pathname.startsWith("/rota-yonetimi")
  ) {
    currentModuleTitle = "Rota & EBYS Yönetimi";
    currentModuleBadge = "İş Akışları";
  } else if (pathname.startsWith("/belge-builder")) {
    currentModuleTitle = "Belge Stüdyosu";
    currentModuleBadge = "Document Engine";
  } else if (pathname === "/") {
    currentModuleTitle = "Satın Alma & Gelir Yönetimi";
    currentModuleBadge = "Ana Panel";
  }

  // Bildirim verileri
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      category: "onay",
      title: "Teklif Değerlendirme Komisyon Onayı",
      desc: "24-0000005 nolu dosya komisyon üyelerinin onayına sunuldu.",
      time: "12 dk önce",
      type: "warning",
      docNo: "24-0000005",
      href: "/teklif-degerlendirme",
      unread: true,
    },
    {
      id: 2,
      category: "onay",
      title: "Doğrudan Temin Fiyat Araştırması",
      desc:
        "DT-24-0000001 nolu doğrudan temin piyasa fiyat araştırması tamamlandı.",
      time: "45 dk önce",
      type: "info",
      docNo: "DT-24-0000001",
      href: "/dogrudan-temin",
      unread: true,
    },
    {
      id: 3,
      category: "onay",
      title: "EBYS Resmî Yazı Paraf Sırası",
      desc: "DOC_RESMI_UST_YAZI belgesinde 2. adım paraf sırası sizdedir.",
      time: "2 saat önce",
      type: "action",
      docNo: "DOC_RESMI",
      href: "/belge-builder",
      unread: true,
    },
    {
      id: 4,
      category: "sure",
      title: "Kira Sözleşmesi Bitiş Uyarısı",
      desc:
        "24-00000001 sözleşmesinin bitişine 60 gün kaldı. Yenileme takvimini inceleyin.",
      time: "Dün",
      type: "normal",
      docNo: "24-00000001",
      href: "/sozlesme",
      unread: false,
    },
    {
      id: 5,
      category: "sure",
      title: "2886 Açık Artırma Oturumu",
      desc:
        "2886-2024/01 nolu taşınmaz kiralama ihalesi oturumu 22.07.2024 14:30’da başlayacaktır.",
      time: "2 gün önce",
      type: "info",
      docNo: "2886-2024/01",
      href: "/gelir-ihaleleri/teklif-artirma",
      unread: false,
    },
  ]);

  // Takvim etkinlikleri
  const calendarEvents = [
    {
      date: "15 Tem 2024",
      time: "14:00",
      title: "Teklif Değerlendirme Karar Saati",
      doc: "24-0000005",
      type: "4734 / Komisyon",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      date: "16 Tem 2024",
      time: "10:30",
      title: "MOU Sözleşme Başlangıç & Tescil",
      doc: "24-00000001",
      type: "Sözleşme",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    {
      date: "17 Tem 2024",
      time: "09:00",
      title: "Toner Malzeme Teslimat Başlangıcı",
      doc: "24-00000000",
      type: "Teslimat",
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      date: "22 Tem 2024",
      time: "14:30",
      title: "2886 Açık Artırma Pey Oturumu",
      doc: "2886-2024/01",
      type: "2886 / Satış-Kira",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      date: "10 Kas 2024",
      time: "15:00",
      title: "Q4 Kurumsal Bütçe Değerlendirme",
      doc: "Merkez",
      type: "Finans",
      color: "bg-slate-100 text-slate-800 border-slate-200",
    },
    {
      date: "31 Ara 2024",
      time: "17:00",
      title: "Yıllık Sözleşme Geçerlilik Sonu",
      doc: "24-00000001",
      type: "Sözleşme Bitiş",
      color: "bg-rose-100 text-rose-800 border-rose-200",
    },
  ];

  // Arama sonuçları
  const searchResults = [
    {
      title: "Malzeme Satın Alma Bilgisi",
      category: "Satın Alma (4734)",
      href: "/malzeme-bilgisi",
    },
    {
      title: "Teklif Değerlendirme Detayı",
      category: "Satın Alma (4734)",
      href: "/teklif-degerlendirme",
    },
    {
      title: "Satın Alma Dosyası (İhale)",
      category: "Satın Alma (4734)",
      href: "/ihale-dosyasi",
    },
    {
      title: "Satın Alma Sözleşmesi",
      category: "Satın Alma (4734)",
      href: "/sozlesme",
    },
    {
      title: "Doğrudan Temin Süreci (22/d)",
      category: "Satın Alma (4734)",
      href: "/dogrudan-temin",
    },
    {
      title: "2886 Gelir İhaleleri & Varlık Satış / Kiralama",
      category: "Gelir İhalesi (2886)",
      href: "/gelir-ihaleleri/dosya-tanimi",
    },
    {
      title: "Canlı Açık Artırma & Pey Masası",
      category: "Gelir İhalesi (2886)",
      href: "/gelir-ihaleleri/teklif-artirma",
    },
    {
      title: "İhale Komisyon Kararı ve Onay",
      category: "Gelir İhalesi (2886)",
      href: "/gelir-ihaleleri/komisyon-karari",
    },
    {
      title: "Belge Oluşturucu (Document Builder)",
      category: "EBYS & Resmî Yazı",
      href: "/belge-builder",
    },
    {
      title: "HP 658A Toner Kartuşu Siyah (2024-0010)",
      category: "Malzeme Kataloğu",
      href: "/malzeme-bilgisi",
    },
    {
      title: "Turuncu Ofis Bilişim Ltd. Şti.",
      category: "Tedarikçiler",
      href: "/teklif-degerlendirme",
    },
    {
      title: "Turkuaz Gayrimenkul Yatırım A.Ş.",
      category: "2886 İstekliler",
      href: "/gelir-ihaleleri/teklif-artirma",
    },
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveDropdown(null);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setActiveDropdown((prev) => (prev === "search" ? null : "search"));
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setActiveDropdown("print");
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (key: ActiveDropdown) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const filteredNotifications = notificationsList.filter((n) => {
    if (notificationFilter === "onay") return n.category === "onay";
    if (notificationFilter === "sure") return n.category === "sure";
    return true;
  });

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[58px] items-center border-b border-[#dfe3e9] dark:border-[#26354a] bg-white dark:bg-[#162130] px-4 shadow-[0_1px_3px_rgba(0,0,0,.04)] dark:shadow-none select-none transition-colors duration-200">
        {/* Mobile Hamburger */}
        <button
          type="button"
          className="mr-3.5 rounded-md p-2 text-[#526174] dark:text-[#94a3b8] lg:hidden hover:bg-[#f1f4f9] dark:hover:bg-[#1f2d42]"
          onClick={onToggleMenu}
          aria-label="Menüyü aç"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {/* Brand Logo & Context-Aware Management Mode */}
        <div className="mr-6 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[#1b416c] transition-opacity hover:opacity-90 group"
            title="KAMU 360 - Kamu İhale, Satın Alma & Gelir Yönetim Portalı"
          >
            <BrandLogo className="size-8.5 shrink-0 shadow-xs transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[17px] font-black tracking-tight text-[#16253b] dark:text-white">
                  KAMU
                </span>
                <span className="rounded bg-[#2d62d7] px-1.5 py-0.5 text-[10px] font-extrabold text-white tracking-wide shadow-2xs">
                  360
                </span>
              </div>
              <span className="text-[9px] font-semibold text-[#64748b] dark:text-[#94a3b8] tracking-wider uppercase mt-0.5 hidden md:block">
                İhale &bull; Satın Alma &bull; Gelir
              </span>
            </div>
          </Link>
          <span className="mx-3 hidden h-4 w-px bg-[#cbd5e1] dark:bg-[#26354a] sm:inline-block" />
          {/* İNTERAKTİF HEADER MODÜL SEÇİCİ */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setIsHeaderModuleOpen(!isHeaderModuleOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[#e2e8f0] dark:border-[#26354a] bg-[#f8fafc] dark:bg-[#1a2536] hover:bg-[#f1f5f9] dark:hover:bg-[#202e42] text-left transition group shadow-2xs"
            >
              <div
                className="size-5 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${currentModule.color}20`, color: currentModule.color }}
              >
                <currentModule.icon className="size-3.5" />
              </div>
              <span className="text-[12px] font-bold text-[#1e293b] dark:text-slate-100">
                {currentModule.shortName}
              </span>
              <span
                className="rounded px-1.5 py-0.2 text-[9.5px] font-bold"
                style={{ backgroundColor: `${currentModule.color}15`, color: currentModule.color }}
              >
                {currentModule.badge}
              </span>
              <ChevronDown className="size-3 text-[#94a3b8] group-hover:text-[#475569] dark:group-hover:text-slate-300 transition" />
            </button>

            {isHeaderModuleOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsHeaderModuleOpen(false)} />
                <div className="absolute left-0 top-full mt-2 w-72 z-50 rounded-xl bg-white dark:bg-[#162130] p-2 shadow-2xl border border-[#cbd5e1] dark:border-[#26354a] space-y-1 animate-in fade-in">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] dark:text-[#64748b]">
                    ÇALIŞMA ALANI & MODÜL SEÇİMİ
                  </div>
                  {Object.values(MODULE_DEFINITIONS).map((mod) => {
                    const ModIcon = mod.icon
                    const isSelected = activeModule === mod.key
                    return (
                      <button
                        key={mod.key}
                        type="button"
                        onClick={() => {
                          setActiveModule(mod.key)
                          setIsHeaderModuleOpen(false)
                        }}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition ${
                          isSelected
                            ? 'bg-[#eff6ff] dark:bg-blue-900/30 border border-[#bfdbfe] dark:border-blue-700/50'
                            : 'hover:bg-[#f8fafc] dark:hover:bg-[#1f2d42]'
                        }`}
                      >
                        <div
                          className="size-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${mod.color}20`, color: mod.color }}
                        >
                          <ModIcon className="size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-[11.5px] font-bold ${isSelected ? 'text-[#1d4ed8] dark:text-blue-300' : 'text-[#1e293b] dark:text-slate-200'}`}>
                              {mod.name}
                            </span>
                            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#202e42] text-slate-700 dark:text-slate-300">
                              {mod.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#64748b] dark:text-[#8ea1ba] line-clamp-1 mt-0.5">
                            {mod.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Search Bar */}
        <button
          type="button"
          onClick={() => setActiveDropdown("search")}
          className="hidden h-8 w-[275px] items-center justify-between rounded-md border border-[#e4e7ec] dark:border-[#26354a] bg-[#fafbfc] dark:bg-[#121a27] px-3 text-[11px] text-[#9aa2ad] dark:text-[#7d8fa5] transition hover:border-[#2d62d7]/50 sm:flex"
        >
          <span className="flex items-center gap-2">
            <Search className="size-3.5 text-[#526174] dark:text-[#7d8fa5]" />
            <span>Size Nasıl Yardımcı Olabilirim?</span>
          </span>
          <kbd className="rounded border border-[#dfe3e9] dark:border-[#26354a] bg-white dark:bg-[#1a2536] px-1.5 py-0.5 font-mono text-[9px] text-[#718096] dark:text-slate-300">
            Ctrl K
          </kbd>
        </button>

        {/* Right Action Icons & Profile */}
        <div
          ref={dropdownRef}
          className="ml-auto flex items-center gap-2.5 text-[#43505f] dark:text-[#94a3b8]"
        >
          {/* 1. BİLDİRİMLER (BELL İKONU) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("notifications")}
              className={`relative flex size-8 items-center justify-center rounded-md transition ${
                activeDropdown === "notifications"
                  ? "bg-[#eef3ff] text-[#0c67dc]"
                  : "hover:bg-[#f1f4f9] hover:text-[#0c67dc]"
              }`}
              aria-label="Bildirimler"
              title="Bildirimler & Süreç Uyarıları"
            >
              <Bell className="size-[18px] text-[#0c67dc]" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#2d62d7] text-[9px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Bildirimler Gelişmiş Paneli */}
            {activeDropdown === "notifications" && (
              <div className="absolute right-0 top-11 z-50 w-84 sm:w-96 rounded-xl border border-[#dfe3e9] bg-white p-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#edf0f4] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#172334]">
                      Süreç Bildirimleri
                    </span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-[#eef3ff] px-2 py-0.5 text-[10px] font-bold text-[#2d62d7]">
                        {unreadCount} Yeni
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[10px] font-semibold text-[#2d62d7] hover:underline"
                    >
                      Tümünü okundu yap
                    </button>
                  )}
                </div>

                {/* Filtre Sekmeleri */}
                <div className="mt-2.5 flex gap-1 border-b border-[#edf0f4] pb-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setNotificationFilter("all")}
                    className={`rounded px-2.5 py-1 font-semibold transition ${
                      notificationFilter === "all"
                        ? "bg-[#2d62d7] text-white"
                        : "bg-[#f1f4f9] text-[#64748b] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    Tümü ({notificationsList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotificationFilter("onay")}
                    className={`rounded px-2.5 py-1 font-semibold transition ${
                      notificationFilter === "onay"
                        ? "bg-[#2d62d7] text-white"
                        : "bg-[#f1f4f9] text-[#64748b] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    Onay Bekleyenler (3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotificationFilter("sure")}
                    className={`rounded px-2.5 py-1 font-semibold transition ${
                      notificationFilter === "sure"
                        ? "bg-[#2d62d7] text-white"
                        : "bg-[#f1f4f9] text-[#64748b] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    Termin & Süre (2)
                  </button>
                </div>

                {/* Bildirim Listesi */}
                <div className="mt-2.5 max-h-[300px] space-y-2 overflow-y-auto pr-1">
                  {filteredNotifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => setActiveDropdown(null)}
                      className={`block rounded-lg p-2.5 transition border ${
                        n.unread
                          ? "border-[#bfdbfe] bg-[#f0f6ff] hover:bg-[#e4efff]"
                          : "border-[#edf0f4] bg-white hover:bg-[#fafbfc]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#1e293b]">
                          {n.title}
                        </span>
                        <span className="shrink-0 font-mono text-[9px] text-[#94a3b8]">
                          {n.time}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] leading-relaxed text-[#475569]">
                        {n.desc}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[9px]">
                        <span className="font-mono font-semibold text-[#2d62d7]">
                          Dosya: {n.docNo}
                        </span>
                        <span className="font-bold text-[#2d62d7] flex items-center hover:underline">
                          İncele & İşlem Yap →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-3 border-t border-[#edf0f4] pt-2 flex items-center justify-between text-[10px] text-[#64748b]">
                  <span>
                    Bildirim Tercihleri: <strong>E-posta & Uygulama</strong>
                  </span>
                  <Link
                    href="/is-akislari"
                    onClick={() => setActiveDropdown(null)}
                    className="font-bold text-[#2d62d7] hover:underline"
                  >
                    Tüm Akışlar →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 2. YAZDIR & DIŞA AKTARMA MERKEZİ (PRINTER İKONU) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("print")}
              className={`relative hidden sm:flex size-8 items-center justify-center rounded-md transition ${
                activeDropdown === "print"
                  ? "bg-[#eef3ff] text-[#2d62d7]"
                  : "hover:bg-[#f1f4f9] hover:text-[#172334]"
              }`}
              aria-label="Yazdır"
              title="Yazdırma & Dışa Aktarma Merkezi (Kuyruk & Toplu Baskı)"
            >
              <Printer className="size-[18px]" />
              {printQueue.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white shadow-xs">
                  {printQueue.length}
                </span>
              )}
            </button>

            {/* Gelişmiş Yazdırma ve Dışa Aktarma Merkezi Paneli */}
            {activeDropdown === "print" && (
              <div className="absolute right-0 top-11 z-50 w-96 sm:w-[460px] rounded-xl border border-[#dfe3e9] bg-white p-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#edf0f4] pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Printer className="size-4 text-[#2d62d7]" />
                    <span className="text-[13px] font-bold text-[#172334]">
                      Yazdırma &amp; Dışa Aktarma Merkezi
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {printQueue.length} Kuyrukta
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/dogrudan-temin"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <FileSignature className="size-3" />
                      Temin Şablonları
                    </Link>
                    <Link
                      href="/yazdirma-merkezi"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[10px] font-semibold text-[#2d62d7] hover:underline"
                    >
                      Gelişmiş Panel ↗
                    </Link>
                  </div>
                </div>

                {/* Hızlı Toplu Baskı & Temizleme Butonları */}
                <div className="flex items-center justify-between gap-2 border-b border-[#edf0f4] pb-2.5 mb-2.5">
                  <button
                    type="button"
                    onClick={() => openPreviewForJobs(printQueue)}
                    disabled={printQueue.length === 0}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#2d62d7] py-1.5 text-[11px] font-bold text-white shadow-xs transition hover:bg-[#2455bd] disabled:opacity-50"
                  >
                    <Printer className="size-3.5" />
                    <span>Tümünü Toplu Yazdır ({printQueue.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={clearPrintQueue}
                    disabled={printQueue.length === 0}
                    className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    title="Kuyruğu Temizle"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                {/* Dosyaya Göre Filtre Çubuğu */}
                {printQueue.length > 0 && uniqueDossiers.length > 0 && (
                  <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-thin">
                    <span className="shrink-0 font-bold text-gray-500 flex items-center gap-1">
                      <Filter className="size-3 text-gray-400" /> Dosya:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDosyaFilter("all")}
                      className={`shrink-0 rounded-full px-2.5 py-0.5 font-bold transition ${
                        selectedDosyaFilter === "all"
                          ? "bg-[#2d62d7] text-white shadow-2xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Tümü ({printQueue.length})
                    </button>
                    {uniqueDossiers.map((d) => (
                      <button
                        key={d.dosyaNo}
                        type="button"
                        onClick={() => setSelectedDosyaFilter(d.dosyaNo)}
                        className={`shrink-0 rounded-full px-2 py-0.5 font-semibold transition flex items-center gap-1 ${
                          selectedDosyaFilter === d.dosyaNo
                            ? "bg-indigo-600 text-white shadow-2xs"
                            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        }`}
                        title={d.dosyaAdi}
                      >
                        <Folder className="size-2.5" />
                        <span>{d.dosyaNo}</span>
                        <span className="rounded-full bg-black/10 px-1 py-0.2 text-[9px] font-bold">
                          {d.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Dosya Bazlı İç İçe (Nested) Belgeler Listesi */}
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {printQueue.length === 0
                    ? (
                      <div className="py-6 text-center text-[11px] text-gray-500">
                        <p>Kuyrukta bekleyen belge bulunmuyor.</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Satın alma ve sözleşme ekranlarındaki &quot;Yazdırma
                          Merkezine Gönder&quot; butonuyla belge
                          ekleyebilirsiniz.
                        </p>
                      </div>
                    )
                    : groupedByDosya.length === 0
                    ? (
                      <div className="py-4 text-center text-[11px] text-gray-500">
                        Seçilen dosya filtresine uygun belge bulunamadı.
                      </div>
                    )
                    : (
                      groupedByDosya.map((group) => {
                        const isExpanded =
                          expandedDossiers[group.dosyaNo] !== false;
                        return (
                          <div
                            key={group.dosyaNo}
                            className="rounded-lg border border-[#dfe3e9] bg-[#fafbfc] transition shadow-2xs"
                          >
                            {/* Dosya Başlık Klasörü */}
                            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-50 to-[#f1f4f9] rounded-t-lg border-b border-[#e2e8f0]">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleDossierExpand(group.dosyaNo)}
                                className="flex items-center gap-1.5 min-w-0 text-left hover:opacity-80"
                              >
                                {isExpanded
                                  ? (
                                    <ChevronDown className="size-3.5 text-gray-500 shrink-0" />
                                  )
                                  : (
                                    <ChevronRight className="size-3.5 text-gray-500 shrink-0" />
                                  )}
                                {isExpanded
                                  ? (
                                    <FolderOpen className="size-4 text-amber-500 shrink-0" />
                                  )
                                  : (
                                    <Folder className="size-4 text-amber-500 shrink-0" />
                                  )}
                                <span className="font-mono text-[10.5px] font-bold text-[#1e293b]">
                                  {group.dosyaNo}
                                </span>
                                <span className="truncate text-[10.5px] text-gray-500 max-w-[150px]">
                                  • {group.dosyaAdi}
                                </span>
                                <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-[#2d62d7] shrink-0">
                                  {group.jobs.length} Belge
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => openPreviewForJobs(group.jobs)}
                                className="flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[9.5px] font-bold text-[#2d62d7] border border-blue-200 hover:bg-blue-50 transition shrink-0"
                                title={`${group.dosyaNo} dosyasına ait tüm belgeleri yazdır`}
                              >
                                <Printer className="size-2.5" />
                                <span>Dosyayı Yazdır</span>
                              </button>
                            </div>

                            {/* İçe Açılan Belgeler (Nested) */}
                            {isExpanded && (
                              <div className="p-2 space-y-1.5 border-l-2 border-indigo-300 ml-3 my-1">
                                {group.jobs.map((job) => (
                                  <div
                                    key={job.id}
                                    className="flex items-center justify-between gap-2 rounded-md border border-[#e2e8f0] bg-white p-2 transition hover:border-[#2d62d7] hover:bg-[#f8faff]"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-[9.5px] font-bold text-[#2d62d7]">
                                          {job.docNo}
                                        </span>
                                        <span className="rounded bg-gray-100 px-1.5 py-0.2 text-[8.5px] font-medium text-gray-600">
                                          {job.format}
                                        </span>
                                        <span className="text-[9px] text-gray-400">
                                          {job.pageCount} Sayfa
                                        </span>
                                      </div>
                                      <p className="truncate text-[10.5px] font-semibold text-[#1e293b] mt-0.5">
                                        {job.title}
                                      </p>
                                      <div className="flex items-center gap-2 text-[9px] text-gray-400 mt-0.5">
                                        <span>{job.category}</span>
                                        <span>•</span>
                                        <span>{job.addedAt}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => openPreviewForJob(job)}
                                        className="rounded p-1 text-purple-600 hover:bg-purple-50"
                                        title="A4 Belgeyi Canlı Önizle"
                                      >
                                        <Eye className="size-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => openPreviewForJob(job)}
                                        className="rounded p-1 text-[#2d62d7] hover:bg-blue-100"
                                        title="Hemen Yazdır"
                                      >
                                        <Printer className="size-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeFromPrintQueue(job.id)}
                                        className="rounded p-1 text-red-500 hover:bg-red-50"
                                        title="Kuyruktan Çıkar"
                                      >
                                        <Trash2 className="size-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                </div>

                {/* Alt Hızlı Kısayollar */}
                <div className="mt-3 border-t border-[#edf0f4] pt-2.5 flex items-center justify-between text-[10px] text-gray-500">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDropdown(null);
                      window.print();
                    }}
                    className="flex items-center gap-1 font-semibold text-gray-700 hover:text-[#2d62d7]"
                  >
                    <span>Mevcut Ekranı Hızlı Yazdır</span>
                  </button>

                  <Link
                    href="/yazdirma-merkezi"
                    onClick={() => setActiveDropdown(null)}
                    className="font-bold text-[#2d62d7] hover:underline"
                  >
                    Tüm Yazdırma Merkezini Aç →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 3. İHALE & SÜREÇ TAKVİMİ (CALENDAR İKONU) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("calendar")}
              className={`hidden sm:flex size-8 items-center justify-center rounded-md transition ${
                activeDropdown === "calendar"
                  ? "bg-[#eef3ff] text-[#2d62d7]"
                  : "hover:bg-[#f1f4f9] hover:text-[#172334]"
              }`}
              aria-label="Takvim"
              title="İhale & Satın Alma Süreç Takvimi"
            >
              <CalendarDays className="size-[18px]" />
            </button>

            {/* Gelişmiş Süreç Takvimi Paneli */}
            {activeDropdown === "calendar" && (
              <div className="absolute right-0 top-11 z-50 w-88 sm:w-96 rounded-xl border border-[#dfe3e9] bg-white p-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#edf0f4] pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#2d62d7]" />
                    <span className="text-[13px] font-bold text-[#172334]">
                      İhale & Termin Takvimi
                    </span>
                  </div>
                  <span className="rounded bg-[#f1f4f9] px-2 py-0.5 text-[10px] font-mono font-bold text-[#475569]">
                    Temmuz - Aralık 2024
                  </span>
                </div>

                {/* Kritik Yaklaşan Etkinlikler Listesi */}
                <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1 text-[11px]">
                  {calendarEvents.map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-[#edf0f4] bg-[#fafbfc] p-2.5 transition hover:border-[#cbd5e1]"
                    >
                      <div>
                        <div className="font-bold text-[#1e293b]">
                          {ev.title}
                        </div>
                        <div className="text-[10px] text-[#64748b]">
                          Dosya: <strong>{ev.doc}</strong> • Saat: {ev.time}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold border ${ev.color}`}
                        >
                          {ev.type}
                        </span>
                        <div className="mt-1 font-mono text-[9px] font-bold text-[#64748b]">
                          {ev.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 border-t border-[#edf0f4] pt-2.5 flex items-center justify-between text-[10px]">
                  <span className="text-[#64748b]">
                    Geciken İşlem: <strong>0 Adet</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Takvim dışa aktarıldı (iCal / Outlook formatında).",
                      )}
                    className="font-bold text-[#2d62d7] hover:underline flex items-center gap-1"
                  >
                    <Download className="size-3" /> iCal Olarak Dışa Aktar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. SİSTEM & MEVZUAT BİLGİSİ (INFO İKONU) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("info")}
              className={`hidden sm:flex size-8 items-center justify-center rounded-md transition ${
                activeDropdown === "info"
                  ? "bg-[#eef3ff] text-[#2d62d7]"
                  : "hover:bg-[#f1f4f9] hover:text-[#172334]"
              }`}
              aria-label="Bilgi"
              title="Sistem & Mevzuat Bilgisi"
            >
              <Info className="size-[18px]" />
            </button>

            {/* Gelişmiş Sistem & Mevzuat Bilgi Modalı */}
            {activeDropdown === "info" && (
              <div className="absolute right-0 top-11 z-50 w-96 rounded-xl border border-[#dfe3e9] bg-white p-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#edf0f4] pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <Info className="size-4 text-[#2d62d7]" />
                    <span className="text-[13px] font-bold text-[#172334]">
                      Sistem & Mevzuat Merkezi
                    </span>
                  </div>
                  <span className="rounded bg-[#eaf8ee] px-2 py-0.5 text-[10px] font-bold text-[#16a34a]">
                    KAMU 360 v2.4.0
                  </span>
                </div>

                {/* Bilgi Sekmeleri */}
                <div className="flex gap-1 border-b border-[#edf0f4] pb-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setInfoTab("mevzuat")}
                    className={`rounded px-2.5 py-1 font-bold transition ${
                      infoTab === "mevzuat"
                        ? "bg-[#2d62d7] text-white"
                        : "text-[#64748b] hover:bg-[#f1f4f9]"
                    }`}
                  >
                    Mevzuat Standartları
                  </button>
                  <button
                    type="button"
                    onClick={() => setInfoTab("kisayollar")}
                    className={`rounded px-2.5 py-1 font-bold transition ${
                      infoTab === "kisayollar"
                        ? "bg-[#2d62d7] text-white"
                        : "text-[#64748b] hover:bg-[#f1f4f9]"
                    }`}
                  >
                    Kısayollar
                  </button>
                  <button
                    type="button"
                    onClick={() => setInfoTab("destek")}
                    className={`rounded px-2.5 py-1 font-bold transition ${
                      infoTab === "destek"
                        ? "bg-[#2d62d7] text-white"
                        : "text-[#64748b] hover:bg-[#f1f4f9]"
                    }`}
                  >
                    Destek Hattı
                  </button>
                </div>

                {/* Sekme İçerikleri */}
                <div className="mt-3 text-[11px] text-[#475569]">
                  {infoTab === "mevzuat" && (
                    <div className="space-y-2">
                      <div className="rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-2.5">
                        <strong className="text-[#1e293b]">
                          4734 Sayılı KİK (Madde 22/d - Doğrudan Temin):
                        </strong>
                        <p className="mt-0.5 text-[10px] text-[#64748b] leading-relaxed">
                          Büyükşehir belediyesi sınırları dahilinde bulunan
                          idarelerin ihtiyaçları için parasal limitler dahilinde
                          ilan yapılmaksızın ve teminat alınmaksızın doğrudan
                          temin usulü.
                        </p>
                      </div>
                      <div className="rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-2.5">
                        <strong className="text-[#1e293b]">
                          2886 Sayılı Devlet İhale Kanunu (Gelir Tarafı):
                        </strong>
                        <p className="mt-0.5 text-[10px] text-[#64748b] leading-relaxed">
                          Mülkiyetteki taşınmazların kiraya verilmesi,
                          varlık/filo satışı, atıl hurda değerlendirme ve
                          kafeterya işletme hakkı devri (Madde 45 Açık Artırma &
                          Madde 35 Kapalı Zarf).
                        </p>
                      </div>
                      <div className="rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-2.5">
                        <strong className="text-[#1e293b]">
                          Resmî Yazışma Yönetmeliği & EBYS:
                        </strong>
                        <p className="mt-0.5 text-[10px] text-[#64748b] leading-relaxed">
                          Cumhurbaşkanlığı Resmî Yazışmalarda Uygulanacak Usul
                          ve Esaslar Yönetmeliği standardında paraf/imza rotası
                          ve SHA-256 mühürleme.
                        </p>
                      </div>
                    </div>
                  )}

                  {infoTab === "kisayollar" && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between rounded bg-[#fafbfc] p-2 border">
                        <span>Hızlı Arama & Komut Paleti</span>
                        <kbd className="font-mono text-[9px] bg-white border px-1.5 py-0.5 rounded font-bold">
                          Ctrl + K
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between rounded bg-[#fafbfc] p-2 border">
                        <span>Yazdırma & Belge Çıktısı</span>
                        <kbd className="font-mono text-[9px] bg-white border px-1.5 py-0.5 rounded font-bold">
                          Ctrl + P
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between rounded bg-[#fafbfc] p-2 border">
                        <span>Açılır Pencereleri Kapat</span>
                        <kbd className="font-mono text-[9px] bg-white border px-1.5 py-0.5 rounded font-bold">
                          ESC
                        </kbd>
                      </div>
                    </div>
                  )}

                  {infoTab === "destek" && (
                    <div className="rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-3 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[#1e293b]">
                        <Building2 className="size-4 text-[#2d62d7]" />
                        <span>AKM - Akme Teknoloji Çözümleri A.Ş.</span>
                      </div>
                      <div className="text-[10px] space-y-1 text-[#64748b]">
                        <div>
                          <strong>Yerleşke:</strong>{" "}
                          ODTÜ Teknokent Binası Zemin Kat / Ankara
                        </div>
                        <div>
                          <strong>Dahili Çağrı Merkezi:</strong>{" "}
                          4100 (Hafta içi 08:30 - 18:00)
                        </div>
                        <div>
                          <strong>E-Posta:</strong> destek@dt360.local
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4.5 TEMA DEĞİŞTİRİCİ (AÇIK / KOYU / SİSTEM) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("theme")}
              className={`relative flex size-8 items-center justify-center rounded-lg transition ${
                activeDropdown === "theme"
                  ? "bg-[#eef3ff] dark:bg-[#1f2d42] text-[#0c67dc] dark:text-blue-400"
                  : "text-[#526174] dark:text-[#94a3b8] hover:bg-[#f1f4f9] dark:hover:bg-[#1a2536] hover:text-[#0c67dc] dark:hover:text-white"
              }`}
              aria-label="Arayüz Teması Değiştir"
              title={`Görünüm Teması: ${theme === "dark" ? "Koyu Tema" : theme === "light" ? "Açık Tema" : "Sistem Teması"} (Değiştirmek için tıkla)`}
            >
              {resolvedTheme === "dark" ? (
                <Moon className="size-[17px] text-amber-300 transition-transform hover:rotate-12" />
              ) : (
                <Sun className="size-[18px] text-amber-500 transition-transform hover:rotate-45" />
              )}
            </button>

            {/* Tema Seçim Menüsü */}
            {activeDropdown === "theme" && (
              <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-[#dfe3e9] dark:border-[#26354a] bg-white dark:bg-[#162130] p-1.5 shadow-2xl animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-2 mb-1 border-b border-[#edf0f4] dark:border-[#223348]">
                  <div className="text-[11.5px] font-bold text-[#172334] dark:text-white">
                    Görünüm Teması
                  </div>
                  <div className="text-[9.5px] text-[#64748b] dark:text-[#8ea1ba] mt-0.5">
                    Göz yormayan kamu çalışma modu
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTheme("light");
                      setActiveDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                      theme === "light"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold"
                        : "text-[#475569] dark:text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-[#1f2d42] hover:text-[#0f172a] dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sun className="size-4 text-amber-500" />
                      <span>Açık Tema (Gündüz)</span>
                    </div>
                    {theme === "light" && (
                      <Check className="size-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTheme("dark");
                      setActiveDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                      theme === "dark"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold"
                        : "text-[#475569] dark:text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-[#1f2d42] hover:text-[#0f172a] dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Moon className="size-4 text-amber-300" />
                      <span>Koyu Tema (Gece)</span>
                    </div>
                    {theme === "dark" && (
                      <Check className="size-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTheme("system");
                      setActiveDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                      theme === "system"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold"
                        : "text-[#475569] dark:text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-[#1f2d42] hover:text-[#0f172a] dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Monitor className="size-4 text-slate-500 dark:text-slate-400" />
                      <span>Sistem Tercihi (Otomatik)</span>
                    </div>
                    {theme === "system" && (
                      <Check className="size-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden h-7 w-px bg-[#e3e6eb] dark:bg-[#26354a] sm:block" />

          {/* 5. KULLANICI PROFİLİ (AVATAR + KİMLİK KARTI) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("profile")}
              className={`flex items-center gap-2.5 rounded-lg p-1 text-right text-[10px] leading-3 transition ${
                activeDropdown === "profile"
                  ? "bg-[#f1f4f9]"
                  : "hover:bg-[#f8f9fb]"
              }`}
              aria-label="Kullanıcı Menüsü"
            >
              {/* Concentric Circle Badge Avatar */}
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[#526174] bg-[#edf2f7] p-0.5 shadow-xs">
                <div className="flex size-full items-center justify-center rounded-full border border-[#2d62d7] bg-[#1e2a3c] text-white">
                  <span className="size-2 rounded-full bg-[#3caf75]" />
                </div>
              </div>
              <div className="hidden text-left sm:block">
                <span className="font-bold text-[#172334]">lojtest1</span>
                <br />
                <span className="text-[#8d98a4]">Lojistik Yönetici</span>
              </div>
            </button>

            {/* Kullanıcı Profili & Yetki Matrisi Menüsü */}
            {activeDropdown === "profile" && (
              <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-[#dfe3e9] dark:border-[#26354a] bg-white dark:bg-[#162130] p-4 shadow-2xl">
                {/* Kullanıcı Kimlik Kartı */}
                <div className="flex items-center gap-3 border-b border-[#edf0f4] dark:border-[#223348] pb-3">
                  <div className="flex size-11 items-center justify-center rounded-full border-2 border-[#526174] bg-[#1e2a3c] text-white font-bold text-sm">
                    Aİ
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#172334] dark:text-white">
                      Abdulkadir İlci
                    </div>
                    <div className="font-mono text-[10px] font-semibold text-[#2d62d7] dark:text-blue-400">
                      lojtest1
                    </div>
                    <div className="text-[10px] text-[#64748b] dark:text-[#8ea1ba]">
                      Lojistik & Satın Alma Yöneticisi
                    </div>
                  </div>
                </div>

                {/* Yetki & Güvenlik Özeti */}
                <div className="mt-2.5 rounded-lg border border-[#e2e8f0] dark:border-[#243449] bg-[#fafbfc] dark:bg-[#121a27] p-2.5 text-[10px] space-y-1 text-[#475569] dark:text-[#a0aec0]">
                  <div className="flex justify-between">
                    <span className="text-[#64748b] dark:text-[#7d8fa5]">E-İmza (NES) Durumu:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> TÜRKTRUST Aktif
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b] dark:text-[#7d8fa5]">Harcama Yetki Limiti:</span>
                    <strong className="text-[#1e293b] dark:text-slate-100">
                      500.000 TL (Re&apos;sen)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b] dark:text-[#7d8fa5]">Komisyon Rolü:</span>
                    <strong className="text-[#2d62d7] dark:text-blue-400">
                      4734 &amp; 2886 Yetkilisi
                    </strong>
                  </div>
                </div>

                {/* Lokasyon / İşletme Seçici */}
                <div className="mt-3">
                  <label className="text-[10px] font-bold text-[#64748b] dark:text-[#8ea1ba] uppercase tracking-wider block mb-1">
                    Aktif Lokasyon
                  </label>
                  <select
                    value={activeLocation}
                    onChange={(e) => setActiveLocation(e.target.value)}
                    className="w-full rounded border border-[#cbd5e1] dark:border-[#2b3c53] bg-white dark:bg-[#1a2536] text-[#1e293b] dark:text-slate-100 p-1.5 text-[11px] font-medium"
                  >
                    <option value="AKM-ANK - ODTÜ Teknokent">
                      AKM-ANK - ODTÜ Teknokent / Ankara
                    </option>
                    <option value="AKM-IST - Ataşehir Lojistik Merkezi">
                      AKM-IST - Ataşehir / İstanbul
                    </option>
                  </select>
                </div>

                {/* Hızlı Linkler & Tema Değiştirici */}
                <div className="mt-3 space-y-1 text-[11px] border-t border-[#edf0f4] dark:border-[#223348] pt-2">
                  {/* Tema Hızlı Geçiş Satırı */}
                  <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[#334155] dark:text-slate-300 transition hover:bg-[#f1f4f9] dark:hover:bg-[#1f2d42]">
                    <div className="flex items-center gap-2.5">
                      {resolvedTheme === "dark" ? (
                        <Moon className="size-3.5 text-amber-400" />
                      ) : (
                        <Sun className="size-3.5 text-amber-500" />
                      )}
                      <span>Görünüm: {resolvedTheme === "dark" ? "Koyu" : "Açık"} Mod</span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="text-[10px] font-bold text-[#2d62d7] dark:text-blue-400 hover:underline"
                    >
                      {resolvedTheme === "dark" ? "Açığa Geç" : "Koyuya Geç"}
                    </button>
                  </div>

                  <Link
                    href="/genel-yonetim"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[#334155] dark:text-slate-300 transition hover:bg-[#f1f4f9] dark:hover:bg-[#1f2d42]"
                  >
                    <User className="size-3.5 text-[#2d62d7]" />
                    <span>Kullanıcı Bilgileri & Birimler</span>
                  </Link>
                  <Link
                    href="/belge-builder"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[#334155] dark:text-slate-300 transition hover:bg-[#f1f4f9] dark:hover:bg-[#1f2d42]"
                  >
                    <FileSignature className="size-3.5 text-[#16a34a]" />
                    <span>İmza ve Paraf Yetkileri</span>
                  </Link>
                  <Link
                    href="/sistem-ayarlari"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[#334155] dark:text-slate-300 transition hover:bg-[#f1f4f9] dark:hover:bg-[#1f2d42]"
                  >
                    <Settings className="size-3.5 text-[#526174]" />
                    <span>Yetki Rolleri ve Parametreler</span>
                  </Link>
                </div>

                {/* Çıkış Yap */}
                <div className="mt-2.5 border-t border-[#edf0f4] dark:border-[#223348] pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDropdown(null);
                      alert("Güvenli çıkış yapıldı.");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut className="size-3.5" />
                    <span>Güvenli Çıkış Yap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* GLOBAL ARAMA MODALI (Ctrl + K) */}
      {activeDropdown === "search" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-20 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-[#dfe3e9] bg-white p-4 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-[#edf0f4] pb-3">
              <Search className="size-4 text-[#2d62d7]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ekran, malzeme, dosya no (24-0000005, 2886-2024/01) veya tedarikçi ara..."
                className="flex-1 text-[13px] text-[#1e293b] placeholder-[#94a3b8] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setActiveDropdown(null)}
                className="rounded p-1 text-[#94a3b8] hover:bg-[#f1f4f9] hover:text-[#1e293b]"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-3 max-h-[300px] overflow-y-auto space-y-1">
              {searchResults.length === 0
                ? (
                  <div className="py-6 text-center text-[12px] text-[#94a3b8]">
                    "{searchQuery}" için sonuç bulunamadı.
                  </div>
                )
                : (
                  searchResults.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between rounded-lg p-2.5 text-[11px] transition hover:bg-[#f8f9fb]"
                    >
                      <span className="font-bold text-[#1e293b]">
                        {item.title}
                      </span>
                      <span className="rounded bg-[#f1f4f9] px-2 py-0.5 text-[10px] font-semibold text-[#64748b]">
                        {item.category}
                      </span>
                    </Link>
                  ))
                )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#edf0f4] pt-2 text-[10px] text-[#94a3b8]">
              <span>Kapatmak için ESC tuşuna basın</span>
              <span>KAMU 360 Akıllı Arama & Navigasyon</span>
            </div>
          </div>
        </div>
      )}

      {/* Evrensel A4 Matbu Belge Önizleme ve Doğrudan Yazdırma Modalı */}
      <UniversalDocumentModal
        isOpen={isUniversalModalOpen}
        onClose={() => setIsUniversalModalOpen(false)}
        jobs={previewJobs}
        initialJobId={activeJobId}
      />
    </>
  );
}
