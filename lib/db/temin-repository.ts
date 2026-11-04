import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { TeminDosyasiKaydi } from '@/lib/temin-dosyasi/schema'

const dbPath = path.resolve('data', 'temin360.sqlite')

function getDb() {
  return new DatabaseSync(dbPath)
}

export function getAllTeminDosyalari(): TeminDosyasiKaydi[] {
  try {
    const db = getDb()
    const rows = db.prepare('SELECT * FROM DATA_TeminDosyasi ORDER BY id ASC').all() as any[]
    return rows.map((r) => {
      const kalemler = db.prepare('SELECT * FROM DATA_TeminKalemleri WHERE dosya_id = ? ORDER BY sira_no ASC').all(r.id) as any[]
      const firmalar = db.prepare('SELECT * FROM DATA_FirmaTeklifleri WHERE dosya_id = ? ORDER BY sira_no ASC').all(r.id) as any[]
      return {
        ...r,
        kalemler: kalemler.length > 0 ? kalemler : undefined,
        firmalar: firmalar.length > 0 ? firmalar : undefined,
        tags: typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : r.tags || [],
        isin_aciklama_maddeleri:
          typeof r.isin_aciklama_maddeleri === 'string'
            ? JSON.parse(r.isin_aciklama_maddeleri || '[]')
            : r.isin_aciklama_maddeleri || [],
        ordered_docs:
          typeof r.ordered_docs === 'string'
            ? JSON.parse(r.ordered_docs || '[]')
            : r.ordered_docs || [],
        starred_docs:
          typeof r.starred_docs === 'string'
            ? JSON.parse(r.starred_docs || '[]')
            : r.starred_docs || [],
        skipped_docs:
          typeof r.skipped_docs === 'string'
            ? JSON.parse(r.skipped_docs || '[]')
            : r.skipped_docs || [],
        sablon_tercihleri:
          typeof r.sablon_tercihleri === 'string'
            ? JSON.parse(r.sablon_tercihleri || '{}')
            : r.sablon_tercihleri || {},
      }
    })
  } catch (error) {
    console.error('SQLite getAllTeminDosyalari error:', error)
    return []
  }
}

export function getTeminDosyasiById(id: number): TeminDosyasiKaydi | null {
  try {
    const db = getDb()
    const r = db.prepare('SELECT * FROM DATA_TeminDosyasi WHERE id = ?').get(id) as any
    if (!r) return null
    return {
      ...r,
      tags: typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : [],
      ordered_docs: typeof r.ordered_docs === 'string' ? JSON.parse(r.ordered_docs || '[]') : [],
      starred_docs: typeof r.starred_docs === 'string' ? JSON.parse(r.starred_docs || '[]') : [],
      skipped_docs: typeof r.skipped_docs === 'string' ? JSON.parse(r.skipped_docs || '[]') : [],
    }
  } catch (error) {
    console.error('SQLite getTeminDosyasiById error:', error)
    return null
  }
}

export function getKalemlerByDosyaId(dosyaId: number) {
  try {
    const db = getDb()
    return db.prepare('SELECT * FROM DATA_TeminKalemleri WHERE dosya_id = ? ORDER BY sira_no ASC').all(dosyaId)
  } catch (error) {
    console.error('SQLite getKalemlerByDosyaId error:', error)
    return []
  }
}

export function getTekliflerByDosyaId(dosyaId: number) {
  try {
    const db = getDb()
    return db.prepare('SELECT * FROM DATA_FirmaTeklifleri WHERE dosya_id = ? ORDER BY sira_no ASC').all(dosyaId)
  } catch (error) {
    console.error('SQLite getTekliflerByDosyaId error:', error)
    return []
  }
}

