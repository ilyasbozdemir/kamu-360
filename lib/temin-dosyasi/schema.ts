/**
 * DATA_TeminDosyasi Veri Modeli ve TypeScript Tanımları
 * workdesk-360 / packages/database & document-templates standardına tam uyumludur.
 */

export interface TeminKalemKaydi {
  id?: number
  dosya_id?: number
  sira_no: number
  kalem_kodu?: string
  kalem_adi: string
  birim: string
  miktar: number
  fiyat1?: number
  fiyat2?: number
  fiyat3?: number
  yaklasik_birim_fiyat?: number
  toplam_tutar?: number
  kdv_orani?: number
  teknik_ozellik?: string
}

export interface TeminFirmaTeklifiKaydi {
  id?: number
  dosya_id?: number
  sira_no: number
  firma_adi: string
  vergi_no?: string
  yetkili_adi?: string
  telefon?: string
  eposta?: string
  toplam_teklif: number
  kdv_durumu?: string
  degerlendirme_sonucu?: string
  teklif_tarihi?: string
  kazanan_mi?: boolean
}

export interface TeminKomisyonUyesi {
  id?: number
  unvan: string
  gorev: string
  ad_soyad: string
  rol: 'harcama_yetkilisi' | 'gerceklestirme' | 'piyasa_arastirma' | 'muayene_kabul'
}

export interface TeminRotaAdimi {
  sira: number
  tur: 'Paraf' | 'İmza' | 'Onay'
  adSoyad: string
  unvan: string
  durum: 'BEKLIYOR' | 'PARAF_EDILDI' | 'IMZALANDI'
}

export interface TeminDosyasiKaydi {
  id: number
  temin_no: string // Kurum İçi Dosya Numarası (Örn: 2026/DT-001)
  dosya_acilis_tarihi: string // YYYY-MM-DD
  butce_yili: number
  butce_tipi: 'Genel Bütçe' | 'Döner Sermaye' | 'Özel Bütçe' | 'Diğer'
  konu: string // İşin Adı / Temin Konusu
  isin_aciklamasi?: string
  birim_id?: number
  birim: string // Birim Adı

  // İlişkili Alt Tablolar & Veri Koleksiyonları
  kalemler?: TeminKalemKaydi[]
  firmalar?: TeminFirmaTeklifiKaydi[]
  komisyon_uyeleri?: TeminKomisyonUyesi[]
  rota_adimlari?: TeminRotaAdimi[]

  // Antet / İdari Alanlar
  antet_ek_satir?: string
  sunulacak_makam: string // Örn: HARCAMA YETKİLİSİ MAKAMINA
  ihtiyac_yeri: string // Örn: Lojistik Tesisleri ve Merkez Binası

  // Mali Kodlar
  e_butce?: string // Örn: 03.02.01.01
  say2000i?: string // Örn: SAY-2026-8412
  fonksiyonel_kod?: string // Örn: 01.3.1.00
  muhasebe_birimi?: string
  harcama_birimi?: string
  finansman_kodu?: string // Örn: 05.1
  ekonomik_kod?: string // Örn: 03.2.1.01

  // İhale / Alım Türü
  ihale_tipi: string // 'Doğrudan Temin'
  tur: 'mal' | 'hizmet' | 'yapim_isi' | 'danismanlik'
  ihale_sekli: string // '22/d', '22/a'

  // Teklif ve Sözleşme
  teklif_sozlesme_turu?: 'Birim Fiyat' | 'Götürü Bedel'
  alt_yuklenici_olacak_mi: number // 0 | 1
  kismi_teklif_verilecek_mi: number // 0 | 1
  yatirim_proje_no?: string
  project_id?: number
  proje_adi?: string
  tags: string[] // ['#Acil', '#Toner']
  avans_verilecek_mi: number // 0 | 1
  yillara_yaygin: number // 0 | 1
  sozlesme_yapilacak_mi: number // 0 | 1
  komisyon_seed_edildi?: number
  isin_aciklama_maddeleri?: string[]

