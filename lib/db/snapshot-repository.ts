import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import type { SnapshotEnvelope, AuditLogEntry } from '@/lib/document-engine/v4/types';

const dbPath = path.resolve('data', 'temin360.sqlite');

function getDb(): DatabaseSync {
  const db = new DatabaseSync(dbPath);
  initTables(db);
  return db;
}

function initTables(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS document_snapshots (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      template_id TEXT NOT NULL,
      revision INTEGER NOT NULL,
      payload TEXT NOT NULL,
      content_hash TEXT,
      operator TEXT,
      created_at TEXT NOT NULL,
      UNIQUE(document_id, template_id, revision)
    );

    CREATE TABLE IF NOT EXISTS document_audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      document_id TEXT NOT NULL,
      template_id TEXT NOT NULL,
      revision INTEGER NOT NULL,
      details TEXT,
      operator TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

export function saveSnapshotRecord(snapshot: SnapshotEnvelope): void {
  try {
    const db = getDb();
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO document_snapshots 
      (id, document_id, template_id, revision, payload, content_hash, operator, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      snapshot.id,
      snapshot.documentId,
      snapshot.templateId,
      snapshot.revision,
      JSON.stringify(snapshot),
      snapshot.contentHash || null,
      snapshot.operator || 'Sistem',
      snapshot.createdAt
    );

    logAuditAction({
      id: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      action: snapshot.revision === 1 ? 'SNAPSHOT_CREATED' : 'SNAPSHOT_REVISED',
      documentId: snapshot.documentId,
      templateId: snapshot.templateId,
      revision: snapshot.revision,
      details: `Revizyon #${snapshot.revision} mühürlendi. ${Object.keys(snapshot.overrides || {}).length} adet override alanı mevcut. Hash: ${snapshot.contentHash}`,
      operator: snapshot.operator || 'Sistem',
      createdAt: snapshot.createdAt,
    });
  } catch (err) {
    console.error('saveSnapshotRecord error:', err);
    throw err;
  }
}

export function getSnapshotsForDocument(documentId: string, templateId?: string): SnapshotEnvelope[] {
  try {
    const db = getDb();
    let query = `SELECT payload FROM document_snapshots WHERE document_id = ?`;
    const params: (string | number)[] = [documentId];

    if (templateId) {
      query += ` AND template_id = ?`;
      params.push(templateId);
    }

    query += ` ORDER BY revision ASC`;

    const rows = db.prepare(query).all(...params) as { payload: string }[];
    return rows.map((r) => JSON.parse(r.payload));
  } catch (err) {
    console.error('getSnapshotsForDocument error:', err);
    return [];
  }
}

export function getLatestSnapshot(documentId: string, templateId: string): SnapshotEnvelope | null {
  try {
    const db = getDb();
    const row = db
      .prepare(`SELECT payload FROM document_snapshots WHERE document_id = ? AND template_id = ? ORDER BY revision DESC LIMIT 1`)
      .get(documentId, templateId) as { payload: string } | undefined;

    return row ? JSON.parse(row.payload) : null;
  } catch (err) {
    console.error('getLatestSnapshot error:', err);
    return null;
  }
}

export function logAuditAction(entry: AuditLogEntry): void {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO document_audit_logs 
      (id, action, document_id, template_id, revision, details, operator, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      entry.id,
      entry.action,
      entry.documentId,
      entry.templateId,
      entry.revision,
      entry.details,
      entry.operator || 'Sistem',
      entry.createdAt
    );
  } catch (err) {
    console.error('logAuditAction error:', err);
  }
}

export function getAuditLogs(limit: number = 50): AuditLogEntry[] {
  try {
    const db = getDb();
    const rows = db.prepare(`SELECT * FROM document_audit_logs ORDER BY created_at DESC LIMIT ?`).all(limit) as any[];
    return rows.map((r) => ({
      id: r.id,
      action: r.action,
      documentId: r.document_id,
      templateId: r.template_id,
      revision: r.revision,
      details: r.details,
      operator: r.operator,
      createdAt: r.created_at,
    }));
  } catch (err) {
    console.error('getAuditLogs error:', err);
    return [];
  }
}

