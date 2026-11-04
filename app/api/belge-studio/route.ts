import { NextRequest, NextResponse } from 'next/server';
import { getAllTeminDosyalari, getTeminDosyasiById } from '@/lib/db/temin-repository';
import { TEMPLATE_CATALOG, getTemplateById } from '@/lib/document-engine/v4/template-catalog';
import { SqliteDataSource } from '@/lib/document-engine/v4/data-sources';
import { SnapshotEngine } from '@/lib/document-engine/v4/snapshot-engine';
import {
  getSnapshotsForDocument,
  getLatestSnapshot,
  saveSnapshotRecord,
  getAuditLogs,
} from '@/lib/db/snapshot-repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get('docId');
    const templateId = searchParams.get('templateId');

    const dosyaListesi = getAllTeminDosyalari();
    const sablonListesi = TEMPLATE_CATALOG;
    const auditLogs = getAuditLogs(20);

    let activeSnapshot = null;
    let revisions: any[] = [];
    let templateDef = null;

    if (docId && templateId) {
      templateDef = getTemplateById(templateId);
      revisions = getSnapshotsForDocument(docId, templateId);

      const revParam = searchParams.get('rev');
      if (revParam) {
        activeSnapshot = revisions.find((r) => String(r.revision) === revParam) || null;
      } else {
        activeSnapshot = revisions[revisions.length - 1] || null;
      }

      // If no snapshot exists yet, generate initial revision automatically
      if (!activeSnapshot && templateDef) {
        const dataSource = new SqliteDataSource();
        const engine = new SnapshotEngine(dataSource);
        activeSnapshot = engine.build(
          templateDef,
          { globalId: 'G1', documentId: docId },
          undefined,
          {},
          [],
          'Otomatik Motor (V4)'
        );
        saveSnapshotRecord(activeSnapshot);
        revisions = [activeSnapshot];
      }
    }

    return NextResponse.json({
      success: true,
      dosyaListesi: dosyaListesi.map((d) => ({
        id: String(d.id),
        temin_no: d.temin_no,
        konu: d.konu,
        birim: d.birim,
        tarih: d.dosya_acilis_tarihi,
      })),
      sablonListesi: sablonListesi.map((s) => ({
        id: s.id,
        title: s.title,
        docNo: s.docNo,
        version: s.version,
        fieldsCount: s.fields.length,
      })),
      activeSnapshot,
      revisions,
      templateDef,
      auditLogs,
    });
  } catch (error: any) {
    console.error('API /api/belge-studio GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { docId, templateId, overrides = {}, clearOverrides = [], operator = 'Mevcut Kullanıcı' } = body;

    if (!docId || !templateId) {
      return NextResponse.json({ success: false, error: 'docId ve templateId gereklidir' }, { status: 400 });
    }

    const templateDef = getTemplateById(templateId);
    if (!templateDef) {
      return NextResponse.json({ success: false, error: 'Şablon bulunamadı' }, { status: 404 });
    }

    const dataSource = new SqliteDataSource();
    const engine = new SnapshotEngine(dataSource);
    const latest = getLatestSnapshot(docId, templateId);

    const newSnapshot = engine.build(
      templateDef,
      { globalId: 'G1', documentId: docId },
      latest || undefined,
      overrides,
      clearOverrides,
      operator
    );

    saveSnapshotRecord(newSnapshot);

    return NextResponse.json({
      success: true,
      snapshot: newSnapshot,
      message: `Revizyon #${newSnapshot.revision} başarıyla oluşturuldu ve mühürlendi.`,
    });
  } catch (error: any) {
    console.error('API /api/belge-studio POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