  // Hesaplama ve Maliyet
  yaklasik_maliyet_hesaplamasi?: string
  yaklasik_maliyet_kdv_dahil_mi: number // 0 | 1
  kdv: string // '%20'
  hesaplama_esasi?: string
  komisyon_takdiri?: string
  tibbi_cihaz_alimi_mi: number // 0 | 1

  // Süreç / Tarihler / Kişiler
  irtibat_yetkilisi_id?: number
  irtibat_yetkilisi_adi?: string
  son_teklif_verme_tarihi?: string
  teslim_tarihi?: string
  teslim_gun: number

  yaklasik_maliyet: number
  kesinti_damga: number
  kesinti_karar_pulu: number
  kesinti_kdv_tevkifat: number
  net_odenen: number
  butce_kodu?: string
  temin_tarihi?: string
  firma_id?: number
  kazanan_firma_adi?: string

  onay_personel_id?: number
  onay_personel_adi?: string
  hazirlayan_personel_id?: number
  hazirlayan_personel_adi?: string
  talep_eden_personel_id?: number
  talep_eden_personel_adi?: string
  sunan_personel_id?: number

  durum_asama_id?: number
  mevzuat_id?: number
  surec_taslak_id?: number
  ordered_docs: string[] // ['DOC_ONAY_BELGESI', 'DOC_PIYASA_FIYAT_ARASTIRMASI', ...]
  starred_docs: string[]
  skipped_docs: string[]
  sablon_tercihleri?: Record<string, any>
  notlar?: string
  tekrar_no: number
  status: 'devam_ediyor' | 'tamamlandi' | 'iptal'
  is_deleted: number

  ekap_no?: string
  is_ekap_sent: number
  kayit_kaynagi: 'yeni' | 'eski_sistem' | 'içe_aktarim'
  aktarim_grubu_id?: string
  kaynak_kayit_id?: string
  is_locked: number
  lock_reason?: string
  created_at?: string
  updated_at?: string
}

/**
 * Kullanıcının gönderdiği orijinal DATA_TeminDosyasi Şema Tanımı
 */
