import type { FieldSpec } from '@/components/procurement/primitives'

export const moduleTabs: Record<string, string[]> = {
  'Satış Yönetimi': ['Satış Fırsatı', 'Müşteri', 'Teklif Kalemleri', 'Fiyatlandırma', 'Belgeler', 'Onay Akışı'],
  'Kiralama Yönetimi': ['Kiralama Talebi', 'Varlık Bilgileri', 'Kiracı', 'Dönem ve Bedel', 'Belgeler', 'Tahsilat Planı'],
  'CBS, Arazi & Su Altyapı': ['Harita Masası', 'Arazi & Parsel', 'Su Şebekesi', 'Sayaç ve Abone', 'Kamulaştırma'],
  'Personel & İK 360': ['Özlük Kartı', 'Puantaj & Vardiya', 'İzin Masası', 'Harcırah (6245)', 'Terfi & Kademe'],
  'BKMYBS & Mali Yönetim': ['Analitik Bütçe', 'Ödenek Kontrolü', 'MİF & Ödeme Emri', 'TKYS Taşınır Mal', 'Emanetler'],
  'Genel Yönetim': ['Görevler', 'Kullanıcılar', 'Birimler', 'Belge Şablonları', 'Rota ve Dağıtım', 'Sistem Parametreleri'],
  'Raporlar ve Analitik': ['Satın Alma Özeti', 'Teklif Karşılaştırma', 'Bütçe Gerçekleşme', 'KPI Panosu'],
  'İş Akışları': ['Akış Tasarımcısı', 'Onay Kuralları', 'Bildirimler', 'Görev Kuyruğu'],
  'Sistem Ayarları': ['Belge Türleri', 'Ek Alanlar', 'Numara Serileri', 'Yetki Rolleri'],
}

const t = (label: string, extra: Partial<FieldSpec> = {}): FieldSpec => ({ label, ...extra })

