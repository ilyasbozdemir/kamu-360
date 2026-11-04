import React from "react";
import { ResmiUstYaziData } from "./definition";

export function ResmiUstYaziTemplate(
  { data }: { data: ResmiUstYaziData },
): React.JSX.Element {
  const imzaAdimlari = data.rota.filter((r) =>
    r.tur === "İmza" || r.tur === "Onay"
  );
  const parafAdimlari = data.rota.filter((r) =>
    r.tur === "Paraf" || r.tur === "Hazırlayan"
  );

  const hasGizlilik = data.gizlilikDerecesi &&
    data.gizlilikDerecesi !== "NORMAL";
  const hasIvedilik = data.ivedilikDerecesi &&
    data.ivedilikDerecesi !== "NORMAL";

  return (
    <div className="mx-auto flex min-h-[297mm] w-[210mm] flex-col justify-between box-border border border-gray-300 bg-white p-[25mm] font-serif text-[12pt] leading-normal text-black shadow-lg print:m-0 print:border-none print:p-0 print:shadow-none">
      {/* 1. ÜST BÖLÜM: GİZLİLİK/İVEDİLİK + ANTET (BAŞLIK) */}
      <header className="space-y-4">
        {/* Güvenlik & Gizlilik & İvedilik Derecesi (Sağ Üstte Yönetmelik Standardı) */}
        {(hasGizlilik || hasIvedilik) && (
          <div className="flex items-center justify-between text-[10pt] font-bold tracking-wider text-red-700">
            <div>{hasGizlilik && <span>[ {data.gizlilikDerecesi} ]</span>}</div>
            <div>{hasIvedilik && <span>[ {data.ivedilikDerecesi} ]</span>}</div>
          </div>
        )}

        {/* Kurum Anteti (Ortalı, Büyük Harf, Hiyerarşik) */}
        <div className="text-center leading-tight">
          <p className="font-bold text-[12pt]">{data.tcIbaresi || "T.C."}</p>
          <p className="font-bold text-[12pt] uppercase tracking-wide">
            {data.kurumAdi || "ANKARA BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI"}
          </p>
          <p className="font-semibold text-[11pt] mt-0.5">
            {data.birimAdi || "Destek Hizmetleri Dairesi Başkanlığı"}
          </p>
          {data.altBirimAdi && (
            <p className="text-[10pt] text-gray-800 mt-0.5">
              {data.altBirimAdi}
            </p>
          )}
        </div>

        {/* Sayı, Konu ve Tarih Alanı */}
        <div className="flex justify-between items-start pt-5 text-[11pt]">
          <div className="space-y-1">
            <p>
              <span className="font-bold">Sayı :</span> {data.sayi}
            </p>
            <p>
              <span className="font-bold">Konu :</span> {data.konu}
            </p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-bold">Tarih:</span> {data.tarih}
            </p>
          </div>
        </div>
      </header>

      {/* 2. ORTA BÖLÜM: MUHATAP, İLGİ VE METİN */}
      <main className="my-6 flex-1 space-y-5">
        {/* Muhatap (Ortalı ve Tamamı Büyük Harf) */}
        <div className="my-6 text-center">
          <p className="font-bold text-[12pt] tracking-wide uppercase">
            {data.muhatap}
          </p>
          {data.muhatapYer && (
            <p className="font-bold text-[11pt] uppercase text-gray-800">
              {data.muhatapYer}
            </p>
          )}
        </div>

        {/* İlgi (Varsa) */}
        {data.ilgi && (
          <div className="text-[10.5pt] leading-snug">
            <span className="font-bold">İlgi :</span>{" "}
            <span className="text-gray-900">{data.ilgi}</span>
          </div>
        )}

        {/* Belge Gövde Metni (İki yana yaslı, 1.25 cm paragraf girintili, 1.15 satır aralığı) */}
        <div className="text-justify indent-[1.25cm] whitespace-pre-line text-[11.5pt] leading-relaxed">
          {data.metin}
        </div>
      </main>

      {/* 3. İMZA BLOKLARI (Sağa Yaslı, Yönetmelik Standardı) */}
      <section className="my-6 flex justify-end">
        <div className="min-w-[240px] text-center space-y-6">
          {imzaAdimlari.map((imza) => (
            <div key={imza.sira} className="space-y-1">
              {/* e-İmza Kaşesi */}
              <div className="flex h-10 items-center justify-center">
                {imza.durum === "ONAYLANDI"
                  ? (
                    <div className="rounded border border-blue-600 bg-blue-50/70 px-3 py-1 font-mono text-[8.5pt] text-blue-800">
                      <p className="font-bold">[e-İmzalıdır]</p>
                      <p className="text-[7pt] text-blue-600">
                        5070 Sayılı Kanuna Göre
                      </p>
                    </div>
                  )
                  : (
                    <span className="text-[9pt] italic text-gray-400">
                      (İmza)
                    </span>
                  )}
              </div>

              {/* İmzalayan Ad Soyad (Adı küçük, SOYADI BÜYÜK) */}
              <p className="font-bold text-[11.5pt] text-black">
                {imza.adSoyad}
              </p>
              {/* Unvan */}
              <p className="text-[10pt] text-gray-800 leading-tight">
                {imza.unvan}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EKLER VE DAĞITIM (İmza Altında Sol Tarafta) */}
      <section className="mb-4 text-[9.5pt]">
        <div className="grid grid-cols-2 gap-6">
          {/* Ekler */}
          <div>
            {data.ekler?.length > 0 && (
              <div>
                <span className="font-bold text-gray-900">EK :</span>
                <ul className="mt-1 space-y-0.5 pl-4 text-gray-800">
                  {data.ekler.map((ek, i) => (
                    <li key={i} className="list-decimal">
                      {ek}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Dağıtım */}
          <div>
            {data.dagitim?.length > 0 && (
              <div>
                <span className="font-bold text-gray-900">DAĞITIM :</span>
                <div className="mt-1 space-y-1 text-gray-800 pl-2">
                  {data.dagitim.map((d, i) => <p key={i}>{d}</p>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. RESMÎ YAZIŞMA YÖNETMELİĞİ ALT BİLGİ & DOĞRULAMA ÇİZGİSİ */}
      <footer className="mt-auto space-y-1 pt-3 text-[8pt] text-gray-700">
        {/* Güvenli Elektronik İmza Beyanı */}
        <div className="border-t border-gray-300 pt-1 text-[7.5pt] italic text-gray-600 flex justify-between items-center">
          <span>
            * Bu belge, 5070 sayılı Elektronik İmza Kanununun 5. maddesi
            gereğince güvenli elektronik imza ile imzalanmıştır.
          </span>
          {hasGizlilik && (
            <span className="font-bold text-red-700">
              [ {data.gizlilikDerecesi} ]
            </span>
          )}
        </div>

        {/* İki Çizgi Arası İletişim & EBYS Doğrulama Karekodu */}
        <div className="border-y border-gray-400 py-1.5 flex justify-between items-center gap-4">
          {/* Sol: Resmî İletişim Bilgileri */}
          <div className="space-y-0.5 leading-tight flex-1">
            <p>
              <span className="font-semibold">Adres:</span>{" "}
              {data.iletisim?.adres ||
                "Emniyet Mah. Hipodrom Cad. No:5 Yenimahalle / ANKARA"}
            </p>
            <p>
              <span className="font-semibold">Ayrıntılı Bilgi İçin:</span>{" "}
              {data.iletisim?.bilgiIcin || "Mehmet DÜNDAR"}{" "}
              ({data.iletisim?.unvan || "Büro Personeli"}) |{" "}
              <span className="font-semibold">Tel:</span>{" "}
              {data.iletisim?.telefon || "(0312) 507 10 00"} |{" "}
              <span className="font-semibold">Faks:</span>{" "}
              {data.iletisim?.faks || "(0312) 507 10 05"}
            </p>
            <p>
              <span className="font-semibold">E-Posta:</span>{" "}
              {data.iletisim?.eposta || "satin-alma@belediye.bel.tr"} |{" "}
              <span className="font-semibold">Elektronik Ağ:</span>{" "}
              {data.iletisim?.web || "www.belediye.bel.tr"} |{" "}
              <span className="font-semibold">KEP:</span>{" "}
              {data.iletisim?.kep || "belediye@hs01.kep.tr"}
            </p>
          </div>

          {/* Sağ: Karekod ve Doğrulama Kodu */}
          <div className="flex items-center gap-2 border-l border-gray-300 pl-3 shrink-0">
            {/* Vektörel Karekod Görseli */}
            <div className="size-11 border border-gray-800 p-0.5 bg-white flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="size-full text-black"
                fill="currentColor"
              >
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h2v2h-2v-2zm-4 0h2v4h-2v-4zm4 4h2v4h-2v-4zm-4 2h2v2h-2v-2zm6-4h2v2h-2v-2zm0 4h2v2h-2v-2zm-2-2h2v2h-2v-2z" />
              </svg>
            </div>
            <div className="text-[7pt] leading-tight font-mono">
              <p className="font-bold text-gray-900">
                Doğrulama Kodu:{" "}
                {data.ebysDogrulama?.dogrulamaKodu || "8A4B-39C2-D81E-4421"}
              </p>
              <p className="text-gray-600">
                {data.ebysDogrulama?.dogrulamaUrl ||
                  "https://ebys.belediye.bel.tr/dogrulama"}
              </p>
              <p className="text-gray-500">
                Evrak No: {data.ebysDogrulama?.evrakId || "EVR-2026-094182"}
              </p>
            </div>
          </div>
        </div>

        {/* 6. İDAREDE KALAN SURET İÇİN PARAF BLOĞU (Yönetmelik Madde 12) */}
        <div className="pt-0.5 text-[7pt] text-gray-600 flex flex-wrap items-center gap-3">
          <span className="font-bold text-gray-800">Paraf Akışı:</span>
          {parafAdimlari.map((p) => (
            <span key={p.sira}>
              {data.tarih} {p.unvan}: {p.adSoyad}{" "}
              ({p.durum === "ONAYLANDI" ? "e-Paraflı ✓" : "Bekliyor"})
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