export const DATA_TeminDosyasi = {
  name: 'DATA_TeminDosyasi',
  description: 'Doğrudan temin dosyalarının ana kayıtları',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true, description: 'Kayıt Numarası' },
    { name: 'temin_no', type: 'TEXT', description: 'Kurum İçi Dosya Numarası' },
    { name: 'dosya_acilis_tarihi', type: 'DATE', description: 'Dosya Açılış Tarihi' },
    { name: 'butce_yili', type: 'INTEGER', description: 'Butce Yili' },
    { name: 'butce_tipi', type: 'TEXT', description: 'Butce Tipi' },
    { name: 'konu', type: 'TEXT', notNull: true, description: 'İşin Adı / Temin Konusu' },
    { name: 'isin_aciklamasi', type: 'TEXT', description: 'İşin Detaylı Açıklaması' },
    { name: 'birim_id', type: 'INTEGER', description: 'Birim ID' },
    { name: 'birim', type: 'TEXT', description: 'Birim Adı' },
    { name: 'antet_ek_satir', type: 'TEXT', description: 'Antet Ek Satir' },
    { name: 'sunulacak_makam', type: 'TEXT', description: 'Sunulacak Makam' },
    { name: 'ihtiyac_yeri', type: 'TEXT', description: 'Ihtiyac Yeri' },
    { name: 'e_butce', type: 'TEXT', description: 'E Butce' },
    { name: 'say2000i', type: 'TEXT', description: 'Say2000i' },
    { name: 'fonksiyonel_kod', type: 'TEXT', description: 'Fonksiyonel Kod' },
    { name: 'muhasebe_birimi', type: 'TEXT', description: 'Muhasebe Birimi' },
    { name: 'harcama_birimi', type: 'TEXT', description: 'Harcama Birimi' },
    { name: 'finansman_kodu', type: 'TEXT', description: 'Finansman Kodu' },
    { name: 'ekonomik_kod', type: 'TEXT', description: 'Ekonomik Kod' },
    { name: 'ihale_tipi', type: 'TEXT', default: "'Doğrudan Temin'", description: 'Ihale Tipi' },
    { name: 'tur', type: 'TEXT', notNull: true, default: "'mal'", description: 'Tur' },
    { name: 'ihale_sekli', type: 'TEXT', description: 'Ihale Sekli' },
    { name: 'teklif_sozlesme_turu', type: 'TEXT', description: 'Teklif Sozlesme Turu' },
    { name: 'alt_yuklenici_olacak_mi', type: 'INTEGER', default: 0, description: 'Alt Yuklenici Olacak mı?' },
    { name: 'kismi_teklif_verilecek_mi', type: 'INTEGER', default: 0, description: 'Kismi Teklif Verilecek mı?' },
    { name: 'yatirim_proje_no', type: 'TEXT', description: 'Yatirim Proje Numarası' },
    { name: 'project_id', type: 'INTEGER', description: 'Bağlı Olduğu Proje ID' },
    { name: 'proje_adi', type: 'TEXT', description: 'Bağlı Olduğu Proje Adı' },
    { name: 'tags', type: 'TEXT', default: "'[]'", description: 'Etiketler (JSON Array)' },
    { name: 'avans_verilecek_mi', type: 'INTEGER', default: 0, description: 'Avans Verilecek mı?' },
    { name: 'yillara_yaygin', type: 'INTEGER', default: 0, description: 'Yıllara Yaygın Hizmet Alımı mı?' },
    { name: 'sozlesme_yapilacak_mi', type: 'INTEGER', default: 0, description: 'Sözleşme Yapılacak mı?' },
    { name: 'komisyon_seed_edildi', type: 'INTEGER', description: 'Komisyon varsayılan aktarım durumu' },
    { name: 'isin_aciklama_maddeleri', type: 'TEXT', description: 'İşin Açıklama Maddeleri (JSON Array)' },
    { name: 'yaklasik_maliyet_hesaplamasi', type: 'TEXT', description: 'Yaklasik Maliyet Hesaplamasi' },
    { name: 'yaklasik_maliyet_kdv_dahil_mi', type: 'INTEGER', default: 0, description: 'Yaklasik Maliyet KDV Dahil mi?' },
    { name: 'kdv', type: 'TEXT', description: 'Kdv' },
    { name: 'hesaplama_esasi', type: 'TEXT', description: 'Hesaplama Esasi' },
    { name: 'komisyon_takdiri', type: 'TEXT', description: 'Komisyon Takdiri' },
    { name: 'tibbi_cihaz_alimi_mi', type: 'INTEGER', default: 0, description: 'Tibbi Cihaz Alimi mı?' },
    { name: 'irtibat_yetkilisi_id', type: 'INTEGER', description: 'Irtibat Yetkilisi ID' },
    { name: 'son_teklif_verme_tarihi', type: 'DATETIME', description: 'Son Teklif Verme Tarihi' },
    { name: 'teslim_tarihi', type: 'DATE', description: 'Teslim Tarihi' },
    { name: 'teslim_gun', type: 'INTEGER', default: 7, description: 'Teslim Süresi (Gün)' },
    { name: 'yaklasik_maliyet', type: 'REAL', default: 0, description: 'Yaklasik Maliyet' },
    { name: 'kesinti_damga', type: 'REAL', default: 0, description: 'Damga Vergisi Kesintisi' },
    { name: 'kesinti_karar_pulu', type: 'REAL', default: 0, description: 'Karar Pulu Kesintisi' },
    { name: 'kesinti_kdv_tevkifat', type: 'REAL', default: 0, description: 'KDV Tevkifat Kesintisi' },
    { name: 'net_odenen', type: 'REAL', default: 0, description: 'Net Ödenen Tutar' },
    { name: 'butce_kodu', type: 'TEXT', description: 'Butce Kodu' },
    { name: 'temin_tarihi', type: 'DATE', description: 'Temin Tarihi' },
    { name: 'firma_id', type: 'INTEGER', description: 'Firma ID' },
    { name: 'onay_personel_id', type: 'INTEGER', description: 'Onay Personel ID' },
    { name: 'hazirlayan_personel_id', type: 'INTEGER', description: 'Hazirlayan Personel ID' },
    { name: 'talep_eden_personel_id', type: 'INTEGER', description: 'Talep Eden Personel ID' },
    { name: 'sunan_personel_id', type: 'INTEGER', description: 'Sunan Personel ID' },
    { name: 'durum_asama_id', type: 'INTEGER', description: 'Durum Asama ID' },
    { name: 'mevzuat_id', type: 'INTEGER', description: 'Mevzuat ID' },
    { name: 'surec_taslak_id', type: 'INTEGER', description: 'Surec Taslak ID' },
    { name: 'ordered_docs', type: 'TEXT', description: 'Ordered Docs' },
    { name: 'starred_docs', type: 'TEXT', description: 'Starred Docs' },
    { name: 'skipped_docs', type: 'TEXT', description: 'Skipped Docs' },
    { name: 'sablon_tercihleri', type: 'TEXT', default: "'{}'", description: 'Dosyada seçilen şablon tercihleri ve parametreleri' },
    { name: 'notlar', type: 'TEXT', description: 'Notlar' },
    { name: 'tekrar_no', type: 'INTEGER', default: 1, description: 'Tekrar Numarası' },
    { name: 'status', type: 'TEXT', default: "'devam_ediyor'", description: 'Status' },
    { name: 'is_deleted', type: 'INTEGER', default: 0, description: 'Is Deleted' },
    { name: 'ekap_no', type: 'TEXT', description: 'Ekap Numarası' },
    { name: 'is_ekap_sent', type: 'INTEGER', default: 0, description: 'Is Ekap Sent' },
    { name: 'kayit_kaynagi', type: 'TEXT', default: "'yeni'", description: 'Kayıt Kaynağı' },
    { name: 'aktarim_grubu_id', type: 'TEXT', description: 'Toplu aktarım işleminin kimliği' },
    { name: 'kaynak_kayit_id', type: 'TEXT', description: 'Eski sistemdeki özgün kayıt ID' },
    { name: 'is_locked', type: 'INTEGER', default: 0, description: 'Dosya Kilitli mi?' },
    { name: 'lock_reason', type: 'TEXT', description: 'Kilitleme nedeni' },
    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP', description: 'Created At' },
    { name: 'updated_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP', description: 'Updated At' },
  ],
}