export const tabFields: Record<string, FieldSpec[]> = {
  'Satış Fırsatı': [t('Fırsat Başlığı', { required: true }), t('Müşteri', { kind: 'search', required: true }), t('Satış Sorumlusu', { kind: 'select', options: ['Ayşe Demir', 'Mehmet Kaya'] }), t('Tahmini Tutar', { kind: 'number' }), t('Kapanış Tarihi', { kind: 'date' }), t('Kaynak', { kind: 'select', options: ['Web', 'Referans', 'Fuar'] })],
  Müşteri: [t('Müşteri Adı', { required: true }), t('Vergi No'), t('Yetkili'), t('Telefon'), t('E-Mail Adresi'), t('Adres', { span: 2 })],
  'Teklif Kalemleri': [t('Ürün Kodu', { kind: 'search' }), t('Ürün Adı'), t('Miktar', { kind: 'number' }), t('Birim', { kind: 'select', options: ['Adet', 'Kutu'] }), t('Birim Fiyat', { kind: 'number' }), t('İskonto', { kind: 'percent' })],
  Fiyatlandırma: [t('Fiyat Listesi', { kind: 'select', options: ['Standart', 'Kurumsal'] }), t('Para Birimi', { kind: 'select', options: ['TRY', 'USD', 'EUR'] }), t('KDV Oranı', { kind: 'select', options: ['%10', '%20'] }), t('Genel İskonto', { kind: 'percent' })],
  'Kiralama Talebi': [t('Talep Başlığı', { required: true }), t('Kiracı', { kind: 'search', required: true }), t('Varlık Grubu', { kind: 'select', options: ['Araç', 'Ekipman', 'Gayrimenkul'] }), t('Kiralama Başlangıcı', { kind: 'date' }), t('Kiralama Bitişi', { kind: 'date' }), t('Tahsilat Yöntemi', { kind: 'select', options: ['Aylık', 'Peşin'] })],
  'Varlık Bilgileri': [t('Varlık Kodu', { kind: 'search' }), t('Varlık Adı'), t('Seri No'), t('Lokasyon', { kind: 'search' })],
  Kiracı: [t('Kiracı Adı', { required: true }), t('Vergi No'), t('Yetkili'), t('Telefon')],
  'Dönem ve Bedel': [t('Dönem', { kind: 'unit', unitOptions: ['Ay', 'Yıl'] }), t('Aylık Bedel', { kind: 'number' }), t('Depozito', { kind: 'number' }), t('Artış Oranı', { kind: 'percent' })],
  Görevler: [t('Görev Başlığı', { required: true }), t('Atanan Kullanıcı', { kind: 'search' }), t('Öncelik', { kind: 'select', options: ['Düşük', 'Orta', 'Yüksek'] }), t('Son Tarih', { kind: 'date' }), t('Durum', { kind: 'select', options: ['Açık', 'Devam Ediyor', 'Tamamlandı'] }), t('İlgili Belge', { kind: 'search' })],
  Kullanıcılar: [t('Ad Soyad', { required: true }), t('Kullanıcı Adı', { required: true }), t('Rol', { kind: 'select', options: ['Lojistik Yönetici', 'Satın Alma Uzmanı'] }), t('Birim'), t('E-Mail Adresi'), t('Aktif', { kind: 'check', checked: true })],
  Birimler: [t('Birim Adı', { required: true }), t('Üst Birim', { kind: 'search' }), t('Yönetici', { kind: 'search' }), t('Maliyet Merkezi')],
  'Belge Şablonları': [t('Şablon Adı', { required: true }), t('Belge Türü', { kind: 'select', options: ['Sözleşme', 'Teklif', 'Sipariş'] }), t('Antetli Çıktı', { kind: 'toggle' }), t('İmza Alanı', { kind: 'toggle' }), t('Varsayılan Rota', { kind: 'select', options: ['Lojistik / Satın Alma'] }), t('Aktif', { kind: 'check', checked: true })],
  'Rota ve Dağıtım': [t('Rota Adı', { required: true }), t('Belge Türleri', { kind: 'select', options: ['Sözleşme', 'Teklif'] }), t('Birinci Alıcı', { kind: 'search' }), t('İkinci Alıcı', { kind: 'search' }), t('Bilgi Alıcıları'), t('Dağıtım Kanalı', { kind: 'select', options: ['E-posta', 'Uygulama içi'] })],
  'Sistem Parametreleri': [t('Parametre Adı'), t('Değer'), t('Açıklama', { span: 2 })],
  'Satın Alma Özeti': [t('Başlangıç Tarihi', { kind: 'date' }), t('Bitiş Tarihi', { kind: 'date' }), t('Satın Alma Grubu', { kind: 'select', options: ['001 - Yurtiçi Satınalma Grubu'] }), t('İş Ortağı', { kind: 'search' })],
  'Teklif Karşılaştırma': [t('Teklif Değerlendirme No', { kind: 'search' }), t('Malzeme', { kind: 'search' }), t('Karşılaştırma Ölçütü', { kind: 'select', options: ['Birim Fiyat', 'Toplam Fiyat'] })],
  'Bütçe Gerçekleşme': [t('Dönem', { kind: 'select', options: ['2024 Q3', '2024 Q4'] }), t('Maliyet Merkezi', { kind: 'search' }), t('Bütçe', { kind: 'number' }), t('Gerçekleşen', { kind: 'number' })],
  'KPI Panosu': [t('KPI Seti', { kind: 'select', options: ['Satın Alma', 'Tedarikçi'] }), t('Dönem', { kind: 'select', options: ['Aylık', 'Çeyreklik'] }), t('Hedef', { kind: 'number' })],
  'Akış Tasarımcısı': [t('Akış Adı', { required: true }), t('Başlangıç Koşulu'), t('Adım Türü', { kind: 'select', options: ['Onay', 'Bilgi', 'Görev'] }), t('Onaycı Rolü', { kind: 'select', options: ['Lojistik Yönetici'] }), t('SLA Süresi', { kind: 'unit', unitOptions: ['Saat', 'Gün'] }), t('Aktif', { kind: 'check', checked: true })],
  'Onay Kuralları': [t('Kural Adı', { required: true }), t('Tutar Sınırı', { kind: 'number' }), t('Onaycı', { kind: 'search' }), t('Sıra', { kind: 'number' })],
  Bildirimler: [t('Bildirim Türü', { kind: 'select', options: ['E-posta', 'Uygulama içi'] }), t('Şablon', { kind: 'search' }), t('Tetikleyici'), t('Aktif', { kind: 'check', checked: true })],
  'Görev Kuyruğu': [t('Kuyruk Adı'), t('Öncelik', { kind: 'select', options: ['Düşük', 'Orta', 'Yüksek'] }), t('Sorumlu Grup', { kind: 'search' })],
  'Belge Türleri': [t('Belge Adı', { required: true }), t('Kategori', { kind: 'select', options: ['Satın Alma', 'Satış', 'Kiralama'] }), t('Şablon', { kind: 'search' }), t('Antet Tercihi', { kind: 'select', options: ['Antetli', 'Antetsiz'] }), t('Numara Serisi', { kind: 'search' }), t('Versiyonlama', { kind: 'toggle' })],
  'Ek Alanlar': [t('Alan Adı', { required: true }), t('Veri Tipi', { kind: 'select', options: ['Metin', 'Sayı', 'Tarih', 'Liste'] }), t('Zorunlu', { kind: 'check' }), t('Belge Türü', { kind: 'select', options: ['Sözleşme', 'Teklif'] })],
  'Numara Serileri': [t('Seri Adı', { required: true }), t('Ön Ek'), t('Başlangıç No', { kind: 'number' }), t('Yıllık Sıfırla', { kind: 'toggle' })],
  'Yetki Rolleri': [t('Rol Adı', { required: true }), t('Açıklama', { span: 2 }), t('Aktif', { kind: 'check', checked: true })],
}

