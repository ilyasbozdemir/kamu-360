'use client'

import { useState } from 'react'
import { Building2, Calendar, FileText, Gavel, MoreVertical, Plus, Printer, ShieldCheck } from 'lucide-react'
import { ORNEK_GELIR_DOSYALARI, GelirIhaleDosyasi } from '@/lib/gelir-ihaleleri-data'
import { Badge, PrimaryButton, OutlineButton } from '@/components/procurement/primitives'

export function DosyaTanimiScreen() {
  const [selectedDosya, setSelectedDosya] = useState<GelirIhaleDosyasi>(ORNEK_GELIR_DOSYALARI[0])
  const [activeTab, setActiveTab] = useState('genel')

  return (
    <div className="grid gap-3 lg:grid-cols-[320px_1fr]">
      {/* Sol Panel: Dosya Seçimi ve Künye */}
      <div className="space-y-3">
        <div className="rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#edf0f4] pb-2.5 mb-3">
            <span className="text-[12px] font-bold text-[#172334]">Gelir İhalesi Dosyaları</span>
            <span className="rounded bg-[#f1f4f9] px-2 py-0.5 text-[10px] font-semibold text-[#526174]">
              {ORNEK_GELIR_DOSYALARI.length} Dosya
            </span>
          </div>

          <div className="space-y-2">
            {ORNEK_GELIR_DOSYALARI.map((d) => (
              <button
                key={d.dosyaNo}
                type="button"
                onClick={() => setSelectedDosya(d)}
                className={`w-full rounded-lg border p-2.5 text-left transition ${
                  selectedDosya.dosyaNo === d.dosyaNo
                    ? 'border-[#2d62d7] bg-[#f5f8ff] shadow-xs'
                    : 'border-[#edf0f4] bg-white hover:bg-[#fafbfc]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#1e293b]">{d.dosyaNo}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                      d.durum === 'Sözleşme İmzalandı'
                        ? 'bg-emerald-100 text-emerald-800'
                        : d.durum === 'Teklif / Pey Aşamasında'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {d.durum}
                  </span>
                </div>
                <div className="mt-1 line-clamp-1 text-[11px] font-medium text-[#334155]">{d.ihaleAdi}</div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-[#64748b]">
                  <span>{d.tur}</span>
                  <strong className="text-[#0c67dc]">{d.muhammenBedel.toLocaleString('tr-TR')} TL</strong>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dosya İhale Özeti */}
        <div className="rounded-lg border border-[#e1e5ea] bg-white p-4 shadow-xs text-[11px] space-y-2.5">
          <div className="border-b border-[#edf0f4] pb-2 font-bold text-[#172334]">
            Seçili İhale Dosya Özeti
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">İhale Usulü:</span>
            <span className="font-semibold text-[#1e293b]">{selectedDosya.usul}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">Muhammen Bedel:</span>
            <span className="font-bold text-[#2d62d7]">{selectedDosya.muhammenBedel.toLocaleString('tr-TR')} TL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">Geçici Teminat (%{selectedDosya.geciciTeminatOrani}):</span>
            <span className="font-semibold text-[#1e293b]">{selectedDosya.geciciTeminatTutari.toLocaleString('tr-TR')} TL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">İhale Tarihi & Saati:</span>
            <span className="font-semibold text-[#1e293b]">{selectedDosya.ihaleTarihi} - {selectedDosya.ihaleSaati}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">Varlık Kodu:</span>
            <span className="font-mono text-[#1e293b]">{selectedDosya.varlikKodu}</span>
          </div>
        </div>
      </div>

      {/* Sağ Panel: İhale Dosya Detayları & Şartname Düzenleyici */}
      <div className="min-w-0 rounded-lg border border-[#e1e5ea] bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-[#edf0f4] pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] font-bold text-[#2d62d7]">{selectedDosya.dosyaNo}</span>
              <span className="text-[14px] font-bold text-[#172334]">{selectedDosya.ihaleAdi}</span>
            </div>
            <p className="text-[11px] text-[#64748b] mt-0.5">
              2886 Sayılı Devlet İhale Kanunu ve Özel Sektör Gelir Getirici İhale Şartnamesi
            </p>
          </div>
          <div className="flex gap-2">
            <OutlineButton>
              <Printer className="mr-1 inline size-3" /> Şartnameyi Yazdır
            </OutlineButton>
            <PrimaryButton>
              <FileText className="mr-1 inline size-3" /> Değişiklikleri Kaydet
            </PrimaryButton>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="flex gap-2 border-b border-[#edf0f4] pb-2 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('genel')}
            className={`rounded px-3 py-1.5 font-medium transition ${
              activeTab === 'genel' ? 'bg-[#2d62d7] text-white' : 'text-[#64748b] hover:bg-[#f1f4f9]'
            }`}
          >
            1. Genel İhale Bilgileri
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sartname')}
            className={`rounded px-3 py-1.5 font-medium transition ${
              activeTab === 'sartname' ? 'bg-[#2d62d7] text-white' : 'text-[#64748b] hover:bg-[#f1f4f9]'
            }`}
          >
            2. İdari ve Mali Şartname
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('varlik')}
            className={`rounded px-3 py-1.5 font-medium transition ${
              activeTab === 'varlik' ? 'bg-[#2d62d7] text-white' : 'text-[#64748b] hover:bg-[#f1f4f9]'
            }`}
          >
            3. Varlık & Lokasyon Detayı
          </button>
        </div>

        {/* Form Alanları */}
        {activeTab === 'genel' && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-[11px]">
            <div>
              <label className="mb-1 block font-medium text-[#475569]">İhale Dosya Numarası</label>
              <input
                type="text"
                disabled
                value={selectedDosya.dosyaNo}
                className="w-full rounded border border-[#d1d5db] bg-[#f8f9fb] px-3 py-1.5 text-[12px] font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#475569]">İhale Türü</label>
              <select
                value={selectedDosya.tur}
                onChange={() => {}}
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-[12px]"
              >
                <option value="Taşınmaz Kiralama">Taşınmaz Kiralama</option>
                <option value="Varlık & Gayrimenkul Satışı">Varlık & Gayrimenkul Satışı</option>
                <option value="Hurda & Atıl Varlık Satışı">Hurda & Atıl Varlık Satışı</option>
                <option value="İşletme Hakkı Devri">İşletme Hakkı Devri</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block font-medium text-[#475569]">İhale Tanımı & Başlığı</label>
              <input
                type="text"
                value={selectedDosya.ihaleAdi}
                onChange={() => {}}
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-[12px]"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-[#475569]">İhale Usulü (2886 / Kurumsal)</label>
              <select
                value={selectedDosya.usul}
                onChange={() => {}}
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-[12px]"
              >
                <option value="Açık Artırma Usulü">Açık Artırma Usulü (Açık Teklif)</option>
                <option value="Kapalı Teklif Usulü">Kapalı Teklif Usulü (Kapalı Zarf)</option>
                <option value="Pazarlık Usulü">Pazarlık Usulü</option>
                <option value="Belli İstekliler">Belli İstekliler Arasında</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#475569]">İhale Lokasyonu / Toplantı Salonu</label>
              <input
                type="text"
                value={selectedDosya.lokasyon}
                onChange={() => {}}
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-[12px]"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-[#475569]">İhale Tarihi</label>
              <input
                type="text"
                value={selectedDosya.ihaleTarihi}
                onChange={() => {}}
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-[12px]"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#475569]">İhale Saati</label>
              <input
                type="text"
                value={selectedDosya.ihaleSaati}
                onChange={() => {}}
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-[12px]"
              />
            </div>
          </div>
        )}

        {activeTab === 'sartname' && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-[11px]">
            <div>
              <label className="mb-1 block font-medium text-[#475569]">Muhammen Bedel (Asgari Başlangıç Değeri)</label>
              <div className="relative">
                <input
                  type="number"
                  value={selectedDosya.muhammenBedel}
                  onChange={() => {}}
                  className="w-full rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-[12px] font-bold text-[#2d62d7]"
                />
                <span className="absolute right-3 top-1.5 text-[11px] text-[#64748b]">TL</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#475569]">Geçici Teminat Oranı (%)</label>
              <input
                type="number"
                value={selectedDosya.geciciTeminatOrani}
                onChange={() => {}}
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-[12px]"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-[#475569]">Geçici Teminat Tutarı (TL)</label>
              <input
                type="number"
                disabled
                value={selectedDosya.geciciTeminatTutari}
                className="w-full rounded border border-[#d1d5db] bg-[#f8f9fb] px-3 py-1.5 text-[12px] font-semibold text-[#16a34a]"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-[#475569]">Kesin Teminat Oranı (%)</label>
              <input
                type="number"
                defaultValue={6}
                className="w-full rounded border border-[#d1d5db] bg-white px-3 py-1.5 text-[12px]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block font-medium text-[#475569]">Özel Şartlar & Yeterlilik Kriterleri</label>
              <textarea
                rows={3}
                defaultValue="İsteklilerin son 3 yıllık bilanço asılları veya onaylı suretleri, ticaret sicil gazetesi, imza sirküleri ve geçici teminat mektubunu ihale saatinden en az 1 saat önce komisyon başkanlığına teslim etmeleri gerekmektedir."
                className="w-full rounded border border-[#d1d5db] p-3 text-[12px] leading-relaxed"
              />
            </div>
          </div>
        )}

        {activeTab === 'varlik' && (
          <div className="mt-4 space-y-3 text-[11px]">
            <div className="rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1e293b]">İhaleye Konu Varlık Tanımı</span>
                <span className="font-mono text-[#2d62d7] font-semibold">{selectedDosya.varlikKodu}</span>
              </div>
              <p className="mt-1 text-[12px] text-[#334155]">{selectedDosya.varlikTanimi}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-[#edf0f4] p-3">
                <span className="text-[#64748b]">Fiziki Durum / Ekspertiz:</span>
                <div className="mt-1 font-semibold text-[#1e293b]">Ekspertiz Raporu Mevcut (2024 Güncel)</div>
              </div>
              <div className="rounded border border-[#edf0f4] p-3">
                <span className="text-[#64748b]">Teslim / Tahsis Şekli:</span>
                <div className="mt-1 font-semibold text-[#1e293b]">Sözleşme İmzası ve Bedel Yatırma Sonrası 5 İş Günü</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