/**
 * Hazır ve Gerçekçi Örnek Doğrudan Temin Dosyaları
 */
export const ORNEK_TEMIN_DOSYALARI: TeminDosyasiKaydi[] = [
  {
    id: 1,
    temin_no: '2026/DT-001',
    dosya_acilis_tarihi: '2026-03-01',
    butce_yili: 2026,
    butce_tipi: 'Genel Bütçe',
    konu: 'Destek Hizmetleri ve Hizmet Binaları İçin 8 Kalem Orijinal Toner ve Sarf Malzemesi Alımı',
    isin_aciklamasi: 'Başkanlık merkez birimleri ve bağlı şube müdürlüklerinde kullanılmak üzere 8 kalem toner alımı işidir.',
    birim_id: 101,
    birim: 'Destek Hizmetleri Dairesi Başkanlığı - Satınalma Şube Müdürlüğü',
    antet_ek_satir: 'T.C. ANKARA BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI',
    sunulacak_makam: 'HARCAMA YETKİLİSİ MAKAMINA',
    ihtiyac_yeri: 'Merkez Lojistik Ambarı ve İdari Birimler',
    e_butce: '03.02.01.01',
    say2000i: 'SAY-2026-8412',
    fonksiyonel_kod: '01.3.1.00',
    muhasebe_birimi: 'Mali Hizmetler Dairesi Muhasebe Şube Müdürlüğü',
    harcama_birimi: 'Destek Hizmetleri Dairesi Başkanlığı',
    finansman_kodu: '05.1',
    ekonomik_kod: '03.2.1.01 (Kırtasiye ve Büro Malzemesi Alımları)',
    ihale_tipi: 'Doğrudan Temin',
    tur: 'mal',
    ihale_sekli: '4734 / 22-d',
    teklif_sozlesme_turu: 'Birim Fiyat',
    alt_yuklenici_olacak_mi: 0,
    kismi_teklif_verilecek_mi: 0,
    yatirim_proje_no: 'YAT-2026/04',
    project_id: 1,
    proje_adi: '2026 Yılı Kurumsal Bilişim ve Donanım Yenileme Projesi',
    tags: ['#Acil', '#Toner', '#DoğrudanTemin', '#2026'],
    avans_verilecek_mi: 0,
    yillara_yaygin: 0,
    sozlesme_yapilacak_mi: 1,
    komisyon_seed_edildi: 1,
    isin_aciklama_maddeleri: [
      'Tüm ürünler orijinal ve faturalı olacaktır.',
      'Teslimat idarenin merkez ambarına yapılacaktır.',
      'Kusurlu çıkan ürünler 48 saat içinde yenisiyle değiştirilecektir.',
    ],
    yaklasik_maliyet_hesaplamasi: 'Piyasa Fiyat Araştırması Aritmetik Ortalama Yöntemi',
    yaklasik_maliyet_kdv_dahil_mi: 0,
    kdv: '%20',
    hesaplama_esasi: '3 Firma Teklifi Aritmetik Ortalaması',
    komisyon_takdiri: 'En düşük avantajlı teklifi sunan Turuncu Ofis Bilişim Ltd. Şti. tercih edilmiştir.',
    tibbi_cihaz_alimi_mi: 0,
    irtibat_yetkilisi_id: 1,
    irtibat_yetkilisi_adi: 'Mehmet DÜNDAR (Büro Personeli - Dahili 4102)',
    son_teklif_verme_tarihi: '2026-03-20T17:00:00',
    teslim_tarihi: '2026-03-27',
    teslim_gun: 7,
    yaklasik_maliyet: 145000.0,
    kesinti_damga: 1374.6,
    kesinti_karar_pulu: 825.05,
    kesinti_kdv_tevkifat: 0.0,
    net_odenen: 142800.35,
    butce_kodu: '46.06.04.05 - 01.3.1.00 - 5 - 03.2.1.01',
    temin_tarihi: '2026-03-15',
    firma_id: 101,
    kazanan_firma_adi: 'Turuncu Ofis Bilişim Ltd. Şti.',
    onay_personel_id: 1,
    onay_personel_adi: 'Dr. Hakan YILMAZ (Daire Başkanı / Harcama Yetkilisi)',
    hazirlayan_personel_id: 2,
    hazirlayan_personel_adi: 'Mehmet DÜNDAR (Satınalma Büro Personeli)',
    talep_eden_personel_id: 3,
    talep_eden_personel_adi: 'Ayşe DEMİR (Yazı İşleri Şefi)',
    sunan_personel_id: 4,
    durum_asama_id: 3,
    mevzuat_id: 1,
    surec_taslak_id: 1,
    ordered_docs: [
      'DOC_ONAY_BELGESI',
      'DOC_PIYASA_FIYAT_ARASTIRMASI',
      'DOC_YAKLASIK_MALIYET',
      'DOC_TEKLIF_MEKTUBU',
      'DOC_RESMI_UST_YAZI',
      'DOC_SOZLESME_TASLAGI',
      'DOC_MUAYENE_KABUL',
      'DOC_DAMGA_VERGISI',
    ],
    starred_docs: ['DOC_ONAY_BELGESI', 'DOC_PIYASA_FIYAT_ARASTIRMASI'],
    skipped_docs: [],
    sablon_tercihleri: { antetFormati: 'tc_resmi', imzaAdedi: 3 },
    notlar: 'Toner stok seviyesi kritik eşiğe indiğinden ivedilikle sonuçlandırılmıştır.',
    tekrar_no: 1,
    status: 'devam_ediyor',
    is_deleted: 0,
    ekap_no: '2026/DT-EKAP-48192',
    is_ekap_sent: 1,
    kayit_kaynagi: 'yeni',
    aktarim_grubu_id: 'BATCH-2026-01',
    kaynak_kayit_id: '196633',
    is_locked: 0,
    lock_reason: '',
    created_at: '2026-03-01T09:00:00',
    updated_at: '2026-03-02T16:30:00',
    kalemler: [
      { id: 1, sira_no: 1, kalem_kodu: '2024-0010', kalem_adi: 'HP 658A Orijinal Siyah Toner (W2000A)', birim: 'Adet', miktar: 10, fiyat1: 3200, fiyat2: 3350, fiyat3: 3400, yaklasik_birim_fiyat: 3316.66, toplam_tutar: 33166.6, kdv_orani: 20 },
      { id: 2, sira_no: 2, kalem_kodu: '2024-0011', kalem_adi: 'HP 658A Orijinal Mavi Toner (W2001A)', birim: 'Adet', miktar: 8, fiyat1: 3800, fiyat2: 3950, fiyat3: 4100, yaklasik_birim_fiyat: 3950.0, toplam_tutar: 31600.0, kdv_orani: 20 },
      { id: 3, sira_no: 3, kalem_kodu: '2024-0012', kalem_adi: 'HP 658A Orijinal Sarı Toner (W2002A)', birim: 'Adet', miktar: 8, fiyat1: 3800, fiyat2: 3950, fiyat3: 4100, yaklasik_birim_fiyat: 3950.0, toplam_tutar: 31600.0, kdv_orani: 20 },
      { id: 4, sira_no: 4, kalem_kodu: '2024-0013', kalem_adi: 'HP 658A Orijinal Kırmızı Toner (W2003A)', birim: 'Adet', miktar: 8, fiyat1: 3800, fiyat2: 3950, fiyat3: 4100, yaklasik_birim_fiyat: 3950.0, toplam_tutar: 31600.0, kdv_orani: 20 },
      { id: 5, sira_no: 5, kalem_kodu: '2024-0020', kalem_adi: 'A4 80 gr 1. Hamur Fotokopi Kağıdı', birim: 'Koli', miktar: 20, fiyat1: 820, fiyat2: 860, fiyat3: 880, yaklasik_birim_fiyat: 853.34, toplam_tutar: 17066.8, kdv_orani: 20 },
    ],
    firmalar: [
      { id: 1, sira_no: 1, firma_adi: 'Turuncu Ofis Bilişim Ltd. Şti.', vergi_no: '8410291823', yetkili_adi: 'Kemal TURAN', telefon: '0312 444 0 123', eposta: 'info@turuncuofis.com.tr', toplam_teklif: 142800, kdv_durumu: 'Hariç', degerlendirme_sonucu: 'En Avantajlı Teklif (Uygun)', kazanan_mi: true },
      { id: 2, sira_no: 2, firma_adi: 'Ankara Kurumsal Kırtasiye A.Ş.', vergi_no: '1029384756', yetkili_adi: 'Selim AK', telefon: '0312 210 55 66', eposta: 'satis@ankarakurumsal.com', toplam_teklif: 148500, kdv_durumu: 'Hariç', degerlendirme_sonucu: 'İkinci Teklif', kazanan_mi: false },
      { id: 3, sira_no: 3, firma_adi: 'Başkent Bilişim Sistemleri San. Tic.', vergi_no: '9876543210', yetkili_adi: 'Erol CAN', telefon: '0312 312 90 80', eposta: 'teklif@baskentbilisim.net', toplam_teklif: 153200, kdv_durumu: 'Hariç', degerlendirme_sonucu: 'Üçüncü Teklif', kazanan_mi: false },
    ],
    komisyon_uyeleri: [
      { unvan: 'Daire Başkanı', gorev: 'Harcama Yetkilisi', ad_soyad: 'Dr. Hakan YILMAZ', rol: 'harcama_yetkilisi' },
      { unvan: 'Satınalma Şube Müdürü', gorev: 'Gerçekleştirme Görevlisi', ad_soyad: 'Mustafa YILMAZ', rol: 'gerceklestirme' },
      { unvan: 'Büro Personeli', gorev: 'Piyasa Araştırma Görevlisi', ad_soyad: 'Mehmet DÜNDAR', rol: 'piyasa_arastirma' },
      { unvan: 'Tekniker', gorev: 'Piyasa Araştırma Görevlisi', ad_soyad: 'Serkan DEMİR', rol: 'piyasa_arastirma' },
      { unvan: 'Ambar Sorumlusu', gorev: 'Muayene Kabul Başkanı', ad_soyad: 'Ali KAYA', rol: 'muayene_kabul' },
      { unvan: 'Yazı İşleri Şefi', gorev: 'Muayene Kabul Üyesi', ad_soyad: 'Ayşe DEMİR', rol: 'muayene_kabul' },
    ],
    rota_adimlari: [
      { sira: 1, tur: 'Paraf', adSoyad: 'Mehmet DÜNDAR', unvan: 'Satınalma Büro Personeli', durum: 'PARAF_EDILDI' },
      { sira: 2, tur: 'Paraf', adSoyad: 'Mustafa YILMAZ', unvan: 'Satınalma Şube Müdürü V.', durum: 'PARAF_EDILDI' },
      { sira: 3, tur: 'İmza', adSoyad: 'Dr. Hakan YILMAZ', unvan: 'Destek Hizmetleri Daire Başkanı / Harcama Yetkilisi', durum: 'BEKLIYOR' },
    ],
  },
  {
    id: 2,
    temin_no: '2026/DT-002',
    dosya_acilis_tarihi: '2026-03-03',
    butce_yili: 2026,
    butce_tipi: 'Genel Bütçe',
    konu: 'Merkez Kampüs Isıtma & Havalandırma (HVAC) Sistemleri Periyodik Bakım ve Onarım Hizmeti',
    isin_aciklamasi: 'Hizmet binalarının 2026 ilkbahar-yaz dönemi HVAC filtre ve kompresör bakımı.',
    birim_id: 102,
    birim: 'Fen İşleri Dairesi Başkanlığı - Makine İkmal Şube Müdürlüğü',
    antet_ek_satir: 'T.C. ANKARA BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI',
    sunulacak_makam: 'HARCAMA YETKİLİSİ MAKAMINA',
    ihtiyac_yeri: 'Merkez İdari Kampüs Binaları',
    e_butce: '03.05.01.02',
    say2000i: 'SAY-2026-8419',
    fonksiyonel_kod: '01.3.9.00',
    muhasebe_birimi: 'Mali Hizmetler Dairesi Muhasebe Şube Müdürlüğü',
    harcama_birimi: 'Fen İşleri Dairesi Başkanlığı',
    finansman_kodu: '05.1',
    ekonomik_kod: '03.5.1.02 (Bina Bakım Onarım Giderleri)',
    ihale_tipi: 'Doğrudan Temin',
    tur: 'hizmet',
    ihale_sekli: '4734 / 22-d',
    teklif_sozlesme_turu: 'Götürü Bedel',
    alt_yuklenici_olacak_mi: 0,
    kismi_teklif_verilecek_mi: 0,
    tags: ['#Bakım', '#HVAC', '#HizmetAlımı'],
    avans_verilecek_mi: 0,
    yillara_yaygin: 0,
    sozlesme_yapilacak_mi: 1,
    yaklasik_maliyet_hesaplamasi: 'Piyasa Fiyat Araştırması Yöntemi',
    yaklasik_maliyet_kdv_dahil_mi: 0,
    kdv: '%20',
    hesaplama_esasi: 'Firma Teklifleri',
    komisyon_takdiri: 'En uygun teklif tercih edildi.',
    tibbi_cihaz_alimi_mi: 0,
    tekrar_no: 1,
    yaklasik_maliyet: 185000.0,
    kesinti_damga: 1753.8,
    kesinti_karar_pulu: 1052.65,
    kesinti_kdv_tevkifat: 2220.0,
    net_odenen: 179973.55,
    teslim_gun: 15,
    firma_id: 104,
    kazanan_firma_adi: 'İklimsan Havalandırma ve Tesisat A.Ş.',
    onay_personel_adi: 'Ahmet ARI (Fen İşleri Daire Başkanı)',
    hazirlayan_personel_adi: 'Selim KAYA (Makine Mühendisi)',
    ordered_docs: ['DOC_ONAY_BELGESI', 'DOC_PIYASA_FIYAT_ARASTIRMASI', 'DOC_SOZLESME_TASLAGI'],
    starred_docs: ['DOC_ONAY_BELGESI'],
    skipped_docs: [],
    status: 'devam_ediyor',
    is_deleted: 0,
    is_ekap_sent: 0,
    kayit_kaynagi: 'yeni',
    is_locked: 0,
  },
]
