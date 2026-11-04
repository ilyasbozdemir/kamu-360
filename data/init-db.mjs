import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'

const dbDir = path.resolve('data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'temin360.sqlite')
const db = new DatabaseSync(dbPath)

console.log('📦 SQLite veritabanı kuruluyor: ' + dbPath)

// Tabloları oluştur
db.exec(`
  CREATE TABLE IF NOT EXISTS DATA_TeminDosyasi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temin_no TEXT NOT NULL UNIQUE,
    dosya_acilis_tarihi TEXT,
    butce_yili INTEGER DEFAULT 2026,
    butce_tipi TEXT DEFAULT 'Genel Bütçe',
    konu TEXT NOT NULL,
    isin_aciklamasi TEXT,
    birim_id INTEGER,
    birim TEXT NOT NULL,
    antet_ek_satir TEXT,
    sunulacak_makam TEXT,
    ihtiyac_yeri TEXT,
    e_butce TEXT,
    say2000i TEXT,
    fonksiyonel_kod TEXT,
    muhasebe_birimi TEXT,
    harcama_birimi TEXT,
    finansman_kodu TEXT,
    ekonomik_kod TEXT,
    ihale_tipi TEXT DEFAULT 'Doğrudan Temin',
    tur TEXT DEFAULT 'mal',
    ihale_sekli TEXT DEFAULT '4734 / 22-d',
    teklif_sozlesme_turu TEXT DEFAULT 'Birim Fiyat',
    alt_yuklenici_olacak_mi INTEGER DEFAULT 0,
    kismi_teklif_verilecek_mi INTEGER DEFAULT 0,
    yatirim_proje_no TEXT,
    project_id INTEGER,
    proje_adi TEXT,
    tags TEXT DEFAULT '[]',
    avans_verilecek_mi INTEGER DEFAULT 0,
    yillara_yaygin INTEGER DEFAULT 0,
    sozlesme_yapilacak_mi INTEGER DEFAULT 1,
    komisyon_seed_edildi INTEGER DEFAULT 1,
    isin_aciklama_maddeleri TEXT DEFAULT '[]',
    yaklasik_maliyet_hesaplamasi TEXT,
    yaklasik_maliyet_kdv_dahil_mi INTEGER DEFAULT 0,
    kdv TEXT DEFAULT '%20',
    hesaplama_esasi TEXT,
    komisyon_takdiri TEXT,
    tibbi_cihaz_alimi_mi INTEGER DEFAULT 0,
    irtibat_yetkilisi_adi TEXT,
    son_teklif_verme_tarihi TEXT,
    teslim_tarihi TEXT,
    teslim_gun INTEGER DEFAULT 7,
    yaklasik_maliyet REAL DEFAULT 0,
    kesinti_damga REAL DEFAULT 0,
    kesinti_karar_pulu REAL DEFAULT 0,
    kesinti_kdv_tevkifat REAL DEFAULT 0,
    net_odenen REAL DEFAULT 0,
    butce_kodu TEXT,
    temin_tarihi TEXT,
    firma_id INTEGER,
    kazanan_firma_adi TEXT,
    onay_personel_adi TEXT,
    hazirlayan_personel_adi TEXT,
    talep_eden_personel_adi TEXT,
    ordered_docs TEXT DEFAULT '[]',
    starred_docs TEXT DEFAULT '[]',
    status TEXT DEFAULT 'devam_ediyor',
    ekap_no TEXT,
    is_ekap_sent INTEGER DEFAULT 0,
    is_locked INTEGER DEFAULT 0,
    lock_reason TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS DATA_TeminKalemleri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dosya_id INTEGER NOT NULL,
    sira_no INTEGER NOT NULL,
    kalem_kodu TEXT,
    kalem_adi TEXT NOT NULL,
    birim TEXT NOT NULL,
    miktar REAL NOT NULL,
    yaklasik_birim_fiyat REAL DEFAULT 0,
    toplam_tutar REAL DEFAULT 0,
    kdv_orani INTEGER DEFAULT 20,
    teknik_ozellik TEXT,
    FOREIGN KEY (dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS DATA_FirmaTeklifleri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dosya_id INTEGER NOT NULL,
    sira_no INTEGER NOT NULL,
    firma_adi TEXT NOT NULL,
    vergi_no TEXT,
    yetkili_adi TEXT,
    telefon TEXT,
    eposta TEXT,
    toplam_teklif REAL NOT NULL,
    kdv_durumu TEXT DEFAULT 'Hariç',
    degerlendirme_sonucu TEXT,
    teklif_tarihi TEXT,
    FOREIGN KEY (dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS TANIM_Birim (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    birim_kodu TEXT UNIQUE,
    birim_adi TEXT NOT NULL,
    ust_birim TEXT,
    aktif INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS TANIM_Personel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad_soyad TEXT NOT NULL,
    unvan TEXT NOT NULL,
    kariyer_unvani TEXT,
    birim_adi TEXT,
    eposta TEXT,
    e_imza_durumu TEXT DEFAULT 'Aktif'
  );
`)

// Başlangıç verilerini ekle
const checkExisting = db.prepare('SELECT COUNT(*) as cnt FROM DATA_TeminDosyasi').get()
if (checkExisting.cnt === 0) {
  console.log('🌱 Başlangıç örnek verileri aktarılıyor...')

  db.exec(`
    INSERT INTO DATA_TeminDosyasi (
      id, temin_no, dosya_acilis_tarihi, butce_yili, butce_tipi, konu, isin_aciklamasi,
      birim, antet_ek_satir, sunulacak_makam, ihtiyac_yeri, e_butce, say2000i,
      fonksiyonel_kod, muhasebe_birimi, harcama_birimi, finansman_kodu, ekonomik_kod,
      ihale_tipi, tur, ihale_sekli, teklif_sozlesme_turu, yaklasik_maliyet,
      kesinti_damga, kesinti_karar_pulu, kesinti_kdv_tevkifat, net_odenen, teslim_gun,
      kazanan_firma_adi, onay_personel_adi, hazirlayan_personel_adi, ordered_docs,
      status, ekap_no, is_ekap_sent, is_locked
    ) VALUES (
      1, '2026/DT-001', '2026-03-01', 2026, 'Genel Bütçe',
      'Destek Hizmetleri ve Hizmet Binaları İçin 8 Kalem Orijinal Toner ve Sarf Malzemesi Alımı',
      'Başkanlık merkez birimleri ve bağlı şube müdürlüklerinde kullanılmak üzere 8 kalem toner alımı işidir.',
      'Destek Hizmetleri Dairesi Başkanlığı - Satınalma Şube Müdürlüğü',
      'T.C. ANKARA BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI',
      'HARCAMA YETKİLİSİ MAKAMINA',
      'Merkez Lojistik Ambarı ve İdari Birimler',
      '03.02.01.01', 'SAY-2026-8412', '01.3.1.00',
      'Mali Hizmetler Dairesi Muhasebe Şube Müdürlüğü',
      'Destek Hizmetleri Dairesi Başkanlığı',
      '05.1', '03.2.1.01 (Kırtasiye ve Büro Malzemesi Alımları)',
      'Doğrudan Temin', 'mal', '4734 / 22-d', 'Birim Fiyat',
      145000.00, 1374.60, 825.05, 0.00, 142800.35, 7,
      'Turuncu Ofis Bilişim Ltd. Şti.', 'Dr. Hakan YILMAZ (Harcama Yetkilisi)',
      'Mehmet DÜNDAR (Satınalma Personeli)',
      '["DOC_ONAY_BELGESI", "DOC_PIYASA_FIYAT_ARASTIRMASI", "DOC_YAKLASIK_MALIYET", "DOC_TEKLIF_MEKTUBU", "DOC_SOZLESME_TASLAGI", "DOC_MUAYENE_KABUL", "DOC_DAMGA_VERGISI"]',
      'devam_ediyor', '2026/DT-EKAP-48192', 1, 0
    );

    INSERT INTO DATA_TeminDosyasi (
      id, temin_no, dosya_acilis_tarihi, butce_yili, butce_tipi, konu, isin_aciklamasi,
      birim, antet_ek_satir, sunulacak_makam, ihtiyac_yeri, e_butce, say2000i,
      fonksiyonel_kod, muhasebe_birimi, harcama_birimi, finansman_kodu, ekonomik_kod,
      ihale_tipi, tur, ihale_sekli, teklif_sozlesme_turu, yaklasik_maliyet,
      kesinti_damga, kesinti_karar_pulu, kesinti_kdv_tevkifat, net_odenen, teslim_gun,
      kazanan_firma_adi, onay_personel_adi, hazirlayan_personel_adi, ordered_docs,
      status, ekap_no, is_ekap_sent, is_locked
    ) VALUES (
      2, '2026/DT-002', '2026-03-03', 2026, 'Genel Bütçe',
      'Merkez Kampüs Isıtma & Havalandırma (HVAC) Sistemleri Periyodik Bakım ve Onarım Hizmeti',
      'Hizmet binalarının 2026 ilkbahar-yaz dönemi HVAC filtre ve kompresör bakımı.',
      'Fen İşleri Dairesi Başkanlığı - Makine İkmal Şube Müdürlüğü',
      'T.C. ANKARA BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI',
      'HARCAMA YETKİLİSİ MAKAMINA',
      'Merkez İdari Kampüs Binaları',
      '03.05.01.02', 'SAY-2026-8419', '01.3.9.00',
      'Mali Hizmetler Dairesi Muhasebe Şube Müdürlüğü',
      'Fen İşleri Dairesi Başkanlığı',
      '05.1', '03.5.1.02 (Bina Bakım Onarım Giderleri)',
      'Doğrudan Temin', 'hizmet', '4734 / 22-d', 'Götürü Bedel',
      185000.00, 1753.80, 1052.65, 2220.00, 179973.55, 15,
      'İklimsan Havalandırma ve Tesisat A.Ş.', 'Ahmet ARI (Fen İşleri Daire Başkanı)',
      'Selim KAYA (Makine Mühendisi)',
      '["DOC_ONAY_BELGESI", "DOC_PIYASA_FIYAT_ARASTIRMASI", "DOC_SOZLESME_TASLAGI"]',
      'devam_ediyor', NULL, 0, 0
    );

    INSERT INTO DATA_TeminKalemleri (dosya_id, sira_no, kalem_kodu, kalem_adi, birim, miktar, yaklasik_birim_fiyat, toplam_tutar) VALUES
      (1, 1, '2024-0010', 'HP 658A Orijinal Siyah Toner (W2000A)', 'Adet', 10, 3316.66, 33166.60),
      (1, 2, '2024-0011', 'HP 658A Orijinal Mavi Toner (W2001A)', 'Adet', 8, 3950.00, 31600.00),
      (1, 3, '2024-0012', 'HP 658A Orijinal Sarı Toner (W2002A)', 'Adet', 8, 3950.00, 31600.00),
      (1, 4, '2024-0013', 'HP 658A Orijinal Kırmızı Toner (W2003A)', 'Adet', 8, 3950.00, 31600.00),
      (1, 5, '2024-0020', 'A4 80 gr 1. Hamur Fotokopi Kağıdı', 'Koli', 20, 853.34, 17066.80);

    INSERT INTO DATA_FirmaTeklifleri (dosya_id, sira_no, firma_adi, vergi_no, toplam_teklif, degerlendirme_sonucu) VALUES
      (1, 1, 'Turuncu Ofis Bilişim Ltd. Şti.', '8410291823', 142800.00, 'En Avantajlı Teklif (Uygun)'),
      (1, 2, 'Ankara Kurumsal Kırtasiye A.Ş.', '1029384756', 148500.00, 'İkinci Teklif'),
      (1, 3, 'Başkent Bilişim Sistemleri San. Tic.', '9876543210', 153200.00, 'Üçüncü Teklif');

    INSERT INTO TANIM_Birim (birim_kodu, birim_adi, ust_birim) VALUES
      ('DEST-SAT', 'Satınalma Şube Müdürlüğü', 'Destek Hizmetleri Dairesi Başkanlığı'),
      ('FEN-MAK', 'Makine İkmal Şube Müdürlüğü', 'Fen İşleri Dairesi Başkanlığı'),
      ('MAL-MUH', 'Muhasebe Şube Müdürlüğü', 'Mali Hizmetler Dairesi Başkanlığı');

    INSERT INTO TANIM_Personel (ad_soyad, unvan, kariyer_unvani, birim_adi) VALUES
      ('Mehmet DÜNDAR', 'Büro Personeli', '', 'Satınalma Şube Müdürlüğü'),
      ('Dr. Hakan YILMAZ', 'Daire Başkanı', 'Dr.', 'Destek Hizmetleri Dairesi Başkanlığı'),
      ('Mustafa YILMAZ', 'Şube Müdürü V.', '', 'Satınalma Şube Müdürlüğü'),
      ('Ahmet ARI', 'Daire Başkanı', '', 'Fen İşleri Dairesi Başkanlığı');
  `)

  console.log('✅ SQLite başlangıç verileri başarıyla yüklendi!')
} else {
  console.log(`ℹ️ Veritabanında zaten ${checkExisting.cnt} adet dosya mevcut.`)
}