export const fallbackFields: FieldSpec[] = [
  t('Belge Başlığı', { required: true }),
  t('İşletme', { kind: 'search' }),
  t('Lokasyon', { kind: 'search' }),
  t('Sorumlu Kullanıcı', { kind: 'search' }),
]

export const genericLeft: FieldSpec[] = [
  t('İşletme', {
    kind: 'select',
    required: true,
    value: 'AKM - Akme Teknoloji Çözümleri A.Ş.',
    options: [
      'AKM - Akme Teknoloji Çözümleri A.Ş.',
      'ABB - Ankara Büyükşehir Belediyesi',
      'İMAR - İmar ve İnşaat A.Ş.',
      'BELTAŞ - Ankara Beltaş A.Ş.',
      'ASKİ - Su ve Kanalizasyon İdaresi',
    ],
  }),
  t('Lokasyon', {
    kind: 'select',
    required: true,
    value: 'AKM-ANK - Akme Ankara ODTÜ Teknokent',
    options: [
      'AKM-ANK - Akme Ankara ODTÜ Teknokent',
      'MERKEZ - Ankara Merkez Lojistik Deposu',
      'YENİMAHALLE - Fen İşleri Şantiyesi',
      'ÇANKAYA - İdari Binalar Yerleşkesi',
    ],
  }),
  t('Sorumlu Kullanıcı', {
    kind: 'select',
    value: '01 - Abdulkadir İlci (Satınalma Uzmanı)',
    options: [
      '01 - Abdulkadir İlci (Satınalma Uzmanı)',
      '02 - Selin Yılmaz (İhale Yetkilisi)',
      '03 - Mehmet Can (Lojistik Yöneticisi)',
      '04 - Fatma Arslan (Gerçekleştirme Görevlisi)',
    ],
  }),
  t('Aktif', { kind: 'check', checked: true }),
]