export function createTeminDosyasi(newDosya: Partial<TeminDosyasiKaydi>): number | null {
  try {
    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO DATA_TeminDosyasi (
        temin_no, dosya_acilis_tarihi, butce_yili, butce_tipi, konu, birim,
        ihale_tipi, tur, ihale_sekli, yaklasik_maliyet, kesinti_damga,
        kesinti_karar_pulu, net_odenen, status, is_locked
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const res = stmt.run(
      newDosya.temin_no || '2026/DT-003',
      newDosya.dosya_acilis_tarihi || new Date().toISOString().split('T')[0],
      newDosya.butce_yili || 2026,
      newDosya.butce_tipi || 'Genel Bütçe',
      newDosya.konu || 'Yeni Doğrudan Temin Dosyası',
      newDosya.birim || 'Destek Hizmetleri Dairesi Başkanlığı',
      newDosya.ihale_tipi || 'Doğrudan Temin',
      newDosya.tur || 'mal',
      newDosya.ihale_sekli || '22/d',
      newDosya.yaklasik_maliyet || 50000,
      newDosya.kesinti_damga || 474,
      newDosya.kesinti_karar_pulu || 284.5,
      newDosya.net_odenen || 49241.5,
      newDosya.status || 'devam_ediyor',
      0
    )
    return Number(res.lastInsertRowid)
  } catch (error) {
    console.error('SQLite createTeminDosyasi error:', error)
    return null
  }
}

export function updateTeminDosyasi(id: number, updates: Partial<TeminDosyasiKaydi>) {
  try {
    const db = getDb()

    // 1. Kalemler güncelleniyorsa DATA_TeminKalemleri tablosuna yaz
    if (updates.kalemler && Array.isArray(updates.kalemler)) {
      try {
        db.prepare('DELETE FROM DATA_TeminKalemleri WHERE dosya_id = ?').run(id)
        const insertKalem = db.prepare(`
          INSERT INTO DATA_TeminKalemleri (dosya_id, sira_no, kalem_kodu, kalem_adi, birim, miktar, yaklasik_birim_fiyat, toplam_tutar, kdv_orani)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        updates.kalemler.forEach((k, idx) => {
          insertKalem.run(
            id,
            k.sira_no || idx + 1,
            k.kalem_kodu || `KALEM-${idx + 1}`,
            k.kalem_adi,
            k.birim,
            k.miktar,
            k.yaklasik_birim_fiyat || 0,
            k.toplam_tutar || (k.miktar * (k.yaklasik_birim_fiyat || 0)),
            k.kdv_orani || 20
          )
        })
      } catch (err) {
        console.warn('Kalemler sync uyarısı:', err)
      }
    }

    // 2. Firmalar güncelleniyorsa DATA_FirmaTeklifleri tablosuna yaz
    if (updates.firmalar && Array.isArray(updates.firmalar)) {
      try {
        db.prepare('DELETE FROM DATA_FirmaTeklifleri WHERE dosya_id = ?').run(id)
        const insertFirma = db.prepare(`
          INSERT INTO DATA_FirmaTeklifleri (dosya_id, sira_no, firma_adi, vergi_no, yetkili_adi, telefon, eposta, toplam_teklif, kdv_durumu, degerlendirme_sonucu)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        updates.firmalar.forEach((f, idx) => {
          insertFirma.run(
            id,
            f.sira_no || idx + 1,
            f.firma_adi,
            f.vergi_no || null,
            f.yetkili_adi || null,
            f.telefon || null,
            f.eposta || null,
            f.toplam_teklif || 0,
            f.kdv_durumu || 'Hariç',
            f.degerlendirme_sonucu || (idx === 0 ? 'En Avantajlı Teklif (Uygun)' : `${idx + 1}. Teklif`)
          )
        })
      } catch (err) {
        console.warn('Firmalar sync uyarısı:', err)
      }
    }

    // 3. Ana dosya tablosu (DATA_TeminDosyasi) güncellemesi
    const fields: string[] = []
    const values: any[] = []

    for (const [key, val] of Object.entries(updates)) {
      if (['id', 'created_at', 'kalemler', 'firmalar', 'komisyon_uyeleri', 'rota_adimlari'].includes(key)) continue
      fields.push(`${key} = ?`)
      if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
        values.push(JSON.stringify(val))
      } else {
        values.push(val)
      }
    }

    if (fields.length > 0) {
      fields.push("updated_at = CURRENT_TIMESTAMP")
      const query = `UPDATE DATA_TeminDosyasi SET ${fields.join(', ')} WHERE id = ?`
      values.push(id)
      db.prepare(query).run(...values)
    }

    return true
  } catch (error) {
    console.error('SQLite updateTeminDosyasi error:', error)
    return false
  }
}

