# KAMU 360 — Kamu İhale, Satın Alma & Gelir Yönetim Platformu

<div align="center">

![KAMU 360 Logo](/public/icon.svg)

[![Sürüm](https://img.shields.io/badge/S%C3%BCr%C3%BCm-v1.0.0--beta--01-blue.svg?style=for-the-badge)](https://github.com/ilyasbozdemir/kamu-360)
[![Lisans](https://img.shields.io/badge/Lisans-GNU_GPLv3-blue.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**4734 Sayılı Kamu İhale Kanunu ve 2886 Sayılı Devlet İhale Kanunu Uyumlu Uçtan Uca İhale, Satın Alma, Doğrudan Temin ve EBYS Belge Yönetim Platformu**

[Özellikler](#-temel-modüller) • [Kurulum](#-hızlı-kurulum) • [Mevzuat Uyumu](#-hukuki-ve-mevzuat-uyumluluğu) • [Sürüm Notları](#-sürüm-notları-v100-beta-01)

</div>

---

## 🏛️ Proje Hakkında

**KAMU 360 (v1.0.0-beta-01)**; belediyeler, il özel idareleri, üniversiteler, bakanlıklar ve tüm kamu idarelerinin harcama, satın alma ve gelir süreçlerini tek bir çatı altında toplayan yeni nesil entegre kamu yönetim platformudur.

Sistem, geleneksel parçalı yapıların aksine; **Gider (4734 KİK & 22/d)**, **Gelir (2886 DİK)** ve **EBYS (Evrak Belge Yönetim Sistemi)** süreçlerini akıllı iş akışları ve 30 resmî matbu evrak motoru ile birbirine bağlar.

---

## 🚀 Temel Modüller

### 1. Satın Alma ve Doğrudan Temin Yönetimi (4734 Sayılı KİK) — [Gider]
* **Doğrudan Temin Dosya Listesi ve Karar Masası (`/temin-dosyasi`)**: 
  * 4734 Sayılı Kanun Madde 22/d ve 22/a kapsamında doğrudan temin dosyalarının açılması.
  * 7 sekmeli entegre dosya istasyonu: *İdari Karar, Malzeme Kalemleri, Firma Teklifleri & Matris, Yaklaşık Maliyet Cetveli, Görevli Personel, EBYS Onay Rotası ve 30 Matbu Evrak.*
  * Yerel `SQLite` veritabanı desteği ve JSON durum yedekleme.
* **Piyasa Fiyat Araştırma Tutanağı (`/dogrudan-temin`)**: Teklif veren firmaların birim fiyatlarının derlenmesi, en avantajlı teklifin otomatik tespiti ve piyasa araştırma görevlileri tutanağı.
* **Malzeme Satın Alma Talebi (`/malzeme-bilgisi`)**: Birim malzeme ihtiyaçlarının tanımlanması, bütçe kodları ve tedarik toleransları.
* **Teklif Değerlendirme & Matris (`/teklif-degerlendirme`)**: Firma tekliflerinin kıyaslanması ve yaklaşık maliyete göre analiz.
* **İhale Dosyası ve Şartname (`/ihale-dosyasi`)**: Açık İhale (Madde 19) ve Pazarlık Usulü (Madde 21) parametreleri, teknik/idari şartname hazırlığı.
* **Kesin Satın Alma Sözleşmesi (`/sozlesme`)**: %6 kesin teminat hesaplama, noter tescili ve sözleşme hükümleri.

### 2. Gelir İhaleleri ve Mülkiyet Yönetimi (2886 Sayılı DİK) — [Gelir]
* **Dosya Tanımı & Muhammen Bedel (`/gelir-ihaleleri/dosya-tanimi`)**: Belediye ve kamu taşınmazlarının satış, kiralama ve irtifak hakkı ihaleleri; %3 geçici teminatın otomatik hesaplanması.
* **Canlı Açık Artırma Masası (`/gelir-ihaleleri/ihale-usulu-acik-artirma`)**: 2886 Sayılı Kanun Madde 45 (Açık Teklif) uyarınca pey artırımlarının ve istekli tekliflerinin anlık kaydı.
* **Komisyon İhale Kararı (`/gelir-ihaleleri/komisyon-karari`)**: İhale komisyon üyelerinin karar tutanağı ve ita amiri (Belediye Başkanı) onay süreci.
* **Sözleşme & Tahsilat Planı (`/gelir-ihaleleri/sozlesme-tahsilat`)**: Taksitli veya peşin ödeme planı ve gecikme faizi hesaplama.
* **Taşınmaz ve Varlık Envanteri (`/gelir-ihaleleri/varlik-envanteri`)**: İdarenin tüm arsa, dükkan, bina ve kiralık tesislerinin ada/parsel kayıtları.

### 3. CBS, Arazi ve Su Altyapı Yönetimi Modülü (`/harita-altyapi`) — [Altyapı]
* **Canlı CBS Harita Katmanı**: Vektörel kadastro, uydu/ortofoto ve içme suyu boru hatları (GIS) katmanları.
* **Arazi ve Parsel Mülkiyet Takibi**: Ada/parsel sorgusu (TKGM / MEGSİS standardı), hisse durumları ve kamulaştırma kararları.
* **Su Şebekesi & İsale Hatları**: Ana isale hatları (Ø800/Ø500), SCADA telemetri, basınç zonları (Bar) ve arıza uyarıları.
* **Sayaç & Abone Yönetimi**: Abone sicil kayıtları, akıllı sayaç tüketim endeksleri (m³) ve kayıp-kaçak analizleri.

### 4. İnsan Kaynakları & Personel Yönetimi (İK 360) (`/personel-takibi`) — [İK]
* **657 Memur & 4857 İşçi Özlük Dosyaları**: Sicil kartları, unvanlar, harcama yetkilisi ve gerçekleştirme görevlisi tanımları.
* **Puantaj ve İzin Masası**: Fiilî mesai, turnike kayıtları, yıllık ve mazeret izni takipleri.
* **6245 Sayılı Harcırah ve Geçici Görev**: Yevmiye, konaklama, yol giderleri hesaplaması ve resmî Harcırah Beyannamesi çıktısı.
* **Kademe, Derece & Disiplin**: Yıllık kıdem terfileri ve hizmet puanı değerlendirmeleri.

### 5. BKMYBS & Mali Yönetim Portalı (5018 Sayılı Kanun) (`/bkmybs-mali-yonetim`) — [Maliye]
* **Analitik Bütçe Sınıflandırması**: Kurumsal, fonksiyonel, finansal ve ekonomik kod tertipleri (03.2, 03.5, 06.5 vb.), bloke ve kalan ödenek kontrolü.
* **MİF & Ödeme Emri Belgesi (ÖEB)**: Muhasebat Genel Müdürlüğü formatında resmî MİF dökümü ve harcama talimatları.
* **TKYS Taşınır Mal Yönetmeliği**: Taşınır İşlem Fişi (TİF), Dayanıklı Taşınırlar Defteri ve personel zimmet senetleri.
* **Emanetler & Teminat Mektubu Masası**: 4734 ve 2886 geçici/kesin teminat mektupları takibi ve iade onayları.

### 6. EBYS Belge Stüdyosu & Resmî Yazı Motoru (`/belge-builder`)
* **30 Resmî Matbu Evrak Şablonu**:
  * İhale Onay Belgesi (A4)
  * Harcama Talimatı
  * Piyasa Fiyat Araştırması Tutanağı
  * Yaklaşık Maliyet Hesap Cetveli
  * Teklif İsteme Mektubu & Teklif Formu
  * İhale Komisyon Kararı Tutanağı
  * Satın Alma Sözleşmesi Tasarısı
  * Muayene ve Kabul Komisyon Tutanağı
  * Taşınır İşlem Fişi (TİF)
  * Resmî Üst Yazı (Cumhurbaşkanlığı 2020/8 Genelgesi Uyumlu)
* **Karekodlu Doğrulama & e-İmza Blokları**: 5070 Sayılı Elektronik İmza Kanunu'na uygun imza kaşeleri ve SHA-256 doğrulama kodları.
* **Canlı Baskı Önizleme (Wysiwyg A4)**: Tarayıcı içinde birebir resmî yazışma marjları (25mm üst/alt, 20mm yanlar).

### 4. Rota ve İş Akışları (EBYS Paraf Sıralaması) (`/is-akislari`)
* Dinamik hiyerarşik onay basamakları: *Hazırlayan -> Gerçekleştirme Görevlisi -> Şube Müdürü -> Daire Başkanı -> Harcama Yetkilisi*.
* SMS/E-Posta bildirim kancaları, vekâlet bırakma ve rota geçmişi.

### 5. Yazdırma & Dışa Aktarma Merkezi (`/yazdirma-merkezi`)
* Çoklu belge yazdırma kuyruğu (Batch Print Hub).
* Excel / CSV dışa aktarımı (Türkçe karakterler için UTF-8 BOM desteği).
* Kurumsal antet, logo ve bütçe yılı antet şablon yöneticisi.

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Modern hibrit SSR & Client React Mimarisi |
| **Dil** | [TypeScript 5.7](https://www.typescriptlang.org/) | Tip güvenli kurumsal kodlama |
| **Arayüz & Stil** | [Tailwind CSS v4](https://tailwindcss.com/) | Yüksek performanslı CSS altyapısı |
| **Bileşenler** | [Radix / Shadcn / Base UI](https://ui.shadcn.com/) | Erişilebilir kamu arayüz bileşenleri |
| **İkon Seti** | [Lucide React](https://lucide.dev/) | Tutarlı modern vektörel semboller |
| **Veritabanı** | [SQLite Native](https://nodejs.org/api/sqlite.html) | Sıfır kurulumlu hafif ilişkisel veritabanı |
| **Doğrulama** | [Zod v4](https://zod.dev/) | İhale ve dosya form doğrulama şemaları |

---

## 💻 Hızlı Kurulum

### Gereksinimler
* Node.js `20.x` veya daha güncel LTS sürümü
* `pnpm` (Önerilen) veya `npm`

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/ilyasbozdemir/kamu-360.git
cd kamu-360
```

2. **Bağımlılıkları yükleyin:**
```bash
pnpm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
pnpm dev
```
Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

4. **Üretim (Production) derlemesi:**
```bash
pnpm build
pnpm start
```

---

## 📋 Hukuki ve Mevzuat Uyumluluğu

* **4734 Sayılı Kamu İhale Kanunu**: Madde 19 (Açık İhale), Madde 21 (Pazarlık) ve Madde 22 (Doğrudan Temin).
* **4735 Sayılı Kamu İhale Sözleşmeleri Kanunu**: Kesin teminat, fesih ve sözleşme devir hükümleri.
* **2886 Sayılı Devlet İhale Kanunu**: Taşınmaz satış, kiralama, trampa ve mülkiyetin gayri ayni hak tesisi.
* **5018 Sayılı Kamu Malî Yönetimi ve Kontrol Kanunu**: Harcama yetkilisi, gerçekleştirme görevlisi ve analitik bütçe kodları.
* **Resmî Yazışmalarda Uygulanacak Usul ve Esaslar Hakkında Yönetmelik** (Resmî Gazete Sayı: 31151).

---

## 📦 Sürüm Notları: `v1.0.0-beta-01`

* **Kurumsal Yeniden Markalama**: Platform "KAMU 360" çatı markası altında birleştirildi.
* **Özgün Vektör Logo**: Kurumsal gece mavisi, satın alma kraliyet mavisi ve gelir turkuazı kalkan amblemi entegre edildi.
* **Satın Alma Hiyerarşisi**: Doğrudan Temin (22/d Masası) ve 4734 İhale süreçleri ayrıştırıldı; her sürecin kendi bağımsız dosya listesi bağlandı.
* **Çift Aktif Seçim Çözümü**: Yan menüde birden fazla sekmenin aynı anda seçili kalma hatası düzeltildi.
* **30 Matbu Şablon Motoru**: A4 çıktılar için evrensel yazdırma modalı ve Print Hub kuyruğu tamamlandı.
* **SQLite Veri Depolama**: Yerel dosya tabanlı SQLite kalıcı kayıt katmanı eklendi.

---

## 📄 Lisans

Bu proje [GNU General Public License v3.0 (GPL-3.0)](LICENSE) kapsamında açık kaynak (copyleft) olarak lisanslanmıştır. Kamu kurumları, belediyeler ve tüm geliştiriciler tarafından özgürce kullanılabilir, incelenebilir ve GPLv3 şartlarına uygun olarak paylaşılabilir.

